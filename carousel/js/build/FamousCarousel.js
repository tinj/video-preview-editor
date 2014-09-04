(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var RenderNode = require('./RenderNode');
var EventHandler = require('./EventHandler');
var ElementAllocator = require('./ElementAllocator');
var Transform = require('./Transform');
var Transitionable = require('famous/transitions/Transitionable');
var _originZeroZero = [
        0,
        0
    ];
function _getElementSize(element) {
    return [
        element.clientWidth,
        element.clientHeight
    ];
}
function Context(container) {
    this.container = container;
    this._allocator = new ElementAllocator(container);
    this._node = new RenderNode();
    this._eventOutput = new EventHandler();
    this._size = _getElementSize(this.container);
    this._perspectiveState = new Transitionable(0);
    this._perspective = undefined;
    this._nodeContext = {
        allocator: this._allocator,
        transform: Transform.identity,
        opacity: 1,
        origin: _originZeroZero,
        align: null,
        size: this._size
    };
    this._eventOutput.on('resize', function () {
        this.setSize(_getElementSize(this.container));
    }.bind(this));
}
Context.prototype.getAllocator = function getAllocator() {
    return this._allocator;
};
Context.prototype.add = function add(obj) {
    return this._node.add(obj);
};
Context.prototype.migrate = function migrate(container) {
    if (container === this.container)
        return;
    this.container = container;
    this._allocator.migrate(container);
};
Context.prototype.getSize = function getSize() {
    return this._size;
};
Context.prototype.setSize = function setSize(size) {
    if (!size)
        size = _getElementSize(this.container);
    this._size[0] = size[0];
    this._size[1] = size[1];
};
Context.prototype.update = function update(contextParameters) {
    if (contextParameters) {
        if (contextParameters.transform)
            this._nodeContext.transform = contextParameters.transform;
        if (contextParameters.opacity)
            this._nodeContext.opacity = contextParameters.opacity;
        if (contextParameters.origin)
            this._nodeContext.origin = contextParameters.origin;
        if (contextParameters.align)
            this._nodeContext.align = contextParameters.align;
        if (contextParameters.size)
            this._nodeContext.size = contextParameters.size;
    }
    var perspective = this._perspectiveState.get();
    if (perspective !== this._perspective) {
        this.container.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
        this.container.style.webkitPerspective = perspective ? perspective.toFixed() : '';
        this._perspective = perspective;
    }
    this._node.commit(this._nodeContext);
};
Context.prototype.getPerspective = function getPerspective() {
    return this._perspectiveState.get();
};
Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
    return this._perspectiveState.set(perspective, transition, callback);
};
Context.prototype.emit = function emit(type, event) {
    return this._eventOutput.emit(type, event);
};
Context.prototype.on = function on(type, handler) {
    return this._eventOutput.on(type, handler);
};
Context.prototype.removeListener = function removeListener(type, handler) {
    return this._eventOutput.removeListener(type, handler);
};
Context.prototype.pipe = function pipe(target) {
    return this._eventOutput.pipe(target);
};
Context.prototype.unpipe = function unpipe(target) {
    return this._eventOutput.unpipe(target);
};
module.exports = Context;
},{"./ElementAllocator":2,"./EventHandler":7,"./RenderNode":10,"./Transform":13,"famous/transitions/Transitionable":37}],2:[function(require,module,exports){
function ElementAllocator(container) {
    if (!container)
        container = document.createDocumentFragment();
    this.container = container;
    this.detachedNodes = {};
    this.nodeCount = 0;
}
ElementAllocator.prototype.migrate = function migrate(container) {
    var oldContainer = this.container;
    if (container === oldContainer)
        return;
    if (oldContainer instanceof DocumentFragment) {
        container.appendChild(oldContainer);
    } else {
        while (oldContainer.hasChildNodes()) {
            container.appendChild(oldContainer.removeChild(oldContainer.firstChild));
        }
    }
    this.container = container;
};
ElementAllocator.prototype.allocate = function allocate(type) {
    type = type.toLowerCase();
    if (!(type in this.detachedNodes))
        this.detachedNodes[type] = [];
    var nodeStore = this.detachedNodes[type];
    var result;
    if (nodeStore.length > 0) {
        result = nodeStore.pop();
    } else {
        result = document.createElement(type);
        this.container.appendChild(result);
    }
    this.nodeCount++;
    return result;
};
ElementAllocator.prototype.deallocate = function deallocate(element) {
    var nodeType = element.nodeName.toLowerCase();
    var nodeStore = this.detachedNodes[nodeType];
    nodeStore.push(element);
    this.nodeCount--;
};
ElementAllocator.prototype.getNodeCount = function getNodeCount() {
    return this.nodeCount;
};
module.exports = ElementAllocator;
},{}],3:[function(require,module,exports){
var Entity = require('./Entity');
var EventHandler = require('./EventHandler');
var Transform = require('./Transform');
var usePrefix = document.body.style.webkitTransform !== undefined;
var devicePixelRatio = window.devicePixelRatio || 1;
function ElementOutput(element) {
    this._matrix = null;
    this._opacity = 1;
    this._origin = null;
    this._size = null;
    this._eventOutput = new EventHandler();
    this._eventOutput.bindThis(this);
    this.eventForwarder = function eventForwarder(event) {
        this._eventOutput.emit(event.type, event);
    }.bind(this);
    this.id = Entity.register(this);
    this._element = null;
    this._sizeDirty = false;
    this._originDirty = false;
    this._transformDirty = false;
    this._invisible = false;
    if (element)
        this.attach(element);
}
ElementOutput.prototype.on = function on(type, fn) {
    if (this._element)
        this._element.addEventListener(type, this.eventForwarder);
    this._eventOutput.on(type, fn);
};
ElementOutput.prototype.removeListener = function removeListener(type, fn) {
    this._eventOutput.removeListener(type, fn);
};
ElementOutput.prototype.emit = function emit(type, event) {
    if (event && !event.origin)
        event.origin = this;
    var handled = this._eventOutput.emit(type, event);
    if (handled && event && event.stopPropagation)
        event.stopPropagation();
    return handled;
};
ElementOutput.prototype.pipe = function pipe(target) {
    return this._eventOutput.pipe(target);
};
ElementOutput.prototype.unpipe = function unpipe(target) {
    return this._eventOutput.unpipe(target);
};
ElementOutput.prototype.render = function render() {
    return this.id;
};
function _addEventListeners(target) {
    for (var i in this._eventOutput.listeners) {
        target.addEventListener(i, this.eventForwarder);
    }
}
function _removeEventListeners(target) {
    for (var i in this._eventOutput.listeners) {
        target.removeEventListener(i, this.eventForwarder);
    }
}
function _formatCSSTransform(m) {
    m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
    m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;
    var result = 'matrix3d(';
    for (var i = 0; i < 15; i++) {
        result += m[i] < 0.000001 && m[i] > -0.000001 ? '0,' : m[i] + ',';
    }
    result += m[15] + ')';
    return result;
}
var _setMatrix;
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    _setMatrix = function (element, matrix) {
        element.style.zIndex = matrix[14] * 1000000 | 0;
        element.style.transform = _formatCSSTransform(matrix);
    };
} else if (usePrefix) {
    _setMatrix = function (element, matrix) {
        element.style.webkitTransform = _formatCSSTransform(matrix);
    };
} else {
    _setMatrix = function (element, matrix) {
        element.style.transform = _formatCSSTransform(matrix);
    };
}
function _formatCSSOrigin(origin) {
    return 100 * origin[0] + '% ' + 100 * origin[1] + '%';
}
var _setOrigin = usePrefix ? function (element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function (element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };
var _setInvisible = usePrefix ? function (element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    } : function (element) {
        element.style.transform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    };
function _xyNotEquals(a, b) {
    return a && b ? a[0] !== b[0] || a[1] !== b[1] : a !== b;
}
ElementOutput.prototype.commit = function commit(context) {
    var target = this._element;
    if (!target)
        return;
    var matrix = context.transform;
    var opacity = context.opacity;
    var origin = context.origin;
    var size = context.size;
    if (!matrix && this._matrix) {
        this._matrix = null;
        this._opacity = 0;
        _setInvisible(target);
        return;
    }
    if (_xyNotEquals(this._origin, origin))
        this._originDirty = true;
    if (Transform.notEquals(this._matrix, matrix))
        this._transformDirty = true;
    if (this._invisible) {
        this._invisible = false;
        this._element.style.display = '';
    }
    if (this._opacity !== opacity) {
        this._opacity = opacity;
        target.style.opacity = opacity >= 1 ? '0.999999' : opacity;
    }
    if (this._transformDirty || this._originDirty || this._sizeDirty) {
        if (this._sizeDirty) {
            if (!this._size)
                this._size = [
                    0,
                    0
                ];
            this._size[0] = size[0];
            this._size[1] = size[1];
            this._sizeDirty = false;
        }
        if (this._originDirty) {
            if (origin) {
                if (!this._origin)
                    this._origin = [
                        0,
                        0
                    ];
                this._origin[0] = origin[0];
                this._origin[1] = origin[1];
            } else
                this._origin = null;
            _setOrigin(target, this._origin);
            this._originDirty = false;
        }
        if (!matrix)
            matrix = Transform.identity;
        this._matrix = matrix;
        var aaMatrix = this._size ? Transform.thenMove(matrix, [
                -this._size[0] * origin[0],
                -this._size[1] * origin[1],
                0
            ]) : matrix;
        _setMatrix(target, aaMatrix);
        this._transformDirty = false;
    }
};
ElementOutput.prototype.cleanup = function cleanup() {
    if (this._element) {
        this._invisible = true;
        this._element.style.display = 'none';
    }
};
ElementOutput.prototype.attach = function attach(target) {
    this._element = target;
    _addEventListeners.call(this, target);
};
ElementOutput.prototype.detach = function detach() {
    var target = this._element;
    if (target) {
        _removeEventListeners.call(this, target);
        if (this._invisible) {
            this._invisible = false;
            this._element.style.display = '';
        }
    }
    this._element = null;
    return target;
};
module.exports = ElementOutput;
},{"./Entity":5,"./EventHandler":7,"./Transform":13}],4:[function(require,module,exports){
var Context = require('./Context');
var EventHandler = require('./EventHandler');
var OptionsManager = require('./OptionsManager');
var Engine = {};
var contexts = [];
var nextTickQueue = [];
var deferQueue = [];
var lastTime = Date.now();
var frameTime;
var frameTimeLimit;
var loopEnabled = true;
var eventForwarders = {};
var eventHandler = new EventHandler();
var options = {
        containerType: 'div',
        containerClass: 'famous-container',
        fpsCap: undefined,
        runLoop: true,
        appMode: true
    };
var optionsManager = new OptionsManager(options);
var MAX_DEFER_FRAME_TIME = 10;
Engine.step = function step() {
    var currentTime = Date.now();
    if (frameTimeLimit && currentTime - lastTime < frameTimeLimit)
        return;
    var i = 0;
    frameTime = currentTime - lastTime;
    lastTime = currentTime;
    eventHandler.emit('prerender');
    for (i = 0; i < nextTickQueue.length; i++)
        nextTickQueue[i].call(this);
    nextTickQueue.splice(0);
    while (deferQueue.length && Date.now() - currentTime < MAX_DEFER_FRAME_TIME) {
        deferQueue.shift().call(this);
    }
    for (i = 0; i < contexts.length; i++)
        contexts[i].update();
    eventHandler.emit('postrender');
};
function loop() {
    if (options.runLoop) {
        Engine.step();
        window.requestAnimationFrame(loop);
    } else
        loopEnabled = false;
}
window.requestAnimationFrame(loop);
function handleResize(event) {
    for (var i = 0; i < contexts.length; i++) {
        contexts[i].emit('resize');
    }
    eventHandler.emit('resize');
}
window.addEventListener('resize', handleResize, false);
handleResize();
function initialize() {
    window.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, true);
    document.body.classList.add('famous-root');
    document.documentElement.classList.add('famous-root');
}
var initialized = false;
Engine.pipe = function pipe(target) {
    if (target.subscribe instanceof Function)
        return target.subscribe(Engine);
    else
        return eventHandler.pipe(target);
};
Engine.unpipe = function unpipe(target) {
    if (target.unsubscribe instanceof Function)
        return target.unsubscribe(Engine);
    else
        return eventHandler.unpipe(target);
};
Engine.on = function on(type, handler) {
    if (!(type in eventForwarders)) {
        eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
        if (document.body) {
            document.body.addEventListener(type, eventForwarders[type]);
        } else {
            Engine.nextTick(function (type, forwarder) {
                document.body.addEventListener(type, forwarder);
            }.bind(this, type, eventForwarders[type]));
        }
    }
    return eventHandler.on(type, handler);
};
Engine.emit = function emit(type, event) {
    return eventHandler.emit(type, event);
};
Engine.removeListener = function removeListener(type, handler) {
    return eventHandler.removeListener(type, handler);
};
Engine.getFPS = function getFPS() {
    return 1000 / frameTime;
};
Engine.setFPSCap = function setFPSCap(fps) {
    frameTimeLimit = Math.floor(1000 / fps);
};
Engine.getOptions = function getOptions() {
    return optionsManager.getOptions.apply(optionsManager, arguments);
};
Engine.setOptions = function setOptions(options) {
    return optionsManager.setOptions.apply(optionsManager, arguments);
};
Engine.createContext = function createContext(el) {
    if (!initialized && options.appMode)
        initialize();
    var needMountContainer = false;
    if (!el) {
        el = document.createElement(options.containerType);
        el.classList.add(options.containerClass);
        needMountContainer = true;
    }
    var context = new Context(el);
    Engine.registerContext(context);
    if (needMountContainer) {
        Engine.nextTick(function (context, el) {
            document.body.appendChild(el);
            context.emit('resize');
        }.bind(this, context, el));
    }
    return context;
};
Engine.registerContext = function registerContext(context) {
    contexts.push(context);
    return context;
};
Engine.getContexts = function getContexts() {
    return contexts;
};
Engine.deregisterContext = function deregisterContext(context) {
    var i = contexts.indexOf(context);
    if (i >= 0)
        contexts.splice(i, 1);
};
Engine.nextTick = function nextTick(fn) {
    nextTickQueue.push(fn);
};
Engine.defer = function defer(fn) {
    deferQueue.push(fn);
};
optionsManager.on('change', function (data) {
    if (data.id === 'fpsCap')
        Engine.setFPSCap(data.value);
    else if (data.id === 'runLoop') {
        if (!loopEnabled && data.value) {
            loopEnabled = true;
            window.requestAnimationFrame(loop);
        }
    }
});
module.exports = Engine;
},{"./Context":1,"./EventHandler":7,"./OptionsManager":9}],5:[function(require,module,exports){
var entities = [];
function get(id) {
    return entities[id];
}
function set(id, entity) {
    entities[id] = entity;
}
function register(entity) {
    var id = entities.length;
    set(id, entity);
    return id;
}
function unregister(id) {
    set(id, null);
}
module.exports = {
    register: register,
    unregister: unregister,
    get: get,
    set: set
};
},{}],6:[function(require,module,exports){
function EventEmitter() {
    this.listeners = {};
    this._owner = this;
}
EventEmitter.prototype.emit = function emit(type, event) {
    var handlers = this.listeners[type];
    if (handlers) {
        for (var i = 0; i < handlers.length; i++) {
            handlers[i].call(this._owner, event);
        }
    }
    return this;
};
EventEmitter.prototype.on = function on(type, handler) {
    if (!(type in this.listeners))
        this.listeners[type] = [];
    var index = this.listeners[type].indexOf(handler);
    if (index < 0)
        this.listeners[type].push(handler);
    return this;
};
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
EventEmitter.prototype.removeListener = function removeListener(type, handler) {
    var listener = this.listeners[type];
    if (listener !== undefined) {
        var index = listener.indexOf(handler);
        if (index >= 0)
            listener.splice(index, 1);
    }
    return this;
};
EventEmitter.prototype.bindThis = function bindThis(owner) {
    this._owner = owner;
};
module.exports = EventEmitter;
},{}],7:[function(require,module,exports){
var EventEmitter = require('./EventEmitter');
function EventHandler() {
    EventEmitter.apply(this, arguments);
    this.downstream = [];
    this.downstreamFn = [];
    this.upstream = [];
    this.upstreamListeners = {};
}
EventHandler.prototype = Object.create(EventEmitter.prototype);
EventHandler.prototype.constructor = EventHandler;
EventHandler.setInputHandler = function setInputHandler(object, handler) {
    object.trigger = handler.trigger.bind(handler);
    if (handler.subscribe && handler.unsubscribe) {
        object.subscribe = handler.subscribe.bind(handler);
        object.unsubscribe = handler.unsubscribe.bind(handler);
    }
};
EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
    if (handler instanceof EventHandler)
        handler.bindThis(object);
    object.pipe = handler.pipe.bind(handler);
    object.unpipe = handler.unpipe.bind(handler);
    object.on = handler.on.bind(handler);
    object.addListener = object.on;
    object.removeListener = handler.removeListener.bind(handler);
};
EventHandler.prototype.emit = function emit(type, event) {
    EventEmitter.prototype.emit.apply(this, arguments);
    var i = 0;
    for (i = 0; i < this.downstream.length; i++) {
        if (this.downstream[i].trigger)
            this.downstream[i].trigger(type, event);
    }
    for (i = 0; i < this.downstreamFn.length; i++) {
        this.downstreamFn[i](type, event);
    }
    return this;
};
EventHandler.prototype.trigger = EventHandler.prototype.emit;
EventHandler.prototype.pipe = function pipe(target) {
    if (target.subscribe instanceof Function)
        return target.subscribe(this);
    var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream;
    var index = downstreamCtx.indexOf(target);
    if (index < 0)
        downstreamCtx.push(target);
    if (target instanceof Function)
        target('pipe', null);
    else if (target.trigger)
        target.trigger('pipe', null);
    return target;
};
EventHandler.prototype.unpipe = function unpipe(target) {
    if (target.unsubscribe instanceof Function)
        return target.unsubscribe(this);
    var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream;
    var index = downstreamCtx.indexOf(target);
    if (index >= 0) {
        downstreamCtx.splice(index, 1);
        if (target instanceof Function)
            target('unpipe', null);
        else if (target.trigger)
            target.trigger('unpipe', null);
        return target;
    } else
        return false;
};
EventHandler.prototype.on = function on(type, handler) {
    EventEmitter.prototype.on.apply(this, arguments);
    if (!(type in this.upstreamListeners)) {
        var upstreamListener = this.trigger.bind(this, type);
        this.upstreamListeners[type] = upstreamListener;
        for (var i = 0; i < this.upstream.length; i++) {
            this.upstream[i].on(type, upstreamListener);
        }
    }
    return this;
};
EventHandler.prototype.addListener = EventHandler.prototype.on;
EventHandler.prototype.subscribe = function subscribe(source) {
    var index = this.upstream.indexOf(source);
    if (index < 0) {
        this.upstream.push(source);
        for (var type in this.upstreamListeners) {
            source.on(type, this.upstreamListeners[type]);
        }
    }
    return this;
};
EventHandler.prototype.unsubscribe = function unsubscribe(source) {
    var index = this.upstream.indexOf(source);
    if (index >= 0) {
        this.upstream.splice(index, 1);
        for (var type in this.upstreamListeners) {
            source.removeListener(type, this.upstreamListeners[type]);
        }
    }
    return this;
};
module.exports = EventHandler;
},{"./EventEmitter":6}],8:[function(require,module,exports){
var Transform = require('./Transform');
var Transitionable = require('famous/transitions/Transitionable');
var TransitionableTransform = require('famous/transitions/TransitionableTransform');
function Modifier(options) {
    this._transformGetter = null;
    this._opacityGetter = null;
    this._originGetter = null;
    this._alignGetter = null;
    this._sizeGetter = null;
    this._legacyStates = {};
    this._output = {
        transform: Transform.identity,
        opacity: 1,
        origin: null,
        align: null,
        size: null,
        target: null
    };
    if (options) {
        if (options.transform)
            this.transformFrom(options.transform);
        if (options.opacity !== undefined)
            this.opacityFrom(options.opacity);
        if (options.origin)
            this.originFrom(options.origin);
        if (options.align)
            this.alignFrom(options.align);
        if (options.size)
            this.sizeFrom(options.size);
    }
}
Modifier.prototype.transformFrom = function transformFrom(transform) {
    if (transform instanceof Function)
        this._transformGetter = transform;
    else if (transform instanceof Object && transform.get)
        this._transformGetter = transform.get.bind(transform);
    else {
        this._transformGetter = null;
        this._output.transform = transform;
    }
    return this;
};
Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
    if (opacity instanceof Function)
        this._opacityGetter = opacity;
    else if (opacity instanceof Object && opacity.get)
        this._opacityGetter = opacity.get.bind(opacity);
    else {
        this._opacityGetter = null;
        this._output.opacity = opacity;
    }
    return this;
};
Modifier.prototype.originFrom = function originFrom(origin) {
    if (origin instanceof Function)
        this._originGetter = origin;
    else if (origin instanceof Object && origin.get)
        this._originGetter = origin.get.bind(origin);
    else {
        this._originGetter = null;
        this._output.origin = origin;
    }
    return this;
};
Modifier.prototype.alignFrom = function alignFrom(align) {
    if (align instanceof Function)
        this._alignGetter = align;
    else if (align instanceof Object && align.get)
        this._alignGetter = align.get.bind(align);
    else {
        this._alignGetter = null;
        this._output.align = align;
    }
    return this;
};
Modifier.prototype.sizeFrom = function sizeFrom(size) {
    if (size instanceof Function)
        this._sizeGetter = size;
    else if (size instanceof Object && size.get)
        this._sizeGetter = size.get.bind(size);
    else {
        this._sizeGetter = null;
        this._output.size = size;
    }
    return this;
};
Modifier.prototype.setTransform = function setTransform(transform, transition, callback) {
    if (transition || this._legacyStates.transform) {
        if (!this._legacyStates.transform) {
            this._legacyStates.transform = new TransitionableTransform(this._output.transform);
        }
        if (!this._transformGetter)
            this.transformFrom(this._legacyStates.transform);
        this._legacyStates.transform.set(transform, transition, callback);
        return this;
    } else
        return this.transformFrom(transform);
};
Modifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
    if (transition || this._legacyStates.opacity) {
        if (!this._legacyStates.opacity) {
            this._legacyStates.opacity = new Transitionable(this._output.opacity);
        }
        if (!this._opacityGetter)
            this.opacityFrom(this._legacyStates.opacity);
        return this._legacyStates.opacity.set(opacity, transition, callback);
    } else
        return this.opacityFrom(opacity);
};
Modifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
    if (transition || this._legacyStates.origin) {
        if (!this._legacyStates.origin) {
            this._legacyStates.origin = new Transitionable(this._output.origin || [
                0,
                0
            ]);
        }
        if (!this._originGetter)
            this.originFrom(this._legacyStates.origin);
        this._legacyStates.origin.set(origin, transition, callback);
        return this;
    } else
        return this.originFrom(origin);
};
Modifier.prototype.setAlign = function setAlign(align, transition, callback) {
    if (transition || this._legacyStates.align) {
        if (!this._legacyStates.align) {
            this._legacyStates.align = new Transitionable(this._output.align || [
                0,
                0
            ]);
        }
        if (!this._alignGetter)
            this.alignFrom(this._legacyStates.align);
        this._legacyStates.align.set(align, transition, callback);
        return this;
    } else
        return this.alignFrom(align);
};
Modifier.prototype.setSize = function setSize(size, transition, callback) {
    if (size && (transition || this._legacyStates.size)) {
        if (!this._legacyStates.size) {
            this._legacyStates.size = new Transitionable(this._output.size || [
                0,
                0
            ]);
        }
        if (!this._sizeGetter)
            this.sizeFrom(this._legacyStates.size);
        this._legacyStates.size.set(size, transition, callback);
        return this;
    } else
        return this.sizeFrom(size);
};
Modifier.prototype.halt = function halt() {
    if (this._legacyStates.transform)
        this._legacyStates.transform.halt();
    if (this._legacyStates.opacity)
        this._legacyStates.opacity.halt();
    if (this._legacyStates.origin)
        this._legacyStates.origin.halt();
    if (this._legacyStates.align)
        this._legacyStates.align.halt();
    if (this._legacyStates.size)
        this._legacyStates.size.halt();
    this._transformGetter = null;
    this._opacityGetter = null;
    this._originGetter = null;
    this._alignGetter = null;
    this._sizeGetter = null;
};
Modifier.prototype.getTransform = function getTransform() {
    return this._transformGetter();
};
Modifier.prototype.getFinalTransform = function getFinalTransform() {
    return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform;
};
Modifier.prototype.getOpacity = function getOpacity() {
    return this._opacityGetter();
};
Modifier.prototype.getOrigin = function getOrigin() {
    return this._originGetter();
};
Modifier.prototype.getAlign = function getAlign() {
    return this._alignGetter();
};
Modifier.prototype.getSize = function getSize() {
    return this._sizeGetter ? this._sizeGetter() : this._output.size;
};
function _update() {
    if (this._transformGetter)
        this._output.transform = this._transformGetter();
    if (this._opacityGetter)
        this._output.opacity = this._opacityGetter();
    if (this._originGetter)
        this._output.origin = this._originGetter();
    if (this._alignGetter)
        this._output.align = this._alignGetter();
    if (this._sizeGetter)
        this._output.size = this._sizeGetter();
}
Modifier.prototype.modify = function modify(target) {
    _update.call(this);
    this._output.target = target;
    return this._output;
};
module.exports = Modifier;
},{"./Transform":13,"famous/transitions/Transitionable":37,"famous/transitions/TransitionableTransform":38}],9:[function(require,module,exports){
var EventHandler = require('./EventHandler');
function OptionsManager(value) {
    this._value = value;
    this.eventOutput = null;
}
OptionsManager.patch = function patchObject(source, data) {
    var manager = new OptionsManager(source);
    for (var i = 1; i < arguments.length; i++)
        manager.patch(arguments[i]);
    return source;
};
function _createEventOutput() {
    this.eventOutput = new EventHandler();
    this.eventOutput.bindThis(this);
    EventHandler.setOutputHandler(this, this.eventOutput);
}
OptionsManager.prototype.patch = function patch() {
    var myState = this._value;
    for (var i = 0; i < arguments.length; i++) {
        var data = arguments[i];
        for (var k in data) {
            if (k in myState && (data[k] && data[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
                if (!myState.hasOwnProperty(k))
                    myState[k] = Object.create(myState[k]);
                this.key(k).patch(data[k]);
                if (this.eventOutput)
                    this.eventOutput.emit('change', {
                        id: k,
                        value: this.key(k).value()
                    });
            } else
                this.set(k, data[k]);
        }
    }
    return this;
};
OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;
OptionsManager.prototype.key = function key(identifier) {
    var result = new OptionsManager(this._value[identifier]);
    if (!(result._value instanceof Object) || result._value instanceof Array)
        result._value = {};
    return result;
};
OptionsManager.prototype.get = function get(key) {
    return this._value[key];
};
OptionsManager.prototype.getOptions = OptionsManager.prototype.get;
OptionsManager.prototype.set = function set(key, value) {
    var originalValue = this.get(key);
    this._value[key] = value;
    if (this.eventOutput && value !== originalValue)
        this.eventOutput.emit('change', {
            id: key,
            value: value
        });
    return this;
};
OptionsManager.prototype.value = function value() {
    return this._value;
};
OptionsManager.prototype.on = function on() {
    _createEventOutput.call(this);
    return this.on.apply(this, arguments);
};
OptionsManager.prototype.removeListener = function removeListener() {
    _createEventOutput.call(this);
    return this.removeListener.apply(this, arguments);
};
OptionsManager.prototype.pipe = function pipe() {
    _createEventOutput.call(this);
    return this.pipe.apply(this, arguments);
};
OptionsManager.prototype.unpipe = function unpipe() {
    _createEventOutput.call(this);
    return this.unpipe.apply(this, arguments);
};
module.exports = OptionsManager;
},{"./EventHandler":7}],10:[function(require,module,exports){
var Entity = require('./Entity');
var SpecParser = require('./SpecParser');
function RenderNode(object) {
    this._object = null;
    this._child = null;
    this._hasMultipleChildren = false;
    this._isRenderable = false;
    this._isModifier = false;
    this._resultCache = {};
    this._prevResults = {};
    this._childResult = null;
    if (object)
        this.set(object);
}
RenderNode.prototype.add = function add(child) {
    var childNode = child instanceof RenderNode ? child : new RenderNode(child);
    if (this._child instanceof Array)
        this._child.push(childNode);
    else if (this._child) {
        this._child = [
            this._child,
            childNode
        ];
        this._hasMultipleChildren = true;
        this._childResult = [];
    } else
        this._child = childNode;
    return childNode;
};
RenderNode.prototype.get = function get() {
    return this._object || (this._hasMultipleChildren ? null : this._child ? this._child.get() : null);
};
RenderNode.prototype.set = function set(child) {
    this._childResult = null;
    this._hasMultipleChildren = false;
    this._isRenderable = child.render ? true : false;
    this._isModifier = child.modify ? true : false;
    this._object = child;
    this._child = null;
    if (child instanceof RenderNode)
        return child;
    else
        return this;
};
RenderNode.prototype.getSize = function getSize() {
    var result = null;
    var target = this.get();
    if (target && target.getSize)
        result = target.getSize();
    if (!result && this._child && this._child.getSize)
        result = this._child.getSize();
    return result;
};
function _applyCommit(spec, context, cacheStorage) {
    var result = SpecParser.parse(spec, context);
    var keys = Object.keys(result);
    for (var i = 0; i < keys.length; i++) {
        var id = keys[i];
        var childNode = Entity.get(id);
        var commitParams = result[id];
        commitParams.allocator = context.allocator;
        var commitResult = childNode.commit(commitParams);
        if (commitResult)
            _applyCommit(commitResult, context, cacheStorage);
        else
            cacheStorage[id] = commitParams;
    }
}
RenderNode.prototype.commit = function commit(context) {
    var prevKeys = Object.keys(this._prevResults);
    for (var i = 0; i < prevKeys.length; i++) {
        var id = prevKeys[i];
        if (this._resultCache[id] === undefined) {
            var object = Entity.get(id);
            if (object.cleanup)
                object.cleanup(context.allocator);
        }
    }
    this._prevResults = this._resultCache;
    this._resultCache = {};
    _applyCommit(this.render(), context, this._resultCache);
};
RenderNode.prototype.render = function render() {
    if (this._isRenderable)
        return this._object.render();
    var result = null;
    if (this._hasMultipleChildren) {
        result = this._childResult;
        var children = this._child;
        for (var i = 0; i < children.length; i++) {
            result[i] = children[i].render();
        }
    } else if (this._child)
        result = this._child.render();
    return this._isModifier ? this._object.modify(result) : result;
};
module.exports = RenderNode;
},{"./Entity":5,"./SpecParser":11}],11:[function(require,module,exports){
var Transform = require('./Transform');
function SpecParser() {
    this.result = {};
}
SpecParser._instance = new SpecParser();
SpecParser.parse = function parse(spec, context) {
    return SpecParser._instance.parse(spec, context);
};
SpecParser.prototype.parse = function parse(spec, context) {
    this.reset();
    this._parseSpec(spec, context, Transform.identity);
    return this.result;
};
SpecParser.prototype.reset = function reset() {
    this.result = {};
};
function _vecInContext(v, m) {
    return [
        v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
        v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
        v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
    ];
}
var _originZeroZero = [
        0,
        0
    ];
SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext) {
    var id;
    var target;
    var transform;
    var opacity;
    var origin;
    var align;
    var size;
    if (typeof spec === 'number') {
        id = spec;
        transform = parentContext.transform;
        align = parentContext.align || parentContext.origin;
        if (parentContext.size && align && (align[0] || align[1])) {
            var alignAdjust = [
                    align[0] * parentContext.size[0],
                    align[1] * parentContext.size[1],
                    0
                ];
            transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
        }
        this.result[id] = {
            transform: transform,
            opacity: parentContext.opacity,
            origin: parentContext.origin || _originZeroZero,
            align: parentContext.align || parentContext.origin || _originZeroZero,
            size: parentContext.size
        };
    } else if (!spec) {
        return;
    } else if (spec instanceof Array) {
        for (var i = 0; i < spec.length; i++) {
            this._parseSpec(spec[i], parentContext, sizeContext);
        }
    } else {
        target = spec.target;
        transform = parentContext.transform;
        opacity = parentContext.opacity;
        origin = parentContext.origin;
        align = parentContext.align;
        size = parentContext.size;
        var nextSizeContext = sizeContext;
        if (spec.opacity !== undefined)
            opacity = parentContext.opacity * spec.opacity;
        if (spec.transform)
            transform = Transform.multiply(parentContext.transform, spec.transform);
        if (spec.origin) {
            origin = spec.origin;
            nextSizeContext = parentContext.transform;
        }
        if (spec.align)
            align = spec.align;
        if (spec.size) {
            var parentSize = parentContext.size;
            size = [
                spec.size[0] !== undefined ? spec.size[0] : parentSize[0],
                spec.size[1] !== undefined ? spec.size[1] : parentSize[1]
            ];
            if (parentSize) {
                if (!align)
                    align = origin;
                if (align && (align[0] || align[1]))
                    transform = Transform.thenMove(transform, _vecInContext([
                        align[0] * parentSize[0],
                        align[1] * parentSize[1],
                        0
                    ], sizeContext));
                if (origin && (origin[0] || origin[1]))
                    transform = Transform.moveThen([
                        -origin[0] * size[0],
                        -origin[1] * size[1],
                        0
                    ], transform);
            }
            nextSizeContext = parentContext.transform;
            origin = null;
            align = null;
        }
        this._parseSpec(target, {
            transform: transform,
            opacity: opacity,
            origin: origin,
            align: align,
            size: size
        }, nextSizeContext);
    }
};
module.exports = SpecParser;
},{"./Transform":13}],12:[function(require,module,exports){
var ElementOutput = require('./ElementOutput');
function Surface(options) {
    ElementOutput.call(this);
    this.options = {};
    this.properties = {};
    this.content = '';
    this.classList = [];
    this.size = null;
    this._classesDirty = true;
    this._stylesDirty = true;
    this._sizeDirty = true;
    this._contentDirty = true;
    this._dirtyClasses = [];
    if (options)
        this.setOptions(options);
    this._currentTarget = null;
}
Surface.prototype = Object.create(ElementOutput.prototype);
Surface.prototype.constructor = Surface;
Surface.prototype.elementType = 'div';
Surface.prototype.elementClass = 'famous-surface';
Surface.prototype.setProperties = function setProperties(properties) {
    for (var n in properties) {
        this.properties[n] = properties[n];
    }
    this._stylesDirty = true;
    return this;
};
Surface.prototype.getProperties = function getProperties() {
    return this.properties;
};
Surface.prototype.addClass = function addClass(className) {
    if (this.classList.indexOf(className) < 0) {
        this.classList.push(className);
        this._classesDirty = true;
    }
    return this;
};
Surface.prototype.removeClass = function removeClass(className) {
    var i = this.classList.indexOf(className);
    if (i >= 0) {
        this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
        this._classesDirty = true;
    }
    return this;
};
Surface.prototype.toggleClass = function toggleClass(className) {
    var i = this.classList.indexOf(className);
    if (i >= 0) {
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
    return this;
};
Surface.prototype.setClasses = function setClasses(classList) {
    var i = 0;
    var removal = [];
    for (i = 0; i < this.classList.length; i++) {
        if (classList.indexOf(this.classList[i]) < 0)
            removal.push(this.classList[i]);
    }
    for (i = 0; i < removal.length; i++)
        this.removeClass(removal[i]);
    for (i = 0; i < classList.length; i++)
        this.addClass(classList[i]);
    return this;
};
Surface.prototype.getClassList = function getClassList() {
    return this.classList;
};
Surface.prototype.setContent = function setContent(content) {
    if (this.content !== content) {
        this.content = content;
        this._contentDirty = true;
    }
    return this;
};
Surface.prototype.getContent = function getContent() {
    return this.content;
};
Surface.prototype.setOptions = function setOptions(options) {
    if (options.size)
        this.setSize(options.size);
    if (options.classes)
        this.setClasses(options.classes);
    if (options.properties)
        this.setProperties(options.properties);
    if (options.content)
        this.setContent(options.content);
    return this;
};
function _cleanupClasses(target) {
    for (var i = 0; i < this._dirtyClasses.length; i++)
        target.classList.remove(this._dirtyClasses[i]);
    this._dirtyClasses = [];
}
function _applyStyles(target) {
    for (var n in this.properties) {
        target.style[n] = this.properties[n];
    }
}
function _cleanupStyles(target) {
    for (var n in this.properties) {
        target.style[n] = '';
    }
}
function _xyNotEquals(a, b) {
    return a && b ? a[0] !== b[0] || a[1] !== b[1] : a !== b;
}
Surface.prototype.setup = function setup(allocator) {
    var target = allocator.allocate(this.elementType);
    if (this.elementClass) {
        if (this.elementClass instanceof Array) {
            for (var i = 0; i < this.elementClass.length; i++) {
                target.classList.add(this.elementClass[i]);
            }
        } else {
            target.classList.add(this.elementClass);
        }
    }
    target.style.display = '';
    this.attach(target);
    this._opacity = null;
    this._currentTarget = target;
    this._stylesDirty = true;
    this._classesDirty = true;
    this._sizeDirty = true;
    this._contentDirty = true;
    this._originDirty = true;
    this._transformDirty = true;
};
Surface.prototype.commit = function commit(context) {
    if (!this._currentTarget)
        this.setup(context.allocator);
    var target = this._currentTarget;
    var size = context.size;
    if (this._classesDirty) {
        _cleanupClasses.call(this, target);
        var classList = this.getClassList();
        for (var i = 0; i < classList.length; i++)
            target.classList.add(classList[i]);
        this._classesDirty = false;
    }
    if (this._stylesDirty) {
        _applyStyles.call(this, target);
        this._stylesDirty = false;
    }
    if (this.size) {
        var origSize = context.size;
        size = [
            this.size[0],
            this.size[1]
        ];
        if (size[0] === undefined)
            size[0] = origSize[0];
        else if (size[0] === true)
            size[0] = target.clientWidth;
        if (size[1] === undefined)
            size[1] = origSize[1];
        else if (size[1] === true)
            size[1] = target.clientHeight;
    }
    if (_xyNotEquals(this._size, size)) {
        if (!this._size)
            this._size = [
                0,
                0
            ];
        this._size[0] = size[0];
        this._size[1] = size[1];
        this._sizeDirty = true;
    }
    if (this._sizeDirty) {
        if (this._size) {
            target.style.width = this.size && this.size[0] === true ? '' : this._size[0] + 'px';
            target.style.height = this.size && this.size[1] === true ? '' : this._size[1] + 'px';
        }
        this._sizeDirty = false;
    }
    if (this._contentDirty) {
        this.deploy(target);
        this._eventOutput.emit('deploy');
        this._contentDirty = false;
    }
    ElementOutput.prototype.commit.call(this, context);
};
Surface.prototype.cleanup = function cleanup(allocator) {
    var i = 0;
    var target = this._currentTarget;
    this._eventOutput.emit('recall');
    this.recall(target);
    target.style.display = 'none';
    target.style.opacity = '';
    target.style.width = '';
    target.style.height = '';
    this._size = null;
    _cleanupStyles.call(this, target);
    var classList = this.getClassList();
    _cleanupClasses.call(this, target);
    for (i = 0; i < classList.length; i++)
        target.classList.remove(classList[i]);
    if (this.elementClass) {
        if (this.elementClass instanceof Array) {
            for (i = 0; i < this.elementClass.length; i++) {
                target.classList.remove(this.elementClass[i]);
            }
        } else {
            target.classList.remove(this.elementClass);
        }
    }
    this.detach(target);
    this._currentTarget = null;
    allocator.deallocate(target);
};
Surface.prototype.deploy = function deploy(target) {
    var content = this.getContent();
    if (content instanceof Node) {
        while (target.hasChildNodes())
            target.removeChild(target.firstChild);
        target.appendChild(content);
    } else
        target.innerHTML = content;
};
Surface.prototype.recall = function recall(target) {
    var df = document.createDocumentFragment();
    while (target.hasChildNodes())
        df.appendChild(target.firstChild);
    this.setContent(df);
};
Surface.prototype.getSize = function getSize() {
    return this._size;
};
Surface.prototype.setSize = function setSize(size) {
    this.size = size ? [
        size[0],
        size[1]
    ] : null;
    this._sizeDirty = true;
    return this;
};
module.exports = Surface;
},{"./ElementOutput":3}],13:[function(require,module,exports){
var Transform = {};
Transform.precision = 0.000001;
Transform.identity = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
];
Transform.multiply4x4 = function multiply4x4(a, b) {
    return [
        a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
        a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
        a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
        a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
        a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
        a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
        a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
        a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
        a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
        a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
        a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
        a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
        a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
        a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
        a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
        a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
    ];
};
Transform.multiply = function multiply(a, b) {
    return [
        a[0] * b[0] + a[4] * b[1] + a[8] * b[2],
        a[1] * b[0] + a[5] * b[1] + a[9] * b[2],
        a[2] * b[0] + a[6] * b[1] + a[10] * b[2],
        0,
        a[0] * b[4] + a[4] * b[5] + a[8] * b[6],
        a[1] * b[4] + a[5] * b[5] + a[9] * b[6],
        a[2] * b[4] + a[6] * b[5] + a[10] * b[6],
        0,
        a[0] * b[8] + a[4] * b[9] + a[8] * b[10],
        a[1] * b[8] + a[5] * b[9] + a[9] * b[10],
        a[2] * b[8] + a[6] * b[9] + a[10] * b[10],
        0,
        a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12],
        a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13],
        a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14],
        1
    ];
};
Transform.thenMove = function thenMove(m, t) {
    if (!t[2])
        t[2] = 0;
    return [
        m[0],
        m[1],
        m[2],
        0,
        m[4],
        m[5],
        m[6],
        0,
        m[8],
        m[9],
        m[10],
        0,
        m[12] + t[0],
        m[13] + t[1],
        m[14] + t[2],
        1
    ];
};
Transform.moveThen = function moveThen(v, m) {
    if (!v[2])
        v[2] = 0;
    var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
    var t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
    var t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
    return Transform.thenMove(m, [
        t0,
        t1,
        t2
    ]);
};
Transform.translate = function translate(x, y, z) {
    if (z === undefined)
        z = 0;
    return [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        x,
        y,
        z,
        1
    ];
};
Transform.thenScale = function thenScale(m, s) {
    return [
        s[0] * m[0],
        s[1] * m[1],
        s[2] * m[2],
        0,
        s[0] * m[4],
        s[1] * m[5],
        s[2] * m[6],
        0,
        s[0] * m[8],
        s[1] * m[9],
        s[2] * m[10],
        0,
        s[0] * m[12],
        s[1] * m[13],
        s[2] * m[14],
        1
    ];
};
Transform.scale = function scale(x, y, z) {
    if (z === undefined)
        z = 1;
    if (y === undefined)
        y = x;
    return [
        x,
        0,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        0,
        z,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.rotateX = function rotateX(theta) {
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    return [
        1,
        0,
        0,
        0,
        0,
        cosTheta,
        sinTheta,
        0,
        0,
        -sinTheta,
        cosTheta,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.rotateY = function rotateY(theta) {
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    return [
        cosTheta,
        0,
        -sinTheta,
        0,
        0,
        1,
        0,
        0,
        sinTheta,
        0,
        cosTheta,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.rotateZ = function rotateZ(theta) {
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    return [
        cosTheta,
        sinTheta,
        0,
        0,
        -sinTheta,
        cosTheta,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.rotate = function rotate(phi, theta, psi) {
    var cosPhi = Math.cos(phi);
    var sinPhi = Math.sin(phi);
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    var cosPsi = Math.cos(psi);
    var sinPsi = Math.sin(psi);
    var result = [
            cosTheta * cosPsi,
            cosPhi * sinPsi + sinPhi * sinTheta * cosPsi,
            sinPhi * sinPsi - cosPhi * sinTheta * cosPsi,
            0,
            -cosTheta * sinPsi,
            cosPhi * cosPsi - sinPhi * sinTheta * sinPsi,
            sinPhi * cosPsi + cosPhi * sinTheta * sinPsi,
            0,
            sinTheta,
            -sinPhi * cosTheta,
            cosPhi * cosTheta,
            0,
            0,
            0,
            0,
            1
        ];
    return result;
};
Transform.rotateAxis = function rotateAxis(v, theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    var verTheta = 1 - cosTheta;
    var xxV = v[0] * v[0] * verTheta;
    var xyV = v[0] * v[1] * verTheta;
    var xzV = v[0] * v[2] * verTheta;
    var yyV = v[1] * v[1] * verTheta;
    var yzV = v[1] * v[2] * verTheta;
    var zzV = v[2] * v[2] * verTheta;
    var xs = v[0] * sinTheta;
    var ys = v[1] * sinTheta;
    var zs = v[2] * sinTheta;
    var result = [
            xxV + cosTheta,
            xyV + zs,
            xzV - ys,
            0,
            xyV - zs,
            yyV + cosTheta,
            yzV + xs,
            0,
            xzV + ys,
            yzV - xs,
            zzV + cosTheta,
            0,
            0,
            0,
            0,
            1
        ];
    return result;
};
Transform.aboutOrigin = function aboutOrigin(v, m) {
    var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]);
    var t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]);
    var t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
    return Transform.thenMove(m, [
        t0,
        t1,
        t2
    ]);
};
Transform.skew = function skew(phi, theta, psi) {
    return [
        1,
        Math.tan(theta),
        0,
        0,
        Math.tan(psi),
        1,
        0,
        0,
        0,
        Math.tan(phi),
        1,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.skewX = function skewX(angle) {
    return [
        1,
        0,
        0,
        0,
        Math.tan(angle),
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.skewY = function skewY(angle) {
    return [
        1,
        Math.tan(angle),
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    ];
};
Transform.perspective = function perspective(focusZ) {
    return [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        -1 / focusZ,
        0,
        0,
        0,
        1
    ];
};
Transform.getTranslate = function getTranslate(m) {
    return [
        m[12],
        m[13],
        m[14]
    ];
};
Transform.inverse = function inverse(m) {
    var c0 = m[5] * m[10] - m[6] * m[9];
    var c1 = m[4] * m[10] - m[6] * m[8];
    var c2 = m[4] * m[9] - m[5] * m[8];
    var c4 = m[1] * m[10] - m[2] * m[9];
    var c5 = m[0] * m[10] - m[2] * m[8];
    var c6 = m[0] * m[9] - m[1] * m[8];
    var c8 = m[1] * m[6] - m[2] * m[5];
    var c9 = m[0] * m[6] - m[2] * m[4];
    var c10 = m[0] * m[5] - m[1] * m[4];
    var detM = m[0] * c0 - m[1] * c1 + m[2] * c2;
    var invD = 1 / detM;
    var result = [
            invD * c0,
            -invD * c4,
            invD * c8,
            0,
            -invD * c1,
            invD * c5,
            -invD * c9,
            0,
            invD * c2,
            -invD * c6,
            invD * c10,
            0,
            0,
            0,
            0,
            1
        ];
    result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8];
    result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9];
    result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10];
    return result;
};
Transform.transpose = function transpose(m) {
    return [
        m[0],
        m[4],
        m[8],
        m[12],
        m[1],
        m[5],
        m[9],
        m[13],
        m[2],
        m[6],
        m[10],
        m[14],
        m[3],
        m[7],
        m[11],
        m[15]
    ];
};
function _normSquared(v) {
    return v.length === 2 ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}
function _norm(v) {
    return Math.sqrt(_normSquared(v));
}
function _sign(n) {
    return n < 0 ? -1 : 1;
}
Transform.interpret = function interpret(M) {
    var x = [
            M[0],
            M[1],
            M[2]
        ];
    var sgn = _sign(x[0]);
    var xNorm = _norm(x);
    var v = [
            x[0] + sgn * xNorm,
            x[1],
            x[2]
        ];
    var mult = 2 / _normSquared(v);
    if (mult >= Infinity) {
        return {
            translate: Transform.getTranslate(M),
            rotate: [
                0,
                0,
                0
            ],
            scale: [
                0,
                0,
                0
            ],
            skew: [
                0,
                0,
                0
            ]
        };
    }
    var Q1 = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
        ];
    Q1[0] = 1 - mult * v[0] * v[0];
    Q1[5] = 1 - mult * v[1] * v[1];
    Q1[10] = 1 - mult * v[2] * v[2];
    Q1[1] = -mult * v[0] * v[1];
    Q1[2] = -mult * v[0] * v[2];
    Q1[6] = -mult * v[1] * v[2];
    Q1[4] = Q1[1];
    Q1[8] = Q1[2];
    Q1[9] = Q1[6];
    var MQ1 = Transform.multiply(Q1, M);
    var x2 = [
            MQ1[5],
            MQ1[6]
        ];
    var sgn2 = _sign(x2[0]);
    var x2Norm = _norm(x2);
    var v2 = [
            x2[0] + sgn2 * x2Norm,
            x2[1]
        ];
    var mult2 = 2 / _normSquared(v2);
    var Q2 = [
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
        ];
    Q2[5] = 1 - mult2 * v2[0] * v2[0];
    Q2[10] = 1 - mult2 * v2[1] * v2[1];
    Q2[6] = -mult2 * v2[0] * v2[1];
    Q2[9] = Q2[6];
    var Q = Transform.multiply(Q2, Q1);
    var R = Transform.multiply(Q, M);
    var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
    R = Transform.multiply(R, remover);
    Q = Transform.multiply(remover, Q);
    var result = {};
    result.translate = Transform.getTranslate(M);
    result.rotate = [
        Math.atan2(-Q[6], Q[10]),
        Math.asin(Q[2]),
        Math.atan2(-Q[1], Q[0])
    ];
    if (!result.rotate[0]) {
        result.rotate[0] = 0;
        result.rotate[2] = Math.atan2(Q[4], Q[5]);
    }
    result.scale = [
        R[0],
        R[5],
        R[10]
    ];
    result.skew = [
        Math.atan2(R[9], result.scale[2]),
        Math.atan2(R[8], result.scale[2]),
        Math.atan2(R[4], result.scale[0])
    ];
    if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
        result.rotate[1] = Math.PI - result.rotate[1];
        if (result.rotate[1] > Math.PI)
            result.rotate[1] -= 2 * Math.PI;
        if (result.rotate[1] < -Math.PI)
            result.rotate[1] += 2 * Math.PI;
        if (result.rotate[0] < 0)
            result.rotate[0] += Math.PI;
        else
            result.rotate[0] -= Math.PI;
        if (result.rotate[2] < 0)
            result.rotate[2] += Math.PI;
        else
            result.rotate[2] -= Math.PI;
    }
    return result;
};
Transform.average = function average(M1, M2, t) {
    t = t === undefined ? 0.5 : t;
    var specM1 = Transform.interpret(M1);
    var specM2 = Transform.interpret(M2);
    var specAvg = {
            translate: [
                0,
                0,
                0
            ],
            rotate: [
                0,
                0,
                0
            ],
            scale: [
                0,
                0,
                0
            ],
            skew: [
                0,
                0,
                0
            ]
        };
    for (var i = 0; i < 3; i++) {
        specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
        specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
        specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
        specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
    }
    return Transform.build(specAvg);
};
Transform.build = function build(spec) {
    var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
    var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
    var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
    return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate);
};
Transform.equals = function equals(a, b) {
    return !Transform.notEquals(a, b);
};
Transform.notEquals = function notEquals(a, b) {
    if (a === b)
        return false;
    return !(a && b) || a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] || a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] || a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] || a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10];
};
Transform.normalizeRotation = function normalizeRotation(rotation) {
    var result = rotation.slice(0);
    if (result[0] === Math.PI * 0.5 || result[0] === -Math.PI * 0.5) {
        result[0] = -result[0];
        result[1] = Math.PI - result[1];
        result[2] -= Math.PI;
    }
    if (result[0] > Math.PI * 0.5) {
        result[0] = result[0] - Math.PI;
        result[1] = Math.PI - result[1];
        result[2] -= Math.PI;
    }
    if (result[0] < -Math.PI * 0.5) {
        result[0] = result[0] + Math.PI;
        result[1] = -Math.PI - result[1];
        result[2] -= Math.PI;
    }
    while (result[1] < -Math.PI)
        result[1] += 2 * Math.PI;
    while (result[1] >= Math.PI)
        result[1] -= 2 * Math.PI;
    while (result[2] < -Math.PI)
        result[2] += 2 * Math.PI;
    while (result[2] >= Math.PI)
        result[2] -= 2 * Math.PI;
    return result;
};
Transform.inFront = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0.001,
    1
];
Transform.behind = [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    -0.001,
    1
];
module.exports = Transform;
},{}],14:[function(require,module,exports){
var EventHandler = require('./EventHandler');
var OptionsManager = require('./OptionsManager');
var RenderNode = require('./RenderNode');
var Utility = require('famous/utilities/Utility');
function View(options) {
    this._node = new RenderNode();
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
}
View.DEFAULT_OPTIONS = {};
View.prototype.getOptions = function getOptions() {
    return this._optionsManager.value();
};
View.prototype.setOptions = function setOptions(options) {
    this._optionsManager.patch(options);
};
View.prototype.add = function add() {
    return this._node.add.apply(this._node, arguments);
};
View.prototype._add = View.prototype.add;
View.prototype.render = function render() {
    return this._node.render();
};
View.prototype.getSize = function getSize() {
    if (this._node && this._node.getSize) {
        return this._node.getSize.apply(this._node, arguments) || this.options.size;
    } else
        return this.options.size;
};
module.exports = View;
},{"./EventHandler":7,"./OptionsManager":9,"./RenderNode":10,"famous/utilities/Utility":42}],15:[function(require,module,exports){
function ViewSequence(options) {
    if (!options)
        options = [];
    if (options instanceof Array)
        options = { array: options };
    this._ = null;
    this.index = options.index || 0;
    if (options.array)
        this._ = new this.constructor.Backing(options.array);
    else if (options._)
        this._ = options._;
    if (this.index === this._.firstIndex)
        this._.firstNode = this;
    if (this.index === this._.firstIndex + this._.array.length - 1)
        this._.lastNode = this;
    if (options.loop !== undefined)
        this._.loop = options.loop;
    this._previousNode = null;
    this._nextNode = null;
}
ViewSequence.Backing = function Backing(array) {
    this.array = array;
    this.firstIndex = 0;
    this.loop = false;
    this.firstNode = null;
    this.lastNode = null;
};
ViewSequence.Backing.prototype.getValue = function getValue(i) {
    var _i = i - this.firstIndex;
    if (_i < 0 || _i >= this.array.length)
        return null;
    return this.array[_i];
};
ViewSequence.Backing.prototype.setValue = function setValue(i, value) {
    this.array[i - this.firstIndex] = value;
};
ViewSequence.Backing.prototype.reindex = function reindex(start, removeCount, insertCount) {
    if (!this.array[0])
        return;
    var i = 0;
    var index = this.firstIndex;
    var indexShiftAmount = insertCount - removeCount;
    var node = this.firstNode;
    while (index < start - 1) {
        node = node.getNext();
        index++;
    }
    var spliceStartNode = node;
    for (i = 0; i < removeCount; i++) {
        node = node.getNext();
        if (node)
            node._previousNode = spliceStartNode;
    }
    var spliceResumeNode = node ? node.getNext() : null;
    spliceStartNode._nextNode = null;
    node = spliceStartNode;
    for (i = 0; i < insertCount; i++)
        node = node.getNext();
    index += insertCount;
    if (node !== spliceResumeNode) {
        node._nextNode = spliceResumeNode;
        if (spliceResumeNode)
            spliceResumeNode._previousNode = node;
    }
    if (spliceResumeNode) {
        node = spliceResumeNode;
        index++;
        while (node && index < this.array.length + this.firstIndex) {
            if (node._nextNode)
                node.index += indexShiftAmount;
            else
                node.index = index;
            node = node.getNext();
            index++;
        }
    }
};
ViewSequence.prototype.getPrevious = function getPrevious() {
    if (this.index === this._.firstIndex) {
        if (this._.loop) {
            this._previousNode = this._.lastNode || new this.constructor({
                _: this._,
                index: this._.firstIndex + this._.array.length - 1
            });
            this._previousNode._nextNode = this;
        } else {
            this._previousNode = null;
        }
    } else if (!this._previousNode) {
        this._previousNode = new this.constructor({
            _: this._,
            index: this.index - 1
        });
        this._previousNode._nextNode = this;
    }
    return this._previousNode;
};
ViewSequence.prototype.getNext = function getNext() {
    if (this.index === this._.firstIndex + this._.array.length - 1) {
        if (this._.loop) {
            this._nextNode = this._.firstNode || new this.constructor({
                _: this._,
                index: this._.firstIndex
            });
            this._nextNode._previousNode = this;
        } else {
            this._nextNode = null;
        }
    } else if (!this._nextNode) {
        this._nextNode = new this.constructor({
            _: this._,
            index: this.index + 1
        });
        this._nextNode._previousNode = this;
    }
    return this._nextNode;
};
ViewSequence.prototype.getIndex = function getIndex() {
    return this.index;
};
ViewSequence.prototype.toString = function toString() {
    return '' + this.index;
};
ViewSequence.prototype.unshift = function unshift(value) {
    this._.array.unshift.apply(this._.array, arguments);
    this._.firstIndex -= arguments.length;
};
ViewSequence.prototype.push = function push(value) {
    this._.array.push.apply(this._.array, arguments);
};
ViewSequence.prototype.splice = function splice(index, howMany) {
    var values = Array.prototype.slice.call(arguments, 2);
    this._.array.splice.apply(this._.array, [
        index - this._.firstIndex,
        howMany
    ].concat(values));
    this._.reindex(index, howMany, values.length);
};
ViewSequence.prototype.swap = function swap(other) {
    var otherValue = other.get();
    var myValue = this.get();
    this._.setValue(this.index, otherValue);
    this._.setValue(other.index, myValue);
    var myPrevious = this._previousNode;
    var myNext = this._nextNode;
    var myIndex = this.index;
    var otherPrevious = other._previousNode;
    var otherNext = other._nextNode;
    var otherIndex = other.index;
    this.index = otherIndex;
    this._previousNode = otherPrevious === this ? other : otherPrevious;
    if (this._previousNode)
        this._previousNode._nextNode = this;
    this._nextNode = otherNext === this ? other : otherNext;
    if (this._nextNode)
        this._nextNode._previousNode = this;
    other.index = myIndex;
    other._previousNode = myPrevious === other ? this : myPrevious;
    if (other._previousNode)
        other._previousNode._nextNode = other;
    other._nextNode = myNext === other ? this : myNext;
    if (other._nextNode)
        other._nextNode._previousNode = other;
    if (this.index === this._.firstIndex)
        this._.firstNode = this;
    else if (this.index === this._.firstIndex + this._.array.length - 1)
        this._.lastNode = this;
    if (other.index === this._.firstIndex)
        this._.firstNode = other;
    else if (other.index === this._.firstIndex + this._.array.length - 1)
        this._.lastNode = other;
};
ViewSequence.prototype.get = function get() {
    return this._.getValue(this.index);
};
ViewSequence.prototype.getSize = function getSize() {
    var target = this.get();
    return target ? target.getSize() : null;
};
ViewSequence.prototype.render = function render() {
    var target = this.get();
    return target ? target.render.apply(target, arguments) : null;
};
module.exports = ViewSequence;
},{}],16:[function(require,module,exports){
(function () {
    if (!window.CustomEvent)
        return;
    var clickThreshold = 300;
    var clickWindow = 500;
    var potentialClicks = {};
    var recentlyDispatched = {};
    var _now = Date.now;
    window.addEventListener('touchstart', function (event) {
        var timestamp = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            potentialClicks[touch.identifier] = timestamp;
        }
    });
    window.addEventListener('touchmove', function (event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            delete potentialClicks[touch.identifier];
        }
    });
    window.addEventListener('touchend', function (event) {
        var currTime = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var startTime = potentialClicks[touch.identifier];
            if (startTime && currTime - startTime < clickThreshold) {
                var clickEvt = new window.CustomEvent('click', {
                        'bubbles': true,
                        'detail': touch
                    });
                recentlyDispatched[currTime] = event;
                event.target.dispatchEvent(clickEvt);
            }
            delete potentialClicks[touch.identifier];
        }
    });
    window.addEventListener('click', function (event) {
        var currTime = _now();
        for (var i in recentlyDispatched) {
            var previousEvent = recentlyDispatched[i];
            if (currTime - i < clickWindow) {
                if (event instanceof window.MouseEvent && event.target === previousEvent.target)
                    event.stopPropagation();
            } else
                delete recentlyDispatched[i];
        }
    }, true);
}());
},{}],17:[function(require,module,exports){
var EventHandler = require('../core/EventHandler');
function GenericSync(syncs, options) {
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    this._syncs = {};
    if (syncs)
        this.addSync(syncs);
    if (options)
        this.setOptions(options);
}
GenericSync.DIRECTION_X = 0;
GenericSync.DIRECTION_Y = 1;
GenericSync.DIRECTION_Z = 2;
var registry = {};
GenericSync.register = function register(syncObject) {
    for (var key in syncObject) {
        if (registry[key]) {
            if (registry[key] === syncObject[key])
                return;
            else
                throw new Error('this key is registered to a different sync class');
        } else
            registry[key] = syncObject[key];
    }
};
GenericSync.prototype.setOptions = function (options) {
    for (var key in this._syncs) {
        this._syncs[key].setOptions(options);
    }
};
GenericSync.prototype.pipeSync = function pipeToSync(key) {
    var sync = this._syncs[key];
    this._eventInput.pipe(sync);
    sync.pipe(this._eventOutput);
};
GenericSync.prototype.unpipeSync = function unpipeFromSync(key) {
    var sync = this._syncs[key];
    this._eventInput.unpipe(sync);
    sync.unpipe(this._eventOutput);
};
function _addSingleSync(key, options) {
    if (!registry[key])
        return;
    this._syncs[key] = new registry[key](options);
    this.pipeSync(key);
}
GenericSync.prototype.addSync = function addSync(syncs) {
    if (syncs instanceof Array)
        for (var i = 0; i < syncs.length; i++)
            _addSingleSync.call(this, syncs[i]);
    else if (syncs instanceof Object)
        for (var key in syncs)
            _addSingleSync.call(this, key, syncs[key]);
};
module.exports = GenericSync;
},{"../core/EventHandler":7}],18:[function(require,module,exports){
var EventHandler = require('../core/EventHandler');
var OptionsManager = require('../core/OptionsManager');
function MouseSync(options) {
    this.options = Object.create(MouseSync.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    this._eventInput.on('mousedown', _handleStart.bind(this));
    this._eventInput.on('mousemove', _handleMove.bind(this));
    this._eventInput.on('mouseup', _handleEnd.bind(this));
    if (this.options.propogate)
        this._eventInput.on('mouseleave', _handleLeave.bind(this));
    else
        this._eventInput.on('mouseleave', _handleEnd.bind(this));
    this._payload = {
        delta: null,
        position: null,
        velocity: null,
        clientX: 0,
        clientY: 0,
        offsetX: 0,
        offsetY: 0
    };
    this._position = null;
    this._prevCoord = undefined;
    this._prevTime = undefined;
    this._down = false;
    this._moved = false;
}
MouseSync.DEFAULT_OPTIONS = {
    direction: undefined,
    rails: false,
    scale: 1,
    propogate: true,
    preventDefault: true
};
MouseSync.DIRECTION_X = 0;
MouseSync.DIRECTION_Y = 1;
var MINIMUM_TICK_TIME = 8;
var _now = Date.now;
function _handleStart(event) {
    var delta;
    var velocity;
    if (this.options.preventDefault)
        event.preventDefault();
    var x = event.clientX;
    var y = event.clientY;
    this._prevCoord = [
        x,
        y
    ];
    this._prevTime = _now();
    this._down = true;
    this._move = false;
    if (this.options.direction !== undefined) {
        this._position = 0;
        delta = 0;
        velocity = 0;
    } else {
        this._position = [
            0,
            0
        ];
        delta = [
            0,
            0
        ];
        velocity = [
            0,
            0
        ];
    }
    var payload = this._payload;
    payload.delta = delta;
    payload.position = this._position;
    payload.velocity = velocity;
    payload.clientX = x;
    payload.clientY = y;
    payload.offsetX = event.offsetX;
    payload.offsetY = event.offsetY;
    this._eventOutput.emit('start', payload);
}
function _handleMove(event) {
    if (!this._prevCoord)
        return;
    var prevCoord = this._prevCoord;
    var prevTime = this._prevTime;
    var x = event.clientX;
    var y = event.clientY;
    var currTime = _now();
    var diffX = x - prevCoord[0];
    var diffY = y - prevCoord[1];
    if (this.options.rails) {
        if (Math.abs(diffX) > Math.abs(diffY))
            diffY = 0;
        else
            diffX = 0;
    }
    var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);
    var velX = diffX / diffTime;
    var velY = diffY / diffTime;
    var scale = this.options.scale;
    var nextVel;
    var nextDelta;
    if (this.options.direction === MouseSync.DIRECTION_X) {
        nextDelta = scale * diffX;
        nextVel = scale * velX;
        this._position += nextDelta;
    } else if (this.options.direction === MouseSync.DIRECTION_Y) {
        nextDelta = scale * diffY;
        nextVel = scale * velY;
        this._position += nextDelta;
    } else {
        nextDelta = [
            scale * diffX,
            scale * diffY
        ];
        nextVel = [
            scale * velX,
            scale * velY
        ];
        this._position[0] += nextDelta[0];
        this._position[1] += nextDelta[1];
    }
    var payload = this._payload;
    payload.delta = nextDelta;
    payload.position = this._position;
    payload.velocity = nextVel;
    payload.clientX = x;
    payload.clientY = y;
    payload.offsetX = event.offsetX;
    payload.offsetY = event.offsetY;
    this._eventOutput.emit('update', payload);
    this._prevCoord = [
        x,
        y
    ];
    this._prevTime = currTime;
    this._move = true;
}
function _handleEnd(event) {
    if (!this._down)
        return;
    this._eventOutput.emit('end', this._payload);
    this._prevCoord = undefined;
    this._prevTime = undefined;
    this._down = false;
    this._move = false;
}
function _handleLeave(event) {
    if (!this._down || !this._move)
        return;
    var boundMove = _handleMove.bind(this);
    var boundEnd = function (event) {
            _handleEnd.call(this, event);
            document.removeEventListener('mousemove', boundMove);
            document.removeEventListener('mouseup', boundEnd);
        }.bind(this, event);
    document.addEventListener('mousemove', boundMove);
    document.addEventListener('mouseup', boundEnd);
}
MouseSync.prototype.getOptions = function getOptions() {
    return this.options;
};
MouseSync.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
module.exports = MouseSync;
},{"../core/EventHandler":7,"../core/OptionsManager":9}],19:[function(require,module,exports){
var EventHandler = require('../core/EventHandler');
var Engine = require('../core/Engine');
var OptionsManager = require('../core/OptionsManager');
function ScrollSync(options) {
    this.options = Object.create(ScrollSync.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._payload = {
        delta: null,
        position: null,
        velocity: null,
        slip: true
    };
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);
    this._position = this.options.direction === undefined ? [
        0,
        0
    ] : 0;
    this._prevTime = undefined;
    this._prevVel = undefined;
    this._eventInput.on('mousewheel', _handleMove.bind(this));
    this._eventInput.on('wheel', _handleMove.bind(this));
    this._inProgress = false;
    this._loopBound = false;
}
ScrollSync.DEFAULT_OPTIONS = {
    direction: undefined,
    minimumEndSpeed: Infinity,
    rails: false,
    scale: 1,
    stallTime: 50,
    lineHeight: 40,
    preventDefault: true
};
ScrollSync.DIRECTION_X = 0;
ScrollSync.DIRECTION_Y = 1;
var MINIMUM_TICK_TIME = 8;
var _now = Date.now;
function _newFrame() {
    if (this._inProgress && _now() - this._prevTime > this.options.stallTime) {
        this._inProgress = false;
        var finalVel = Math.abs(this._prevVel) >= this.options.minimumEndSpeed ? this._prevVel : 0;
        var payload = this._payload;
        payload.position = this._position;
        payload.velocity = finalVel;
        payload.slip = true;
        this._eventOutput.emit('end', payload);
    }
}
function _handleMove(event) {
    if (this.options.preventDefault)
        event.preventDefault();
    if (!this._inProgress) {
        this._inProgress = true;
        this._position = this.options.direction === undefined ? [
            0,
            0
        ] : 0;
        payload = this._payload;
        payload.slip = true;
        payload.position = this._position;
        payload.clientX = event.clientX;
        payload.clientY = event.clientY;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;
        this._eventOutput.emit('start', payload);
        if (!this._loopBound) {
            Engine.on('prerender', _newFrame.bind(this));
            this._loopBound = true;
        }
    }
    var currTime = _now();
    var prevTime = this._prevTime || currTime;
    var diffX = event.wheelDeltaX !== undefined ? event.wheelDeltaX : -event.deltaX;
    var diffY = event.wheelDeltaY !== undefined ? event.wheelDeltaY : -event.deltaY;
    if (event.deltaMode === 1) {
        diffX *= this.options.lineHeight;
        diffY *= this.options.lineHeight;
    }
    if (this.options.rails) {
        if (Math.abs(diffX) > Math.abs(diffY))
            diffY = 0;
        else
            diffX = 0;
    }
    var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);
    var velX = diffX / diffTime;
    var velY = diffY / diffTime;
    var scale = this.options.scale;
    var nextVel;
    var nextDelta;
    if (this.options.direction === ScrollSync.DIRECTION_X) {
        nextDelta = scale * diffX;
        nextVel = scale * velX;
        this._position += nextDelta;
    } else if (this.options.direction === ScrollSync.DIRECTION_Y) {
        nextDelta = scale * diffY;
        nextVel = scale * velY;
        this._position += nextDelta;
    } else {
        nextDelta = [
            scale * diffX,
            scale * diffY
        ];
        nextVel = [
            scale * velX,
            scale * velY
        ];
        this._position[0] += nextDelta[0];
        this._position[1] += nextDelta[1];
    }
    var payload = this._payload;
    payload.delta = nextDelta;
    payload.velocity = nextVel;
    payload.position = this._position;
    payload.slip = true;
    this._eventOutput.emit('update', payload);
    this._prevTime = currTime;
    this._prevVel = nextVel;
}
ScrollSync.prototype.getOptions = function getOptions() {
    return this.options;
};
ScrollSync.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
module.exports = ScrollSync;
},{"../core/Engine":4,"../core/EventHandler":7,"../core/OptionsManager":9}],20:[function(require,module,exports){
var TouchTracker = require('./TouchTracker');
var EventHandler = require('../core/EventHandler');
var OptionsManager = require('../core/OptionsManager');
function TouchSync(options) {
    this.options = Object.create(TouchSync.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._eventOutput = new EventHandler();
    this._touchTracker = new TouchTracker();
    EventHandler.setOutputHandler(this, this._eventOutput);
    EventHandler.setInputHandler(this, this._touchTracker);
    this._touchTracker.on('trackstart', _handleStart.bind(this));
    this._touchTracker.on('trackmove', _handleMove.bind(this));
    this._touchTracker.on('trackend', _handleEnd.bind(this));
    this._payload = {
        delta: null,
        position: null,
        velocity: null,
        clientX: undefined,
        clientY: undefined,
        count: 0,
        touch: undefined
    };
    this._position = null;
}
TouchSync.DEFAULT_OPTIONS = {
    direction: undefined,
    rails: false,
    scale: 1
};
TouchSync.DIRECTION_X = 0;
TouchSync.DIRECTION_Y = 1;
var MINIMUM_TICK_TIME = 8;
function _handleStart(data) {
    var velocity;
    var delta;
    if (this.options.direction !== undefined) {
        this._position = 0;
        velocity = 0;
        delta = 0;
    } else {
        this._position = [
            0,
            0
        ];
        velocity = [
            0,
            0
        ];
        delta = [
            0,
            0
        ];
    }
    var payload = this._payload;
    payload.delta = delta;
    payload.position = this._position;
    payload.velocity = velocity;
    payload.clientX = data.x;
    payload.clientY = data.y;
    payload.count = data.count;
    payload.touch = data.identifier;
    this._eventOutput.emit('start', payload);
}
function _handleMove(data) {
    var history = data.history;
    var currHistory = history[history.length - 1];
    var prevHistory = history[history.length - 2];
    var prevTime = prevHistory.timestamp;
    var currTime = currHistory.timestamp;
    var diffX = currHistory.x - prevHistory.x;
    var diffY = currHistory.y - prevHistory.y;
    if (this.options.rails) {
        if (Math.abs(diffX) > Math.abs(diffY))
            diffY = 0;
        else
            diffX = 0;
    }
    var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);
    var velX = diffX / diffTime;
    var velY = diffY / diffTime;
    var scale = this.options.scale;
    var nextVel;
    var nextDelta;
    if (this.options.direction === TouchSync.DIRECTION_X) {
        nextDelta = scale * diffX;
        nextVel = scale * velX;
        this._position += nextDelta;
    } else if (this.options.direction === TouchSync.DIRECTION_Y) {
        nextDelta = scale * diffY;
        nextVel = scale * velY;
        this._position += nextDelta;
    } else {
        nextDelta = [
            scale * diffX,
            scale * diffY
        ];
        nextVel = [
            scale * velX,
            scale * velY
        ];
        this._position[0] += nextDelta[0];
        this._position[1] += nextDelta[1];
    }
    var payload = this._payload;
    payload.delta = nextDelta;
    payload.velocity = nextVel;
    payload.position = this._position;
    payload.clientX = data.x;
    payload.clientY = data.y;
    payload.count = data.count;
    payload.touch = data.identifier;
    this._eventOutput.emit('update', payload);
}
function _handleEnd(data) {
    this._payload.count = data.count;
    this._eventOutput.emit('end', this._payload);
}
TouchSync.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
TouchSync.prototype.getOptions = function getOptions() {
    return this.options;
};
module.exports = TouchSync;
},{"../core/EventHandler":7,"../core/OptionsManager":9,"./TouchTracker":21}],21:[function(require,module,exports){
var EventHandler = require('../core/EventHandler');
var _now = Date.now;
function _timestampTouch(touch, event, history) {
    return {
        x: touch.clientX,
        y: touch.clientY,
        identifier: touch.identifier,
        origin: event.origin,
        timestamp: _now(),
        count: event.touches.length,
        history: history
    };
}
function _handleStart(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var data = _timestampTouch(touch, event, null);
        this.eventOutput.emit('trackstart', data);
        if (!this.selective && !this.touchHistory[touch.identifier])
            this.track(data);
    }
}
function _handleMove(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var history = this.touchHistory[touch.identifier];
        if (history) {
            var data = _timestampTouch(touch, event, history);
            this.touchHistory[touch.identifier].push(data);
            this.eventOutput.emit('trackmove', data);
        }
    }
}
function _handleEnd(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var history = this.touchHistory[touch.identifier];
        if (history) {
            var data = _timestampTouch(touch, event, history);
            this.eventOutput.emit('trackend', data);
            delete this.touchHistory[touch.identifier];
        }
    }
}
function _handleUnpipe() {
    for (var i in this.touchHistory) {
        var history = this.touchHistory[i];
        this.eventOutput.emit('trackend', {
            touch: history[history.length - 1].touch,
            timestamp: Date.now(),
            count: 0,
            history: history
        });
        delete this.touchHistory[i];
    }
}
function TouchTracker(selective) {
    this.selective = selective;
    this.touchHistory = {};
    this.eventInput = new EventHandler();
    this.eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this.eventInput);
    EventHandler.setOutputHandler(this, this.eventOutput);
    this.eventInput.on('touchstart', _handleStart.bind(this));
    this.eventInput.on('touchmove', _handleMove.bind(this));
    this.eventInput.on('touchend', _handleEnd.bind(this));
    this.eventInput.on('touchcancel', _handleEnd.bind(this));
    this.eventInput.on('unpipe', _handleUnpipe.bind(this));
}
TouchTracker.prototype.track = function track(data) {
    this.touchHistory[data.identifier] = [data];
};
module.exports = TouchTracker;
},{"../core/EventHandler":7}],22:[function(require,module,exports){
function Vector(x, y, z) {
    if (arguments.length === 1 && x !== undefined)
        this.set(x);
    else {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    return this;
}
var _register = new Vector(0, 0, 0);
Vector.prototype.add = function add(v) {
    return _setXYZ.call(_register, this.x + v.x, this.y + v.y, this.z + v.z);
};
Vector.prototype.sub = function sub(v) {
    return _setXYZ.call(_register, this.x - v.x, this.y - v.y, this.z - v.z);
};
Vector.prototype.mult = function mult(r) {
    return _setXYZ.call(_register, r * this.x, r * this.y, r * this.z);
};
Vector.prototype.div = function div(r) {
    return this.mult(1 / r);
};
Vector.prototype.cross = function cross(v) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var vx = v.x;
    var vy = v.y;
    var vz = v.z;
    return _setXYZ.call(_register, z * vy - y * vz, x * vz - z * vx, y * vx - x * vy);
};
Vector.prototype.equals = function equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z;
};
Vector.prototype.rotateX = function rotateX(theta) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    return _setXYZ.call(_register, x, y * cosTheta - z * sinTheta, y * sinTheta + z * cosTheta);
};
Vector.prototype.rotateY = function rotateY(theta) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    return _setXYZ.call(_register, z * sinTheta + x * cosTheta, y, z * cosTheta - x * sinTheta);
};
Vector.prototype.rotateZ = function rotateZ(theta) {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);
    return _setXYZ.call(_register, x * cosTheta - y * sinTheta, x * sinTheta + y * cosTheta, z);
};
Vector.prototype.dot = function dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
};
Vector.prototype.normSquared = function normSquared() {
    return this.dot(this);
};
Vector.prototype.norm = function norm() {
    return Math.sqrt(this.normSquared());
};
Vector.prototype.normalize = function normalize(length) {
    if (arguments.length === 0)
        length = 1;
    var norm = this.norm();
    if (norm > 1e-7)
        return _setFromVector.call(_register, this.mult(length / norm));
    else
        return _setXYZ.call(_register, length, 0, 0);
};
Vector.prototype.clone = function clone() {
    return new Vector(this);
};
Vector.prototype.isZero = function isZero() {
    return !(this.x || this.y || this.z);
};
function _setXYZ(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
}
function _setFromArray(v) {
    return _setXYZ.call(this, v[0], v[1], v[2] || 0);
}
function _setFromVector(v) {
    return _setXYZ.call(this, v.x, v.y, v.z);
}
function _setFromNumber(x) {
    return _setXYZ.call(this, x, 0, 0);
}
Vector.prototype.set = function set(v) {
    if (v instanceof Array)
        return _setFromArray.call(this, v);
    if (typeof v === 'number')
        return _setFromNumber.call(this, v);
    return _setFromVector.call(this, v);
};
Vector.prototype.setXYZ = function (x, y, z) {
    return _setXYZ.apply(this, arguments);
};
Vector.prototype.set1D = function (x) {
    return _setFromNumber.call(this, x);
};
Vector.prototype.put = function put(v) {
    if (this === _register)
        _setFromVector.call(v, _register);
    else
        _setFromVector.call(v, this);
};
Vector.prototype.clear = function clear() {
    return _setXYZ.call(this, 0, 0, 0);
};
Vector.prototype.cap = function cap(cap) {
    if (cap === Infinity)
        return _setFromVector.call(_register, this);
    var norm = this.norm();
    if (norm > cap)
        return _setFromVector.call(_register, this.mult(cap / norm));
    else
        return _setFromVector.call(_register, this);
};
Vector.prototype.project = function project(n) {
    return n.mult(this.dot(n));
};
Vector.prototype.reflectAcross = function reflectAcross(n) {
    n.normalize().put(n);
    return _setFromVector(_register, this.sub(this.project(n).mult(2)));
};
Vector.prototype.get = function get() {
    return [
        this.x,
        this.y,
        this.z
    ];
};
Vector.prototype.get1D = function () {
    return this.x;
};
module.exports = Vector;
},{}],23:[function(require,module,exports){
var EventHandler = require('famous/core/EventHandler');
function PhysicsEngine(options) {
    this.options = Object.create(PhysicsEngine.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this._particles = [];
    this._bodies = [];
    this._agents = {};
    this._forces = [];
    this._constraints = [];
    this._buffer = 0;
    this._prevTime = now();
    this._isSleeping = false;
    this._eventHandler = null;
    this._currAgentId = 0;
    this._hasBodies = false;
}
var TIMESTEP = 17;
var MIN_TIME_STEP = 1000 / 120;
var MAX_TIME_STEP = 17;
PhysicsEngine.DEFAULT_OPTIONS = {
    constraintSteps: 1,
    sleepTolerance: 1e-7
};
var now = function () {
        return Date.now;
    }();
PhysicsEngine.prototype.setOptions = function setOptions(opts) {
    for (var key in opts)
        if (this.options[key])
            this.options[key] = opts[key];
};
PhysicsEngine.prototype.addBody = function addBody(body) {
    body._engine = this;
    if (body.isBody) {
        this._bodies.push(body);
        this._hasBodies = true;
    } else
        this._particles.push(body);
    return body;
};
PhysicsEngine.prototype.removeBody = function removeBody(body) {
    var array = body.isBody ? this._bodies : this._particles;
    var index = array.indexOf(body);
    if (index > -1) {
        for (var i = 0; i < Object.keys(this._agents).length; i++)
            this.detachFrom(i, body);
        array.splice(index, 1);
    }
    if (this.getBodies().length === 0)
        this._hasBodies = false;
};
function _mapAgentArray(agent) {
    if (agent.applyForce)
        return this._forces;
    if (agent.applyConstraint)
        return this._constraints;
}
function _attachOne(agent, targets, source) {
    if (targets === undefined)
        targets = this.getParticlesAndBodies();
    if (!(targets instanceof Array))
        targets = [targets];
    this._agents[this._currAgentId] = {
        agent: agent,
        targets: targets,
        source: source
    };
    _mapAgentArray.call(this, agent).push(this._currAgentId);
    return this._currAgentId++;
}
PhysicsEngine.prototype.attach = function attach(agents, targets, source) {
    if (agents instanceof Array) {
        var agentIDs = [];
        for (var i = 0; i < agents.length; i++)
            agentIDs[i] = _attachOne.call(this, agents[i], targets, source);
        return agentIDs;
    } else
        return _attachOne.call(this, agents, targets, source);
};
PhysicsEngine.prototype.attachTo = function attachTo(agentID, target) {
    _getBoundAgent.call(this, agentID).targets.push(target);
};
PhysicsEngine.prototype.detach = function detach(id) {
    var agent = this.getAgent(id);
    var agentArray = _mapAgentArray.call(this, agent);
    var index = agentArray.indexOf(id);
    agentArray.splice(index, 1);
    delete this._agents[id];
};
PhysicsEngine.prototype.detachFrom = function detachFrom(id, target) {
    var boundAgent = _getBoundAgent.call(this, id);
    if (boundAgent.source === target)
        this.detach(id);
    else {
        var targets = boundAgent.targets;
        var index = targets.indexOf(target);
        if (index > -1)
            targets.splice(index, 1);
    }
};
PhysicsEngine.prototype.detachAll = function detachAll() {
    this._agents = {};
    this._forces = [];
    this._constraints = [];
    this._currAgentId = 0;
};
function _getBoundAgent(id) {
    return this._agents[id];
}
PhysicsEngine.prototype.getAgent = function getAgent(id) {
    return _getBoundAgent.call(this, id).agent;
};
PhysicsEngine.prototype.getParticles = function getParticles() {
    return this._particles;
};
PhysicsEngine.prototype.getBodies = function getBodies() {
    return this._bodies;
};
PhysicsEngine.prototype.getParticlesAndBodies = function getParticlesAndBodies() {
    return this.getParticles().concat(this.getBodies());
};
PhysicsEngine.prototype.forEachParticle = function forEachParticle(fn, dt) {
    var particles = this.getParticles();
    for (var index = 0, len = particles.length; index < len; index++)
        fn.call(this, particles[index], dt);
};
PhysicsEngine.prototype.forEachBody = function forEachBody(fn, dt) {
    if (!this._hasBodies)
        return;
    var bodies = this.getBodies();
    for (var index = 0, len = bodies.length; index < len; index++)
        fn.call(this, bodies[index], dt);
};
PhysicsEngine.prototype.forEach = function forEach(fn, dt) {
    this.forEachParticle(fn, dt);
    this.forEachBody(fn, dt);
};
function _updateForce(index) {
    var boundAgent = _getBoundAgent.call(this, this._forces[index]);
    boundAgent.agent.applyForce(boundAgent.targets, boundAgent.source);
}
function _updateForces() {
    for (var index = this._forces.length - 1; index > -1; index--)
        _updateForce.call(this, index);
}
function _updateConstraint(index, dt) {
    var boundAgent = this._agents[this._constraints[index]];
    return boundAgent.agent.applyConstraint(boundAgent.targets, boundAgent.source, dt);
}
function _updateConstraints(dt) {
    var iteration = 0;
    while (iteration < this.options.constraintSteps) {
        for (var index = this._constraints.length - 1; index > -1; index--)
            _updateConstraint.call(this, index, dt);
        iteration++;
    }
}
function _updateVelocities(particle, dt) {
    particle.integrateVelocity(dt);
}
function _updateAngularVelocities(body, dt) {
    body.integrateAngularMomentum(dt);
    body.updateAngularVelocity();
}
function _updateOrientations(body, dt) {
    body.integrateOrientation(dt);
}
function _updatePositions(particle, dt) {
    particle.integratePosition(dt);
    particle.emit('update', particle);
}
function _integrate(dt) {
    _updateForces.call(this, dt);
    this.forEach(_updateVelocities, dt);
    this.forEachBody(_updateAngularVelocities, dt);
    _updateConstraints.call(this, dt);
    this.forEachBody(_updateOrientations, dt);
    this.forEach(_updatePositions, dt);
}
function _getEnergyParticles() {
    var energy = 0;
    var particleEnergy = 0;
    this.forEach(function (particle) {
        particleEnergy = particle.getEnergy();
        energy += particleEnergy;
        if (particleEnergy < particle.sleepTolerance)
            particle.sleep();
    });
    return energy;
}
function _getEnergyForces() {
    var energy = 0;
    for (var index = this._forces.length - 1; index > -1; index--)
        energy += this._forces[index].getEnergy() || 0;
    return energy;
}
function _getEnergyConstraints() {
    var energy = 0;
    for (var index = this._constraints.length - 1; index > -1; index--)
        energy += this._constraints[index].getEnergy() || 0;
    return energy;
}
PhysicsEngine.prototype.getEnergy = function getEnergy() {
    return _getEnergyParticles.call(this) + _getEnergyForces.call(this) + _getEnergyConstraints.call(this);
};
PhysicsEngine.prototype.step = function step() {
    var currTime = now();
    var dtFrame = currTime - this._prevTime;
    this._prevTime = currTime;
    if (dtFrame < MIN_TIME_STEP)
        return;
    if (dtFrame > MAX_TIME_STEP)
        dtFrame = MAX_TIME_STEP;
    _integrate.call(this, TIMESTEP);
};
PhysicsEngine.prototype.isSleeping = function isSleeping() {
    return this._isSleeping;
};
PhysicsEngine.prototype.sleep = function sleep() {
    this.emit('end', this);
    this._isSleeping = true;
};
PhysicsEngine.prototype.wake = function wake() {
    this._prevTime = now();
    this.emit('start', this);
    this._isSleeping = false;
};
PhysicsEngine.prototype.emit = function emit(type, data) {
    if (this._eventHandler === null)
        return;
    this._eventHandler.emit(type, data);
};
PhysicsEngine.prototype.on = function on(event, fn) {
    if (this._eventHandler === null)
        this._eventHandler = new EventHandler();
    this._eventHandler.on(event, fn);
};
module.exports = PhysicsEngine;
},{"famous/core/EventHandler":7}],24:[function(require,module,exports){
var Vector = require('famous/math/Vector');
var Transform = require('famous/core/Transform');
var EventHandler = require('famous/core/EventHandler');
var Integrator = require('../integrators/SymplecticEuler');
function Particle(options) {
    options = options || {};
    this.position = new Vector();
    this.velocity = new Vector();
    this.force = new Vector();
    var defaults = Particle.DEFAULT_OPTIONS;
    this.setPosition(options.position || defaults.position);
    this.setVelocity(options.velocity || defaults.velocity);
    this.force.set(options.force || [
        0,
        0,
        0
    ]);
    this.mass = options.mass !== undefined ? options.mass : defaults.mass;
    this.axis = options.axis !== undefined ? options.axis : defaults.axis;
    this.inverseMass = 1 / this.mass;
    this._isSleeping = false;
    this._engine = null;
    this._eventOutput = null;
    this._positionGetter = null;
    this.transform = Transform.identity.slice();
    this._spec = {
        transform: this.transform,
        target: null
    };
}
Particle.DEFAULT_OPTIONS = {
    position: [
        0,
        0,
        0
    ],
    velocity: [
        0,
        0,
        0
    ],
    mass: 1,
    axis: undefined
};
Particle.SLEEP_TOLERANCE = 1e-7;
Particle.AXES = {
    X: 0,
    Y: 1,
    Z: 2
};
Particle.INTEGRATOR = new Integrator();
var _events = {
        start: 'start',
        update: 'update',
        end: 'end'
    };
var now = function () {
        return Date.now;
    }();
Particle.prototype.sleep = function sleep() {
    if (this._isSleeping)
        return;
    this.emit(_events.end, this);
    this._isSleeping = true;
};
Particle.prototype.wake = function wake() {
    if (!this._isSleeping)
        return;
    this.emit(_events.start, this);
    this._isSleeping = false;
    this._prevTime = now();
};
Particle.prototype.isBody = false;
Particle.prototype.setPosition = function setPosition(position) {
    this.position.set(position);
};
Particle.prototype.setPosition1D = function setPosition1D(x) {
    this.position.x = x;
};
Particle.prototype.getPosition = function getPosition() {
    if (this._positionGetter instanceof Function)
        this.setPosition(this._positionGetter());
    this._engine.step();
    return this.position.get();
};
Particle.prototype.getPosition1D = function getPosition1D() {
    this._engine.step();
    return this.position.x;
};
Particle.prototype.positionFrom = function positionFrom(positionGetter) {
    this._positionGetter = positionGetter;
};
Particle.prototype.setVelocity = function setVelocity(velocity) {
    this.velocity.set(velocity);
    this.wake();
};
Particle.prototype.setVelocity1D = function setVelocity1D(x) {
    this.velocity.x = x;
    this.wake();
};
Particle.prototype.getVelocity = function getVelocity() {
    return this.velocity.get();
};
Particle.prototype.getVelocity1D = function getVelocity1D() {
    return this.velocity.x;
};
Particle.prototype.setMass = function setMass(mass) {
    this.mass = mass;
    this.inverseMass = 1 / mass;
};
Particle.prototype.getMass = function getMass() {
    return this.mass;
};
Particle.prototype.reset = function reset(position, velocity) {
    this.setPosition(position || [
        0,
        0,
        0
    ]);
    this.setVelocity(velocity || [
        0,
        0,
        0
    ]);
};
Particle.prototype.applyForce = function applyForce(force) {
    if (force.isZero())
        return;
    this.force.add(force).put(this.force);
    this.wake();
};
Particle.prototype.applyImpulse = function applyImpulse(impulse) {
    if (impulse.isZero())
        return;
    var velocity = this.velocity;
    velocity.add(impulse.mult(this.inverseMass)).put(velocity);
};
Particle.prototype.integrateVelocity = function integrateVelocity(dt) {
    Particle.INTEGRATOR.integrateVelocity(this, dt);
};
Particle.prototype.integratePosition = function integratePosition(dt) {
    Particle.INTEGRATOR.integratePosition(this, dt);
};
Particle.prototype._integrate = function _integrate(dt) {
    this.integrateVelocity(dt);
    this.integratePosition(dt);
};
Particle.prototype.getEnergy = function getEnergy() {
    return 0.5 * this.mass * this.velocity.normSquared();
};
Particle.prototype.getTransform = function getTransform() {
    this._engine.step();
    var position = this.position;
    var axis = this.axis;
    var transform = this.transform;
    if (axis !== undefined) {
        if (axis & ~Particle.AXES.X) {
            position.x = 0;
        }
        if (axis & ~Particle.AXES.Y) {
            position.y = 0;
        }
        if (axis & ~Particle.AXES.Z) {
            position.z = 0;
        }
    }
    transform[12] = position.x;
    transform[13] = position.y;
    transform[14] = position.z;
    return transform;
};
Particle.prototype.modify = function modify(target) {
    var _spec = this._spec;
    _spec.transform = this.getTransform();
    _spec.target = target;
    return _spec;
};
function _createEventOutput() {
    this._eventOutput = new EventHandler();
    this._eventOutput.bindThis(this);
    EventHandler.setOutputHandler(this, this._eventOutput);
}
Particle.prototype.emit = function emit(type, data) {
    if (!this._eventOutput)
        return;
    this._eventOutput.emit(type, data);
};
Particle.prototype.on = function on() {
    _createEventOutput.call(this);
    return this.on.apply(this, arguments);
};
Particle.prototype.removeListener = function removeListener() {
    _createEventOutput.call(this);
    return this.removeListener.apply(this, arguments);
};
Particle.prototype.pipe = function pipe() {
    _createEventOutput.call(this);
    return this.pipe.apply(this, arguments);
};
Particle.prototype.unpipe = function unpipe() {
    _createEventOutput.call(this);
    return this.unpipe.apply(this, arguments);
};
module.exports = Particle;
},{"../integrators/SymplecticEuler":30,"famous/core/EventHandler":7,"famous/core/Transform":13,"famous/math/Vector":22}],25:[function(require,module,exports){
var EventHandler = require('famous/core/EventHandler');
function Constraint() {
    this.options = this.options || {};
    this._energy = 0;
    this._eventOutput = null;
}
Constraint.prototype.setOptions = function setOptions(options) {
    for (var key in options)
        this.options[key] = options[key];
};
Constraint.prototype.applyConstraint = function applyConstraint() {
};
Constraint.prototype.getEnergy = function getEnergy() {
    return this._energy;
};
Constraint.prototype.setEnergy = function setEnergy(energy) {
    this._energy = energy;
};
function _createEventOutput() {
    this._eventOutput = new EventHandler();
    this._eventOutput.bindThis(this);
    EventHandler.setOutputHandler(this, this._eventOutput);
}
Constraint.prototype.on = function on() {
    _createEventOutput.call(this);
    return this.on.apply(this, arguments);
};
Constraint.prototype.addListener = function addListener() {
    _createEventOutput.call(this);
    return this.addListener.apply(this, arguments);
};
Constraint.prototype.pipe = function pipe() {
    _createEventOutput.call(this);
    return this.pipe.apply(this, arguments);
};
Constraint.prototype.removeListener = function removeListener() {
    return this.removeListener.apply(this, arguments);
};
Constraint.prototype.unpipe = function unpipe() {
    return this.unpipe.apply(this, arguments);
};
module.exports = Constraint;
},{"famous/core/EventHandler":7}],26:[function(require,module,exports){
var Constraint = require('./Constraint');
var Vector = require('famous/math/Vector');
function Snap(options) {
    this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this.pDiff = new Vector();
    this.vDiff = new Vector();
    this.impulse1 = new Vector();
    this.impulse2 = new Vector();
    Constraint.call(this);
}
Snap.prototype = Object.create(Constraint.prototype);
Snap.prototype.constructor = Snap;
Snap.DEFAULT_OPTIONS = {
    period: 300,
    dampingRatio: 0.1,
    length: 0,
    anchor: undefined
};
var pi = Math.PI;
function _calcEnergy(impulse, disp, dt) {
    return Math.abs(impulse.dot(disp) / dt);
}
Snap.prototype.setOptions = function setOptions(options) {
    if (options.anchor !== undefined) {
        if (options.anchor instanceof Vector)
            this.options.anchor = options.anchor;
        if (options.anchor.position instanceof Vector)
            this.options.anchor = options.anchor.position;
        if (options.anchor instanceof Array)
            this.options.anchor = new Vector(options.anchor);
    }
    if (options.length !== undefined)
        this.options.length = options.length;
    if (options.dampingRatio !== undefined)
        this.options.dampingRatio = options.dampingRatio;
    if (options.period !== undefined)
        this.options.period = options.period;
};
Snap.prototype.setAnchor = function setAnchor(v) {
    if (this.options.anchor !== undefined)
        this.options.anchor = new Vector();
    this.options.anchor.set(v);
};
Snap.prototype.getEnergy = function getEnergy(target, source) {
    var options = this.options;
    var restLength = options.length;
    var anchor = options.anchor || source.position;
    var strength = Math.pow(2 * pi / options.period, 2);
    var dist = anchor.sub(target.position).norm() - restLength;
    return 0.5 * strength * dist * dist;
};
Snap.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
    var options = this.options;
    var pDiff = this.pDiff;
    var vDiff = this.vDiff;
    var impulse1 = this.impulse1;
    var impulse2 = this.impulse2;
    var length = options.length;
    var anchor = options.anchor || source.position;
    var period = options.period;
    var dampingRatio = options.dampingRatio;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var p1 = target.position;
        var v1 = target.velocity;
        var m1 = target.mass;
        var w1 = target.inverseMass;
        pDiff.set(p1.sub(anchor));
        var dist = pDiff.norm() - length;
        var effMass;
        if (source) {
            var w2 = source.inverseMass;
            var v2 = source.velocity;
            vDiff.set(v1.sub(v2));
            effMass = 1 / (w1 + w2);
        } else {
            vDiff.set(v1);
            effMass = m1;
        }
        var gamma;
        var beta;
        if (this.options.period === 0) {
            gamma = 0;
            beta = 1;
        } else {
            var k = 4 * effMass * pi * pi / (period * period);
            var c = 4 * effMass * pi * dampingRatio / period;
            beta = dt * k / (c + dt * k);
            gamma = 1 / (c + dt * k);
        }
        var antiDrift = beta / dt * dist;
        pDiff.normalize(-antiDrift).sub(vDiff).mult(dt / (gamma + dt / effMass)).put(impulse1);
        target.applyImpulse(impulse1);
        if (source) {
            impulse1.mult(-1).put(impulse2);
            source.applyImpulse(impulse2);
        }
        this.setEnergy(_calcEnergy(impulse1, pDiff, dt));
    }
};
module.exports = Snap;
},{"./Constraint":25,"famous/math/Vector":22}],27:[function(require,module,exports){
var Constraint = require('./Constraint');
var Vector = require('famous/math/Vector');
function Wall(options) {
    this.options = Object.create(Wall.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this.diff = new Vector();
    this.impulse = new Vector();
    Constraint.call(this);
}
Wall.prototype = Object.create(Constraint.prototype);
Wall.prototype.constructor = Wall;
Wall.ON_CONTACT = {
    REFLECT: 0,
    SILENT: 1
};
Wall.DEFAULT_OPTIONS = {
    restitution: 0.5,
    drift: 0.5,
    slop: 0,
    normal: [
        1,
        0,
        0
    ],
    distance: 0,
    onContact: Wall.ON_CONTACT.REFLECT
};
Wall.prototype.setOptions = function setOptions(options) {
    if (options.normal !== undefined) {
        if (options.normal instanceof Vector)
            this.options.normal = options.normal.clone();
        if (options.normal instanceof Array)
            this.options.normal = new Vector(options.normal);
    }
    if (options.restitution !== undefined)
        this.options.restitution = options.restitution;
    if (options.drift !== undefined)
        this.options.drift = options.drift;
    if (options.slop !== undefined)
        this.options.slop = options.slop;
    if (options.distance !== undefined)
        this.options.distance = options.distance;
    if (options.onContact !== undefined)
        this.options.onContact = options.onContact;
};
function _getNormalVelocity(n, v) {
    return v.dot(n);
}
function _getDistanceFromOrigin(p) {
    var n = this.options.normal;
    var d = this.options.distance;
    return p.dot(n) + d;
}
function _onEnter(particle, overlap, dt) {
    var p = particle.position;
    var v = particle.velocity;
    var m = particle.mass;
    var n = this.options.normal;
    var action = this.options.onContact;
    var restitution = this.options.restitution;
    var impulse = this.impulse;
    var drift = this.options.drift;
    var slop = -this.options.slop;
    var gamma = 0;
    if (this._eventOutput) {
        var data = {
                particle: particle,
                wall: this,
                overlap: overlap,
                normal: n
            };
        this._eventOutput.emit('preCollision', data);
        this._eventOutput.emit('collision', data);
    }
    switch (action) {
    case Wall.ON_CONTACT.REFLECT:
        var lambda = overlap < slop ? -((1 + restitution) * n.dot(v) + drift / dt * (overlap - slop)) / (m * dt + gamma) : -((1 + restitution) * n.dot(v)) / (m * dt + gamma);
        impulse.set(n.mult(dt * lambda));
        particle.applyImpulse(impulse);
        particle.setPosition(p.add(n.mult(-overlap)));
        break;
    }
    if (this._eventOutput)
        this._eventOutput.emit('postCollision', data);
}
function _onExit(particle, overlap, dt) {
    var action = this.options.onContact;
    var p = particle.position;
    var n = this.options.normal;
    if (action === Wall.ON_CONTACT.REFLECT) {
        particle.setPosition(p.add(n.mult(-overlap)));
    }
}
Wall.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
    var n = this.options.normal;
    for (var i = 0; i < targets.length; i++) {
        var particle = targets[i];
        var p = particle.position;
        var v = particle.velocity;
        var r = particle.radius || 0;
        var overlap = _getDistanceFromOrigin.call(this, p.add(n.mult(-r)));
        var nv = _getNormalVelocity.call(this, n, v);
        if (overlap <= 0) {
            if (nv < 0)
                _onEnter.call(this, particle, overlap, dt);
            else
                _onExit.call(this, particle, overlap, dt);
        }
    }
};
module.exports = Wall;
},{"./Constraint":25,"famous/math/Vector":22}],28:[function(require,module,exports){
var Vector = require('famous/math/Vector');
var EventHandler = require('famous/core/EventHandler');
function Force(force) {
    this.force = new Vector(force);
    this._energy = 0;
    this._eventOutput = null;
}
Force.prototype.setOptions = function setOptions(options) {
    for (var key in options)
        this.options[key] = options[key];
};
Force.prototype.applyForce = function applyForce(body) {
    body.applyForce(this.force);
};
Force.prototype.getEnergy = function getEnergy() {
    return this._energy;
};
Force.prototype.setEnergy = function setEnergy(energy) {
    this._energy = energy;
};
function _createEventOutput() {
    this._eventOutput = new EventHandler();
    this._eventOutput.bindThis(this);
    EventHandler.setOutputHandler(this, this._eventOutput);
}
Force.prototype.on = function on() {
    _createEventOutput.call(this);
    return this.on.apply(this, arguments);
};
Force.prototype.addListener = function addListener() {
    _createEventOutput.call(this);
    return this.addListener.apply(this, arguments);
};
Force.prototype.pipe = function pipe() {
    _createEventOutput.call(this);
    return this.pipe.apply(this, arguments);
};
Force.prototype.removeListener = function removeListener() {
    return this.removeListener.apply(this, arguments);
};
Force.prototype.unpipe = function unpipe() {
    return this.unpipe.apply(this, arguments);
};
module.exports = Force;
},{"famous/core/EventHandler":7,"famous/math/Vector":22}],29:[function(require,module,exports){
var Force = require('./Force');
var Vector = require('famous/math/Vector');
function Spring(options) {
    this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this.disp = new Vector(0, 0, 0);
    _init.call(this);
    Force.call(this);
}
Spring.prototype = Object.create(Force.prototype);
Spring.prototype.constructor = Spring;
var pi = Math.PI;
Spring.FORCE_FUNCTIONS = {
    FENE: function (dist, rMax) {
        var rMaxSmall = rMax * 0.99;
        var r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
        return r / (1 - r * r / (rMax * rMax));
    },
    HOOK: function (dist) {
        return dist;
    }
};
Spring.DEFAULT_OPTIONS = {
    period: 300,
    dampingRatio: 0.1,
    length: 0,
    maxLength: Infinity,
    anchor: undefined,
    forceFunction: Spring.FORCE_FUNCTIONS.HOOK
};
function _setForceFunction(fn) {
    this.forceFunction = fn;
}
function _calcStiffness() {
    var options = this.options;
    options.stiffness = Math.pow(2 * pi / options.period, 2);
}
function _calcDamping() {
    var options = this.options;
    options.damping = 4 * pi * options.dampingRatio / options.period;
}
function _calcEnergy(strength, dist) {
    return 0.5 * strength * dist * dist;
}
function _init() {
    _setForceFunction.call(this, this.options.forceFunction);
    _calcStiffness.call(this);
    _calcDamping.call(this);
}
Spring.prototype.setOptions = function setOptions(options) {
    if (options.anchor !== undefined) {
        if (options.anchor.position instanceof Vector)
            this.options.anchor = options.anchor.position;
        if (options.anchor instanceof Vector)
            this.options.anchor = options.anchor;
        if (options.anchor instanceof Array)
            this.options.anchor = new Vector(options.anchor);
    }
    if (options.period !== undefined)
        this.options.period = options.period;
    if (options.dampingRatio !== undefined)
        this.options.dampingRatio = options.dampingRatio;
    if (options.length !== undefined)
        this.options.length = options.length;
    if (options.forceFunction !== undefined)
        this.options.forceFunction = options.forceFunction;
    if (options.maxLength !== undefined)
        this.options.maxLength = options.maxLength;
    _init.call(this);
};
Spring.prototype.applyForce = function applyForce(targets, source) {
    var force = this.force;
    var disp = this.disp;
    var options = this.options;
    var stiffness = options.stiffness;
    var damping = options.damping;
    var restLength = options.length;
    var lMax = options.maxLength;
    var anchor = options.anchor || source.position;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var p2 = target.position;
        var v2 = target.velocity;
        anchor.sub(p2).put(disp);
        var dist = disp.norm() - restLength;
        if (dist === 0)
            return;
        var m = target.mass;
        stiffness *= m;
        damping *= m;
        disp.normalize(stiffness * this.forceFunction(dist, lMax)).put(force);
        if (damping)
            if (source)
                force.add(v2.sub(source.velocity).mult(-damping)).put(force);
            else
                force.add(v2.mult(-damping)).put(force);
        target.applyForce(force);
        if (source)
            source.applyForce(force.mult(-1));
        this.setEnergy(_calcEnergy(stiffness, dist));
    }
};
Spring.prototype.getEnergy = function getEnergy(target) {
    var options = this.options;
    var restLength = options.length;
    var anchor = options.anchor;
    var strength = options.stiffness;
    var dist = anchor.sub(target.position).norm() - restLength;
    return 0.5 * strength * dist * dist;
};
Spring.prototype.setAnchor = function setAnchor(anchor) {
    if (!this.options.anchor)
        this.options.anchor = new Vector();
    this.options.anchor.set(anchor);
};
module.exports = Spring;
},{"./Force":28,"famous/math/Vector":22}],30:[function(require,module,exports){
var OptionsManager = require('famous/core/OptionsManager');
function SymplecticEuler(options) {
    this.options = Object.create(SymplecticEuler.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
}
SymplecticEuler.DEFAULT_OPTIONS = {
    velocityCap: undefined,
    angularVelocityCap: undefined
};
SymplecticEuler.prototype.setOptions = function setOptions(options) {
    this._optionsManager.patch(options);
};
SymplecticEuler.prototype.getOptions = function getOptions() {
    return this._optionsManager.value();
};
SymplecticEuler.prototype.integrateVelocity = function integrateVelocity(body, dt) {
    var v = body.velocity;
    var w = body.inverseMass;
    var f = body.force;
    if (f.isZero())
        return;
    v.add(f.mult(dt * w)).put(v);
    f.clear();
};
SymplecticEuler.prototype.integratePosition = function integratePosition(body, dt) {
    var p = body.position;
    var v = body.velocity;
    if (this.options.velocityCap)
        v.cap(this.options.velocityCap).put(v);
    p.add(v.mult(dt)).put(p);
};
SymplecticEuler.prototype.integrateAngularMomentum = function integrateAngularMomentum(body, dt) {
    var L = body.angularMomentum;
    var t = body.torque;
    if (t.isZero())
        return;
    if (this.options.angularVelocityCap)
        t.cap(this.options.angularVelocityCap).put(t);
    L.add(t.mult(dt)).put(L);
    t.clear();
};
SymplecticEuler.prototype.integrateOrientation = function integrateOrientation(body, dt) {
    var q = body.orientation;
    var w = body.angularVelocity;
    if (w.isZero())
        return;
    q.add(q.multiply(w).scalarMultiply(0.5 * dt)).put(q);
};
module.exports = SymplecticEuler;
},{"famous/core/OptionsManager":9}],31:[function(require,module,exports){
var Surface = require('famous/core/Surface');
var Context = require('famous/core/Context');
function ContainerSurface(options) {
    Surface.call(this, options);
    this._container = document.createElement('div');
    this._container.classList.add('famous-group');
    this._container.classList.add('famous-container-group');
    this._shouldRecalculateSize = false;
    this.context = new Context(this._container);
    this.setContent(this._container);
}
ContainerSurface.prototype = Object.create(Surface.prototype);
ContainerSurface.prototype.constructor = ContainerSurface;
ContainerSurface.prototype.elementType = 'div';
ContainerSurface.prototype.elementClass = 'famous-surface';
ContainerSurface.prototype.add = function add() {
    return this.context.add.apply(this.context, arguments);
};
ContainerSurface.prototype.render = function render() {
    if (this._sizeDirty)
        this._shouldRecalculateSize = true;
    return Surface.prototype.render.apply(this, arguments);
};
ContainerSurface.prototype.deploy = function deploy() {
    this._shouldRecalculateSize = true;
    return Surface.prototype.deploy.apply(this, arguments);
};
ContainerSurface.prototype.commit = function commit(context, transform, opacity, origin, size) {
    var previousSize = this._size ? [
            this._size[0],
            this._size[1]
        ] : null;
    var result = Surface.prototype.commit.apply(this, arguments);
    if (this._shouldRecalculateSize || previousSize && (this._size[0] !== previousSize[0] || this._size[1] !== previousSize[1])) {
        this.context.setSize();
        this._shouldRecalculateSize = false;
    }
    this.context.update();
    return result;
};
module.exports = ContainerSurface;
},{"famous/core/Context":1,"famous/core/Surface":12}],32:[function(require,module,exports){
var Surface = require('famous/core/Surface');
function ImageSurface(options) {
    this._imageUrl = undefined;
    Surface.apply(this, arguments);
}
var urlCache = [];
var countCache = [];
var nodeCache = [];
var cacheEnabled = true;
ImageSurface.enableCache = function enableCache() {
    cacheEnabled = true;
};
ImageSurface.disableCache = function disableCache() {
    cacheEnabled = false;
};
ImageSurface.clearCache = function clearCache() {
    urlCache = [];
    countCache = [];
    nodeCache = [];
};
ImageSurface.getCache = function getCache() {
    return {
        urlCache: urlCache,
        countCache: countCache,
        nodeCache: countCache
    };
};
ImageSurface.prototype = Object.create(Surface.prototype);
ImageSurface.prototype.constructor = ImageSurface;
ImageSurface.prototype.elementType = 'img';
ImageSurface.prototype.elementClass = 'famous-surface';
ImageSurface.prototype.setContent = function setContent(imageUrl) {
    var urlIndex = urlCache.indexOf(this._imageUrl);
    if (urlIndex !== -1) {
        if (countCache[urlIndex] === 1) {
            urlCache.splice(urlIndex, 1);
            countCache.splice(urlIndex, 1);
            nodeCache.splice(urlIndex, 1);
        } else {
            countCache[urlIndex]--;
        }
    }
    urlIndex = urlCache.indexOf(imageUrl);
    if (urlIndex === -1) {
        urlCache.push(imageUrl);
        countCache.push(1);
    } else {
        countCache[urlIndex]++;
    }
    this._imageUrl = imageUrl;
    this._contentDirty = true;
};
ImageSurface.prototype.deploy = function deploy(target) {
    var urlIndex = urlCache.indexOf(this._imageUrl);
    if (nodeCache[urlIndex] === undefined && cacheEnabled) {
        var img = new Image();
        img.src = this._imageUrl || '';
        nodeCache[urlIndex] = img;
    }
    target.src = this._imageUrl || '';
};
ImageSurface.prototype.recall = function recall(target) {
    target.src = '';
};
module.exports = ImageSurface;
},{"famous/core/Surface":12}],33:[function(require,module,exports){
var Easing = {
        inQuad: function (t) {
            return t * t;
        },
        outQuad: function (t) {
            return -(t -= 1) * t + 1;
        },
        inOutQuad: function (t) {
            if ((t /= 0.5) < 1)
                return 0.5 * t * t;
            return -0.5 * (--t * (t - 2) - 1);
        },
        inCubic: function (t) {
            return t * t * t;
        },
        outCubic: function (t) {
            return --t * t * t + 1;
        },
        inOutCubic: function (t) {
            if ((t /= 0.5) < 1)
                return 0.5 * t * t * t;
            return 0.5 * ((t -= 2) * t * t + 2);
        },
        inQuart: function (t) {
            return t * t * t * t;
        },
        outQuart: function (t) {
            return -(--t * t * t * t - 1);
        },
        inOutQuart: function (t) {
            if ((t /= 0.5) < 1)
                return 0.5 * t * t * t * t;
            return -0.5 * ((t -= 2) * t * t * t - 2);
        },
        inQuint: function (t) {
            return t * t * t * t * t;
        },
        outQuint: function (t) {
            return --t * t * t * t * t + 1;
        },
        inOutQuint: function (t) {
            if ((t /= 0.5) < 1)
                return 0.5 * t * t * t * t * t;
            return 0.5 * ((t -= 2) * t * t * t * t + 2);
        },
        inSine: function (t) {
            return -1 * Math.cos(t * (Math.PI / 2)) + 1;
        },
        outSine: function (t) {
            return Math.sin(t * (Math.PI / 2));
        },
        inOutSine: function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        },
        inExpo: function (t) {
            return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
        },
        outExpo: function (t) {
            return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
        },
        inOutExpo: function (t) {
            if (t === 0)
                return 0;
            if (t === 1)
                return 1;
            if ((t /= 0.5) < 1)
                return 0.5 * Math.pow(2, 10 * (t - 1));
            return 0.5 * (-Math.pow(2, -10 * --t) + 2);
        },
        inCirc: function (t) {
            return -(Math.sqrt(1 - t * t) - 1);
        },
        outCirc: function (t) {
            return Math.sqrt(1 - --t * t);
        },
        inOutCirc: function (t) {
            if ((t /= 0.5) < 1)
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        },
        inElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t === 0)
                return 0;
            if (t === 1)
                return 1;
            if (!p)
                p = 0.3;
            s = p / (2 * Math.PI) * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        },
        outElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t === 0)
                return 0;
            if (t === 1)
                return 1;
            if (!p)
                p = 0.3;
            s = p / (2 * Math.PI) * Math.asin(1 / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
        },
        inOutElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t === 0)
                return 0;
            if ((t /= 0.5) === 2)
                return 1;
            if (!p)
                p = 0.3 * 1.5;
            s = p / (2 * Math.PI) * Math.asin(1 / a);
            if (t < 1)
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
        },
        inBack: function (t, s) {
            if (s === undefined)
                s = 1.70158;
            return t * t * ((s + 1) * t - s);
        },
        outBack: function (t, s) {
            if (s === undefined)
                s = 1.70158;
            return --t * t * ((s + 1) * t + s) + 1;
        },
        inOutBack: function (t, s) {
            if (s === undefined)
                s = 1.70158;
            if ((t /= 0.5) < 1)
                return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
            return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
        },
        inBounce: function (t) {
            return 1 - Easing.outBounce(1 - t);
        },
        outBounce: function (t) {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        },
        inOutBounce: function (t) {
            if (t < 0.5)
                return Easing.inBounce(t * 2) * 0.5;
            return Easing.outBounce(t * 2 - 1) * 0.5 + 0.5;
        }
    };
module.exports = Easing;
},{}],34:[function(require,module,exports){
var Utility = require('famous/utilities/Utility');
function MultipleTransition(method) {
    this.method = method;
    this._instances = [];
    this.state = [];
}
MultipleTransition.SUPPORTS_MULTIPLE = true;
MultipleTransition.prototype.get = function get() {
    for (var i = 0; i < this._instances.length; i++) {
        this.state[i] = this._instances[i].get();
    }
    return this.state;
};
MultipleTransition.prototype.set = function set(endState, transition, callback) {
    var _allCallback = Utility.after(endState.length, callback);
    for (var i = 0; i < endState.length; i++) {
        if (!this._instances[i])
            this._instances[i] = new this.method();
        this._instances[i].set(endState[i], transition, _allCallback);
    }
};
MultipleTransition.prototype.reset = function reset(startState) {
    for (var i = 0; i < startState.length; i++) {
        if (!this._instances[i])
            this._instances[i] = new this.method();
        this._instances[i].reset(startState[i]);
    }
};
module.exports = MultipleTransition;
},{"famous/utilities/Utility":42}],35:[function(require,module,exports){
var PE = require('famous/physics/PhysicsEngine');
var Particle = require('famous/physics/bodies/Particle');
var Spring = require('famous/physics/constraints/Snap');
var Vector = require('famous/math/Vector');
function SnapTransition(state) {
    state = state || 0;
    this.endState = new Vector(state);
    this.initState = new Vector();
    this._dimensions = 1;
    this._restTolerance = 1e-10;
    this._absRestTolerance = this._restTolerance;
    this._callback = undefined;
    this.PE = new PE();
    this.particle = new Particle();
    this.spring = new Spring({ anchor: this.endState });
    this.PE.addBody(this.particle);
    this.PE.attach(this.spring, this.particle);
}
SnapTransition.SUPPORTS_MULTIPLE = 3;
SnapTransition.DEFAULT_OPTIONS = {
    period: 100,
    dampingRatio: 0.2,
    velocity: 0
};
function _getEnergy() {
    return this.particle.getEnergy() + this.spring.getEnergy(this.particle);
}
function _setAbsoluteRestTolerance() {
    var distance = this.endState.sub(this.initState).normSquared();
    this._absRestTolerance = distance === 0 ? this._restTolerance : this._restTolerance * distance;
}
function _setTarget(target) {
    this.endState.set(target);
    _setAbsoluteRestTolerance.call(this);
}
function _wake() {
    this.PE.wake();
}
function _sleep() {
    this.PE.sleep();
}
function _setParticlePosition(p) {
    this.particle.position.set(p);
}
function _setParticleVelocity(v) {
    this.particle.velocity.set(v);
}
function _getParticlePosition() {
    return this._dimensions === 0 ? this.particle.getPosition1D() : this.particle.getPosition();
}
function _getParticleVelocity() {
    return this._dimensions === 0 ? this.particle.getVelocity1D() : this.particle.getVelocity();
}
function _setCallback(callback) {
    this._callback = callback;
}
function _setupDefinition(definition) {
    var defaults = SnapTransition.DEFAULT_OPTIONS;
    if (definition.period === undefined)
        definition.period = defaults.period;
    if (definition.dampingRatio === undefined)
        definition.dampingRatio = defaults.dampingRatio;
    if (definition.velocity === undefined)
        definition.velocity = defaults.velocity;
    this.spring.setOptions({
        period: definition.period,
        dampingRatio: definition.dampingRatio
    });
    _setParticleVelocity.call(this, definition.velocity);
}
function _update() {
    if (this.PE.isSleeping()) {
        if (this._callback) {
            var cb = this._callback;
            this._callback = undefined;
            cb();
        }
        return;
    }
    if (_getEnergy.call(this) < this._absRestTolerance) {
        _setParticlePosition.call(this, this.endState);
        _setParticleVelocity.call(this, [
            0,
            0,
            0
        ]);
        _sleep.call(this);
    }
}
SnapTransition.prototype.reset = function reset(state, velocity) {
    this._dimensions = state instanceof Array ? state.length : 0;
    this.initState.set(state);
    _setParticlePosition.call(this, state);
    _setTarget.call(this, state);
    if (velocity)
        _setParticleVelocity.call(this, velocity);
    _setCallback.call(this, undefined);
};
SnapTransition.prototype.getVelocity = function getVelocity() {
    return _getParticleVelocity.call(this);
};
SnapTransition.prototype.setVelocity = function setVelocity(velocity) {
    this.call(this, _setParticleVelocity(velocity));
};
SnapTransition.prototype.isActive = function isActive() {
    return !this.PE.isSleeping();
};
SnapTransition.prototype.halt = function halt() {
    this.set(this.get());
};
SnapTransition.prototype.get = function get() {
    _update.call(this);
    return _getParticlePosition.call(this);
};
SnapTransition.prototype.set = function set(state, definition, callback) {
    if (!definition) {
        this.reset(state);
        if (callback)
            callback();
        return;
    }
    this._dimensions = state instanceof Array ? state.length : 0;
    _wake.call(this);
    _setupDefinition.call(this, definition);
    _setTarget.call(this, state);
    _setCallback.call(this, callback);
};
module.exports = SnapTransition;
},{"famous/math/Vector":22,"famous/physics/PhysicsEngine":23,"famous/physics/bodies/Particle":24,"famous/physics/constraints/Snap":26}],36:[function(require,module,exports){
var PE = require('famous/physics/PhysicsEngine');
var Particle = require('famous/physics/bodies/Particle');
var Spring = require('famous/physics/forces/Spring');
var Vector = require('famous/math/Vector');
function SpringTransition(state) {
    state = state || 0;
    this.endState = new Vector(state);
    this.initState = new Vector();
    this._dimensions = undefined;
    this._restTolerance = 1e-10;
    this._absRestTolerance = this._restTolerance;
    this._callback = undefined;
    this.PE = new PE();
    this.spring = new Spring({ anchor: this.endState });
    this.particle = new Particle();
    this.PE.addBody(this.particle);
    this.PE.attach(this.spring, this.particle);
}
SpringTransition.SUPPORTS_MULTIPLE = 3;
SpringTransition.DEFAULT_OPTIONS = {
    period: 300,
    dampingRatio: 0.5,
    velocity: 0
};
function _getEnergy() {
    return this.particle.getEnergy() + this.spring.getEnergy(this.particle);
}
function _setParticlePosition(p) {
    this.particle.setPosition(p);
}
function _setParticleVelocity(v) {
    this.particle.setVelocity(v);
}
function _getParticlePosition() {
    return this._dimensions === 0 ? this.particle.getPosition1D() : this.particle.getPosition();
}
function _getParticleVelocity() {
    return this._dimensions === 0 ? this.particle.getVelocity1D() : this.particle.getVelocity();
}
function _setCallback(callback) {
    this._callback = callback;
}
function _wake() {
    this.PE.wake();
}
function _sleep() {
    this.PE.sleep();
}
function _update() {
    if (this.PE.isSleeping()) {
        if (this._callback) {
            var cb = this._callback;
            this._callback = undefined;
            cb();
        }
        return;
    }
    if (_getEnergy.call(this) < this._absRestTolerance) {
        _setParticlePosition.call(this, this.endState);
        _setParticleVelocity.call(this, [
            0,
            0,
            0
        ]);
        _sleep.call(this);
    }
}
function _setupDefinition(definition) {
    var defaults = SpringTransition.DEFAULT_OPTIONS;
    if (definition.period === undefined)
        definition.period = defaults.period;
    if (definition.dampingRatio === undefined)
        definition.dampingRatio = defaults.dampingRatio;
    if (definition.velocity === undefined)
        definition.velocity = defaults.velocity;
    if (definition.period < 150) {
        definition.period = 150;
        console.warn('The period of a SpringTransition is capped at 150 ms. Use a SnapTransition for faster transitions');
    }
    this.spring.setOptions({
        period: definition.period,
        dampingRatio: definition.dampingRatio
    });
    _setParticleVelocity.call(this, definition.velocity);
}
function _setAbsoluteRestTolerance() {
    var distance = this.endState.sub(this.initState).normSquared();
    this._absRestTolerance = distance === 0 ? this._restTolerance : this._restTolerance * distance;
}
function _setTarget(target) {
    this.endState.set(target);
    _setAbsoluteRestTolerance.call(this);
}
SpringTransition.prototype.reset = function reset(pos, vel) {
    this._dimensions = pos instanceof Array ? pos.length : 0;
    this.initState.set(pos);
    _setParticlePosition.call(this, pos);
    _setTarget.call(this, pos);
    if (vel)
        _setParticleVelocity.call(this, vel);
    _setCallback.call(this, undefined);
};
SpringTransition.prototype.getVelocity = function getVelocity() {
    return _getParticleVelocity.call(this);
};
SpringTransition.prototype.setVelocity = function setVelocity(v) {
    this.call(this, _setParticleVelocity(v));
};
SpringTransition.prototype.isActive = function isActive() {
    return !this.PE.isSleeping();
};
SpringTransition.prototype.halt = function halt() {
    this.set(this.get());
};
SpringTransition.prototype.get = function get() {
    _update.call(this);
    return _getParticlePosition.call(this);
};
SpringTransition.prototype.set = function set(endState, definition, callback) {
    if (!definition) {
        this.reset(endState);
        if (callback)
            callback();
        return;
    }
    this._dimensions = endState instanceof Array ? endState.length : 0;
    _wake.call(this);
    _setupDefinition.call(this, definition);
    _setTarget.call(this, endState);
    _setCallback.call(this, callback);
};
module.exports = SpringTransition;
},{"famous/math/Vector":22,"famous/physics/PhysicsEngine":23,"famous/physics/bodies/Particle":24,"famous/physics/forces/Spring":29}],37:[function(require,module,exports){
var MultipleTransition = require('./MultipleTransition');
var TweenTransition = require('./TweenTransition');
function Transitionable(start) {
    this.currentAction = null;
    this.actionQueue = [];
    this.callbackQueue = [];
    this.state = 0;
    this.velocity = undefined;
    this._callback = undefined;
    this._engineInstance = null;
    this._currentMethod = null;
    this.set(start);
}
var transitionMethods = {};
Transitionable.registerMethod = function registerMethod(name, engineClass) {
    if (!(name in transitionMethods)) {
        transitionMethods[name] = engineClass;
        return true;
    } else
        return false;
};
Transitionable.unregisterMethod = function unregisterMethod(name) {
    if (name in transitionMethods) {
        delete transitionMethods[name];
        return true;
    } else
        return false;
};
function _loadNext() {
    if (this._callback) {
        var callback = this._callback;
        this._callback = undefined;
        callback();
    }
    if (this.actionQueue.length <= 0) {
        this.set(this.get());
        return;
    }
    this.currentAction = this.actionQueue.shift();
    this._callback = this.callbackQueue.shift();
    var method = null;
    var endValue = this.currentAction[0];
    var transition = this.currentAction[1];
    if (transition instanceof Object && transition.method) {
        method = transition.method;
        if (typeof method === 'string')
            method = transitionMethods[method];
    } else {
        method = TweenTransition;
    }
    if (this._currentMethod !== method) {
        if (!(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === true || endValue.length <= method.SUPPORTS_MULTIPLE) {
            this._engineInstance = new method();
        } else {
            this._engineInstance = new MultipleTransition(method);
        }
        this._currentMethod = method;
    }
    this._engineInstance.reset(this.state, this.velocity);
    if (this.velocity !== undefined)
        transition.velocity = this.velocity;
    this._engineInstance.set(endValue, transition, _loadNext.bind(this));
}
Transitionable.prototype.set = function set(endState, transition, callback) {
    if (!transition) {
        this.reset(endState);
        if (callback)
            callback();
        return this;
    }
    var action = [
            endState,
            transition
        ];
    this.actionQueue.push(action);
    this.callbackQueue.push(callback);
    if (!this.currentAction)
        _loadNext.call(this);
    return this;
};
Transitionable.prototype.reset = function reset(startState, startVelocity) {
    this._currentMethod = null;
    this._engineInstance = null;
    this._callback = undefined;
    this.state = startState;
    this.velocity = startVelocity;
    this.currentAction = null;
    this.actionQueue = [];
    this.callbackQueue = [];
};
Transitionable.prototype.delay = function delay(duration, callback) {
    this.set(this.get(), {
        duration: duration,
        curve: function () {
            return 0;
        }
    }, callback);
};
Transitionable.prototype.get = function get(timestamp) {
    if (this._engineInstance) {
        if (this._engineInstance.getVelocity)
            this.velocity = this._engineInstance.getVelocity();
        this.state = this._engineInstance.get(timestamp);
    }
    return this.state;
};
Transitionable.prototype.isActive = function isActive() {
    return !!this.currentAction;
};
Transitionable.prototype.halt = function halt() {
    return this.set(this.get());
};
module.exports = Transitionable;
},{"./MultipleTransition":34,"./TweenTransition":39}],38:[function(require,module,exports){
var Transitionable = require('./Transitionable');
var Transform = require('famous/core/Transform');
var Utility = require('famous/utilities/Utility');
function TransitionableTransform(transform) {
    this._final = Transform.identity.slice();
    this._finalTranslate = [
        0,
        0,
        0
    ];
    this._finalRotate = [
        0,
        0,
        0
    ];
    this._finalSkew = [
        0,
        0,
        0
    ];
    this._finalScale = [
        1,
        1,
        1
    ];
    this.translate = new Transitionable(this._finalTranslate);
    this.rotate = new Transitionable(this._finalRotate);
    this.skew = new Transitionable(this._finalSkew);
    this.scale = new Transitionable(this._finalScale);
    if (transform)
        this.set(transform);
}
function _build() {
    return Transform.build({
        translate: this.translate.get(),
        rotate: this.rotate.get(),
        skew: this.skew.get(),
        scale: this.scale.get()
    });
}
function _buildFinal() {
    return Transform.build({
        translate: this._finalTranslate,
        rotate: this._finalRotate,
        skew: this._finalSkew,
        scale: this._finalScale
    });
}
TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
    this._finalTranslate = translate;
    this._final = _buildFinal.call(this);
    this.translate.set(translate, transition, callback);
    return this;
};
TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
    this._finalScale = scale;
    this._final = _buildFinal.call(this);
    this.scale.set(scale, transition, callback);
    return this;
};
TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
    this._finalRotate = eulerAngles;
    this._final = _buildFinal.call(this);
    this.rotate.set(eulerAngles, transition, callback);
    return this;
};
TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
    this._finalSkew = skewAngles;
    this._final = _buildFinal.call(this);
    this.skew.set(skewAngles, transition, callback);
    return this;
};
TransitionableTransform.prototype.set = function set(transform, transition, callback) {
    var components = Transform.interpret(transform);
    this._finalTranslate = components.translate;
    this._finalRotate = components.rotate;
    this._finalSkew = components.skew;
    this._finalScale = components.scale;
    this._final = transform;
    var _callback = callback ? Utility.after(4, callback) : null;
    this.translate.set(components.translate, transition, _callback);
    this.rotate.set(components.rotate, transition, _callback);
    this.skew.set(components.skew, transition, _callback);
    this.scale.set(components.scale, transition, _callback);
    return this;
};
TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
    this.translate.setDefault(transition);
    this.rotate.setDefault(transition);
    this.skew.setDefault(transition);
    this.scale.setDefault(transition);
};
TransitionableTransform.prototype.get = function get() {
    if (this.isActive()) {
        return _build.call(this);
    } else
        return this._final;
};
TransitionableTransform.prototype.getFinal = function getFinal() {
    return this._final;
};
TransitionableTransform.prototype.isActive = function isActive() {
    return this.translate.isActive() || this.rotate.isActive() || this.scale.isActive() || this.skew.isActive();
};
TransitionableTransform.prototype.halt = function halt() {
    this._final = this.get();
    this.translate.halt();
    this.rotate.halt();
    this.skew.halt();
    this.scale.halt();
};
module.exports = TransitionableTransform;
},{"./Transitionable":37,"famous/core/Transform":13,"famous/utilities/Utility":42}],39:[function(require,module,exports){
function TweenTransition(options) {
    this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
    if (options)
        this.setOptions(options);
    this._startTime = 0;
    this._startValue = 0;
    this._updateTime = 0;
    this._endValue = 0;
    this._curve = undefined;
    this._duration = 0;
    this._active = false;
    this._callback = undefined;
    this.state = 0;
    this.velocity = undefined;
}
TweenTransition.Curves = {
    linear: function (t) {
        return t;
    },
    easeIn: function (t) {
        return t * t;
    },
    easeOut: function (t) {
        return t * (2 - t);
    },
    easeInOut: function (t) {
        if (t <= 0.5)
            return 2 * t * t;
        else
            return -2 * t * t + 4 * t - 1;
    },
    easeOutBounce: function (t) {
        return t * (3 - 2 * t);
    },
    spring: function (t) {
        return (1 - t) * Math.sin(6 * Math.PI * t) + t;
    }
};
TweenTransition.SUPPORTS_MULTIPLE = true;
TweenTransition.DEFAULT_OPTIONS = {
    curve: TweenTransition.Curves.linear,
    duration: 500,
    speed: 0
};
var registeredCurves = {};
TweenTransition.registerCurve = function registerCurve(curveName, curve) {
    if (!registeredCurves[curveName]) {
        registeredCurves[curveName] = curve;
        return true;
    } else {
        return false;
    }
};
TweenTransition.unregisterCurve = function unregisterCurve(curveName) {
    if (registeredCurves[curveName]) {
        delete registeredCurves[curveName];
        return true;
    } else {
        return false;
    }
};
TweenTransition.getCurve = function getCurve(curveName) {
    var curve = registeredCurves[curveName];
    if (curve !== undefined)
        return curve;
    else
        throw new Error('curve not registered');
};
TweenTransition.getCurves = function getCurves() {
    return registeredCurves;
};
function _interpolate(a, b, t) {
    return (1 - t) * a + t * b;
}
function _clone(obj) {
    if (obj instanceof Object) {
        if (obj instanceof Array)
            return obj.slice(0);
        else
            return Object.create(obj);
    } else
        return obj;
}
function _normalize(transition, defaultTransition) {
    var result = { curve: defaultTransition.curve };
    if (defaultTransition.duration)
        result.duration = defaultTransition.duration;
    if (defaultTransition.speed)
        result.speed = defaultTransition.speed;
    if (transition instanceof Object) {
        if (transition.duration !== undefined)
            result.duration = transition.duration;
        if (transition.curve)
            result.curve = transition.curve;
        if (transition.speed)
            result.speed = transition.speed;
    }
    if (typeof result.curve === 'string')
        result.curve = TweenTransition.getCurve(result.curve);
    return result;
}
TweenTransition.prototype.setOptions = function setOptions(options) {
    if (options.curve !== undefined)
        this.options.curve = options.curve;
    if (options.duration !== undefined)
        this.options.duration = options.duration;
    if (options.speed !== undefined)
        this.options.speed = options.speed;
};
TweenTransition.prototype.set = function set(endValue, transition, callback) {
    if (!transition) {
        this.reset(endValue);
        if (callback)
            callback();
        return;
    }
    this._startValue = _clone(this.get());
    transition = _normalize(transition, this.options);
    if (transition.speed) {
        var startValue = this._startValue;
        if (startValue instanceof Object) {
            var variance = 0;
            for (var i in startValue)
                variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
            transition.duration = Math.sqrt(variance) / transition.speed;
        } else {
            transition.duration = Math.abs(endValue - startValue) / transition.speed;
        }
    }
    this._startTime = Date.now();
    this._endValue = _clone(endValue);
    this._startVelocity = _clone(transition.velocity);
    this._duration = transition.duration;
    this._curve = transition.curve;
    this._active = true;
    this._callback = callback;
};
TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
    if (this._callback) {
        var callback = this._callback;
        this._callback = undefined;
        callback();
    }
    this.state = _clone(startValue);
    this.velocity = _clone(startVelocity);
    this._startTime = 0;
    this._duration = 0;
    this._updateTime = 0;
    this._startValue = this.state;
    this._startVelocity = this.velocity;
    this._endValue = this.state;
    this._active = false;
};
TweenTransition.prototype.getVelocity = function getVelocity() {
    return this.velocity;
};
TweenTransition.prototype.get = function get(timestamp) {
    this.update(timestamp);
    return this.state;
};
function _calculateVelocity(current, start, curve, duration, t) {
    var velocity;
    var eps = 1e-7;
    var speed = (curve(t) - curve(t - eps)) / eps;
    if (current instanceof Array) {
        velocity = [];
        for (var i = 0; i < current.length; i++) {
            if (typeof current[i] === 'number')
                velocity[i] = speed * (current[i] - start[i]) / duration;
            else
                velocity[i] = 0;
        }
    } else
        velocity = speed * (current - start) / duration;
    return velocity;
}
function _calculateState(start, end, t) {
    var state;
    if (start instanceof Array) {
        state = [];
        for (var i = 0; i < start.length; i++) {
            if (typeof start[i] === 'number')
                state[i] = _interpolate(start[i], end[i], t);
            else
                state[i] = start[i];
        }
    } else
        state = _interpolate(start, end, t);
    return state;
}
TweenTransition.prototype.update = function update(timestamp) {
    if (!this._active) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        return;
    }
    if (!timestamp)
        timestamp = Date.now();
    if (this._updateTime >= timestamp)
        return;
    this._updateTime = timestamp;
    var timeSinceStart = timestamp - this._startTime;
    if (timeSinceStart >= this._duration) {
        this.state = this._endValue;
        this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
        this._active = false;
    } else if (timeSinceStart < 0) {
        this.state = this._startValue;
        this.velocity = this._startVelocity;
    } else {
        var t = timeSinceStart / this._duration;
        this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
        this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
    }
};
TweenTransition.prototype.isActive = function isActive() {
    return this._active;
};
TweenTransition.prototype.halt = function halt() {
    this.reset(this.get());
};
TweenTransition.registerCurve('linear', TweenTransition.Curves.linear);
TweenTransition.registerCurve('easeIn', TweenTransition.Curves.easeIn);
TweenTransition.registerCurve('easeOut', TweenTransition.Curves.easeOut);
TweenTransition.registerCurve('easeInOut', TweenTransition.Curves.easeInOut);
TweenTransition.registerCurve('easeOutBounce', TweenTransition.Curves.easeOutBounce);
TweenTransition.registerCurve('spring', TweenTransition.Curves.spring);
TweenTransition.customCurve = function customCurve(v1, v2) {
    v1 = v1 || 0;
    v2 = v2 || 0;
    return function (t) {
        return v1 * t + (-2 * v1 - v2 + 3) * t * t + (v1 + v2 - 2) * t * t * t;
    };
};
module.exports = TweenTransition;
},{}],40:[function(require,module,exports){
var PE = require('famous/physics/PhysicsEngine');
var Particle = require('famous/physics/bodies/Particle');
var Spring = require('famous/physics/forces/Spring');
var Wall = require('famous/physics/constraints/Wall');
var Vector = require('famous/math/Vector');
function WallTransition(state) {
    state = state || 0;
    this.endState = new Vector(state);
    this.initState = new Vector();
    this.spring = new Spring({ anchor: this.endState });
    this.wall = new Wall();
    this._restTolerance = 1e-10;
    this._dimensions = 1;
    this._absRestTolerance = this._restTolerance;
    this._callback = undefined;
    this.PE = new PE();
    this.particle = new Particle();
    this.PE.addBody(this.particle);
    this.PE.attach([
        this.wall,
        this.spring
    ], this.particle);
}
WallTransition.SUPPORTS_MULTIPLE = 3;
WallTransition.DEFAULT_OPTIONS = {
    period: 300,
    dampingRatio: 0.5,
    velocity: 0,
    restitution: 0.5
};
function _getEnergy() {
    return this.particle.getEnergy() + this.spring.getEnergy(this.particle);
}
function _setAbsoluteRestTolerance() {
    var distance = this.endState.sub(this.initState).normSquared();
    this._absRestTolerance = distance === 0 ? this._restTolerance : this._restTolerance * distance;
}
function _wake() {
    this.PE.wake();
}
function _sleep() {
    this.PE.sleep();
}
function _setTarget(target) {
    this.endState.set(target);
    var dist = this.endState.sub(this.initState).norm();
    this.wall.setOptions({
        distance: this.endState.norm(),
        normal: dist === 0 ? this.particle.velocity.normalize(-1) : this.endState.sub(this.initState).normalize(-1)
    });
    _setAbsoluteRestTolerance.call(this);
}
function _setParticlePosition(p) {
    this.particle.position.set(p);
}
function _setParticleVelocity(v) {
    this.particle.velocity.set(v);
}
function _getParticlePosition() {
    return this._dimensions === 0 ? this.particle.getPosition1D() : this.particle.getPosition();
}
function _getParticleVelocity() {
    return this._dimensions === 0 ? this.particle.getVelocity1D() : this.particle.getVelocity();
}
function _setCallback(callback) {
    this._callback = callback;
}
function _update() {
    if (this.PE.isSleeping()) {
        if (this._callback) {
            var cb = this._callback;
            this._callback = undefined;
            cb();
        }
        return;
    }
    var energy = _getEnergy.call(this);
    if (energy < this._absRestTolerance) {
        _sleep.call(this);
        _setParticlePosition.call(this, this.endState);
        _setParticleVelocity.call(this, [
            0,
            0,
            0
        ]);
    }
}
function _setupDefinition(def) {
    var defaults = WallTransition.DEFAULT_OPTIONS;
    if (def.period === undefined)
        def.period = defaults.period;
    if (def.dampingRatio === undefined)
        def.dampingRatio = defaults.dampingRatio;
    if (def.velocity === undefined)
        def.velocity = defaults.velocity;
    if (def.restitution === undefined)
        def.restitution = defaults.restitution;
    this.spring.setOptions({
        period: def.period,
        dampingRatio: def.dampingRatio
    });
    this.wall.setOptions({ restitution: def.restitution });
    _setParticleVelocity.call(this, def.velocity);
}
WallTransition.prototype.reset = function reset(state, velocity) {
    this._dimensions = state instanceof Array ? state.length : 0;
    this.initState.set(state);
    _setParticlePosition.call(this, state);
    if (velocity)
        _setParticleVelocity.call(this, velocity);
    _setTarget.call(this, state);
    _setCallback.call(this, undefined);
};
WallTransition.prototype.getVelocity = function getVelocity() {
    return _getParticleVelocity.call(this);
};
WallTransition.prototype.setVelocity = function setVelocity(velocity) {
    this.call(this, _setParticleVelocity(velocity));
};
WallTransition.prototype.isActive = function isActive() {
    return !this.PE.isSleeping();
};
WallTransition.prototype.halt = function halt() {
    this.set(this.get());
};
WallTransition.prototype.get = function get() {
    _update.call(this);
    return _getParticlePosition.call(this);
};
WallTransition.prototype.set = function set(state, definition, callback) {
    if (!definition) {
        this.reset(state);
        if (callback)
            callback();
        return;
    }
    this._dimensions = state instanceof Array ? state.length : 0;
    _wake.call(this);
    _setupDefinition.call(this, definition);
    _setTarget.call(this, state);
    _setCallback.call(this, callback);
};
module.exports = WallTransition;
},{"famous/math/Vector":22,"famous/physics/PhysicsEngine":23,"famous/physics/bodies/Particle":24,"famous/physics/constraints/Wall":27,"famous/physics/forces/Spring":29}],41:[function(require,module,exports){
var FamousEngine = require('famous/core/Engine');
var _event = 'prerender';
var getTime = window.performance && window.performance.now ? function () {
        return window.performance.now();
    } : function () {
        return Date.now();
    };
function addTimerFunction(fn) {
    FamousEngine.on(_event, fn);
    return fn;
}
function setTimeout(fn, duration) {
    var t = getTime();
    var callback = function () {
        var t2 = getTime();
        if (t2 - t >= duration) {
            fn.apply(this, arguments);
            FamousEngine.removeListener(_event, callback);
        }
    };
    return addTimerFunction(callback);
}
function setInterval(fn, duration) {
    var t = getTime();
    var callback = function () {
        var t2 = getTime();
        if (t2 - t >= duration) {
            fn.apply(this, arguments);
            t = getTime();
        }
    };
    return addTimerFunction(callback);
}
function after(fn, numTicks) {
    if (numTicks === undefined)
        return undefined;
    var callback = function () {
        numTicks--;
        if (numTicks <= 0) {
            fn.apply(this, arguments);
            clear(callback);
        }
    };
    return addTimerFunction(callback);
}
function every(fn, numTicks) {
    numTicks = numTicks || 1;
    var initial = numTicks;
    var callback = function () {
        numTicks--;
        if (numTicks <= 0) {
            fn.apply(this, arguments);
            numTicks = initial;
        }
    };
    return addTimerFunction(callback);
}
function clear(fn) {
    FamousEngine.removeListener(_event, fn);
}
function debounce(func, wait) {
    var timeout;
    var ctx;
    var timestamp;
    var result;
    var args;
    return function () {
        ctx = this;
        args = arguments;
        timestamp = getTime();
        var fn = function () {
            var last = getTime - timestamp;
            if (last < wait) {
                timeout = setTimeout(fn, wait - last);
            } else {
                timeout = null;
                result = func.apply(ctx, args);
            }
        };
        clear(timeout);
        timeout = setTimeout(fn, wait);
        return result;
    };
}
module.exports = {
    setTimeout: setTimeout,
    setInterval: setInterval,
    debounce: debounce,
    after: after,
    every: every,
    clear: clear
};
},{"famous/core/Engine":4}],42:[function(require,module,exports){
var Utility = {};
Utility.Direction = {
    X: 0,
    Y: 1,
    Z: 2
};
Utility.after = function after(count, callback) {
    var counter = count;
    return function () {
        counter--;
        if (counter === 0)
            callback.apply(this, arguments);
    };
};
Utility.loadURL = function loadURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function onreadystatechange() {
        if (this.readyState === 4) {
            if (callback)
                callback(this.responseText);
        }
    };
    xhr.open('GET', url);
    xhr.send();
};
Utility.createDocumentFragmentFromHTML = function createDocumentFragmentFromHTML(html) {
    var element = document.createElement('div');
    element.innerHTML = html;
    var result = document.createDocumentFragment();
    while (element.hasChildNodes())
        result.appendChild(element.firstChild);
    return result;
};
Utility.clone = function clone(b) {
    var a;
    if (typeof b === 'object') {
        a = {};
        for (var key in b) {
            if (typeof b[key] === 'object' && b[key] !== null) {
                if (b[key] instanceof Array) {
                    a[key] = new Array(b[key].length);
                    for (var i = 0; i < b[key].length; i++) {
                        a[key][i] = Utility.clone(b[key][i]);
                    }
                } else {
                    a[key] = Utility.clone(b[key]);
                }
            } else {
                a[key] = b[key];
            }
        }
    } else {
        a = b;
    }
    return a;
};
module.exports = Utility;
},{}],43:[function(require,module,exports){
var OptionsManager = require('famous/core/OptionsManager');
var Transform = require('famous/core/Transform');
var ViewSequence = require('famous/core/ViewSequence');
var Utility = require('famous/utilities/Utility');
function SequentialLayout(options) {
    this._items = null;
    this._size = null;
    this._outputFunction = SequentialLayout.DEFAULT_OUTPUT_FUNCTION;
    this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
    this.optionsManager = new OptionsManager(this.options);
    this._itemsCache = [];
    this._outputCache = {
        size: null,
        target: this._itemsCache
    };
    if (options)
        this.setOptions(options);
}
SequentialLayout.DEFAULT_OPTIONS = {
    direction: Utility.Direction.Y,
    itemSpacing: 0,
    defaultItemSize: [
        50,
        50
    ]
};
SequentialLayout.DEFAULT_OUTPUT_FUNCTION = function DEFAULT_OUTPUT_FUNCTION(input, offset, index) {
    var transform = this.options.direction === Utility.Direction.X ? Transform.translate(offset, 0) : Transform.translate(0, offset);
    return {
        transform: transform,
        target: input.render()
    };
};
SequentialLayout.prototype.getSize = function getSize() {
    if (!this._size)
        this.render();
    return this._size;
};
SequentialLayout.prototype.sequenceFrom = function sequenceFrom(items) {
    if (items instanceof Array)
        items = new ViewSequence(items);
    this._items = items;
    return this;
};
SequentialLayout.prototype.setOptions = function setOptions(options) {
    this.optionsManager.setOptions.apply(this.optionsManager, arguments);
    return this;
};
SequentialLayout.prototype.setOutputFunction = function setOutputFunction(outputFunction) {
    this._outputFunction = outputFunction;
    return this;
};
SequentialLayout.prototype.render = function render() {
    var length = 0;
    var girth = 0;
    var lengthDim = this.options.direction === Utility.Direction.X ? 0 : 1;
    var girthDim = this.options.direction === Utility.Direction.X ? 1 : 0;
    var currentNode = this._items;
    var result = this._itemsCache;
    var i = 0;
    while (currentNode) {
        var item = currentNode.get();
        if (!item)
            break;
        var itemSize;
        if (item && item.getSize)
            itemSize = item.getSize();
        if (!itemSize)
            itemSize = this.options.defaultItemSize;
        if (itemSize[girthDim] !== true)
            girth = Math.max(girth, itemSize[girthDim]);
        var output = this._outputFunction.call(this, item, length, i);
        result[i] = output;
        if (itemSize[lengthDim] && itemSize[lengthDim] !== true)
            length += itemSize[lengthDim] + this.options.itemSpacing;
        currentNode = currentNode.getNext();
        i++;
    }
    this._itemsCache.splice(i);
    if (!girth)
        girth = undefined;
    if (!this._size)
        this._size = [
            0,
            0
        ];
    this._size[lengthDim] = length - this.options.itemSpacing;
    this._size[girthDim] = girth;
    this._outputCache.size = this.getSize();
    return this._outputCache;
};
module.exports = SequentialLayout;
},{"famous/core/OptionsManager":9,"famous/core/Transform":13,"famous/core/ViewSequence":15,"famous/utilities/Utility":42}],44:[function(require,module,exports){
function Carousel(t,e){SizeAwareView.apply(this,arguments),this._isPlugin=e,this._data={index:void 0,paginatedIndex:1,itemsPerPage:1,items:void 0,renderables:[],length:void 0},this.sync=new GenericSync,this.layoutDefinition,this.layoutController=new LayoutController({classes:["famous-carousel-container"],itemsPerPage:this._data.itemsPerPage,loop:this.options.loop,sync:this.sync}),this.layoutController._connectContainer(this),this.clickLength=null,this._init()}var RenderNode=require("famous/core/RenderNode"),Modifier=require("famous/core/Modifier"),Engine=require("famous/core/Engine"),Surface=require("famous/core/Surface"),SizeAwareView=require("./constructors/SizeAwareView"),Timer=require("famous/utilities/Timer"),FastClick=require("famous/inputs/FastClick"),RegisterEasing=require("./registries/Easing"),RegisterPhysics=require("./registries/Physics"),GenericSync=require("famous/inputs/GenericSync"),TouchSync=require("famous/inputs/TouchSync"),MouseSync=require("famous/inputs/MouseSync"),ScrollSync=require("famous/inputs/ScrollSync"),Slide=require("./slides/Slide"),Arrows=require("./components/Arrows"),Dots=require("./components/Dots"),LayoutController=require("./layouts/LayoutController"),LayoutFactory=require("./layouts/LayoutFactory");GenericSync.register({mouse:MouseSync,touch:TouchSync,scroll:ScrollSync}),Carousel.prototype=Object.create(SizeAwareView.prototype),Carousel.prototype.constructor=Carousel,Carousel.EVENTS={selection:"selectionChange",itemClick:"itemClick"},Carousel._handleKeyup=function(t){37==t.keyCode?(this.previous(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)):39==t.keyCode&&(this.next(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index))},Carousel.prototype.setContentLayout=function(t){if(!t)throw"No layout definition given!";return this.layoutDefinition=t,this.layoutController.setLayout(this.layoutDefinition),this},Carousel.prototype.getContentLayout=function(){return this.layoutDefinition},Carousel.prototype.getSelectedIndex=function(){return this._data.index},Carousel.prototype.setSelectedIndex=function(t,e){return t==this._data.index?this._data.index:(this._data.index=this._clamp(t),this._data.paginatedIndex=this._clamp(Math.floor(this._data.index/this._data.itemsPerPage)),e=void 0===e?!0:e,this.layoutController.setIndex(this._data.index,e),this.dots&&this.dots.setIndex(this._data.paginatedIndex),this._data.index)},Carousel.prototype.next=function(){var t=this._data.index+this._data.itemsPerPage;return this.setSelectedIndex(t)},Carousel.prototype.previous=function(){var t=this._data.index-this._data.itemsPerPage;return this.setSelectedIndex(t)},Carousel.prototype.getItems=function(){return this._data.items},Carousel.prototype.setItems=function(t){return this._data.items=t.slice(0),this._data.length=this._data.items.length,this._initItems(),this.layoutController.setItems(this._data.renderables),this},Carousel.prototype.getSize=function(){return this.getParentSize()},Carousel.prototype.setSize=function(){},Carousel.prototype._init=function(){this.setItems(this.options.items),this.setSelectedIndex(this.options.selectedIndex,!1),this._initContent(),this._events(),Timer.after(function(){this._resize(),this.setContentLayout(this.options.contentLayout)}.bind(this),2)},Carousel.prototype._initContent=function(){this._eventContainer=new Surface,this._eventContainer.pipe(this),this.add(new Modifier({opacity:0})).add(this._eventContainer),this.options.arrowsEnabled&&(this.arrows=new Arrows({position:this.options.arrowsPosition,padding:this.options.arrowsPadding,previousIconURL:this.options.arrowsPreviousIconURL,nextIconURL:this.options.arrowsNextIconURL,animateOnClick:this.options.arrowsAnimateOnClick,toggleDisplayOnHover:this.options.arrowsToggleDisplayOnHover}),this.add(this.arrows)),this.options.dotsEnabled&&(this.dots=new Dots({position:this.options.dotsPosition,padding:this.options.dotsPadding,size:this.options.dotsSize,horizontalSpacing:this.options.dotsHorizontalSpacing,length:Math.ceil(this._data.items.length/this._data.itemsPerPage),selectedIndex:this.options.selectedIndex,arrowsToggleDisplayOnHover:this.options.arrowsToggleDisplayOnHover}),this.add(this.dots)),this._sizeModifier=new Modifier({size:this._getCarouselSize(),origin:[.5,.5],align:[.5,.5]}),this.add(this._sizeModifier).add(this.layoutController)},Carousel.prototype._initItems=function(){for(var t=0;t<this._data.items.length;t++){if(this._data.items[t].render)this._data.renderables.push(this._data.items[t]);else{var e=new Slide(this._data.items[t]);this._data.renderables.push(e)}this._data.renderables[t].pipe(this.sync),this._data.renderables[t].on("click",this._addToClickQueue.bind(this,Carousel.EVENTS.itemClick,t))}},Carousel.prototype._events=function(){this._eventInput.on("parentResize",this._resize.bind(this));var t=[];this.options.touchEnabled&&t.push("touch"),this.options.mouseEnabled&&t.push("mouse"),this.sync.addSync(t),this._eventContainer.pipe(this.sync);var e=null;this.sync.on("start",function(){e=new Date}),this.sync.on("end",function(){this.clickLength=new Date-e}.bind(this)),this.options.keyboardEnabled&&(this._handleKeyup=Carousel._handleKeyup.bind(this),Engine.on("keyup",this._handleKeyup)),this.arrows&&(this.arrows.on("previous",function(){this.previous(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.arrows.on("next",function(){this.next(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this))),this.options.arrowsToggleDisplayOnHover&&this.arrows&&(this._eventInput.on("mouseover",this.arrows.show.bind(this.arrows)),this._eventInput.on("mouseout",this.arrows.hide.bind(this.arrows))),this.dots&&this.dots.on("set",function(t){this.setSelectedIndex(t*this._data.itemsPerPage),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.dots&&this.arrows&&(this.dots.on("showArrows",this.arrows.show.bind(this.arrows)),this.dots.on("hideArrows",this.arrows.hide.bind(this.arrows))),this.layoutController.on("paginationChange",this._setItemsPerPage.bind(this)),this.layoutController.on("previous",function(){this.previous(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.layoutController.on("next",function(){this.next(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.layoutController.on("set",function(t){this.setSelectedIndex(t),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this))},Carousel.prototype._addToClickQueue=function(t,e){this.clickLength<150&&this._eventOutput.emit(t,e)},Carousel.prototype._setItemsPerPage=function(t){this._data.itemsPerPage!==t&&(this._data.itemsPerPage=t,this.dots&&this.dots.setLength(Math.ceil(this._data.items.length/t),t,this._data.index))},Carousel.prototype._resize=function(){var t=this._getCarouselSize();this.layoutController.setSize(t),this._sizeModifier.setSize(t)},Carousel.prototype._getCarouselSize=function(){var t=[],e=this.getSize();return this._isPlugin?(t[0]=e[0]-this.options.contentPadding[0],t[1]=e[1]-this.options.contentPadding[1]):(t[0]="number"==typeof this.options.carouselSize[0]?this.options.carouselSize[0]:parseFloat(this.options.carouselSize[0])/100*e[0],t[1]="number"==typeof this.options.carouselSize[1]?this.options.carouselSize[1]:parseFloat(this.options.carouselSize[1])/100*e[1]),t},Carousel.prototype._clamp=function(t,e){return"undefined"==typeof e&&(e=this.options.loop),t>this._data.length-1?t=e?0:this._data.length-1:0>t&&(t=e?this._data.length-1:0),t},Carousel.SingularSoftScale=LayoutFactory.SingularSoftScale,Carousel.SingularTwist=LayoutFactory.SingularTwist,Carousel.SingularParallax=LayoutFactory.SingularParallax,Carousel.SingularSlideBehind=LayoutFactory.SingularSlideBehind,Carousel.SingularOpacity=LayoutFactory.SingularOpacity,Carousel.SingularSlideIn=LayoutFactory.SingularSlideIn,Carousel.SequentialLayout=LayoutFactory.SequentialLayout,Carousel.GridLayout=LayoutFactory.GridLayout,Carousel.CoverflowLayout=LayoutFactory.CoverflowLayout,Carousel.DEFAULT_OPTIONS={contentLayout:Carousel.SingularSoftScale,carouselSize:["100%","100%"],arrowsEnabled:!0,arrowsPosition:"middle",arrowsPadding:[10,0],arrowsPreviousIconURL:void 0,arrowsNextIconURL:void 0,arrowsAnimateOnClick:!0,arrowsToggleDisplayOnHover:!0,dotsEnabled:!0,dotsPosition:"middle",dotsPadding:[0,-10],dotsSize:[10,10],dotsHorizontalSpacing:10,contentPadding:[0,0],selectedIndex:0,items:[],loop:!0,keyboardEnabled:!0,mouseEnabled:!0,touchEnabled:!0},module.exports=Carousel;
},{"./components/Arrows":45,"./components/Dots":46,"./constructors/SizeAwareView":47,"./layouts/LayoutController":54,"./layouts/LayoutFactory":55,"./registries/Easing":64,"./registries/Physics":65,"./slides/Slide":66,"famous/core/Engine":4,"famous/core/Modifier":8,"famous/core/RenderNode":10,"famous/core/Surface":12,"famous/inputs/FastClick":16,"famous/inputs/GenericSync":17,"famous/inputs/MouseSync":18,"famous/inputs/ScrollSync":19,"famous/inputs/TouchSync":20,"famous/utilities/Timer":41}],45:[function(require,module,exports){
function Arrows(){View.apply(this,arguments),this._storage={prev:{surface:null,positionMod:null,animationMod:null,transTransform:null,opacityTrans:null},next:{surface:null,positionMod:null,animationMod:null,transTransform:null,opacityTrans:null}},this._arrowsDisplayed=this.options.toggleDisplayOnHover?!1:!0,this._animationQueue={showCount:0,hideCount:0},this._init()}var View=require("famous/core/View"),Modifier=require("famous/core/Modifier"),ImageSurface=require("famous/surfaces/ImageSurface"),Surface=require("famous/core/Surface"),Transform=require("famous/core/Transform"),Transitionable=require("famous/transitions/Transitionable"),TransitionableTransform=require("famous/transitions/TransitionableTransform"),Timer=require("famous/utilities/Timer");Arrows.prototype=Object.create(View.prototype),Arrows.prototype.constructor=Arrows,Arrows.DEFAULT_OPTIONS={position:"center",padding:[10,0],previousIconURL:void 0,nextIconURL:void 0,animateOnClick:!0,toggleDisplayOnHover:!0},Arrows.POSITION_TO_ALIGN={bottom:1,middle:.5,top:0},Arrows.ANIMATION_OPTIONS={click:{offset:10,transition:{curve:"outBack",duration:250}},display:{curve:"outExpo",duration:600}},Arrows.prototype.show=function(){this._arrowsDisplayed||(this._arrowsDisplayed=!0,this._animationQueue.showCount++,this._queueAnimation("show"))},Arrows.prototype.hide=function(){this._arrowsDisplayed&&(this._arrowsDisplayed=!1,this._animationQueue.hideCount++,this._queueAnimation("hide"))},Arrows.prototype._init=function(){this._initContent(),this._events(this)},Arrows.prototype._initContent=function(){var o=this._defineOptions(this.options.position),t=this._arrowsDisplayed?1:0;for(var r in o){var i=this._storage[r];i.positionMod=new Modifier({origin:[.5,.5],align:[.5,.5],transform:Transform.translate(o[r].translation[0],o[r].translation[1])}),i.transTransform=new TransitionableTransform,i.opacityTrans=new Transitionable(0),i.animationMod=new Modifier({transform:i.transTransform,opacity:i.opacityTrans}),i.surface=new ImageSurface({classes:["famous-carousel-arrow",o[r].className],content:o[r].iconURL,size:[!0,!0],properties:o[r].properties}),this.add(i.positionMod).add(i.animationMod).add(i.surface),Timer.after(function(t,r,i){t.positionMod.setOrigin(o[r].placement),t.positionMod.setAlign(o[r].placement),t.opacityTrans.set(i)}.bind(null,i,r,t),2)}},Arrows.prototype._defineOptions=function(o){var t=this.options.padding,r=2,i=5,n={border:r+"px solid #404040",padding:i+"px",borderRadius:"50%",zIndex:2},e={prev:{className:"famous-carousel-arrow-previous"},next:{className:"famous-carousel-arrow-next"}},s=-r-r;void 0===this.options.previousIconURL?(e.prev.iconURL="/images/icons/arrow_left_dark.svg",e.prev.properties=n):(e.prev.iconURL=this.options.previousIconURL,e.prev.properties={zIndex:2}),void 0===this.options.nextIconURL?(e.next.iconURL="/images/icons/arrow_right_dark.svg",e.next.properties=n,e.next.extraXPadding=s):(e.next.iconURL=this.options.nextIconURL,e.next.properties={zIndex:2},e.next.extraXPadding=0);var a;return a="top"===o?0:"middle"===o?s/2:s,e.prev.placement=[0,Arrows.POSITION_TO_ALIGN[o]],e.prev.translation=[t[0],a-t[1]],e.next.placement=[1,Arrows.POSITION_TO_ALIGN[o]],e.next.translation=[s-t[0],a-t[1]],e},Arrows.prototype._events=function(){var o=this._storage.prev.surface,t=this._storage.next.surface;o.on("click",this._onPrev.bind(this)),t.on("click",this._onNext.bind(this)),this.options.toggleDisplayOnHover&&(o.on("mouseover",this.show.bind(this)),t.on("mouseover",this.show.bind(this)),o.on("mouseout",this.hide.bind(this)),t.on("mouseout",this.hide.bind(this)))},Arrows.prototype._onPrev=function(){this._eventOutput.emit("previous"),this._animateArrow(this._storage.prev.transTransform,-1)},Arrows.prototype._onNext=function(){this._eventOutput.emit("next"),this._animateArrow(this._storage.next.transTransform,1)},Arrows.prototype._animateArrow=function(o,t){if(this.options.animateOnClick){var r=Arrows.ANIMATION_OPTIONS.click;o.halt(),o.set(Transform.translate(r.offset*t,0),{duration:1},function(){o.set(Transform.identity,r.transition)})}},Arrows.prototype._queueAnimation=function(){var o=this._animationQueue;Timer.setTimeout(function(){for(;o.showCount>0&&o.hideCount>0;)o.showCount--,o.hideCount--;o.showCount>0?(o.showCount--,this._showOrHide("show")):o.hideCount>0&&(o.hideCount--,this._showOrHide("hide"))}.bind(this),25)},Arrows.prototype._showOrHide=function(o){var t,r,i,n=Arrows.ANIMATION_OPTIONS.display,e=n.duration,s=1.2;"show"===o?(t=1,r=1,i=0):(t=0,r=.001,i=e/2);var a=this._storage.prev.opacityTrans,u=this._storage.next.opacityTrans,p=this._storage.prev.transTransform,c=this._storage.next.transTransform;a.halt(),u.halt(),p.halt(),c.halt(),a.delay(i,function(){a.set(t,{duration:e/2,curve:"outBack"}),u.set(t,{duration:e/2,curve:"outBack"})}),p.set(Transform.scale(s,s),{duration:1*e/4,curve:n.curve},function(){p.set(Transform.scale(r,r),{duration:3*e/4,curve:n.curve})}),c.set(Transform.scale(s,s),{duration:1*e/4,curve:n.curve},function(){c.set(Transform.scale(r,r),{duration:3*e/4,curve:n.curve})})},module.exports=Arrows;
},{"famous/core/Modifier":8,"famous/core/Surface":12,"famous/core/Transform":13,"famous/core/View":14,"famous/surfaces/ImageSurface":32,"famous/transitions/Transitionable":37,"famous/transitions/TransitionableTransform":38,"famous/utilities/Timer":41}],46:[function(require,module,exports){
function Dots(){SizeAwareView.apply(this,arguments),this._data={dots:[],parentSize:[],dotCount:this.options.length,layoutModel:[],selectedIndex:this.options.selectedIndex},this.layout=new SequentialLayout({defaultItemSize:this.options.size}),this.positionMod=new Modifier,this.animationMod=new Modifier,this.opacityTrans=new Transitionable(1),this.transTransform=new TransitionableTransform,this.displayed=!0,EventHelpers.when(function(){return 0!==this.getParentSize().length}.bind(this),this._init.bind(this))}var SizeAwareView=require("../constructors/SizeAwareView"),Surface=require("famous/core/Surface"),Modifier=require("famous/core/Modifier"),RenderNode=require("famous/core/RenderNode"),Transform=require("famous/core/Transform"),Transitionable=require("famous/transitions/Transitionable"),TransitionableTransform=require("famous/transitions/TransitionableTransform"),SequentialLayout=require("famous/views/SequentialLayout"),Timer=require("famous/utilities/Timer"),EventHelpers=require("../events/EventHelpers");Dots.prototype=Object.create(SizeAwareView.prototype),Dots.prototype.constructor=Dots,Dots.DEFAULT_OPTIONS={position:"center",padding:[0,-10],size:[10,10],horizontalSpacing:10,length:1,selectedIndex:0},Dots.POSITION_TO_ALIGN={left:0,middle:.5,right:1},Dots.ANIMATION_OPTIONS={click:{offset:-7,transition:{curve:"outExpo",duration:250}},display:{scaleUp:1.15,duration:600,curve:"outExpo"}},Dots.prototype.setIndex=function(t){if(t!==this._data.selectedIndex&&!(t>=this._data.dots.length||0>t)){var e=this._data.selectedIndex;this._data.dots[e].surface.removeClass("famous-carousel-dot-selected"),this._data.dots[t].surface.addClass("famous-carousel-dot-selected"),this._data.selectedIndex=t}},Dots.prototype.show=function(t){if(!this.displayed){this.opacityTrans.halt(),this.transTransform.halt(),this.displayed=!0;var e=Dots.ANIMATION_OPTIONS.display;this.opacityTrans.set(1,{duration:100,curve:"inExpo"}),this.transTransform.set(Transform.identity),this.transTransform.set(Transform.scale(e.scaleUp,e.scaleUp),{duration:1*e.duration/3,curve:"outExpo"},function(){this.transTransform.set(Transform.identity,{duration:2*e.duration/3,curve:e.curve},t)}.bind(this))}},Dots.prototype.hide=function(t){if(this.displayed){this.opacityTrans.halt(),this.transTransform.halt(),this.displayed=!1;var e=Dots.ANIMATION_OPTIONS.display;this.opacityTrans.set(1,{duration:e.duration,curve:e.curve}),this.transTransform.set(Transform.scale(e.scaleUp,e.scaleUp),{duration:.25*e.duration,curve:"outExpo"},function(){this.transTransform.set(Transform.scale(1e-4,1e-4),{duration:.75*e.duration,curve:e.curve},t)}.bind(this))}},Dots.prototype.setLength=function(t,e,i){this._data.dotCount=t,this._data.selectedIndex=Math.floor(this._data.selectedIndex/e),this.hide(function(){this._init(),this.setIndex(i),Timer.after(this.show.bind(this),1)}.bind(this))},Dots.prototype._init=function(){this._data.parentSize=this.getParentSize(),this._initContent(),this._createLayout()},Dots.prototype._initContent=function(){this._data.dots=[];for(var t=0;t<this._data.dotCount;t++)this._data.dots.push(this._createNode(t))},Dots.prototype._createNode=function(t){var e={};return e.index=t,e.surface=new Surface({classes:["famous-carousel-dot"],size:this.options.size,properties:{zIndex:2}}),t===this._data.selectedIndex&&e.surface.addClass("famous-carousel-dot-selected"),e.surface.on("click",this._changeIndex.bind(this,e)),this.options.toggleArrowsDisplayOnHover&&(e.surface.on("mouseover",this._eventOutput.emit.bind(this._eventOutput,"showArrows")),e.surface.on("mouseout",this._eventOutput.emit.bind(this._eventOutput,"hideArrows"))),e.transTransform=new TransitionableTransform,e.modifier=new Modifier({transform:e.transTransform}),e.renderNode=new RenderNode,e.renderNode.add(e.modifier).add(e.surface),e},Dots.prototype._createLayout=function(){var t=this._createLayoutModel();1===t.length?(this.layout.setOptions({direction:0,itemSpacing:this.options.horizontalSpacing}),this.layout.sequenceFrom(t[0])):this._createNestedLayout(),this._addLayout()},Dots.prototype._createNestedLayout=function(){var t=[],e=this.options.horizontalSpacing;this.layout.setOptions({direction:1,itemSpacing:e}),this.layout.sequenceFrom(t);for(var i,s=this._data.layoutModel,o=0;o<s.length;o++)if(i=new SequentialLayout({direction:0,itemSpacing:e,defaultItemSize:this.options.size}),i.sequenceFrom(s[o]),o===s.length-1&&s.length>1){var a=new RenderNode;a.add(new Modifier({origin:[Dots.POSITION_TO_ALIGN[this.options.position],0]})).add(i),t.push(a)}else t.push(i)},Dots.prototype._addLayout=function(){var t=Dots.POSITION_TO_ALIGN[this.options.position];this.positionMod.setOrigin([t,1]),this.positionMod.setAlign([t,1]),this.positionMod.setTransform(Transform.translate(this.options.padding[0],this.options.padding[1])),this.animationMod.setOpacity(this.opacityTrans),this.animationMod.setTransform(this.transTransform),this.add(this.positionMod).add(this.animationMod).add(this.layout)},Dots.prototype._createLayoutModel=function(){var t=this._data.parentSize[0],e=[];e.push([]);for(var i=0,s=0,o=this.options.size[0]+this.options.horizontalSpacing,a=this._data.dots,n=0;n<a.length;n++)s+o>t&&(i++,s=0,e.push([])),s+=o,e[i].push(a[n].renderNode);return this._data.layoutModel=e,e},Dots.prototype._changeIndex=function(t){this._eventOutput.emit("set",t.index),this._animateDot(t.transTransform)},Dots.prototype._animateDot=function(t){var e=Dots.ANIMATION_OPTIONS.click;t.set(Transform.translate(0,e.offset),{duration:1},function(){t.set(Transform.identity,e.transition)})},module.exports=Dots;
},{"../constructors/SizeAwareView":47,"../events/EventHelpers":49,"famous/core/Modifier":8,"famous/core/RenderNode":10,"famous/core/Surface":12,"famous/core/Transform":13,"famous/transitions/Transitionable":37,"famous/transitions/TransitionableTransform":38,"famous/utilities/Timer":41,"famous/views/SequentialLayout":43}],47:[function(require,module,exports){
function SizeAwareView(){View.apply(this,arguments),this.__id=Entity.register(this),this.__parentSize=[]}var View=require("famous/core/View"),Entity=require("famous/core/Entity"),Transform=require("famous/core/Transform");SizeAwareView.prototype=Object.create(View.prototype),SizeAwareView.prototype.constructor=SizeAwareView,SizeAwareView.prototype.commit=function(e){var i=e.transform,t=e.opacity,r=e.origin;return this.__parentSize&&this.__parentSize[0]===e.size[0]&&this.__parentSize[1]===e.size[1]||(this.__parentSize[0]=e.size[0],this.__parentSize[1]=e.size[1],this._eventInput.emit("parentResize",this.__parentSize)),this.__parentSize&&(i=Transform.moveThen([-this.__parentSize[0]*r[0],-this.__parentSize[1]*r[1],0],i)),{transform:i,opacity:t,size:this.__parentSize,target:this._node.render()}},SizeAwareView.prototype.getParentSize=function(){return this.__parentSize},SizeAwareView.prototype.render=function(){return this.__id},module.exports=SizeAwareView;
},{"famous/core/Entity":5,"famous/core/Transform":13,"famous/core/View":14}],48:[function(require,module,exports){
module.exports=-1!==navigator.userAgent.indexOf("MSIE")||navigator.appVersion.indexOf("Trident/")>0;
},{}],49:[function(require,module,exports){
function when(e,r,n){n||(n=1),e instanceof Array||(e=[e]);var i=Timer.every(function(){for(var n=0;n<e.length;n++)if(!e[n]())return;r(),Timer.clear(i)},n)}function dualPipe(e,r){e.pipe(r),r.pipe(e)}function clear(e){Engine.removeListener("prerender",e)}function frameQueue(e,r){var n=r,i=function(){r--,0>=r&&(e(),clear(i))};return Engine.on("prerender",i),function(){r=n}}var Timer=require("famous/utilities/Timer"),Engine=require("famous/core/Engine");module.exports={when:when,dualPipe:dualPipe,frameQueue:frameQueue};
},{"famous/core/Engine":4,"famous/utilities/Timer":41}],50:[function(require,module,exports){
function extend(e,t){for(var r in t)e[r]=t[r]}function inherits(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e}function merge(e,t){var r={};return extend(r,e),extend(r,t),r}module.exports={extend:extend,inherits:inherits,merge:merge};
},{}],51:[function(require,module,exports){
function CoverflowLayout(t){Layout.call(this,t),this._touchOffset=0,this._offsetT=0,this.boundTouchStart=this._onSyncStart.bind(this),this.boundTouchUpdate=this._onSyncUpdate.bind(this),this.boundTouchEnd=this._onSyncEnd.bind(this),this.step}var Layout=require("./Layout"),ObjectHelpers=require("../helpers/ObjectHelpers"),Transform=require("famous/core/Transform"),Transitionable=require("famous/transitions/Transitionable"),IsIE=require("../dom/IE");CoverflowLayout.prototype=Object.create(Layout.prototype),CoverflowLayout.prototype.constructor=CoverflowLayout,CoverflowLayout.id="CoverflowLayout",CoverflowLayout.DEFAULT_OPTIONS={transition:{curve:"outExpo",duration:1e3},radiusPercent:.5,dimension1:"x",dimension2:"z"};var DIRECTION={x:0,y:1,z:2},UNUSED_DIRECTION={1:"z",2:"y",3:"x"};CoverflowLayout.prototype.activate=function(){this._bindSyncEvents(),this.resetChildProperties(),this.layout()},CoverflowLayout.prototype._getRadius=function(t){return t||(t=this.controller.getSize()[0]),t*this.options.radiusPercent},CoverflowLayout.prototype.layout=function(t){var o=this.controller.getSize(),e=this.controller.items[this.controller.index].getSize(),i=this.controller.nodes.length;this.step=2*Math.PI/i;var r=this._getParametricCircle({x1:.5*o[0],y1:o[0]*-.5,radius:this._getRadius(o[0])}),n=[.5*(o[0]-e[0]),.5*(o[1]-e[1]),0],s=[];if(s[0]="x"===this.options.dimension1||"x"===this.options.dimension2?0:n[0],s[1]="y"===this.options.dimension1||"y"===this.options.dimension2?0:n[1],s[2]=0,IsIE)var a=[];for(var h=0;i>h;h++){var l=this.controller._sanitizeIndex(this.controller.index+h),c=this.data.parentTransforms[l],u=(this.data.opacities[l],r(this.step*h+.5*Math.PI+this._touchOffset)),d=s.slice();d[DIRECTION[this.options.dimension1]]+=o[0]-u[0]-.5*e[0],d[DIRECTION[this.options.dimension2]]+=u[1],IsIE&&a.push(d[2]),t?c.set(Transform.translate(d[0],d[1],d[2])):c.set(Transform.translate(d[0],d[1],d[2]),this.options.transition)}IsIE&&!t&&this.forceZIndex(a),c.set(Transform.translate(d[0],d[1],d[2]),this.options.transition);var p=this.options.transition.duration||this.options.transition.period;p*=.5;for(var f=t?void 0:{curve:"linear",duration:p},h=0;h<this.controller.renderLimit[0];h++){var y=this.data.opacities[this.controller._sanitizeIndex(this.controller.index+1+h)];y&&(y.halt(),y.set(1-h/this.controller.renderLimit[0],f))}for(var h=0;h<this.controller.renderLimit[1];h++){var y=this.data.opacities[this.controller._sanitizeIndex(this.controller.index-1-h)];y&&(y.halt(),y.set(1-h/this.controller.renderLimit[1],f))}this.data.opacities[this.controller.index].halt(),this.data.opacities[this.controller.index].set(1,f)},CoverflowLayout.prototype.deactivate=function(){if(this.controller.isLastLayoutSingular=!1,IsIE)for(var t=0;t<this.controller.nodes.length;t++)this.controller.items[t].setProperties({zIndex:""});this._unbindSyncEvents()},CoverflowLayout.prototype.getRenderLimit=function(){return[Math.min(10,Math.ceil(.5*this.controller.nodes.length)),Math.min(10,Math.ceil(.5*this.controller.nodes.length))]},CoverflowLayout.prototype.forceZIndex=function(t){for(var o=0;o<this.controller.nodes.length;o++){var e=this.controller._sanitizeIndex(this.controller.index+o);this.controller.items[e].setProperties({zIndex:Math.round(t[o])})}},CoverflowLayout.prototype._bindSyncEvents=function(){this.controller.sync.on("start",this.boundTouchStart),this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},CoverflowLayout.prototype._unbindSyncEvents=function(){this.controller.sync.removeListener("start",this.boundTouchStart),this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},CoverflowLayout.prototype._onSyncStart=function(t){this._offsetT=Math.acos(t.position[0]/this._getRadius())},CoverflowLayout.prototype._onSyncUpdate=function(t){for(var o=t.position[0]/this._getRadius();o>1;)o-=2;for(;-1>o;)o+=2;var e=Math.acos(o);this._touchOffset=this._offsetT-e,this.layout(!0)},CoverflowLayout.prototype._onSyncEnd=function(t){var o=.1*t.velocity[0],e=Math.round((-this._touchOffset-o)/this.step);this._touchOffset=0,this.controller._eventOutput.emit("set",this.controller._sanitizeIndex(this.controller.index+e))},CoverflowLayout.prototype._getParametricCircle=function(t){var o={x1:0,y1:0,radius:20};return ObjectHelpers.extend(o,t),function(t){return[o.x1+o.radius*Math.cos(t),o.y1+o.radius*Math.sin(t)]}},module.exports=CoverflowLayout;
},{"../dom/IE":48,"../helpers/ObjectHelpers":50,"./Layout":53,"famous/core/Transform":13,"famous/transitions/Transitionable":37}],52:[function(require,module,exports){
function GridLayout(t){Layout.call(this,t)}var Layout=require("./Layout"),Transform=require("famous/core/Transform"),Easing=require("famous/transitions/Easing");GridLayout.prototype=Object.create(Layout.prototype),GridLayout.prototype.constructor=GridLayout,GridLayout.id="GridLayout",GridLayout.DEFAULT_OPTIONS={gridDimensions:[3,3],padding:[15,15],selectedItemTransition:{method:"spring",dampingRatio:.65,period:600},transition:{curve:"outExpo",duration:800},delayLength:600},GridLayout.prototype.activate=function(){this.controller._eventOutput.emit("paginationChange",this.options.gridDimensions[0]*this.options.gridDimensions[1]),this.resetChildProperties();var t=this.options.gridDimensions[0]*this.options.gridDimensions[1],o=Math.ceil(this.controller.nodes.length/t),i=Math.floor(this.controller.index/t),e=i*t,n=i===o-1?e+(this.controller.nodes.length-i*t)-1:e+t-1;this._delayTransitions(e,n),this._animateItems(e,n),this._handleTouchEvents()},GridLayout.prototype.layout=function(){for(var t,o=this._getTransforms(),i=0;i<this.controller.nodes.length;i++)t=this.data.parentTransforms[i],t.set(o[i].transform,this.options.transition),this.data.opacities[i].halt(),this.data.opacities[i].set(1,this.options.transition)},GridLayout.prototype.deactivate=function(){this.controller.isLastLayoutSingular=!1,this.controller._eventOutput.emit("paginationChange",this.controller.itemsPerPage),this._removeTouchEvents()},GridLayout.prototype.getRenderLimit=function(){return[0,this.controller.nodes.length]},GridLayout.prototype._handleTouchEvents=function(){this.boundTouchUpdate=function(t){var o=this.data.touchOffset,i=o.get();i[0]+=t.delta[0],o.set([i[0],i[1]])}.bind(this),this.boundTouchEnd=function(){for(var t=this.data.touchOffset,o=t.get(),i=o[0],e=this.controller.getSize()[0],n=0;n<this.controller.items.length;n++){var s=this.data.parentTransforms[n],r=s.translate.get();s.setTranslate([r[0]+o[0],r[1]])}t.set([0,0]),-1*e/5>i?this.controller._eventOutput.emit("next"):i>1*e/5?this.controller._eventOutput.emit("previous"):this.layout()}.bind(this),this._addTouchEvents()},GridLayout.prototype._addTouchEvents=function(){this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},GridLayout.prototype._removeTouchEvents=function(){this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},GridLayout.prototype._delayTransitions=function(t,o){for(var i,e=this.controller.index,n=this.controller.index-1<t?void 0:this.controller.index-1,s=0,r=o-t+1;r>s;){var a=s/(r-1),h=Easing.inOutSine(a);i=h*this.options.delayLength+1,void 0!==e&&(this._setItemDelay(e,i),e=e+1>o?void 0:e+1,s++),void 0!==n&&(this._setItemDelay(n,i),n=t>n-1?void 0:n-1,s++)}},GridLayout.prototype._setItemDelay=function(t,o){trans=this.data.parentTransforms[t],trans.rotate.delay(o),trans.scale.delay(o),trans.translate.delay(o),this.data.opacities[t].delay(o)},GridLayout.prototype._animateItems=function(t,o){for(var i=function(i){return i>=t&&o>=i},e=this._getTransforms(),n=0;n<this.controller.nodes.length;n++){if(i(n))if(n===this.controller.index){var s=this.options.selectedItemTransition.method||"spring",r=this.options.selectedItemTransition.dampingRatio||.65,a=this.options.selectedItemTransition.period||600;this.data.parentTransforms[n].set(e[n].transform,{method:s,dampingRatio:r,period:a})}else this.data.parentTransforms[n].set(e[n].transform,this.options.transition);else this.controller.isLastLayoutSingular||null===this.controller.isLastLayoutSingular?this.data.parentTransforms[n].set(e[n].transform):this.data.parentTransforms[n].set(e[n].transform,this.options.transition);this.data.opacities[n].set(1,this.options.transition)}},GridLayout.prototype._getTransforms=function(){for(var t=this._getGridPositions(this.controller.getSize().slice(0),this.options.padding,this.options.gridDimensions),o=t.cellSize,i=this.controller.getSize().slice(0),e=this.options.gridDimensions[0]*this.options.gridDimensions[1],n=Math.floor(this.controller.index/e),s=[],r=0;r<this.controller.nodes.length;r++){var a=t.at(r);a[0]-=n*i[0]+n*this.options.padding[0],a[2]=1;var h=this.data.sizeCache[r]||this.data.sizeCache[0],d=Math.min(o[0]/h[0],o[1]/h[1]),l=[.5*Math.round(o[0]-h[0]*d),.5*Math.round(o[1]-h[1]*d)];s.push({transform:Transform.thenMove(Transform.scale(d,d),[a[0]+l[0],a[1]+l[1]]),gridPos:a,maxScale:d})}return s},GridLayout.prototype._getGridPositions=function(t,o,i){var e=[(t[0]-o[0]*Math.max(i[0]-1,0))/i[0],(t[1]-o[1]*Math.max(i[1]-1,0))/i[1]],n=i[0]*i[1];return{at:function(s){var r=Math.floor(s/n),a=s%i[0],h=Math.floor((s-r*n)/i[0]);return[a*e[0]+a*o[0]+r*t[0]+r*o[0],h*e[1]+h*o[1]]},cellSize:e}},module.exports=GridLayout;
},{"./Layout":53,"famous/core/Transform":13,"famous/transitions/Easing":33}],53:[function(require,module,exports){
function Layout(t){var o=Utility.clone(this.constructor.DEFAULT_OPTIONS||{});return this.options=ObjectHelpers.merge(o,t),this.id=this.constructor.id,this.controller=null,this.data=null,this}var ObjectHelpers=require("../helpers/ObjectHelpers"),Transform=require("famous/core/Transform"),Utility=require("famous/utilities/Utility");Layout.prototype.setController=function(t){this.controller=t,this.data=t.data},Layout.prototype.resetChildProperties=function(){for(var t=this.options.transition.duration||this.options.transition.period||200,o=0;o<this.controller.nodes.length;o++)this.data.childTransforms[o].set(Transform.identity,{curve:"outExpo",duration:t}),this.data.childOrigins[o].set([0,0]),this.data.childAligns[o].set([0,0])},Layout.prototype.getRenderLimit=function(){},Layout.prototype.activate=function(){},Layout.prototype.layout=function(){},Layout.prototype.deactivate=function(){},module.exports=Layout;
},{"../helpers/ObjectHelpers":50,"famous/core/Transform":13,"famous/utilities/Utility":42}],54:[function(require,module,exports){
function LayoutController(t){SizeAwareView.apply(this,arguments),this.items,this.container,this.index,this.lastIndex,this._activeLayout,this.itemsPerPage=t.itemsPerPage,this.renderLimit=[1,4],this.isLastLayoutSingular=null,this.nodes=[],this.data={opacities:[],parentTransforms:[],parentOrigins:[],parentAligns:[],parentSizes:[],childTransforms:[],childOrigins:[],childAligns:[],touchOffset:new Transitionable([0,0]),sizeCache:[],sizeCacheFull:!1},this._boundLayout=this.layout.bind(this),this._boundActivate=this._activate.bind(this),this.sync=t.sync,this._init()}var Timer=require("famous/utilities/Timer"),Engine=require("famous/core/Engine"),Transform=require("famous/core/Transform"),RenderNode=require("famous/core/RenderNode"),Modifier=require("famous/core/Modifier"),ContainerSurface=require("famous/surfaces/ContainerSurface"),TransitionableTransform=require("famous/transitions/TransitionableTransform"),Transitionable=require("famous/transitions/Transitionable"),LayoutFactory=require("./LayoutFactory"),SizeAwareView=require("../constructors/SizeAwareView"),EventHelpers=require("../events/EventHelpers");LayoutController.prototype=Object.create(SizeAwareView.prototype),LayoutController.prototype.constructor=LayoutController,LayoutController.DEFAULT_OPTIONS={classes:[],loop:void 0,properties:{overflow:"hidden",zIndex:1},perspective:1e3},LayoutController.prototype.setSize=function(t){this.container.setSize(t)},LayoutController.prototype.getSize=function(){return this.container.getSize()},LayoutController.prototype.setItems=function(t){this.items=t,this._reset(),this._createItems(),this.data.sizeCache=new Array(t.length),this.data.sizeCacheFull=!1},LayoutController.prototype.setIndex=function(t,e){this.lastIndex=this.index,this.index=t,this._updateRenderedIndices(),e&&this._safeLayout()},LayoutController.prototype.getLength=function(){return Math.min(this.index+this.renderLimit[0]+this.renderLimit[1],this.nodes.length)},LayoutController.prototype.setRenderLimit=function(t){this.renderLimit=!t instanceof Array?[0,t]:t,this._updateRenderedIndices()},LayoutController.prototype.getLayout=function(){return this._activeLayout},LayoutController.prototype.layout=function(){this._layoutQueue=void 0,this._updateSizeCache(),this.halt(),this._activeLayout&&this._activeLayout.layout()},LayoutController.prototype.setLayout=function(t){t instanceof Function&&(t=new t({})),this._activeLayout&&this._activeLayout.deactivate(),this._activeLayout=t,this._activeLayout.setController(this);var e=this._activeLayout.getRenderLimit();e?this.setRenderLimit(e):this._updateRenderedIndices(),this._safeActivate()},LayoutController.prototype.halt=function(){for(var t=0;t<this.nodes.length;t++)this.data.childOrigins[t].halt(),this.data.childAligns[t].halt(),this.data.childTransforms[t].halt(),this.data.parentOrigins[t].halt(),this.data.parentAligns[t].halt(),this.data.parentTransforms[t].halt(),this.data.opacities[t].halt()},LayoutController.prototype._init=function(){this._createContainer()},LayoutController.prototype._safeLayout=function(){this._layoutQueue?this._layoutQueue():this._layoutQueue=EventHelpers.frameQueue(this._boundLayout,4)},LayoutController.prototype._safeActivate=function(){this._activateQueue?this._activateQueue():this._activateQueue=EventHelpers.frameQueue(this._boundActivate,4)},LayoutController.prototype._activate=function(){this._activateQueue=void 0,this._updateSizeCache(),this.halt(),this._activeLayout.activate()},LayoutController.prototype._updateRenderedIndices=function(){var t=this._previousRender?this._previousRender:[];this.futureIndices=this._calculateFutureIndices(),this._toRender=[];for(var e=0;e<t.length;e++)this._toRender.push(t[e]);for(var e=0;e<this.futureIndices.length;e++)this._toRender.indexOf(this.futureIndices[e])<0&&this._toRender.push(this.futureIndices[e]);this._previousRender=this.futureIndices,this._toRender.sort(function(t,e){return t-e})},LayoutController.prototype._calculateFutureIndices=function(){for(var t=[],e=this.nodes.length,i=0,r=this.renderLimit[0]+this.renderLimit[1],n=0;r>n&&n!=e;n++){var a=this.index-this.renderLimit[0]+n;if(0>a){var o=a%e;if(o=0==o?o:o+e,o==e)continue;t.push(o),i=o>i?o:i}else(0==i||i>a)&&t.push(a%e)}return t},LayoutController.prototype._createContainer=function(){this.container=new ContainerSurface({classes:this.options.classes,properties:this.options.properties}),this.container.context.setPerspective(this.options.perspective);var t=new RenderNode;t.render=this._innerRender.bind(this),this.add(this.container),this.container.add(t)},LayoutController.prototype._connectContainer=function(t){this.container.pipe(t),this.container.pipe(t.sync)},LayoutController.prototype._createItems=function(){for(var t=0;t<this.items.length;t++){var e=this.items[t],i=new Transitionable(1),r=new TransitionableTransform,n=new Transitionable([0,0]),a=new Transitionable([0,0]),o=new Transitionable([void 0,void 0]),s=new TransitionableTransform,h=new Transitionable([0,0]),u=new Transitionable([0,0]),l=new Modifier({transform:r,origin:n,align:a,opacity:i,size:o}),d=new Modifier({transform:s,origin:h,align:u}),c=new Modifier({transform:function(){var t=this.data.touchOffset.get();return Transform.translate(t[0],t[1])}.bind(this)}),p=new RenderNode;p.getSize=e.getSize.bind(e),p.add(c).add(l).add(d).add(e),this.nodes.push(p),this.data.parentTransforms.push(r),this.data.opacities.push(i),this.data.parentOrigins.push(n),this.data.parentAligns.push(a),this.data.parentSizes.push(o),this.data.childTransforms.push(s),this.data.childOrigins.push(h),this.data.childAligns.push(u)}},LayoutController.prototype._reset=function(){this.nodes=[],this.data.parentTransforms=[],this.data.opacities=[],this.data.parentOrigins=[],this.data.parentAligns=[],this.data.parentSizes=[],this.data.childTransforms=[],this.data.childOrigins=[],this.data.childAligns=[],this.data.sizeCache=[],this.data.sizeCacheFull=!1},LayoutController.prototype._sanitizeIndex=function(t){var e=this.nodes.length;return 0>t?t%e+e:t>e-1?t%e:t},LayoutController.prototype._updateSizeCache=function(){if(!this.data.sizeCacheFull){for(var t,e=this.data.sizeCache,i=0,r=0;r<e.length;r++)void 0===e[r]?(t=this.items[r].getSize(),null!==t&&0!=t[0]&&0!=t[1]&&(e[r]=t,this.data.parentSizes[r].set(t),this._eventInput.emit("initialSize",r),i++)):i++;i===e.length&&(this.data.sizeCacheFull=!0)}},LayoutController.prototype._innerRender=function(){for(var t=[],e=0;e<this._toRender.length;e++)t[e]=this.nodes[this._toRender[e]].render();return t},module.exports=LayoutController;
},{"../constructors/SizeAwareView":47,"../events/EventHelpers":49,"./LayoutFactory":55,"famous/core/Engine":4,"famous/core/Modifier":8,"famous/core/RenderNode":10,"famous/core/Transform":13,"famous/surfaces/ContainerSurface":31,"famous/transitions/Transitionable":37,"famous/transitions/TransitionableTransform":38,"famous/utilities/Timer":41}],55:[function(require,module,exports){
var SingularSoftScale=require("./SingularSoftScale"),SingularTwist=require("./SingularTwist"),SingularSlideBehind=require("./SingularSlideBehind"),SingularParallax=require("./SingularParallax"),SingularOpacity=require("./SingularOpacity"),SingularSlideIn=require("./SingularSlideIn"),GridLayout=require("./GridLayout"),CoverflowLayout=require("./CoverflowLayout"),SequentialLayout=require("./SequentialLayout"),LayoutFactory={};LayoutFactory.wrap=function(a){function r(r){return r instanceof a?r:new a(r)}return r.id=a.id,r},LayoutFactory.SingularSoftScale=LayoutFactory.wrap(SingularSoftScale),LayoutFactory.SingularTwist=LayoutFactory.wrap(SingularTwist),LayoutFactory.SingularSlideBehind=LayoutFactory.wrap(SingularSlideBehind),LayoutFactory.SingularParallax=LayoutFactory.wrap(SingularParallax),LayoutFactory.SingularOpacity=LayoutFactory.wrap(SingularOpacity),LayoutFactory.SingularSlideIn=LayoutFactory.wrap(SingularSlideIn),LayoutFactory.GridLayout=LayoutFactory.wrap(GridLayout),LayoutFactory.CoverflowLayout=LayoutFactory.wrap(CoverflowLayout),LayoutFactory.SequentialLayout=LayoutFactory.wrap(SequentialLayout),module.exports=LayoutFactory;
},{"./CoverflowLayout":51,"./GridLayout":52,"./SequentialLayout":56,"./SingularOpacity":58,"./SingularParallax":59,"./SingularSlideBehind":60,"./SingularSlideIn":61,"./SingularSoftScale":62,"./SingularTwist":63}],56:[function(require,module,exports){
function SequentialLayout(t){Layout.call(this,t),this.applyPreAnimationOffset=[],this.useTouchEndTransition=!1}var Layout=require("./Layout"),Transform=require("famous/core/Transform"),Easing=require("famous/transitions/Easing");SequentialLayout.prototype=Object.create(Layout.prototype),SequentialLayout.prototype.constructor=SequentialLayout,SequentialLayout.id="SequentialLayout",SequentialLayout.DEFAULT_OPTIONS={transition:{duration:800,curve:"outExpo"},touchEndTransition:{method:"snap",period:200},padding:[10,0],direction:"x"},SequentialLayout.prototype.activate=function(){this.resetChildProperties();for(var t=0;t<this.controller.nodes.length;t++)this.data.opacities[t].set(1,this.options.transition);this.containerSize=this.controller.getSize(),this.layout(),this._handleTouchEvents()},SequentialLayout.prototype.layout=function(){for(var t,e,i="y"===this.options.direction?1:0,o=1===i?0:1,n=this.controller.index,s=this.controller.nodes.length-1,a=[],r=[0,0],h=1;h<=this.controller.renderLimit[0];h++)t=this.controller._sanitizeIndex(n-h),e=this._getCenteredPosition(t,o),r[o]=e[o],r[i]-=this.data.sizeCache[t][i]+this.options.padding[i],a[t]=Transform.translate(r[0],r[1]);for(var u=[0,0],h=0;h<this.controller.renderLimit[1]&&(t=this.controller._sanitizeIndex(n+h),e=this._getCenteredPosition(t,o),this.controller.options.loop===!0||t>=n);h++)a[t]=this._getTransform(t,u,o),u[i]+=this.data.sizeCache[t][i]+this.options.padding[i];var c=0;if(!this.controller.options.loop&&a[s]&&this.data.sizeCache[s]){var l=0===i?a[s][12]:a[s][13];if(l>=0){var d=l+this.data.sizeCache[t][i];d<this.containerSize[i]&&(c=this.containerSize[i]-d)}}var p=this.options.transition;this.useTouchEndTransition&&(p=this.options.touchEndTransition,this.useTouchEndTransition=!1);for(var h=0;h<this.controller.nodes.length;h++)if(a[h]){if(this.applyPreAnimationOffset[h]){var f=0===i?a[h][12]:a[h][13],y=0>f?-1:1;e=this._getCenteredPosition(h,o);var T=[];T[i]=this.containerSize[i]*y,T[o]=e[o],this.data.parentTransforms[h].set(Transform.translate(T[0],T[1])),this.applyPreAnimationOffset[h]=!1}0===i?a[h][12]+=c:a[h][13]+=c,this.data.parentTransforms[h].set(a[h],p),this.data.opacities[h].set(1,p)}else this.data.parentTransforms[h].set(Transform.translate(this.containerSize[0],this.containerSize[1])),this.data.opacities[h].set(0),this.applyPreAnimationOffset[h]=!0},SequentialLayout.prototype.deactivate=function(){this.isLastLayoutSingular=!1,this._removeTouchEvents()},SequentialLayout.prototype.getRenderLimit=function(){return[5,Math.min(10,this.controller.nodes.length)]},SequentialLayout.prototype._handleTouchEvents=function(){var t="y"===this.options.direction?1:0;this.boundTouchUpdate=function(e){var i=this.data.touchOffset,o=i.get();o[t]+=e.delta[t],i.set([o[0],o[1]])}.bind(this),this.boundTouchEnd=function(){for(var e=this.data.touchOffset,i=e.get(),o=i[t],n=0;n<this.controller.items.length;n++){var s=this.data.parentTransforms[n],a=s.translate.get();s.setTranslate([a[0]+i[0],a[1]+i[1]])}e.set([0,0]);var r=o>0?-1:1,h=this.controller.index;for(o=Math.abs(o);o>0;)o-=this.data.sizeCache[h][t],h=this.controller._sanitizeIndex(h+r);this.useTouchEndTransition=!0,this.controller._eventOutput.emit("set",h)}.bind(this),this._addTouchEvents()},SequentialLayout.prototype._addTouchEvents=function(){this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},SequentialLayout.prototype._removeTouchEvents=function(){this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},SequentialLayout.prototype._getCenteredPosition=function(t,e){if(void 0===this.data.sizeCache[t])return[0,0];var i=[0,0];return i[e]=.5*(this.containerSize[e]-this.data.sizeCache[t][e]),i},SequentialLayout.prototype._getTransform=function(t,e,i){var o=this._getCenteredPosition(t,i);return Transform.translate(e[0]+o[0],e[1]+o[1])},module.exports=SequentialLayout;
},{"./Layout":53,"famous/core/Transform":13,"famous/transitions/Easing":33}],57:[function(require,module,exports){
function SingularLayout(t){return Layout.call(this,t),this._boundSizeListener=null,this}var Layout=require("./Layout"),Transform=require("famous/core/Transform"),Timer=require("famous/utilities/Timer");SingularLayout.prototype=Object.create(Layout.prototype),SingularLayout.prototype.constructor=SingularLayout,SingularLayout.DEFAULT_OPTIONS={},SingularLayout.prototype.activate=function(){this._boundSizeListener=this.centerItem.bind(this);for(var t=0;t<this.controller.items.length;t++)this.data.childOrigins[t].set([.5,.5]),this.data.childAligns[t].set([.5,.5]),this.data.childTransforms[t].set(Transform.identity),t===this.controller.index?(this.data.opacities[t].set(1,this.options.curve),this.data.sizeCache[t]&&(this.controller.isLastLayoutSingular||null===this.controller.isLastLayoutSingular?this.centerItem(t):this.data.childTransforms[t].set(Transform.scale(.8,.8),{duration:150},function(t){this.centerItem(t,{method:"spring",dampingRatio:.65,period:400}),this.data.childTransforms[t].set(Transform.identity,{duration:150})}.bind(this,t)))):(this.data.childTransforms[t].set(Transform.translate(0,0,-10)),this.data.opacities[t].set(0,{duration:300},function(t){this.data.sizeCache[t]&&this.centerItem(t)}.bind(this,t)));this.controller._eventInput.on("initialSize",this._boundSizeListener),this._handleTouchEvents()},SingularLayout.prototype.layout=function(){for(var t=this.controller.index,i=this.controller.lastIndex,e=this.controller.items.length-1,n=(t>i||0===t&&i===e)&&!(t===e&&0===i),o=this.controller.getSize().slice(0),r=0;r<this.controller.items.length;r++)r===this.controller.index?this.currentItemTransition(this.getItem(r),o,n):r===this.controller.lastIndex?this.previousItemTransition(this.getItem(r),o,n):this.otherItemTransition(this.getItem(r),o)},SingularLayout.prototype.otherItemTransition=function(t){t.opacity.set(0)},SingularLayout.prototype.currentItemTransition=function(){},SingularLayout.prototype.previousItemTransition=function(){},SingularLayout.prototype.deactivate=function(){this.controller.isLastLayoutSingular=!0,this.controller._eventInput.removeListener("initialSize",this._boundSizeListener),this._removeTouchEvents()},SingularLayout.prototype.getRenderLimit=function(){return[1,1]},SingularLayout.prototype.getCenteredPosition=function(t){var i=this.controller.getSize(),e=this.data.sizeCache[t];return[.5*(i[0]-e[0]),.5*(i[1]-e[1])]},SingularLayout.prototype.centerItem=function(t,i){var e=this.controller.getSize(),n=this.data.sizeCache[t];this.data.parentTransforms[t].set(Transform.translate(.5*(e[0]-n[0]),.5*(e[1]-n[1])),i)},SingularLayout.prototype.getItem=function(t){return{item:this.controller.items[t],size:this.data.sizeCache[t],index:t,opacity:this.data.opacities[t],parentOrigin:this.data.parentOrigins[t],parentAlign:this.data.parentAligns[t],parentSize:this.data.parentSizes[t],parentTransform:this.data.parentTransforms[t],childTransform:this.data.childTransforms[t],childOrigin:this.data.childOrigins[t],childAlign:this.data.childAligns[t]}},SingularLayout.prototype._handleTouchEvents=function(){this.boundTouchUpdate=function(t){var i=this.controller.index,e=this.data.sizeCache[i],n=this.data.touchOffset,o=n.get();if(n.set([o[0]+t.delta[0],o[1]]),Math.abs(o[0])>1*e[0]/3){var r=n.get()[0]<0?"previous":"next";this._emitEventFromTouch(t.velocity,r)}}.bind(this),this.boundTouchEnd=function(t){var i=this.data.touchOffset;i.set([0,0],{curve:"outBack",duration:150}),Timer.setTimeout(function(){"function"==typeof t&&t()},100)}.bind(this),this._addTouchEvents()},SingularLayout.prototype._addTouchEvents=function(){this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},SingularLayout.prototype._removeTouchEvents=function(){this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},SingularLayout.prototype._emitEventFromTouch=function(t,i){this._removeTouchEvents();var e=function(){this.controller._eventOutput.emit(i),this._addTouchEvents()}.bind(this);this.boundTouchEnd(e)},module.exports=SingularLayout;
},{"./Layout":53,"famous/core/Transform":13,"famous/utilities/Timer":41}],58:[function(require,module,exports){
function SingularOpacity(t){SingularLayout.call(this,t)}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform");SingularOpacity.prototype=Object.create(SingularLayout.prototype),SingularOpacity.prototype.constructor=SingularOpacity,SingularOpacity.id="SingularOpacity",SingularOpacity.DEFAULT_OPTIONS={transition:{curve:"linear",duration:500}},SingularOpacity.prototype.currentItemTransition=function(t){t.opacity.set(1,this.options.transition),this.centerItem(this.controller.index)},SingularOpacity.prototype.previousItemTransition=function(t){t.opacity.set(0,this.options.transition),this.centerItem(this.controller.lastIndex)},module.exports=SingularOpacity;
},{"./SingularLayout":57,"famous/core/Transform":13}],59:[function(require,module,exports){
function SingularParallax(a){SingularLayout.call(this,a),this.axis="x"===this.options.direction?0:1}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform");SingularParallax.prototype=Object.create(SingularLayout.prototype),SingularParallax.prototype.constructor=SingularParallax,SingularParallax.id="SingularParallax",SingularParallax.DEFAULT_OPTIONS={transition:{method:"spring",dampingRatio:.95,period:550},direction:"y",parallaxRatio:.2},SingularParallax.Depth=1,SingularParallax.prototype.currentItemTransition=function(a,r,t){a.opacity.set(1),a.parentTransform.halt();var i,n=this.getCenteredPosition(this.controller.index);t?(i=[n[0],n[1],-2*SingularParallax.Depth],i[this.axis]=-a.size[this.axis]*this.options.parallaxRatio,a.parentTransform.set(Transform.translate(i[0],i[1],i[2])),a.parentTransform.set(Transform.translate(n[0],n[1],n[2]),this.options.transition)):(i=[n[0],n[1],0],i[this.axis]=r[this.axis],a.parentTransform.set(Transform.translate(i[0],i[1],i[2])),a.parentTransform.set(Transform.translate(n[0],n[1],n[2]),this.options.transition)),a.childTransform.set(Transform.identity)},SingularParallax.prototype.previousItemTransition=function(a,r,t){a.opacity.set(1),a.parentTransform.halt();var i=this.getCenteredPosition(this.controller.index);if(a.opacity.set(0,{curve:"linear",duration:this.options.transition.period||this.options.transition.duration}),t){var n=[i[0],i[1],-2];n[this.axis]=r[this.axis],a.parentTransform.set(Transform.translate(n[0],n[1],n[2]),this.options.transition),a.parentTransform.set(Transform.translate(i[0],i[1],i[2]),{curve:"linear",duration:1})}else{var s=Transform.translate(i[0],i[1],-2),o=[i[0],i[1],-2*SingularParallax.Depth];o[this.axis]=-a.size[this.axis]*this.options.parallaxRatio,a.parentTransform.set(s),a.parentTransform.set(Transform.translate(o[0],o[1],o[2]),this.options.transition)}},module.exports=SingularParallax;
},{"./SingularLayout":57,"famous/core/Transform":13}],60:[function(require,module,exports){
function SingularSlideBehind(i){SingularLayout.call(this,i)}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform"),IsIE=require("../dom/IE");SingularSlideBehind.prototype=Object.create(SingularLayout.prototype),SingularSlideBehind.prototype.constructor=SingularSlideBehind,SingularSlideBehind.id="SingularSlideBehind",SingularSlideBehind.DEFAULT_OPTIONS={duration:600,rotationAngle:Math.PI/4},SingularSlideBehind.FirstCurve="easeInOut",SingularSlideBehind.SecondCurve="easeInOut",SingularSlideBehind.DurationRatio=1/3,SingularSlideBehind.OffsetFactor=.5,SingularSlideBehind.zIndex=-500,SingularSlideBehind.prototype.currentItemTransition=function(i,e,n){var r,t,a,o;n?(r=[.5,1],t=[.5,1],a=1,o=i.size[1]*SingularSlideBehind.OffsetFactor):(r=[.5,0],t=[.5,0],a=-1,o=i.size[1]*SingularSlideBehind.OffsetFactor*-1);var d=this.options.duration*SingularSlideBehind.DurationRatio,l=(this.options.duration-d,{duration:d,curve:SingularSlideBehind.FirstCurve}),s={duration:d,curve:SingularSlideBehind.SecondCurve};i.childOrigin.set(r),i.childAlign.set(t),i.opacity.set(1,l),i.childTransform.set(Transform.multiply(Transform.translate(0,0,SingularSlideBehind.zIndex),Transform.rotateX(this.options.rotationAngle*a))),i.childTransform.set(Transform.translate(0,o,SingularSlideBehind.zIndex/2),l,function(){IsIE&&i.item.setProperties({zIndex:1}),i.childTransform.set(Transform.identity,s)}),this.centerItem(this.controller.index)},SingularSlideBehind.prototype.previousItemTransition=function(i,e,n){var r,t,a,o;n?(r=[.5,0],t=[.5,0],a=-1,o=i.size[1]*SingularSlideBehind.OffsetFactor*-1):(r=[.5,1],t=[.5,1],a=1,o=i.size[1]*SingularSlideBehind.OffsetFactor);var d=this.options.duration*SingularSlideBehind.DurationRatio,l={duration:d,curve:SingularSlideBehind.FirstCurve},s={duration:this.options.duration-d,curve:SingularSlideBehind.SecondCurve};i.childOrigin.set(r),i.childAlign.set(t),i.childTransform.set(Transform.multiply(Transform.translate(0,o),Transform.rotateX(this.options.rotationAngle*a)),l,function(){IsIE&&i.item.setProperties({zIndex:-1}),i.opacity.set(0,s),i.childTransform.set(Transform.translate(0,0,SingularSlideBehind.zIndex),s)}.bind(this)),this.centerItem(this.controller.lastIndex)},module.exports=SingularSlideBehind;
},{"../dom/IE":48,"./SingularLayout":57,"famous/core/Transform":13}],61:[function(require,module,exports){
function SingularSlideIn(i){SingularLayout.call(this,i),this.options.direction=this.options.direction.toLowerCase()}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform");SingularSlideIn.prototype=Object.create(SingularLayout.prototype),SingularSlideIn.prototype.constructor=SingularSlideIn,SingularSlideIn.id="SingularSlideIn",SingularSlideIn.DEFAULT_OPTIONS={transition:{curve:"easeOut",duration:600},delayRatio:.15,direction:"y"},SingularSlideIn.prototype.currentItemTransition=function(i,t,o){var n=this.options.transition,r=n.duration||n.period,e=r*this.options.delayRatio;r-=e;var a,s,l=n.method?{period:r,method:n.method,dampingRatio:n.dampingRatio}:{duration:r,curve:n.curve};o?"x"===this.options.direction?(a=t[0],s=0):(a=0,s=-1*t[1]):"x"===this.options.direction?(a=-1*t[0],s=0):(a=0,s=t[1]),i.opacity.set(1),i.childTransform.set(Transform.translate(a,s)),i.opacity.delay(e,function(){i.childTransform.set(Transform.translate(0,0),l)}),this.centerItem(this.controller.index)},SingularSlideIn.prototype.previousItemTransition=function(i,t,o){var n,r,e;o?("x"===this.options.direction?(n=[0,.5],r=[0,.5]):(n=[.5,1],r=[.5,1]),e=1):("x"===this.options.direction?(n=[1,.5],r=[1,.5]):(n=[.5,0],r=[.5,0]),e=-1),i.childOrigin.set(n),i.childAlign.set(r),"x"===this.options.direction?i.childTransform.set(Transform.rotateY(Math.PI/4*e),this.options.transition):i.childTransform.set(Transform.rotateX(Math.PI/3*e),this.options.transition),i.opacity.set(0,this.options.transition),this.centerItem(this.controller.lastIndex)},module.exports=SingularSlideIn;
},{"./SingularLayout":57,"famous/core/Transform":13}],62:[function(require,module,exports){
function SingularSoftScale(t){SingularLayout.call(this,t)}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform"),Utility=require("famous/utilities/Utility");SingularSoftScale.prototype=Object.create(SingularLayout.prototype),SingularSoftScale.prototype.constructor=SingularSoftScale,SingularSoftScale.id="SingularSoftScale",SingularSoftScale.DEFAULT_OPTIONS={transition:{duration:600,curve:"easeOut"},scaleUpValue:1.3,scaleDownValue:.9,delayRatio:.05},SingularSoftScale.prototype.currentItemTransition=function(t,o,a){var i=a?this.options.scaleDownValue:this.options.scaleUpValue;t.opacity.set(0),t.childTransform.set(Transform.scale(i,i));var e=this.options.transition,r=e.duration||e.period,n=r*this.options.delayRatio;r-=n;var l=e.method?{period:r,dampingRatio:e.dampingRatio,method:e.method}:{duration:r,curve:e.curve};t.opacity.delay(n,function(){t.opacity.set(1,l),t.childTransform.set(Transform.scale(1,1),l)})},SingularSoftScale.prototype.previousItemTransition=function(t,o,a){var i=a?this.options.scaleUpValue:this.options.scaleDownValue,e=this.options.transition,r=e.method?{period:.45*e.period,method:e.method,dampingRatio:e.dampingRatio}:{duration:.45*e.duration,curve:e.curve};t.childTransform.set(Transform.scale(i,i),e),t.opacity.set(0,r)},module.exports=SingularSoftScale;
},{"./SingularLayout":57,"famous/core/Transform":13,"famous/utilities/Utility":42}],63:[function(require,module,exports){
function SingularTwist(t){SingularLayout.call(this,t),this.options.direction=this.options.direction.toLowerCase()}function _getTransformFromDirection(t,i,r){return"x"===t?Transform.thenMove(Transform.rotateY(i),[0,0,r]):Transform.thenMove(Transform.rotateX(i),[0,0,r])}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform"),Utility=require("famous/utilities/Utility"),IsIE=require("../dom/IE");SingularTwist.prototype=Object.create(SingularLayout.prototype),SingularTwist.prototype.constructor=SingularTwist,SingularTwist.id="SingularTwist",SingularTwist.DEFAULT_OPTIONS={transition:{method:"spring",dampingRatio:.85,period:600},direction:"x",flipDirection:!1,depth:-1500},SingularTwist.prototype.currentItemTransition=function(t,i,r){t.childTransform.halt(),t.opacity.set(1),IsIE&&t.item.setProperties({zIndex:1});var o;r?(o=_getTransformFromDirection(this.options.direction,.99*Math.PI,this.options.depth),t.childTransform.set(o),t.childTransform.set(Transform.identity,this.options.transition)):(o=_getTransformFromDirection(this.options.direction,.99*-Math.PI,this.options.depth),t.childTransform.set(o),t.childTransform.set(Transform.identity,this.options.transition)),this.centerItem(this.controller.index)},SingularTwist.prototype.previousItemTransition=function(t,i,r){t.childTransform.halt(),t.opacity.set(1),IsIE&&t.item.setProperties({zIndex:-1});var o;r?(t.childTransform.set(Transform.identity),o=_getTransformFromDirection(this.options.direction,.99*-Math.PI,this.options.depth),t.childTransform.set(o,this.options.transition)):(t.childTransform.set(Transform.identity),o=_getTransformFromDirection(this.options.direction,.99*Math.PI,this.options.depth),t.childTransform.set(o,this.options.transition)),this.centerItem(this.controller.lastIndex)},module.exports=SingularTwist;
},{"../dom/IE":48,"./SingularLayout":57,"famous/core/Transform":13,"famous/utilities/Utility":42}],64:[function(require,module,exports){
function getAvailableTransitionCurves(){for(var r=getKeys(Easing).sort(),e={},n=0;n<r.length;n++)e[r[n]]=Easing[r[n]];return e}function getKeys(r){var e,n=[];for(e in r)r.hasOwnProperty(e)&&n.push(e);return n}function registerKeys(){var r=getAvailableTransitionCurves();for(var e in r)TweenTransition.registerCurve(e,r[e])}var Easing=require("famous/transitions/Easing"),TweenTransition=require("famous/transitions/TweenTransition");registerKeys();
},{"famous/transitions/Easing":33,"famous/transitions/TweenTransition":39}],65:[function(require,module,exports){
var Transitionable=require("famous/transitions/Transitionable"),SpringTransition=require("famous/transitions/SpringTransition"),SnapTransition=require("famous/transitions/SnapTransition"),WallTransition=require("famous/transitions/WallTransition");Transitionable.registerMethod("spring",SpringTransition),Transitionable.registerMethod("snap",SnapTransition),Transitionable.registerMethod("wall",WallTransition);
},{"famous/transitions/SnapTransition":35,"famous/transitions/SpringTransition":36,"famous/transitions/Transitionable":37,"famous/transitions/WallTransition":40}],66:[function(require,module,exports){
function Slide(e){Surface.call(this,{content:e,size:[!0,!0]})}var Surface=require("famous/core/Surface");Slide.prototype=Object.create(Surface.prototype),Slide.prototype.constructor=Slide,module.exports=Slide;
},{"famous/core/Surface":12}]},{},[44])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0NvbnRleHQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9FbGVtZW50QWxsb2NhdG9yLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvRWxlbWVudE91dHB1dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0VuZ2luZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0VudGl0eS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0V2ZW50RW1pdHRlci5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0V2ZW50SGFuZGxlci5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL01vZGlmaWVyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvT3B0aW9uc01hbmFnZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9SZW5kZXJOb2RlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvU3BlY1BhcnNlci5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL1N1cmZhY2UuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9UcmFuc2Zvcm0uanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9WaWV3LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvVmlld1NlcXVlbmNlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2lucHV0cy9GYXN0Q2xpY2suanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvaW5wdXRzL0dlbmVyaWNTeW5jLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2lucHV0cy9Nb3VzZVN5bmMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvaW5wdXRzL1Njcm9sbFN5bmMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvaW5wdXRzL1RvdWNoU3luYy5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9pbnB1dHMvVG91Y2hUcmFja2VyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL21hdGgvVmVjdG9yLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3BoeXNpY3MvUGh5c2ljc0VuZ2luZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2JvZGllcy9QYXJ0aWNsZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2NvbnN0cmFpbnRzL0NvbnN0cmFpbnQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvcGh5c2ljcy9jb25zdHJhaW50cy9TbmFwLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3BoeXNpY3MvY29uc3RyYWludHMvV2FsbC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2ZvcmNlcy9Gb3JjZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2ZvcmNlcy9TcHJpbmcuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvcGh5c2ljcy9pbnRlZ3JhdG9ycy9TeW1wbGVjdGljRXVsZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvc3VyZmFjZXMvQ29udGFpbmVyU3VyZmFjZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9zdXJmYWNlcy9JbWFnZVN1cmZhY2UuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvdHJhbnNpdGlvbnMvRWFzaW5nLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL011bHRpcGxlVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy90cmFuc2l0aW9ucy9TbmFwVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy90cmFuc2l0aW9ucy9TcHJpbmdUcmFuc2l0aW9uLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlVHJhbnNmb3JtLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL1R3ZWVuVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy90cmFuc2l0aW9ucy9XYWxsVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy91dGlsaXRpZXMvVGltZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHkuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvdmlld3MvU2VxdWVudGlhbExheW91dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL0Nhcm91c2VsLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvY29tcG9uZW50cy9BcnJvd3MuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9jb21wb25lbnRzL0RvdHMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9jb25zdHJ1Y3RvcnMvU2l6ZUF3YXJlVmlldy5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2RvbS9JRS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2V2ZW50cy9FdmVudEhlbHBlcnMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9oZWxwZXJzL09iamVjdEhlbHBlcnMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL0NvdmVyZmxvd0xheW91dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2xheW91dHMvR3JpZExheW91dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2xheW91dHMvTGF5b3V0LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9MYXlvdXRDb250cm9sbGVyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9MYXlvdXRGYWN0b3J5LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TZXF1ZW50aWFsTGF5b3V0LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TaW5ndWxhckxheW91dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2xheW91dHMvU2luZ3VsYXJPcGFjaXR5LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TaW5ndWxhclBhcmFsbGF4LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TaW5ndWxhclNsaWRlQmVoaW5kLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TaW5ndWxhclNsaWRlSW4uanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1Npbmd1bGFyU29mdFNjYWxlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TaW5ndWxhclR3aXN0LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvcmVnaXN0cmllcy9FYXNpbmcuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9yZWdpc3RyaWVzL1BoeXNpY3MuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9zbGlkZXMvU2xpZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZW5kZXJOb2RlID0gcmVxdWlyZSgnLi9SZW5kZXJOb2RlJyk7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnLi9FdmVudEhhbmRsZXInKTtcbnZhciBFbGVtZW50QWxsb2NhdG9yID0gcmVxdWlyZSgnLi9FbGVtZW50QWxsb2NhdG9yJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcbnZhciBUcmFuc2l0aW9uYWJsZSA9IHJlcXVpcmUoJ2ZhbW91cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZScpO1xudmFyIF9vcmlnaW5aZXJvWmVybyA9IFtcbiAgICAgICAgMCxcbiAgICAgICAgMFxuICAgIF07XG5mdW5jdGlvbiBfZ2V0RWxlbWVudFNpemUoZWxlbWVudCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIGVsZW1lbnQuY2xpZW50V2lkdGgsXG4gICAgICAgIGVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgXTtcbn1cbmZ1bmN0aW9uIENvbnRleHQoY29udGFpbmVyKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5fYWxsb2NhdG9yID0gbmV3IEVsZW1lbnRBbGxvY2F0b3IoY29udGFpbmVyKTtcbiAgICB0aGlzLl9ub2RlID0gbmV3IFJlbmRlck5vZGUoKTtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLl9zaXplID0gX2dldEVsZW1lbnRTaXplKHRoaXMuY29udGFpbmVyKTtcbiAgICB0aGlzLl9wZXJzcGVjdGl2ZVN0YXRlID0gbmV3IFRyYW5zaXRpb25hYmxlKDApO1xuICAgIHRoaXMuX3BlcnNwZWN0aXZlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX25vZGVDb250ZXh0ID0ge1xuICAgICAgICBhbGxvY2F0b3I6IHRoaXMuX2FsbG9jYXRvcixcbiAgICAgICAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0uaWRlbnRpdHksXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIG9yaWdpbjogX29yaWdpblplcm9aZXJvLFxuICAgICAgICBhbGlnbjogbnVsbCxcbiAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZVxuICAgIH07XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTaXplKF9nZXRFbGVtZW50U2l6ZSh0aGlzLmNvbnRhaW5lcikpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59XG5Db250ZXh0LnByb3RvdHlwZS5nZXRBbGxvY2F0b3IgPSBmdW5jdGlvbiBnZXRBbGxvY2F0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsbG9jYXRvcjtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQob2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGUuYWRkKG9iaik7XG59O1xuQ29udGV4dC5wcm90b3R5cGUubWlncmF0ZSA9IGZ1bmN0aW9uIG1pZ3JhdGUoY29udGFpbmVyKSB7XG4gICAgaWYgKGNvbnRhaW5lciA9PT0gdGhpcy5jb250YWluZXIpXG4gICAgICAgIHJldHVybjtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLl9hbGxvY2F0b3IubWlncmF0ZShjb250YWluZXIpO1xufTtcbkNvbnRleHQucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xufTtcbkNvbnRleHQucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbiBzZXRTaXplKHNpemUpIHtcbiAgICBpZiAoIXNpemUpXG4gICAgICAgIHNpemUgPSBfZ2V0RWxlbWVudFNpemUodGhpcy5jb250YWluZXIpO1xuICAgIHRoaXMuX3NpemVbMF0gPSBzaXplWzBdO1xuICAgIHRoaXMuX3NpemVbMV0gPSBzaXplWzFdO1xufTtcbkNvbnRleHQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShjb250ZXh0UGFyYW1ldGVycykge1xuICAgIGlmIChjb250ZXh0UGFyYW1ldGVycykge1xuICAgICAgICBpZiAoY29udGV4dFBhcmFtZXRlcnMudHJhbnNmb3JtKVxuICAgICAgICAgICAgdGhpcy5fbm9kZUNvbnRleHQudHJhbnNmb3JtID0gY29udGV4dFBhcmFtZXRlcnMudHJhbnNmb3JtO1xuICAgICAgICBpZiAoY29udGV4dFBhcmFtZXRlcnMub3BhY2l0eSlcbiAgICAgICAgICAgIHRoaXMuX25vZGVDb250ZXh0Lm9wYWNpdHkgPSBjb250ZXh0UGFyYW1ldGVycy5vcGFjaXR5O1xuICAgICAgICBpZiAoY29udGV4dFBhcmFtZXRlcnMub3JpZ2luKVxuICAgICAgICAgICAgdGhpcy5fbm9kZUNvbnRleHQub3JpZ2luID0gY29udGV4dFBhcmFtZXRlcnMub3JpZ2luO1xuICAgICAgICBpZiAoY29udGV4dFBhcmFtZXRlcnMuYWxpZ24pXG4gICAgICAgICAgICB0aGlzLl9ub2RlQ29udGV4dC5hbGlnbiA9IGNvbnRleHRQYXJhbWV0ZXJzLmFsaWduO1xuICAgICAgICBpZiAoY29udGV4dFBhcmFtZXRlcnMuc2l6ZSlcbiAgICAgICAgICAgIHRoaXMuX25vZGVDb250ZXh0LnNpemUgPSBjb250ZXh0UGFyYW1ldGVycy5zaXplO1xuICAgIH1cbiAgICB2YXIgcGVyc3BlY3RpdmUgPSB0aGlzLl9wZXJzcGVjdGl2ZVN0YXRlLmdldCgpO1xuICAgIGlmIChwZXJzcGVjdGl2ZSAhPT0gdGhpcy5fcGVyc3BlY3RpdmUpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUucGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZSA/IHBlcnNwZWN0aXZlLnRvRml4ZWQoKSArICdweCcgOiAnJztcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUud2Via2l0UGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZSA/IHBlcnNwZWN0aXZlLnRvRml4ZWQoKSA6ICcnO1xuICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZSA9IHBlcnNwZWN0aXZlO1xuICAgIH1cbiAgICB0aGlzLl9ub2RlLmNvbW1pdCh0aGlzLl9ub2RlQ29udGV4dCk7XG59O1xuQ29udGV4dC5wcm90b3R5cGUuZ2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbiBnZXRQZXJzcGVjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGVyc3BlY3RpdmVTdGF0ZS5nZXQoKTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIHNldFBlcnNwZWN0aXZlKHBlcnNwZWN0aXZlLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLl9wZXJzcGVjdGl2ZVN0YXRlLnNldChwZXJzcGVjdGl2ZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spO1xufTtcbkNvbnRleHQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUsIGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQodHlwZSwgZXZlbnQpO1xufTtcbkNvbnRleHQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24odHlwZSwgaGFuZGxlcikge1xuICAgIHJldHVybiB0aGlzLl9ldmVudE91dHB1dC5vbih0eXBlLCBoYW5kbGVyKTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRPdXRwdXQucmVtb3ZlTGlzdGVuZXIodHlwZSwgaGFuZGxlcik7XG59O1xuQ29udGV4dC5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uIHBpcGUodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50T3V0cHV0LnBpcGUodGFyZ2V0KTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbiB1bnBpcGUodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50T3V0cHV0LnVucGlwZSh0YXJnZXQpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dDsiLCJmdW5jdGlvbiBFbGVtZW50QWxsb2NhdG9yKGNvbnRhaW5lcikge1xuICAgIGlmICghY29udGFpbmVyKVxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5kZXRhY2hlZE5vZGVzID0ge307XG4gICAgdGhpcy5ub2RlQ291bnQgPSAwO1xufVxuRWxlbWVudEFsbG9jYXRvci5wcm90b3R5cGUubWlncmF0ZSA9IGZ1bmN0aW9uIG1pZ3JhdGUoY29udGFpbmVyKSB7XG4gICAgdmFyIG9sZENvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyO1xuICAgIGlmIChjb250YWluZXIgPT09IG9sZENvbnRhaW5lcilcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmIChvbGRDb250YWluZXIgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChvbGRDb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChvbGRDb250YWluZXIuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQob2xkQ29udGFpbmVyLnJlbW92ZUNoaWxkKG9sZENvbnRhaW5lci5maXJzdENoaWxkKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG59O1xuRWxlbWVudEFsbG9jYXRvci5wcm90b3R5cGUuYWxsb2NhdGUgPSBmdW5jdGlvbiBhbGxvY2F0ZSh0eXBlKSB7XG4gICAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoISh0eXBlIGluIHRoaXMuZGV0YWNoZWROb2RlcykpXG4gICAgICAgIHRoaXMuZGV0YWNoZWROb2Rlc1t0eXBlXSA9IFtdO1xuICAgIHZhciBub2RlU3RvcmUgPSB0aGlzLmRldGFjaGVkTm9kZXNbdHlwZV07XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAobm9kZVN0b3JlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ID0gbm9kZVN0b3JlLnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHJlc3VsdCk7XG4gICAgfVxuICAgIHRoaXMubm9kZUNvdW50Kys7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5FbGVtZW50QWxsb2NhdG9yLnByb3RvdHlwZS5kZWFsbG9jYXRlID0gZnVuY3Rpb24gZGVhbGxvY2F0ZShlbGVtZW50KSB7XG4gICAgdmFyIG5vZGVUeXBlID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBub2RlU3RvcmUgPSB0aGlzLmRldGFjaGVkTm9kZXNbbm9kZVR5cGVdO1xuICAgIG5vZGVTdG9yZS5wdXNoKGVsZW1lbnQpO1xuICAgIHRoaXMubm9kZUNvdW50LS07XG59O1xuRWxlbWVudEFsbG9jYXRvci5wcm90b3R5cGUuZ2V0Tm9kZUNvdW50ID0gZnVuY3Rpb24gZ2V0Tm9kZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVDb3VudDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRBbGxvY2F0b3I7IiwidmFyIEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnLi9FdmVudEhhbmRsZXInKTtcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybScpO1xudmFyIHVzZVByZWZpeCA9IGRvY3VtZW50LmJvZHkuc3R5bGUud2Via2l0VHJhbnNmb3JtICE9PSB1bmRlZmluZWQ7XG52YXIgZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG5mdW5jdGlvbiBFbGVtZW50T3V0cHV0KGVsZW1lbnQpIHtcbiAgICB0aGlzLl9tYXRyaXggPSBudWxsO1xuICAgIHRoaXMuX29wYWNpdHkgPSAxO1xuICAgIHRoaXMuX29yaWdpbiA9IG51bGw7XG4gICAgdGhpcy5fc2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuYmluZFRoaXModGhpcyk7XG4gICAgdGhpcy5ldmVudEZvcndhcmRlciA9IGZ1bmN0aW9uIGV2ZW50Rm9yd2FyZGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoZXZlbnQudHlwZSwgZXZlbnQpO1xuICAgIH0uYmluZCh0aGlzKTtcbiAgICB0aGlzLmlkID0gRW50aXR5LnJlZ2lzdGVyKHRoaXMpO1xuICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuX3NpemVEaXJ0eSA9IGZhbHNlO1xuICAgIHRoaXMuX29yaWdpbkRpcnR5ID0gZmFsc2U7XG4gICAgdGhpcy5fdHJhbnNmb3JtRGlydHkgPSBmYWxzZTtcbiAgICB0aGlzLl9pbnZpc2libGUgPSBmYWxzZTtcbiAgICBpZiAoZWxlbWVudClcbiAgICAgICAgdGhpcy5hdHRhY2goZWxlbWVudCk7XG59XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKHR5cGUsIGZuKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzLmV2ZW50Rm9yd2FyZGVyKTtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5vbih0eXBlLCBmbik7XG59O1xuRWxlbWVudE91dHB1dC5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBmbikge1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LnJlbW92ZUxpc3RlbmVyKHR5cGUsIGZuKTtcbn07XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBldmVudCkge1xuICAgIGlmIChldmVudCAmJiAhZXZlbnQub3JpZ2luKVxuICAgICAgICBldmVudC5vcmlnaW4gPSB0aGlzO1xuICAgIHZhciBoYW5kbGVkID0gdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCh0eXBlLCBldmVudCk7XG4gICAgaWYgKGhhbmRsZWQgJiYgZXZlbnQgJiYgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKVxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICByZXR1cm4gaGFuZGxlZDtcbn07XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gcGlwZSh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRPdXRwdXQucGlwZSh0YXJnZXQpO1xufTtcbkVsZW1lbnRPdXRwdXQucHJvdG90eXBlLnVucGlwZSA9IGZ1bmN0aW9uIHVucGlwZSh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRPdXRwdXQudW5waXBlKHRhcmdldCk7XG59O1xuRWxlbWVudE91dHB1dC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xufTtcbmZ1bmN0aW9uIF9hZGRFdmVudExpc3RlbmVycyh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpIGluIHRoaXMuX2V2ZW50T3V0cHV0Lmxpc3RlbmVycykge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihpLCB0aGlzLmV2ZW50Rm9yd2FyZGVyKTtcbiAgICB9XG59XG5mdW5jdGlvbiBfcmVtb3ZlRXZlbnRMaXN0ZW5lcnModGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9ldmVudE91dHB1dC5saXN0ZW5lcnMpIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoaSwgdGhpcy5ldmVudEZvcndhcmRlcik7XG4gICAgfVxufVxuZnVuY3Rpb24gX2Zvcm1hdENTU1RyYW5zZm9ybShtKSB7XG4gICAgbVsxMl0gPSBNYXRoLnJvdW5kKG1bMTJdICogZGV2aWNlUGl4ZWxSYXRpbykgLyBkZXZpY2VQaXhlbFJhdGlvO1xuICAgIG1bMTNdID0gTWF0aC5yb3VuZChtWzEzXSAqIGRldmljZVBpeGVsUmF0aW8pIC8gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB2YXIgcmVzdWx0ID0gJ21hdHJpeDNkKCc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNTsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCArPSBtW2ldIDwgMC4wMDAwMDEgJiYgbVtpXSA+IC0wLjAwMDAwMSA/ICcwLCcgOiBtW2ldICsgJywnO1xuICAgIH1cbiAgICByZXN1bHQgKz0gbVsxNV0gKyAnKSc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbnZhciBfc2V0TWF0cml4O1xuaWYgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdmaXJlZm94JykgPiAtMSkge1xuICAgIF9zZXRNYXRyaXggPSBmdW5jdGlvbiAoZWxlbWVudCwgbWF0cml4KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gbWF0cml4WzE0XSAqIDEwMDAwMDAgfCAwO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IF9mb3JtYXRDU1NUcmFuc2Zvcm0obWF0cml4KTtcbiAgICB9O1xufSBlbHNlIGlmICh1c2VQcmVmaXgpIHtcbiAgICBfc2V0TWF0cml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG1hdHJpeCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IF9mb3JtYXRDU1NUcmFuc2Zvcm0obWF0cml4KTtcbiAgICB9O1xufSBlbHNlIHtcbiAgICBfc2V0TWF0cml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG1hdHJpeCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IF9mb3JtYXRDU1NUcmFuc2Zvcm0obWF0cml4KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gX2Zvcm1hdENTU09yaWdpbihvcmlnaW4pIHtcbiAgICByZXR1cm4gMTAwICogb3JpZ2luWzBdICsgJyUgJyArIDEwMCAqIG9yaWdpblsxXSArICclJztcbn1cbnZhciBfc2V0T3JpZ2luID0gdXNlUHJlZml4ID8gZnVuY3Rpb24gKGVsZW1lbnQsIG9yaWdpbikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybU9yaWdpbiA9IF9mb3JtYXRDU1NPcmlnaW4ob3JpZ2luKTtcbiAgICB9IDogZnVuY3Rpb24gKGVsZW1lbnQsIG9yaWdpbikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IF9mb3JtYXRDU1NPcmlnaW4ob3JpZ2luKTtcbiAgICB9O1xudmFyIF9zZXRJbnZpc2libGUgPSB1c2VQcmVmaXggPyBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZTNkKDAuMDAwMSwwLjAwMDEsMC4wMDAxKSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgfSA6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlM2QoMC4wMDAxLDAuMDAwMSwwLjAwMDEpJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9O1xuZnVuY3Rpb24gX3h5Tm90RXF1YWxzKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gYVswXSAhPT0gYlswXSB8fCBhWzFdICE9PSBiWzFdIDogYSAhPT0gYjtcbn1cbkVsZW1lbnRPdXRwdXQucHJvdG90eXBlLmNvbW1pdCA9IGZ1bmN0aW9uIGNvbW1pdChjb250ZXh0KSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMuX2VsZW1lbnQ7XG4gICAgaWYgKCF0YXJnZXQpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgbWF0cml4ID0gY29udGV4dC50cmFuc2Zvcm07XG4gICAgdmFyIG9wYWNpdHkgPSBjb250ZXh0Lm9wYWNpdHk7XG4gICAgdmFyIG9yaWdpbiA9IGNvbnRleHQub3JpZ2luO1xuICAgIHZhciBzaXplID0gY29udGV4dC5zaXplO1xuICAgIGlmICghbWF0cml4ICYmIHRoaXMuX21hdHJpeCkge1xuICAgICAgICB0aGlzLl9tYXRyaXggPSBudWxsO1xuICAgICAgICB0aGlzLl9vcGFjaXR5ID0gMDtcbiAgICAgICAgX3NldEludmlzaWJsZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfeHlOb3RFcXVhbHModGhpcy5fb3JpZ2luLCBvcmlnaW4pKVxuICAgICAgICB0aGlzLl9vcmlnaW5EaXJ0eSA9IHRydWU7XG4gICAgaWYgKFRyYW5zZm9ybS5ub3RFcXVhbHModGhpcy5fbWF0cml4LCBtYXRyaXgpKVxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1EaXJ0eSA9IHRydWU7XG4gICAgaWYgKHRoaXMuX2ludmlzaWJsZSkge1xuICAgICAgICB0aGlzLl9pbnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vcGFjaXR5ICE9PSBvcGFjaXR5KSB7XG4gICAgICAgIHRoaXMuX29wYWNpdHkgPSBvcGFjaXR5O1xuICAgICAgICB0YXJnZXQuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHkgPj0gMSA/ICcwLjk5OTk5OScgOiBvcGFjaXR5O1xuICAgIH1cbiAgICBpZiAodGhpcy5fdHJhbnNmb3JtRGlydHkgfHwgdGhpcy5fb3JpZ2luRGlydHkgfHwgdGhpcy5fc2l6ZURpcnR5KSB7XG4gICAgICAgIGlmICh0aGlzLl9zaXplRGlydHkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fc2l6ZSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplID0gW1xuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHRoaXMuX3NpemVbMF0gPSBzaXplWzBdO1xuICAgICAgICAgICAgdGhpcy5fc2l6ZVsxXSA9IHNpemVbMV07XG4gICAgICAgICAgICB0aGlzLl9zaXplRGlydHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fb3JpZ2luRGlydHkpIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX29yaWdpbilcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5bMF0gPSBvcmlnaW5bMF07XG4gICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luWzFdID0gb3JpZ2luWzFdO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luID0gbnVsbDtcbiAgICAgICAgICAgIF9zZXRPcmlnaW4odGFyZ2V0LCB0aGlzLl9vcmlnaW4pO1xuICAgICAgICAgICAgdGhpcy5fb3JpZ2luRGlydHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1hdHJpeClcbiAgICAgICAgICAgIG1hdHJpeCA9IFRyYW5zZm9ybS5pZGVudGl0eTtcbiAgICAgICAgdGhpcy5fbWF0cml4ID0gbWF0cml4O1xuICAgICAgICB2YXIgYWFNYXRyaXggPSB0aGlzLl9zaXplID8gVHJhbnNmb3JtLnRoZW5Nb3ZlKG1hdHJpeCwgW1xuICAgICAgICAgICAgICAgIC10aGlzLl9zaXplWzBdICogb3JpZ2luWzBdLFxuICAgICAgICAgICAgICAgIC10aGlzLl9zaXplWzFdICogb3JpZ2luWzFdLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF0pIDogbWF0cml4O1xuICAgICAgICBfc2V0TWF0cml4KHRhcmdldCwgYWFNYXRyaXgpO1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1EaXJ0eSA9IGZhbHNlO1xuICAgIH1cbn07XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS5jbGVhbnVwID0gZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgICB0aGlzLl9pbnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxufTtcbkVsZW1lbnRPdXRwdXQucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uIGF0dGFjaCh0YXJnZXQpIHtcbiAgICB0aGlzLl9lbGVtZW50ID0gdGFyZ2V0O1xuICAgIF9hZGRFdmVudExpc3RlbmVycy5jYWxsKHRoaXMsIHRhcmdldCk7XG59O1xuRWxlbWVudE91dHB1dC5wcm90b3R5cGUuZGV0YWNoID0gZnVuY3Rpb24gZGV0YWNoKCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLl9lbGVtZW50O1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgX3JlbW92ZUV2ZW50TGlzdGVuZXJzLmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgaWYgKHRoaXMuX2ludmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5faW52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gRWxlbWVudE91dHB1dDsiLCJ2YXIgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4vRXZlbnRIYW5kbGVyJyk7XG52YXIgT3B0aW9uc01hbmFnZXIgPSByZXF1aXJlKCcuL09wdGlvbnNNYW5hZ2VyJyk7XG52YXIgRW5naW5lID0ge307XG52YXIgY29udGV4dHMgPSBbXTtcbnZhciBuZXh0VGlja1F1ZXVlID0gW107XG52YXIgZGVmZXJRdWV1ZSA9IFtdO1xudmFyIGxhc3RUaW1lID0gRGF0ZS5ub3coKTtcbnZhciBmcmFtZVRpbWU7XG52YXIgZnJhbWVUaW1lTGltaXQ7XG52YXIgbG9vcEVuYWJsZWQgPSB0cnVlO1xudmFyIGV2ZW50Rm9yd2FyZGVycyA9IHt9O1xudmFyIGV2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbnZhciBvcHRpb25zID0ge1xuICAgICAgICBjb250YWluZXJUeXBlOiAnZGl2JyxcbiAgICAgICAgY29udGFpbmVyQ2xhc3M6ICdmYW1vdXMtY29udGFpbmVyJyxcbiAgICAgICAgZnBzQ2FwOiB1bmRlZmluZWQsXG4gICAgICAgIHJ1bkxvb3A6IHRydWUsXG4gICAgICAgIGFwcE1vZGU6IHRydWVcbiAgICB9O1xudmFyIG9wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKG9wdGlvbnMpO1xudmFyIE1BWF9ERUZFUl9GUkFNRV9USU1FID0gMTA7XG5FbmdpbmUuc3RlcCA9IGZ1bmN0aW9uIHN0ZXAoKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoZnJhbWVUaW1lTGltaXQgJiYgY3VycmVudFRpbWUgLSBsYXN0VGltZSA8IGZyYW1lVGltZUxpbWl0KVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIGkgPSAwO1xuICAgIGZyYW1lVGltZSA9IGN1cnJlbnRUaW1lIC0gbGFzdFRpbWU7XG4gICAgbGFzdFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICBldmVudEhhbmRsZXIuZW1pdCgncHJlcmVuZGVyJyk7XG4gICAgZm9yIChpID0gMDsgaSA8IG5leHRUaWNrUXVldWUubGVuZ3RoOyBpKyspXG4gICAgICAgIG5leHRUaWNrUXVldWVbaV0uY2FsbCh0aGlzKTtcbiAgICBuZXh0VGlja1F1ZXVlLnNwbGljZSgwKTtcbiAgICB3aGlsZSAoZGVmZXJRdWV1ZS5sZW5ndGggJiYgRGF0ZS5ub3coKSAtIGN1cnJlbnRUaW1lIDwgTUFYX0RFRkVSX0ZSQU1FX1RJTUUpIHtcbiAgICAgICAgZGVmZXJRdWV1ZS5zaGlmdCgpLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBjb250ZXh0cy5sZW5ndGg7IGkrKylcbiAgICAgICAgY29udGV4dHNbaV0udXBkYXRlKCk7XG4gICAgZXZlbnRIYW5kbGVyLmVtaXQoJ3Bvc3RyZW5kZXInKTtcbn07XG5mdW5jdGlvbiBsb29wKCkge1xuICAgIGlmIChvcHRpb25zLnJ1bkxvb3ApIHtcbiAgICAgICAgRW5naW5lLnN0ZXAoKTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9IGVsc2VcbiAgICAgICAgbG9vcEVuYWJsZWQgPSBmYWxzZTtcbn1cbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG5mdW5jdGlvbiBoYW5kbGVSZXNpemUoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRleHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnRleHRzW2ldLmVtaXQoJ3Jlc2l6ZScpO1xuICAgIH1cbiAgICBldmVudEhhbmRsZXIuZW1pdCgncmVzaXplJyk7XG59XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplLCBmYWxzZSk7XG5oYW5kbGVSZXNpemUoKTtcbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sIHRydWUpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZmFtb3VzLXJvb3QnKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZmFtb3VzLXJvb3QnKTtcbn1cbnZhciBpbml0aWFsaXplZCA9IGZhbHNlO1xuRW5naW5lLnBpcGUgPSBmdW5jdGlvbiBwaXBlKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuc3Vic2NyaWJlIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHJldHVybiB0YXJnZXQuc3Vic2NyaWJlKEVuZ2luZSk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gZXZlbnRIYW5kbGVyLnBpcGUodGFyZ2V0KTtcbn07XG5FbmdpbmUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQudW5zdWJzY3JpYmUgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgcmV0dXJuIHRhcmdldC51bnN1YnNjcmliZShFbmdpbmUpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGV2ZW50SGFuZGxlci51bnBpcGUodGFyZ2V0KTtcbn07XG5FbmdpbmUub24gPSBmdW5jdGlvbiBvbih0eXBlLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEodHlwZSBpbiBldmVudEZvcndhcmRlcnMpKSB7XG4gICAgICAgIGV2ZW50Rm9yd2FyZGVyc1t0eXBlXSA9IGV2ZW50SGFuZGxlci5lbWl0LmJpbmQoZXZlbnRIYW5kbGVyLCB0eXBlKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBldmVudEZvcndhcmRlcnNbdHlwZV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRW5naW5lLm5leHRUaWNrKGZ1bmN0aW9uICh0eXBlLCBmb3J3YXJkZXIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm9yd2FyZGVyKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzLCB0eXBlLCBldmVudEZvcndhcmRlcnNbdHlwZV0pKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXZlbnRIYW5kbGVyLm9uKHR5cGUsIGhhbmRsZXIpO1xufTtcbkVuZ2luZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBldmVudCkge1xuICAgIHJldHVybiBldmVudEhhbmRsZXIuZW1pdCh0eXBlLCBldmVudCk7XG59O1xuRW5naW5lLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgaGFuZGxlcikge1xuICAgIHJldHVybiBldmVudEhhbmRsZXIucmVtb3ZlTGlzdGVuZXIodHlwZSwgaGFuZGxlcik7XG59O1xuRW5naW5lLmdldEZQUyA9IGZ1bmN0aW9uIGdldEZQUygpIHtcbiAgICByZXR1cm4gMTAwMCAvIGZyYW1lVGltZTtcbn07XG5FbmdpbmUuc2V0RlBTQ2FwID0gZnVuY3Rpb24gc2V0RlBTQ2FwKGZwcykge1xuICAgIGZyYW1lVGltZUxpbWl0ID0gTWF0aC5mbG9vcigxMDAwIC8gZnBzKTtcbn07XG5FbmdpbmUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG9wdGlvbnNNYW5hZ2VyLmdldE9wdGlvbnMuYXBwbHkob3B0aW9uc01hbmFnZXIsIGFyZ3VtZW50cyk7XG59O1xuRW5naW5lLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9uc01hbmFnZXIuc2V0T3B0aW9ucy5hcHBseShvcHRpb25zTWFuYWdlciwgYXJndW1lbnRzKTtcbn07XG5FbmdpbmUuY3JlYXRlQ29udGV4dCA9IGZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZWwpIHtcbiAgICBpZiAoIWluaXRpYWxpemVkICYmIG9wdGlvbnMuYXBwTW9kZSlcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIHZhciBuZWVkTW91bnRDb250YWluZXIgPSBmYWxzZTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRpb25zLmNvbnRhaW5lclR5cGUpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY29udGFpbmVyQ2xhc3MpO1xuICAgICAgICBuZWVkTW91bnRDb250YWluZXIgPSB0cnVlO1xuICAgIH1cbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KGVsKTtcbiAgICBFbmdpbmUucmVnaXN0ZXJDb250ZXh0KGNvbnRleHQpO1xuICAgIGlmIChuZWVkTW91bnRDb250YWluZXIpIHtcbiAgICAgICAgRW5naW5lLm5leHRUaWNrKGZ1bmN0aW9uIChjb250ZXh0LCBlbCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgICAgICBjb250ZXh0LmVtaXQoJ3Jlc2l6ZScpO1xuICAgICAgICB9LmJpbmQodGhpcywgY29udGV4dCwgZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHQ7XG59O1xuRW5naW5lLnJlZ2lzdGVyQ29udGV4dCA9IGZ1bmN0aW9uIHJlZ2lzdGVyQ29udGV4dChjb250ZXh0KSB7XG4gICAgY29udGV4dHMucHVzaChjb250ZXh0KTtcbiAgICByZXR1cm4gY29udGV4dDtcbn07XG5FbmdpbmUuZ2V0Q29udGV4dHMgPSBmdW5jdGlvbiBnZXRDb250ZXh0cygpIHtcbiAgICByZXR1cm4gY29udGV4dHM7XG59O1xuRW5naW5lLmRlcmVnaXN0ZXJDb250ZXh0ID0gZnVuY3Rpb24gZGVyZWdpc3RlckNvbnRleHQoY29udGV4dCkge1xuICAgIHZhciBpID0gY29udGV4dHMuaW5kZXhPZihjb250ZXh0KTtcbiAgICBpZiAoaSA+PSAwKVxuICAgICAgICBjb250ZXh0cy5zcGxpY2UoaSwgMSk7XG59O1xuRW5naW5lLm5leHRUaWNrID0gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICBuZXh0VGlja1F1ZXVlLnB1c2goZm4pO1xufTtcbkVuZ2luZS5kZWZlciA9IGZ1bmN0aW9uIGRlZmVyKGZuKSB7XG4gICAgZGVmZXJRdWV1ZS5wdXNoKGZuKTtcbn07XG5vcHRpb25zTWFuYWdlci5vbignY2hhbmdlJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5pZCA9PT0gJ2Zwc0NhcCcpXG4gICAgICAgIEVuZ2luZS5zZXRGUFNDYXAoZGF0YS52YWx1ZSk7XG4gICAgZWxzZSBpZiAoZGF0YS5pZCA9PT0gJ3J1bkxvb3AnKSB7XG4gICAgICAgIGlmICghbG9vcEVuYWJsZWQgJiYgZGF0YS52YWx1ZSkge1xuICAgICAgICAgICAgbG9vcEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBFbmdpbmU7IiwidmFyIGVudGl0aWVzID0gW107XG5mdW5jdGlvbiBnZXQoaWQpIHtcbiAgICByZXR1cm4gZW50aXRpZXNbaWRdO1xufVxuZnVuY3Rpb24gc2V0KGlkLCBlbnRpdHkpIHtcbiAgICBlbnRpdGllc1tpZF0gPSBlbnRpdHk7XG59XG5mdW5jdGlvbiByZWdpc3RlcihlbnRpdHkpIHtcbiAgICB2YXIgaWQgPSBlbnRpdGllcy5sZW5ndGg7XG4gICAgc2V0KGlkLCBlbnRpdHkpO1xuICAgIHJldHVybiBpZDtcbn1cbmZ1bmN0aW9uIHVucmVnaXN0ZXIoaWQpIHtcbiAgICBzZXQoaWQsIG51bGwpO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVnaXN0ZXI6IHJlZ2lzdGVyLFxuICAgIHVucmVnaXN0ZXI6IHVucmVnaXN0ZXIsXG4gICAgZ2V0OiBnZXQsXG4gICAgc2V0OiBzZXRcbn07IiwiZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5fb3duZXIgPSB0aGlzO1xufVxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBldmVudCkge1xuICAgIHZhciBoYW5kbGVycyA9IHRoaXMubGlzdGVuZXJzW3R5cGVdO1xuICAgIGlmIChoYW5kbGVycykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGVyc1tpXS5jYWxsKHRoaXMuX293bmVyLCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICBpZiAoISh0eXBlIGluIHRoaXMubGlzdGVuZXJzKSlcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICB2YXIgaW5kZXggPSB0aGlzLmxpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChpbmRleCA8IDApXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goaGFuZGxlcik7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgaGFuZGxlcikge1xuICAgIHZhciBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJzW3R5cGVdO1xuICAgIGlmIChsaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVyLmluZGV4T2YoaGFuZGxlcik7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgICAgICAgbGlzdGVuZXIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5iaW5kVGhpcyA9IGZ1bmN0aW9uIGJpbmRUaGlzKG93bmVyKSB7XG4gICAgdGhpcy5fb3duZXIgPSBvd25lcjtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9FdmVudEVtaXR0ZXInKTtcbmZ1bmN0aW9uIEV2ZW50SGFuZGxlcigpIHtcbiAgICBFdmVudEVtaXR0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmRvd25zdHJlYW0gPSBbXTtcbiAgICB0aGlzLmRvd25zdHJlYW1GbiA9IFtdO1xuICAgIHRoaXMudXBzdHJlYW0gPSBbXTtcbiAgICB0aGlzLnVwc3RyZWFtTGlzdGVuZXJzID0ge307XG59XG5FdmVudEhhbmRsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFdmVudEVtaXR0ZXIucHJvdG90eXBlKTtcbkV2ZW50SGFuZGxlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFdmVudEhhbmRsZXI7XG5FdmVudEhhbmRsZXIuc2V0SW5wdXRIYW5kbGVyID0gZnVuY3Rpb24gc2V0SW5wdXRIYW5kbGVyKG9iamVjdCwgaGFuZGxlcikge1xuICAgIG9iamVjdC50cmlnZ2VyID0gaGFuZGxlci50cmlnZ2VyLmJpbmQoaGFuZGxlcik7XG4gICAgaWYgKGhhbmRsZXIuc3Vic2NyaWJlICYmIGhhbmRsZXIudW5zdWJzY3JpYmUpIHtcbiAgICAgICAgb2JqZWN0LnN1YnNjcmliZSA9IGhhbmRsZXIuc3Vic2NyaWJlLmJpbmQoaGFuZGxlcik7XG4gICAgICAgIG9iamVjdC51bnN1YnNjcmliZSA9IGhhbmRsZXIudW5zdWJzY3JpYmUuYmluZChoYW5kbGVyKTtcbiAgICB9XG59O1xuRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIgPSBmdW5jdGlvbiBzZXRPdXRwdXRIYW5kbGVyKG9iamVjdCwgaGFuZGxlcikge1xuICAgIGlmIChoYW5kbGVyIGluc3RhbmNlb2YgRXZlbnRIYW5kbGVyKVxuICAgICAgICBoYW5kbGVyLmJpbmRUaGlzKG9iamVjdCk7XG4gICAgb2JqZWN0LnBpcGUgPSBoYW5kbGVyLnBpcGUuYmluZChoYW5kbGVyKTtcbiAgICBvYmplY3QudW5waXBlID0gaGFuZGxlci51bnBpcGUuYmluZChoYW5kbGVyKTtcbiAgICBvYmplY3Qub24gPSBoYW5kbGVyLm9uLmJpbmQoaGFuZGxlcik7XG4gICAgb2JqZWN0LmFkZExpc3RlbmVyID0gb2JqZWN0Lm9uO1xuICAgIG9iamVjdC5yZW1vdmVMaXN0ZW5lciA9IGhhbmRsZXIucmVtb3ZlTGlzdGVuZXIuYmluZChoYW5kbGVyKTtcbn07XG5FdmVudEhhbmRsZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUsIGV2ZW50KSB7XG4gICAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRvd25zdHJlYW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZG93bnN0cmVhbVtpXS50cmlnZ2VyKVxuICAgICAgICAgICAgdGhpcy5kb3duc3RyZWFtW2ldLnRyaWdnZXIodHlwZSwgZXZlbnQpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kb3duc3RyZWFtRm4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5kb3duc3RyZWFtRm5baV0odHlwZSwgZXZlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5FdmVudEhhbmRsZXIucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudEhhbmRsZXIucHJvdG90eXBlLmVtaXQ7XG5FdmVudEhhbmRsZXIucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiBwaXBlKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuc3Vic2NyaWJlIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHJldHVybiB0YXJnZXQuc3Vic2NyaWJlKHRoaXMpO1xuICAgIHZhciBkb3duc3RyZWFtQ3R4ID0gdGFyZ2V0IGluc3RhbmNlb2YgRnVuY3Rpb24gPyB0aGlzLmRvd25zdHJlYW1GbiA6IHRoaXMuZG93bnN0cmVhbTtcbiAgICB2YXIgaW5kZXggPSBkb3duc3RyZWFtQ3R4LmluZGV4T2YodGFyZ2V0KTtcbiAgICBpZiAoaW5kZXggPCAwKVxuICAgICAgICBkb3duc3RyZWFtQ3R4LnB1c2godGFyZ2V0KTtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHRhcmdldCgncGlwZScsIG51bGwpO1xuICAgIGVsc2UgaWYgKHRhcmdldC50cmlnZ2VyKVxuICAgICAgICB0YXJnZXQudHJpZ2dlcigncGlwZScsIG51bGwpO1xuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbiB1bnBpcGUodGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC51bnN1YnNjcmliZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICByZXR1cm4gdGFyZ2V0LnVuc3Vic2NyaWJlKHRoaXMpO1xuICAgIHZhciBkb3duc3RyZWFtQ3R4ID0gdGFyZ2V0IGluc3RhbmNlb2YgRnVuY3Rpb24gPyB0aGlzLmRvd25zdHJlYW1GbiA6IHRoaXMuZG93bnN0cmVhbTtcbiAgICB2YXIgaW5kZXggPSBkb3duc3RyZWFtQ3R4LmluZGV4T2YodGFyZ2V0KTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBkb3duc3RyZWFtQ3R4LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIHRhcmdldCgndW5waXBlJywgbnVsbCk7XG4gICAgICAgIGVsc2UgaWYgKHRhcmdldC50cmlnZ2VyKVxuICAgICAgICAgICAgdGFyZ2V0LnRyaWdnZXIoJ3VucGlwZScsIG51bGwpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG59O1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKCEodHlwZSBpbiB0aGlzLnVwc3RyZWFtTGlzdGVuZXJzKSkge1xuICAgICAgICB2YXIgdXBzdHJlYW1MaXN0ZW5lciA9IHRoaXMudHJpZ2dlci5iaW5kKHRoaXMsIHR5cGUpO1xuICAgICAgICB0aGlzLnVwc3RyZWFtTGlzdGVuZXJzW3R5cGVdID0gdXBzdHJlYW1MaXN0ZW5lcjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnVwc3RyZWFtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnVwc3RyZWFtW2ldLm9uKHR5cGUsIHVwc3RyZWFtTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkV2ZW50SGFuZGxlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEhhbmRsZXIucHJvdG90eXBlLm9uO1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUoc291cmNlKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy51cHN0cmVhbS5pbmRleE9mKHNvdXJjZSk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICB0aGlzLnVwc3RyZWFtLnB1c2goc291cmNlKTtcbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnVwc3RyZWFtTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBzb3VyY2Uub24odHlwZSwgdGhpcy51cHN0cmVhbUxpc3RlbmVyc1t0eXBlXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uIHVuc3Vic2NyaWJlKHNvdXJjZSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMudXBzdHJlYW0uaW5kZXhPZihzb3VyY2UpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIHRoaXMudXBzdHJlYW0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnVwc3RyZWFtTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIodHlwZSwgdGhpcy51cHN0cmVhbUxpc3RlbmVyc1t0eXBlXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudEhhbmRsZXI7IiwidmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG52YXIgVHJhbnNpdGlvbmFibGUgPSByZXF1aXJlKCdmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGUnKTtcbnZhciBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSA9IHJlcXVpcmUoJ2ZhbW91cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybScpO1xuZnVuY3Rpb24gTW9kaWZpZXIob3B0aW9ucykge1xuICAgIHRoaXMuX3RyYW5zZm9ybUdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fb3BhY2l0eUdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ2luR2V0dGVyID0gbnVsbDtcbiAgICB0aGlzLl9hbGlnbkdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fc2l6ZUdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fbGVnYWN5U3RhdGVzID0ge307XG4gICAgdGhpcy5fb3V0cHV0ID0ge1xuICAgICAgICB0cmFuc2Zvcm06IFRyYW5zZm9ybS5pZGVudGl0eSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgb3JpZ2luOiBudWxsLFxuICAgICAgICBhbGlnbjogbnVsbCxcbiAgICAgICAgc2l6ZTogbnVsbCxcbiAgICAgICAgdGFyZ2V0OiBudWxsXG4gICAgfTtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy50cmFuc2Zvcm0pXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUZyb20ob3B0aW9ucy50cmFuc2Zvcm0pO1xuICAgICAgICBpZiAob3B0aW9ucy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlGcm9tKG9wdGlvbnMub3BhY2l0eSk7XG4gICAgICAgIGlmIChvcHRpb25zLm9yaWdpbilcbiAgICAgICAgICAgIHRoaXMub3JpZ2luRnJvbShvcHRpb25zLm9yaWdpbik7XG4gICAgICAgIGlmIChvcHRpb25zLmFsaWduKVxuICAgICAgICAgICAgdGhpcy5hbGlnbkZyb20ob3B0aW9ucy5hbGlnbik7XG4gICAgICAgIGlmIChvcHRpb25zLnNpemUpXG4gICAgICAgICAgICB0aGlzLnNpemVGcm9tKG9wdGlvbnMuc2l6ZSk7XG4gICAgfVxufVxuTW9kaWZpZXIucHJvdG90eXBlLnRyYW5zZm9ybUZyb20gPSBmdW5jdGlvbiB0cmFuc2Zvcm1Gcm9tKHRyYW5zZm9ybSkge1xuICAgIGlmICh0cmFuc2Zvcm0gaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtR2V0dGVyID0gdHJhbnNmb3JtO1xuICAgIGVsc2UgaWYgKHRyYW5zZm9ybSBpbnN0YW5jZW9mIE9iamVjdCAmJiB0cmFuc2Zvcm0uZ2V0KVxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1HZXR0ZXIgPSB0cmFuc2Zvcm0uZ2V0LmJpbmQodHJhbnNmb3JtKTtcbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtR2V0dGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3V0cHV0LnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLm9wYWNpdHlGcm9tID0gZnVuY3Rpb24gb3BhY2l0eUZyb20ob3BhY2l0eSkge1xuICAgIGlmIChvcGFjaXR5IGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuX29wYWNpdHlHZXR0ZXIgPSBvcGFjaXR5O1xuICAgIGVsc2UgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBPYmplY3QgJiYgb3BhY2l0eS5nZXQpXG4gICAgICAgIHRoaXMuX29wYWNpdHlHZXR0ZXIgPSBvcGFjaXR5LmdldC5iaW5kKG9wYWNpdHkpO1xuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9vcGFjaXR5R2V0dGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3V0cHV0Lm9wYWNpdHkgPSBvcGFjaXR5O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5Nb2RpZmllci5wcm90b3R5cGUub3JpZ2luRnJvbSA9IGZ1bmN0aW9uIG9yaWdpbkZyb20ob3JpZ2luKSB7XG4gICAgaWYgKG9yaWdpbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICB0aGlzLl9vcmlnaW5HZXR0ZXIgPSBvcmlnaW47XG4gICAgZWxzZSBpZiAob3JpZ2luIGluc3RhbmNlb2YgT2JqZWN0ICYmIG9yaWdpbi5nZXQpXG4gICAgICAgIHRoaXMuX29yaWdpbkdldHRlciA9IG9yaWdpbi5nZXQuYmluZChvcmlnaW4pO1xuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9vcmlnaW5HZXR0ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9vdXRwdXQub3JpZ2luID0gb3JpZ2luO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5Nb2RpZmllci5wcm90b3R5cGUuYWxpZ25Gcm9tID0gZnVuY3Rpb24gYWxpZ25Gcm9tKGFsaWduKSB7XG4gICAgaWYgKGFsaWduIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuX2FsaWduR2V0dGVyID0gYWxpZ247XG4gICAgZWxzZSBpZiAoYWxpZ24gaW5zdGFuY2VvZiBPYmplY3QgJiYgYWxpZ24uZ2V0KVxuICAgICAgICB0aGlzLl9hbGlnbkdldHRlciA9IGFsaWduLmdldC5iaW5kKGFsaWduKTtcbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWxpZ25HZXR0ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9vdXRwdXQuYWxpZ24gPSBhbGlnbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLnNpemVGcm9tID0gZnVuY3Rpb24gc2l6ZUZyb20oc2l6ZSkge1xuICAgIGlmIChzaXplIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuX3NpemVHZXR0ZXIgPSBzaXplO1xuICAgIGVsc2UgaWYgKHNpemUgaW5zdGFuY2VvZiBPYmplY3QgJiYgc2l6ZS5nZXQpXG4gICAgICAgIHRoaXMuX3NpemVHZXR0ZXIgPSBzaXplLmdldC5iaW5kKHNpemUpO1xuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9zaXplR2V0dGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3V0cHV0LnNpemUgPSBzaXplO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5Nb2RpZmllci5wcm90b3R5cGUuc2V0VHJhbnNmb3JtID0gZnVuY3Rpb24gc2V0VHJhbnNmb3JtKHRyYW5zZm9ybSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAodHJhbnNpdGlvbiB8fCB0aGlzLl9sZWdhY3lTdGF0ZXMudHJhbnNmb3JtKSB7XG4gICAgICAgIGlmICghdGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybSkge1xuICAgICAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybSA9IG5ldyBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSh0aGlzLl9vdXRwdXQudHJhbnNmb3JtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RyYW5zZm9ybUdldHRlcilcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtRnJvbSh0aGlzLl9sZWdhY3lTdGF0ZXMudHJhbnNmb3JtKTtcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybS5zZXQodHJhbnNmb3JtLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1Gcm9tKHRyYW5zZm9ybSk7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLnNldE9wYWNpdHkgPSBmdW5jdGlvbiBzZXRPcGFjaXR5KG9wYWNpdHksIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRyYW5zaXRpb24gfHwgdGhpcy5fbGVnYWN5U3RhdGVzLm9wYWNpdHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sZWdhY3lTdGF0ZXMub3BhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLm9wYWNpdHkgPSBuZXcgVHJhbnNpdGlvbmFibGUodGhpcy5fb3V0cHV0Lm9wYWNpdHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fb3BhY2l0eUdldHRlcilcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eUZyb20odGhpcy5fbGVnYWN5U3RhdGVzLm9wYWNpdHkpO1xuICAgICAgICByZXR1cm4gdGhpcy5fbGVnYWN5U3RhdGVzLm9wYWNpdHkuc2V0KG9wYWNpdHksIHRyYW5zaXRpb24sIGNhbGxiYWNrKTtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMub3BhY2l0eUZyb20ob3BhY2l0eSk7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLnNldE9yaWdpbiA9IGZ1bmN0aW9uIHNldE9yaWdpbihvcmlnaW4sIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRyYW5zaXRpb24gfHwgdGhpcy5fbGVnYWN5U3RhdGVzLm9yaWdpbikge1xuICAgICAgICBpZiAoIXRoaXMuX2xlZ2FjeVN0YXRlcy5vcmlnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy5vcmlnaW4gPSBuZXcgVHJhbnNpdGlvbmFibGUodGhpcy5fb3V0cHV0Lm9yaWdpbiB8fCBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX29yaWdpbkdldHRlcilcbiAgICAgICAgICAgIHRoaXMub3JpZ2luRnJvbSh0aGlzLl9sZWdhY3lTdGF0ZXMub3JpZ2luKTtcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLm9yaWdpbi5zZXQob3JpZ2luLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5Gcm9tKG9yaWdpbik7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLnNldEFsaWduID0gZnVuY3Rpb24gc2V0QWxpZ24oYWxpZ24sIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRyYW5zaXRpb24gfHwgdGhpcy5fbGVnYWN5U3RhdGVzLmFsaWduKSB7XG4gICAgICAgIGlmICghdGhpcy5fbGVnYWN5U3RhdGVzLmFsaWduKSB7XG4gICAgICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMuYWxpZ24gPSBuZXcgVHJhbnNpdGlvbmFibGUodGhpcy5fb3V0cHV0LmFsaWduIHx8IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fYWxpZ25HZXR0ZXIpXG4gICAgICAgICAgICB0aGlzLmFsaWduRnJvbSh0aGlzLl9sZWdhY3lTdGF0ZXMuYWxpZ24pO1xuICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMuYWxpZ24uc2V0KGFsaWduLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy5hbGlnbkZyb20oYWxpZ24pO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gc2V0U2l6ZShzaXplLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmIChzaXplICYmICh0cmFuc2l0aW9uIHx8IHRoaXMuX2xlZ2FjeVN0YXRlcy5zaXplKSkge1xuICAgICAgICBpZiAoIXRoaXMuX2xlZ2FjeVN0YXRlcy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMuc2l6ZSA9IG5ldyBUcmFuc2l0aW9uYWJsZSh0aGlzLl9vdXRwdXQuc2l6ZSB8fCBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3NpemVHZXR0ZXIpXG4gICAgICAgICAgICB0aGlzLnNpemVGcm9tKHRoaXMuX2xlZ2FjeVN0YXRlcy5zaXplKTtcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLnNpemUuc2V0KHNpemUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLnNpemVGcm9tKHNpemUpO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5oYWx0ID0gZnVuY3Rpb24gaGFsdCgpIHtcbiAgICBpZiAodGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybSlcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybS5oYWx0KCk7XG4gICAgaWYgKHRoaXMuX2xlZ2FjeVN0YXRlcy5vcGFjaXR5KVxuICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMub3BhY2l0eS5oYWx0KCk7XG4gICAgaWYgKHRoaXMuX2xlZ2FjeVN0YXRlcy5vcmlnaW4pXG4gICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy5vcmlnaW4uaGFsdCgpO1xuICAgIGlmICh0aGlzLl9sZWdhY3lTdGF0ZXMuYWxpZ24pXG4gICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy5hbGlnbi5oYWx0KCk7XG4gICAgaWYgKHRoaXMuX2xlZ2FjeVN0YXRlcy5zaXplKVxuICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMuc2l6ZS5oYWx0KCk7XG4gICAgdGhpcy5fdHJhbnNmb3JtR2V0dGVyID0gbnVsbDtcbiAgICB0aGlzLl9vcGFjaXR5R2V0dGVyID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnaW5HZXR0ZXIgPSBudWxsO1xuICAgIHRoaXMuX2FsaWduR2V0dGVyID0gbnVsbDtcbiAgICB0aGlzLl9zaXplR2V0dGVyID0gbnVsbDtcbn07XG5Nb2RpZmllci5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtID0gZnVuY3Rpb24gZ2V0VHJhbnNmb3JtKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2Zvcm1HZXR0ZXIoKTtcbn07XG5Nb2RpZmllci5wcm90b3R5cGUuZ2V0RmluYWxUcmFuc2Zvcm0gPSBmdW5jdGlvbiBnZXRGaW5hbFRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybSA/IHRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0uZ2V0RmluYWwoKSA6IHRoaXMuX291dHB1dC50cmFuc2Zvcm07XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiBnZXRPcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9vcGFjaXR5R2V0dGVyKCk7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmdldE9yaWdpbiA9IGZ1bmN0aW9uIGdldE9yaWdpbigpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JpZ2luR2V0dGVyKCk7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmdldEFsaWduID0gZnVuY3Rpb24gZ2V0QWxpZ24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsaWduR2V0dGVyKCk7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9zaXplR2V0dGVyID8gdGhpcy5fc2l6ZUdldHRlcigpIDogdGhpcy5fb3V0cHV0LnNpemU7XG59O1xuZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fdHJhbnNmb3JtR2V0dGVyKVxuICAgICAgICB0aGlzLl9vdXRwdXQudHJhbnNmb3JtID0gdGhpcy5fdHJhbnNmb3JtR2V0dGVyKCk7XG4gICAgaWYgKHRoaXMuX29wYWNpdHlHZXR0ZXIpXG4gICAgICAgIHRoaXMuX291dHB1dC5vcGFjaXR5ID0gdGhpcy5fb3BhY2l0eUdldHRlcigpO1xuICAgIGlmICh0aGlzLl9vcmlnaW5HZXR0ZXIpXG4gICAgICAgIHRoaXMuX291dHB1dC5vcmlnaW4gPSB0aGlzLl9vcmlnaW5HZXR0ZXIoKTtcbiAgICBpZiAodGhpcy5fYWxpZ25HZXR0ZXIpXG4gICAgICAgIHRoaXMuX291dHB1dC5hbGlnbiA9IHRoaXMuX2FsaWduR2V0dGVyKCk7XG4gICAgaWYgKHRoaXMuX3NpemVHZXR0ZXIpXG4gICAgICAgIHRoaXMuX291dHB1dC5zaXplID0gdGhpcy5fc2l6ZUdldHRlcigpO1xufVxuTW9kaWZpZXIucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uIG1vZGlmeSh0YXJnZXQpIHtcbiAgICBfdXBkYXRlLmNhbGwodGhpcyk7XG4gICAgdGhpcy5fb3V0cHV0LnRhcmdldCA9IHRhcmdldDtcbiAgICByZXR1cm4gdGhpcy5fb3V0cHV0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gTW9kaWZpZXI7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4vRXZlbnRIYW5kbGVyJyk7XG5mdW5jdGlvbiBPcHRpb25zTWFuYWdlcih2YWx1ZSkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5ldmVudE91dHB1dCA9IG51bGw7XG59XG5PcHRpb25zTWFuYWdlci5wYXRjaCA9IGZ1bmN0aW9uIHBhdGNoT2JqZWN0KHNvdXJjZSwgZGF0YSkge1xuICAgIHZhciBtYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHNvdXJjZSk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXG4gICAgICAgIG1hbmFnZXIucGF0Y2goYXJndW1lbnRzW2ldKTtcbiAgICByZXR1cm4gc291cmNlO1xufTtcbmZ1bmN0aW9uIF9jcmVhdGVFdmVudE91dHB1dCgpIHtcbiAgICB0aGlzLmV2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuZXZlbnRPdXRwdXQuYmluZFRoaXModGhpcyk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5ldmVudE91dHB1dCk7XG59XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUucGF0Y2ggPSBmdW5jdGlvbiBwYXRjaCgpIHtcbiAgICB2YXIgbXlTdGF0ZSA9IHRoaXMuX3ZhbHVlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBmb3IgKHZhciBrIGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChrIGluIG15U3RhdGUgJiYgKGRhdGFba10gJiYgZGF0YVtrXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSAmJiAobXlTdGF0ZVtrXSAmJiBteVN0YXRlW2tdLmNvbnN0cnVjdG9yID09PSBPYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFteVN0YXRlLmhhc093blByb3BlcnR5KGspKVxuICAgICAgICAgICAgICAgICAgICBteVN0YXRlW2tdID0gT2JqZWN0LmNyZWF0ZShteVN0YXRlW2tdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmtleShrKS5wYXRjaChkYXRhW2tdKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmVudE91dHB1dClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudE91dHB1dC5lbWl0KCdjaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogayxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmtleShrKS52YWx1ZSgpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoaywgZGF0YVtrXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLnNldE9wdGlvbnMgPSBPcHRpb25zTWFuYWdlci5wcm90b3R5cGUucGF0Y2g7XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUua2V5ID0gZnVuY3Rpb24ga2V5KGlkZW50aWZpZXIpIHtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMuX3ZhbHVlW2lkZW50aWZpZXJdKTtcbiAgICBpZiAoIShyZXN1bHQuX3ZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB8fCByZXN1bHQuX3ZhbHVlIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIHJlc3VsdC5fdmFsdWUgPSB7fTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlW2tleV07XG59O1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLmdldE9wdGlvbnMgPSBPcHRpb25zTWFuYWdlci5wcm90b3R5cGUuZ2V0O1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgdmFyIG9yaWdpbmFsVmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgIHRoaXMuX3ZhbHVlW2tleV0gPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5ldmVudE91dHB1dCAmJiB2YWx1ZSAhPT0gb3JpZ2luYWxWYWx1ZSlcbiAgICAgICAgdGhpcy5ldmVudE91dHB1dC5lbWl0KCdjaGFuZ2UnLCB7XG4gICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xufTtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbn07XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5vbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnJlbW92ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnVucGlwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uc01hbmFnZXI7IiwidmFyIEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XG52YXIgU3BlY1BhcnNlciA9IHJlcXVpcmUoJy4vU3BlY1BhcnNlcicpO1xuZnVuY3Rpb24gUmVuZGVyTm9kZShvYmplY3QpIHtcbiAgICB0aGlzLl9vYmplY3QgPSBudWxsO1xuICAgIHRoaXMuX2NoaWxkID0gbnVsbDtcbiAgICB0aGlzLl9oYXNNdWx0aXBsZUNoaWxkcmVuID0gZmFsc2U7XG4gICAgdGhpcy5faXNSZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5faXNNb2RpZmllciA9IGZhbHNlO1xuICAgIHRoaXMuX3Jlc3VsdENhY2hlID0ge307XG4gICAgdGhpcy5fcHJldlJlc3VsdHMgPSB7fTtcbiAgICB0aGlzLl9jaGlsZFJlc3VsdCA9IG51bGw7XG4gICAgaWYgKG9iamVjdClcbiAgICAgICAgdGhpcy5zZXQob2JqZWN0KTtcbn1cblJlbmRlck5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChjaGlsZCkge1xuICAgIHZhciBjaGlsZE5vZGUgPSBjaGlsZCBpbnN0YW5jZW9mIFJlbmRlck5vZGUgPyBjaGlsZCA6IG5ldyBSZW5kZXJOb2RlKGNoaWxkKTtcbiAgICBpZiAodGhpcy5fY2hpbGQgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgdGhpcy5fY2hpbGQucHVzaChjaGlsZE5vZGUpO1xuICAgIGVsc2UgaWYgKHRoaXMuX2NoaWxkKSB7XG4gICAgICAgIHRoaXMuX2NoaWxkID0gW1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQsXG4gICAgICAgICAgICBjaGlsZE5vZGVcbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5faGFzTXVsdGlwbGVDaGlsZHJlbiA9IHRydWU7XG4gICAgICAgIHRoaXMuX2NoaWxkUmVzdWx0ID0gW107XG4gICAgfSBlbHNlXG4gICAgICAgIHRoaXMuX2NoaWxkID0gY2hpbGROb2RlO1xuICAgIHJldHVybiBjaGlsZE5vZGU7XG59O1xuUmVuZGVyTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vYmplY3QgfHwgKHRoaXMuX2hhc011bHRpcGxlQ2hpbGRyZW4gPyBudWxsIDogdGhpcy5fY2hpbGQgPyB0aGlzLl9jaGlsZC5nZXQoKSA6IG51bGwpO1xufTtcblJlbmRlck5vZGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChjaGlsZCkge1xuICAgIHRoaXMuX2NoaWxkUmVzdWx0ID0gbnVsbDtcbiAgICB0aGlzLl9oYXNNdWx0aXBsZUNoaWxkcmVuID0gZmFsc2U7XG4gICAgdGhpcy5faXNSZW5kZXJhYmxlID0gY2hpbGQucmVuZGVyID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuX2lzTW9kaWZpZXIgPSBjaGlsZC5tb2RpZnkgPyB0cnVlIDogZmFsc2U7XG4gICAgdGhpcy5fb2JqZWN0ID0gY2hpbGQ7XG4gICAgdGhpcy5fY2hpbGQgPSBudWxsO1xuICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFJlbmRlck5vZGUpXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzO1xufTtcblJlbmRlck5vZGUucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldCgpO1xuICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmdldFNpemUpXG4gICAgICAgIHJlc3VsdCA9IHRhcmdldC5nZXRTaXplKCk7XG4gICAgaWYgKCFyZXN1bHQgJiYgdGhpcy5fY2hpbGQgJiYgdGhpcy5fY2hpbGQuZ2V0U2l6ZSlcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fY2hpbGQuZ2V0U2l6ZSgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZnVuY3Rpb24gX2FwcGx5Q29tbWl0KHNwZWMsIGNvbnRleHQsIGNhY2hlU3RvcmFnZSkge1xuICAgIHZhciByZXN1bHQgPSBTcGVjUGFyc2VyLnBhcnNlKHNwZWMsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocmVzdWx0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGlkID0ga2V5c1tpXTtcbiAgICAgICAgdmFyIGNoaWxkTm9kZSA9IEVudGl0eS5nZXQoaWQpO1xuICAgICAgICB2YXIgY29tbWl0UGFyYW1zID0gcmVzdWx0W2lkXTtcbiAgICAgICAgY29tbWl0UGFyYW1zLmFsbG9jYXRvciA9IGNvbnRleHQuYWxsb2NhdG9yO1xuICAgICAgICB2YXIgY29tbWl0UmVzdWx0ID0gY2hpbGROb2RlLmNvbW1pdChjb21taXRQYXJhbXMpO1xuICAgICAgICBpZiAoY29tbWl0UmVzdWx0KVxuICAgICAgICAgICAgX2FwcGx5Q29tbWl0KGNvbW1pdFJlc3VsdCwgY29udGV4dCwgY2FjaGVTdG9yYWdlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2FjaGVTdG9yYWdlW2lkXSA9IGNvbW1pdFBhcmFtcztcbiAgICB9XG59XG5SZW5kZXJOb2RlLnByb3RvdHlwZS5jb21taXQgPSBmdW5jdGlvbiBjb21taXQoY29udGV4dCkge1xuICAgIHZhciBwcmV2S2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX3ByZXZSZXN1bHRzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXZLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpZCA9IHByZXZLZXlzW2ldO1xuICAgICAgICBpZiAodGhpcy5fcmVzdWx0Q2FjaGVbaWRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFbnRpdHkuZ2V0KGlkKTtcbiAgICAgICAgICAgIGlmIChvYmplY3QuY2xlYW51cClcbiAgICAgICAgICAgICAgICBvYmplY3QuY2xlYW51cChjb250ZXh0LmFsbG9jYXRvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fcHJldlJlc3VsdHMgPSB0aGlzLl9yZXN1bHRDYWNoZTtcbiAgICB0aGlzLl9yZXN1bHRDYWNoZSA9IHt9O1xuICAgIF9hcHBseUNvbW1pdCh0aGlzLnJlbmRlcigpLCBjb250ZXh0LCB0aGlzLl9yZXN1bHRDYWNoZSk7XG59O1xuUmVuZGVyTm9kZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLl9pc1JlbmRlcmFibGUpXG4gICAgICAgIHJldHVybiB0aGlzLl9vYmplY3QucmVuZGVyKCk7XG4gICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgaWYgKHRoaXMuX2hhc011bHRpcGxlQ2hpbGRyZW4pIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fY2hpbGRSZXN1bHQ7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHRbaV0gPSBjaGlsZHJlbltpXS5yZW5kZXIoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fY2hpbGQpXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2NoaWxkLnJlbmRlcigpO1xuICAgIHJldHVybiB0aGlzLl9pc01vZGlmaWVyID8gdGhpcy5fb2JqZWN0Lm1vZGlmeShyZXN1bHQpIDogcmVzdWx0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyTm9kZTsiLCJ2YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcbmZ1bmN0aW9uIFNwZWNQYXJzZXIoKSB7XG4gICAgdGhpcy5yZXN1bHQgPSB7fTtcbn1cblNwZWNQYXJzZXIuX2luc3RhbmNlID0gbmV3IFNwZWNQYXJzZXIoKTtcblNwZWNQYXJzZXIucGFyc2UgPSBmdW5jdGlvbiBwYXJzZShzcGVjLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIFNwZWNQYXJzZXIuX2luc3RhbmNlLnBhcnNlKHNwZWMsIGNvbnRleHQpO1xufTtcblNwZWNQYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2Uoc3BlYywgY29udGV4dCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLl9wYXJzZVNwZWMoc3BlYywgY29udGV4dCwgVHJhbnNmb3JtLmlkZW50aXR5KTtcbiAgICByZXR1cm4gdGhpcy5yZXN1bHQ7XG59O1xuU3BlY1BhcnNlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB0aGlzLnJlc3VsdCA9IHt9O1xufTtcbmZ1bmN0aW9uIF92ZWNJbkNvbnRleHQodiwgbSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHZbMF0gKiBtWzBdICsgdlsxXSAqIG1bNF0gKyB2WzJdICogbVs4XSxcbiAgICAgICAgdlswXSAqIG1bMV0gKyB2WzFdICogbVs1XSArIHZbMl0gKiBtWzldLFxuICAgICAgICB2WzBdICogbVsyXSArIHZbMV0gKiBtWzZdICsgdlsyXSAqIG1bMTBdXG4gICAgXTtcbn1cbnZhciBfb3JpZ2luWmVyb1plcm8gPSBbXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdO1xuU3BlY1BhcnNlci5wcm90b3R5cGUuX3BhcnNlU3BlYyA9IGZ1bmN0aW9uIF9wYXJzZVNwZWMoc3BlYywgcGFyZW50Q29udGV4dCwgc2l6ZUNvbnRleHQpIHtcbiAgICB2YXIgaWQ7XG4gICAgdmFyIHRhcmdldDtcbiAgICB2YXIgdHJhbnNmb3JtO1xuICAgIHZhciBvcGFjaXR5O1xuICAgIHZhciBvcmlnaW47XG4gICAgdmFyIGFsaWduO1xuICAgIHZhciBzaXplO1xuICAgIGlmICh0eXBlb2Ygc3BlYyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgaWQgPSBzcGVjO1xuICAgICAgICB0cmFuc2Zvcm0gPSBwYXJlbnRDb250ZXh0LnRyYW5zZm9ybTtcbiAgICAgICAgYWxpZ24gPSBwYXJlbnRDb250ZXh0LmFsaWduIHx8IHBhcmVudENvbnRleHQub3JpZ2luO1xuICAgICAgICBpZiAocGFyZW50Q29udGV4dC5zaXplICYmIGFsaWduICYmIChhbGlnblswXSB8fCBhbGlnblsxXSkpIHtcbiAgICAgICAgICAgIHZhciBhbGlnbkFkanVzdCA9IFtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25bMF0gKiBwYXJlbnRDb250ZXh0LnNpemVbMF0sXG4gICAgICAgICAgICAgICAgICAgIGFsaWduWzFdICogcGFyZW50Q29udGV4dC5zaXplWzFdLFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHRyYW5zZm9ybSA9IFRyYW5zZm9ybS50aGVuTW92ZSh0cmFuc2Zvcm0sIF92ZWNJbkNvbnRleHQoYWxpZ25BZGp1c3QsIHNpemVDb250ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXN1bHRbaWRdID0ge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICBvcGFjaXR5OiBwYXJlbnRDb250ZXh0Lm9wYWNpdHksXG4gICAgICAgICAgICBvcmlnaW46IHBhcmVudENvbnRleHQub3JpZ2luIHx8IF9vcmlnaW5aZXJvWmVybyxcbiAgICAgICAgICAgIGFsaWduOiBwYXJlbnRDb250ZXh0LmFsaWduIHx8IHBhcmVudENvbnRleHQub3JpZ2luIHx8IF9vcmlnaW5aZXJvWmVybyxcbiAgICAgICAgICAgIHNpemU6IHBhcmVudENvbnRleHQuc2l6ZVxuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoIXNwZWMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoc3BlYyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BlYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fcGFyc2VTcGVjKHNwZWNbaV0sIHBhcmVudENvbnRleHQsIHNpemVDb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldCA9IHNwZWMudGFyZ2V0O1xuICAgICAgICB0cmFuc2Zvcm0gPSBwYXJlbnRDb250ZXh0LnRyYW5zZm9ybTtcbiAgICAgICAgb3BhY2l0eSA9IHBhcmVudENvbnRleHQub3BhY2l0eTtcbiAgICAgICAgb3JpZ2luID0gcGFyZW50Q29udGV4dC5vcmlnaW47XG4gICAgICAgIGFsaWduID0gcGFyZW50Q29udGV4dC5hbGlnbjtcbiAgICAgICAgc2l6ZSA9IHBhcmVudENvbnRleHQuc2l6ZTtcbiAgICAgICAgdmFyIG5leHRTaXplQ29udGV4dCA9IHNpemVDb250ZXh0O1xuICAgICAgICBpZiAoc3BlYy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBvcGFjaXR5ID0gcGFyZW50Q29udGV4dC5vcGFjaXR5ICogc3BlYy5vcGFjaXR5O1xuICAgICAgICBpZiAoc3BlYy50cmFuc2Zvcm0pXG4gICAgICAgICAgICB0cmFuc2Zvcm0gPSBUcmFuc2Zvcm0ubXVsdGlwbHkocGFyZW50Q29udGV4dC50cmFuc2Zvcm0sIHNwZWMudHJhbnNmb3JtKTtcbiAgICAgICAgaWYgKHNwZWMub3JpZ2luKSB7XG4gICAgICAgICAgICBvcmlnaW4gPSBzcGVjLm9yaWdpbjtcbiAgICAgICAgICAgIG5leHRTaXplQ29udGV4dCA9IHBhcmVudENvbnRleHQudHJhbnNmb3JtO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcGVjLmFsaWduKVxuICAgICAgICAgICAgYWxpZ24gPSBzcGVjLmFsaWduO1xuICAgICAgICBpZiAoc3BlYy5zaXplKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50U2l6ZSA9IHBhcmVudENvbnRleHQuc2l6ZTtcbiAgICAgICAgICAgIHNpemUgPSBbXG4gICAgICAgICAgICAgICAgc3BlYy5zaXplWzBdICE9PSB1bmRlZmluZWQgPyBzcGVjLnNpemVbMF0gOiBwYXJlbnRTaXplWzBdLFxuICAgICAgICAgICAgICAgIHNwZWMuc2l6ZVsxXSAhPT0gdW5kZWZpbmVkID8gc3BlYy5zaXplWzFdIDogcGFyZW50U2l6ZVsxXVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRTaXplKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhbGlnbilcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24gPSBvcmlnaW47XG4gICAgICAgICAgICAgICAgaWYgKGFsaWduICYmIChhbGlnblswXSB8fCBhbGlnblsxXSkpXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybSA9IFRyYW5zZm9ybS50aGVuTW92ZSh0cmFuc2Zvcm0sIF92ZWNJbkNvbnRleHQoW1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25bMF0gKiBwYXJlbnRTaXplWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25bMV0gKiBwYXJlbnRTaXplWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICAgICBdLCBzaXplQ29udGV4dCkpO1xuICAgICAgICAgICAgICAgIGlmIChvcmlnaW4gJiYgKG9yaWdpblswXSB8fCBvcmlnaW5bMV0pKVxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm0gPSBUcmFuc2Zvcm0ubW92ZVRoZW4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgLW9yaWdpblswXSAqIHNpemVbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAtb3JpZ2luWzFdICogc2l6ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICAgICAgXSwgdHJhbnNmb3JtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHRTaXplQ29udGV4dCA9IHBhcmVudENvbnRleHQudHJhbnNmb3JtO1xuICAgICAgICAgICAgb3JpZ2luID0gbnVsbDtcbiAgICAgICAgICAgIGFsaWduID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wYXJzZVNwZWModGFyZ2V0LCB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcbiAgICAgICAgICAgIG9wYWNpdHk6IG9wYWNpdHksXG4gICAgICAgICAgICBvcmlnaW46IG9yaWdpbixcbiAgICAgICAgICAgIGFsaWduOiBhbGlnbixcbiAgICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfSwgbmV4dFNpemVDb250ZXh0KTtcbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTcGVjUGFyc2VyOyIsInZhciBFbGVtZW50T3V0cHV0ID0gcmVxdWlyZSgnLi9FbGVtZW50T3V0cHV0Jyk7XG5mdW5jdGlvbiBTdXJmYWNlKG9wdGlvbnMpIHtcbiAgICBFbGVtZW50T3V0cHV0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0ge307XG4gICAgdGhpcy5jb250ZW50ID0gJyc7XG4gICAgdGhpcy5jbGFzc0xpc3QgPSBbXTtcbiAgICB0aGlzLnNpemUgPSBudWxsO1xuICAgIHRoaXMuX2NsYXNzZXNEaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fc3R5bGVzRGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX3NpemVEaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fY29udGVudERpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9kaXJ0eUNsYXNzZXMgPSBbXTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX2N1cnJlbnRUYXJnZXQgPSBudWxsO1xufVxuU3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVsZW1lbnRPdXRwdXQucHJvdG90eXBlKTtcblN1cmZhY2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3VyZmFjZTtcblN1cmZhY2UucHJvdG90eXBlLmVsZW1lbnRUeXBlID0gJ2Rpdic7XG5TdXJmYWNlLnByb3RvdHlwZS5lbGVtZW50Q2xhc3MgPSAnZmFtb3VzLXN1cmZhY2UnO1xuU3VyZmFjZS5wcm90b3R5cGUuc2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uIHNldFByb3BlcnRpZXMocHJvcGVydGllcykge1xuICAgIGZvciAodmFyIG4gaW4gcHJvcGVydGllcykge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXNbbl0gPSBwcm9wZXJ0aWVzW25dO1xuICAgIH1cbiAgICB0aGlzLl9zdHlsZXNEaXJ0eSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuZ2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uIGdldFByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllcztcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIGFkZENsYXNzKGNsYXNzTmFtZSkge1xuICAgIGlmICh0aGlzLmNsYXNzTGlzdC5pbmRleE9mKGNsYXNzTmFtZSkgPCAwKSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnB1c2goY2xhc3NOYW1lKTtcbiAgICAgICAgdGhpcy5fY2xhc3Nlc0RpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhjbGFzc05hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuY2xhc3NMaXN0LmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICAgIHRoaXMuX2RpcnR5Q2xhc3Nlcy5wdXNoKHRoaXMuY2xhc3NMaXN0LnNwbGljZShpLCAxKVswXSk7XG4gICAgICAgIHRoaXMuX2NsYXNzZXNEaXJ0eSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblN1cmZhY2UucHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoY2xhc3NOYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLmNsYXNzTGlzdC5pbmRleE9mKGNsYXNzTmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRDbGFzcyhjbGFzc05hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5zZXRDbGFzc2VzID0gZnVuY3Rpb24gc2V0Q2xhc3NlcyhjbGFzc0xpc3QpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJlbW92YWwgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jbGFzc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNsYXNzTGlzdC5pbmRleE9mKHRoaXMuY2xhc3NMaXN0W2ldKSA8IDApXG4gICAgICAgICAgICByZW1vdmFsLnB1c2godGhpcy5jbGFzc0xpc3RbaV0pO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgcmVtb3ZhbC5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5yZW1vdmVDbGFzcyhyZW1vdmFsW2ldKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICB0aGlzLmFkZENsYXNzKGNsYXNzTGlzdFtpXSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuZ2V0Q2xhc3NMaXN0ID0gZnVuY3Rpb24gZ2V0Q2xhc3NMaXN0KCkge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdDtcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gc2V0Q29udGVudChjb250ZW50KSB7XG4gICAgaWYgKHRoaXMuY29udGVudCAhPT0gY29udGVudCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICB0aGlzLl9jb250ZW50RGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5nZXRDb250ZW50ID0gZnVuY3Rpb24gZ2V0Q29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50O1xufTtcblN1cmZhY2UucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5zaXplKVxuICAgICAgICB0aGlzLnNldFNpemUob3B0aW9ucy5zaXplKTtcbiAgICBpZiAob3B0aW9ucy5jbGFzc2VzKVxuICAgICAgICB0aGlzLnNldENsYXNzZXMob3B0aW9ucy5jbGFzc2VzKTtcbiAgICBpZiAob3B0aW9ucy5wcm9wZXJ0aWVzKVxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMob3B0aW9ucy5wcm9wZXJ0aWVzKTtcbiAgICBpZiAob3B0aW9ucy5jb250ZW50KVxuICAgICAgICB0aGlzLnNldENvbnRlbnQob3B0aW9ucy5jb250ZW50KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5mdW5jdGlvbiBfY2xlYW51cENsYXNzZXModGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9kaXJ0eUNsYXNzZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX2RpcnR5Q2xhc3Nlc1tpXSk7XG4gICAgdGhpcy5fZGlydHlDbGFzc2VzID0gW107XG59XG5mdW5jdGlvbiBfYXBwbHlTdHlsZXModGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgbiBpbiB0aGlzLnByb3BlcnRpZXMpIHtcbiAgICAgICAgdGFyZ2V0LnN0eWxlW25dID0gdGhpcy5wcm9wZXJ0aWVzW25dO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9jbGVhbnVwU3R5bGVzKHRhcmdldCkge1xuICAgIGZvciAodmFyIG4gaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZVtuXSA9ICcnO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF94eU5vdEVxdWFscyhhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGFbMF0gIT09IGJbMF0gfHwgYVsxXSAhPT0gYlsxXSA6IGEgIT09IGI7XG59XG5TdXJmYWNlLnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uIHNldHVwKGFsbG9jYXRvcikge1xuICAgIHZhciB0YXJnZXQgPSBhbGxvY2F0b3IuYWxsb2NhdGUodGhpcy5lbGVtZW50VHlwZSk7XG4gICAgaWYgKHRoaXMuZWxlbWVudENsYXNzKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRDbGFzcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudENsYXNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodGhpcy5lbGVtZW50Q2xhc3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodGhpcy5lbGVtZW50Q2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgdGhpcy5hdHRhY2godGFyZ2V0KTtcbiAgICB0aGlzLl9vcGFjaXR5ID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50VGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuX3N0eWxlc0RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9jbGFzc2VzRGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX3NpemVEaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fY29udGVudERpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9vcmlnaW5EaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fdHJhbnNmb3JtRGlydHkgPSB0cnVlO1xufTtcblN1cmZhY2UucHJvdG90eXBlLmNvbW1pdCA9IGZ1bmN0aW9uIGNvbW1pdChjb250ZXh0KSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VGFyZ2V0KVxuICAgICAgICB0aGlzLnNldHVwKGNvbnRleHQuYWxsb2NhdG9yKTtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5fY3VycmVudFRhcmdldDtcbiAgICB2YXIgc2l6ZSA9IGNvbnRleHQuc2l6ZTtcbiAgICBpZiAodGhpcy5fY2xhc3Nlc0RpcnR5KSB7XG4gICAgICAgIF9jbGVhbnVwQ2xhc3Nlcy5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHZhciBjbGFzc0xpc3QgPSB0aGlzLmdldENsYXNzTGlzdCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTGlzdFtpXSk7XG4gICAgICAgIHRoaXMuX2NsYXNzZXNEaXJ0eSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc3R5bGVzRGlydHkpIHtcbiAgICAgICAgX2FwcGx5U3R5bGVzLmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fc3R5bGVzRGlydHkgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSkge1xuICAgICAgICB2YXIgb3JpZ1NpemUgPSBjb250ZXh0LnNpemU7XG4gICAgICAgIHNpemUgPSBbXG4gICAgICAgICAgICB0aGlzLnNpemVbMF0sXG4gICAgICAgICAgICB0aGlzLnNpemVbMV1cbiAgICAgICAgXTtcbiAgICAgICAgaWYgKHNpemVbMF0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNpemVbMF0gPSBvcmlnU2l6ZVswXTtcbiAgICAgICAgZWxzZSBpZiAoc2l6ZVswXSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHNpemVbMF0gPSB0YXJnZXQuY2xpZW50V2lkdGg7XG4gICAgICAgIGlmIChzaXplWzFdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBzaXplWzFdID0gb3JpZ1NpemVbMV07XG4gICAgICAgIGVsc2UgaWYgKHNpemVbMV0gPT09IHRydWUpXG4gICAgICAgICAgICBzaXplWzFdID0gdGFyZ2V0LmNsaWVudEhlaWdodDtcbiAgICB9XG4gICAgaWYgKF94eU5vdEVxdWFscyh0aGlzLl9zaXplLCBzaXplKSkge1xuICAgICAgICBpZiAoIXRoaXMuX3NpemUpXG4gICAgICAgICAgICB0aGlzLl9zaXplID0gW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXTtcbiAgICAgICAgdGhpcy5fc2l6ZVswXSA9IHNpemVbMF07XG4gICAgICAgIHRoaXMuX3NpemVbMV0gPSBzaXplWzFdO1xuICAgICAgICB0aGlzLl9zaXplRGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc2l6ZURpcnR5KSB7XG4gICAgICAgIGlmICh0aGlzLl9zaXplKSB7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUud2lkdGggPSB0aGlzLnNpemUgJiYgdGhpcy5zaXplWzBdID09PSB0cnVlID8gJycgOiB0aGlzLl9zaXplWzBdICsgJ3B4JztcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSB0aGlzLnNpemUgJiYgdGhpcy5zaXplWzFdID09PSB0cnVlID8gJycgOiB0aGlzLl9zaXplWzFdICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zaXplRGlydHkgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbnRlbnREaXJ0eSkge1xuICAgICAgICB0aGlzLmRlcGxveSh0YXJnZXQpO1xuICAgICAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdkZXBsb3knKTtcbiAgICAgICAgdGhpcy5fY29udGVudERpcnR5ID0gZmFsc2U7XG4gICAgfVxuICAgIEVsZW1lbnRPdXRwdXQucHJvdG90eXBlLmNvbW1pdC5jYWxsKHRoaXMsIGNvbnRleHQpO1xufTtcblN1cmZhY2UucHJvdG90eXBlLmNsZWFudXAgPSBmdW5jdGlvbiBjbGVhbnVwKGFsbG9jYXRvcikge1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5fY3VycmVudFRhcmdldDtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdyZWNhbGwnKTtcbiAgICB0aGlzLnJlY2FsbCh0YXJnZXQpO1xuICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRhcmdldC5zdHlsZS5vcGFjaXR5ID0gJyc7XG4gICAgdGFyZ2V0LnN0eWxlLndpZHRoID0gJyc7XG4gICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9ICcnO1xuICAgIHRoaXMuX3NpemUgPSBudWxsO1xuICAgIF9jbGVhbnVwU3R5bGVzLmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICB2YXIgY2xhc3NMaXN0ID0gdGhpcy5nZXRDbGFzc0xpc3QoKTtcbiAgICBfY2xlYW51cENsYXNzZXMuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBjbGFzc0xpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTGlzdFtpXSk7XG4gICAgaWYgKHRoaXMuZWxlbWVudENsYXNzKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRDbGFzcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50Q2xhc3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmVsZW1lbnRDbGFzc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmVsZW1lbnRDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZXRhY2godGFyZ2V0KTtcbiAgICB0aGlzLl9jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICBhbGxvY2F0b3IuZGVhbGxvY2F0ZSh0YXJnZXQpO1xufTtcblN1cmZhY2UucHJvdG90eXBlLmRlcGxveSA9IGZ1bmN0aW9uIGRlcGxveSh0YXJnZXQpIHtcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpO1xuICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICB3aGlsZSAodGFyZ2V0Lmhhc0NoaWxkTm9kZXMoKSlcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZCh0YXJnZXQuZmlyc3RDaGlsZCk7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICB9IGVsc2VcbiAgICAgICAgdGFyZ2V0LmlubmVySFRNTCA9IGNvbnRlbnQ7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUucmVjYWxsID0gZnVuY3Rpb24gcmVjYWxsKHRhcmdldCkge1xuICAgIHZhciBkZiA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB3aGlsZSAodGFyZ2V0Lmhhc0NoaWxkTm9kZXMoKSlcbiAgICAgICAgZGYuYXBwZW5kQ2hpbGQodGFyZ2V0LmZpcnN0Q2hpbGQpO1xuICAgIHRoaXMuc2V0Q29udGVudChkZik7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uIGdldFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpemU7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uIHNldFNpemUoc2l6ZSkge1xuICAgIHRoaXMuc2l6ZSA9IHNpemUgPyBbXG4gICAgICAgIHNpemVbMF0sXG4gICAgICAgIHNpemVbMV1cbiAgICBdIDogbnVsbDtcbiAgICB0aGlzLl9zaXplRGlydHkgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xufTtcbm1vZHVsZS5leHBvcnRzID0gU3VyZmFjZTsiLCJ2YXIgVHJhbnNmb3JtID0ge307XG5UcmFuc2Zvcm0ucHJlY2lzaW9uID0gMC4wMDAwMDE7XG5UcmFuc2Zvcm0uaWRlbnRpdHkgPSBbXG4gICAgMSxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDEsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAxLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMVxuXTtcblRyYW5zZm9ybS5tdWx0aXBseTR4NCA9IGZ1bmN0aW9uIG11bHRpcGx5NHg0KGEsIGIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBhWzBdICogYlswXSArIGFbNF0gKiBiWzFdICsgYVs4XSAqIGJbMl0gKyBhWzEyXSAqIGJbM10sXG4gICAgICAgIGFbMV0gKiBiWzBdICsgYVs1XSAqIGJbMV0gKyBhWzldICogYlsyXSArIGFbMTNdICogYlszXSxcbiAgICAgICAgYVsyXSAqIGJbMF0gKyBhWzZdICogYlsxXSArIGFbMTBdICogYlsyXSArIGFbMTRdICogYlszXSxcbiAgICAgICAgYVszXSAqIGJbMF0gKyBhWzddICogYlsxXSArIGFbMTFdICogYlsyXSArIGFbMTVdICogYlszXSxcbiAgICAgICAgYVswXSAqIGJbNF0gKyBhWzRdICogYls1XSArIGFbOF0gKiBiWzZdICsgYVsxMl0gKiBiWzddLFxuICAgICAgICBhWzFdICogYls0XSArIGFbNV0gKiBiWzVdICsgYVs5XSAqIGJbNl0gKyBhWzEzXSAqIGJbN10sXG4gICAgICAgIGFbMl0gKiBiWzRdICsgYVs2XSAqIGJbNV0gKyBhWzEwXSAqIGJbNl0gKyBhWzE0XSAqIGJbN10sXG4gICAgICAgIGFbM10gKiBiWzRdICsgYVs3XSAqIGJbNV0gKyBhWzExXSAqIGJbNl0gKyBhWzE1XSAqIGJbN10sXG4gICAgICAgIGFbMF0gKiBiWzhdICsgYVs0XSAqIGJbOV0gKyBhWzhdICogYlsxMF0gKyBhWzEyXSAqIGJbMTFdLFxuICAgICAgICBhWzFdICogYls4XSArIGFbNV0gKiBiWzldICsgYVs5XSAqIGJbMTBdICsgYVsxM10gKiBiWzExXSxcbiAgICAgICAgYVsyXSAqIGJbOF0gKyBhWzZdICogYls5XSArIGFbMTBdICogYlsxMF0gKyBhWzE0XSAqIGJbMTFdLFxuICAgICAgICBhWzNdICogYls4XSArIGFbN10gKiBiWzldICsgYVsxMV0gKiBiWzEwXSArIGFbMTVdICogYlsxMV0sXG4gICAgICAgIGFbMF0gKiBiWzEyXSArIGFbNF0gKiBiWzEzXSArIGFbOF0gKiBiWzE0XSArIGFbMTJdICogYlsxNV0sXG4gICAgICAgIGFbMV0gKiBiWzEyXSArIGFbNV0gKiBiWzEzXSArIGFbOV0gKiBiWzE0XSArIGFbMTNdICogYlsxNV0sXG4gICAgICAgIGFbMl0gKiBiWzEyXSArIGFbNl0gKiBiWzEzXSArIGFbMTBdICogYlsxNF0gKyBhWzE0XSAqIGJbMTVdLFxuICAgICAgICBhWzNdICogYlsxMl0gKyBhWzddICogYlsxM10gKyBhWzExXSAqIGJbMTRdICsgYVsxNV0gKiBiWzE1XVxuICAgIF07XG59O1xuVHJhbnNmb3JtLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkoYSwgYikge1xuICAgIHJldHVybiBbXG4gICAgICAgIGFbMF0gKiBiWzBdICsgYVs0XSAqIGJbMV0gKyBhWzhdICogYlsyXSxcbiAgICAgICAgYVsxXSAqIGJbMF0gKyBhWzVdICogYlsxXSArIGFbOV0gKiBiWzJdLFxuICAgICAgICBhWzJdICogYlswXSArIGFbNl0gKiBiWzFdICsgYVsxMF0gKiBiWzJdLFxuICAgICAgICAwLFxuICAgICAgICBhWzBdICogYls0XSArIGFbNF0gKiBiWzVdICsgYVs4XSAqIGJbNl0sXG4gICAgICAgIGFbMV0gKiBiWzRdICsgYVs1XSAqIGJbNV0gKyBhWzldICogYls2XSxcbiAgICAgICAgYVsyXSAqIGJbNF0gKyBhWzZdICogYls1XSArIGFbMTBdICogYls2XSxcbiAgICAgICAgMCxcbiAgICAgICAgYVswXSAqIGJbOF0gKyBhWzRdICogYls5XSArIGFbOF0gKiBiWzEwXSxcbiAgICAgICAgYVsxXSAqIGJbOF0gKyBhWzVdICogYls5XSArIGFbOV0gKiBiWzEwXSxcbiAgICAgICAgYVsyXSAqIGJbOF0gKyBhWzZdICogYls5XSArIGFbMTBdICogYlsxMF0sXG4gICAgICAgIDAsXG4gICAgICAgIGFbMF0gKiBiWzEyXSArIGFbNF0gKiBiWzEzXSArIGFbOF0gKiBiWzE0XSArIGFbMTJdLFxuICAgICAgICBhWzFdICogYlsxMl0gKyBhWzVdICogYlsxM10gKyBhWzldICogYlsxNF0gKyBhWzEzXSxcbiAgICAgICAgYVsyXSAqIGJbMTJdICsgYVs2XSAqIGJbMTNdICsgYVsxMF0gKiBiWzE0XSArIGFbMTRdLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0udGhlbk1vdmUgPSBmdW5jdGlvbiB0aGVuTW92ZShtLCB0KSB7XG4gICAgaWYgKCF0WzJdKVxuICAgICAgICB0WzJdID0gMDtcbiAgICByZXR1cm4gW1xuICAgICAgICBtWzBdLFxuICAgICAgICBtWzFdLFxuICAgICAgICBtWzJdLFxuICAgICAgICAwLFxuICAgICAgICBtWzRdLFxuICAgICAgICBtWzVdLFxuICAgICAgICBtWzZdLFxuICAgICAgICAwLFxuICAgICAgICBtWzhdLFxuICAgICAgICBtWzldLFxuICAgICAgICBtWzEwXSxcbiAgICAgICAgMCxcbiAgICAgICAgbVsxMl0gKyB0WzBdLFxuICAgICAgICBtWzEzXSArIHRbMV0sXG4gICAgICAgIG1bMTRdICsgdFsyXSxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLm1vdmVUaGVuID0gZnVuY3Rpb24gbW92ZVRoZW4odiwgbSkge1xuICAgIGlmICghdlsyXSlcbiAgICAgICAgdlsyXSA9IDA7XG4gICAgdmFyIHQwID0gdlswXSAqIG1bMF0gKyB2WzFdICogbVs0XSArIHZbMl0gKiBtWzhdO1xuICAgIHZhciB0MSA9IHZbMF0gKiBtWzFdICsgdlsxXSAqIG1bNV0gKyB2WzJdICogbVs5XTtcbiAgICB2YXIgdDIgPSB2WzBdICogbVsyXSArIHZbMV0gKiBtWzZdICsgdlsyXSAqIG1bMTBdO1xuICAgIHJldHVybiBUcmFuc2Zvcm0udGhlbk1vdmUobSwgW1xuICAgICAgICB0MCxcbiAgICAgICAgdDEsXG4gICAgICAgIHQyXG4gICAgXSk7XG59O1xuVHJhbnNmb3JtLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uIHRyYW5zbGF0ZSh4LCB5LCB6KSB7XG4gICAgaWYgKHogPT09IHVuZGVmaW5lZClcbiAgICAgICAgeiA9IDA7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgeixcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnRoZW5TY2FsZSA9IGZ1bmN0aW9uIHRoZW5TY2FsZShtLCBzKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgc1swXSAqIG1bMF0sXG4gICAgICAgIHNbMV0gKiBtWzFdLFxuICAgICAgICBzWzJdICogbVsyXSxcbiAgICAgICAgMCxcbiAgICAgICAgc1swXSAqIG1bNF0sXG4gICAgICAgIHNbMV0gKiBtWzVdLFxuICAgICAgICBzWzJdICogbVs2XSxcbiAgICAgICAgMCxcbiAgICAgICAgc1swXSAqIG1bOF0sXG4gICAgICAgIHNbMV0gKiBtWzldLFxuICAgICAgICBzWzJdICogbVsxMF0sXG4gICAgICAgIDAsXG4gICAgICAgIHNbMF0gKiBtWzEyXSxcbiAgICAgICAgc1sxXSAqIG1bMTNdLFxuICAgICAgICBzWzJdICogbVsxNF0sXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS5zY2FsZSA9IGZ1bmN0aW9uIHNjYWxlKHgsIHksIHopIHtcbiAgICBpZiAoeiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB6ID0gMTtcbiAgICBpZiAoeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB5ID0geDtcbiAgICByZXR1cm4gW1xuICAgICAgICB4LFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB5LFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB6LFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0ucm90YXRlWCA9IGZ1bmN0aW9uIHJvdGF0ZVgodGhldGEpIHtcbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHJldHVybiBbXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIGNvc1RoZXRhLFxuICAgICAgICBzaW5UaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgLXNpblRoZXRhLFxuICAgICAgICBjb3NUaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnJvdGF0ZVkgPSBmdW5jdGlvbiByb3RhdGVZKHRoZXRhKSB7XG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcbiAgICByZXR1cm4gW1xuICAgICAgICBjb3NUaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgLXNpblRoZXRhLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICBzaW5UaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgY29zVGhldGEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS5yb3RhdGVaID0gZnVuY3Rpb24gcm90YXRlWih0aGV0YSkge1xuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgY29zVGhldGEsXG4gICAgICAgIHNpblRoZXRhLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAtc2luVGhldGEsXG4gICAgICAgIGNvc1RoZXRhLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0ucm90YXRlID0gZnVuY3Rpb24gcm90YXRlKHBoaSwgdGhldGEsIHBzaSkge1xuICAgIHZhciBjb3NQaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIHZhciBzaW5QaGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgdmFyIGNvc1BzaSA9IE1hdGguY29zKHBzaSk7XG4gICAgdmFyIHNpblBzaSA9IE1hdGguc2luKHBzaSk7XG4gICAgdmFyIHJlc3VsdCA9IFtcbiAgICAgICAgICAgIGNvc1RoZXRhICogY29zUHNpLFxuICAgICAgICAgICAgY29zUGhpICogc2luUHNpICsgc2luUGhpICogc2luVGhldGEgKiBjb3NQc2ksXG4gICAgICAgICAgICBzaW5QaGkgKiBzaW5Qc2kgLSBjb3NQaGkgKiBzaW5UaGV0YSAqIGNvc1BzaSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAtY29zVGhldGEgKiBzaW5Qc2ksXG4gICAgICAgICAgICBjb3NQaGkgKiBjb3NQc2kgLSBzaW5QaGkgKiBzaW5UaGV0YSAqIHNpblBzaSxcbiAgICAgICAgICAgIHNpblBoaSAqIGNvc1BzaSArIGNvc1BoaSAqIHNpblRoZXRhICogc2luUHNpLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIHNpblRoZXRhLFxuICAgICAgICAgICAgLXNpblBoaSAqIGNvc1RoZXRhLFxuICAgICAgICAgICAgY29zUGhpICogY29zVGhldGEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICBdO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuVHJhbnNmb3JtLnJvdGF0ZUF4aXMgPSBmdW5jdGlvbiByb3RhdGVBeGlzKHYsIHRoZXRhKSB7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgdmVyVGhldGEgPSAxIC0gY29zVGhldGE7XG4gICAgdmFyIHh4ViA9IHZbMF0gKiB2WzBdICogdmVyVGhldGE7XG4gICAgdmFyIHh5ViA9IHZbMF0gKiB2WzFdICogdmVyVGhldGE7XG4gICAgdmFyIHh6ViA9IHZbMF0gKiB2WzJdICogdmVyVGhldGE7XG4gICAgdmFyIHl5ViA9IHZbMV0gKiB2WzFdICogdmVyVGhldGE7XG4gICAgdmFyIHl6ViA9IHZbMV0gKiB2WzJdICogdmVyVGhldGE7XG4gICAgdmFyIHp6ViA9IHZbMl0gKiB2WzJdICogdmVyVGhldGE7XG4gICAgdmFyIHhzID0gdlswXSAqIHNpblRoZXRhO1xuICAgIHZhciB5cyA9IHZbMV0gKiBzaW5UaGV0YTtcbiAgICB2YXIgenMgPSB2WzJdICogc2luVGhldGE7XG4gICAgdmFyIHJlc3VsdCA9IFtcbiAgICAgICAgICAgIHh4ViArIGNvc1RoZXRhLFxuICAgICAgICAgICAgeHlWICsgenMsXG4gICAgICAgICAgICB4elYgLSB5cyxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB4eVYgLSB6cyxcbiAgICAgICAgICAgIHl5ViArIGNvc1RoZXRhLFxuICAgICAgICAgICAgeXpWICsgeHMsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgeHpWICsgeXMsXG4gICAgICAgICAgICB5elYgLSB4cyxcbiAgICAgICAgICAgIHp6ViArIGNvc1RoZXRhLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgXTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblRyYW5zZm9ybS5hYm91dE9yaWdpbiA9IGZ1bmN0aW9uIGFib3V0T3JpZ2luKHYsIG0pIHtcbiAgICB2YXIgdDAgPSB2WzBdIC0gKHZbMF0gKiBtWzBdICsgdlsxXSAqIG1bNF0gKyB2WzJdICogbVs4XSk7XG4gICAgdmFyIHQxID0gdlsxXSAtICh2WzBdICogbVsxXSArIHZbMV0gKiBtWzVdICsgdlsyXSAqIG1bOV0pO1xuICAgIHZhciB0MiA9IHZbMl0gLSAodlswXSAqIG1bMl0gKyB2WzFdICogbVs2XSArIHZbMl0gKiBtWzEwXSk7XG4gICAgcmV0dXJuIFRyYW5zZm9ybS50aGVuTW92ZShtLCBbXG4gICAgICAgIHQwLFxuICAgICAgICB0MSxcbiAgICAgICAgdDJcbiAgICBdKTtcbn07XG5UcmFuc2Zvcm0uc2tldyA9IGZ1bmN0aW9uIHNrZXcocGhpLCB0aGV0YSwgcHNpKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC50YW4odGhldGEpLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICBNYXRoLnRhbihwc2kpLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICBNYXRoLnRhbihwaGkpLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0uc2tld1ggPSBmdW5jdGlvbiBza2V3WChhbmdsZSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIE1hdGgudGFuKGFuZ2xlKSxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnNrZXdZID0gZnVuY3Rpb24gc2tld1koYW5nbGUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAxLFxuICAgICAgICBNYXRoLnRhbihhbmdsZSksXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIHBlcnNwZWN0aXZlKGZvY3VzWikge1xuICAgIHJldHVybiBbXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIC0xIC8gZm9jdXNaLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0uZ2V0VHJhbnNsYXRlID0gZnVuY3Rpb24gZ2V0VHJhbnNsYXRlKG0pIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBtWzEyXSxcbiAgICAgICAgbVsxM10sXG4gICAgICAgIG1bMTRdXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0uaW52ZXJzZSA9IGZ1bmN0aW9uIGludmVyc2UobSkge1xuICAgIHZhciBjMCA9IG1bNV0gKiBtWzEwXSAtIG1bNl0gKiBtWzldO1xuICAgIHZhciBjMSA9IG1bNF0gKiBtWzEwXSAtIG1bNl0gKiBtWzhdO1xuICAgIHZhciBjMiA9IG1bNF0gKiBtWzldIC0gbVs1XSAqIG1bOF07XG4gICAgdmFyIGM0ID0gbVsxXSAqIG1bMTBdIC0gbVsyXSAqIG1bOV07XG4gICAgdmFyIGM1ID0gbVswXSAqIG1bMTBdIC0gbVsyXSAqIG1bOF07XG4gICAgdmFyIGM2ID0gbVswXSAqIG1bOV0gLSBtWzFdICogbVs4XTtcbiAgICB2YXIgYzggPSBtWzFdICogbVs2XSAtIG1bMl0gKiBtWzVdO1xuICAgIHZhciBjOSA9IG1bMF0gKiBtWzZdIC0gbVsyXSAqIG1bNF07XG4gICAgdmFyIGMxMCA9IG1bMF0gKiBtWzVdIC0gbVsxXSAqIG1bNF07XG4gICAgdmFyIGRldE0gPSBtWzBdICogYzAgLSBtWzFdICogYzEgKyBtWzJdICogYzI7XG4gICAgdmFyIGludkQgPSAxIC8gZGV0TTtcbiAgICB2YXIgcmVzdWx0ID0gW1xuICAgICAgICAgICAgaW52RCAqIGMwLFxuICAgICAgICAgICAgLWludkQgKiBjNCxcbiAgICAgICAgICAgIGludkQgKiBjOCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAtaW52RCAqIGMxLFxuICAgICAgICAgICAgaW52RCAqIGM1LFxuICAgICAgICAgICAgLWludkQgKiBjOSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBpbnZEICogYzIsXG4gICAgICAgICAgICAtaW52RCAqIGM2LFxuICAgICAgICAgICAgaW52RCAqIGMxMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgIF07XG4gICAgcmVzdWx0WzEyXSA9IC1tWzEyXSAqIHJlc3VsdFswXSAtIG1bMTNdICogcmVzdWx0WzRdIC0gbVsxNF0gKiByZXN1bHRbOF07XG4gICAgcmVzdWx0WzEzXSA9IC1tWzEyXSAqIHJlc3VsdFsxXSAtIG1bMTNdICogcmVzdWx0WzVdIC0gbVsxNF0gKiByZXN1bHRbOV07XG4gICAgcmVzdWx0WzE0XSA9IC1tWzEyXSAqIHJlc3VsdFsyXSAtIG1bMTNdICogcmVzdWx0WzZdIC0gbVsxNF0gKiByZXN1bHRbMTBdO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuVHJhbnNmb3JtLnRyYW5zcG9zZSA9IGZ1bmN0aW9uIHRyYW5zcG9zZShtKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgbVswXSxcbiAgICAgICAgbVs0XSxcbiAgICAgICAgbVs4XSxcbiAgICAgICAgbVsxMl0sXG4gICAgICAgIG1bMV0sXG4gICAgICAgIG1bNV0sXG4gICAgICAgIG1bOV0sXG4gICAgICAgIG1bMTNdLFxuICAgICAgICBtWzJdLFxuICAgICAgICBtWzZdLFxuICAgICAgICBtWzEwXSxcbiAgICAgICAgbVsxNF0sXG4gICAgICAgIG1bM10sXG4gICAgICAgIG1bN10sXG4gICAgICAgIG1bMTFdLFxuICAgICAgICBtWzE1XVxuICAgIF07XG59O1xuZnVuY3Rpb24gX25vcm1TcXVhcmVkKHYpIHtcbiAgICByZXR1cm4gdi5sZW5ndGggPT09IDIgPyB2WzBdICogdlswXSArIHZbMV0gKiB2WzFdIDogdlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSArIHZbMl0gKiB2WzJdO1xufVxuZnVuY3Rpb24gX25vcm0odikge1xuICAgIHJldHVybiBNYXRoLnNxcnQoX25vcm1TcXVhcmVkKHYpKTtcbn1cbmZ1bmN0aW9uIF9zaWduKG4pIHtcbiAgICByZXR1cm4gbiA8IDAgPyAtMSA6IDE7XG59XG5UcmFuc2Zvcm0uaW50ZXJwcmV0ID0gZnVuY3Rpb24gaW50ZXJwcmV0KE0pIHtcbiAgICB2YXIgeCA9IFtcbiAgICAgICAgICAgIE1bMF0sXG4gICAgICAgICAgICBNWzFdLFxuICAgICAgICAgICAgTVsyXVxuICAgICAgICBdO1xuICAgIHZhciBzZ24gPSBfc2lnbih4WzBdKTtcbiAgICB2YXIgeE5vcm0gPSBfbm9ybSh4KTtcbiAgICB2YXIgdiA9IFtcbiAgICAgICAgICAgIHhbMF0gKyBzZ24gKiB4Tm9ybSxcbiAgICAgICAgICAgIHhbMV0sXG4gICAgICAgICAgICB4WzJdXG4gICAgICAgIF07XG4gICAgdmFyIG11bHQgPSAyIC8gX25vcm1TcXVhcmVkKHYpO1xuICAgIGlmIChtdWx0ID49IEluZmluaXR5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFuc2xhdGU6IFRyYW5zZm9ybS5nZXRUcmFuc2xhdGUoTSksXG4gICAgICAgICAgICByb3RhdGU6IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHNjYWxlOiBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBza2V3OiBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIFExID0gW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICBdO1xuICAgIFExWzBdID0gMSAtIG11bHQgKiB2WzBdICogdlswXTtcbiAgICBRMVs1XSA9IDEgLSBtdWx0ICogdlsxXSAqIHZbMV07XG4gICAgUTFbMTBdID0gMSAtIG11bHQgKiB2WzJdICogdlsyXTtcbiAgICBRMVsxXSA9IC1tdWx0ICogdlswXSAqIHZbMV07XG4gICAgUTFbMl0gPSAtbXVsdCAqIHZbMF0gKiB2WzJdO1xuICAgIFExWzZdID0gLW11bHQgKiB2WzFdICogdlsyXTtcbiAgICBRMVs0XSA9IFExWzFdO1xuICAgIFExWzhdID0gUTFbMl07XG4gICAgUTFbOV0gPSBRMVs2XTtcbiAgICB2YXIgTVExID0gVHJhbnNmb3JtLm11bHRpcGx5KFExLCBNKTtcbiAgICB2YXIgeDIgPSBbXG4gICAgICAgICAgICBNUTFbNV0sXG4gICAgICAgICAgICBNUTFbNl1cbiAgICAgICAgXTtcbiAgICB2YXIgc2duMiA9IF9zaWduKHgyWzBdKTtcbiAgICB2YXIgeDJOb3JtID0gX25vcm0oeDIpO1xuICAgIHZhciB2MiA9IFtcbiAgICAgICAgICAgIHgyWzBdICsgc2duMiAqIHgyTm9ybSxcbiAgICAgICAgICAgIHgyWzFdXG4gICAgICAgIF07XG4gICAgdmFyIG11bHQyID0gMiAvIF9ub3JtU3F1YXJlZCh2Mik7XG4gICAgdmFyIFEyID0gW1xuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICBdO1xuICAgIFEyWzVdID0gMSAtIG11bHQyICogdjJbMF0gKiB2MlswXTtcbiAgICBRMlsxMF0gPSAxIC0gbXVsdDIgKiB2MlsxXSAqIHYyWzFdO1xuICAgIFEyWzZdID0gLW11bHQyICogdjJbMF0gKiB2MlsxXTtcbiAgICBRMls5XSA9IFEyWzZdO1xuICAgIHZhciBRID0gVHJhbnNmb3JtLm11bHRpcGx5KFEyLCBRMSk7XG4gICAgdmFyIFIgPSBUcmFuc2Zvcm0ubXVsdGlwbHkoUSwgTSk7XG4gICAgdmFyIHJlbW92ZXIgPSBUcmFuc2Zvcm0uc2NhbGUoUlswXSA8IDAgPyAtMSA6IDEsIFJbNV0gPCAwID8gLTEgOiAxLCBSWzEwXSA8IDAgPyAtMSA6IDEpO1xuICAgIFIgPSBUcmFuc2Zvcm0ubXVsdGlwbHkoUiwgcmVtb3Zlcik7XG4gICAgUSA9IFRyYW5zZm9ybS5tdWx0aXBseShyZW1vdmVyLCBRKTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnRyYW5zbGF0ZSA9IFRyYW5zZm9ybS5nZXRUcmFuc2xhdGUoTSk7XG4gICAgcmVzdWx0LnJvdGF0ZSA9IFtcbiAgICAgICAgTWF0aC5hdGFuMigtUVs2XSwgUVsxMF0pLFxuICAgICAgICBNYXRoLmFzaW4oUVsyXSksXG4gICAgICAgIE1hdGguYXRhbjIoLVFbMV0sIFFbMF0pXG4gICAgXTtcbiAgICBpZiAoIXJlc3VsdC5yb3RhdGVbMF0pIHtcbiAgICAgICAgcmVzdWx0LnJvdGF0ZVswXSA9IDA7XG4gICAgICAgIHJlc3VsdC5yb3RhdGVbMl0gPSBNYXRoLmF0YW4yKFFbNF0sIFFbNV0pO1xuICAgIH1cbiAgICByZXN1bHQuc2NhbGUgPSBbXG4gICAgICAgIFJbMF0sXG4gICAgICAgIFJbNV0sXG4gICAgICAgIFJbMTBdXG4gICAgXTtcbiAgICByZXN1bHQuc2tldyA9IFtcbiAgICAgICAgTWF0aC5hdGFuMihSWzldLCByZXN1bHQuc2NhbGVbMl0pLFxuICAgICAgICBNYXRoLmF0YW4yKFJbOF0sIHJlc3VsdC5zY2FsZVsyXSksXG4gICAgICAgIE1hdGguYXRhbjIoUls0XSwgcmVzdWx0LnNjYWxlWzBdKVxuICAgIF07XG4gICAgaWYgKE1hdGguYWJzKHJlc3VsdC5yb3RhdGVbMF0pICsgTWF0aC5hYnMocmVzdWx0LnJvdGF0ZVsyXSkgPiAxLjUgKiBNYXRoLlBJKSB7XG4gICAgICAgIHJlc3VsdC5yb3RhdGVbMV0gPSBNYXRoLlBJIC0gcmVzdWx0LnJvdGF0ZVsxXTtcbiAgICAgICAgaWYgKHJlc3VsdC5yb3RhdGVbMV0gPiBNYXRoLlBJKVxuICAgICAgICAgICAgcmVzdWx0LnJvdGF0ZVsxXSAtPSAyICogTWF0aC5QSTtcbiAgICAgICAgaWYgKHJlc3VsdC5yb3RhdGVbMV0gPCAtTWF0aC5QSSlcbiAgICAgICAgICAgIHJlc3VsdC5yb3RhdGVbMV0gKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIGlmIChyZXN1bHQucm90YXRlWzBdIDwgMClcbiAgICAgICAgICAgIHJlc3VsdC5yb3RhdGVbMF0gKz0gTWF0aC5QSTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzdWx0LnJvdGF0ZVswXSAtPSBNYXRoLlBJO1xuICAgICAgICBpZiAocmVzdWx0LnJvdGF0ZVsyXSA8IDApXG4gICAgICAgICAgICByZXN1bHQucm90YXRlWzJdICs9IE1hdGguUEk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3VsdC5yb3RhdGVbMl0gLT0gTWF0aC5QSTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5UcmFuc2Zvcm0uYXZlcmFnZSA9IGZ1bmN0aW9uIGF2ZXJhZ2UoTTEsIE0yLCB0KSB7XG4gICAgdCA9IHQgPT09IHVuZGVmaW5lZCA/IDAuNSA6IHQ7XG4gICAgdmFyIHNwZWNNMSA9IFRyYW5zZm9ybS5pbnRlcnByZXQoTTEpO1xuICAgIHZhciBzcGVjTTIgPSBUcmFuc2Zvcm0uaW50ZXJwcmV0KE0yKTtcbiAgICB2YXIgc3BlY0F2ZyA9IHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcm90YXRlOiBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzY2FsZTogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc2tldzogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgc3BlY0F2Zy50cmFuc2xhdGVbaV0gPSAoMSAtIHQpICogc3BlY00xLnRyYW5zbGF0ZVtpXSArIHQgKiBzcGVjTTIudHJhbnNsYXRlW2ldO1xuICAgICAgICBzcGVjQXZnLnJvdGF0ZVtpXSA9ICgxIC0gdCkgKiBzcGVjTTEucm90YXRlW2ldICsgdCAqIHNwZWNNMi5yb3RhdGVbaV07XG4gICAgICAgIHNwZWNBdmcuc2NhbGVbaV0gPSAoMSAtIHQpICogc3BlY00xLnNjYWxlW2ldICsgdCAqIHNwZWNNMi5zY2FsZVtpXTtcbiAgICAgICAgc3BlY0F2Zy5za2V3W2ldID0gKDEgLSB0KSAqIHNwZWNNMS5za2V3W2ldICsgdCAqIHNwZWNNMi5za2V3W2ldO1xuICAgIH1cbiAgICByZXR1cm4gVHJhbnNmb3JtLmJ1aWxkKHNwZWNBdmcpO1xufTtcblRyYW5zZm9ybS5idWlsZCA9IGZ1bmN0aW9uIGJ1aWxkKHNwZWMpIHtcbiAgICB2YXIgc2NhbGVNYXRyaXggPSBUcmFuc2Zvcm0uc2NhbGUoc3BlYy5zY2FsZVswXSwgc3BlYy5zY2FsZVsxXSwgc3BlYy5zY2FsZVsyXSk7XG4gICAgdmFyIHNrZXdNYXRyaXggPSBUcmFuc2Zvcm0uc2tldyhzcGVjLnNrZXdbMF0sIHNwZWMuc2tld1sxXSwgc3BlYy5za2V3WzJdKTtcbiAgICB2YXIgcm90YXRlTWF0cml4ID0gVHJhbnNmb3JtLnJvdGF0ZShzcGVjLnJvdGF0ZVswXSwgc3BlYy5yb3RhdGVbMV0sIHNwZWMucm90YXRlWzJdKTtcbiAgICByZXR1cm4gVHJhbnNmb3JtLnRoZW5Nb3ZlKFRyYW5zZm9ybS5tdWx0aXBseShUcmFuc2Zvcm0ubXVsdGlwbHkocm90YXRlTWF0cml4LCBza2V3TWF0cml4KSwgc2NhbGVNYXRyaXgpLCBzcGVjLnRyYW5zbGF0ZSk7XG59O1xuVHJhbnNmb3JtLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgcmV0dXJuICFUcmFuc2Zvcm0ubm90RXF1YWxzKGEsIGIpO1xufTtcblRyYW5zZm9ybS5ub3RFcXVhbHMgPSBmdW5jdGlvbiBub3RFcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBiKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuICEoYSAmJiBiKSB8fCBhWzEyXSAhPT0gYlsxMl0gfHwgYVsxM10gIT09IGJbMTNdIHx8IGFbMTRdICE9PSBiWzE0XSB8fCBhWzBdICE9PSBiWzBdIHx8IGFbMV0gIT09IGJbMV0gfHwgYVsyXSAhPT0gYlsyXSB8fCBhWzRdICE9PSBiWzRdIHx8IGFbNV0gIT09IGJbNV0gfHwgYVs2XSAhPT0gYls2XSB8fCBhWzhdICE9PSBiWzhdIHx8IGFbOV0gIT09IGJbOV0gfHwgYVsxMF0gIT09IGJbMTBdO1xufTtcblRyYW5zZm9ybS5ub3JtYWxpemVSb3RhdGlvbiA9IGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdGF0aW9uKHJvdGF0aW9uKSB7XG4gICAgdmFyIHJlc3VsdCA9IHJvdGF0aW9uLnNsaWNlKDApO1xuICAgIGlmIChyZXN1bHRbMF0gPT09IE1hdGguUEkgKiAwLjUgfHwgcmVzdWx0WzBdID09PSAtTWF0aC5QSSAqIDAuNSkge1xuICAgICAgICByZXN1bHRbMF0gPSAtcmVzdWx0WzBdO1xuICAgICAgICByZXN1bHRbMV0gPSBNYXRoLlBJIC0gcmVzdWx0WzFdO1xuICAgICAgICByZXN1bHRbMl0gLT0gTWF0aC5QSTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdFswXSA+IE1hdGguUEkgKiAwLjUpIHtcbiAgICAgICAgcmVzdWx0WzBdID0gcmVzdWx0WzBdIC0gTWF0aC5QSTtcbiAgICAgICAgcmVzdWx0WzFdID0gTWF0aC5QSSAtIHJlc3VsdFsxXTtcbiAgICAgICAgcmVzdWx0WzJdIC09IE1hdGguUEk7XG4gICAgfVxuICAgIGlmIChyZXN1bHRbMF0gPCAtTWF0aC5QSSAqIDAuNSkge1xuICAgICAgICByZXN1bHRbMF0gPSByZXN1bHRbMF0gKyBNYXRoLlBJO1xuICAgICAgICByZXN1bHRbMV0gPSAtTWF0aC5QSSAtIHJlc3VsdFsxXTtcbiAgICAgICAgcmVzdWx0WzJdIC09IE1hdGguUEk7XG4gICAgfVxuICAgIHdoaWxlIChyZXN1bHRbMV0gPCAtTWF0aC5QSSlcbiAgICAgICAgcmVzdWx0WzFdICs9IDIgKiBNYXRoLlBJO1xuICAgIHdoaWxlIChyZXN1bHRbMV0gPj0gTWF0aC5QSSlcbiAgICAgICAgcmVzdWx0WzFdIC09IDIgKiBNYXRoLlBJO1xuICAgIHdoaWxlIChyZXN1bHRbMl0gPCAtTWF0aC5QSSlcbiAgICAgICAgcmVzdWx0WzJdICs9IDIgKiBNYXRoLlBJO1xuICAgIHdoaWxlIChyZXN1bHRbMl0gPj0gTWF0aC5QSSlcbiAgICAgICAgcmVzdWx0WzJdIC09IDIgKiBNYXRoLlBJO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuVHJhbnNmb3JtLmluRnJvbnQgPSBbXG4gICAgMSxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDEsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAxLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAuMDAxLFxuICAgIDFcbl07XG5UcmFuc2Zvcm0uYmVoaW5kID0gW1xuICAgIDEsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAxLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMSxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAtMC4wMDEsXG4gICAgMVxuXTtcbm1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtOyIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuL0V2ZW50SGFuZGxlcicpO1xudmFyIE9wdGlvbnNNYW5hZ2VyID0gcmVxdWlyZSgnLi9PcHRpb25zTWFuYWdlcicpO1xudmFyIFJlbmRlck5vZGUgPSByZXF1aXJlKCcuL1JlbmRlck5vZGUnKTtcbnZhciBVdGlsaXR5ID0gcmVxdWlyZSgnZmFtb3VzL3V0aWxpdGllcy9VdGlsaXR5Jyk7XG5mdW5jdGlvbiBWaWV3KG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ub2RlID0gbmV3IFJlbmRlck5vZGUoKTtcbiAgICB0aGlzLl9ldmVudElucHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRJbnB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRJbnB1dCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xuICAgIHRoaXMub3B0aW9ucyA9IFV0aWxpdHkuY2xvbmUodGhpcy5jb25zdHJ1Y3Rvci5ERUZBVUxUX09QVElPTlMgfHwgVmlldy5ERUZBVUxUX09QVElPTlMpO1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn1cblZpZXcuREVGQVVMVF9PUFRJT05TID0ge307XG5WaWV3LnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc01hbmFnZXIudmFsdWUoKTtcbn07XG5WaWV3LnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9uc01hbmFnZXIucGF0Y2gob3B0aW9ucyk7XG59O1xuVmlldy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlLmFkZC5hcHBseSh0aGlzLl9ub2RlLCBhcmd1bWVudHMpO1xufTtcblZpZXcucHJvdG90eXBlLl9hZGQgPSBWaWV3LnByb3RvdHlwZS5hZGQ7XG5WaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGUucmVuZGVyKCk7XG59O1xuVmlldy5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uIGdldFNpemUoKSB7XG4gICAgaWYgKHRoaXMuX25vZGUgJiYgdGhpcy5fbm9kZS5nZXRTaXplKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlLmdldFNpemUuYXBwbHkodGhpcy5fbm9kZSwgYXJndW1lbnRzKSB8fCB0aGlzLm9wdGlvbnMuc2l6ZTtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zaXplO1xufTtcbm1vZHVsZS5leHBvcnRzID0gVmlldzsiLCJmdW5jdGlvbiBWaWV3U2VxdWVuY2Uob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucylcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgIGlmIChvcHRpb25zIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIG9wdGlvbnMgPSB7IGFycmF5OiBvcHRpb25zIH07XG4gICAgdGhpcy5fID0gbnVsbDtcbiAgICB0aGlzLmluZGV4ID0gb3B0aW9ucy5pbmRleCB8fCAwO1xuICAgIGlmIChvcHRpb25zLmFycmF5KVxuICAgICAgICB0aGlzLl8gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvci5CYWNraW5nKG9wdGlvbnMuYXJyYXkpO1xuICAgIGVsc2UgaWYgKG9wdGlvbnMuXylcbiAgICAgICAgdGhpcy5fID0gb3B0aW9ucy5fO1xuICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLl8uZmlyc3RJbmRleClcbiAgICAgICAgdGhpcy5fLmZpcnN0Tm9kZSA9IHRoaXM7XG4gICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuXy5maXJzdEluZGV4ICsgdGhpcy5fLmFycmF5Lmxlbmd0aCAtIDEpXG4gICAgICAgIHRoaXMuXy5sYXN0Tm9kZSA9IHRoaXM7XG4gICAgaWYgKG9wdGlvbnMubG9vcCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLl8ubG9vcCA9IG9wdGlvbnMubG9vcDtcbiAgICB0aGlzLl9wcmV2aW91c05vZGUgPSBudWxsO1xuICAgIHRoaXMuX25leHROb2RlID0gbnVsbDtcbn1cblZpZXdTZXF1ZW5jZS5CYWNraW5nID0gZnVuY3Rpb24gQmFja2luZyhhcnJheSkge1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbiAgICB0aGlzLmZpcnN0SW5kZXggPSAwO1xuICAgIHRoaXMubG9vcCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyc3ROb2RlID0gbnVsbDtcbiAgICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcbn07XG5WaWV3U2VxdWVuY2UuQmFja2luZy5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiBnZXRWYWx1ZShpKSB7XG4gICAgdmFyIF9pID0gaSAtIHRoaXMuZmlyc3RJbmRleDtcbiAgICBpZiAoX2kgPCAwIHx8IF9pID49IHRoaXMuYXJyYXkubGVuZ3RoKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5hcnJheVtfaV07XG59O1xuVmlld1NlcXVlbmNlLkJhY2tpbmcucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gc2V0VmFsdWUoaSwgdmFsdWUpIHtcbiAgICB0aGlzLmFycmF5W2kgLSB0aGlzLmZpcnN0SW5kZXhdID0gdmFsdWU7XG59O1xuVmlld1NlcXVlbmNlLkJhY2tpbmcucHJvdG90eXBlLnJlaW5kZXggPSBmdW5jdGlvbiByZWluZGV4KHN0YXJ0LCByZW1vdmVDb3VudCwgaW5zZXJ0Q291bnQpIHtcbiAgICBpZiAoIXRoaXMuYXJyYXlbMF0pXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5maXJzdEluZGV4O1xuICAgIHZhciBpbmRleFNoaWZ0QW1vdW50ID0gaW5zZXJ0Q291bnQgLSByZW1vdmVDb3VudDtcbiAgICB2YXIgbm9kZSA9IHRoaXMuZmlyc3ROb2RlO1xuICAgIHdoaWxlIChpbmRleCA8IHN0YXJ0IC0gMSkge1xuICAgICAgICBub2RlID0gbm9kZS5nZXROZXh0KCk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHZhciBzcGxpY2VTdGFydE5vZGUgPSBub2RlO1xuICAgIGZvciAoaSA9IDA7IGkgPCByZW1vdmVDb3VudDsgaSsrKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldE5leHQoKTtcbiAgICAgICAgaWYgKG5vZGUpXG4gICAgICAgICAgICBub2RlLl9wcmV2aW91c05vZGUgPSBzcGxpY2VTdGFydE5vZGU7XG4gICAgfVxuICAgIHZhciBzcGxpY2VSZXN1bWVOb2RlID0gbm9kZSA/IG5vZGUuZ2V0TmV4dCgpIDogbnVsbDtcbiAgICBzcGxpY2VTdGFydE5vZGUuX25leHROb2RlID0gbnVsbDtcbiAgICBub2RlID0gc3BsaWNlU3RhcnROb2RlO1xuICAgIGZvciAoaSA9IDA7IGkgPCBpbnNlcnRDb3VudDsgaSsrKVxuICAgICAgICBub2RlID0gbm9kZS5nZXROZXh0KCk7XG4gICAgaW5kZXggKz0gaW5zZXJ0Q291bnQ7XG4gICAgaWYgKG5vZGUgIT09IHNwbGljZVJlc3VtZU5vZGUpIHtcbiAgICAgICAgbm9kZS5fbmV4dE5vZGUgPSBzcGxpY2VSZXN1bWVOb2RlO1xuICAgICAgICBpZiAoc3BsaWNlUmVzdW1lTm9kZSlcbiAgICAgICAgICAgIHNwbGljZVJlc3VtZU5vZGUuX3ByZXZpb3VzTm9kZSA9IG5vZGU7XG4gICAgfVxuICAgIGlmIChzcGxpY2VSZXN1bWVOb2RlKSB7XG4gICAgICAgIG5vZGUgPSBzcGxpY2VSZXN1bWVOb2RlO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICB3aGlsZSAobm9kZSAmJiBpbmRleCA8IHRoaXMuYXJyYXkubGVuZ3RoICsgdGhpcy5maXJzdEluZGV4KSB7XG4gICAgICAgICAgICBpZiAobm9kZS5fbmV4dE5vZGUpXG4gICAgICAgICAgICAgICAgbm9kZS5pbmRleCArPSBpbmRleFNoaWZ0QW1vdW50O1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG5vZGUuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmdldE5leHQoKTtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cbiAgICB9XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS5nZXRQcmV2aW91cyA9IGZ1bmN0aW9uIGdldFByZXZpb3VzKCkge1xuICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLl8uZmlyc3RJbmRleCkge1xuICAgICAgICBpZiAodGhpcy5fLmxvb3ApIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzTm9kZSA9IHRoaXMuXy5sYXN0Tm9kZSB8fCBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICAgICAgICAgICAgXzogdGhpcy5fLFxuICAgICAgICAgICAgICAgIGluZGV4OiB0aGlzLl8uZmlyc3RJbmRleCArIHRoaXMuXy5hcnJheS5sZW5ndGggLSAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzTm9kZS5fbmV4dE5vZGUgPSB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3ByZXZpb3VzTm9kZSkge1xuICAgICAgICB0aGlzLl9wcmV2aW91c05vZGUgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICAgICAgICBfOiB0aGlzLl8sXG4gICAgICAgICAgICBpbmRleDogdGhpcy5pbmRleCAtIDFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzTm9kZS5fbmV4dE5vZGUgPSB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNOb2RlO1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUuZ2V0TmV4dCA9IGZ1bmN0aW9uIGdldE5leHQoKSB7XG4gICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuXy5maXJzdEluZGV4ICsgdGhpcy5fLmFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaWYgKHRoaXMuXy5sb29wKSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0Tm9kZSA9IHRoaXMuXy5maXJzdE5vZGUgfHwgbmV3IHRoaXMuY29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgICAgIF86IHRoaXMuXyxcbiAgICAgICAgICAgICAgICBpbmRleDogdGhpcy5fLmZpcnN0SW5kZXhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fbmV4dE5vZGUuX3ByZXZpb3VzTm9kZSA9IHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0Tm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9uZXh0Tm9kZSkge1xuICAgICAgICB0aGlzLl9uZXh0Tm9kZSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgIF86IHRoaXMuXyxcbiAgICAgICAgICAgIGluZGV4OiB0aGlzLmluZGV4ICsgMVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbmV4dE5vZGUuX3ByZXZpb3VzTm9kZSA9IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uZXh0Tm9kZTtcbn07XG5WaWV3U2VxdWVuY2UucHJvdG90eXBlLmdldEluZGV4ID0gZnVuY3Rpb24gZ2V0SW5kZXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZXg7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuaW5kZXg7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24gdW5zaGlmdCh2YWx1ZSkge1xuICAgIHRoaXMuXy5hcnJheS51bnNoaWZ0LmFwcGx5KHRoaXMuXy5hcnJheSwgYXJndW1lbnRzKTtcbiAgICB0aGlzLl8uZmlyc3RJbmRleCAtPSBhcmd1bWVudHMubGVuZ3RoO1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2godmFsdWUpIHtcbiAgICB0aGlzLl8uYXJyYXkucHVzaC5hcHBseSh0aGlzLl8uYXJyYXksIGFyZ3VtZW50cyk7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS5zcGxpY2UgPSBmdW5jdGlvbiBzcGxpY2UoaW5kZXgsIGhvd01hbnkpIHtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB0aGlzLl8uYXJyYXkuc3BsaWNlLmFwcGx5KHRoaXMuXy5hcnJheSwgW1xuICAgICAgICBpbmRleCAtIHRoaXMuXy5maXJzdEluZGV4LFxuICAgICAgICBob3dNYW55XG4gICAgXS5jb25jYXQodmFsdWVzKSk7XG4gICAgdGhpcy5fLnJlaW5kZXgoaW5kZXgsIGhvd01hbnksIHZhbHVlcy5sZW5ndGgpO1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uIHN3YXAob3RoZXIpIHtcbiAgICB2YXIgb3RoZXJWYWx1ZSA9IG90aGVyLmdldCgpO1xuICAgIHZhciBteVZhbHVlID0gdGhpcy5nZXQoKTtcbiAgICB0aGlzLl8uc2V0VmFsdWUodGhpcy5pbmRleCwgb3RoZXJWYWx1ZSk7XG4gICAgdGhpcy5fLnNldFZhbHVlKG90aGVyLmluZGV4LCBteVZhbHVlKTtcbiAgICB2YXIgbXlQcmV2aW91cyA9IHRoaXMuX3ByZXZpb3VzTm9kZTtcbiAgICB2YXIgbXlOZXh0ID0gdGhpcy5fbmV4dE5vZGU7XG4gICAgdmFyIG15SW5kZXggPSB0aGlzLmluZGV4O1xuICAgIHZhciBvdGhlclByZXZpb3VzID0gb3RoZXIuX3ByZXZpb3VzTm9kZTtcbiAgICB2YXIgb3RoZXJOZXh0ID0gb3RoZXIuX25leHROb2RlO1xuICAgIHZhciBvdGhlckluZGV4ID0gb3RoZXIuaW5kZXg7XG4gICAgdGhpcy5pbmRleCA9IG90aGVySW5kZXg7XG4gICAgdGhpcy5fcHJldmlvdXNOb2RlID0gb3RoZXJQcmV2aW91cyA9PT0gdGhpcyA/IG90aGVyIDogb3RoZXJQcmV2aW91cztcbiAgICBpZiAodGhpcy5fcHJldmlvdXNOb2RlKVxuICAgICAgICB0aGlzLl9wcmV2aW91c05vZGUuX25leHROb2RlID0gdGhpcztcbiAgICB0aGlzLl9uZXh0Tm9kZSA9IG90aGVyTmV4dCA9PT0gdGhpcyA/IG90aGVyIDogb3RoZXJOZXh0O1xuICAgIGlmICh0aGlzLl9uZXh0Tm9kZSlcbiAgICAgICAgdGhpcy5fbmV4dE5vZGUuX3ByZXZpb3VzTm9kZSA9IHRoaXM7XG4gICAgb3RoZXIuaW5kZXggPSBteUluZGV4O1xuICAgIG90aGVyLl9wcmV2aW91c05vZGUgPSBteVByZXZpb3VzID09PSBvdGhlciA/IHRoaXMgOiBteVByZXZpb3VzO1xuICAgIGlmIChvdGhlci5fcHJldmlvdXNOb2RlKVxuICAgICAgICBvdGhlci5fcHJldmlvdXNOb2RlLl9uZXh0Tm9kZSA9IG90aGVyO1xuICAgIG90aGVyLl9uZXh0Tm9kZSA9IG15TmV4dCA9PT0gb3RoZXIgPyB0aGlzIDogbXlOZXh0O1xuICAgIGlmIChvdGhlci5fbmV4dE5vZGUpXG4gICAgICAgIG90aGVyLl9uZXh0Tm9kZS5fcHJldmlvdXNOb2RlID0gb3RoZXI7XG4gICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuXy5maXJzdEluZGV4KVxuICAgICAgICB0aGlzLl8uZmlyc3ROb2RlID0gdGhpcztcbiAgICBlbHNlIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLl8uZmlyc3RJbmRleCArIHRoaXMuXy5hcnJheS5sZW5ndGggLSAxKVxuICAgICAgICB0aGlzLl8ubGFzdE5vZGUgPSB0aGlzO1xuICAgIGlmIChvdGhlci5pbmRleCA9PT0gdGhpcy5fLmZpcnN0SW5kZXgpXG4gICAgICAgIHRoaXMuXy5maXJzdE5vZGUgPSBvdGhlcjtcbiAgICBlbHNlIGlmIChvdGhlci5pbmRleCA9PT0gdGhpcy5fLmZpcnN0SW5kZXggKyB0aGlzLl8uYXJyYXkubGVuZ3RoIC0gMSlcbiAgICAgICAgdGhpcy5fLmxhc3ROb2RlID0gb3RoZXI7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuXy5nZXRWYWx1ZSh0aGlzLmluZGV4KTtcbn07XG5WaWV3U2VxdWVuY2UucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldCgpO1xuICAgIHJldHVybiB0YXJnZXQgPyB0YXJnZXQuZ2V0U2l6ZSgpIDogbnVsbDtcbn07XG5WaWV3U2VxdWVuY2UucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXQoKTtcbiAgICByZXR1cm4gdGFyZ2V0ID8gdGFyZ2V0LnJlbmRlci5hcHBseSh0YXJnZXQsIGFyZ3VtZW50cykgOiBudWxsO1xufTtcbm1vZHVsZS5leHBvcnRzID0gVmlld1NlcXVlbmNlOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF3aW5kb3cuQ3VzdG9tRXZlbnQpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgY2xpY2tUaHJlc2hvbGQgPSAzMDA7XG4gICAgdmFyIGNsaWNrV2luZG93ID0gNTAwO1xuICAgIHZhciBwb3RlbnRpYWxDbGlja3MgPSB7fTtcbiAgICB2YXIgcmVjZW50bHlEaXNwYXRjaGVkID0ge307XG4gICAgdmFyIF9ub3cgPSBEYXRlLm5vdztcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgdGltZXN0YW1wID0gX25vdygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1tpXTtcbiAgICAgICAgICAgIHBvdGVudGlhbENsaWNrc1t0b3VjaC5pZGVudGlmaWVyXSA9IHRpbWVzdGFtcDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgICAgICBkZWxldGUgcG90ZW50aWFsQ2xpY2tzW3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IF9ub3coKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgICAgICB2YXIgc3RhcnRUaW1lID0gcG90ZW50aWFsQ2xpY2tzW3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgICAgICAgaWYgKHN0YXJ0VGltZSAmJiBjdXJyVGltZSAtIHN0YXJ0VGltZSA8IGNsaWNrVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrRXZ0ID0gbmV3IHdpbmRvdy5DdXN0b21FdmVudCgnY2xpY2snLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYnViYmxlcyc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGV0YWlsJzogdG91Y2hcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmVjZW50bHlEaXNwYXRjaGVkW2N1cnJUaW1lXSA9IGV2ZW50O1xuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNwYXRjaEV2ZW50KGNsaWNrRXZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBwb3RlbnRpYWxDbGlja3NbdG91Y2guaWRlbnRpZmllcl07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gX25vdygpO1xuICAgICAgICBmb3IgKHZhciBpIGluIHJlY2VudGx5RGlzcGF0Y2hlZCkge1xuICAgICAgICAgICAgdmFyIHByZXZpb3VzRXZlbnQgPSByZWNlbnRseURpc3BhdGNoZWRbaV07XG4gICAgICAgICAgICBpZiAoY3VyclRpbWUgLSBpIDwgY2xpY2tXaW5kb3cpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiB3aW5kb3cuTW91c2VFdmVudCAmJiBldmVudC50YXJnZXQgPT09IHByZXZpb3VzRXZlbnQudGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIGRlbGV0ZSByZWNlbnRseURpc3BhdGNoZWRbaV07XG4gICAgICAgIH1cbiAgICB9LCB0cnVlKTtcbn0oKSk7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4uL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG5mdW5jdGlvbiBHZW5lcmljU3luYyhzeW5jcywgb3B0aW9ucykge1xuICAgIHRoaXMuX2V2ZW50SW5wdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldElucHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudElucHV0KTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudE91dHB1dCk7XG4gICAgdGhpcy5fc3luY3MgPSB7fTtcbiAgICBpZiAoc3luY3MpXG4gICAgICAgIHRoaXMuYWRkU3luYyhzeW5jcyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn1cbkdlbmVyaWNTeW5jLkRJUkVDVElPTl9YID0gMDtcbkdlbmVyaWNTeW5jLkRJUkVDVElPTl9ZID0gMTtcbkdlbmVyaWNTeW5jLkRJUkVDVElPTl9aID0gMjtcbnZhciByZWdpc3RyeSA9IHt9O1xuR2VuZXJpY1N5bmMucmVnaXN0ZXIgPSBmdW5jdGlvbiByZWdpc3RlcihzeW5jT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHN5bmNPYmplY3QpIHtcbiAgICAgICAgaWYgKHJlZ2lzdHJ5W2tleV0pIHtcbiAgICAgICAgICAgIGlmIChyZWdpc3RyeVtrZXldID09PSBzeW5jT2JqZWN0W2tleV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhpcyBrZXkgaXMgcmVnaXN0ZXJlZCB0byBhIGRpZmZlcmVudCBzeW5jIGNsYXNzJyk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmVnaXN0cnlba2V5XSA9IHN5bmNPYmplY3Rba2V5XTtcbiAgICB9XG59O1xuR2VuZXJpY1N5bmMucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9zeW5jcykge1xuICAgICAgICB0aGlzLl9zeW5jc1trZXldLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxufTtcbkdlbmVyaWNTeW5jLnByb3RvdHlwZS5waXBlU3luYyA9IGZ1bmN0aW9uIHBpcGVUb1N5bmMoa2V5KSB7XG4gICAgdmFyIHN5bmMgPSB0aGlzLl9zeW5jc1trZXldO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQucGlwZShzeW5jKTtcbiAgICBzeW5jLnBpcGUodGhpcy5fZXZlbnRPdXRwdXQpO1xufTtcbkdlbmVyaWNTeW5jLnByb3RvdHlwZS51bnBpcGVTeW5jID0gZnVuY3Rpb24gdW5waXBlRnJvbVN5bmMoa2V5KSB7XG4gICAgdmFyIHN5bmMgPSB0aGlzLl9zeW5jc1trZXldO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQudW5waXBlKHN5bmMpO1xuICAgIHN5bmMudW5waXBlKHRoaXMuX2V2ZW50T3V0cHV0KTtcbn07XG5mdW5jdGlvbiBfYWRkU2luZ2xlU3luYyhrZXksIG9wdGlvbnMpIHtcbiAgICBpZiAoIXJlZ2lzdHJ5W2tleV0pXG4gICAgICAgIHJldHVybjtcbiAgICB0aGlzLl9zeW5jc1trZXldID0gbmV3IHJlZ2lzdHJ5W2tleV0ob3B0aW9ucyk7XG4gICAgdGhpcy5waXBlU3luYyhrZXkpO1xufVxuR2VuZXJpY1N5bmMucHJvdG90eXBlLmFkZFN5bmMgPSBmdW5jdGlvbiBhZGRTeW5jKHN5bmNzKSB7XG4gICAgaWYgKHN5bmNzIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3luY3MubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBfYWRkU2luZ2xlU3luYy5jYWxsKHRoaXMsIHN5bmNzW2ldKTtcbiAgICBlbHNlIGlmIChzeW5jcyBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHN5bmNzKVxuICAgICAgICAgICAgX2FkZFNpbmdsZVN5bmMuY2FsbCh0aGlzLCBrZXksIHN5bmNzW2tleV0pO1xufTtcbm1vZHVsZS5leHBvcnRzID0gR2VuZXJpY1N5bmM7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4uL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG52YXIgT3B0aW9uc01hbmFnZXIgPSByZXF1aXJlKCcuLi9jb3JlL09wdGlvbnNNYW5hZ2VyJyk7XG5mdW5jdGlvbiBNb3VzZVN5bmMob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoTW91c2VTeW5jLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgdGhpcy5fb3B0aW9uc01hbmFnZXIgPSBuZXcgT3B0aW9uc01hbmFnZXIodGhpcy5vcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldElucHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudElucHV0KTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudE91dHB1dCk7XG4gICAgdGhpcy5fZXZlbnRJbnB1dC5vbignbW91c2Vkb3duJywgX2hhbmRsZVN0YXJ0LmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQub24oJ21vdXNlbW92ZScsIF9oYW5kbGVNb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQub24oJ21vdXNldXAnLCBfaGFuZGxlRW5kLmJpbmQodGhpcykpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMucHJvcG9nYXRlKVxuICAgICAgICB0aGlzLl9ldmVudElucHV0Lm9uKCdtb3VzZWxlYXZlJywgX2hhbmRsZUxlYXZlLmJpbmQodGhpcykpO1xuICAgIGVsc2VcbiAgICAgICAgdGhpcy5fZXZlbnRJbnB1dC5vbignbW91c2VsZWF2ZScsIF9oYW5kbGVFbmQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fcGF5bG9hZCA9IHtcbiAgICAgICAgZGVsdGE6IG51bGwsXG4gICAgICAgIHBvc2l0aW9uOiBudWxsLFxuICAgICAgICB2ZWxvY2l0eTogbnVsbCxcbiAgICAgICAgY2xpZW50WDogMCxcbiAgICAgICAgY2xpZW50WTogMCxcbiAgICAgICAgb2Zmc2V0WDogMCxcbiAgICAgICAgb2Zmc2V0WTogMFxuICAgIH07XG4gICAgdGhpcy5fcG9zaXRpb24gPSBudWxsO1xuICAgIHRoaXMuX3ByZXZDb29yZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wcmV2VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9kb3duID0gZmFsc2U7XG4gICAgdGhpcy5fbW92ZWQgPSBmYWxzZTtcbn1cbk1vdXNlU3luYy5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgZGlyZWN0aW9uOiB1bmRlZmluZWQsXG4gICAgcmFpbHM6IGZhbHNlLFxuICAgIHNjYWxlOiAxLFxuICAgIHByb3BvZ2F0ZTogdHJ1ZSxcbiAgICBwcmV2ZW50RGVmYXVsdDogdHJ1ZVxufTtcbk1vdXNlU3luYy5ESVJFQ1RJT05fWCA9IDA7XG5Nb3VzZVN5bmMuRElSRUNUSU9OX1kgPSAxO1xudmFyIE1JTklNVU1fVElDS19USU1FID0gODtcbnZhciBfbm93ID0gRGF0ZS5ub3c7XG5mdW5jdGlvbiBfaGFuZGxlU3RhcnQoZXZlbnQpIHtcbiAgICB2YXIgZGVsdGE7XG4gICAgdmFyIHZlbG9jaXR5O1xuICAgIGlmICh0aGlzLm9wdGlvbnMucHJldmVudERlZmF1bHQpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHggPSBldmVudC5jbGllbnRYO1xuICAgIHZhciB5ID0gZXZlbnQuY2xpZW50WTtcbiAgICB0aGlzLl9wcmV2Q29vcmQgPSBbXG4gICAgICAgIHgsXG4gICAgICAgIHlcbiAgICBdO1xuICAgIHRoaXMuX3ByZXZUaW1lID0gX25vdygpO1xuICAgIHRoaXMuX2Rvd24gPSB0cnVlO1xuICAgIHRoaXMuX21vdmUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgZGVsdGEgPSAwO1xuICAgICAgICB2ZWxvY2l0eSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdO1xuICAgICAgICBkZWx0YSA9IFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF07XG4gICAgICAgIHZlbG9jaXR5ID0gW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXTtcbiAgICB9XG4gICAgdmFyIHBheWxvYWQgPSB0aGlzLl9wYXlsb2FkO1xuICAgIHBheWxvYWQuZGVsdGEgPSBkZWx0YTtcbiAgICBwYXlsb2FkLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb247XG4gICAgcGF5bG9hZC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgIHBheWxvYWQuY2xpZW50WCA9IHg7XG4gICAgcGF5bG9hZC5jbGllbnRZID0geTtcbiAgICBwYXlsb2FkLm9mZnNldFggPSBldmVudC5vZmZzZXRYO1xuICAgIHBheWxvYWQub2Zmc2V0WSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnc3RhcnQnLCBwYXlsb2FkKTtcbn1cbmZ1bmN0aW9uIF9oYW5kbGVNb3ZlKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9wcmV2Q29vcmQpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgcHJldkNvb3JkID0gdGhpcy5fcHJldkNvb3JkO1xuICAgIHZhciBwcmV2VGltZSA9IHRoaXMuX3ByZXZUaW1lO1xuICAgIHZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICB2YXIgeSA9IGV2ZW50LmNsaWVudFk7XG4gICAgdmFyIGN1cnJUaW1lID0gX25vdygpO1xuICAgIHZhciBkaWZmWCA9IHggLSBwcmV2Q29vcmRbMF07XG4gICAgdmFyIGRpZmZZID0geSAtIHByZXZDb29yZFsxXTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnJhaWxzKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPiBNYXRoLmFicyhkaWZmWSkpXG4gICAgICAgICAgICBkaWZmWSA9IDA7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRpZmZYID0gMDtcbiAgICB9XG4gICAgdmFyIGRpZmZUaW1lID0gTWF0aC5tYXgoY3VyclRpbWUgLSBwcmV2VGltZSwgTUlOSU1VTV9USUNLX1RJTUUpO1xuICAgIHZhciB2ZWxYID0gZGlmZlggLyBkaWZmVGltZTtcbiAgICB2YXIgdmVsWSA9IGRpZmZZIC8gZGlmZlRpbWU7XG4gICAgdmFyIHNjYWxlID0gdGhpcy5vcHRpb25zLnNjYWxlO1xuICAgIHZhciBuZXh0VmVsO1xuICAgIHZhciBuZXh0RGVsdGE7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IE1vdXNlU3luYy5ESVJFQ1RJT05fWCkge1xuICAgICAgICBuZXh0RGVsdGEgPSBzY2FsZSAqIGRpZmZYO1xuICAgICAgICBuZXh0VmVsID0gc2NhbGUgKiB2ZWxYO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiArPSBuZXh0RGVsdGE7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSBNb3VzZVN5bmMuRElSRUNUSU9OX1kpIHtcbiAgICAgICAgbmV4dERlbHRhID0gc2NhbGUgKiBkaWZmWTtcbiAgICAgICAgbmV4dFZlbCA9IHNjYWxlICogdmVsWTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gKz0gbmV4dERlbHRhO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHREZWx0YSA9IFtcbiAgICAgICAgICAgIHNjYWxlICogZGlmZlgsXG4gICAgICAgICAgICBzY2FsZSAqIGRpZmZZXG4gICAgICAgIF07XG4gICAgICAgIG5leHRWZWwgPSBbXG4gICAgICAgICAgICBzY2FsZSAqIHZlbFgsXG4gICAgICAgICAgICBzY2FsZSAqIHZlbFlcbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25bMF0gKz0gbmV4dERlbHRhWzBdO1xuICAgICAgICB0aGlzLl9wb3NpdGlvblsxXSArPSBuZXh0RGVsdGFbMV07XG4gICAgfVxuICAgIHZhciBwYXlsb2FkID0gdGhpcy5fcGF5bG9hZDtcbiAgICBwYXlsb2FkLmRlbHRhID0gbmV4dERlbHRhO1xuICAgIHBheWxvYWQucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbjtcbiAgICBwYXlsb2FkLnZlbG9jaXR5ID0gbmV4dFZlbDtcbiAgICBwYXlsb2FkLmNsaWVudFggPSB4O1xuICAgIHBheWxvYWQuY2xpZW50WSA9IHk7XG4gICAgcGF5bG9hZC5vZmZzZXRYID0gZXZlbnQub2Zmc2V0WDtcbiAgICBwYXlsb2FkLm9mZnNldFkgPSBldmVudC5vZmZzZXRZO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ3VwZGF0ZScsIHBheWxvYWQpO1xuICAgIHRoaXMuX3ByZXZDb29yZCA9IFtcbiAgICAgICAgeCxcbiAgICAgICAgeVxuICAgIF07XG4gICAgdGhpcy5fcHJldlRpbWUgPSBjdXJyVGltZTtcbiAgICB0aGlzLl9tb3ZlID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIF9oYW5kbGVFbmQoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX2Rvd24pXG4gICAgICAgIHJldHVybjtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdlbmQnLCB0aGlzLl9wYXlsb2FkKTtcbiAgICB0aGlzLl9wcmV2Q29vcmQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcHJldlRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZG93biA9IGZhbHNlO1xuICAgIHRoaXMuX21vdmUgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIF9oYW5kbGVMZWF2ZShldmVudCkge1xuICAgIGlmICghdGhpcy5fZG93biB8fCAhdGhpcy5fbW92ZSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciBib3VuZE1vdmUgPSBfaGFuZGxlTW92ZS5iaW5kKHRoaXMpO1xuICAgIHZhciBib3VuZEVuZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX2hhbmRsZUVuZC5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGJvdW5kTW92ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgYm91bmRFbmQpO1xuICAgICAgICB9LmJpbmQodGhpcywgZXZlbnQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGJvdW5kTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGJvdW5kRW5kKTtcbn1cbk1vdXNlU3luYy5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbn07XG5Nb3VzZVN5bmMucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc01hbmFnZXIuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1vdXNlU3luYzsiLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnLi4vY29yZS9FdmVudEhhbmRsZXInKTtcbnZhciBFbmdpbmUgPSByZXF1aXJlKCcuLi9jb3JlL0VuZ2luZScpO1xudmFyIE9wdGlvbnNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29yZS9PcHRpb25zTWFuYWdlcicpO1xuZnVuY3Rpb24gU2Nyb2xsU3luYyhvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZShTY3JvbGxTeW5jLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgdGhpcy5fb3B0aW9uc01hbmFnZXIgPSBuZXcgT3B0aW9uc01hbmFnZXIodGhpcy5vcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX3BheWxvYWQgPSB7XG4gICAgICAgIGRlbHRhOiBudWxsLFxuICAgICAgICBwb3NpdGlvbjogbnVsbCxcbiAgICAgICAgdmVsb2NpdHk6IG51bGwsXG4gICAgICAgIHNsaXA6IHRydWVcbiAgICB9O1xuICAgIHRoaXMuX2V2ZW50SW5wdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldElucHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudElucHV0KTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudE91dHB1dCk7XG4gICAgdGhpcy5fcG9zaXRpb24gPSB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyBbXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdIDogMDtcbiAgICB0aGlzLl9wcmV2VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wcmV2VmVsID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQub24oJ21vdXNld2hlZWwnLCBfaGFuZGxlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9ldmVudElucHV0Lm9uKCd3aGVlbCcsIF9oYW5kbGVNb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX2luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLl9sb29wQm91bmQgPSBmYWxzZTtcbn1cblNjcm9sbFN5bmMuREVGQVVMVF9PUFRJT05TID0ge1xuICAgIGRpcmVjdGlvbjogdW5kZWZpbmVkLFxuICAgIG1pbmltdW1FbmRTcGVlZDogSW5maW5pdHksXG4gICAgcmFpbHM6IGZhbHNlLFxuICAgIHNjYWxlOiAxLFxuICAgIHN0YWxsVGltZTogNTAsXG4gICAgbGluZUhlaWdodDogNDAsXG4gICAgcHJldmVudERlZmF1bHQ6IHRydWVcbn07XG5TY3JvbGxTeW5jLkRJUkVDVElPTl9YID0gMDtcblNjcm9sbFN5bmMuRElSRUNUSU9OX1kgPSAxO1xudmFyIE1JTklNVU1fVElDS19USU1FID0gODtcbnZhciBfbm93ID0gRGF0ZS5ub3c7XG5mdW5jdGlvbiBfbmV3RnJhbWUoKSB7XG4gICAgaWYgKHRoaXMuX2luUHJvZ3Jlc3MgJiYgX25vdygpIC0gdGhpcy5fcHJldlRpbWUgPiB0aGlzLm9wdGlvbnMuc3RhbGxUaW1lKSB7XG4gICAgICAgIHRoaXMuX2luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdmFyIGZpbmFsVmVsID0gTWF0aC5hYnModGhpcy5fcHJldlZlbCkgPj0gdGhpcy5vcHRpb25zLm1pbmltdW1FbmRTcGVlZCA/IHRoaXMuX3ByZXZWZWwgOiAwO1xuICAgICAgICB2YXIgcGF5bG9hZCA9IHRoaXMuX3BheWxvYWQ7XG4gICAgICAgIHBheWxvYWQucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbjtcbiAgICAgICAgcGF5bG9hZC52ZWxvY2l0eSA9IGZpbmFsVmVsO1xuICAgICAgICBwYXlsb2FkLnNsaXAgPSB0cnVlO1xuICAgICAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdlbmQnLCBwYXlsb2FkKTtcbiAgICB9XG59XG5mdW5jdGlvbiBfaGFuZGxlTW92ZShldmVudCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMucHJldmVudERlZmF1bHQpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCF0aGlzLl9pblByb2dyZXNzKSB7XG4gICAgICAgIHRoaXMuX2luUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IHVuZGVmaW5lZCA/IFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF0gOiAwO1xuICAgICAgICBwYXlsb2FkID0gdGhpcy5fcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5zbGlwID0gdHJ1ZTtcbiAgICAgICAgcGF5bG9hZC5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xuICAgICAgICBwYXlsb2FkLmNsaWVudFggPSBldmVudC5jbGllbnRYO1xuICAgICAgICBwYXlsb2FkLmNsaWVudFkgPSBldmVudC5jbGllbnRZO1xuICAgICAgICBwYXlsb2FkLm9mZnNldFggPSBldmVudC5vZmZzZXRYO1xuICAgICAgICBwYXlsb2FkLm9mZnNldFkgPSBldmVudC5vZmZzZXRZO1xuICAgICAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdzdGFydCcsIHBheWxvYWQpO1xuICAgICAgICBpZiAoIXRoaXMuX2xvb3BCb3VuZCkge1xuICAgICAgICAgICAgRW5naW5lLm9uKCdwcmVyZW5kZXInLCBfbmV3RnJhbWUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9sb29wQm91bmQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBjdXJyVGltZSA9IF9ub3coKTtcbiAgICB2YXIgcHJldlRpbWUgPSB0aGlzLl9wcmV2VGltZSB8fCBjdXJyVGltZTtcbiAgICB2YXIgZGlmZlggPSBldmVudC53aGVlbERlbHRhWCAhPT0gdW5kZWZpbmVkID8gZXZlbnQud2hlZWxEZWx0YVggOiAtZXZlbnQuZGVsdGFYO1xuICAgIHZhciBkaWZmWSA9IGV2ZW50LndoZWVsRGVsdGFZICE9PSB1bmRlZmluZWQgPyBldmVudC53aGVlbERlbHRhWSA6IC1ldmVudC5kZWx0YVk7XG4gICAgaWYgKGV2ZW50LmRlbHRhTW9kZSA9PT0gMSkge1xuICAgICAgICBkaWZmWCAqPSB0aGlzLm9wdGlvbnMubGluZUhlaWdodDtcbiAgICAgICAgZGlmZlkgKj0gdGhpcy5vcHRpb25zLmxpbmVIZWlnaHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMucmFpbHMpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA+IE1hdGguYWJzKGRpZmZZKSlcbiAgICAgICAgICAgIGRpZmZZID0gMDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB2YXIgZGlmZlRpbWUgPSBNYXRoLm1heChjdXJyVGltZSAtIHByZXZUaW1lLCBNSU5JTVVNX1RJQ0tfVElNRSk7XG4gICAgdmFyIHZlbFggPSBkaWZmWCAvIGRpZmZUaW1lO1xuICAgIHZhciB2ZWxZID0gZGlmZlkgLyBkaWZmVGltZTtcbiAgICB2YXIgc2NhbGUgPSB0aGlzLm9wdGlvbnMuc2NhbGU7XG4gICAgdmFyIG5leHRWZWw7XG4gICAgdmFyIG5leHREZWx0YTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gU2Nyb2xsU3luYy5ESVJFQ1RJT05fWCkge1xuICAgICAgICBuZXh0RGVsdGEgPSBzY2FsZSAqIGRpZmZYO1xuICAgICAgICBuZXh0VmVsID0gc2NhbGUgKiB2ZWxYO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiArPSBuZXh0RGVsdGE7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSBTY3JvbGxTeW5jLkRJUkVDVElPTl9ZKSB7XG4gICAgICAgIG5leHREZWx0YSA9IHNjYWxlICogZGlmZlk7XG4gICAgICAgIG5leHRWZWwgPSBzY2FsZSAqIHZlbFk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uICs9IG5leHREZWx0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0RGVsdGEgPSBbXG4gICAgICAgICAgICBzY2FsZSAqIGRpZmZYLFxuICAgICAgICAgICAgc2NhbGUgKiBkaWZmWVxuICAgICAgICBdO1xuICAgICAgICBuZXh0VmVsID0gW1xuICAgICAgICAgICAgc2NhbGUgKiB2ZWxYLFxuICAgICAgICAgICAgc2NhbGUgKiB2ZWxZXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWzBdICs9IG5leHREZWx0YVswXTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25bMV0gKz0gbmV4dERlbHRhWzFdO1xuICAgIH1cbiAgICB2YXIgcGF5bG9hZCA9IHRoaXMuX3BheWxvYWQ7XG4gICAgcGF5bG9hZC5kZWx0YSA9IG5leHREZWx0YTtcbiAgICBwYXlsb2FkLnZlbG9jaXR5ID0gbmV4dFZlbDtcbiAgICBwYXlsb2FkLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb247XG4gICAgcGF5bG9hZC5zbGlwID0gdHJ1ZTtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCd1cGRhdGUnLCBwYXlsb2FkKTtcbiAgICB0aGlzLl9wcmV2VGltZSA9IGN1cnJUaW1lO1xuICAgIHRoaXMuX3ByZXZWZWwgPSBuZXh0VmVsO1xufVxuU2Nyb2xsU3luYy5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbn07XG5TY3JvbGxTeW5jLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnNldE9wdGlvbnMob3B0aW9ucyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxTeW5jOyIsInZhciBUb3VjaFRyYWNrZXIgPSByZXF1aXJlKCcuL1RvdWNoVHJhY2tlcicpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4uL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG52YXIgT3B0aW9uc01hbmFnZXIgPSByZXF1aXJlKCcuLi9jb3JlL09wdGlvbnNNYW5hZ2VyJyk7XG5mdW5jdGlvbiBUb3VjaFN5bmMob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoVG91Y2hTeW5jLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgdGhpcy5fb3B0aW9uc01hbmFnZXIgPSBuZXcgT3B0aW9uc01hbmFnZXIodGhpcy5vcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX3RvdWNoVHJhY2tlciA9IG5ldyBUb3VjaFRyYWNrZXIoKTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudE91dHB1dCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldElucHV0SGFuZGxlcih0aGlzLCB0aGlzLl90b3VjaFRyYWNrZXIpO1xuICAgIHRoaXMuX3RvdWNoVHJhY2tlci5vbigndHJhY2tzdGFydCcsIF9oYW5kbGVTdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl90b3VjaFRyYWNrZXIub24oJ3RyYWNrbW92ZScsIF9oYW5kbGVNb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX3RvdWNoVHJhY2tlci5vbigndHJhY2tlbmQnLCBfaGFuZGxlRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX3BheWxvYWQgPSB7XG4gICAgICAgIGRlbHRhOiBudWxsLFxuICAgICAgICBwb3NpdGlvbjogbnVsbCxcbiAgICAgICAgdmVsb2NpdHk6IG51bGwsXG4gICAgICAgIGNsaWVudFg6IHVuZGVmaW5lZCxcbiAgICAgICAgY2xpZW50WTogdW5kZWZpbmVkLFxuICAgICAgICBjb3VudDogMCxcbiAgICAgICAgdG91Y2g6IHVuZGVmaW5lZFxuICAgIH07XG4gICAgdGhpcy5fcG9zaXRpb24gPSBudWxsO1xufVxuVG91Y2hTeW5jLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBkaXJlY3Rpb246IHVuZGVmaW5lZCxcbiAgICByYWlsczogZmFsc2UsXG4gICAgc2NhbGU6IDFcbn07XG5Ub3VjaFN5bmMuRElSRUNUSU9OX1ggPSAwO1xuVG91Y2hTeW5jLkRJUkVDVElPTl9ZID0gMTtcbnZhciBNSU5JTVVNX1RJQ0tfVElNRSA9IDg7XG5mdW5jdGlvbiBfaGFuZGxlU3RhcnQoZGF0YSkge1xuICAgIHZhciB2ZWxvY2l0eTtcbiAgICB2YXIgZGVsdGE7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IDA7XG4gICAgICAgIHZlbG9jaXR5ID0gMDtcbiAgICAgICAgZGVsdGEgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXTtcbiAgICAgICAgdmVsb2NpdHkgPSBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdO1xuICAgICAgICBkZWx0YSA9IFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF07XG4gICAgfVxuICAgIHZhciBwYXlsb2FkID0gdGhpcy5fcGF5bG9hZDtcbiAgICBwYXlsb2FkLmRlbHRhID0gZGVsdGE7XG4gICAgcGF5bG9hZC5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xuICAgIHBheWxvYWQudmVsb2NpdHkgPSB2ZWxvY2l0eTtcbiAgICBwYXlsb2FkLmNsaWVudFggPSBkYXRhLng7XG4gICAgcGF5bG9hZC5jbGllbnRZID0gZGF0YS55O1xuICAgIHBheWxvYWQuY291bnQgPSBkYXRhLmNvdW50O1xuICAgIHBheWxvYWQudG91Y2ggPSBkYXRhLmlkZW50aWZpZXI7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnc3RhcnQnLCBwYXlsb2FkKTtcbn1cbmZ1bmN0aW9uIF9oYW5kbGVNb3ZlKGRhdGEpIHtcbiAgICB2YXIgaGlzdG9yeSA9IGRhdGEuaGlzdG9yeTtcbiAgICB2YXIgY3Vyckhpc3RvcnkgPSBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV07XG4gICAgdmFyIHByZXZIaXN0b3J5ID0gaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDJdO1xuICAgIHZhciBwcmV2VGltZSA9IHByZXZIaXN0b3J5LnRpbWVzdGFtcDtcbiAgICB2YXIgY3VyclRpbWUgPSBjdXJySGlzdG9yeS50aW1lc3RhbXA7XG4gICAgdmFyIGRpZmZYID0gY3Vyckhpc3RvcnkueCAtIHByZXZIaXN0b3J5Lng7XG4gICAgdmFyIGRpZmZZID0gY3Vyckhpc3RvcnkueSAtIHByZXZIaXN0b3J5Lnk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5yYWlscykge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpID4gTWF0aC5hYnMoZGlmZlkpKVxuICAgICAgICAgICAgZGlmZlkgPSAwO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkaWZmWCA9IDA7XG4gICAgfVxuICAgIHZhciBkaWZmVGltZSA9IE1hdGgubWF4KGN1cnJUaW1lIC0gcHJldlRpbWUsIE1JTklNVU1fVElDS19USU1FKTtcbiAgICB2YXIgdmVsWCA9IGRpZmZYIC8gZGlmZlRpbWU7XG4gICAgdmFyIHZlbFkgPSBkaWZmWSAvIGRpZmZUaW1lO1xuICAgIHZhciBzY2FsZSA9IHRoaXMub3B0aW9ucy5zY2FsZTtcbiAgICB2YXIgbmV4dFZlbDtcbiAgICB2YXIgbmV4dERlbHRhO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSBUb3VjaFN5bmMuRElSRUNUSU9OX1gpIHtcbiAgICAgICAgbmV4dERlbHRhID0gc2NhbGUgKiBkaWZmWDtcbiAgICAgICAgbmV4dFZlbCA9IHNjYWxlICogdmVsWDtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gKz0gbmV4dERlbHRhO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gVG91Y2hTeW5jLkRJUkVDVElPTl9ZKSB7XG4gICAgICAgIG5leHREZWx0YSA9IHNjYWxlICogZGlmZlk7XG4gICAgICAgIG5leHRWZWwgPSBzY2FsZSAqIHZlbFk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uICs9IG5leHREZWx0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0RGVsdGEgPSBbXG4gICAgICAgICAgICBzY2FsZSAqIGRpZmZYLFxuICAgICAgICAgICAgc2NhbGUgKiBkaWZmWVxuICAgICAgICBdO1xuICAgICAgICBuZXh0VmVsID0gW1xuICAgICAgICAgICAgc2NhbGUgKiB2ZWxYLFxuICAgICAgICAgICAgc2NhbGUgKiB2ZWxZXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWzBdICs9IG5leHREZWx0YVswXTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25bMV0gKz0gbmV4dERlbHRhWzFdO1xuICAgIH1cbiAgICB2YXIgcGF5bG9hZCA9IHRoaXMuX3BheWxvYWQ7XG4gICAgcGF5bG9hZC5kZWx0YSA9IG5leHREZWx0YTtcbiAgICBwYXlsb2FkLnZlbG9jaXR5ID0gbmV4dFZlbDtcbiAgICBwYXlsb2FkLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb247XG4gICAgcGF5bG9hZC5jbGllbnRYID0gZGF0YS54O1xuICAgIHBheWxvYWQuY2xpZW50WSA9IGRhdGEueTtcbiAgICBwYXlsb2FkLmNvdW50ID0gZGF0YS5jb3VudDtcbiAgICBwYXlsb2FkLnRvdWNoID0gZGF0YS5pZGVudGlmaWVyO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ3VwZGF0ZScsIHBheWxvYWQpO1xufVxuZnVuY3Rpb24gX2hhbmRsZUVuZChkYXRhKSB7XG4gICAgdGhpcy5fcGF5bG9hZC5jb3VudCA9IGRhdGEuY291bnQ7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnZW5kJywgdGhpcy5fcGF5bG9hZCk7XG59XG5Ub3VjaFN5bmMucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc01hbmFnZXIuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn07XG5Ub3VjaFN5bmMucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBUb3VjaFN5bmM7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4uL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG52YXIgX25vdyA9IERhdGUubm93O1xuZnVuY3Rpb24gX3RpbWVzdGFtcFRvdWNoKHRvdWNoLCBldmVudCwgaGlzdG9yeSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHRvdWNoLmNsaWVudFgsXG4gICAgICAgIHk6IHRvdWNoLmNsaWVudFksXG4gICAgICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXG4gICAgICAgIG9yaWdpbjogZXZlbnQub3JpZ2luLFxuICAgICAgICB0aW1lc3RhbXA6IF9ub3coKSxcbiAgICAgICAgY291bnQ6IGV2ZW50LnRvdWNoZXMubGVuZ3RoLFxuICAgICAgICBoaXN0b3J5OiBoaXN0b3J5XG4gICAgfTtcbn1cbmZ1bmN0aW9uIF9oYW5kbGVTdGFydChldmVudCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgIHZhciBkYXRhID0gX3RpbWVzdGFtcFRvdWNoKHRvdWNoLCBldmVudCwgbnVsbCk7XG4gICAgICAgIHRoaXMuZXZlbnRPdXRwdXQuZW1pdCgndHJhY2tzdGFydCcsIGRhdGEpO1xuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0aXZlICYmICF0aGlzLnRvdWNoSGlzdG9yeVt0b3VjaC5pZGVudGlmaWVyXSlcbiAgICAgICAgICAgIHRoaXMudHJhY2soZGF0YSk7XG4gICAgfVxufVxuZnVuY3Rpb24gX2hhbmRsZU1vdmUoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICB2YXIgaGlzdG9yeSA9IHRoaXMudG91Y2hIaXN0b3J5W3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBfdGltZXN0YW1wVG91Y2godG91Y2gsIGV2ZW50LCBoaXN0b3J5KTtcbiAgICAgICAgICAgIHRoaXMudG91Y2hIaXN0b3J5W3RvdWNoLmlkZW50aWZpZXJdLnB1c2goZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50T3V0cHV0LmVtaXQoJ3RyYWNrbW92ZScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gX2hhbmRsZUVuZChldmVudCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgIHZhciBoaXN0b3J5ID0gdGhpcy50b3VjaEhpc3RvcnlbdG91Y2guaWRlbnRpZmllcl07XG4gICAgICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IF90aW1lc3RhbXBUb3VjaCh0b3VjaCwgZXZlbnQsIGhpc3RvcnkpO1xuICAgICAgICAgICAgdGhpcy5ldmVudE91dHB1dC5lbWl0KCd0cmFja2VuZCcsIGRhdGEpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudG91Y2hIaXN0b3J5W3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gX2hhbmRsZVVucGlwZSgpIHtcbiAgICBmb3IgKHZhciBpIGluIHRoaXMudG91Y2hIaXN0b3J5KSB7XG4gICAgICAgIHZhciBoaXN0b3J5ID0gdGhpcy50b3VjaEhpc3RvcnlbaV07XG4gICAgICAgIHRoaXMuZXZlbnRPdXRwdXQuZW1pdCgndHJhY2tlbmQnLCB7XG4gICAgICAgICAgICB0b3VjaDogaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdLnRvdWNoLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgY291bnQ6IDAsXG4gICAgICAgICAgICBoaXN0b3J5OiBoaXN0b3J5XG4gICAgICAgIH0pO1xuICAgICAgICBkZWxldGUgdGhpcy50b3VjaEhpc3RvcnlbaV07XG4gICAgfVxufVxuZnVuY3Rpb24gVG91Y2hUcmFja2VyKHNlbGVjdGl2ZSkge1xuICAgIHRoaXMuc2VsZWN0aXZlID0gc2VsZWN0aXZlO1xuICAgIHRoaXMudG91Y2hIaXN0b3J5ID0ge307XG4gICAgdGhpcy5ldmVudElucHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldElucHV0SGFuZGxlcih0aGlzLCB0aGlzLmV2ZW50SW5wdXQpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRPdXRwdXRIYW5kbGVyKHRoaXMsIHRoaXMuZXZlbnRPdXRwdXQpO1xuICAgIHRoaXMuZXZlbnRJbnB1dC5vbigndG91Y2hzdGFydCcsIF9oYW5kbGVTdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50SW5wdXQub24oJ3RvdWNobW92ZScsIF9oYW5kbGVNb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRJbnB1dC5vbigndG91Y2hlbmQnLCBfaGFuZGxlRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRJbnB1dC5vbigndG91Y2hjYW5jZWwnLCBfaGFuZGxlRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRJbnB1dC5vbigndW5waXBlJywgX2hhbmRsZVVucGlwZS5iaW5kKHRoaXMpKTtcbn1cblRvdWNoVHJhY2tlci5wcm90b3R5cGUudHJhY2sgPSBmdW5jdGlvbiB0cmFjayhkYXRhKSB7XG4gICAgdGhpcy50b3VjaEhpc3RvcnlbZGF0YS5pZGVudGlmaWVyXSA9IFtkYXRhXTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFRvdWNoVHJhY2tlcjsiLCJmdW5jdGlvbiBWZWN0b3IoeCwgeSwgeikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5zZXQoeCk7XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xuICAgICAgICB0aGlzLnogPSB6IHx8IDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxudmFyIF9yZWdpc3RlciA9IG5ldyBWZWN0b3IoMCwgMCwgMCk7XG5WZWN0b3IucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCh2KSB7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbChfcmVnaXN0ZXIsIHRoaXMueCArIHYueCwgdGhpcy55ICsgdi55LCB0aGlzLnogKyB2LnopO1xufTtcblZlY3Rvci5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24gc3ViKHYpIHtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKF9yZWdpc3RlciwgdGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnksIHRoaXMueiAtIHYueik7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24gbXVsdChyKSB7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbChfcmVnaXN0ZXIsIHIgKiB0aGlzLngsIHIgKiB0aGlzLnksIHIgKiB0aGlzLnopO1xufTtcblZlY3Rvci5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24gZGl2KHIpIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0KDEgLyByKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gY3Jvc3Modikge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuICAgIHZhciB2eCA9IHYueDtcbiAgICB2YXIgdnkgPSB2Lnk7XG4gICAgdmFyIHZ6ID0gdi56O1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwoX3JlZ2lzdGVyLCB6ICogdnkgLSB5ICogdnosIHggKiB2eiAtIHogKiB2eCwgeSAqIHZ4IC0geCAqIHZ5KTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyh2KSB7XG4gICAgcmV0dXJuIHYueCA9PT0gdGhpcy54ICYmIHYueSA9PT0gdGhpcy55ICYmIHYueiA9PT0gdGhpcy56O1xufTtcblZlY3Rvci5wcm90b3R5cGUucm90YXRlWCA9IGZ1bmN0aW9uIHJvdGF0ZVgodGhldGEpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwoX3JlZ2lzdGVyLCB4LCB5ICogY29zVGhldGEgLSB6ICogc2luVGhldGEsIHkgKiBzaW5UaGV0YSArIHogKiBjb3NUaGV0YSk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5yb3RhdGVZID0gZnVuY3Rpb24gcm90YXRlWSh0aGV0YSkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbChfcmVnaXN0ZXIsIHogKiBzaW5UaGV0YSArIHggKiBjb3NUaGV0YSwgeSwgeiAqIGNvc1RoZXRhIC0geCAqIHNpblRoZXRhKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLnJvdGF0ZVogPSBmdW5jdGlvbiByb3RhdGVaKHRoZXRhKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKF9yZWdpc3RlciwgeCAqIGNvc1RoZXRhIC0geSAqIHNpblRoZXRhLCB4ICogc2luVGhldGEgKyB5ICogY29zVGhldGEsIHopO1xufTtcblZlY3Rvci5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gZG90KHYpIHtcbiAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55ICsgdGhpcy56ICogdi56O1xufTtcblZlY3Rvci5wcm90b3R5cGUubm9ybVNxdWFyZWQgPSBmdW5jdGlvbiBub3JtU3F1YXJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kb3QodGhpcyk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5ub3JtID0gZnVuY3Rpb24gbm9ybSgpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMubm9ybVNxdWFyZWQoKSk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUobGVuZ3RoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICAgIGxlbmd0aCA9IDE7XG4gICAgdmFyIG5vcm0gPSB0aGlzLm5vcm0oKTtcbiAgICBpZiAobm9ybSA+IDFlLTcpXG4gICAgICAgIHJldHVybiBfc2V0RnJvbVZlY3Rvci5jYWxsKF9yZWdpc3RlciwgdGhpcy5tdWx0KGxlbmd0aCAvIG5vcm0pKTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBfc2V0WFlaLmNhbGwoX3JlZ2lzdGVyLCBsZW5ndGgsIDAsIDApO1xufTtcblZlY3Rvci5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmlzWmVybyA9IGZ1bmN0aW9uIGlzWmVybygpIHtcbiAgICByZXR1cm4gISh0aGlzLnggfHwgdGhpcy55IHx8IHRoaXMueik7XG59O1xuZnVuY3Rpb24gX3NldFhZWih4LCB5LCB6KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMueiA9IHo7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBfc2V0RnJvbUFycmF5KHYpIHtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKHRoaXMsIHZbMF0sIHZbMV0sIHZbMl0gfHwgMCk7XG59XG5mdW5jdGlvbiBfc2V0RnJvbVZlY3Rvcih2KSB7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbCh0aGlzLCB2LngsIHYueSwgdi56KTtcbn1cbmZ1bmN0aW9uIF9zZXRGcm9tTnVtYmVyKHgpIHtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKHRoaXMsIHgsIDAsIDApO1xufVxuVmVjdG9yLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQodikge1xuICAgIGlmICh2IGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIHJldHVybiBfc2V0RnJvbUFycmF5LmNhbGwodGhpcywgdik7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJylcbiAgICAgICAgcmV0dXJuIF9zZXRGcm9tTnVtYmVyLmNhbGwodGhpcywgdik7XG4gICAgcmV0dXJuIF9zZXRGcm9tVmVjdG9yLmNhbGwodGhpcywgdik7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5zZXRYWVogPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIHJldHVybiBfc2V0WFlaLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5zZXQxRCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIF9zZXRGcm9tTnVtYmVyLmNhbGwodGhpcywgeCk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbiBwdXQodikge1xuICAgIGlmICh0aGlzID09PSBfcmVnaXN0ZXIpXG4gICAgICAgIF9zZXRGcm9tVmVjdG9yLmNhbGwodiwgX3JlZ2lzdGVyKTtcbiAgICBlbHNlXG4gICAgICAgIF9zZXRGcm9tVmVjdG9yLmNhbGwodiwgdGhpcyk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwodGhpcywgMCwgMCwgMCk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5jYXAgPSBmdW5jdGlvbiBjYXAoY2FwKSB7XG4gICAgaWYgKGNhcCA9PT0gSW5maW5pdHkpXG4gICAgICAgIHJldHVybiBfc2V0RnJvbVZlY3Rvci5jYWxsKF9yZWdpc3RlciwgdGhpcyk7XG4gICAgdmFyIG5vcm0gPSB0aGlzLm5vcm0oKTtcbiAgICBpZiAobm9ybSA+IGNhcClcbiAgICAgICAgcmV0dXJuIF9zZXRGcm9tVmVjdG9yLmNhbGwoX3JlZ2lzdGVyLCB0aGlzLm11bHQoY2FwIC8gbm9ybSkpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIF9zZXRGcm9tVmVjdG9yLmNhbGwoX3JlZ2lzdGVyLCB0aGlzKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLnByb2plY3QgPSBmdW5jdGlvbiBwcm9qZWN0KG4pIHtcbiAgICByZXR1cm4gbi5tdWx0KHRoaXMuZG90KG4pKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLnJlZmxlY3RBY3Jvc3MgPSBmdW5jdGlvbiByZWZsZWN0QWNyb3NzKG4pIHtcbiAgICBuLm5vcm1hbGl6ZSgpLnB1dChuKTtcbiAgICByZXR1cm4gX3NldEZyb21WZWN0b3IoX3JlZ2lzdGVyLCB0aGlzLnN1Yih0aGlzLnByb2plY3QobikubXVsdCgyKSkpO1xufTtcblZlY3Rvci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMueCxcbiAgICAgICAgdGhpcy55LFxuICAgICAgICB0aGlzLnpcbiAgICBdO1xufTtcblZlY3Rvci5wcm90b3R5cGUuZ2V0MUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMueDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjsiLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG5mdW5jdGlvbiBQaHlzaWNzRW5naW5lKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKFBoeXNpY3NFbmdpbmUuREVGQVVMVF9PUFRJT05TKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX3BhcnRpY2xlcyA9IFtdO1xuICAgIHRoaXMuX2JvZGllcyA9IFtdO1xuICAgIHRoaXMuX2FnZW50cyA9IHt9O1xuICAgIHRoaXMuX2ZvcmNlcyA9IFtdO1xuICAgIHRoaXMuX2NvbnN0cmFpbnRzID0gW107XG4gICAgdGhpcy5fYnVmZmVyID0gMDtcbiAgICB0aGlzLl9wcmV2VGltZSA9IG5vdygpO1xuICAgIHRoaXMuX2lzU2xlZXBpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXIgPSBudWxsO1xuICAgIHRoaXMuX2N1cnJBZ2VudElkID0gMDtcbiAgICB0aGlzLl9oYXNCb2RpZXMgPSBmYWxzZTtcbn1cbnZhciBUSU1FU1RFUCA9IDE3O1xudmFyIE1JTl9USU1FX1NURVAgPSAxMDAwIC8gMTIwO1xudmFyIE1BWF9USU1FX1NURVAgPSAxNztcblBoeXNpY3NFbmdpbmUuREVGQVVMVF9PUFRJT05TID0ge1xuICAgIGNvbnN0cmFpbnRTdGVwczogMSxcbiAgICBzbGVlcFRvbGVyYW5jZTogMWUtN1xufTtcbnZhciBub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdztcbiAgICB9KCk7XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9wdHMpXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNba2V5XSlcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0c1trZXldO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmFkZEJvZHkgPSBmdW5jdGlvbiBhZGRCb2R5KGJvZHkpIHtcbiAgICBib2R5Ll9lbmdpbmUgPSB0aGlzO1xuICAgIGlmIChib2R5LmlzQm9keSkge1xuICAgICAgICB0aGlzLl9ib2RpZXMucHVzaChib2R5KTtcbiAgICAgICAgdGhpcy5faGFzQm9kaWVzID0gdHJ1ZTtcbiAgICB9IGVsc2VcbiAgICAgICAgdGhpcy5fcGFydGljbGVzLnB1c2goYm9keSk7XG4gICAgcmV0dXJuIGJvZHk7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUucmVtb3ZlQm9keSA9IGZ1bmN0aW9uIHJlbW92ZUJvZHkoYm9keSkge1xuICAgIHZhciBhcnJheSA9IGJvZHkuaXNCb2R5ID8gdGhpcy5fYm9kaWVzIDogdGhpcy5fcGFydGljbGVzO1xuICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoYm9keSk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPYmplY3Qua2V5cyh0aGlzLl9hZ2VudHMpLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgdGhpcy5kZXRhY2hGcm9tKGksIGJvZHkpO1xuICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXRCb2RpZXMoKS5sZW5ndGggPT09IDApXG4gICAgICAgIHRoaXMuX2hhc0JvZGllcyA9IGZhbHNlO1xufTtcbmZ1bmN0aW9uIF9tYXBBZ2VudEFycmF5KGFnZW50KSB7XG4gICAgaWYgKGFnZW50LmFwcGx5Rm9yY2UpXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JjZXM7XG4gICAgaWYgKGFnZW50LmFwcGx5Q29uc3RyYWludClcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0cmFpbnRzO1xufVxuZnVuY3Rpb24gX2F0dGFjaE9uZShhZ2VudCwgdGFyZ2V0cywgc291cmNlKSB7XG4gICAgaWYgKHRhcmdldHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGFyZ2V0cyA9IHRoaXMuZ2V0UGFydGljbGVzQW5kQm9kaWVzKCk7XG4gICAgaWYgKCEodGFyZ2V0cyBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgICAgdGFyZ2V0cyA9IFt0YXJnZXRzXTtcbiAgICB0aGlzLl9hZ2VudHNbdGhpcy5fY3VyckFnZW50SWRdID0ge1xuICAgICAgICBhZ2VudDogYWdlbnQsXG4gICAgICAgIHRhcmdldHM6IHRhcmdldHMsXG4gICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgfTtcbiAgICBfbWFwQWdlbnRBcnJheS5jYWxsKHRoaXMsIGFnZW50KS5wdXNoKHRoaXMuX2N1cnJBZ2VudElkKTtcbiAgICByZXR1cm4gdGhpcy5fY3VyckFnZW50SWQrKztcbn1cblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uIGF0dGFjaChhZ2VudHMsIHRhcmdldHMsIHNvdXJjZSkge1xuICAgIGlmIChhZ2VudHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB2YXIgYWdlbnRJRHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZ2VudHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBhZ2VudElEc1tpXSA9IF9hdHRhY2hPbmUuY2FsbCh0aGlzLCBhZ2VudHNbaV0sIHRhcmdldHMsIHNvdXJjZSk7XG4gICAgICAgIHJldHVybiBhZ2VudElEcztcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIF9hdHRhY2hPbmUuY2FsbCh0aGlzLCBhZ2VudHMsIHRhcmdldHMsIHNvdXJjZSk7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuYXR0YWNoVG8gPSBmdW5jdGlvbiBhdHRhY2hUbyhhZ2VudElELCB0YXJnZXQpIHtcbiAgICBfZ2V0Qm91bmRBZ2VudC5jYWxsKHRoaXMsIGFnZW50SUQpLnRhcmdldHMucHVzaCh0YXJnZXQpO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaChpZCkge1xuICAgIHZhciBhZ2VudCA9IHRoaXMuZ2V0QWdlbnQoaWQpO1xuICAgIHZhciBhZ2VudEFycmF5ID0gX21hcEFnZW50QXJyYXkuY2FsbCh0aGlzLCBhZ2VudCk7XG4gICAgdmFyIGluZGV4ID0gYWdlbnRBcnJheS5pbmRleE9mKGlkKTtcbiAgICBhZ2VudEFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgZGVsZXRlIHRoaXMuX2FnZW50c1tpZF07XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZGV0YWNoRnJvbSA9IGZ1bmN0aW9uIGRldGFjaEZyb20oaWQsIHRhcmdldCkge1xuICAgIHZhciBib3VuZEFnZW50ID0gX2dldEJvdW5kQWdlbnQuY2FsbCh0aGlzLCBpZCk7XG4gICAgaWYgKGJvdW5kQWdlbnQuc291cmNlID09PSB0YXJnZXQpXG4gICAgICAgIHRoaXMuZGV0YWNoKGlkKTtcbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHRhcmdldHMgPSBib3VuZEFnZW50LnRhcmdldHM7XG4gICAgICAgIHZhciBpbmRleCA9IHRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgICAgIHRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZGV0YWNoQWxsID0gZnVuY3Rpb24gZGV0YWNoQWxsKCkge1xuICAgIHRoaXMuX2FnZW50cyA9IHt9O1xuICAgIHRoaXMuX2ZvcmNlcyA9IFtdO1xuICAgIHRoaXMuX2NvbnN0cmFpbnRzID0gW107XG4gICAgdGhpcy5fY3VyckFnZW50SWQgPSAwO1xufTtcbmZ1bmN0aW9uIF9nZXRCb3VuZEFnZW50KGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FnZW50c1tpZF07XG59XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5nZXRBZ2VudCA9IGZ1bmN0aW9uIGdldEFnZW50KGlkKSB7XG4gICAgcmV0dXJuIF9nZXRCb3VuZEFnZW50LmNhbGwodGhpcywgaWQpLmFnZW50O1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmdldFBhcnRpY2xlcyA9IGZ1bmN0aW9uIGdldFBhcnRpY2xlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFydGljbGVzO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmdldEJvZGllcyA9IGZ1bmN0aW9uIGdldEJvZGllcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYm9kaWVzO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmdldFBhcnRpY2xlc0FuZEJvZGllcyA9IGZ1bmN0aW9uIGdldFBhcnRpY2xlc0FuZEJvZGllcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXJ0aWNsZXMoKS5jb25jYXQodGhpcy5nZXRCb2RpZXMoKSk7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZm9yRWFjaFBhcnRpY2xlID0gZnVuY3Rpb24gZm9yRWFjaFBhcnRpY2xlKGZuLCBkdCkge1xuICAgIHZhciBwYXJ0aWNsZXMgPSB0aGlzLmdldFBhcnRpY2xlcygpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuID0gcGFydGljbGVzLmxlbmd0aDsgaW5kZXggPCBsZW47IGluZGV4KyspXG4gICAgICAgIGZuLmNhbGwodGhpcywgcGFydGljbGVzW2luZGV4XSwgZHQpO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmZvckVhY2hCb2R5ID0gZnVuY3Rpb24gZm9yRWFjaEJvZHkoZm4sIGR0KSB7XG4gICAgaWYgKCF0aGlzLl9oYXNCb2RpZXMpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgYm9kaWVzID0gdGhpcy5nZXRCb2RpZXMoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbiA9IGJvZGllcy5sZW5ndGg7IGluZGV4IDwgbGVuOyBpbmRleCsrKVxuICAgICAgICBmbi5jYWxsKHRoaXMsIGJvZGllc1tpbmRleF0sIGR0KTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbiwgZHQpIHtcbiAgICB0aGlzLmZvckVhY2hQYXJ0aWNsZShmbiwgZHQpO1xuICAgIHRoaXMuZm9yRWFjaEJvZHkoZm4sIGR0KTtcbn07XG5mdW5jdGlvbiBfdXBkYXRlRm9yY2UoaW5kZXgpIHtcbiAgICB2YXIgYm91bmRBZ2VudCA9IF9nZXRCb3VuZEFnZW50LmNhbGwodGhpcywgdGhpcy5fZm9yY2VzW2luZGV4XSk7XG4gICAgYm91bmRBZ2VudC5hZ2VudC5hcHBseUZvcmNlKGJvdW5kQWdlbnQudGFyZ2V0cywgYm91bmRBZ2VudC5zb3VyY2UpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZUZvcmNlcygpIHtcbiAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2ZvcmNlcy5sZW5ndGggLSAxOyBpbmRleCA+IC0xOyBpbmRleC0tKVxuICAgICAgICBfdXBkYXRlRm9yY2UuY2FsbCh0aGlzLCBpbmRleCk7XG59XG5mdW5jdGlvbiBfdXBkYXRlQ29uc3RyYWludChpbmRleCwgZHQpIHtcbiAgICB2YXIgYm91bmRBZ2VudCA9IHRoaXMuX2FnZW50c1t0aGlzLl9jb25zdHJhaW50c1tpbmRleF1dO1xuICAgIHJldHVybiBib3VuZEFnZW50LmFnZW50LmFwcGx5Q29uc3RyYWludChib3VuZEFnZW50LnRhcmdldHMsIGJvdW5kQWdlbnQuc291cmNlLCBkdCk7XG59XG5mdW5jdGlvbiBfdXBkYXRlQ29uc3RyYWludHMoZHQpIHtcbiAgICB2YXIgaXRlcmF0aW9uID0gMDtcbiAgICB3aGlsZSAoaXRlcmF0aW9uIDwgdGhpcy5vcHRpb25zLmNvbnN0cmFpbnRTdGVwcykge1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2NvbnN0cmFpbnRzLmxlbmd0aCAtIDE7IGluZGV4ID4gLTE7IGluZGV4LS0pXG4gICAgICAgICAgICBfdXBkYXRlQ29uc3RyYWludC5jYWxsKHRoaXMsIGluZGV4LCBkdCk7XG4gICAgICAgIGl0ZXJhdGlvbisrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF91cGRhdGVWZWxvY2l0aWVzKHBhcnRpY2xlLCBkdCkge1xuICAgIHBhcnRpY2xlLmludGVncmF0ZVZlbG9jaXR5KGR0KTtcbn1cbmZ1bmN0aW9uIF91cGRhdGVBbmd1bGFyVmVsb2NpdGllcyhib2R5LCBkdCkge1xuICAgIGJvZHkuaW50ZWdyYXRlQW5ndWxhck1vbWVudHVtKGR0KTtcbiAgICBib2R5LnVwZGF0ZUFuZ3VsYXJWZWxvY2l0eSgpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZU9yaWVudGF0aW9ucyhib2R5LCBkdCkge1xuICAgIGJvZHkuaW50ZWdyYXRlT3JpZW50YXRpb24oZHQpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZVBvc2l0aW9ucyhwYXJ0aWNsZSwgZHQpIHtcbiAgICBwYXJ0aWNsZS5pbnRlZ3JhdGVQb3NpdGlvbihkdCk7XG4gICAgcGFydGljbGUuZW1pdCgndXBkYXRlJywgcGFydGljbGUpO1xufVxuZnVuY3Rpb24gX2ludGVncmF0ZShkdCkge1xuICAgIF91cGRhdGVGb3JjZXMuY2FsbCh0aGlzLCBkdCk7XG4gICAgdGhpcy5mb3JFYWNoKF91cGRhdGVWZWxvY2l0aWVzLCBkdCk7XG4gICAgdGhpcy5mb3JFYWNoQm9keShfdXBkYXRlQW5ndWxhclZlbG9jaXRpZXMsIGR0KTtcbiAgICBfdXBkYXRlQ29uc3RyYWludHMuY2FsbCh0aGlzLCBkdCk7XG4gICAgdGhpcy5mb3JFYWNoQm9keShfdXBkYXRlT3JpZW50YXRpb25zLCBkdCk7XG4gICAgdGhpcy5mb3JFYWNoKF91cGRhdGVQb3NpdGlvbnMsIGR0KTtcbn1cbmZ1bmN0aW9uIF9nZXRFbmVyZ3lQYXJ0aWNsZXMoKSB7XG4gICAgdmFyIGVuZXJneSA9IDA7XG4gICAgdmFyIHBhcnRpY2xlRW5lcmd5ID0gMDtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHBhcnRpY2xlRW5lcmd5ID0gcGFydGljbGUuZ2V0RW5lcmd5KCk7XG4gICAgICAgIGVuZXJneSArPSBwYXJ0aWNsZUVuZXJneTtcbiAgICAgICAgaWYgKHBhcnRpY2xlRW5lcmd5IDwgcGFydGljbGUuc2xlZXBUb2xlcmFuY2UpXG4gICAgICAgICAgICBwYXJ0aWNsZS5zbGVlcCgpO1xuICAgIH0pO1xuICAgIHJldHVybiBlbmVyZ3k7XG59XG5mdW5jdGlvbiBfZ2V0RW5lcmd5Rm9yY2VzKCkge1xuICAgIHZhciBlbmVyZ3kgPSAwO1xuICAgIGZvciAodmFyIGluZGV4ID0gdGhpcy5fZm9yY2VzLmxlbmd0aCAtIDE7IGluZGV4ID4gLTE7IGluZGV4LS0pXG4gICAgICAgIGVuZXJneSArPSB0aGlzLl9mb3JjZXNbaW5kZXhdLmdldEVuZXJneSgpIHx8IDA7XG4gICAgcmV0dXJuIGVuZXJneTtcbn1cbmZ1bmN0aW9uIF9nZXRFbmVyZ3lDb25zdHJhaW50cygpIHtcbiAgICB2YXIgZW5lcmd5ID0gMDtcbiAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2NvbnN0cmFpbnRzLmxlbmd0aCAtIDE7IGluZGV4ID4gLTE7IGluZGV4LS0pXG4gICAgICAgIGVuZXJneSArPSB0aGlzLl9jb25zdHJhaW50c1tpbmRleF0uZ2V0RW5lcmd5KCkgfHwgMDtcbiAgICByZXR1cm4gZW5lcmd5O1xufVxuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZ2V0RW5lcmd5ID0gZnVuY3Rpb24gZ2V0RW5lcmd5KCkge1xuICAgIHJldHVybiBfZ2V0RW5lcmd5UGFydGljbGVzLmNhbGwodGhpcykgKyBfZ2V0RW5lcmd5Rm9yY2VzLmNhbGwodGhpcykgKyBfZ2V0RW5lcmd5Q29uc3RyYWludHMuY2FsbCh0aGlzKTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24gc3RlcCgpIHtcbiAgICB2YXIgY3VyclRpbWUgPSBub3coKTtcbiAgICB2YXIgZHRGcmFtZSA9IGN1cnJUaW1lIC0gdGhpcy5fcHJldlRpbWU7XG4gICAgdGhpcy5fcHJldlRpbWUgPSBjdXJyVGltZTtcbiAgICBpZiAoZHRGcmFtZSA8IE1JTl9USU1FX1NURVApXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAoZHRGcmFtZSA+IE1BWF9USU1FX1NURVApXG4gICAgICAgIGR0RnJhbWUgPSBNQVhfVElNRV9TVEVQO1xuICAgIF9pbnRlZ3JhdGUuY2FsbCh0aGlzLCBUSU1FU1RFUCk7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuaXNTbGVlcGluZyA9IGZ1bmN0aW9uIGlzU2xlZXBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2xlZXBpbmc7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuc2xlZXAgPSBmdW5jdGlvbiBzbGVlcCgpIHtcbiAgICB0aGlzLmVtaXQoJ2VuZCcsIHRoaXMpO1xuICAgIHRoaXMuX2lzU2xlZXBpbmcgPSB0cnVlO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLndha2UgPSBmdW5jdGlvbiB3YWtlKCkge1xuICAgIHRoaXMuX3ByZXZUaW1lID0gbm93KCk7XG4gICAgdGhpcy5lbWl0KCdzdGFydCcsIHRoaXMpO1xuICAgIHRoaXMuX2lzU2xlZXBpbmcgPSBmYWxzZTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBkYXRhKSB7XG4gICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlciA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlci5lbWl0KHR5cGUsIGRhdGEpO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuKSB7XG4gICAgaWYgKHRoaXMuX2V2ZW50SGFuZGxlciA9PT0gbnVsbClcbiAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlci5vbihldmVudCwgZm4pO1xufTtcbm1vZHVsZS5leHBvcnRzID0gUGh5c2ljc0VuZ2luZTsiLCJ2YXIgVmVjdG9yID0gcmVxdWlyZSgnZmFtb3VzL21hdGgvVmVjdG9yJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvVHJhbnNmb3JtJyk7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG52YXIgSW50ZWdyYXRvciA9IHJlcXVpcmUoJy4uL2ludGVncmF0b3JzL1N5bXBsZWN0aWNFdWxlcicpO1xuZnVuY3Rpb24gUGFydGljbGUob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IoKTtcbiAgICB0aGlzLmZvcmNlID0gbmV3IFZlY3RvcigpO1xuICAgIHZhciBkZWZhdWx0cyA9IFBhcnRpY2xlLkRFRkFVTFRfT1BUSU9OUztcbiAgICB0aGlzLnNldFBvc2l0aW9uKG9wdGlvbnMucG9zaXRpb24gfHwgZGVmYXVsdHMucG9zaXRpb24pO1xuICAgIHRoaXMuc2V0VmVsb2NpdHkob3B0aW9ucy52ZWxvY2l0eSB8fCBkZWZhdWx0cy52ZWxvY2l0eSk7XG4gICAgdGhpcy5mb3JjZS5zZXQob3B0aW9ucy5mb3JjZSB8fCBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdKTtcbiAgICB0aGlzLm1hc3MgPSBvcHRpb25zLm1hc3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubWFzcyA6IGRlZmF1bHRzLm1hc3M7XG4gICAgdGhpcy5heGlzID0gb3B0aW9ucy5heGlzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmF4aXMgOiBkZWZhdWx0cy5heGlzO1xuICAgIHRoaXMuaW52ZXJzZU1hc3MgPSAxIC8gdGhpcy5tYXNzO1xuICAgIHRoaXMuX2lzU2xlZXBpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9lbmdpbmUgPSBudWxsO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbnVsbDtcbiAgICB0aGlzLl9wb3NpdGlvbkdldHRlciA9IG51bGw7XG4gICAgdGhpcy50cmFuc2Zvcm0gPSBUcmFuc2Zvcm0uaWRlbnRpdHkuc2xpY2UoKTtcbiAgICB0aGlzLl9zcGVjID0ge1xuICAgICAgICB0cmFuc2Zvcm06IHRoaXMudHJhbnNmb3JtLFxuICAgICAgICB0YXJnZXQ6IG51bGxcbiAgICB9O1xufVxuUGFydGljbGUuREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHBvc2l0aW9uOiBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdLFxuICAgIHZlbG9jaXR5OiBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdLFxuICAgIG1hc3M6IDEsXG4gICAgYXhpczogdW5kZWZpbmVkXG59O1xuUGFydGljbGUuU0xFRVBfVE9MRVJBTkNFID0gMWUtNztcblBhcnRpY2xlLkFYRVMgPSB7XG4gICAgWDogMCxcbiAgICBZOiAxLFxuICAgIFo6IDJcbn07XG5QYXJ0aWNsZS5JTlRFR1JBVE9SID0gbmV3IEludGVncmF0b3IoKTtcbnZhciBfZXZlbnRzID0ge1xuICAgICAgICBzdGFydDogJ3N0YXJ0JyxcbiAgICAgICAgdXBkYXRlOiAndXBkYXRlJyxcbiAgICAgICAgZW5kOiAnZW5kJ1xuICAgIH07XG52YXIgbm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3c7XG4gICAgfSgpO1xuUGFydGljbGUucHJvdG90eXBlLnNsZWVwID0gZnVuY3Rpb24gc2xlZXAoKSB7XG4gICAgaWYgKHRoaXMuX2lzU2xlZXBpbmcpXG4gICAgICAgIHJldHVybjtcbiAgICB0aGlzLmVtaXQoX2V2ZW50cy5lbmQsIHRoaXMpO1xuICAgIHRoaXMuX2lzU2xlZXBpbmcgPSB0cnVlO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS53YWtlID0gZnVuY3Rpb24gd2FrZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU2xlZXBpbmcpXG4gICAgICAgIHJldHVybjtcbiAgICB0aGlzLmVtaXQoX2V2ZW50cy5zdGFydCwgdGhpcyk7XG4gICAgdGhpcy5faXNTbGVlcGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX3ByZXZUaW1lID0gbm93KCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmlzQm9keSA9IGZhbHNlO1xuUGFydGljbGUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gc2V0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldChwb3NpdGlvbik7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnNldFBvc2l0aW9uMUQgPSBmdW5jdGlvbiBzZXRQb3NpdGlvbjFEKHgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSB4O1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIGdldFBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLl9wb3NpdGlvbkdldHRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uR2V0dGVyKCkpO1xuICAgIHRoaXMuX2VuZ2luZS5zdGVwKCk7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uZ2V0KCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmdldFBvc2l0aW9uMUQgPSBmdW5jdGlvbiBnZXRQb3NpdGlvbjFEKCkge1xuICAgIHRoaXMuX2VuZ2luZS5zdGVwKCk7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueDtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUucG9zaXRpb25Gcm9tID0gZnVuY3Rpb24gcG9zaXRpb25Gcm9tKHBvc2l0aW9uR2V0dGVyKSB7XG4gICAgdGhpcy5fcG9zaXRpb25HZXR0ZXIgPSBwb3NpdGlvbkdldHRlcjtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuc2V0VmVsb2NpdHkgPSBmdW5jdGlvbiBzZXRWZWxvY2l0eSh2ZWxvY2l0eSkge1xuICAgIHRoaXMudmVsb2NpdHkuc2V0KHZlbG9jaXR5KTtcbiAgICB0aGlzLndha2UoKTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuc2V0VmVsb2NpdHkxRCA9IGZ1bmN0aW9uIHNldFZlbG9jaXR5MUQoeCkge1xuICAgIHRoaXMudmVsb2NpdHkueCA9IHg7XG4gICAgdGhpcy53YWtlKCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmdldFZlbG9jaXR5ID0gZnVuY3Rpb24gZ2V0VmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmVsb2NpdHkuZ2V0KCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmdldFZlbG9jaXR5MUQgPSBmdW5jdGlvbiBnZXRWZWxvY2l0eTFEKCkge1xuICAgIHJldHVybiB0aGlzLnZlbG9jaXR5Lng7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnNldE1hc3MgPSBmdW5jdGlvbiBzZXRNYXNzKG1hc3MpIHtcbiAgICB0aGlzLm1hc3MgPSBtYXNzO1xuICAgIHRoaXMuaW52ZXJzZU1hc3MgPSAxIC8gbWFzcztcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuZ2V0TWFzcyA9IGZ1bmN0aW9uIGdldE1hc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFzcztcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldChwb3NpdGlvbiwgdmVsb2NpdHkpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKHBvc2l0aW9uIHx8IFtcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMFxuICAgIF0pO1xuICAgIHRoaXMuc2V0VmVsb2NpdHkodmVsb2NpdHkgfHwgW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXSk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmFwcGx5Rm9yY2UgPSBmdW5jdGlvbiBhcHBseUZvcmNlKGZvcmNlKSB7XG4gICAgaWYgKGZvcmNlLmlzWmVybygpKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5mb3JjZS5hZGQoZm9yY2UpLnB1dCh0aGlzLmZvcmNlKTtcbiAgICB0aGlzLndha2UoKTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuYXBwbHlJbXB1bHNlID0gZnVuY3Rpb24gYXBwbHlJbXB1bHNlKGltcHVsc2UpIHtcbiAgICBpZiAoaW1wdWxzZS5pc1plcm8oKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciB2ZWxvY2l0eSA9IHRoaXMudmVsb2NpdHk7XG4gICAgdmVsb2NpdHkuYWRkKGltcHVsc2UubXVsdCh0aGlzLmludmVyc2VNYXNzKSkucHV0KHZlbG9jaXR5KTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuaW50ZWdyYXRlVmVsb2NpdHkgPSBmdW5jdGlvbiBpbnRlZ3JhdGVWZWxvY2l0eShkdCkge1xuICAgIFBhcnRpY2xlLklOVEVHUkFUT1IuaW50ZWdyYXRlVmVsb2NpdHkodGhpcywgZHQpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5pbnRlZ3JhdGVQb3NpdGlvbiA9IGZ1bmN0aW9uIGludGVncmF0ZVBvc2l0aW9uKGR0KSB7XG4gICAgUGFydGljbGUuSU5URUdSQVRPUi5pbnRlZ3JhdGVQb3NpdGlvbih0aGlzLCBkdCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLl9pbnRlZ3JhdGUgPSBmdW5jdGlvbiBfaW50ZWdyYXRlKGR0KSB7XG4gICAgdGhpcy5pbnRlZ3JhdGVWZWxvY2l0eShkdCk7XG4gICAgdGhpcy5pbnRlZ3JhdGVQb3NpdGlvbihkdCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmdldEVuZXJneSA9IGZ1bmN0aW9uIGdldEVuZXJneSgpIHtcbiAgICByZXR1cm4gMC41ICogdGhpcy5tYXNzICogdGhpcy52ZWxvY2l0eS5ub3JtU3F1YXJlZCgpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm0gPSBmdW5jdGlvbiBnZXRUcmFuc2Zvcm0oKSB7XG4gICAgdGhpcy5fZW5naW5lLnN0ZXAoKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIHZhciBheGlzID0gdGhpcy5heGlzO1xuICAgIHZhciB0cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybTtcbiAgICBpZiAoYXhpcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChheGlzICYgflBhcnRpY2xlLkFYRVMuWCkge1xuICAgICAgICAgICAgcG9zaXRpb24ueCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF4aXMgJiB+UGFydGljbGUuQVhFUy5ZKSB7XG4gICAgICAgICAgICBwb3NpdGlvbi55ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXhpcyAmIH5QYXJ0aWNsZS5BWEVTLlopIHtcbiAgICAgICAgICAgIHBvc2l0aW9uLnogPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyYW5zZm9ybVsxMl0gPSBwb3NpdGlvbi54O1xuICAgIHRyYW5zZm9ybVsxM10gPSBwb3NpdGlvbi55O1xuICAgIHRyYW5zZm9ybVsxNF0gPSBwb3NpdGlvbi56O1xuICAgIHJldHVybiB0cmFuc2Zvcm07XG59O1xuUGFydGljbGUucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uIG1vZGlmeSh0YXJnZXQpIHtcbiAgICB2YXIgX3NwZWMgPSB0aGlzLl9zcGVjO1xuICAgIF9zcGVjLnRyYW5zZm9ybSA9IHRoaXMuZ2V0VHJhbnNmb3JtKCk7XG4gICAgX3NwZWMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHJldHVybiBfc3BlYztcbn07XG5mdW5jdGlvbiBfY3JlYXRlRXZlbnRPdXRwdXQoKSB7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuYmluZFRoaXModGhpcyk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xufVxuUGFydGljbGUucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50T3V0cHV0KVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCh0eXBlLCBkYXRhKTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5vbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnJlbW92ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnVucGlwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGU7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL0V2ZW50SGFuZGxlcicpO1xuZnVuY3Rpb24gQ29uc3RyYWludCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fZW5lcmd5ID0gMDtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG51bGw7XG59XG5Db25zdHJhaW50LnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpXG4gICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xufTtcbkNvbnN0cmFpbnQucHJvdG90eXBlLmFwcGx5Q29uc3RyYWludCA9IGZ1bmN0aW9uIGFwcGx5Q29uc3RyYWludCgpIHtcbn07XG5Db25zdHJhaW50LnByb3RvdHlwZS5nZXRFbmVyZ3kgPSBmdW5jdGlvbiBnZXRFbmVyZ3koKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuZXJneTtcbn07XG5Db25zdHJhaW50LnByb3RvdHlwZS5zZXRFbmVyZ3kgPSBmdW5jdGlvbiBzZXRFbmVyZ3koZW5lcmd5KSB7XG4gICAgdGhpcy5fZW5lcmd5ID0gZW5lcmd5O1xufTtcbmZ1bmN0aW9uIF9jcmVhdGVFdmVudE91dHB1dCgpIHtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5iaW5kVGhpcyh0aGlzKTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudE91dHB1dCk7XG59XG5Db25zdHJhaW50LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLm9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuQ29uc3RyYWludC5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkNvbnN0cmFpbnQucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5Db25zdHJhaW50LnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKCkge1xuICAgIHJldHVybiB0aGlzLnJlbW92ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuQ29uc3RyYWludC5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIHJldHVybiB0aGlzLnVucGlwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gQ29uc3RyYWludDsiLCJ2YXIgQ29uc3RyYWludCA9IHJlcXVpcmUoJy4vQ29uc3RyYWludCcpO1xudmFyIFZlY3RvciA9IHJlcXVpcmUoJ2ZhbW91cy9tYXRoL1ZlY3RvcicpO1xuZnVuY3Rpb24gU25hcChvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLmNvbnN0cnVjdG9yLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLnBEaWZmID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMudkRpZmYgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5pbXB1bHNlMSA9IG5ldyBWZWN0b3IoKTtcbiAgICB0aGlzLmltcHVsc2UyID0gbmV3IFZlY3RvcigpO1xuICAgIENvbnN0cmFpbnQuY2FsbCh0aGlzKTtcbn1cblNuYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb25zdHJhaW50LnByb3RvdHlwZSk7XG5TbmFwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNuYXA7XG5TbmFwLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBwZXJpb2Q6IDMwMCxcbiAgICBkYW1waW5nUmF0aW86IDAuMSxcbiAgICBsZW5ndGg6IDAsXG4gICAgYW5jaG9yOiB1bmRlZmluZWRcbn07XG52YXIgcGkgPSBNYXRoLlBJO1xuZnVuY3Rpb24gX2NhbGNFbmVyZ3koaW1wdWxzZSwgZGlzcCwgZHQpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoaW1wdWxzZS5kb3QoZGlzcCkgLyBkdCk7XG59XG5TbmFwLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuYW5jaG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYW5jaG9yIGluc3RhbmNlb2YgVmVjdG9yKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG9wdGlvbnMuYW5jaG9yO1xuICAgICAgICBpZiAob3B0aW9ucy5hbmNob3IucG9zaXRpb24gaW5zdGFuY2VvZiBWZWN0b3IpXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuYW5jaG9yID0gb3B0aW9ucy5hbmNob3IucG9zaXRpb247XG4gICAgICAgIGlmIChvcHRpb25zLmFuY2hvciBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG5ldyBWZWN0b3Iob3B0aW9ucy5hbmNob3IpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5sZW5ndGggIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLmxlbmd0aCA9IG9wdGlvbnMubGVuZ3RoO1xuICAgIGlmIChvcHRpb25zLmRhbXBpbmdSYXRpbyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZGFtcGluZ1JhdGlvID0gb3B0aW9ucy5kYW1waW5nUmF0aW87XG4gICAgaWYgKG9wdGlvbnMucGVyaW9kICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbn07XG5TbmFwLnByb3RvdHlwZS5zZXRBbmNob3IgPSBmdW5jdGlvbiBzZXRBbmNob3Iodikge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYW5jaG9yICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5hbmNob3IgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5vcHRpb25zLmFuY2hvci5zZXQodik7XG59O1xuU25hcC5wcm90b3R5cGUuZ2V0RW5lcmd5ID0gZnVuY3Rpb24gZ2V0RW5lcmd5KHRhcmdldCwgc291cmNlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHJlc3RMZW5ndGggPSBvcHRpb25zLmxlbmd0aDtcbiAgICB2YXIgYW5jaG9yID0gb3B0aW9ucy5hbmNob3IgfHwgc291cmNlLnBvc2l0aW9uO1xuICAgIHZhciBzdHJlbmd0aCA9IE1hdGgucG93KDIgKiBwaSAvIG9wdGlvbnMucGVyaW9kLCAyKTtcbiAgICB2YXIgZGlzdCA9IGFuY2hvci5zdWIodGFyZ2V0LnBvc2l0aW9uKS5ub3JtKCkgLSByZXN0TGVuZ3RoO1xuICAgIHJldHVybiAwLjUgKiBzdHJlbmd0aCAqIGRpc3QgKiBkaXN0O1xufTtcblNuYXAucHJvdG90eXBlLmFwcGx5Q29uc3RyYWludCA9IGZ1bmN0aW9uIGFwcGx5Q29uc3RyYWludCh0YXJnZXRzLCBzb3VyY2UsIGR0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHBEaWZmID0gdGhpcy5wRGlmZjtcbiAgICB2YXIgdkRpZmYgPSB0aGlzLnZEaWZmO1xuICAgIHZhciBpbXB1bHNlMSA9IHRoaXMuaW1wdWxzZTE7XG4gICAgdmFyIGltcHVsc2UyID0gdGhpcy5pbXB1bHNlMjtcbiAgICB2YXIgbGVuZ3RoID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgdmFyIGFuY2hvciA9IG9wdGlvbnMuYW5jaG9yIHx8IHNvdXJjZS5wb3NpdGlvbjtcbiAgICB2YXIgcGVyaW9kID0gb3B0aW9ucy5wZXJpb2Q7XG4gICAgdmFyIGRhbXBpbmdSYXRpbyA9IG9wdGlvbnMuZGFtcGluZ1JhdGlvO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGFyZ2V0c1tpXTtcbiAgICAgICAgdmFyIHAxID0gdGFyZ2V0LnBvc2l0aW9uO1xuICAgICAgICB2YXIgdjEgPSB0YXJnZXQudmVsb2NpdHk7XG4gICAgICAgIHZhciBtMSA9IHRhcmdldC5tYXNzO1xuICAgICAgICB2YXIgdzEgPSB0YXJnZXQuaW52ZXJzZU1hc3M7XG4gICAgICAgIHBEaWZmLnNldChwMS5zdWIoYW5jaG9yKSk7XG4gICAgICAgIHZhciBkaXN0ID0gcERpZmYubm9ybSgpIC0gbGVuZ3RoO1xuICAgICAgICB2YXIgZWZmTWFzcztcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIHcyID0gc291cmNlLmludmVyc2VNYXNzO1xuICAgICAgICAgICAgdmFyIHYyID0gc291cmNlLnZlbG9jaXR5O1xuICAgICAgICAgICAgdkRpZmYuc2V0KHYxLnN1Yih2MikpO1xuICAgICAgICAgICAgZWZmTWFzcyA9IDEgLyAodzEgKyB3Mik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2RGlmZi5zZXQodjEpO1xuICAgICAgICAgICAgZWZmTWFzcyA9IG0xO1xuICAgICAgICB9XG4gICAgICAgIHZhciBnYW1tYTtcbiAgICAgICAgdmFyIGJldGE7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVyaW9kID09PSAwKSB7XG4gICAgICAgICAgICBnYW1tYSA9IDA7XG4gICAgICAgICAgICBiZXRhID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrID0gNCAqIGVmZk1hc3MgKiBwaSAqIHBpIC8gKHBlcmlvZCAqIHBlcmlvZCk7XG4gICAgICAgICAgICB2YXIgYyA9IDQgKiBlZmZNYXNzICogcGkgKiBkYW1waW5nUmF0aW8gLyBwZXJpb2Q7XG4gICAgICAgICAgICBiZXRhID0gZHQgKiBrIC8gKGMgKyBkdCAqIGspO1xuICAgICAgICAgICAgZ2FtbWEgPSAxIC8gKGMgKyBkdCAqIGspO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnRpRHJpZnQgPSBiZXRhIC8gZHQgKiBkaXN0O1xuICAgICAgICBwRGlmZi5ub3JtYWxpemUoLWFudGlEcmlmdCkuc3ViKHZEaWZmKS5tdWx0KGR0IC8gKGdhbW1hICsgZHQgLyBlZmZNYXNzKSkucHV0KGltcHVsc2UxKTtcbiAgICAgICAgdGFyZ2V0LmFwcGx5SW1wdWxzZShpbXB1bHNlMSk7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGltcHVsc2UxLm11bHQoLTEpLnB1dChpbXB1bHNlMik7XG4gICAgICAgICAgICBzb3VyY2UuYXBwbHlJbXB1bHNlKGltcHVsc2UyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEVuZXJneShfY2FsY0VuZXJneShpbXB1bHNlMSwgcERpZmYsIGR0KSk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gU25hcDsiLCJ2YXIgQ29uc3RyYWludCA9IHJlcXVpcmUoJy4vQ29uc3RyYWludCcpO1xudmFyIFZlY3RvciA9IHJlcXVpcmUoJ2ZhbW91cy9tYXRoL1ZlY3RvcicpO1xuZnVuY3Rpb24gV2FsbChvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZShXYWxsLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLmRpZmYgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5pbXB1bHNlID0gbmV3IFZlY3RvcigpO1xuICAgIENvbnN0cmFpbnQuY2FsbCh0aGlzKTtcbn1cbldhbGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb25zdHJhaW50LnByb3RvdHlwZSk7XG5XYWxsLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdhbGw7XG5XYWxsLk9OX0NPTlRBQ1QgPSB7XG4gICAgUkVGTEVDVDogMCxcbiAgICBTSUxFTlQ6IDFcbn07XG5XYWxsLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICByZXN0aXR1dGlvbjogMC41LFxuICAgIGRyaWZ0OiAwLjUsXG4gICAgc2xvcDogMCxcbiAgICBub3JtYWw6IFtcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMFxuICAgIF0sXG4gICAgZGlzdGFuY2U6IDAsXG4gICAgb25Db250YWN0OiBXYWxsLk9OX0NPTlRBQ1QuUkVGTEVDVFxufTtcbldhbGwucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5ub3JtYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5ub3JtYWwgaW5zdGFuY2VvZiBWZWN0b3IpXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubm9ybWFsID0gb3B0aW9ucy5ub3JtYWwuY2xvbmUoKTtcbiAgICAgICAgaWYgKG9wdGlvbnMubm9ybWFsIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubm9ybWFsID0gbmV3IFZlY3RvcihvcHRpb25zLm5vcm1hbCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnJlc3RpdHV0aW9uICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5yZXN0aXR1dGlvbiA9IG9wdGlvbnMucmVzdGl0dXRpb247XG4gICAgaWYgKG9wdGlvbnMuZHJpZnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLmRyaWZ0ID0gb3B0aW9ucy5kcmlmdDtcbiAgICBpZiAob3B0aW9ucy5zbG9wICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5zbG9wID0gb3B0aW9ucy5zbG9wO1xuICAgIGlmIChvcHRpb25zLmRpc3RhbmNlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXN0YW5jZSA9IG9wdGlvbnMuZGlzdGFuY2U7XG4gICAgaWYgKG9wdGlvbnMub25Db250YWN0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkNvbnRhY3QgPSBvcHRpb25zLm9uQ29udGFjdDtcbn07XG5mdW5jdGlvbiBfZ2V0Tm9ybWFsVmVsb2NpdHkobiwgdikge1xuICAgIHJldHVybiB2LmRvdChuKTtcbn1cbmZ1bmN0aW9uIF9nZXREaXN0YW5jZUZyb21PcmlnaW4ocCkge1xuICAgIHZhciBuID0gdGhpcy5vcHRpb25zLm5vcm1hbDtcbiAgICB2YXIgZCA9IHRoaXMub3B0aW9ucy5kaXN0YW5jZTtcbiAgICByZXR1cm4gcC5kb3QobikgKyBkO1xufVxuZnVuY3Rpb24gX29uRW50ZXIocGFydGljbGUsIG92ZXJsYXAsIGR0KSB7XG4gICAgdmFyIHAgPSBwYXJ0aWNsZS5wb3NpdGlvbjtcbiAgICB2YXIgdiA9IHBhcnRpY2xlLnZlbG9jaXR5O1xuICAgIHZhciBtID0gcGFydGljbGUubWFzcztcbiAgICB2YXIgbiA9IHRoaXMub3B0aW9ucy5ub3JtYWw7XG4gICAgdmFyIGFjdGlvbiA9IHRoaXMub3B0aW9ucy5vbkNvbnRhY3Q7XG4gICAgdmFyIHJlc3RpdHV0aW9uID0gdGhpcy5vcHRpb25zLnJlc3RpdHV0aW9uO1xuICAgIHZhciBpbXB1bHNlID0gdGhpcy5pbXB1bHNlO1xuICAgIHZhciBkcmlmdCA9IHRoaXMub3B0aW9ucy5kcmlmdDtcbiAgICB2YXIgc2xvcCA9IC10aGlzLm9wdGlvbnMuc2xvcDtcbiAgICB2YXIgZ2FtbWEgPSAwO1xuICAgIGlmICh0aGlzLl9ldmVudE91dHB1dCkge1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZTogcGFydGljbGUsXG4gICAgICAgICAgICAgICAgd2FsbDogdGhpcyxcbiAgICAgICAgICAgICAgICBvdmVybGFwOiBvdmVybGFwLFxuICAgICAgICAgICAgICAgIG5vcm1hbDogblxuICAgICAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgncHJlQ29sbGlzaW9uJywgZGF0YSk7XG4gICAgICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ2NvbGxpc2lvbicsIGRhdGEpO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgIGNhc2UgV2FsbC5PTl9DT05UQUNULlJFRkxFQ1Q6XG4gICAgICAgIHZhciBsYW1iZGEgPSBvdmVybGFwIDwgc2xvcCA/IC0oKDEgKyByZXN0aXR1dGlvbikgKiBuLmRvdCh2KSArIGRyaWZ0IC8gZHQgKiAob3ZlcmxhcCAtIHNsb3ApKSAvIChtICogZHQgKyBnYW1tYSkgOiAtKCgxICsgcmVzdGl0dXRpb24pICogbi5kb3QodikpIC8gKG0gKiBkdCArIGdhbW1hKTtcbiAgICAgICAgaW1wdWxzZS5zZXQobi5tdWx0KGR0ICogbGFtYmRhKSk7XG4gICAgICAgIHBhcnRpY2xlLmFwcGx5SW1wdWxzZShpbXB1bHNlKTtcbiAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24ocC5hZGQobi5tdWx0KC1vdmVybGFwKSkpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2V2ZW50T3V0cHV0KVxuICAgICAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdwb3N0Q29sbGlzaW9uJywgZGF0YSk7XG59XG5mdW5jdGlvbiBfb25FeGl0KHBhcnRpY2xlLCBvdmVybGFwLCBkdCkge1xuICAgIHZhciBhY3Rpb24gPSB0aGlzLm9wdGlvbnMub25Db250YWN0O1xuICAgIHZhciBwID0gcGFydGljbGUucG9zaXRpb247XG4gICAgdmFyIG4gPSB0aGlzLm9wdGlvbnMubm9ybWFsO1xuICAgIGlmIChhY3Rpb24gPT09IFdhbGwuT05fQ09OVEFDVC5SRUZMRUNUKSB7XG4gICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHAuYWRkKG4ubXVsdCgtb3ZlcmxhcCkpKTtcbiAgICB9XG59XG5XYWxsLnByb3RvdHlwZS5hcHBseUNvbnN0cmFpbnQgPSBmdW5jdGlvbiBhcHBseUNvbnN0cmFpbnQodGFyZ2V0cywgc291cmNlLCBkdCkge1xuICAgIHZhciBuID0gdGhpcy5vcHRpb25zLm5vcm1hbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnRpY2xlID0gdGFyZ2V0c1tpXTtcbiAgICAgICAgdmFyIHAgPSBwYXJ0aWNsZS5wb3NpdGlvbjtcbiAgICAgICAgdmFyIHYgPSBwYXJ0aWNsZS52ZWxvY2l0eTtcbiAgICAgICAgdmFyIHIgPSBwYXJ0aWNsZS5yYWRpdXMgfHwgMDtcbiAgICAgICAgdmFyIG92ZXJsYXAgPSBfZ2V0RGlzdGFuY2VGcm9tT3JpZ2luLmNhbGwodGhpcywgcC5hZGQobi5tdWx0KC1yKSkpO1xuICAgICAgICB2YXIgbnYgPSBfZ2V0Tm9ybWFsVmVsb2NpdHkuY2FsbCh0aGlzLCBuLCB2KTtcbiAgICAgICAgaWYgKG92ZXJsYXAgPD0gMCkge1xuICAgICAgICAgICAgaWYgKG52IDwgMClcbiAgICAgICAgICAgICAgICBfb25FbnRlci5jYWxsKHRoaXMsIHBhcnRpY2xlLCBvdmVybGFwLCBkdCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX29uRXhpdC5jYWxsKHRoaXMsIHBhcnRpY2xlLCBvdmVybGFwLCBkdCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBXYWxsOyIsInZhciBWZWN0b3IgPSByZXF1aXJlKCdmYW1vdXMvbWF0aC9WZWN0b3InKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCdmYW1vdXMvY29yZS9FdmVudEhhbmRsZXInKTtcbmZ1bmN0aW9uIEZvcmNlKGZvcmNlKSB7XG4gICAgdGhpcy5mb3JjZSA9IG5ldyBWZWN0b3IoZm9yY2UpO1xuICAgIHRoaXMuX2VuZXJneSA9IDA7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBudWxsO1xufVxuRm9yY2UucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucylcbiAgICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG59O1xuRm9yY2UucHJvdG90eXBlLmFwcGx5Rm9yY2UgPSBmdW5jdGlvbiBhcHBseUZvcmNlKGJvZHkpIHtcbiAgICBib2R5LmFwcGx5Rm9yY2UodGhpcy5mb3JjZSk7XG59O1xuRm9yY2UucHJvdG90eXBlLmdldEVuZXJneSA9IGZ1bmN0aW9uIGdldEVuZXJneSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5lcmd5O1xufTtcbkZvcmNlLnByb3RvdHlwZS5zZXRFbmVyZ3kgPSBmdW5jdGlvbiBzZXRFbmVyZ3koZW5lcmd5KSB7XG4gICAgdGhpcy5fZW5lcmd5ID0gZW5lcmd5O1xufTtcbmZ1bmN0aW9uIF9jcmVhdGVFdmVudE91dHB1dCgpIHtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5iaW5kVGhpcyh0aGlzKTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLl9ldmVudE91dHB1dCk7XG59XG5Gb3JjZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5vbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkZvcmNlLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuRm9yY2UucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICAgIF9jcmVhdGVFdmVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5Gb3JjZS5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkZvcmNlLnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbiB1bnBpcGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudW5waXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBGb3JjZTsiLCJ2YXIgRm9yY2UgPSByZXF1aXJlKCcuL0ZvcmNlJyk7XG52YXIgVmVjdG9yID0gcmVxdWlyZSgnZmFtb3VzL21hdGgvVmVjdG9yJyk7XG5mdW5jdGlvbiBTcHJpbmcob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUodGhpcy5jb25zdHJ1Y3Rvci5ERUZBVUxUX09QVElPTlMpO1xuICAgIGlmIChvcHRpb25zKVxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwID0gbmV3IFZlY3RvcigwLCAwLCAwKTtcbiAgICBfaW5pdC5jYWxsKHRoaXMpO1xuICAgIEZvcmNlLmNhbGwodGhpcyk7XG59XG5TcHJpbmcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGb3JjZS5wcm90b3R5cGUpO1xuU3ByaW5nLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNwcmluZztcbnZhciBwaSA9IE1hdGguUEk7XG5TcHJpbmcuRk9SQ0VfRlVOQ1RJT05TID0ge1xuICAgIEZFTkU6IGZ1bmN0aW9uIChkaXN0LCByTWF4KSB7XG4gICAgICAgIHZhciByTWF4U21hbGwgPSByTWF4ICogMC45OTtcbiAgICAgICAgdmFyIHIgPSBNYXRoLm1heChNYXRoLm1pbihkaXN0LCByTWF4U21hbGwpLCAtck1heFNtYWxsKTtcbiAgICAgICAgcmV0dXJuIHIgLyAoMSAtIHIgKiByIC8gKHJNYXggKiByTWF4KSk7XG4gICAgfSxcbiAgICBIT09LOiBmdW5jdGlvbiAoZGlzdCkge1xuICAgICAgICByZXR1cm4gZGlzdDtcbiAgICB9XG59O1xuU3ByaW5nLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBwZXJpb2Q6IDMwMCxcbiAgICBkYW1waW5nUmF0aW86IDAuMSxcbiAgICBsZW5ndGg6IDAsXG4gICAgbWF4TGVuZ3RoOiBJbmZpbml0eSxcbiAgICBhbmNob3I6IHVuZGVmaW5lZCxcbiAgICBmb3JjZUZ1bmN0aW9uOiBTcHJpbmcuRk9SQ0VfRlVOQ1RJT05TLkhPT0tcbn07XG5mdW5jdGlvbiBfc2V0Rm9yY2VGdW5jdGlvbihmbikge1xuICAgIHRoaXMuZm9yY2VGdW5jdGlvbiA9IGZuO1xufVxuZnVuY3Rpb24gX2NhbGNTdGlmZm5lc3MoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgb3B0aW9ucy5zdGlmZm5lc3MgPSBNYXRoLnBvdygyICogcGkgLyBvcHRpb25zLnBlcmlvZCwgMik7XG59XG5mdW5jdGlvbiBfY2FsY0RhbXBpbmcoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgb3B0aW9ucy5kYW1waW5nID0gNCAqIHBpICogb3B0aW9ucy5kYW1waW5nUmF0aW8gLyBvcHRpb25zLnBlcmlvZDtcbn1cbmZ1bmN0aW9uIF9jYWxjRW5lcmd5KHN0cmVuZ3RoLCBkaXN0KSB7XG4gICAgcmV0dXJuIDAuNSAqIHN0cmVuZ3RoICogZGlzdCAqIGRpc3Q7XG59XG5mdW5jdGlvbiBfaW5pdCgpIHtcbiAgICBfc2V0Rm9yY2VGdW5jdGlvbi5jYWxsKHRoaXMsIHRoaXMub3B0aW9ucy5mb3JjZUZ1bmN0aW9uKTtcbiAgICBfY2FsY1N0aWZmbmVzcy5jYWxsKHRoaXMpO1xuICAgIF9jYWxjRGFtcGluZy5jYWxsKHRoaXMpO1xufVxuU3ByaW5nLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuYW5jaG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYW5jaG9yLnBvc2l0aW9uIGluc3RhbmNlb2YgVmVjdG9yKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG9wdGlvbnMuYW5jaG9yLnBvc2l0aW9uO1xuICAgICAgICBpZiAob3B0aW9ucy5hbmNob3IgaW5zdGFuY2VvZiBWZWN0b3IpXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuYW5jaG9yID0gb3B0aW9ucy5hbmNob3I7XG4gICAgICAgIGlmIChvcHRpb25zLmFuY2hvciBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG5ldyBWZWN0b3Iob3B0aW9ucy5hbmNob3IpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5wZXJpb2QgIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlcmlvZCA9IG9wdGlvbnMucGVyaW9kO1xuICAgIGlmIChvcHRpb25zLmRhbXBpbmdSYXRpbyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZGFtcGluZ1JhdGlvID0gb3B0aW9ucy5kYW1waW5nUmF0aW87XG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5sZW5ndGggPSBvcHRpb25zLmxlbmd0aDtcbiAgICBpZiAob3B0aW9ucy5mb3JjZUZ1bmN0aW9uICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5mb3JjZUZ1bmN0aW9uID0gb3B0aW9ucy5mb3JjZUZ1bmN0aW9uO1xuICAgIGlmIChvcHRpb25zLm1heExlbmd0aCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMubWF4TGVuZ3RoID0gb3B0aW9ucy5tYXhMZW5ndGg7XG4gICAgX2luaXQuY2FsbCh0aGlzKTtcbn07XG5TcHJpbmcucHJvdG90eXBlLmFwcGx5Rm9yY2UgPSBmdW5jdGlvbiBhcHBseUZvcmNlKHRhcmdldHMsIHNvdXJjZSkge1xuICAgIHZhciBmb3JjZSA9IHRoaXMuZm9yY2U7XG4gICAgdmFyIGRpc3AgPSB0aGlzLmRpc3A7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHN0aWZmbmVzcyA9IG9wdGlvbnMuc3RpZmZuZXNzO1xuICAgIHZhciBkYW1waW5nID0gb3B0aW9ucy5kYW1waW5nO1xuICAgIHZhciByZXN0TGVuZ3RoID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgdmFyIGxNYXggPSBvcHRpb25zLm1heExlbmd0aDtcbiAgICB2YXIgYW5jaG9yID0gb3B0aW9ucy5hbmNob3IgfHwgc291cmNlLnBvc2l0aW9uO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGFyZ2V0c1tpXTtcbiAgICAgICAgdmFyIHAyID0gdGFyZ2V0LnBvc2l0aW9uO1xuICAgICAgICB2YXIgdjIgPSB0YXJnZXQudmVsb2NpdHk7XG4gICAgICAgIGFuY2hvci5zdWIocDIpLnB1dChkaXNwKTtcbiAgICAgICAgdmFyIGRpc3QgPSBkaXNwLm5vcm0oKSAtIHJlc3RMZW5ndGg7XG4gICAgICAgIGlmIChkaXN0ID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgbSA9IHRhcmdldC5tYXNzO1xuICAgICAgICBzdGlmZm5lc3MgKj0gbTtcbiAgICAgICAgZGFtcGluZyAqPSBtO1xuICAgICAgICBkaXNwLm5vcm1hbGl6ZShzdGlmZm5lc3MgKiB0aGlzLmZvcmNlRnVuY3Rpb24oZGlzdCwgbE1heCkpLnB1dChmb3JjZSk7XG4gICAgICAgIGlmIChkYW1waW5nKVxuICAgICAgICAgICAgaWYgKHNvdXJjZSlcbiAgICAgICAgICAgICAgICBmb3JjZS5hZGQodjIuc3ViKHNvdXJjZS52ZWxvY2l0eSkubXVsdCgtZGFtcGluZykpLnB1dChmb3JjZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yY2UuYWRkKHYyLm11bHQoLWRhbXBpbmcpKS5wdXQoZm9yY2UpO1xuICAgICAgICB0YXJnZXQuYXBwbHlGb3JjZShmb3JjZSk7XG4gICAgICAgIGlmIChzb3VyY2UpXG4gICAgICAgICAgICBzb3VyY2UuYXBwbHlGb3JjZShmb3JjZS5tdWx0KC0xKSk7XG4gICAgICAgIHRoaXMuc2V0RW5lcmd5KF9jYWxjRW5lcmd5KHN0aWZmbmVzcywgZGlzdCkpO1xuICAgIH1cbn07XG5TcHJpbmcucHJvdG90eXBlLmdldEVuZXJneSA9IGZ1bmN0aW9uIGdldEVuZXJneSh0YXJnZXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgcmVzdExlbmd0aCA9IG9wdGlvbnMubGVuZ3RoO1xuICAgIHZhciBhbmNob3IgPSBvcHRpb25zLmFuY2hvcjtcbiAgICB2YXIgc3RyZW5ndGggPSBvcHRpb25zLnN0aWZmbmVzcztcbiAgICB2YXIgZGlzdCA9IGFuY2hvci5zdWIodGFyZ2V0LnBvc2l0aW9uKS5ub3JtKCkgLSByZXN0TGVuZ3RoO1xuICAgIHJldHVybiAwLjUgKiBzdHJlbmd0aCAqIGRpc3QgKiBkaXN0O1xufTtcblNwcmluZy5wcm90b3R5cGUuc2V0QW5jaG9yID0gZnVuY3Rpb24gc2V0QW5jaG9yKGFuY2hvcikge1xuICAgIGlmICghdGhpcy5vcHRpb25zLmFuY2hvcilcbiAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG5ldyBWZWN0b3IoKTtcbiAgICB0aGlzLm9wdGlvbnMuYW5jaG9yLnNldChhbmNob3IpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gU3ByaW5nOyIsInZhciBPcHRpb25zTWFuYWdlciA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL09wdGlvbnNNYW5hZ2VyJyk7XG5mdW5jdGlvbiBTeW1wbGVjdGljRXVsZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoU3ltcGxlY3RpY0V1bGVyLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgdGhpcy5fb3B0aW9uc01hbmFnZXIgPSBuZXcgT3B0aW9uc01hbmFnZXIodGhpcy5vcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xufVxuU3ltcGxlY3RpY0V1bGVyLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICB2ZWxvY2l0eUNhcDogdW5kZWZpbmVkLFxuICAgIGFuZ3VsYXJWZWxvY2l0eUNhcDogdW5kZWZpbmVkXG59O1xuU3ltcGxlY3RpY0V1bGVyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9uc01hbmFnZXIucGF0Y2gob3B0aW9ucyk7XG59O1xuU3ltcGxlY3RpY0V1bGVyLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc01hbmFnZXIudmFsdWUoKTtcbn07XG5TeW1wbGVjdGljRXVsZXIucHJvdG90eXBlLmludGVncmF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gaW50ZWdyYXRlVmVsb2NpdHkoYm9keSwgZHQpIHtcbiAgICB2YXIgdiA9IGJvZHkudmVsb2NpdHk7XG4gICAgdmFyIHcgPSBib2R5LmludmVyc2VNYXNzO1xuICAgIHZhciBmID0gYm9keS5mb3JjZTtcbiAgICBpZiAoZi5pc1plcm8oKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHYuYWRkKGYubXVsdChkdCAqIHcpKS5wdXQodik7XG4gICAgZi5jbGVhcigpO1xufTtcblN5bXBsZWN0aWNFdWxlci5wcm90b3R5cGUuaW50ZWdyYXRlUG9zaXRpb24gPSBmdW5jdGlvbiBpbnRlZ3JhdGVQb3NpdGlvbihib2R5LCBkdCkge1xuICAgIHZhciBwID0gYm9keS5wb3NpdGlvbjtcbiAgICB2YXIgdiA9IGJvZHkudmVsb2NpdHk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy52ZWxvY2l0eUNhcClcbiAgICAgICAgdi5jYXAodGhpcy5vcHRpb25zLnZlbG9jaXR5Q2FwKS5wdXQodik7XG4gICAgcC5hZGQodi5tdWx0KGR0KSkucHV0KHApO1xufTtcblN5bXBsZWN0aWNFdWxlci5wcm90b3R5cGUuaW50ZWdyYXRlQW5ndWxhck1vbWVudHVtID0gZnVuY3Rpb24gaW50ZWdyYXRlQW5ndWxhck1vbWVudHVtKGJvZHksIGR0KSB7XG4gICAgdmFyIEwgPSBib2R5LmFuZ3VsYXJNb21lbnR1bTtcbiAgICB2YXIgdCA9IGJvZHkudG9ycXVlO1xuICAgIGlmICh0LmlzWmVybygpKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hbmd1bGFyVmVsb2NpdHlDYXApXG4gICAgICAgIHQuY2FwKHRoaXMub3B0aW9ucy5hbmd1bGFyVmVsb2NpdHlDYXApLnB1dCh0KTtcbiAgICBMLmFkZCh0Lm11bHQoZHQpKS5wdXQoTCk7XG4gICAgdC5jbGVhcigpO1xufTtcblN5bXBsZWN0aWNFdWxlci5wcm90b3R5cGUuaW50ZWdyYXRlT3JpZW50YXRpb24gPSBmdW5jdGlvbiBpbnRlZ3JhdGVPcmllbnRhdGlvbihib2R5LCBkdCkge1xuICAgIHZhciBxID0gYm9keS5vcmllbnRhdGlvbjtcbiAgICB2YXIgdyA9IGJvZHkuYW5ndWxhclZlbG9jaXR5O1xuICAgIGlmICh3LmlzWmVybygpKVxuICAgICAgICByZXR1cm47XG4gICAgcS5hZGQocS5tdWx0aXBseSh3KS5zY2FsYXJNdWx0aXBseSgwLjUgKiBkdCkpLnB1dChxKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFN5bXBsZWN0aWNFdWxlcjsiLCJ2YXIgU3VyZmFjZSA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL1N1cmZhY2UnKTtcbnZhciBDb250ZXh0ID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvQ29udGV4dCcpO1xuZnVuY3Rpb24gQ29udGFpbmVyU3VyZmFjZShvcHRpb25zKSB7XG4gICAgU3VyZmFjZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdmYW1vdXMtZ3JvdXAnKTtcbiAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZmFtb3VzLWNvbnRhaW5lci1ncm91cCcpO1xuICAgIHRoaXMuX3Nob3VsZFJlY2FsY3VsYXRlU2l6ZSA9IGZhbHNlO1xuICAgIHRoaXMuY29udGV4dCA9IG5ldyBDb250ZXh0KHRoaXMuX2NvbnRhaW5lcik7XG4gICAgdGhpcy5zZXRDb250ZW50KHRoaXMuX2NvbnRhaW5lcik7XG59XG5Db250YWluZXJTdXJmYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3VyZmFjZS5wcm90b3R5cGUpO1xuQ29udGFpbmVyU3VyZmFjZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb250YWluZXJTdXJmYWNlO1xuQ29udGFpbmVyU3VyZmFjZS5wcm90b3R5cGUuZWxlbWVudFR5cGUgPSAnZGl2JztcbkNvbnRhaW5lclN1cmZhY2UucHJvdG90eXBlLmVsZW1lbnRDbGFzcyA9ICdmYW1vdXMtc3VyZmFjZSc7XG5Db250YWluZXJTdXJmYWNlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5hZGQuYXBwbHkodGhpcy5jb250ZXh0LCBhcmd1bWVudHMpO1xufTtcbkNvbnRhaW5lclN1cmZhY2UucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5fc2l6ZURpcnR5KVxuICAgICAgICB0aGlzLl9zaG91bGRSZWNhbGN1bGF0ZVNpemUgPSB0cnVlO1xuICAgIHJldHVybiBTdXJmYWNlLnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5Db250YWluZXJTdXJmYWNlLnByb3RvdHlwZS5kZXBsb3kgPSBmdW5jdGlvbiBkZXBsb3koKSB7XG4gICAgdGhpcy5fc2hvdWxkUmVjYWxjdWxhdGVTaXplID0gdHJ1ZTtcbiAgICByZXR1cm4gU3VyZmFjZS5wcm90b3R5cGUuZGVwbG95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuQ29udGFpbmVyU3VyZmFjZS5wcm90b3R5cGUuY29tbWl0ID0gZnVuY3Rpb24gY29tbWl0KGNvbnRleHQsIHRyYW5zZm9ybSwgb3BhY2l0eSwgb3JpZ2luLCBzaXplKSB7XG4gICAgdmFyIHByZXZpb3VzU2l6ZSA9IHRoaXMuX3NpemUgPyBbXG4gICAgICAgICAgICB0aGlzLl9zaXplWzBdLFxuICAgICAgICAgICAgdGhpcy5fc2l6ZVsxXVxuICAgICAgICBdIDogbnVsbDtcbiAgICB2YXIgcmVzdWx0ID0gU3VyZmFjZS5wcm90b3R5cGUuY29tbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHRoaXMuX3Nob3VsZFJlY2FsY3VsYXRlU2l6ZSB8fCBwcmV2aW91c1NpemUgJiYgKHRoaXMuX3NpemVbMF0gIT09IHByZXZpb3VzU2l6ZVswXSB8fCB0aGlzLl9zaXplWzFdICE9PSBwcmV2aW91c1NpemVbMV0pKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zZXRTaXplKCk7XG4gICAgICAgIHRoaXMuX3Nob3VsZFJlY2FsY3VsYXRlU2l6ZSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmNvbnRleHQudXBkYXRlKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhaW5lclN1cmZhY2U7IiwidmFyIFN1cmZhY2UgPSByZXF1aXJlKCdmYW1vdXMvY29yZS9TdXJmYWNlJyk7XG5mdW5jdGlvbiBJbWFnZVN1cmZhY2Uob3B0aW9ucykge1xuICAgIHRoaXMuX2ltYWdlVXJsID0gdW5kZWZpbmVkO1xuICAgIFN1cmZhY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cbnZhciB1cmxDYWNoZSA9IFtdO1xudmFyIGNvdW50Q2FjaGUgPSBbXTtcbnZhciBub2RlQ2FjaGUgPSBbXTtcbnZhciBjYWNoZUVuYWJsZWQgPSB0cnVlO1xuSW1hZ2VTdXJmYWNlLmVuYWJsZUNhY2hlID0gZnVuY3Rpb24gZW5hYmxlQ2FjaGUoKSB7XG4gICAgY2FjaGVFbmFibGVkID0gdHJ1ZTtcbn07XG5JbWFnZVN1cmZhY2UuZGlzYWJsZUNhY2hlID0gZnVuY3Rpb24gZGlzYWJsZUNhY2hlKCkge1xuICAgIGNhY2hlRW5hYmxlZCA9IGZhbHNlO1xufTtcbkltYWdlU3VyZmFjZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gY2xlYXJDYWNoZSgpIHtcbiAgICB1cmxDYWNoZSA9IFtdO1xuICAgIGNvdW50Q2FjaGUgPSBbXTtcbiAgICBub2RlQ2FjaGUgPSBbXTtcbn07XG5JbWFnZVN1cmZhY2UuZ2V0Q2FjaGUgPSBmdW5jdGlvbiBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB1cmxDYWNoZTogdXJsQ2FjaGUsXG4gICAgICAgIGNvdW50Q2FjaGU6IGNvdW50Q2FjaGUsXG4gICAgICAgIG5vZGVDYWNoZTogY291bnRDYWNoZVxuICAgIH07XG59O1xuSW1hZ2VTdXJmYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3VyZmFjZS5wcm90b3R5cGUpO1xuSW1hZ2VTdXJmYWNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEltYWdlU3VyZmFjZTtcbkltYWdlU3VyZmFjZS5wcm90b3R5cGUuZWxlbWVudFR5cGUgPSAnaW1nJztcbkltYWdlU3VyZmFjZS5wcm90b3R5cGUuZWxlbWVudENsYXNzID0gJ2ZhbW91cy1zdXJmYWNlJztcbkltYWdlU3VyZmFjZS5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uIHNldENvbnRlbnQoaW1hZ2VVcmwpIHtcbiAgICB2YXIgdXJsSW5kZXggPSB1cmxDYWNoZS5pbmRleE9mKHRoaXMuX2ltYWdlVXJsKTtcbiAgICBpZiAodXJsSW5kZXggIT09IC0xKSB7XG4gICAgICAgIGlmIChjb3VudENhY2hlW3VybEluZGV4XSA9PT0gMSkge1xuICAgICAgICAgICAgdXJsQ2FjaGUuc3BsaWNlKHVybEluZGV4LCAxKTtcbiAgICAgICAgICAgIGNvdW50Q2FjaGUuc3BsaWNlKHVybEluZGV4LCAxKTtcbiAgICAgICAgICAgIG5vZGVDYWNoZS5zcGxpY2UodXJsSW5kZXgsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRDYWNoZVt1cmxJbmRleF0tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cmxJbmRleCA9IHVybENhY2hlLmluZGV4T2YoaW1hZ2VVcmwpO1xuICAgIGlmICh1cmxJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgdXJsQ2FjaGUucHVzaChpbWFnZVVybCk7XG4gICAgICAgIGNvdW50Q2FjaGUucHVzaCgxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb3VudENhY2hlW3VybEluZGV4XSsrO1xuICAgIH1cbiAgICB0aGlzLl9pbWFnZVVybCA9IGltYWdlVXJsO1xuICAgIHRoaXMuX2NvbnRlbnREaXJ0eSA9IHRydWU7XG59O1xuSW1hZ2VTdXJmYWNlLnByb3RvdHlwZS5kZXBsb3kgPSBmdW5jdGlvbiBkZXBsb3kodGFyZ2V0KSB7XG4gICAgdmFyIHVybEluZGV4ID0gdXJsQ2FjaGUuaW5kZXhPZih0aGlzLl9pbWFnZVVybCk7XG4gICAgaWYgKG5vZGVDYWNoZVt1cmxJbmRleF0gPT09IHVuZGVmaW5lZCAmJiBjYWNoZUVuYWJsZWQpIHtcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBpbWcuc3JjID0gdGhpcy5faW1hZ2VVcmwgfHwgJyc7XG4gICAgICAgIG5vZGVDYWNoZVt1cmxJbmRleF0gPSBpbWc7XG4gICAgfVxuICAgIHRhcmdldC5zcmMgPSB0aGlzLl9pbWFnZVVybCB8fCAnJztcbn07XG5JbWFnZVN1cmZhY2UucHJvdG90eXBlLnJlY2FsbCA9IGZ1bmN0aW9uIHJlY2FsbCh0YXJnZXQpIHtcbiAgICB0YXJnZXQuc3JjID0gJyc7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBJbWFnZVN1cmZhY2U7IiwidmFyIEVhc2luZyA9IHtcbiAgICAgICAgaW5RdWFkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgKiB0O1xuICAgICAgICB9LFxuICAgICAgICBvdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIC0odCAtPSAxKSAqIHQgKyAxO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dFF1YWQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAoKHQgLz0gMC41KSA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0O1xuICAgICAgICAgICAgcmV0dXJuIC0wLjUgKiAoLS10ICogKHQgLSAyKSAtIDEpO1xuICAgICAgICB9LFxuICAgICAgICBpbkN1YmljOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgKiB0ICogdDtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0Q3ViaWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gLS10ICogdCAqIHQgKyAxO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiB0ICogdCAqIHQ7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqIHQgKyAyKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5RdWFydDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICogdCAqIHQgKiB0O1xuICAgICAgICB9LFxuICAgICAgICBvdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtKC0tdCAqIHQgKiB0ICogdCAtIDEpO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dFF1YXJ0OiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0O1xuICAgICAgICAgICAgcmV0dXJuIC0wLjUgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgLSAyKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5RdWludDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICogdCAqIHQgKiB0ICogdDtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gLS10ICogdCAqIHQgKiB0ICogdCArIDE7XG4gICAgICAgIH0sXG4gICAgICAgIGluT3V0UXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAoKHQgLz0gMC41KSA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0ICogdCAqIHQgKiB0O1xuICAgICAgICAgICAgcmV0dXJuIDAuNSAqICgodCAtPSAyKSAqIHQgKiB0ICogdCAqIHQgKyAyKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5TaW5lOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xICogTWF0aC5jb3ModCAqIChNYXRoLlBJIC8gMikpICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0U2luZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNpbih0ICogKE1hdGguUEkgLyAyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGluT3V0U2luZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtMC41ICogKE1hdGguY29zKE1hdGguUEkgKiB0KSAtIDEpO1xuICAgICAgICB9LFxuICAgICAgICBpbkV4cG86IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdCA9PT0gMCA/IDAgOiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuICAgICAgICB9LFxuICAgICAgICBvdXRFeHBvOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgPT09IDEgPyAxIDogLU1hdGgucG93KDIsIC0xMCAqIHQpICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5PdXRFeHBvOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKHQgPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICBpZiAodCA9PT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmICgodCAvPSAwLjUpIDwgMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKTtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5DaXJjOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0Q2lyYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoMSAtIC0tdCAqIHQpO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dENpcmM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAoKHQgLz0gMC41KSA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKTtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodCAtPSAyKSAqIHQpICsgMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGluRWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIHZhciBwID0gMDtcbiAgICAgICAgICAgIHZhciBhID0gMTtcbiAgICAgICAgICAgIGlmICh0ID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKHQgPT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoIXApXG4gICAgICAgICAgICAgICAgcCA9IDAuMztcbiAgICAgICAgICAgIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG4gICAgICAgICAgICByZXR1cm4gLShhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0RWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIHZhciBwID0gMDtcbiAgICAgICAgICAgIHZhciBhID0gMTtcbiAgICAgICAgICAgIGlmICh0ID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKHQgPT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoIXApXG4gICAgICAgICAgICAgICAgcCA9IDAuMztcbiAgICAgICAgICAgIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG4gICAgICAgICAgICByZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqIHQpICogTWF0aC5zaW4oKHQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIDE7XG4gICAgICAgIH0sXG4gICAgICAgIGluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIHZhciBwID0gMDtcbiAgICAgICAgICAgIHZhciBhID0gMTtcbiAgICAgICAgICAgIGlmICh0ID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPT09IDIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoIXApXG4gICAgICAgICAgICAgICAgcCA9IDAuMyAqIDEuNTtcbiAgICAgICAgICAgIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbigxIC8gYSk7XG4gICAgICAgICAgICBpZiAodCA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0wLjUgKiAoYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSk7XG4gICAgICAgICAgICByZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0IC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKiAwLjUgKyAxO1xuICAgICAgICB9LFxuICAgICAgICBpbkJhY2s6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHMgPSAxLjcwMTU4O1xuICAgICAgICAgICAgcmV0dXJuIHQgKiB0ICogKChzICsgMSkgKiB0IC0gcyk7XG4gICAgICAgIH0sXG4gICAgICAgIG91dEJhY2s6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHMgPSAxLjcwMTU4O1xuICAgICAgICAgICAgcmV0dXJuIC0tdCAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDE7XG4gICAgICAgIH0sXG4gICAgICAgIGluT3V0QmFjazogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgICAgIGlmIChzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICBpZiAoKHQgLz0gMC41KSA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpO1xuICAgICAgICAgICAgcmV0dXJuIDAuNSAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMik7XG4gICAgICAgIH0sXG4gICAgICAgIGluQm91bmNlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIDEgLSBFYXNpbmcub3V0Qm91bmNlKDEgLSB0KTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0Qm91bmNlOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKHQgPCAxIC8gMi43NSkge1xuICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiB0ICogdDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodCA8IDIgLyAyLjc1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICh0IC09IDEuNSAvIDIuNzUpICogdCArIDAuNzU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHQgPCAyLjUgLyAyLjc1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICh0IC09IDIuMjUgLyAyLjc1KSAqIHQgKyAwLjkzNzU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAodCAtPSAyLjYyNSAvIDIuNzUpICogdCArIDAuOTg0Mzc1O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbk91dEJvdW5jZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0IDwgMC41KVxuICAgICAgICAgICAgICAgIHJldHVybiBFYXNpbmcuaW5Cb3VuY2UodCAqIDIpICogMC41O1xuICAgICAgICAgICAgcmV0dXJuIEVhc2luZy5vdXRCb3VuY2UodCAqIDIgLSAxKSAqIDAuNSArIDAuNTtcbiAgICAgICAgfVxuICAgIH07XG5tb2R1bGUuZXhwb3J0cyA9IEVhc2luZzsiLCJ2YXIgVXRpbGl0eSA9IHJlcXVpcmUoJ2ZhbW91cy91dGlsaXRpZXMvVXRpbGl0eScpO1xuZnVuY3Rpb24gTXVsdGlwbGVUcmFuc2l0aW9uKG1ldGhvZCkge1xuICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgIHRoaXMuX2luc3RhbmNlcyA9IFtdO1xuICAgIHRoaXMuc3RhdGUgPSBbXTtcbn1cbk11bHRpcGxlVHJhbnNpdGlvbi5TVVBQT1JUU19NVUxUSVBMRSA9IHRydWU7XG5NdWx0aXBsZVRyYW5zaXRpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2luc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnN0YXRlW2ldID0gdGhpcy5faW5zdGFuY2VzW2ldLmdldCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbn07XG5NdWx0aXBsZVRyYW5zaXRpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChlbmRTdGF0ZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICB2YXIgX2FsbENhbGxiYWNrID0gVXRpbGl0eS5hZnRlcihlbmRTdGF0ZS5sZW5ndGgsIGNhbGxiYWNrKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZFN0YXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5zdGFuY2VzW2ldKVxuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2VzW2ldID0gbmV3IHRoaXMubWV0aG9kKCk7XG4gICAgICAgIHRoaXMuX2luc3RhbmNlc1tpXS5zZXQoZW5kU3RhdGVbaV0sIHRyYW5zaXRpb24sIF9hbGxDYWxsYmFjayk7XG4gICAgfVxufTtcbk11bHRpcGxlVHJhbnNpdGlvbi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldChzdGFydFN0YXRlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFydFN0YXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5zdGFuY2VzW2ldKVxuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2VzW2ldID0gbmV3IHRoaXMubWV0aG9kKCk7XG4gICAgICAgIHRoaXMuX2luc3RhbmNlc1tpXS5yZXNldChzdGFydFN0YXRlW2ldKTtcbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNdWx0aXBsZVRyYW5zaXRpb247IiwidmFyIFBFID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvUGh5c2ljc0VuZ2luZScpO1xudmFyIFBhcnRpY2xlID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvYm9kaWVzL1BhcnRpY2xlJyk7XG52YXIgU3ByaW5nID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvY29uc3RyYWludHMvU25hcCcpO1xudmFyIFZlY3RvciA9IHJlcXVpcmUoJ2ZhbW91cy9tYXRoL1ZlY3RvcicpO1xuZnVuY3Rpb24gU25hcFRyYW5zaXRpb24oc3RhdGUpIHtcbiAgICBzdGF0ZSA9IHN0YXRlIHx8IDA7XG4gICAgdGhpcy5lbmRTdGF0ZSA9IG5ldyBWZWN0b3Ioc3RhdGUpO1xuICAgIHRoaXMuaW5pdFN0YXRlID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSAxO1xuICAgIHRoaXMuX3Jlc3RUb2xlcmFuY2UgPSAxZS0xMDtcbiAgICB0aGlzLl9hYnNSZXN0VG9sZXJhbmNlID0gdGhpcy5fcmVzdFRvbGVyYW5jZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLlBFID0gbmV3IFBFKCk7XG4gICAgdGhpcy5wYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZSgpO1xuICAgIHRoaXMuc3ByaW5nID0gbmV3IFNwcmluZyh7IGFuY2hvcjogdGhpcy5lbmRTdGF0ZSB9KTtcbiAgICB0aGlzLlBFLmFkZEJvZHkodGhpcy5wYXJ0aWNsZSk7XG4gICAgdGhpcy5QRS5hdHRhY2godGhpcy5zcHJpbmcsIHRoaXMucGFydGljbGUpO1xufVxuU25hcFRyYW5zaXRpb24uU1VQUE9SVFNfTVVMVElQTEUgPSAzO1xuU25hcFRyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHBlcmlvZDogMTAwLFxuICAgIGRhbXBpbmdSYXRpbzogMC4yLFxuICAgIHZlbG9jaXR5OiAwXG59O1xuZnVuY3Rpb24gX2dldEVuZXJneSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZS5nZXRFbmVyZ3koKSArIHRoaXMuc3ByaW5nLmdldEVuZXJneSh0aGlzLnBhcnRpY2xlKTtcbn1cbmZ1bmN0aW9uIF9zZXRBYnNvbHV0ZVJlc3RUb2xlcmFuY2UoKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gdGhpcy5lbmRTdGF0ZS5zdWIodGhpcy5pbml0U3RhdGUpLm5vcm1TcXVhcmVkKCk7XG4gICAgdGhpcy5fYWJzUmVzdFRvbGVyYW5jZSA9IGRpc3RhbmNlID09PSAwID8gdGhpcy5fcmVzdFRvbGVyYW5jZSA6IHRoaXMuX3Jlc3RUb2xlcmFuY2UgKiBkaXN0YW5jZTtcbn1cbmZ1bmN0aW9uIF9zZXRUYXJnZXQodGFyZ2V0KSB7XG4gICAgdGhpcy5lbmRTdGF0ZS5zZXQodGFyZ2V0KTtcbiAgICBfc2V0QWJzb2x1dGVSZXN0VG9sZXJhbmNlLmNhbGwodGhpcyk7XG59XG5mdW5jdGlvbiBfd2FrZSgpIHtcbiAgICB0aGlzLlBFLndha2UoKTtcbn1cbmZ1bmN0aW9uIF9zbGVlcCgpIHtcbiAgICB0aGlzLlBFLnNsZWVwKCk7XG59XG5mdW5jdGlvbiBfc2V0UGFydGljbGVQb3NpdGlvbihwKSB7XG4gICAgdGhpcy5wYXJ0aWNsZS5wb3NpdGlvbi5zZXQocCk7XG59XG5mdW5jdGlvbiBfc2V0UGFydGljbGVWZWxvY2l0eSh2KSB7XG4gICAgdGhpcy5wYXJ0aWNsZS52ZWxvY2l0eS5zZXQodik7XG59XG5mdW5jdGlvbiBfZ2V0UGFydGljbGVQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGltZW5zaW9ucyA9PT0gMCA/IHRoaXMucGFydGljbGUuZ2V0UG9zaXRpb24xRCgpIDogdGhpcy5wYXJ0aWNsZS5nZXRQb3NpdGlvbigpO1xufVxuZnVuY3Rpb24gX2dldFBhcnRpY2xlVmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnMgPT09IDAgPyB0aGlzLnBhcnRpY2xlLmdldFZlbG9jaXR5MUQoKSA6IHRoaXMucGFydGljbGUuZ2V0VmVsb2NpdHkoKTtcbn1cbmZ1bmN0aW9uIF9zZXRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBfc2V0dXBEZWZpbml0aW9uKGRlZmluaXRpb24pIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBTbmFwVHJhbnNpdGlvbi5ERUZBVUxUX09QVElPTlM7XG4gICAgaWYgKGRlZmluaXRpb24ucGVyaW9kID09PSB1bmRlZmluZWQpXG4gICAgICAgIGRlZmluaXRpb24ucGVyaW9kID0gZGVmYXVsdHMucGVyaW9kO1xuICAgIGlmIChkZWZpbml0aW9uLmRhbXBpbmdSYXRpbyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBkZWZpbml0aW9uLmRhbXBpbmdSYXRpbyA9IGRlZmF1bHRzLmRhbXBpbmdSYXRpbztcbiAgICBpZiAoZGVmaW5pdGlvbi52ZWxvY2l0eSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBkZWZpbml0aW9uLnZlbG9jaXR5ID0gZGVmYXVsdHMudmVsb2NpdHk7XG4gICAgdGhpcy5zcHJpbmcuc2V0T3B0aW9ucyh7XG4gICAgICAgIHBlcmlvZDogZGVmaW5pdGlvbi5wZXJpb2QsXG4gICAgICAgIGRhbXBpbmdSYXRpbzogZGVmaW5pdGlvbi5kYW1waW5nUmF0aW9cbiAgICB9KTtcbiAgICBfc2V0UGFydGljbGVWZWxvY2l0eS5jYWxsKHRoaXMsIGRlZmluaXRpb24udmVsb2NpdHkpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5QRS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2IgPSB0aGlzLl9jYWxsYmFjaztcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfZ2V0RW5lcmd5LmNhbGwodGhpcykgPCB0aGlzLl9hYnNSZXN0VG9sZXJhbmNlKSB7XG4gICAgICAgIF9zZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcywgdGhpcy5lbmRTdGF0ZSk7XG4gICAgICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF0pO1xuICAgICAgICBfc2xlZXAuY2FsbCh0aGlzKTtcbiAgICB9XG59XG5TbmFwVHJhbnNpdGlvbi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldChzdGF0ZSwgdmVsb2NpdHkpIHtcbiAgICB0aGlzLl9kaW1lbnNpb25zID0gc3RhdGUgaW5zdGFuY2VvZiBBcnJheSA/IHN0YXRlLmxlbmd0aCA6IDA7XG4gICAgdGhpcy5pbml0U3RhdGUuc2V0KHN0YXRlKTtcbiAgICBfc2V0UGFydGljbGVQb3NpdGlvbi5jYWxsKHRoaXMsIHN0YXRlKTtcbiAgICBfc2V0VGFyZ2V0LmNhbGwodGhpcywgc3RhdGUpO1xuICAgIGlmICh2ZWxvY2l0eSlcbiAgICAgICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCB2ZWxvY2l0eSk7XG4gICAgX3NldENhbGxiYWNrLmNhbGwodGhpcywgdW5kZWZpbmVkKTtcbn07XG5TbmFwVHJhbnNpdGlvbi5wcm90b3R5cGUuZ2V0VmVsb2NpdHkgPSBmdW5jdGlvbiBnZXRWZWxvY2l0eSgpIHtcbiAgICByZXR1cm4gX2dldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzKTtcbn07XG5TbmFwVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0VmVsb2NpdHkgPSBmdW5jdGlvbiBzZXRWZWxvY2l0eSh2ZWxvY2l0eSkge1xuICAgIHRoaXMuY2FsbCh0aGlzLCBfc2V0UGFydGljbGVWZWxvY2l0eSh2ZWxvY2l0eSkpO1xufTtcblNuYXBUcmFuc2l0aW9uLnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgIHJldHVybiAhdGhpcy5QRS5pc1NsZWVwaW5nKCk7XG59O1xuU25hcFRyYW5zaXRpb24ucHJvdG90eXBlLmhhbHQgPSBmdW5jdGlvbiBoYWx0KCkge1xuICAgIHRoaXMuc2V0KHRoaXMuZ2V0KCkpO1xufTtcblNuYXBUcmFuc2l0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoKSB7XG4gICAgX3VwZGF0ZS5jYWxsKHRoaXMpO1xuICAgIHJldHVybiBfZ2V0UGFydGljbGVQb3NpdGlvbi5jYWxsKHRoaXMpO1xufTtcblNuYXBUcmFuc2l0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoc3RhdGUsIGRlZmluaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICAgIHRoaXMucmVzZXQoc3RhdGUpO1xuICAgICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSBzdGF0ZSBpbnN0YW5jZW9mIEFycmF5ID8gc3RhdGUubGVuZ3RoIDogMDtcbiAgICBfd2FrZS5jYWxsKHRoaXMpO1xuICAgIF9zZXR1cERlZmluaXRpb24uY2FsbCh0aGlzLCBkZWZpbml0aW9uKTtcbiAgICBfc2V0VGFyZ2V0LmNhbGwodGhpcywgc3RhdGUpO1xuICAgIF9zZXRDYWxsYmFjay5jYWxsKHRoaXMsIGNhbGxiYWNrKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFNuYXBUcmFuc2l0aW9uOyIsInZhciBQRSA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL1BoeXNpY3NFbmdpbmUnKTtcbnZhciBQYXJ0aWNsZSA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL2JvZGllcy9QYXJ0aWNsZScpO1xudmFyIFNwcmluZyA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL2ZvcmNlcy9TcHJpbmcnKTtcbnZhciBWZWN0b3IgPSByZXF1aXJlKCdmYW1vdXMvbWF0aC9WZWN0b3InKTtcbmZ1bmN0aW9uIFNwcmluZ1RyYW5zaXRpb24oc3RhdGUpIHtcbiAgICBzdGF0ZSA9IHN0YXRlIHx8IDA7XG4gICAgdGhpcy5lbmRTdGF0ZSA9IG5ldyBWZWN0b3Ioc3RhdGUpO1xuICAgIHRoaXMuaW5pdFN0YXRlID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcmVzdFRvbGVyYW5jZSA9IDFlLTEwO1xuICAgIHRoaXMuX2Fic1Jlc3RUb2xlcmFuY2UgPSB0aGlzLl9yZXN0VG9sZXJhbmNlO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuUEUgPSBuZXcgUEUoKTtcbiAgICB0aGlzLnNwcmluZyA9IG5ldyBTcHJpbmcoeyBhbmNob3I6IHRoaXMuZW5kU3RhdGUgfSk7XG4gICAgdGhpcy5wYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZSgpO1xuICAgIHRoaXMuUEUuYWRkQm9keSh0aGlzLnBhcnRpY2xlKTtcbiAgICB0aGlzLlBFLmF0dGFjaCh0aGlzLnNwcmluZywgdGhpcy5wYXJ0aWNsZSk7XG59XG5TcHJpbmdUcmFuc2l0aW9uLlNVUFBPUlRTX01VTFRJUExFID0gMztcblNwcmluZ1RyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHBlcmlvZDogMzAwLFxuICAgIGRhbXBpbmdSYXRpbzogMC41LFxuICAgIHZlbG9jaXR5OiAwXG59O1xuZnVuY3Rpb24gX2dldEVuZXJneSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZS5nZXRFbmVyZ3koKSArIHRoaXMuc3ByaW5nLmdldEVuZXJneSh0aGlzLnBhcnRpY2xlKTtcbn1cbmZ1bmN0aW9uIF9zZXRQYXJ0aWNsZVBvc2l0aW9uKHApIHtcbiAgICB0aGlzLnBhcnRpY2xlLnNldFBvc2l0aW9uKHApO1xufVxuZnVuY3Rpb24gX3NldFBhcnRpY2xlVmVsb2NpdHkodikge1xuICAgIHRoaXMucGFydGljbGUuc2V0VmVsb2NpdHkodik7XG59XG5mdW5jdGlvbiBfZ2V0UGFydGljbGVQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGltZW5zaW9ucyA9PT0gMCA/IHRoaXMucGFydGljbGUuZ2V0UG9zaXRpb24xRCgpIDogdGhpcy5wYXJ0aWNsZS5nZXRQb3NpdGlvbigpO1xufVxuZnVuY3Rpb24gX2dldFBhcnRpY2xlVmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnMgPT09IDAgPyB0aGlzLnBhcnRpY2xlLmdldFZlbG9jaXR5MUQoKSA6IHRoaXMucGFydGljbGUuZ2V0VmVsb2NpdHkoKTtcbn1cbmZ1bmN0aW9uIF9zZXRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBfd2FrZSgpIHtcbiAgICB0aGlzLlBFLndha2UoKTtcbn1cbmZ1bmN0aW9uIF9zbGVlcCgpIHtcbiAgICB0aGlzLlBFLnNsZWVwKCk7XG59XG5mdW5jdGlvbiBfdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLlBFLmlzU2xlZXBpbmcoKSkge1xuICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBjYiA9IHRoaXMuX2NhbGxiYWNrO1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKF9nZXRFbmVyZ3kuY2FsbCh0aGlzKSA8IHRoaXMuX2Fic1Jlc3RUb2xlcmFuY2UpIHtcbiAgICAgICAgX3NldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzLCB0aGlzLmVuZFN0YXRlKTtcbiAgICAgICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXSk7XG4gICAgICAgIF9zbGVlcC5jYWxsKHRoaXMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9zZXR1cERlZmluaXRpb24oZGVmaW5pdGlvbikge1xuICAgIHZhciBkZWZhdWx0cyA9IFNwcmluZ1RyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TO1xuICAgIGlmIChkZWZpbml0aW9uLnBlcmlvZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBkZWZpbml0aW9uLnBlcmlvZCA9IGRlZmF1bHRzLnBlcmlvZDtcbiAgICBpZiAoZGVmaW5pdGlvbi5kYW1waW5nUmF0aW8gPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmaW5pdGlvbi5kYW1waW5nUmF0aW8gPSBkZWZhdWx0cy5kYW1waW5nUmF0aW87XG4gICAgaWYgKGRlZmluaXRpb24udmVsb2NpdHkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmaW5pdGlvbi52ZWxvY2l0eSA9IGRlZmF1bHRzLnZlbG9jaXR5O1xuICAgIGlmIChkZWZpbml0aW9uLnBlcmlvZCA8IDE1MCkge1xuICAgICAgICBkZWZpbml0aW9uLnBlcmlvZCA9IDE1MDtcbiAgICAgICAgY29uc29sZS53YXJuKCdUaGUgcGVyaW9kIG9mIGEgU3ByaW5nVHJhbnNpdGlvbiBpcyBjYXBwZWQgYXQgMTUwIG1zLiBVc2UgYSBTbmFwVHJhbnNpdGlvbiBmb3IgZmFzdGVyIHRyYW5zaXRpb25zJyk7XG4gICAgfVxuICAgIHRoaXMuc3ByaW5nLnNldE9wdGlvbnMoe1xuICAgICAgICBwZXJpb2Q6IGRlZmluaXRpb24ucGVyaW9kLFxuICAgICAgICBkYW1waW5nUmF0aW86IGRlZmluaXRpb24uZGFtcGluZ1JhdGlvXG4gICAgfSk7XG4gICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCBkZWZpbml0aW9uLnZlbG9jaXR5KTtcbn1cbmZ1bmN0aW9uIF9zZXRBYnNvbHV0ZVJlc3RUb2xlcmFuY2UoKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gdGhpcy5lbmRTdGF0ZS5zdWIodGhpcy5pbml0U3RhdGUpLm5vcm1TcXVhcmVkKCk7XG4gICAgdGhpcy5fYWJzUmVzdFRvbGVyYW5jZSA9IGRpc3RhbmNlID09PSAwID8gdGhpcy5fcmVzdFRvbGVyYW5jZSA6IHRoaXMuX3Jlc3RUb2xlcmFuY2UgKiBkaXN0YW5jZTtcbn1cbmZ1bmN0aW9uIF9zZXRUYXJnZXQodGFyZ2V0KSB7XG4gICAgdGhpcy5lbmRTdGF0ZS5zZXQodGFyZ2V0KTtcbiAgICBfc2V0QWJzb2x1dGVSZXN0VG9sZXJhbmNlLmNhbGwodGhpcyk7XG59XG5TcHJpbmdUcmFuc2l0aW9uLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KHBvcywgdmVsKSB7XG4gICAgdGhpcy5fZGltZW5zaW9ucyA9IHBvcyBpbnN0YW5jZW9mIEFycmF5ID8gcG9zLmxlbmd0aCA6IDA7XG4gICAgdGhpcy5pbml0U3RhdGUuc2V0KHBvcyk7XG4gICAgX3NldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzLCBwb3MpO1xuICAgIF9zZXRUYXJnZXQuY2FsbCh0aGlzLCBwb3MpO1xuICAgIGlmICh2ZWwpXG4gICAgICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgdmVsKTtcbiAgICBfc2V0Q2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQpO1xufTtcblNwcmluZ1RyYW5zaXRpb24ucHJvdG90eXBlLmdldFZlbG9jaXR5ID0gZnVuY3Rpb24gZ2V0VmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIF9nZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcyk7XG59O1xuU3ByaW5nVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0VmVsb2NpdHkgPSBmdW5jdGlvbiBzZXRWZWxvY2l0eSh2KSB7XG4gICAgdGhpcy5jYWxsKHRoaXMsIF9zZXRQYXJ0aWNsZVZlbG9jaXR5KHYpKTtcbn07XG5TcHJpbmdUcmFuc2l0aW9uLnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgIHJldHVybiAhdGhpcy5QRS5pc1NsZWVwaW5nKCk7XG59O1xuU3ByaW5nVHJhbnNpdGlvbi5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgdGhpcy5zZXQodGhpcy5nZXQoKSk7XG59O1xuU3ByaW5nVHJhbnNpdGlvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIF91cGRhdGUuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gX2dldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzKTtcbn07XG5TcHJpbmdUcmFuc2l0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoZW5kU3RhdGUsIGRlZmluaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICAgIHRoaXMucmVzZXQoZW5kU3RhdGUpO1xuICAgICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSBlbmRTdGF0ZSBpbnN0YW5jZW9mIEFycmF5ID8gZW5kU3RhdGUubGVuZ3RoIDogMDtcbiAgICBfd2FrZS5jYWxsKHRoaXMpO1xuICAgIF9zZXR1cERlZmluaXRpb24uY2FsbCh0aGlzLCBkZWZpbml0aW9uKTtcbiAgICBfc2V0VGFyZ2V0LmNhbGwodGhpcywgZW5kU3RhdGUpO1xuICAgIF9zZXRDYWxsYmFjay5jYWxsKHRoaXMsIGNhbGxiYWNrKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFNwcmluZ1RyYW5zaXRpb247IiwidmFyIE11bHRpcGxlVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vTXVsdGlwbGVUcmFuc2l0aW9uJyk7XG52YXIgVHdlZW5UcmFuc2l0aW9uID0gcmVxdWlyZSgnLi9Ud2VlblRyYW5zaXRpb24nKTtcbmZ1bmN0aW9uIFRyYW5zaXRpb25hYmxlKHN0YXJ0KSB7XG4gICAgdGhpcy5jdXJyZW50QWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmFjdGlvblF1ZXVlID0gW107XG4gICAgdGhpcy5jYWxsYmFja1F1ZXVlID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgdGhpcy52ZWxvY2l0eSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9lbmdpbmVJbnN0YW5jZSA9IG51bGw7XG4gICAgdGhpcy5fY3VycmVudE1ldGhvZCA9IG51bGw7XG4gICAgdGhpcy5zZXQoc3RhcnQpO1xufVxudmFyIHRyYW5zaXRpb25NZXRob2RzID0ge307XG5UcmFuc2l0aW9uYWJsZS5yZWdpc3Rlck1ldGhvZCA9IGZ1bmN0aW9uIHJlZ2lzdGVyTWV0aG9kKG5hbWUsIGVuZ2luZUNsYXNzKSB7XG4gICAgaWYgKCEobmFtZSBpbiB0cmFuc2l0aW9uTWV0aG9kcykpIHtcbiAgICAgICAgdHJhbnNpdGlvbk1ldGhvZHNbbmFtZV0gPSBlbmdpbmVDbGFzcztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbn07XG5UcmFuc2l0aW9uYWJsZS51bnJlZ2lzdGVyTWV0aG9kID0gZnVuY3Rpb24gdW5yZWdpc3Rlck1ldGhvZChuYW1lKSB7XG4gICAgaWYgKG5hbWUgaW4gdHJhbnNpdGlvbk1ldGhvZHMpIHtcbiAgICAgICAgZGVsZXRlIHRyYW5zaXRpb25NZXRob2RzW25hbWVdO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xufTtcbmZ1bmN0aW9uIF9sb2FkTmV4dCgpIHtcbiAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5fY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hY3Rpb25RdWV1ZS5sZW5ndGggPD0gMCkge1xuICAgICAgICB0aGlzLnNldCh0aGlzLmdldCgpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSB0aGlzLmFjdGlvblF1ZXVlLnNoaWZ0KCk7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrUXVldWUuc2hpZnQoKTtcbiAgICB2YXIgbWV0aG9kID0gbnVsbDtcbiAgICB2YXIgZW5kVmFsdWUgPSB0aGlzLmN1cnJlbnRBY3Rpb25bMF07XG4gICAgdmFyIHRyYW5zaXRpb24gPSB0aGlzLmN1cnJlbnRBY3Rpb25bMV07XG4gICAgaWYgKHRyYW5zaXRpb24gaW5zdGFuY2VvZiBPYmplY3QgJiYgdHJhbnNpdGlvbi5tZXRob2QpIHtcbiAgICAgICAgbWV0aG9kID0gdHJhbnNpdGlvbi5tZXRob2Q7XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgIG1ldGhvZCA9IHRyYW5zaXRpb25NZXRob2RzW21ldGhvZF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWV0aG9kID0gVHdlZW5UcmFuc2l0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY3VycmVudE1ldGhvZCAhPT0gbWV0aG9kKSB7XG4gICAgICAgIGlmICghKGVuZFZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB8fCBtZXRob2QuU1VQUE9SVFNfTVVMVElQTEUgPT09IHRydWUgfHwgZW5kVmFsdWUubGVuZ3RoIDw9IG1ldGhvZC5TVVBQT1JUU19NVUxUSVBMRSkge1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lSW5zdGFuY2UgPSBuZXcgbWV0aG9kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVJbnN0YW5jZSA9IG5ldyBNdWx0aXBsZVRyYW5zaXRpb24obWV0aG9kKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJyZW50TWV0aG9kID0gbWV0aG9kO1xuICAgIH1cbiAgICB0aGlzLl9lbmdpbmVJbnN0YW5jZS5yZXNldCh0aGlzLnN0YXRlLCB0aGlzLnZlbG9jaXR5KTtcbiAgICBpZiAodGhpcy52ZWxvY2l0eSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0cmFuc2l0aW9uLnZlbG9jaXR5ID0gdGhpcy52ZWxvY2l0eTtcbiAgICB0aGlzLl9lbmdpbmVJbnN0YW5jZS5zZXQoZW5kVmFsdWUsIHRyYW5zaXRpb24sIF9sb2FkTmV4dC5iaW5kKHRoaXMpKTtcbn1cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoZW5kU3RhdGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucmVzZXQoZW5kU3RhdGUpO1xuICAgICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdmFyIGFjdGlvbiA9IFtcbiAgICAgICAgICAgIGVuZFN0YXRlLFxuICAgICAgICAgICAgdHJhbnNpdGlvblxuICAgICAgICBdO1xuICAgIHRoaXMuYWN0aW9uUXVldWUucHVzaChhY3Rpb24pO1xuICAgIHRoaXMuY2FsbGJhY2tRdWV1ZS5wdXNoKGNhbGxiYWNrKTtcbiAgICBpZiAoIXRoaXMuY3VycmVudEFjdGlvbilcbiAgICAgICAgX2xvYWROZXh0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoc3RhcnRTdGF0ZSwgc3RhcnRWZWxvY2l0eSkge1xuICAgIHRoaXMuX2N1cnJlbnRNZXRob2QgPSBudWxsO1xuICAgIHRoaXMuX2VuZ2luZUluc3RhbmNlID0gbnVsbDtcbiAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN0YXRlID0gc3RhcnRTdGF0ZTtcbiAgICB0aGlzLnZlbG9jaXR5ID0gc3RhcnRWZWxvY2l0eTtcbiAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuYWN0aW9uUXVldWUgPSBbXTtcbiAgICB0aGlzLmNhbGxiYWNrUXVldWUgPSBbXTtcbn07XG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuZGVsYXkgPSBmdW5jdGlvbiBkZWxheShkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnNldCh0aGlzLmdldCgpLCB7XG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgY3VydmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSwgY2FsbGJhY2spO1xufTtcblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQodGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuX2VuZ2luZUluc3RhbmNlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmdpbmVJbnN0YW5jZS5nZXRWZWxvY2l0eSlcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSB0aGlzLl9lbmdpbmVJbnN0YW5jZS5nZXRWZWxvY2l0eSgpO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5fZW5naW5lSW5zdGFuY2UuZ2V0KHRpbWVzdGFtcCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXRlO1xufTtcblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgIHJldHVybiAhIXRoaXMuY3VycmVudEFjdGlvbjtcbn07XG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0KHRoaXMuZ2V0KCkpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbmFibGU7IiwidmFyIFRyYW5zaXRpb25hYmxlID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9uYWJsZScpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL1RyYW5zZm9ybScpO1xudmFyIFV0aWxpdHkgPSByZXF1aXJlKCdmYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHknKTtcbmZ1bmN0aW9uIFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtKHRyYW5zZm9ybSkge1xuICAgIHRoaXMuX2ZpbmFsID0gVHJhbnNmb3JtLmlkZW50aXR5LnNsaWNlKCk7XG4gICAgdGhpcy5fZmluYWxUcmFuc2xhdGUgPSBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdO1xuICAgIHRoaXMuX2ZpbmFsUm90YXRlID0gW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXTtcbiAgICB0aGlzLl9maW5hbFNrZXcgPSBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdO1xuICAgIHRoaXMuX2ZpbmFsU2NhbGUgPSBbXG4gICAgICAgIDEsXG4gICAgICAgIDEsXG4gICAgICAgIDFcbiAgICBdO1xuICAgIHRoaXMudHJhbnNsYXRlID0gbmV3IFRyYW5zaXRpb25hYmxlKHRoaXMuX2ZpbmFsVHJhbnNsYXRlKTtcbiAgICB0aGlzLnJvdGF0ZSA9IG5ldyBUcmFuc2l0aW9uYWJsZSh0aGlzLl9maW5hbFJvdGF0ZSk7XG4gICAgdGhpcy5za2V3ID0gbmV3IFRyYW5zaXRpb25hYmxlKHRoaXMuX2ZpbmFsU2tldyk7XG4gICAgdGhpcy5zY2FsZSA9IG5ldyBUcmFuc2l0aW9uYWJsZSh0aGlzLl9maW5hbFNjYWxlKTtcbiAgICBpZiAodHJhbnNmb3JtKVxuICAgICAgICB0aGlzLnNldCh0cmFuc2Zvcm0pO1xufVxuZnVuY3Rpb24gX2J1aWxkKCkge1xuICAgIHJldHVybiBUcmFuc2Zvcm0uYnVpbGQoe1xuICAgICAgICB0cmFuc2xhdGU6IHRoaXMudHJhbnNsYXRlLmdldCgpLFxuICAgICAgICByb3RhdGU6IHRoaXMucm90YXRlLmdldCgpLFxuICAgICAgICBza2V3OiB0aGlzLnNrZXcuZ2V0KCksXG4gICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLmdldCgpXG4gICAgfSk7XG59XG5mdW5jdGlvbiBfYnVpbGRGaW5hbCgpIHtcbiAgICByZXR1cm4gVHJhbnNmb3JtLmJ1aWxkKHtcbiAgICAgICAgdHJhbnNsYXRlOiB0aGlzLl9maW5hbFRyYW5zbGF0ZSxcbiAgICAgICAgcm90YXRlOiB0aGlzLl9maW5hbFJvdGF0ZSxcbiAgICAgICAgc2tldzogdGhpcy5fZmluYWxTa2V3LFxuICAgICAgICBzY2FsZTogdGhpcy5fZmluYWxTY2FsZVxuICAgIH0pO1xufVxuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLnNldFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIHNldFRyYW5zbGF0ZSh0cmFuc2xhdGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZmluYWxUcmFuc2xhdGUgPSB0cmFuc2xhdGU7XG4gICAgdGhpcy5fZmluYWwgPSBfYnVpbGRGaW5hbC5jYWxsKHRoaXMpO1xuICAgIHRoaXMudHJhbnNsYXRlLnNldCh0cmFuc2xhdGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybS5wcm90b3R5cGUuc2V0U2NhbGUgPSBmdW5jdGlvbiBzZXRTY2FsZShzY2FsZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9maW5hbFNjYWxlID0gc2NhbGU7XG4gICAgdGhpcy5fZmluYWwgPSBfYnVpbGRGaW5hbC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2NhbGUuc2V0KHNjYWxlLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLnNldFJvdGF0ZSA9IGZ1bmN0aW9uIHNldFJvdGF0ZShldWxlckFuZ2xlcywgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9maW5hbFJvdGF0ZSA9IGV1bGVyQW5nbGVzO1xuICAgIHRoaXMuX2ZpbmFsID0gX2J1aWxkRmluYWwuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJvdGF0ZS5zZXQoZXVsZXJBbmdsZXMsIHRyYW5zaXRpb24sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybS5wcm90b3R5cGUuc2V0U2tldyA9IGZ1bmN0aW9uIHNldFNrZXcoc2tld0FuZ2xlcywgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9maW5hbFNrZXcgPSBza2V3QW5nbGVzO1xuICAgIHRoaXMuX2ZpbmFsID0gX2J1aWxkRmluYWwuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnNrZXcuc2V0KHNrZXdBbmdsZXMsIHRyYW5zaXRpb24sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHRyYW5zZm9ybSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICB2YXIgY29tcG9uZW50cyA9IFRyYW5zZm9ybS5pbnRlcnByZXQodHJhbnNmb3JtKTtcbiAgICB0aGlzLl9maW5hbFRyYW5zbGF0ZSA9IGNvbXBvbmVudHMudHJhbnNsYXRlO1xuICAgIHRoaXMuX2ZpbmFsUm90YXRlID0gY29tcG9uZW50cy5yb3RhdGU7XG4gICAgdGhpcy5fZmluYWxTa2V3ID0gY29tcG9uZW50cy5za2V3O1xuICAgIHRoaXMuX2ZpbmFsU2NhbGUgPSBjb21wb25lbnRzLnNjYWxlO1xuICAgIHRoaXMuX2ZpbmFsID0gdHJhbnNmb3JtO1xuICAgIHZhciBfY2FsbGJhY2sgPSBjYWxsYmFjayA/IFV0aWxpdHkuYWZ0ZXIoNCwgY2FsbGJhY2spIDogbnVsbDtcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXQoY29tcG9uZW50cy50cmFuc2xhdGUsIHRyYW5zaXRpb24sIF9jYWxsYmFjayk7XG4gICAgdGhpcy5yb3RhdGUuc2V0KGNvbXBvbmVudHMucm90YXRlLCB0cmFuc2l0aW9uLCBfY2FsbGJhY2spO1xuICAgIHRoaXMuc2tldy5zZXQoY29tcG9uZW50cy5za2V3LCB0cmFuc2l0aW9uLCBfY2FsbGJhY2spO1xuICAgIHRoaXMuc2NhbGUuc2V0KGNvbXBvbmVudHMuc2NhbGUsIHRyYW5zaXRpb24sIF9jYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLnNldERlZmF1bHRUcmFuc2l0aW9uID0gZnVuY3Rpb24gc2V0RGVmYXVsdFRyYW5zaXRpb24odHJhbnNpdGlvbikge1xuICAgIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHQodHJhbnNpdGlvbik7XG4gICAgdGhpcy5yb3RhdGUuc2V0RGVmYXVsdCh0cmFuc2l0aW9uKTtcbiAgICB0aGlzLnNrZXcuc2V0RGVmYXVsdCh0cmFuc2l0aW9uKTtcbiAgICB0aGlzLnNjYWxlLnNldERlZmF1bHQodHJhbnNpdGlvbik7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICBpZiAodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCh0aGlzKTtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbmFsO1xufTtcblRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRGaW5hbCA9IGZ1bmN0aW9uIGdldEZpbmFsKCkge1xuICAgIHJldHVybiB0aGlzLl9maW5hbDtcbn07XG5UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybS5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGUuaXNBY3RpdmUoKSB8fCB0aGlzLnJvdGF0ZS5pc0FjdGl2ZSgpIHx8IHRoaXMuc2NhbGUuaXNBY3RpdmUoKSB8fCB0aGlzLnNrZXcuaXNBY3RpdmUoKTtcbn07XG5UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybS5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgdGhpcy5fZmluYWwgPSB0aGlzLmdldCgpO1xuICAgIHRoaXMudHJhbnNsYXRlLmhhbHQoKTtcbiAgICB0aGlzLnJvdGF0ZS5oYWx0KCk7XG4gICAgdGhpcy5za2V3LmhhbHQoKTtcbiAgICB0aGlzLnNjYWxlLmhhbHQoKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtOyIsImZ1bmN0aW9uIFR3ZWVuVHJhbnNpdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZShUd2VlblRyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IDA7XG4gICAgdGhpcy5fc3RhcnRWYWx1ZSA9IDA7XG4gICAgdGhpcy5fdXBkYXRlVGltZSA9IDA7XG4gICAgdGhpcy5fZW5kVmFsdWUgPSAwO1xuICAgIHRoaXMuX2N1cnZlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gMDtcbiAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN0YXRlID0gMDtcbiAgICB0aGlzLnZlbG9jaXR5ID0gdW5kZWZpbmVkO1xufVxuVHdlZW5UcmFuc2l0aW9uLkN1cnZlcyA9IHtcbiAgICBsaW5lYXI6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0sXG4gICAgZWFzZUluOiBmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdCAqIHQ7XG4gICAgfSxcbiAgICBlYXNlT3V0OiBmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdCAqICgyIC0gdCk7XG4gICAgfSxcbiAgICBlYXNlSW5PdXQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0IDw9IDAuNSlcbiAgICAgICAgICAgIHJldHVybiAyICogdCAqIHQ7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiAtMiAqIHQgKiB0ICsgNCAqIHQgLSAxO1xuICAgIH0sXG4gICAgZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQgKiAoMyAtIDIgKiB0KTtcbiAgICB9LFxuICAgIHNwcmluZzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuICgxIC0gdCkgKiBNYXRoLnNpbig2ICogTWF0aC5QSSAqIHQpICsgdDtcbiAgICB9XG59O1xuVHdlZW5UcmFuc2l0aW9uLlNVUFBPUlRTX01VTFRJUExFID0gdHJ1ZTtcblR3ZWVuVHJhbnNpdGlvbi5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgY3VydmU6IFR3ZWVuVHJhbnNpdGlvbi5DdXJ2ZXMubGluZWFyLFxuICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgc3BlZWQ6IDBcbn07XG52YXIgcmVnaXN0ZXJlZEN1cnZlcyA9IHt9O1xuVHdlZW5UcmFuc2l0aW9uLnJlZ2lzdGVyQ3VydmUgPSBmdW5jdGlvbiByZWdpc3RlckN1cnZlKGN1cnZlTmFtZSwgY3VydmUpIHtcbiAgICBpZiAoIXJlZ2lzdGVyZWRDdXJ2ZXNbY3VydmVOYW1lXSkge1xuICAgICAgICByZWdpc3RlcmVkQ3VydmVzW2N1cnZlTmFtZV0gPSBjdXJ2ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5Ud2VlblRyYW5zaXRpb24udW5yZWdpc3RlckN1cnZlID0gZnVuY3Rpb24gdW5yZWdpc3RlckN1cnZlKGN1cnZlTmFtZSkge1xuICAgIGlmIChyZWdpc3RlcmVkQ3VydmVzW2N1cnZlTmFtZV0pIHtcbiAgICAgICAgZGVsZXRlIHJlZ2lzdGVyZWRDdXJ2ZXNbY3VydmVOYW1lXTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5Ud2VlblRyYW5zaXRpb24uZ2V0Q3VydmUgPSBmdW5jdGlvbiBnZXRDdXJ2ZShjdXJ2ZU5hbWUpIHtcbiAgICB2YXIgY3VydmUgPSByZWdpc3RlcmVkQ3VydmVzW2N1cnZlTmFtZV07XG4gICAgaWYgKGN1cnZlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiBjdXJ2ZTtcbiAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY3VydmUgbm90IHJlZ2lzdGVyZWQnKTtcbn07XG5Ud2VlblRyYW5zaXRpb24uZ2V0Q3VydmVzID0gZnVuY3Rpb24gZ2V0Q3VydmVzKCkge1xuICAgIHJldHVybiByZWdpc3RlcmVkQ3VydmVzO1xufTtcbmZ1bmN0aW9uIF9pbnRlcnBvbGF0ZShhLCBiLCB0KSB7XG4gICAgcmV0dXJuICgxIC0gdCkgKiBhICsgdCAqIGI7XG59XG5mdW5jdGlvbiBfY2xvbmUob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgICAgICByZXR1cm4gb2JqLnNsaWNlKDApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShvYmopO1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gX25vcm1hbGl6ZSh0cmFuc2l0aW9uLCBkZWZhdWx0VHJhbnNpdGlvbikge1xuICAgIHZhciByZXN1bHQgPSB7IGN1cnZlOiBkZWZhdWx0VHJhbnNpdGlvbi5jdXJ2ZSB9O1xuICAgIGlmIChkZWZhdWx0VHJhbnNpdGlvbi5kdXJhdGlvbilcbiAgICAgICAgcmVzdWx0LmR1cmF0aW9uID0gZGVmYXVsdFRyYW5zaXRpb24uZHVyYXRpb247XG4gICAgaWYgKGRlZmF1bHRUcmFuc2l0aW9uLnNwZWVkKVxuICAgICAgICByZXN1bHQuc3BlZWQgPSBkZWZhdWx0VHJhbnNpdGlvbi5zcGVlZDtcbiAgICBpZiAodHJhbnNpdGlvbiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5kdXJhdGlvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmVzdWx0LmR1cmF0aW9uID0gdHJhbnNpdGlvbi5kdXJhdGlvbjtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uY3VydmUpXG4gICAgICAgICAgICByZXN1bHQuY3VydmUgPSB0cmFuc2l0aW9uLmN1cnZlO1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5zcGVlZClcbiAgICAgICAgICAgIHJlc3VsdC5zcGVlZCA9IHRyYW5zaXRpb24uc3BlZWQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmVzdWx0LmN1cnZlID09PSAnc3RyaW5nJylcbiAgICAgICAgcmVzdWx0LmN1cnZlID0gVHdlZW5UcmFuc2l0aW9uLmdldEN1cnZlKHJlc3VsdC5jdXJ2ZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblR3ZWVuVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmN1cnZlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5jdXJ2ZSA9IG9wdGlvbnMuY3VydmU7XG4gICAgaWYgKG9wdGlvbnMuZHVyYXRpb24gIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLmR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5zcGVlZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuc3BlZWQgPSBvcHRpb25zLnNwZWVkO1xufTtcblR3ZWVuVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGVuZFZhbHVlLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICghdHJhbnNpdGlvbikge1xuICAgICAgICB0aGlzLnJlc2V0KGVuZFZhbHVlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zdGFydFZhbHVlID0gX2Nsb25lKHRoaXMuZ2V0KCkpO1xuICAgIHRyYW5zaXRpb24gPSBfbm9ybWFsaXplKHRyYW5zaXRpb24sIHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKHRyYW5zaXRpb24uc3BlZWQpIHtcbiAgICAgICAgdmFyIHN0YXJ0VmFsdWUgPSB0aGlzLl9zdGFydFZhbHVlO1xuICAgICAgICBpZiAoc3RhcnRWYWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgdmFyIHZhcmlhbmNlID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gc3RhcnRWYWx1ZSlcbiAgICAgICAgICAgICAgICB2YXJpYW5jZSArPSAoZW5kVmFsdWVbaV0gLSBzdGFydFZhbHVlW2ldKSAqIChlbmRWYWx1ZVtpXSAtIHN0YXJ0VmFsdWVbaV0pO1xuICAgICAgICAgICAgdHJhbnNpdGlvbi5kdXJhdGlvbiA9IE1hdGguc3FydCh2YXJpYW5jZSkgLyB0cmFuc2l0aW9uLnNwZWVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNpdGlvbi5kdXJhdGlvbiA9IE1hdGguYWJzKGVuZFZhbHVlIC0gc3RhcnRWYWx1ZSkgLyB0cmFuc2l0aW9uLnNwZWVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fZW5kVmFsdWUgPSBfY2xvbmUoZW5kVmFsdWUpO1xuICAgIHRoaXMuX3N0YXJ0VmVsb2NpdHkgPSBfY2xvbmUodHJhbnNpdGlvbi52ZWxvY2l0eSk7XG4gICAgdGhpcy5fZHVyYXRpb24gPSB0cmFuc2l0aW9uLmR1cmF0aW9uO1xuICAgIHRoaXMuX2N1cnZlID0gdHJhbnNpdGlvbi5jdXJ2ZTtcbiAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG59O1xuVHdlZW5UcmFuc2l0aW9uLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KHN0YXJ0VmFsdWUsIHN0YXJ0VmVsb2NpdHkpIHtcbiAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5fY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0gX2Nsb25lKHN0YXJ0VmFsdWUpO1xuICAgIHRoaXMudmVsb2NpdHkgPSBfY2xvbmUoc3RhcnRWZWxvY2l0eSk7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gMDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IDA7XG4gICAgdGhpcy5fdXBkYXRlVGltZSA9IDA7XG4gICAgdGhpcy5fc3RhcnRWYWx1ZSA9IHRoaXMuc3RhdGU7XG4gICAgdGhpcy5fc3RhcnRWZWxvY2l0eSA9IHRoaXMudmVsb2NpdHk7XG4gICAgdGhpcy5fZW5kVmFsdWUgPSB0aGlzLnN0YXRlO1xuICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xufTtcblR3ZWVuVHJhbnNpdGlvbi5wcm90b3R5cGUuZ2V0VmVsb2NpdHkgPSBmdW5jdGlvbiBnZXRWZWxvY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy52ZWxvY2l0eTtcbn07XG5Ud2VlblRyYW5zaXRpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCh0aW1lc3RhbXApIHtcbiAgICB0aGlzLnVwZGF0ZSh0aW1lc3RhbXApO1xuICAgIHJldHVybiB0aGlzLnN0YXRlO1xufTtcbmZ1bmN0aW9uIF9jYWxjdWxhdGVWZWxvY2l0eShjdXJyZW50LCBzdGFydCwgY3VydmUsIGR1cmF0aW9uLCB0KSB7XG4gICAgdmFyIHZlbG9jaXR5O1xuICAgIHZhciBlcHMgPSAxZS03O1xuICAgIHZhciBzcGVlZCA9IChjdXJ2ZSh0KSAtIGN1cnZlKHQgLSBlcHMpKSAvIGVwcztcbiAgICBpZiAoY3VycmVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHZlbG9jaXR5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50W2ldID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eVtpXSA9IHNwZWVkICogKGN1cnJlbnRbaV0gLSBzdGFydFtpXSkgLyBkdXJhdGlvbjtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eVtpXSA9IDA7XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgdmVsb2NpdHkgPSBzcGVlZCAqIChjdXJyZW50IC0gc3RhcnQpIC8gZHVyYXRpb247XG4gICAgcmV0dXJuIHZlbG9jaXR5O1xufVxuZnVuY3Rpb24gX2NhbGN1bGF0ZVN0YXRlKHN0YXJ0LCBlbmQsIHQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKHN0YXJ0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgc3RhdGUgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFydC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydFtpXSA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICAgICAgc3RhdGVbaV0gPSBfaW50ZXJwb2xhdGUoc3RhcnRbaV0sIGVuZFtpXSwgdCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3RhdGVbaV0gPSBzdGFydFtpXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZVxuICAgICAgICBzdGF0ZSA9IF9pbnRlcnBvbGF0ZShzdGFydCwgZW5kLCB0KTtcbiAgICByZXR1cm4gc3RhdGU7XG59XG5Ud2VlblRyYW5zaXRpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSh0aW1lc3RhbXApIHtcbiAgICBpZiAoIXRoaXMuX2FjdGl2ZSkge1xuICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuX2NhbGxiYWNrO1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aW1lc3RhbXApXG4gICAgICAgIHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgaWYgKHRoaXMuX3VwZGF0ZVRpbWUgPj0gdGltZXN0YW1wKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5fdXBkYXRlVGltZSA9IHRpbWVzdGFtcDtcbiAgICB2YXIgdGltZVNpbmNlU3RhcnQgPSB0aW1lc3RhbXAgLSB0aGlzLl9zdGFydFRpbWU7XG4gICAgaWYgKHRpbWVTaW5jZVN0YXJ0ID49IHRoaXMuX2R1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLl9lbmRWYWx1ZTtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IF9jYWxjdWxhdGVWZWxvY2l0eSh0aGlzLnN0YXRlLCB0aGlzLl9zdGFydFZhbHVlLCB0aGlzLl9jdXJ2ZSwgdGhpcy5fZHVyYXRpb24sIDEpO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHRpbWVTaW5jZVN0YXJ0IDwgMCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5fc3RhcnRWYWx1ZTtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IHRoaXMuX3N0YXJ0VmVsb2NpdHk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHQgPSB0aW1lU2luY2VTdGFydCAvIHRoaXMuX2R1cmF0aW9uO1xuICAgICAgICB0aGlzLnN0YXRlID0gX2NhbGN1bGF0ZVN0YXRlKHRoaXMuX3N0YXJ0VmFsdWUsIHRoaXMuX2VuZFZhbHVlLCB0aGlzLl9jdXJ2ZSh0KSk7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBfY2FsY3VsYXRlVmVsb2NpdHkodGhpcy5zdGF0ZSwgdGhpcy5fc3RhcnRWYWx1ZSwgdGhpcy5fY3VydmUsIHRoaXMuX2R1cmF0aW9uLCB0KTtcbiAgICB9XG59O1xuVHdlZW5UcmFuc2l0aW9uLnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XG59O1xuVHdlZW5UcmFuc2l0aW9uLnByb3RvdHlwZS5oYWx0ID0gZnVuY3Rpb24gaGFsdCgpIHtcbiAgICB0aGlzLnJlc2V0KHRoaXMuZ2V0KCkpO1xufTtcblR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlKCdsaW5lYXInLCBUd2VlblRyYW5zaXRpb24uQ3VydmVzLmxpbmVhcik7XG5Ud2VlblRyYW5zaXRpb24ucmVnaXN0ZXJDdXJ2ZSgnZWFzZUluJywgVHdlZW5UcmFuc2l0aW9uLkN1cnZlcy5lYXNlSW4pO1xuVHdlZW5UcmFuc2l0aW9uLnJlZ2lzdGVyQ3VydmUoJ2Vhc2VPdXQnLCBUd2VlblRyYW5zaXRpb24uQ3VydmVzLmVhc2VPdXQpO1xuVHdlZW5UcmFuc2l0aW9uLnJlZ2lzdGVyQ3VydmUoJ2Vhc2VJbk91dCcsIFR3ZWVuVHJhbnNpdGlvbi5DdXJ2ZXMuZWFzZUluT3V0KTtcblR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlKCdlYXNlT3V0Qm91bmNlJywgVHdlZW5UcmFuc2l0aW9uLkN1cnZlcy5lYXNlT3V0Qm91bmNlKTtcblR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlKCdzcHJpbmcnLCBUd2VlblRyYW5zaXRpb24uQ3VydmVzLnNwcmluZyk7XG5Ud2VlblRyYW5zaXRpb24uY3VzdG9tQ3VydmUgPSBmdW5jdGlvbiBjdXN0b21DdXJ2ZSh2MSwgdjIpIHtcbiAgICB2MSA9IHYxIHx8IDA7XG4gICAgdjIgPSB2MiB8fCAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdjEgKiB0ICsgKC0yICogdjEgLSB2MiArIDMpICogdCAqIHQgKyAodjEgKyB2MiAtIDIpICogdCAqIHQgKiB0O1xuICAgIH07XG59O1xubW9kdWxlLmV4cG9ydHMgPSBUd2VlblRyYW5zaXRpb247IiwidmFyIFBFID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvUGh5c2ljc0VuZ2luZScpO1xudmFyIFBhcnRpY2xlID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvYm9kaWVzL1BhcnRpY2xlJyk7XG52YXIgU3ByaW5nID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvZm9yY2VzL1NwcmluZycpO1xudmFyIFdhbGwgPSByZXF1aXJlKCdmYW1vdXMvcGh5c2ljcy9jb25zdHJhaW50cy9XYWxsJyk7XG52YXIgVmVjdG9yID0gcmVxdWlyZSgnZmFtb3VzL21hdGgvVmVjdG9yJyk7XG5mdW5jdGlvbiBXYWxsVHJhbnNpdGlvbihzdGF0ZSkge1xuICAgIHN0YXRlID0gc3RhdGUgfHwgMDtcbiAgICB0aGlzLmVuZFN0YXRlID0gbmV3IFZlY3RvcihzdGF0ZSk7XG4gICAgdGhpcy5pbml0U3RhdGUgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5zcHJpbmcgPSBuZXcgU3ByaW5nKHsgYW5jaG9yOiB0aGlzLmVuZFN0YXRlIH0pO1xuICAgIHRoaXMud2FsbCA9IG5ldyBXYWxsKCk7XG4gICAgdGhpcy5fcmVzdFRvbGVyYW5jZSA9IDFlLTEwO1xuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSAxO1xuICAgIHRoaXMuX2Fic1Jlc3RUb2xlcmFuY2UgPSB0aGlzLl9yZXN0VG9sZXJhbmNlO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuUEUgPSBuZXcgUEUoKTtcbiAgICB0aGlzLnBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKCk7XG4gICAgdGhpcy5QRS5hZGRCb2R5KHRoaXMucGFydGljbGUpO1xuICAgIHRoaXMuUEUuYXR0YWNoKFtcbiAgICAgICAgdGhpcy53YWxsLFxuICAgICAgICB0aGlzLnNwcmluZ1xuICAgIF0sIHRoaXMucGFydGljbGUpO1xufVxuV2FsbFRyYW5zaXRpb24uU1VQUE9SVFNfTVVMVElQTEUgPSAzO1xuV2FsbFRyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHBlcmlvZDogMzAwLFxuICAgIGRhbXBpbmdSYXRpbzogMC41LFxuICAgIHZlbG9jaXR5OiAwLFxuICAgIHJlc3RpdHV0aW9uOiAwLjVcbn07XG5mdW5jdGlvbiBfZ2V0RW5lcmd5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcnRpY2xlLmdldEVuZXJneSgpICsgdGhpcy5zcHJpbmcuZ2V0RW5lcmd5KHRoaXMucGFydGljbGUpO1xufVxuZnVuY3Rpb24gX3NldEFic29sdXRlUmVzdFRvbGVyYW5jZSgpIHtcbiAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLmVuZFN0YXRlLnN1Yih0aGlzLmluaXRTdGF0ZSkubm9ybVNxdWFyZWQoKTtcbiAgICB0aGlzLl9hYnNSZXN0VG9sZXJhbmNlID0gZGlzdGFuY2UgPT09IDAgPyB0aGlzLl9yZXN0VG9sZXJhbmNlIDogdGhpcy5fcmVzdFRvbGVyYW5jZSAqIGRpc3RhbmNlO1xufVxuZnVuY3Rpb24gX3dha2UoKSB7XG4gICAgdGhpcy5QRS53YWtlKCk7XG59XG5mdW5jdGlvbiBfc2xlZXAoKSB7XG4gICAgdGhpcy5QRS5zbGVlcCgpO1xufVxuZnVuY3Rpb24gX3NldFRhcmdldCh0YXJnZXQpIHtcbiAgICB0aGlzLmVuZFN0YXRlLnNldCh0YXJnZXQpO1xuICAgIHZhciBkaXN0ID0gdGhpcy5lbmRTdGF0ZS5zdWIodGhpcy5pbml0U3RhdGUpLm5vcm0oKTtcbiAgICB0aGlzLndhbGwuc2V0T3B0aW9ucyh7XG4gICAgICAgIGRpc3RhbmNlOiB0aGlzLmVuZFN0YXRlLm5vcm0oKSxcbiAgICAgICAgbm9ybWFsOiBkaXN0ID09PSAwID8gdGhpcy5wYXJ0aWNsZS52ZWxvY2l0eS5ub3JtYWxpemUoLTEpIDogdGhpcy5lbmRTdGF0ZS5zdWIodGhpcy5pbml0U3RhdGUpLm5vcm1hbGl6ZSgtMSlcbiAgICB9KTtcbiAgICBfc2V0QWJzb2x1dGVSZXN0VG9sZXJhbmNlLmNhbGwodGhpcyk7XG59XG5mdW5jdGlvbiBfc2V0UGFydGljbGVQb3NpdGlvbihwKSB7XG4gICAgdGhpcy5wYXJ0aWNsZS5wb3NpdGlvbi5zZXQocCk7XG59XG5mdW5jdGlvbiBfc2V0UGFydGljbGVWZWxvY2l0eSh2KSB7XG4gICAgdGhpcy5wYXJ0aWNsZS52ZWxvY2l0eS5zZXQodik7XG59XG5mdW5jdGlvbiBfZ2V0UGFydGljbGVQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGltZW5zaW9ucyA9PT0gMCA/IHRoaXMucGFydGljbGUuZ2V0UG9zaXRpb24xRCgpIDogdGhpcy5wYXJ0aWNsZS5nZXRQb3NpdGlvbigpO1xufVxuZnVuY3Rpb24gX2dldFBhcnRpY2xlVmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnMgPT09IDAgPyB0aGlzLnBhcnRpY2xlLmdldFZlbG9jaXR5MUQoKSA6IHRoaXMucGFydGljbGUuZ2V0VmVsb2NpdHkoKTtcbn1cbmZ1bmN0aW9uIF9zZXRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBfdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLlBFLmlzU2xlZXBpbmcoKSkge1xuICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBjYiA9IHRoaXMuX2NhbGxiYWNrO1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGVuZXJneSA9IF9nZXRFbmVyZ3kuY2FsbCh0aGlzKTtcbiAgICBpZiAoZW5lcmd5IDwgdGhpcy5fYWJzUmVzdFRvbGVyYW5jZSkge1xuICAgICAgICBfc2xlZXAuY2FsbCh0aGlzKTtcbiAgICAgICAgX3NldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzLCB0aGlzLmVuZFN0YXRlKTtcbiAgICAgICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXSk7XG4gICAgfVxufVxuZnVuY3Rpb24gX3NldHVwRGVmaW5pdGlvbihkZWYpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBXYWxsVHJhbnNpdGlvbi5ERUZBVUxUX09QVElPTlM7XG4gICAgaWYgKGRlZi5wZXJpb2QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmLnBlcmlvZCA9IGRlZmF1bHRzLnBlcmlvZDtcbiAgICBpZiAoZGVmLmRhbXBpbmdSYXRpbyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBkZWYuZGFtcGluZ1JhdGlvID0gZGVmYXVsdHMuZGFtcGluZ1JhdGlvO1xuICAgIGlmIChkZWYudmVsb2NpdHkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmLnZlbG9jaXR5ID0gZGVmYXVsdHMudmVsb2NpdHk7XG4gICAgaWYgKGRlZi5yZXN0aXR1dGlvbiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBkZWYucmVzdGl0dXRpb24gPSBkZWZhdWx0cy5yZXN0aXR1dGlvbjtcbiAgICB0aGlzLnNwcmluZy5zZXRPcHRpb25zKHtcbiAgICAgICAgcGVyaW9kOiBkZWYucGVyaW9kLFxuICAgICAgICBkYW1waW5nUmF0aW86IGRlZi5kYW1waW5nUmF0aW9cbiAgICB9KTtcbiAgICB0aGlzLndhbGwuc2V0T3B0aW9ucyh7IHJlc3RpdHV0aW9uOiBkZWYucmVzdGl0dXRpb24gfSk7XG4gICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCBkZWYudmVsb2NpdHkpO1xufVxuV2FsbFRyYW5zaXRpb24ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoc3RhdGUsIHZlbG9jaXR5KSB7XG4gICAgdGhpcy5fZGltZW5zaW9ucyA9IHN0YXRlIGluc3RhbmNlb2YgQXJyYXkgPyBzdGF0ZS5sZW5ndGggOiAwO1xuICAgIHRoaXMuaW5pdFN0YXRlLnNldChzdGF0ZSk7XG4gICAgX3NldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzLCBzdGF0ZSk7XG4gICAgaWYgKHZlbG9jaXR5KVxuICAgICAgICBfc2V0UGFydGljbGVWZWxvY2l0eS5jYWxsKHRoaXMsIHZlbG9jaXR5KTtcbiAgICBfc2V0VGFyZ2V0LmNhbGwodGhpcywgc3RhdGUpO1xuICAgIF9zZXRDYWxsYmFjay5jYWxsKHRoaXMsIHVuZGVmaW5lZCk7XG59O1xuV2FsbFRyYW5zaXRpb24ucHJvdG90eXBlLmdldFZlbG9jaXR5ID0gZnVuY3Rpb24gZ2V0VmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIF9nZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcyk7XG59O1xuV2FsbFRyYW5zaXRpb24ucHJvdG90eXBlLnNldFZlbG9jaXR5ID0gZnVuY3Rpb24gc2V0VmVsb2NpdHkodmVsb2NpdHkpIHtcbiAgICB0aGlzLmNhbGwodGhpcywgX3NldFBhcnRpY2xlVmVsb2NpdHkodmVsb2NpdHkpKTtcbn07XG5XYWxsVHJhbnNpdGlvbi5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gIXRoaXMuUEUuaXNTbGVlcGluZygpO1xufTtcbldhbGxUcmFuc2l0aW9uLnByb3RvdHlwZS5oYWx0ID0gZnVuY3Rpb24gaGFsdCgpIHtcbiAgICB0aGlzLnNldCh0aGlzLmdldCgpKTtcbn07XG5XYWxsVHJhbnNpdGlvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIF91cGRhdGUuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gX2dldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzKTtcbn07XG5XYWxsVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHN0YXRlLCBkZWZpbml0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICB0aGlzLnJlc2V0KHN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9kaW1lbnNpb25zID0gc3RhdGUgaW5zdGFuY2VvZiBBcnJheSA/IHN0YXRlLmxlbmd0aCA6IDA7XG4gICAgX3dha2UuY2FsbCh0aGlzKTtcbiAgICBfc2V0dXBEZWZpbml0aW9uLmNhbGwodGhpcywgZGVmaW5pdGlvbik7XG4gICAgX3NldFRhcmdldC5jYWxsKHRoaXMsIHN0YXRlKTtcbiAgICBfc2V0Q2FsbGJhY2suY2FsbCh0aGlzLCBjYWxsYmFjayk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBXYWxsVHJhbnNpdGlvbjsiLCJ2YXIgRmFtb3VzRW5naW5lID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvRW5naW5lJyk7XG52YXIgX2V2ZW50ID0gJ3ByZXJlbmRlcic7XG52YXIgZ2V0VGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID8gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdygpO1xuICAgIH07XG5mdW5jdGlvbiBhZGRUaW1lckZ1bmN0aW9uKGZuKSB7XG4gICAgRmFtb3VzRW5naW5lLm9uKF9ldmVudCwgZm4pO1xuICAgIHJldHVybiBmbjtcbn1cbmZ1bmN0aW9uIHNldFRpbWVvdXQoZm4sIGR1cmF0aW9uKSB7XG4gICAgdmFyIHQgPSBnZXRUaW1lKCk7XG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdDIgPSBnZXRUaW1lKCk7XG4gICAgICAgIGlmICh0MiAtIHQgPj0gZHVyYXRpb24pIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBGYW1vdXNFbmdpbmUucmVtb3ZlTGlzdGVuZXIoX2V2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBhZGRUaW1lckZ1bmN0aW9uKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIHNldEludGVydmFsKGZuLCBkdXJhdGlvbikge1xuICAgIHZhciB0ID0gZ2V0VGltZSgpO1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQyID0gZ2V0VGltZSgpO1xuICAgICAgICBpZiAodDIgLSB0ID49IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdCA9IGdldFRpbWUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGFkZFRpbWVyRnVuY3Rpb24oY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gYWZ0ZXIoZm4sIG51bVRpY2tzKSB7XG4gICAgaWYgKG51bVRpY2tzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBudW1UaWNrcy0tO1xuICAgICAgICBpZiAobnVtVGlja3MgPD0gMCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGNsZWFyKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGFkZFRpbWVyRnVuY3Rpb24oY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gZXZlcnkoZm4sIG51bVRpY2tzKSB7XG4gICAgbnVtVGlja3MgPSBudW1UaWNrcyB8fCAxO1xuICAgIHZhciBpbml0aWFsID0gbnVtVGlja3M7XG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBudW1UaWNrcy0tO1xuICAgICAgICBpZiAobnVtVGlja3MgPD0gMCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIG51bVRpY2tzID0gaW5pdGlhbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGFkZFRpbWVyRnVuY3Rpb24oY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xlYXIoZm4pIHtcbiAgICBGYW1vdXNFbmdpbmUucmVtb3ZlTGlzdGVuZXIoX2V2ZW50LCBmbik7XG59XG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gICAgdmFyIHRpbWVvdXQ7XG4gICAgdmFyIGN0eDtcbiAgICB2YXIgdGltZXN0YW1wO1xuICAgIHZhciByZXN1bHQ7XG4gICAgdmFyIGFyZ3M7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3R4ID0gdGhpcztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgdGltZXN0YW1wID0gZ2V0VGltZSgpO1xuICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbGFzdCA9IGdldFRpbWUgLSB0aW1lc3RhbXA7XG4gICAgICAgICAgICBpZiAobGFzdCA8IHdhaXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmbiwgd2FpdCAtIGxhc3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGN0eCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNsZWFyKHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmbiwgd2FpdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNldFRpbWVvdXQ6IHNldFRpbWVvdXQsXG4gICAgc2V0SW50ZXJ2YWw6IHNldEludGVydmFsLFxuICAgIGRlYm91bmNlOiBkZWJvdW5jZSxcbiAgICBhZnRlcjogYWZ0ZXIsXG4gICAgZXZlcnk6IGV2ZXJ5LFxuICAgIGNsZWFyOiBjbGVhclxufTsiLCJ2YXIgVXRpbGl0eSA9IHt9O1xuVXRpbGl0eS5EaXJlY3Rpb24gPSB7XG4gICAgWDogMCxcbiAgICBZOiAxLFxuICAgIFo6IDJcbn07XG5VdGlsaXR5LmFmdGVyID0gZnVuY3Rpb24gYWZ0ZXIoY291bnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGNvdW50ZXIgPSBjb3VudDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb3VudGVyLS07XG4gICAgICAgIGlmIChjb3VudGVyID09PSAwKVxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufTtcblV0aWxpdHkubG9hZFVSTCA9IGZ1bmN0aW9uIGxvYWRVUkwodXJsLCBjYWxsYmFjaykge1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gb25yZWFkeXN0YXRlY2hhbmdlKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICB4aHIuc2VuZCgpO1xufTtcblV0aWxpdHkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudEZyb21IVE1MID0gZnVuY3Rpb24gY3JlYXRlRG9jdW1lbnRGcmFnbWVudEZyb21IVE1MKGh0bWwpIHtcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB2YXIgcmVzdWx0ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHdoaWxlIChlbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSlcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5VdGlsaXR5LmNsb25lID0gZnVuY3Rpb24gY2xvbmUoYikge1xuICAgIHZhciBhO1xuICAgIGlmICh0eXBlb2YgYiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgYSA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBiW2tleV0gPT09ICdvYmplY3QnICYmIGJba2V5XSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChiW2tleV0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBhW2tleV0gPSBuZXcgQXJyYXkoYltrZXldLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYltrZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhW2tleV1baV0gPSBVdGlsaXR5LmNsb25lKGJba2V5XVtpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhW2tleV0gPSBVdGlsaXR5LmNsb25lKGJba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBhID0gYjtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBVdGlsaXR5OyIsInZhciBPcHRpb25zTWFuYWdlciA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL09wdGlvbnNNYW5hZ2VyJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvVHJhbnNmb3JtJyk7XG52YXIgVmlld1NlcXVlbmNlID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvVmlld1NlcXVlbmNlJyk7XG52YXIgVXRpbGl0eSA9IHJlcXVpcmUoJ2ZhbW91cy91dGlsaXRpZXMvVXRpbGl0eScpO1xuZnVuY3Rpb24gU2VxdWVudGlhbExheW91dChvcHRpb25zKSB7XG4gICAgdGhpcy5faXRlbXMgPSBudWxsO1xuICAgIHRoaXMuX3NpemUgPSBudWxsO1xuICAgIHRoaXMuX291dHB1dEZ1bmN0aW9uID0gU2VxdWVudGlhbExheW91dC5ERUZBVUxUX09VVFBVVF9GVU5DVElPTjtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuY29uc3RydWN0b3IuREVGQVVMVF9PUFRJT05TKTtcbiAgICB0aGlzLm9wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy5faXRlbXNDYWNoZSA9IFtdO1xuICAgIHRoaXMuX291dHB1dENhY2hlID0ge1xuICAgICAgICBzaXplOiBudWxsLFxuICAgICAgICB0YXJnZXQ6IHRoaXMuX2l0ZW1zQ2FjaGVcbiAgICB9O1xuICAgIGlmIChvcHRpb25zKVxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59XG5TZXF1ZW50aWFsTGF5b3V0LkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBkaXJlY3Rpb246IFV0aWxpdHkuRGlyZWN0aW9uLlksXG4gICAgaXRlbVNwYWNpbmc6IDAsXG4gICAgZGVmYXVsdEl0ZW1TaXplOiBbXG4gICAgICAgIDUwLFxuICAgICAgICA1MFxuICAgIF1cbn07XG5TZXF1ZW50aWFsTGF5b3V0LkRFRkFVTFRfT1VUUFVUX0ZVTkNUSU9OID0gZnVuY3Rpb24gREVGQVVMVF9PVVRQVVRfRlVOQ1RJT04oaW5wdXQsIG9mZnNldCwgaW5kZXgpIHtcbiAgICB2YXIgdHJhbnNmb3JtID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gVXRpbGl0eS5EaXJlY3Rpb24uWCA/IFRyYW5zZm9ybS50cmFuc2xhdGUob2Zmc2V0LCAwKSA6IFRyYW5zZm9ybS50cmFuc2xhdGUoMCwgb2Zmc2V0KTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcbiAgICAgICAgdGFyZ2V0OiBpbnB1dC5yZW5kZXIoKVxuICAgIH07XG59O1xuU2VxdWVudGlhbExheW91dC5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uIGdldFNpemUoKSB7XG4gICAgaWYgKCF0aGlzLl9zaXplKVxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xufTtcblNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLnNlcXVlbmNlRnJvbSA9IGZ1bmN0aW9uIHNlcXVlbmNlRnJvbShpdGVtcykge1xuICAgIGlmIChpdGVtcyBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICBpdGVtcyA9IG5ldyBWaWV3U2VxdWVuY2UoaXRlbXMpO1xuICAgIHRoaXMuX2l0ZW1zID0gaXRlbXM7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU2VxdWVudGlhbExheW91dC5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9uc01hbmFnZXIuc2V0T3B0aW9ucy5hcHBseSh0aGlzLm9wdGlvbnNNYW5hZ2VyLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLnNldE91dHB1dEZ1bmN0aW9uID0gZnVuY3Rpb24gc2V0T3V0cHV0RnVuY3Rpb24ob3V0cHV0RnVuY3Rpb24pIHtcbiAgICB0aGlzLl9vdXRwdXRGdW5jdGlvbiA9IG91dHB1dEZ1bmN0aW9uO1xuICAgIHJldHVybiB0aGlzO1xufTtcblNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgbGVuZ3RoID0gMDtcbiAgICB2YXIgZ2lydGggPSAwO1xuICAgIHZhciBsZW5ndGhEaW0gPSB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSBVdGlsaXR5LkRpcmVjdGlvbi5YID8gMCA6IDE7XG4gICAgdmFyIGdpcnRoRGltID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gVXRpbGl0eS5EaXJlY3Rpb24uWCA/IDEgOiAwO1xuICAgIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMuX2l0ZW1zO1xuICAgIHZhciByZXN1bHQgPSB0aGlzLl9pdGVtc0NhY2hlO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoY3VycmVudE5vZGUpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBjdXJyZW50Tm9kZS5nZXQoKTtcbiAgICAgICAgaWYgKCFpdGVtKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIHZhciBpdGVtU2l6ZTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5nZXRTaXplKVxuICAgICAgICAgICAgaXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcbiAgICAgICAgaWYgKCFpdGVtU2l6ZSlcbiAgICAgICAgICAgIGl0ZW1TaXplID0gdGhpcy5vcHRpb25zLmRlZmF1bHRJdGVtU2l6ZTtcbiAgICAgICAgaWYgKGl0ZW1TaXplW2dpcnRoRGltXSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgIGdpcnRoID0gTWF0aC5tYXgoZ2lydGgsIGl0ZW1TaXplW2dpcnRoRGltXSk7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9vdXRwdXRGdW5jdGlvbi5jYWxsKHRoaXMsIGl0ZW0sIGxlbmd0aCwgaSk7XG4gICAgICAgIHJlc3VsdFtpXSA9IG91dHB1dDtcbiAgICAgICAgaWYgKGl0ZW1TaXplW2xlbmd0aERpbV0gJiYgaXRlbVNpemVbbGVuZ3RoRGltXSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgIGxlbmd0aCArPSBpdGVtU2l6ZVtsZW5ndGhEaW1dICsgdGhpcy5vcHRpb25zLml0ZW1TcGFjaW5nO1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmdldE5leHQoKTtcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICB0aGlzLl9pdGVtc0NhY2hlLnNwbGljZShpKTtcbiAgICBpZiAoIWdpcnRoKVxuICAgICAgICBnaXJ0aCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoIXRoaXMuX3NpemUpXG4gICAgICAgIHRoaXMuX3NpemUgPSBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdO1xuICAgIHRoaXMuX3NpemVbbGVuZ3RoRGltXSA9IGxlbmd0aCAtIHRoaXMub3B0aW9ucy5pdGVtU3BhY2luZztcbiAgICB0aGlzLl9zaXplW2dpcnRoRGltXSA9IGdpcnRoO1xuICAgIHRoaXMuX291dHB1dENhY2hlLnNpemUgPSB0aGlzLmdldFNpemUoKTtcbiAgICByZXR1cm4gdGhpcy5fb3V0cHV0Q2FjaGU7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTZXF1ZW50aWFsTGF5b3V0OyIsImZ1bmN0aW9uIENhcm91c2VsKHQsZSl7U2l6ZUF3YXJlVmlldy5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5faXNQbHVnaW49ZSx0aGlzLl9kYXRhPXtpbmRleDp2b2lkIDAscGFnaW5hdGVkSW5kZXg6MSxpdGVtc1BlclBhZ2U6MSxpdGVtczp2b2lkIDAscmVuZGVyYWJsZXM6W10sbGVuZ3RoOnZvaWQgMH0sdGhpcy5zeW5jPW5ldyBHZW5lcmljU3luYyx0aGlzLmxheW91dERlZmluaXRpb24sdGhpcy5sYXlvdXRDb250cm9sbGVyPW5ldyBMYXlvdXRDb250cm9sbGVyKHtjbGFzc2VzOltcImZhbW91cy1jYXJvdXNlbC1jb250YWluZXJcIl0saXRlbXNQZXJQYWdlOnRoaXMuX2RhdGEuaXRlbXNQZXJQYWdlLGxvb3A6dGhpcy5vcHRpb25zLmxvb3Asc3luYzp0aGlzLnN5bmN9KSx0aGlzLmxheW91dENvbnRyb2xsZXIuX2Nvbm5lY3RDb250YWluZXIodGhpcyksdGhpcy5jbGlja0xlbmd0aD1udWxsLHRoaXMuX2luaXQoKX12YXIgUmVuZGVyTm9kZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvUmVuZGVyTm9kZVwiKSxNb2RpZmllcj1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvTW9kaWZpZXJcIiksRW5naW5lPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9FbmdpbmVcIiksU3VyZmFjZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvU3VyZmFjZVwiKSxTaXplQXdhcmVWaWV3PXJlcXVpcmUoXCIuL2NvbnN0cnVjdG9ycy9TaXplQXdhcmVWaWV3XCIpLFRpbWVyPXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1RpbWVyXCIpLEZhc3RDbGljaz1yZXF1aXJlKFwiZmFtb3VzL2lucHV0cy9GYXN0Q2xpY2tcIiksUmVnaXN0ZXJFYXNpbmc9cmVxdWlyZShcIi4vcmVnaXN0cmllcy9FYXNpbmdcIiksUmVnaXN0ZXJQaHlzaWNzPXJlcXVpcmUoXCIuL3JlZ2lzdHJpZXMvUGh5c2ljc1wiKSxHZW5lcmljU3luYz1yZXF1aXJlKFwiZmFtb3VzL2lucHV0cy9HZW5lcmljU3luY1wiKSxUb3VjaFN5bmM9cmVxdWlyZShcImZhbW91cy9pbnB1dHMvVG91Y2hTeW5jXCIpLE1vdXNlU3luYz1yZXF1aXJlKFwiZmFtb3VzL2lucHV0cy9Nb3VzZVN5bmNcIiksU2Nyb2xsU3luYz1yZXF1aXJlKFwiZmFtb3VzL2lucHV0cy9TY3JvbGxTeW5jXCIpLFNsaWRlPXJlcXVpcmUoXCIuL3NsaWRlcy9TbGlkZVwiKSxBcnJvd3M9cmVxdWlyZShcIi4vY29tcG9uZW50cy9BcnJvd3NcIiksRG90cz1yZXF1aXJlKFwiLi9jb21wb25lbnRzL0RvdHNcIiksTGF5b3V0Q29udHJvbGxlcj1yZXF1aXJlKFwiLi9sYXlvdXRzL0xheW91dENvbnRyb2xsZXJcIiksTGF5b3V0RmFjdG9yeT1yZXF1aXJlKFwiLi9sYXlvdXRzL0xheW91dEZhY3RvcnlcIik7R2VuZXJpY1N5bmMucmVnaXN0ZXIoe21vdXNlOk1vdXNlU3luYyx0b3VjaDpUb3VjaFN5bmMsc2Nyb2xsOlNjcm9sbFN5bmN9KSxDYXJvdXNlbC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTaXplQXdhcmVWaWV3LnByb3RvdHlwZSksQ2Fyb3VzZWwucHJvdG90eXBlLmNvbnN0cnVjdG9yPUNhcm91c2VsLENhcm91c2VsLkVWRU5UUz17c2VsZWN0aW9uOlwic2VsZWN0aW9uQ2hhbmdlXCIsaXRlbUNsaWNrOlwiaXRlbUNsaWNrXCJ9LENhcm91c2VsLl9oYW5kbGVLZXl1cD1mdW5jdGlvbih0KXszNz09dC5rZXlDb2RlPyh0aGlzLnByZXZpb3VzKCksdGhpcy5fZXZlbnRPdXRwdXQuZW1pdChDYXJvdXNlbC5FVkVOVFMuc2VsZWN0aW9uLHRoaXMuX2RhdGEuaW5kZXgpKTozOT09dC5rZXlDb2RlJiYodGhpcy5uZXh0KCksdGhpcy5fZXZlbnRPdXRwdXQuZW1pdChDYXJvdXNlbC5FVkVOVFMuc2VsZWN0aW9uLHRoaXMuX2RhdGEuaW5kZXgpKX0sQ2Fyb3VzZWwucHJvdG90eXBlLnNldENvbnRlbnRMYXlvdXQ9ZnVuY3Rpb24odCl7aWYoIXQpdGhyb3dcIk5vIGxheW91dCBkZWZpbml0aW9uIGdpdmVuIVwiO3JldHVybiB0aGlzLmxheW91dERlZmluaXRpb249dCx0aGlzLmxheW91dENvbnRyb2xsZXIuc2V0TGF5b3V0KHRoaXMubGF5b3V0RGVmaW5pdGlvbiksdGhpc30sQ2Fyb3VzZWwucHJvdG90eXBlLmdldENvbnRlbnRMYXlvdXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sYXlvdXREZWZpbml0aW9ufSxDYXJvdXNlbC5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRJbmRleD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kYXRhLmluZGV4fSxDYXJvdXNlbC5wcm90b3R5cGUuc2V0U2VsZWN0ZWRJbmRleD1mdW5jdGlvbih0LGUpe3JldHVybiB0PT10aGlzLl9kYXRhLmluZGV4P3RoaXMuX2RhdGEuaW5kZXg6KHRoaXMuX2RhdGEuaW5kZXg9dGhpcy5fY2xhbXAodCksdGhpcy5fZGF0YS5wYWdpbmF0ZWRJbmRleD10aGlzLl9jbGFtcChNYXRoLmZsb29yKHRoaXMuX2RhdGEuaW5kZXgvdGhpcy5fZGF0YS5pdGVtc1BlclBhZ2UpKSxlPXZvaWQgMD09PWU/ITA6ZSx0aGlzLmxheW91dENvbnRyb2xsZXIuc2V0SW5kZXgodGhpcy5fZGF0YS5pbmRleCxlKSx0aGlzLmRvdHMmJnRoaXMuZG90cy5zZXRJbmRleCh0aGlzLl9kYXRhLnBhZ2luYXRlZEluZGV4KSx0aGlzLl9kYXRhLmluZGV4KX0sQ2Fyb3VzZWwucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9kYXRhLmluZGV4K3RoaXMuX2RhdGEuaXRlbXNQZXJQYWdlO3JldHVybiB0aGlzLnNldFNlbGVjdGVkSW5kZXgodCl9LENhcm91c2VsLnByb3RvdHlwZS5wcmV2aW91cz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2RhdGEuaW5kZXgtdGhpcy5fZGF0YS5pdGVtc1BlclBhZ2U7cmV0dXJuIHRoaXMuc2V0U2VsZWN0ZWRJbmRleCh0KX0sQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1zPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RhdGEuaXRlbXN9LENhcm91c2VsLnByb3RvdHlwZS5zZXRJdGVtcz1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fZGF0YS5pdGVtcz10LnNsaWNlKDApLHRoaXMuX2RhdGEubGVuZ3RoPXRoaXMuX2RhdGEuaXRlbXMubGVuZ3RoLHRoaXMuX2luaXRJdGVtcygpLHRoaXMubGF5b3V0Q29udHJvbGxlci5zZXRJdGVtcyh0aGlzLl9kYXRhLnJlbmRlcmFibGVzKSx0aGlzfSxDYXJvdXNlbC5wcm90b3R5cGUuZ2V0U2l6ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFBhcmVudFNpemUoKX0sQ2Fyb3VzZWwucHJvdG90eXBlLnNldFNpemU9ZnVuY3Rpb24oKXt9LENhcm91c2VsLnByb3RvdHlwZS5faW5pdD1mdW5jdGlvbigpe3RoaXMuc2V0SXRlbXModGhpcy5vcHRpb25zLml0ZW1zKSx0aGlzLnNldFNlbGVjdGVkSW5kZXgodGhpcy5vcHRpb25zLnNlbGVjdGVkSW5kZXgsITEpLHRoaXMuX2luaXRDb250ZW50KCksdGhpcy5fZXZlbnRzKCksVGltZXIuYWZ0ZXIoZnVuY3Rpb24oKXt0aGlzLl9yZXNpemUoKSx0aGlzLnNldENvbnRlbnRMYXlvdXQodGhpcy5vcHRpb25zLmNvbnRlbnRMYXlvdXQpfS5iaW5kKHRoaXMpLDIpfSxDYXJvdXNlbC5wcm90b3R5cGUuX2luaXRDb250ZW50PWZ1bmN0aW9uKCl7dGhpcy5fZXZlbnRDb250YWluZXI9bmV3IFN1cmZhY2UsdGhpcy5fZXZlbnRDb250YWluZXIucGlwZSh0aGlzKSx0aGlzLmFkZChuZXcgTW9kaWZpZXIoe29wYWNpdHk6MH0pKS5hZGQodGhpcy5fZXZlbnRDb250YWluZXIpLHRoaXMub3B0aW9ucy5hcnJvd3NFbmFibGVkJiYodGhpcy5hcnJvd3M9bmV3IEFycm93cyh7cG9zaXRpb246dGhpcy5vcHRpb25zLmFycm93c1Bvc2l0aW9uLHBhZGRpbmc6dGhpcy5vcHRpb25zLmFycm93c1BhZGRpbmcscHJldmlvdXNJY29uVVJMOnRoaXMub3B0aW9ucy5hcnJvd3NQcmV2aW91c0ljb25VUkwsbmV4dEljb25VUkw6dGhpcy5vcHRpb25zLmFycm93c05leHRJY29uVVJMLGFuaW1hdGVPbkNsaWNrOnRoaXMub3B0aW9ucy5hcnJvd3NBbmltYXRlT25DbGljayx0b2dnbGVEaXNwbGF5T25Ib3Zlcjp0aGlzLm9wdGlvbnMuYXJyb3dzVG9nZ2xlRGlzcGxheU9uSG92ZXJ9KSx0aGlzLmFkZCh0aGlzLmFycm93cykpLHRoaXMub3B0aW9ucy5kb3RzRW5hYmxlZCYmKHRoaXMuZG90cz1uZXcgRG90cyh7cG9zaXRpb246dGhpcy5vcHRpb25zLmRvdHNQb3NpdGlvbixwYWRkaW5nOnRoaXMub3B0aW9ucy5kb3RzUGFkZGluZyxzaXplOnRoaXMub3B0aW9ucy5kb3RzU2l6ZSxob3Jpem9udGFsU3BhY2luZzp0aGlzLm9wdGlvbnMuZG90c0hvcml6b250YWxTcGFjaW5nLGxlbmd0aDpNYXRoLmNlaWwodGhpcy5fZGF0YS5pdGVtcy5sZW5ndGgvdGhpcy5fZGF0YS5pdGVtc1BlclBhZ2UpLHNlbGVjdGVkSW5kZXg6dGhpcy5vcHRpb25zLnNlbGVjdGVkSW5kZXgsYXJyb3dzVG9nZ2xlRGlzcGxheU9uSG92ZXI6dGhpcy5vcHRpb25zLmFycm93c1RvZ2dsZURpc3BsYXlPbkhvdmVyfSksdGhpcy5hZGQodGhpcy5kb3RzKSksdGhpcy5fc2l6ZU1vZGlmaWVyPW5ldyBNb2RpZmllcih7c2l6ZTp0aGlzLl9nZXRDYXJvdXNlbFNpemUoKSxvcmlnaW46Wy41LC41XSxhbGlnbjpbLjUsLjVdfSksdGhpcy5hZGQodGhpcy5fc2l6ZU1vZGlmaWVyKS5hZGQodGhpcy5sYXlvdXRDb250cm9sbGVyKX0sQ2Fyb3VzZWwucHJvdG90eXBlLl9pbml0SXRlbXM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9MDt0PHRoaXMuX2RhdGEuaXRlbXMubGVuZ3RoO3QrKyl7aWYodGhpcy5fZGF0YS5pdGVtc1t0XS5yZW5kZXIpdGhpcy5fZGF0YS5yZW5kZXJhYmxlcy5wdXNoKHRoaXMuX2RhdGEuaXRlbXNbdF0pO2Vsc2V7dmFyIGU9bmV3IFNsaWRlKHRoaXMuX2RhdGEuaXRlbXNbdF0pO3RoaXMuX2RhdGEucmVuZGVyYWJsZXMucHVzaChlKX10aGlzLl9kYXRhLnJlbmRlcmFibGVzW3RdLnBpcGUodGhpcy5zeW5jKSx0aGlzLl9kYXRhLnJlbmRlcmFibGVzW3RdLm9uKFwiY2xpY2tcIix0aGlzLl9hZGRUb0NsaWNrUXVldWUuYmluZCh0aGlzLENhcm91c2VsLkVWRU5UUy5pdGVtQ2xpY2ssdCkpfX0sQ2Fyb3VzZWwucHJvdG90eXBlLl9ldmVudHM9ZnVuY3Rpb24oKXt0aGlzLl9ldmVudElucHV0Lm9uKFwicGFyZW50UmVzaXplXCIsdGhpcy5fcmVzaXplLmJpbmQodGhpcykpO3ZhciB0PVtdO3RoaXMub3B0aW9ucy50b3VjaEVuYWJsZWQmJnQucHVzaChcInRvdWNoXCIpLHRoaXMub3B0aW9ucy5tb3VzZUVuYWJsZWQmJnQucHVzaChcIm1vdXNlXCIpLHRoaXMuc3luYy5hZGRTeW5jKHQpLHRoaXMuX2V2ZW50Q29udGFpbmVyLnBpcGUodGhpcy5zeW5jKTt2YXIgZT1udWxsO3RoaXMuc3luYy5vbihcInN0YXJ0XCIsZnVuY3Rpb24oKXtlPW5ldyBEYXRlfSksdGhpcy5zeW5jLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXt0aGlzLmNsaWNrTGVuZ3RoPW5ldyBEYXRlLWV9LmJpbmQodGhpcykpLHRoaXMub3B0aW9ucy5rZXlib2FyZEVuYWJsZWQmJih0aGlzLl9oYW5kbGVLZXl1cD1DYXJvdXNlbC5faGFuZGxlS2V5dXAuYmluZCh0aGlzKSxFbmdpbmUub24oXCJrZXl1cFwiLHRoaXMuX2hhbmRsZUtleXVwKSksdGhpcy5hcnJvd3MmJih0aGlzLmFycm93cy5vbihcInByZXZpb3VzXCIsZnVuY3Rpb24oKXt0aGlzLnByZXZpb3VzKCksdGhpcy5fZXZlbnRPdXRwdXQuZW1pdChDYXJvdXNlbC5FVkVOVFMuc2VsZWN0aW9uLHRoaXMuX2RhdGEuaW5kZXgpfS5iaW5kKHRoaXMpKSx0aGlzLmFycm93cy5vbihcIm5leHRcIixmdW5jdGlvbigpe3RoaXMubmV4dCgpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KX0uYmluZCh0aGlzKSkpLHRoaXMub3B0aW9ucy5hcnJvd3NUb2dnbGVEaXNwbGF5T25Ib3ZlciYmdGhpcy5hcnJvd3MmJih0aGlzLl9ldmVudElucHV0Lm9uKFwibW91c2VvdmVyXCIsdGhpcy5hcnJvd3Muc2hvdy5iaW5kKHRoaXMuYXJyb3dzKSksdGhpcy5fZXZlbnRJbnB1dC5vbihcIm1vdXNlb3V0XCIsdGhpcy5hcnJvd3MuaGlkZS5iaW5kKHRoaXMuYXJyb3dzKSkpLHRoaXMuZG90cyYmdGhpcy5kb3RzLm9uKFwic2V0XCIsZnVuY3Rpb24odCl7dGhpcy5zZXRTZWxlY3RlZEluZGV4KHQqdGhpcy5fZGF0YS5pdGVtc1BlclBhZ2UpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KX0uYmluZCh0aGlzKSksdGhpcy5kb3RzJiZ0aGlzLmFycm93cyYmKHRoaXMuZG90cy5vbihcInNob3dBcnJvd3NcIix0aGlzLmFycm93cy5zaG93LmJpbmQodGhpcy5hcnJvd3MpKSx0aGlzLmRvdHMub24oXCJoaWRlQXJyb3dzXCIsdGhpcy5hcnJvd3MuaGlkZS5iaW5kKHRoaXMuYXJyb3dzKSkpLHRoaXMubGF5b3V0Q29udHJvbGxlci5vbihcInBhZ2luYXRpb25DaGFuZ2VcIix0aGlzLl9zZXRJdGVtc1BlclBhZ2UuYmluZCh0aGlzKSksdGhpcy5sYXlvdXRDb250cm9sbGVyLm9uKFwicHJldmlvdXNcIixmdW5jdGlvbigpe3RoaXMucHJldmlvdXMoKSx0aGlzLl9ldmVudE91dHB1dC5lbWl0KENhcm91c2VsLkVWRU5UUy5zZWxlY3Rpb24sdGhpcy5fZGF0YS5pbmRleCl9LmJpbmQodGhpcykpLHRoaXMubGF5b3V0Q29udHJvbGxlci5vbihcIm5leHRcIixmdW5jdGlvbigpe3RoaXMubmV4dCgpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KX0uYmluZCh0aGlzKSksdGhpcy5sYXlvdXRDb250cm9sbGVyLm9uKFwic2V0XCIsZnVuY3Rpb24odCl7dGhpcy5zZXRTZWxlY3RlZEluZGV4KHQpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KX0uYmluZCh0aGlzKSl9LENhcm91c2VsLnByb3RvdHlwZS5fYWRkVG9DbGlja1F1ZXVlPWZ1bmN0aW9uKHQsZSl7dGhpcy5jbGlja0xlbmd0aDwxNTAmJnRoaXMuX2V2ZW50T3V0cHV0LmVtaXQodCxlKX0sQ2Fyb3VzZWwucHJvdG90eXBlLl9zZXRJdGVtc1BlclBhZ2U9ZnVuY3Rpb24odCl7dGhpcy5fZGF0YS5pdGVtc1BlclBhZ2UhPT10JiYodGhpcy5fZGF0YS5pdGVtc1BlclBhZ2U9dCx0aGlzLmRvdHMmJnRoaXMuZG90cy5zZXRMZW5ndGgoTWF0aC5jZWlsKHRoaXMuX2RhdGEuaXRlbXMubGVuZ3RoL3QpLHQsdGhpcy5fZGF0YS5pbmRleCkpfSxDYXJvdXNlbC5wcm90b3R5cGUuX3Jlc2l6ZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2dldENhcm91c2VsU2l6ZSgpO3RoaXMubGF5b3V0Q29udHJvbGxlci5zZXRTaXplKHQpLHRoaXMuX3NpemVNb2RpZmllci5zZXRTaXplKHQpfSxDYXJvdXNlbC5wcm90b3R5cGUuX2dldENhcm91c2VsU2l6ZT1mdW5jdGlvbigpe3ZhciB0PVtdLGU9dGhpcy5nZXRTaXplKCk7cmV0dXJuIHRoaXMuX2lzUGx1Z2luPyh0WzBdPWVbMF0tdGhpcy5vcHRpb25zLmNvbnRlbnRQYWRkaW5nWzBdLHRbMV09ZVsxXS10aGlzLm9wdGlvbnMuY29udGVudFBhZGRpbmdbMV0pOih0WzBdPVwibnVtYmVyXCI9PXR5cGVvZiB0aGlzLm9wdGlvbnMuY2Fyb3VzZWxTaXplWzBdP3RoaXMub3B0aW9ucy5jYXJvdXNlbFNpemVbMF06cGFyc2VGbG9hdCh0aGlzLm9wdGlvbnMuY2Fyb3VzZWxTaXplWzBdKS8xMDAqZVswXSx0WzFdPVwibnVtYmVyXCI9PXR5cGVvZiB0aGlzLm9wdGlvbnMuY2Fyb3VzZWxTaXplWzFdP3RoaXMub3B0aW9ucy5jYXJvdXNlbFNpemVbMV06cGFyc2VGbG9hdCh0aGlzLm9wdGlvbnMuY2Fyb3VzZWxTaXplWzFdKS8xMDAqZVsxXSksdH0sQ2Fyb3VzZWwucHJvdG90eXBlLl9jbGFtcD1mdW5jdGlvbih0LGUpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBlJiYoZT10aGlzLm9wdGlvbnMubG9vcCksdD50aGlzLl9kYXRhLmxlbmd0aC0xP3Q9ZT8wOnRoaXMuX2RhdGEubGVuZ3RoLTE6MD50JiYodD1lP3RoaXMuX2RhdGEubGVuZ3RoLTE6MCksdH0sQ2Fyb3VzZWwuU2luZ3VsYXJTb2Z0U2NhbGU9TGF5b3V0RmFjdG9yeS5TaW5ndWxhclNvZnRTY2FsZSxDYXJvdXNlbC5TaW5ndWxhclR3aXN0PUxheW91dEZhY3RvcnkuU2luZ3VsYXJUd2lzdCxDYXJvdXNlbC5TaW5ndWxhclBhcmFsbGF4PUxheW91dEZhY3RvcnkuU2luZ3VsYXJQYXJhbGxheCxDYXJvdXNlbC5TaW5ndWxhclNsaWRlQmVoaW5kPUxheW91dEZhY3RvcnkuU2luZ3VsYXJTbGlkZUJlaGluZCxDYXJvdXNlbC5TaW5ndWxhck9wYWNpdHk9TGF5b3V0RmFjdG9yeS5TaW5ndWxhck9wYWNpdHksQ2Fyb3VzZWwuU2luZ3VsYXJTbGlkZUluPUxheW91dEZhY3RvcnkuU2luZ3VsYXJTbGlkZUluLENhcm91c2VsLlNlcXVlbnRpYWxMYXlvdXQ9TGF5b3V0RmFjdG9yeS5TZXF1ZW50aWFsTGF5b3V0LENhcm91c2VsLkdyaWRMYXlvdXQ9TGF5b3V0RmFjdG9yeS5HcmlkTGF5b3V0LENhcm91c2VsLkNvdmVyZmxvd0xheW91dD1MYXlvdXRGYWN0b3J5LkNvdmVyZmxvd0xheW91dCxDYXJvdXNlbC5ERUZBVUxUX09QVElPTlM9e2NvbnRlbnRMYXlvdXQ6Q2Fyb3VzZWwuU2luZ3VsYXJTb2Z0U2NhbGUsY2Fyb3VzZWxTaXplOltcIjEwMCVcIixcIjEwMCVcIl0sYXJyb3dzRW5hYmxlZDohMCxhcnJvd3NQb3NpdGlvbjpcIm1pZGRsZVwiLGFycm93c1BhZGRpbmc6WzEwLDBdLGFycm93c1ByZXZpb3VzSWNvblVSTDp2b2lkIDAsYXJyb3dzTmV4dEljb25VUkw6dm9pZCAwLGFycm93c0FuaW1hdGVPbkNsaWNrOiEwLGFycm93c1RvZ2dsZURpc3BsYXlPbkhvdmVyOiEwLGRvdHNFbmFibGVkOiEwLGRvdHNQb3NpdGlvbjpcIm1pZGRsZVwiLGRvdHNQYWRkaW5nOlswLC0xMF0sZG90c1NpemU6WzEwLDEwXSxkb3RzSG9yaXpvbnRhbFNwYWNpbmc6MTAsY29udGVudFBhZGRpbmc6WzAsMF0sc2VsZWN0ZWRJbmRleDowLGl0ZW1zOltdLGxvb3A6ITAsa2V5Ym9hcmRFbmFibGVkOiEwLG1vdXNlRW5hYmxlZDohMCx0b3VjaEVuYWJsZWQ6ITB9LG1vZHVsZS5leHBvcnRzPUNhcm91c2VsOyIsImZ1bmN0aW9uIEFycm93cygpe1ZpZXcuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMuX3N0b3JhZ2U9e3ByZXY6e3N1cmZhY2U6bnVsbCxwb3NpdGlvbk1vZDpudWxsLGFuaW1hdGlvbk1vZDpudWxsLHRyYW5zVHJhbnNmb3JtOm51bGwsb3BhY2l0eVRyYW5zOm51bGx9LG5leHQ6e3N1cmZhY2U6bnVsbCxwb3NpdGlvbk1vZDpudWxsLGFuaW1hdGlvbk1vZDpudWxsLHRyYW5zVHJhbnNmb3JtOm51bGwsb3BhY2l0eVRyYW5zOm51bGx9fSx0aGlzLl9hcnJvd3NEaXNwbGF5ZWQ9dGhpcy5vcHRpb25zLnRvZ2dsZURpc3BsYXlPbkhvdmVyPyExOiEwLHRoaXMuX2FuaW1hdGlvblF1ZXVlPXtzaG93Q291bnQ6MCxoaWRlQ291bnQ6MH0sdGhpcy5faW5pdCgpfXZhciBWaWV3PXJlcXVpcmUoXCJmYW1vdXMvY29yZS9WaWV3XCIpLE1vZGlmaWVyPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9Nb2RpZmllclwiKSxJbWFnZVN1cmZhY2U9cmVxdWlyZShcImZhbW91cy9zdXJmYWNlcy9JbWFnZVN1cmZhY2VcIiksU3VyZmFjZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvU3VyZmFjZVwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxUcmFuc2l0aW9uYWJsZT1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlXCIpLFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm1cIiksVGltZXI9cmVxdWlyZShcImZhbW91cy91dGlsaXRpZXMvVGltZXJcIik7QXJyb3dzLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKSxBcnJvd3MucHJvdG90eXBlLmNvbnN0cnVjdG9yPUFycm93cyxBcnJvd3MuREVGQVVMVF9PUFRJT05TPXtwb3NpdGlvbjpcImNlbnRlclwiLHBhZGRpbmc6WzEwLDBdLHByZXZpb3VzSWNvblVSTDp2b2lkIDAsbmV4dEljb25VUkw6dm9pZCAwLGFuaW1hdGVPbkNsaWNrOiEwLHRvZ2dsZURpc3BsYXlPbkhvdmVyOiEwfSxBcnJvd3MuUE9TSVRJT05fVE9fQUxJR049e2JvdHRvbToxLG1pZGRsZTouNSx0b3A6MH0sQXJyb3dzLkFOSU1BVElPTl9PUFRJT05TPXtjbGljazp7b2Zmc2V0OjEwLHRyYW5zaXRpb246e2N1cnZlOlwib3V0QmFja1wiLGR1cmF0aW9uOjI1MH19LGRpc3BsYXk6e2N1cnZlOlwib3V0RXhwb1wiLGR1cmF0aW9uOjYwMH19LEFycm93cy5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3RoaXMuX2Fycm93c0Rpc3BsYXllZHx8KHRoaXMuX2Fycm93c0Rpc3BsYXllZD0hMCx0aGlzLl9hbmltYXRpb25RdWV1ZS5zaG93Q291bnQrKyx0aGlzLl9xdWV1ZUFuaW1hdGlvbihcInNob3dcIikpfSxBcnJvd3MucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXt0aGlzLl9hcnJvd3NEaXNwbGF5ZWQmJih0aGlzLl9hcnJvd3NEaXNwbGF5ZWQ9ITEsdGhpcy5fYW5pbWF0aW9uUXVldWUuaGlkZUNvdW50KyssdGhpcy5fcXVldWVBbmltYXRpb24oXCJoaWRlXCIpKX0sQXJyb3dzLnByb3RvdHlwZS5faW5pdD1mdW5jdGlvbigpe3RoaXMuX2luaXRDb250ZW50KCksdGhpcy5fZXZlbnRzKHRoaXMpfSxBcnJvd3MucHJvdG90eXBlLl9pbml0Q29udGVudD1mdW5jdGlvbigpe3ZhciBvPXRoaXMuX2RlZmluZU9wdGlvbnModGhpcy5vcHRpb25zLnBvc2l0aW9uKSx0PXRoaXMuX2Fycm93c0Rpc3BsYXllZD8xOjA7Zm9yKHZhciByIGluIG8pe3ZhciBpPXRoaXMuX3N0b3JhZ2Vbcl07aS5wb3NpdGlvbk1vZD1uZXcgTW9kaWZpZXIoe29yaWdpbjpbLjUsLjVdLGFsaWduOlsuNSwuNV0sdHJhbnNmb3JtOlRyYW5zZm9ybS50cmFuc2xhdGUob1tyXS50cmFuc2xhdGlvblswXSxvW3JdLnRyYW5zbGF0aW9uWzFdKX0pLGkudHJhbnNUcmFuc2Zvcm09bmV3IFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLGkub3BhY2l0eVRyYW5zPW5ldyBUcmFuc2l0aW9uYWJsZSgwKSxpLmFuaW1hdGlvbk1vZD1uZXcgTW9kaWZpZXIoe3RyYW5zZm9ybTppLnRyYW5zVHJhbnNmb3JtLG9wYWNpdHk6aS5vcGFjaXR5VHJhbnN9KSxpLnN1cmZhY2U9bmV3IEltYWdlU3VyZmFjZSh7Y2xhc3NlczpbXCJmYW1vdXMtY2Fyb3VzZWwtYXJyb3dcIixvW3JdLmNsYXNzTmFtZV0sY29udGVudDpvW3JdLmljb25VUkwsc2l6ZTpbITAsITBdLHByb3BlcnRpZXM6b1tyXS5wcm9wZXJ0aWVzfSksdGhpcy5hZGQoaS5wb3NpdGlvbk1vZCkuYWRkKGkuYW5pbWF0aW9uTW9kKS5hZGQoaS5zdXJmYWNlKSxUaW1lci5hZnRlcihmdW5jdGlvbih0LHIsaSl7dC5wb3NpdGlvbk1vZC5zZXRPcmlnaW4ob1tyXS5wbGFjZW1lbnQpLHQucG9zaXRpb25Nb2Quc2V0QWxpZ24ob1tyXS5wbGFjZW1lbnQpLHQub3BhY2l0eVRyYW5zLnNldChpKX0uYmluZChudWxsLGkscix0KSwyKX19LEFycm93cy5wcm90b3R5cGUuX2RlZmluZU9wdGlvbnM9ZnVuY3Rpb24obyl7dmFyIHQ9dGhpcy5vcHRpb25zLnBhZGRpbmcscj0yLGk9NSxuPXtib3JkZXI6citcInB4IHNvbGlkICM0MDQwNDBcIixwYWRkaW5nOmkrXCJweFwiLGJvcmRlclJhZGl1czpcIjUwJVwiLHpJbmRleDoyfSxlPXtwcmV2OntjbGFzc05hbWU6XCJmYW1vdXMtY2Fyb3VzZWwtYXJyb3ctcHJldmlvdXNcIn0sbmV4dDp7Y2xhc3NOYW1lOlwiZmFtb3VzLWNhcm91c2VsLWFycm93LW5leHRcIn19LHM9LXItcjt2b2lkIDA9PT10aGlzLm9wdGlvbnMucHJldmlvdXNJY29uVVJMPyhlLnByZXYuaWNvblVSTD1cIi9pbWFnZXMvaWNvbnMvYXJyb3dfbGVmdF9kYXJrLnN2Z1wiLGUucHJldi5wcm9wZXJ0aWVzPW4pOihlLnByZXYuaWNvblVSTD10aGlzLm9wdGlvbnMucHJldmlvdXNJY29uVVJMLGUucHJldi5wcm9wZXJ0aWVzPXt6SW5kZXg6Mn0pLHZvaWQgMD09PXRoaXMub3B0aW9ucy5uZXh0SWNvblVSTD8oZS5uZXh0Lmljb25VUkw9XCIvaW1hZ2VzL2ljb25zL2Fycm93X3JpZ2h0X2Rhcmsuc3ZnXCIsZS5uZXh0LnByb3BlcnRpZXM9bixlLm5leHQuZXh0cmFYUGFkZGluZz1zKTooZS5uZXh0Lmljb25VUkw9dGhpcy5vcHRpb25zLm5leHRJY29uVVJMLGUubmV4dC5wcm9wZXJ0aWVzPXt6SW5kZXg6Mn0sZS5uZXh0LmV4dHJhWFBhZGRpbmc9MCk7dmFyIGE7cmV0dXJuIGE9XCJ0b3BcIj09PW8/MDpcIm1pZGRsZVwiPT09bz9zLzI6cyxlLnByZXYucGxhY2VtZW50PVswLEFycm93cy5QT1NJVElPTl9UT19BTElHTltvXV0sZS5wcmV2LnRyYW5zbGF0aW9uPVt0WzBdLGEtdFsxXV0sZS5uZXh0LnBsYWNlbWVudD1bMSxBcnJvd3MuUE9TSVRJT05fVE9fQUxJR05bb11dLGUubmV4dC50cmFuc2xhdGlvbj1bcy10WzBdLGEtdFsxXV0sZX0sQXJyb3dzLnByb3RvdHlwZS5fZXZlbnRzPWZ1bmN0aW9uKCl7dmFyIG89dGhpcy5fc3RvcmFnZS5wcmV2LnN1cmZhY2UsdD10aGlzLl9zdG9yYWdlLm5leHQuc3VyZmFjZTtvLm9uKFwiY2xpY2tcIix0aGlzLl9vblByZXYuYmluZCh0aGlzKSksdC5vbihcImNsaWNrXCIsdGhpcy5fb25OZXh0LmJpbmQodGhpcykpLHRoaXMub3B0aW9ucy50b2dnbGVEaXNwbGF5T25Ib3ZlciYmKG8ub24oXCJtb3VzZW92ZXJcIix0aGlzLnNob3cuYmluZCh0aGlzKSksdC5vbihcIm1vdXNlb3ZlclwiLHRoaXMuc2hvdy5iaW5kKHRoaXMpKSxvLm9uKFwibW91c2VvdXRcIix0aGlzLmhpZGUuYmluZCh0aGlzKSksdC5vbihcIm1vdXNlb3V0XCIsdGhpcy5oaWRlLmJpbmQodGhpcykpKX0sQXJyb3dzLnByb3RvdHlwZS5fb25QcmV2PWZ1bmN0aW9uKCl7dGhpcy5fZXZlbnRPdXRwdXQuZW1pdChcInByZXZpb3VzXCIpLHRoaXMuX2FuaW1hdGVBcnJvdyh0aGlzLl9zdG9yYWdlLnByZXYudHJhbnNUcmFuc2Zvcm0sLTEpfSxBcnJvd3MucHJvdG90eXBlLl9vbk5leHQ9ZnVuY3Rpb24oKXt0aGlzLl9ldmVudE91dHB1dC5lbWl0KFwibmV4dFwiKSx0aGlzLl9hbmltYXRlQXJyb3codGhpcy5fc3RvcmFnZS5uZXh0LnRyYW5zVHJhbnNmb3JtLDEpfSxBcnJvd3MucHJvdG90eXBlLl9hbmltYXRlQXJyb3c9ZnVuY3Rpb24obyx0KXtpZih0aGlzLm9wdGlvbnMuYW5pbWF0ZU9uQ2xpY2spe3ZhciByPUFycm93cy5BTklNQVRJT05fT1BUSU9OUy5jbGljaztvLmhhbHQoKSxvLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKHIub2Zmc2V0KnQsMCkse2R1cmF0aW9uOjF9LGZ1bmN0aW9uKCl7by5zZXQoVHJhbnNmb3JtLmlkZW50aXR5LHIudHJhbnNpdGlvbil9KX19LEFycm93cy5wcm90b3R5cGUuX3F1ZXVlQW5pbWF0aW9uPWZ1bmN0aW9uKCl7dmFyIG89dGhpcy5fYW5pbWF0aW9uUXVldWU7VGltZXIuc2V0VGltZW91dChmdW5jdGlvbigpe2Zvcig7by5zaG93Q291bnQ+MCYmby5oaWRlQ291bnQ+MDspby5zaG93Q291bnQtLSxvLmhpZGVDb3VudC0tO28uc2hvd0NvdW50PjA/KG8uc2hvd0NvdW50LS0sdGhpcy5fc2hvd09ySGlkZShcInNob3dcIikpOm8uaGlkZUNvdW50PjAmJihvLmhpZGVDb3VudC0tLHRoaXMuX3Nob3dPckhpZGUoXCJoaWRlXCIpKX0uYmluZCh0aGlzKSwyNSl9LEFycm93cy5wcm90b3R5cGUuX3Nob3dPckhpZGU9ZnVuY3Rpb24obyl7dmFyIHQscixpLG49QXJyb3dzLkFOSU1BVElPTl9PUFRJT05TLmRpc3BsYXksZT1uLmR1cmF0aW9uLHM9MS4yO1wic2hvd1wiPT09bz8odD0xLHI9MSxpPTApOih0PTAscj0uMDAxLGk9ZS8yKTt2YXIgYT10aGlzLl9zdG9yYWdlLnByZXYub3BhY2l0eVRyYW5zLHU9dGhpcy5fc3RvcmFnZS5uZXh0Lm9wYWNpdHlUcmFucyxwPXRoaXMuX3N0b3JhZ2UucHJldi50cmFuc1RyYW5zZm9ybSxjPXRoaXMuX3N0b3JhZ2UubmV4dC50cmFuc1RyYW5zZm9ybTthLmhhbHQoKSx1LmhhbHQoKSxwLmhhbHQoKSxjLmhhbHQoKSxhLmRlbGF5KGksZnVuY3Rpb24oKXthLnNldCh0LHtkdXJhdGlvbjplLzIsY3VydmU6XCJvdXRCYWNrXCJ9KSx1LnNldCh0LHtkdXJhdGlvbjplLzIsY3VydmU6XCJvdXRCYWNrXCJ9KX0pLHAuc2V0KFRyYW5zZm9ybS5zY2FsZShzLHMpLHtkdXJhdGlvbjoxKmUvNCxjdXJ2ZTpuLmN1cnZlfSxmdW5jdGlvbigpe3Auc2V0KFRyYW5zZm9ybS5zY2FsZShyLHIpLHtkdXJhdGlvbjozKmUvNCxjdXJ2ZTpuLmN1cnZlfSl9KSxjLnNldChUcmFuc2Zvcm0uc2NhbGUocyxzKSx7ZHVyYXRpb246MSplLzQsY3VydmU6bi5jdXJ2ZX0sZnVuY3Rpb24oKXtjLnNldChUcmFuc2Zvcm0uc2NhbGUocixyKSx7ZHVyYXRpb246MyplLzQsY3VydmU6bi5jdXJ2ZX0pfSl9LG1vZHVsZS5leHBvcnRzPUFycm93czsiLCJmdW5jdGlvbiBEb3RzKCl7U2l6ZUF3YXJlVmlldy5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5fZGF0YT17ZG90czpbXSxwYXJlbnRTaXplOltdLGRvdENvdW50OnRoaXMub3B0aW9ucy5sZW5ndGgsbGF5b3V0TW9kZWw6W10sc2VsZWN0ZWRJbmRleDp0aGlzLm9wdGlvbnMuc2VsZWN0ZWRJbmRleH0sdGhpcy5sYXlvdXQ9bmV3IFNlcXVlbnRpYWxMYXlvdXQoe2RlZmF1bHRJdGVtU2l6ZTp0aGlzLm9wdGlvbnMuc2l6ZX0pLHRoaXMucG9zaXRpb25Nb2Q9bmV3IE1vZGlmaWVyLHRoaXMuYW5pbWF0aW9uTW9kPW5ldyBNb2RpZmllcix0aGlzLm9wYWNpdHlUcmFucz1uZXcgVHJhbnNpdGlvbmFibGUoMSksdGhpcy50cmFuc1RyYW5zZm9ybT1uZXcgVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0sdGhpcy5kaXNwbGF5ZWQ9ITAsRXZlbnRIZWxwZXJzLndoZW4oZnVuY3Rpb24oKXtyZXR1cm4gMCE9PXRoaXMuZ2V0UGFyZW50U2l6ZSgpLmxlbmd0aH0uYmluZCh0aGlzKSx0aGlzLl9pbml0LmJpbmQodGhpcykpfXZhciBTaXplQXdhcmVWaWV3PXJlcXVpcmUoXCIuLi9jb25zdHJ1Y3RvcnMvU2l6ZUF3YXJlVmlld1wiKSxTdXJmYWNlPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9TdXJmYWNlXCIpLE1vZGlmaWVyPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9Nb2RpZmllclwiKSxSZW5kZXJOb2RlPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9SZW5kZXJOb2RlXCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLFRyYW5zaXRpb25hYmxlPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVcIiksVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybVwiKSxTZXF1ZW50aWFsTGF5b3V0PXJlcXVpcmUoXCJmYW1vdXMvdmlld3MvU2VxdWVudGlhbExheW91dFwiKSxUaW1lcj1yZXF1aXJlKFwiZmFtb3VzL3V0aWxpdGllcy9UaW1lclwiKSxFdmVudEhlbHBlcnM9cmVxdWlyZShcIi4uL2V2ZW50cy9FdmVudEhlbHBlcnNcIik7RG90cy5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTaXplQXdhcmVWaWV3LnByb3RvdHlwZSksRG90cy5wcm90b3R5cGUuY29uc3RydWN0b3I9RG90cyxEb3RzLkRFRkFVTFRfT1BUSU9OUz17cG9zaXRpb246XCJjZW50ZXJcIixwYWRkaW5nOlswLC0xMF0sc2l6ZTpbMTAsMTBdLGhvcml6b250YWxTcGFjaW5nOjEwLGxlbmd0aDoxLHNlbGVjdGVkSW5kZXg6MH0sRG90cy5QT1NJVElPTl9UT19BTElHTj17bGVmdDowLG1pZGRsZTouNSxyaWdodDoxfSxEb3RzLkFOSU1BVElPTl9PUFRJT05TPXtjbGljazp7b2Zmc2V0Oi03LHRyYW5zaXRpb246e2N1cnZlOlwib3V0RXhwb1wiLGR1cmF0aW9uOjI1MH19LGRpc3BsYXk6e3NjYWxlVXA6MS4xNSxkdXJhdGlvbjo2MDAsY3VydmU6XCJvdXRFeHBvXCJ9fSxEb3RzLnByb3RvdHlwZS5zZXRJbmRleD1mdW5jdGlvbih0KXtpZih0IT09dGhpcy5fZGF0YS5zZWxlY3RlZEluZGV4JiYhKHQ+PXRoaXMuX2RhdGEuZG90cy5sZW5ndGh8fDA+dCkpe3ZhciBlPXRoaXMuX2RhdGEuc2VsZWN0ZWRJbmRleDt0aGlzLl9kYXRhLmRvdHNbZV0uc3VyZmFjZS5yZW1vdmVDbGFzcyhcImZhbW91cy1jYXJvdXNlbC1kb3Qtc2VsZWN0ZWRcIiksdGhpcy5fZGF0YS5kb3RzW3RdLnN1cmZhY2UuYWRkQ2xhc3MoXCJmYW1vdXMtY2Fyb3VzZWwtZG90LXNlbGVjdGVkXCIpLHRoaXMuX2RhdGEuc2VsZWN0ZWRJbmRleD10fX0sRG90cy5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbih0KXtpZighdGhpcy5kaXNwbGF5ZWQpe3RoaXMub3BhY2l0eVRyYW5zLmhhbHQoKSx0aGlzLnRyYW5zVHJhbnNmb3JtLmhhbHQoKSx0aGlzLmRpc3BsYXllZD0hMDt2YXIgZT1Eb3RzLkFOSU1BVElPTl9PUFRJT05TLmRpc3BsYXk7dGhpcy5vcGFjaXR5VHJhbnMuc2V0KDEse2R1cmF0aW9uOjEwMCxjdXJ2ZTpcImluRXhwb1wifSksdGhpcy50cmFuc1RyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5KSx0aGlzLnRyYW5zVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uc2NhbGUoZS5zY2FsZVVwLGUuc2NhbGVVcCkse2R1cmF0aW9uOjEqZS5kdXJhdGlvbi8zLGN1cnZlOlwib3V0RXhwb1wifSxmdW5jdGlvbigpe3RoaXMudHJhbnNUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSx7ZHVyYXRpb246MiplLmR1cmF0aW9uLzMsY3VydmU6ZS5jdXJ2ZX0sdCl9LmJpbmQodGhpcykpfX0sRG90cy5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbih0KXtpZih0aGlzLmRpc3BsYXllZCl7dGhpcy5vcGFjaXR5VHJhbnMuaGFsdCgpLHRoaXMudHJhbnNUcmFuc2Zvcm0uaGFsdCgpLHRoaXMuZGlzcGxheWVkPSExO3ZhciBlPURvdHMuQU5JTUFUSU9OX09QVElPTlMuZGlzcGxheTt0aGlzLm9wYWNpdHlUcmFucy5zZXQoMSx7ZHVyYXRpb246ZS5kdXJhdGlvbixjdXJ2ZTplLmN1cnZlfSksdGhpcy50cmFuc1RyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnNjYWxlKGUuc2NhbGVVcCxlLnNjYWxlVXApLHtkdXJhdGlvbjouMjUqZS5kdXJhdGlvbixjdXJ2ZTpcIm91dEV4cG9cIn0sZnVuY3Rpb24oKXt0aGlzLnRyYW5zVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uc2NhbGUoMWUtNCwxZS00KSx7ZHVyYXRpb246Ljc1KmUuZHVyYXRpb24sY3VydmU6ZS5jdXJ2ZX0sdCl9LmJpbmQodGhpcykpfX0sRG90cy5wcm90b3R5cGUuc2V0TGVuZ3RoPWZ1bmN0aW9uKHQsZSxpKXt0aGlzLl9kYXRhLmRvdENvdW50PXQsdGhpcy5fZGF0YS5zZWxlY3RlZEluZGV4PU1hdGguZmxvb3IodGhpcy5fZGF0YS5zZWxlY3RlZEluZGV4L2UpLHRoaXMuaGlkZShmdW5jdGlvbigpe3RoaXMuX2luaXQoKSx0aGlzLnNldEluZGV4KGkpLFRpbWVyLmFmdGVyKHRoaXMuc2hvdy5iaW5kKHRoaXMpLDEpfS5iaW5kKHRoaXMpKX0sRG90cy5wcm90b3R5cGUuX2luaXQ9ZnVuY3Rpb24oKXt0aGlzLl9kYXRhLnBhcmVudFNpemU9dGhpcy5nZXRQYXJlbnRTaXplKCksdGhpcy5faW5pdENvbnRlbnQoKSx0aGlzLl9jcmVhdGVMYXlvdXQoKX0sRG90cy5wcm90b3R5cGUuX2luaXRDb250ZW50PWZ1bmN0aW9uKCl7dGhpcy5fZGF0YS5kb3RzPVtdO2Zvcih2YXIgdD0wO3Q8dGhpcy5fZGF0YS5kb3RDb3VudDt0KyspdGhpcy5fZGF0YS5kb3RzLnB1c2godGhpcy5fY3JlYXRlTm9kZSh0KSl9LERvdHMucHJvdG90eXBlLl9jcmVhdGVOb2RlPWZ1bmN0aW9uKHQpe3ZhciBlPXt9O3JldHVybiBlLmluZGV4PXQsZS5zdXJmYWNlPW5ldyBTdXJmYWNlKHtjbGFzc2VzOltcImZhbW91cy1jYXJvdXNlbC1kb3RcIl0sc2l6ZTp0aGlzLm9wdGlvbnMuc2l6ZSxwcm9wZXJ0aWVzOnt6SW5kZXg6Mn19KSx0PT09dGhpcy5fZGF0YS5zZWxlY3RlZEluZGV4JiZlLnN1cmZhY2UuYWRkQ2xhc3MoXCJmYW1vdXMtY2Fyb3VzZWwtZG90LXNlbGVjdGVkXCIpLGUuc3VyZmFjZS5vbihcImNsaWNrXCIsdGhpcy5fY2hhbmdlSW5kZXguYmluZCh0aGlzLGUpKSx0aGlzLm9wdGlvbnMudG9nZ2xlQXJyb3dzRGlzcGxheU9uSG92ZXImJihlLnN1cmZhY2Uub24oXCJtb3VzZW92ZXJcIix0aGlzLl9ldmVudE91dHB1dC5lbWl0LmJpbmQodGhpcy5fZXZlbnRPdXRwdXQsXCJzaG93QXJyb3dzXCIpKSxlLnN1cmZhY2Uub24oXCJtb3VzZW91dFwiLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQuYmluZCh0aGlzLl9ldmVudE91dHB1dCxcImhpZGVBcnJvd3NcIikpKSxlLnRyYW5zVHJhbnNmb3JtPW5ldyBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSxlLm1vZGlmaWVyPW5ldyBNb2RpZmllcih7dHJhbnNmb3JtOmUudHJhbnNUcmFuc2Zvcm19KSxlLnJlbmRlck5vZGU9bmV3IFJlbmRlck5vZGUsZS5yZW5kZXJOb2RlLmFkZChlLm1vZGlmaWVyKS5hZGQoZS5zdXJmYWNlKSxlfSxEb3RzLnByb3RvdHlwZS5fY3JlYXRlTGF5b3V0PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fY3JlYXRlTGF5b3V0TW9kZWwoKTsxPT09dC5sZW5ndGg/KHRoaXMubGF5b3V0LnNldE9wdGlvbnMoe2RpcmVjdGlvbjowLGl0ZW1TcGFjaW5nOnRoaXMub3B0aW9ucy5ob3Jpem9udGFsU3BhY2luZ30pLHRoaXMubGF5b3V0LnNlcXVlbmNlRnJvbSh0WzBdKSk6dGhpcy5fY3JlYXRlTmVzdGVkTGF5b3V0KCksdGhpcy5fYWRkTGF5b3V0KCl9LERvdHMucHJvdG90eXBlLl9jcmVhdGVOZXN0ZWRMYXlvdXQ9ZnVuY3Rpb24oKXt2YXIgdD1bXSxlPXRoaXMub3B0aW9ucy5ob3Jpem9udGFsU3BhY2luZzt0aGlzLmxheW91dC5zZXRPcHRpb25zKHtkaXJlY3Rpb246MSxpdGVtU3BhY2luZzplfSksdGhpcy5sYXlvdXQuc2VxdWVuY2VGcm9tKHQpO2Zvcih2YXIgaSxzPXRoaXMuX2RhdGEubGF5b3V0TW9kZWwsbz0wO288cy5sZW5ndGg7bysrKWlmKGk9bmV3IFNlcXVlbnRpYWxMYXlvdXQoe2RpcmVjdGlvbjowLGl0ZW1TcGFjaW5nOmUsZGVmYXVsdEl0ZW1TaXplOnRoaXMub3B0aW9ucy5zaXplfSksaS5zZXF1ZW5jZUZyb20oc1tvXSksbz09PXMubGVuZ3RoLTEmJnMubGVuZ3RoPjEpe3ZhciBhPW5ldyBSZW5kZXJOb2RlO2EuYWRkKG5ldyBNb2RpZmllcih7b3JpZ2luOltEb3RzLlBPU0lUSU9OX1RPX0FMSUdOW3RoaXMub3B0aW9ucy5wb3NpdGlvbl0sMF19KSkuYWRkKGkpLHQucHVzaChhKX1lbHNlIHQucHVzaChpKX0sRG90cy5wcm90b3R5cGUuX2FkZExheW91dD1mdW5jdGlvbigpe3ZhciB0PURvdHMuUE9TSVRJT05fVE9fQUxJR05bdGhpcy5vcHRpb25zLnBvc2l0aW9uXTt0aGlzLnBvc2l0aW9uTW9kLnNldE9yaWdpbihbdCwxXSksdGhpcy5wb3NpdGlvbk1vZC5zZXRBbGlnbihbdCwxXSksdGhpcy5wb3NpdGlvbk1vZC5zZXRUcmFuc2Zvcm0oVHJhbnNmb3JtLnRyYW5zbGF0ZSh0aGlzLm9wdGlvbnMucGFkZGluZ1swXSx0aGlzLm9wdGlvbnMucGFkZGluZ1sxXSkpLHRoaXMuYW5pbWF0aW9uTW9kLnNldE9wYWNpdHkodGhpcy5vcGFjaXR5VHJhbnMpLHRoaXMuYW5pbWF0aW9uTW9kLnNldFRyYW5zZm9ybSh0aGlzLnRyYW5zVHJhbnNmb3JtKSx0aGlzLmFkZCh0aGlzLnBvc2l0aW9uTW9kKS5hZGQodGhpcy5hbmltYXRpb25Nb2QpLmFkZCh0aGlzLmxheW91dCl9LERvdHMucHJvdG90eXBlLl9jcmVhdGVMYXlvdXRNb2RlbD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2RhdGEucGFyZW50U2l6ZVswXSxlPVtdO2UucHVzaChbXSk7Zm9yKHZhciBpPTAscz0wLG89dGhpcy5vcHRpb25zLnNpemVbMF0rdGhpcy5vcHRpb25zLmhvcml6b250YWxTcGFjaW5nLGE9dGhpcy5fZGF0YS5kb3RzLG49MDtuPGEubGVuZ3RoO24rKylzK28+dCYmKGkrKyxzPTAsZS5wdXNoKFtdKSkscys9byxlW2ldLnB1c2goYVtuXS5yZW5kZXJOb2RlKTtyZXR1cm4gdGhpcy5fZGF0YS5sYXlvdXRNb2RlbD1lLGV9LERvdHMucHJvdG90eXBlLl9jaGFuZ2VJbmRleD1mdW5jdGlvbih0KXt0aGlzLl9ldmVudE91dHB1dC5lbWl0KFwic2V0XCIsdC5pbmRleCksdGhpcy5fYW5pbWF0ZURvdCh0LnRyYW5zVHJhbnNmb3JtKX0sRG90cy5wcm90b3R5cGUuX2FuaW1hdGVEb3Q9ZnVuY3Rpb24odCl7dmFyIGU9RG90cy5BTklNQVRJT05fT1BUSU9OUy5jbGljazt0LnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKDAsZS5vZmZzZXQpLHtkdXJhdGlvbjoxfSxmdW5jdGlvbigpe3Quc2V0KFRyYW5zZm9ybS5pZGVudGl0eSxlLnRyYW5zaXRpb24pfSl9LG1vZHVsZS5leHBvcnRzPURvdHM7IiwiZnVuY3Rpb24gU2l6ZUF3YXJlVmlldygpe1ZpZXcuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMuX19pZD1FbnRpdHkucmVnaXN0ZXIodGhpcyksdGhpcy5fX3BhcmVudFNpemU9W119dmFyIFZpZXc9cmVxdWlyZShcImZhbW91cy9jb3JlL1ZpZXdcIiksRW50aXR5PXJlcXVpcmUoXCJmYW1vdXMvY29yZS9FbnRpdHlcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIik7U2l6ZUF3YXJlVmlldy5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSksU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUuY29uc3RydWN0b3I9U2l6ZUF3YXJlVmlldyxTaXplQXdhcmVWaWV3LnByb3RvdHlwZS5jb21taXQ9ZnVuY3Rpb24oZSl7dmFyIGk9ZS50cmFuc2Zvcm0sdD1lLm9wYWNpdHkscj1lLm9yaWdpbjtyZXR1cm4gdGhpcy5fX3BhcmVudFNpemUmJnRoaXMuX19wYXJlbnRTaXplWzBdPT09ZS5zaXplWzBdJiZ0aGlzLl9fcGFyZW50U2l6ZVsxXT09PWUuc2l6ZVsxXXx8KHRoaXMuX19wYXJlbnRTaXplWzBdPWUuc2l6ZVswXSx0aGlzLl9fcGFyZW50U2l6ZVsxXT1lLnNpemVbMV0sdGhpcy5fZXZlbnRJbnB1dC5lbWl0KFwicGFyZW50UmVzaXplXCIsdGhpcy5fX3BhcmVudFNpemUpKSx0aGlzLl9fcGFyZW50U2l6ZSYmKGk9VHJhbnNmb3JtLm1vdmVUaGVuKFstdGhpcy5fX3BhcmVudFNpemVbMF0qclswXSwtdGhpcy5fX3BhcmVudFNpemVbMV0qclsxXSwwXSxpKSkse3RyYW5zZm9ybTppLG9wYWNpdHk6dCxzaXplOnRoaXMuX19wYXJlbnRTaXplLHRhcmdldDp0aGlzLl9ub2RlLnJlbmRlcigpfX0sU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUuZ2V0UGFyZW50U2l6ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9fcGFyZW50U2l6ZX0sU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX19pZH0sbW9kdWxlLmV4cG9ydHM9U2l6ZUF3YXJlVmlldzsiLCJtb2R1bGUuZXhwb3J0cz0tMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIil8fG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJUcmlkZW50L1wiKT4wOyIsImZ1bmN0aW9uIHdoZW4oZSxyLG4pe258fChuPTEpLGUgaW5zdGFuY2VvZiBBcnJheXx8KGU9W2VdKTt2YXIgaT1UaW1lci5ldmVyeShmdW5jdGlvbigpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKWlmKCFlW25dKCkpcmV0dXJuO3IoKSxUaW1lci5jbGVhcihpKX0sbil9ZnVuY3Rpb24gZHVhbFBpcGUoZSxyKXtlLnBpcGUociksci5waXBlKGUpfWZ1bmN0aW9uIGNsZWFyKGUpe0VuZ2luZS5yZW1vdmVMaXN0ZW5lcihcInByZXJlbmRlclwiLGUpfWZ1bmN0aW9uIGZyYW1lUXVldWUoZSxyKXt2YXIgbj1yLGk9ZnVuY3Rpb24oKXtyLS0sMD49ciYmKGUoKSxjbGVhcihpKSl9O3JldHVybiBFbmdpbmUub24oXCJwcmVyZW5kZXJcIixpKSxmdW5jdGlvbigpe3I9bn19dmFyIFRpbWVyPXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1RpbWVyXCIpLEVuZ2luZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvRW5naW5lXCIpO21vZHVsZS5leHBvcnRzPXt3aGVuOndoZW4sZHVhbFBpcGU6ZHVhbFBpcGUsZnJhbWVRdWV1ZTpmcmFtZVF1ZXVlfTsiLCJmdW5jdGlvbiBleHRlbmQoZSx0KXtmb3IodmFyIHIgaW4gdCllW3JdPXRbcl19ZnVuY3Rpb24gaW5oZXJpdHMoZSx0KXtlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQucHJvdG90eXBlKSxlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1lfWZ1bmN0aW9uIG1lcmdlKGUsdCl7dmFyIHI9e307cmV0dXJuIGV4dGVuZChyLGUpLGV4dGVuZChyLHQpLHJ9bW9kdWxlLmV4cG9ydHM9e2V4dGVuZDpleHRlbmQsaW5oZXJpdHM6aW5oZXJpdHMsbWVyZ2U6bWVyZ2V9OyIsImZ1bmN0aW9uIENvdmVyZmxvd0xheW91dCh0KXtMYXlvdXQuY2FsbCh0aGlzLHQpLHRoaXMuX3RvdWNoT2Zmc2V0PTAsdGhpcy5fb2Zmc2V0VD0wLHRoaXMuYm91bmRUb3VjaFN0YXJ0PXRoaXMuX29uU3luY1N0YXJ0LmJpbmQodGhpcyksdGhpcy5ib3VuZFRvdWNoVXBkYXRlPXRoaXMuX29uU3luY1VwZGF0ZS5iaW5kKHRoaXMpLHRoaXMuYm91bmRUb3VjaEVuZD10aGlzLl9vblN5bmNFbmQuYmluZCh0aGlzKSx0aGlzLnN0ZXB9dmFyIExheW91dD1yZXF1aXJlKFwiLi9MYXlvdXRcIiksT2JqZWN0SGVscGVycz1yZXF1aXJlKFwiLi4vaGVscGVycy9PYmplY3RIZWxwZXJzXCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLFRyYW5zaXRpb25hYmxlPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVcIiksSXNJRT1yZXF1aXJlKFwiLi4vZG9tL0lFXCIpO0NvdmVyZmxvd0xheW91dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShMYXlvdXQucHJvdG90eXBlKSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yPUNvdmVyZmxvd0xheW91dCxDb3ZlcmZsb3dMYXlvdXQuaWQ9XCJDb3ZlcmZsb3dMYXlvdXRcIixDb3ZlcmZsb3dMYXlvdXQuREVGQVVMVF9PUFRJT05TPXt0cmFuc2l0aW9uOntjdXJ2ZTpcIm91dEV4cG9cIixkdXJhdGlvbjoxZTN9LHJhZGl1c1BlcmNlbnQ6LjUsZGltZW5zaW9uMTpcInhcIixkaW1lbnNpb24yOlwielwifTt2YXIgRElSRUNUSU9OPXt4OjAseToxLHo6Mn0sVU5VU0VEX0RJUkVDVElPTj17MTpcInpcIiwyOlwieVwiLDM6XCJ4XCJ9O0NvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLl9iaW5kU3luY0V2ZW50cygpLHRoaXMucmVzZXRDaGlsZFByb3BlcnRpZXMoKSx0aGlzLmxheW91dCgpfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLl9nZXRSYWRpdXM9ZnVuY3Rpb24odCl7cmV0dXJuIHR8fCh0PXRoaXMuY29udHJvbGxlci5nZXRTaXplKClbMF0pLHQqdGhpcy5vcHRpb25zLnJhZGl1c1BlcmNlbnR9LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUubGF5b3V0PWZ1bmN0aW9uKHQpe3ZhciBvPXRoaXMuY29udHJvbGxlci5nZXRTaXplKCksZT10aGlzLmNvbnRyb2xsZXIuaXRlbXNbdGhpcy5jb250cm9sbGVyLmluZGV4XS5nZXRTaXplKCksaT10aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoO3RoaXMuc3RlcD0yKk1hdGguUEkvaTt2YXIgcj10aGlzLl9nZXRQYXJhbWV0cmljQ2lyY2xlKHt4MTouNSpvWzBdLHkxOm9bMF0qLS41LHJhZGl1czp0aGlzLl9nZXRSYWRpdXMob1swXSl9KSxuPVsuNSoob1swXS1lWzBdKSwuNSoob1sxXS1lWzFdKSwwXSxzPVtdO2lmKHNbMF09XCJ4XCI9PT10aGlzLm9wdGlvbnMuZGltZW5zaW9uMXx8XCJ4XCI9PT10aGlzLm9wdGlvbnMuZGltZW5zaW9uMj8wOm5bMF0sc1sxXT1cInlcIj09PXRoaXMub3B0aW9ucy5kaW1lbnNpb24xfHxcInlcIj09PXRoaXMub3B0aW9ucy5kaW1lbnNpb24yPzA6blsxXSxzWzJdPTAsSXNJRSl2YXIgYT1bXTtmb3IodmFyIGg9MDtpPmg7aCsrKXt2YXIgbD10aGlzLmNvbnRyb2xsZXIuX3Nhbml0aXplSW5kZXgodGhpcy5jb250cm9sbGVyLmluZGV4K2gpLGM9dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbbF0sdT0odGhpcy5kYXRhLm9wYWNpdGllc1tsXSxyKHRoaXMuc3RlcCpoKy41Kk1hdGguUEkrdGhpcy5fdG91Y2hPZmZzZXQpKSxkPXMuc2xpY2UoKTtkW0RJUkVDVElPTlt0aGlzLm9wdGlvbnMuZGltZW5zaW9uMV1dKz1vWzBdLXVbMF0tLjUqZVswXSxkW0RJUkVDVElPTlt0aGlzLm9wdGlvbnMuZGltZW5zaW9uMl1dKz11WzFdLElzSUUmJmEucHVzaChkWzJdKSx0P2Muc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoZFswXSxkWzFdLGRbMl0pKTpjLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKGRbMF0sZFsxXSxkWzJdKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbil9SXNJRSYmIXQmJnRoaXMuZm9yY2VaSW5kZXgoYSksYy5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShkWzBdLGRbMV0sZFsyXSksdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pO3ZhciBwPXRoaXMub3B0aW9ucy50cmFuc2l0aW9uLmR1cmF0aW9ufHx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbi5wZXJpb2Q7cCo9LjU7Zm9yKHZhciBmPXQ/dm9pZCAwOntjdXJ2ZTpcImxpbmVhclwiLGR1cmF0aW9uOnB9LGg9MDtoPHRoaXMuY29udHJvbGxlci5yZW5kZXJMaW1pdFswXTtoKyspe3ZhciB5PXRoaXMuZGF0YS5vcGFjaXRpZXNbdGhpcy5jb250cm9sbGVyLl9zYW5pdGl6ZUluZGV4KHRoaXMuY29udHJvbGxlci5pbmRleCsxK2gpXTt5JiYoeS5oYWx0KCkseS5zZXQoMS1oL3RoaXMuY29udHJvbGxlci5yZW5kZXJMaW1pdFswXSxmKSl9Zm9yKHZhciBoPTA7aDx0aGlzLmNvbnRyb2xsZXIucmVuZGVyTGltaXRbMV07aCsrKXt2YXIgeT10aGlzLmRhdGEub3BhY2l0aWVzW3RoaXMuY29udHJvbGxlci5fc2FuaXRpemVJbmRleCh0aGlzLmNvbnRyb2xsZXIuaW5kZXgtMS1oKV07eSYmKHkuaGFsdCgpLHkuc2V0KDEtaC90aGlzLmNvbnRyb2xsZXIucmVuZGVyTGltaXRbMV0sZikpfXRoaXMuZGF0YS5vcGFjaXRpZXNbdGhpcy5jb250cm9sbGVyLmluZGV4XS5oYWx0KCksdGhpcy5kYXRhLm9wYWNpdGllc1t0aGlzLmNvbnRyb2xsZXIuaW5kZXhdLnNldCgxLGYpfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLmRlYWN0aXZhdGU9ZnVuY3Rpb24oKXtpZih0aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXI9ITEsSXNJRSlmb3IodmFyIHQ9MDt0PHRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGg7dCsrKXRoaXMuY29udHJvbGxlci5pdGVtc1t0XS5zZXRQcm9wZXJ0aWVzKHt6SW5kZXg6XCJcIn0pO3RoaXMuX3VuYmluZFN5bmNFdmVudHMoKX0sQ292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5nZXRSZW5kZXJMaW1pdD1mdW5jdGlvbigpe3JldHVybltNYXRoLm1pbigxMCxNYXRoLmNlaWwoLjUqdGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aCkpLE1hdGgubWluKDEwLE1hdGguY2VpbCguNSp0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoKSldfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLmZvcmNlWkluZGV4PWZ1bmN0aW9uKHQpe2Zvcih2YXIgbz0wO288dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDtvKyspe3ZhciBlPXRoaXMuY29udHJvbGxlci5fc2FuaXRpemVJbmRleCh0aGlzLmNvbnRyb2xsZXIuaW5kZXgrbyk7dGhpcy5jb250cm9sbGVyLml0ZW1zW2VdLnNldFByb3BlcnRpZXMoe3pJbmRleDpNYXRoLnJvdW5kKHRbb10pfSl9fSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLl9iaW5kU3luY0V2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLm9uKFwic3RhcnRcIix0aGlzLmJvdW5kVG91Y2hTdGFydCksdGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJ1cGRhdGVcIix0aGlzLmJvdW5kVG91Y2hVcGRhdGUpLHRoaXMuY29udHJvbGxlci5zeW5jLm9uKFwiZW5kXCIsdGhpcy5ib3VuZFRvdWNoRW5kKX0sQ292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5fdW5iaW5kU3luY0V2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwic3RhcnRcIix0aGlzLmJvdW5kVG91Y2hTdGFydCksdGhpcy5jb250cm9sbGVyLnN5bmMucmVtb3ZlTGlzdGVuZXIoXCJ1cGRhdGVcIix0aGlzLmJvdW5kVG91Y2hVcGRhdGUpLHRoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsdGhpcy5ib3VuZFRvdWNoRW5kKX0sQ292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5fb25TeW5jU3RhcnQ9ZnVuY3Rpb24odCl7dGhpcy5fb2Zmc2V0VD1NYXRoLmFjb3ModC5wb3NpdGlvblswXS90aGlzLl9nZXRSYWRpdXMoKSl9LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuX29uU3luY1VwZGF0ZT1mdW5jdGlvbih0KXtmb3IodmFyIG89dC5wb3NpdGlvblswXS90aGlzLl9nZXRSYWRpdXMoKTtvPjE7KW8tPTI7Zm9yKDstMT5vOylvKz0yO3ZhciBlPU1hdGguYWNvcyhvKTt0aGlzLl90b3VjaE9mZnNldD10aGlzLl9vZmZzZXRULWUsdGhpcy5sYXlvdXQoITApfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLl9vblN5bmNFbmQ9ZnVuY3Rpb24odCl7dmFyIG89LjEqdC52ZWxvY2l0eVswXSxlPU1hdGgucm91bmQoKC10aGlzLl90b3VjaE9mZnNldC1vKS90aGlzLnN0ZXApO3RoaXMuX3RvdWNoT2Zmc2V0PTAsdGhpcy5jb250cm9sbGVyLl9ldmVudE91dHB1dC5lbWl0KFwic2V0XCIsdGhpcy5jb250cm9sbGVyLl9zYW5pdGl6ZUluZGV4KHRoaXMuY29udHJvbGxlci5pbmRleCtlKSl9LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuX2dldFBhcmFtZXRyaWNDaXJjbGU9ZnVuY3Rpb24odCl7dmFyIG89e3gxOjAseTE6MCxyYWRpdXM6MjB9O3JldHVybiBPYmplY3RIZWxwZXJzLmV4dGVuZChvLHQpLGZ1bmN0aW9uKHQpe3JldHVybltvLngxK28ucmFkaXVzKk1hdGguY29zKHQpLG8ueTErby5yYWRpdXMqTWF0aC5zaW4odCldfX0sbW9kdWxlLmV4cG9ydHM9Q292ZXJmbG93TGF5b3V0OyIsImZ1bmN0aW9uIEdyaWRMYXlvdXQodCl7TGF5b3V0LmNhbGwodGhpcyx0KX12YXIgTGF5b3V0PXJlcXVpcmUoXCIuL0xheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxFYXNpbmc9cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9FYXNpbmdcIik7R3JpZExheW91dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShMYXlvdXQucHJvdG90eXBlKSxHcmlkTGF5b3V0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1HcmlkTGF5b3V0LEdyaWRMYXlvdXQuaWQ9XCJHcmlkTGF5b3V0XCIsR3JpZExheW91dC5ERUZBVUxUX09QVElPTlM9e2dyaWREaW1lbnNpb25zOlszLDNdLHBhZGRpbmc6WzE1LDE1XSxzZWxlY3RlZEl0ZW1UcmFuc2l0aW9uOnttZXRob2Q6XCJzcHJpbmdcIixkYW1waW5nUmF0aW86LjY1LHBlcmlvZDo2MDB9LHRyYW5zaXRpb246e2N1cnZlOlwib3V0RXhwb1wiLGR1cmF0aW9uOjgwMH0sZGVsYXlMZW5ndGg6NjAwfSxHcmlkTGF5b3V0LnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5fZXZlbnRPdXRwdXQuZW1pdChcInBhZ2luYXRpb25DaGFuZ2VcIix0aGlzLm9wdGlvbnMuZ3JpZERpbWVuc2lvbnNbMF0qdGhpcy5vcHRpb25zLmdyaWREaW1lbnNpb25zWzFdKSx0aGlzLnJlc2V0Q2hpbGRQcm9wZXJ0aWVzKCk7dmFyIHQ9dGhpcy5vcHRpb25zLmdyaWREaW1lbnNpb25zWzBdKnRoaXMub3B0aW9ucy5ncmlkRGltZW5zaW9uc1sxXSxvPU1hdGguY2VpbCh0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoL3QpLGk9TWF0aC5mbG9vcih0aGlzLmNvbnRyb2xsZXIuaW5kZXgvdCksZT1pKnQsbj1pPT09by0xP2UrKHRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGgtaSp0KS0xOmUrdC0xO3RoaXMuX2RlbGF5VHJhbnNpdGlvbnMoZSxuKSx0aGlzLl9hbmltYXRlSXRlbXMoZSxuKSx0aGlzLl9oYW5kbGVUb3VjaEV2ZW50cygpfSxHcmlkTGF5b3V0LnByb3RvdHlwZS5sYXlvdXQ9ZnVuY3Rpb24oKXtmb3IodmFyIHQsbz10aGlzLl9nZXRUcmFuc2Zvcm1zKCksaT0wO2k8dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDtpKyspdD10aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1tpXSx0LnNldChvW2ldLnRyYW5zZm9ybSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiksdGhpcy5kYXRhLm9wYWNpdGllc1tpXS5oYWx0KCksdGhpcy5kYXRhLm9wYWNpdGllc1tpXS5zZXQoMSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbil9LEdyaWRMYXlvdXQucHJvdG90eXBlLmRlYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXI9ITEsdGhpcy5jb250cm9sbGVyLl9ldmVudE91dHB1dC5lbWl0KFwicGFnaW5hdGlvbkNoYW5nZVwiLHRoaXMuY29udHJvbGxlci5pdGVtc1BlclBhZ2UpLHRoaXMuX3JlbW92ZVRvdWNoRXZlbnRzKCl9LEdyaWRMYXlvdXQucHJvdG90eXBlLmdldFJlbmRlckxpbWl0PWZ1bmN0aW9uKCl7cmV0dXJuWzAsdGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aF19LEdyaWRMYXlvdXQucHJvdG90eXBlLl9oYW5kbGVUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuYm91bmRUb3VjaFVwZGF0ZT1mdW5jdGlvbih0KXt2YXIgbz10aGlzLmRhdGEudG91Y2hPZmZzZXQsaT1vLmdldCgpO2lbMF0rPXQuZGVsdGFbMF0sby5zZXQoW2lbMF0saVsxXV0pfS5iaW5kKHRoaXMpLHRoaXMuYm91bmRUb3VjaEVuZD1mdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLmRhdGEudG91Y2hPZmZzZXQsbz10LmdldCgpLGk9b1swXSxlPXRoaXMuY29udHJvbGxlci5nZXRTaXplKClbMF0sbj0wO248dGhpcy5jb250cm9sbGVyLml0ZW1zLmxlbmd0aDtuKyspe3ZhciBzPXRoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW25dLHI9cy50cmFuc2xhdGUuZ2V0KCk7cy5zZXRUcmFuc2xhdGUoW3JbMF0rb1swXSxyWzFdXSl9dC5zZXQoWzAsMF0pLC0xKmUvNT5pP3RoaXMuY29udHJvbGxlci5fZXZlbnRPdXRwdXQuZW1pdChcIm5leHRcIik6aT4xKmUvNT90aGlzLmNvbnRyb2xsZXIuX2V2ZW50T3V0cHV0LmVtaXQoXCJwcmV2aW91c1wiKTp0aGlzLmxheW91dCgpfS5iaW5kKHRoaXMpLHRoaXMuX2FkZFRvdWNoRXZlbnRzKCl9LEdyaWRMYXlvdXQucHJvdG90eXBlLl9hZGRUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLm9uKFwidXBkYXRlXCIsdGhpcy5ib3VuZFRvdWNoVXBkYXRlKSx0aGlzLmNvbnRyb2xsZXIuc3luYy5vbihcImVuZFwiLHRoaXMuYm91bmRUb3VjaEVuZCl9LEdyaWRMYXlvdXQucHJvdG90eXBlLl9yZW1vdmVUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwidXBkYXRlXCIsdGhpcy5ib3VuZFRvdWNoVXBkYXRlKSx0aGlzLmNvbnRyb2xsZXIuc3luYy5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLHRoaXMuYm91bmRUb3VjaEVuZCl9LEdyaWRMYXlvdXQucHJvdG90eXBlLl9kZWxheVRyYW5zaXRpb25zPWZ1bmN0aW9uKHQsbyl7Zm9yKHZhciBpLGU9dGhpcy5jb250cm9sbGVyLmluZGV4LG49dGhpcy5jb250cm9sbGVyLmluZGV4LTE8dD92b2lkIDA6dGhpcy5jb250cm9sbGVyLmluZGV4LTEscz0wLHI9by10KzE7cj5zOyl7dmFyIGE9cy8oci0xKSxoPUVhc2luZy5pbk91dFNpbmUoYSk7aT1oKnRoaXMub3B0aW9ucy5kZWxheUxlbmd0aCsxLHZvaWQgMCE9PWUmJih0aGlzLl9zZXRJdGVtRGVsYXkoZSxpKSxlPWUrMT5vP3ZvaWQgMDplKzEscysrKSx2b2lkIDAhPT1uJiYodGhpcy5fc2V0SXRlbURlbGF5KG4saSksbj10Pm4tMT92b2lkIDA6bi0xLHMrKyl9fSxHcmlkTGF5b3V0LnByb3RvdHlwZS5fc2V0SXRlbURlbGF5PWZ1bmN0aW9uKHQsbyl7dHJhbnM9dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbdF0sdHJhbnMucm90YXRlLmRlbGF5KG8pLHRyYW5zLnNjYWxlLmRlbGF5KG8pLHRyYW5zLnRyYW5zbGF0ZS5kZWxheShvKSx0aGlzLmRhdGEub3BhY2l0aWVzW3RdLmRlbGF5KG8pfSxHcmlkTGF5b3V0LnByb3RvdHlwZS5fYW5pbWF0ZUl0ZW1zPWZ1bmN0aW9uKHQsbyl7Zm9yKHZhciBpPWZ1bmN0aW9uKGkpe3JldHVybiBpPj10JiZvPj1pfSxlPXRoaXMuX2dldFRyYW5zZm9ybXMoKSxuPTA7bjx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoO24rKyl7aWYoaShuKSlpZihuPT09dGhpcy5jb250cm9sbGVyLmluZGV4KXt2YXIgcz10aGlzLm9wdGlvbnMuc2VsZWN0ZWRJdGVtVHJhbnNpdGlvbi5tZXRob2R8fFwic3ByaW5nXCIscj10aGlzLm9wdGlvbnMuc2VsZWN0ZWRJdGVtVHJhbnNpdGlvbi5kYW1waW5nUmF0aW98fC42NSxhPXRoaXMub3B0aW9ucy5zZWxlY3RlZEl0ZW1UcmFuc2l0aW9uLnBlcmlvZHx8NjAwO3RoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW25dLnNldChlW25dLnRyYW5zZm9ybSx7bWV0aG9kOnMsZGFtcGluZ1JhdGlvOnIscGVyaW9kOmF9KX1lbHNlIHRoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW25dLnNldChlW25dLnRyYW5zZm9ybSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbik7ZWxzZSB0aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXJ8fG51bGw9PT10aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXI/dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbbl0uc2V0KGVbbl0udHJhbnNmb3JtKTp0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1tuXS5zZXQoZVtuXS50cmFuc2Zvcm0sdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pO3RoaXMuZGF0YS5vcGFjaXRpZXNbbl0uc2V0KDEsdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pfX0sR3JpZExheW91dC5wcm90b3R5cGUuX2dldFRyYW5zZm9ybXM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcy5fZ2V0R3JpZFBvc2l0aW9ucyh0aGlzLmNvbnRyb2xsZXIuZ2V0U2l6ZSgpLnNsaWNlKDApLHRoaXMub3B0aW9ucy5wYWRkaW5nLHRoaXMub3B0aW9ucy5ncmlkRGltZW5zaW9ucyksbz10LmNlbGxTaXplLGk9dGhpcy5jb250cm9sbGVyLmdldFNpemUoKS5zbGljZSgwKSxlPXRoaXMub3B0aW9ucy5ncmlkRGltZW5zaW9uc1swXSp0aGlzLm9wdGlvbnMuZ3JpZERpbWVuc2lvbnNbMV0sbj1NYXRoLmZsb29yKHRoaXMuY29udHJvbGxlci5pbmRleC9lKSxzPVtdLHI9MDtyPHRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGg7cisrKXt2YXIgYT10LmF0KHIpO2FbMF0tPW4qaVswXStuKnRoaXMub3B0aW9ucy5wYWRkaW5nWzBdLGFbMl09MTt2YXIgaD10aGlzLmRhdGEuc2l6ZUNhY2hlW3JdfHx0aGlzLmRhdGEuc2l6ZUNhY2hlWzBdLGQ9TWF0aC5taW4ob1swXS9oWzBdLG9bMV0vaFsxXSksbD1bLjUqTWF0aC5yb3VuZChvWzBdLWhbMF0qZCksLjUqTWF0aC5yb3VuZChvWzFdLWhbMV0qZCldO3MucHVzaCh7dHJhbnNmb3JtOlRyYW5zZm9ybS50aGVuTW92ZShUcmFuc2Zvcm0uc2NhbGUoZCxkKSxbYVswXStsWzBdLGFbMV0rbFsxXV0pLGdyaWRQb3M6YSxtYXhTY2FsZTpkfSl9cmV0dXJuIHN9LEdyaWRMYXlvdXQucHJvdG90eXBlLl9nZXRHcmlkUG9zaXRpb25zPWZ1bmN0aW9uKHQsbyxpKXt2YXIgZT1bKHRbMF0tb1swXSpNYXRoLm1heChpWzBdLTEsMCkpL2lbMF0sKHRbMV0tb1sxXSpNYXRoLm1heChpWzFdLTEsMCkpL2lbMV1dLG49aVswXSppWzFdO3JldHVybnthdDpmdW5jdGlvbihzKXt2YXIgcj1NYXRoLmZsb29yKHMvbiksYT1zJWlbMF0saD1NYXRoLmZsb29yKChzLXIqbikvaVswXSk7cmV0dXJuW2EqZVswXSthKm9bMF0rcip0WzBdK3Iqb1swXSxoKmVbMV0raCpvWzFdXX0sY2VsbFNpemU6ZX19LG1vZHVsZS5leHBvcnRzPUdyaWRMYXlvdXQ7IiwiZnVuY3Rpb24gTGF5b3V0KHQpe3ZhciBvPVV0aWxpdHkuY2xvbmUodGhpcy5jb25zdHJ1Y3Rvci5ERUZBVUxUX09QVElPTlN8fHt9KTtyZXR1cm4gdGhpcy5vcHRpb25zPU9iamVjdEhlbHBlcnMubWVyZ2Uobyx0KSx0aGlzLmlkPXRoaXMuY29uc3RydWN0b3IuaWQsdGhpcy5jb250cm9sbGVyPW51bGwsdGhpcy5kYXRhPW51bGwsdGhpc312YXIgT2JqZWN0SGVscGVycz1yZXF1aXJlKFwiLi4vaGVscGVycy9PYmplY3RIZWxwZXJzXCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLFV0aWxpdHk9cmVxdWlyZShcImZhbW91cy91dGlsaXRpZXMvVXRpbGl0eVwiKTtMYXlvdXQucHJvdG90eXBlLnNldENvbnRyb2xsZXI9ZnVuY3Rpb24odCl7dGhpcy5jb250cm9sbGVyPXQsdGhpcy5kYXRhPXQuZGF0YX0sTGF5b3V0LnByb3RvdHlwZS5yZXNldENoaWxkUHJvcGVydGllcz1mdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLm9wdGlvbnMudHJhbnNpdGlvbi5kdXJhdGlvbnx8dGhpcy5vcHRpb25zLnRyYW5zaXRpb24ucGVyaW9kfHwyMDAsbz0wO288dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDtvKyspdGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1tvXS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5LHtjdXJ2ZTpcIm91dEV4cG9cIixkdXJhdGlvbjp0fSksdGhpcy5kYXRhLmNoaWxkT3JpZ2luc1tvXS5zZXQoWzAsMF0pLHRoaXMuZGF0YS5jaGlsZEFsaWduc1tvXS5zZXQoWzAsMF0pfSxMYXlvdXQucHJvdG90eXBlLmdldFJlbmRlckxpbWl0PWZ1bmN0aW9uKCl7fSxMYXlvdXQucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKCl7fSxMYXlvdXQucHJvdG90eXBlLmxheW91dD1mdW5jdGlvbigpe30sTGF5b3V0LnByb3RvdHlwZS5kZWFjdGl2YXRlPWZ1bmN0aW9uKCl7fSxtb2R1bGUuZXhwb3J0cz1MYXlvdXQ7IiwiZnVuY3Rpb24gTGF5b3V0Q29udHJvbGxlcih0KXtTaXplQXdhcmVWaWV3LmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLml0ZW1zLHRoaXMuY29udGFpbmVyLHRoaXMuaW5kZXgsdGhpcy5sYXN0SW5kZXgsdGhpcy5fYWN0aXZlTGF5b3V0LHRoaXMuaXRlbXNQZXJQYWdlPXQuaXRlbXNQZXJQYWdlLHRoaXMucmVuZGVyTGltaXQ9WzEsNF0sdGhpcy5pc0xhc3RMYXlvdXRTaW5ndWxhcj1udWxsLHRoaXMubm9kZXM9W10sdGhpcy5kYXRhPXtvcGFjaXRpZXM6W10scGFyZW50VHJhbnNmb3JtczpbXSxwYXJlbnRPcmlnaW5zOltdLHBhcmVudEFsaWduczpbXSxwYXJlbnRTaXplczpbXSxjaGlsZFRyYW5zZm9ybXM6W10sY2hpbGRPcmlnaW5zOltdLGNoaWxkQWxpZ25zOltdLHRvdWNoT2Zmc2V0Om5ldyBUcmFuc2l0aW9uYWJsZShbMCwwXSksc2l6ZUNhY2hlOltdLHNpemVDYWNoZUZ1bGw6ITF9LHRoaXMuX2JvdW5kTGF5b3V0PXRoaXMubGF5b3V0LmJpbmQodGhpcyksdGhpcy5fYm91bmRBY3RpdmF0ZT10aGlzLl9hY3RpdmF0ZS5iaW5kKHRoaXMpLHRoaXMuc3luYz10LnN5bmMsdGhpcy5faW5pdCgpfXZhciBUaW1lcj1yZXF1aXJlKFwiZmFtb3VzL3V0aWxpdGllcy9UaW1lclwiKSxFbmdpbmU9cmVxdWlyZShcImZhbW91cy9jb3JlL0VuZ2luZVwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxSZW5kZXJOb2RlPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9SZW5kZXJOb2RlXCIpLE1vZGlmaWVyPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9Nb2RpZmllclwiKSxDb250YWluZXJTdXJmYWNlPXJlcXVpcmUoXCJmYW1vdXMvc3VyZmFjZXMvQ29udGFpbmVyU3VyZmFjZVwiKSxUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlVHJhbnNmb3JtXCIpLFRyYW5zaXRpb25hYmxlPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVcIiksTGF5b3V0RmFjdG9yeT1yZXF1aXJlKFwiLi9MYXlvdXRGYWN0b3J5XCIpLFNpemVBd2FyZVZpZXc9cmVxdWlyZShcIi4uL2NvbnN0cnVjdG9ycy9TaXplQXdhcmVWaWV3XCIpLEV2ZW50SGVscGVycz1yZXF1aXJlKFwiLi4vZXZlbnRzL0V2ZW50SGVscGVyc1wiKTtMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFNpemVBd2FyZVZpZXcucHJvdG90eXBlKSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1MYXlvdXRDb250cm9sbGVyLExheW91dENvbnRyb2xsZXIuREVGQVVMVF9PUFRJT05TPXtjbGFzc2VzOltdLGxvb3A6dm9pZCAwLHByb3BlcnRpZXM6e292ZXJmbG93OlwiaGlkZGVuXCIsekluZGV4OjF9LHBlcnNwZWN0aXZlOjFlM30sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuc2V0U2l6ZT1mdW5jdGlvbih0KXt0aGlzLmNvbnRhaW5lci5zZXRTaXplKHQpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5nZXRTaXplPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29udGFpbmVyLmdldFNpemUoKX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuc2V0SXRlbXM9ZnVuY3Rpb24odCl7dGhpcy5pdGVtcz10LHRoaXMuX3Jlc2V0KCksdGhpcy5fY3JlYXRlSXRlbXMoKSx0aGlzLmRhdGEuc2l6ZUNhY2hlPW5ldyBBcnJheSh0Lmxlbmd0aCksdGhpcy5kYXRhLnNpemVDYWNoZUZ1bGw9ITF9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLnNldEluZGV4PWZ1bmN0aW9uKHQsZSl7dGhpcy5sYXN0SW5kZXg9dGhpcy5pbmRleCx0aGlzLmluZGV4PXQsdGhpcy5fdXBkYXRlUmVuZGVyZWRJbmRpY2VzKCksZSYmdGhpcy5fc2FmZUxheW91dCgpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5nZXRMZW5ndGg9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5taW4odGhpcy5pbmRleCt0aGlzLnJlbmRlckxpbWl0WzBdK3RoaXMucmVuZGVyTGltaXRbMV0sdGhpcy5ub2Rlcy5sZW5ndGgpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5zZXRSZW5kZXJMaW1pdD1mdW5jdGlvbih0KXt0aGlzLnJlbmRlckxpbWl0PSF0IGluc3RhbmNlb2YgQXJyYXk/WzAsdF06dCx0aGlzLl91cGRhdGVSZW5kZXJlZEluZGljZXMoKX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuZ2V0TGF5b3V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FjdGl2ZUxheW91dH0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUubGF5b3V0PWZ1bmN0aW9uKCl7dGhpcy5fbGF5b3V0UXVldWU9dm9pZCAwLHRoaXMuX3VwZGF0ZVNpemVDYWNoZSgpLHRoaXMuaGFsdCgpLHRoaXMuX2FjdGl2ZUxheW91dCYmdGhpcy5fYWN0aXZlTGF5b3V0LmxheW91dCgpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5zZXRMYXlvdXQ9ZnVuY3Rpb24odCl7dCBpbnN0YW5jZW9mIEZ1bmN0aW9uJiYodD1uZXcgdCh7fSkpLHRoaXMuX2FjdGl2ZUxheW91dCYmdGhpcy5fYWN0aXZlTGF5b3V0LmRlYWN0aXZhdGUoKSx0aGlzLl9hY3RpdmVMYXlvdXQ9dCx0aGlzLl9hY3RpdmVMYXlvdXQuc2V0Q29udHJvbGxlcih0aGlzKTt2YXIgZT10aGlzLl9hY3RpdmVMYXlvdXQuZ2V0UmVuZGVyTGltaXQoKTtlP3RoaXMuc2V0UmVuZGVyTGltaXQoZSk6dGhpcy5fdXBkYXRlUmVuZGVyZWRJbmRpY2VzKCksdGhpcy5fc2FmZUFjdGl2YXRlKCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLmhhbHQ9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9MDt0PHRoaXMubm9kZXMubGVuZ3RoO3QrKyl0aGlzLmRhdGEuY2hpbGRPcmlnaW5zW3RdLmhhbHQoKSx0aGlzLmRhdGEuY2hpbGRBbGlnbnNbdF0uaGFsdCgpLHRoaXMuZGF0YS5jaGlsZFRyYW5zZm9ybXNbdF0uaGFsdCgpLHRoaXMuZGF0YS5wYXJlbnRPcmlnaW5zW3RdLmhhbHQoKSx0aGlzLmRhdGEucGFyZW50QWxpZ25zW3RdLmhhbHQoKSx0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1t0XS5oYWx0KCksdGhpcy5kYXRhLm9wYWNpdGllc1t0XS5oYWx0KCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9pbml0PWZ1bmN0aW9uKCl7dGhpcy5fY3JlYXRlQ29udGFpbmVyKCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9zYWZlTGF5b3V0PWZ1bmN0aW9uKCl7dGhpcy5fbGF5b3V0UXVldWU/dGhpcy5fbGF5b3V0UXVldWUoKTp0aGlzLl9sYXlvdXRRdWV1ZT1FdmVudEhlbHBlcnMuZnJhbWVRdWV1ZSh0aGlzLl9ib3VuZExheW91dCw0KX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX3NhZmVBY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuX2FjdGl2YXRlUXVldWU/dGhpcy5fYWN0aXZhdGVRdWV1ZSgpOnRoaXMuX2FjdGl2YXRlUXVldWU9RXZlbnRIZWxwZXJzLmZyYW1lUXVldWUodGhpcy5fYm91bmRBY3RpdmF0ZSw0KX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX2FjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5fYWN0aXZhdGVRdWV1ZT12b2lkIDAsdGhpcy5fdXBkYXRlU2l6ZUNhY2hlKCksdGhpcy5oYWx0KCksdGhpcy5fYWN0aXZlTGF5b3V0LmFjdGl2YXRlKCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl91cGRhdGVSZW5kZXJlZEluZGljZXM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9wcmV2aW91c1JlbmRlcj90aGlzLl9wcmV2aW91c1JlbmRlcjpbXTt0aGlzLmZ1dHVyZUluZGljZXM9dGhpcy5fY2FsY3VsYXRlRnV0dXJlSW5kaWNlcygpLHRoaXMuX3RvUmVuZGVyPVtdO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRoaXMuX3RvUmVuZGVyLnB1c2godFtlXSk7Zm9yKHZhciBlPTA7ZTx0aGlzLmZ1dHVyZUluZGljZXMubGVuZ3RoO2UrKyl0aGlzLl90b1JlbmRlci5pbmRleE9mKHRoaXMuZnV0dXJlSW5kaWNlc1tlXSk8MCYmdGhpcy5fdG9SZW5kZXIucHVzaCh0aGlzLmZ1dHVyZUluZGljZXNbZV0pO3RoaXMuX3ByZXZpb3VzUmVuZGVyPXRoaXMuZnV0dXJlSW5kaWNlcyx0aGlzLl90b1JlbmRlci5zb3J0KGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQtZX0pfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5fY2FsY3VsYXRlRnV0dXJlSW5kaWNlcz1mdW5jdGlvbigpe2Zvcih2YXIgdD1bXSxlPXRoaXMubm9kZXMubGVuZ3RoLGk9MCxyPXRoaXMucmVuZGVyTGltaXRbMF0rdGhpcy5yZW5kZXJMaW1pdFsxXSxuPTA7cj5uJiZuIT1lO24rKyl7dmFyIGE9dGhpcy5pbmRleC10aGlzLnJlbmRlckxpbWl0WzBdK247aWYoMD5hKXt2YXIgbz1hJWU7aWYobz0wPT1vP286bytlLG89PWUpY29udGludWU7dC5wdXNoKG8pLGk9bz5pP286aX1lbHNlKDA9PWl8fGk+YSkmJnQucHVzaChhJWUpfXJldHVybiB0fSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5fY3JlYXRlQ29udGFpbmVyPWZ1bmN0aW9uKCl7dGhpcy5jb250YWluZXI9bmV3IENvbnRhaW5lclN1cmZhY2Uoe2NsYXNzZXM6dGhpcy5vcHRpb25zLmNsYXNzZXMscHJvcGVydGllczp0aGlzLm9wdGlvbnMucHJvcGVydGllc30pLHRoaXMuY29udGFpbmVyLmNvbnRleHQuc2V0UGVyc3BlY3RpdmUodGhpcy5vcHRpb25zLnBlcnNwZWN0aXZlKTt2YXIgdD1uZXcgUmVuZGVyTm9kZTt0LnJlbmRlcj10aGlzLl9pbm5lclJlbmRlci5iaW5kKHRoaXMpLHRoaXMuYWRkKHRoaXMuY29udGFpbmVyKSx0aGlzLmNvbnRhaW5lci5hZGQodCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9jb25uZWN0Q29udGFpbmVyPWZ1bmN0aW9uKHQpe3RoaXMuY29udGFpbmVyLnBpcGUodCksdGhpcy5jb250YWluZXIucGlwZSh0LnN5bmMpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5fY3JlYXRlSXRlbXM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9MDt0PHRoaXMuaXRlbXMubGVuZ3RoO3QrKyl7dmFyIGU9dGhpcy5pdGVtc1t0XSxpPW5ldyBUcmFuc2l0aW9uYWJsZSgxKSxyPW5ldyBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSxuPW5ldyBUcmFuc2l0aW9uYWJsZShbMCwwXSksYT1uZXcgVHJhbnNpdGlvbmFibGUoWzAsMF0pLG89bmV3IFRyYW5zaXRpb25hYmxlKFt2b2lkIDAsdm9pZCAwXSkscz1uZXcgVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0saD1uZXcgVHJhbnNpdGlvbmFibGUoWzAsMF0pLHU9bmV3IFRyYW5zaXRpb25hYmxlKFswLDBdKSxsPW5ldyBNb2RpZmllcih7dHJhbnNmb3JtOnIsb3JpZ2luOm4sYWxpZ246YSxvcGFjaXR5Omksc2l6ZTpvfSksZD1uZXcgTW9kaWZpZXIoe3RyYW5zZm9ybTpzLG9yaWdpbjpoLGFsaWduOnV9KSxjPW5ldyBNb2RpZmllcih7dHJhbnNmb3JtOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5kYXRhLnRvdWNoT2Zmc2V0LmdldCgpO3JldHVybiBUcmFuc2Zvcm0udHJhbnNsYXRlKHRbMF0sdFsxXSl9LmJpbmQodGhpcyl9KSxwPW5ldyBSZW5kZXJOb2RlO3AuZ2V0U2l6ZT1lLmdldFNpemUuYmluZChlKSxwLmFkZChjKS5hZGQobCkuYWRkKGQpLmFkZChlKSx0aGlzLm5vZGVzLnB1c2gocCksdGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXMucHVzaChyKSx0aGlzLmRhdGEub3BhY2l0aWVzLnB1c2goaSksdGhpcy5kYXRhLnBhcmVudE9yaWdpbnMucHVzaChuKSx0aGlzLmRhdGEucGFyZW50QWxpZ25zLnB1c2goYSksdGhpcy5kYXRhLnBhcmVudFNpemVzLnB1c2gobyksdGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtcy5wdXNoKHMpLHRoaXMuZGF0YS5jaGlsZE9yaWdpbnMucHVzaChoKSx0aGlzLmRhdGEuY2hpbGRBbGlnbnMucHVzaCh1KX19LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9yZXNldD1mdW5jdGlvbigpe3RoaXMubm9kZXM9W10sdGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXM9W10sdGhpcy5kYXRhLm9wYWNpdGllcz1bXSx0aGlzLmRhdGEucGFyZW50T3JpZ2lucz1bXSx0aGlzLmRhdGEucGFyZW50QWxpZ25zPVtdLHRoaXMuZGF0YS5wYXJlbnRTaXplcz1bXSx0aGlzLmRhdGEuY2hpbGRUcmFuc2Zvcm1zPVtdLHRoaXMuZGF0YS5jaGlsZE9yaWdpbnM9W10sdGhpcy5kYXRhLmNoaWxkQWxpZ25zPVtdLHRoaXMuZGF0YS5zaXplQ2FjaGU9W10sdGhpcy5kYXRhLnNpemVDYWNoZUZ1bGw9ITF9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9zYW5pdGl6ZUluZGV4PWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMubm9kZXMubGVuZ3RoO3JldHVybiAwPnQ/dCVlK2U6dD5lLTE/dCVlOnR9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl91cGRhdGVTaXplQ2FjaGU9ZnVuY3Rpb24oKXtpZighdGhpcy5kYXRhLnNpemVDYWNoZUZ1bGwpe2Zvcih2YXIgdCxlPXRoaXMuZGF0YS5zaXplQ2FjaGUsaT0wLHI9MDtyPGUubGVuZ3RoO3IrKyl2b2lkIDA9PT1lW3JdPyh0PXRoaXMuaXRlbXNbcl0uZ2V0U2l6ZSgpLG51bGwhPT10JiYwIT10WzBdJiYwIT10WzFdJiYoZVtyXT10LHRoaXMuZGF0YS5wYXJlbnRTaXplc1tyXS5zZXQodCksdGhpcy5fZXZlbnRJbnB1dC5lbWl0KFwiaW5pdGlhbFNpemVcIixyKSxpKyspKTppKys7aT09PWUubGVuZ3RoJiYodGhpcy5kYXRhLnNpemVDYWNoZUZ1bGw9ITApfX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX2lubmVyUmVuZGVyPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PVtdLGU9MDtlPHRoaXMuX3RvUmVuZGVyLmxlbmd0aDtlKyspdFtlXT10aGlzLm5vZGVzW3RoaXMuX3RvUmVuZGVyW2VdXS5yZW5kZXIoKTtyZXR1cm4gdH0sbW9kdWxlLmV4cG9ydHM9TGF5b3V0Q29udHJvbGxlcjsiLCJ2YXIgU2luZ3VsYXJTb2Z0U2NhbGU9cmVxdWlyZShcIi4vU2luZ3VsYXJTb2Z0U2NhbGVcIiksU2luZ3VsYXJUd2lzdD1yZXF1aXJlKFwiLi9TaW5ndWxhclR3aXN0XCIpLFNpbmd1bGFyU2xpZGVCZWhpbmQ9cmVxdWlyZShcIi4vU2luZ3VsYXJTbGlkZUJlaGluZFwiKSxTaW5ndWxhclBhcmFsbGF4PXJlcXVpcmUoXCIuL1Npbmd1bGFyUGFyYWxsYXhcIiksU2luZ3VsYXJPcGFjaXR5PXJlcXVpcmUoXCIuL1Npbmd1bGFyT3BhY2l0eVwiKSxTaW5ndWxhclNsaWRlSW49cmVxdWlyZShcIi4vU2luZ3VsYXJTbGlkZUluXCIpLEdyaWRMYXlvdXQ9cmVxdWlyZShcIi4vR3JpZExheW91dFwiKSxDb3ZlcmZsb3dMYXlvdXQ9cmVxdWlyZShcIi4vQ292ZXJmbG93TGF5b3V0XCIpLFNlcXVlbnRpYWxMYXlvdXQ9cmVxdWlyZShcIi4vU2VxdWVudGlhbExheW91dFwiKSxMYXlvdXRGYWN0b3J5PXt9O0xheW91dEZhY3Rvcnkud3JhcD1mdW5jdGlvbihhKXtmdW5jdGlvbiByKHIpe3JldHVybiByIGluc3RhbmNlb2YgYT9yOm5ldyBhKHIpfXJldHVybiByLmlkPWEuaWQscn0sTGF5b3V0RmFjdG9yeS5TaW5ndWxhclNvZnRTY2FsZT1MYXlvdXRGYWN0b3J5LndyYXAoU2luZ3VsYXJTb2Z0U2NhbGUpLExheW91dEZhY3RvcnkuU2luZ3VsYXJUd2lzdD1MYXlvdXRGYWN0b3J5LndyYXAoU2luZ3VsYXJUd2lzdCksTGF5b3V0RmFjdG9yeS5TaW5ndWxhclNsaWRlQmVoaW5kPUxheW91dEZhY3Rvcnkud3JhcChTaW5ndWxhclNsaWRlQmVoaW5kKSxMYXlvdXRGYWN0b3J5LlNpbmd1bGFyUGFyYWxsYXg9TGF5b3V0RmFjdG9yeS53cmFwKFNpbmd1bGFyUGFyYWxsYXgpLExheW91dEZhY3RvcnkuU2luZ3VsYXJPcGFjaXR5PUxheW91dEZhY3Rvcnkud3JhcChTaW5ndWxhck9wYWNpdHkpLExheW91dEZhY3RvcnkuU2luZ3VsYXJTbGlkZUluPUxheW91dEZhY3Rvcnkud3JhcChTaW5ndWxhclNsaWRlSW4pLExheW91dEZhY3RvcnkuR3JpZExheW91dD1MYXlvdXRGYWN0b3J5LndyYXAoR3JpZExheW91dCksTGF5b3V0RmFjdG9yeS5Db3ZlcmZsb3dMYXlvdXQ9TGF5b3V0RmFjdG9yeS53cmFwKENvdmVyZmxvd0xheW91dCksTGF5b3V0RmFjdG9yeS5TZXF1ZW50aWFsTGF5b3V0PUxheW91dEZhY3Rvcnkud3JhcChTZXF1ZW50aWFsTGF5b3V0KSxtb2R1bGUuZXhwb3J0cz1MYXlvdXRGYWN0b3J5OyIsImZ1bmN0aW9uIFNlcXVlbnRpYWxMYXlvdXQodCl7TGF5b3V0LmNhbGwodGhpcyx0KSx0aGlzLmFwcGx5UHJlQW5pbWF0aW9uT2Zmc2V0PVtdLHRoaXMudXNlVG91Y2hFbmRUcmFuc2l0aW9uPSExfXZhciBMYXlvdXQ9cmVxdWlyZShcIi4vTGF5b3V0XCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLEVhc2luZz1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL0Vhc2luZ1wiKTtTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKExheW91dC5wcm90b3R5cGUpLFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNlcXVlbnRpYWxMYXlvdXQsU2VxdWVudGlhbExheW91dC5pZD1cIlNlcXVlbnRpYWxMYXlvdXRcIixTZXF1ZW50aWFsTGF5b3V0LkRFRkFVTFRfT1BUSU9OUz17dHJhbnNpdGlvbjp7ZHVyYXRpb246ODAwLGN1cnZlOlwib3V0RXhwb1wifSx0b3VjaEVuZFRyYW5zaXRpb246e21ldGhvZDpcInNuYXBcIixwZXJpb2Q6MjAwfSxwYWRkaW5nOlsxMCwwXSxkaXJlY3Rpb246XCJ4XCJ9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5yZXNldENoaWxkUHJvcGVydGllcygpO2Zvcih2YXIgdD0wO3Q8dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDt0KyspdGhpcy5kYXRhLm9wYWNpdGllc1t0XS5zZXQoMSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbik7dGhpcy5jb250YWluZXJTaXplPXRoaXMuY29udHJvbGxlci5nZXRTaXplKCksdGhpcy5sYXlvdXQoKSx0aGlzLl9oYW5kbGVUb3VjaEV2ZW50cygpfSxTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5sYXlvdXQ9ZnVuY3Rpb24oKXtmb3IodmFyIHQsZSxpPVwieVwiPT09dGhpcy5vcHRpb25zLmRpcmVjdGlvbj8xOjAsbz0xPT09aT8wOjEsbj10aGlzLmNvbnRyb2xsZXIuaW5kZXgscz10aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoLTEsYT1bXSxyPVswLDBdLGg9MTtoPD10aGlzLmNvbnRyb2xsZXIucmVuZGVyTGltaXRbMF07aCsrKXQ9dGhpcy5jb250cm9sbGVyLl9zYW5pdGl6ZUluZGV4KG4taCksZT10aGlzLl9nZXRDZW50ZXJlZFBvc2l0aW9uKHQsbykscltvXT1lW29dLHJbaV0tPXRoaXMuZGF0YS5zaXplQ2FjaGVbdF1baV0rdGhpcy5vcHRpb25zLnBhZGRpbmdbaV0sYVt0XT1UcmFuc2Zvcm0udHJhbnNsYXRlKHJbMF0sclsxXSk7Zm9yKHZhciB1PVswLDBdLGg9MDtoPHRoaXMuY29udHJvbGxlci5yZW5kZXJMaW1pdFsxXSYmKHQ9dGhpcy5jb250cm9sbGVyLl9zYW5pdGl6ZUluZGV4KG4raCksZT10aGlzLl9nZXRDZW50ZXJlZFBvc2l0aW9uKHQsbyksdGhpcy5jb250cm9sbGVyLm9wdGlvbnMubG9vcD09PSEwfHx0Pj1uKTtoKyspYVt0XT10aGlzLl9nZXRUcmFuc2Zvcm0odCx1LG8pLHVbaV0rPXRoaXMuZGF0YS5zaXplQ2FjaGVbdF1baV0rdGhpcy5vcHRpb25zLnBhZGRpbmdbaV07dmFyIGM9MDtpZighdGhpcy5jb250cm9sbGVyLm9wdGlvbnMubG9vcCYmYVtzXSYmdGhpcy5kYXRhLnNpemVDYWNoZVtzXSl7dmFyIGw9MD09PWk/YVtzXVsxMl06YVtzXVsxM107aWYobD49MCl7dmFyIGQ9bCt0aGlzLmRhdGEuc2l6ZUNhY2hlW3RdW2ldO2Q8dGhpcy5jb250YWluZXJTaXplW2ldJiYoYz10aGlzLmNvbnRhaW5lclNpemVbaV0tZCl9fXZhciBwPXRoaXMub3B0aW9ucy50cmFuc2l0aW9uO3RoaXMudXNlVG91Y2hFbmRUcmFuc2l0aW9uJiYocD10aGlzLm9wdGlvbnMudG91Y2hFbmRUcmFuc2l0aW9uLHRoaXMudXNlVG91Y2hFbmRUcmFuc2l0aW9uPSExKTtmb3IodmFyIGg9MDtoPHRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGg7aCsrKWlmKGFbaF0pe2lmKHRoaXMuYXBwbHlQcmVBbmltYXRpb25PZmZzZXRbaF0pe3ZhciBmPTA9PT1pP2FbaF1bMTJdOmFbaF1bMTNdLHk9MD5mPy0xOjE7ZT10aGlzLl9nZXRDZW50ZXJlZFBvc2l0aW9uKGgsbyk7dmFyIFQ9W107VFtpXT10aGlzLmNvbnRhaW5lclNpemVbaV0qeSxUW29dPWVbb10sdGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbaF0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoVFswXSxUWzFdKSksdGhpcy5hcHBseVByZUFuaW1hdGlvbk9mZnNldFtoXT0hMX0wPT09aT9hW2hdWzEyXSs9YzphW2hdWzEzXSs9Yyx0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1toXS5zZXQoYVtoXSxwKSx0aGlzLmRhdGEub3BhY2l0aWVzW2hdLnNldCgxLHApfWVsc2UgdGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbaF0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUodGhpcy5jb250YWluZXJTaXplWzBdLHRoaXMuY29udGFpbmVyU2l6ZVsxXSkpLHRoaXMuZGF0YS5vcGFjaXRpZXNbaF0uc2V0KDApLHRoaXMuYXBwbHlQcmVBbmltYXRpb25PZmZzZXRbaF09ITB9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLmRlYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLmlzTGFzdExheW91dFNpbmd1bGFyPSExLHRoaXMuX3JlbW92ZVRvdWNoRXZlbnRzKCl9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLmdldFJlbmRlckxpbWl0PWZ1bmN0aW9uKCl7cmV0dXJuWzUsTWF0aC5taW4oMTAsdGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aCldfSxTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5faGFuZGxlVG91Y2hFdmVudHM9ZnVuY3Rpb24oKXt2YXIgdD1cInlcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/MTowO3RoaXMuYm91bmRUb3VjaFVwZGF0ZT1mdW5jdGlvbihlKXt2YXIgaT10aGlzLmRhdGEudG91Y2hPZmZzZXQsbz1pLmdldCgpO29bdF0rPWUuZGVsdGFbdF0saS5zZXQoW29bMF0sb1sxXV0pfS5iaW5kKHRoaXMpLHRoaXMuYm91bmRUb3VjaEVuZD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLmRhdGEudG91Y2hPZmZzZXQsaT1lLmdldCgpLG89aVt0XSxuPTA7bjx0aGlzLmNvbnRyb2xsZXIuaXRlbXMubGVuZ3RoO24rKyl7dmFyIHM9dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbbl0sYT1zLnRyYW5zbGF0ZS5nZXQoKTtzLnNldFRyYW5zbGF0ZShbYVswXStpWzBdLGFbMV0raVsxXV0pfWUuc2V0KFswLDBdKTt2YXIgcj1vPjA/LTE6MSxoPXRoaXMuY29udHJvbGxlci5pbmRleDtmb3Iobz1NYXRoLmFicyhvKTtvPjA7KW8tPXRoaXMuZGF0YS5zaXplQ2FjaGVbaF1bdF0saD10aGlzLmNvbnRyb2xsZXIuX3Nhbml0aXplSW5kZXgoaCtyKTt0aGlzLnVzZVRvdWNoRW5kVHJhbnNpdGlvbj0hMCx0aGlzLmNvbnRyb2xsZXIuX2V2ZW50T3V0cHV0LmVtaXQoXCJzZXRcIixoKX0uYmluZCh0aGlzKSx0aGlzLl9hZGRUb3VjaEV2ZW50cygpfSxTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5fYWRkVG91Y2hFdmVudHM9ZnVuY3Rpb24oKXt0aGlzLmNvbnRyb2xsZXIuc3luYy5vbihcInVwZGF0ZVwiLHRoaXMuYm91bmRUb3VjaFVwZGF0ZSksdGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJlbmRcIix0aGlzLmJvdW5kVG91Y2hFbmQpfSxTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5fcmVtb3ZlVG91Y2hFdmVudHM9ZnVuY3Rpb24oKXt0aGlzLmNvbnRyb2xsZXIuc3luYy5yZW1vdmVMaXN0ZW5lcihcInVwZGF0ZVwiLHRoaXMuYm91bmRUb3VjaFVwZGF0ZSksdGhpcy5jb250cm9sbGVyLnN5bmMucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIix0aGlzLmJvdW5kVG91Y2hFbmQpfSxTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5fZ2V0Q2VudGVyZWRQb3NpdGlvbj1mdW5jdGlvbih0LGUpe2lmKHZvaWQgMD09PXRoaXMuZGF0YS5zaXplQ2FjaGVbdF0pcmV0dXJuWzAsMF07dmFyIGk9WzAsMF07cmV0dXJuIGlbZV09LjUqKHRoaXMuY29udGFpbmVyU2l6ZVtlXS10aGlzLmRhdGEuc2l6ZUNhY2hlW3RdW2VdKSxpfSxTZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5fZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKHQsZSxpKXt2YXIgbz10aGlzLl9nZXRDZW50ZXJlZFBvc2l0aW9uKHQsaSk7cmV0dXJuIFRyYW5zZm9ybS50cmFuc2xhdGUoZVswXStvWzBdLGVbMV0rb1sxXSl9LG1vZHVsZS5leHBvcnRzPVNlcXVlbnRpYWxMYXlvdXQ7IiwiZnVuY3Rpb24gU2luZ3VsYXJMYXlvdXQodCl7cmV0dXJuIExheW91dC5jYWxsKHRoaXMsdCksdGhpcy5fYm91bmRTaXplTGlzdGVuZXI9bnVsbCx0aGlzfXZhciBMYXlvdXQ9cmVxdWlyZShcIi4vTGF5b3V0XCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLFRpbWVyPXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1RpbWVyXCIpO1Npbmd1bGFyTGF5b3V0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKExheW91dC5wcm90b3R5cGUpLFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1TaW5ndWxhckxheW91dCxTaW5ndWxhckxheW91dC5ERUZBVUxUX09QVElPTlM9e30sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5fYm91bmRTaXplTGlzdGVuZXI9dGhpcy5jZW50ZXJJdGVtLmJpbmQodGhpcyk7Zm9yKHZhciB0PTA7dDx0aGlzLmNvbnRyb2xsZXIuaXRlbXMubGVuZ3RoO3QrKyl0aGlzLmRhdGEuY2hpbGRPcmlnaW5zW3RdLnNldChbLjUsLjVdKSx0aGlzLmRhdGEuY2hpbGRBbGlnbnNbdF0uc2V0KFsuNSwuNV0pLHRoaXMuZGF0YS5jaGlsZFRyYW5zZm9ybXNbdF0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSksdD09PXRoaXMuY29udHJvbGxlci5pbmRleD8odGhpcy5kYXRhLm9wYWNpdGllc1t0XS5zZXQoMSx0aGlzLm9wdGlvbnMuY3VydmUpLHRoaXMuZGF0YS5zaXplQ2FjaGVbdF0mJih0aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXJ8fG51bGw9PT10aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXI/dGhpcy5jZW50ZXJJdGVtKHQpOnRoaXMuZGF0YS5jaGlsZFRyYW5zZm9ybXNbdF0uc2V0KFRyYW5zZm9ybS5zY2FsZSguOCwuOCkse2R1cmF0aW9uOjE1MH0sZnVuY3Rpb24odCl7dGhpcy5jZW50ZXJJdGVtKHQse21ldGhvZDpcInNwcmluZ1wiLGRhbXBpbmdSYXRpbzouNjUscGVyaW9kOjQwMH0pLHRoaXMuZGF0YS5jaGlsZFRyYW5zZm9ybXNbdF0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSx7ZHVyYXRpb246MTUwfSl9LmJpbmQodGhpcyx0KSkpKToodGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1t0XS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZSgwLDAsLTEwKSksdGhpcy5kYXRhLm9wYWNpdGllc1t0XS5zZXQoMCx7ZHVyYXRpb246MzAwfSxmdW5jdGlvbih0KXt0aGlzLmRhdGEuc2l6ZUNhY2hlW3RdJiZ0aGlzLmNlbnRlckl0ZW0odCl9LmJpbmQodGhpcyx0KSkpO3RoaXMuY29udHJvbGxlci5fZXZlbnRJbnB1dC5vbihcImluaXRpYWxTaXplXCIsdGhpcy5fYm91bmRTaXplTGlzdGVuZXIpLHRoaXMuX2hhbmRsZVRvdWNoRXZlbnRzKCl9LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5sYXlvdXQ9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcy5jb250cm9sbGVyLmluZGV4LGk9dGhpcy5jb250cm9sbGVyLmxhc3RJbmRleCxlPXRoaXMuY29udHJvbGxlci5pdGVtcy5sZW5ndGgtMSxuPSh0Pml8fDA9PT10JiZpPT09ZSkmJiEodD09PWUmJjA9PT1pKSxvPXRoaXMuY29udHJvbGxlci5nZXRTaXplKCkuc2xpY2UoMCkscj0wO3I8dGhpcy5jb250cm9sbGVyLml0ZW1zLmxlbmd0aDtyKyspcj09PXRoaXMuY29udHJvbGxlci5pbmRleD90aGlzLmN1cnJlbnRJdGVtVHJhbnNpdGlvbih0aGlzLmdldEl0ZW0ociksbyxuKTpyPT09dGhpcy5jb250cm9sbGVyLmxhc3RJbmRleD90aGlzLnByZXZpb3VzSXRlbVRyYW5zaXRpb24odGhpcy5nZXRJdGVtKHIpLG8sbik6dGhpcy5vdGhlckl0ZW1UcmFuc2l0aW9uKHRoaXMuZ2V0SXRlbShyKSxvKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLm90aGVySXRlbVRyYW5zaXRpb249ZnVuY3Rpb24odCl7dC5vcGFjaXR5LnNldCgwKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmN1cnJlbnRJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbigpe30sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLnByZXZpb3VzSXRlbVRyYW5zaXRpb249ZnVuY3Rpb24oKXt9LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5kZWFjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLmlzTGFzdExheW91dFNpbmd1bGFyPSEwLHRoaXMuY29udHJvbGxlci5fZXZlbnRJbnB1dC5yZW1vdmVMaXN0ZW5lcihcImluaXRpYWxTaXplXCIsdGhpcy5fYm91bmRTaXplTGlzdGVuZXIpLHRoaXMuX3JlbW92ZVRvdWNoRXZlbnRzKCl9LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5nZXRSZW5kZXJMaW1pdD1mdW5jdGlvbigpe3JldHVyblsxLDFdfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuZ2V0Q2VudGVyZWRQb3NpdGlvbj1mdW5jdGlvbih0KXt2YXIgaT10aGlzLmNvbnRyb2xsZXIuZ2V0U2l6ZSgpLGU9dGhpcy5kYXRhLnNpemVDYWNoZVt0XTtyZXR1cm5bLjUqKGlbMF0tZVswXSksLjUqKGlbMV0tZVsxXSldfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuY2VudGVySXRlbT1mdW5jdGlvbih0LGkpe3ZhciBlPXRoaXMuY29udHJvbGxlci5nZXRTaXplKCksbj10aGlzLmRhdGEuc2l6ZUNhY2hlW3RdO3RoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW3RdLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKC41KihlWzBdLW5bMF0pLC41KihlWzFdLW5bMV0pKSxpKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmdldEl0ZW09ZnVuY3Rpb24odCl7cmV0dXJue2l0ZW06dGhpcy5jb250cm9sbGVyLml0ZW1zW3RdLHNpemU6dGhpcy5kYXRhLnNpemVDYWNoZVt0XSxpbmRleDp0LG9wYWNpdHk6dGhpcy5kYXRhLm9wYWNpdGllc1t0XSxwYXJlbnRPcmlnaW46dGhpcy5kYXRhLnBhcmVudE9yaWdpbnNbdF0scGFyZW50QWxpZ246dGhpcy5kYXRhLnBhcmVudEFsaWduc1t0XSxwYXJlbnRTaXplOnRoaXMuZGF0YS5wYXJlbnRTaXplc1t0XSxwYXJlbnRUcmFuc2Zvcm06dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbdF0sY2hpbGRUcmFuc2Zvcm06dGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1t0XSxjaGlsZE9yaWdpbjp0aGlzLmRhdGEuY2hpbGRPcmlnaW5zW3RdLGNoaWxkQWxpZ246dGhpcy5kYXRhLmNoaWxkQWxpZ25zW3RdfX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLl9oYW5kbGVUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuYm91bmRUb3VjaFVwZGF0ZT1mdW5jdGlvbih0KXt2YXIgaT10aGlzLmNvbnRyb2xsZXIuaW5kZXgsZT10aGlzLmRhdGEuc2l6ZUNhY2hlW2ldLG49dGhpcy5kYXRhLnRvdWNoT2Zmc2V0LG89bi5nZXQoKTtpZihuLnNldChbb1swXSt0LmRlbHRhWzBdLG9bMV1dKSxNYXRoLmFicyhvWzBdKT4xKmVbMF0vMyl7dmFyIHI9bi5nZXQoKVswXTwwP1wicHJldmlvdXNcIjpcIm5leHRcIjt0aGlzLl9lbWl0RXZlbnRGcm9tVG91Y2godC52ZWxvY2l0eSxyKX19LmJpbmQodGhpcyksdGhpcy5ib3VuZFRvdWNoRW5kPWZ1bmN0aW9uKHQpe3ZhciBpPXRoaXMuZGF0YS50b3VjaE9mZnNldDtpLnNldChbMCwwXSx7Y3VydmU6XCJvdXRCYWNrXCIsZHVyYXRpb246MTUwfSksVGltZXIuc2V0VGltZW91dChmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIHQmJnQoKX0sMTAwKX0uYmluZCh0aGlzKSx0aGlzLl9hZGRUb3VjaEV2ZW50cygpfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuX2FkZFRvdWNoRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJ1cGRhdGVcIix0aGlzLmJvdW5kVG91Y2hVcGRhdGUpLHRoaXMuY29udHJvbGxlci5zeW5jLm9uKFwiZW5kXCIsdGhpcy5ib3VuZFRvdWNoRW5kKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLl9yZW1vdmVUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwidXBkYXRlXCIsdGhpcy5ib3VuZFRvdWNoVXBkYXRlKSx0aGlzLmNvbnRyb2xsZXIuc3luYy5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLHRoaXMuYm91bmRUb3VjaEVuZCl9LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5fZW1pdEV2ZW50RnJvbVRvdWNoPWZ1bmN0aW9uKHQsaSl7dGhpcy5fcmVtb3ZlVG91Y2hFdmVudHMoKTt2YXIgZT1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5fZXZlbnRPdXRwdXQuZW1pdChpKSx0aGlzLl9hZGRUb3VjaEV2ZW50cygpfS5iaW5kKHRoaXMpO3RoaXMuYm91bmRUb3VjaEVuZChlKX0sbW9kdWxlLmV4cG9ydHM9U2luZ3VsYXJMYXlvdXQ7IiwiZnVuY3Rpb24gU2luZ3VsYXJPcGFjaXR5KHQpe1Npbmd1bGFyTGF5b3V0LmNhbGwodGhpcyx0KX12YXIgU2luZ3VsYXJMYXlvdXQ9cmVxdWlyZShcIi4vU2luZ3VsYXJMYXlvdXRcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIik7U2luZ3VsYXJPcGFjaXR5LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZSksU2luZ3VsYXJPcGFjaXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1TaW5ndWxhck9wYWNpdHksU2luZ3VsYXJPcGFjaXR5LmlkPVwiU2luZ3VsYXJPcGFjaXR5XCIsU2luZ3VsYXJPcGFjaXR5LkRFRkFVTFRfT1BUSU9OUz17dHJhbnNpdGlvbjp7Y3VydmU6XCJsaW5lYXJcIixkdXJhdGlvbjo1MDB9fSxTaW5ndWxhck9wYWNpdHkucHJvdG90eXBlLmN1cnJlbnRJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbih0KXt0Lm9wYWNpdHkuc2V0KDEsdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIuaW5kZXgpfSxTaW5ndWxhck9wYWNpdHkucHJvdG90eXBlLnByZXZpb3VzSXRlbVRyYW5zaXRpb249ZnVuY3Rpb24odCl7dC5vcGFjaXR5LnNldCgwLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSx0aGlzLmNlbnRlckl0ZW0odGhpcy5jb250cm9sbGVyLmxhc3RJbmRleCl9LG1vZHVsZS5leHBvcnRzPVNpbmd1bGFyT3BhY2l0eTsiLCJmdW5jdGlvbiBTaW5ndWxhclBhcmFsbGF4KGEpe1Npbmd1bGFyTGF5b3V0LmNhbGwodGhpcyxhKSx0aGlzLmF4aXM9XCJ4XCI9PT10aGlzLm9wdGlvbnMuZGlyZWN0aW9uPzA6MX12YXIgU2luZ3VsYXJMYXlvdXQ9cmVxdWlyZShcIi4vU2luZ3VsYXJMYXlvdXRcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIik7U2luZ3VsYXJQYXJhbGxheC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTaW5ndWxhckxheW91dC5wcm90b3R5cGUpLFNpbmd1bGFyUGFyYWxsYXgucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyUGFyYWxsYXgsU2luZ3VsYXJQYXJhbGxheC5pZD1cIlNpbmd1bGFyUGFyYWxsYXhcIixTaW5ndWxhclBhcmFsbGF4LkRFRkFVTFRfT1BUSU9OUz17dHJhbnNpdGlvbjp7bWV0aG9kOlwic3ByaW5nXCIsZGFtcGluZ1JhdGlvOi45NSxwZXJpb2Q6NTUwfSxkaXJlY3Rpb246XCJ5XCIscGFyYWxsYXhSYXRpbzouMn0sU2luZ3VsYXJQYXJhbGxheC5EZXB0aD0xLFNpbmd1bGFyUGFyYWxsYXgucHJvdG90eXBlLmN1cnJlbnRJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbihhLHIsdCl7YS5vcGFjaXR5LnNldCgxKSxhLnBhcmVudFRyYW5zZm9ybS5oYWx0KCk7dmFyIGksbj10aGlzLmdldENlbnRlcmVkUG9zaXRpb24odGhpcy5jb250cm9sbGVyLmluZGV4KTt0PyhpPVtuWzBdLG5bMV0sLTIqU2luZ3VsYXJQYXJhbGxheC5EZXB0aF0saVt0aGlzLmF4aXNdPS1hLnNpemVbdGhpcy5heGlzXSp0aGlzLm9wdGlvbnMucGFyYWxsYXhSYXRpbyxhLnBhcmVudFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShpWzBdLGlbMV0saVsyXSkpLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKG5bMF0sblsxXSxuWzJdKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbikpOihpPVtuWzBdLG5bMV0sMF0saVt0aGlzLmF4aXNdPXJbdGhpcy5heGlzXSxhLnBhcmVudFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShpWzBdLGlbMV0saVsyXSkpLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKG5bMF0sblsxXSxuWzJdKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbikpLGEuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSl9LFNpbmd1bGFyUGFyYWxsYXgucHJvdG90eXBlLnByZXZpb3VzSXRlbVRyYW5zaXRpb249ZnVuY3Rpb24oYSxyLHQpe2Eub3BhY2l0eS5zZXQoMSksYS5wYXJlbnRUcmFuc2Zvcm0uaGFsdCgpO3ZhciBpPXRoaXMuZ2V0Q2VudGVyZWRQb3NpdGlvbih0aGlzLmNvbnRyb2xsZXIuaW5kZXgpO2lmKGEub3BhY2l0eS5zZXQoMCx7Y3VydmU6XCJsaW5lYXJcIixkdXJhdGlvbjp0aGlzLm9wdGlvbnMudHJhbnNpdGlvbi5wZXJpb2R8fHRoaXMub3B0aW9ucy50cmFuc2l0aW9uLmR1cmF0aW9ufSksdCl7dmFyIG49W2lbMF0saVsxXSwtMl07blt0aGlzLmF4aXNdPXJbdGhpcy5heGlzXSxhLnBhcmVudFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShuWzBdLG5bMV0sblsyXSksdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKGlbMF0saVsxXSxpWzJdKSx7Y3VydmU6XCJsaW5lYXJcIixkdXJhdGlvbjoxfSl9ZWxzZXt2YXIgcz1UcmFuc2Zvcm0udHJhbnNsYXRlKGlbMF0saVsxXSwtMiksbz1baVswXSxpWzFdLC0yKlNpbmd1bGFyUGFyYWxsYXguRGVwdGhdO29bdGhpcy5heGlzXT0tYS5zaXplW3RoaXMuYXhpc10qdGhpcy5vcHRpb25zLnBhcmFsbGF4UmF0aW8sYS5wYXJlbnRUcmFuc2Zvcm0uc2V0KHMpLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKG9bMF0sb1sxXSxvWzJdKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbil9fSxtb2R1bGUuZXhwb3J0cz1TaW5ndWxhclBhcmFsbGF4OyIsImZ1bmN0aW9uIFNpbmd1bGFyU2xpZGVCZWhpbmQoaSl7U2luZ3VsYXJMYXlvdXQuY2FsbCh0aGlzLGkpfXZhciBTaW5ndWxhckxheW91dD1yZXF1aXJlKFwiLi9TaW5ndWxhckxheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxJc0lFPXJlcXVpcmUoXCIuLi9kb20vSUVcIik7U2luZ3VsYXJTbGlkZUJlaGluZC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTaW5ndWxhckxheW91dC5wcm90b3R5cGUpLFNpbmd1bGFyU2xpZGVCZWhpbmQucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyU2xpZGVCZWhpbmQsU2luZ3VsYXJTbGlkZUJlaGluZC5pZD1cIlNpbmd1bGFyU2xpZGVCZWhpbmRcIixTaW5ndWxhclNsaWRlQmVoaW5kLkRFRkFVTFRfT1BUSU9OUz17ZHVyYXRpb246NjAwLHJvdGF0aW9uQW5nbGU6TWF0aC5QSS80fSxTaW5ndWxhclNsaWRlQmVoaW5kLkZpcnN0Q3VydmU9XCJlYXNlSW5PdXRcIixTaW5ndWxhclNsaWRlQmVoaW5kLlNlY29uZEN1cnZlPVwiZWFzZUluT3V0XCIsU2luZ3VsYXJTbGlkZUJlaGluZC5EdXJhdGlvblJhdGlvPTEvMyxTaW5ndWxhclNsaWRlQmVoaW5kLk9mZnNldEZhY3Rvcj0uNSxTaW5ndWxhclNsaWRlQmVoaW5kLnpJbmRleD0tNTAwLFNpbmd1bGFyU2xpZGVCZWhpbmQucHJvdG90eXBlLmN1cnJlbnRJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbihpLGUsbil7dmFyIHIsdCxhLG87bj8ocj1bLjUsMV0sdD1bLjUsMV0sYT0xLG89aS5zaXplWzFdKlNpbmd1bGFyU2xpZGVCZWhpbmQuT2Zmc2V0RmFjdG9yKToocj1bLjUsMF0sdD1bLjUsMF0sYT0tMSxvPWkuc2l6ZVsxXSpTaW5ndWxhclNsaWRlQmVoaW5kLk9mZnNldEZhY3RvciotMSk7dmFyIGQ9dGhpcy5vcHRpb25zLmR1cmF0aW9uKlNpbmd1bGFyU2xpZGVCZWhpbmQuRHVyYXRpb25SYXRpbyxsPSh0aGlzLm9wdGlvbnMuZHVyYXRpb24tZCx7ZHVyYXRpb246ZCxjdXJ2ZTpTaW5ndWxhclNsaWRlQmVoaW5kLkZpcnN0Q3VydmV9KSxzPXtkdXJhdGlvbjpkLGN1cnZlOlNpbmd1bGFyU2xpZGVCZWhpbmQuU2Vjb25kQ3VydmV9O2kuY2hpbGRPcmlnaW4uc2V0KHIpLGkuY2hpbGRBbGlnbi5zZXQodCksaS5vcGFjaXR5LnNldCgxLGwpLGkuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5tdWx0aXBseShUcmFuc2Zvcm0udHJhbnNsYXRlKDAsMCxTaW5ndWxhclNsaWRlQmVoaW5kLnpJbmRleCksVHJhbnNmb3JtLnJvdGF0ZVgodGhpcy5vcHRpb25zLnJvdGF0aW9uQW5nbGUqYSkpKSxpLmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKDAsbyxTaW5ndWxhclNsaWRlQmVoaW5kLnpJbmRleC8yKSxsLGZ1bmN0aW9uKCl7SXNJRSYmaS5pdGVtLnNldFByb3BlcnRpZXMoe3pJbmRleDoxfSksaS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5LHMpfSksdGhpcy5jZW50ZXJJdGVtKHRoaXMuY29udHJvbGxlci5pbmRleCl9LFNpbmd1bGFyU2xpZGVCZWhpbmQucHJvdG90eXBlLnByZXZpb3VzSXRlbVRyYW5zaXRpb249ZnVuY3Rpb24oaSxlLG4pe3ZhciByLHQsYSxvO24/KHI9Wy41LDBdLHQ9Wy41LDBdLGE9LTEsbz1pLnNpemVbMV0qU2luZ3VsYXJTbGlkZUJlaGluZC5PZmZzZXRGYWN0b3IqLTEpOihyPVsuNSwxXSx0PVsuNSwxXSxhPTEsbz1pLnNpemVbMV0qU2luZ3VsYXJTbGlkZUJlaGluZC5PZmZzZXRGYWN0b3IpO3ZhciBkPXRoaXMub3B0aW9ucy5kdXJhdGlvbipTaW5ndWxhclNsaWRlQmVoaW5kLkR1cmF0aW9uUmF0aW8sbD17ZHVyYXRpb246ZCxjdXJ2ZTpTaW5ndWxhclNsaWRlQmVoaW5kLkZpcnN0Q3VydmV9LHM9e2R1cmF0aW9uOnRoaXMub3B0aW9ucy5kdXJhdGlvbi1kLGN1cnZlOlNpbmd1bGFyU2xpZGVCZWhpbmQuU2Vjb25kQ3VydmV9O2kuY2hpbGRPcmlnaW4uc2V0KHIpLGkuY2hpbGRBbGlnbi5zZXQodCksaS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLm11bHRpcGx5KFRyYW5zZm9ybS50cmFuc2xhdGUoMCxvKSxUcmFuc2Zvcm0ucm90YXRlWCh0aGlzLm9wdGlvbnMucm90YXRpb25BbmdsZSphKSksbCxmdW5jdGlvbigpe0lzSUUmJmkuaXRlbS5zZXRQcm9wZXJ0aWVzKHt6SW5kZXg6LTF9KSxpLm9wYWNpdHkuc2V0KDAscyksaS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZSgwLDAsU2luZ3VsYXJTbGlkZUJlaGluZC56SW5kZXgpLHMpfS5iaW5kKHRoaXMpKSx0aGlzLmNlbnRlckl0ZW0odGhpcy5jb250cm9sbGVyLmxhc3RJbmRleCl9LG1vZHVsZS5leHBvcnRzPVNpbmd1bGFyU2xpZGVCZWhpbmQ7IiwiZnVuY3Rpb24gU2luZ3VsYXJTbGlkZUluKGkpe1Npbmd1bGFyTGF5b3V0LmNhbGwodGhpcyxpKSx0aGlzLm9wdGlvbnMuZGlyZWN0aW9uPXRoaXMub3B0aW9ucy5kaXJlY3Rpb24udG9Mb3dlckNhc2UoKX12YXIgU2luZ3VsYXJMYXlvdXQ9cmVxdWlyZShcIi4vU2luZ3VsYXJMYXlvdXRcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIik7U2luZ3VsYXJTbGlkZUluLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZSksU2luZ3VsYXJTbGlkZUluLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1TaW5ndWxhclNsaWRlSW4sU2luZ3VsYXJTbGlkZUluLmlkPVwiU2luZ3VsYXJTbGlkZUluXCIsU2luZ3VsYXJTbGlkZUluLkRFRkFVTFRfT1BUSU9OUz17dHJhbnNpdGlvbjp7Y3VydmU6XCJlYXNlT3V0XCIsZHVyYXRpb246NjAwfSxkZWxheVJhdGlvOi4xNSxkaXJlY3Rpb246XCJ5XCJ9LFNpbmd1bGFyU2xpZGVJbi5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKGksdCxvKXt2YXIgbj10aGlzLm9wdGlvbnMudHJhbnNpdGlvbixyPW4uZHVyYXRpb258fG4ucGVyaW9kLGU9cip0aGlzLm9wdGlvbnMuZGVsYXlSYXRpbztyLT1lO3ZhciBhLHMsbD1uLm1ldGhvZD97cGVyaW9kOnIsbWV0aG9kOm4ubWV0aG9kLGRhbXBpbmdSYXRpbzpuLmRhbXBpbmdSYXRpb306e2R1cmF0aW9uOnIsY3VydmU6bi5jdXJ2ZX07bz9cInhcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/KGE9dFswXSxzPTApOihhPTAscz0tMSp0WzFdKTpcInhcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/KGE9LTEqdFswXSxzPTApOihhPTAscz10WzFdKSxpLm9wYWNpdHkuc2V0KDEpLGkuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoYSxzKSksaS5vcGFjaXR5LmRlbGF5KGUsZnVuY3Rpb24oKXtpLmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKDAsMCksbCl9KSx0aGlzLmNlbnRlckl0ZW0odGhpcy5jb250cm9sbGVyLmluZGV4KX0sU2luZ3VsYXJTbGlkZUluLnByb3RvdHlwZS5wcmV2aW91c0l0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKGksdCxvKXt2YXIgbixyLGU7bz8oXCJ4XCI9PT10aGlzLm9wdGlvbnMuZGlyZWN0aW9uPyhuPVswLC41XSxyPVswLC41XSk6KG49Wy41LDFdLHI9Wy41LDFdKSxlPTEpOihcInhcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/KG49WzEsLjVdLHI9WzEsLjVdKToobj1bLjUsMF0scj1bLjUsMF0pLGU9LTEpLGkuY2hpbGRPcmlnaW4uc2V0KG4pLGkuY2hpbGRBbGlnbi5zZXQociksXCJ4XCI9PT10aGlzLm9wdGlvbnMuZGlyZWN0aW9uP2kuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5yb3RhdGVZKE1hdGguUEkvNCplKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbik6aS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnJvdGF0ZVgoTWF0aC5QSS8zKmUpLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSxpLm9wYWNpdHkuc2V0KDAsdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIubGFzdEluZGV4KX0sbW9kdWxlLmV4cG9ydHM9U2luZ3VsYXJTbGlkZUluOyIsImZ1bmN0aW9uIFNpbmd1bGFyU29mdFNjYWxlKHQpe1Npbmd1bGFyTGF5b3V0LmNhbGwodGhpcyx0KX12YXIgU2luZ3VsYXJMYXlvdXQ9cmVxdWlyZShcIi4vU2luZ3VsYXJMYXlvdXRcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIiksVXRpbGl0eT1yZXF1aXJlKFwiZmFtb3VzL3V0aWxpdGllcy9VdGlsaXR5XCIpO1Npbmd1bGFyU29mdFNjYWxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZSksU2luZ3VsYXJTb2Z0U2NhbGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyU29mdFNjYWxlLFNpbmd1bGFyU29mdFNjYWxlLmlkPVwiU2luZ3VsYXJTb2Z0U2NhbGVcIixTaW5ndWxhclNvZnRTY2FsZS5ERUZBVUxUX09QVElPTlM9e3RyYW5zaXRpb246e2R1cmF0aW9uOjYwMCxjdXJ2ZTpcImVhc2VPdXRcIn0sc2NhbGVVcFZhbHVlOjEuMyxzY2FsZURvd25WYWx1ZTouOSxkZWxheVJhdGlvOi4wNX0sU2luZ3VsYXJTb2Z0U2NhbGUucHJvdG90eXBlLmN1cnJlbnRJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbih0LG8sYSl7dmFyIGk9YT90aGlzLm9wdGlvbnMuc2NhbGVEb3duVmFsdWU6dGhpcy5vcHRpb25zLnNjYWxlVXBWYWx1ZTt0Lm9wYWNpdHkuc2V0KDApLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5zY2FsZShpLGkpKTt2YXIgZT10aGlzLm9wdGlvbnMudHJhbnNpdGlvbixyPWUuZHVyYXRpb258fGUucGVyaW9kLG49cip0aGlzLm9wdGlvbnMuZGVsYXlSYXRpbztyLT1uO3ZhciBsPWUubWV0aG9kP3twZXJpb2Q6cixkYW1waW5nUmF0aW86ZS5kYW1waW5nUmF0aW8sbWV0aG9kOmUubWV0aG9kfTp7ZHVyYXRpb246cixjdXJ2ZTplLmN1cnZlfTt0Lm9wYWNpdHkuZGVsYXkobixmdW5jdGlvbigpe3Qub3BhY2l0eS5zZXQoMSxsKSx0LmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uc2NhbGUoMSwxKSxsKX0pfSxTaW5ndWxhclNvZnRTY2FsZS5wcm90b3R5cGUucHJldmlvdXNJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbih0LG8sYSl7dmFyIGk9YT90aGlzLm9wdGlvbnMuc2NhbGVVcFZhbHVlOnRoaXMub3B0aW9ucy5zY2FsZURvd25WYWx1ZSxlPXRoaXMub3B0aW9ucy50cmFuc2l0aW9uLHI9ZS5tZXRob2Q/e3BlcmlvZDouNDUqZS5wZXJpb2QsbWV0aG9kOmUubWV0aG9kLGRhbXBpbmdSYXRpbzplLmRhbXBpbmdSYXRpb306e2R1cmF0aW9uOi40NSplLmR1cmF0aW9uLGN1cnZlOmUuY3VydmV9O3QuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5zY2FsZShpLGkpLGUpLHQub3BhY2l0eS5zZXQoMCxyKX0sbW9kdWxlLmV4cG9ydHM9U2luZ3VsYXJTb2Z0U2NhbGU7IiwiZnVuY3Rpb24gU2luZ3VsYXJUd2lzdCh0KXtTaW5ndWxhckxheW91dC5jYWxsKHRoaXMsdCksdGhpcy5vcHRpb25zLmRpcmVjdGlvbj10aGlzLm9wdGlvbnMuZGlyZWN0aW9uLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gX2dldFRyYW5zZm9ybUZyb21EaXJlY3Rpb24odCxpLHIpe3JldHVyblwieFwiPT09dD9UcmFuc2Zvcm0udGhlbk1vdmUoVHJhbnNmb3JtLnJvdGF0ZVkoaSksWzAsMCxyXSk6VHJhbnNmb3JtLnRoZW5Nb3ZlKFRyYW5zZm9ybS5yb3RhdGVYKGkpLFswLDAscl0pfXZhciBTaW5ndWxhckxheW91dD1yZXF1aXJlKFwiLi9TaW5ndWxhckxheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxVdGlsaXR5PXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHlcIiksSXNJRT1yZXF1aXJlKFwiLi4vZG9tL0lFXCIpO1Npbmd1bGFyVHdpc3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlKSxTaW5ndWxhclR3aXN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1TaW5ndWxhclR3aXN0LFNpbmd1bGFyVHdpc3QuaWQ9XCJTaW5ndWxhclR3aXN0XCIsU2luZ3VsYXJUd2lzdC5ERUZBVUxUX09QVElPTlM9e3RyYW5zaXRpb246e21ldGhvZDpcInNwcmluZ1wiLGRhbXBpbmdSYXRpbzouODUscGVyaW9kOjYwMH0sZGlyZWN0aW9uOlwieFwiLGZsaXBEaXJlY3Rpb246ITEsZGVwdGg6LTE1MDB9LFNpbmd1bGFyVHdpc3QucHJvdG90eXBlLmN1cnJlbnRJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbih0LGkscil7dC5jaGlsZFRyYW5zZm9ybS5oYWx0KCksdC5vcGFjaXR5LnNldCgxKSxJc0lFJiZ0Lml0ZW0uc2V0UHJvcGVydGllcyh7ekluZGV4OjF9KTt2YXIgbztyPyhvPV9nZXRUcmFuc2Zvcm1Gcm9tRGlyZWN0aW9uKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24sLjk5Kk1hdGguUEksdGhpcy5vcHRpb25zLmRlcHRoKSx0LmNoaWxkVHJhbnNmb3JtLnNldChvKSx0LmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uaWRlbnRpdHksdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pKToobz1fZ2V0VHJhbnNmb3JtRnJvbURpcmVjdGlvbih0aGlzLm9wdGlvbnMuZGlyZWN0aW9uLC45OSotTWF0aC5QSSx0aGlzLm9wdGlvbnMuZGVwdGgpLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KG8pLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbikpLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIuaW5kZXgpfSxTaW5ndWxhclR3aXN0LnByb3RvdHlwZS5wcmV2aW91c0l0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKHQsaSxyKXt0LmNoaWxkVHJhbnNmb3JtLmhhbHQoKSx0Lm9wYWNpdHkuc2V0KDEpLElzSUUmJnQuaXRlbS5zZXRQcm9wZXJ0aWVzKHt6SW5kZXg6LTF9KTt2YXIgbztyPyh0LmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uaWRlbnRpdHkpLG89X2dldFRyYW5zZm9ybUZyb21EaXJlY3Rpb24odGhpcy5vcHRpb25zLmRpcmVjdGlvbiwuOTkqLU1hdGguUEksdGhpcy5vcHRpb25zLmRlcHRoKSx0LmNoaWxkVHJhbnNmb3JtLnNldChvLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSk6KHQuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSksbz1fZ2V0VHJhbnNmb3JtRnJvbURpcmVjdGlvbih0aGlzLm9wdGlvbnMuZGlyZWN0aW9uLC45OSpNYXRoLlBJLHRoaXMub3B0aW9ucy5kZXB0aCksdC5jaGlsZFRyYW5zZm9ybS5zZXQobyx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbikpLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIubGFzdEluZGV4KX0sbW9kdWxlLmV4cG9ydHM9U2luZ3VsYXJUd2lzdDsiLCJmdW5jdGlvbiBnZXRBdmFpbGFibGVUcmFuc2l0aW9uQ3VydmVzKCl7Zm9yKHZhciByPWdldEtleXMoRWFzaW5nKS5zb3J0KCksZT17fSxuPTA7bjxyLmxlbmd0aDtuKyspZVtyW25dXT1FYXNpbmdbcltuXV07cmV0dXJuIGV9ZnVuY3Rpb24gZ2V0S2V5cyhyKXt2YXIgZSxuPVtdO2ZvcihlIGluIHIpci5oYXNPd25Qcm9wZXJ0eShlKSYmbi5wdXNoKGUpO3JldHVybiBufWZ1bmN0aW9uIHJlZ2lzdGVyS2V5cygpe3ZhciByPWdldEF2YWlsYWJsZVRyYW5zaXRpb25DdXJ2ZXMoKTtmb3IodmFyIGUgaW4gcilUd2VlblRyYW5zaXRpb24ucmVnaXN0ZXJDdXJ2ZShlLHJbZV0pfXZhciBFYXNpbmc9cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9FYXNpbmdcIiksVHdlZW5UcmFuc2l0aW9uPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHdlZW5UcmFuc2l0aW9uXCIpO3JlZ2lzdGVyS2V5cygpOyIsInZhciBUcmFuc2l0aW9uYWJsZT1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlXCIpLFNwcmluZ1RyYW5zaXRpb249cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9TcHJpbmdUcmFuc2l0aW9uXCIpLFNuYXBUcmFuc2l0aW9uPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvU25hcFRyYW5zaXRpb25cIiksV2FsbFRyYW5zaXRpb249cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9XYWxsVHJhbnNpdGlvblwiKTtUcmFuc2l0aW9uYWJsZS5yZWdpc3Rlck1ldGhvZChcInNwcmluZ1wiLFNwcmluZ1RyYW5zaXRpb24pLFRyYW5zaXRpb25hYmxlLnJlZ2lzdGVyTWV0aG9kKFwic25hcFwiLFNuYXBUcmFuc2l0aW9uKSxUcmFuc2l0aW9uYWJsZS5yZWdpc3Rlck1ldGhvZChcIndhbGxcIixXYWxsVHJhbnNpdGlvbik7IiwiZnVuY3Rpb24gU2xpZGUoZSl7U3VyZmFjZS5jYWxsKHRoaXMse2NvbnRlbnQ6ZSxzaXplOlshMCwhMF19KX12YXIgU3VyZmFjZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvU3VyZmFjZVwiKTtTbGlkZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTdXJmYWNlLnByb3RvdHlwZSksU2xpZGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNsaWRlLG1vZHVsZS5leHBvcnRzPVNsaWRlOyJdfQ==

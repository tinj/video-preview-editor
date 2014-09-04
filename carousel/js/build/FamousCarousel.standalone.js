!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.FamousCarousel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/flipside1300/Node/widget-carousel/node_modules/cssify/browser.js":[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/classList.js":[function(require,module,exports){

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2011-06-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

(function (view) {

"use strict";

var
      classListProp = "classList"
    , protoProp = "prototype"
    , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
    , objCtr = Object
    , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
    , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
              i = 0
            , len = this.length
        ;
        for (; i < len; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    }
    // Vendors: please allow content code to instantiate DOMExceptions
    , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
    }
    , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
            throw new DOMEx(
                  "SYNTAX_ERR"
                , "An invalid or illegal string was specified"
            );
        }
        if (/\s/.test(token)) {
            throw new DOMEx(
                  "INVALID_CHARACTER_ERR"
                , "String contains an invalid character"
            );
        }
        return arrIndexOf.call(classList, token);
    }
    , ClassList = function (elem) {
        var
              trimmedClasses = strTrim.call(elem.className)
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
        ;
        for (; i < len; i++) {
            this.push(classes[i]);
        }
        this._updateClassName = function () {
            elem.className = this.toString();
        };
    }
    , classListProto = ClassList[protoProp] = []
    , classListGetter = function () {
        return new ClassList(this);
    }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
    return this[i] || null;
};
classListProto.contains = function (token) {
    token += "";
    return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function (token) {
    token += "";
    if (checkTokenAndGetIndex(this, token) === -1) {
        this.push(token);
        this._updateClassName();
    }
};
classListProto.remove = function (token) {
    token += "";
    var index = checkTokenAndGetIndex(this, token);
    if (index !== -1) {
        this.splice(index, 1);
        this._updateClassName();
    }
};
classListProto.toggle = function (token) {
    token += "";
    if (checkTokenAndGetIndex(this, token) === -1) {
        this.add(token);
    } else {
        this.remove(token);
    }
};
classListProto.toString = function () {
    return this.join(" ");
};

if (objCtr.defineProperty) {
    var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
    };
    try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
    }
} else if (objCtr[protoProp].__defineGetter__) {
    elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}

},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/functionPrototypeBind.js":[function(require,module,exports){
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                ? this
                : oThis,
                aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/index.js":[function(require,module,exports){
require('./classList.js');
require('./functionPrototypeBind.js');
require('./requestAnimationFrame.js');
},{"./classList.js":"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/classList.js","./functionPrototypeBind.js":"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/functionPrototypeBind.js","./requestAnimationFrame.js":"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/requestAnimationFrame.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/requestAnimationFrame.js":[function(require,module,exports){
// adds requestAnimationFrame functionality
// Source: http://strd6.com/2011/05/better-window-requestanimationframe-shim/

window.requestAnimationFrame || (window.requestAnimationFrame =
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function(callback, element) {
    return window.setTimeout(function() {
      callback(+new Date());
  }, 1000 / 60);
});

},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Context.js":[function(require,module,exports){
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
},{"./ElementAllocator":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/ElementAllocator.js","./EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","./RenderNode":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/RenderNode.js","./Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/ElementAllocator.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/ElementOutput.js":[function(require,module,exports){
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
},{"./Entity":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Entity.js","./EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","./Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js":[function(require,module,exports){
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
},{"./Context":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Context.js","./EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","./OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Entity.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventEmitter.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js":[function(require,module,exports){
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
},{"./EventEmitter":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventEmitter.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Modifier.js":[function(require,module,exports){
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
},{"./Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js","famous/transitions/TransitionableTransform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TransitionableTransform.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js":[function(require,module,exports){
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
},{"./EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/RenderNode.js":[function(require,module,exports){
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
},{"./Entity":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Entity.js","./SpecParser":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/SpecParser.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/SpecParser.js":[function(require,module,exports){
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
},{"./Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js":[function(require,module,exports){
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
},{"./ElementOutput":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/ElementOutput.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/View.js":[function(require,module,exports){
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
},{"./EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","./OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js","./RenderNode":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/RenderNode.js","famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/ViewSequence.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/FastClick.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/GenericSync.js":[function(require,module,exports){
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
},{"../core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/MouseSync.js":[function(require,module,exports){
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
},{"../core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","../core/OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/ScrollSync.js":[function(require,module,exports){
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
},{"../core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js","../core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","../core/OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/TouchSync.js":[function(require,module,exports){
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
},{"../core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","../core/OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js","./TouchTracker":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/TouchTracker.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/TouchTracker.js":[function(require,module,exports){
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
},{"../core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/PhysicsEngine.js":[function(require,module,exports){
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
},{"famous/core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/bodies/Particle.js":[function(require,module,exports){
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
},{"../integrators/SymplecticEuler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/integrators/SymplecticEuler.js","famous/core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Constraint.js":[function(require,module,exports){
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
},{"famous/core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Snap.js":[function(require,module,exports){
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
},{"./Constraint":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Constraint.js","famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Wall.js":[function(require,module,exports){
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
},{"./Constraint":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Constraint.js","famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/forces/Force.js":[function(require,module,exports){
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
},{"famous/core/EventHandler":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/EventHandler.js","famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/forces/Spring.js":[function(require,module,exports){
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
},{"./Force":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/forces/Force.js","famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/integrators/SymplecticEuler.js":[function(require,module,exports){
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
},{"famous/core/OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/surfaces/ContainerSurface.js":[function(require,module,exports){
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
},{"famous/core/Context":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Context.js","famous/core/Surface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/surfaces/ImageSurface.js":[function(require,module,exports){
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
},{"famous/core/Surface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Easing.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/MultipleTransition.js":[function(require,module,exports){
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
},{"famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/SnapTransition.js":[function(require,module,exports){
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
},{"famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js","famous/physics/PhysicsEngine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/PhysicsEngine.js","famous/physics/bodies/Particle":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/bodies/Particle.js","famous/physics/constraints/Snap":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Snap.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/SpringTransition.js":[function(require,module,exports){
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
},{"famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js","famous/physics/PhysicsEngine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/PhysicsEngine.js","famous/physics/bodies/Particle":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/bodies/Particle.js","famous/physics/forces/Spring":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/forces/Spring.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js":[function(require,module,exports){
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
},{"./MultipleTransition":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/MultipleTransition.js","./TweenTransition":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TweenTransition.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TransitionableTransform.js":[function(require,module,exports){
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
},{"./Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TweenTransition.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/WallTransition.js":[function(require,module,exports){
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
},{"famous/math/Vector":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/math/Vector.js","famous/physics/PhysicsEngine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/PhysicsEngine.js","famous/physics/bodies/Particle":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/bodies/Particle.js","famous/physics/constraints/Wall":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/constraints/Wall.js","famous/physics/forces/Spring":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/physics/forces/Spring.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js":[function(require,module,exports){
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
},{"famous/core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js"}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js":[function(require,module,exports){
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
},{}],"/Users/flipside1300/Node/widget-carousel/node_modules/famous/views/SequentialLayout.js":[function(require,module,exports){
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
},{"famous/core/OptionsManager":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/OptionsManager.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/core/ViewSequence":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/ViewSequence.js","famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/src/Carousel.js":[function(require,module,exports){
function Carousel(t,e){SizeAwareView.apply(this,arguments),this._isPlugin=e,this._data={index:void 0,paginatedIndex:1,itemsPerPage:1,items:void 0,renderables:[],length:void 0},this.sync=new GenericSync,this.layoutDefinition,this.layoutController=new LayoutController({classes:["famous-carousel-container"],itemsPerPage:this._data.itemsPerPage,loop:this.options.loop,sync:this.sync}),this.layoutController._connectContainer(this),this.clickLength=null,this._init()}var RenderNode=require("famous/core/RenderNode"),Modifier=require("famous/core/Modifier"),Engine=require("famous/core/Engine"),Surface=require("famous/core/Surface"),SizeAwareView=require("./constructors/SizeAwareView"),Timer=require("famous/utilities/Timer"),FastClick=require("famous/inputs/FastClick"),RegisterEasing=require("./registries/Easing"),RegisterPhysics=require("./registries/Physics"),GenericSync=require("famous/inputs/GenericSync"),TouchSync=require("famous/inputs/TouchSync"),MouseSync=require("famous/inputs/MouseSync"),ScrollSync=require("famous/inputs/ScrollSync"),Slide=require("./slides/Slide"),Arrows=require("./components/Arrows"),Dots=require("./components/Dots"),LayoutController=require("./layouts/LayoutController"),LayoutFactory=require("./layouts/LayoutFactory");GenericSync.register({mouse:MouseSync,touch:TouchSync,scroll:ScrollSync}),Carousel.prototype=Object.create(SizeAwareView.prototype),Carousel.prototype.constructor=Carousel,Carousel.EVENTS={selection:"selectionChange",itemClick:"itemClick"},Carousel._handleKeyup=function(t){37==t.keyCode?(this.previous(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)):39==t.keyCode&&(this.next(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index))},Carousel.prototype.setContentLayout=function(t){if(!t)throw"No layout definition given!";return this.layoutDefinition=t,this.layoutController.setLayout(this.layoutDefinition),this},Carousel.prototype.getContentLayout=function(){return this.layoutDefinition},Carousel.prototype.getSelectedIndex=function(){return this._data.index},Carousel.prototype.setSelectedIndex=function(t,e){return t==this._data.index?this._data.index:(this._data.index=this._clamp(t),this._data.paginatedIndex=this._clamp(Math.floor(this._data.index/this._data.itemsPerPage)),e=void 0===e?!0:e,this.layoutController.setIndex(this._data.index,e),this.dots&&this.dots.setIndex(this._data.paginatedIndex),this._data.index)},Carousel.prototype.next=function(){var t=this._data.index+this._data.itemsPerPage;return this.setSelectedIndex(t)},Carousel.prototype.previous=function(){var t=this._data.index-this._data.itemsPerPage;return this.setSelectedIndex(t)},Carousel.prototype.getItems=function(){return this._data.items},Carousel.prototype.setItems=function(t){return this._data.items=t.slice(0),this._data.length=this._data.items.length,this._initItems(),this.layoutController.setItems(this._data.renderables),this},Carousel.prototype.getSize=function(){return this.getParentSize()},Carousel.prototype.setSize=function(){},Carousel.prototype._init=function(){this.setItems(this.options.items),this.setSelectedIndex(this.options.selectedIndex,!1),this._initContent(),this._events(),Timer.after(function(){this._resize(),this.setContentLayout(this.options.contentLayout)}.bind(this),2)},Carousel.prototype._initContent=function(){this._eventContainer=new Surface,this._eventContainer.pipe(this),this.add(new Modifier({opacity:0})).add(this._eventContainer),this.options.arrowsEnabled&&(this.arrows=new Arrows({position:this.options.arrowsPosition,padding:this.options.arrowsPadding,previousIconURL:this.options.arrowsPreviousIconURL,nextIconURL:this.options.arrowsNextIconURL,animateOnClick:this.options.arrowsAnimateOnClick,toggleDisplayOnHover:this.options.arrowsToggleDisplayOnHover}),this.add(this.arrows)),this.options.dotsEnabled&&(this.dots=new Dots({position:this.options.dotsPosition,padding:this.options.dotsPadding,size:this.options.dotsSize,horizontalSpacing:this.options.dotsHorizontalSpacing,length:Math.ceil(this._data.items.length/this._data.itemsPerPage),selectedIndex:this.options.selectedIndex,arrowsToggleDisplayOnHover:this.options.arrowsToggleDisplayOnHover}),this.add(this.dots)),this._sizeModifier=new Modifier({size:this._getCarouselSize(),origin:[.5,.5],align:[.5,.5]}),this.add(this._sizeModifier).add(this.layoutController)},Carousel.prototype._initItems=function(){for(var t=0;t<this._data.items.length;t++){if(this._data.items[t].render)this._data.renderables.push(this._data.items[t]);else{var e=new Slide(this._data.items[t]);this._data.renderables.push(e)}this._data.renderables[t].pipe(this.sync),this._data.renderables[t].on("click",this._addToClickQueue.bind(this,Carousel.EVENTS.itemClick,t))}},Carousel.prototype._events=function(){this._eventInput.on("parentResize",this._resize.bind(this));var t=[];this.options.touchEnabled&&t.push("touch"),this.options.mouseEnabled&&t.push("mouse"),this.sync.addSync(t),this._eventContainer.pipe(this.sync);var e=null;this.sync.on("start",function(){e=new Date}),this.sync.on("end",function(){this.clickLength=new Date-e}.bind(this)),this.options.keyboardEnabled&&(this._handleKeyup=Carousel._handleKeyup.bind(this),Engine.on("keyup",this._handleKeyup)),this.arrows&&(this.arrows.on("previous",function(){this.previous(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.arrows.on("next",function(){this.next(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this))),this.options.arrowsToggleDisplayOnHover&&this.arrows&&(this._eventInput.on("mouseover",this.arrows.show.bind(this.arrows)),this._eventInput.on("mouseout",this.arrows.hide.bind(this.arrows))),this.dots&&this.dots.on("set",function(t){this.setSelectedIndex(t*this._data.itemsPerPage),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.dots&&this.arrows&&(this.dots.on("showArrows",this.arrows.show.bind(this.arrows)),this.dots.on("hideArrows",this.arrows.hide.bind(this.arrows))),this.layoutController.on("paginationChange",this._setItemsPerPage.bind(this)),this.layoutController.on("previous",function(){this.previous(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.layoutController.on("next",function(){this.next(),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this)),this.layoutController.on("set",function(t){this.setSelectedIndex(t),this._eventOutput.emit(Carousel.EVENTS.selection,this._data.index)}.bind(this))},Carousel.prototype._addToClickQueue=function(t,e){this.clickLength<150&&this._eventOutput.emit(t,e)},Carousel.prototype._setItemsPerPage=function(t){this._data.itemsPerPage!==t&&(this._data.itemsPerPage=t,this.dots&&this.dots.setLength(Math.ceil(this._data.items.length/t),t,this._data.index))},Carousel.prototype._resize=function(){var t=this._getCarouselSize();this.layoutController.setSize(t),this._sizeModifier.setSize(t)},Carousel.prototype._getCarouselSize=function(){var t=[],e=this.getSize();return this._isPlugin?(t[0]=e[0]-this.options.contentPadding[0],t[1]=e[1]-this.options.contentPadding[1]):(t[0]="number"==typeof this.options.carouselSize[0]?this.options.carouselSize[0]:parseFloat(this.options.carouselSize[0])/100*e[0],t[1]="number"==typeof this.options.carouselSize[1]?this.options.carouselSize[1]:parseFloat(this.options.carouselSize[1])/100*e[1]),t},Carousel.prototype._clamp=function(t,e){return"undefined"==typeof e&&(e=this.options.loop),t>this._data.length-1?t=e?0:this._data.length-1:0>t&&(t=e?this._data.length-1:0),t},Carousel.SingularSoftScale=LayoutFactory.SingularSoftScale,Carousel.SingularTwist=LayoutFactory.SingularTwist,Carousel.SingularParallax=LayoutFactory.SingularParallax,Carousel.SingularSlideBehind=LayoutFactory.SingularSlideBehind,Carousel.SingularOpacity=LayoutFactory.SingularOpacity,Carousel.SingularSlideIn=LayoutFactory.SingularSlideIn,Carousel.SequentialLayout=LayoutFactory.SequentialLayout,Carousel.GridLayout=LayoutFactory.GridLayout,Carousel.CoverflowLayout=LayoutFactory.CoverflowLayout,Carousel.DEFAULT_OPTIONS={contentLayout:Carousel.SingularSoftScale,carouselSize:["100%","100%"],arrowsEnabled:!0,arrowsPosition:"middle",arrowsPadding:[10,0],arrowsPreviousIconURL:void 0,arrowsNextIconURL:void 0,arrowsAnimateOnClick:!0,arrowsToggleDisplayOnHover:!0,dotsEnabled:!0,dotsPosition:"middle",dotsPadding:[0,-10],dotsSize:[10,10],dotsHorizontalSpacing:10,contentPadding:[0,0],selectedIndex:0,items:[],loop:!0,keyboardEnabled:!0,mouseEnabled:!0,touchEnabled:!0},module.exports=Carousel;
},{"./components/Arrows":"/Users/flipside1300/Node/widget-carousel/src/components/Arrows.js","./components/Dots":"/Users/flipside1300/Node/widget-carousel/src/components/Dots.js","./constructors/SizeAwareView":"/Users/flipside1300/Node/widget-carousel/src/constructors/SizeAwareView.js","./layouts/LayoutController":"/Users/flipside1300/Node/widget-carousel/src/layouts/LayoutController.js","./layouts/LayoutFactory":"/Users/flipside1300/Node/widget-carousel/src/layouts/LayoutFactory.js","./registries/Easing":"/Users/flipside1300/Node/widget-carousel/src/registries/Easing.js","./registries/Physics":"/Users/flipside1300/Node/widget-carousel/src/registries/Physics.js","./slides/Slide":"/Users/flipside1300/Node/widget-carousel/src/slides/Slide.js","famous/core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js","famous/core/Modifier":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Modifier.js","famous/core/RenderNode":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/RenderNode.js","famous/core/Surface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js","famous/inputs/FastClick":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/FastClick.js","famous/inputs/GenericSync":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/GenericSync.js","famous/inputs/MouseSync":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/MouseSync.js","famous/inputs/ScrollSync":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/ScrollSync.js","famous/inputs/TouchSync":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/inputs/TouchSync.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js"}],"/Users/flipside1300/Node/widget-carousel/src/components/Arrows.js":[function(require,module,exports){
function Arrows(){View.apply(this,arguments),this._storage={prev:{surface:null,positionMod:null,animationMod:null,transTransform:null,opacityTrans:null},next:{surface:null,positionMod:null,animationMod:null,transTransform:null,opacityTrans:null}},this._arrowsDisplayed=this.options.toggleDisplayOnHover?!1:!0,this._animationQueue={showCount:0,hideCount:0},this._init()}var View=require("famous/core/View"),Modifier=require("famous/core/Modifier"),ImageSurface=require("famous/surfaces/ImageSurface"),Surface=require("famous/core/Surface"),Transform=require("famous/core/Transform"),Transitionable=require("famous/transitions/Transitionable"),TransitionableTransform=require("famous/transitions/TransitionableTransform"),Timer=require("famous/utilities/Timer");Arrows.prototype=Object.create(View.prototype),Arrows.prototype.constructor=Arrows,Arrows.DEFAULT_OPTIONS={position:"center",padding:[10,0],previousIconURL:void 0,nextIconURL:void 0,animateOnClick:!0,toggleDisplayOnHover:!0},Arrows.POSITION_TO_ALIGN={bottom:1,middle:.5,top:0},Arrows.ANIMATION_OPTIONS={click:{offset:10,transition:{curve:"outBack",duration:250}},display:{curve:"outExpo",duration:600}},Arrows.prototype.show=function(){this._arrowsDisplayed||(this._arrowsDisplayed=!0,this._animationQueue.showCount++,this._queueAnimation("show"))},Arrows.prototype.hide=function(){this._arrowsDisplayed&&(this._arrowsDisplayed=!1,this._animationQueue.hideCount++,this._queueAnimation("hide"))},Arrows.prototype._init=function(){this._initContent(),this._events(this)},Arrows.prototype._initContent=function(){var o=this._defineOptions(this.options.position),t=this._arrowsDisplayed?1:0;for(var r in o){var i=this._storage[r];i.positionMod=new Modifier({origin:[.5,.5],align:[.5,.5],transform:Transform.translate(o[r].translation[0],o[r].translation[1])}),i.transTransform=new TransitionableTransform,i.opacityTrans=new Transitionable(0),i.animationMod=new Modifier({transform:i.transTransform,opacity:i.opacityTrans}),i.surface=new ImageSurface({classes:["famous-carousel-arrow",o[r].className],content:o[r].iconURL,size:[!0,!0],properties:o[r].properties}),this.add(i.positionMod).add(i.animationMod).add(i.surface),Timer.after(function(t,r,i){t.positionMod.setOrigin(o[r].placement),t.positionMod.setAlign(o[r].placement),t.opacityTrans.set(i)}.bind(null,i,r,t),2)}},Arrows.prototype._defineOptions=function(o){var t=this.options.padding,r=2,i=5,n={border:r+"px solid #404040",padding:i+"px",borderRadius:"50%",zIndex:2},e={prev:{className:"famous-carousel-arrow-previous"},next:{className:"famous-carousel-arrow-next"}},s=-r-r;void 0===this.options.previousIconURL?(e.prev.iconURL="/images/icons/arrow_left_dark.svg",e.prev.properties=n):(e.prev.iconURL=this.options.previousIconURL,e.prev.properties={zIndex:2}),void 0===this.options.nextIconURL?(e.next.iconURL="/images/icons/arrow_right_dark.svg",e.next.properties=n,e.next.extraXPadding=s):(e.next.iconURL=this.options.nextIconURL,e.next.properties={zIndex:2},e.next.extraXPadding=0);var a;return a="top"===o?0:"middle"===o?s/2:s,e.prev.placement=[0,Arrows.POSITION_TO_ALIGN[o]],e.prev.translation=[t[0],a-t[1]],e.next.placement=[1,Arrows.POSITION_TO_ALIGN[o]],e.next.translation=[s-t[0],a-t[1]],e},Arrows.prototype._events=function(){var o=this._storage.prev.surface,t=this._storage.next.surface;o.on("click",this._onPrev.bind(this)),t.on("click",this._onNext.bind(this)),this.options.toggleDisplayOnHover&&(o.on("mouseover",this.show.bind(this)),t.on("mouseover",this.show.bind(this)),o.on("mouseout",this.hide.bind(this)),t.on("mouseout",this.hide.bind(this)))},Arrows.prototype._onPrev=function(){this._eventOutput.emit("previous"),this._animateArrow(this._storage.prev.transTransform,-1)},Arrows.prototype._onNext=function(){this._eventOutput.emit("next"),this._animateArrow(this._storage.next.transTransform,1)},Arrows.prototype._animateArrow=function(o,t){if(this.options.animateOnClick){var r=Arrows.ANIMATION_OPTIONS.click;o.halt(),o.set(Transform.translate(r.offset*t,0),{duration:1},function(){o.set(Transform.identity,r.transition)})}},Arrows.prototype._queueAnimation=function(){var o=this._animationQueue;Timer.setTimeout(function(){for(;o.showCount>0&&o.hideCount>0;)o.showCount--,o.hideCount--;o.showCount>0?(o.showCount--,this._showOrHide("show")):o.hideCount>0&&(o.hideCount--,this._showOrHide("hide"))}.bind(this),25)},Arrows.prototype._showOrHide=function(o){var t,r,i,n=Arrows.ANIMATION_OPTIONS.display,e=n.duration,s=1.2;"show"===o?(t=1,r=1,i=0):(t=0,r=.001,i=e/2);var a=this._storage.prev.opacityTrans,u=this._storage.next.opacityTrans,p=this._storage.prev.transTransform,c=this._storage.next.transTransform;a.halt(),u.halt(),p.halt(),c.halt(),a.delay(i,function(){a.set(t,{duration:e/2,curve:"outBack"}),u.set(t,{duration:e/2,curve:"outBack"})}),p.set(Transform.scale(s,s),{duration:1*e/4,curve:n.curve},function(){p.set(Transform.scale(r,r),{duration:3*e/4,curve:n.curve})}),c.set(Transform.scale(s,s),{duration:1*e/4,curve:n.curve},function(){c.set(Transform.scale(r,r),{duration:3*e/4,curve:n.curve})})},module.exports=Arrows;
},{"famous/core/Modifier":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Modifier.js","famous/core/Surface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/core/View":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/View.js","famous/surfaces/ImageSurface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/surfaces/ImageSurface.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js","famous/transitions/TransitionableTransform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TransitionableTransform.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js"}],"/Users/flipside1300/Node/widget-carousel/src/components/Dots.js":[function(require,module,exports){
function Dots(){SizeAwareView.apply(this,arguments),this._data={dots:[],parentSize:[],dotCount:this.options.length,layoutModel:[],selectedIndex:this.options.selectedIndex},this.layout=new SequentialLayout({defaultItemSize:this.options.size}),this.positionMod=new Modifier,this.animationMod=new Modifier,this.opacityTrans=new Transitionable(1),this.transTransform=new TransitionableTransform,this.displayed=!0,EventHelpers.when(function(){return 0!==this.getParentSize().length}.bind(this),this._init.bind(this))}var SizeAwareView=require("../constructors/SizeAwareView"),Surface=require("famous/core/Surface"),Modifier=require("famous/core/Modifier"),RenderNode=require("famous/core/RenderNode"),Transform=require("famous/core/Transform"),Transitionable=require("famous/transitions/Transitionable"),TransitionableTransform=require("famous/transitions/TransitionableTransform"),SequentialLayout=require("famous/views/SequentialLayout"),Timer=require("famous/utilities/Timer"),EventHelpers=require("../events/EventHelpers");Dots.prototype=Object.create(SizeAwareView.prototype),Dots.prototype.constructor=Dots,Dots.DEFAULT_OPTIONS={position:"center",padding:[0,-10],size:[10,10],horizontalSpacing:10,length:1,selectedIndex:0},Dots.POSITION_TO_ALIGN={left:0,middle:.5,right:1},Dots.ANIMATION_OPTIONS={click:{offset:-7,transition:{curve:"outExpo",duration:250}},display:{scaleUp:1.15,duration:600,curve:"outExpo"}},Dots.prototype.setIndex=function(t){if(t!==this._data.selectedIndex&&!(t>=this._data.dots.length||0>t)){var e=this._data.selectedIndex;this._data.dots[e].surface.removeClass("famous-carousel-dot-selected"),this._data.dots[t].surface.addClass("famous-carousel-dot-selected"),this._data.selectedIndex=t}},Dots.prototype.show=function(t){if(!this.displayed){this.opacityTrans.halt(),this.transTransform.halt(),this.displayed=!0;var e=Dots.ANIMATION_OPTIONS.display;this.opacityTrans.set(1,{duration:100,curve:"inExpo"}),this.transTransform.set(Transform.identity),this.transTransform.set(Transform.scale(e.scaleUp,e.scaleUp),{duration:1*e.duration/3,curve:"outExpo"},function(){this.transTransform.set(Transform.identity,{duration:2*e.duration/3,curve:e.curve},t)}.bind(this))}},Dots.prototype.hide=function(t){if(this.displayed){this.opacityTrans.halt(),this.transTransform.halt(),this.displayed=!1;var e=Dots.ANIMATION_OPTIONS.display;this.opacityTrans.set(1,{duration:e.duration,curve:e.curve}),this.transTransform.set(Transform.scale(e.scaleUp,e.scaleUp),{duration:.25*e.duration,curve:"outExpo"},function(){this.transTransform.set(Transform.scale(1e-4,1e-4),{duration:.75*e.duration,curve:e.curve},t)}.bind(this))}},Dots.prototype.setLength=function(t,e,i){this._data.dotCount=t,this._data.selectedIndex=Math.floor(this._data.selectedIndex/e),this.hide(function(){this._init(),this.setIndex(i),Timer.after(this.show.bind(this),1)}.bind(this))},Dots.prototype._init=function(){this._data.parentSize=this.getParentSize(),this._initContent(),this._createLayout()},Dots.prototype._initContent=function(){this._data.dots=[];for(var t=0;t<this._data.dotCount;t++)this._data.dots.push(this._createNode(t))},Dots.prototype._createNode=function(t){var e={};return e.index=t,e.surface=new Surface({classes:["famous-carousel-dot"],size:this.options.size,properties:{zIndex:2}}),t===this._data.selectedIndex&&e.surface.addClass("famous-carousel-dot-selected"),e.surface.on("click",this._changeIndex.bind(this,e)),this.options.toggleArrowsDisplayOnHover&&(e.surface.on("mouseover",this._eventOutput.emit.bind(this._eventOutput,"showArrows")),e.surface.on("mouseout",this._eventOutput.emit.bind(this._eventOutput,"hideArrows"))),e.transTransform=new TransitionableTransform,e.modifier=new Modifier({transform:e.transTransform}),e.renderNode=new RenderNode,e.renderNode.add(e.modifier).add(e.surface),e},Dots.prototype._createLayout=function(){var t=this._createLayoutModel();1===t.length?(this.layout.setOptions({direction:0,itemSpacing:this.options.horizontalSpacing}),this.layout.sequenceFrom(t[0])):this._createNestedLayout(),this._addLayout()},Dots.prototype._createNestedLayout=function(){var t=[],e=this.options.horizontalSpacing;this.layout.setOptions({direction:1,itemSpacing:e}),this.layout.sequenceFrom(t);for(var i,s=this._data.layoutModel,o=0;o<s.length;o++)if(i=new SequentialLayout({direction:0,itemSpacing:e,defaultItemSize:this.options.size}),i.sequenceFrom(s[o]),o===s.length-1&&s.length>1){var a=new RenderNode;a.add(new Modifier({origin:[Dots.POSITION_TO_ALIGN[this.options.position],0]})).add(i),t.push(a)}else t.push(i)},Dots.prototype._addLayout=function(){var t=Dots.POSITION_TO_ALIGN[this.options.position];this.positionMod.setOrigin([t,1]),this.positionMod.setAlign([t,1]),this.positionMod.setTransform(Transform.translate(this.options.padding[0],this.options.padding[1])),this.animationMod.setOpacity(this.opacityTrans),this.animationMod.setTransform(this.transTransform),this.add(this.positionMod).add(this.animationMod).add(this.layout)},Dots.prototype._createLayoutModel=function(){var t=this._data.parentSize[0],e=[];e.push([]);for(var i=0,s=0,o=this.options.size[0]+this.options.horizontalSpacing,a=this._data.dots,n=0;n<a.length;n++)s+o>t&&(i++,s=0,e.push([])),s+=o,e[i].push(a[n].renderNode);return this._data.layoutModel=e,e},Dots.prototype._changeIndex=function(t){this._eventOutput.emit("set",t.index),this._animateDot(t.transTransform)},Dots.prototype._animateDot=function(t){var e=Dots.ANIMATION_OPTIONS.click;t.set(Transform.translate(0,e.offset),{duration:1},function(){t.set(Transform.identity,e.transition)})},module.exports=Dots;
},{"../constructors/SizeAwareView":"/Users/flipside1300/Node/widget-carousel/src/constructors/SizeAwareView.js","../events/EventHelpers":"/Users/flipside1300/Node/widget-carousel/src/events/EventHelpers.js","famous/core/Modifier":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Modifier.js","famous/core/RenderNode":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/RenderNode.js","famous/core/Surface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js","famous/transitions/TransitionableTransform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TransitionableTransform.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js","famous/views/SequentialLayout":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/views/SequentialLayout.js"}],"/Users/flipside1300/Node/widget-carousel/src/constructors/SizeAwareView.js":[function(require,module,exports){
function SizeAwareView(){View.apply(this,arguments),this.__id=Entity.register(this),this.__parentSize=[]}var View=require("famous/core/View"),Entity=require("famous/core/Entity"),Transform=require("famous/core/Transform");SizeAwareView.prototype=Object.create(View.prototype),SizeAwareView.prototype.constructor=SizeAwareView,SizeAwareView.prototype.commit=function(e){var i=e.transform,t=e.opacity,r=e.origin;return this.__parentSize&&this.__parentSize[0]===e.size[0]&&this.__parentSize[1]===e.size[1]||(this.__parentSize[0]=e.size[0],this.__parentSize[1]=e.size[1],this._eventInput.emit("parentResize",this.__parentSize)),this.__parentSize&&(i=Transform.moveThen([-this.__parentSize[0]*r[0],-this.__parentSize[1]*r[1],0],i)),{transform:i,opacity:t,size:this.__parentSize,target:this._node.render()}},SizeAwareView.prototype.getParentSize=function(){return this.__parentSize},SizeAwareView.prototype.render=function(){return this.__id},module.exports=SizeAwareView;
},{"famous/core/Entity":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Entity.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/core/View":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/View.js"}],"/Users/flipside1300/Node/widget-carousel/src/dom/ClassToImages.js":[function(require,module,exports){
function nodeChildrenToArray(e){return Array.prototype.slice.call(e.children?e.children:e.childNodes)}function removeItemsFromDom(e){for(var r=document.createDocumentFragment();e.firstElementChild;)r.appendChild(e.removeChild(e.firstElementChild));return r}module.exports=function(e){var r=document.querySelector(e);if(!r)throw"no items found!";var o=removeItemsFromDom(r);return nodeChildrenToArray(o)};
},{}],"/Users/flipside1300/Node/widget-carousel/src/dom/IE.js":[function(require,module,exports){
module.exports=-1!==navigator.userAgent.indexOf("MSIE")||navigator.appVersion.indexOf("Trident/")>0;
},{}],"/Users/flipside1300/Node/widget-carousel/src/events/EventHelpers.js":[function(require,module,exports){
function when(e,r,n){n||(n=1),e instanceof Array||(e=[e]);var i=Timer.every(function(){for(var n=0;n<e.length;n++)if(!e[n]())return;r(),Timer.clear(i)},n)}function dualPipe(e,r){e.pipe(r),r.pipe(e)}function clear(e){Engine.removeListener("prerender",e)}function frameQueue(e,r){var n=r,i=function(){r--,0>=r&&(e(),clear(i))};return Engine.on("prerender",i),function(){r=n}}var Timer=require("famous/utilities/Timer"),Engine=require("famous/core/Engine");module.exports={when:when,dualPipe:dualPipe,frameQueue:frameQueue};
},{"famous/core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js"}],"/Users/flipside1300/Node/widget-carousel/src/helpers/ObjectHelpers.js":[function(require,module,exports){
function extend(e,t){for(var r in t)e[r]=t[r]}function inherits(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e}function merge(e,t){var r={};return extend(r,e),extend(r,t),r}module.exports={extend:extend,inherits:inherits,merge:merge};
},{}],"/Users/flipside1300/Node/widget-carousel/src/layouts/CoverflowLayout.js":[function(require,module,exports){
function CoverflowLayout(t){Layout.call(this,t),this._touchOffset=0,this._offsetT=0,this.boundTouchStart=this._onSyncStart.bind(this),this.boundTouchUpdate=this._onSyncUpdate.bind(this),this.boundTouchEnd=this._onSyncEnd.bind(this),this.step}var Layout=require("./Layout"),ObjectHelpers=require("../helpers/ObjectHelpers"),Transform=require("famous/core/Transform"),Transitionable=require("famous/transitions/Transitionable"),IsIE=require("../dom/IE");CoverflowLayout.prototype=Object.create(Layout.prototype),CoverflowLayout.prototype.constructor=CoverflowLayout,CoverflowLayout.id="CoverflowLayout",CoverflowLayout.DEFAULT_OPTIONS={transition:{curve:"outExpo",duration:1e3},radiusPercent:.5,dimension1:"x",dimension2:"z"};var DIRECTION={x:0,y:1,z:2},UNUSED_DIRECTION={1:"z",2:"y",3:"x"};CoverflowLayout.prototype.activate=function(){this._bindSyncEvents(),this.resetChildProperties(),this.layout()},CoverflowLayout.prototype._getRadius=function(t){return t||(t=this.controller.getSize()[0]),t*this.options.radiusPercent},CoverflowLayout.prototype.layout=function(t){var o=this.controller.getSize(),e=this.controller.items[this.controller.index].getSize(),i=this.controller.nodes.length;this.step=2*Math.PI/i;var r=this._getParametricCircle({x1:.5*o[0],y1:o[0]*-.5,radius:this._getRadius(o[0])}),n=[.5*(o[0]-e[0]),.5*(o[1]-e[1]),0],s=[];if(s[0]="x"===this.options.dimension1||"x"===this.options.dimension2?0:n[0],s[1]="y"===this.options.dimension1||"y"===this.options.dimension2?0:n[1],s[2]=0,IsIE)var a=[];for(var h=0;i>h;h++){var l=this.controller._sanitizeIndex(this.controller.index+h),c=this.data.parentTransforms[l],u=(this.data.opacities[l],r(this.step*h+.5*Math.PI+this._touchOffset)),d=s.slice();d[DIRECTION[this.options.dimension1]]+=o[0]-u[0]-.5*e[0],d[DIRECTION[this.options.dimension2]]+=u[1],IsIE&&a.push(d[2]),t?c.set(Transform.translate(d[0],d[1],d[2])):c.set(Transform.translate(d[0],d[1],d[2]),this.options.transition)}IsIE&&!t&&this.forceZIndex(a),c.set(Transform.translate(d[0],d[1],d[2]),this.options.transition);var p=this.options.transition.duration||this.options.transition.period;p*=.5;for(var f=t?void 0:{curve:"linear",duration:p},h=0;h<this.controller.renderLimit[0];h++){var y=this.data.opacities[this.controller._sanitizeIndex(this.controller.index+1+h)];y&&(y.halt(),y.set(1-h/this.controller.renderLimit[0],f))}for(var h=0;h<this.controller.renderLimit[1];h++){var y=this.data.opacities[this.controller._sanitizeIndex(this.controller.index-1-h)];y&&(y.halt(),y.set(1-h/this.controller.renderLimit[1],f))}this.data.opacities[this.controller.index].halt(),this.data.opacities[this.controller.index].set(1,f)},CoverflowLayout.prototype.deactivate=function(){if(this.controller.isLastLayoutSingular=!1,IsIE)for(var t=0;t<this.controller.nodes.length;t++)this.controller.items[t].setProperties({zIndex:""});this._unbindSyncEvents()},CoverflowLayout.prototype.getRenderLimit=function(){return[Math.min(10,Math.ceil(.5*this.controller.nodes.length)),Math.min(10,Math.ceil(.5*this.controller.nodes.length))]},CoverflowLayout.prototype.forceZIndex=function(t){for(var o=0;o<this.controller.nodes.length;o++){var e=this.controller._sanitizeIndex(this.controller.index+o);this.controller.items[e].setProperties({zIndex:Math.round(t[o])})}},CoverflowLayout.prototype._bindSyncEvents=function(){this.controller.sync.on("start",this.boundTouchStart),this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},CoverflowLayout.prototype._unbindSyncEvents=function(){this.controller.sync.removeListener("start",this.boundTouchStart),this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},CoverflowLayout.prototype._onSyncStart=function(t){this._offsetT=Math.acos(t.position[0]/this._getRadius())},CoverflowLayout.prototype._onSyncUpdate=function(t){for(var o=t.position[0]/this._getRadius();o>1;)o-=2;for(;-1>o;)o+=2;var e=Math.acos(o);this._touchOffset=this._offsetT-e,this.layout(!0)},CoverflowLayout.prototype._onSyncEnd=function(t){var o=.1*t.velocity[0],e=Math.round((-this._touchOffset-o)/this.step);this._touchOffset=0,this.controller._eventOutput.emit("set",this.controller._sanitizeIndex(this.controller.index+e))},CoverflowLayout.prototype._getParametricCircle=function(t){var o={x1:0,y1:0,radius:20};return ObjectHelpers.extend(o,t),function(t){return[o.x1+o.radius*Math.cos(t),o.y1+o.radius*Math.sin(t)]}},module.exports=CoverflowLayout;
},{"../dom/IE":"/Users/flipside1300/Node/widget-carousel/src/dom/IE.js","../helpers/ObjectHelpers":"/Users/flipside1300/Node/widget-carousel/src/helpers/ObjectHelpers.js","./Layout":"/Users/flipside1300/Node/widget-carousel/src/layouts/Layout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/GridLayout.js":[function(require,module,exports){
function GridLayout(t){Layout.call(this,t)}var Layout=require("./Layout"),Transform=require("famous/core/Transform"),Easing=require("famous/transitions/Easing");GridLayout.prototype=Object.create(Layout.prototype),GridLayout.prototype.constructor=GridLayout,GridLayout.id="GridLayout",GridLayout.DEFAULT_OPTIONS={gridDimensions:[3,3],padding:[15,15],selectedItemTransition:{method:"spring",dampingRatio:.65,period:600},transition:{curve:"outExpo",duration:800},delayLength:600},GridLayout.prototype.activate=function(){this.controller._eventOutput.emit("paginationChange",this.options.gridDimensions[0]*this.options.gridDimensions[1]),this.resetChildProperties();var t=this.options.gridDimensions[0]*this.options.gridDimensions[1],o=Math.ceil(this.controller.nodes.length/t),i=Math.floor(this.controller.index/t),e=i*t,n=i===o-1?e+(this.controller.nodes.length-i*t)-1:e+t-1;this._delayTransitions(e,n),this._animateItems(e,n),this._handleTouchEvents()},GridLayout.prototype.layout=function(){for(var t,o=this._getTransforms(),i=0;i<this.controller.nodes.length;i++)t=this.data.parentTransforms[i],t.set(o[i].transform,this.options.transition),this.data.opacities[i].halt(),this.data.opacities[i].set(1,this.options.transition)},GridLayout.prototype.deactivate=function(){this.controller.isLastLayoutSingular=!1,this.controller._eventOutput.emit("paginationChange",this.controller.itemsPerPage),this._removeTouchEvents()},GridLayout.prototype.getRenderLimit=function(){return[0,this.controller.nodes.length]},GridLayout.prototype._handleTouchEvents=function(){this.boundTouchUpdate=function(t){var o=this.data.touchOffset,i=o.get();i[0]+=t.delta[0],o.set([i[0],i[1]])}.bind(this),this.boundTouchEnd=function(){for(var t=this.data.touchOffset,o=t.get(),i=o[0],e=this.controller.getSize()[0],n=0;n<this.controller.items.length;n++){var s=this.data.parentTransforms[n],r=s.translate.get();s.setTranslate([r[0]+o[0],r[1]])}t.set([0,0]),-1*e/5>i?this.controller._eventOutput.emit("next"):i>1*e/5?this.controller._eventOutput.emit("previous"):this.layout()}.bind(this),this._addTouchEvents()},GridLayout.prototype._addTouchEvents=function(){this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},GridLayout.prototype._removeTouchEvents=function(){this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},GridLayout.prototype._delayTransitions=function(t,o){for(var i,e=this.controller.index,n=this.controller.index-1<t?void 0:this.controller.index-1,s=0,r=o-t+1;r>s;){var a=s/(r-1),h=Easing.inOutSine(a);i=h*this.options.delayLength+1,void 0!==e&&(this._setItemDelay(e,i),e=e+1>o?void 0:e+1,s++),void 0!==n&&(this._setItemDelay(n,i),n=t>n-1?void 0:n-1,s++)}},GridLayout.prototype._setItemDelay=function(t,o){trans=this.data.parentTransforms[t],trans.rotate.delay(o),trans.scale.delay(o),trans.translate.delay(o),this.data.opacities[t].delay(o)},GridLayout.prototype._animateItems=function(t,o){for(var i=function(i){return i>=t&&o>=i},e=this._getTransforms(),n=0;n<this.controller.nodes.length;n++){if(i(n))if(n===this.controller.index){var s=this.options.selectedItemTransition.method||"spring",r=this.options.selectedItemTransition.dampingRatio||.65,a=this.options.selectedItemTransition.period||600;this.data.parentTransforms[n].set(e[n].transform,{method:s,dampingRatio:r,period:a})}else this.data.parentTransforms[n].set(e[n].transform,this.options.transition);else this.controller.isLastLayoutSingular||null===this.controller.isLastLayoutSingular?this.data.parentTransforms[n].set(e[n].transform):this.data.parentTransforms[n].set(e[n].transform,this.options.transition);this.data.opacities[n].set(1,this.options.transition)}},GridLayout.prototype._getTransforms=function(){for(var t=this._getGridPositions(this.controller.getSize().slice(0),this.options.padding,this.options.gridDimensions),o=t.cellSize,i=this.controller.getSize().slice(0),e=this.options.gridDimensions[0]*this.options.gridDimensions[1],n=Math.floor(this.controller.index/e),s=[],r=0;r<this.controller.nodes.length;r++){var a=t.at(r);a[0]-=n*i[0]+n*this.options.padding[0],a[2]=1;var h=this.data.sizeCache[r]||this.data.sizeCache[0],d=Math.min(o[0]/h[0],o[1]/h[1]),l=[.5*Math.round(o[0]-h[0]*d),.5*Math.round(o[1]-h[1]*d)];s.push({transform:Transform.thenMove(Transform.scale(d,d),[a[0]+l[0],a[1]+l[1]]),gridPos:a,maxScale:d})}return s},GridLayout.prototype._getGridPositions=function(t,o,i){var e=[(t[0]-o[0]*Math.max(i[0]-1,0))/i[0],(t[1]-o[1]*Math.max(i[1]-1,0))/i[1]],n=i[0]*i[1];return{at:function(s){var r=Math.floor(s/n),a=s%i[0],h=Math.floor((s-r*n)/i[0]);return[a*e[0]+a*o[0]+r*t[0]+r*o[0],h*e[1]+h*o[1]]},cellSize:e}},module.exports=GridLayout;
},{"./Layout":"/Users/flipside1300/Node/widget-carousel/src/layouts/Layout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/transitions/Easing":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Easing.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/Layout.js":[function(require,module,exports){
function Layout(t){var o=Utility.clone(this.constructor.DEFAULT_OPTIONS||{});return this.options=ObjectHelpers.merge(o,t),this.id=this.constructor.id,this.controller=null,this.data=null,this}var ObjectHelpers=require("../helpers/ObjectHelpers"),Transform=require("famous/core/Transform"),Utility=require("famous/utilities/Utility");Layout.prototype.setController=function(t){this.controller=t,this.data=t.data},Layout.prototype.resetChildProperties=function(){for(var t=this.options.transition.duration||this.options.transition.period||200,o=0;o<this.controller.nodes.length;o++)this.data.childTransforms[o].set(Transform.identity,{curve:"outExpo",duration:t}),this.data.childOrigins[o].set([0,0]),this.data.childAligns[o].set([0,0])},Layout.prototype.getRenderLimit=function(){},Layout.prototype.activate=function(){},Layout.prototype.layout=function(){},Layout.prototype.deactivate=function(){},module.exports=Layout;
},{"../helpers/ObjectHelpers":"/Users/flipside1300/Node/widget-carousel/src/helpers/ObjectHelpers.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/LayoutController.js":[function(require,module,exports){
function LayoutController(t){SizeAwareView.apply(this,arguments),this.items,this.container,this.index,this.lastIndex,this._activeLayout,this.itemsPerPage=t.itemsPerPage,this.renderLimit=[1,4],this.isLastLayoutSingular=null,this.nodes=[],this.data={opacities:[],parentTransforms:[],parentOrigins:[],parentAligns:[],parentSizes:[],childTransforms:[],childOrigins:[],childAligns:[],touchOffset:new Transitionable([0,0]),sizeCache:[],sizeCacheFull:!1},this._boundLayout=this.layout.bind(this),this._boundActivate=this._activate.bind(this),this.sync=t.sync,this._init()}var Timer=require("famous/utilities/Timer"),Engine=require("famous/core/Engine"),Transform=require("famous/core/Transform"),RenderNode=require("famous/core/RenderNode"),Modifier=require("famous/core/Modifier"),ContainerSurface=require("famous/surfaces/ContainerSurface"),TransitionableTransform=require("famous/transitions/TransitionableTransform"),Transitionable=require("famous/transitions/Transitionable"),LayoutFactory=require("./LayoutFactory"),SizeAwareView=require("../constructors/SizeAwareView"),EventHelpers=require("../events/EventHelpers");LayoutController.prototype=Object.create(SizeAwareView.prototype),LayoutController.prototype.constructor=LayoutController,LayoutController.DEFAULT_OPTIONS={classes:[],loop:void 0,properties:{overflow:"hidden",zIndex:1},perspective:1e3},LayoutController.prototype.setSize=function(t){this.container.setSize(t)},LayoutController.prototype.getSize=function(){return this.container.getSize()},LayoutController.prototype.setItems=function(t){this.items=t,this._reset(),this._createItems(),this.data.sizeCache=new Array(t.length),this.data.sizeCacheFull=!1},LayoutController.prototype.setIndex=function(t,e){this.lastIndex=this.index,this.index=t,this._updateRenderedIndices(),e&&this._safeLayout()},LayoutController.prototype.getLength=function(){return Math.min(this.index+this.renderLimit[0]+this.renderLimit[1],this.nodes.length)},LayoutController.prototype.setRenderLimit=function(t){this.renderLimit=!t instanceof Array?[0,t]:t,this._updateRenderedIndices()},LayoutController.prototype.getLayout=function(){return this._activeLayout},LayoutController.prototype.layout=function(){this._layoutQueue=void 0,this._updateSizeCache(),this.halt(),this._activeLayout&&this._activeLayout.layout()},LayoutController.prototype.setLayout=function(t){t instanceof Function&&(t=new t({})),this._activeLayout&&this._activeLayout.deactivate(),this._activeLayout=t,this._activeLayout.setController(this);var e=this._activeLayout.getRenderLimit();e?this.setRenderLimit(e):this._updateRenderedIndices(),this._safeActivate()},LayoutController.prototype.halt=function(){for(var t=0;t<this.nodes.length;t++)this.data.childOrigins[t].halt(),this.data.childAligns[t].halt(),this.data.childTransforms[t].halt(),this.data.parentOrigins[t].halt(),this.data.parentAligns[t].halt(),this.data.parentTransforms[t].halt(),this.data.opacities[t].halt()},LayoutController.prototype._init=function(){this._createContainer()},LayoutController.prototype._safeLayout=function(){this._layoutQueue?this._layoutQueue():this._layoutQueue=EventHelpers.frameQueue(this._boundLayout,4)},LayoutController.prototype._safeActivate=function(){this._activateQueue?this._activateQueue():this._activateQueue=EventHelpers.frameQueue(this._boundActivate,4)},LayoutController.prototype._activate=function(){this._activateQueue=void 0,this._updateSizeCache(),this.halt(),this._activeLayout.activate()},LayoutController.prototype._updateRenderedIndices=function(){var t=this._previousRender?this._previousRender:[];this.futureIndices=this._calculateFutureIndices(),this._toRender=[];for(var e=0;e<t.length;e++)this._toRender.push(t[e]);for(var e=0;e<this.futureIndices.length;e++)this._toRender.indexOf(this.futureIndices[e])<0&&this._toRender.push(this.futureIndices[e]);this._previousRender=this.futureIndices,this._toRender.sort(function(t,e){return t-e})},LayoutController.prototype._calculateFutureIndices=function(){for(var t=[],e=this.nodes.length,i=0,r=this.renderLimit[0]+this.renderLimit[1],n=0;r>n&&n!=e;n++){var a=this.index-this.renderLimit[0]+n;if(0>a){var o=a%e;if(o=0==o?o:o+e,o==e)continue;t.push(o),i=o>i?o:i}else(0==i||i>a)&&t.push(a%e)}return t},LayoutController.prototype._createContainer=function(){this.container=new ContainerSurface({classes:this.options.classes,properties:this.options.properties}),this.container.context.setPerspective(this.options.perspective);var t=new RenderNode;t.render=this._innerRender.bind(this),this.add(this.container),this.container.add(t)},LayoutController.prototype._connectContainer=function(t){this.container.pipe(t),this.container.pipe(t.sync)},LayoutController.prototype._createItems=function(){for(var t=0;t<this.items.length;t++){var e=this.items[t],i=new Transitionable(1),r=new TransitionableTransform,n=new Transitionable([0,0]),a=new Transitionable([0,0]),o=new Transitionable([void 0,void 0]),s=new TransitionableTransform,h=new Transitionable([0,0]),u=new Transitionable([0,0]),l=new Modifier({transform:r,origin:n,align:a,opacity:i,size:o}),d=new Modifier({transform:s,origin:h,align:u}),c=new Modifier({transform:function(){var t=this.data.touchOffset.get();return Transform.translate(t[0],t[1])}.bind(this)}),p=new RenderNode;p.getSize=e.getSize.bind(e),p.add(c).add(l).add(d).add(e),this.nodes.push(p),this.data.parentTransforms.push(r),this.data.opacities.push(i),this.data.parentOrigins.push(n),this.data.parentAligns.push(a),this.data.parentSizes.push(o),this.data.childTransforms.push(s),this.data.childOrigins.push(h),this.data.childAligns.push(u)}},LayoutController.prototype._reset=function(){this.nodes=[],this.data.parentTransforms=[],this.data.opacities=[],this.data.parentOrigins=[],this.data.parentAligns=[],this.data.parentSizes=[],this.data.childTransforms=[],this.data.childOrigins=[],this.data.childAligns=[],this.data.sizeCache=[],this.data.sizeCacheFull=!1},LayoutController.prototype._sanitizeIndex=function(t){var e=this.nodes.length;return 0>t?t%e+e:t>e-1?t%e:t},LayoutController.prototype._updateSizeCache=function(){if(!this.data.sizeCacheFull){for(var t,e=this.data.sizeCache,i=0,r=0;r<e.length;r++)void 0===e[r]?(t=this.items[r].getSize(),null!==t&&0!=t[0]&&0!=t[1]&&(e[r]=t,this.data.parentSizes[r].set(t),this._eventInput.emit("initialSize",r),i++)):i++;i===e.length&&(this.data.sizeCacheFull=!0)}},LayoutController.prototype._innerRender=function(){for(var t=[],e=0;e<this._toRender.length;e++)t[e]=this.nodes[this._toRender[e]].render();return t},module.exports=LayoutController;
},{"../constructors/SizeAwareView":"/Users/flipside1300/Node/widget-carousel/src/constructors/SizeAwareView.js","../events/EventHelpers":"/Users/flipside1300/Node/widget-carousel/src/events/EventHelpers.js","./LayoutFactory":"/Users/flipside1300/Node/widget-carousel/src/layouts/LayoutFactory.js","famous/core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js","famous/core/Modifier":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Modifier.js","famous/core/RenderNode":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/RenderNode.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/surfaces/ContainerSurface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/surfaces/ContainerSurface.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js","famous/transitions/TransitionableTransform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TransitionableTransform.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/LayoutFactory.js":[function(require,module,exports){
var SingularSoftScale=require("./SingularSoftScale"),SingularTwist=require("./SingularTwist"),SingularSlideBehind=require("./SingularSlideBehind"),SingularParallax=require("./SingularParallax"),SingularOpacity=require("./SingularOpacity"),SingularSlideIn=require("./SingularSlideIn"),GridLayout=require("./GridLayout"),CoverflowLayout=require("./CoverflowLayout"),SequentialLayout=require("./SequentialLayout"),LayoutFactory={};LayoutFactory.wrap=function(a){function r(r){return r instanceof a?r:new a(r)}return r.id=a.id,r},LayoutFactory.SingularSoftScale=LayoutFactory.wrap(SingularSoftScale),LayoutFactory.SingularTwist=LayoutFactory.wrap(SingularTwist),LayoutFactory.SingularSlideBehind=LayoutFactory.wrap(SingularSlideBehind),LayoutFactory.SingularParallax=LayoutFactory.wrap(SingularParallax),LayoutFactory.SingularOpacity=LayoutFactory.wrap(SingularOpacity),LayoutFactory.SingularSlideIn=LayoutFactory.wrap(SingularSlideIn),LayoutFactory.GridLayout=LayoutFactory.wrap(GridLayout),LayoutFactory.CoverflowLayout=LayoutFactory.wrap(CoverflowLayout),LayoutFactory.SequentialLayout=LayoutFactory.wrap(SequentialLayout),module.exports=LayoutFactory;
},{"./CoverflowLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/CoverflowLayout.js","./GridLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/GridLayout.js","./SequentialLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SequentialLayout.js","./SingularOpacity":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularOpacity.js","./SingularParallax":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularParallax.js","./SingularSlideBehind":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularSlideBehind.js","./SingularSlideIn":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularSlideIn.js","./SingularSoftScale":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularSoftScale.js","./SingularTwist":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularTwist.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SequentialLayout.js":[function(require,module,exports){
function SequentialLayout(t){Layout.call(this,t),this.applyPreAnimationOffset=[],this.useTouchEndTransition=!1}var Layout=require("./Layout"),Transform=require("famous/core/Transform"),Easing=require("famous/transitions/Easing");SequentialLayout.prototype=Object.create(Layout.prototype),SequentialLayout.prototype.constructor=SequentialLayout,SequentialLayout.id="SequentialLayout",SequentialLayout.DEFAULT_OPTIONS={transition:{duration:800,curve:"outExpo"},touchEndTransition:{method:"snap",period:200},padding:[10,0],direction:"x"},SequentialLayout.prototype.activate=function(){this.resetChildProperties();for(var t=0;t<this.controller.nodes.length;t++)this.data.opacities[t].set(1,this.options.transition);this.containerSize=this.controller.getSize(),this.layout(),this._handleTouchEvents()},SequentialLayout.prototype.layout=function(){for(var t,e,i="y"===this.options.direction?1:0,o=1===i?0:1,n=this.controller.index,s=this.controller.nodes.length-1,a=[],r=[0,0],h=1;h<=this.controller.renderLimit[0];h++)t=this.controller._sanitizeIndex(n-h),e=this._getCenteredPosition(t,o),r[o]=e[o],r[i]-=this.data.sizeCache[t][i]+this.options.padding[i],a[t]=Transform.translate(r[0],r[1]);for(var u=[0,0],h=0;h<this.controller.renderLimit[1]&&(t=this.controller._sanitizeIndex(n+h),e=this._getCenteredPosition(t,o),this.controller.options.loop===!0||t>=n);h++)a[t]=this._getTransform(t,u,o),u[i]+=this.data.sizeCache[t][i]+this.options.padding[i];var c=0;if(!this.controller.options.loop&&a[s]&&this.data.sizeCache[s]){var l=0===i?a[s][12]:a[s][13];if(l>=0){var d=l+this.data.sizeCache[t][i];d<this.containerSize[i]&&(c=this.containerSize[i]-d)}}var p=this.options.transition;this.useTouchEndTransition&&(p=this.options.touchEndTransition,this.useTouchEndTransition=!1);for(var h=0;h<this.controller.nodes.length;h++)if(a[h]){if(this.applyPreAnimationOffset[h]){var f=0===i?a[h][12]:a[h][13],y=0>f?-1:1;e=this._getCenteredPosition(h,o);var T=[];T[i]=this.containerSize[i]*y,T[o]=e[o],this.data.parentTransforms[h].set(Transform.translate(T[0],T[1])),this.applyPreAnimationOffset[h]=!1}0===i?a[h][12]+=c:a[h][13]+=c,this.data.parentTransforms[h].set(a[h],p),this.data.opacities[h].set(1,p)}else this.data.parentTransforms[h].set(Transform.translate(this.containerSize[0],this.containerSize[1])),this.data.opacities[h].set(0),this.applyPreAnimationOffset[h]=!0},SequentialLayout.prototype.deactivate=function(){this.isLastLayoutSingular=!1,this._removeTouchEvents()},SequentialLayout.prototype.getRenderLimit=function(){return[5,Math.min(10,this.controller.nodes.length)]},SequentialLayout.prototype._handleTouchEvents=function(){var t="y"===this.options.direction?1:0;this.boundTouchUpdate=function(e){var i=this.data.touchOffset,o=i.get();o[t]+=e.delta[t],i.set([o[0],o[1]])}.bind(this),this.boundTouchEnd=function(){for(var e=this.data.touchOffset,i=e.get(),o=i[t],n=0;n<this.controller.items.length;n++){var s=this.data.parentTransforms[n],a=s.translate.get();s.setTranslate([a[0]+i[0],a[1]+i[1]])}e.set([0,0]);var r=o>0?-1:1,h=this.controller.index;for(o=Math.abs(o);o>0;)o-=this.data.sizeCache[h][t],h=this.controller._sanitizeIndex(h+r);this.useTouchEndTransition=!0,this.controller._eventOutput.emit("set",h)}.bind(this),this._addTouchEvents()},SequentialLayout.prototype._addTouchEvents=function(){this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},SequentialLayout.prototype._removeTouchEvents=function(){this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},SequentialLayout.prototype._getCenteredPosition=function(t,e){if(void 0===this.data.sizeCache[t])return[0,0];var i=[0,0];return i[e]=.5*(this.containerSize[e]-this.data.sizeCache[t][e]),i},SequentialLayout.prototype._getTransform=function(t,e,i){var o=this._getCenteredPosition(t,i);return Transform.translate(e[0]+o[0],e[1]+o[1])},module.exports=SequentialLayout;
},{"./Layout":"/Users/flipside1300/Node/widget-carousel/src/layouts/Layout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/transitions/Easing":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Easing.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js":[function(require,module,exports){
function SingularLayout(t){return Layout.call(this,t),this._boundSizeListener=null,this}var Layout=require("./Layout"),Transform=require("famous/core/Transform"),Timer=require("famous/utilities/Timer");SingularLayout.prototype=Object.create(Layout.prototype),SingularLayout.prototype.constructor=SingularLayout,SingularLayout.DEFAULT_OPTIONS={},SingularLayout.prototype.activate=function(){this._boundSizeListener=this.centerItem.bind(this);for(var t=0;t<this.controller.items.length;t++)this.data.childOrigins[t].set([.5,.5]),this.data.childAligns[t].set([.5,.5]),this.data.childTransforms[t].set(Transform.identity),t===this.controller.index?(this.data.opacities[t].set(1,this.options.curve),this.data.sizeCache[t]&&(this.controller.isLastLayoutSingular||null===this.controller.isLastLayoutSingular?this.centerItem(t):this.data.childTransforms[t].set(Transform.scale(.8,.8),{duration:150},function(t){this.centerItem(t,{method:"spring",dampingRatio:.65,period:400}),this.data.childTransforms[t].set(Transform.identity,{duration:150})}.bind(this,t)))):(this.data.childTransforms[t].set(Transform.translate(0,0,-10)),this.data.opacities[t].set(0,{duration:300},function(t){this.data.sizeCache[t]&&this.centerItem(t)}.bind(this,t)));this.controller._eventInput.on("initialSize",this._boundSizeListener),this._handleTouchEvents()},SingularLayout.prototype.layout=function(){for(var t=this.controller.index,i=this.controller.lastIndex,e=this.controller.items.length-1,n=(t>i||0===t&&i===e)&&!(t===e&&0===i),o=this.controller.getSize().slice(0),r=0;r<this.controller.items.length;r++)r===this.controller.index?this.currentItemTransition(this.getItem(r),o,n):r===this.controller.lastIndex?this.previousItemTransition(this.getItem(r),o,n):this.otherItemTransition(this.getItem(r),o)},SingularLayout.prototype.otherItemTransition=function(t){t.opacity.set(0)},SingularLayout.prototype.currentItemTransition=function(){},SingularLayout.prototype.previousItemTransition=function(){},SingularLayout.prototype.deactivate=function(){this.controller.isLastLayoutSingular=!0,this.controller._eventInput.removeListener("initialSize",this._boundSizeListener),this._removeTouchEvents()},SingularLayout.prototype.getRenderLimit=function(){return[1,1]},SingularLayout.prototype.getCenteredPosition=function(t){var i=this.controller.getSize(),e=this.data.sizeCache[t];return[.5*(i[0]-e[0]),.5*(i[1]-e[1])]},SingularLayout.prototype.centerItem=function(t,i){var e=this.controller.getSize(),n=this.data.sizeCache[t];this.data.parentTransforms[t].set(Transform.translate(.5*(e[0]-n[0]),.5*(e[1]-n[1])),i)},SingularLayout.prototype.getItem=function(t){return{item:this.controller.items[t],size:this.data.sizeCache[t],index:t,opacity:this.data.opacities[t],parentOrigin:this.data.parentOrigins[t],parentAlign:this.data.parentAligns[t],parentSize:this.data.parentSizes[t],parentTransform:this.data.parentTransforms[t],childTransform:this.data.childTransforms[t],childOrigin:this.data.childOrigins[t],childAlign:this.data.childAligns[t]}},SingularLayout.prototype._handleTouchEvents=function(){this.boundTouchUpdate=function(t){var i=this.controller.index,e=this.data.sizeCache[i],n=this.data.touchOffset,o=n.get();if(n.set([o[0]+t.delta[0],o[1]]),Math.abs(o[0])>1*e[0]/3){var r=n.get()[0]<0?"previous":"next";this._emitEventFromTouch(t.velocity,r)}}.bind(this),this.boundTouchEnd=function(t){var i=this.data.touchOffset;i.set([0,0],{curve:"outBack",duration:150}),Timer.setTimeout(function(){"function"==typeof t&&t()},100)}.bind(this),this._addTouchEvents()},SingularLayout.prototype._addTouchEvents=function(){this.controller.sync.on("update",this.boundTouchUpdate),this.controller.sync.on("end",this.boundTouchEnd)},SingularLayout.prototype._removeTouchEvents=function(){this.controller.sync.removeListener("update",this.boundTouchUpdate),this.controller.sync.removeListener("end",this.boundTouchEnd)},SingularLayout.prototype._emitEventFromTouch=function(t,i){this._removeTouchEvents();var e=function(){this.controller._eventOutput.emit(i),this._addTouchEvents()}.bind(this);this.boundTouchEnd(e)},module.exports=SingularLayout;
},{"./Layout":"/Users/flipside1300/Node/widget-carousel/src/layouts/Layout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularOpacity.js":[function(require,module,exports){
function SingularOpacity(t){SingularLayout.call(this,t)}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform");SingularOpacity.prototype=Object.create(SingularLayout.prototype),SingularOpacity.prototype.constructor=SingularOpacity,SingularOpacity.id="SingularOpacity",SingularOpacity.DEFAULT_OPTIONS={transition:{curve:"linear",duration:500}},SingularOpacity.prototype.currentItemTransition=function(t){t.opacity.set(1,this.options.transition),this.centerItem(this.controller.index)},SingularOpacity.prototype.previousItemTransition=function(t){t.opacity.set(0,this.options.transition),this.centerItem(this.controller.lastIndex)},module.exports=SingularOpacity;
},{"./SingularLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularParallax.js":[function(require,module,exports){
function SingularParallax(a){SingularLayout.call(this,a),this.axis="x"===this.options.direction?0:1}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform");SingularParallax.prototype=Object.create(SingularLayout.prototype),SingularParallax.prototype.constructor=SingularParallax,SingularParallax.id="SingularParallax",SingularParallax.DEFAULT_OPTIONS={transition:{method:"spring",dampingRatio:.95,period:550},direction:"y",parallaxRatio:.2},SingularParallax.Depth=1,SingularParallax.prototype.currentItemTransition=function(a,r,t){a.opacity.set(1),a.parentTransform.halt();var i,n=this.getCenteredPosition(this.controller.index);t?(i=[n[0],n[1],-2*SingularParallax.Depth],i[this.axis]=-a.size[this.axis]*this.options.parallaxRatio,a.parentTransform.set(Transform.translate(i[0],i[1],i[2])),a.parentTransform.set(Transform.translate(n[0],n[1],n[2]),this.options.transition)):(i=[n[0],n[1],0],i[this.axis]=r[this.axis],a.parentTransform.set(Transform.translate(i[0],i[1],i[2])),a.parentTransform.set(Transform.translate(n[0],n[1],n[2]),this.options.transition)),a.childTransform.set(Transform.identity)},SingularParallax.prototype.previousItemTransition=function(a,r,t){a.opacity.set(1),a.parentTransform.halt();var i=this.getCenteredPosition(this.controller.index);if(a.opacity.set(0,{curve:"linear",duration:this.options.transition.period||this.options.transition.duration}),t){var n=[i[0],i[1],-2];n[this.axis]=r[this.axis],a.parentTransform.set(Transform.translate(n[0],n[1],n[2]),this.options.transition),a.parentTransform.set(Transform.translate(i[0],i[1],i[2]),{curve:"linear",duration:1})}else{var s=Transform.translate(i[0],i[1],-2),o=[i[0],i[1],-2*SingularParallax.Depth];o[this.axis]=-a.size[this.axis]*this.options.parallaxRatio,a.parentTransform.set(s),a.parentTransform.set(Transform.translate(o[0],o[1],o[2]),this.options.transition)}},module.exports=SingularParallax;
},{"./SingularLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularSlideBehind.js":[function(require,module,exports){
function SingularSlideBehind(i){SingularLayout.call(this,i)}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform"),IsIE=require("../dom/IE");SingularSlideBehind.prototype=Object.create(SingularLayout.prototype),SingularSlideBehind.prototype.constructor=SingularSlideBehind,SingularSlideBehind.id="SingularSlideBehind",SingularSlideBehind.DEFAULT_OPTIONS={duration:600,rotationAngle:Math.PI/4},SingularSlideBehind.FirstCurve="easeInOut",SingularSlideBehind.SecondCurve="easeInOut",SingularSlideBehind.DurationRatio=1/3,SingularSlideBehind.OffsetFactor=.5,SingularSlideBehind.zIndex=-500,SingularSlideBehind.prototype.currentItemTransition=function(i,e,n){var r,t,a,o;n?(r=[.5,1],t=[.5,1],a=1,o=i.size[1]*SingularSlideBehind.OffsetFactor):(r=[.5,0],t=[.5,0],a=-1,o=i.size[1]*SingularSlideBehind.OffsetFactor*-1);var d=this.options.duration*SingularSlideBehind.DurationRatio,l=(this.options.duration-d,{duration:d,curve:SingularSlideBehind.FirstCurve}),s={duration:d,curve:SingularSlideBehind.SecondCurve};i.childOrigin.set(r),i.childAlign.set(t),i.opacity.set(1,l),i.childTransform.set(Transform.multiply(Transform.translate(0,0,SingularSlideBehind.zIndex),Transform.rotateX(this.options.rotationAngle*a))),i.childTransform.set(Transform.translate(0,o,SingularSlideBehind.zIndex/2),l,function(){IsIE&&i.item.setProperties({zIndex:1}),i.childTransform.set(Transform.identity,s)}),this.centerItem(this.controller.index)},SingularSlideBehind.prototype.previousItemTransition=function(i,e,n){var r,t,a,o;n?(r=[.5,0],t=[.5,0],a=-1,o=i.size[1]*SingularSlideBehind.OffsetFactor*-1):(r=[.5,1],t=[.5,1],a=1,o=i.size[1]*SingularSlideBehind.OffsetFactor);var d=this.options.duration*SingularSlideBehind.DurationRatio,l={duration:d,curve:SingularSlideBehind.FirstCurve},s={duration:this.options.duration-d,curve:SingularSlideBehind.SecondCurve};i.childOrigin.set(r),i.childAlign.set(t),i.childTransform.set(Transform.multiply(Transform.translate(0,o),Transform.rotateX(this.options.rotationAngle*a)),l,function(){IsIE&&i.item.setProperties({zIndex:-1}),i.opacity.set(0,s),i.childTransform.set(Transform.translate(0,0,SingularSlideBehind.zIndex),s)}.bind(this)),this.centerItem(this.controller.lastIndex)},module.exports=SingularSlideBehind;
},{"../dom/IE":"/Users/flipside1300/Node/widget-carousel/src/dom/IE.js","./SingularLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularSlideIn.js":[function(require,module,exports){
function SingularSlideIn(i){SingularLayout.call(this,i),this.options.direction=this.options.direction.toLowerCase()}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform");SingularSlideIn.prototype=Object.create(SingularLayout.prototype),SingularSlideIn.prototype.constructor=SingularSlideIn,SingularSlideIn.id="SingularSlideIn",SingularSlideIn.DEFAULT_OPTIONS={transition:{curve:"easeOut",duration:600},delayRatio:.15,direction:"y"},SingularSlideIn.prototype.currentItemTransition=function(i,t,o){var n=this.options.transition,r=n.duration||n.period,e=r*this.options.delayRatio;r-=e;var a,s,l=n.method?{period:r,method:n.method,dampingRatio:n.dampingRatio}:{duration:r,curve:n.curve};o?"x"===this.options.direction?(a=t[0],s=0):(a=0,s=-1*t[1]):"x"===this.options.direction?(a=-1*t[0],s=0):(a=0,s=t[1]),i.opacity.set(1),i.childTransform.set(Transform.translate(a,s)),i.opacity.delay(e,function(){i.childTransform.set(Transform.translate(0,0),l)}),this.centerItem(this.controller.index)},SingularSlideIn.prototype.previousItemTransition=function(i,t,o){var n,r,e;o?("x"===this.options.direction?(n=[0,.5],r=[0,.5]):(n=[.5,1],r=[.5,1]),e=1):("x"===this.options.direction?(n=[1,.5],r=[1,.5]):(n=[.5,0],r=[.5,0]),e=-1),i.childOrigin.set(n),i.childAlign.set(r),"x"===this.options.direction?i.childTransform.set(Transform.rotateY(Math.PI/4*e),this.options.transition):i.childTransform.set(Transform.rotateX(Math.PI/3*e),this.options.transition),i.opacity.set(0,this.options.transition),this.centerItem(this.controller.lastIndex)},module.exports=SingularSlideIn;
},{"./SingularLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularSoftScale.js":[function(require,module,exports){
function SingularSoftScale(t){SingularLayout.call(this,t)}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform"),Utility=require("famous/utilities/Utility");SingularSoftScale.prototype=Object.create(SingularLayout.prototype),SingularSoftScale.prototype.constructor=SingularSoftScale,SingularSoftScale.id="SingularSoftScale",SingularSoftScale.DEFAULT_OPTIONS={transition:{duration:600,curve:"easeOut"},scaleUpValue:1.3,scaleDownValue:.9,delayRatio:.05},SingularSoftScale.prototype.currentItemTransition=function(t,o,a){var i=a?this.options.scaleDownValue:this.options.scaleUpValue;t.opacity.set(0),t.childTransform.set(Transform.scale(i,i));var e=this.options.transition,r=e.duration||e.period,n=r*this.options.delayRatio;r-=n;var l=e.method?{period:r,dampingRatio:e.dampingRatio,method:e.method}:{duration:r,curve:e.curve};t.opacity.delay(n,function(){t.opacity.set(1,l),t.childTransform.set(Transform.scale(1,1),l)})},SingularSoftScale.prototype.previousItemTransition=function(t,o,a){var i=a?this.options.scaleUpValue:this.options.scaleDownValue,e=this.options.transition,r=e.method?{period:.45*e.period,method:e.method,dampingRatio:e.dampingRatio}:{duration:.45*e.duration,curve:e.curve};t.childTransform.set(Transform.scale(i,i),e),t.opacity.set(0,r)},module.exports=SingularSoftScale;
},{"./SingularLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularTwist.js":[function(require,module,exports){
function SingularTwist(t){SingularLayout.call(this,t),this.options.direction=this.options.direction.toLowerCase()}function _getTransformFromDirection(t,i,r){return"x"===t?Transform.thenMove(Transform.rotateY(i),[0,0,r]):Transform.thenMove(Transform.rotateX(i),[0,0,r])}var SingularLayout=require("./SingularLayout"),Transform=require("famous/core/Transform"),Utility=require("famous/utilities/Utility"),IsIE=require("../dom/IE");SingularTwist.prototype=Object.create(SingularLayout.prototype),SingularTwist.prototype.constructor=SingularTwist,SingularTwist.id="SingularTwist",SingularTwist.DEFAULT_OPTIONS={transition:{method:"spring",dampingRatio:.85,period:600},direction:"x",flipDirection:!1,depth:-1500},SingularTwist.prototype.currentItemTransition=function(t,i,r){t.childTransform.halt(),t.opacity.set(1),IsIE&&t.item.setProperties({zIndex:1});var o;r?(o=_getTransformFromDirection(this.options.direction,.99*Math.PI,this.options.depth),t.childTransform.set(o),t.childTransform.set(Transform.identity,this.options.transition)):(o=_getTransformFromDirection(this.options.direction,.99*-Math.PI,this.options.depth),t.childTransform.set(o),t.childTransform.set(Transform.identity,this.options.transition)),this.centerItem(this.controller.index)},SingularTwist.prototype.previousItemTransition=function(t,i,r){t.childTransform.halt(),t.opacity.set(1),IsIE&&t.item.setProperties({zIndex:-1});var o;r?(t.childTransform.set(Transform.identity),o=_getTransformFromDirection(this.options.direction,.99*-Math.PI,this.options.depth),t.childTransform.set(o,this.options.transition)):(t.childTransform.set(Transform.identity),o=_getTransformFromDirection(this.options.direction,.99*Math.PI,this.options.depth),t.childTransform.set(o,this.options.transition)),this.centerItem(this.controller.lastIndex)},module.exports=SingularTwist;
},{"../dom/IE":"/Users/flipside1300/Node/widget-carousel/src/dom/IE.js","./SingularLayout":"/Users/flipside1300/Node/widget-carousel/src/layouts/SingularLayout.js","famous/core/Transform":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Transform.js","famous/utilities/Utility":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Utility.js"}],"/Users/flipside1300/Node/widget-carousel/src/plugin/FamousContainer.js":[function(require,module,exports){
(function (global){
function FamousContainer(e,n){var o=document.querySelector(e),a=Engine.createContext(o);n instanceof FamousPlugin||(n=n());var s=n.init(ClassToImages(e));return a.add(s),s}var FamousPlugin=require("./FamousPlugin"),ClassToImages=require("../dom/ClassToImages"),Engine=require("famous/core/Engine");Engine.setOptions({appMode:!1}),global.FamousContainer=FamousContainer,module.exports=FamousContainer;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../dom/ClassToImages":"/Users/flipside1300/Node/widget-carousel/src/dom/ClassToImages.js","./FamousPlugin":"/Users/flipside1300/Node/widget-carousel/src/plugin/FamousPlugin.js","famous/core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js"}],"/Users/flipside1300/Node/widget-carousel/src/plugin/FamousPlugin.js":[function(require,module,exports){
function FamousPlugin(){}FamousPlugin.prototype.init=function(){},module.exports=FamousPlugin;
},{}],"/Users/flipside1300/Node/widget-carousel/src/plugin/famousCarousel.js":[function(require,module,exports){
function FamousCarousel(e){return e||(e={}),new CarouselPlugin(e)}function CarouselPlugin(e){FamousPlugin.apply(this,arguments),this.opts=e}require("../styles"),require("famous-polyfills");var Engine=require("famous/core/Engine"),Modifier=require("famous/core/Modifier"),Timer=require("famous/utilities/Timer"),RegisterEasing=require("../registries/Easing"),RegisterPhysics=require("../registries/Physics"),ClassToImages=require("../dom/ClassToImages"),Carousel=require("../Carousel"),FamousContainer=require("./FamousContainer"),FamousPlugin=require("./FamousPlugin");CarouselPlugin.prototype=Object.create(FamousPlugin.prototype),CarouselPlugin.prototype.constructor=CarouselPlugin,CarouselPlugin.prototype.init=function(e){this.opts.items||(this.opts.items=e);var u=new Carousel(this.opts,!0);return u},FamousCarousel.GridLayout=Carousel.GridLayout,FamousCarousel.CoverflowLayout=Carousel.CoverflowLayout,FamousCarousel.SequentialLayout=Carousel.SequentialLayout,FamousCarousel.SingularOpacity=Carousel.SingularOpacity,FamousCarousel.SingularSlideIn=Carousel.SingularSlideIn,FamousCarousel.SingularSlideBehind=Carousel.SingularSlideBehind,FamousCarousel.SingularParallax=Carousel.SingularParallax,FamousCarousel.SingularTwist=Carousel.SingularTwist,FamousCarousel.SingularSoftScale=Carousel.SingularSoftScale,module.exports=FamousCarousel;
},{"../Carousel":"/Users/flipside1300/Node/widget-carousel/src/Carousel.js","../dom/ClassToImages":"/Users/flipside1300/Node/widget-carousel/src/dom/ClassToImages.js","../registries/Easing":"/Users/flipside1300/Node/widget-carousel/src/registries/Easing.js","../registries/Physics":"/Users/flipside1300/Node/widget-carousel/src/registries/Physics.js","../styles":"/Users/flipside1300/Node/widget-carousel/src/styles/index.js","./FamousContainer":"/Users/flipside1300/Node/widget-carousel/src/plugin/FamousContainer.js","./FamousPlugin":"/Users/flipside1300/Node/widget-carousel/src/plugin/FamousPlugin.js","famous-polyfills":"/Users/flipside1300/Node/widget-carousel/node_modules/famous-polyfills/index.js","famous/core/Engine":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Engine.js","famous/core/Modifier":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Modifier.js","famous/utilities/Timer":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/utilities/Timer.js"}],"/Users/flipside1300/Node/widget-carousel/src/registries/Easing.js":[function(require,module,exports){
function getAvailableTransitionCurves(){for(var r=getKeys(Easing).sort(),e={},n=0;n<r.length;n++)e[r[n]]=Easing[r[n]];return e}function getKeys(r){var e,n=[];for(e in r)r.hasOwnProperty(e)&&n.push(e);return n}function registerKeys(){var r=getAvailableTransitionCurves();for(var e in r)TweenTransition.registerCurve(e,r[e])}var Easing=require("famous/transitions/Easing"),TweenTransition=require("famous/transitions/TweenTransition");registerKeys();
},{"famous/transitions/Easing":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Easing.js","famous/transitions/TweenTransition":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/TweenTransition.js"}],"/Users/flipside1300/Node/widget-carousel/src/registries/Physics.js":[function(require,module,exports){
var Transitionable=require("famous/transitions/Transitionable"),SpringTransition=require("famous/transitions/SpringTransition"),SnapTransition=require("famous/transitions/SnapTransition"),WallTransition=require("famous/transitions/WallTransition");Transitionable.registerMethod("spring",SpringTransition),Transitionable.registerMethod("snap",SnapTransition),Transitionable.registerMethod("wall",WallTransition);
},{"famous/transitions/SnapTransition":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/SnapTransition.js","famous/transitions/SpringTransition":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/SpringTransition.js","famous/transitions/Transitionable":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/Transitionable.js","famous/transitions/WallTransition":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/transitions/WallTransition.js"}],"/Users/flipside1300/Node/widget-carousel/src/slides/Slide.js":[function(require,module,exports){
function Slide(e){Surface.call(this,{content:e,size:[!0,!0]})}var Surface=require("famous/core/Surface");Slide.prototype=Object.create(Surface.prototype),Slide.prototype.constructor=Slide,module.exports=Slide;
},{"famous/core/Surface":"/Users/flipside1300/Node/widget-carousel/node_modules/famous/core/Surface.js"}],"/Users/flipside1300/Node/widget-carousel/src/styles/famous-carousel.css":[function(require,module,exports){
var css="/* This Source Code Form is subject to the terms of the Mozilla Public\n * License, v. 2.0. If a copy of the MPL was not distributed with this\n * file, You can obtain one at http://mozilla.org/MPL/2.0/.\n *\n * Owner: mark@famo.us\n * @license MPL 2.0\n * @copyright Famous Industries, Inc. 2014\n */\n.famous-container, .famous-group {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    right: 0px;\n    overflow: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    pointer-events: none;\n}\n\n.famous-group {\n    width: 0px;\n    height: 0px;\n    margin: 0px;\n    padding: 0px;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\n.famous-surface {\n    position: absolute;\n    -webkit-transform-origin: center center;\n    transform-origin: center center;\n    -webkit-backface-visibility: hidden;\n    backface-visibility: hidden;\n    -webkit-transform-style: flat;\n    transform-style: preserve-3d; /* performance */\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: transparent;\n    pointer-events: auto;\n}\n\n.famous-container-group {\n    position: relative;\n    width: 100%;\n    height: 100%;\n}\n";require("/Users/flipside1300/Node/widget-carousel/node_modules/cssify")(css),module.exports=css;
},{"/Users/flipside1300/Node/widget-carousel/node_modules/cssify":"/Users/flipside1300/Node/widget-carousel/node_modules/cssify/browser.js"}],"/Users/flipside1300/Node/widget-carousel/src/styles/index.js":[function(require,module,exports){
require("./famous-carousel.css");
},{"./famous-carousel.css":"/Users/flipside1300/Node/widget-carousel/src/styles/famous-carousel.css"}]},{},["/Users/flipside1300/Node/widget-carousel/src/plugin/famousCarousel.js"])("/Users/flipside1300/Node/widget-carousel/src/plugin/famousCarousel.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2Nzc2lmeS9icm93c2VyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzLXBvbHlmaWxscy9jbGFzc0xpc3QuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMtcG9seWZpbGxzL2Z1bmN0aW9uUHJvdG90eXBlQmluZC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy1wb2x5ZmlsbHMvaW5kZXguanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMtcG9seWZpbGxzL3JlcXVlc3RBbmltYXRpb25GcmFtZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0NvbnRleHQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9FbGVtZW50QWxsb2NhdG9yLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvRWxlbWVudE91dHB1dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0VuZ2luZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0VudGl0eS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0V2ZW50RW1pdHRlci5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL0V2ZW50SGFuZGxlci5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL01vZGlmaWVyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvT3B0aW9uc01hbmFnZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9SZW5kZXJOb2RlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvU3BlY1BhcnNlci5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9jb3JlL1N1cmZhY2UuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9UcmFuc2Zvcm0uanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvY29yZS9WaWV3LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2NvcmUvVmlld1NlcXVlbmNlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2lucHV0cy9GYXN0Q2xpY2suanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvaW5wdXRzL0dlbmVyaWNTeW5jLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL2lucHV0cy9Nb3VzZVN5bmMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvaW5wdXRzL1Njcm9sbFN5bmMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvaW5wdXRzL1RvdWNoU3luYy5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9pbnB1dHMvVG91Y2hUcmFja2VyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL21hdGgvVmVjdG9yLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3BoeXNpY3MvUGh5c2ljc0VuZ2luZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2JvZGllcy9QYXJ0aWNsZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2NvbnN0cmFpbnRzL0NvbnN0cmFpbnQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvcGh5c2ljcy9jb25zdHJhaW50cy9TbmFwLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3BoeXNpY3MvY29uc3RyYWludHMvV2FsbC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2ZvcmNlcy9Gb3JjZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9waHlzaWNzL2ZvcmNlcy9TcHJpbmcuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvcGh5c2ljcy9pbnRlZ3JhdG9ycy9TeW1wbGVjdGljRXVsZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvc3VyZmFjZXMvQ29udGFpbmVyU3VyZmFjZS5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy9zdXJmYWNlcy9JbWFnZVN1cmZhY2UuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvdHJhbnNpdGlvbnMvRWFzaW5nLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL011bHRpcGxlVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy90cmFuc2l0aW9ucy9TbmFwVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy90cmFuc2l0aW9ucy9TcHJpbmdUcmFuc2l0aW9uLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlVHJhbnNmb3JtLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZmFtb3VzL3RyYW5zaXRpb25zL1R3ZWVuVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy90cmFuc2l0aW9ucy9XYWxsVHJhbnNpdGlvbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2ZhbW91cy91dGlsaXRpZXMvVGltZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHkuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL25vZGVfbW9kdWxlcy9mYW1vdXMvdmlld3MvU2VxdWVudGlhbExheW91dC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL0Nhcm91c2VsLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvY29tcG9uZW50cy9BcnJvd3MuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9jb21wb25lbnRzL0RvdHMuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9jb25zdHJ1Y3RvcnMvU2l6ZUF3YXJlVmlldy5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2RvbS9DbGFzc1RvSW1hZ2VzLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvZG9tL0lFLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvZXZlbnRzL0V2ZW50SGVscGVycy5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2hlbHBlcnMvT2JqZWN0SGVscGVycy5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2xheW91dHMvQ292ZXJmbG93TGF5b3V0LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9HcmlkTGF5b3V0LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9MYXlvdXQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL0xheW91dENvbnRyb2xsZXIuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL0xheW91dEZhY3RvcnkuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1NlcXVlbnRpYWxMYXlvdXQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1Npbmd1bGFyTGF5b3V0LmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvbGF5b3V0cy9TaW5ndWxhck9wYWNpdHkuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1Npbmd1bGFyUGFyYWxsYXguanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1Npbmd1bGFyU2xpZGVCZWhpbmQuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1Npbmd1bGFyU2xpZGVJbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL2xheW91dHMvU2luZ3VsYXJTb2Z0U2NhbGUuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9sYXlvdXRzL1Npbmd1bGFyVHdpc3QuanMiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9wbHVnaW4vRmFtb3VzQ29udGFpbmVyLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvcGx1Z2luL0ZhbW91c1BsdWdpbi5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL3BsdWdpbi9mYW1vdXNDYXJvdXNlbC5qcyIsIi9Vc2Vycy9mbGlwc2lkZTEzMDAvTm9kZS93aWRnZXQtY2Fyb3VzZWwvc3JjL3JlZ2lzdHJpZXMvRWFzaW5nLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvcmVnaXN0cmllcy9QaHlzaWNzLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvc2xpZGVzL1NsaWRlLmpzIiwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9zcmMvc3R5bGVzL2ZhbW91cy1jYXJvdXNlbC5jc3MiLCIvVXNlcnMvZmxpcHNpZGUxMzAwL05vZGUvd2lkZ2V0LWNhcm91c2VsL3NyYy9zdHlsZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MsIGN1c3RvbURvY3VtZW50KSB7XG4gIHZhciBkb2MgPSBjdXN0b21Eb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgaWYgKGRvYy5jcmVhdGVTdHlsZVNoZWV0KSB7XG4gICAgdmFyIHNoZWV0ID0gZG9jLmNyZWF0ZVN0eWxlU2hlZXQoKVxuICAgIHNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgcmV0dXJuIHNoZWV0Lm93bmVyTm9kZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaGVhZCA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICBzdHlsZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgfVxuXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgcmV0dXJuIHN0eWxlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5ieVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoZG9jdW1lbnQuY3JlYXRlU3R5bGVTaGVldCkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVTdHlsZVNoZWV0KHVybCkub3duZXJOb2RlO1xuICB9IGVsc2Uge1xuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSxcbiAgICAgICAgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblxuICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuICAgIGxpbmsuaHJlZiA9IHVybDtcblxuICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgcmV0dXJuIGxpbms7XG4gIH1cbn07XG4iLCJcbi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDIwMTEtMDYtMTVcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBQdWJsaWMgRG9tYWluLlxuICogTk8gV0FSUkFOVFkgRVhQUkVTU0VEIE9SIElNUExJRUQuIFVTRSBBVCBZT1VSIE9XTiBSSVNLLlxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMqL1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG52YXJcbiAgICAgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG4gICAgLCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG4gICAgLCBlbGVtQ3RyUHJvdG8gPSAodmlldy5IVE1MRWxlbWVudCB8fCB2aWV3LkVsZW1lbnQpW3Byb3RvUHJvcF1cbiAgICAsIG9iakN0ciA9IE9iamVjdFxuICAgICwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcbiAgICB9XG4gICAgLCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgICBpID0gMFxuICAgICAgICAgICAgLCBsZW4gPSB0aGlzLmxlbmd0aFxuICAgICAgICA7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgLy8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG4gICAgLCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG4gICAgLCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuICAgICAgICBpZiAodG9rZW4gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBET01FeChcbiAgICAgICAgICAgICAgICAgIFwiU1lOVEFYX0VSUlwiXG4gICAgICAgICAgICAgICAgLCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IERPTUV4KFxuICAgICAgICAgICAgICAgICAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuICAgICAgICAgICAgICAgICwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuICAgIH1cbiAgICAsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmNsYXNzTmFtZSlcbiAgICAgICAgICAgICwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG4gICAgICAgICAgICAsIGkgPSAwXG4gICAgICAgICAgICAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG4gICAgICAgIDtcbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NOYW1lID0gdGhpcy50b1N0cmluZygpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuICAgICwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcbiAgICB9XG47XG4vLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG4vLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbkRPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuY2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgcmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHRva2VuICs9IFwiXCI7XG4gICAgcmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xufTtcbmNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHRva2VuICs9IFwiXCI7XG4gICAgaWYgKGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgPT09IC0xKSB7XG4gICAgICAgIHRoaXMucHVzaCh0b2tlbik7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuICAgIH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICB0b2tlbiArPSBcIlwiO1xuICAgIHZhciBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuICAgIH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICB0b2tlbiArPSBcIlwiO1xuICAgIGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuICAgICAgICB0aGlzLmFkZCh0b2tlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmUodG9rZW4pO1xuICAgIH1cbn07XG5jbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG4gICAgICAgICAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcbiAgICAgICAgLCBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICwgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG4gICAgfSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG4gICAgICAgIGlmIChleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG4gICAgICAgICAgICBjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG4gICAgICAgIH1cbiAgICB9XG59IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICBlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHNlbGYpKTtcblxufVxuIiwiaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xuICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKG9UaGlzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAvLyBjbG9zZXN0IHRoaW5nIHBvc3NpYmxlIHRvIHRoZSBFQ01BU2NyaXB0IDUgaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIC0gd2hhdCBpcyB0cnlpbmcgdG8gYmUgYm91bmQgaXMgbm90IGNhbGxhYmxlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgZlRvQmluZCA9IHRoaXMsXG4gICAgICAgIGZOT1AgPSBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgZkJvdW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZUb0JpbmQuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGZOT1AgJiYgb1RoaXNcbiAgICAgICAgICAgICAgICA/IHRoaXNcbiAgICAgICAgICAgICAgICA6IG9UaGlzLFxuICAgICAgICAgICAgICAgIGFBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZk5PUC5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcbiAgICAgICAgZkJvdW5kLnByb3RvdHlwZSA9IG5ldyBmTk9QKCk7XG5cbiAgICAgICAgcmV0dXJuIGZCb3VuZDtcbiAgICB9O1xufVxuIiwicmVxdWlyZSgnLi9jbGFzc0xpc3QuanMnKTtcbnJlcXVpcmUoJy4vZnVuY3Rpb25Qcm90b3R5cGVCaW5kLmpzJyk7XG5yZXF1aXJlKCcuL3JlcXVlc3RBbmltYXRpb25GcmFtZS5qcycpOyIsIi8vIGFkZHMgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGZ1bmN0aW9uYWxpdHlcbi8vIFNvdXJjZTogaHR0cDovL3N0cmQ2LmNvbS8yMDExLzA1L2JldHRlci13aW5kb3ctcmVxdWVzdGFuaW1hdGlvbmZyYW1lLXNoaW0vXG5cbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICB8fFxuICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgIHx8XG4gIGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbGJhY2soK25ldyBEYXRlKCkpO1xuICB9LCAxMDAwIC8gNjApO1xufSk7XG4iLCJ2YXIgUmVuZGVyTm9kZSA9IHJlcXVpcmUoJy4vUmVuZGVyTm9kZScpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4vRXZlbnRIYW5kbGVyJyk7XG52YXIgRWxlbWVudEFsbG9jYXRvciA9IHJlcXVpcmUoJy4vRWxlbWVudEFsbG9jYXRvcicpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG52YXIgVHJhbnNpdGlvbmFibGUgPSByZXF1aXJlKCdmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGUnKTtcbnZhciBfb3JpZ2luWmVyb1plcm8gPSBbXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdO1xuZnVuY3Rpb24gX2dldEVsZW1lbnRTaXplKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBlbGVtZW50LmNsaWVudFdpZHRoLFxuICAgICAgICBlbGVtZW50LmNsaWVudEhlaWdodFxuICAgIF07XG59XG5mdW5jdGlvbiBDb250ZXh0KGNvbnRhaW5lcikge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuX2FsbG9jYXRvciA9IG5ldyBFbGVtZW50QWxsb2NhdG9yKGNvbnRhaW5lcik7XG4gICAgdGhpcy5fbm9kZSA9IG5ldyBSZW5kZXJOb2RlKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fc2l6ZSA9IF9nZXRFbGVtZW50U2l6ZSh0aGlzLmNvbnRhaW5lcik7XG4gICAgdGhpcy5fcGVyc3BlY3RpdmVTdGF0ZSA9IG5ldyBUcmFuc2l0aW9uYWJsZSgwKTtcbiAgICB0aGlzLl9wZXJzcGVjdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9ub2RlQ29udGV4dCA9IHtcbiAgICAgICAgYWxsb2NhdG9yOiB0aGlzLl9hbGxvY2F0b3IsXG4gICAgICAgIHRyYW5zZm9ybTogVHJhbnNmb3JtLmlkZW50aXR5LFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBvcmlnaW46IF9vcmlnaW5aZXJvWmVybyxcbiAgICAgICAgYWxpZ246IG51bGwsXG4gICAgICAgIHNpemU6IHRoaXMuX3NpemVcbiAgICB9O1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0Lm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0U2l6ZShfZ2V0RWxlbWVudFNpemUodGhpcy5jb250YWluZXIpKTtcbiAgICB9LmJpbmQodGhpcykpO1xufVxuQ29udGV4dC5wcm90b3R5cGUuZ2V0QWxsb2NhdG9yID0gZnVuY3Rpb24gZ2V0QWxsb2NhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9hbGxvY2F0b3I7XG59O1xuQ29udGV4dC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9ub2RlLmFkZChvYmopO1xufTtcbkNvbnRleHQucHJvdG90eXBlLm1pZ3JhdGUgPSBmdW5jdGlvbiBtaWdyYXRlKGNvbnRhaW5lcikge1xuICAgIGlmIChjb250YWluZXIgPT09IHRoaXMuY29udGFpbmVyKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5fYWxsb2NhdG9yLm1pZ3JhdGUoY29udGFpbmVyKTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gc2V0U2l6ZShzaXplKSB7XG4gICAgaWYgKCFzaXplKVxuICAgICAgICBzaXplID0gX2dldEVsZW1lbnRTaXplKHRoaXMuY29udGFpbmVyKTtcbiAgICB0aGlzLl9zaXplWzBdID0gc2l6ZVswXTtcbiAgICB0aGlzLl9zaXplWzFdID0gc2l6ZVsxXTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoY29udGV4dFBhcmFtZXRlcnMpIHtcbiAgICBpZiAoY29udGV4dFBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKGNvbnRleHRQYXJhbWV0ZXJzLnRyYW5zZm9ybSlcbiAgICAgICAgICAgIHRoaXMuX25vZGVDb250ZXh0LnRyYW5zZm9ybSA9IGNvbnRleHRQYXJhbWV0ZXJzLnRyYW5zZm9ybTtcbiAgICAgICAgaWYgKGNvbnRleHRQYXJhbWV0ZXJzLm9wYWNpdHkpXG4gICAgICAgICAgICB0aGlzLl9ub2RlQ29udGV4dC5vcGFjaXR5ID0gY29udGV4dFBhcmFtZXRlcnMub3BhY2l0eTtcbiAgICAgICAgaWYgKGNvbnRleHRQYXJhbWV0ZXJzLm9yaWdpbilcbiAgICAgICAgICAgIHRoaXMuX25vZGVDb250ZXh0Lm9yaWdpbiA9IGNvbnRleHRQYXJhbWV0ZXJzLm9yaWdpbjtcbiAgICAgICAgaWYgKGNvbnRleHRQYXJhbWV0ZXJzLmFsaWduKVxuICAgICAgICAgICAgdGhpcy5fbm9kZUNvbnRleHQuYWxpZ24gPSBjb250ZXh0UGFyYW1ldGVycy5hbGlnbjtcbiAgICAgICAgaWYgKGNvbnRleHRQYXJhbWV0ZXJzLnNpemUpXG4gICAgICAgICAgICB0aGlzLl9ub2RlQ29udGV4dC5zaXplID0gY29udGV4dFBhcmFtZXRlcnMuc2l6ZTtcbiAgICB9XG4gICAgdmFyIHBlcnNwZWN0aXZlID0gdGhpcy5fcGVyc3BlY3RpdmVTdGF0ZS5nZXQoKTtcbiAgICBpZiAocGVyc3BlY3RpdmUgIT09IHRoaXMuX3BlcnNwZWN0aXZlKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnBlcnNwZWN0aXZlID0gcGVyc3BlY3RpdmUgPyBwZXJzcGVjdGl2ZS50b0ZpeGVkKCkgKyAncHgnIDogJyc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndlYmtpdFBlcnNwZWN0aXZlID0gcGVyc3BlY3RpdmUgPyBwZXJzcGVjdGl2ZS50b0ZpeGVkKCkgOiAnJztcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZTtcbiAgICB9XG4gICAgdGhpcy5fbm9kZS5jb21taXQodGhpcy5fbm9kZUNvbnRleHQpO1xufTtcbkNvbnRleHQucHJvdG90eXBlLmdldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24gZ2V0UGVyc3BlY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BlcnNwZWN0aXZlU3RhdGUuZ2V0KCk7XG59O1xuQ29udGV4dC5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbiBzZXRQZXJzcGVjdGl2ZShwZXJzcGVjdGl2ZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5fcGVyc3BlY3RpdmVTdGF0ZS5zZXQocGVyc3BlY3RpdmUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBldmVudCkge1xuICAgIHJldHVybiB0aGlzLl9ldmVudE91dHB1dC5lbWl0KHR5cGUsIGV2ZW50KTtcbn07XG5Db250ZXh0LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRPdXRwdXQub24odHlwZSwgaGFuZGxlcik7XG59O1xuQ29udGV4dC5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBoYW5kbGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50T3V0cHV0LnJlbW92ZUxpc3RlbmVyKHR5cGUsIGhhbmRsZXIpO1xufTtcbkNvbnRleHQucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiBwaXBlKHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLl9ldmVudE91dHB1dC5waXBlKHRhcmdldCk7XG59O1xuQ29udGV4dC5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLl9ldmVudE91dHB1dC51bnBpcGUodGFyZ2V0KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHQ7IiwiZnVuY3Rpb24gRWxlbWVudEFsbG9jYXRvcihjb250YWluZXIpIHtcbiAgICBpZiAoIWNvbnRhaW5lcilcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuZGV0YWNoZWROb2RlcyA9IHt9O1xuICAgIHRoaXMubm9kZUNvdW50ID0gMDtcbn1cbkVsZW1lbnRBbGxvY2F0b3IucHJvdG90eXBlLm1pZ3JhdGUgPSBmdW5jdGlvbiBtaWdyYXRlKGNvbnRhaW5lcikge1xuICAgIHZhciBvbGRDb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICBpZiAoY29udGFpbmVyID09PSBvbGRDb250YWluZXIpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAob2xkQ29udGFpbmVyIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQob2xkQ29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAob2xkQ29udGFpbmVyLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG9sZENvbnRhaW5lci5yZW1vdmVDaGlsZChvbGRDb250YWluZXIuZmlyc3RDaGlsZCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xufTtcbkVsZW1lbnRBbGxvY2F0b3IucHJvdG90eXBlLmFsbG9jYXRlID0gZnVuY3Rpb24gYWxsb2NhdGUodHlwZSkge1xuICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCEodHlwZSBpbiB0aGlzLmRldGFjaGVkTm9kZXMpKVxuICAgICAgICB0aGlzLmRldGFjaGVkTm9kZXNbdHlwZV0gPSBbXTtcbiAgICB2YXIgbm9kZVN0b3JlID0gdGhpcy5kZXRhY2hlZE5vZGVzW3R5cGVdO1xuICAgIHZhciByZXN1bHQ7XG4gICAgaWYgKG5vZGVTdG9yZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3VsdCA9IG5vZGVTdG9yZS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChyZXN1bHQpO1xuICAgIH1cbiAgICB0aGlzLm5vZGVDb3VudCsrO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuRWxlbWVudEFsbG9jYXRvci5wcm90b3R5cGUuZGVhbGxvY2F0ZSA9IGZ1bmN0aW9uIGRlYWxsb2NhdGUoZWxlbWVudCkge1xuICAgIHZhciBub2RlVHlwZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB2YXIgbm9kZVN0b3JlID0gdGhpcy5kZXRhY2hlZE5vZGVzW25vZGVUeXBlXTtcbiAgICBub2RlU3RvcmUucHVzaChlbGVtZW50KTtcbiAgICB0aGlzLm5vZGVDb3VudC0tO1xufTtcbkVsZW1lbnRBbGxvY2F0b3IucHJvdG90eXBlLmdldE5vZGVDb3VudCA9IGZ1bmN0aW9uIGdldE5vZGVDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlQ291bnQ7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50QWxsb2NhdG9yOyIsInZhciBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4vRXZlbnRIYW5kbGVyJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcbnZhciB1c2VQcmVmaXggPSBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdFRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkO1xudmFyIGRldmljZVBpeGVsUmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuZnVuY3Rpb24gRWxlbWVudE91dHB1dChlbGVtZW50KSB7XG4gICAgdGhpcy5fbWF0cml4ID0gbnVsbDtcbiAgICB0aGlzLl9vcGFjaXR5ID0gMTtcbiAgICB0aGlzLl9vcmlnaW4gPSBudWxsO1xuICAgIHRoaXMuX3NpemUgPSBudWxsO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmJpbmRUaGlzKHRoaXMpO1xuICAgIHRoaXMuZXZlbnRGb3J3YXJkZXIgPSBmdW5jdGlvbiBldmVudEZvcndhcmRlcihldmVudCkge1xuICAgICAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICB9LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pZCA9IEVudGl0eS5yZWdpc3Rlcih0aGlzKTtcbiAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLl9zaXplRGlydHkgPSBmYWxzZTtcbiAgICB0aGlzLl9vcmlnaW5EaXJ0eSA9IGZhbHNlO1xuICAgIHRoaXMuX3RyYW5zZm9ybURpcnR5ID0gZmFsc2U7XG4gICAgdGhpcy5faW52aXNpYmxlID0gZmFsc2U7XG4gICAgaWYgKGVsZW1lbnQpXG4gICAgICAgIHRoaXMuYXR0YWNoKGVsZW1lbnQpO1xufVxuRWxlbWVudE91dHB1dC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbih0eXBlLCBmbikge1xuICAgIGlmICh0aGlzLl9lbGVtZW50KVxuICAgICAgICB0aGlzLl9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcy5ldmVudEZvcndhcmRlcik7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQub24odHlwZSwgZm4pO1xufTtcbkVsZW1lbnRPdXRwdXQucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgZm4pIHtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5yZW1vdmVMaXN0ZW5lcih0eXBlLCBmbik7XG59O1xuRWxlbWVudE91dHB1dC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSwgZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQgJiYgIWV2ZW50Lm9yaWdpbilcbiAgICAgICAgZXZlbnQub3JpZ2luID0gdGhpcztcbiAgICB2YXIgaGFuZGxlZCA9IHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQodHlwZSwgZXZlbnQpO1xuICAgIGlmIChoYW5kbGVkICYmIGV2ZW50ICYmIGV2ZW50LnN0b3BQcm9wYWdhdGlvbilcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgcmV0dXJuIGhhbmRsZWQ7XG59O1xuRWxlbWVudE91dHB1dC5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uIHBpcGUodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50T3V0cHV0LnBpcGUodGFyZ2V0KTtcbn07XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbiB1bnBpcGUodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50T3V0cHV0LnVucGlwZSh0YXJnZXQpO1xufTtcbkVsZW1lbnRPdXRwdXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbn07XG5mdW5jdGlvbiBfYWRkRXZlbnRMaXN0ZW5lcnModGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9ldmVudE91dHB1dC5saXN0ZW5lcnMpIHtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoaSwgdGhpcy5ldmVudEZvcndhcmRlcik7XG4gICAgfVxufVxuZnVuY3Rpb24gX3JlbW92ZUV2ZW50TGlzdGVuZXJzKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgaW4gdGhpcy5fZXZlbnRPdXRwdXQubGlzdGVuZXJzKSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGksIHRoaXMuZXZlbnRGb3J3YXJkZXIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9mb3JtYXRDU1NUcmFuc2Zvcm0obSkge1xuICAgIG1bMTJdID0gTWF0aC5yb3VuZChtWzEyXSAqIGRldmljZVBpeGVsUmF0aW8pIC8gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBtWzEzXSA9IE1hdGgucm91bmQobVsxM10gKiBkZXZpY2VQaXhlbFJhdGlvKSAvIGRldmljZVBpeGVsUmF0aW87XG4gICAgdmFyIHJlc3VsdCA9ICdtYXRyaXgzZCgnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTU7IGkrKykge1xuICAgICAgICByZXN1bHQgKz0gbVtpXSA8IDAuMDAwMDAxICYmIG1baV0gPiAtMC4wMDAwMDEgPyAnMCwnIDogbVtpXSArICcsJztcbiAgICB9XG4gICAgcmVzdWx0ICs9IG1bMTVdICsgJyknO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG52YXIgX3NldE1hdHJpeDtcbmlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID4gLTEpIHtcbiAgICBfc2V0TWF0cml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG1hdHJpeCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IG1hdHJpeFsxNF0gKiAxMDAwMDAwIHwgMDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBfZm9ybWF0Q1NTVHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgfTtcbn0gZWxzZSBpZiAodXNlUHJlZml4KSB7XG4gICAgX3NldE1hdHJpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBtYXRyaXgpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBfZm9ybWF0Q1NTVHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgX3NldE1hdHJpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBtYXRyaXgpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBfZm9ybWF0Q1NTVHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIF9mb3JtYXRDU1NPcmlnaW4ob3JpZ2luKSB7XG4gICAgcmV0dXJuIDEwMCAqIG9yaWdpblswXSArICclICcgKyAxMDAgKiBvcmlnaW5bMV0gKyAnJSc7XG59XG52YXIgX3NldE9yaWdpbiA9IHVzZVByZWZpeCA/IGZ1bmN0aW9uIChlbGVtZW50LCBvcmlnaW4pIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4gPSBfZm9ybWF0Q1NTT3JpZ2luKG9yaWdpbik7XG4gICAgfSA6IGZ1bmN0aW9uIChlbGVtZW50LCBvcmlnaW4pIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBfZm9ybWF0Q1NTT3JpZ2luKG9yaWdpbik7XG4gICAgfTtcbnZhciBfc2V0SW52aXNpYmxlID0gdXNlUHJlZml4ID8gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUzZCgwLjAwMDEsMC4wMDAxLDAuMDAwMSknO1xuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZTNkKDAuMDAwMSwwLjAwMDEsMC4wMDAxKSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgfTtcbmZ1bmN0aW9uIF94eU5vdEVxdWFscyhhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGFbMF0gIT09IGJbMF0gfHwgYVsxXSAhPT0gYlsxXSA6IGEgIT09IGI7XG59XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS5jb21taXQgPSBmdW5jdGlvbiBjb21taXQoY29udGV4dCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLl9lbGVtZW50O1xuICAgIGlmICghdGFyZ2V0KVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIG1hdHJpeCA9IGNvbnRleHQudHJhbnNmb3JtO1xuICAgIHZhciBvcGFjaXR5ID0gY29udGV4dC5vcGFjaXR5O1xuICAgIHZhciBvcmlnaW4gPSBjb250ZXh0Lm9yaWdpbjtcbiAgICB2YXIgc2l6ZSA9IGNvbnRleHQuc2l6ZTtcbiAgICBpZiAoIW1hdHJpeCAmJiB0aGlzLl9tYXRyaXgpIHtcbiAgICAgICAgdGhpcy5fbWF0cml4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3BhY2l0eSA9IDA7XG4gICAgICAgIF9zZXRJbnZpc2libGUodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoX3h5Tm90RXF1YWxzKHRoaXMuX29yaWdpbiwgb3JpZ2luKSlcbiAgICAgICAgdGhpcy5fb3JpZ2luRGlydHkgPSB0cnVlO1xuICAgIGlmIChUcmFuc2Zvcm0ubm90RXF1YWxzKHRoaXMuX21hdHJpeCwgbWF0cml4KSlcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtRGlydHkgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9pbnZpc2libGUpIHtcbiAgICAgICAgdGhpcy5faW52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3BhY2l0eSAhPT0gb3BhY2l0eSkge1xuICAgICAgICB0aGlzLl9vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5ID49IDEgPyAnMC45OTk5OTknIDogb3BhY2l0eTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3RyYW5zZm9ybURpcnR5IHx8IHRoaXMuX29yaWdpbkRpcnR5IHx8IHRoaXMuX3NpemVEaXJ0eSkge1xuICAgICAgICBpZiAodGhpcy5fc2l6ZURpcnR5KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NpemUpXG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZSA9IFtcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB0aGlzLl9zaXplWzBdID0gc2l6ZVswXTtcbiAgICAgICAgICAgIHRoaXMuX3NpemVbMV0gPSBzaXplWzFdO1xuICAgICAgICAgICAgdGhpcy5fc2l6ZURpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX29yaWdpbkRpcnR5KSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW4pXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbiA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luWzBdID0gb3JpZ2luWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpblsxXSA9IG9yaWdpblsxXTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbiA9IG51bGw7XG4gICAgICAgICAgICBfc2V0T3JpZ2luKHRhcmdldCwgdGhpcy5fb3JpZ2luKTtcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbkRpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRyaXgpXG4gICAgICAgICAgICBtYXRyaXggPSBUcmFuc2Zvcm0uaWRlbnRpdHk7XG4gICAgICAgIHRoaXMuX21hdHJpeCA9IG1hdHJpeDtcbiAgICAgICAgdmFyIGFhTWF0cml4ID0gdGhpcy5fc2l6ZSA/IFRyYW5zZm9ybS50aGVuTW92ZShtYXRyaXgsIFtcbiAgICAgICAgICAgICAgICAtdGhpcy5fc2l6ZVswXSAqIG9yaWdpblswXSxcbiAgICAgICAgICAgICAgICAtdGhpcy5fc2l6ZVsxXSAqIG9yaWdpblsxXSxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdKSA6IG1hdHJpeDtcbiAgICAgICAgX3NldE1hdHJpeCh0YXJnZXQsIGFhTWF0cml4KTtcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtRGlydHkgPSBmYWxzZTtcbiAgICB9XG59O1xuRWxlbWVudE91dHB1dC5wcm90b3R5cGUuY2xlYW51cCA9IGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5faW52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbn07XG5FbGVtZW50T3V0cHV0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiBhdHRhY2godGFyZ2V0KSB7XG4gICAgdGhpcy5fZWxlbWVudCA9IHRhcmdldDtcbiAgICBfYWRkRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzLCB0YXJnZXQpO1xufTtcbkVsZW1lbnRPdXRwdXQucHJvdG90eXBlLmRldGFjaCA9IGZ1bmN0aW9uIGRldGFjaCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5fZWxlbWVudDtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIF9yZW1vdmVFdmVudExpc3RlbmVycy5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIGlmICh0aGlzLl9pbnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2ludmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRPdXRwdXQ7IiwidmFyIENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuL0V2ZW50SGFuZGxlcicpO1xudmFyIE9wdGlvbnNNYW5hZ2VyID0gcmVxdWlyZSgnLi9PcHRpb25zTWFuYWdlcicpO1xudmFyIEVuZ2luZSA9IHt9O1xudmFyIGNvbnRleHRzID0gW107XG52YXIgbmV4dFRpY2tRdWV1ZSA9IFtdO1xudmFyIGRlZmVyUXVldWUgPSBbXTtcbnZhciBsYXN0VGltZSA9IERhdGUubm93KCk7XG52YXIgZnJhbWVUaW1lO1xudmFyIGZyYW1lVGltZUxpbWl0O1xudmFyIGxvb3BFbmFibGVkID0gdHJ1ZTtcbnZhciBldmVudEZvcndhcmRlcnMgPSB7fTtcbnZhciBldmVudEhhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG52YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgY29udGFpbmVyVHlwZTogJ2RpdicsXG4gICAgICAgIGNvbnRhaW5lckNsYXNzOiAnZmFtb3VzLWNvbnRhaW5lcicsXG4gICAgICAgIGZwc0NhcDogdW5kZWZpbmVkLFxuICAgICAgICBydW5Mb29wOiB0cnVlLFxuICAgICAgICBhcHBNb2RlOiB0cnVlXG4gICAgfTtcbnZhciBvcHRpb25zTWFuYWdlciA9IG5ldyBPcHRpb25zTWFuYWdlcihvcHRpb25zKTtcbnZhciBNQVhfREVGRVJfRlJBTUVfVElNRSA9IDEwO1xuRW5naW5lLnN0ZXAgPSBmdW5jdGlvbiBzdGVwKCkge1xuICAgIHZhciBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG4gICAgaWYgKGZyYW1lVGltZUxpbWl0ICYmIGN1cnJlbnRUaW1lIC0gbGFzdFRpbWUgPCBmcmFtZVRpbWVMaW1pdClcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciBpID0gMDtcbiAgICBmcmFtZVRpbWUgPSBjdXJyZW50VGltZSAtIGxhc3RUaW1lO1xuICAgIGxhc3RUaW1lID0gY3VycmVudFRpbWU7XG4gICAgZXZlbnRIYW5kbGVyLmVtaXQoJ3ByZXJlbmRlcicpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuZXh0VGlja1F1ZXVlLmxlbmd0aDsgaSsrKVxuICAgICAgICBuZXh0VGlja1F1ZXVlW2ldLmNhbGwodGhpcyk7XG4gICAgbmV4dFRpY2tRdWV1ZS5zcGxpY2UoMCk7XG4gICAgd2hpbGUgKGRlZmVyUXVldWUubGVuZ3RoICYmIERhdGUubm93KCkgLSBjdXJyZW50VGltZSA8IE1BWF9ERUZFUl9GUkFNRV9USU1FKSB7XG4gICAgICAgIGRlZmVyUXVldWUuc2hpZnQoKS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29udGV4dHMubGVuZ3RoOyBpKyspXG4gICAgICAgIGNvbnRleHRzW2ldLnVwZGF0ZSgpO1xuICAgIGV2ZW50SGFuZGxlci5lbWl0KCdwb3N0cmVuZGVyJyk7XG59O1xuZnVuY3Rpb24gbG9vcCgpIHtcbiAgICBpZiAob3B0aW9ucy5ydW5Mb29wKSB7XG4gICAgICAgIEVuZ2luZS5zdGVwKCk7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfSBlbHNlXG4gICAgICAgIGxvb3BFbmFibGVkID0gZmFsc2U7XG59XG53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuZnVuY3Rpb24gaGFuZGxlUmVzaXplKGV2ZW50KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb250ZXh0c1tpXS5lbWl0KCdyZXNpemUnKTtcbiAgICB9XG4gICAgZXZlbnRIYW5kbGVyLmVtaXQoJ3Jlc2l6ZScpO1xufVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZSwgZmFsc2UpO1xuaGFuZGxlUmVzaXplKCk7XG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCB0cnVlKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZhbW91cy1yb290Jyk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZhbW91cy1yb290Jyk7XG59XG52YXIgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbkVuZ2luZS5waXBlID0gZnVuY3Rpb24gcGlwZSh0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0LnN1YnNjcmliZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICByZXR1cm4gdGFyZ2V0LnN1YnNjcmliZShFbmdpbmUpO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGV2ZW50SGFuZGxlci5waXBlKHRhcmdldCk7XG59O1xuRW5naW5lLnVucGlwZSA9IGZ1bmN0aW9uIHVucGlwZSh0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0LnVuc3Vic2NyaWJlIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHJldHVybiB0YXJnZXQudW5zdWJzY3JpYmUoRW5naW5lKTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBldmVudEhhbmRsZXIudW5waXBlKHRhcmdldCk7XG59O1xuRW5naW5lLm9uID0gZnVuY3Rpb24gb24odHlwZSwgaGFuZGxlcikge1xuICAgIGlmICghKHR5cGUgaW4gZXZlbnRGb3J3YXJkZXJzKSkge1xuICAgICAgICBldmVudEZvcndhcmRlcnNbdHlwZV0gPSBldmVudEhhbmRsZXIuZW1pdC5iaW5kKGV2ZW50SGFuZGxlciwgdHlwZSk7XG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZXZlbnRGb3J3YXJkZXJzW3R5cGVdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEVuZ2luZS5uZXh0VGljayhmdW5jdGlvbiAodHlwZSwgZm9yd2FyZGVyKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZvcndhcmRlcik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcywgdHlwZSwgZXZlbnRGb3J3YXJkZXJzW3R5cGVdKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV2ZW50SGFuZGxlci5vbih0eXBlLCBoYW5kbGVyKTtcbn07XG5FbmdpbmUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSwgZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnRIYW5kbGVyLmVtaXQodHlwZSwgZXZlbnQpO1xufTtcbkVuZ2luZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZXZlbnRIYW5kbGVyLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGhhbmRsZXIpO1xufTtcbkVuZ2luZS5nZXRGUFMgPSBmdW5jdGlvbiBnZXRGUFMoKSB7XG4gICAgcmV0dXJuIDEwMDAgLyBmcmFtZVRpbWU7XG59O1xuRW5naW5lLnNldEZQU0NhcCA9IGZ1bmN0aW9uIHNldEZQU0NhcChmcHMpIHtcbiAgICBmcmFtZVRpbWVMaW1pdCA9IE1hdGguZmxvb3IoMTAwMCAvIGZwcyk7XG59O1xuRW5naW5lLmdldE9wdGlvbnMgPSBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiBvcHRpb25zTWFuYWdlci5nZXRPcHRpb25zLmFwcGx5KG9wdGlvbnNNYW5hZ2VyLCBhcmd1bWVudHMpO1xufTtcbkVuZ2luZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnNNYW5hZ2VyLnNldE9wdGlvbnMuYXBwbHkob3B0aW9uc01hbmFnZXIsIGFyZ3VtZW50cyk7XG59O1xuRW5naW5lLmNyZWF0ZUNvbnRleHQgPSBmdW5jdGlvbiBjcmVhdGVDb250ZXh0KGVsKSB7XG4gICAgaWYgKCFpbml0aWFsaXplZCAmJiBvcHRpb25zLmFwcE1vZGUpXG4gICAgICAgIGluaXRpYWxpemUoKTtcbiAgICB2YXIgbmVlZE1vdW50Q29udGFpbmVyID0gZmFsc2U7XG4gICAgaWYgKCFlbCkge1xuICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy5jb250YWluZXJUeXBlKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChvcHRpb25zLmNvbnRhaW5lckNsYXNzKTtcbiAgICAgICAgbmVlZE1vdW50Q29udGFpbmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dChlbCk7XG4gICAgRW5naW5lLnJlZ2lzdGVyQ29udGV4dChjb250ZXh0KTtcbiAgICBpZiAobmVlZE1vdW50Q29udGFpbmVyKSB7XG4gICAgICAgIEVuZ2luZS5uZXh0VGljayhmdW5jdGlvbiAoY29udGV4dCwgZWwpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICAgICAgY29udGV4dC5lbWl0KCdyZXNpemUnKTtcbiAgICAgICAgfS5iaW5kKHRoaXMsIGNvbnRleHQsIGVsKSk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0O1xufTtcbkVuZ2luZS5yZWdpc3RlckNvbnRleHQgPSBmdW5jdGlvbiByZWdpc3RlckNvbnRleHQoY29udGV4dCkge1xuICAgIGNvbnRleHRzLnB1c2goY29udGV4dCk7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG59O1xuRW5naW5lLmdldENvbnRleHRzID0gZnVuY3Rpb24gZ2V0Q29udGV4dHMoKSB7XG4gICAgcmV0dXJuIGNvbnRleHRzO1xufTtcbkVuZ2luZS5kZXJlZ2lzdGVyQ29udGV4dCA9IGZ1bmN0aW9uIGRlcmVnaXN0ZXJDb250ZXh0KGNvbnRleHQpIHtcbiAgICB2YXIgaSA9IGNvbnRleHRzLmluZGV4T2YoY29udGV4dCk7XG4gICAgaWYgKGkgPj0gMClcbiAgICAgICAgY29udGV4dHMuc3BsaWNlKGksIDEpO1xufTtcbkVuZ2luZS5uZXh0VGljayA9IGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgbmV4dFRpY2tRdWV1ZS5wdXNoKGZuKTtcbn07XG5FbmdpbmUuZGVmZXIgPSBmdW5jdGlvbiBkZWZlcihmbikge1xuICAgIGRlZmVyUXVldWUucHVzaChmbik7XG59O1xub3B0aW9uc01hbmFnZXIub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEuaWQgPT09ICdmcHNDYXAnKVxuICAgICAgICBFbmdpbmUuc2V0RlBTQ2FwKGRhdGEudmFsdWUpO1xuICAgIGVsc2UgaWYgKGRhdGEuaWQgPT09ICdydW5Mb29wJykge1xuICAgICAgICBpZiAoIWxvb3BFbmFibGVkICYmIGRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIGxvb3BFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbm1vZHVsZS5leHBvcnRzID0gRW5naW5lOyIsInZhciBlbnRpdGllcyA9IFtdO1xuZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgcmV0dXJuIGVudGl0aWVzW2lkXTtcbn1cbmZ1bmN0aW9uIHNldChpZCwgZW50aXR5KSB7XG4gICAgZW50aXRpZXNbaWRdID0gZW50aXR5O1xufVxuZnVuY3Rpb24gcmVnaXN0ZXIoZW50aXR5KSB7XG4gICAgdmFyIGlkID0gZW50aXRpZXMubGVuZ3RoO1xuICAgIHNldChpZCwgZW50aXR5KTtcbiAgICByZXR1cm4gaWQ7XG59XG5mdW5jdGlvbiB1bnJlZ2lzdGVyKGlkKSB7XG4gICAgc2V0KGlkLCBudWxsKTtcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlZ2lzdGVyOiByZWdpc3RlcixcbiAgICB1bnJlZ2lzdGVyOiB1bnJlZ2lzdGVyLFxuICAgIGdldDogZ2V0LFxuICAgIHNldDogc2V0XG59OyIsImZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuX293bmVyID0gdGhpcztcbn1cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSwgZXZlbnQpIHtcbiAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXTtcbiAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlcnNbaV0uY2FsbCh0aGlzLl9vd25lciwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbih0eXBlLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEodHlwZSBpbiB0aGlzLmxpc3RlbmVycykpXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgdmFyIGluZGV4ID0gdGhpcy5saXN0ZW5lcnNbdHlwZV0uaW5kZXhPZihoYW5kbGVyKTtcbiAgICBpZiAoaW5kZXggPCAwKVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKGhhbmRsZXIpO1xuICAgIHJldHVybiB0aGlzO1xufTtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGhhbmRsZXIpIHtcbiAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXTtcbiAgICBpZiAobGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgaW5kZXggPSBsaXN0ZW5lci5pbmRleE9mKGhhbmRsZXIpO1xuICAgICAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgICAgICAgIGxpc3RlbmVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYmluZFRoaXMgPSBmdW5jdGlvbiBiaW5kVGhpcyhvd25lcikge1xuICAgIHRoaXMuX293bmVyID0gb3duZXI7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7IiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vRXZlbnRFbWl0dGVyJyk7XG5mdW5jdGlvbiBFdmVudEhhbmRsZXIoKSB7XG4gICAgRXZlbnRFbWl0dGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5kb3duc3RyZWFtID0gW107XG4gICAgdGhpcy5kb3duc3RyZWFtRm4gPSBbXTtcbiAgICB0aGlzLnVwc3RyZWFtID0gW107XG4gICAgdGhpcy51cHN0cmVhbUxpc3RlbmVycyA9IHt9O1xufVxuRXZlbnRIYW5kbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7XG5FdmVudEhhbmRsZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRXZlbnRIYW5kbGVyO1xuRXZlbnRIYW5kbGVyLnNldElucHV0SGFuZGxlciA9IGZ1bmN0aW9uIHNldElucHV0SGFuZGxlcihvYmplY3QsIGhhbmRsZXIpIHtcbiAgICBvYmplY3QudHJpZ2dlciA9IGhhbmRsZXIudHJpZ2dlci5iaW5kKGhhbmRsZXIpO1xuICAgIGlmIChoYW5kbGVyLnN1YnNjcmliZSAmJiBoYW5kbGVyLnVuc3Vic2NyaWJlKSB7XG4gICAgICAgIG9iamVjdC5zdWJzY3JpYmUgPSBoYW5kbGVyLnN1YnNjcmliZS5iaW5kKGhhbmRsZXIpO1xuICAgICAgICBvYmplY3QudW5zdWJzY3JpYmUgPSBoYW5kbGVyLnVuc3Vic2NyaWJlLmJpbmQoaGFuZGxlcik7XG4gICAgfVxufTtcbkV2ZW50SGFuZGxlci5zZXRPdXRwdXRIYW5kbGVyID0gZnVuY3Rpb24gc2V0T3V0cHV0SGFuZGxlcihvYmplY3QsIGhhbmRsZXIpIHtcbiAgICBpZiAoaGFuZGxlciBpbnN0YW5jZW9mIEV2ZW50SGFuZGxlcilcbiAgICAgICAgaGFuZGxlci5iaW5kVGhpcyhvYmplY3QpO1xuICAgIG9iamVjdC5waXBlID0gaGFuZGxlci5waXBlLmJpbmQoaGFuZGxlcik7XG4gICAgb2JqZWN0LnVucGlwZSA9IGhhbmRsZXIudW5waXBlLmJpbmQoaGFuZGxlcik7XG4gICAgb2JqZWN0Lm9uID0gaGFuZGxlci5vbi5iaW5kKGhhbmRsZXIpO1xuICAgIG9iamVjdC5hZGRMaXN0ZW5lciA9IG9iamVjdC5vbjtcbiAgICBvYmplY3QucmVtb3ZlTGlzdGVuZXIgPSBoYW5kbGVyLnJlbW92ZUxpc3RlbmVyLmJpbmQoaGFuZGxlcik7XG59O1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBldmVudCkge1xuICAgIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kb3duc3RyZWFtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmRvd25zdHJlYW1baV0udHJpZ2dlcilcbiAgICAgICAgICAgIHRoaXMuZG93bnN0cmVhbVtpXS50cmlnZ2VyKHR5cGUsIGV2ZW50KTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZG93bnN0cmVhbUZuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZG93bnN0cmVhbUZuW2ldKHR5cGUsIGV2ZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS50cmlnZ2VyID0gRXZlbnRIYW5kbGVyLnByb3RvdHlwZS5lbWl0O1xuRXZlbnRIYW5kbGVyLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gcGlwZSh0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0LnN1YnNjcmliZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICByZXR1cm4gdGFyZ2V0LnN1YnNjcmliZSh0aGlzKTtcbiAgICB2YXIgZG93bnN0cmVhbUN0eCA9IHRhcmdldCBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gdGhpcy5kb3duc3RyZWFtRm4gOiB0aGlzLmRvd25zdHJlYW07XG4gICAgdmFyIGluZGV4ID0gZG93bnN0cmVhbUN0eC5pbmRleE9mKHRhcmdldCk7XG4gICAgaWYgKGluZGV4IDwgMClcbiAgICAgICAgZG93bnN0cmVhbUN0eC5wdXNoKHRhcmdldCk7XG4gICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICB0YXJnZXQoJ3BpcGUnLCBudWxsKTtcbiAgICBlbHNlIGlmICh0YXJnZXQudHJpZ2dlcilcbiAgICAgICAgdGFyZ2V0LnRyaWdnZXIoJ3BpcGUnLCBudWxsKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbkV2ZW50SGFuZGxlci5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQudW5zdWJzY3JpYmUgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgcmV0dXJuIHRhcmdldC51bnN1YnNjcmliZSh0aGlzKTtcbiAgICB2YXIgZG93bnN0cmVhbUN0eCA9IHRhcmdldCBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gdGhpcy5kb3duc3RyZWFtRm4gOiB0aGlzLmRvd25zdHJlYW07XG4gICAgdmFyIGluZGV4ID0gZG93bnN0cmVhbUN0eC5pbmRleE9mKHRhcmdldCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgZG93bnN0cmVhbUN0eC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgICAgICB0YXJnZXQoJ3VucGlwZScsIG51bGwpO1xuICAgICAgICBlbHNlIGlmICh0YXJnZXQudHJpZ2dlcilcbiAgICAgICAgICAgIHRhcmdldC50cmlnZ2VyKCd1bnBpcGUnLCBudWxsKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xufTtcbkV2ZW50SGFuZGxlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbih0eXBlLCBoYW5kbGVyKSB7XG4gICAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICghKHR5cGUgaW4gdGhpcy51cHN0cmVhbUxpc3RlbmVycykpIHtcbiAgICAgICAgdmFyIHVwc3RyZWFtTGlzdGVuZXIgPSB0aGlzLnRyaWdnZXIuYmluZCh0aGlzLCB0eXBlKTtcbiAgICAgICAgdGhpcy51cHN0cmVhbUxpc3RlbmVyc1t0eXBlXSA9IHVwc3RyZWFtTGlzdGVuZXI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy51cHN0cmVhbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy51cHN0cmVhbVtpXS5vbih0eXBlLCB1cHN0cmVhbUxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5FdmVudEhhbmRsZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRIYW5kbGVyLnByb3RvdHlwZS5vbjtcbkV2ZW50SGFuZGxlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gc3Vic2NyaWJlKHNvdXJjZSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMudXBzdHJlYW0uaW5kZXhPZihzb3VyY2UpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgdGhpcy51cHN0cmVhbS5wdXNoKHNvdXJjZSk7XG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy51cHN0cmVhbUxpc3RlbmVycykge1xuICAgICAgICAgICAgc291cmNlLm9uKHR5cGUsIHRoaXMudXBzdHJlYW1MaXN0ZW5lcnNbdHlwZV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkV2ZW50SGFuZGxlci5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiB1bnN1YnNjcmliZShzb3VyY2UpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLnVwc3RyZWFtLmluZGV4T2Yoc291cmNlKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLnVwc3RyZWFtLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy51cHN0cmVhbUxpc3RlbmVycykge1xuICAgICAgICAgICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKHR5cGUsIHRoaXMudXBzdHJlYW1MaXN0ZW5lcnNbdHlwZV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRIYW5kbGVyOyIsInZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybScpO1xudmFyIFRyYW5zaXRpb25hYmxlID0gcmVxdWlyZSgnZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlJyk7XG52YXIgVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0gPSByZXF1aXJlKCdmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0nKTtcbmZ1bmN0aW9uIE1vZGlmaWVyKG9wdGlvbnMpIHtcbiAgICB0aGlzLl90cmFuc2Zvcm1HZXR0ZXIgPSBudWxsO1xuICAgIHRoaXMuX29wYWNpdHlHZXR0ZXIgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbkdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fYWxpZ25HZXR0ZXIgPSBudWxsO1xuICAgIHRoaXMuX3NpemVHZXR0ZXIgPSBudWxsO1xuICAgIHRoaXMuX2xlZ2FjeVN0YXRlcyA9IHt9O1xuICAgIHRoaXMuX291dHB1dCA9IHtcbiAgICAgICAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0uaWRlbnRpdHksXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIG9yaWdpbjogbnVsbCxcbiAgICAgICAgYWxpZ246IG51bGwsXG4gICAgICAgIHNpemU6IG51bGwsXG4gICAgICAgIHRhcmdldDogbnVsbFxuICAgIH07XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudHJhbnNmb3JtKVxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Gcm9tKG9wdGlvbnMudHJhbnNmb3JtKTtcbiAgICAgICAgaWYgKG9wdGlvbnMub3BhY2l0eSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5RnJvbShvcHRpb25zLm9wYWNpdHkpO1xuICAgICAgICBpZiAob3B0aW9ucy5vcmlnaW4pXG4gICAgICAgICAgICB0aGlzLm9yaWdpbkZyb20ob3B0aW9ucy5vcmlnaW4pO1xuICAgICAgICBpZiAob3B0aW9ucy5hbGlnbilcbiAgICAgICAgICAgIHRoaXMuYWxpZ25Gcm9tKG9wdGlvbnMuYWxpZ24pO1xuICAgICAgICBpZiAob3B0aW9ucy5zaXplKVxuICAgICAgICAgICAgdGhpcy5zaXplRnJvbShvcHRpb25zLnNpemUpO1xuICAgIH1cbn1cbk1vZGlmaWVyLnByb3RvdHlwZS50cmFuc2Zvcm1Gcm9tID0gZnVuY3Rpb24gdHJhbnNmb3JtRnJvbSh0cmFuc2Zvcm0pIHtcbiAgICBpZiAodHJhbnNmb3JtIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUdldHRlciA9IHRyYW5zZm9ybTtcbiAgICBlbHNlIGlmICh0cmFuc2Zvcm0gaW5zdGFuY2VvZiBPYmplY3QgJiYgdHJhbnNmb3JtLmdldClcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtR2V0dGVyID0gdHJhbnNmb3JtLmdldC5iaW5kKHRyYW5zZm9ybSk7XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUdldHRlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX291dHB1dC50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5vcGFjaXR5RnJvbSA9IGZ1bmN0aW9uIG9wYWNpdHlGcm9tKG9wYWNpdHkpIHtcbiAgICBpZiAob3BhY2l0eSBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICB0aGlzLl9vcGFjaXR5R2V0dGVyID0gb3BhY2l0eTtcbiAgICBlbHNlIGlmIChvcGFjaXR5IGluc3RhbmNlb2YgT2JqZWN0ICYmIG9wYWNpdHkuZ2V0KVxuICAgICAgICB0aGlzLl9vcGFjaXR5R2V0dGVyID0gb3BhY2l0eS5nZXQuYmluZChvcGFjaXR5KTtcbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fb3BhY2l0eUdldHRlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX291dHB1dC5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLm9yaWdpbkZyb20gPSBmdW5jdGlvbiBvcmlnaW5Gcm9tKG9yaWdpbikge1xuICAgIGlmIChvcmlnaW4gaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgdGhpcy5fb3JpZ2luR2V0dGVyID0gb3JpZ2luO1xuICAgIGVsc2UgaWYgKG9yaWdpbiBpbnN0YW5jZW9mIE9iamVjdCAmJiBvcmlnaW4uZ2V0KVxuICAgICAgICB0aGlzLl9vcmlnaW5HZXR0ZXIgPSBvcmlnaW4uZ2V0LmJpbmQob3JpZ2luKTtcbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fb3JpZ2luR2V0dGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3V0cHV0Lm9yaWdpbiA9IG9yaWdpbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmFsaWduRnJvbSA9IGZ1bmN0aW9uIGFsaWduRnJvbShhbGlnbikge1xuICAgIGlmIChhbGlnbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICB0aGlzLl9hbGlnbkdldHRlciA9IGFsaWduO1xuICAgIGVsc2UgaWYgKGFsaWduIGluc3RhbmNlb2YgT2JqZWN0ICYmIGFsaWduLmdldClcbiAgICAgICAgdGhpcy5fYWxpZ25HZXR0ZXIgPSBhbGlnbi5nZXQuYmluZChhbGlnbik7XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2FsaWduR2V0dGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3V0cHV0LmFsaWduID0gYWxpZ247XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5zaXplRnJvbSA9IGZ1bmN0aW9uIHNpemVGcm9tKHNpemUpIHtcbiAgICBpZiAoc2l6ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICB0aGlzLl9zaXplR2V0dGVyID0gc2l6ZTtcbiAgICBlbHNlIGlmIChzaXplIGluc3RhbmNlb2YgT2JqZWN0ICYmIHNpemUuZ2V0KVxuICAgICAgICB0aGlzLl9zaXplR2V0dGVyID0gc2l6ZS5nZXQuYmluZChzaXplKTtcbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2l6ZUdldHRlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX291dHB1dC5zaXplID0gc2l6ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLnNldFRyYW5zZm9ybSA9IGZ1bmN0aW9uIHNldFRyYW5zZm9ybSh0cmFuc2Zvcm0sIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRyYW5zaXRpb24gfHwgdGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybSkge1xuICAgICAgICBpZiAoIXRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0gPSBuZXcgVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0odGhpcy5fb3V0cHV0LnRyYW5zZm9ybSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl90cmFuc2Zvcm1HZXR0ZXIpXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUZyb20odGhpcy5fbGVnYWN5U3RhdGVzLnRyYW5zZm9ybSk7XG4gICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0uc2V0KHRyYW5zZm9ybSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRnJvbSh0cmFuc2Zvcm0pO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5zZXRPcGFjaXR5ID0gZnVuY3Rpb24gc2V0T3BhY2l0eShvcGFjaXR5LCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICh0cmFuc2l0aW9uIHx8IHRoaXMuX2xlZ2FjeVN0YXRlcy5vcGFjaXR5KSB7XG4gICAgICAgIGlmICghdGhpcy5fbGVnYWN5U3RhdGVzLm9wYWNpdHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy5vcGFjaXR5ID0gbmV3IFRyYW5zaXRpb25hYmxlKHRoaXMuX291dHB1dC5vcGFjaXR5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX29wYWNpdHlHZXR0ZXIpXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlGcm9tKHRoaXMuX2xlZ2FjeVN0YXRlcy5vcGFjaXR5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlZ2FjeVN0YXRlcy5vcGFjaXR5LnNldChvcGFjaXR5LCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHlGcm9tKG9wYWNpdHkpO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5zZXRPcmlnaW4gPSBmdW5jdGlvbiBzZXRPcmlnaW4ob3JpZ2luLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICh0cmFuc2l0aW9uIHx8IHRoaXMuX2xlZ2FjeVN0YXRlcy5vcmlnaW4pIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sZWdhY3lTdGF0ZXMub3JpZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMub3JpZ2luID0gbmV3IFRyYW5zaXRpb25hYmxlKHRoaXMuX291dHB1dC5vcmlnaW4gfHwgW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5HZXR0ZXIpXG4gICAgICAgICAgICB0aGlzLm9yaWdpbkZyb20odGhpcy5fbGVnYWN5U3RhdGVzLm9yaWdpbik7XG4gICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy5vcmlnaW4uc2V0KG9yaWdpbiwgdHJhbnNpdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luRnJvbShvcmlnaW4pO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5zZXRBbGlnbiA9IGZ1bmN0aW9uIHNldEFsaWduKGFsaWduLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICh0cmFuc2l0aW9uIHx8IHRoaXMuX2xlZ2FjeVN0YXRlcy5hbGlnbikge1xuICAgICAgICBpZiAoIXRoaXMuX2xlZ2FjeVN0YXRlcy5hbGlnbikge1xuICAgICAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLmFsaWduID0gbmV3IFRyYW5zaXRpb25hYmxlKHRoaXMuX291dHB1dC5hbGlnbiB8fCBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2FsaWduR2V0dGVyKVxuICAgICAgICAgICAgdGhpcy5hbGlnbkZyb20odGhpcy5fbGVnYWN5U3RhdGVzLmFsaWduKTtcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLmFsaWduLnNldChhbGlnbiwgdHJhbnNpdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxpZ25Gcm9tKGFsaWduKTtcbn07XG5Nb2RpZmllci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uIHNldFNpemUoc2l6ZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAoc2l6ZSAmJiAodHJhbnNpdGlvbiB8fCB0aGlzLl9sZWdhY3lTdGF0ZXMuc2l6ZSkpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sZWdhY3lTdGF0ZXMuc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLnNpemUgPSBuZXcgVHJhbnNpdGlvbmFibGUodGhpcy5fb3V0cHV0LnNpemUgfHwgW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zaXplR2V0dGVyKVxuICAgICAgICAgICAgdGhpcy5zaXplRnJvbSh0aGlzLl9sZWdhY3lTdGF0ZXMuc2l6ZSk7XG4gICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy5zaXplLnNldChzaXplLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy5zaXplRnJvbShzaXplKTtcbn07XG5Nb2RpZmllci5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgaWYgKHRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0pXG4gICAgICAgIHRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0uaGFsdCgpO1xuICAgIGlmICh0aGlzLl9sZWdhY3lTdGF0ZXMub3BhY2l0eSlcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLm9wYWNpdHkuaGFsdCgpO1xuICAgIGlmICh0aGlzLl9sZWdhY3lTdGF0ZXMub3JpZ2luKVxuICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMub3JpZ2luLmhhbHQoKTtcbiAgICBpZiAodGhpcy5fbGVnYWN5U3RhdGVzLmFsaWduKVxuICAgICAgICB0aGlzLl9sZWdhY3lTdGF0ZXMuYWxpZ24uaGFsdCgpO1xuICAgIGlmICh0aGlzLl9sZWdhY3lTdGF0ZXMuc2l6ZSlcbiAgICAgICAgdGhpcy5fbGVnYWN5U3RhdGVzLnNpemUuaGFsdCgpO1xuICAgIHRoaXMuX3RyYW5zZm9ybUdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fb3BhY2l0eUdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ2luR2V0dGVyID0gbnVsbDtcbiAgICB0aGlzLl9hbGlnbkdldHRlciA9IG51bGw7XG4gICAgdGhpcy5fc2l6ZUdldHRlciA9IG51bGw7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmdldFRyYW5zZm9ybSA9IGZ1bmN0aW9uIGdldFRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNmb3JtR2V0dGVyKCk7XG59O1xuTW9kaWZpZXIucHJvdG90eXBlLmdldEZpbmFsVHJhbnNmb3JtID0gZnVuY3Rpb24gZ2V0RmluYWxUcmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xlZ2FjeVN0YXRlcy50cmFuc2Zvcm0gPyB0aGlzLl9sZWdhY3lTdGF0ZXMudHJhbnNmb3JtLmdldEZpbmFsKCkgOiB0aGlzLl9vdXRwdXQudHJhbnNmb3JtO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5nZXRPcGFjaXR5ID0gZnVuY3Rpb24gZ2V0T3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3BhY2l0eUdldHRlcigpO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5nZXRPcmlnaW4gPSBmdW5jdGlvbiBnZXRPcmlnaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbkdldHRlcigpO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5nZXRBbGlnbiA9IGZ1bmN0aW9uIGdldEFsaWduKCkge1xuICAgIHJldHVybiB0aGlzLl9hbGlnbkdldHRlcigpO1xufTtcbk1vZGlmaWVyLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2l6ZUdldHRlciA/IHRoaXMuX3NpemVHZXR0ZXIoKSA6IHRoaXMuX291dHB1dC5zaXplO1xufTtcbmZ1bmN0aW9uIF91cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuX3RyYW5zZm9ybUdldHRlcilcbiAgICAgICAgdGhpcy5fb3V0cHV0LnRyYW5zZm9ybSA9IHRoaXMuX3RyYW5zZm9ybUdldHRlcigpO1xuICAgIGlmICh0aGlzLl9vcGFjaXR5R2V0dGVyKVxuICAgICAgICB0aGlzLl9vdXRwdXQub3BhY2l0eSA9IHRoaXMuX29wYWNpdHlHZXR0ZXIoKTtcbiAgICBpZiAodGhpcy5fb3JpZ2luR2V0dGVyKVxuICAgICAgICB0aGlzLl9vdXRwdXQub3JpZ2luID0gdGhpcy5fb3JpZ2luR2V0dGVyKCk7XG4gICAgaWYgKHRoaXMuX2FsaWduR2V0dGVyKVxuICAgICAgICB0aGlzLl9vdXRwdXQuYWxpZ24gPSB0aGlzLl9hbGlnbkdldHRlcigpO1xuICAgIGlmICh0aGlzLl9zaXplR2V0dGVyKVxuICAgICAgICB0aGlzLl9vdXRwdXQuc2l6ZSA9IHRoaXMuX3NpemVHZXR0ZXIoKTtcbn1cbk1vZGlmaWVyLnByb3RvdHlwZS5tb2RpZnkgPSBmdW5jdGlvbiBtb2RpZnkodGFyZ2V0KSB7XG4gICAgX3VwZGF0ZS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuX291dHB1dC50YXJnZXQgPSB0YXJnZXQ7XG4gICAgcmV0dXJuIHRoaXMuX291dHB1dDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1vZGlmaWVyOyIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuL0V2ZW50SGFuZGxlcicpO1xuZnVuY3Rpb24gT3B0aW9uc01hbmFnZXIodmFsdWUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuZXZlbnRPdXRwdXQgPSBudWxsO1xufVxuT3B0aW9uc01hbmFnZXIucGF0Y2ggPSBmdW5jdGlvbiBwYXRjaE9iamVjdChzb3VyY2UsIGRhdGEpIHtcbiAgICB2YXIgbWFuYWdlciA9IG5ldyBPcHRpb25zTWFuYWdlcihzb3VyY2UpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICBtYW5hZ2VyLnBhdGNoKGFyZ3VtZW50c1tpXSk7XG4gICAgcmV0dXJuIHNvdXJjZTtcbn07XG5mdW5jdGlvbiBfY3JlYXRlRXZlbnRPdXRwdXQoKSB7XG4gICAgdGhpcy5ldmVudE91dHB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLmV2ZW50T3V0cHV0LmJpbmRUaGlzKHRoaXMpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRPdXRwdXRIYW5kbGVyKHRoaXMsIHRoaXMuZXZlbnRPdXRwdXQpO1xufVxuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLnBhdGNoID0gZnVuY3Rpb24gcGF0Y2goKSB7XG4gICAgdmFyIG15U3RhdGUgPSB0aGlzLl92YWx1ZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGF0YSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoayBpbiBteVN0YXRlICYmIChkYXRhW2tdICYmIGRhdGFba10uY29uc3RydWN0b3IgPT09IE9iamVjdCkgJiYgKG15U3RhdGVba10gJiYgbXlTdGF0ZVtrXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIGlmICghbXlTdGF0ZS5oYXNPd25Qcm9wZXJ0eShrKSlcbiAgICAgICAgICAgICAgICAgICAgbXlTdGF0ZVtrXSA9IE9iamVjdC5jcmVhdGUobXlTdGF0ZVtrXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXkoaykucGF0Y2goZGF0YVtrXSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRPdXRwdXQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRPdXRwdXQuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGssXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5rZXkoaykudmFsdWUoKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGssIGRhdGFba10pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLnBhdGNoO1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLmtleSA9IGZ1bmN0aW9uIGtleShpZGVudGlmaWVyKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBPcHRpb25zTWFuYWdlcih0aGlzLl92YWx1ZVtpZGVudGlmaWVyXSk7XG4gICAgaWYgKCEocmVzdWx0Ll92YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkgfHwgcmVzdWx0Ll92YWx1ZSBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICByZXN1bHQuX3ZhbHVlID0ge307XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVtrZXldO1xufTtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5nZXRPcHRpb25zID0gT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLmdldDtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBvcmlnaW5hbFZhbHVlID0gdGhpcy5nZXQoa2V5KTtcbiAgICB0aGlzLl92YWx1ZVtrZXldID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuZXZlbnRPdXRwdXQgJiYgdmFsdWUgIT09IG9yaWdpbmFsVmFsdWUpXG4gICAgICAgIHRoaXMuZXZlbnRPdXRwdXQuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICAgICAgaWQ6IGtleSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG59O1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oKSB7XG4gICAgX2NyZWF0ZUV2ZW50T3V0cHV0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMub24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PcHRpb25zTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9wdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5waXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT3B0aW9uc01hbmFnZXIucHJvdG90eXBlLnVucGlwZSA9IGZ1bmN0aW9uIHVucGlwZSgpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy51bnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE9wdGlvbnNNYW5hZ2VyOyIsInZhciBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpO1xudmFyIFNwZWNQYXJzZXIgPSByZXF1aXJlKCcuL1NwZWNQYXJzZXInKTtcbmZ1bmN0aW9uIFJlbmRlck5vZGUob2JqZWN0KSB7XG4gICAgdGhpcy5fb2JqZWN0ID0gbnVsbDtcbiAgICB0aGlzLl9jaGlsZCA9IG51bGw7XG4gICAgdGhpcy5faGFzTXVsdGlwbGVDaGlsZHJlbiA9IGZhbHNlO1xuICAgIHRoaXMuX2lzUmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2lzTW9kaWZpZXIgPSBmYWxzZTtcbiAgICB0aGlzLl9yZXN1bHRDYWNoZSA9IHt9O1xuICAgIHRoaXMuX3ByZXZSZXN1bHRzID0ge307XG4gICAgdGhpcy5fY2hpbGRSZXN1bHQgPSBudWxsO1xuICAgIGlmIChvYmplY3QpXG4gICAgICAgIHRoaXMuc2V0KG9iamVjdCk7XG59XG5SZW5kZXJOb2RlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoY2hpbGQpIHtcbiAgICB2YXIgY2hpbGROb2RlID0gY2hpbGQgaW5zdGFuY2VvZiBSZW5kZXJOb2RlID8gY2hpbGQgOiBuZXcgUmVuZGVyTm9kZShjaGlsZCk7XG4gICAgaWYgKHRoaXMuX2NoaWxkIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgIHRoaXMuX2NoaWxkLnB1c2goY2hpbGROb2RlKTtcbiAgICBlbHNlIGlmICh0aGlzLl9jaGlsZCkge1xuICAgICAgICB0aGlzLl9jaGlsZCA9IFtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkLFxuICAgICAgICAgICAgY2hpbGROb2RlXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX2hhc011bHRpcGxlQ2hpbGRyZW4gPSB0cnVlO1xuICAgICAgICB0aGlzLl9jaGlsZFJlc3VsdCA9IFtdO1xuICAgIH0gZWxzZVxuICAgICAgICB0aGlzLl9jaGlsZCA9IGNoaWxkTm9kZTtcbiAgICByZXR1cm4gY2hpbGROb2RlO1xufTtcblJlbmRlck5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2JqZWN0IHx8ICh0aGlzLl9oYXNNdWx0aXBsZUNoaWxkcmVuID8gbnVsbCA6IHRoaXMuX2NoaWxkID8gdGhpcy5fY2hpbGQuZ2V0KCkgOiBudWxsKTtcbn07XG5SZW5kZXJOb2RlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoY2hpbGQpIHtcbiAgICB0aGlzLl9jaGlsZFJlc3VsdCA9IG51bGw7XG4gICAgdGhpcy5faGFzTXVsdGlwbGVDaGlsZHJlbiA9IGZhbHNlO1xuICAgIHRoaXMuX2lzUmVuZGVyYWJsZSA9IGNoaWxkLnJlbmRlciA/IHRydWUgOiBmYWxzZTtcbiAgICB0aGlzLl9pc01vZGlmaWVyID0gY2hpbGQubW9kaWZ5ID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMuX29iamVjdCA9IGNoaWxkO1xuICAgIHRoaXMuX2NoaWxkID0gbnVsbDtcbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBSZW5kZXJOb2RlKVxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gdGhpcztcbn07XG5SZW5kZXJOb2RlLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXQoKTtcbiAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5nZXRTaXplKVxuICAgICAgICByZXN1bHQgPSB0YXJnZXQuZ2V0U2l6ZSgpO1xuICAgIGlmICghcmVzdWx0ICYmIHRoaXMuX2NoaWxkICYmIHRoaXMuX2NoaWxkLmdldFNpemUpXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2NoaWxkLmdldFNpemUoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmZ1bmN0aW9uIF9hcHBseUNvbW1pdChzcGVjLCBjb250ZXh0LCBjYWNoZVN0b3JhZ2UpIHtcbiAgICB2YXIgcmVzdWx0ID0gU3BlY1BhcnNlci5wYXJzZShzcGVjLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlc3VsdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpZCA9IGtleXNbaV07XG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSBFbnRpdHkuZ2V0KGlkKTtcbiAgICAgICAgdmFyIGNvbW1pdFBhcmFtcyA9IHJlc3VsdFtpZF07XG4gICAgICAgIGNvbW1pdFBhcmFtcy5hbGxvY2F0b3IgPSBjb250ZXh0LmFsbG9jYXRvcjtcbiAgICAgICAgdmFyIGNvbW1pdFJlc3VsdCA9IGNoaWxkTm9kZS5jb21taXQoY29tbWl0UGFyYW1zKTtcbiAgICAgICAgaWYgKGNvbW1pdFJlc3VsdClcbiAgICAgICAgICAgIF9hcHBseUNvbW1pdChjb21taXRSZXN1bHQsIGNvbnRleHQsIGNhY2hlU3RvcmFnZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNhY2hlU3RvcmFnZVtpZF0gPSBjb21taXRQYXJhbXM7XG4gICAgfVxufVxuUmVuZGVyTm9kZS5wcm90b3R5cGUuY29tbWl0ID0gZnVuY3Rpb24gY29tbWl0KGNvbnRleHQpIHtcbiAgICB2YXIgcHJldktleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9wcmV2UmVzdWx0cyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2S2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaWQgPSBwcmV2S2V5c1tpXTtcbiAgICAgICAgaWYgKHRoaXMuX3Jlc3VsdENhY2hlW2lkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRW50aXR5LmdldChpZCk7XG4gICAgICAgICAgICBpZiAob2JqZWN0LmNsZWFudXApXG4gICAgICAgICAgICAgICAgb2JqZWN0LmNsZWFudXAoY29udGV4dC5hbGxvY2F0b3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3ByZXZSZXN1bHRzID0gdGhpcy5fcmVzdWx0Q2FjaGU7XG4gICAgdGhpcy5fcmVzdWx0Q2FjaGUgPSB7fTtcbiAgICBfYXBwbHlDb21taXQodGhpcy5yZW5kZXIoKSwgY29udGV4dCwgdGhpcy5fcmVzdWx0Q2FjaGUpO1xufTtcblJlbmRlck5vZGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5faXNSZW5kZXJhYmxlKVxuICAgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0LnJlbmRlcigpO1xuICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgIGlmICh0aGlzLl9oYXNNdWx0aXBsZUNoaWxkcmVuKSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2NoaWxkUmVzdWx0O1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0W2ldID0gY2hpbGRyZW5baV0ucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NoaWxkKVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9jaGlsZC5yZW5kZXIoKTtcbiAgICByZXR1cm4gdGhpcy5faXNNb2RpZmllciA/IHRoaXMuX29iamVjdC5tb2RpZnkocmVzdWx0KSA6IHJlc3VsdDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlck5vZGU7IiwidmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG5mdW5jdGlvbiBTcGVjUGFyc2VyKCkge1xuICAgIHRoaXMucmVzdWx0ID0ge307XG59XG5TcGVjUGFyc2VyLl9pbnN0YW5jZSA9IG5ldyBTcGVjUGFyc2VyKCk7XG5TcGVjUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24gcGFyc2Uoc3BlYywgY29udGV4dCkge1xuICAgIHJldHVybiBTcGVjUGFyc2VyLl9pbnN0YW5jZS5wYXJzZShzcGVjLCBjb250ZXh0KTtcbn07XG5TcGVjUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKHNwZWMsIGNvbnRleHQpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5fcGFyc2VTcGVjKHNwZWMsIGNvbnRleHQsIFRyYW5zZm9ybS5pZGVudGl0eSk7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0O1xufTtcblNwZWNQYXJzZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgdGhpcy5yZXN1bHQgPSB7fTtcbn07XG5mdW5jdGlvbiBfdmVjSW5Db250ZXh0KHYsIG0pIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB2WzBdICogbVswXSArIHZbMV0gKiBtWzRdICsgdlsyXSAqIG1bOF0sXG4gICAgICAgIHZbMF0gKiBtWzFdICsgdlsxXSAqIG1bNV0gKyB2WzJdICogbVs5XSxcbiAgICAgICAgdlswXSAqIG1bMl0gKyB2WzFdICogbVs2XSArIHZbMl0gKiBtWzEwXVxuICAgIF07XG59XG52YXIgX29yaWdpblplcm9aZXJvID0gW1xuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXTtcblNwZWNQYXJzZXIucHJvdG90eXBlLl9wYXJzZVNwZWMgPSBmdW5jdGlvbiBfcGFyc2VTcGVjKHNwZWMsIHBhcmVudENvbnRleHQsIHNpemVDb250ZXh0KSB7XG4gICAgdmFyIGlkO1xuICAgIHZhciB0YXJnZXQ7XG4gICAgdmFyIHRyYW5zZm9ybTtcbiAgICB2YXIgb3BhY2l0eTtcbiAgICB2YXIgb3JpZ2luO1xuICAgIHZhciBhbGlnbjtcbiAgICB2YXIgc2l6ZTtcbiAgICBpZiAodHlwZW9mIHNwZWMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlkID0gc3BlYztcbiAgICAgICAgdHJhbnNmb3JtID0gcGFyZW50Q29udGV4dC50cmFuc2Zvcm07XG4gICAgICAgIGFsaWduID0gcGFyZW50Q29udGV4dC5hbGlnbiB8fCBwYXJlbnRDb250ZXh0Lm9yaWdpbjtcbiAgICAgICAgaWYgKHBhcmVudENvbnRleHQuc2l6ZSAmJiBhbGlnbiAmJiAoYWxpZ25bMF0gfHwgYWxpZ25bMV0pKSB7XG4gICAgICAgICAgICB2YXIgYWxpZ25BZGp1c3QgPSBbXG4gICAgICAgICAgICAgICAgICAgIGFsaWduWzBdICogcGFyZW50Q29udGV4dC5zaXplWzBdLFxuICAgICAgICAgICAgICAgICAgICBhbGlnblsxXSAqIHBhcmVudENvbnRleHQuc2l6ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB0cmFuc2Zvcm0gPSBUcmFuc2Zvcm0udGhlbk1vdmUodHJhbnNmb3JtLCBfdmVjSW5Db250ZXh0KGFsaWduQWRqdXN0LCBzaXplQ29udGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0W2lkXSA9IHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtLFxuICAgICAgICAgICAgb3BhY2l0eTogcGFyZW50Q29udGV4dC5vcGFjaXR5LFxuICAgICAgICAgICAgb3JpZ2luOiBwYXJlbnRDb250ZXh0Lm9yaWdpbiB8fCBfb3JpZ2luWmVyb1plcm8sXG4gICAgICAgICAgICBhbGlnbjogcGFyZW50Q29udGV4dC5hbGlnbiB8fCBwYXJlbnRDb250ZXh0Lm9yaWdpbiB8fCBfb3JpZ2luWmVyb1plcm8sXG4gICAgICAgICAgICBzaXplOiBwYXJlbnRDb250ZXh0LnNpemVcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKCFzcGVjKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHNwZWMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwZWMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcnNlU3BlYyhzcGVjW2ldLCBwYXJlbnRDb250ZXh0LCBzaXplQ29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQgPSBzcGVjLnRhcmdldDtcbiAgICAgICAgdHJhbnNmb3JtID0gcGFyZW50Q29udGV4dC50cmFuc2Zvcm07XG4gICAgICAgIG9wYWNpdHkgPSBwYXJlbnRDb250ZXh0Lm9wYWNpdHk7XG4gICAgICAgIG9yaWdpbiA9IHBhcmVudENvbnRleHQub3JpZ2luO1xuICAgICAgICBhbGlnbiA9IHBhcmVudENvbnRleHQuYWxpZ247XG4gICAgICAgIHNpemUgPSBwYXJlbnRDb250ZXh0LnNpemU7XG4gICAgICAgIHZhciBuZXh0U2l6ZUNvbnRleHQgPSBzaXplQ29udGV4dDtcbiAgICAgICAgaWYgKHNwZWMub3BhY2l0eSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgb3BhY2l0eSA9IHBhcmVudENvbnRleHQub3BhY2l0eSAqIHNwZWMub3BhY2l0eTtcbiAgICAgICAgaWYgKHNwZWMudHJhbnNmb3JtKVxuICAgICAgICAgICAgdHJhbnNmb3JtID0gVHJhbnNmb3JtLm11bHRpcGx5KHBhcmVudENvbnRleHQudHJhbnNmb3JtLCBzcGVjLnRyYW5zZm9ybSk7XG4gICAgICAgIGlmIChzcGVjLm9yaWdpbikge1xuICAgICAgICAgICAgb3JpZ2luID0gc3BlYy5vcmlnaW47XG4gICAgICAgICAgICBuZXh0U2l6ZUNvbnRleHQgPSBwYXJlbnRDb250ZXh0LnRyYW5zZm9ybTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3BlYy5hbGlnbilcbiAgICAgICAgICAgIGFsaWduID0gc3BlYy5hbGlnbjtcbiAgICAgICAgaWYgKHNwZWMuc2l6ZSkge1xuICAgICAgICAgICAgdmFyIHBhcmVudFNpemUgPSBwYXJlbnRDb250ZXh0LnNpemU7XG4gICAgICAgICAgICBzaXplID0gW1xuICAgICAgICAgICAgICAgIHNwZWMuc2l6ZVswXSAhPT0gdW5kZWZpbmVkID8gc3BlYy5zaXplWzBdIDogcGFyZW50U2l6ZVswXSxcbiAgICAgICAgICAgICAgICBzcGVjLnNpemVbMV0gIT09IHVuZGVmaW5lZCA/IHNwZWMuc2l6ZVsxXSA6IHBhcmVudFNpemVbMV1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAocGFyZW50U2l6ZSkge1xuICAgICAgICAgICAgICAgIGlmICghYWxpZ24pXG4gICAgICAgICAgICAgICAgICAgIGFsaWduID0gb3JpZ2luO1xuICAgICAgICAgICAgICAgIGlmIChhbGlnbiAmJiAoYWxpZ25bMF0gfHwgYWxpZ25bMV0pKVxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm0gPSBUcmFuc2Zvcm0udGhlbk1vdmUodHJhbnNmb3JtLCBfdmVjSW5Db250ZXh0KFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduWzBdICogcGFyZW50U2l6ZVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduWzFdICogcGFyZW50U2l6ZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICAgICAgXSwgc2l6ZUNvbnRleHQpKTtcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luICYmIChvcmlnaW5bMF0gfHwgb3JpZ2luWzFdKSlcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtID0gVHJhbnNmb3JtLm1vdmVUaGVuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC1vcmlnaW5bMF0gKiBzaXplWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgLW9yaWdpblsxXSAqIHNpemVbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgICAgIF0sIHRyYW5zZm9ybSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0U2l6ZUNvbnRleHQgPSBwYXJlbnRDb250ZXh0LnRyYW5zZm9ybTtcbiAgICAgICAgICAgIG9yaWdpbiA9IG51bGw7XG4gICAgICAgICAgICBhbGlnbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGFyc2VTcGVjKHRhcmdldCwge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICBvcGFjaXR5OiBvcGFjaXR5LFxuICAgICAgICAgICAgb3JpZ2luOiBvcmlnaW4sXG4gICAgICAgICAgICBhbGlnbjogYWxpZ24sXG4gICAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH0sIG5leHRTaXplQ29udGV4dCk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gU3BlY1BhcnNlcjsiLCJ2YXIgRWxlbWVudE91dHB1dCA9IHJlcXVpcmUoJy4vRWxlbWVudE91dHB1dCcpO1xuZnVuY3Rpb24gU3VyZmFjZShvcHRpb25zKSB7XG4gICAgRWxlbWVudE91dHB1dC5jYWxsKHRoaXMpO1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICAgIHRoaXMuY29udGVudCA9ICcnO1xuICAgIHRoaXMuY2xhc3NMaXN0ID0gW107XG4gICAgdGhpcy5zaXplID0gbnVsbDtcbiAgICB0aGlzLl9jbGFzc2VzRGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX3N0eWxlc0RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9zaXplRGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX2NvbnRlbnREaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fZGlydHlDbGFzc2VzID0gW107XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbn1cblN1cmZhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFbGVtZW50T3V0cHV0LnByb3RvdHlwZSk7XG5TdXJmYWNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1cmZhY2U7XG5TdXJmYWNlLnByb3RvdHlwZS5lbGVtZW50VHlwZSA9ICdkaXYnO1xuU3VyZmFjZS5wcm90b3R5cGUuZWxlbWVudENsYXNzID0gJ2ZhbW91cy1zdXJmYWNlJztcblN1cmZhY2UucHJvdG90eXBlLnNldFByb3BlcnRpZXMgPSBmdW5jdGlvbiBzZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpIHtcbiAgICBmb3IgKHZhciBuIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW25dID0gcHJvcGVydGllc1tuXTtcbiAgICB9XG4gICAgdGhpcy5fc3R5bGVzRGlydHkgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xufTtcblN1cmZhY2UucHJvdG90eXBlLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXM7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiBhZGRDbGFzcyhjbGFzc05hbWUpIHtcbiAgICBpZiAodGhpcy5jbGFzc0xpc3QuaW5kZXhPZihjbGFzc05hbWUpIDwgMCkge1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC5wdXNoKGNsYXNzTmFtZSk7XG4gICAgICAgIHRoaXMuX2NsYXNzZXNEaXJ0eSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblN1cmZhY2UucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLmNsYXNzTGlzdC5pbmRleE9mKGNsYXNzTmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgICB0aGlzLl9kaXJ0eUNsYXNzZXMucHVzaCh0aGlzLmNsYXNzTGlzdC5zcGxpY2UoaSwgMSlbMF0pO1xuICAgICAgICB0aGlzLl9jbGFzc2VzRGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5TdXJmYWNlLnByb3RvdHlwZS50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5jbGFzc0xpc3QuaW5kZXhPZihjbGFzc05hbWUpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuc2V0Q2xhc3NlcyA9IGZ1bmN0aW9uIHNldENsYXNzZXMoY2xhc3NMaXN0KSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciByZW1vdmFsID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjbGFzc0xpc3QuaW5kZXhPZih0aGlzLmNsYXNzTGlzdFtpXSkgPCAwKVxuICAgICAgICAgICAgcmVtb3ZhbC5wdXNoKHRoaXMuY2xhc3NMaXN0W2ldKTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IHJlbW92YWwubGVuZ3RoOyBpKyspXG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MocmVtb3ZhbFtpXSk7XG4gICAgZm9yIChpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5hZGRDbGFzcyhjbGFzc0xpc3RbaV0pO1xuICAgIHJldHVybiB0aGlzO1xufTtcblN1cmZhY2UucHJvdG90eXBlLmdldENsYXNzTGlzdCA9IGZ1bmN0aW9uIGdldENsYXNzTGlzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3Q7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uIHNldENvbnRlbnQoY29udGVudCkge1xuICAgIGlmICh0aGlzLmNvbnRlbnQgIT09IGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcbiAgICAgICAgdGhpcy5fY29udGVudERpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3VyZmFjZS5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuc2l6ZSlcbiAgICAgICAgdGhpcy5zZXRTaXplKG9wdGlvbnMuc2l6ZSk7XG4gICAgaWYgKG9wdGlvbnMuY2xhc3NlcylcbiAgICAgICAgdGhpcy5zZXRDbGFzc2VzKG9wdGlvbnMuY2xhc3Nlcyk7XG4gICAgaWYgKG9wdGlvbnMucHJvcGVydGllcylcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG9wdGlvbnMucHJvcGVydGllcyk7XG4gICAgaWYgKG9wdGlvbnMuY29udGVudClcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KG9wdGlvbnMuY29udGVudCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuZnVuY3Rpb24gX2NsZWFudXBDbGFzc2VzKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZGlydHlDbGFzc2VzLmxlbmd0aDsgaSsrKVxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9kaXJ0eUNsYXNzZXNbaV0pO1xuICAgIHRoaXMuX2RpcnR5Q2xhc3NlcyA9IFtdO1xufVxuZnVuY3Rpb24gX2FwcGx5U3R5bGVzKHRhcmdldCkge1xuICAgIGZvciAodmFyIG4gaW4gdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZVtuXSA9IHRoaXMucHJvcGVydGllc1tuXTtcbiAgICB9XG59XG5mdW5jdGlvbiBfY2xlYW51cFN0eWxlcyh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBuIGluIHRoaXMucHJvcGVydGllcykge1xuICAgICAgICB0YXJnZXQuc3R5bGVbbl0gPSAnJztcbiAgICB9XG59XG5mdW5jdGlvbiBfeHlOb3RFcXVhbHMoYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBhWzBdICE9PSBiWzBdIHx8IGFbMV0gIT09IGJbMV0gOiBhICE9PSBiO1xufVxuU3VyZmFjZS5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiBzZXR1cChhbGxvY2F0b3IpIHtcbiAgICB2YXIgdGFyZ2V0ID0gYWxsb2NhdG9yLmFsbG9jYXRlKHRoaXMuZWxlbWVudFR5cGUpO1xuICAgIGlmICh0aGlzLmVsZW1lbnRDbGFzcykge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Q2xhc3MgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRDbGFzcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKHRoaXMuZWxlbWVudENsYXNzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKHRoaXMuZWxlbWVudENsYXNzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgIHRoaXMuYXR0YWNoKHRhcmdldCk7XG4gICAgdGhpcy5fb3BhY2l0eSA9IG51bGw7XG4gICAgdGhpcy5fY3VycmVudFRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLl9zdHlsZXNEaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fY2xhc3Nlc0RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9zaXplRGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX2NvbnRlbnREaXJ0eSA9IHRydWU7XG4gICAgdGhpcy5fb3JpZ2luRGlydHkgPSB0cnVlO1xuICAgIHRoaXMuX3RyYW5zZm9ybURpcnR5ID0gdHJ1ZTtcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5jb21taXQgPSBmdW5jdGlvbiBjb21taXQoY29udGV4dCkge1xuICAgIGlmICghdGhpcy5fY3VycmVudFRhcmdldClcbiAgICAgICAgdGhpcy5zZXR1cChjb250ZXh0LmFsbG9jYXRvcik7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMuX2N1cnJlbnRUYXJnZXQ7XG4gICAgdmFyIHNpemUgPSBjb250ZXh0LnNpemU7XG4gICAgaWYgKHRoaXMuX2NsYXNzZXNEaXJ0eSkge1xuICAgICAgICBfY2xlYW51cENsYXNzZXMuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB2YXIgY2xhc3NMaXN0ID0gdGhpcy5nZXRDbGFzc0xpc3QoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc0xpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc0xpc3RbaV0pO1xuICAgICAgICB0aGlzLl9jbGFzc2VzRGlydHkgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3N0eWxlc0RpcnR5KSB7XG4gICAgICAgIF9hcHBseVN0eWxlcy5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX3N0eWxlc0RpcnR5ID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUpIHtcbiAgICAgICAgdmFyIG9yaWdTaXplID0gY29udGV4dC5zaXplO1xuICAgICAgICBzaXplID0gW1xuICAgICAgICAgICAgdGhpcy5zaXplWzBdLFxuICAgICAgICAgICAgdGhpcy5zaXplWzFdXG4gICAgICAgIF07XG4gICAgICAgIGlmIChzaXplWzBdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBzaXplWzBdID0gb3JpZ1NpemVbMF07XG4gICAgICAgIGVsc2UgaWYgKHNpemVbMF0gPT09IHRydWUpXG4gICAgICAgICAgICBzaXplWzBdID0gdGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgICAgICBpZiAoc2l6ZVsxXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgc2l6ZVsxXSA9IG9yaWdTaXplWzFdO1xuICAgICAgICBlbHNlIGlmIChzaXplWzFdID09PSB0cnVlKVxuICAgICAgICAgICAgc2l6ZVsxXSA9IHRhcmdldC5jbGllbnRIZWlnaHQ7XG4gICAgfVxuICAgIGlmIChfeHlOb3RFcXVhbHModGhpcy5fc2l6ZSwgc2l6ZSkpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zaXplKVxuICAgICAgICAgICAgdGhpcy5fc2l6ZSA9IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF07XG4gICAgICAgIHRoaXMuX3NpemVbMF0gPSBzaXplWzBdO1xuICAgICAgICB0aGlzLl9zaXplWzFdID0gc2l6ZVsxXTtcbiAgICAgICAgdGhpcy5fc2l6ZURpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NpemVEaXJ0eSkge1xuICAgICAgICBpZiAodGhpcy5fc2l6ZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLndpZHRoID0gdGhpcy5zaXplICYmIHRoaXMuc2l6ZVswXSA9PT0gdHJ1ZSA/ICcnIDogdGhpcy5fc2l6ZVswXSArICdweCc7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5zaXplICYmIHRoaXMuc2l6ZVsxXSA9PT0gdHJ1ZSA/ICcnIDogdGhpcy5fc2l6ZVsxXSArICdweCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2l6ZURpcnR5ID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb250ZW50RGlydHkpIHtcbiAgICAgICAgdGhpcy5kZXBsb3kodGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnZGVwbG95Jyk7XG4gICAgICAgIHRoaXMuX2NvbnRlbnREaXJ0eSA9IGZhbHNlO1xuICAgIH1cbiAgICBFbGVtZW50T3V0cHV0LnByb3RvdHlwZS5jb21taXQuY2FsbCh0aGlzLCBjb250ZXh0KTtcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5jbGVhbnVwID0gZnVuY3Rpb24gY2xlYW51cChhbGxvY2F0b3IpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMuX2N1cnJlbnRUYXJnZXQ7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgncmVjYWxsJyk7XG4gICAgdGhpcy5yZWNhbGwodGFyZ2V0KTtcbiAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0YXJnZXQuc3R5bGUub3BhY2l0eSA9ICcnO1xuICAgIHRhcmdldC5zdHlsZS53aWR0aCA9ICcnO1xuICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0aGlzLl9zaXplID0gbnVsbDtcbiAgICBfY2xlYW51cFN0eWxlcy5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMuZ2V0Q2xhc3NMaXN0KCk7XG4gICAgX2NsZWFudXBDbGFzc2VzLmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc0xpc3RbaV0pO1xuICAgIGlmICh0aGlzLmVsZW1lbnRDbGFzcykge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Q2xhc3MgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZWxlbWVudENsYXNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5lbGVtZW50Q2xhc3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5lbGVtZW50Q2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuZGV0YWNoKHRhcmdldCk7XG4gICAgdGhpcy5fY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgYWxsb2NhdG9yLmRlYWxsb2NhdGUodGFyZ2V0KTtcbn07XG5TdXJmYWNlLnByb3RvdHlwZS5kZXBsb3kgPSBmdW5jdGlvbiBkZXBsb3kodGFyZ2V0KSB7XG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKTtcbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgd2hpbGUgKHRhcmdldC5oYXNDaGlsZE5vZGVzKCkpXG4gICAgICAgICAgICB0YXJnZXQucmVtb3ZlQ2hpbGQodGFyZ2V0LmZpcnN0Q2hpbGQpO1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgfSBlbHNlXG4gICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSBjb250ZW50O1xufTtcblN1cmZhY2UucHJvdG90eXBlLnJlY2FsbCA9IGZ1bmN0aW9uIHJlY2FsbCh0YXJnZXQpIHtcbiAgICB2YXIgZGYgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgd2hpbGUgKHRhcmdldC5oYXNDaGlsZE5vZGVzKCkpXG4gICAgICAgIGRmLmFwcGVuZENoaWxkKHRhcmdldC5maXJzdENoaWxkKTtcbiAgICB0aGlzLnNldENvbnRlbnQoZGYpO1xufTtcblN1cmZhY2UucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xufTtcblN1cmZhY2UucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbiBzZXRTaXplKHNpemUpIHtcbiAgICB0aGlzLnNpemUgPSBzaXplID8gW1xuICAgICAgICBzaXplWzBdLFxuICAgICAgICBzaXplWzFdXG4gICAgXSA6IG51bGw7XG4gICAgdGhpcy5fc2l6ZURpcnR5ID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFN1cmZhY2U7IiwidmFyIFRyYW5zZm9ybSA9IHt9O1xuVHJhbnNmb3JtLnByZWNpc2lvbiA9IDAuMDAwMDAxO1xuVHJhbnNmb3JtLmlkZW50aXR5ID0gW1xuICAgIDEsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAxLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMSxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDFcbl07XG5UcmFuc2Zvcm0ubXVsdGlwbHk0eDQgPSBmdW5jdGlvbiBtdWx0aXBseTR4NChhLCBiKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgYVswXSAqIGJbMF0gKyBhWzRdICogYlsxXSArIGFbOF0gKiBiWzJdICsgYVsxMl0gKiBiWzNdLFxuICAgICAgICBhWzFdICogYlswXSArIGFbNV0gKiBiWzFdICsgYVs5XSAqIGJbMl0gKyBhWzEzXSAqIGJbM10sXG4gICAgICAgIGFbMl0gKiBiWzBdICsgYVs2XSAqIGJbMV0gKyBhWzEwXSAqIGJbMl0gKyBhWzE0XSAqIGJbM10sXG4gICAgICAgIGFbM10gKiBiWzBdICsgYVs3XSAqIGJbMV0gKyBhWzExXSAqIGJbMl0gKyBhWzE1XSAqIGJbM10sXG4gICAgICAgIGFbMF0gKiBiWzRdICsgYVs0XSAqIGJbNV0gKyBhWzhdICogYls2XSArIGFbMTJdICogYls3XSxcbiAgICAgICAgYVsxXSAqIGJbNF0gKyBhWzVdICogYls1XSArIGFbOV0gKiBiWzZdICsgYVsxM10gKiBiWzddLFxuICAgICAgICBhWzJdICogYls0XSArIGFbNl0gKiBiWzVdICsgYVsxMF0gKiBiWzZdICsgYVsxNF0gKiBiWzddLFxuICAgICAgICBhWzNdICogYls0XSArIGFbN10gKiBiWzVdICsgYVsxMV0gKiBiWzZdICsgYVsxNV0gKiBiWzddLFxuICAgICAgICBhWzBdICogYls4XSArIGFbNF0gKiBiWzldICsgYVs4XSAqIGJbMTBdICsgYVsxMl0gKiBiWzExXSxcbiAgICAgICAgYVsxXSAqIGJbOF0gKyBhWzVdICogYls5XSArIGFbOV0gKiBiWzEwXSArIGFbMTNdICogYlsxMV0sXG4gICAgICAgIGFbMl0gKiBiWzhdICsgYVs2XSAqIGJbOV0gKyBhWzEwXSAqIGJbMTBdICsgYVsxNF0gKiBiWzExXSxcbiAgICAgICAgYVszXSAqIGJbOF0gKyBhWzddICogYls5XSArIGFbMTFdICogYlsxMF0gKyBhWzE1XSAqIGJbMTFdLFxuICAgICAgICBhWzBdICogYlsxMl0gKyBhWzRdICogYlsxM10gKyBhWzhdICogYlsxNF0gKyBhWzEyXSAqIGJbMTVdLFxuICAgICAgICBhWzFdICogYlsxMl0gKyBhWzVdICogYlsxM10gKyBhWzldICogYlsxNF0gKyBhWzEzXSAqIGJbMTVdLFxuICAgICAgICBhWzJdICogYlsxMl0gKyBhWzZdICogYlsxM10gKyBhWzEwXSAqIGJbMTRdICsgYVsxNF0gKiBiWzE1XSxcbiAgICAgICAgYVszXSAqIGJbMTJdICsgYVs3XSAqIGJbMTNdICsgYVsxMV0gKiBiWzE0XSArIGFbMTVdICogYlsxNV1cbiAgICBdO1xufTtcblRyYW5zZm9ybS5tdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBhWzBdICogYlswXSArIGFbNF0gKiBiWzFdICsgYVs4XSAqIGJbMl0sXG4gICAgICAgIGFbMV0gKiBiWzBdICsgYVs1XSAqIGJbMV0gKyBhWzldICogYlsyXSxcbiAgICAgICAgYVsyXSAqIGJbMF0gKyBhWzZdICogYlsxXSArIGFbMTBdICogYlsyXSxcbiAgICAgICAgMCxcbiAgICAgICAgYVswXSAqIGJbNF0gKyBhWzRdICogYls1XSArIGFbOF0gKiBiWzZdLFxuICAgICAgICBhWzFdICogYls0XSArIGFbNV0gKiBiWzVdICsgYVs5XSAqIGJbNl0sXG4gICAgICAgIGFbMl0gKiBiWzRdICsgYVs2XSAqIGJbNV0gKyBhWzEwXSAqIGJbNl0sXG4gICAgICAgIDAsXG4gICAgICAgIGFbMF0gKiBiWzhdICsgYVs0XSAqIGJbOV0gKyBhWzhdICogYlsxMF0sXG4gICAgICAgIGFbMV0gKiBiWzhdICsgYVs1XSAqIGJbOV0gKyBhWzldICogYlsxMF0sXG4gICAgICAgIGFbMl0gKiBiWzhdICsgYVs2XSAqIGJbOV0gKyBhWzEwXSAqIGJbMTBdLFxuICAgICAgICAwLFxuICAgICAgICBhWzBdICogYlsxMl0gKyBhWzRdICogYlsxM10gKyBhWzhdICogYlsxNF0gKyBhWzEyXSxcbiAgICAgICAgYVsxXSAqIGJbMTJdICsgYVs1XSAqIGJbMTNdICsgYVs5XSAqIGJbMTRdICsgYVsxM10sXG4gICAgICAgIGFbMl0gKiBiWzEyXSArIGFbNl0gKiBiWzEzXSArIGFbMTBdICogYlsxNF0gKyBhWzE0XSxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnRoZW5Nb3ZlID0gZnVuY3Rpb24gdGhlbk1vdmUobSwgdCkge1xuICAgIGlmICghdFsyXSlcbiAgICAgICAgdFsyXSA9IDA7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgbVswXSxcbiAgICAgICAgbVsxXSxcbiAgICAgICAgbVsyXSxcbiAgICAgICAgMCxcbiAgICAgICAgbVs0XSxcbiAgICAgICAgbVs1XSxcbiAgICAgICAgbVs2XSxcbiAgICAgICAgMCxcbiAgICAgICAgbVs4XSxcbiAgICAgICAgbVs5XSxcbiAgICAgICAgbVsxMF0sXG4gICAgICAgIDAsXG4gICAgICAgIG1bMTJdICsgdFswXSxcbiAgICAgICAgbVsxM10gKyB0WzFdLFxuICAgICAgICBtWzE0XSArIHRbMl0sXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS5tb3ZlVGhlbiA9IGZ1bmN0aW9uIG1vdmVUaGVuKHYsIG0pIHtcbiAgICBpZiAoIXZbMl0pXG4gICAgICAgIHZbMl0gPSAwO1xuICAgIHZhciB0MCA9IHZbMF0gKiBtWzBdICsgdlsxXSAqIG1bNF0gKyB2WzJdICogbVs4XTtcbiAgICB2YXIgdDEgPSB2WzBdICogbVsxXSArIHZbMV0gKiBtWzVdICsgdlsyXSAqIG1bOV07XG4gICAgdmFyIHQyID0gdlswXSAqIG1bMl0gKyB2WzFdICogbVs2XSArIHZbMl0gKiBtWzEwXTtcbiAgICByZXR1cm4gVHJhbnNmb3JtLnRoZW5Nb3ZlKG0sIFtcbiAgICAgICAgdDAsXG4gICAgICAgIHQxLFxuICAgICAgICB0MlxuICAgIF0pO1xufTtcblRyYW5zZm9ybS50cmFuc2xhdGUgPSBmdW5jdGlvbiB0cmFuc2xhdGUoeCwgeSwgeikge1xuICAgIGlmICh6ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHogPSAwO1xuICAgIHJldHVybiBbXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHosXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS50aGVuU2NhbGUgPSBmdW5jdGlvbiB0aGVuU2NhbGUobSwgcykge1xuICAgIHJldHVybiBbXG4gICAgICAgIHNbMF0gKiBtWzBdLFxuICAgICAgICBzWzFdICogbVsxXSxcbiAgICAgICAgc1syXSAqIG1bMl0sXG4gICAgICAgIDAsXG4gICAgICAgIHNbMF0gKiBtWzRdLFxuICAgICAgICBzWzFdICogbVs1XSxcbiAgICAgICAgc1syXSAqIG1bNl0sXG4gICAgICAgIDAsXG4gICAgICAgIHNbMF0gKiBtWzhdLFxuICAgICAgICBzWzFdICogbVs5XSxcbiAgICAgICAgc1syXSAqIG1bMTBdLFxuICAgICAgICAwLFxuICAgICAgICBzWzBdICogbVsxMl0sXG4gICAgICAgIHNbMV0gKiBtWzEzXSxcbiAgICAgICAgc1syXSAqIG1bMTRdLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0uc2NhbGUgPSBmdW5jdGlvbiBzY2FsZSh4LCB5LCB6KSB7XG4gICAgaWYgKHogPT09IHVuZGVmaW5lZClcbiAgICAgICAgeiA9IDE7XG4gICAgaWYgKHkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgeSA9IHg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgeCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgeSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgeixcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnJvdGF0ZVggPSBmdW5jdGlvbiByb3RhdGVYKHRoZXRhKSB7XG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcbiAgICByZXR1cm4gW1xuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICBjb3NUaGV0YSxcbiAgICAgICAgc2luVGhldGEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIC1zaW5UaGV0YSxcbiAgICAgICAgY29zVGhldGEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS5yb3RhdGVZID0gZnVuY3Rpb24gcm90YXRlWSh0aGV0YSkge1xuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgY29zVGhldGEsXG4gICAgICAgIDAsXG4gICAgICAgIC1zaW5UaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgc2luVGhldGEsXG4gICAgICAgIDAsXG4gICAgICAgIGNvc1RoZXRhLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0ucm90YXRlWiA9IGZ1bmN0aW9uIHJvdGF0ZVoodGhldGEpIHtcbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHJldHVybiBbXG4gICAgICAgIGNvc1RoZXRhLFxuICAgICAgICBzaW5UaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgLXNpblRoZXRhLFxuICAgICAgICBjb3NUaGV0YSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnJvdGF0ZSA9IGZ1bmN0aW9uIHJvdGF0ZShwaGksIHRoZXRhLCBwc2kpIHtcbiAgICB2YXIgY29zUGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICB2YXIgc2luUGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHZhciBjb3NQc2kgPSBNYXRoLmNvcyhwc2kpO1xuICAgIHZhciBzaW5Qc2kgPSBNYXRoLnNpbihwc2kpO1xuICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgICAgICBjb3NUaGV0YSAqIGNvc1BzaSxcbiAgICAgICAgICAgIGNvc1BoaSAqIHNpblBzaSArIHNpblBoaSAqIHNpblRoZXRhICogY29zUHNpLFxuICAgICAgICAgICAgc2luUGhpICogc2luUHNpIC0gY29zUGhpICogc2luVGhldGEgKiBjb3NQc2ksXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgLWNvc1RoZXRhICogc2luUHNpLFxuICAgICAgICAgICAgY29zUGhpICogY29zUHNpIC0gc2luUGhpICogc2luVGhldGEgKiBzaW5Qc2ksXG4gICAgICAgICAgICBzaW5QaGkgKiBjb3NQc2kgKyBjb3NQaGkgKiBzaW5UaGV0YSAqIHNpblBzaSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBzaW5UaGV0YSxcbiAgICAgICAgICAgIC1zaW5QaGkgKiBjb3NUaGV0YSxcbiAgICAgICAgICAgIGNvc1BoaSAqIGNvc1RoZXRhLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgXTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblRyYW5zZm9ybS5yb3RhdGVBeGlzID0gZnVuY3Rpb24gcm90YXRlQXhpcyh2LCB0aGV0YSkge1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHZlclRoZXRhID0gMSAtIGNvc1RoZXRhO1xuICAgIHZhciB4eFYgPSB2WzBdICogdlswXSAqIHZlclRoZXRhO1xuICAgIHZhciB4eVYgPSB2WzBdICogdlsxXSAqIHZlclRoZXRhO1xuICAgIHZhciB4elYgPSB2WzBdICogdlsyXSAqIHZlclRoZXRhO1xuICAgIHZhciB5eVYgPSB2WzFdICogdlsxXSAqIHZlclRoZXRhO1xuICAgIHZhciB5elYgPSB2WzFdICogdlsyXSAqIHZlclRoZXRhO1xuICAgIHZhciB6elYgPSB2WzJdICogdlsyXSAqIHZlclRoZXRhO1xuICAgIHZhciB4cyA9IHZbMF0gKiBzaW5UaGV0YTtcbiAgICB2YXIgeXMgPSB2WzFdICogc2luVGhldGE7XG4gICAgdmFyIHpzID0gdlsyXSAqIHNpblRoZXRhO1xuICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgICAgICB4eFYgKyBjb3NUaGV0YSxcbiAgICAgICAgICAgIHh5ViArIHpzLFxuICAgICAgICAgICAgeHpWIC0geXMsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgeHlWIC0genMsXG4gICAgICAgICAgICB5eVYgKyBjb3NUaGV0YSxcbiAgICAgICAgICAgIHl6ViArIHhzLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIHh6ViArIHlzLFxuICAgICAgICAgICAgeXpWIC0geHMsXG4gICAgICAgICAgICB6elYgKyBjb3NUaGV0YSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgIF07XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5UcmFuc2Zvcm0uYWJvdXRPcmlnaW4gPSBmdW5jdGlvbiBhYm91dE9yaWdpbih2LCBtKSB7XG4gICAgdmFyIHQwID0gdlswXSAtICh2WzBdICogbVswXSArIHZbMV0gKiBtWzRdICsgdlsyXSAqIG1bOF0pO1xuICAgIHZhciB0MSA9IHZbMV0gLSAodlswXSAqIG1bMV0gKyB2WzFdICogbVs1XSArIHZbMl0gKiBtWzldKTtcbiAgICB2YXIgdDIgPSB2WzJdIC0gKHZbMF0gKiBtWzJdICsgdlsxXSAqIG1bNl0gKyB2WzJdICogbVsxMF0pO1xuICAgIHJldHVybiBUcmFuc2Zvcm0udGhlbk1vdmUobSwgW1xuICAgICAgICB0MCxcbiAgICAgICAgdDEsXG4gICAgICAgIHQyXG4gICAgXSk7XG59O1xuVHJhbnNmb3JtLnNrZXcgPSBmdW5jdGlvbiBza2V3KHBoaSwgdGhldGEsIHBzaSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIDEsXG4gICAgICAgIE1hdGgudGFuKHRoZXRhKSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgTWF0aC50YW4ocHNpKSxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgTWF0aC50YW4ocGhpKSxcbiAgICAgICAgMSxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLnNrZXdYID0gZnVuY3Rpb24gc2tld1goYW5nbGUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICBNYXRoLnRhbihhbmdsZSksXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDFcbiAgICBdO1xufTtcblRyYW5zZm9ybS5za2V3WSA9IGZ1bmN0aW9uIHNrZXdZKGFuZ2xlKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgMSxcbiAgICAgICAgTWF0aC50YW4oYW5nbGUpLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxXG4gICAgXTtcbn07XG5UcmFuc2Zvcm0ucGVyc3BlY3RpdmUgPSBmdW5jdGlvbiBwZXJzcGVjdGl2ZShmb2N1c1opIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICAtMSAvIGZvY3VzWixcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMVxuICAgIF07XG59O1xuVHJhbnNmb3JtLmdldFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIGdldFRyYW5zbGF0ZShtKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgbVsxMl0sXG4gICAgICAgIG1bMTNdLFxuICAgICAgICBtWzE0XVxuICAgIF07XG59O1xuVHJhbnNmb3JtLmludmVyc2UgPSBmdW5jdGlvbiBpbnZlcnNlKG0pIHtcbiAgICB2YXIgYzAgPSBtWzVdICogbVsxMF0gLSBtWzZdICogbVs5XTtcbiAgICB2YXIgYzEgPSBtWzRdICogbVsxMF0gLSBtWzZdICogbVs4XTtcbiAgICB2YXIgYzIgPSBtWzRdICogbVs5XSAtIG1bNV0gKiBtWzhdO1xuICAgIHZhciBjNCA9IG1bMV0gKiBtWzEwXSAtIG1bMl0gKiBtWzldO1xuICAgIHZhciBjNSA9IG1bMF0gKiBtWzEwXSAtIG1bMl0gKiBtWzhdO1xuICAgIHZhciBjNiA9IG1bMF0gKiBtWzldIC0gbVsxXSAqIG1bOF07XG4gICAgdmFyIGM4ID0gbVsxXSAqIG1bNl0gLSBtWzJdICogbVs1XTtcbiAgICB2YXIgYzkgPSBtWzBdICogbVs2XSAtIG1bMl0gKiBtWzRdO1xuICAgIHZhciBjMTAgPSBtWzBdICogbVs1XSAtIG1bMV0gKiBtWzRdO1xuICAgIHZhciBkZXRNID0gbVswXSAqIGMwIC0gbVsxXSAqIGMxICsgbVsyXSAqIGMyO1xuICAgIHZhciBpbnZEID0gMSAvIGRldE07XG4gICAgdmFyIHJlc3VsdCA9IFtcbiAgICAgICAgICAgIGludkQgKiBjMCxcbiAgICAgICAgICAgIC1pbnZEICogYzQsXG4gICAgICAgICAgICBpbnZEICogYzgsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgLWludkQgKiBjMSxcbiAgICAgICAgICAgIGludkQgKiBjNSxcbiAgICAgICAgICAgIC1pbnZEICogYzksXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgaW52RCAqIGMyLFxuICAgICAgICAgICAgLWludkQgKiBjNixcbiAgICAgICAgICAgIGludkQgKiBjMTAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICBdO1xuICAgIHJlc3VsdFsxMl0gPSAtbVsxMl0gKiByZXN1bHRbMF0gLSBtWzEzXSAqIHJlc3VsdFs0XSAtIG1bMTRdICogcmVzdWx0WzhdO1xuICAgIHJlc3VsdFsxM10gPSAtbVsxMl0gKiByZXN1bHRbMV0gLSBtWzEzXSAqIHJlc3VsdFs1XSAtIG1bMTRdICogcmVzdWx0WzldO1xuICAgIHJlc3VsdFsxNF0gPSAtbVsxMl0gKiByZXN1bHRbMl0gLSBtWzEzXSAqIHJlc3VsdFs2XSAtIG1bMTRdICogcmVzdWx0WzEwXTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblRyYW5zZm9ybS50cmFuc3Bvc2UgPSBmdW5jdGlvbiB0cmFuc3Bvc2UobSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIG1bMF0sXG4gICAgICAgIG1bNF0sXG4gICAgICAgIG1bOF0sXG4gICAgICAgIG1bMTJdLFxuICAgICAgICBtWzFdLFxuICAgICAgICBtWzVdLFxuICAgICAgICBtWzldLFxuICAgICAgICBtWzEzXSxcbiAgICAgICAgbVsyXSxcbiAgICAgICAgbVs2XSxcbiAgICAgICAgbVsxMF0sXG4gICAgICAgIG1bMTRdLFxuICAgICAgICBtWzNdLFxuICAgICAgICBtWzddLFxuICAgICAgICBtWzExXSxcbiAgICAgICAgbVsxNV1cbiAgICBdO1xufTtcbmZ1bmN0aW9uIF9ub3JtU3F1YXJlZCh2KSB7XG4gICAgcmV0dXJuIHYubGVuZ3RoID09PSAyID8gdlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSA6IHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0gKyB2WzJdICogdlsyXTtcbn1cbmZ1bmN0aW9uIF9ub3JtKHYpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KF9ub3JtU3F1YXJlZCh2KSk7XG59XG5mdW5jdGlvbiBfc2lnbihuKSB7XG4gICAgcmV0dXJuIG4gPCAwID8gLTEgOiAxO1xufVxuVHJhbnNmb3JtLmludGVycHJldCA9IGZ1bmN0aW9uIGludGVycHJldChNKSB7XG4gICAgdmFyIHggPSBbXG4gICAgICAgICAgICBNWzBdLFxuICAgICAgICAgICAgTVsxXSxcbiAgICAgICAgICAgIE1bMl1cbiAgICAgICAgXTtcbiAgICB2YXIgc2duID0gX3NpZ24oeFswXSk7XG4gICAgdmFyIHhOb3JtID0gX25vcm0oeCk7XG4gICAgdmFyIHYgPSBbXG4gICAgICAgICAgICB4WzBdICsgc2duICogeE5vcm0sXG4gICAgICAgICAgICB4WzFdLFxuICAgICAgICAgICAgeFsyXVxuICAgICAgICBdO1xuICAgIHZhciBtdWx0ID0gMiAvIF9ub3JtU3F1YXJlZCh2KTtcbiAgICBpZiAobXVsdCA+PSBJbmZpbml0eSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHJhbnNsYXRlOiBUcmFuc2Zvcm0uZ2V0VHJhbnNsYXRlKE0pLFxuICAgICAgICAgICAgcm90YXRlOiBbXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzY2FsZTogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc2tldzogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBRMSA9IFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgXTtcbiAgICBRMVswXSA9IDEgLSBtdWx0ICogdlswXSAqIHZbMF07XG4gICAgUTFbNV0gPSAxIC0gbXVsdCAqIHZbMV0gKiB2WzFdO1xuICAgIFExWzEwXSA9IDEgLSBtdWx0ICogdlsyXSAqIHZbMl07XG4gICAgUTFbMV0gPSAtbXVsdCAqIHZbMF0gKiB2WzFdO1xuICAgIFExWzJdID0gLW11bHQgKiB2WzBdICogdlsyXTtcbiAgICBRMVs2XSA9IC1tdWx0ICogdlsxXSAqIHZbMl07XG4gICAgUTFbNF0gPSBRMVsxXTtcbiAgICBRMVs4XSA9IFExWzJdO1xuICAgIFExWzldID0gUTFbNl07XG4gICAgdmFyIE1RMSA9IFRyYW5zZm9ybS5tdWx0aXBseShRMSwgTSk7XG4gICAgdmFyIHgyID0gW1xuICAgICAgICAgICAgTVExWzVdLFxuICAgICAgICAgICAgTVExWzZdXG4gICAgICAgIF07XG4gICAgdmFyIHNnbjIgPSBfc2lnbih4MlswXSk7XG4gICAgdmFyIHgyTm9ybSA9IF9ub3JtKHgyKTtcbiAgICB2YXIgdjIgPSBbXG4gICAgICAgICAgICB4MlswXSArIHNnbjIgKiB4Mk5vcm0sXG4gICAgICAgICAgICB4MlsxXVxuICAgICAgICBdO1xuICAgIHZhciBtdWx0MiA9IDIgLyBfbm9ybVNxdWFyZWQodjIpO1xuICAgIHZhciBRMiA9IFtcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgXTtcbiAgICBRMls1XSA9IDEgLSBtdWx0MiAqIHYyWzBdICogdjJbMF07XG4gICAgUTJbMTBdID0gMSAtIG11bHQyICogdjJbMV0gKiB2MlsxXTtcbiAgICBRMls2XSA9IC1tdWx0MiAqIHYyWzBdICogdjJbMV07XG4gICAgUTJbOV0gPSBRMls2XTtcbiAgICB2YXIgUSA9IFRyYW5zZm9ybS5tdWx0aXBseShRMiwgUTEpO1xuICAgIHZhciBSID0gVHJhbnNmb3JtLm11bHRpcGx5KFEsIE0pO1xuICAgIHZhciByZW1vdmVyID0gVHJhbnNmb3JtLnNjYWxlKFJbMF0gPCAwID8gLTEgOiAxLCBSWzVdIDwgMCA/IC0xIDogMSwgUlsxMF0gPCAwID8gLTEgOiAxKTtcbiAgICBSID0gVHJhbnNmb3JtLm11bHRpcGx5KFIsIHJlbW92ZXIpO1xuICAgIFEgPSBUcmFuc2Zvcm0ubXVsdGlwbHkocmVtb3ZlciwgUSk7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC50cmFuc2xhdGUgPSBUcmFuc2Zvcm0uZ2V0VHJhbnNsYXRlKE0pO1xuICAgIHJlc3VsdC5yb3RhdGUgPSBbXG4gICAgICAgIE1hdGguYXRhbjIoLVFbNl0sIFFbMTBdKSxcbiAgICAgICAgTWF0aC5hc2luKFFbMl0pLFxuICAgICAgICBNYXRoLmF0YW4yKC1RWzFdLCBRWzBdKVxuICAgIF07XG4gICAgaWYgKCFyZXN1bHQucm90YXRlWzBdKSB7XG4gICAgICAgIHJlc3VsdC5yb3RhdGVbMF0gPSAwO1xuICAgICAgICByZXN1bHQucm90YXRlWzJdID0gTWF0aC5hdGFuMihRWzRdLCBRWzVdKTtcbiAgICB9XG4gICAgcmVzdWx0LnNjYWxlID0gW1xuICAgICAgICBSWzBdLFxuICAgICAgICBSWzVdLFxuICAgICAgICBSWzEwXVxuICAgIF07XG4gICAgcmVzdWx0LnNrZXcgPSBbXG4gICAgICAgIE1hdGguYXRhbjIoUls5XSwgcmVzdWx0LnNjYWxlWzJdKSxcbiAgICAgICAgTWF0aC5hdGFuMihSWzhdLCByZXN1bHQuc2NhbGVbMl0pLFxuICAgICAgICBNYXRoLmF0YW4yKFJbNF0sIHJlc3VsdC5zY2FsZVswXSlcbiAgICBdO1xuICAgIGlmIChNYXRoLmFicyhyZXN1bHQucm90YXRlWzBdKSArIE1hdGguYWJzKHJlc3VsdC5yb3RhdGVbMl0pID4gMS41ICogTWF0aC5QSSkge1xuICAgICAgICByZXN1bHQucm90YXRlWzFdID0gTWF0aC5QSSAtIHJlc3VsdC5yb3RhdGVbMV07XG4gICAgICAgIGlmIChyZXN1bHQucm90YXRlWzFdID4gTWF0aC5QSSlcbiAgICAgICAgICAgIHJlc3VsdC5yb3RhdGVbMV0gLT0gMiAqIE1hdGguUEk7XG4gICAgICAgIGlmIChyZXN1bHQucm90YXRlWzFdIDwgLU1hdGguUEkpXG4gICAgICAgICAgICByZXN1bHQucm90YXRlWzFdICs9IDIgKiBNYXRoLlBJO1xuICAgICAgICBpZiAocmVzdWx0LnJvdGF0ZVswXSA8IDApXG4gICAgICAgICAgICByZXN1bHQucm90YXRlWzBdICs9IE1hdGguUEk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3VsdC5yb3RhdGVbMF0gLT0gTWF0aC5QSTtcbiAgICAgICAgaWYgKHJlc3VsdC5yb3RhdGVbMl0gPCAwKVxuICAgICAgICAgICAgcmVzdWx0LnJvdGF0ZVsyXSArPSBNYXRoLlBJO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXN1bHQucm90YXRlWzJdIC09IE1hdGguUEk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuVHJhbnNmb3JtLmF2ZXJhZ2UgPSBmdW5jdGlvbiBhdmVyYWdlKE0xLCBNMiwgdCkge1xuICAgIHQgPSB0ID09PSB1bmRlZmluZWQgPyAwLjUgOiB0O1xuICAgIHZhciBzcGVjTTEgPSBUcmFuc2Zvcm0uaW50ZXJwcmV0KE0xKTtcbiAgICB2YXIgc3BlY00yID0gVHJhbnNmb3JtLmludGVycHJldChNMik7XG4gICAgdmFyIHNwZWNBdmcgPSB7XG4gICAgICAgICAgICB0cmFuc2xhdGU6IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJvdGF0ZTogW1xuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc2NhbGU6IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHNrZXc6IFtcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIHNwZWNBdmcudHJhbnNsYXRlW2ldID0gKDEgLSB0KSAqIHNwZWNNMS50cmFuc2xhdGVbaV0gKyB0ICogc3BlY00yLnRyYW5zbGF0ZVtpXTtcbiAgICAgICAgc3BlY0F2Zy5yb3RhdGVbaV0gPSAoMSAtIHQpICogc3BlY00xLnJvdGF0ZVtpXSArIHQgKiBzcGVjTTIucm90YXRlW2ldO1xuICAgICAgICBzcGVjQXZnLnNjYWxlW2ldID0gKDEgLSB0KSAqIHNwZWNNMS5zY2FsZVtpXSArIHQgKiBzcGVjTTIuc2NhbGVbaV07XG4gICAgICAgIHNwZWNBdmcuc2tld1tpXSA9ICgxIC0gdCkgKiBzcGVjTTEuc2tld1tpXSArIHQgKiBzcGVjTTIuc2tld1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIFRyYW5zZm9ybS5idWlsZChzcGVjQXZnKTtcbn07XG5UcmFuc2Zvcm0uYnVpbGQgPSBmdW5jdGlvbiBidWlsZChzcGVjKSB7XG4gICAgdmFyIHNjYWxlTWF0cml4ID0gVHJhbnNmb3JtLnNjYWxlKHNwZWMuc2NhbGVbMF0sIHNwZWMuc2NhbGVbMV0sIHNwZWMuc2NhbGVbMl0pO1xuICAgIHZhciBza2V3TWF0cml4ID0gVHJhbnNmb3JtLnNrZXcoc3BlYy5za2V3WzBdLCBzcGVjLnNrZXdbMV0sIHNwZWMuc2tld1syXSk7XG4gICAgdmFyIHJvdGF0ZU1hdHJpeCA9IFRyYW5zZm9ybS5yb3RhdGUoc3BlYy5yb3RhdGVbMF0sIHNwZWMucm90YXRlWzFdLCBzcGVjLnJvdGF0ZVsyXSk7XG4gICAgcmV0dXJuIFRyYW5zZm9ybS50aGVuTW92ZShUcmFuc2Zvcm0ubXVsdGlwbHkoVHJhbnNmb3JtLm11bHRpcGx5KHJvdGF0ZU1hdHJpeCwgc2tld01hdHJpeCksIHNjYWxlTWF0cml4KSwgc3BlYy50cmFuc2xhdGUpO1xufTtcblRyYW5zZm9ybS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgIHJldHVybiAhVHJhbnNmb3JtLm5vdEVxdWFscyhhLCBiKTtcbn07XG5UcmFuc2Zvcm0ubm90RXF1YWxzID0gZnVuY3Rpb24gbm90RXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiAhKGEgJiYgYikgfHwgYVsxMl0gIT09IGJbMTJdIHx8IGFbMTNdICE9PSBiWzEzXSB8fCBhWzE0XSAhPT0gYlsxNF0gfHwgYVswXSAhPT0gYlswXSB8fCBhWzFdICE9PSBiWzFdIHx8IGFbMl0gIT09IGJbMl0gfHwgYVs0XSAhPT0gYls0XSB8fCBhWzVdICE9PSBiWzVdIHx8IGFbNl0gIT09IGJbNl0gfHwgYVs4XSAhPT0gYls4XSB8fCBhWzldICE9PSBiWzldIHx8IGFbMTBdICE9PSBiWzEwXTtcbn07XG5UcmFuc2Zvcm0ubm9ybWFsaXplUm90YXRpb24gPSBmdW5jdGlvbiBub3JtYWxpemVSb3RhdGlvbihyb3RhdGlvbikge1xuICAgIHZhciByZXN1bHQgPSByb3RhdGlvbi5zbGljZSgwKTtcbiAgICBpZiAocmVzdWx0WzBdID09PSBNYXRoLlBJICogMC41IHx8IHJlc3VsdFswXSA9PT0gLU1hdGguUEkgKiAwLjUpIHtcbiAgICAgICAgcmVzdWx0WzBdID0gLXJlc3VsdFswXTtcbiAgICAgICAgcmVzdWx0WzFdID0gTWF0aC5QSSAtIHJlc3VsdFsxXTtcbiAgICAgICAgcmVzdWx0WzJdIC09IE1hdGguUEk7XG4gICAgfVxuICAgIGlmIChyZXN1bHRbMF0gPiBNYXRoLlBJICogMC41KSB7XG4gICAgICAgIHJlc3VsdFswXSA9IHJlc3VsdFswXSAtIE1hdGguUEk7XG4gICAgICAgIHJlc3VsdFsxXSA9IE1hdGguUEkgLSByZXN1bHRbMV07XG4gICAgICAgIHJlc3VsdFsyXSAtPSBNYXRoLlBJO1xuICAgIH1cbiAgICBpZiAocmVzdWx0WzBdIDwgLU1hdGguUEkgKiAwLjUpIHtcbiAgICAgICAgcmVzdWx0WzBdID0gcmVzdWx0WzBdICsgTWF0aC5QSTtcbiAgICAgICAgcmVzdWx0WzFdID0gLU1hdGguUEkgLSByZXN1bHRbMV07XG4gICAgICAgIHJlc3VsdFsyXSAtPSBNYXRoLlBJO1xuICAgIH1cbiAgICB3aGlsZSAocmVzdWx0WzFdIDwgLU1hdGguUEkpXG4gICAgICAgIHJlc3VsdFsxXSArPSAyICogTWF0aC5QSTtcbiAgICB3aGlsZSAocmVzdWx0WzFdID49IE1hdGguUEkpXG4gICAgICAgIHJlc3VsdFsxXSAtPSAyICogTWF0aC5QSTtcbiAgICB3aGlsZSAocmVzdWx0WzJdIDwgLU1hdGguUEkpXG4gICAgICAgIHJlc3VsdFsyXSArPSAyICogTWF0aC5QSTtcbiAgICB3aGlsZSAocmVzdWx0WzJdID49IE1hdGguUEkpXG4gICAgICAgIHJlc3VsdFsyXSAtPSAyICogTWF0aC5QSTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblRyYW5zZm9ybS5pbkZyb250ID0gW1xuICAgIDEsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAxLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMSxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLjAwMSxcbiAgICAxXG5dO1xuVHJhbnNmb3JtLmJlaGluZCA9IFtcbiAgICAxLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgMSxcbiAgICAwLFxuICAgIDAsXG4gICAgMCxcbiAgICAwLFxuICAgIDEsXG4gICAgMCxcbiAgICAwLFxuICAgIDAsXG4gICAgLTAuMDAxLFxuICAgIDFcbl07XG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTsiLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnLi9FdmVudEhhbmRsZXInKTtcbnZhciBPcHRpb25zTWFuYWdlciA9IHJlcXVpcmUoJy4vT3B0aW9uc01hbmFnZXInKTtcbnZhciBSZW5kZXJOb2RlID0gcmVxdWlyZSgnLi9SZW5kZXJOb2RlJyk7XG52YXIgVXRpbGl0eSA9IHJlcXVpcmUoJ2ZhbW91cy91dGlsaXRpZXMvVXRpbGl0eScpO1xuZnVuY3Rpb24gVmlldyhvcHRpb25zKSB7XG4gICAgdGhpcy5fbm9kZSA9IG5ldyBSZW5kZXJOb2RlKCk7XG4gICAgdGhpcy5fZXZlbnRJbnB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICBFdmVudEhhbmRsZXIuc2V0SW5wdXRIYW5kbGVyKHRoaXMsIHRoaXMuX2V2ZW50SW5wdXQpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRPdXRwdXRIYW5kbGVyKHRoaXMsIHRoaXMuX2V2ZW50T3V0cHV0KTtcbiAgICB0aGlzLm9wdGlvbnMgPSBVdGlsaXR5LmNsb25lKHRoaXMuY29uc3RydWN0b3IuREVGQVVMVF9PUFRJT05TIHx8IFZpZXcuREVGQVVMVF9PUFRJT05TKTtcbiAgICB0aGlzLl9vcHRpb25zTWFuYWdlciA9IG5ldyBPcHRpb25zTWFuYWdlcih0aGlzLm9wdGlvbnMpO1xuICAgIGlmIChvcHRpb25zKVxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59XG5WaWV3LkRFRkFVTFRfT1BUSU9OUyA9IHt9O1xuVmlldy5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnZhbHVlKCk7XG59O1xuVmlldy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnBhdGNoKG9wdGlvbnMpO1xufTtcblZpZXcucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZS5hZGQuYXBwbHkodGhpcy5fbm9kZSwgYXJndW1lbnRzKTtcbn07XG5WaWV3LnByb3RvdHlwZS5fYWRkID0gVmlldy5wcm90b3R5cGUuYWRkO1xuVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlLnJlbmRlcigpO1xufTtcblZpZXcucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIGlmICh0aGlzLl9ub2RlICYmIHRoaXMuX25vZGUuZ2V0U2l6ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5nZXRTaXplLmFwcGx5KHRoaXMuX25vZGUsIGFyZ3VtZW50cykgfHwgdGhpcy5vcHRpb25zLnNpemU7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2l6ZTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7IiwiZnVuY3Rpb24gVmlld1NlcXVlbmNlKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpXG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICBpZiAob3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICBvcHRpb25zID0geyBhcnJheTogb3B0aW9ucyB9O1xuICAgIHRoaXMuXyA9IG51bGw7XG4gICAgdGhpcy5pbmRleCA9IG9wdGlvbnMuaW5kZXggfHwgMDtcbiAgICBpZiAob3B0aW9ucy5hcnJheSlcbiAgICAgICAgdGhpcy5fID0gbmV3IHRoaXMuY29uc3RydWN0b3IuQmFja2luZyhvcHRpb25zLmFycmF5KTtcbiAgICBlbHNlIGlmIChvcHRpb25zLl8pXG4gICAgICAgIHRoaXMuXyA9IG9wdGlvbnMuXztcbiAgICBpZiAodGhpcy5pbmRleCA9PT0gdGhpcy5fLmZpcnN0SW5kZXgpXG4gICAgICAgIHRoaXMuXy5maXJzdE5vZGUgPSB0aGlzO1xuICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLl8uZmlyc3RJbmRleCArIHRoaXMuXy5hcnJheS5sZW5ndGggLSAxKVxuICAgICAgICB0aGlzLl8ubGFzdE5vZGUgPSB0aGlzO1xuICAgIGlmIChvcHRpb25zLmxvb3AgIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5fLmxvb3AgPSBvcHRpb25zLmxvb3A7XG4gICAgdGhpcy5fcHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICB0aGlzLl9uZXh0Tm9kZSA9IG51bGw7XG59XG5WaWV3U2VxdWVuY2UuQmFja2luZyA9IGZ1bmN0aW9uIEJhY2tpbmcoYXJyYXkpIHtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgdGhpcy5maXJzdEluZGV4ID0gMDtcbiAgICB0aGlzLmxvb3AgPSBmYWxzZTtcbiAgICB0aGlzLmZpcnN0Tm9kZSA9IG51bGw7XG4gICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG59O1xuVmlld1NlcXVlbmNlLkJhY2tpbmcucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gZ2V0VmFsdWUoaSkge1xuICAgIHZhciBfaSA9IGkgLSB0aGlzLmZpcnN0SW5kZXg7XG4gICAgaWYgKF9pIDwgMCB8fCBfaSA+PSB0aGlzLmFycmF5Lmxlbmd0aClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXlbX2ldO1xufTtcblZpZXdTZXF1ZW5jZS5CYWNraW5nLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uIHNldFZhbHVlKGksIHZhbHVlKSB7XG4gICAgdGhpcy5hcnJheVtpIC0gdGhpcy5maXJzdEluZGV4XSA9IHZhbHVlO1xufTtcblZpZXdTZXF1ZW5jZS5CYWNraW5nLnByb3RvdHlwZS5yZWluZGV4ID0gZnVuY3Rpb24gcmVpbmRleChzdGFydCwgcmVtb3ZlQ291bnQsIGluc2VydENvdW50KSB7XG4gICAgaWYgKCF0aGlzLmFycmF5WzBdKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBpbmRleCA9IHRoaXMuZmlyc3RJbmRleDtcbiAgICB2YXIgaW5kZXhTaGlmdEFtb3VudCA9IGluc2VydENvdW50IC0gcmVtb3ZlQ291bnQ7XG4gICAgdmFyIG5vZGUgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICB3aGlsZSAoaW5kZXggPCBzdGFydCAtIDEpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0TmV4dCgpO1xuICAgICAgICBpbmRleCsrO1xuICAgIH1cbiAgICB2YXIgc3BsaWNlU3RhcnROb2RlID0gbm9kZTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcmVtb3ZlQ291bnQ7IGkrKykge1xuICAgICAgICBub2RlID0gbm9kZS5nZXROZXh0KCk7XG4gICAgICAgIGlmIChub2RlKVxuICAgICAgICAgICAgbm9kZS5fcHJldmlvdXNOb2RlID0gc3BsaWNlU3RhcnROb2RlO1xuICAgIH1cbiAgICB2YXIgc3BsaWNlUmVzdW1lTm9kZSA9IG5vZGUgPyBub2RlLmdldE5leHQoKSA6IG51bGw7XG4gICAgc3BsaWNlU3RhcnROb2RlLl9uZXh0Tm9kZSA9IG51bGw7XG4gICAgbm9kZSA9IHNwbGljZVN0YXJ0Tm9kZTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgaW5zZXJ0Q291bnQ7IGkrKylcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0TmV4dCgpO1xuICAgIGluZGV4ICs9IGluc2VydENvdW50O1xuICAgIGlmIChub2RlICE9PSBzcGxpY2VSZXN1bWVOb2RlKSB7XG4gICAgICAgIG5vZGUuX25leHROb2RlID0gc3BsaWNlUmVzdW1lTm9kZTtcbiAgICAgICAgaWYgKHNwbGljZVJlc3VtZU5vZGUpXG4gICAgICAgICAgICBzcGxpY2VSZXN1bWVOb2RlLl9wcmV2aW91c05vZGUgPSBub2RlO1xuICAgIH1cbiAgICBpZiAoc3BsaWNlUmVzdW1lTm9kZSkge1xuICAgICAgICBub2RlID0gc3BsaWNlUmVzdW1lTm9kZTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgd2hpbGUgKG5vZGUgJiYgaW5kZXggPCB0aGlzLmFycmF5Lmxlbmd0aCArIHRoaXMuZmlyc3RJbmRleCkge1xuICAgICAgICAgICAgaWYgKG5vZGUuX25leHROb2RlKVxuICAgICAgICAgICAgICAgIG5vZGUuaW5kZXggKz0gaW5kZXhTaGlmdEFtb3VudDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBub2RlLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5nZXROZXh0KCk7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUuZ2V0UHJldmlvdXMgPSBmdW5jdGlvbiBnZXRQcmV2aW91cygpIHtcbiAgICBpZiAodGhpcy5pbmRleCA9PT0gdGhpcy5fLmZpcnN0SW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuXy5sb29wKSB7XG4gICAgICAgICAgICB0aGlzLl9wcmV2aW91c05vZGUgPSB0aGlzLl8ubGFzdE5vZGUgfHwgbmV3IHRoaXMuY29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgICAgIF86IHRoaXMuXyxcbiAgICAgICAgICAgICAgICBpbmRleDogdGhpcy5fLmZpcnN0SW5kZXggKyB0aGlzLl8uYXJyYXkubGVuZ3RoIC0gMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9wcmV2aW91c05vZGUuX25leHROb2RlID0gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9wcmV2aW91c05vZGUpIHtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNOb2RlID0gbmV3IHRoaXMuY29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgXzogdGhpcy5fLFxuICAgICAgICAgICAgaW5kZXg6IHRoaXMuaW5kZXggLSAxXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9wcmV2aW91c05vZGUuX25leHROb2RlID0gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzTm9kZTtcbn07XG5WaWV3U2VxdWVuY2UucHJvdG90eXBlLmdldE5leHQgPSBmdW5jdGlvbiBnZXROZXh0KCkge1xuICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLl8uZmlyc3RJbmRleCArIHRoaXMuXy5hcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGlmICh0aGlzLl8ubG9vcCkge1xuICAgICAgICAgICAgdGhpcy5fbmV4dE5vZGUgPSB0aGlzLl8uZmlyc3ROb2RlIHx8IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgICAgICBfOiB0aGlzLl8sXG4gICAgICAgICAgICAgICAgaW5kZXg6IHRoaXMuXy5maXJzdEluZGV4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX25leHROb2RlLl9wcmV2aW91c05vZGUgPSB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbmV4dE5vZGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICghdGhpcy5fbmV4dE5vZGUpIHtcbiAgICAgICAgdGhpcy5fbmV4dE5vZGUgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICAgICAgICBfOiB0aGlzLl8sXG4gICAgICAgICAgICBpbmRleDogdGhpcy5pbmRleCArIDFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX25leHROb2RlLl9wcmV2aW91c05vZGUgPSB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbmV4dE5vZGU7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS5nZXRJbmRleCA9IGZ1bmN0aW9uIGdldEluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLmluZGV4O1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLmluZGV4O1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uIHVuc2hpZnQodmFsdWUpIHtcbiAgICB0aGlzLl8uYXJyYXkudW5zaGlmdC5hcHBseSh0aGlzLl8uYXJyYXksIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5fLmZpcnN0SW5kZXggLT0gYXJndW1lbnRzLmxlbmd0aDtcbn07XG5WaWV3U2VxdWVuY2UucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoKHZhbHVlKSB7XG4gICAgdGhpcy5fLmFycmF5LnB1c2guYXBwbHkodGhpcy5fLmFycmF5LCBhcmd1bWVudHMpO1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUuc3BsaWNlID0gZnVuY3Rpb24gc3BsaWNlKGluZGV4LCBob3dNYW55KSB7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdGhpcy5fLmFycmF5LnNwbGljZS5hcHBseSh0aGlzLl8uYXJyYXksIFtcbiAgICAgICAgaW5kZXggLSB0aGlzLl8uZmlyc3RJbmRleCxcbiAgICAgICAgaG93TWFueVxuICAgIF0uY29uY2F0KHZhbHVlcykpO1xuICAgIHRoaXMuXy5yZWluZGV4KGluZGV4LCBob3dNYW55LCB2YWx1ZXMubGVuZ3RoKTtcbn07XG5WaWV3U2VxdWVuY2UucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiBzd2FwKG90aGVyKSB7XG4gICAgdmFyIG90aGVyVmFsdWUgPSBvdGhlci5nZXQoKTtcbiAgICB2YXIgbXlWYWx1ZSA9IHRoaXMuZ2V0KCk7XG4gICAgdGhpcy5fLnNldFZhbHVlKHRoaXMuaW5kZXgsIG90aGVyVmFsdWUpO1xuICAgIHRoaXMuXy5zZXRWYWx1ZShvdGhlci5pbmRleCwgbXlWYWx1ZSk7XG4gICAgdmFyIG15UHJldmlvdXMgPSB0aGlzLl9wcmV2aW91c05vZGU7XG4gICAgdmFyIG15TmV4dCA9IHRoaXMuX25leHROb2RlO1xuICAgIHZhciBteUluZGV4ID0gdGhpcy5pbmRleDtcbiAgICB2YXIgb3RoZXJQcmV2aW91cyA9IG90aGVyLl9wcmV2aW91c05vZGU7XG4gICAgdmFyIG90aGVyTmV4dCA9IG90aGVyLl9uZXh0Tm9kZTtcbiAgICB2YXIgb3RoZXJJbmRleCA9IG90aGVyLmluZGV4O1xuICAgIHRoaXMuaW5kZXggPSBvdGhlckluZGV4O1xuICAgIHRoaXMuX3ByZXZpb3VzTm9kZSA9IG90aGVyUHJldmlvdXMgPT09IHRoaXMgPyBvdGhlciA6IG90aGVyUHJldmlvdXM7XG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzTm9kZSlcbiAgICAgICAgdGhpcy5fcHJldmlvdXNOb2RlLl9uZXh0Tm9kZSA9IHRoaXM7XG4gICAgdGhpcy5fbmV4dE5vZGUgPSBvdGhlck5leHQgPT09IHRoaXMgPyBvdGhlciA6IG90aGVyTmV4dDtcbiAgICBpZiAodGhpcy5fbmV4dE5vZGUpXG4gICAgICAgIHRoaXMuX25leHROb2RlLl9wcmV2aW91c05vZGUgPSB0aGlzO1xuICAgIG90aGVyLmluZGV4ID0gbXlJbmRleDtcbiAgICBvdGhlci5fcHJldmlvdXNOb2RlID0gbXlQcmV2aW91cyA9PT0gb3RoZXIgPyB0aGlzIDogbXlQcmV2aW91cztcbiAgICBpZiAob3RoZXIuX3ByZXZpb3VzTm9kZSlcbiAgICAgICAgb3RoZXIuX3ByZXZpb3VzTm9kZS5fbmV4dE5vZGUgPSBvdGhlcjtcbiAgICBvdGhlci5fbmV4dE5vZGUgPSBteU5leHQgPT09IG90aGVyID8gdGhpcyA6IG15TmV4dDtcbiAgICBpZiAob3RoZXIuX25leHROb2RlKVxuICAgICAgICBvdGhlci5fbmV4dE5vZGUuX3ByZXZpb3VzTm9kZSA9IG90aGVyO1xuICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLl8uZmlyc3RJbmRleClcbiAgICAgICAgdGhpcy5fLmZpcnN0Tm9kZSA9IHRoaXM7XG4gICAgZWxzZSBpZiAodGhpcy5pbmRleCA9PT0gdGhpcy5fLmZpcnN0SW5kZXggKyB0aGlzLl8uYXJyYXkubGVuZ3RoIC0gMSlcbiAgICAgICAgdGhpcy5fLmxhc3ROb2RlID0gdGhpcztcbiAgICBpZiAob3RoZXIuaW5kZXggPT09IHRoaXMuXy5maXJzdEluZGV4KVxuICAgICAgICB0aGlzLl8uZmlyc3ROb2RlID0gb3RoZXI7XG4gICAgZWxzZSBpZiAob3RoZXIuaW5kZXggPT09IHRoaXMuXy5maXJzdEluZGV4ICsgdGhpcy5fLmFycmF5Lmxlbmd0aCAtIDEpXG4gICAgICAgIHRoaXMuXy5sYXN0Tm9kZSA9IG90aGVyO1xufTtcblZpZXdTZXF1ZW5jZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl8uZ2V0VmFsdWUodGhpcy5pbmRleCk7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXQoKTtcbiAgICByZXR1cm4gdGFyZ2V0ID8gdGFyZ2V0LmdldFNpemUoKSA6IG51bGw7XG59O1xuVmlld1NlcXVlbmNlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMuZ2V0KCk7XG4gICAgcmV0dXJuIHRhcmdldCA/IHRhcmdldC5yZW5kZXIuYXBwbHkodGFyZ2V0LCBhcmd1bWVudHMpIDogbnVsbDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdTZXF1ZW5jZTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIGlmICghd2luZG93LkN1c3RvbUV2ZW50KVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIGNsaWNrVGhyZXNob2xkID0gMzAwO1xuICAgIHZhciBjbGlja1dpbmRvdyA9IDUwMDtcbiAgICB2YXIgcG90ZW50aWFsQ2xpY2tzID0ge307XG4gICAgdmFyIHJlY2VudGx5RGlzcGF0Y2hlZCA9IHt9O1xuICAgIHZhciBfbm93ID0gRGF0ZS5ub3c7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIHRpbWVzdGFtcCA9IF9ub3coKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbaV07XG4gICAgICAgICAgICBwb3RlbnRpYWxDbGlja3NbdG91Y2guaWRlbnRpZmllcl0gPSB0aW1lc3RhbXA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICAgICAgZGVsZXRlIHBvdGVudGlhbENsaWNrc1t0b3VjaC5pZGVudGlmaWVyXTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBfbm93KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IHBvdGVudGlhbENsaWNrc1t0b3VjaC5pZGVudGlmaWVyXTtcbiAgICAgICAgICAgIGlmIChzdGFydFRpbWUgJiYgY3VyclRpbWUgLSBzdGFydFRpbWUgPCBjbGlja1RocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIHZhciBjbGlja0V2dCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ2NsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1YmJsZXMnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RldGFpbCc6IHRvdWNoXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlY2VudGx5RGlzcGF0Y2hlZFtjdXJyVGltZV0gPSBldmVudDtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuZGlzcGF0Y2hFdmVudChjbGlja0V2dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgcG90ZW50aWFsQ2xpY2tzW3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IF9ub3coKTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiByZWNlbnRseURpc3BhdGNoZWQpIHtcbiAgICAgICAgICAgIHZhciBwcmV2aW91c0V2ZW50ID0gcmVjZW50bHlEaXNwYXRjaGVkW2ldO1xuICAgICAgICAgICAgaWYgKGN1cnJUaW1lIC0gaSA8IGNsaWNrV2luZG93KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2Ygd2luZG93Lk1vdXNlRXZlbnQgJiYgZXZlbnQudGFyZ2V0ID09PSBwcmV2aW91c0V2ZW50LnRhcmdldClcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVjZW50bHlEaXNwYXRjaGVkW2ldO1xuICAgICAgICB9XG4gICAgfSwgdHJ1ZSk7XG59KCkpOyIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuLi9jb3JlL0V2ZW50SGFuZGxlcicpO1xuZnVuY3Rpb24gR2VuZXJpY1N5bmMoc3luY3MsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9ldmVudElucHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRJbnB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRJbnB1dCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xuICAgIHRoaXMuX3N5bmNzID0ge307XG4gICAgaWYgKHN5bmNzKVxuICAgICAgICB0aGlzLmFkZFN5bmMoc3luY3MpO1xuICAgIGlmIChvcHRpb25zKVxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59XG5HZW5lcmljU3luYy5ESVJFQ1RJT05fWCA9IDA7XG5HZW5lcmljU3luYy5ESVJFQ1RJT05fWSA9IDE7XG5HZW5lcmljU3luYy5ESVJFQ1RJT05fWiA9IDI7XG52YXIgcmVnaXN0cnkgPSB7fTtcbkdlbmVyaWNTeW5jLnJlZ2lzdGVyID0gZnVuY3Rpb24gcmVnaXN0ZXIoc3luY09iamVjdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzeW5jT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWdpc3RyeVtrZXldKSB7XG4gICAgICAgICAgICBpZiAocmVnaXN0cnlba2V5XSA9PT0gc3luY09iamVjdFtrZXldKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoaXMga2V5IGlzIHJlZ2lzdGVyZWQgdG8gYSBkaWZmZXJlbnQgc3luYyBjbGFzcycpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJlZ2lzdHJ5W2tleV0gPSBzeW5jT2JqZWN0W2tleV07XG4gICAgfVxufTtcbkdlbmVyaWNTeW5jLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fc3luY3MpIHtcbiAgICAgICAgdGhpcy5fc3luY3Nba2V5XS5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbn07XG5HZW5lcmljU3luYy5wcm90b3R5cGUucGlwZVN5bmMgPSBmdW5jdGlvbiBwaXBlVG9TeW5jKGtleSkge1xuICAgIHZhciBzeW5jID0gdGhpcy5fc3luY3Nba2V5XTtcbiAgICB0aGlzLl9ldmVudElucHV0LnBpcGUoc3luYyk7XG4gICAgc3luYy5waXBlKHRoaXMuX2V2ZW50T3V0cHV0KTtcbn07XG5HZW5lcmljU3luYy5wcm90b3R5cGUudW5waXBlU3luYyA9IGZ1bmN0aW9uIHVucGlwZUZyb21TeW5jKGtleSkge1xuICAgIHZhciBzeW5jID0gdGhpcy5fc3luY3Nba2V5XTtcbiAgICB0aGlzLl9ldmVudElucHV0LnVucGlwZShzeW5jKTtcbiAgICBzeW5jLnVucGlwZSh0aGlzLl9ldmVudE91dHB1dCk7XG59O1xuZnVuY3Rpb24gX2FkZFNpbmdsZVN5bmMoa2V5LCBvcHRpb25zKSB7XG4gICAgaWYgKCFyZWdpc3RyeVtrZXldKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5fc3luY3Nba2V5XSA9IG5ldyByZWdpc3RyeVtrZXldKG9wdGlvbnMpO1xuICAgIHRoaXMucGlwZVN5bmMoa2V5KTtcbn1cbkdlbmVyaWNTeW5jLnByb3RvdHlwZS5hZGRTeW5jID0gZnVuY3Rpb24gYWRkU3luYyhzeW5jcykge1xuICAgIGlmIChzeW5jcyBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN5bmNzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgX2FkZFNpbmdsZVN5bmMuY2FsbCh0aGlzLCBzeW5jc1tpXSk7XG4gICAgZWxzZSBpZiAoc3luY3MgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzeW5jcylcbiAgICAgICAgICAgIF9hZGRTaW5nbGVTeW5jLmNhbGwodGhpcywga2V5LCBzeW5jc1trZXldKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyaWNTeW5jOyIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuLi9jb3JlL0V2ZW50SGFuZGxlcicpO1xudmFyIE9wdGlvbnNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29yZS9PcHRpb25zTWFuYWdlcicpO1xuZnVuY3Rpb24gTW91c2VTeW5jKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKE1vdXNlU3luYy5ERUZBVUxUX09QVElPTlMpO1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9ldmVudElucHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRJbnB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRJbnB1dCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xuICAgIHRoaXMuX2V2ZW50SW5wdXQub24oJ21vdXNlZG93bicsIF9oYW5kbGVTdGFydC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9ldmVudElucHV0Lm9uKCdtb3VzZW1vdmUnLCBfaGFuZGxlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9ldmVudElucHV0Lm9uKCdtb3VzZXVwJywgX2hhbmRsZUVuZC5iaW5kKHRoaXMpKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnByb3BvZ2F0ZSlcbiAgICAgICAgdGhpcy5fZXZlbnRJbnB1dC5vbignbW91c2VsZWF2ZScsIF9oYW5kbGVMZWF2ZS5iaW5kKHRoaXMpKTtcbiAgICBlbHNlXG4gICAgICAgIHRoaXMuX2V2ZW50SW5wdXQub24oJ21vdXNlbGVhdmUnLCBfaGFuZGxlRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX3BheWxvYWQgPSB7XG4gICAgICAgIGRlbHRhOiBudWxsLFxuICAgICAgICBwb3NpdGlvbjogbnVsbCxcbiAgICAgICAgdmVsb2NpdHk6IG51bGwsXG4gICAgICAgIGNsaWVudFg6IDAsXG4gICAgICAgIGNsaWVudFk6IDAsXG4gICAgICAgIG9mZnNldFg6IDAsXG4gICAgICAgIG9mZnNldFk6IDBcbiAgICB9O1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9wcmV2Q29vcmQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcHJldlRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZG93biA9IGZhbHNlO1xuICAgIHRoaXMuX21vdmVkID0gZmFsc2U7XG59XG5Nb3VzZVN5bmMuREVGQVVMVF9PUFRJT05TID0ge1xuICAgIGRpcmVjdGlvbjogdW5kZWZpbmVkLFxuICAgIHJhaWxzOiBmYWxzZSxcbiAgICBzY2FsZTogMSxcbiAgICBwcm9wb2dhdGU6IHRydWUsXG4gICAgcHJldmVudERlZmF1bHQ6IHRydWVcbn07XG5Nb3VzZVN5bmMuRElSRUNUSU9OX1ggPSAwO1xuTW91c2VTeW5jLkRJUkVDVElPTl9ZID0gMTtcbnZhciBNSU5JTVVNX1RJQ0tfVElNRSA9IDg7XG52YXIgX25vdyA9IERhdGUubm93O1xuZnVuY3Rpb24gX2hhbmRsZVN0YXJ0KGV2ZW50KSB7XG4gICAgdmFyIGRlbHRhO1xuICAgIHZhciB2ZWxvY2l0eTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnREZWZhdWx0KVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICB2YXIgeSA9IGV2ZW50LmNsaWVudFk7XG4gICAgdGhpcy5fcHJldkNvb3JkID0gW1xuICAgICAgICB4LFxuICAgICAgICB5XG4gICAgXTtcbiAgICB0aGlzLl9wcmV2VGltZSA9IF9ub3coKTtcbiAgICB0aGlzLl9kb3duID0gdHJ1ZTtcbiAgICB0aGlzLl9tb3ZlID0gZmFsc2U7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IDA7XG4gICAgICAgIGRlbHRhID0gMDtcbiAgICAgICAgdmVsb2NpdHkgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXTtcbiAgICAgICAgZGVsdGEgPSBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdO1xuICAgICAgICB2ZWxvY2l0eSA9IFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF07XG4gICAgfVxuICAgIHZhciBwYXlsb2FkID0gdGhpcy5fcGF5bG9hZDtcbiAgICBwYXlsb2FkLmRlbHRhID0gZGVsdGE7XG4gICAgcGF5bG9hZC5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xuICAgIHBheWxvYWQudmVsb2NpdHkgPSB2ZWxvY2l0eTtcbiAgICBwYXlsb2FkLmNsaWVudFggPSB4O1xuICAgIHBheWxvYWQuY2xpZW50WSA9IHk7XG4gICAgcGF5bG9hZC5vZmZzZXRYID0gZXZlbnQub2Zmc2V0WDtcbiAgICBwYXlsb2FkLm9mZnNldFkgPSBldmVudC5vZmZzZXRZO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ3N0YXJ0JywgcGF5bG9hZCk7XG59XG5mdW5jdGlvbiBfaGFuZGxlTW92ZShldmVudCkge1xuICAgIGlmICghdGhpcy5fcHJldkNvb3JkKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIHByZXZDb29yZCA9IHRoaXMuX3ByZXZDb29yZDtcbiAgICB2YXIgcHJldlRpbWUgPSB0aGlzLl9wcmV2VGltZTtcbiAgICB2YXIgeCA9IGV2ZW50LmNsaWVudFg7XG4gICAgdmFyIHkgPSBldmVudC5jbGllbnRZO1xuICAgIHZhciBjdXJyVGltZSA9IF9ub3coKTtcbiAgICB2YXIgZGlmZlggPSB4IC0gcHJldkNvb3JkWzBdO1xuICAgIHZhciBkaWZmWSA9IHkgLSBwcmV2Q29vcmRbMV07XG4gICAgaWYgKHRoaXMub3B0aW9ucy5yYWlscykge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGlmZlgpID4gTWF0aC5hYnMoZGlmZlkpKVxuICAgICAgICAgICAgZGlmZlkgPSAwO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkaWZmWCA9IDA7XG4gICAgfVxuICAgIHZhciBkaWZmVGltZSA9IE1hdGgubWF4KGN1cnJUaW1lIC0gcHJldlRpbWUsIE1JTklNVU1fVElDS19USU1FKTtcbiAgICB2YXIgdmVsWCA9IGRpZmZYIC8gZGlmZlRpbWU7XG4gICAgdmFyIHZlbFkgPSBkaWZmWSAvIGRpZmZUaW1lO1xuICAgIHZhciBzY2FsZSA9IHRoaXMub3B0aW9ucy5zY2FsZTtcbiAgICB2YXIgbmV4dFZlbDtcbiAgICB2YXIgbmV4dERlbHRhO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSBNb3VzZVN5bmMuRElSRUNUSU9OX1gpIHtcbiAgICAgICAgbmV4dERlbHRhID0gc2NhbGUgKiBkaWZmWDtcbiAgICAgICAgbmV4dFZlbCA9IHNjYWxlICogdmVsWDtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gKz0gbmV4dERlbHRhO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gTW91c2VTeW5jLkRJUkVDVElPTl9ZKSB7XG4gICAgICAgIG5leHREZWx0YSA9IHNjYWxlICogZGlmZlk7XG4gICAgICAgIG5leHRWZWwgPSBzY2FsZSAqIHZlbFk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uICs9IG5leHREZWx0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0RGVsdGEgPSBbXG4gICAgICAgICAgICBzY2FsZSAqIGRpZmZYLFxuICAgICAgICAgICAgc2NhbGUgKiBkaWZmWVxuICAgICAgICBdO1xuICAgICAgICBuZXh0VmVsID0gW1xuICAgICAgICAgICAgc2NhbGUgKiB2ZWxYLFxuICAgICAgICAgICAgc2NhbGUgKiB2ZWxZXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWzBdICs9IG5leHREZWx0YVswXTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25bMV0gKz0gbmV4dERlbHRhWzFdO1xuICAgIH1cbiAgICB2YXIgcGF5bG9hZCA9IHRoaXMuX3BheWxvYWQ7XG4gICAgcGF5bG9hZC5kZWx0YSA9IG5leHREZWx0YTtcbiAgICBwYXlsb2FkLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb247XG4gICAgcGF5bG9hZC52ZWxvY2l0eSA9IG5leHRWZWw7XG4gICAgcGF5bG9hZC5jbGllbnRYID0geDtcbiAgICBwYXlsb2FkLmNsaWVudFkgPSB5O1xuICAgIHBheWxvYWQub2Zmc2V0WCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgcGF5bG9hZC5vZmZzZXRZID0gZXZlbnQub2Zmc2V0WTtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCd1cGRhdGUnLCBwYXlsb2FkKTtcbiAgICB0aGlzLl9wcmV2Q29vcmQgPSBbXG4gICAgICAgIHgsXG4gICAgICAgIHlcbiAgICBdO1xuICAgIHRoaXMuX3ByZXZUaW1lID0gY3VyclRpbWU7XG4gICAgdGhpcy5fbW92ZSA9IHRydWU7XG59XG5mdW5jdGlvbiBfaGFuZGxlRW5kKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9kb3duKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnZW5kJywgdGhpcy5fcGF5bG9hZCk7XG4gICAgdGhpcy5fcHJldkNvb3JkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3ByZXZUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2Rvd24gPSBmYWxzZTtcbiAgICB0aGlzLl9tb3ZlID0gZmFsc2U7XG59XG5mdW5jdGlvbiBfaGFuZGxlTGVhdmUoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX2Rvd24gfHwgIXRoaXMuX21vdmUpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgYm91bmRNb3ZlID0gX2hhbmRsZU1vdmUuYmluZCh0aGlzKTtcbiAgICB2YXIgYm91bmRFbmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF9oYW5kbGVFbmQuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBib3VuZE1vdmUpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGJvdW5kRW5kKTtcbiAgICAgICAgfS5iaW5kKHRoaXMsIGV2ZW50KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBib3VuZE1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBib3VuZEVuZCk7XG59XG5Nb3VzZVN5bmMucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG59O1xuTW91c2VTeW5jLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnNldE9wdGlvbnMob3B0aW9ucyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNb3VzZVN5bmM7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJy4uL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG52YXIgRW5naW5lID0gcmVxdWlyZSgnLi4vY29yZS9FbmdpbmUnKTtcbnZhciBPcHRpb25zTWFuYWdlciA9IHJlcXVpcmUoJy4uL2NvcmUvT3B0aW9uc01hbmFnZXInKTtcbmZ1bmN0aW9uIFNjcm9sbFN5bmMob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoU2Nyb2xsU3luYy5ERUZBVUxUX09QVElPTlMpO1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9wYXlsb2FkID0ge1xuICAgICAgICBkZWx0YTogbnVsbCxcbiAgICAgICAgcG9zaXRpb246IG51bGwsXG4gICAgICAgIHZlbG9jaXR5OiBudWxsLFxuICAgICAgICBzbGlwOiB0cnVlXG4gICAgfTtcbiAgICB0aGlzLl9ldmVudElucHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRJbnB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRJbnB1dCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gW1xuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXSA6IDA7XG4gICAgdGhpcy5fcHJldlRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcHJldlZlbCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9ldmVudElucHV0Lm9uKCdtb3VzZXdoZWVsJywgX2hhbmRsZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fZXZlbnRJbnB1dC5vbignd2hlZWwnLCBfaGFuZGxlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9pblByb2dyZXNzID0gZmFsc2U7XG4gICAgdGhpcy5fbG9vcEJvdW5kID0gZmFsc2U7XG59XG5TY3JvbGxTeW5jLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBkaXJlY3Rpb246IHVuZGVmaW5lZCxcbiAgICBtaW5pbXVtRW5kU3BlZWQ6IEluZmluaXR5LFxuICAgIHJhaWxzOiBmYWxzZSxcbiAgICBzY2FsZTogMSxcbiAgICBzdGFsbFRpbWU6IDUwLFxuICAgIGxpbmVIZWlnaHQ6IDQwLFxuICAgIHByZXZlbnREZWZhdWx0OiB0cnVlXG59O1xuU2Nyb2xsU3luYy5ESVJFQ1RJT05fWCA9IDA7XG5TY3JvbGxTeW5jLkRJUkVDVElPTl9ZID0gMTtcbnZhciBNSU5JTVVNX1RJQ0tfVElNRSA9IDg7XG52YXIgX25vdyA9IERhdGUubm93O1xuZnVuY3Rpb24gX25ld0ZyYW1lKCkge1xuICAgIGlmICh0aGlzLl9pblByb2dyZXNzICYmIF9ub3coKSAtIHRoaXMuX3ByZXZUaW1lID4gdGhpcy5vcHRpb25zLnN0YWxsVGltZSkge1xuICAgICAgICB0aGlzLl9pblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHZhciBmaW5hbFZlbCA9IE1hdGguYWJzKHRoaXMuX3ByZXZWZWwpID49IHRoaXMub3B0aW9ucy5taW5pbXVtRW5kU3BlZWQgPyB0aGlzLl9wcmV2VmVsIDogMDtcbiAgICAgICAgdmFyIHBheWxvYWQgPSB0aGlzLl9wYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb247XG4gICAgICAgIHBheWxvYWQudmVsb2NpdHkgPSBmaW5hbFZlbDtcbiAgICAgICAgcGF5bG9hZC5zbGlwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnZW5kJywgcGF5bG9hZCk7XG4gICAgfVxufVxuZnVuY3Rpb24gX2hhbmRsZU1vdmUoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnByZXZlbnREZWZhdWx0KVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghdGhpcy5faW5Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLl9pblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdIDogMDtcbiAgICAgICAgcGF5bG9hZCA9IHRoaXMuX3BheWxvYWQ7XG4gICAgICAgIHBheWxvYWQuc2xpcCA9IHRydWU7XG4gICAgICAgIHBheWxvYWQucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbjtcbiAgICAgICAgcGF5bG9hZC5jbGllbnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgcGF5bG9hZC5jbGllbnRZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgcGF5bG9hZC5vZmZzZXRYID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgICAgcGF5bG9hZC5vZmZzZXRZID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgnc3RhcnQnLCBwYXlsb2FkKTtcbiAgICAgICAgaWYgKCF0aGlzLl9sb29wQm91bmQpIHtcbiAgICAgICAgICAgIEVuZ2luZS5vbigncHJlcmVuZGVyJywgX25ld0ZyYW1lLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5fbG9vcEJvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgY3VyclRpbWUgPSBfbm93KCk7XG4gICAgdmFyIHByZXZUaW1lID0gdGhpcy5fcHJldlRpbWUgfHwgY3VyclRpbWU7XG4gICAgdmFyIGRpZmZYID0gZXZlbnQud2hlZWxEZWx0YVggIT09IHVuZGVmaW5lZCA/IGV2ZW50LndoZWVsRGVsdGFYIDogLWV2ZW50LmRlbHRhWDtcbiAgICB2YXIgZGlmZlkgPSBldmVudC53aGVlbERlbHRhWSAhPT0gdW5kZWZpbmVkID8gZXZlbnQud2hlZWxEZWx0YVkgOiAtZXZlbnQuZGVsdGFZO1xuICAgIGlmIChldmVudC5kZWx0YU1vZGUgPT09IDEpIHtcbiAgICAgICAgZGlmZlggKj0gdGhpcy5vcHRpb25zLmxpbmVIZWlnaHQ7XG4gICAgICAgIGRpZmZZICo9IHRoaXMub3B0aW9ucy5saW5lSGVpZ2h0O1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhaWxzKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPiBNYXRoLmFicyhkaWZmWSkpXG4gICAgICAgICAgICBkaWZmWSA9IDA7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRpZmZYID0gMDtcbiAgICB9XG4gICAgdmFyIGRpZmZUaW1lID0gTWF0aC5tYXgoY3VyclRpbWUgLSBwcmV2VGltZSwgTUlOSU1VTV9USUNLX1RJTUUpO1xuICAgIHZhciB2ZWxYID0gZGlmZlggLyBkaWZmVGltZTtcbiAgICB2YXIgdmVsWSA9IGRpZmZZIC8gZGlmZlRpbWU7XG4gICAgdmFyIHNjYWxlID0gdGhpcy5vcHRpb25zLnNjYWxlO1xuICAgIHZhciBuZXh0VmVsO1xuICAgIHZhciBuZXh0RGVsdGE7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFNjcm9sbFN5bmMuRElSRUNUSU9OX1gpIHtcbiAgICAgICAgbmV4dERlbHRhID0gc2NhbGUgKiBkaWZmWDtcbiAgICAgICAgbmV4dFZlbCA9IHNjYWxlICogdmVsWDtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gKz0gbmV4dERlbHRhO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gU2Nyb2xsU3luYy5ESVJFQ1RJT05fWSkge1xuICAgICAgICBuZXh0RGVsdGEgPSBzY2FsZSAqIGRpZmZZO1xuICAgICAgICBuZXh0VmVsID0gc2NhbGUgKiB2ZWxZO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiArPSBuZXh0RGVsdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dERlbHRhID0gW1xuICAgICAgICAgICAgc2NhbGUgKiBkaWZmWCxcbiAgICAgICAgICAgIHNjYWxlICogZGlmZllcbiAgICAgICAgXTtcbiAgICAgICAgbmV4dFZlbCA9IFtcbiAgICAgICAgICAgIHNjYWxlICogdmVsWCxcbiAgICAgICAgICAgIHNjYWxlICogdmVsWVxuICAgICAgICBdO1xuICAgICAgICB0aGlzLl9wb3NpdGlvblswXSArPSBuZXh0RGVsdGFbMF07XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWzFdICs9IG5leHREZWx0YVsxXTtcbiAgICB9XG4gICAgdmFyIHBheWxvYWQgPSB0aGlzLl9wYXlsb2FkO1xuICAgIHBheWxvYWQuZGVsdGEgPSBuZXh0RGVsdGE7XG4gICAgcGF5bG9hZC52ZWxvY2l0eSA9IG5leHRWZWw7XG4gICAgcGF5bG9hZC5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xuICAgIHBheWxvYWQuc2xpcCA9IHRydWU7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgndXBkYXRlJywgcGF5bG9hZCk7XG4gICAgdGhpcy5fcHJldlRpbWUgPSBjdXJyVGltZTtcbiAgICB0aGlzLl9wcmV2VmVsID0gbmV4dFZlbDtcbn1cblNjcm9sbFN5bmMucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG59O1xuU2Nyb2xsU3luYy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zTWFuYWdlci5zZXRPcHRpb25zKG9wdGlvbnMpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsU3luYzsiLCJ2YXIgVG91Y2hUcmFja2VyID0gcmVxdWlyZSgnLi9Ub3VjaFRyYWNrZXInKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuLi9jb3JlL0V2ZW50SGFuZGxlcicpO1xudmFyIE9wdGlvbnNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29yZS9PcHRpb25zTWFuYWdlcicpO1xuZnVuY3Rpb24gVG91Y2hTeW5jKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKFRvdWNoU3luYy5ERUZBVUxUX09QVElPTlMpO1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLl90b3VjaFRyYWNrZXIgPSBuZXcgVG91Y2hUcmFja2VyKCk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRJbnB1dEhhbmRsZXIodGhpcywgdGhpcy5fdG91Y2hUcmFja2VyKTtcbiAgICB0aGlzLl90b3VjaFRyYWNrZXIub24oJ3RyYWNrc3RhcnQnLCBfaGFuZGxlU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fdG91Y2hUcmFja2VyLm9uKCd0cmFja21vdmUnLCBfaGFuZGxlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl90b3VjaFRyYWNrZXIub24oJ3RyYWNrZW5kJywgX2hhbmRsZUVuZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9wYXlsb2FkID0ge1xuICAgICAgICBkZWx0YTogbnVsbCxcbiAgICAgICAgcG9zaXRpb246IG51bGwsXG4gICAgICAgIHZlbG9jaXR5OiBudWxsLFxuICAgICAgICBjbGllbnRYOiB1bmRlZmluZWQsXG4gICAgICAgIGNsaWVudFk6IHVuZGVmaW5lZCxcbiAgICAgICAgY291bnQ6IDAsXG4gICAgICAgIHRvdWNoOiB1bmRlZmluZWRcbiAgICB9O1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gbnVsbDtcbn1cblRvdWNoU3luYy5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgZGlyZWN0aW9uOiB1bmRlZmluZWQsXG4gICAgcmFpbHM6IGZhbHNlLFxuICAgIHNjYWxlOiAxXG59O1xuVG91Y2hTeW5jLkRJUkVDVElPTl9YID0gMDtcblRvdWNoU3luYy5ESVJFQ1RJT05fWSA9IDE7XG52YXIgTUlOSU1VTV9USUNLX1RJTUUgPSA4O1xuZnVuY3Rpb24gX2hhbmRsZVN0YXJ0KGRhdGEpIHtcbiAgICB2YXIgdmVsb2NpdHk7XG4gICAgdmFyIGRlbHRhO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlyZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSAwO1xuICAgICAgICB2ZWxvY2l0eSA9IDA7XG4gICAgICAgIGRlbHRhID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF07XG4gICAgICAgIHZlbG9jaXR5ID0gW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXTtcbiAgICAgICAgZGVsdGEgPSBbXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdO1xuICAgIH1cbiAgICB2YXIgcGF5bG9hZCA9IHRoaXMuX3BheWxvYWQ7XG4gICAgcGF5bG9hZC5kZWx0YSA9IGRlbHRhO1xuICAgIHBheWxvYWQucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbjtcbiAgICBwYXlsb2FkLnZlbG9jaXR5ID0gdmVsb2NpdHk7XG4gICAgcGF5bG9hZC5jbGllbnRYID0gZGF0YS54O1xuICAgIHBheWxvYWQuY2xpZW50WSA9IGRhdGEueTtcbiAgICBwYXlsb2FkLmNvdW50ID0gZGF0YS5jb3VudDtcbiAgICBwYXlsb2FkLnRvdWNoID0gZGF0YS5pZGVudGlmaWVyO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ3N0YXJ0JywgcGF5bG9hZCk7XG59XG5mdW5jdGlvbiBfaGFuZGxlTW92ZShkYXRhKSB7XG4gICAgdmFyIGhpc3RvcnkgPSBkYXRhLmhpc3Rvcnk7XG4gICAgdmFyIGN1cnJIaXN0b3J5ID0gaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdO1xuICAgIHZhciBwcmV2SGlzdG9yeSA9IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAyXTtcbiAgICB2YXIgcHJldlRpbWUgPSBwcmV2SGlzdG9yeS50aW1lc3RhbXA7XG4gICAgdmFyIGN1cnJUaW1lID0gY3Vyckhpc3RvcnkudGltZXN0YW1wO1xuICAgIHZhciBkaWZmWCA9IGN1cnJIaXN0b3J5LnggLSBwcmV2SGlzdG9yeS54O1xuICAgIHZhciBkaWZmWSA9IGN1cnJIaXN0b3J5LnkgLSBwcmV2SGlzdG9yeS55O1xuICAgIGlmICh0aGlzLm9wdGlvbnMucmFpbHMpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA+IE1hdGguYWJzKGRpZmZZKSlcbiAgICAgICAgICAgIGRpZmZZID0gMDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGlmZlggPSAwO1xuICAgIH1cbiAgICB2YXIgZGlmZlRpbWUgPSBNYXRoLm1heChjdXJyVGltZSAtIHByZXZUaW1lLCBNSU5JTVVNX1RJQ0tfVElNRSk7XG4gICAgdmFyIHZlbFggPSBkaWZmWCAvIGRpZmZUaW1lO1xuICAgIHZhciB2ZWxZID0gZGlmZlkgLyBkaWZmVGltZTtcbiAgICB2YXIgc2NhbGUgPSB0aGlzLm9wdGlvbnMuc2NhbGU7XG4gICAgdmFyIG5leHRWZWw7XG4gICAgdmFyIG5leHREZWx0YTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gVG91Y2hTeW5jLkRJUkVDVElPTl9YKSB7XG4gICAgICAgIG5leHREZWx0YSA9IHNjYWxlICogZGlmZlg7XG4gICAgICAgIG5leHRWZWwgPSBzY2FsZSAqIHZlbFg7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uICs9IG5leHREZWx0YTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFRvdWNoU3luYy5ESVJFQ1RJT05fWSkge1xuICAgICAgICBuZXh0RGVsdGEgPSBzY2FsZSAqIGRpZmZZO1xuICAgICAgICBuZXh0VmVsID0gc2NhbGUgKiB2ZWxZO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiArPSBuZXh0RGVsdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dERlbHRhID0gW1xuICAgICAgICAgICAgc2NhbGUgKiBkaWZmWCxcbiAgICAgICAgICAgIHNjYWxlICogZGlmZllcbiAgICAgICAgXTtcbiAgICAgICAgbmV4dFZlbCA9IFtcbiAgICAgICAgICAgIHNjYWxlICogdmVsWCxcbiAgICAgICAgICAgIHNjYWxlICogdmVsWVxuICAgICAgICBdO1xuICAgICAgICB0aGlzLl9wb3NpdGlvblswXSArPSBuZXh0RGVsdGFbMF07XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWzFdICs9IG5leHREZWx0YVsxXTtcbiAgICB9XG4gICAgdmFyIHBheWxvYWQgPSB0aGlzLl9wYXlsb2FkO1xuICAgIHBheWxvYWQuZGVsdGEgPSBuZXh0RGVsdGE7XG4gICAgcGF5bG9hZC52ZWxvY2l0eSA9IG5leHRWZWw7XG4gICAgcGF5bG9hZC5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xuICAgIHBheWxvYWQuY2xpZW50WCA9IGRhdGEueDtcbiAgICBwYXlsb2FkLmNsaWVudFkgPSBkYXRhLnk7XG4gICAgcGF5bG9hZC5jb3VudCA9IGRhdGEuY291bnQ7XG4gICAgcGF5bG9hZC50b3VjaCA9IGRhdGEuaWRlbnRpZmllcjtcbiAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCd1cGRhdGUnLCBwYXlsb2FkKTtcbn1cbmZ1bmN0aW9uIF9oYW5kbGVFbmQoZGF0YSkge1xuICAgIHRoaXMuX3BheWxvYWQuY291bnQgPSBkYXRhLmNvdW50O1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ2VuZCcsIHRoaXMuX3BheWxvYWQpO1xufVxuVG91Y2hTeW5jLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnNldE9wdGlvbnMob3B0aW9ucyk7XG59O1xuVG91Y2hTeW5jLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xufTtcbm1vZHVsZS5leHBvcnRzID0gVG91Y2hTeW5jOyIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCcuLi9jb3JlL0V2ZW50SGFuZGxlcicpO1xudmFyIF9ub3cgPSBEYXRlLm5vdztcbmZ1bmN0aW9uIF90aW1lc3RhbXBUb3VjaCh0b3VjaCwgZXZlbnQsIGhpc3RvcnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiB0b3VjaC5jbGllbnRYLFxuICAgICAgICB5OiB0b3VjaC5jbGllbnRZLFxuICAgICAgICBpZGVudGlmaWVyOiB0b3VjaC5pZGVudGlmaWVyLFxuICAgICAgICBvcmlnaW46IGV2ZW50Lm9yaWdpbixcbiAgICAgICAgdGltZXN0YW1wOiBfbm93KCksXG4gICAgICAgIGNvdW50OiBldmVudC50b3VjaGVzLmxlbmd0aCxcbiAgICAgICAgaGlzdG9yeTogaGlzdG9yeVxuICAgIH07XG59XG5mdW5jdGlvbiBfaGFuZGxlU3RhcnQoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICB2YXIgZGF0YSA9IF90aW1lc3RhbXBUb3VjaCh0b3VjaCwgZXZlbnQsIG51bGwpO1xuICAgICAgICB0aGlzLmV2ZW50T3V0cHV0LmVtaXQoJ3RyYWNrc3RhcnQnLCBkYXRhKTtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGl2ZSAmJiAhdGhpcy50b3VjaEhpc3RvcnlbdG91Y2guaWRlbnRpZmllcl0pXG4gICAgICAgICAgICB0aGlzLnRyYWNrKGRhdGEpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9oYW5kbGVNb3ZlKGV2ZW50KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1tpXTtcbiAgICAgICAgdmFyIGhpc3RvcnkgPSB0aGlzLnRvdWNoSGlzdG9yeVt0b3VjaC5pZGVudGlmaWVyXTtcbiAgICAgICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gX3RpbWVzdGFtcFRvdWNoKHRvdWNoLCBldmVudCwgaGlzdG9yeSk7XG4gICAgICAgICAgICB0aGlzLnRvdWNoSGlzdG9yeVt0b3VjaC5pZGVudGlmaWVyXS5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5ldmVudE91dHB1dC5lbWl0KCd0cmFja21vdmUnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIF9oYW5kbGVFbmQoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xuICAgICAgICB2YXIgaGlzdG9yeSA9IHRoaXMudG91Y2hIaXN0b3J5W3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBfdGltZXN0YW1wVG91Y2godG91Y2gsIGV2ZW50LCBoaXN0b3J5KTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRPdXRwdXQuZW1pdCgndHJhY2tlbmQnLCBkYXRhKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoSGlzdG9yeVt0b3VjaC5pZGVudGlmaWVyXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIF9oYW5kbGVVbnBpcGUoKSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLnRvdWNoSGlzdG9yeSkge1xuICAgICAgICB2YXIgaGlzdG9yeSA9IHRoaXMudG91Y2hIaXN0b3J5W2ldO1xuICAgICAgICB0aGlzLmV2ZW50T3V0cHV0LmVtaXQoJ3RyYWNrZW5kJywge1xuICAgICAgICAgICAgdG91Y2g6IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXS50b3VjaCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIGNvdW50OiAwLFxuICAgICAgICAgICAgaGlzdG9yeTogaGlzdG9yeVxuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIHRoaXMudG91Y2hIaXN0b3J5W2ldO1xuICAgIH1cbn1cbmZ1bmN0aW9uIFRvdWNoVHJhY2tlcihzZWxlY3RpdmUpIHtcbiAgICB0aGlzLnNlbGVjdGl2ZSA9IHNlbGVjdGl2ZTtcbiAgICB0aGlzLnRvdWNoSGlzdG9yeSA9IHt9O1xuICAgIHRoaXMuZXZlbnRJbnB1dCA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLmV2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRJbnB1dEhhbmRsZXIodGhpcywgdGhpcy5ldmVudElucHV0KTtcbiAgICBFdmVudEhhbmRsZXIuc2V0T3V0cHV0SGFuZGxlcih0aGlzLCB0aGlzLmV2ZW50T3V0cHV0KTtcbiAgICB0aGlzLmV2ZW50SW5wdXQub24oJ3RvdWNoc3RhcnQnLCBfaGFuZGxlU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudElucHV0Lm9uKCd0b3VjaG1vdmUnLCBfaGFuZGxlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50SW5wdXQub24oJ3RvdWNoZW5kJywgX2hhbmRsZUVuZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50SW5wdXQub24oJ3RvdWNoY2FuY2VsJywgX2hhbmRsZUVuZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmV2ZW50SW5wdXQub24oJ3VucGlwZScsIF9oYW5kbGVVbnBpcGUuYmluZCh0aGlzKSk7XG59XG5Ub3VjaFRyYWNrZXIucHJvdG90eXBlLnRyYWNrID0gZnVuY3Rpb24gdHJhY2soZGF0YSkge1xuICAgIHRoaXMudG91Y2hIaXN0b3J5W2RhdGEuaWRlbnRpZmllcl0gPSBbZGF0YV07XG59O1xubW9kdWxlLmV4cG9ydHMgPSBUb3VjaFRyYWNrZXI7IiwiZnVuY3Rpb24gVmVjdG9yKHgsIHksIHopIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuc2V0KHgpO1xuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICAgICAgdGhpcy56ID0geiB8fCAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cbnZhciBfcmVnaXN0ZXIgPSBuZXcgVmVjdG9yKDAsIDAsIDApO1xuVmVjdG9yLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQodikge1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwoX3JlZ2lzdGVyLCB0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSwgdGhpcy56ICsgdi56KTtcbn07XG5WZWN0b3IucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uIHN1Yih2KSB7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbChfcmVnaXN0ZXIsIHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55LCB0aGlzLnogLSB2LnopO1xufTtcblZlY3Rvci5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uIG11bHQocikge1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwoX3JlZ2lzdGVyLCByICogdGhpcy54LCByICogdGhpcy55LCByICogdGhpcy56KTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uIGRpdihyKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdCgxIC8gcik7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uIGNyb3NzKHYpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcbiAgICB2YXIgdnggPSB2Lng7XG4gICAgdmFyIHZ5ID0gdi55O1xuICAgIHZhciB2eiA9IHYuejtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKF9yZWdpc3RlciwgeiAqIHZ5IC0geSAqIHZ6LCB4ICogdnogLSB6ICogdngsIHkgKiB2eCAtIHggKiB2eSk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHModikge1xuICAgIHJldHVybiB2LnggPT09IHRoaXMueCAmJiB2LnkgPT09IHRoaXMueSAmJiB2LnogPT09IHRoaXMuejtcbn07XG5WZWN0b3IucHJvdG90eXBlLnJvdGF0ZVggPSBmdW5jdGlvbiByb3RhdGVYKHRoZXRhKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKF9yZWdpc3RlciwgeCwgeSAqIGNvc1RoZXRhIC0geiAqIHNpblRoZXRhLCB5ICogc2luVGhldGEgKyB6ICogY29zVGhldGEpO1xufTtcblZlY3Rvci5wcm90b3R5cGUucm90YXRlWSA9IGZ1bmN0aW9uIHJvdGF0ZVkodGhldGEpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwoX3JlZ2lzdGVyLCB6ICogc2luVGhldGEgKyB4ICogY29zVGhldGEsIHksIHogKiBjb3NUaGV0YSAtIHggKiBzaW5UaGV0YSk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5yb3RhdGVaID0gZnVuY3Rpb24gcm90YXRlWih0aGV0YSkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbChfcmVnaXN0ZXIsIHggKiBjb3NUaGV0YSAtIHkgKiBzaW5UaGV0YSwgeCAqIHNpblRoZXRhICsgeSAqIGNvc1RoZXRhLCB6KTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uIGRvdCh2KSB7XG4gICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueSArIHRoaXMueiAqIHYuejtcbn07XG5WZWN0b3IucHJvdG90eXBlLm5vcm1TcXVhcmVkID0gZnVuY3Rpb24gbm9ybVNxdWFyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG90KHRoaXMpO1xufTtcblZlY3Rvci5wcm90b3R5cGUubm9ybSA9IGZ1bmN0aW9uIG5vcm0oKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLm5vcm1TcXVhcmVkKCkpO1xufTtcblZlY3Rvci5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKGxlbmd0aCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgICBsZW5ndGggPSAxO1xuICAgIHZhciBub3JtID0gdGhpcy5ub3JtKCk7XG4gICAgaWYgKG5vcm0gPiAxZS03KVxuICAgICAgICByZXR1cm4gX3NldEZyb21WZWN0b3IuY2FsbChfcmVnaXN0ZXIsIHRoaXMubXVsdChsZW5ndGggLyBub3JtKSk7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gX3NldFhZWi5jYWxsKF9yZWdpc3RlciwgbGVuZ3RoLCAwLCAwKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcyk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5pc1plcm8gPSBmdW5jdGlvbiBpc1plcm8oKSB7XG4gICAgcmV0dXJuICEodGhpcy54IHx8IHRoaXMueSB8fCB0aGlzLnopO1xufTtcbmZ1bmN0aW9uIF9zZXRYWVooeCwgeSwgeikge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnogPSB6O1xuICAgIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gX3NldEZyb21BcnJheSh2KSB7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbCh0aGlzLCB2WzBdLCB2WzFdLCB2WzJdIHx8IDApO1xufVxuZnVuY3Rpb24gX3NldEZyb21WZWN0b3Iodikge1xuICAgIHJldHVybiBfc2V0WFlaLmNhbGwodGhpcywgdi54LCB2LnksIHYueik7XG59XG5mdW5jdGlvbiBfc2V0RnJvbU51bWJlcih4KSB7XG4gICAgcmV0dXJuIF9zZXRYWVouY2FsbCh0aGlzLCB4LCAwLCAwKTtcbn1cblZlY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHYpIHtcbiAgICBpZiAodiBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICByZXR1cm4gX3NldEZyb21BcnJheS5jYWxsKHRoaXMsIHYpO1xuICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpXG4gICAgICAgIHJldHVybiBfc2V0RnJvbU51bWJlci5jYWxsKHRoaXMsIHYpO1xuICAgIHJldHVybiBfc2V0RnJvbVZlY3Rvci5jYWxsKHRoaXMsIHYpO1xufTtcblZlY3Rvci5wcm90b3R5cGUuc2V0WFlaID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICByZXR1cm4gX3NldFhZWi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblZlY3Rvci5wcm90b3R5cGUuc2V0MUQgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBfc2V0RnJvbU51bWJlci5jYWxsKHRoaXMsIHgpO1xufTtcblZlY3Rvci5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gcHV0KHYpIHtcbiAgICBpZiAodGhpcyA9PT0gX3JlZ2lzdGVyKVxuICAgICAgICBfc2V0RnJvbVZlY3Rvci5jYWxsKHYsIF9yZWdpc3Rlcik7XG4gICAgZWxzZVxuICAgICAgICBfc2V0RnJvbVZlY3Rvci5jYWxsKHYsIHRoaXMpO1xufTtcblZlY3Rvci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICByZXR1cm4gX3NldFhZWi5jYWxsKHRoaXMsIDAsIDAsIDApO1xufTtcblZlY3Rvci5wcm90b3R5cGUuY2FwID0gZnVuY3Rpb24gY2FwKGNhcCkge1xuICAgIGlmIChjYXAgPT09IEluZmluaXR5KVxuICAgICAgICByZXR1cm4gX3NldEZyb21WZWN0b3IuY2FsbChfcmVnaXN0ZXIsIHRoaXMpO1xuICAgIHZhciBub3JtID0gdGhpcy5ub3JtKCk7XG4gICAgaWYgKG5vcm0gPiBjYXApXG4gICAgICAgIHJldHVybiBfc2V0RnJvbVZlY3Rvci5jYWxsKF9yZWdpc3RlciwgdGhpcy5tdWx0KGNhcCAvIG5vcm0pKTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBfc2V0RnJvbVZlY3Rvci5jYWxsKF9yZWdpc3RlciwgdGhpcyk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0ID0gZnVuY3Rpb24gcHJvamVjdChuKSB7XG4gICAgcmV0dXJuIG4ubXVsdCh0aGlzLmRvdChuKSk7XG59O1xuVmVjdG9yLnByb3RvdHlwZS5yZWZsZWN0QWNyb3NzID0gZnVuY3Rpb24gcmVmbGVjdEFjcm9zcyhuKSB7XG4gICAgbi5ub3JtYWxpemUoKS5wdXQobik7XG4gICAgcmV0dXJuIF9zZXRGcm9tVmVjdG9yKF9yZWdpc3RlciwgdGhpcy5zdWIodGhpcy5wcm9qZWN0KG4pLm11bHQoMikpKTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLngsXG4gICAgICAgIHRoaXMueSxcbiAgICAgICAgdGhpcy56XG4gICAgXTtcbn07XG5WZWN0b3IucHJvdG90eXBlLmdldDFEID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLng7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7IiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL0V2ZW50SGFuZGxlcicpO1xuZnVuY3Rpb24gUGh5c2ljc0VuZ2luZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZShQaHlzaWNzRW5naW5lLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9wYXJ0aWNsZXMgPSBbXTtcbiAgICB0aGlzLl9ib2RpZXMgPSBbXTtcbiAgICB0aGlzLl9hZ2VudHMgPSB7fTtcbiAgICB0aGlzLl9mb3JjZXMgPSBbXTtcbiAgICB0aGlzLl9jb25zdHJhaW50cyA9IFtdO1xuICAgIHRoaXMuX2J1ZmZlciA9IDA7XG4gICAgdGhpcy5fcHJldlRpbWUgPSBub3coKTtcbiAgICB0aGlzLl9pc1NsZWVwaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fZXZlbnRIYW5kbGVyID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyQWdlbnRJZCA9IDA7XG4gICAgdGhpcy5faGFzQm9kaWVzID0gZmFsc2U7XG59XG52YXIgVElNRVNURVAgPSAxNztcbnZhciBNSU5fVElNRV9TVEVQID0gMTAwMCAvIDEyMDtcbnZhciBNQVhfVElNRV9TVEVQID0gMTc7XG5QaHlzaWNzRW5naW5lLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBjb25zdHJhaW50U3RlcHM6IDEsXG4gICAgc2xlZXBUb2xlcmFuY2U6IDFlLTdcbn07XG52YXIgbm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3c7XG4gICAgfSgpO1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0cykge1xuICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zW2tleV0pXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5hZGRCb2R5ID0gZnVuY3Rpb24gYWRkQm9keShib2R5KSB7XG4gICAgYm9keS5fZW5naW5lID0gdGhpcztcbiAgICBpZiAoYm9keS5pc0JvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9kaWVzLnB1c2goYm9keSk7XG4gICAgICAgIHRoaXMuX2hhc0JvZGllcyA9IHRydWU7XG4gICAgfSBlbHNlXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlcy5wdXNoKGJvZHkpO1xuICAgIHJldHVybiBib2R5O1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLnJlbW92ZUJvZHkgPSBmdW5jdGlvbiByZW1vdmVCb2R5KGJvZHkpIHtcbiAgICB2YXIgYXJyYXkgPSBib2R5LmlzQm9keSA/IHRoaXMuX2JvZGllcyA6IHRoaXMuX3BhcnRpY2xlcztcbiAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKGJvZHkpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXModGhpcy5fYWdlbnRzKS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoRnJvbShpLCBib2R5KTtcbiAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0Qm9kaWVzKCkubGVuZ3RoID09PSAwKVxuICAgICAgICB0aGlzLl9oYXNCb2RpZXMgPSBmYWxzZTtcbn07XG5mdW5jdGlvbiBfbWFwQWdlbnRBcnJheShhZ2VudCkge1xuICAgIGlmIChhZ2VudC5hcHBseUZvcmNlKVxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yY2VzO1xuICAgIGlmIChhZ2VudC5hcHBseUNvbnN0cmFpbnQpXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25zdHJhaW50cztcbn1cbmZ1bmN0aW9uIF9hdHRhY2hPbmUoYWdlbnQsIHRhcmdldHMsIHNvdXJjZSkge1xuICAgIGlmICh0YXJnZXRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRhcmdldHMgPSB0aGlzLmdldFBhcnRpY2xlc0FuZEJvZGllcygpO1xuICAgIGlmICghKHRhcmdldHMgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICAgIHRhcmdldHMgPSBbdGFyZ2V0c107XG4gICAgdGhpcy5fYWdlbnRzW3RoaXMuX2N1cnJBZ2VudElkXSA9IHtcbiAgICAgICAgYWdlbnQ6IGFnZW50LFxuICAgICAgICB0YXJnZXRzOiB0YXJnZXRzLFxuICAgICAgICBzb3VyY2U6IHNvdXJjZVxuICAgIH07XG4gICAgX21hcEFnZW50QXJyYXkuY2FsbCh0aGlzLCBhZ2VudCkucHVzaCh0aGlzLl9jdXJyQWdlbnRJZCk7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJBZ2VudElkKys7XG59XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiBhdHRhY2goYWdlbnRzLCB0YXJnZXRzLCBzb3VyY2UpIHtcbiAgICBpZiAoYWdlbnRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdmFyIGFnZW50SURzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWdlbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgYWdlbnRJRHNbaV0gPSBfYXR0YWNoT25lLmNhbGwodGhpcywgYWdlbnRzW2ldLCB0YXJnZXRzLCBzb3VyY2UpO1xuICAgICAgICByZXR1cm4gYWdlbnRJRHM7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiBfYXR0YWNoT25lLmNhbGwodGhpcywgYWdlbnRzLCB0YXJnZXRzLCBzb3VyY2UpO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmF0dGFjaFRvID0gZnVuY3Rpb24gYXR0YWNoVG8oYWdlbnRJRCwgdGFyZ2V0KSB7XG4gICAgX2dldEJvdW5kQWdlbnQuY2FsbCh0aGlzLCBhZ2VudElEKS50YXJnZXRzLnB1c2godGFyZ2V0KTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5kZXRhY2ggPSBmdW5jdGlvbiBkZXRhY2goaWQpIHtcbiAgICB2YXIgYWdlbnQgPSB0aGlzLmdldEFnZW50KGlkKTtcbiAgICB2YXIgYWdlbnRBcnJheSA9IF9tYXBBZ2VudEFycmF5LmNhbGwodGhpcywgYWdlbnQpO1xuICAgIHZhciBpbmRleCA9IGFnZW50QXJyYXkuaW5kZXhPZihpZCk7XG4gICAgYWdlbnRBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGRlbGV0ZSB0aGlzLl9hZ2VudHNbaWRdO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmRldGFjaEZyb20gPSBmdW5jdGlvbiBkZXRhY2hGcm9tKGlkLCB0YXJnZXQpIHtcbiAgICB2YXIgYm91bmRBZ2VudCA9IF9nZXRCb3VuZEFnZW50LmNhbGwodGhpcywgaWQpO1xuICAgIGlmIChib3VuZEFnZW50LnNvdXJjZSA9PT0gdGFyZ2V0KVxuICAgICAgICB0aGlzLmRldGFjaChpZCk7XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB0YXJnZXRzID0gYm91bmRBZ2VudC50YXJnZXRzO1xuICAgICAgICB2YXIgaW5kZXggPSB0YXJnZXRzLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgICAgICB0YXJnZXRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmRldGFjaEFsbCA9IGZ1bmN0aW9uIGRldGFjaEFsbCgpIHtcbiAgICB0aGlzLl9hZ2VudHMgPSB7fTtcbiAgICB0aGlzLl9mb3JjZXMgPSBbXTtcbiAgICB0aGlzLl9jb25zdHJhaW50cyA9IFtdO1xuICAgIHRoaXMuX2N1cnJBZ2VudElkID0gMDtcbn07XG5mdW5jdGlvbiBfZ2V0Qm91bmRBZ2VudChpZCkge1xuICAgIHJldHVybiB0aGlzLl9hZ2VudHNbaWRdO1xufVxuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZ2V0QWdlbnQgPSBmdW5jdGlvbiBnZXRBZ2VudChpZCkge1xuICAgIHJldHVybiBfZ2V0Qm91bmRBZ2VudC5jYWxsKHRoaXMsIGlkKS5hZ2VudDtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5nZXRQYXJ0aWNsZXMgPSBmdW5jdGlvbiBnZXRQYXJ0aWNsZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlcztcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5nZXRCb2RpZXMgPSBmdW5jdGlvbiBnZXRCb2RpZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JvZGllcztcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5nZXRQYXJ0aWNsZXNBbmRCb2RpZXMgPSBmdW5jdGlvbiBnZXRQYXJ0aWNsZXNBbmRCb2RpZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFydGljbGVzKCkuY29uY2F0KHRoaXMuZ2V0Qm9kaWVzKCkpO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmZvckVhY2hQYXJ0aWNsZSA9IGZ1bmN0aW9uIGZvckVhY2hQYXJ0aWNsZShmbiwgZHQpIHtcbiAgICB2YXIgcGFydGljbGVzID0gdGhpcy5nZXRQYXJ0aWNsZXMoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbiA9IHBhcnRpY2xlcy5sZW5ndGg7IGluZGV4IDwgbGVuOyBpbmRleCsrKVxuICAgICAgICBmbi5jYWxsKHRoaXMsIHBhcnRpY2xlc1tpbmRleF0sIGR0KTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5mb3JFYWNoQm9keSA9IGZ1bmN0aW9uIGZvckVhY2hCb2R5KGZuLCBkdCkge1xuICAgIGlmICghdGhpcy5faGFzQm9kaWVzKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIGJvZGllcyA9IHRoaXMuZ2V0Qm9kaWVzKCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW4gPSBib2RpZXMubGVuZ3RoOyBpbmRleCA8IGxlbjsgaW5kZXgrKylcbiAgICAgICAgZm4uY2FsbCh0aGlzLCBib2RpZXNbaW5kZXhdLCBkdCk7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4sIGR0KSB7XG4gICAgdGhpcy5mb3JFYWNoUGFydGljbGUoZm4sIGR0KTtcbiAgICB0aGlzLmZvckVhY2hCb2R5KGZuLCBkdCk7XG59O1xuZnVuY3Rpb24gX3VwZGF0ZUZvcmNlKGluZGV4KSB7XG4gICAgdmFyIGJvdW5kQWdlbnQgPSBfZ2V0Qm91bmRBZ2VudC5jYWxsKHRoaXMsIHRoaXMuX2ZvcmNlc1tpbmRleF0pO1xuICAgIGJvdW5kQWdlbnQuYWdlbnQuYXBwbHlGb3JjZShib3VuZEFnZW50LnRhcmdldHMsIGJvdW5kQWdlbnQuc291cmNlKTtcbn1cbmZ1bmN0aW9uIF91cGRhdGVGb3JjZXMoKSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSB0aGlzLl9mb3JjZXMubGVuZ3RoIC0gMTsgaW5kZXggPiAtMTsgaW5kZXgtLSlcbiAgICAgICAgX3VwZGF0ZUZvcmNlLmNhbGwodGhpcywgaW5kZXgpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZUNvbnN0cmFpbnQoaW5kZXgsIGR0KSB7XG4gICAgdmFyIGJvdW5kQWdlbnQgPSB0aGlzLl9hZ2VudHNbdGhpcy5fY29uc3RyYWludHNbaW5kZXhdXTtcbiAgICByZXR1cm4gYm91bmRBZ2VudC5hZ2VudC5hcHBseUNvbnN0cmFpbnQoYm91bmRBZ2VudC50YXJnZXRzLCBib3VuZEFnZW50LnNvdXJjZSwgZHQpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZUNvbnN0cmFpbnRzKGR0KSB7XG4gICAgdmFyIGl0ZXJhdGlvbiA9IDA7XG4gICAgd2hpbGUgKGl0ZXJhdGlvbiA8IHRoaXMub3B0aW9ucy5jb25zdHJhaW50U3RlcHMpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSB0aGlzLl9jb25zdHJhaW50cy5sZW5ndGggLSAxOyBpbmRleCA+IC0xOyBpbmRleC0tKVxuICAgICAgICAgICAgX3VwZGF0ZUNvbnN0cmFpbnQuY2FsbCh0aGlzLCBpbmRleCwgZHQpO1xuICAgICAgICBpdGVyYXRpb24rKztcbiAgICB9XG59XG5mdW5jdGlvbiBfdXBkYXRlVmVsb2NpdGllcyhwYXJ0aWNsZSwgZHQpIHtcbiAgICBwYXJ0aWNsZS5pbnRlZ3JhdGVWZWxvY2l0eShkdCk7XG59XG5mdW5jdGlvbiBfdXBkYXRlQW5ndWxhclZlbG9jaXRpZXMoYm9keSwgZHQpIHtcbiAgICBib2R5LmludGVncmF0ZUFuZ3VsYXJNb21lbnR1bShkdCk7XG4gICAgYm9keS51cGRhdGVBbmd1bGFyVmVsb2NpdHkoKTtcbn1cbmZ1bmN0aW9uIF91cGRhdGVPcmllbnRhdGlvbnMoYm9keSwgZHQpIHtcbiAgICBib2R5LmludGVncmF0ZU9yaWVudGF0aW9uKGR0KTtcbn1cbmZ1bmN0aW9uIF91cGRhdGVQb3NpdGlvbnMocGFydGljbGUsIGR0KSB7XG4gICAgcGFydGljbGUuaW50ZWdyYXRlUG9zaXRpb24oZHQpO1xuICAgIHBhcnRpY2xlLmVtaXQoJ3VwZGF0ZScsIHBhcnRpY2xlKTtcbn1cbmZ1bmN0aW9uIF9pbnRlZ3JhdGUoZHQpIHtcbiAgICBfdXBkYXRlRm9yY2VzLmNhbGwodGhpcywgZHQpO1xuICAgIHRoaXMuZm9yRWFjaChfdXBkYXRlVmVsb2NpdGllcywgZHQpO1xuICAgIHRoaXMuZm9yRWFjaEJvZHkoX3VwZGF0ZUFuZ3VsYXJWZWxvY2l0aWVzLCBkdCk7XG4gICAgX3VwZGF0ZUNvbnN0cmFpbnRzLmNhbGwodGhpcywgZHQpO1xuICAgIHRoaXMuZm9yRWFjaEJvZHkoX3VwZGF0ZU9yaWVudGF0aW9ucywgZHQpO1xuICAgIHRoaXMuZm9yRWFjaChfdXBkYXRlUG9zaXRpb25zLCBkdCk7XG59XG5mdW5jdGlvbiBfZ2V0RW5lcmd5UGFydGljbGVzKCkge1xuICAgIHZhciBlbmVyZ3kgPSAwO1xuICAgIHZhciBwYXJ0aWNsZUVuZXJneSA9IDA7XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICBwYXJ0aWNsZUVuZXJneSA9IHBhcnRpY2xlLmdldEVuZXJneSgpO1xuICAgICAgICBlbmVyZ3kgKz0gcGFydGljbGVFbmVyZ3k7XG4gICAgICAgIGlmIChwYXJ0aWNsZUVuZXJneSA8IHBhcnRpY2xlLnNsZWVwVG9sZXJhbmNlKVxuICAgICAgICAgICAgcGFydGljbGUuc2xlZXAoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZW5lcmd5O1xufVxuZnVuY3Rpb24gX2dldEVuZXJneUZvcmNlcygpIHtcbiAgICB2YXIgZW5lcmd5ID0gMDtcbiAgICBmb3IgKHZhciBpbmRleCA9IHRoaXMuX2ZvcmNlcy5sZW5ndGggLSAxOyBpbmRleCA+IC0xOyBpbmRleC0tKVxuICAgICAgICBlbmVyZ3kgKz0gdGhpcy5fZm9yY2VzW2luZGV4XS5nZXRFbmVyZ3koKSB8fCAwO1xuICAgIHJldHVybiBlbmVyZ3k7XG59XG5mdW5jdGlvbiBfZ2V0RW5lcmd5Q29uc3RyYWludHMoKSB7XG4gICAgdmFyIGVuZXJneSA9IDA7XG4gICAgZm9yICh2YXIgaW5kZXggPSB0aGlzLl9jb25zdHJhaW50cy5sZW5ndGggLSAxOyBpbmRleCA+IC0xOyBpbmRleC0tKVxuICAgICAgICBlbmVyZ3kgKz0gdGhpcy5fY29uc3RyYWludHNbaW5kZXhdLmdldEVuZXJneSgpIHx8IDA7XG4gICAgcmV0dXJuIGVuZXJneTtcbn1cblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmdldEVuZXJneSA9IGZ1bmN0aW9uIGdldEVuZXJneSgpIHtcbiAgICByZXR1cm4gX2dldEVuZXJneVBhcnRpY2xlcy5jYWxsKHRoaXMpICsgX2dldEVuZXJneUZvcmNlcy5jYWxsKHRoaXMpICsgX2dldEVuZXJneUNvbnN0cmFpbnRzLmNhbGwodGhpcyk7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uIHN0ZXAoKSB7XG4gICAgdmFyIGN1cnJUaW1lID0gbm93KCk7XG4gICAgdmFyIGR0RnJhbWUgPSBjdXJyVGltZSAtIHRoaXMuX3ByZXZUaW1lO1xuICAgIHRoaXMuX3ByZXZUaW1lID0gY3VyclRpbWU7XG4gICAgaWYgKGR0RnJhbWUgPCBNSU5fVElNRV9TVEVQKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKGR0RnJhbWUgPiBNQVhfVElNRV9TVEVQKVxuICAgICAgICBkdEZyYW1lID0gTUFYX1RJTUVfU1RFUDtcbiAgICBfaW50ZWdyYXRlLmNhbGwodGhpcywgVElNRVNURVApO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLmlzU2xlZXBpbmcgPSBmdW5jdGlvbiBpc1NsZWVwaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NsZWVwaW5nO1xufTtcblBoeXNpY3NFbmdpbmUucHJvdG90eXBlLnNsZWVwID0gZnVuY3Rpb24gc2xlZXAoKSB7XG4gICAgdGhpcy5lbWl0KCdlbmQnLCB0aGlzKTtcbiAgICB0aGlzLl9pc1NsZWVwaW5nID0gdHJ1ZTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS53YWtlID0gZnVuY3Rpb24gd2FrZSgpIHtcbiAgICB0aGlzLl9wcmV2VGltZSA9IG5vdygpO1xuICAgIHRoaXMuZW1pdCgnc3RhcnQnLCB0aGlzKTtcbiAgICB0aGlzLl9pc1NsZWVwaW5nID0gZmFsc2U7XG59O1xuUGh5c2ljc0VuZ2luZS5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSwgZGF0YSkge1xuICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXIgPT09IG51bGwpXG4gICAgICAgIHJldHVybjtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXIuZW1pdCh0eXBlLCBkYXRhKTtcbn07XG5QaHlzaWNzRW5naW5lLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbikge1xuICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXIgPT09IG51bGwpXG4gICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXIub24oZXZlbnQsIGZuKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFBoeXNpY3NFbmdpbmU7IiwidmFyIFZlY3RvciA9IHJlcXVpcmUoJ2ZhbW91cy9tYXRoL1ZlY3RvcicpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL1RyYW5zZm9ybScpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL0V2ZW50SGFuZGxlcicpO1xudmFyIEludGVncmF0b3IgPSByZXF1aXJlKCcuLi9pbnRlZ3JhdG9ycy9TeW1wbGVjdGljRXVsZXInKTtcbmZ1bmN0aW9uIFBhcnRpY2xlKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5mb3JjZSA9IG5ldyBWZWN0b3IoKTtcbiAgICB2YXIgZGVmYXVsdHMgPSBQYXJ0aWNsZS5ERUZBVUxUX09QVElPTlM7XG4gICAgdGhpcy5zZXRQb3NpdGlvbihvcHRpb25zLnBvc2l0aW9uIHx8IGRlZmF1bHRzLnBvc2l0aW9uKTtcbiAgICB0aGlzLnNldFZlbG9jaXR5KG9wdGlvbnMudmVsb2NpdHkgfHwgZGVmYXVsdHMudmVsb2NpdHkpO1xuICAgIHRoaXMuZm9yY2Uuc2V0KG9wdGlvbnMuZm9yY2UgfHwgW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXSk7XG4gICAgdGhpcy5tYXNzID0gb3B0aW9ucy5tYXNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1hc3MgOiBkZWZhdWx0cy5tYXNzO1xuICAgIHRoaXMuYXhpcyA9IG9wdGlvbnMuYXhpcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5heGlzIDogZGVmYXVsdHMuYXhpcztcbiAgICB0aGlzLmludmVyc2VNYXNzID0gMSAvIHRoaXMubWFzcztcbiAgICB0aGlzLl9pc1NsZWVwaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fZW5naW5lID0gbnVsbDtcbiAgICB0aGlzLl9ldmVudE91dHB1dCA9IG51bGw7XG4gICAgdGhpcy5fcG9zaXRpb25HZXR0ZXIgPSBudWxsO1xuICAgIHRoaXMudHJhbnNmb3JtID0gVHJhbnNmb3JtLmlkZW50aXR5LnNsaWNlKCk7XG4gICAgdGhpcy5fc3BlYyA9IHtcbiAgICAgICAgdHJhbnNmb3JtOiB0aGlzLnRyYW5zZm9ybSxcbiAgICAgICAgdGFyZ2V0OiBudWxsXG4gICAgfTtcbn1cblBhcnRpY2xlLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBwb3NpdGlvbjogW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXSxcbiAgICB2ZWxvY2l0eTogW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXSxcbiAgICBtYXNzOiAxLFxuICAgIGF4aXM6IHVuZGVmaW5lZFxufTtcblBhcnRpY2xlLlNMRUVQX1RPTEVSQU5DRSA9IDFlLTc7XG5QYXJ0aWNsZS5BWEVTID0ge1xuICAgIFg6IDAsXG4gICAgWTogMSxcbiAgICBaOiAyXG59O1xuUGFydGljbGUuSU5URUdSQVRPUiA9IG5ldyBJbnRlZ3JhdG9yKCk7XG52YXIgX2V2ZW50cyA9IHtcbiAgICAgICAgc3RhcnQ6ICdzdGFydCcsXG4gICAgICAgIHVwZGF0ZTogJ3VwZGF0ZScsXG4gICAgICAgIGVuZDogJ2VuZCdcbiAgICB9O1xudmFyIG5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93O1xuICAgIH0oKTtcblBhcnRpY2xlLnByb3RvdHlwZS5zbGVlcCA9IGZ1bmN0aW9uIHNsZWVwKCkge1xuICAgIGlmICh0aGlzLl9pc1NsZWVwaW5nKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5lbWl0KF9ldmVudHMuZW5kLCB0aGlzKTtcbiAgICB0aGlzLl9pc1NsZWVwaW5nID0gdHJ1ZTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUud2FrZSA9IGZ1bmN0aW9uIHdha2UoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1NsZWVwaW5nKVxuICAgICAgICByZXR1cm47XG4gICAgdGhpcy5lbWl0KF9ldmVudHMuc3RhcnQsIHRoaXMpO1xuICAgIHRoaXMuX2lzU2xlZXBpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9wcmV2VGltZSA9IG5vdygpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5pc0JvZHkgPSBmYWxzZTtcblBhcnRpY2xlLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIHNldFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQocG9zaXRpb24pO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5zZXRQb3NpdGlvbjFEID0gZnVuY3Rpb24gc2V0UG9zaXRpb24xRCh4KSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0geDtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiBnZXRQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5fcG9zaXRpb25HZXR0ZXIgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbih0aGlzLl9wb3NpdGlvbkdldHRlcigpKTtcbiAgICB0aGlzLl9lbmdpbmUuc3RlcCgpO1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmdldCgpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5nZXRQb3NpdGlvbjFEID0gZnVuY3Rpb24gZ2V0UG9zaXRpb24xRCgpIHtcbiAgICB0aGlzLl9lbmdpbmUuc3RlcCgpO1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLng7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnBvc2l0aW9uRnJvbSA9IGZ1bmN0aW9uIHBvc2l0aW9uRnJvbShwb3NpdGlvbkdldHRlcikge1xuICAgIHRoaXMuX3Bvc2l0aW9uR2V0dGVyID0gcG9zaXRpb25HZXR0ZXI7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnNldFZlbG9jaXR5ID0gZnVuY3Rpb24gc2V0VmVsb2NpdHkodmVsb2NpdHkpIHtcbiAgICB0aGlzLnZlbG9jaXR5LnNldCh2ZWxvY2l0eSk7XG4gICAgdGhpcy53YWtlKCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnNldFZlbG9jaXR5MUQgPSBmdW5jdGlvbiBzZXRWZWxvY2l0eTFEKHgpIHtcbiAgICB0aGlzLnZlbG9jaXR5LnggPSB4O1xuICAgIHRoaXMud2FrZSgpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5nZXRWZWxvY2l0eSA9IGZ1bmN0aW9uIGdldFZlbG9jaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnZlbG9jaXR5LmdldCgpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5nZXRWZWxvY2l0eTFEID0gZnVuY3Rpb24gZ2V0VmVsb2NpdHkxRCgpIHtcbiAgICByZXR1cm4gdGhpcy52ZWxvY2l0eS54O1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5zZXRNYXNzID0gZnVuY3Rpb24gc2V0TWFzcyhtYXNzKSB7XG4gICAgdGhpcy5tYXNzID0gbWFzcztcbiAgICB0aGlzLmludmVyc2VNYXNzID0gMSAvIG1hc3M7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmdldE1hc3MgPSBmdW5jdGlvbiBnZXRNYXNzKCkge1xuICAgIHJldHVybiB0aGlzLm1hc3M7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQocG9zaXRpb24sIHZlbG9jaXR5KSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbihwb3NpdGlvbiB8fCBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdKTtcbiAgICB0aGlzLnNldFZlbG9jaXR5KHZlbG9jaXR5IHx8IFtcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMFxuICAgIF0pO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gYXBwbHlGb3JjZShmb3JjZSkge1xuICAgIGlmIChmb3JjZS5pc1plcm8oKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHRoaXMuZm9yY2UuYWRkKGZvcmNlKS5wdXQodGhpcy5mb3JjZSk7XG4gICAgdGhpcy53YWtlKCk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmFwcGx5SW1wdWxzZSA9IGZ1bmN0aW9uIGFwcGx5SW1wdWxzZShpbXB1bHNlKSB7XG4gICAgaWYgKGltcHVsc2UuaXNaZXJvKCkpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgdmVsb2NpdHkgPSB0aGlzLnZlbG9jaXR5O1xuICAgIHZlbG9jaXR5LmFkZChpbXB1bHNlLm11bHQodGhpcy5pbnZlcnNlTWFzcykpLnB1dCh2ZWxvY2l0eSk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLmludGVncmF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gaW50ZWdyYXRlVmVsb2NpdHkoZHQpIHtcbiAgICBQYXJ0aWNsZS5JTlRFR1JBVE9SLmludGVncmF0ZVZlbG9jaXR5KHRoaXMsIGR0KTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuaW50ZWdyYXRlUG9zaXRpb24gPSBmdW5jdGlvbiBpbnRlZ3JhdGVQb3NpdGlvbihkdCkge1xuICAgIFBhcnRpY2xlLklOVEVHUkFUT1IuaW50ZWdyYXRlUG9zaXRpb24odGhpcywgZHQpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5faW50ZWdyYXRlID0gZnVuY3Rpb24gX2ludGVncmF0ZShkdCkge1xuICAgIHRoaXMuaW50ZWdyYXRlVmVsb2NpdHkoZHQpO1xuICAgIHRoaXMuaW50ZWdyYXRlUG9zaXRpb24oZHQpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5nZXRFbmVyZ3kgPSBmdW5jdGlvbiBnZXRFbmVyZ3koKSB7XG4gICAgcmV0dXJuIDAuNSAqIHRoaXMubWFzcyAqIHRoaXMudmVsb2NpdHkubm9ybVNxdWFyZWQoKTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtID0gZnVuY3Rpb24gZ2V0VHJhbnNmb3JtKCkge1xuICAgIHRoaXMuX2VuZ2luZS5zdGVwKCk7XG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICB2YXIgYXhpcyA9IHRoaXMuYXhpcztcbiAgICB2YXIgdHJhbnNmb3JtID0gdGhpcy50cmFuc2Zvcm07XG4gICAgaWYgKGF4aXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXhpcyAmIH5QYXJ0aWNsZS5BWEVTLlgpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChheGlzICYgflBhcnRpY2xlLkFYRVMuWSkge1xuICAgICAgICAgICAgcG9zaXRpb24ueSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF4aXMgJiB+UGFydGljbGUuQVhFUy5aKSB7XG4gICAgICAgICAgICBwb3NpdGlvbi56ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0cmFuc2Zvcm1bMTJdID0gcG9zaXRpb24ueDtcbiAgICB0cmFuc2Zvcm1bMTNdID0gcG9zaXRpb24ueTtcbiAgICB0cmFuc2Zvcm1bMTRdID0gcG9zaXRpb24uejtcbiAgICByZXR1cm4gdHJhbnNmb3JtO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5tb2RpZnkgPSBmdW5jdGlvbiBtb2RpZnkodGFyZ2V0KSB7XG4gICAgdmFyIF9zcGVjID0gdGhpcy5fc3BlYztcbiAgICBfc3BlYy50cmFuc2Zvcm0gPSB0aGlzLmdldFRyYW5zZm9ybSgpO1xuICAgIF9zcGVjLnRhcmdldCA9IHRhcmdldDtcbiAgICByZXR1cm4gX3NwZWM7XG59O1xuZnVuY3Rpb24gX2NyZWF0ZUV2ZW50T3V0cHV0KCkge1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbmV3IEV2ZW50SGFuZGxlcigpO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmJpbmRUaGlzKHRoaXMpO1xuICAgIEV2ZW50SGFuZGxlci5zZXRPdXRwdXRIYW5kbGVyKHRoaXMsIHRoaXMuX2V2ZW50T3V0cHV0KTtcbn1cblBhcnRpY2xlLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlLCBkYXRhKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudE91dHB1dClcbiAgICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQodHlwZSwgZGF0YSk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oKSB7XG4gICAgX2NyZWF0ZUV2ZW50T3V0cHV0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMub24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5QYXJ0aWNsZS5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblBhcnRpY2xlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5waXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuUGFydGljbGUucHJvdG90eXBlLnVucGlwZSA9IGZ1bmN0aW9uIHVucGlwZSgpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy51bnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlOyIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKCdmYW1vdXMvY29yZS9FdmVudEhhbmRsZXInKTtcbmZ1bmN0aW9uIENvbnN0cmFpbnQoKSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuX2VuZXJneSA9IDA7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBudWxsO1xufVxuQ29uc3RyYWludC5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zKVxuICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbn07XG5Db25zdHJhaW50LnByb3RvdHlwZS5hcHBseUNvbnN0cmFpbnQgPSBmdW5jdGlvbiBhcHBseUNvbnN0cmFpbnQoKSB7XG59O1xuQ29uc3RyYWludC5wcm90b3R5cGUuZ2V0RW5lcmd5ID0gZnVuY3Rpb24gZ2V0RW5lcmd5KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmVyZ3k7XG59O1xuQ29uc3RyYWludC5wcm90b3R5cGUuc2V0RW5lcmd5ID0gZnVuY3Rpb24gc2V0RW5lcmd5KGVuZXJneSkge1xuICAgIHRoaXMuX2VuZXJneSA9IGVuZXJneTtcbn07XG5mdW5jdGlvbiBfY3JlYXRlRXZlbnRPdXRwdXQoKSB7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuYmluZFRoaXModGhpcyk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xufVxuQ29uc3RyYWludC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5vbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkNvbnN0cmFpbnQucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIoKSB7XG4gICAgX2NyZWF0ZUV2ZW50T3V0cHV0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5Db25zdHJhaW50LnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5waXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuQ29uc3RyYWludC5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkNvbnN0cmFpbnQucHJvdG90eXBlLnVucGlwZSA9IGZ1bmN0aW9uIHVucGlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy51bnBpcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IENvbnN0cmFpbnQ7IiwidmFyIENvbnN0cmFpbnQgPSByZXF1aXJlKCcuL0NvbnN0cmFpbnQnKTtcbnZhciBWZWN0b3IgPSByZXF1aXJlKCdmYW1vdXMvbWF0aC9WZWN0b3InKTtcbmZ1bmN0aW9uIFNuYXAob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUodGhpcy5jb25zdHJ1Y3Rvci5ERUZBVUxUX09QVElPTlMpO1xuICAgIGlmIChvcHRpb25zKVxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5wRGlmZiA9IG5ldyBWZWN0b3IoKTtcbiAgICB0aGlzLnZEaWZmID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMuaW1wdWxzZTEgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5pbXB1bHNlMiA9IG5ldyBWZWN0b3IoKTtcbiAgICBDb25zdHJhaW50LmNhbGwodGhpcyk7XG59XG5TbmFwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29uc3RyYWludC5wcm90b3R5cGUpO1xuU25hcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTbmFwO1xuU25hcC5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgcGVyaW9kOiAzMDAsXG4gICAgZGFtcGluZ1JhdGlvOiAwLjEsXG4gICAgbGVuZ3RoOiAwLFxuICAgIGFuY2hvcjogdW5kZWZpbmVkXG59O1xudmFyIHBpID0gTWF0aC5QSTtcbmZ1bmN0aW9uIF9jYWxjRW5lcmd5KGltcHVsc2UsIGRpc3AsIGR0KSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGltcHVsc2UuZG90KGRpc3ApIC8gZHQpO1xufVxuU25hcC5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmFuY2hvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmFuY2hvciBpbnN0YW5jZW9mIFZlY3RvcilcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hbmNob3IgPSBvcHRpb25zLmFuY2hvcjtcbiAgICAgICAgaWYgKG9wdGlvbnMuYW5jaG9yLnBvc2l0aW9uIGluc3RhbmNlb2YgVmVjdG9yKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG9wdGlvbnMuYW5jaG9yLnBvc2l0aW9uO1xuICAgICAgICBpZiAob3B0aW9ucy5hbmNob3IgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hbmNob3IgPSBuZXcgVmVjdG9yKG9wdGlvbnMuYW5jaG9yKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5sZW5ndGggPSBvcHRpb25zLmxlbmd0aDtcbiAgICBpZiAob3B0aW9ucy5kYW1waW5nUmF0aW8gIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLmRhbXBpbmdSYXRpbyA9IG9wdGlvbnMuZGFtcGluZ1JhdGlvO1xuICAgIGlmIChvcHRpb25zLnBlcmlvZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyaW9kID0gb3B0aW9ucy5wZXJpb2Q7XG59O1xuU25hcC5wcm90b3R5cGUuc2V0QW5jaG9yID0gZnVuY3Rpb24gc2V0QW5jaG9yKHYpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmFuY2hvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuYW5jaG9yID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMub3B0aW9ucy5hbmNob3Iuc2V0KHYpO1xufTtcblNuYXAucHJvdG90eXBlLmdldEVuZXJneSA9IGZ1bmN0aW9uIGdldEVuZXJneSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciByZXN0TGVuZ3RoID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgdmFyIGFuY2hvciA9IG9wdGlvbnMuYW5jaG9yIHx8IHNvdXJjZS5wb3NpdGlvbjtcbiAgICB2YXIgc3RyZW5ndGggPSBNYXRoLnBvdygyICogcGkgLyBvcHRpb25zLnBlcmlvZCwgMik7XG4gICAgdmFyIGRpc3QgPSBhbmNob3Iuc3ViKHRhcmdldC5wb3NpdGlvbikubm9ybSgpIC0gcmVzdExlbmd0aDtcbiAgICByZXR1cm4gMC41ICogc3RyZW5ndGggKiBkaXN0ICogZGlzdDtcbn07XG5TbmFwLnByb3RvdHlwZS5hcHBseUNvbnN0cmFpbnQgPSBmdW5jdGlvbiBhcHBseUNvbnN0cmFpbnQodGFyZ2V0cywgc291cmNlLCBkdCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBwRGlmZiA9IHRoaXMucERpZmY7XG4gICAgdmFyIHZEaWZmID0gdGhpcy52RGlmZjtcbiAgICB2YXIgaW1wdWxzZTEgPSB0aGlzLmltcHVsc2UxO1xuICAgIHZhciBpbXB1bHNlMiA9IHRoaXMuaW1wdWxzZTI7XG4gICAgdmFyIGxlbmd0aCA9IG9wdGlvbnMubGVuZ3RoO1xuICAgIHZhciBhbmNob3IgPSBvcHRpb25zLmFuY2hvciB8fCBzb3VyY2UucG9zaXRpb247XG4gICAgdmFyIHBlcmlvZCA9IG9wdGlvbnMucGVyaW9kO1xuICAgIHZhciBkYW1waW5nUmF0aW8gPSBvcHRpb25zLmRhbXBpbmdSYXRpbztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRhcmdldHNbaV07XG4gICAgICAgIHZhciBwMSA9IHRhcmdldC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIHYxID0gdGFyZ2V0LnZlbG9jaXR5O1xuICAgICAgICB2YXIgbTEgPSB0YXJnZXQubWFzcztcbiAgICAgICAgdmFyIHcxID0gdGFyZ2V0LmludmVyc2VNYXNzO1xuICAgICAgICBwRGlmZi5zZXQocDEuc3ViKGFuY2hvcikpO1xuICAgICAgICB2YXIgZGlzdCA9IHBEaWZmLm5vcm0oKSAtIGxlbmd0aDtcbiAgICAgICAgdmFyIGVmZk1hc3M7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciB3MiA9IHNvdXJjZS5pbnZlcnNlTWFzcztcbiAgICAgICAgICAgIHZhciB2MiA9IHNvdXJjZS52ZWxvY2l0eTtcbiAgICAgICAgICAgIHZEaWZmLnNldCh2MS5zdWIodjIpKTtcbiAgICAgICAgICAgIGVmZk1hc3MgPSAxIC8gKHcxICsgdzIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdkRpZmYuc2V0KHYxKTtcbiAgICAgICAgICAgIGVmZk1hc3MgPSBtMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2FtbWE7XG4gICAgICAgIHZhciBiZXRhO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlcmlvZCA9PT0gMCkge1xuICAgICAgICAgICAgZ2FtbWEgPSAwO1xuICAgICAgICAgICAgYmV0YSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgayA9IDQgKiBlZmZNYXNzICogcGkgKiBwaSAvIChwZXJpb2QgKiBwZXJpb2QpO1xuICAgICAgICAgICAgdmFyIGMgPSA0ICogZWZmTWFzcyAqIHBpICogZGFtcGluZ1JhdGlvIC8gcGVyaW9kO1xuICAgICAgICAgICAgYmV0YSA9IGR0ICogayAvIChjICsgZHQgKiBrKTtcbiAgICAgICAgICAgIGdhbW1hID0gMSAvIChjICsgZHQgKiBrKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYW50aURyaWZ0ID0gYmV0YSAvIGR0ICogZGlzdDtcbiAgICAgICAgcERpZmYubm9ybWFsaXplKC1hbnRpRHJpZnQpLnN1Yih2RGlmZikubXVsdChkdCAvIChnYW1tYSArIGR0IC8gZWZmTWFzcykpLnB1dChpbXB1bHNlMSk7XG4gICAgICAgIHRhcmdldC5hcHBseUltcHVsc2UoaW1wdWxzZTEpO1xuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICBpbXB1bHNlMS5tdWx0KC0xKS5wdXQoaW1wdWxzZTIpO1xuICAgICAgICAgICAgc291cmNlLmFwcGx5SW1wdWxzZShpbXB1bHNlMik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRFbmVyZ3koX2NhbGNFbmVyZ3koaW1wdWxzZTEsIHBEaWZmLCBkdCkpO1xuICAgIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IFNuYXA7IiwidmFyIENvbnN0cmFpbnQgPSByZXF1aXJlKCcuL0NvbnN0cmFpbnQnKTtcbnZhciBWZWN0b3IgPSByZXF1aXJlKCdmYW1vdXMvbWF0aC9WZWN0b3InKTtcbmZ1bmN0aW9uIFdhbGwob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoV2FsbC5ERUZBVUxUX09QVElPTlMpO1xuICAgIGlmIChvcHRpb25zKVxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5kaWZmID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMuaW1wdWxzZSA9IG5ldyBWZWN0b3IoKTtcbiAgICBDb25zdHJhaW50LmNhbGwodGhpcyk7XG59XG5XYWxsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29uc3RyYWludC5wcm90b3R5cGUpO1xuV2FsbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBXYWxsO1xuV2FsbC5PTl9DT05UQUNUID0ge1xuICAgIFJFRkxFQ1Q6IDAsXG4gICAgU0lMRU5UOiAxXG59O1xuV2FsbC5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgcmVzdGl0dXRpb246IDAuNSxcbiAgICBkcmlmdDogMC41LFxuICAgIHNsb3A6IDAsXG4gICAgbm9ybWFsOiBbXG4gICAgICAgIDEsXG4gICAgICAgIDAsXG4gICAgICAgIDBcbiAgICBdLFxuICAgIGRpc3RhbmNlOiAwLFxuICAgIG9uQ29udGFjdDogV2FsbC5PTl9DT05UQUNULlJFRkxFQ1Rcbn07XG5XYWxsLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMubm9ybWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubm9ybWFsIGluc3RhbmNlb2YgVmVjdG9yKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm5vcm1hbCA9IG9wdGlvbnMubm9ybWFsLmNsb25lKCk7XG4gICAgICAgIGlmIChvcHRpb25zLm5vcm1hbCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm5vcm1hbCA9IG5ldyBWZWN0b3Iob3B0aW9ucy5ub3JtYWwpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5yZXN0aXR1dGlvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMucmVzdGl0dXRpb24gPSBvcHRpb25zLnJlc3RpdHV0aW9uO1xuICAgIGlmIChvcHRpb25zLmRyaWZ0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5kcmlmdCA9IG9wdGlvbnMuZHJpZnQ7XG4gICAgaWYgKG9wdGlvbnMuc2xvcCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuc2xvcCA9IG9wdGlvbnMuc2xvcDtcbiAgICBpZiAob3B0aW9ucy5kaXN0YW5jZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZGlzdGFuY2UgPSBvcHRpb25zLmRpc3RhbmNlO1xuICAgIGlmIChvcHRpb25zLm9uQ29udGFjdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMub25Db250YWN0ID0gb3B0aW9ucy5vbkNvbnRhY3Q7XG59O1xuZnVuY3Rpb24gX2dldE5vcm1hbFZlbG9jaXR5KG4sIHYpIHtcbiAgICByZXR1cm4gdi5kb3Qobik7XG59XG5mdW5jdGlvbiBfZ2V0RGlzdGFuY2VGcm9tT3JpZ2luKHApIHtcbiAgICB2YXIgbiA9IHRoaXMub3B0aW9ucy5ub3JtYWw7XG4gICAgdmFyIGQgPSB0aGlzLm9wdGlvbnMuZGlzdGFuY2U7XG4gICAgcmV0dXJuIHAuZG90KG4pICsgZDtcbn1cbmZ1bmN0aW9uIF9vbkVudGVyKHBhcnRpY2xlLCBvdmVybGFwLCBkdCkge1xuICAgIHZhciBwID0gcGFydGljbGUucG9zaXRpb247XG4gICAgdmFyIHYgPSBwYXJ0aWNsZS52ZWxvY2l0eTtcbiAgICB2YXIgbSA9IHBhcnRpY2xlLm1hc3M7XG4gICAgdmFyIG4gPSB0aGlzLm9wdGlvbnMubm9ybWFsO1xuICAgIHZhciBhY3Rpb24gPSB0aGlzLm9wdGlvbnMub25Db250YWN0O1xuICAgIHZhciByZXN0aXR1dGlvbiA9IHRoaXMub3B0aW9ucy5yZXN0aXR1dGlvbjtcbiAgICB2YXIgaW1wdWxzZSA9IHRoaXMuaW1wdWxzZTtcbiAgICB2YXIgZHJpZnQgPSB0aGlzLm9wdGlvbnMuZHJpZnQ7XG4gICAgdmFyIHNsb3AgPSAtdGhpcy5vcHRpb25zLnNsb3A7XG4gICAgdmFyIGdhbW1hID0gMDtcbiAgICBpZiAodGhpcy5fZXZlbnRPdXRwdXQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGU6IHBhcnRpY2xlLFxuICAgICAgICAgICAgICAgIHdhbGw6IHRoaXMsXG4gICAgICAgICAgICAgICAgb3ZlcmxhcDogb3ZlcmxhcCxcbiAgICAgICAgICAgICAgICBub3JtYWw6IG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoJ3ByZUNvbGxpc2lvbicsIGRhdGEpO1xuICAgICAgICB0aGlzLl9ldmVudE91dHB1dC5lbWl0KCdjb2xsaXNpb24nLCBkYXRhKTtcbiAgICB9XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICBjYXNlIFdhbGwuT05fQ09OVEFDVC5SRUZMRUNUOlxuICAgICAgICB2YXIgbGFtYmRhID0gb3ZlcmxhcCA8IHNsb3AgPyAtKCgxICsgcmVzdGl0dXRpb24pICogbi5kb3QodikgKyBkcmlmdCAvIGR0ICogKG92ZXJsYXAgLSBzbG9wKSkgLyAobSAqIGR0ICsgZ2FtbWEpIDogLSgoMSArIHJlc3RpdHV0aW9uKSAqIG4uZG90KHYpKSAvIChtICogZHQgKyBnYW1tYSk7XG4gICAgICAgIGltcHVsc2Uuc2V0KG4ubXVsdChkdCAqIGxhbWJkYSkpO1xuICAgICAgICBwYXJ0aWNsZS5hcHBseUltcHVsc2UoaW1wdWxzZSk7XG4gICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHAuYWRkKG4ubXVsdCgtb3ZlcmxhcCkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICh0aGlzLl9ldmVudE91dHB1dClcbiAgICAgICAgdGhpcy5fZXZlbnRPdXRwdXQuZW1pdCgncG9zdENvbGxpc2lvbicsIGRhdGEpO1xufVxuZnVuY3Rpb24gX29uRXhpdChwYXJ0aWNsZSwgb3ZlcmxhcCwgZHQpIHtcbiAgICB2YXIgYWN0aW9uID0gdGhpcy5vcHRpb25zLm9uQ29udGFjdDtcbiAgICB2YXIgcCA9IHBhcnRpY2xlLnBvc2l0aW9uO1xuICAgIHZhciBuID0gdGhpcy5vcHRpb25zLm5vcm1hbDtcbiAgICBpZiAoYWN0aW9uID09PSBXYWxsLk9OX0NPTlRBQ1QuUkVGTEVDVCkge1xuICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihwLmFkZChuLm11bHQoLW92ZXJsYXApKSk7XG4gICAgfVxufVxuV2FsbC5wcm90b3R5cGUuYXBwbHlDb25zdHJhaW50ID0gZnVuY3Rpb24gYXBwbHlDb25zdHJhaW50KHRhcmdldHMsIHNvdXJjZSwgZHQpIHtcbiAgICB2YXIgbiA9IHRoaXMub3B0aW9ucy5ub3JtYWw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0aWNsZSA9IHRhcmdldHNbaV07XG4gICAgICAgIHZhciBwID0gcGFydGljbGUucG9zaXRpb247XG4gICAgICAgIHZhciB2ID0gcGFydGljbGUudmVsb2NpdHk7XG4gICAgICAgIHZhciByID0gcGFydGljbGUucmFkaXVzIHx8IDA7XG4gICAgICAgIHZhciBvdmVybGFwID0gX2dldERpc3RhbmNlRnJvbU9yaWdpbi5jYWxsKHRoaXMsIHAuYWRkKG4ubXVsdCgtcikpKTtcbiAgICAgICAgdmFyIG52ID0gX2dldE5vcm1hbFZlbG9jaXR5LmNhbGwodGhpcywgbiwgdik7XG4gICAgICAgIGlmIChvdmVybGFwIDw9IDApIHtcbiAgICAgICAgICAgIGlmIChudiA8IDApXG4gICAgICAgICAgICAgICAgX29uRW50ZXIuY2FsbCh0aGlzLCBwYXJ0aWNsZSwgb3ZlcmxhcCwgZHQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIF9vbkV4aXQuY2FsbCh0aGlzLCBwYXJ0aWNsZSwgb3ZlcmxhcCwgZHQpO1xuICAgICAgICB9XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gV2FsbDsiLCJ2YXIgVmVjdG9yID0gcmVxdWlyZSgnZmFtb3VzL21hdGgvVmVjdG9yJyk7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvRXZlbnRIYW5kbGVyJyk7XG5mdW5jdGlvbiBGb3JjZShmb3JjZSkge1xuICAgIHRoaXMuZm9yY2UgPSBuZXcgVmVjdG9yKGZvcmNlKTtcbiAgICB0aGlzLl9lbmVyZ3kgPSAwO1xuICAgIHRoaXMuX2V2ZW50T3V0cHV0ID0gbnVsbDtcbn1cbkZvcmNlLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpXG4gICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xufTtcbkZvcmNlLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gYXBwbHlGb3JjZShib2R5KSB7XG4gICAgYm9keS5hcHBseUZvcmNlKHRoaXMuZm9yY2UpO1xufTtcbkZvcmNlLnByb3RvdHlwZS5nZXRFbmVyZ3kgPSBmdW5jdGlvbiBnZXRFbmVyZ3koKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuZXJneTtcbn07XG5Gb3JjZS5wcm90b3R5cGUuc2V0RW5lcmd5ID0gZnVuY3Rpb24gc2V0RW5lcmd5KGVuZXJneSkge1xuICAgIHRoaXMuX2VuZXJneSA9IGVuZXJneTtcbn07XG5mdW5jdGlvbiBfY3JlYXRlRXZlbnRPdXRwdXQoKSB7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5fZXZlbnRPdXRwdXQuYmluZFRoaXModGhpcyk7XG4gICAgRXZlbnRIYW5kbGVyLnNldE91dHB1dEhhbmRsZXIodGhpcywgdGhpcy5fZXZlbnRPdXRwdXQpO1xufVxuRm9yY2UucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oKSB7XG4gICAgX2NyZWF0ZUV2ZW50T3V0cHV0LmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMub24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5Gb3JjZS5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcigpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkZvcmNlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICBfY3JlYXRlRXZlbnRPdXRwdXQuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5waXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuRm9yY2UucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5Gb3JjZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIHJldHVybiB0aGlzLnVucGlwZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gRm9yY2U7IiwidmFyIEZvcmNlID0gcmVxdWlyZSgnLi9Gb3JjZScpO1xudmFyIFZlY3RvciA9IHJlcXVpcmUoJ2ZhbW91cy9tYXRoL1ZlY3RvcicpO1xuZnVuY3Rpb24gU3ByaW5nKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuY29uc3RydWN0b3IuREVGQVVMVF9PUFRJT05TKTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMuZGlzcCA9IG5ldyBWZWN0b3IoMCwgMCwgMCk7XG4gICAgX2luaXQuY2FsbCh0aGlzKTtcbiAgICBGb3JjZS5jYWxsKHRoaXMpO1xufVxuU3ByaW5nLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRm9yY2UucHJvdG90eXBlKTtcblNwcmluZy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTcHJpbmc7XG52YXIgcGkgPSBNYXRoLlBJO1xuU3ByaW5nLkZPUkNFX0ZVTkNUSU9OUyA9IHtcbiAgICBGRU5FOiBmdW5jdGlvbiAoZGlzdCwgck1heCkge1xuICAgICAgICB2YXIgck1heFNtYWxsID0gck1heCAqIDAuOTk7XG4gICAgICAgIHZhciByID0gTWF0aC5tYXgoTWF0aC5taW4oZGlzdCwgck1heFNtYWxsKSwgLXJNYXhTbWFsbCk7XG4gICAgICAgIHJldHVybiByIC8gKDEgLSByICogciAvIChyTWF4ICogck1heCkpO1xuICAgIH0sXG4gICAgSE9PSzogZnVuY3Rpb24gKGRpc3QpIHtcbiAgICAgICAgcmV0dXJuIGRpc3Q7XG4gICAgfVxufTtcblNwcmluZy5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgcGVyaW9kOiAzMDAsXG4gICAgZGFtcGluZ1JhdGlvOiAwLjEsXG4gICAgbGVuZ3RoOiAwLFxuICAgIG1heExlbmd0aDogSW5maW5pdHksXG4gICAgYW5jaG9yOiB1bmRlZmluZWQsXG4gICAgZm9yY2VGdW5jdGlvbjogU3ByaW5nLkZPUkNFX0ZVTkNUSU9OUy5IT09LXG59O1xuZnVuY3Rpb24gX3NldEZvcmNlRnVuY3Rpb24oZm4pIHtcbiAgICB0aGlzLmZvcmNlRnVuY3Rpb24gPSBmbjtcbn1cbmZ1bmN0aW9uIF9jYWxjU3RpZmZuZXNzKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIG9wdGlvbnMuc3RpZmZuZXNzID0gTWF0aC5wb3coMiAqIHBpIC8gb3B0aW9ucy5wZXJpb2QsIDIpO1xufVxuZnVuY3Rpb24gX2NhbGNEYW1waW5nKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIG9wdGlvbnMuZGFtcGluZyA9IDQgKiBwaSAqIG9wdGlvbnMuZGFtcGluZ1JhdGlvIC8gb3B0aW9ucy5wZXJpb2Q7XG59XG5mdW5jdGlvbiBfY2FsY0VuZXJneShzdHJlbmd0aCwgZGlzdCkge1xuICAgIHJldHVybiAwLjUgKiBzdHJlbmd0aCAqIGRpc3QgKiBkaXN0O1xufVxuZnVuY3Rpb24gX2luaXQoKSB7XG4gICAgX3NldEZvcmNlRnVuY3Rpb24uY2FsbCh0aGlzLCB0aGlzLm9wdGlvbnMuZm9yY2VGdW5jdGlvbik7XG4gICAgX2NhbGNTdGlmZm5lc3MuY2FsbCh0aGlzKTtcbiAgICBfY2FsY0RhbXBpbmcuY2FsbCh0aGlzKTtcbn1cblNwcmluZy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmFuY2hvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmFuY2hvci5wb3NpdGlvbiBpbnN0YW5jZW9mIFZlY3RvcilcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hbmNob3IgPSBvcHRpb25zLmFuY2hvci5wb3NpdGlvbjtcbiAgICAgICAgaWYgKG9wdGlvbnMuYW5jaG9yIGluc3RhbmNlb2YgVmVjdG9yKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFuY2hvciA9IG9wdGlvbnMuYW5jaG9yO1xuICAgICAgICBpZiAob3B0aW9ucy5hbmNob3IgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hbmNob3IgPSBuZXcgVmVjdG9yKG9wdGlvbnMuYW5jaG9yKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucGVyaW9kICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJpb2QgPSBvcHRpb25zLnBlcmlvZDtcbiAgICBpZiAob3B0aW9ucy5kYW1waW5nUmF0aW8gIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLmRhbXBpbmdSYXRpbyA9IG9wdGlvbnMuZGFtcGluZ1JhdGlvO1xuICAgIGlmIChvcHRpb25zLmxlbmd0aCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMubGVuZ3RoID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgaWYgKG9wdGlvbnMuZm9yY2VGdW5jdGlvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZm9yY2VGdW5jdGlvbiA9IG9wdGlvbnMuZm9yY2VGdW5jdGlvbjtcbiAgICBpZiAob3B0aW9ucy5tYXhMZW5ndGggIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLm1heExlbmd0aCA9IG9wdGlvbnMubWF4TGVuZ3RoO1xuICAgIF9pbml0LmNhbGwodGhpcyk7XG59O1xuU3ByaW5nLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gYXBwbHlGb3JjZSh0YXJnZXRzLCBzb3VyY2UpIHtcbiAgICB2YXIgZm9yY2UgPSB0aGlzLmZvcmNlO1xuICAgIHZhciBkaXNwID0gdGhpcy5kaXNwO1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBzdGlmZm5lc3MgPSBvcHRpb25zLnN0aWZmbmVzcztcbiAgICB2YXIgZGFtcGluZyA9IG9wdGlvbnMuZGFtcGluZztcbiAgICB2YXIgcmVzdExlbmd0aCA9IG9wdGlvbnMubGVuZ3RoO1xuICAgIHZhciBsTWF4ID0gb3B0aW9ucy5tYXhMZW5ndGg7XG4gICAgdmFyIGFuY2hvciA9IG9wdGlvbnMuYW5jaG9yIHx8IHNvdXJjZS5wb3NpdGlvbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRhcmdldHNbaV07XG4gICAgICAgIHZhciBwMiA9IHRhcmdldC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIHYyID0gdGFyZ2V0LnZlbG9jaXR5O1xuICAgICAgICBhbmNob3Iuc3ViKHAyKS5wdXQoZGlzcCk7XG4gICAgICAgIHZhciBkaXN0ID0gZGlzcC5ub3JtKCkgLSByZXN0TGVuZ3RoO1xuICAgICAgICBpZiAoZGlzdCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIG0gPSB0YXJnZXQubWFzcztcbiAgICAgICAgc3RpZmZuZXNzICo9IG07XG4gICAgICAgIGRhbXBpbmcgKj0gbTtcbiAgICAgICAgZGlzcC5ub3JtYWxpemUoc3RpZmZuZXNzICogdGhpcy5mb3JjZUZ1bmN0aW9uKGRpc3QsIGxNYXgpKS5wdXQoZm9yY2UpO1xuICAgICAgICBpZiAoZGFtcGluZylcbiAgICAgICAgICAgIGlmIChzb3VyY2UpXG4gICAgICAgICAgICAgICAgZm9yY2UuYWRkKHYyLnN1Yihzb3VyY2UudmVsb2NpdHkpLm11bHQoLWRhbXBpbmcpKS5wdXQoZm9yY2UpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZvcmNlLmFkZCh2Mi5tdWx0KC1kYW1waW5nKSkucHV0KGZvcmNlKTtcbiAgICAgICAgdGFyZ2V0LmFwcGx5Rm9yY2UoZm9yY2UpO1xuICAgICAgICBpZiAoc291cmNlKVxuICAgICAgICAgICAgc291cmNlLmFwcGx5Rm9yY2UoZm9yY2UubXVsdCgtMSkpO1xuICAgICAgICB0aGlzLnNldEVuZXJneShfY2FsY0VuZXJneShzdGlmZm5lc3MsIGRpc3QpKTtcbiAgICB9XG59O1xuU3ByaW5nLnByb3RvdHlwZS5nZXRFbmVyZ3kgPSBmdW5jdGlvbiBnZXRFbmVyZ3kodGFyZ2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHJlc3RMZW5ndGggPSBvcHRpb25zLmxlbmd0aDtcbiAgICB2YXIgYW5jaG9yID0gb3B0aW9ucy5hbmNob3I7XG4gICAgdmFyIHN0cmVuZ3RoID0gb3B0aW9ucy5zdGlmZm5lc3M7XG4gICAgdmFyIGRpc3QgPSBhbmNob3Iuc3ViKHRhcmdldC5wb3NpdGlvbikubm9ybSgpIC0gcmVzdExlbmd0aDtcbiAgICByZXR1cm4gMC41ICogc3RyZW5ndGggKiBkaXN0ICogZGlzdDtcbn07XG5TcHJpbmcucHJvdG90eXBlLnNldEFuY2hvciA9IGZ1bmN0aW9uIHNldEFuY2hvcihhbmNob3IpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5hbmNob3IpXG4gICAgICAgIHRoaXMub3B0aW9ucy5hbmNob3IgPSBuZXcgVmVjdG9yKCk7XG4gICAgdGhpcy5vcHRpb25zLmFuY2hvci5zZXQoYW5jaG9yKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFNwcmluZzsiLCJ2YXIgT3B0aW9uc01hbmFnZXIgPSByZXF1aXJlKCdmYW1vdXMvY29yZS9PcHRpb25zTWFuYWdlcicpO1xuZnVuY3Rpb24gU3ltcGxlY3RpY0V1bGVyKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKFN5bXBsZWN0aWNFdWxlci5ERUZBVUxUX09QVElPTlMpO1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyID0gbmV3IE9wdGlvbnNNYW5hZ2VyKHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn1cblN5bXBsZWN0aWNFdWxlci5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgdmVsb2NpdHlDYXA6IHVuZGVmaW5lZCxcbiAgICBhbmd1bGFyVmVsb2NpdHlDYXA6IHVuZGVmaW5lZFxufTtcblN5bXBsZWN0aWNFdWxlci5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnBhdGNoKG9wdGlvbnMpO1xufTtcblN5bXBsZWN0aWNFdWxlci5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNNYW5hZ2VyLnZhbHVlKCk7XG59O1xuU3ltcGxlY3RpY0V1bGVyLnByb3RvdHlwZS5pbnRlZ3JhdGVWZWxvY2l0eSA9IGZ1bmN0aW9uIGludGVncmF0ZVZlbG9jaXR5KGJvZHksIGR0KSB7XG4gICAgdmFyIHYgPSBib2R5LnZlbG9jaXR5O1xuICAgIHZhciB3ID0gYm9keS5pbnZlcnNlTWFzcztcbiAgICB2YXIgZiA9IGJvZHkuZm9yY2U7XG4gICAgaWYgKGYuaXNaZXJvKCkpXG4gICAgICAgIHJldHVybjtcbiAgICB2LmFkZChmLm11bHQoZHQgKiB3KSkucHV0KHYpO1xuICAgIGYuY2xlYXIoKTtcbn07XG5TeW1wbGVjdGljRXVsZXIucHJvdG90eXBlLmludGVncmF0ZVBvc2l0aW9uID0gZnVuY3Rpb24gaW50ZWdyYXRlUG9zaXRpb24oYm9keSwgZHQpIHtcbiAgICB2YXIgcCA9IGJvZHkucG9zaXRpb247XG4gICAgdmFyIHYgPSBib2R5LnZlbG9jaXR5O1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmVsb2NpdHlDYXApXG4gICAgICAgIHYuY2FwKHRoaXMub3B0aW9ucy52ZWxvY2l0eUNhcCkucHV0KHYpO1xuICAgIHAuYWRkKHYubXVsdChkdCkpLnB1dChwKTtcbn07XG5TeW1wbGVjdGljRXVsZXIucHJvdG90eXBlLmludGVncmF0ZUFuZ3VsYXJNb21lbnR1bSA9IGZ1bmN0aW9uIGludGVncmF0ZUFuZ3VsYXJNb21lbnR1bShib2R5LCBkdCkge1xuICAgIHZhciBMID0gYm9keS5hbmd1bGFyTW9tZW50dW07XG4gICAgdmFyIHQgPSBib2R5LnRvcnF1ZTtcbiAgICBpZiAodC5pc1plcm8oKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYW5ndWxhclZlbG9jaXR5Q2FwKVxuICAgICAgICB0LmNhcCh0aGlzLm9wdGlvbnMuYW5ndWxhclZlbG9jaXR5Q2FwKS5wdXQodCk7XG4gICAgTC5hZGQodC5tdWx0KGR0KSkucHV0KEwpO1xuICAgIHQuY2xlYXIoKTtcbn07XG5TeW1wbGVjdGljRXVsZXIucHJvdG90eXBlLmludGVncmF0ZU9yaWVudGF0aW9uID0gZnVuY3Rpb24gaW50ZWdyYXRlT3JpZW50YXRpb24oYm9keSwgZHQpIHtcbiAgICB2YXIgcSA9IGJvZHkub3JpZW50YXRpb247XG4gICAgdmFyIHcgPSBib2R5LmFuZ3VsYXJWZWxvY2l0eTtcbiAgICBpZiAody5pc1plcm8oKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIHEuYWRkKHEubXVsdGlwbHkodykuc2NhbGFyTXVsdGlwbHkoMC41ICogZHQpKS5wdXQocSk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTeW1wbGVjdGljRXVsZXI7IiwidmFyIFN1cmZhY2UgPSByZXF1aXJlKCdmYW1vdXMvY29yZS9TdXJmYWNlJyk7XG52YXIgQ29udGV4dCA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL0NvbnRleHQnKTtcbmZ1bmN0aW9uIENvbnRhaW5lclN1cmZhY2Uob3B0aW9ucykge1xuICAgIFN1cmZhY2UuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICB0aGlzLl9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZmFtb3VzLWdyb3VwJyk7XG4gICAgdGhpcy5fY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2ZhbW91cy1jb250YWluZXItZ3JvdXAnKTtcbiAgICB0aGlzLl9zaG91bGRSZWNhbGN1bGF0ZVNpemUgPSBmYWxzZTtcbiAgICB0aGlzLmNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLl9jb250YWluZXIpO1xuICAgIHRoaXMuc2V0Q29udGVudCh0aGlzLl9jb250YWluZXIpO1xufVxuQ29udGFpbmVyU3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN1cmZhY2UucHJvdG90eXBlKTtcbkNvbnRhaW5lclN1cmZhY2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29udGFpbmVyU3VyZmFjZTtcbkNvbnRhaW5lclN1cmZhY2UucHJvdG90eXBlLmVsZW1lbnRUeXBlID0gJ2Rpdic7XG5Db250YWluZXJTdXJmYWNlLnByb3RvdHlwZS5lbGVtZW50Q2xhc3MgPSAnZmFtb3VzLXN1cmZhY2UnO1xuQ29udGFpbmVyU3VyZmFjZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuYWRkLmFwcGx5KHRoaXMuY29udGV4dCwgYXJndW1lbnRzKTtcbn07XG5Db250YWluZXJTdXJmYWNlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuX3NpemVEaXJ0eSlcbiAgICAgICAgdGhpcy5fc2hvdWxkUmVjYWxjdWxhdGVTaXplID0gdHJ1ZTtcbiAgICByZXR1cm4gU3VyZmFjZS5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuQ29udGFpbmVyU3VyZmFjZS5wcm90b3R5cGUuZGVwbG95ID0gZnVuY3Rpb24gZGVwbG95KCkge1xuICAgIHRoaXMuX3Nob3VsZFJlY2FsY3VsYXRlU2l6ZSA9IHRydWU7XG4gICAgcmV0dXJuIFN1cmZhY2UucHJvdG90eXBlLmRlcGxveS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkNvbnRhaW5lclN1cmZhY2UucHJvdG90eXBlLmNvbW1pdCA9IGZ1bmN0aW9uIGNvbW1pdChjb250ZXh0LCB0cmFuc2Zvcm0sIG9wYWNpdHksIG9yaWdpbiwgc2l6ZSkge1xuICAgIHZhciBwcmV2aW91c1NpemUgPSB0aGlzLl9zaXplID8gW1xuICAgICAgICAgICAgdGhpcy5fc2l6ZVswXSxcbiAgICAgICAgICAgIHRoaXMuX3NpemVbMV1cbiAgICAgICAgXSA6IG51bGw7XG4gICAgdmFyIHJlc3VsdCA9IFN1cmZhY2UucHJvdG90eXBlLmNvbW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh0aGlzLl9zaG91bGRSZWNhbGN1bGF0ZVNpemUgfHwgcHJldmlvdXNTaXplICYmICh0aGlzLl9zaXplWzBdICE9PSBwcmV2aW91c1NpemVbMF0gfHwgdGhpcy5fc2l6ZVsxXSAhPT0gcHJldmlvdXNTaXplWzFdKSkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2V0U2l6ZSgpO1xuICAgICAgICB0aGlzLl9zaG91bGRSZWNhbGN1bGF0ZVNpemUgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0LnVwZGF0ZSgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBDb250YWluZXJTdXJmYWNlOyIsInZhciBTdXJmYWNlID0gcmVxdWlyZSgnZmFtb3VzL2NvcmUvU3VyZmFjZScpO1xuZnVuY3Rpb24gSW1hZ2VTdXJmYWNlKG9wdGlvbnMpIHtcbiAgICB0aGlzLl9pbWFnZVVybCA9IHVuZGVmaW5lZDtcbiAgICBTdXJmYWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG52YXIgdXJsQ2FjaGUgPSBbXTtcbnZhciBjb3VudENhY2hlID0gW107XG52YXIgbm9kZUNhY2hlID0gW107XG52YXIgY2FjaGVFbmFibGVkID0gdHJ1ZTtcbkltYWdlU3VyZmFjZS5lbmFibGVDYWNoZSA9IGZ1bmN0aW9uIGVuYWJsZUNhY2hlKCkge1xuICAgIGNhY2hlRW5hYmxlZCA9IHRydWU7XG59O1xuSW1hZ2VTdXJmYWNlLmRpc2FibGVDYWNoZSA9IGZ1bmN0aW9uIGRpc2FibGVDYWNoZSgpIHtcbiAgICBjYWNoZUVuYWJsZWQgPSBmYWxzZTtcbn07XG5JbWFnZVN1cmZhY2UuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uIGNsZWFyQ2FjaGUoKSB7XG4gICAgdXJsQ2FjaGUgPSBbXTtcbiAgICBjb3VudENhY2hlID0gW107XG4gICAgbm9kZUNhY2hlID0gW107XG59O1xuSW1hZ2VTdXJmYWNlLmdldENhY2hlID0gZnVuY3Rpb24gZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdXJsQ2FjaGU6IHVybENhY2hlLFxuICAgICAgICBjb3VudENhY2hlOiBjb3VudENhY2hlLFxuICAgICAgICBub2RlQ2FjaGU6IGNvdW50Q2FjaGVcbiAgICB9O1xufTtcbkltYWdlU3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN1cmZhY2UucHJvdG90eXBlKTtcbkltYWdlU3VyZmFjZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbWFnZVN1cmZhY2U7XG5JbWFnZVN1cmZhY2UucHJvdG90eXBlLmVsZW1lbnRUeXBlID0gJ2ltZyc7XG5JbWFnZVN1cmZhY2UucHJvdG90eXBlLmVsZW1lbnRDbGFzcyA9ICdmYW1vdXMtc3VyZmFjZSc7XG5JbWFnZVN1cmZhY2UucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiBzZXRDb250ZW50KGltYWdlVXJsKSB7XG4gICAgdmFyIHVybEluZGV4ID0gdXJsQ2FjaGUuaW5kZXhPZih0aGlzLl9pbWFnZVVybCk7XG4gICAgaWYgKHVybEluZGV4ICE9PSAtMSkge1xuICAgICAgICBpZiAoY291bnRDYWNoZVt1cmxJbmRleF0gPT09IDEpIHtcbiAgICAgICAgICAgIHVybENhY2hlLnNwbGljZSh1cmxJbmRleCwgMSk7XG4gICAgICAgICAgICBjb3VudENhY2hlLnNwbGljZSh1cmxJbmRleCwgMSk7XG4gICAgICAgICAgICBub2RlQ2FjaGUuc3BsaWNlKHVybEluZGV4LCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50Q2FjaGVbdXJsSW5kZXhdLS07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXJsSW5kZXggPSB1cmxDYWNoZS5pbmRleE9mKGltYWdlVXJsKTtcbiAgICBpZiAodXJsSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHVybENhY2hlLnB1c2goaW1hZ2VVcmwpO1xuICAgICAgICBjb3VudENhY2hlLnB1c2goMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY291bnRDYWNoZVt1cmxJbmRleF0rKztcbiAgICB9XG4gICAgdGhpcy5faW1hZ2VVcmwgPSBpbWFnZVVybDtcbiAgICB0aGlzLl9jb250ZW50RGlydHkgPSB0cnVlO1xufTtcbkltYWdlU3VyZmFjZS5wcm90b3R5cGUuZGVwbG95ID0gZnVuY3Rpb24gZGVwbG95KHRhcmdldCkge1xuICAgIHZhciB1cmxJbmRleCA9IHVybENhY2hlLmluZGV4T2YodGhpcy5faW1hZ2VVcmwpO1xuICAgIGlmIChub2RlQ2FjaGVbdXJsSW5kZXhdID09PSB1bmRlZmluZWQgJiYgY2FjaGVFbmFibGVkKSB7XG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1nLnNyYyA9IHRoaXMuX2ltYWdlVXJsIHx8ICcnO1xuICAgICAgICBub2RlQ2FjaGVbdXJsSW5kZXhdID0gaW1nO1xuICAgIH1cbiAgICB0YXJnZXQuc3JjID0gdGhpcy5faW1hZ2VVcmwgfHwgJyc7XG59O1xuSW1hZ2VTdXJmYWNlLnByb3RvdHlwZS5yZWNhbGwgPSBmdW5jdGlvbiByZWNhbGwodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnNyYyA9ICcnO1xufTtcbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VTdXJmYWNlOyIsInZhciBFYXNpbmcgPSB7XG4gICAgICAgIGluUXVhZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICogdDtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0UXVhZDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtKHQgLT0gMSkgKiB0ICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5PdXRRdWFkOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiB0ICogdDtcbiAgICAgICAgICAgIHJldHVybiAtMC41ICogKC0tdCAqICh0IC0gMikgLSAxKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5DdWJpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ICogdCAqIHQ7XG4gICAgICAgIH0sXG4gICAgICAgIG91dEN1YmljOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tdCAqIHQgKiB0ICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5PdXRDdWJpYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICgodCAvPSAwLjUpIDwgMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogdCAqIHQgKiB0O1xuICAgICAgICAgICAgcmV0dXJuIDAuNSAqICgodCAtPSAyKSAqIHQgKiB0ICsgMik7XG4gICAgICAgIH0sXG4gICAgICAgIGluUXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdCAqIHQgKiB0ICogdDtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0UXVhcnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gLSgtLXQgKiB0ICogdCAqIHQgLSAxKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5PdXRRdWFydDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICgodCAvPSAwLjUpIDwgMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gMC41ICogdCAqIHQgKiB0ICogdDtcbiAgICAgICAgICAgIHJldHVybiAtMC41ICogKCh0IC09IDIpICogdCAqIHQgKiB0IC0gMik7XG4gICAgICAgIH0sXG4gICAgICAgIGluUXVpbnQ6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdCAqIHQgKiB0ICogdCAqIHQ7XG4gICAgICAgIH0sXG4gICAgICAgIG91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tdCAqIHQgKiB0ICogdCAqIHQgKyAxO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dFF1aW50OiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0ICogdDtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgKiB0ICsgMik7XG4gICAgICAgIH0sXG4gICAgICAgIGluU2luZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtMSAqIE1hdGguY29zKHQgKiAoTWF0aC5QSSAvIDIpKSArIDE7XG4gICAgICAgIH0sXG4gICAgICAgIG91dFNpbmU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zaW4odCAqIChNYXRoLlBJIC8gMikpO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dFNpbmU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogdCkgLSAxKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5FeHBvOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIHQgPT09IDAgPyAwIDogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0RXhwbzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0ID09PSAxID8gMSA6IC1NYXRoLnBvdygyLCAtMTAgKiB0KSArIDE7XG4gICAgICAgIH0sXG4gICAgICAgIGluT3V0RXhwbzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0ID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKHQgPT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoKHQgLz0gMC41KSA8IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSk7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXQpICsgMik7XG4gICAgICAgIH0sXG4gICAgICAgIGluQ2lyYzogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtKE1hdGguc3FydCgxIC0gdCAqIHQpIC0gMSk7XG4gICAgICAgIH0sXG4gICAgICAgIG91dENpcmM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSAtLXQgKiB0KTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5PdXRDaXJjOiBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gdCAqIHQpIC0gMSk7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHQgLT0gMikgKiB0KSArIDEpO1xuICAgICAgICB9LFxuICAgICAgICBpbkVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB2YXIgcCA9IDA7XG4gICAgICAgICAgICB2YXIgYSA9IDE7XG4gICAgICAgICAgICBpZiAodCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIGlmICh0ID09PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKCFwKVxuICAgICAgICAgICAgICAgIHAgPSAwLjM7XG4gICAgICAgICAgICBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuICAgICAgICAgICAgcmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG91dEVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB2YXIgcCA9IDA7XG4gICAgICAgICAgICB2YXIgYSA9IDE7XG4gICAgICAgICAgICBpZiAodCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIGlmICh0ID09PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKCFwKVxuICAgICAgICAgICAgICAgIHAgPSAwLjM7XG4gICAgICAgICAgICBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuICAgICAgICAgICAgcmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0IC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKyAxO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dEVsYXN0aWM6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB2YXIgcCA9IDA7XG4gICAgICAgICAgICB2YXIgYSA9IDE7XG4gICAgICAgICAgICBpZiAodCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIGlmICgodCAvPSAwLjUpID09PSAyKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKCFwKVxuICAgICAgICAgICAgICAgIHAgPSAwLjMgKiAxLjU7XG4gICAgICAgICAgICBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oMSAvIGEpO1xuICAgICAgICAgICAgaWYgKHQgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAtMC41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0IC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpO1xuICAgICAgICAgICAgcmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICogMC41ICsgMTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5CYWNrOiBmdW5jdGlvbiAodCwgcykge1xuICAgICAgICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIHJldHVybiB0ICogdCAqICgocyArIDEpICogdCAtIHMpO1xuICAgICAgICB9LFxuICAgICAgICBvdXRCYWNrOiBmdW5jdGlvbiAodCwgcykge1xuICAgICAgICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIHJldHVybiAtLXQgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxO1xuICAgICAgICB9LFxuICAgICAgICBpbk91dEJhY2s6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHMgPSAxLjcwMTU4O1xuICAgICAgICAgICAgaWYgKCh0IC89IDAuNSkgPCAxKVxuICAgICAgICAgICAgICAgIHJldHVybiAwLjUgKiAodCAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCAtIHMpKTtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogKCgocyAqPSAxLjUyNSkgKyAxKSAqIHQgKyBzKSArIDIpO1xuICAgICAgICB9LFxuICAgICAgICBpbkJvdW5jZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiAxIC0gRWFzaW5nLm91dEJvdW5jZSgxIC0gdCk7XG4gICAgICAgIH0sXG4gICAgICAgIG91dEJvdW5jZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIGlmICh0IDwgMSAvIDIuNzUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gNy41NjI1ICogdCAqIHQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHQgPCAyIC8gMi43NSkge1xuICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAwLjc1O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0IDwgMi41IC8gMi43NSkge1xuICAgICAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAodCAtPSAyLjI1IC8gMi43NSkgKiB0ICsgMC45Mzc1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKHQgLT0gMi42MjUgLyAyLjc1KSAqIHQgKyAwLjk4NDM3NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICBpZiAodCA8IDAuNSlcbiAgICAgICAgICAgICAgICByZXR1cm4gRWFzaW5nLmluQm91bmNlKHQgKiAyKSAqIDAuNTtcbiAgICAgICAgICAgIHJldHVybiBFYXNpbmcub3V0Qm91bmNlKHQgKiAyIC0gMSkgKiAwLjUgKyAwLjU7XG4gICAgICAgIH1cbiAgICB9O1xubW9kdWxlLmV4cG9ydHMgPSBFYXNpbmc7IiwidmFyIFV0aWxpdHkgPSByZXF1aXJlKCdmYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHknKTtcbmZ1bmN0aW9uIE11bHRpcGxlVHJhbnNpdGlvbihtZXRob2QpIHtcbiAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICB0aGlzLl9pbnN0YW5jZXMgPSBbXTtcbiAgICB0aGlzLnN0YXRlID0gW107XG59XG5NdWx0aXBsZVRyYW5zaXRpb24uU1VQUE9SVFNfTVVMVElQTEUgPSB0cnVlO1xuTXVsdGlwbGVUcmFuc2l0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9pbnN0YW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zdGF0ZVtpXSA9IHRoaXMuX2luc3RhbmNlc1tpXS5nZXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhdGU7XG59O1xuTXVsdGlwbGVUcmFuc2l0aW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoZW5kU3RhdGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdmFyIF9hbGxDYWxsYmFjayA9IFV0aWxpdHkuYWZ0ZXIoZW5kU3RhdGUubGVuZ3RoLCBjYWxsYmFjayk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmRTdGF0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlc1tpXSlcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlc1tpXSA9IG5ldyB0aGlzLm1ldGhvZCgpO1xuICAgICAgICB0aGlzLl9pbnN0YW5jZXNbaV0uc2V0KGVuZFN0YXRlW2ldLCB0cmFuc2l0aW9uLCBfYWxsQ2FsbGJhY2spO1xuICAgIH1cbn07XG5NdWx0aXBsZVRyYW5zaXRpb24ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoc3RhcnRTdGF0ZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhcnRTdGF0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlc1tpXSlcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlc1tpXSA9IG5ldyB0aGlzLm1ldGhvZCgpO1xuICAgICAgICB0aGlzLl9pbnN0YW5jZXNbaV0ucmVzZXQoc3RhcnRTdGF0ZVtpXSk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gTXVsdGlwbGVUcmFuc2l0aW9uOyIsInZhciBQRSA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL1BoeXNpY3NFbmdpbmUnKTtcbnZhciBQYXJ0aWNsZSA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL2JvZGllcy9QYXJ0aWNsZScpO1xudmFyIFNwcmluZyA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL2NvbnN0cmFpbnRzL1NuYXAnKTtcbnZhciBWZWN0b3IgPSByZXF1aXJlKCdmYW1vdXMvbWF0aC9WZWN0b3InKTtcbmZ1bmN0aW9uIFNuYXBUcmFuc2l0aW9uKHN0YXRlKSB7XG4gICAgc3RhdGUgPSBzdGF0ZSB8fCAwO1xuICAgIHRoaXMuZW5kU3RhdGUgPSBuZXcgVmVjdG9yKHN0YXRlKTtcbiAgICB0aGlzLmluaXRTdGF0ZSA9IG5ldyBWZWN0b3IoKTtcbiAgICB0aGlzLl9kaW1lbnNpb25zID0gMTtcbiAgICB0aGlzLl9yZXN0VG9sZXJhbmNlID0gMWUtMTA7XG4gICAgdGhpcy5fYWJzUmVzdFRvbGVyYW5jZSA9IHRoaXMuX3Jlc3RUb2xlcmFuY2U7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5QRSA9IG5ldyBQRSgpO1xuICAgIHRoaXMucGFydGljbGUgPSBuZXcgUGFydGljbGUoKTtcbiAgICB0aGlzLnNwcmluZyA9IG5ldyBTcHJpbmcoeyBhbmNob3I6IHRoaXMuZW5kU3RhdGUgfSk7XG4gICAgdGhpcy5QRS5hZGRCb2R5KHRoaXMucGFydGljbGUpO1xuICAgIHRoaXMuUEUuYXR0YWNoKHRoaXMuc3ByaW5nLCB0aGlzLnBhcnRpY2xlKTtcbn1cblNuYXBUcmFuc2l0aW9uLlNVUFBPUlRTX01VTFRJUExFID0gMztcblNuYXBUcmFuc2l0aW9uLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBwZXJpb2Q6IDEwMCxcbiAgICBkYW1waW5nUmF0aW86IDAuMixcbiAgICB2ZWxvY2l0eTogMFxufTtcbmZ1bmN0aW9uIF9nZXRFbmVyZ3koKSB7XG4gICAgcmV0dXJuIHRoaXMucGFydGljbGUuZ2V0RW5lcmd5KCkgKyB0aGlzLnNwcmluZy5nZXRFbmVyZ3kodGhpcy5wYXJ0aWNsZSk7XG59XG5mdW5jdGlvbiBfc2V0QWJzb2x1dGVSZXN0VG9sZXJhbmNlKCkge1xuICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuZW5kU3RhdGUuc3ViKHRoaXMuaW5pdFN0YXRlKS5ub3JtU3F1YXJlZCgpO1xuICAgIHRoaXMuX2Fic1Jlc3RUb2xlcmFuY2UgPSBkaXN0YW5jZSA9PT0gMCA/IHRoaXMuX3Jlc3RUb2xlcmFuY2UgOiB0aGlzLl9yZXN0VG9sZXJhbmNlICogZGlzdGFuY2U7XG59XG5mdW5jdGlvbiBfc2V0VGFyZ2V0KHRhcmdldCkge1xuICAgIHRoaXMuZW5kU3RhdGUuc2V0KHRhcmdldCk7XG4gICAgX3NldEFic29sdXRlUmVzdFRvbGVyYW5jZS5jYWxsKHRoaXMpO1xufVxuZnVuY3Rpb24gX3dha2UoKSB7XG4gICAgdGhpcy5QRS53YWtlKCk7XG59XG5mdW5jdGlvbiBfc2xlZXAoKSB7XG4gICAgdGhpcy5QRS5zbGVlcCgpO1xufVxuZnVuY3Rpb24gX3NldFBhcnRpY2xlUG9zaXRpb24ocCkge1xuICAgIHRoaXMucGFydGljbGUucG9zaXRpb24uc2V0KHApO1xufVxuZnVuY3Rpb24gX3NldFBhcnRpY2xlVmVsb2NpdHkodikge1xuICAgIHRoaXMucGFydGljbGUudmVsb2NpdHkuc2V0KHYpO1xufVxuZnVuY3Rpb24gX2dldFBhcnRpY2xlUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnMgPT09IDAgPyB0aGlzLnBhcnRpY2xlLmdldFBvc2l0aW9uMUQoKSA6IHRoaXMucGFydGljbGUuZ2V0UG9zaXRpb24oKTtcbn1cbmZ1bmN0aW9uIF9nZXRQYXJ0aWNsZVZlbG9jaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9kaW1lbnNpb25zID09PSAwID8gdGhpcy5wYXJ0aWNsZS5nZXRWZWxvY2l0eTFEKCkgOiB0aGlzLnBhcnRpY2xlLmdldFZlbG9jaXR5KCk7XG59XG5mdW5jdGlvbiBfc2V0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gX3NldHVwRGVmaW5pdGlvbihkZWZpbml0aW9uKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gU25hcFRyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TO1xuICAgIGlmIChkZWZpbml0aW9uLnBlcmlvZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBkZWZpbml0aW9uLnBlcmlvZCA9IGRlZmF1bHRzLnBlcmlvZDtcbiAgICBpZiAoZGVmaW5pdGlvbi5kYW1waW5nUmF0aW8gPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmaW5pdGlvbi5kYW1waW5nUmF0aW8gPSBkZWZhdWx0cy5kYW1waW5nUmF0aW87XG4gICAgaWYgKGRlZmluaXRpb24udmVsb2NpdHkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmaW5pdGlvbi52ZWxvY2l0eSA9IGRlZmF1bHRzLnZlbG9jaXR5O1xuICAgIHRoaXMuc3ByaW5nLnNldE9wdGlvbnMoe1xuICAgICAgICBwZXJpb2Q6IGRlZmluaXRpb24ucGVyaW9kLFxuICAgICAgICBkYW1waW5nUmF0aW86IGRlZmluaXRpb24uZGFtcGluZ1JhdGlvXG4gICAgfSk7XG4gICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCBkZWZpbml0aW9uLnZlbG9jaXR5KTtcbn1cbmZ1bmN0aW9uIF91cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuUEUuaXNTbGVlcGluZygpKSB7XG4gICAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGNiID0gdGhpcy5fY2FsbGJhY2s7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNiKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoX2dldEVuZXJneS5jYWxsKHRoaXMpIDwgdGhpcy5fYWJzUmVzdFRvbGVyYW5jZSkge1xuICAgICAgICBfc2V0UGFydGljbGVQb3NpdGlvbi5jYWxsKHRoaXMsIHRoaXMuZW5kU3RhdGUpO1xuICAgICAgICBfc2V0UGFydGljbGVWZWxvY2l0eS5jYWxsKHRoaXMsIFtcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMFxuICAgICAgICBdKTtcbiAgICAgICAgX3NsZWVwLmNhbGwodGhpcyk7XG4gICAgfVxufVxuU25hcFRyYW5zaXRpb24ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoc3RhdGUsIHZlbG9jaXR5KSB7XG4gICAgdGhpcy5fZGltZW5zaW9ucyA9IHN0YXRlIGluc3RhbmNlb2YgQXJyYXkgPyBzdGF0ZS5sZW5ndGggOiAwO1xuICAgIHRoaXMuaW5pdFN0YXRlLnNldChzdGF0ZSk7XG4gICAgX3NldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzLCBzdGF0ZSk7XG4gICAgX3NldFRhcmdldC5jYWxsKHRoaXMsIHN0YXRlKTtcbiAgICBpZiAodmVsb2NpdHkpXG4gICAgICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgdmVsb2NpdHkpO1xuICAgIF9zZXRDYWxsYmFjay5jYWxsKHRoaXMsIHVuZGVmaW5lZCk7XG59O1xuU25hcFRyYW5zaXRpb24ucHJvdG90eXBlLmdldFZlbG9jaXR5ID0gZnVuY3Rpb24gZ2V0VmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIF9nZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcyk7XG59O1xuU25hcFRyYW5zaXRpb24ucHJvdG90eXBlLnNldFZlbG9jaXR5ID0gZnVuY3Rpb24gc2V0VmVsb2NpdHkodmVsb2NpdHkpIHtcbiAgICB0aGlzLmNhbGwodGhpcywgX3NldFBhcnRpY2xlVmVsb2NpdHkodmVsb2NpdHkpKTtcbn07XG5TbmFwVHJhbnNpdGlvbi5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gIXRoaXMuUEUuaXNTbGVlcGluZygpO1xufTtcblNuYXBUcmFuc2l0aW9uLnByb3RvdHlwZS5oYWx0ID0gZnVuY3Rpb24gaGFsdCgpIHtcbiAgICB0aGlzLnNldCh0aGlzLmdldCgpKTtcbn07XG5TbmFwVHJhbnNpdGlvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIF91cGRhdGUuY2FsbCh0aGlzKTtcbiAgICByZXR1cm4gX2dldFBhcnRpY2xlUG9zaXRpb24uY2FsbCh0aGlzKTtcbn07XG5TbmFwVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHN0YXRlLCBkZWZpbml0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICB0aGlzLnJlc2V0KHN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9kaW1lbnNpb25zID0gc3RhdGUgaW5zdGFuY2VvZiBBcnJheSA/IHN0YXRlLmxlbmd0aCA6IDA7XG4gICAgX3dha2UuY2FsbCh0aGlzKTtcbiAgICBfc2V0dXBEZWZpbml0aW9uLmNhbGwodGhpcywgZGVmaW5pdGlvbik7XG4gICAgX3NldFRhcmdldC5jYWxsKHRoaXMsIHN0YXRlKTtcbiAgICBfc2V0Q2FsbGJhY2suY2FsbCh0aGlzLCBjYWxsYmFjayk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTbmFwVHJhbnNpdGlvbjsiLCJ2YXIgUEUgPSByZXF1aXJlKCdmYW1vdXMvcGh5c2ljcy9QaHlzaWNzRW5naW5lJyk7XG52YXIgUGFydGljbGUgPSByZXF1aXJlKCdmYW1vdXMvcGh5c2ljcy9ib2RpZXMvUGFydGljbGUnKTtcbnZhciBTcHJpbmcgPSByZXF1aXJlKCdmYW1vdXMvcGh5c2ljcy9mb3JjZXMvU3ByaW5nJyk7XG52YXIgVmVjdG9yID0gcmVxdWlyZSgnZmFtb3VzL21hdGgvVmVjdG9yJyk7XG5mdW5jdGlvbiBTcHJpbmdUcmFuc2l0aW9uKHN0YXRlKSB7XG4gICAgc3RhdGUgPSBzdGF0ZSB8fCAwO1xuICAgIHRoaXMuZW5kU3RhdGUgPSBuZXcgVmVjdG9yKHN0YXRlKTtcbiAgICB0aGlzLmluaXRTdGF0ZSA9IG5ldyBWZWN0b3IoKTtcbiAgICB0aGlzLl9kaW1lbnNpb25zID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3Jlc3RUb2xlcmFuY2UgPSAxZS0xMDtcbiAgICB0aGlzLl9hYnNSZXN0VG9sZXJhbmNlID0gdGhpcy5fcmVzdFRvbGVyYW5jZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLlBFID0gbmV3IFBFKCk7XG4gICAgdGhpcy5zcHJpbmcgPSBuZXcgU3ByaW5nKHsgYW5jaG9yOiB0aGlzLmVuZFN0YXRlIH0pO1xuICAgIHRoaXMucGFydGljbGUgPSBuZXcgUGFydGljbGUoKTtcbiAgICB0aGlzLlBFLmFkZEJvZHkodGhpcy5wYXJ0aWNsZSk7XG4gICAgdGhpcy5QRS5hdHRhY2godGhpcy5zcHJpbmcsIHRoaXMucGFydGljbGUpO1xufVxuU3ByaW5nVHJhbnNpdGlvbi5TVVBQT1JUU19NVUxUSVBMRSA9IDM7XG5TcHJpbmdUcmFuc2l0aW9uLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBwZXJpb2Q6IDMwMCxcbiAgICBkYW1waW5nUmF0aW86IDAuNSxcbiAgICB2ZWxvY2l0eTogMFxufTtcbmZ1bmN0aW9uIF9nZXRFbmVyZ3koKSB7XG4gICAgcmV0dXJuIHRoaXMucGFydGljbGUuZ2V0RW5lcmd5KCkgKyB0aGlzLnNwcmluZy5nZXRFbmVyZ3kodGhpcy5wYXJ0aWNsZSk7XG59XG5mdW5jdGlvbiBfc2V0UGFydGljbGVQb3NpdGlvbihwKSB7XG4gICAgdGhpcy5wYXJ0aWNsZS5zZXRQb3NpdGlvbihwKTtcbn1cbmZ1bmN0aW9uIF9zZXRQYXJ0aWNsZVZlbG9jaXR5KHYpIHtcbiAgICB0aGlzLnBhcnRpY2xlLnNldFZlbG9jaXR5KHYpO1xufVxuZnVuY3Rpb24gX2dldFBhcnRpY2xlUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnMgPT09IDAgPyB0aGlzLnBhcnRpY2xlLmdldFBvc2l0aW9uMUQoKSA6IHRoaXMucGFydGljbGUuZ2V0UG9zaXRpb24oKTtcbn1cbmZ1bmN0aW9uIF9nZXRQYXJ0aWNsZVZlbG9jaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9kaW1lbnNpb25zID09PSAwID8gdGhpcy5wYXJ0aWNsZS5nZXRWZWxvY2l0eTFEKCkgOiB0aGlzLnBhcnRpY2xlLmdldFZlbG9jaXR5KCk7XG59XG5mdW5jdGlvbiBfc2V0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gX3dha2UoKSB7XG4gICAgdGhpcy5QRS53YWtlKCk7XG59XG5mdW5jdGlvbiBfc2xlZXAoKSB7XG4gICAgdGhpcy5QRS5zbGVlcCgpO1xufVxuZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5QRS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2IgPSB0aGlzLl9jYWxsYmFjaztcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfZ2V0RW5lcmd5LmNhbGwodGhpcykgPCB0aGlzLl9hYnNSZXN0VG9sZXJhbmNlKSB7XG4gICAgICAgIF9zZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcywgdGhpcy5lbmRTdGF0ZSk7XG4gICAgICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF0pO1xuICAgICAgICBfc2xlZXAuY2FsbCh0aGlzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBfc2V0dXBEZWZpbml0aW9uKGRlZmluaXRpb24pIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBTcHJpbmdUcmFuc2l0aW9uLkRFRkFVTFRfT1BUSU9OUztcbiAgICBpZiAoZGVmaW5pdGlvbi5wZXJpb2QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmaW5pdGlvbi5wZXJpb2QgPSBkZWZhdWx0cy5wZXJpb2Q7XG4gICAgaWYgKGRlZmluaXRpb24uZGFtcGluZ1JhdGlvID09PSB1bmRlZmluZWQpXG4gICAgICAgIGRlZmluaXRpb24uZGFtcGluZ1JhdGlvID0gZGVmYXVsdHMuZGFtcGluZ1JhdGlvO1xuICAgIGlmIChkZWZpbml0aW9uLnZlbG9jaXR5ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGRlZmluaXRpb24udmVsb2NpdHkgPSBkZWZhdWx0cy52ZWxvY2l0eTtcbiAgICBpZiAoZGVmaW5pdGlvbi5wZXJpb2QgPCAxNTApIHtcbiAgICAgICAgZGVmaW5pdGlvbi5wZXJpb2QgPSAxNTA7XG4gICAgICAgIGNvbnNvbGUud2FybignVGhlIHBlcmlvZCBvZiBhIFNwcmluZ1RyYW5zaXRpb24gaXMgY2FwcGVkIGF0IDE1MCBtcy4gVXNlIGEgU25hcFRyYW5zaXRpb24gZm9yIGZhc3RlciB0cmFuc2l0aW9ucycpO1xuICAgIH1cbiAgICB0aGlzLnNwcmluZy5zZXRPcHRpb25zKHtcbiAgICAgICAgcGVyaW9kOiBkZWZpbml0aW9uLnBlcmlvZCxcbiAgICAgICAgZGFtcGluZ1JhdGlvOiBkZWZpbml0aW9uLmRhbXBpbmdSYXRpb1xuICAgIH0pO1xuICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgZGVmaW5pdGlvbi52ZWxvY2l0eSk7XG59XG5mdW5jdGlvbiBfc2V0QWJzb2x1dGVSZXN0VG9sZXJhbmNlKCkge1xuICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuZW5kU3RhdGUuc3ViKHRoaXMuaW5pdFN0YXRlKS5ub3JtU3F1YXJlZCgpO1xuICAgIHRoaXMuX2Fic1Jlc3RUb2xlcmFuY2UgPSBkaXN0YW5jZSA9PT0gMCA/IHRoaXMuX3Jlc3RUb2xlcmFuY2UgOiB0aGlzLl9yZXN0VG9sZXJhbmNlICogZGlzdGFuY2U7XG59XG5mdW5jdGlvbiBfc2V0VGFyZ2V0KHRhcmdldCkge1xuICAgIHRoaXMuZW5kU3RhdGUuc2V0KHRhcmdldCk7XG4gICAgX3NldEFic29sdXRlUmVzdFRvbGVyYW5jZS5jYWxsKHRoaXMpO1xufVxuU3ByaW5nVHJhbnNpdGlvbi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldChwb3MsIHZlbCkge1xuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSBwb3MgaW5zdGFuY2VvZiBBcnJheSA/IHBvcy5sZW5ndGggOiAwO1xuICAgIHRoaXMuaW5pdFN0YXRlLnNldChwb3MpO1xuICAgIF9zZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcywgcG9zKTtcbiAgICBfc2V0VGFyZ2V0LmNhbGwodGhpcywgcG9zKTtcbiAgICBpZiAodmVsKVxuICAgICAgICBfc2V0UGFydGljbGVWZWxvY2l0eS5jYWxsKHRoaXMsIHZlbCk7XG4gICAgX3NldENhbGxiYWNrLmNhbGwodGhpcywgdW5kZWZpbmVkKTtcbn07XG5TcHJpbmdUcmFuc2l0aW9uLnByb3RvdHlwZS5nZXRWZWxvY2l0eSA9IGZ1bmN0aW9uIGdldFZlbG9jaXR5KCkge1xuICAgIHJldHVybiBfZ2V0UGFydGljbGVWZWxvY2l0eS5jYWxsKHRoaXMpO1xufTtcblNwcmluZ1RyYW5zaXRpb24ucHJvdG90eXBlLnNldFZlbG9jaXR5ID0gZnVuY3Rpb24gc2V0VmVsb2NpdHkodikge1xuICAgIHRoaXMuY2FsbCh0aGlzLCBfc2V0UGFydGljbGVWZWxvY2l0eSh2KSk7XG59O1xuU3ByaW5nVHJhbnNpdGlvbi5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gIXRoaXMuUEUuaXNTbGVlcGluZygpO1xufTtcblNwcmluZ1RyYW5zaXRpb24ucHJvdG90eXBlLmhhbHQgPSBmdW5jdGlvbiBoYWx0KCkge1xuICAgIHRoaXMuc2V0KHRoaXMuZ2V0KCkpO1xufTtcblNwcmluZ1RyYW5zaXRpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICBfdXBkYXRlLmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIF9nZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcyk7XG59O1xuU3ByaW5nVHJhbnNpdGlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGVuZFN0YXRlLCBkZWZpbml0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICB0aGlzLnJlc2V0KGVuZFN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9kaW1lbnNpb25zID0gZW5kU3RhdGUgaW5zdGFuY2VvZiBBcnJheSA/IGVuZFN0YXRlLmxlbmd0aCA6IDA7XG4gICAgX3dha2UuY2FsbCh0aGlzKTtcbiAgICBfc2V0dXBEZWZpbml0aW9uLmNhbGwodGhpcywgZGVmaW5pdGlvbik7XG4gICAgX3NldFRhcmdldC5jYWxsKHRoaXMsIGVuZFN0YXRlKTtcbiAgICBfc2V0Q2FsbGJhY2suY2FsbCh0aGlzLCBjYWxsYmFjayk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTcHJpbmdUcmFuc2l0aW9uOyIsInZhciBNdWx0aXBsZVRyYW5zaXRpb24gPSByZXF1aXJlKCcuL011bHRpcGxlVHJhbnNpdGlvbicpO1xudmFyIFR3ZWVuVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vVHdlZW5UcmFuc2l0aW9uJyk7XG5mdW5jdGlvbiBUcmFuc2l0aW9uYWJsZShzdGFydCkge1xuICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5hY3Rpb25RdWV1ZSA9IFtdO1xuICAgIHRoaXMuY2FsbGJhY2tRdWV1ZSA9IFtdO1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMudmVsb2NpdHkgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZW5naW5lSW5zdGFuY2UgPSBudWxsO1xuICAgIHRoaXMuX2N1cnJlbnRNZXRob2QgPSBudWxsO1xuICAgIHRoaXMuc2V0KHN0YXJ0KTtcbn1cbnZhciB0cmFuc2l0aW9uTWV0aG9kcyA9IHt9O1xuVHJhbnNpdGlvbmFibGUucmVnaXN0ZXJNZXRob2QgPSBmdW5jdGlvbiByZWdpc3Rlck1ldGhvZChuYW1lLCBlbmdpbmVDbGFzcykge1xuICAgIGlmICghKG5hbWUgaW4gdHJhbnNpdGlvbk1ldGhvZHMpKSB7XG4gICAgICAgIHRyYW5zaXRpb25NZXRob2RzW25hbWVdID0gZW5naW5lQ2xhc3M7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG59O1xuVHJhbnNpdGlvbmFibGUudW5yZWdpc3Rlck1ldGhvZCA9IGZ1bmN0aW9uIHVucmVnaXN0ZXJNZXRob2QobmFtZSkge1xuICAgIGlmIChuYW1lIGluIHRyYW5zaXRpb25NZXRob2RzKSB7XG4gICAgICAgIGRlbGV0ZSB0cmFuc2l0aW9uTWV0aG9kc1tuYW1lXTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbn07XG5mdW5jdGlvbiBfbG9hZE5leHQoKSB7XG4gICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuX2NhbGxiYWNrO1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYWN0aW9uUXVldWUubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgdGhpcy5zZXQodGhpcy5nZXQoKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50QWN0aW9uID0gdGhpcy5hY3Rpb25RdWV1ZS5zaGlmdCgpO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gdGhpcy5jYWxsYmFja1F1ZXVlLnNoaWZ0KCk7XG4gICAgdmFyIG1ldGhvZCA9IG51bGw7XG4gICAgdmFyIGVuZFZhbHVlID0gdGhpcy5jdXJyZW50QWN0aW9uWzBdO1xuICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcy5jdXJyZW50QWN0aW9uWzFdO1xuICAgIGlmICh0cmFuc2l0aW9uIGluc3RhbmNlb2YgT2JqZWN0ICYmIHRyYW5zaXRpb24ubWV0aG9kKSB7XG4gICAgICAgIG1ldGhvZCA9IHRyYW5zaXRpb24ubWV0aG9kO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICBtZXRob2QgPSB0cmFuc2l0aW9uTWV0aG9kc1ttZXRob2RdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1ldGhvZCA9IFR3ZWVuVHJhbnNpdGlvbjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRNZXRob2QgIT09IG1ldGhvZCkge1xuICAgICAgICBpZiAoIShlbmRWYWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkgfHwgbWV0aG9kLlNVUFBPUlRTX01VTFRJUExFID09PSB0cnVlIHx8IGVuZFZhbHVlLmxlbmd0aCA8PSBtZXRob2QuU1VQUE9SVFNfTVVMVElQTEUpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZUluc3RhbmNlID0gbmV3IG1ldGhvZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lSW5zdGFuY2UgPSBuZXcgTXVsdGlwbGVUcmFuc2l0aW9uKG1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VycmVudE1ldGhvZCA9IG1ldGhvZDtcbiAgICB9XG4gICAgdGhpcy5fZW5naW5lSW5zdGFuY2UucmVzZXQodGhpcy5zdGF0ZSwgdGhpcy52ZWxvY2l0eSk7XG4gICAgaWYgKHRoaXMudmVsb2NpdHkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgdHJhbnNpdGlvbi52ZWxvY2l0eSA9IHRoaXMudmVsb2NpdHk7XG4gICAgdGhpcy5fZW5naW5lSW5zdGFuY2Uuc2V0KGVuZFZhbHVlLCB0cmFuc2l0aW9uLCBfbG9hZE5leHQuYmluZCh0aGlzKSk7XG59XG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGVuZFN0YXRlLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICghdHJhbnNpdGlvbikge1xuICAgICAgICB0aGlzLnJlc2V0KGVuZFN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBhY3Rpb24gPSBbXG4gICAgICAgICAgICBlbmRTdGF0ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb25cbiAgICAgICAgXTtcbiAgICB0aGlzLmFjdGlvblF1ZXVlLnB1c2goYWN0aW9uKTtcbiAgICB0aGlzLmNhbGxiYWNrUXVldWUucHVzaChjYWxsYmFjayk7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRBY3Rpb24pXG4gICAgICAgIF9sb2FkTmV4dC5jYWxsKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KHN0YXJ0U3RhdGUsIHN0YXJ0VmVsb2NpdHkpIHtcbiAgICB0aGlzLl9jdXJyZW50TWV0aG9kID0gbnVsbDtcbiAgICB0aGlzLl9lbmdpbmVJbnN0YW5jZSA9IG51bGw7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0U3RhdGU7XG4gICAgdGhpcy52ZWxvY2l0eSA9IHN0YXJ0VmVsb2NpdHk7XG4gICAgdGhpcy5jdXJyZW50QWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmFjdGlvblF1ZXVlID0gW107XG4gICAgdGhpcy5jYWxsYmFja1F1ZXVlID0gW107XG59O1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmRlbGF5ID0gZnVuY3Rpb24gZGVsYXkoZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZXQodGhpcy5nZXQoKSwge1xuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIGN1cnZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0sIGNhbGxiYWNrKTtcbn07XG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KHRpbWVzdGFtcCkge1xuICAgIGlmICh0aGlzLl9lbmdpbmVJbnN0YW5jZSkge1xuICAgICAgICBpZiAodGhpcy5fZW5naW5lSW5zdGFuY2UuZ2V0VmVsb2NpdHkpXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5fZW5naW5lSW5zdGFuY2UuZ2V0VmVsb2NpdHkoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuX2VuZ2luZUluc3RhbmNlLmdldCh0aW1lc3RhbXApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbn07XG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmN1cnJlbnRBY3Rpb247XG59O1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmhhbHQgPSBmdW5jdGlvbiBoYWx0KCkge1xuICAgIHJldHVybiB0aGlzLnNldCh0aGlzLmdldCgpKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zaXRpb25hYmxlOyIsInZhciBUcmFuc2l0aW9uYWJsZSA9IHJlcXVpcmUoJy4vVHJhbnNpdGlvbmFibGUnKTtcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCdmYW1vdXMvY29yZS9UcmFuc2Zvcm0nKTtcbnZhciBVdGlsaXR5ID0gcmVxdWlyZSgnZmFtb3VzL3V0aWxpdGllcy9VdGlsaXR5Jyk7XG5mdW5jdGlvbiBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSh0cmFuc2Zvcm0pIHtcbiAgICB0aGlzLl9maW5hbCA9IFRyYW5zZm9ybS5pZGVudGl0eS5zbGljZSgpO1xuICAgIHRoaXMuX2ZpbmFsVHJhbnNsYXRlID0gW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXTtcbiAgICB0aGlzLl9maW5hbFJvdGF0ZSA9IFtcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgMFxuICAgIF07XG4gICAgdGhpcy5fZmluYWxTa2V3ID0gW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAwXG4gICAgXTtcbiAgICB0aGlzLl9maW5hbFNjYWxlID0gW1xuICAgICAgICAxLFxuICAgICAgICAxLFxuICAgICAgICAxXG4gICAgXTtcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IG5ldyBUcmFuc2l0aW9uYWJsZSh0aGlzLl9maW5hbFRyYW5zbGF0ZSk7XG4gICAgdGhpcy5yb3RhdGUgPSBuZXcgVHJhbnNpdGlvbmFibGUodGhpcy5fZmluYWxSb3RhdGUpO1xuICAgIHRoaXMuc2tldyA9IG5ldyBUcmFuc2l0aW9uYWJsZSh0aGlzLl9maW5hbFNrZXcpO1xuICAgIHRoaXMuc2NhbGUgPSBuZXcgVHJhbnNpdGlvbmFibGUodGhpcy5fZmluYWxTY2FsZSk7XG4gICAgaWYgKHRyYW5zZm9ybSlcbiAgICAgICAgdGhpcy5zZXQodHJhbnNmb3JtKTtcbn1cbmZ1bmN0aW9uIF9idWlsZCgpIHtcbiAgICByZXR1cm4gVHJhbnNmb3JtLmJ1aWxkKHtcbiAgICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZS5nZXQoKSxcbiAgICAgICAgcm90YXRlOiB0aGlzLnJvdGF0ZS5nZXQoKSxcbiAgICAgICAgc2tldzogdGhpcy5za2V3LmdldCgpLFxuICAgICAgICBzY2FsZTogdGhpcy5zY2FsZS5nZXQoKVxuICAgIH0pO1xufVxuZnVuY3Rpb24gX2J1aWxkRmluYWwoKSB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybS5idWlsZCh7XG4gICAgICAgIHRyYW5zbGF0ZTogdGhpcy5fZmluYWxUcmFuc2xhdGUsXG4gICAgICAgIHJvdGF0ZTogdGhpcy5fZmluYWxSb3RhdGUsXG4gICAgICAgIHNrZXc6IHRoaXMuX2ZpbmFsU2tldyxcbiAgICAgICAgc2NhbGU6IHRoaXMuX2ZpbmFsU2NhbGVcbiAgICB9KTtcbn1cblRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRUcmFuc2xhdGUgPSBmdW5jdGlvbiBzZXRUcmFuc2xhdGUodHJhbnNsYXRlLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIHRoaXMuX2ZpbmFsVHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuICAgIHRoaXMuX2ZpbmFsID0gX2J1aWxkRmluYWwuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXQodHJhbnNsYXRlLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLnNldFNjYWxlID0gZnVuY3Rpb24gc2V0U2NhbGUoc2NhbGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZmluYWxTY2FsZSA9IHNjYWxlO1xuICAgIHRoaXMuX2ZpbmFsID0gX2J1aWxkRmluYWwuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnNjYWxlLnNldChzY2FsZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xufTtcblRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRSb3RhdGUgPSBmdW5jdGlvbiBzZXRSb3RhdGUoZXVsZXJBbmdsZXMsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZmluYWxSb3RhdGUgPSBldWxlckFuZ2xlcztcbiAgICB0aGlzLl9maW5hbCA9IF9idWlsZEZpbmFsLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yb3RhdGUuc2V0KGV1bGVyQW5nbGVzLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLnNldFNrZXcgPSBmdW5jdGlvbiBzZXRTa2V3KHNrZXdBbmdsZXMsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZmluYWxTa2V3ID0gc2tld0FuZ2xlcztcbiAgICB0aGlzLl9maW5hbCA9IF9idWlsZEZpbmFsLmNhbGwodGhpcyk7XG4gICAgdGhpcy5za2V3LnNldChza2V3QW5nbGVzLCB0cmFuc2l0aW9uLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCh0cmFuc2Zvcm0sIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdmFyIGNvbXBvbmVudHMgPSBUcmFuc2Zvcm0uaW50ZXJwcmV0KHRyYW5zZm9ybSk7XG4gICAgdGhpcy5fZmluYWxUcmFuc2xhdGUgPSBjb21wb25lbnRzLnRyYW5zbGF0ZTtcbiAgICB0aGlzLl9maW5hbFJvdGF0ZSA9IGNvbXBvbmVudHMucm90YXRlO1xuICAgIHRoaXMuX2ZpbmFsU2tldyA9IGNvbXBvbmVudHMuc2tldztcbiAgICB0aGlzLl9maW5hbFNjYWxlID0gY29tcG9uZW50cy5zY2FsZTtcbiAgICB0aGlzLl9maW5hbCA9IHRyYW5zZm9ybTtcbiAgICB2YXIgX2NhbGxiYWNrID0gY2FsbGJhY2sgPyBVdGlsaXR5LmFmdGVyKDQsIGNhbGxiYWNrKSA6IG51bGw7XG4gICAgdGhpcy50cmFuc2xhdGUuc2V0KGNvbXBvbmVudHMudHJhbnNsYXRlLCB0cmFuc2l0aW9uLCBfY2FsbGJhY2spO1xuICAgIHRoaXMucm90YXRlLnNldChjb21wb25lbnRzLnJvdGF0ZSwgdHJhbnNpdGlvbiwgX2NhbGxiYWNrKTtcbiAgICB0aGlzLnNrZXcuc2V0KGNvbXBvbmVudHMuc2tldywgdHJhbnNpdGlvbiwgX2NhbGxiYWNrKTtcbiAgICB0aGlzLnNjYWxlLnNldChjb21wb25lbnRzLnNjYWxlLCB0cmFuc2l0aW9uLCBfY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xufTtcblRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLnByb3RvdHlwZS5zZXREZWZhdWx0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uIHNldERlZmF1bHRUcmFuc2l0aW9uKHRyYW5zaXRpb24pIHtcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0KHRyYW5zaXRpb24pO1xuICAgIHRoaXMucm90YXRlLnNldERlZmF1bHQodHJhbnNpdGlvbik7XG4gICAgdGhpcy5za2V3LnNldERlZmF1bHQodHJhbnNpdGlvbik7XG4gICAgdGhpcy5zY2FsZS5zZXREZWZhdWx0KHRyYW5zaXRpb24pO1xufTtcblRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoKSB7XG4gICAgaWYgKHRoaXMuaXNBY3RpdmUoKSkge1xuICAgICAgICByZXR1cm4gX2J1aWxkLmNhbGwodGhpcyk7XG4gICAgfSBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLl9maW5hbDtcbn07XG5UcmFuc2l0aW9uYWJsZVRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0RmluYWwgPSBmdW5jdGlvbiBnZXRGaW5hbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmluYWw7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLmlzQWN0aXZlID0gZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlLmlzQWN0aXZlKCkgfHwgdGhpcy5yb3RhdGUuaXNBY3RpdmUoKSB8fCB0aGlzLnNjYWxlLmlzQWN0aXZlKCkgfHwgdGhpcy5za2V3LmlzQWN0aXZlKCk7XG59O1xuVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0ucHJvdG90eXBlLmhhbHQgPSBmdW5jdGlvbiBoYWx0KCkge1xuICAgIHRoaXMuX2ZpbmFsID0gdGhpcy5nZXQoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZS5oYWx0KCk7XG4gICAgdGhpcy5yb3RhdGUuaGFsdCgpO1xuICAgIHRoaXMuc2tldy5oYWx0KCk7XG4gICAgdGhpcy5zY2FsZS5oYWx0KCk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybTsiLCJmdW5jdGlvbiBUd2VlblRyYW5zaXRpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoVHdlZW5UcmFuc2l0aW9uLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgaWYgKG9wdGlvbnMpXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSAwO1xuICAgIHRoaXMuX3N0YXJ0VmFsdWUgPSAwO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWUgPSAwO1xuICAgIHRoaXMuX2VuZFZhbHVlID0gMDtcbiAgICB0aGlzLl9jdXJ2ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IDA7XG4gICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgdGhpcy52ZWxvY2l0eSA9IHVuZGVmaW5lZDtcbn1cblR3ZWVuVHJhbnNpdGlvbi5DdXJ2ZXMgPSB7XG4gICAgbGluZWFyOiBmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9LFxuICAgIGVhc2VJbjogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQgKiB0O1xuICAgIH0sXG4gICAgZWFzZU91dDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQgKiAoMiAtIHQpO1xuICAgIH0sXG4gICAgZWFzZUluT3V0OiBmdW5jdGlvbiAodCkge1xuICAgICAgICBpZiAodCA8PSAwLjUpXG4gICAgICAgICAgICByZXR1cm4gMiAqIHQgKiB0O1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gLTIgKiB0ICogdCArIDQgKiB0IC0gMTtcbiAgICB9LFxuICAgIGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0ICogKDMgLSAyICogdCk7XG4gICAgfSxcbiAgICBzcHJpbmc6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiAoMSAtIHQpICogTWF0aC5zaW4oNiAqIE1hdGguUEkgKiB0KSArIHQ7XG4gICAgfVxufTtcblR3ZWVuVHJhbnNpdGlvbi5TVVBQT1JUU19NVUxUSVBMRSA9IHRydWU7XG5Ud2VlblRyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TID0ge1xuICAgIGN1cnZlOiBUd2VlblRyYW5zaXRpb24uQ3VydmVzLmxpbmVhcixcbiAgICBkdXJhdGlvbjogNTAwLFxuICAgIHNwZWVkOiAwXG59O1xudmFyIHJlZ2lzdGVyZWRDdXJ2ZXMgPSB7fTtcblR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlID0gZnVuY3Rpb24gcmVnaXN0ZXJDdXJ2ZShjdXJ2ZU5hbWUsIGN1cnZlKSB7XG4gICAgaWYgKCFyZWdpc3RlcmVkQ3VydmVzW2N1cnZlTmFtZV0pIHtcbiAgICAgICAgcmVnaXN0ZXJlZEN1cnZlc1tjdXJ2ZU5hbWVdID0gY3VydmU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuVHdlZW5UcmFuc2l0aW9uLnVucmVnaXN0ZXJDdXJ2ZSA9IGZ1bmN0aW9uIHVucmVnaXN0ZXJDdXJ2ZShjdXJ2ZU5hbWUpIHtcbiAgICBpZiAocmVnaXN0ZXJlZEN1cnZlc1tjdXJ2ZU5hbWVdKSB7XG4gICAgICAgIGRlbGV0ZSByZWdpc3RlcmVkQ3VydmVzW2N1cnZlTmFtZV07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuVHdlZW5UcmFuc2l0aW9uLmdldEN1cnZlID0gZnVuY3Rpb24gZ2V0Q3VydmUoY3VydmVOYW1lKSB7XG4gICAgdmFyIGN1cnZlID0gcmVnaXN0ZXJlZEN1cnZlc1tjdXJ2ZU5hbWVdO1xuICAgIGlmIChjdXJ2ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gY3VydmU7XG4gICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2N1cnZlIG5vdCByZWdpc3RlcmVkJyk7XG59O1xuVHdlZW5UcmFuc2l0aW9uLmdldEN1cnZlcyA9IGZ1bmN0aW9uIGdldEN1cnZlcygpIHtcbiAgICByZXR1cm4gcmVnaXN0ZXJlZEN1cnZlcztcbn07XG5mdW5jdGlvbiBfaW50ZXJwb2xhdGUoYSwgYiwgdCkge1xuICAgIHJldHVybiAoMSAtIHQpICogYSArIHQgKiBiO1xufVxuZnVuY3Rpb24gX2Nsb25lKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgcmV0dXJuIG9iai5zbGljZSgwKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUob2JqKTtcbiAgICB9IGVsc2VcbiAgICAgICAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIF9ub3JtYWxpemUodHJhbnNpdGlvbiwgZGVmYXVsdFRyYW5zaXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0geyBjdXJ2ZTogZGVmYXVsdFRyYW5zaXRpb24uY3VydmUgfTtcbiAgICBpZiAoZGVmYXVsdFRyYW5zaXRpb24uZHVyYXRpb24pXG4gICAgICAgIHJlc3VsdC5kdXJhdGlvbiA9IGRlZmF1bHRUcmFuc2l0aW9uLmR1cmF0aW9uO1xuICAgIGlmIChkZWZhdWx0VHJhbnNpdGlvbi5zcGVlZClcbiAgICAgICAgcmVzdWx0LnNwZWVkID0gZGVmYXVsdFRyYW5zaXRpb24uc3BlZWQ7XG4gICAgaWYgKHRyYW5zaXRpb24gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uZHVyYXRpb24gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJlc3VsdC5kdXJhdGlvbiA9IHRyYW5zaXRpb24uZHVyYXRpb247XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmN1cnZlKVxuICAgICAgICAgICAgcmVzdWx0LmN1cnZlID0gdHJhbnNpdGlvbi5jdXJ2ZTtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uc3BlZWQpXG4gICAgICAgICAgICByZXN1bHQuc3BlZWQgPSB0cmFuc2l0aW9uLnNwZWVkO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlc3VsdC5jdXJ2ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHJlc3VsdC5jdXJ2ZSA9IFR3ZWVuVHJhbnNpdGlvbi5nZXRDdXJ2ZShyZXN1bHQuY3VydmUpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5Ud2VlblRyYW5zaXRpb24ucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5jdXJ2ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLm9wdGlvbnMuY3VydmUgPSBvcHRpb25zLmN1cnZlO1xuICAgIGlmIChvcHRpb25zLmR1cmF0aW9uICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMub3B0aW9ucy5kdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuc3BlZWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5vcHRpb25zLnNwZWVkID0gb3B0aW9ucy5zcGVlZDtcbn07XG5Ud2VlblRyYW5zaXRpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChlbmRWYWx1ZSwgdHJhbnNpdGlvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhpcy5yZXNldChlbmRWYWx1ZSk7XG4gICAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc3RhcnRWYWx1ZSA9IF9jbG9uZSh0aGlzLmdldCgpKTtcbiAgICB0cmFuc2l0aW9uID0gX25vcm1hbGl6ZSh0cmFuc2l0aW9uLCB0aGlzLm9wdGlvbnMpO1xuICAgIGlmICh0cmFuc2l0aW9uLnNwZWVkKSB7XG4gICAgICAgIHZhciBzdGFydFZhbHVlID0gdGhpcy5fc3RhcnRWYWx1ZTtcbiAgICAgICAgaWYgKHN0YXJ0VmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgIHZhciB2YXJpYW5jZSA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHN0YXJ0VmFsdWUpXG4gICAgICAgICAgICAgICAgdmFyaWFuY2UgKz0gKGVuZFZhbHVlW2ldIC0gc3RhcnRWYWx1ZVtpXSkgKiAoZW5kVmFsdWVbaV0gLSBzdGFydFZhbHVlW2ldKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24uZHVyYXRpb24gPSBNYXRoLnNxcnQodmFyaWFuY2UpIC8gdHJhbnNpdGlvbi5zcGVlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb24uZHVyYXRpb24gPSBNYXRoLmFicyhlbmRWYWx1ZSAtIHN0YXJ0VmFsdWUpIC8gdHJhbnNpdGlvbi5zcGVlZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX2VuZFZhbHVlID0gX2Nsb25lKGVuZFZhbHVlKTtcbiAgICB0aGlzLl9zdGFydFZlbG9jaXR5ID0gX2Nsb25lKHRyYW5zaXRpb24udmVsb2NpdHkpO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gdHJhbnNpdGlvbi5kdXJhdGlvbjtcbiAgICB0aGlzLl9jdXJ2ZSA9IHRyYW5zaXRpb24uY3VydmU7XG4gICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xufTtcblR3ZWVuVHJhbnNpdGlvbi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldChzdGFydFZhbHVlLCBzdGFydFZlbG9jaXR5KSB7XG4gICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuX2NhbGxiYWNrO1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IF9jbG9uZShzdGFydFZhbHVlKTtcbiAgICB0aGlzLnZlbG9jaXR5ID0gX2Nsb25lKHN0YXJ0VmVsb2NpdHkpO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IDA7XG4gICAgdGhpcy5fZHVyYXRpb24gPSAwO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWUgPSAwO1xuICAgIHRoaXMuX3N0YXJ0VmFsdWUgPSB0aGlzLnN0YXRlO1xuICAgIHRoaXMuX3N0YXJ0VmVsb2NpdHkgPSB0aGlzLnZlbG9jaXR5O1xuICAgIHRoaXMuX2VuZFZhbHVlID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbn07XG5Ud2VlblRyYW5zaXRpb24ucHJvdG90eXBlLmdldFZlbG9jaXR5ID0gZnVuY3Rpb24gZ2V0VmVsb2NpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmVsb2NpdHk7XG59O1xuVHdlZW5UcmFuc2l0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQodGltZXN0YW1wKSB7XG4gICAgdGhpcy51cGRhdGUodGltZXN0YW1wKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbn07XG5mdW5jdGlvbiBfY2FsY3VsYXRlVmVsb2NpdHkoY3VycmVudCwgc3RhcnQsIGN1cnZlLCBkdXJhdGlvbiwgdCkge1xuICAgIHZhciB2ZWxvY2l0eTtcbiAgICB2YXIgZXBzID0gMWUtNztcbiAgICB2YXIgc3BlZWQgPSAoY3VydmUodCkgLSBjdXJ2ZSh0IC0gZXBzKSkgLyBlcHM7XG4gICAgaWYgKGN1cnJlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB2ZWxvY2l0eSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudFtpXSA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICAgICAgdmVsb2NpdHlbaV0gPSBzcGVlZCAqIChjdXJyZW50W2ldIC0gc3RhcnRbaV0pIC8gZHVyYXRpb247XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdmVsb2NpdHlbaV0gPSAwO1xuICAgICAgICB9XG4gICAgfSBlbHNlXG4gICAgICAgIHZlbG9jaXR5ID0gc3BlZWQgKiAoY3VycmVudCAtIHN0YXJ0KSAvIGR1cmF0aW9uO1xuICAgIHJldHVybiB2ZWxvY2l0eTtcbn1cbmZ1bmN0aW9uIF9jYWxjdWxhdGVTdGF0ZShzdGFydCwgZW5kLCB0KSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmIChzdGFydCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHN0YXRlID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RhcnRbaV0gPT09ICdudW1iZXInKVxuICAgICAgICAgICAgICAgIHN0YXRlW2ldID0gX2ludGVycG9sYXRlKHN0YXJ0W2ldLCBlbmRbaV0sIHQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN0YXRlW2ldID0gc3RhcnRbaV07XG4gICAgICAgIH1cbiAgICB9IGVsc2VcbiAgICAgICAgc3RhdGUgPSBfaW50ZXJwb2xhdGUoc3RhcnQsIGVuZCwgdCk7XG4gICAgcmV0dXJuIHN0YXRlO1xufVxuVHdlZW5UcmFuc2l0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUodGltZXN0YW1wKSB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLl9jYWxsYmFjaztcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGltZXN0YW1wKVxuICAgICAgICB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0aGlzLl91cGRhdGVUaW1lID49IHRpbWVzdGFtcClcbiAgICAgICAgcmV0dXJuO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWUgPSB0aW1lc3RhbXA7XG4gICAgdmFyIHRpbWVTaW5jZVN0YXJ0ID0gdGltZXN0YW1wIC0gdGhpcy5fc3RhcnRUaW1lO1xuICAgIGlmICh0aW1lU2luY2VTdGFydCA+PSB0aGlzLl9kdXJhdGlvbikge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5fZW5kVmFsdWU7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBfY2FsY3VsYXRlVmVsb2NpdHkodGhpcy5zdGF0ZSwgdGhpcy5fc3RhcnRWYWx1ZSwgdGhpcy5fY3VydmUsIHRoaXMuX2R1cmF0aW9uLCAxKTtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0aW1lU2luY2VTdGFydCA8IDApIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuX3N0YXJ0VmFsdWU7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB0aGlzLl9zdGFydFZlbG9jaXR5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0ID0gdGltZVNpbmNlU3RhcnQgLyB0aGlzLl9kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IF9jYWxjdWxhdGVTdGF0ZSh0aGlzLl9zdGFydFZhbHVlLCB0aGlzLl9lbmRWYWx1ZSwgdGhpcy5fY3VydmUodCkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gX2NhbGN1bGF0ZVZlbG9jaXR5KHRoaXMuc3RhdGUsIHRoaXMuX3N0YXJ0VmFsdWUsIHRoaXMuX2N1cnZlLCB0aGlzLl9kdXJhdGlvbiwgdCk7XG4gICAgfVxufTtcblR3ZWVuVHJhbnNpdGlvbi5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xufTtcblR3ZWVuVHJhbnNpdGlvbi5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgdGhpcy5yZXNldCh0aGlzLmdldCgpKTtcbn07XG5Ud2VlblRyYW5zaXRpb24ucmVnaXN0ZXJDdXJ2ZSgnbGluZWFyJywgVHdlZW5UcmFuc2l0aW9uLkN1cnZlcy5saW5lYXIpO1xuVHdlZW5UcmFuc2l0aW9uLnJlZ2lzdGVyQ3VydmUoJ2Vhc2VJbicsIFR3ZWVuVHJhbnNpdGlvbi5DdXJ2ZXMuZWFzZUluKTtcblR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlKCdlYXNlT3V0JywgVHdlZW5UcmFuc2l0aW9uLkN1cnZlcy5lYXNlT3V0KTtcblR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlKCdlYXNlSW5PdXQnLCBUd2VlblRyYW5zaXRpb24uQ3VydmVzLmVhc2VJbk91dCk7XG5Ud2VlblRyYW5zaXRpb24ucmVnaXN0ZXJDdXJ2ZSgnZWFzZU91dEJvdW5jZScsIFR3ZWVuVHJhbnNpdGlvbi5DdXJ2ZXMuZWFzZU91dEJvdW5jZSk7XG5Ud2VlblRyYW5zaXRpb24ucmVnaXN0ZXJDdXJ2ZSgnc3ByaW5nJywgVHdlZW5UcmFuc2l0aW9uLkN1cnZlcy5zcHJpbmcpO1xuVHdlZW5UcmFuc2l0aW9uLmN1c3RvbUN1cnZlID0gZnVuY3Rpb24gY3VzdG9tQ3VydmUodjEsIHYyKSB7XG4gICAgdjEgPSB2MSB8fCAwO1xuICAgIHYyID0gdjIgfHwgMDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHYxICogdCArICgtMiAqIHYxIC0gdjIgKyAzKSAqIHQgKiB0ICsgKHYxICsgdjIgLSAyKSAqIHQgKiB0ICogdDtcbiAgICB9O1xufTtcbm1vZHVsZS5leHBvcnRzID0gVHdlZW5UcmFuc2l0aW9uOyIsInZhciBQRSA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL1BoeXNpY3NFbmdpbmUnKTtcbnZhciBQYXJ0aWNsZSA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL2JvZGllcy9QYXJ0aWNsZScpO1xudmFyIFNwcmluZyA9IHJlcXVpcmUoJ2ZhbW91cy9waHlzaWNzL2ZvcmNlcy9TcHJpbmcnKTtcbnZhciBXYWxsID0gcmVxdWlyZSgnZmFtb3VzL3BoeXNpY3MvY29uc3RyYWludHMvV2FsbCcpO1xudmFyIFZlY3RvciA9IHJlcXVpcmUoJ2ZhbW91cy9tYXRoL1ZlY3RvcicpO1xuZnVuY3Rpb24gV2FsbFRyYW5zaXRpb24oc3RhdGUpIHtcbiAgICBzdGF0ZSA9IHN0YXRlIHx8IDA7XG4gICAgdGhpcy5lbmRTdGF0ZSA9IG5ldyBWZWN0b3Ioc3RhdGUpO1xuICAgIHRoaXMuaW5pdFN0YXRlID0gbmV3IFZlY3RvcigpO1xuICAgIHRoaXMuc3ByaW5nID0gbmV3IFNwcmluZyh7IGFuY2hvcjogdGhpcy5lbmRTdGF0ZSB9KTtcbiAgICB0aGlzLndhbGwgPSBuZXcgV2FsbCgpO1xuICAgIHRoaXMuX3Jlc3RUb2xlcmFuY2UgPSAxZS0xMDtcbiAgICB0aGlzLl9kaW1lbnNpb25zID0gMTtcbiAgICB0aGlzLl9hYnNSZXN0VG9sZXJhbmNlID0gdGhpcy5fcmVzdFRvbGVyYW5jZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLlBFID0gbmV3IFBFKCk7XG4gICAgdGhpcy5wYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZSgpO1xuICAgIHRoaXMuUEUuYWRkQm9keSh0aGlzLnBhcnRpY2xlKTtcbiAgICB0aGlzLlBFLmF0dGFjaChbXG4gICAgICAgIHRoaXMud2FsbCxcbiAgICAgICAgdGhpcy5zcHJpbmdcbiAgICBdLCB0aGlzLnBhcnRpY2xlKTtcbn1cbldhbGxUcmFuc2l0aW9uLlNVUFBPUlRTX01VTFRJUExFID0gMztcbldhbGxUcmFuc2l0aW9uLkRFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBwZXJpb2Q6IDMwMCxcbiAgICBkYW1waW5nUmF0aW86IDAuNSxcbiAgICB2ZWxvY2l0eTogMCxcbiAgICByZXN0aXR1dGlvbjogMC41XG59O1xuZnVuY3Rpb24gX2dldEVuZXJneSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZS5nZXRFbmVyZ3koKSArIHRoaXMuc3ByaW5nLmdldEVuZXJneSh0aGlzLnBhcnRpY2xlKTtcbn1cbmZ1bmN0aW9uIF9zZXRBYnNvbHV0ZVJlc3RUb2xlcmFuY2UoKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gdGhpcy5lbmRTdGF0ZS5zdWIodGhpcy5pbml0U3RhdGUpLm5vcm1TcXVhcmVkKCk7XG4gICAgdGhpcy5fYWJzUmVzdFRvbGVyYW5jZSA9IGRpc3RhbmNlID09PSAwID8gdGhpcy5fcmVzdFRvbGVyYW5jZSA6IHRoaXMuX3Jlc3RUb2xlcmFuY2UgKiBkaXN0YW5jZTtcbn1cbmZ1bmN0aW9uIF93YWtlKCkge1xuICAgIHRoaXMuUEUud2FrZSgpO1xufVxuZnVuY3Rpb24gX3NsZWVwKCkge1xuICAgIHRoaXMuUEUuc2xlZXAoKTtcbn1cbmZ1bmN0aW9uIF9zZXRUYXJnZXQodGFyZ2V0KSB7XG4gICAgdGhpcy5lbmRTdGF0ZS5zZXQodGFyZ2V0KTtcbiAgICB2YXIgZGlzdCA9IHRoaXMuZW5kU3RhdGUuc3ViKHRoaXMuaW5pdFN0YXRlKS5ub3JtKCk7XG4gICAgdGhpcy53YWxsLnNldE9wdGlvbnMoe1xuICAgICAgICBkaXN0YW5jZTogdGhpcy5lbmRTdGF0ZS5ub3JtKCksXG4gICAgICAgIG5vcm1hbDogZGlzdCA9PT0gMCA/IHRoaXMucGFydGljbGUudmVsb2NpdHkubm9ybWFsaXplKC0xKSA6IHRoaXMuZW5kU3RhdGUuc3ViKHRoaXMuaW5pdFN0YXRlKS5ub3JtYWxpemUoLTEpXG4gICAgfSk7XG4gICAgX3NldEFic29sdXRlUmVzdFRvbGVyYW5jZS5jYWxsKHRoaXMpO1xufVxuZnVuY3Rpb24gX3NldFBhcnRpY2xlUG9zaXRpb24ocCkge1xuICAgIHRoaXMucGFydGljbGUucG9zaXRpb24uc2V0KHApO1xufVxuZnVuY3Rpb24gX3NldFBhcnRpY2xlVmVsb2NpdHkodikge1xuICAgIHRoaXMucGFydGljbGUudmVsb2NpdHkuc2V0KHYpO1xufVxuZnVuY3Rpb24gX2dldFBhcnRpY2xlUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnMgPT09IDAgPyB0aGlzLnBhcnRpY2xlLmdldFBvc2l0aW9uMUQoKSA6IHRoaXMucGFydGljbGUuZ2V0UG9zaXRpb24oKTtcbn1cbmZ1bmN0aW9uIF9nZXRQYXJ0aWNsZVZlbG9jaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9kaW1lbnNpb25zID09PSAwID8gdGhpcy5wYXJ0aWNsZS5nZXRWZWxvY2l0eTFEKCkgOiB0aGlzLnBhcnRpY2xlLmdldFZlbG9jaXR5KCk7XG59XG5mdW5jdGlvbiBfc2V0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5QRS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2IgPSB0aGlzLl9jYWxsYmFjaztcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbmVyZ3kgPSBfZ2V0RW5lcmd5LmNhbGwodGhpcyk7XG4gICAgaWYgKGVuZXJneSA8IHRoaXMuX2Fic1Jlc3RUb2xlcmFuY2UpIHtcbiAgICAgICAgX3NsZWVwLmNhbGwodGhpcyk7XG4gICAgICAgIF9zZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcywgdGhpcy5lbmRTdGF0ZSk7XG4gICAgICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgIF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9zZXR1cERlZmluaXRpb24oZGVmKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gV2FsbFRyYW5zaXRpb24uREVGQVVMVF9PUFRJT05TO1xuICAgIGlmIChkZWYucGVyaW9kID09PSB1bmRlZmluZWQpXG4gICAgICAgIGRlZi5wZXJpb2QgPSBkZWZhdWx0cy5wZXJpb2Q7XG4gICAgaWYgKGRlZi5kYW1waW5nUmF0aW8gPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmLmRhbXBpbmdSYXRpbyA9IGRlZmF1bHRzLmRhbXBpbmdSYXRpbztcbiAgICBpZiAoZGVmLnZlbG9jaXR5ID09PSB1bmRlZmluZWQpXG4gICAgICAgIGRlZi52ZWxvY2l0eSA9IGRlZmF1bHRzLnZlbG9jaXR5O1xuICAgIGlmIChkZWYucmVzdGl0dXRpb24gPT09IHVuZGVmaW5lZClcbiAgICAgICAgZGVmLnJlc3RpdHV0aW9uID0gZGVmYXVsdHMucmVzdGl0dXRpb247XG4gICAgdGhpcy5zcHJpbmcuc2V0T3B0aW9ucyh7XG4gICAgICAgIHBlcmlvZDogZGVmLnBlcmlvZCxcbiAgICAgICAgZGFtcGluZ1JhdGlvOiBkZWYuZGFtcGluZ1JhdGlvXG4gICAgfSk7XG4gICAgdGhpcy53YWxsLnNldE9wdGlvbnMoeyByZXN0aXR1dGlvbjogZGVmLnJlc3RpdHV0aW9uIH0pO1xuICAgIF9zZXRQYXJ0aWNsZVZlbG9jaXR5LmNhbGwodGhpcywgZGVmLnZlbG9jaXR5KTtcbn1cbldhbGxUcmFuc2l0aW9uLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KHN0YXRlLCB2ZWxvY2l0eSkge1xuICAgIHRoaXMuX2RpbWVuc2lvbnMgPSBzdGF0ZSBpbnN0YW5jZW9mIEFycmF5ID8gc3RhdGUubGVuZ3RoIDogMDtcbiAgICB0aGlzLmluaXRTdGF0ZS5zZXQoc3RhdGUpO1xuICAgIF9zZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcywgc3RhdGUpO1xuICAgIGlmICh2ZWxvY2l0eSlcbiAgICAgICAgX3NldFBhcnRpY2xlVmVsb2NpdHkuY2FsbCh0aGlzLCB2ZWxvY2l0eSk7XG4gICAgX3NldFRhcmdldC5jYWxsKHRoaXMsIHN0YXRlKTtcbiAgICBfc2V0Q2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQpO1xufTtcbldhbGxUcmFuc2l0aW9uLnByb3RvdHlwZS5nZXRWZWxvY2l0eSA9IGZ1bmN0aW9uIGdldFZlbG9jaXR5KCkge1xuICAgIHJldHVybiBfZ2V0UGFydGljbGVWZWxvY2l0eS5jYWxsKHRoaXMpO1xufTtcbldhbGxUcmFuc2l0aW9uLnByb3RvdHlwZS5zZXRWZWxvY2l0eSA9IGZ1bmN0aW9uIHNldFZlbG9jaXR5KHZlbG9jaXR5KSB7XG4gICAgdGhpcy5jYWxsKHRoaXMsIF9zZXRQYXJ0aWNsZVZlbG9jaXR5KHZlbG9jaXR5KSk7XG59O1xuV2FsbFRyYW5zaXRpb24ucHJvdG90eXBlLmlzQWN0aXZlID0gZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuICF0aGlzLlBFLmlzU2xlZXBpbmcoKTtcbn07XG5XYWxsVHJhbnNpdGlvbi5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgdGhpcy5zZXQodGhpcy5nZXQoKSk7XG59O1xuV2FsbFRyYW5zaXRpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICBfdXBkYXRlLmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIF9nZXRQYXJ0aWNsZVBvc2l0aW9uLmNhbGwodGhpcyk7XG59O1xuV2FsbFRyYW5zaXRpb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChzdGF0ZSwgZGVmaW5pdGlvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgICAgdGhpcy5yZXNldChzdGF0ZSk7XG4gICAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fZGltZW5zaW9ucyA9IHN0YXRlIGluc3RhbmNlb2YgQXJyYXkgPyBzdGF0ZS5sZW5ndGggOiAwO1xuICAgIF93YWtlLmNhbGwodGhpcyk7XG4gICAgX3NldHVwRGVmaW5pdGlvbi5jYWxsKHRoaXMsIGRlZmluaXRpb24pO1xuICAgIF9zZXRUYXJnZXQuY2FsbCh0aGlzLCBzdGF0ZSk7XG4gICAgX3NldENhbGxiYWNrLmNhbGwodGhpcywgY2FsbGJhY2spO1xufTtcbm1vZHVsZS5leHBvcnRzID0gV2FsbFRyYW5zaXRpb247IiwidmFyIEZhbW91c0VuZ2luZSA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL0VuZ2luZScpO1xudmFyIF9ldmVudCA9ICdwcmVyZW5kZXInO1xudmFyIGdldFRpbWUgPSB3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9IDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coKTtcbiAgICB9O1xuZnVuY3Rpb24gYWRkVGltZXJGdW5jdGlvbihmbikge1xuICAgIEZhbW91c0VuZ2luZS5vbihfZXZlbnQsIGZuKTtcbiAgICByZXR1cm4gZm47XG59XG5mdW5jdGlvbiBzZXRUaW1lb3V0KGZuLCBkdXJhdGlvbikge1xuICAgIHZhciB0ID0gZ2V0VGltZSgpO1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHQyID0gZ2V0VGltZSgpO1xuICAgICAgICBpZiAodDIgLSB0ID49IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgRmFtb3VzRW5naW5lLnJlbW92ZUxpc3RlbmVyKF9ldmVudCwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gYWRkVGltZXJGdW5jdGlvbihjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBzZXRJbnRlcnZhbChmbiwgZHVyYXRpb24pIHtcbiAgICB2YXIgdCA9IGdldFRpbWUoKTtcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0MiA9IGdldFRpbWUoKTtcbiAgICAgICAgaWYgKHQyIC0gdCA+PSBkdXJhdGlvbikge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHQgPSBnZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBhZGRUaW1lckZ1bmN0aW9uKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGFmdGVyKGZuLCBudW1UaWNrcykge1xuICAgIGlmIChudW1UaWNrcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbnVtVGlja3MtLTtcbiAgICAgICAgaWYgKG51bVRpY2tzIDw9IDApIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBjbGVhcihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBhZGRUaW1lckZ1bmN0aW9uKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGV2ZXJ5KGZuLCBudW1UaWNrcykge1xuICAgIG51bVRpY2tzID0gbnVtVGlja3MgfHwgMTtcbiAgICB2YXIgaW5pdGlhbCA9IG51bVRpY2tzO1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbnVtVGlja3MtLTtcbiAgICAgICAgaWYgKG51bVRpY2tzIDw9IDApIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBudW1UaWNrcyA9IGluaXRpYWw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBhZGRUaW1lckZ1bmN0aW9uKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsZWFyKGZuKSB7XG4gICAgRmFtb3VzRW5naW5lLnJlbW92ZUxpc3RlbmVyKF9ldmVudCwgZm4pO1xufVxuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHZhciBjdHg7XG4gICAgdmFyIHRpbWVzdGFtcDtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHZhciBhcmdzO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN0eCA9IHRoaXM7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHRpbWVzdGFtcCA9IGdldFRpbWUoKTtcbiAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxhc3QgPSBnZXRUaW1lIC0gdGltZXN0YW1wO1xuICAgICAgICAgICAgaWYgKGxhc3QgPCB3YWl0KSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHdhaXQgLSBsYXN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjdHgsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjbGVhcih0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHdhaXQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzZXRUaW1lb3V0OiBzZXRUaW1lb3V0LFxuICAgIHNldEludGVydmFsOiBzZXRJbnRlcnZhbCxcbiAgICBkZWJvdW5jZTogZGVib3VuY2UsXG4gICAgYWZ0ZXI6IGFmdGVyLFxuICAgIGV2ZXJ5OiBldmVyeSxcbiAgICBjbGVhcjogY2xlYXJcbn07IiwidmFyIFV0aWxpdHkgPSB7fTtcblV0aWxpdHkuRGlyZWN0aW9uID0ge1xuICAgIFg6IDAsXG4gICAgWTogMSxcbiAgICBaOiAyXG59O1xuVXRpbGl0eS5hZnRlciA9IGZ1bmN0aW9uIGFmdGVyKGNvdW50LCBjYWxsYmFjaykge1xuICAgIHZhciBjb3VudGVyID0gY291bnQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY291bnRlci0tO1xuICAgICAgICBpZiAoY291bnRlciA9PT0gMClcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn07XG5VdGlsaXR5LmxvYWRVUkwgPSBmdW5jdGlvbiBsb2FkVVJMKHVybCwgY2FsbGJhY2spIHtcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIG9ucmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgeGhyLnNlbmQoKTtcbn07XG5VdGlsaXR5LmNyZWF0ZURvY3VtZW50RnJhZ21lbnRGcm9tSFRNTCA9IGZ1bmN0aW9uIGNyZWF0ZURvY3VtZW50RnJhZ21lbnRGcm9tSFRNTChodG1sKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG4gICAgdmFyIHJlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB3aGlsZSAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpXG4gICAgICAgIHJlc3VsdC5hcHBlbmRDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuVXRpbGl0eS5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKGIpIHtcbiAgICB2YXIgYTtcbiAgICBpZiAodHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGEgPSB7fTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYltrZXldID09PSAnb2JqZWN0JyAmJiBiW2tleV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYltrZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgYVtrZXldID0gbmV3IEFycmF5KGJba2V5XS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJba2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYVtrZXldW2ldID0gVXRpbGl0eS5jbG9uZShiW2tleV1baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYVtrZXldID0gVXRpbGl0eS5jbG9uZShiW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYVtrZXldID0gYltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IGI7XG4gICAgfVxuICAgIHJldHVybiBhO1xufTtcbm1vZHVsZS5leHBvcnRzID0gVXRpbGl0eTsiLCJ2YXIgT3B0aW9uc01hbmFnZXIgPSByZXF1aXJlKCdmYW1vdXMvY29yZS9PcHRpb25zTWFuYWdlcicpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL1RyYW5zZm9ybScpO1xudmFyIFZpZXdTZXF1ZW5jZSA9IHJlcXVpcmUoJ2ZhbW91cy9jb3JlL1ZpZXdTZXF1ZW5jZScpO1xudmFyIFV0aWxpdHkgPSByZXF1aXJlKCdmYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHknKTtcbmZ1bmN0aW9uIFNlcXVlbnRpYWxMYXlvdXQob3B0aW9ucykge1xuICAgIHRoaXMuX2l0ZW1zID0gbnVsbDtcbiAgICB0aGlzLl9zaXplID0gbnVsbDtcbiAgICB0aGlzLl9vdXRwdXRGdW5jdGlvbiA9IFNlcXVlbnRpYWxMYXlvdXQuREVGQVVMVF9PVVRQVVRfRlVOQ1RJT047XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLmNvbnN0cnVjdG9yLkRFRkFVTFRfT1BUSU9OUyk7XG4gICAgdGhpcy5vcHRpb25zTWFuYWdlciA9IG5ldyBPcHRpb25zTWFuYWdlcih0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuX2l0ZW1zQ2FjaGUgPSBbXTtcbiAgICB0aGlzLl9vdXRwdXRDYWNoZSA9IHtcbiAgICAgICAgc2l6ZTogbnVsbCxcbiAgICAgICAgdGFyZ2V0OiB0aGlzLl9pdGVtc0NhY2hlXG4gICAgfTtcbiAgICBpZiAob3B0aW9ucylcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xufVxuU2VxdWVudGlhbExheW91dC5ERUZBVUxUX09QVElPTlMgPSB7XG4gICAgZGlyZWN0aW9uOiBVdGlsaXR5LkRpcmVjdGlvbi5ZLFxuICAgIGl0ZW1TcGFjaW5nOiAwLFxuICAgIGRlZmF1bHRJdGVtU2l6ZTogW1xuICAgICAgICA1MCxcbiAgICAgICAgNTBcbiAgICBdXG59O1xuU2VxdWVudGlhbExheW91dC5ERUZBVUxUX09VVFBVVF9GVU5DVElPTiA9IGZ1bmN0aW9uIERFRkFVTFRfT1VUUFVUX0ZVTkNUSU9OKGlucHV0LCBvZmZzZXQsIGluZGV4KSB7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFV0aWxpdHkuRGlyZWN0aW9uLlggPyBUcmFuc2Zvcm0udHJhbnNsYXRlKG9mZnNldCwgMCkgOiBUcmFuc2Zvcm0udHJhbnNsYXRlKDAsIG9mZnNldCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgICAgIHRhcmdldDogaW5wdXQucmVuZGVyKClcbiAgICB9O1xufTtcblNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiBnZXRTaXplKCkge1xuICAgIGlmICghdGhpcy5fc2l6ZSlcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5TZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5zZXF1ZW5jZUZyb20gPSBmdW5jdGlvbiBzZXF1ZW5jZUZyb20oaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgaXRlbXMgPSBuZXcgVmlld1NlcXVlbmNlKGl0ZW1zKTtcbiAgICB0aGlzLl9pdGVtcyA9IGl0ZW1zO1xuICAgIHJldHVybiB0aGlzO1xufTtcblNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnNNYW5hZ2VyLnNldE9wdGlvbnMuYXBwbHkodGhpcy5vcHRpb25zTWFuYWdlciwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5TZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5zZXRPdXRwdXRGdW5jdGlvbiA9IGZ1bmN0aW9uIHNldE91dHB1dEZ1bmN0aW9uKG91dHB1dEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5fb3V0cHV0RnVuY3Rpb24gPSBvdXRwdXRGdW5jdGlvbjtcbiAgICByZXR1cm4gdGhpcztcbn07XG5TZXF1ZW50aWFsTGF5b3V0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGxlbmd0aCA9IDA7XG4gICAgdmFyIGdpcnRoID0gMDtcbiAgICB2YXIgbGVuZ3RoRGltID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gVXRpbGl0eS5EaXJlY3Rpb24uWCA/IDAgOiAxO1xuICAgIHZhciBnaXJ0aERpbSA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFV0aWxpdHkuRGlyZWN0aW9uLlggPyAxIDogMDtcbiAgICB2YXIgY3VycmVudE5vZGUgPSB0aGlzLl9pdGVtcztcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5faXRlbXNDYWNoZTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICAgIHZhciBpdGVtID0gY3VycmVudE5vZGUuZ2V0KCk7XG4gICAgICAgIGlmICghaXRlbSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB2YXIgaXRlbVNpemU7XG4gICAgICAgIGlmIChpdGVtICYmIGl0ZW0uZ2V0U2l6ZSlcbiAgICAgICAgICAgIGl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XG4gICAgICAgIGlmICghaXRlbVNpemUpXG4gICAgICAgICAgICBpdGVtU2l6ZSA9IHRoaXMub3B0aW9ucy5kZWZhdWx0SXRlbVNpemU7XG4gICAgICAgIGlmIChpdGVtU2l6ZVtnaXJ0aERpbV0gIT09IHRydWUpXG4gICAgICAgICAgICBnaXJ0aCA9IE1hdGgubWF4KGdpcnRoLCBpdGVtU2l6ZVtnaXJ0aERpbV0pO1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fb3V0cHV0RnVuY3Rpb24uY2FsbCh0aGlzLCBpdGVtLCBsZW5ndGgsIGkpO1xuICAgICAgICByZXN1bHRbaV0gPSBvdXRwdXQ7XG4gICAgICAgIGlmIChpdGVtU2l6ZVtsZW5ndGhEaW1dICYmIGl0ZW1TaXplW2xlbmd0aERpbV0gIT09IHRydWUpXG4gICAgICAgICAgICBsZW5ndGggKz0gaXRlbVNpemVbbGVuZ3RoRGltXSArIHRoaXMub3B0aW9ucy5pdGVtU3BhY2luZztcbiAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5nZXROZXh0KCk7XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgdGhpcy5faXRlbXNDYWNoZS5zcGxpY2UoaSk7XG4gICAgaWYgKCFnaXJ0aClcbiAgICAgICAgZ2lydGggPSB1bmRlZmluZWQ7XG4gICAgaWYgKCF0aGlzLl9zaXplKVxuICAgICAgICB0aGlzLl9zaXplID0gW1xuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgXTtcbiAgICB0aGlzLl9zaXplW2xlbmd0aERpbV0gPSBsZW5ndGggLSB0aGlzLm9wdGlvbnMuaXRlbVNwYWNpbmc7XG4gICAgdGhpcy5fc2l6ZVtnaXJ0aERpbV0gPSBnaXJ0aDtcbiAgICB0aGlzLl9vdXRwdXRDYWNoZS5zaXplID0gdGhpcy5nZXRTaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuX291dHB1dENhY2hlO1xufTtcbm1vZHVsZS5leHBvcnRzID0gU2VxdWVudGlhbExheW91dDsiLCJmdW5jdGlvbiBDYXJvdXNlbCh0LGUpe1NpemVBd2FyZVZpZXcuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMuX2lzUGx1Z2luPWUsdGhpcy5fZGF0YT17aW5kZXg6dm9pZCAwLHBhZ2luYXRlZEluZGV4OjEsaXRlbXNQZXJQYWdlOjEsaXRlbXM6dm9pZCAwLHJlbmRlcmFibGVzOltdLGxlbmd0aDp2b2lkIDB9LHRoaXMuc3luYz1uZXcgR2VuZXJpY1N5bmMsdGhpcy5sYXlvdXREZWZpbml0aW9uLHRoaXMubGF5b3V0Q29udHJvbGxlcj1uZXcgTGF5b3V0Q29udHJvbGxlcih7Y2xhc3NlczpbXCJmYW1vdXMtY2Fyb3VzZWwtY29udGFpbmVyXCJdLGl0ZW1zUGVyUGFnZTp0aGlzLl9kYXRhLml0ZW1zUGVyUGFnZSxsb29wOnRoaXMub3B0aW9ucy5sb29wLHN5bmM6dGhpcy5zeW5jfSksdGhpcy5sYXlvdXRDb250cm9sbGVyLl9jb25uZWN0Q29udGFpbmVyKHRoaXMpLHRoaXMuY2xpY2tMZW5ndGg9bnVsbCx0aGlzLl9pbml0KCl9dmFyIFJlbmRlck5vZGU9cmVxdWlyZShcImZhbW91cy9jb3JlL1JlbmRlck5vZGVcIiksTW9kaWZpZXI9cmVxdWlyZShcImZhbW91cy9jb3JlL01vZGlmaWVyXCIpLEVuZ2luZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvRW5naW5lXCIpLFN1cmZhY2U9cmVxdWlyZShcImZhbW91cy9jb3JlL1N1cmZhY2VcIiksU2l6ZUF3YXJlVmlldz1yZXF1aXJlKFwiLi9jb25zdHJ1Y3RvcnMvU2l6ZUF3YXJlVmlld1wiKSxUaW1lcj1yZXF1aXJlKFwiZmFtb3VzL3V0aWxpdGllcy9UaW1lclwiKSxGYXN0Q2xpY2s9cmVxdWlyZShcImZhbW91cy9pbnB1dHMvRmFzdENsaWNrXCIpLFJlZ2lzdGVyRWFzaW5nPXJlcXVpcmUoXCIuL3JlZ2lzdHJpZXMvRWFzaW5nXCIpLFJlZ2lzdGVyUGh5c2ljcz1yZXF1aXJlKFwiLi9yZWdpc3RyaWVzL1BoeXNpY3NcIiksR2VuZXJpY1N5bmM9cmVxdWlyZShcImZhbW91cy9pbnB1dHMvR2VuZXJpY1N5bmNcIiksVG91Y2hTeW5jPXJlcXVpcmUoXCJmYW1vdXMvaW5wdXRzL1RvdWNoU3luY1wiKSxNb3VzZVN5bmM9cmVxdWlyZShcImZhbW91cy9pbnB1dHMvTW91c2VTeW5jXCIpLFNjcm9sbFN5bmM9cmVxdWlyZShcImZhbW91cy9pbnB1dHMvU2Nyb2xsU3luY1wiKSxTbGlkZT1yZXF1aXJlKFwiLi9zbGlkZXMvU2xpZGVcIiksQXJyb3dzPXJlcXVpcmUoXCIuL2NvbXBvbmVudHMvQXJyb3dzXCIpLERvdHM9cmVxdWlyZShcIi4vY29tcG9uZW50cy9Eb3RzXCIpLExheW91dENvbnRyb2xsZXI9cmVxdWlyZShcIi4vbGF5b3V0cy9MYXlvdXRDb250cm9sbGVyXCIpLExheW91dEZhY3Rvcnk9cmVxdWlyZShcIi4vbGF5b3V0cy9MYXlvdXRGYWN0b3J5XCIpO0dlbmVyaWNTeW5jLnJlZ2lzdGVyKHttb3VzZTpNb3VzZVN5bmMsdG91Y2g6VG91Y2hTeW5jLHNjcm9sbDpTY3JvbGxTeW5jfSksQ2Fyb3VzZWwucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUpLENhcm91c2VsLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1DYXJvdXNlbCxDYXJvdXNlbC5FVkVOVFM9e3NlbGVjdGlvbjpcInNlbGVjdGlvbkNoYW5nZVwiLGl0ZW1DbGljazpcIml0ZW1DbGlja1wifSxDYXJvdXNlbC5faGFuZGxlS2V5dXA9ZnVuY3Rpb24odCl7Mzc9PXQua2V5Q29kZT8odGhpcy5wcmV2aW91cygpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KSk6Mzk9PXQua2V5Q29kZSYmKHRoaXMubmV4dCgpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KSl9LENhcm91c2VsLnByb3RvdHlwZS5zZXRDb250ZW50TGF5b3V0PWZ1bmN0aW9uKHQpe2lmKCF0KXRocm93XCJObyBsYXlvdXQgZGVmaW5pdGlvbiBnaXZlbiFcIjtyZXR1cm4gdGhpcy5sYXlvdXREZWZpbml0aW9uPXQsdGhpcy5sYXlvdXRDb250cm9sbGVyLnNldExheW91dCh0aGlzLmxheW91dERlZmluaXRpb24pLHRoaXN9LENhcm91c2VsLnByb3RvdHlwZS5nZXRDb250ZW50TGF5b3V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubGF5b3V0RGVmaW5pdGlvbn0sQ2Fyb3VzZWwucHJvdG90eXBlLmdldFNlbGVjdGVkSW5kZXg9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGF0YS5pbmRleH0sQ2Fyb3VzZWwucHJvdG90eXBlLnNldFNlbGVjdGVkSW5kZXg9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdD09dGhpcy5fZGF0YS5pbmRleD90aGlzLl9kYXRhLmluZGV4Oih0aGlzLl9kYXRhLmluZGV4PXRoaXMuX2NsYW1wKHQpLHRoaXMuX2RhdGEucGFnaW5hdGVkSW5kZXg9dGhpcy5fY2xhbXAoTWF0aC5mbG9vcih0aGlzLl9kYXRhLmluZGV4L3RoaXMuX2RhdGEuaXRlbXNQZXJQYWdlKSksZT12b2lkIDA9PT1lPyEwOmUsdGhpcy5sYXlvdXRDb250cm9sbGVyLnNldEluZGV4KHRoaXMuX2RhdGEuaW5kZXgsZSksdGhpcy5kb3RzJiZ0aGlzLmRvdHMuc2V0SW5kZXgodGhpcy5fZGF0YS5wYWdpbmF0ZWRJbmRleCksdGhpcy5fZGF0YS5pbmRleCl9LENhcm91c2VsLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fZGF0YS5pbmRleCt0aGlzLl9kYXRhLml0ZW1zUGVyUGFnZTtyZXR1cm4gdGhpcy5zZXRTZWxlY3RlZEluZGV4KHQpfSxDYXJvdXNlbC5wcm90b3R5cGUucHJldmlvdXM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9kYXRhLmluZGV4LXRoaXMuX2RhdGEuaXRlbXNQZXJQYWdlO3JldHVybiB0aGlzLnNldFNlbGVjdGVkSW5kZXgodCl9LENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtcz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kYXRhLml0ZW1zfSxDYXJvdXNlbC5wcm90b3R5cGUuc2V0SXRlbXM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2RhdGEuaXRlbXM9dC5zbGljZSgwKSx0aGlzLl9kYXRhLmxlbmd0aD10aGlzLl9kYXRhLml0ZW1zLmxlbmd0aCx0aGlzLl9pbml0SXRlbXMoKSx0aGlzLmxheW91dENvbnRyb2xsZXIuc2V0SXRlbXModGhpcy5fZGF0YS5yZW5kZXJhYmxlcyksdGhpc30sQ2Fyb3VzZWwucHJvdG90eXBlLmdldFNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRQYXJlbnRTaXplKCl9LENhcm91c2VsLnByb3RvdHlwZS5zZXRTaXplPWZ1bmN0aW9uKCl7fSxDYXJvdXNlbC5wcm90b3R5cGUuX2luaXQ9ZnVuY3Rpb24oKXt0aGlzLnNldEl0ZW1zKHRoaXMub3B0aW9ucy5pdGVtcyksdGhpcy5zZXRTZWxlY3RlZEluZGV4KHRoaXMub3B0aW9ucy5zZWxlY3RlZEluZGV4LCExKSx0aGlzLl9pbml0Q29udGVudCgpLHRoaXMuX2V2ZW50cygpLFRpbWVyLmFmdGVyKGZ1bmN0aW9uKCl7dGhpcy5fcmVzaXplKCksdGhpcy5zZXRDb250ZW50TGF5b3V0KHRoaXMub3B0aW9ucy5jb250ZW50TGF5b3V0KX0uYmluZCh0aGlzKSwyKX0sQ2Fyb3VzZWwucHJvdG90eXBlLl9pbml0Q29udGVudD1mdW5jdGlvbigpe3RoaXMuX2V2ZW50Q29udGFpbmVyPW5ldyBTdXJmYWNlLHRoaXMuX2V2ZW50Q29udGFpbmVyLnBpcGUodGhpcyksdGhpcy5hZGQobmV3IE1vZGlmaWVyKHtvcGFjaXR5OjB9KSkuYWRkKHRoaXMuX2V2ZW50Q29udGFpbmVyKSx0aGlzLm9wdGlvbnMuYXJyb3dzRW5hYmxlZCYmKHRoaXMuYXJyb3dzPW5ldyBBcnJvd3Moe3Bvc2l0aW9uOnRoaXMub3B0aW9ucy5hcnJvd3NQb3NpdGlvbixwYWRkaW5nOnRoaXMub3B0aW9ucy5hcnJvd3NQYWRkaW5nLHByZXZpb3VzSWNvblVSTDp0aGlzLm9wdGlvbnMuYXJyb3dzUHJldmlvdXNJY29uVVJMLG5leHRJY29uVVJMOnRoaXMub3B0aW9ucy5hcnJvd3NOZXh0SWNvblVSTCxhbmltYXRlT25DbGljazp0aGlzLm9wdGlvbnMuYXJyb3dzQW5pbWF0ZU9uQ2xpY2ssdG9nZ2xlRGlzcGxheU9uSG92ZXI6dGhpcy5vcHRpb25zLmFycm93c1RvZ2dsZURpc3BsYXlPbkhvdmVyfSksdGhpcy5hZGQodGhpcy5hcnJvd3MpKSx0aGlzLm9wdGlvbnMuZG90c0VuYWJsZWQmJih0aGlzLmRvdHM9bmV3IERvdHMoe3Bvc2l0aW9uOnRoaXMub3B0aW9ucy5kb3RzUG9zaXRpb24scGFkZGluZzp0aGlzLm9wdGlvbnMuZG90c1BhZGRpbmcsc2l6ZTp0aGlzLm9wdGlvbnMuZG90c1NpemUsaG9yaXpvbnRhbFNwYWNpbmc6dGhpcy5vcHRpb25zLmRvdHNIb3Jpem9udGFsU3BhY2luZyxsZW5ndGg6TWF0aC5jZWlsKHRoaXMuX2RhdGEuaXRlbXMubGVuZ3RoL3RoaXMuX2RhdGEuaXRlbXNQZXJQYWdlKSxzZWxlY3RlZEluZGV4OnRoaXMub3B0aW9ucy5zZWxlY3RlZEluZGV4LGFycm93c1RvZ2dsZURpc3BsYXlPbkhvdmVyOnRoaXMub3B0aW9ucy5hcnJvd3NUb2dnbGVEaXNwbGF5T25Ib3Zlcn0pLHRoaXMuYWRkKHRoaXMuZG90cykpLHRoaXMuX3NpemVNb2RpZmllcj1uZXcgTW9kaWZpZXIoe3NpemU6dGhpcy5fZ2V0Q2Fyb3VzZWxTaXplKCksb3JpZ2luOlsuNSwuNV0sYWxpZ246Wy41LC41XX0pLHRoaXMuYWRkKHRoaXMuX3NpemVNb2RpZmllcikuYWRkKHRoaXMubGF5b3V0Q29udHJvbGxlcil9LENhcm91c2VsLnByb3RvdHlwZS5faW5pdEl0ZW1zPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PTA7dDx0aGlzLl9kYXRhLml0ZW1zLmxlbmd0aDt0Kyspe2lmKHRoaXMuX2RhdGEuaXRlbXNbdF0ucmVuZGVyKXRoaXMuX2RhdGEucmVuZGVyYWJsZXMucHVzaCh0aGlzLl9kYXRhLml0ZW1zW3RdKTtlbHNle3ZhciBlPW5ldyBTbGlkZSh0aGlzLl9kYXRhLml0ZW1zW3RdKTt0aGlzLl9kYXRhLnJlbmRlcmFibGVzLnB1c2goZSl9dGhpcy5fZGF0YS5yZW5kZXJhYmxlc1t0XS5waXBlKHRoaXMuc3luYyksdGhpcy5fZGF0YS5yZW5kZXJhYmxlc1t0XS5vbihcImNsaWNrXCIsdGhpcy5fYWRkVG9DbGlja1F1ZXVlLmJpbmQodGhpcyxDYXJvdXNlbC5FVkVOVFMuaXRlbUNsaWNrLHQpKX19LENhcm91c2VsLnByb3RvdHlwZS5fZXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5fZXZlbnRJbnB1dC5vbihcInBhcmVudFJlc2l6ZVwiLHRoaXMuX3Jlc2l6ZS5iaW5kKHRoaXMpKTt2YXIgdD1bXTt0aGlzLm9wdGlvbnMudG91Y2hFbmFibGVkJiZ0LnB1c2goXCJ0b3VjaFwiKSx0aGlzLm9wdGlvbnMubW91c2VFbmFibGVkJiZ0LnB1c2goXCJtb3VzZVwiKSx0aGlzLnN5bmMuYWRkU3luYyh0KSx0aGlzLl9ldmVudENvbnRhaW5lci5waXBlKHRoaXMuc3luYyk7dmFyIGU9bnVsbDt0aGlzLnN5bmMub24oXCJzdGFydFwiLGZ1bmN0aW9uKCl7ZT1uZXcgRGF0ZX0pLHRoaXMuc3luYy5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dGhpcy5jbGlja0xlbmd0aD1uZXcgRGF0ZS1lfS5iaW5kKHRoaXMpKSx0aGlzLm9wdGlvbnMua2V5Ym9hcmRFbmFibGVkJiYodGhpcy5faGFuZGxlS2V5dXA9Q2Fyb3VzZWwuX2hhbmRsZUtleXVwLmJpbmQodGhpcyksRW5naW5lLm9uKFwia2V5dXBcIix0aGlzLl9oYW5kbGVLZXl1cCkpLHRoaXMuYXJyb3dzJiYodGhpcy5hcnJvd3Mub24oXCJwcmV2aW91c1wiLGZ1bmN0aW9uKCl7dGhpcy5wcmV2aW91cygpLHRoaXMuX2V2ZW50T3V0cHV0LmVtaXQoQ2Fyb3VzZWwuRVZFTlRTLnNlbGVjdGlvbix0aGlzLl9kYXRhLmluZGV4KX0uYmluZCh0aGlzKSksdGhpcy5hcnJvd3Mub24oXCJuZXh0XCIsZnVuY3Rpb24oKXt0aGlzLm5leHQoKSx0aGlzLl9ldmVudE91dHB1dC5lbWl0KENhcm91c2VsLkVWRU5UUy5zZWxlY3Rpb24sdGhpcy5fZGF0YS5pbmRleCl9LmJpbmQodGhpcykpKSx0aGlzLm9wdGlvbnMuYXJyb3dzVG9nZ2xlRGlzcGxheU9uSG92ZXImJnRoaXMuYXJyb3dzJiYodGhpcy5fZXZlbnRJbnB1dC5vbihcIm1vdXNlb3ZlclwiLHRoaXMuYXJyb3dzLnNob3cuYmluZCh0aGlzLmFycm93cykpLHRoaXMuX2V2ZW50SW5wdXQub24oXCJtb3VzZW91dFwiLHRoaXMuYXJyb3dzLmhpZGUuYmluZCh0aGlzLmFycm93cykpKSx0aGlzLmRvdHMmJnRoaXMuZG90cy5vbihcInNldFwiLGZ1bmN0aW9uKHQpe3RoaXMuc2V0U2VsZWN0ZWRJbmRleCh0KnRoaXMuX2RhdGEuaXRlbXNQZXJQYWdlKSx0aGlzLl9ldmVudE91dHB1dC5lbWl0KENhcm91c2VsLkVWRU5UUy5zZWxlY3Rpb24sdGhpcy5fZGF0YS5pbmRleCl9LmJpbmQodGhpcykpLHRoaXMuZG90cyYmdGhpcy5hcnJvd3MmJih0aGlzLmRvdHMub24oXCJzaG93QXJyb3dzXCIsdGhpcy5hcnJvd3Muc2hvdy5iaW5kKHRoaXMuYXJyb3dzKSksdGhpcy5kb3RzLm9uKFwiaGlkZUFycm93c1wiLHRoaXMuYXJyb3dzLmhpZGUuYmluZCh0aGlzLmFycm93cykpKSx0aGlzLmxheW91dENvbnRyb2xsZXIub24oXCJwYWdpbmF0aW9uQ2hhbmdlXCIsdGhpcy5fc2V0SXRlbXNQZXJQYWdlLmJpbmQodGhpcykpLHRoaXMubGF5b3V0Q29udHJvbGxlci5vbihcInByZXZpb3VzXCIsZnVuY3Rpb24oKXt0aGlzLnByZXZpb3VzKCksdGhpcy5fZXZlbnRPdXRwdXQuZW1pdChDYXJvdXNlbC5FVkVOVFMuc2VsZWN0aW9uLHRoaXMuX2RhdGEuaW5kZXgpfS5iaW5kKHRoaXMpKSx0aGlzLmxheW91dENvbnRyb2xsZXIub24oXCJuZXh0XCIsZnVuY3Rpb24oKXt0aGlzLm5leHQoKSx0aGlzLl9ldmVudE91dHB1dC5lbWl0KENhcm91c2VsLkVWRU5UUy5zZWxlY3Rpb24sdGhpcy5fZGF0YS5pbmRleCl9LmJpbmQodGhpcykpLHRoaXMubGF5b3V0Q29udHJvbGxlci5vbihcInNldFwiLGZ1bmN0aW9uKHQpe3RoaXMuc2V0U2VsZWN0ZWRJbmRleCh0KSx0aGlzLl9ldmVudE91dHB1dC5lbWl0KENhcm91c2VsLkVWRU5UUy5zZWxlY3Rpb24sdGhpcy5fZGF0YS5pbmRleCl9LmJpbmQodGhpcykpfSxDYXJvdXNlbC5wcm90b3R5cGUuX2FkZFRvQ2xpY2tRdWV1ZT1mdW5jdGlvbih0LGUpe3RoaXMuY2xpY2tMZW5ndGg8MTUwJiZ0aGlzLl9ldmVudE91dHB1dC5lbWl0KHQsZSl9LENhcm91c2VsLnByb3RvdHlwZS5fc2V0SXRlbXNQZXJQYWdlPWZ1bmN0aW9uKHQpe3RoaXMuX2RhdGEuaXRlbXNQZXJQYWdlIT09dCYmKHRoaXMuX2RhdGEuaXRlbXNQZXJQYWdlPXQsdGhpcy5kb3RzJiZ0aGlzLmRvdHMuc2V0TGVuZ3RoKE1hdGguY2VpbCh0aGlzLl9kYXRhLml0ZW1zLmxlbmd0aC90KSx0LHRoaXMuX2RhdGEuaW5kZXgpKX0sQ2Fyb3VzZWwucHJvdG90eXBlLl9yZXNpemU9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9nZXRDYXJvdXNlbFNpemUoKTt0aGlzLmxheW91dENvbnRyb2xsZXIuc2V0U2l6ZSh0KSx0aGlzLl9zaXplTW9kaWZpZXIuc2V0U2l6ZSh0KX0sQ2Fyb3VzZWwucHJvdG90eXBlLl9nZXRDYXJvdXNlbFNpemU9ZnVuY3Rpb24oKXt2YXIgdD1bXSxlPXRoaXMuZ2V0U2l6ZSgpO3JldHVybiB0aGlzLl9pc1BsdWdpbj8odFswXT1lWzBdLXRoaXMub3B0aW9ucy5jb250ZW50UGFkZGluZ1swXSx0WzFdPWVbMV0tdGhpcy5vcHRpb25zLmNvbnRlbnRQYWRkaW5nWzFdKToodFswXT1cIm51bWJlclwiPT10eXBlb2YgdGhpcy5vcHRpb25zLmNhcm91c2VsU2l6ZVswXT90aGlzLm9wdGlvbnMuY2Fyb3VzZWxTaXplWzBdOnBhcnNlRmxvYXQodGhpcy5vcHRpb25zLmNhcm91c2VsU2l6ZVswXSkvMTAwKmVbMF0sdFsxXT1cIm51bWJlclwiPT10eXBlb2YgdGhpcy5vcHRpb25zLmNhcm91c2VsU2l6ZVsxXT90aGlzLm9wdGlvbnMuY2Fyb3VzZWxTaXplWzFdOnBhcnNlRmxvYXQodGhpcy5vcHRpb25zLmNhcm91c2VsU2l6ZVsxXSkvMTAwKmVbMV0pLHR9LENhcm91c2VsLnByb3RvdHlwZS5fY2xhbXA9ZnVuY3Rpb24odCxlKXtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgZSYmKGU9dGhpcy5vcHRpb25zLmxvb3ApLHQ+dGhpcy5fZGF0YS5sZW5ndGgtMT90PWU/MDp0aGlzLl9kYXRhLmxlbmd0aC0xOjA+dCYmKHQ9ZT90aGlzLl9kYXRhLmxlbmd0aC0xOjApLHR9LENhcm91c2VsLlNpbmd1bGFyU29mdFNjYWxlPUxheW91dEZhY3RvcnkuU2luZ3VsYXJTb2Z0U2NhbGUsQ2Fyb3VzZWwuU2luZ3VsYXJUd2lzdD1MYXlvdXRGYWN0b3J5LlNpbmd1bGFyVHdpc3QsQ2Fyb3VzZWwuU2luZ3VsYXJQYXJhbGxheD1MYXlvdXRGYWN0b3J5LlNpbmd1bGFyUGFyYWxsYXgsQ2Fyb3VzZWwuU2luZ3VsYXJTbGlkZUJlaGluZD1MYXlvdXRGYWN0b3J5LlNpbmd1bGFyU2xpZGVCZWhpbmQsQ2Fyb3VzZWwuU2luZ3VsYXJPcGFjaXR5PUxheW91dEZhY3RvcnkuU2luZ3VsYXJPcGFjaXR5LENhcm91c2VsLlNpbmd1bGFyU2xpZGVJbj1MYXlvdXRGYWN0b3J5LlNpbmd1bGFyU2xpZGVJbixDYXJvdXNlbC5TZXF1ZW50aWFsTGF5b3V0PUxheW91dEZhY3RvcnkuU2VxdWVudGlhbExheW91dCxDYXJvdXNlbC5HcmlkTGF5b3V0PUxheW91dEZhY3RvcnkuR3JpZExheW91dCxDYXJvdXNlbC5Db3ZlcmZsb3dMYXlvdXQ9TGF5b3V0RmFjdG9yeS5Db3ZlcmZsb3dMYXlvdXQsQ2Fyb3VzZWwuREVGQVVMVF9PUFRJT05TPXtjb250ZW50TGF5b3V0OkNhcm91c2VsLlNpbmd1bGFyU29mdFNjYWxlLGNhcm91c2VsU2l6ZTpbXCIxMDAlXCIsXCIxMDAlXCJdLGFycm93c0VuYWJsZWQ6ITAsYXJyb3dzUG9zaXRpb246XCJtaWRkbGVcIixhcnJvd3NQYWRkaW5nOlsxMCwwXSxhcnJvd3NQcmV2aW91c0ljb25VUkw6dm9pZCAwLGFycm93c05leHRJY29uVVJMOnZvaWQgMCxhcnJvd3NBbmltYXRlT25DbGljazohMCxhcnJvd3NUb2dnbGVEaXNwbGF5T25Ib3ZlcjohMCxkb3RzRW5hYmxlZDohMCxkb3RzUG9zaXRpb246XCJtaWRkbGVcIixkb3RzUGFkZGluZzpbMCwtMTBdLGRvdHNTaXplOlsxMCwxMF0sZG90c0hvcml6b250YWxTcGFjaW5nOjEwLGNvbnRlbnRQYWRkaW5nOlswLDBdLHNlbGVjdGVkSW5kZXg6MCxpdGVtczpbXSxsb29wOiEwLGtleWJvYXJkRW5hYmxlZDohMCxtb3VzZUVuYWJsZWQ6ITAsdG91Y2hFbmFibGVkOiEwfSxtb2R1bGUuZXhwb3J0cz1DYXJvdXNlbDsiLCJmdW5jdGlvbiBBcnJvd3MoKXtWaWV3LmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLl9zdG9yYWdlPXtwcmV2OntzdXJmYWNlOm51bGwscG9zaXRpb25Nb2Q6bnVsbCxhbmltYXRpb25Nb2Q6bnVsbCx0cmFuc1RyYW5zZm9ybTpudWxsLG9wYWNpdHlUcmFuczpudWxsfSxuZXh0OntzdXJmYWNlOm51bGwscG9zaXRpb25Nb2Q6bnVsbCxhbmltYXRpb25Nb2Q6bnVsbCx0cmFuc1RyYW5zZm9ybTpudWxsLG9wYWNpdHlUcmFuczpudWxsfX0sdGhpcy5fYXJyb3dzRGlzcGxheWVkPXRoaXMub3B0aW9ucy50b2dnbGVEaXNwbGF5T25Ib3Zlcj8hMTohMCx0aGlzLl9hbmltYXRpb25RdWV1ZT17c2hvd0NvdW50OjAsaGlkZUNvdW50OjB9LHRoaXMuX2luaXQoKX12YXIgVmlldz1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVmlld1wiKSxNb2RpZmllcj1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvTW9kaWZpZXJcIiksSW1hZ2VTdXJmYWNlPXJlcXVpcmUoXCJmYW1vdXMvc3VyZmFjZXMvSW1hZ2VTdXJmYWNlXCIpLFN1cmZhY2U9cmVxdWlyZShcImZhbW91cy9jb3JlL1N1cmZhY2VcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIiksVHJhbnNpdGlvbmFibGU9cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZVwiKSxUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlVHJhbnNmb3JtXCIpLFRpbWVyPXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1RpbWVyXCIpO0Fycm93cy5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSksQXJyb3dzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1BcnJvd3MsQXJyb3dzLkRFRkFVTFRfT1BUSU9OUz17cG9zaXRpb246XCJjZW50ZXJcIixwYWRkaW5nOlsxMCwwXSxwcmV2aW91c0ljb25VUkw6dm9pZCAwLG5leHRJY29uVVJMOnZvaWQgMCxhbmltYXRlT25DbGljazohMCx0b2dnbGVEaXNwbGF5T25Ib3ZlcjohMH0sQXJyb3dzLlBPU0lUSU9OX1RPX0FMSUdOPXtib3R0b206MSxtaWRkbGU6LjUsdG9wOjB9LEFycm93cy5BTklNQVRJT05fT1BUSU9OUz17Y2xpY2s6e29mZnNldDoxMCx0cmFuc2l0aW9uOntjdXJ2ZTpcIm91dEJhY2tcIixkdXJhdGlvbjoyNTB9fSxkaXNwbGF5OntjdXJ2ZTpcIm91dEV4cG9cIixkdXJhdGlvbjo2MDB9fSxBcnJvd3MucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt0aGlzLl9hcnJvd3NEaXNwbGF5ZWR8fCh0aGlzLl9hcnJvd3NEaXNwbGF5ZWQ9ITAsdGhpcy5fYW5pbWF0aW9uUXVldWUuc2hvd0NvdW50KyssdGhpcy5fcXVldWVBbmltYXRpb24oXCJzaG93XCIpKX0sQXJyb3dzLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKCl7dGhpcy5fYXJyb3dzRGlzcGxheWVkJiYodGhpcy5fYXJyb3dzRGlzcGxheWVkPSExLHRoaXMuX2FuaW1hdGlvblF1ZXVlLmhpZGVDb3VudCsrLHRoaXMuX3F1ZXVlQW5pbWF0aW9uKFwiaGlkZVwiKSl9LEFycm93cy5wcm90b3R5cGUuX2luaXQ9ZnVuY3Rpb24oKXt0aGlzLl9pbml0Q29udGVudCgpLHRoaXMuX2V2ZW50cyh0aGlzKX0sQXJyb3dzLnByb3RvdHlwZS5faW5pdENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgbz10aGlzLl9kZWZpbmVPcHRpb25zKHRoaXMub3B0aW9ucy5wb3NpdGlvbiksdD10aGlzLl9hcnJvd3NEaXNwbGF5ZWQ/MTowO2Zvcih2YXIgciBpbiBvKXt2YXIgaT10aGlzLl9zdG9yYWdlW3JdO2kucG9zaXRpb25Nb2Q9bmV3IE1vZGlmaWVyKHtvcmlnaW46Wy41LC41XSxhbGlnbjpbLjUsLjVdLHRyYW5zZm9ybTpUcmFuc2Zvcm0udHJhbnNsYXRlKG9bcl0udHJhbnNsYXRpb25bMF0sb1tyXS50cmFuc2xhdGlvblsxXSl9KSxpLnRyYW5zVHJhbnNmb3JtPW5ldyBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSxpLm9wYWNpdHlUcmFucz1uZXcgVHJhbnNpdGlvbmFibGUoMCksaS5hbmltYXRpb25Nb2Q9bmV3IE1vZGlmaWVyKHt0cmFuc2Zvcm06aS50cmFuc1RyYW5zZm9ybSxvcGFjaXR5Omkub3BhY2l0eVRyYW5zfSksaS5zdXJmYWNlPW5ldyBJbWFnZVN1cmZhY2Uoe2NsYXNzZXM6W1wiZmFtb3VzLWNhcm91c2VsLWFycm93XCIsb1tyXS5jbGFzc05hbWVdLGNvbnRlbnQ6b1tyXS5pY29uVVJMLHNpemU6WyEwLCEwXSxwcm9wZXJ0aWVzOm9bcl0ucHJvcGVydGllc30pLHRoaXMuYWRkKGkucG9zaXRpb25Nb2QpLmFkZChpLmFuaW1hdGlvbk1vZCkuYWRkKGkuc3VyZmFjZSksVGltZXIuYWZ0ZXIoZnVuY3Rpb24odCxyLGkpe3QucG9zaXRpb25Nb2Quc2V0T3JpZ2luKG9bcl0ucGxhY2VtZW50KSx0LnBvc2l0aW9uTW9kLnNldEFsaWduKG9bcl0ucGxhY2VtZW50KSx0Lm9wYWNpdHlUcmFucy5zZXQoaSl9LmJpbmQobnVsbCxpLHIsdCksMil9fSxBcnJvd3MucHJvdG90eXBlLl9kZWZpbmVPcHRpb25zPWZ1bmN0aW9uKG8pe3ZhciB0PXRoaXMub3B0aW9ucy5wYWRkaW5nLHI9MixpPTUsbj17Ym9yZGVyOnIrXCJweCBzb2xpZCAjNDA0MDQwXCIscGFkZGluZzppK1wicHhcIixib3JkZXJSYWRpdXM6XCI1MCVcIix6SW5kZXg6Mn0sZT17cHJldjp7Y2xhc3NOYW1lOlwiZmFtb3VzLWNhcm91c2VsLWFycm93LXByZXZpb3VzXCJ9LG5leHQ6e2NsYXNzTmFtZTpcImZhbW91cy1jYXJvdXNlbC1hcnJvdy1uZXh0XCJ9fSxzPS1yLXI7dm9pZCAwPT09dGhpcy5vcHRpb25zLnByZXZpb3VzSWNvblVSTD8oZS5wcmV2Lmljb25VUkw9XCIvaW1hZ2VzL2ljb25zL2Fycm93X2xlZnRfZGFyay5zdmdcIixlLnByZXYucHJvcGVydGllcz1uKTooZS5wcmV2Lmljb25VUkw9dGhpcy5vcHRpb25zLnByZXZpb3VzSWNvblVSTCxlLnByZXYucHJvcGVydGllcz17ekluZGV4OjJ9KSx2b2lkIDA9PT10aGlzLm9wdGlvbnMubmV4dEljb25VUkw/KGUubmV4dC5pY29uVVJMPVwiL2ltYWdlcy9pY29ucy9hcnJvd19yaWdodF9kYXJrLnN2Z1wiLGUubmV4dC5wcm9wZXJ0aWVzPW4sZS5uZXh0LmV4dHJhWFBhZGRpbmc9cyk6KGUubmV4dC5pY29uVVJMPXRoaXMub3B0aW9ucy5uZXh0SWNvblVSTCxlLm5leHQucHJvcGVydGllcz17ekluZGV4OjJ9LGUubmV4dC5leHRyYVhQYWRkaW5nPTApO3ZhciBhO3JldHVybiBhPVwidG9wXCI9PT1vPzA6XCJtaWRkbGVcIj09PW8/cy8yOnMsZS5wcmV2LnBsYWNlbWVudD1bMCxBcnJvd3MuUE9TSVRJT05fVE9fQUxJR05bb11dLGUucHJldi50cmFuc2xhdGlvbj1bdFswXSxhLXRbMV1dLGUubmV4dC5wbGFjZW1lbnQ9WzEsQXJyb3dzLlBPU0lUSU9OX1RPX0FMSUdOW29dXSxlLm5leHQudHJhbnNsYXRpb249W3MtdFswXSxhLXRbMV1dLGV9LEFycm93cy5wcm90b3R5cGUuX2V2ZW50cz1mdW5jdGlvbigpe3ZhciBvPXRoaXMuX3N0b3JhZ2UucHJldi5zdXJmYWNlLHQ9dGhpcy5fc3RvcmFnZS5uZXh0LnN1cmZhY2U7by5vbihcImNsaWNrXCIsdGhpcy5fb25QcmV2LmJpbmQodGhpcykpLHQub24oXCJjbGlja1wiLHRoaXMuX29uTmV4dC5iaW5kKHRoaXMpKSx0aGlzLm9wdGlvbnMudG9nZ2xlRGlzcGxheU9uSG92ZXImJihvLm9uKFwibW91c2VvdmVyXCIsdGhpcy5zaG93LmJpbmQodGhpcykpLHQub24oXCJtb3VzZW92ZXJcIix0aGlzLnNob3cuYmluZCh0aGlzKSksby5vbihcIm1vdXNlb3V0XCIsdGhpcy5oaWRlLmJpbmQodGhpcykpLHQub24oXCJtb3VzZW91dFwiLHRoaXMuaGlkZS5iaW5kKHRoaXMpKSl9LEFycm93cy5wcm90b3R5cGUuX29uUHJldj1mdW5jdGlvbigpe3RoaXMuX2V2ZW50T3V0cHV0LmVtaXQoXCJwcmV2aW91c1wiKSx0aGlzLl9hbmltYXRlQXJyb3codGhpcy5fc3RvcmFnZS5wcmV2LnRyYW5zVHJhbnNmb3JtLC0xKX0sQXJyb3dzLnByb3RvdHlwZS5fb25OZXh0PWZ1bmN0aW9uKCl7dGhpcy5fZXZlbnRPdXRwdXQuZW1pdChcIm5leHRcIiksdGhpcy5fYW5pbWF0ZUFycm93KHRoaXMuX3N0b3JhZ2UubmV4dC50cmFuc1RyYW5zZm9ybSwxKX0sQXJyb3dzLnByb3RvdHlwZS5fYW5pbWF0ZUFycm93PWZ1bmN0aW9uKG8sdCl7aWYodGhpcy5vcHRpb25zLmFuaW1hdGVPbkNsaWNrKXt2YXIgcj1BcnJvd3MuQU5JTUFUSU9OX09QVElPTlMuY2xpY2s7by5oYWx0KCksby5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShyLm9mZnNldCp0LDApLHtkdXJhdGlvbjoxfSxmdW5jdGlvbigpe28uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSxyLnRyYW5zaXRpb24pfSl9fSxBcnJvd3MucHJvdG90eXBlLl9xdWV1ZUFuaW1hdGlvbj1mdW5jdGlvbigpe3ZhciBvPXRoaXMuX2FuaW1hdGlvblF1ZXVlO1RpbWVyLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtmb3IoO28uc2hvd0NvdW50PjAmJm8uaGlkZUNvdW50PjA7KW8uc2hvd0NvdW50LS0sby5oaWRlQ291bnQtLTtvLnNob3dDb3VudD4wPyhvLnNob3dDb3VudC0tLHRoaXMuX3Nob3dPckhpZGUoXCJzaG93XCIpKTpvLmhpZGVDb3VudD4wJiYoby5oaWRlQ291bnQtLSx0aGlzLl9zaG93T3JIaWRlKFwiaGlkZVwiKSl9LmJpbmQodGhpcyksMjUpfSxBcnJvd3MucHJvdG90eXBlLl9zaG93T3JIaWRlPWZ1bmN0aW9uKG8pe3ZhciB0LHIsaSxuPUFycm93cy5BTklNQVRJT05fT1BUSU9OUy5kaXNwbGF5LGU9bi5kdXJhdGlvbixzPTEuMjtcInNob3dcIj09PW8/KHQ9MSxyPTEsaT0wKToodD0wLHI9LjAwMSxpPWUvMik7dmFyIGE9dGhpcy5fc3RvcmFnZS5wcmV2Lm9wYWNpdHlUcmFucyx1PXRoaXMuX3N0b3JhZ2UubmV4dC5vcGFjaXR5VHJhbnMscD10aGlzLl9zdG9yYWdlLnByZXYudHJhbnNUcmFuc2Zvcm0sYz10aGlzLl9zdG9yYWdlLm5leHQudHJhbnNUcmFuc2Zvcm07YS5oYWx0KCksdS5oYWx0KCkscC5oYWx0KCksYy5oYWx0KCksYS5kZWxheShpLGZ1bmN0aW9uKCl7YS5zZXQodCx7ZHVyYXRpb246ZS8yLGN1cnZlOlwib3V0QmFja1wifSksdS5zZXQodCx7ZHVyYXRpb246ZS8yLGN1cnZlOlwib3V0QmFja1wifSl9KSxwLnNldChUcmFuc2Zvcm0uc2NhbGUocyxzKSx7ZHVyYXRpb246MSplLzQsY3VydmU6bi5jdXJ2ZX0sZnVuY3Rpb24oKXtwLnNldChUcmFuc2Zvcm0uc2NhbGUocixyKSx7ZHVyYXRpb246MyplLzQsY3VydmU6bi5jdXJ2ZX0pfSksYy5zZXQoVHJhbnNmb3JtLnNjYWxlKHMscykse2R1cmF0aW9uOjEqZS80LGN1cnZlOm4uY3VydmV9LGZ1bmN0aW9uKCl7Yy5zZXQoVHJhbnNmb3JtLnNjYWxlKHIscikse2R1cmF0aW9uOjMqZS80LGN1cnZlOm4uY3VydmV9KX0pfSxtb2R1bGUuZXhwb3J0cz1BcnJvd3M7IiwiZnVuY3Rpb24gRG90cygpe1NpemVBd2FyZVZpZXcuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMuX2RhdGE9e2RvdHM6W10scGFyZW50U2l6ZTpbXSxkb3RDb3VudDp0aGlzLm9wdGlvbnMubGVuZ3RoLGxheW91dE1vZGVsOltdLHNlbGVjdGVkSW5kZXg6dGhpcy5vcHRpb25zLnNlbGVjdGVkSW5kZXh9LHRoaXMubGF5b3V0PW5ldyBTZXF1ZW50aWFsTGF5b3V0KHtkZWZhdWx0SXRlbVNpemU6dGhpcy5vcHRpb25zLnNpemV9KSx0aGlzLnBvc2l0aW9uTW9kPW5ldyBNb2RpZmllcix0aGlzLmFuaW1hdGlvbk1vZD1uZXcgTW9kaWZpZXIsdGhpcy5vcGFjaXR5VHJhbnM9bmV3IFRyYW5zaXRpb25hYmxlKDEpLHRoaXMudHJhbnNUcmFuc2Zvcm09bmV3IFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLHRoaXMuZGlzcGxheWVkPSEwLEV2ZW50SGVscGVycy53aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT10aGlzLmdldFBhcmVudFNpemUoKS5sZW5ndGh9LmJpbmQodGhpcyksdGhpcy5faW5pdC5iaW5kKHRoaXMpKX12YXIgU2l6ZUF3YXJlVmlldz1yZXF1aXJlKFwiLi4vY29uc3RydWN0b3JzL1NpemVBd2FyZVZpZXdcIiksU3VyZmFjZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvU3VyZmFjZVwiKSxNb2RpZmllcj1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvTW9kaWZpZXJcIiksUmVuZGVyTm9kZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvUmVuZGVyTm9kZVwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxUcmFuc2l0aW9uYWJsZT1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlXCIpLFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm1cIiksU2VxdWVudGlhbExheW91dD1yZXF1aXJlKFwiZmFtb3VzL3ZpZXdzL1NlcXVlbnRpYWxMYXlvdXRcIiksVGltZXI9cmVxdWlyZShcImZhbW91cy91dGlsaXRpZXMvVGltZXJcIiksRXZlbnRIZWxwZXJzPXJlcXVpcmUoXCIuLi9ldmVudHMvRXZlbnRIZWxwZXJzXCIpO0RvdHMucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUpLERvdHMucHJvdG90eXBlLmNvbnN0cnVjdG9yPURvdHMsRG90cy5ERUZBVUxUX09QVElPTlM9e3Bvc2l0aW9uOlwiY2VudGVyXCIscGFkZGluZzpbMCwtMTBdLHNpemU6WzEwLDEwXSxob3Jpem9udGFsU3BhY2luZzoxMCxsZW5ndGg6MSxzZWxlY3RlZEluZGV4OjB9LERvdHMuUE9TSVRJT05fVE9fQUxJR049e2xlZnQ6MCxtaWRkbGU6LjUscmlnaHQ6MX0sRG90cy5BTklNQVRJT05fT1BUSU9OUz17Y2xpY2s6e29mZnNldDotNyx0cmFuc2l0aW9uOntjdXJ2ZTpcIm91dEV4cG9cIixkdXJhdGlvbjoyNTB9fSxkaXNwbGF5OntzY2FsZVVwOjEuMTUsZHVyYXRpb246NjAwLGN1cnZlOlwib3V0RXhwb1wifX0sRG90cy5wcm90b3R5cGUuc2V0SW5kZXg9ZnVuY3Rpb24odCl7aWYodCE9PXRoaXMuX2RhdGEuc2VsZWN0ZWRJbmRleCYmISh0Pj10aGlzLl9kYXRhLmRvdHMubGVuZ3RofHwwPnQpKXt2YXIgZT10aGlzLl9kYXRhLnNlbGVjdGVkSW5kZXg7dGhpcy5fZGF0YS5kb3RzW2VdLnN1cmZhY2UucmVtb3ZlQ2xhc3MoXCJmYW1vdXMtY2Fyb3VzZWwtZG90LXNlbGVjdGVkXCIpLHRoaXMuX2RhdGEuZG90c1t0XS5zdXJmYWNlLmFkZENsYXNzKFwiZmFtb3VzLWNhcm91c2VsLWRvdC1zZWxlY3RlZFwiKSx0aGlzLl9kYXRhLnNlbGVjdGVkSW5kZXg9dH19LERvdHMucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24odCl7aWYoIXRoaXMuZGlzcGxheWVkKXt0aGlzLm9wYWNpdHlUcmFucy5oYWx0KCksdGhpcy50cmFuc1RyYW5zZm9ybS5oYWx0KCksdGhpcy5kaXNwbGF5ZWQ9ITA7dmFyIGU9RG90cy5BTklNQVRJT05fT1BUSU9OUy5kaXNwbGF5O3RoaXMub3BhY2l0eVRyYW5zLnNldCgxLHtkdXJhdGlvbjoxMDAsY3VydmU6XCJpbkV4cG9cIn0pLHRoaXMudHJhbnNUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSksdGhpcy50cmFuc1RyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnNjYWxlKGUuc2NhbGVVcCxlLnNjYWxlVXApLHtkdXJhdGlvbjoxKmUuZHVyYXRpb24vMyxjdXJ2ZTpcIm91dEV4cG9cIn0sZnVuY3Rpb24oKXt0aGlzLnRyYW5zVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uaWRlbnRpdHkse2R1cmF0aW9uOjIqZS5kdXJhdGlvbi8zLGN1cnZlOmUuY3VydmV9LHQpfS5iaW5kKHRoaXMpKX19LERvdHMucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24odCl7aWYodGhpcy5kaXNwbGF5ZWQpe3RoaXMub3BhY2l0eVRyYW5zLmhhbHQoKSx0aGlzLnRyYW5zVHJhbnNmb3JtLmhhbHQoKSx0aGlzLmRpc3BsYXllZD0hMTt2YXIgZT1Eb3RzLkFOSU1BVElPTl9PUFRJT05TLmRpc3BsYXk7dGhpcy5vcGFjaXR5VHJhbnMuc2V0KDEse2R1cmF0aW9uOmUuZHVyYXRpb24sY3VydmU6ZS5jdXJ2ZX0pLHRoaXMudHJhbnNUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5zY2FsZShlLnNjYWxlVXAsZS5zY2FsZVVwKSx7ZHVyYXRpb246LjI1KmUuZHVyYXRpb24sY3VydmU6XCJvdXRFeHBvXCJ9LGZ1bmN0aW9uKCl7dGhpcy50cmFuc1RyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnNjYWxlKDFlLTQsMWUtNCkse2R1cmF0aW9uOi43NSplLmR1cmF0aW9uLGN1cnZlOmUuY3VydmV9LHQpfS5iaW5kKHRoaXMpKX19LERvdHMucHJvdG90eXBlLnNldExlbmd0aD1mdW5jdGlvbih0LGUsaSl7dGhpcy5fZGF0YS5kb3RDb3VudD10LHRoaXMuX2RhdGEuc2VsZWN0ZWRJbmRleD1NYXRoLmZsb29yKHRoaXMuX2RhdGEuc2VsZWN0ZWRJbmRleC9lKSx0aGlzLmhpZGUoZnVuY3Rpb24oKXt0aGlzLl9pbml0KCksdGhpcy5zZXRJbmRleChpKSxUaW1lci5hZnRlcih0aGlzLnNob3cuYmluZCh0aGlzKSwxKX0uYmluZCh0aGlzKSl9LERvdHMucHJvdG90eXBlLl9pbml0PWZ1bmN0aW9uKCl7dGhpcy5fZGF0YS5wYXJlbnRTaXplPXRoaXMuZ2V0UGFyZW50U2l6ZSgpLHRoaXMuX2luaXRDb250ZW50KCksdGhpcy5fY3JlYXRlTGF5b3V0KCl9LERvdHMucHJvdG90eXBlLl9pbml0Q29udGVudD1mdW5jdGlvbigpe3RoaXMuX2RhdGEuZG90cz1bXTtmb3IodmFyIHQ9MDt0PHRoaXMuX2RhdGEuZG90Q291bnQ7dCsrKXRoaXMuX2RhdGEuZG90cy5wdXNoKHRoaXMuX2NyZWF0ZU5vZGUodCkpfSxEb3RzLnByb3RvdHlwZS5fY3JlYXRlTm9kZT1mdW5jdGlvbih0KXt2YXIgZT17fTtyZXR1cm4gZS5pbmRleD10LGUuc3VyZmFjZT1uZXcgU3VyZmFjZSh7Y2xhc3NlczpbXCJmYW1vdXMtY2Fyb3VzZWwtZG90XCJdLHNpemU6dGhpcy5vcHRpb25zLnNpemUscHJvcGVydGllczp7ekluZGV4OjJ9fSksdD09PXRoaXMuX2RhdGEuc2VsZWN0ZWRJbmRleCYmZS5zdXJmYWNlLmFkZENsYXNzKFwiZmFtb3VzLWNhcm91c2VsLWRvdC1zZWxlY3RlZFwiKSxlLnN1cmZhY2Uub24oXCJjbGlja1wiLHRoaXMuX2NoYW5nZUluZGV4LmJpbmQodGhpcyxlKSksdGhpcy5vcHRpb25zLnRvZ2dsZUFycm93c0Rpc3BsYXlPbkhvdmVyJiYoZS5zdXJmYWNlLm9uKFwibW91c2VvdmVyXCIsdGhpcy5fZXZlbnRPdXRwdXQuZW1pdC5iaW5kKHRoaXMuX2V2ZW50T3V0cHV0LFwic2hvd0Fycm93c1wiKSksZS5zdXJmYWNlLm9uKFwibW91c2VvdXRcIix0aGlzLl9ldmVudE91dHB1dC5lbWl0LmJpbmQodGhpcy5fZXZlbnRPdXRwdXQsXCJoaWRlQXJyb3dzXCIpKSksZS50cmFuc1RyYW5zZm9ybT1uZXcgVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm0sZS5tb2RpZmllcj1uZXcgTW9kaWZpZXIoe3RyYW5zZm9ybTplLnRyYW5zVHJhbnNmb3JtfSksZS5yZW5kZXJOb2RlPW5ldyBSZW5kZXJOb2RlLGUucmVuZGVyTm9kZS5hZGQoZS5tb2RpZmllcikuYWRkKGUuc3VyZmFjZSksZX0sRG90cy5wcm90b3R5cGUuX2NyZWF0ZUxheW91dD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX2NyZWF0ZUxheW91dE1vZGVsKCk7MT09PXQubGVuZ3RoPyh0aGlzLmxheW91dC5zZXRPcHRpb25zKHtkaXJlY3Rpb246MCxpdGVtU3BhY2luZzp0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbFNwYWNpbmd9KSx0aGlzLmxheW91dC5zZXF1ZW5jZUZyb20odFswXSkpOnRoaXMuX2NyZWF0ZU5lc3RlZExheW91dCgpLHRoaXMuX2FkZExheW91dCgpfSxEb3RzLnByb3RvdHlwZS5fY3JlYXRlTmVzdGVkTGF5b3V0PWZ1bmN0aW9uKCl7dmFyIHQ9W10sZT10aGlzLm9wdGlvbnMuaG9yaXpvbnRhbFNwYWNpbmc7dGhpcy5sYXlvdXQuc2V0T3B0aW9ucyh7ZGlyZWN0aW9uOjEsaXRlbVNwYWNpbmc6ZX0pLHRoaXMubGF5b3V0LnNlcXVlbmNlRnJvbSh0KTtmb3IodmFyIGkscz10aGlzLl9kYXRhLmxheW91dE1vZGVsLG89MDtvPHMubGVuZ3RoO28rKylpZihpPW5ldyBTZXF1ZW50aWFsTGF5b3V0KHtkaXJlY3Rpb246MCxpdGVtU3BhY2luZzplLGRlZmF1bHRJdGVtU2l6ZTp0aGlzLm9wdGlvbnMuc2l6ZX0pLGkuc2VxdWVuY2VGcm9tKHNbb10pLG89PT1zLmxlbmd0aC0xJiZzLmxlbmd0aD4xKXt2YXIgYT1uZXcgUmVuZGVyTm9kZTthLmFkZChuZXcgTW9kaWZpZXIoe29yaWdpbjpbRG90cy5QT1NJVElPTl9UT19BTElHTlt0aGlzLm9wdGlvbnMucG9zaXRpb25dLDBdfSkpLmFkZChpKSx0LnB1c2goYSl9ZWxzZSB0LnB1c2goaSl9LERvdHMucHJvdG90eXBlLl9hZGRMYXlvdXQ9ZnVuY3Rpb24oKXt2YXIgdD1Eb3RzLlBPU0lUSU9OX1RPX0FMSUdOW3RoaXMub3B0aW9ucy5wb3NpdGlvbl07dGhpcy5wb3NpdGlvbk1vZC5zZXRPcmlnaW4oW3QsMV0pLHRoaXMucG9zaXRpb25Nb2Quc2V0QWxpZ24oW3QsMV0pLHRoaXMucG9zaXRpb25Nb2Quc2V0VHJhbnNmb3JtKFRyYW5zZm9ybS50cmFuc2xhdGUodGhpcy5vcHRpb25zLnBhZGRpbmdbMF0sdGhpcy5vcHRpb25zLnBhZGRpbmdbMV0pKSx0aGlzLmFuaW1hdGlvbk1vZC5zZXRPcGFjaXR5KHRoaXMub3BhY2l0eVRyYW5zKSx0aGlzLmFuaW1hdGlvbk1vZC5zZXRUcmFuc2Zvcm0odGhpcy50cmFuc1RyYW5zZm9ybSksdGhpcy5hZGQodGhpcy5wb3NpdGlvbk1vZCkuYWRkKHRoaXMuYW5pbWF0aW9uTW9kKS5hZGQodGhpcy5sYXlvdXQpfSxEb3RzLnByb3RvdHlwZS5fY3JlYXRlTGF5b3V0TW9kZWw9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9kYXRhLnBhcmVudFNpemVbMF0sZT1bXTtlLnB1c2goW10pO2Zvcih2YXIgaT0wLHM9MCxvPXRoaXMub3B0aW9ucy5zaXplWzBdK3RoaXMub3B0aW9ucy5ob3Jpem9udGFsU3BhY2luZyxhPXRoaXMuX2RhdGEuZG90cyxuPTA7bjxhLmxlbmd0aDtuKyspcytvPnQmJihpKysscz0wLGUucHVzaChbXSkpLHMrPW8sZVtpXS5wdXNoKGFbbl0ucmVuZGVyTm9kZSk7cmV0dXJuIHRoaXMuX2RhdGEubGF5b3V0TW9kZWw9ZSxlfSxEb3RzLnByb3RvdHlwZS5fY2hhbmdlSW5kZXg9ZnVuY3Rpb24odCl7dGhpcy5fZXZlbnRPdXRwdXQuZW1pdChcInNldFwiLHQuaW5kZXgpLHRoaXMuX2FuaW1hdGVEb3QodC50cmFuc1RyYW5zZm9ybSl9LERvdHMucHJvdG90eXBlLl9hbmltYXRlRG90PWZ1bmN0aW9uKHQpe3ZhciBlPURvdHMuQU5JTUFUSU9OX09QVElPTlMuY2xpY2s7dC5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZSgwLGUub2Zmc2V0KSx7ZHVyYXRpb246MX0sZnVuY3Rpb24oKXt0LnNldChUcmFuc2Zvcm0uaWRlbnRpdHksZS50cmFuc2l0aW9uKX0pfSxtb2R1bGUuZXhwb3J0cz1Eb3RzOyIsImZ1bmN0aW9uIFNpemVBd2FyZVZpZXcoKXtWaWV3LmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLl9faWQ9RW50aXR5LnJlZ2lzdGVyKHRoaXMpLHRoaXMuX19wYXJlbnRTaXplPVtdfXZhciBWaWV3PXJlcXVpcmUoXCJmYW1vdXMvY29yZS9WaWV3XCIpLEVudGl0eT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvRW50aXR5XCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpO1NpemVBd2FyZVZpZXcucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpLFNpemVBd2FyZVZpZXcucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpemVBd2FyZVZpZXcsU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUuY29tbWl0PWZ1bmN0aW9uKGUpe3ZhciBpPWUudHJhbnNmb3JtLHQ9ZS5vcGFjaXR5LHI9ZS5vcmlnaW47cmV0dXJuIHRoaXMuX19wYXJlbnRTaXplJiZ0aGlzLl9fcGFyZW50U2l6ZVswXT09PWUuc2l6ZVswXSYmdGhpcy5fX3BhcmVudFNpemVbMV09PT1lLnNpemVbMV18fCh0aGlzLl9fcGFyZW50U2l6ZVswXT1lLnNpemVbMF0sdGhpcy5fX3BhcmVudFNpemVbMV09ZS5zaXplWzFdLHRoaXMuX2V2ZW50SW5wdXQuZW1pdChcInBhcmVudFJlc2l6ZVwiLHRoaXMuX19wYXJlbnRTaXplKSksdGhpcy5fX3BhcmVudFNpemUmJihpPVRyYW5zZm9ybS5tb3ZlVGhlbihbLXRoaXMuX19wYXJlbnRTaXplWzBdKnJbMF0sLXRoaXMuX19wYXJlbnRTaXplWzFdKnJbMV0sMF0saSkpLHt0cmFuc2Zvcm06aSxvcGFjaXR5OnQsc2l6ZTp0aGlzLl9fcGFyZW50U2l6ZSx0YXJnZXQ6dGhpcy5fbm9kZS5yZW5kZXIoKX19LFNpemVBd2FyZVZpZXcucHJvdG90eXBlLmdldFBhcmVudFNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fX3BhcmVudFNpemV9LFNpemVBd2FyZVZpZXcucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9faWR9LG1vZHVsZS5leHBvcnRzPVNpemVBd2FyZVZpZXc7IiwiZnVuY3Rpb24gbm9kZUNoaWxkcmVuVG9BcnJheShlKXtyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZS5jaGlsZHJlbj9lLmNoaWxkcmVuOmUuY2hpbGROb2Rlcyl9ZnVuY3Rpb24gcmVtb3ZlSXRlbXNGcm9tRG9tKGUpe2Zvcih2YXIgcj1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7ZS5maXJzdEVsZW1lbnRDaGlsZDspci5hcHBlbmRDaGlsZChlLnJlbW92ZUNoaWxkKGUuZmlyc3RFbGVtZW50Q2hpbGQpKTtyZXR1cm4gcn1tb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihlKXt2YXIgcj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGUpO2lmKCFyKXRocm93XCJubyBpdGVtcyBmb3VuZCFcIjt2YXIgbz1yZW1vdmVJdGVtc0Zyb21Eb20ocik7cmV0dXJuIG5vZGVDaGlsZHJlblRvQXJyYXkobyl9OyIsIm1vZHVsZS5leHBvcnRzPS0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKXx8bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIlRyaWRlbnQvXCIpPjA7IiwiZnVuY3Rpb24gd2hlbihlLHIsbil7bnx8KG49MSksZSBpbnN0YW5jZW9mIEFycmF5fHwoZT1bZV0pO3ZhciBpPVRpbWVyLmV2ZXJ5KGZ1bmN0aW9uKCl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspaWYoIWVbbl0oKSlyZXR1cm47cigpLFRpbWVyLmNsZWFyKGkpfSxuKX1mdW5jdGlvbiBkdWFsUGlwZShlLHIpe2UucGlwZShyKSxyLnBpcGUoZSl9ZnVuY3Rpb24gY2xlYXIoZSl7RW5naW5lLnJlbW92ZUxpc3RlbmVyKFwicHJlcmVuZGVyXCIsZSl9ZnVuY3Rpb24gZnJhbWVRdWV1ZShlLHIpe3ZhciBuPXIsaT1mdW5jdGlvbigpe3ItLSwwPj1yJiYoZSgpLGNsZWFyKGkpKX07cmV0dXJuIEVuZ2luZS5vbihcInByZXJlbmRlclwiLGkpLGZ1bmN0aW9uKCl7cj1ufX12YXIgVGltZXI9cmVxdWlyZShcImZhbW91cy91dGlsaXRpZXMvVGltZXJcIiksRW5naW5lPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9FbmdpbmVcIik7bW9kdWxlLmV4cG9ydHM9e3doZW46d2hlbixkdWFsUGlwZTpkdWFsUGlwZSxmcmFtZVF1ZXVlOmZyYW1lUXVldWV9OyIsImZ1bmN0aW9uIGV4dGVuZChlLHQpe2Zvcih2YXIgciBpbiB0KWVbcl09dFtyXX1mdW5jdGlvbiBpbmhlcml0cyhlLHQpe2UucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodC5wcm90b3R5cGUpLGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWV9ZnVuY3Rpb24gbWVyZ2UoZSx0KXt2YXIgcj17fTtyZXR1cm4gZXh0ZW5kKHIsZSksZXh0ZW5kKHIsdCkscn1tb2R1bGUuZXhwb3J0cz17ZXh0ZW5kOmV4dGVuZCxpbmhlcml0czppbmhlcml0cyxtZXJnZTptZXJnZX07IiwiZnVuY3Rpb24gQ292ZXJmbG93TGF5b3V0KHQpe0xheW91dC5jYWxsKHRoaXMsdCksdGhpcy5fdG91Y2hPZmZzZXQ9MCx0aGlzLl9vZmZzZXRUPTAsdGhpcy5ib3VuZFRvdWNoU3RhcnQ9dGhpcy5fb25TeW5jU3RhcnQuYmluZCh0aGlzKSx0aGlzLmJvdW5kVG91Y2hVcGRhdGU9dGhpcy5fb25TeW5jVXBkYXRlLmJpbmQodGhpcyksdGhpcy5ib3VuZFRvdWNoRW5kPXRoaXMuX29uU3luY0VuZC5iaW5kKHRoaXMpLHRoaXMuc3RlcH12YXIgTGF5b3V0PXJlcXVpcmUoXCIuL0xheW91dFwiKSxPYmplY3RIZWxwZXJzPXJlcXVpcmUoXCIuLi9oZWxwZXJzL09iamVjdEhlbHBlcnNcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIiksVHJhbnNpdGlvbmFibGU9cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZVwiKSxJc0lFPXJlcXVpcmUoXCIuLi9kb20vSUVcIik7Q292ZXJmbG93TGF5b3V0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKExheW91dC5wcm90b3R5cGUpLENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuY29uc3RydWN0b3I9Q292ZXJmbG93TGF5b3V0LENvdmVyZmxvd0xheW91dC5pZD1cIkNvdmVyZmxvd0xheW91dFwiLENvdmVyZmxvd0xheW91dC5ERUZBVUxUX09QVElPTlM9e3RyYW5zaXRpb246e2N1cnZlOlwib3V0RXhwb1wiLGR1cmF0aW9uOjFlM30scmFkaXVzUGVyY2VudDouNSxkaW1lbnNpb24xOlwieFwiLGRpbWVuc2lvbjI6XCJ6XCJ9O3ZhciBESVJFQ1RJT049e3g6MCx5OjEsejoyfSxVTlVTRURfRElSRUNUSU9OPXsxOlwielwiLDI6XCJ5XCIsMzpcInhcIn07Q292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuX2JpbmRTeW5jRXZlbnRzKCksdGhpcy5yZXNldENoaWxkUHJvcGVydGllcygpLHRoaXMubGF5b3V0KCl9LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuX2dldFJhZGl1cz1mdW5jdGlvbih0KXtyZXR1cm4gdHx8KHQ9dGhpcy5jb250cm9sbGVyLmdldFNpemUoKVswXSksdCp0aGlzLm9wdGlvbnMucmFkaXVzUGVyY2VudH0sQ292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5sYXlvdXQ9ZnVuY3Rpb24odCl7dmFyIG89dGhpcy5jb250cm9sbGVyLmdldFNpemUoKSxlPXRoaXMuY29udHJvbGxlci5pdGVtc1t0aGlzLmNvbnRyb2xsZXIuaW5kZXhdLmdldFNpemUoKSxpPXRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGg7dGhpcy5zdGVwPTIqTWF0aC5QSS9pO3ZhciByPXRoaXMuX2dldFBhcmFtZXRyaWNDaXJjbGUoe3gxOi41Km9bMF0seTE6b1swXSotLjUscmFkaXVzOnRoaXMuX2dldFJhZGl1cyhvWzBdKX0pLG49Wy41KihvWzBdLWVbMF0pLC41KihvWzFdLWVbMV0pLDBdLHM9W107aWYoc1swXT1cInhcIj09PXRoaXMub3B0aW9ucy5kaW1lbnNpb24xfHxcInhcIj09PXRoaXMub3B0aW9ucy5kaW1lbnNpb24yPzA6blswXSxzWzFdPVwieVwiPT09dGhpcy5vcHRpb25zLmRpbWVuc2lvbjF8fFwieVwiPT09dGhpcy5vcHRpb25zLmRpbWVuc2lvbjI/MDpuWzFdLHNbMl09MCxJc0lFKXZhciBhPVtdO2Zvcih2YXIgaD0wO2k+aDtoKyspe3ZhciBsPXRoaXMuY29udHJvbGxlci5fc2FuaXRpemVJbmRleCh0aGlzLmNvbnRyb2xsZXIuaW5kZXgraCksYz10aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1tsXSx1PSh0aGlzLmRhdGEub3BhY2l0aWVzW2xdLHIodGhpcy5zdGVwKmgrLjUqTWF0aC5QSSt0aGlzLl90b3VjaE9mZnNldCkpLGQ9cy5zbGljZSgpO2RbRElSRUNUSU9OW3RoaXMub3B0aW9ucy5kaW1lbnNpb24xXV0rPW9bMF0tdVswXS0uNSplWzBdLGRbRElSRUNUSU9OW3RoaXMub3B0aW9ucy5kaW1lbnNpb24yXV0rPXVbMV0sSXNJRSYmYS5wdXNoKGRbMl0pLHQ/Yy5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShkWzBdLGRbMV0sZFsyXSkpOmMuc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoZFswXSxkWzFdLGRbMl0pLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKX1Jc0lFJiYhdCYmdGhpcy5mb3JjZVpJbmRleChhKSxjLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKGRbMF0sZFsxXSxkWzJdKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbik7dmFyIHA9dGhpcy5vcHRpb25zLnRyYW5zaXRpb24uZHVyYXRpb258fHRoaXMub3B0aW9ucy50cmFuc2l0aW9uLnBlcmlvZDtwKj0uNTtmb3IodmFyIGY9dD92b2lkIDA6e2N1cnZlOlwibGluZWFyXCIsZHVyYXRpb246cH0saD0wO2g8dGhpcy5jb250cm9sbGVyLnJlbmRlckxpbWl0WzBdO2grKyl7dmFyIHk9dGhpcy5kYXRhLm9wYWNpdGllc1t0aGlzLmNvbnRyb2xsZXIuX3Nhbml0aXplSW5kZXgodGhpcy5jb250cm9sbGVyLmluZGV4KzEraCldO3kmJih5LmhhbHQoKSx5LnNldCgxLWgvdGhpcy5jb250cm9sbGVyLnJlbmRlckxpbWl0WzBdLGYpKX1mb3IodmFyIGg9MDtoPHRoaXMuY29udHJvbGxlci5yZW5kZXJMaW1pdFsxXTtoKyspe3ZhciB5PXRoaXMuZGF0YS5vcGFjaXRpZXNbdGhpcy5jb250cm9sbGVyLl9zYW5pdGl6ZUluZGV4KHRoaXMuY29udHJvbGxlci5pbmRleC0xLWgpXTt5JiYoeS5oYWx0KCkseS5zZXQoMS1oL3RoaXMuY29udHJvbGxlci5yZW5kZXJMaW1pdFsxXSxmKSl9dGhpcy5kYXRhLm9wYWNpdGllc1t0aGlzLmNvbnRyb2xsZXIuaW5kZXhdLmhhbHQoKSx0aGlzLmRhdGEub3BhY2l0aWVzW3RoaXMuY29udHJvbGxlci5pbmRleF0uc2V0KDEsZil9LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuZGVhY3RpdmF0ZT1mdW5jdGlvbigpe2lmKHRoaXMuY29udHJvbGxlci5pc0xhc3RMYXlvdXRTaW5ndWxhcj0hMSxJc0lFKWZvcih2YXIgdD0wO3Q8dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDt0KyspdGhpcy5jb250cm9sbGVyLml0ZW1zW3RdLnNldFByb3BlcnRpZXMoe3pJbmRleDpcIlwifSk7dGhpcy5fdW5iaW5kU3luY0V2ZW50cygpfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLmdldFJlbmRlckxpbWl0PWZ1bmN0aW9uKCl7cmV0dXJuW01hdGgubWluKDEwLE1hdGguY2VpbCguNSp0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoKSksTWF0aC5taW4oMTAsTWF0aC5jZWlsKC41KnRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGgpKV19LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuZm9yY2VaSW5kZXg9ZnVuY3Rpb24odCl7Zm9yKHZhciBvPTA7bzx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoO28rKyl7dmFyIGU9dGhpcy5jb250cm9sbGVyLl9zYW5pdGl6ZUluZGV4KHRoaXMuY29udHJvbGxlci5pbmRleCtvKTt0aGlzLmNvbnRyb2xsZXIuaXRlbXNbZV0uc2V0UHJvcGVydGllcyh7ekluZGV4Ok1hdGgucm91bmQodFtvXSl9KX19LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuX2JpbmRTeW5jRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJzdGFydFwiLHRoaXMuYm91bmRUb3VjaFN0YXJ0KSx0aGlzLmNvbnRyb2xsZXIuc3luYy5vbihcInVwZGF0ZVwiLHRoaXMuYm91bmRUb3VjaFVwZGF0ZSksdGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJlbmRcIix0aGlzLmJvdW5kVG91Y2hFbmQpfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLl91bmJpbmRTeW5jRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLnN5bmMucmVtb3ZlTGlzdGVuZXIoXCJzdGFydFwiLHRoaXMuYm91bmRUb3VjaFN0YXJ0KSx0aGlzLmNvbnRyb2xsZXIuc3luYy5yZW1vdmVMaXN0ZW5lcihcInVwZGF0ZVwiLHRoaXMuYm91bmRUb3VjaFVwZGF0ZSksdGhpcy5jb250cm9sbGVyLnN5bmMucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIix0aGlzLmJvdW5kVG91Y2hFbmQpfSxDb3ZlcmZsb3dMYXlvdXQucHJvdG90eXBlLl9vblN5bmNTdGFydD1mdW5jdGlvbih0KXt0aGlzLl9vZmZzZXRUPU1hdGguYWNvcyh0LnBvc2l0aW9uWzBdL3RoaXMuX2dldFJhZGl1cygpKX0sQ292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5fb25TeW5jVXBkYXRlPWZ1bmN0aW9uKHQpe2Zvcih2YXIgbz10LnBvc2l0aW9uWzBdL3RoaXMuX2dldFJhZGl1cygpO28+MTspby09Mjtmb3IoOy0xPm87KW8rPTI7dmFyIGU9TWF0aC5hY29zKG8pO3RoaXMuX3RvdWNoT2Zmc2V0PXRoaXMuX29mZnNldFQtZSx0aGlzLmxheW91dCghMCl9LENvdmVyZmxvd0xheW91dC5wcm90b3R5cGUuX29uU3luY0VuZD1mdW5jdGlvbih0KXt2YXIgbz0uMSp0LnZlbG9jaXR5WzBdLGU9TWF0aC5yb3VuZCgoLXRoaXMuX3RvdWNoT2Zmc2V0LW8pL3RoaXMuc3RlcCk7dGhpcy5fdG91Y2hPZmZzZXQ9MCx0aGlzLmNvbnRyb2xsZXIuX2V2ZW50T3V0cHV0LmVtaXQoXCJzZXRcIix0aGlzLmNvbnRyb2xsZXIuX3Nhbml0aXplSW5kZXgodGhpcy5jb250cm9sbGVyLmluZGV4K2UpKX0sQ292ZXJmbG93TGF5b3V0LnByb3RvdHlwZS5fZ2V0UGFyYW1ldHJpY0NpcmNsZT1mdW5jdGlvbih0KXt2YXIgbz17eDE6MCx5MTowLHJhZGl1czoyMH07cmV0dXJuIE9iamVjdEhlbHBlcnMuZXh0ZW5kKG8sdCksZnVuY3Rpb24odCl7cmV0dXJuW28ueDErby5yYWRpdXMqTWF0aC5jb3ModCksby55MStvLnJhZGl1cypNYXRoLnNpbih0KV19fSxtb2R1bGUuZXhwb3J0cz1Db3ZlcmZsb3dMYXlvdXQ7IiwiZnVuY3Rpb24gR3JpZExheW91dCh0KXtMYXlvdXQuY2FsbCh0aGlzLHQpfXZhciBMYXlvdXQ9cmVxdWlyZShcIi4vTGF5b3V0XCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLEVhc2luZz1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL0Vhc2luZ1wiKTtHcmlkTGF5b3V0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKExheW91dC5wcm90b3R5cGUpLEdyaWRMYXlvdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yPUdyaWRMYXlvdXQsR3JpZExheW91dC5pZD1cIkdyaWRMYXlvdXRcIixHcmlkTGF5b3V0LkRFRkFVTFRfT1BUSU9OUz17Z3JpZERpbWVuc2lvbnM6WzMsM10scGFkZGluZzpbMTUsMTVdLHNlbGVjdGVkSXRlbVRyYW5zaXRpb246e21ldGhvZDpcInNwcmluZ1wiLGRhbXBpbmdSYXRpbzouNjUscGVyaW9kOjYwMH0sdHJhbnNpdGlvbjp7Y3VydmU6XCJvdXRFeHBvXCIsZHVyYXRpb246ODAwfSxkZWxheUxlbmd0aDo2MDB9LEdyaWRMYXlvdXQucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLl9ldmVudE91dHB1dC5lbWl0KFwicGFnaW5hdGlvbkNoYW5nZVwiLHRoaXMub3B0aW9ucy5ncmlkRGltZW5zaW9uc1swXSp0aGlzLm9wdGlvbnMuZ3JpZERpbWVuc2lvbnNbMV0pLHRoaXMucmVzZXRDaGlsZFByb3BlcnRpZXMoKTt2YXIgdD10aGlzLm9wdGlvbnMuZ3JpZERpbWVuc2lvbnNbMF0qdGhpcy5vcHRpb25zLmdyaWREaW1lbnNpb25zWzFdLG89TWF0aC5jZWlsKHRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGgvdCksaT1NYXRoLmZsb29yKHRoaXMuY29udHJvbGxlci5pbmRleC90KSxlPWkqdCxuPWk9PT1vLTE/ZSsodGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aC1pKnQpLTE6ZSt0LTE7dGhpcy5fZGVsYXlUcmFuc2l0aW9ucyhlLG4pLHRoaXMuX2FuaW1hdGVJdGVtcyhlLG4pLHRoaXMuX2hhbmRsZVRvdWNoRXZlbnRzKCl9LEdyaWRMYXlvdXQucHJvdG90eXBlLmxheW91dD1mdW5jdGlvbigpe2Zvcih2YXIgdCxvPXRoaXMuX2dldFRyYW5zZm9ybXMoKSxpPTA7aTx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoO2krKyl0PXRoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW2ldLHQuc2V0KG9baV0udHJhbnNmb3JtLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSx0aGlzLmRhdGEub3BhY2l0aWVzW2ldLmhhbHQoKSx0aGlzLmRhdGEub3BhY2l0aWVzW2ldLnNldCgxLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKX0sR3JpZExheW91dC5wcm90b3R5cGUuZGVhY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5pc0xhc3RMYXlvdXRTaW5ndWxhcj0hMSx0aGlzLmNvbnRyb2xsZXIuX2V2ZW50T3V0cHV0LmVtaXQoXCJwYWdpbmF0aW9uQ2hhbmdlXCIsdGhpcy5jb250cm9sbGVyLml0ZW1zUGVyUGFnZSksdGhpcy5fcmVtb3ZlVG91Y2hFdmVudHMoKX0sR3JpZExheW91dC5wcm90b3R5cGUuZ2V0UmVuZGVyTGltaXQ9ZnVuY3Rpb24oKXtyZXR1cm5bMCx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoXX0sR3JpZExheW91dC5wcm90b3R5cGUuX2hhbmRsZVRvdWNoRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5ib3VuZFRvdWNoVXBkYXRlPWZ1bmN0aW9uKHQpe3ZhciBvPXRoaXMuZGF0YS50b3VjaE9mZnNldCxpPW8uZ2V0KCk7aVswXSs9dC5kZWx0YVswXSxvLnNldChbaVswXSxpWzFdXSl9LmJpbmQodGhpcyksdGhpcy5ib3VuZFRvdWNoRW5kPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PXRoaXMuZGF0YS50b3VjaE9mZnNldCxvPXQuZ2V0KCksaT1vWzBdLGU9dGhpcy5jb250cm9sbGVyLmdldFNpemUoKVswXSxuPTA7bjx0aGlzLmNvbnRyb2xsZXIuaXRlbXMubGVuZ3RoO24rKyl7dmFyIHM9dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbbl0scj1zLnRyYW5zbGF0ZS5nZXQoKTtzLnNldFRyYW5zbGF0ZShbclswXStvWzBdLHJbMV1dKX10LnNldChbMCwwXSksLTEqZS81Pmk/dGhpcy5jb250cm9sbGVyLl9ldmVudE91dHB1dC5lbWl0KFwibmV4dFwiKTppPjEqZS81P3RoaXMuY29udHJvbGxlci5fZXZlbnRPdXRwdXQuZW1pdChcInByZXZpb3VzXCIpOnRoaXMubGF5b3V0KCl9LmJpbmQodGhpcyksdGhpcy5fYWRkVG91Y2hFdmVudHMoKX0sR3JpZExheW91dC5wcm90b3R5cGUuX2FkZFRvdWNoRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJ1cGRhdGVcIix0aGlzLmJvdW5kVG91Y2hVcGRhdGUpLHRoaXMuY29udHJvbGxlci5zeW5jLm9uKFwiZW5kXCIsdGhpcy5ib3VuZFRvdWNoRW5kKX0sR3JpZExheW91dC5wcm90b3R5cGUuX3JlbW92ZVRvdWNoRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLnN5bmMucmVtb3ZlTGlzdGVuZXIoXCJ1cGRhdGVcIix0aGlzLmJvdW5kVG91Y2hVcGRhdGUpLHRoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsdGhpcy5ib3VuZFRvdWNoRW5kKX0sR3JpZExheW91dC5wcm90b3R5cGUuX2RlbGF5VHJhbnNpdGlvbnM9ZnVuY3Rpb24odCxvKXtmb3IodmFyIGksZT10aGlzLmNvbnRyb2xsZXIuaW5kZXgsbj10aGlzLmNvbnRyb2xsZXIuaW5kZXgtMTx0P3ZvaWQgMDp0aGlzLmNvbnRyb2xsZXIuaW5kZXgtMSxzPTAscj1vLXQrMTtyPnM7KXt2YXIgYT1zLyhyLTEpLGg9RWFzaW5nLmluT3V0U2luZShhKTtpPWgqdGhpcy5vcHRpb25zLmRlbGF5TGVuZ3RoKzEsdm9pZCAwIT09ZSYmKHRoaXMuX3NldEl0ZW1EZWxheShlLGkpLGU9ZSsxPm8/dm9pZCAwOmUrMSxzKyspLHZvaWQgMCE9PW4mJih0aGlzLl9zZXRJdGVtRGVsYXkobixpKSxuPXQ+bi0xP3ZvaWQgMDpuLTEscysrKX19LEdyaWRMYXlvdXQucHJvdG90eXBlLl9zZXRJdGVtRGVsYXk9ZnVuY3Rpb24odCxvKXt0cmFucz10aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1t0XSx0cmFucy5yb3RhdGUuZGVsYXkobyksdHJhbnMuc2NhbGUuZGVsYXkobyksdHJhbnMudHJhbnNsYXRlLmRlbGF5KG8pLHRoaXMuZGF0YS5vcGFjaXRpZXNbdF0uZGVsYXkobyl9LEdyaWRMYXlvdXQucHJvdG90eXBlLl9hbmltYXRlSXRlbXM9ZnVuY3Rpb24odCxvKXtmb3IodmFyIGk9ZnVuY3Rpb24oaSl7cmV0dXJuIGk+PXQmJm8+PWl9LGU9dGhpcy5fZ2V0VHJhbnNmb3JtcygpLG49MDtuPHRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGg7bisrKXtpZihpKG4pKWlmKG49PT10aGlzLmNvbnRyb2xsZXIuaW5kZXgpe3ZhciBzPXRoaXMub3B0aW9ucy5zZWxlY3RlZEl0ZW1UcmFuc2l0aW9uLm1ldGhvZHx8XCJzcHJpbmdcIixyPXRoaXMub3B0aW9ucy5zZWxlY3RlZEl0ZW1UcmFuc2l0aW9uLmRhbXBpbmdSYXRpb3x8LjY1LGE9dGhpcy5vcHRpb25zLnNlbGVjdGVkSXRlbVRyYW5zaXRpb24ucGVyaW9kfHw2MDA7dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbbl0uc2V0KGVbbl0udHJhbnNmb3JtLHttZXRob2Q6cyxkYW1waW5nUmF0aW86cixwZXJpb2Q6YX0pfWVsc2UgdGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbbl0uc2V0KGVbbl0udHJhbnNmb3JtLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKTtlbHNlIHRoaXMuY29udHJvbGxlci5pc0xhc3RMYXlvdXRTaW5ndWxhcnx8bnVsbD09PXRoaXMuY29udHJvbGxlci5pc0xhc3RMYXlvdXRTaW5ndWxhcj90aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1tuXS5zZXQoZVtuXS50cmFuc2Zvcm0pOnRoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW25dLnNldChlW25dLnRyYW5zZm9ybSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbik7dGhpcy5kYXRhLm9wYWNpdGllc1tuXS5zZXQoMSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbil9fSxHcmlkTGF5b3V0LnByb3RvdHlwZS5fZ2V0VHJhbnNmb3Jtcz1mdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLl9nZXRHcmlkUG9zaXRpb25zKHRoaXMuY29udHJvbGxlci5nZXRTaXplKCkuc2xpY2UoMCksdGhpcy5vcHRpb25zLnBhZGRpbmcsdGhpcy5vcHRpb25zLmdyaWREaW1lbnNpb25zKSxvPXQuY2VsbFNpemUsaT10aGlzLmNvbnRyb2xsZXIuZ2V0U2l6ZSgpLnNsaWNlKDApLGU9dGhpcy5vcHRpb25zLmdyaWREaW1lbnNpb25zWzBdKnRoaXMub3B0aW9ucy5ncmlkRGltZW5zaW9uc1sxXSxuPU1hdGguZmxvb3IodGhpcy5jb250cm9sbGVyLmluZGV4L2UpLHM9W10scj0wO3I8dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDtyKyspe3ZhciBhPXQuYXQocik7YVswXS09bippWzBdK24qdGhpcy5vcHRpb25zLnBhZGRpbmdbMF0sYVsyXT0xO3ZhciBoPXRoaXMuZGF0YS5zaXplQ2FjaGVbcl18fHRoaXMuZGF0YS5zaXplQ2FjaGVbMF0sZD1NYXRoLm1pbihvWzBdL2hbMF0sb1sxXS9oWzFdKSxsPVsuNSpNYXRoLnJvdW5kKG9bMF0taFswXSpkKSwuNSpNYXRoLnJvdW5kKG9bMV0taFsxXSpkKV07cy5wdXNoKHt0cmFuc2Zvcm06VHJhbnNmb3JtLnRoZW5Nb3ZlKFRyYW5zZm9ybS5zY2FsZShkLGQpLFthWzBdK2xbMF0sYVsxXStsWzFdXSksZ3JpZFBvczphLG1heFNjYWxlOmR9KX1yZXR1cm4gc30sR3JpZExheW91dC5wcm90b3R5cGUuX2dldEdyaWRQb3NpdGlvbnM9ZnVuY3Rpb24odCxvLGkpe3ZhciBlPVsodFswXS1vWzBdKk1hdGgubWF4KGlbMF0tMSwwKSkvaVswXSwodFsxXS1vWzFdKk1hdGgubWF4KGlbMV0tMSwwKSkvaVsxXV0sbj1pWzBdKmlbMV07cmV0dXJue2F0OmZ1bmN0aW9uKHMpe3ZhciByPU1hdGguZmxvb3Iocy9uKSxhPXMlaVswXSxoPU1hdGguZmxvb3IoKHMtcipuKS9pWzBdKTtyZXR1cm5bYSplWzBdK2Eqb1swXStyKnRbMF0rcipvWzBdLGgqZVsxXStoKm9bMV1dfSxjZWxsU2l6ZTplfX0sbW9kdWxlLmV4cG9ydHM9R3JpZExheW91dDsiLCJmdW5jdGlvbiBMYXlvdXQodCl7dmFyIG89VXRpbGl0eS5jbG9uZSh0aGlzLmNvbnN0cnVjdG9yLkRFRkFVTFRfT1BUSU9OU3x8e30pO3JldHVybiB0aGlzLm9wdGlvbnM9T2JqZWN0SGVscGVycy5tZXJnZShvLHQpLHRoaXMuaWQ9dGhpcy5jb25zdHJ1Y3Rvci5pZCx0aGlzLmNvbnRyb2xsZXI9bnVsbCx0aGlzLmRhdGE9bnVsbCx0aGlzfXZhciBPYmplY3RIZWxwZXJzPXJlcXVpcmUoXCIuLi9oZWxwZXJzL09iamVjdEhlbHBlcnNcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIiksVXRpbGl0eT1yZXF1aXJlKFwiZmFtb3VzL3V0aWxpdGllcy9VdGlsaXR5XCIpO0xheW91dC5wcm90b3R5cGUuc2V0Q29udHJvbGxlcj1mdW5jdGlvbih0KXt0aGlzLmNvbnRyb2xsZXI9dCx0aGlzLmRhdGE9dC5kYXRhfSxMYXlvdXQucHJvdG90eXBlLnJlc2V0Q2hpbGRQcm9wZXJ0aWVzPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PXRoaXMub3B0aW9ucy50cmFuc2l0aW9uLmR1cmF0aW9ufHx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbi5wZXJpb2R8fDIwMCxvPTA7bzx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoO28rKyl0aGlzLmRhdGEuY2hpbGRUcmFuc2Zvcm1zW29dLnNldChUcmFuc2Zvcm0uaWRlbnRpdHkse2N1cnZlOlwib3V0RXhwb1wiLGR1cmF0aW9uOnR9KSx0aGlzLmRhdGEuY2hpbGRPcmlnaW5zW29dLnNldChbMCwwXSksdGhpcy5kYXRhLmNoaWxkQWxpZ25zW29dLnNldChbMCwwXSl9LExheW91dC5wcm90b3R5cGUuZ2V0UmVuZGVyTGltaXQ9ZnVuY3Rpb24oKXt9LExheW91dC5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oKXt9LExheW91dC5wcm90b3R5cGUubGF5b3V0PWZ1bmN0aW9uKCl7fSxMYXlvdXQucHJvdG90eXBlLmRlYWN0aXZhdGU9ZnVuY3Rpb24oKXt9LG1vZHVsZS5leHBvcnRzPUxheW91dDsiLCJmdW5jdGlvbiBMYXlvdXRDb250cm9sbGVyKHQpe1NpemVBd2FyZVZpZXcuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMuaXRlbXMsdGhpcy5jb250YWluZXIsdGhpcy5pbmRleCx0aGlzLmxhc3RJbmRleCx0aGlzLl9hY3RpdmVMYXlvdXQsdGhpcy5pdGVtc1BlclBhZ2U9dC5pdGVtc1BlclBhZ2UsdGhpcy5yZW5kZXJMaW1pdD1bMSw0XSx0aGlzLmlzTGFzdExheW91dFNpbmd1bGFyPW51bGwsdGhpcy5ub2Rlcz1bXSx0aGlzLmRhdGE9e29wYWNpdGllczpbXSxwYXJlbnRUcmFuc2Zvcm1zOltdLHBhcmVudE9yaWdpbnM6W10scGFyZW50QWxpZ25zOltdLHBhcmVudFNpemVzOltdLGNoaWxkVHJhbnNmb3JtczpbXSxjaGlsZE9yaWdpbnM6W10sY2hpbGRBbGlnbnM6W10sdG91Y2hPZmZzZXQ6bmV3IFRyYW5zaXRpb25hYmxlKFswLDBdKSxzaXplQ2FjaGU6W10sc2l6ZUNhY2hlRnVsbDohMX0sdGhpcy5fYm91bmRMYXlvdXQ9dGhpcy5sYXlvdXQuYmluZCh0aGlzKSx0aGlzLl9ib3VuZEFjdGl2YXRlPXRoaXMuX2FjdGl2YXRlLmJpbmQodGhpcyksdGhpcy5zeW5jPXQuc3luYyx0aGlzLl9pbml0KCl9dmFyIFRpbWVyPXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1RpbWVyXCIpLEVuZ2luZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvRW5naW5lXCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLFJlbmRlck5vZGU9cmVxdWlyZShcImZhbW91cy9jb3JlL1JlbmRlck5vZGVcIiksTW9kaWZpZXI9cmVxdWlyZShcImZhbW91cy9jb3JlL01vZGlmaWVyXCIpLENvbnRhaW5lclN1cmZhY2U9cmVxdWlyZShcImZhbW91cy9zdXJmYWNlcy9Db250YWluZXJTdXJmYWNlXCIpLFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVUcmFuc2Zvcm1cIiksVHJhbnNpdGlvbmFibGU9cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZVwiKSxMYXlvdXRGYWN0b3J5PXJlcXVpcmUoXCIuL0xheW91dEZhY3RvcnlcIiksU2l6ZUF3YXJlVmlldz1yZXF1aXJlKFwiLi4vY29uc3RydWN0b3JzL1NpemVBd2FyZVZpZXdcIiksRXZlbnRIZWxwZXJzPXJlcXVpcmUoXCIuLi9ldmVudHMvRXZlbnRIZWxwZXJzXCIpO0xheW91dENvbnRyb2xsZXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2l6ZUF3YXJlVmlldy5wcm90b3R5cGUpLExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yPUxheW91dENvbnRyb2xsZXIsTGF5b3V0Q29udHJvbGxlci5ERUZBVUxUX09QVElPTlM9e2NsYXNzZXM6W10sbG9vcDp2b2lkIDAscHJvcGVydGllczp7b3ZlcmZsb3c6XCJoaWRkZW5cIix6SW5kZXg6MX0scGVyc3BlY3RpdmU6MWUzfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5zZXRTaXplPWZ1bmN0aW9uKHQpe3RoaXMuY29udGFpbmVyLnNldFNpemUodCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLmdldFNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb250YWluZXIuZ2V0U2l6ZSgpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5zZXRJdGVtcz1mdW5jdGlvbih0KXt0aGlzLml0ZW1zPXQsdGhpcy5fcmVzZXQoKSx0aGlzLl9jcmVhdGVJdGVtcygpLHRoaXMuZGF0YS5zaXplQ2FjaGU9bmV3IEFycmF5KHQubGVuZ3RoKSx0aGlzLmRhdGEuc2l6ZUNhY2hlRnVsbD0hMX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuc2V0SW5kZXg9ZnVuY3Rpb24odCxlKXt0aGlzLmxhc3RJbmRleD10aGlzLmluZGV4LHRoaXMuaW5kZXg9dCx0aGlzLl91cGRhdGVSZW5kZXJlZEluZGljZXMoKSxlJiZ0aGlzLl9zYWZlTGF5b3V0KCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLmdldExlbmd0aD1mdW5jdGlvbigpe3JldHVybiBNYXRoLm1pbih0aGlzLmluZGV4K3RoaXMucmVuZGVyTGltaXRbMF0rdGhpcy5yZW5kZXJMaW1pdFsxXSx0aGlzLm5vZGVzLmxlbmd0aCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLnNldFJlbmRlckxpbWl0PWZ1bmN0aW9uKHQpe3RoaXMucmVuZGVyTGltaXQ9IXQgaW5zdGFuY2VvZiBBcnJheT9bMCx0XTp0LHRoaXMuX3VwZGF0ZVJlbmRlcmVkSW5kaWNlcygpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5nZXRMYXlvdXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYWN0aXZlTGF5b3V0fSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5sYXlvdXQ9ZnVuY3Rpb24oKXt0aGlzLl9sYXlvdXRRdWV1ZT12b2lkIDAsdGhpcy5fdXBkYXRlU2l6ZUNhY2hlKCksdGhpcy5oYWx0KCksdGhpcy5fYWN0aXZlTGF5b3V0JiZ0aGlzLl9hY3RpdmVMYXlvdXQubGF5b3V0KCl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLnNldExheW91dD1mdW5jdGlvbih0KXt0IGluc3RhbmNlb2YgRnVuY3Rpb24mJih0PW5ldyB0KHt9KSksdGhpcy5fYWN0aXZlTGF5b3V0JiZ0aGlzLl9hY3RpdmVMYXlvdXQuZGVhY3RpdmF0ZSgpLHRoaXMuX2FjdGl2ZUxheW91dD10LHRoaXMuX2FjdGl2ZUxheW91dC5zZXRDb250cm9sbGVyKHRoaXMpO3ZhciBlPXRoaXMuX2FjdGl2ZUxheW91dC5nZXRSZW5kZXJMaW1pdCgpO2U/dGhpcy5zZXRSZW5kZXJMaW1pdChlKTp0aGlzLl91cGRhdGVSZW5kZXJlZEluZGljZXMoKSx0aGlzLl9zYWZlQWN0aXZhdGUoKX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuaGFsdD1mdW5jdGlvbigpe2Zvcih2YXIgdD0wO3Q8dGhpcy5ub2Rlcy5sZW5ndGg7dCsrKXRoaXMuZGF0YS5jaGlsZE9yaWdpbnNbdF0uaGFsdCgpLHRoaXMuZGF0YS5jaGlsZEFsaWduc1t0XS5oYWx0KCksdGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1t0XS5oYWx0KCksdGhpcy5kYXRhLnBhcmVudE9yaWdpbnNbdF0uaGFsdCgpLHRoaXMuZGF0YS5wYXJlbnRBbGlnbnNbdF0uaGFsdCgpLHRoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW3RdLmhhbHQoKSx0aGlzLmRhdGEub3BhY2l0aWVzW3RdLmhhbHQoKX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX2luaXQ9ZnVuY3Rpb24oKXt0aGlzLl9jcmVhdGVDb250YWluZXIoKX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX3NhZmVMYXlvdXQ9ZnVuY3Rpb24oKXt0aGlzLl9sYXlvdXRRdWV1ZT90aGlzLl9sYXlvdXRRdWV1ZSgpOnRoaXMuX2xheW91dFF1ZXVlPUV2ZW50SGVscGVycy5mcmFtZVF1ZXVlKHRoaXMuX2JvdW5kTGF5b3V0LDQpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5fc2FmZUFjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5fYWN0aXZhdGVRdWV1ZT90aGlzLl9hY3RpdmF0ZVF1ZXVlKCk6dGhpcy5fYWN0aXZhdGVRdWV1ZT1FdmVudEhlbHBlcnMuZnJhbWVRdWV1ZSh0aGlzLl9ib3VuZEFjdGl2YXRlLDQpfSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5fYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLl9hY3RpdmF0ZVF1ZXVlPXZvaWQgMCx0aGlzLl91cGRhdGVTaXplQ2FjaGUoKSx0aGlzLmhhbHQoKSx0aGlzLl9hY3RpdmVMYXlvdXQuYWN0aXZhdGUoKX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX3VwZGF0ZVJlbmRlcmVkSW5kaWNlcz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuX3ByZXZpb3VzUmVuZGVyP3RoaXMuX3ByZXZpb3VzUmVuZGVyOltdO3RoaXMuZnV0dXJlSW5kaWNlcz10aGlzLl9jYWxjdWxhdGVGdXR1cmVJbmRpY2VzKCksdGhpcy5fdG9SZW5kZXI9W107Zm9yKHZhciBlPTA7ZTx0Lmxlbmd0aDtlKyspdGhpcy5fdG9SZW5kZXIucHVzaCh0W2VdKTtmb3IodmFyIGU9MDtlPHRoaXMuZnV0dXJlSW5kaWNlcy5sZW5ndGg7ZSsrKXRoaXMuX3RvUmVuZGVyLmluZGV4T2YodGhpcy5mdXR1cmVJbmRpY2VzW2VdKTwwJiZ0aGlzLl90b1JlbmRlci5wdXNoKHRoaXMuZnV0dXJlSW5kaWNlc1tlXSk7dGhpcy5fcHJldmlvdXNSZW5kZXI9dGhpcy5mdXR1cmVJbmRpY2VzLHRoaXMuX3RvUmVuZGVyLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdC1lfSl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9jYWxjdWxhdGVGdXR1cmVJbmRpY2VzPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PVtdLGU9dGhpcy5ub2Rlcy5sZW5ndGgsaT0wLHI9dGhpcy5yZW5kZXJMaW1pdFswXSt0aGlzLnJlbmRlckxpbWl0WzFdLG49MDtyPm4mJm4hPWU7bisrKXt2YXIgYT10aGlzLmluZGV4LXRoaXMucmVuZGVyTGltaXRbMF0rbjtpZigwPmEpe3ZhciBvPWElZTtpZihvPTA9PW8/bzpvK2Usbz09ZSljb250aW51ZTt0LnB1c2gobyksaT1vPmk/bzppfWVsc2UoMD09aXx8aT5hKSYmdC5wdXNoKGElZSl9cmV0dXJuIHR9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9jcmVhdGVDb250YWluZXI9ZnVuY3Rpb24oKXt0aGlzLmNvbnRhaW5lcj1uZXcgQ29udGFpbmVyU3VyZmFjZSh7Y2xhc3Nlczp0aGlzLm9wdGlvbnMuY2xhc3Nlcyxwcm9wZXJ0aWVzOnRoaXMub3B0aW9ucy5wcm9wZXJ0aWVzfSksdGhpcy5jb250YWluZXIuY29udGV4dC5zZXRQZXJzcGVjdGl2ZSh0aGlzLm9wdGlvbnMucGVyc3BlY3RpdmUpO3ZhciB0PW5ldyBSZW5kZXJOb2RlO3QucmVuZGVyPXRoaXMuX2lubmVyUmVuZGVyLmJpbmQodGhpcyksdGhpcy5hZGQodGhpcy5jb250YWluZXIpLHRoaXMuY29udGFpbmVyLmFkZCh0KX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX2Nvbm5lY3RDb250YWluZXI9ZnVuY3Rpb24odCl7dGhpcy5jb250YWluZXIucGlwZSh0KSx0aGlzLmNvbnRhaW5lci5waXBlKHQuc3luYyl9LExheW91dENvbnRyb2xsZXIucHJvdG90eXBlLl9jcmVhdGVJdGVtcz1mdW5jdGlvbigpe2Zvcih2YXIgdD0wO3Q8dGhpcy5pdGVtcy5sZW5ndGg7dCsrKXt2YXIgZT10aGlzLml0ZW1zW3RdLGk9bmV3IFRyYW5zaXRpb25hYmxlKDEpLHI9bmV3IFRyYW5zaXRpb25hYmxlVHJhbnNmb3JtLG49bmV3IFRyYW5zaXRpb25hYmxlKFswLDBdKSxhPW5ldyBUcmFuc2l0aW9uYWJsZShbMCwwXSksbz1uZXcgVHJhbnNpdGlvbmFibGUoW3ZvaWQgMCx2b2lkIDBdKSxzPW5ldyBUcmFuc2l0aW9uYWJsZVRyYW5zZm9ybSxoPW5ldyBUcmFuc2l0aW9uYWJsZShbMCwwXSksdT1uZXcgVHJhbnNpdGlvbmFibGUoWzAsMF0pLGw9bmV3IE1vZGlmaWVyKHt0cmFuc2Zvcm06cixvcmlnaW46bixhbGlnbjphLG9wYWNpdHk6aSxzaXplOm99KSxkPW5ldyBNb2RpZmllcih7dHJhbnNmb3JtOnMsb3JpZ2luOmgsYWxpZ246dX0pLGM9bmV3IE1vZGlmaWVyKHt0cmFuc2Zvcm06ZnVuY3Rpb24oKXt2YXIgdD10aGlzLmRhdGEudG91Y2hPZmZzZXQuZ2V0KCk7cmV0dXJuIFRyYW5zZm9ybS50cmFuc2xhdGUodFswXSx0WzFdKX0uYmluZCh0aGlzKX0pLHA9bmV3IFJlbmRlck5vZGU7cC5nZXRTaXplPWUuZ2V0U2l6ZS5iaW5kKGUpLHAuYWRkKGMpLmFkZChsKS5hZGQoZCkuYWRkKGUpLHRoaXMubm9kZXMucHVzaChwKSx0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtcy5wdXNoKHIpLHRoaXMuZGF0YS5vcGFjaXRpZXMucHVzaChpKSx0aGlzLmRhdGEucGFyZW50T3JpZ2lucy5wdXNoKG4pLHRoaXMuZGF0YS5wYXJlbnRBbGlnbnMucHVzaChhKSx0aGlzLmRhdGEucGFyZW50U2l6ZXMucHVzaChvKSx0aGlzLmRhdGEuY2hpbGRUcmFuc2Zvcm1zLnB1c2gocyksdGhpcy5kYXRhLmNoaWxkT3JpZ2lucy5wdXNoKGgpLHRoaXMuZGF0YS5jaGlsZEFsaWducy5wdXNoKHUpfX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX3Jlc2V0PWZ1bmN0aW9uKCl7dGhpcy5ub2Rlcz1bXSx0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtcz1bXSx0aGlzLmRhdGEub3BhY2l0aWVzPVtdLHRoaXMuZGF0YS5wYXJlbnRPcmlnaW5zPVtdLHRoaXMuZGF0YS5wYXJlbnRBbGlnbnM9W10sdGhpcy5kYXRhLnBhcmVudFNpemVzPVtdLHRoaXMuZGF0YS5jaGlsZFRyYW5zZm9ybXM9W10sdGhpcy5kYXRhLmNoaWxkT3JpZ2lucz1bXSx0aGlzLmRhdGEuY2hpbGRBbGlnbnM9W10sdGhpcy5kYXRhLnNpemVDYWNoZT1bXSx0aGlzLmRhdGEuc2l6ZUNhY2hlRnVsbD0hMX0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX3Nhbml0aXplSW5kZXg9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5ub2Rlcy5sZW5ndGg7cmV0dXJuIDA+dD90JWUrZTp0PmUtMT90JWU6dH0sTGF5b3V0Q29udHJvbGxlci5wcm90b3R5cGUuX3VwZGF0ZVNpemVDYWNoZT1mdW5jdGlvbigpe2lmKCF0aGlzLmRhdGEuc2l6ZUNhY2hlRnVsbCl7Zm9yKHZhciB0LGU9dGhpcy5kYXRhLnNpemVDYWNoZSxpPTAscj0wO3I8ZS5sZW5ndGg7cisrKXZvaWQgMD09PWVbcl0/KHQ9dGhpcy5pdGVtc1tyXS5nZXRTaXplKCksbnVsbCE9PXQmJjAhPXRbMF0mJjAhPXRbMV0mJihlW3JdPXQsdGhpcy5kYXRhLnBhcmVudFNpemVzW3JdLnNldCh0KSx0aGlzLl9ldmVudElucHV0LmVtaXQoXCJpbml0aWFsU2l6ZVwiLHIpLGkrKykpOmkrKztpPT09ZS5sZW5ndGgmJih0aGlzLmRhdGEuc2l6ZUNhY2hlRnVsbD0hMCl9fSxMYXlvdXRDb250cm9sbGVyLnByb3RvdHlwZS5faW5uZXJSZW5kZXI9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9W10sZT0wO2U8dGhpcy5fdG9SZW5kZXIubGVuZ3RoO2UrKyl0W2VdPXRoaXMubm9kZXNbdGhpcy5fdG9SZW5kZXJbZV1dLnJlbmRlcigpO3JldHVybiB0fSxtb2R1bGUuZXhwb3J0cz1MYXlvdXRDb250cm9sbGVyOyIsInZhciBTaW5ndWxhclNvZnRTY2FsZT1yZXF1aXJlKFwiLi9TaW5ndWxhclNvZnRTY2FsZVwiKSxTaW5ndWxhclR3aXN0PXJlcXVpcmUoXCIuL1Npbmd1bGFyVHdpc3RcIiksU2luZ3VsYXJTbGlkZUJlaGluZD1yZXF1aXJlKFwiLi9TaW5ndWxhclNsaWRlQmVoaW5kXCIpLFNpbmd1bGFyUGFyYWxsYXg9cmVxdWlyZShcIi4vU2luZ3VsYXJQYXJhbGxheFwiKSxTaW5ndWxhck9wYWNpdHk9cmVxdWlyZShcIi4vU2luZ3VsYXJPcGFjaXR5XCIpLFNpbmd1bGFyU2xpZGVJbj1yZXF1aXJlKFwiLi9TaW5ndWxhclNsaWRlSW5cIiksR3JpZExheW91dD1yZXF1aXJlKFwiLi9HcmlkTGF5b3V0XCIpLENvdmVyZmxvd0xheW91dD1yZXF1aXJlKFwiLi9Db3ZlcmZsb3dMYXlvdXRcIiksU2VxdWVudGlhbExheW91dD1yZXF1aXJlKFwiLi9TZXF1ZW50aWFsTGF5b3V0XCIpLExheW91dEZhY3Rvcnk9e307TGF5b3V0RmFjdG9yeS53cmFwPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIHIocil7cmV0dXJuIHIgaW5zdGFuY2VvZiBhP3I6bmV3IGEocil9cmV0dXJuIHIuaWQ9YS5pZCxyfSxMYXlvdXRGYWN0b3J5LlNpbmd1bGFyU29mdFNjYWxlPUxheW91dEZhY3Rvcnkud3JhcChTaW5ndWxhclNvZnRTY2FsZSksTGF5b3V0RmFjdG9yeS5TaW5ndWxhclR3aXN0PUxheW91dEZhY3Rvcnkud3JhcChTaW5ndWxhclR3aXN0KSxMYXlvdXRGYWN0b3J5LlNpbmd1bGFyU2xpZGVCZWhpbmQ9TGF5b3V0RmFjdG9yeS53cmFwKFNpbmd1bGFyU2xpZGVCZWhpbmQpLExheW91dEZhY3RvcnkuU2luZ3VsYXJQYXJhbGxheD1MYXlvdXRGYWN0b3J5LndyYXAoU2luZ3VsYXJQYXJhbGxheCksTGF5b3V0RmFjdG9yeS5TaW5ndWxhck9wYWNpdHk9TGF5b3V0RmFjdG9yeS53cmFwKFNpbmd1bGFyT3BhY2l0eSksTGF5b3V0RmFjdG9yeS5TaW5ndWxhclNsaWRlSW49TGF5b3V0RmFjdG9yeS53cmFwKFNpbmd1bGFyU2xpZGVJbiksTGF5b3V0RmFjdG9yeS5HcmlkTGF5b3V0PUxheW91dEZhY3Rvcnkud3JhcChHcmlkTGF5b3V0KSxMYXlvdXRGYWN0b3J5LkNvdmVyZmxvd0xheW91dD1MYXlvdXRGYWN0b3J5LndyYXAoQ292ZXJmbG93TGF5b3V0KSxMYXlvdXRGYWN0b3J5LlNlcXVlbnRpYWxMYXlvdXQ9TGF5b3V0RmFjdG9yeS53cmFwKFNlcXVlbnRpYWxMYXlvdXQpLG1vZHVsZS5leHBvcnRzPUxheW91dEZhY3Rvcnk7IiwiZnVuY3Rpb24gU2VxdWVudGlhbExheW91dCh0KXtMYXlvdXQuY2FsbCh0aGlzLHQpLHRoaXMuYXBwbHlQcmVBbmltYXRpb25PZmZzZXQ9W10sdGhpcy51c2VUb3VjaEVuZFRyYW5zaXRpb249ITF9dmFyIExheW91dD1yZXF1aXJlKFwiLi9MYXlvdXRcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIiksRWFzaW5nPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvRWFzaW5nXCIpO1NlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoTGF5b3V0LnByb3RvdHlwZSksU2VxdWVudGlhbExheW91dC5wcm90b3R5cGUuY29uc3RydWN0b3I9U2VxdWVudGlhbExheW91dCxTZXF1ZW50aWFsTGF5b3V0LmlkPVwiU2VxdWVudGlhbExheW91dFwiLFNlcXVlbnRpYWxMYXlvdXQuREVGQVVMVF9PUFRJT05TPXt0cmFuc2l0aW9uOntkdXJhdGlvbjo4MDAsY3VydmU6XCJvdXRFeHBvXCJ9LHRvdWNoRW5kVHJhbnNpdGlvbjp7bWV0aG9kOlwic25hcFwiLHBlcmlvZDoyMDB9LHBhZGRpbmc6WzEwLDBdLGRpcmVjdGlvbjpcInhcIn0sU2VxdWVudGlhbExheW91dC5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLnJlc2V0Q2hpbGRQcm9wZXJ0aWVzKCk7Zm9yKHZhciB0PTA7dDx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoO3QrKyl0aGlzLmRhdGEub3BhY2l0aWVzW3RdLnNldCgxLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKTt0aGlzLmNvbnRhaW5lclNpemU9dGhpcy5jb250cm9sbGVyLmdldFNpemUoKSx0aGlzLmxheW91dCgpLHRoaXMuX2hhbmRsZVRvdWNoRXZlbnRzKCl9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLmxheW91dD1mdW5jdGlvbigpe2Zvcih2YXIgdCxlLGk9XCJ5XCI9PT10aGlzLm9wdGlvbnMuZGlyZWN0aW9uPzE6MCxvPTE9PT1pPzA6MSxuPXRoaXMuY29udHJvbGxlci5pbmRleCxzPXRoaXMuY29udHJvbGxlci5ub2Rlcy5sZW5ndGgtMSxhPVtdLHI9WzAsMF0saD0xO2g8PXRoaXMuY29udHJvbGxlci5yZW5kZXJMaW1pdFswXTtoKyspdD10aGlzLmNvbnRyb2xsZXIuX3Nhbml0aXplSW5kZXgobi1oKSxlPXRoaXMuX2dldENlbnRlcmVkUG9zaXRpb24odCxvKSxyW29dPWVbb10scltpXS09dGhpcy5kYXRhLnNpemVDYWNoZVt0XVtpXSt0aGlzLm9wdGlvbnMucGFkZGluZ1tpXSxhW3RdPVRyYW5zZm9ybS50cmFuc2xhdGUoclswXSxyWzFdKTtmb3IodmFyIHU9WzAsMF0saD0wO2g8dGhpcy5jb250cm9sbGVyLnJlbmRlckxpbWl0WzFdJiYodD10aGlzLmNvbnRyb2xsZXIuX3Nhbml0aXplSW5kZXgobitoKSxlPXRoaXMuX2dldENlbnRlcmVkUG9zaXRpb24odCxvKSx0aGlzLmNvbnRyb2xsZXIub3B0aW9ucy5sb29wPT09ITB8fHQ+PW4pO2grKylhW3RdPXRoaXMuX2dldFRyYW5zZm9ybSh0LHUsbyksdVtpXSs9dGhpcy5kYXRhLnNpemVDYWNoZVt0XVtpXSt0aGlzLm9wdGlvbnMucGFkZGluZ1tpXTt2YXIgYz0wO2lmKCF0aGlzLmNvbnRyb2xsZXIub3B0aW9ucy5sb29wJiZhW3NdJiZ0aGlzLmRhdGEuc2l6ZUNhY2hlW3NdKXt2YXIgbD0wPT09aT9hW3NdWzEyXTphW3NdWzEzXTtpZihsPj0wKXt2YXIgZD1sK3RoaXMuZGF0YS5zaXplQ2FjaGVbdF1baV07ZDx0aGlzLmNvbnRhaW5lclNpemVbaV0mJihjPXRoaXMuY29udGFpbmVyU2l6ZVtpXS1kKX19dmFyIHA9dGhpcy5vcHRpb25zLnRyYW5zaXRpb247dGhpcy51c2VUb3VjaEVuZFRyYW5zaXRpb24mJihwPXRoaXMub3B0aW9ucy50b3VjaEVuZFRyYW5zaXRpb24sdGhpcy51c2VUb3VjaEVuZFRyYW5zaXRpb249ITEpO2Zvcih2YXIgaD0wO2g8dGhpcy5jb250cm9sbGVyLm5vZGVzLmxlbmd0aDtoKyspaWYoYVtoXSl7aWYodGhpcy5hcHBseVByZUFuaW1hdGlvbk9mZnNldFtoXSl7dmFyIGY9MD09PWk/YVtoXVsxMl06YVtoXVsxM10seT0wPmY/LTE6MTtlPXRoaXMuX2dldENlbnRlcmVkUG9zaXRpb24oaCxvKTt2YXIgVD1bXTtUW2ldPXRoaXMuY29udGFpbmVyU2l6ZVtpXSp5LFRbb109ZVtvXSx0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1toXS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShUWzBdLFRbMV0pKSx0aGlzLmFwcGx5UHJlQW5pbWF0aW9uT2Zmc2V0W2hdPSExfTA9PT1pP2FbaF1bMTJdKz1jOmFbaF1bMTNdKz1jLHRoaXMuZGF0YS5wYXJlbnRUcmFuc2Zvcm1zW2hdLnNldChhW2hdLHApLHRoaXMuZGF0YS5vcGFjaXRpZXNbaF0uc2V0KDEscCl9ZWxzZSB0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1toXS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZSh0aGlzLmNvbnRhaW5lclNpemVbMF0sdGhpcy5jb250YWluZXJTaXplWzFdKSksdGhpcy5kYXRhLm9wYWNpdGllc1toXS5zZXQoMCksdGhpcy5hcHBseVByZUFuaW1hdGlvbk9mZnNldFtoXT0hMH0sU2VxdWVudGlhbExheW91dC5wcm90b3R5cGUuZGVhY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuaXNMYXN0TGF5b3V0U2luZ3VsYXI9ITEsdGhpcy5fcmVtb3ZlVG91Y2hFdmVudHMoKX0sU2VxdWVudGlhbExheW91dC5wcm90b3R5cGUuZ2V0UmVuZGVyTGltaXQ9ZnVuY3Rpb24oKXtyZXR1cm5bNSxNYXRoLm1pbigxMCx0aGlzLmNvbnRyb2xsZXIubm9kZXMubGVuZ3RoKV19LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLl9oYW5kbGVUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3ZhciB0PVwieVwiPT09dGhpcy5vcHRpb25zLmRpcmVjdGlvbj8xOjA7dGhpcy5ib3VuZFRvdWNoVXBkYXRlPWZ1bmN0aW9uKGUpe3ZhciBpPXRoaXMuZGF0YS50b3VjaE9mZnNldCxvPWkuZ2V0KCk7b1t0XSs9ZS5kZWx0YVt0XSxpLnNldChbb1swXSxvWzFdXSl9LmJpbmQodGhpcyksdGhpcy5ib3VuZFRvdWNoRW5kPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuZGF0YS50b3VjaE9mZnNldCxpPWUuZ2V0KCksbz1pW3RdLG49MDtuPHRoaXMuY29udHJvbGxlci5pdGVtcy5sZW5ndGg7bisrKXt2YXIgcz10aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1tuXSxhPXMudHJhbnNsYXRlLmdldCgpO3Muc2V0VHJhbnNsYXRlKFthWzBdK2lbMF0sYVsxXStpWzFdXSl9ZS5zZXQoWzAsMF0pO3ZhciByPW8+MD8tMToxLGg9dGhpcy5jb250cm9sbGVyLmluZGV4O2ZvcihvPU1hdGguYWJzKG8pO28+MDspby09dGhpcy5kYXRhLnNpemVDYWNoZVtoXVt0XSxoPXRoaXMuY29udHJvbGxlci5fc2FuaXRpemVJbmRleChoK3IpO3RoaXMudXNlVG91Y2hFbmRUcmFuc2l0aW9uPSEwLHRoaXMuY29udHJvbGxlci5fZXZlbnRPdXRwdXQuZW1pdChcInNldFwiLGgpfS5iaW5kKHRoaXMpLHRoaXMuX2FkZFRvdWNoRXZlbnRzKCl9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLl9hZGRUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLm9uKFwidXBkYXRlXCIsdGhpcy5ib3VuZFRvdWNoVXBkYXRlKSx0aGlzLmNvbnRyb2xsZXIuc3luYy5vbihcImVuZFwiLHRoaXMuYm91bmRUb3VjaEVuZCl9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLl9yZW1vdmVUb3VjaEV2ZW50cz1mdW5jdGlvbigpe3RoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwidXBkYXRlXCIsdGhpcy5ib3VuZFRvdWNoVXBkYXRlKSx0aGlzLmNvbnRyb2xsZXIuc3luYy5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLHRoaXMuYm91bmRUb3VjaEVuZCl9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLl9nZXRDZW50ZXJlZFBvc2l0aW9uPWZ1bmN0aW9uKHQsZSl7aWYodm9pZCAwPT09dGhpcy5kYXRhLnNpemVDYWNoZVt0XSlyZXR1cm5bMCwwXTt2YXIgaT1bMCwwXTtyZXR1cm4gaVtlXT0uNSoodGhpcy5jb250YWluZXJTaXplW2VdLXRoaXMuZGF0YS5zaXplQ2FjaGVbdF1bZV0pLGl9LFNlcXVlbnRpYWxMYXlvdXQucHJvdG90eXBlLl9nZXRUcmFuc2Zvcm09ZnVuY3Rpb24odCxlLGkpe3ZhciBvPXRoaXMuX2dldENlbnRlcmVkUG9zaXRpb24odCxpKTtyZXR1cm4gVHJhbnNmb3JtLnRyYW5zbGF0ZShlWzBdK29bMF0sZVsxXStvWzFdKX0sbW9kdWxlLmV4cG9ydHM9U2VxdWVudGlhbExheW91dDsiLCJmdW5jdGlvbiBTaW5ndWxhckxheW91dCh0KXtyZXR1cm4gTGF5b3V0LmNhbGwodGhpcyx0KSx0aGlzLl9ib3VuZFNpemVMaXN0ZW5lcj1udWxsLHRoaXN9dmFyIExheW91dD1yZXF1aXJlKFwiLi9MYXlvdXRcIiksVHJhbnNmb3JtPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9UcmFuc2Zvcm1cIiksVGltZXI9cmVxdWlyZShcImZhbW91cy91dGlsaXRpZXMvVGltZXJcIik7U2luZ3VsYXJMYXlvdXQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoTGF5b3V0LnByb3RvdHlwZSksU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyTGF5b3V0LFNpbmd1bGFyTGF5b3V0LkRFRkFVTFRfT1BUSU9OUz17fSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLl9ib3VuZFNpemVMaXN0ZW5lcj10aGlzLmNlbnRlckl0ZW0uYmluZCh0aGlzKTtmb3IodmFyIHQ9MDt0PHRoaXMuY29udHJvbGxlci5pdGVtcy5sZW5ndGg7dCsrKXRoaXMuZGF0YS5jaGlsZE9yaWdpbnNbdF0uc2V0KFsuNSwuNV0pLHRoaXMuZGF0YS5jaGlsZEFsaWduc1t0XS5zZXQoWy41LC41XSksdGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1t0XS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5KSx0PT09dGhpcy5jb250cm9sbGVyLmluZGV4Pyh0aGlzLmRhdGEub3BhY2l0aWVzW3RdLnNldCgxLHRoaXMub3B0aW9ucy5jdXJ2ZSksdGhpcy5kYXRhLnNpemVDYWNoZVt0XSYmKHRoaXMuY29udHJvbGxlci5pc0xhc3RMYXlvdXRTaW5ndWxhcnx8bnVsbD09PXRoaXMuY29udHJvbGxlci5pc0xhc3RMYXlvdXRTaW5ndWxhcj90aGlzLmNlbnRlckl0ZW0odCk6dGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1t0XS5zZXQoVHJhbnNmb3JtLnNjYWxlKC44LC44KSx7ZHVyYXRpb246MTUwfSxmdW5jdGlvbih0KXt0aGlzLmNlbnRlckl0ZW0odCx7bWV0aG9kOlwic3ByaW5nXCIsZGFtcGluZ1JhdGlvOi42NSxwZXJpb2Q6NDAwfSksdGhpcy5kYXRhLmNoaWxkVHJhbnNmb3Jtc1t0XS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5LHtkdXJhdGlvbjoxNTB9KX0uYmluZCh0aGlzLHQpKSkpOih0aGlzLmRhdGEuY2hpbGRUcmFuc2Zvcm1zW3RdLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKDAsMCwtMTApKSx0aGlzLmRhdGEub3BhY2l0aWVzW3RdLnNldCgwLHtkdXJhdGlvbjozMDB9LGZ1bmN0aW9uKHQpe3RoaXMuZGF0YS5zaXplQ2FjaGVbdF0mJnRoaXMuY2VudGVySXRlbSh0KX0uYmluZCh0aGlzLHQpKSk7dGhpcy5jb250cm9sbGVyLl9ldmVudElucHV0Lm9uKFwiaW5pdGlhbFNpemVcIix0aGlzLl9ib3VuZFNpemVMaXN0ZW5lciksdGhpcy5faGFuZGxlVG91Y2hFdmVudHMoKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmxheW91dD1mdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLmNvbnRyb2xsZXIuaW5kZXgsaT10aGlzLmNvbnRyb2xsZXIubGFzdEluZGV4LGU9dGhpcy5jb250cm9sbGVyLml0ZW1zLmxlbmd0aC0xLG49KHQ+aXx8MD09PXQmJmk9PT1lKSYmISh0PT09ZSYmMD09PWkpLG89dGhpcy5jb250cm9sbGVyLmdldFNpemUoKS5zbGljZSgwKSxyPTA7cjx0aGlzLmNvbnRyb2xsZXIuaXRlbXMubGVuZ3RoO3IrKylyPT09dGhpcy5jb250cm9sbGVyLmluZGV4P3RoaXMuY3VycmVudEl0ZW1UcmFuc2l0aW9uKHRoaXMuZ2V0SXRlbShyKSxvLG4pOnI9PT10aGlzLmNvbnRyb2xsZXIubGFzdEluZGV4P3RoaXMucHJldmlvdXNJdGVtVHJhbnNpdGlvbih0aGlzLmdldEl0ZW0ociksbyxuKTp0aGlzLm90aGVySXRlbVRyYW5zaXRpb24odGhpcy5nZXRJdGVtKHIpLG8pfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUub3RoZXJJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbih0KXt0Lm9wYWNpdHkuc2V0KDApfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKCl7fSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUucHJldmlvdXNJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbigpe30sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmRlYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLmNvbnRyb2xsZXIuaXNMYXN0TGF5b3V0U2luZ3VsYXI9ITAsdGhpcy5jb250cm9sbGVyLl9ldmVudElucHV0LnJlbW92ZUxpc3RlbmVyKFwiaW5pdGlhbFNpemVcIix0aGlzLl9ib3VuZFNpemVMaXN0ZW5lciksdGhpcy5fcmVtb3ZlVG91Y2hFdmVudHMoKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLmdldFJlbmRlckxpbWl0PWZ1bmN0aW9uKCl7cmV0dXJuWzEsMV19LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5nZXRDZW50ZXJlZFBvc2l0aW9uPWZ1bmN0aW9uKHQpe3ZhciBpPXRoaXMuY29udHJvbGxlci5nZXRTaXplKCksZT10aGlzLmRhdGEuc2l6ZUNhY2hlW3RdO3JldHVyblsuNSooaVswXS1lWzBdKSwuNSooaVsxXS1lWzFdKV19LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5jZW50ZXJJdGVtPWZ1bmN0aW9uKHQsaSl7dmFyIGU9dGhpcy5jb250cm9sbGVyLmdldFNpemUoKSxuPXRoaXMuZGF0YS5zaXplQ2FjaGVbdF07dGhpcy5kYXRhLnBhcmVudFRyYW5zZm9ybXNbdF0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoLjUqKGVbMF0tblswXSksLjUqKGVbMV0tblsxXSkpLGkpfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuZ2V0SXRlbT1mdW5jdGlvbih0KXtyZXR1cm57aXRlbTp0aGlzLmNvbnRyb2xsZXIuaXRlbXNbdF0sc2l6ZTp0aGlzLmRhdGEuc2l6ZUNhY2hlW3RdLGluZGV4OnQsb3BhY2l0eTp0aGlzLmRhdGEub3BhY2l0aWVzW3RdLHBhcmVudE9yaWdpbjp0aGlzLmRhdGEucGFyZW50T3JpZ2luc1t0XSxwYXJlbnRBbGlnbjp0aGlzLmRhdGEucGFyZW50QWxpZ25zW3RdLHBhcmVudFNpemU6dGhpcy5kYXRhLnBhcmVudFNpemVzW3RdLHBhcmVudFRyYW5zZm9ybTp0aGlzLmRhdGEucGFyZW50VHJhbnNmb3Jtc1t0XSxjaGlsZFRyYW5zZm9ybTp0aGlzLmRhdGEuY2hpbGRUcmFuc2Zvcm1zW3RdLGNoaWxkT3JpZ2luOnRoaXMuZGF0YS5jaGlsZE9yaWdpbnNbdF0sY2hpbGRBbGlnbjp0aGlzLmRhdGEuY2hpbGRBbGlnbnNbdF19fSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuX2hhbmRsZVRvdWNoRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5ib3VuZFRvdWNoVXBkYXRlPWZ1bmN0aW9uKHQpe3ZhciBpPXRoaXMuY29udHJvbGxlci5pbmRleCxlPXRoaXMuZGF0YS5zaXplQ2FjaGVbaV0sbj10aGlzLmRhdGEudG91Y2hPZmZzZXQsbz1uLmdldCgpO2lmKG4uc2V0KFtvWzBdK3QuZGVsdGFbMF0sb1sxXV0pLE1hdGguYWJzKG9bMF0pPjEqZVswXS8zKXt2YXIgcj1uLmdldCgpWzBdPDA/XCJwcmV2aW91c1wiOlwibmV4dFwiO3RoaXMuX2VtaXRFdmVudEZyb21Ub3VjaCh0LnZlbG9jaXR5LHIpfX0uYmluZCh0aGlzKSx0aGlzLmJvdW5kVG91Y2hFbmQ9ZnVuY3Rpb24odCl7dmFyIGk9dGhpcy5kYXRhLnRvdWNoT2Zmc2V0O2kuc2V0KFswLDBdLHtjdXJ2ZTpcIm91dEJhY2tcIixkdXJhdGlvbjoxNTB9KSxUaW1lci5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XCJmdW5jdGlvblwiPT10eXBlb2YgdCYmdCgpfSwxMDApfS5iaW5kKHRoaXMpLHRoaXMuX2FkZFRvdWNoRXZlbnRzKCl9LFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZS5fYWRkVG91Y2hFdmVudHM9ZnVuY3Rpb24oKXt0aGlzLmNvbnRyb2xsZXIuc3luYy5vbihcInVwZGF0ZVwiLHRoaXMuYm91bmRUb3VjaFVwZGF0ZSksdGhpcy5jb250cm9sbGVyLnN5bmMub24oXCJlbmRcIix0aGlzLmJvdW5kVG91Y2hFbmQpfSxTaW5ndWxhckxheW91dC5wcm90b3R5cGUuX3JlbW92ZVRvdWNoRXZlbnRzPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLnN5bmMucmVtb3ZlTGlzdGVuZXIoXCJ1cGRhdGVcIix0aGlzLmJvdW5kVG91Y2hVcGRhdGUpLHRoaXMuY29udHJvbGxlci5zeW5jLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIsdGhpcy5ib3VuZFRvdWNoRW5kKX0sU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlLl9lbWl0RXZlbnRGcm9tVG91Y2g9ZnVuY3Rpb24odCxpKXt0aGlzLl9yZW1vdmVUb3VjaEV2ZW50cygpO3ZhciBlPWZ1bmN0aW9uKCl7dGhpcy5jb250cm9sbGVyLl9ldmVudE91dHB1dC5lbWl0KGkpLHRoaXMuX2FkZFRvdWNoRXZlbnRzKCl9LmJpbmQodGhpcyk7dGhpcy5ib3VuZFRvdWNoRW5kKGUpfSxtb2R1bGUuZXhwb3J0cz1TaW5ndWxhckxheW91dDsiLCJmdW5jdGlvbiBTaW5ndWxhck9wYWNpdHkodCl7U2luZ3VsYXJMYXlvdXQuY2FsbCh0aGlzLHQpfXZhciBTaW5ndWxhckxheW91dD1yZXF1aXJlKFwiLi9TaW5ndWxhckxheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKTtTaW5ndWxhck9wYWNpdHkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlKSxTaW5ndWxhck9wYWNpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyT3BhY2l0eSxTaW5ndWxhck9wYWNpdHkuaWQ9XCJTaW5ndWxhck9wYWNpdHlcIixTaW5ndWxhck9wYWNpdHkuREVGQVVMVF9PUFRJT05TPXt0cmFuc2l0aW9uOntjdXJ2ZTpcImxpbmVhclwiLGR1cmF0aW9uOjUwMH19LFNpbmd1bGFyT3BhY2l0eS5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKHQpe3Qub3BhY2l0eS5zZXQoMSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiksdGhpcy5jZW50ZXJJdGVtKHRoaXMuY29udHJvbGxlci5pbmRleCl9LFNpbmd1bGFyT3BhY2l0eS5wcm90b3R5cGUucHJldmlvdXNJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbih0KXt0Lm9wYWNpdHkuc2V0KDAsdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIubGFzdEluZGV4KX0sbW9kdWxlLmV4cG9ydHM9U2luZ3VsYXJPcGFjaXR5OyIsImZ1bmN0aW9uIFNpbmd1bGFyUGFyYWxsYXgoYSl7U2luZ3VsYXJMYXlvdXQuY2FsbCh0aGlzLGEpLHRoaXMuYXhpcz1cInhcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/MDoxfXZhciBTaW5ndWxhckxheW91dD1yZXF1aXJlKFwiLi9TaW5ndWxhckxheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKTtTaW5ndWxhclBhcmFsbGF4LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZSksU2luZ3VsYXJQYXJhbGxheC5wcm90b3R5cGUuY29uc3RydWN0b3I9U2luZ3VsYXJQYXJhbGxheCxTaW5ndWxhclBhcmFsbGF4LmlkPVwiU2luZ3VsYXJQYXJhbGxheFwiLFNpbmd1bGFyUGFyYWxsYXguREVGQVVMVF9PUFRJT05TPXt0cmFuc2l0aW9uOnttZXRob2Q6XCJzcHJpbmdcIixkYW1waW5nUmF0aW86Ljk1LHBlcmlvZDo1NTB9LGRpcmVjdGlvbjpcInlcIixwYXJhbGxheFJhdGlvOi4yfSxTaW5ndWxhclBhcmFsbGF4LkRlcHRoPTEsU2luZ3VsYXJQYXJhbGxheC5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKGEscix0KXthLm9wYWNpdHkuc2V0KDEpLGEucGFyZW50VHJhbnNmb3JtLmhhbHQoKTt2YXIgaSxuPXRoaXMuZ2V0Q2VudGVyZWRQb3NpdGlvbih0aGlzLmNvbnRyb2xsZXIuaW5kZXgpO3Q/KGk9W25bMF0sblsxXSwtMipTaW5ndWxhclBhcmFsbGF4LkRlcHRoXSxpW3RoaXMuYXhpc109LWEuc2l6ZVt0aGlzLmF4aXNdKnRoaXMub3B0aW9ucy5wYXJhbGxheFJhdGlvLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKGlbMF0saVsxXSxpWzJdKSksYS5wYXJlbnRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoblswXSxuWzFdLG5bMl0pLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSk6KGk9W25bMF0sblsxXSwwXSxpW3RoaXMuYXhpc109clt0aGlzLmF4aXNdLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKGlbMF0saVsxXSxpWzJdKSksYS5wYXJlbnRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoblswXSxuWzFdLG5bMl0pLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSksYS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5KX0sU2luZ3VsYXJQYXJhbGxheC5wcm90b3R5cGUucHJldmlvdXNJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbihhLHIsdCl7YS5vcGFjaXR5LnNldCgxKSxhLnBhcmVudFRyYW5zZm9ybS5oYWx0KCk7dmFyIGk9dGhpcy5nZXRDZW50ZXJlZFBvc2l0aW9uKHRoaXMuY29udHJvbGxlci5pbmRleCk7aWYoYS5vcGFjaXR5LnNldCgwLHtjdXJ2ZTpcImxpbmVhclwiLGR1cmF0aW9uOnRoaXMub3B0aW9ucy50cmFuc2l0aW9uLnBlcmlvZHx8dGhpcy5vcHRpb25zLnRyYW5zaXRpb24uZHVyYXRpb259KSx0KXt2YXIgbj1baVswXSxpWzFdLC0yXTtuW3RoaXMuYXhpc109clt0aGlzLmF4aXNdLGEucGFyZW50VHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKG5bMF0sblsxXSxuWzJdKSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiksYS5wYXJlbnRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoaVswXSxpWzFdLGlbMl0pLHtjdXJ2ZTpcImxpbmVhclwiLGR1cmF0aW9uOjF9KX1lbHNle3ZhciBzPVRyYW5zZm9ybS50cmFuc2xhdGUoaVswXSxpWzFdLC0yKSxvPVtpWzBdLGlbMV0sLTIqU2luZ3VsYXJQYXJhbGxheC5EZXB0aF07b1t0aGlzLmF4aXNdPS1hLnNpemVbdGhpcy5heGlzXSp0aGlzLm9wdGlvbnMucGFyYWxsYXhSYXRpbyxhLnBhcmVudFRyYW5zZm9ybS5zZXQocyksYS5wYXJlbnRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUob1swXSxvWzFdLG9bMl0pLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKX19LG1vZHVsZS5leHBvcnRzPVNpbmd1bGFyUGFyYWxsYXg7IiwiZnVuY3Rpb24gU2luZ3VsYXJTbGlkZUJlaGluZChpKXtTaW5ndWxhckxheW91dC5jYWxsKHRoaXMsaSl9dmFyIFNpbmd1bGFyTGF5b3V0PXJlcXVpcmUoXCIuL1Npbmd1bGFyTGF5b3V0XCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLElzSUU9cmVxdWlyZShcIi4uL2RvbS9JRVwiKTtTaW5ndWxhclNsaWRlQmVoaW5kLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFNpbmd1bGFyTGF5b3V0LnByb3RvdHlwZSksU2luZ3VsYXJTbGlkZUJlaGluZC5wcm90b3R5cGUuY29uc3RydWN0b3I9U2luZ3VsYXJTbGlkZUJlaGluZCxTaW5ndWxhclNsaWRlQmVoaW5kLmlkPVwiU2luZ3VsYXJTbGlkZUJlaGluZFwiLFNpbmd1bGFyU2xpZGVCZWhpbmQuREVGQVVMVF9PUFRJT05TPXtkdXJhdGlvbjo2MDAscm90YXRpb25BbmdsZTpNYXRoLlBJLzR9LFNpbmd1bGFyU2xpZGVCZWhpbmQuRmlyc3RDdXJ2ZT1cImVhc2VJbk91dFwiLFNpbmd1bGFyU2xpZGVCZWhpbmQuU2Vjb25kQ3VydmU9XCJlYXNlSW5PdXRcIixTaW5ndWxhclNsaWRlQmVoaW5kLkR1cmF0aW9uUmF0aW89MS8zLFNpbmd1bGFyU2xpZGVCZWhpbmQuT2Zmc2V0RmFjdG9yPS41LFNpbmd1bGFyU2xpZGVCZWhpbmQuekluZGV4PS01MDAsU2luZ3VsYXJTbGlkZUJlaGluZC5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKGksZSxuKXt2YXIgcix0LGEsbztuPyhyPVsuNSwxXSx0PVsuNSwxXSxhPTEsbz1pLnNpemVbMV0qU2luZ3VsYXJTbGlkZUJlaGluZC5PZmZzZXRGYWN0b3IpOihyPVsuNSwwXSx0PVsuNSwwXSxhPS0xLG89aS5zaXplWzFdKlNpbmd1bGFyU2xpZGVCZWhpbmQuT2Zmc2V0RmFjdG9yKi0xKTt2YXIgZD10aGlzLm9wdGlvbnMuZHVyYXRpb24qU2luZ3VsYXJTbGlkZUJlaGluZC5EdXJhdGlvblJhdGlvLGw9KHRoaXMub3B0aW9ucy5kdXJhdGlvbi1kLHtkdXJhdGlvbjpkLGN1cnZlOlNpbmd1bGFyU2xpZGVCZWhpbmQuRmlyc3RDdXJ2ZX0pLHM9e2R1cmF0aW9uOmQsY3VydmU6U2luZ3VsYXJTbGlkZUJlaGluZC5TZWNvbmRDdXJ2ZX07aS5jaGlsZE9yaWdpbi5zZXQociksaS5jaGlsZEFsaWduLnNldCh0KSxpLm9wYWNpdHkuc2V0KDEsbCksaS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLm11bHRpcGx5KFRyYW5zZm9ybS50cmFuc2xhdGUoMCwwLFNpbmd1bGFyU2xpZGVCZWhpbmQuekluZGV4KSxUcmFuc2Zvcm0ucm90YXRlWCh0aGlzLm9wdGlvbnMucm90YXRpb25BbmdsZSphKSkpLGkuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoMCxvLFNpbmd1bGFyU2xpZGVCZWhpbmQuekluZGV4LzIpLGwsZnVuY3Rpb24oKXtJc0lFJiZpLml0ZW0uc2V0UHJvcGVydGllcyh7ekluZGV4OjF9KSxpLmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0uaWRlbnRpdHkscyl9KSx0aGlzLmNlbnRlckl0ZW0odGhpcy5jb250cm9sbGVyLmluZGV4KX0sU2luZ3VsYXJTbGlkZUJlaGluZC5wcm90b3R5cGUucHJldmlvdXNJdGVtVHJhbnNpdGlvbj1mdW5jdGlvbihpLGUsbil7dmFyIHIsdCxhLG87bj8ocj1bLjUsMF0sdD1bLjUsMF0sYT0tMSxvPWkuc2l6ZVsxXSpTaW5ndWxhclNsaWRlQmVoaW5kLk9mZnNldEZhY3RvciotMSk6KHI9Wy41LDFdLHQ9Wy41LDFdLGE9MSxvPWkuc2l6ZVsxXSpTaW5ndWxhclNsaWRlQmVoaW5kLk9mZnNldEZhY3Rvcik7dmFyIGQ9dGhpcy5vcHRpb25zLmR1cmF0aW9uKlNpbmd1bGFyU2xpZGVCZWhpbmQuRHVyYXRpb25SYXRpbyxsPXtkdXJhdGlvbjpkLGN1cnZlOlNpbmd1bGFyU2xpZGVCZWhpbmQuRmlyc3RDdXJ2ZX0scz17ZHVyYXRpb246dGhpcy5vcHRpb25zLmR1cmF0aW9uLWQsY3VydmU6U2luZ3VsYXJTbGlkZUJlaGluZC5TZWNvbmRDdXJ2ZX07aS5jaGlsZE9yaWdpbi5zZXQociksaS5jaGlsZEFsaWduLnNldCh0KSxpLmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0ubXVsdGlwbHkoVHJhbnNmb3JtLnRyYW5zbGF0ZSgwLG8pLFRyYW5zZm9ybS5yb3RhdGVYKHRoaXMub3B0aW9ucy5yb3RhdGlvbkFuZ2xlKmEpKSxsLGZ1bmN0aW9uKCl7SXNJRSYmaS5pdGVtLnNldFByb3BlcnRpZXMoe3pJbmRleDotMX0pLGkub3BhY2l0eS5zZXQoMCxzKSxpLmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0udHJhbnNsYXRlKDAsMCxTaW5ndWxhclNsaWRlQmVoaW5kLnpJbmRleCkscyl9LmJpbmQodGhpcykpLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIubGFzdEluZGV4KX0sbW9kdWxlLmV4cG9ydHM9U2luZ3VsYXJTbGlkZUJlaGluZDsiLCJmdW5jdGlvbiBTaW5ndWxhclNsaWRlSW4oaSl7U2luZ3VsYXJMYXlvdXQuY2FsbCh0aGlzLGkpLHRoaXMub3B0aW9ucy5kaXJlY3Rpb249dGhpcy5vcHRpb25zLmRpcmVjdGlvbi50b0xvd2VyQ2FzZSgpfXZhciBTaW5ndWxhckxheW91dD1yZXF1aXJlKFwiLi9TaW5ndWxhckxheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKTtTaW5ndWxhclNsaWRlSW4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlKSxTaW5ndWxhclNsaWRlSW4ucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyU2xpZGVJbixTaW5ndWxhclNsaWRlSW4uaWQ9XCJTaW5ndWxhclNsaWRlSW5cIixTaW5ndWxhclNsaWRlSW4uREVGQVVMVF9PUFRJT05TPXt0cmFuc2l0aW9uOntjdXJ2ZTpcImVhc2VPdXRcIixkdXJhdGlvbjo2MDB9LGRlbGF5UmF0aW86LjE1LGRpcmVjdGlvbjpcInlcIn0sU2luZ3VsYXJTbGlkZUluLnByb3RvdHlwZS5jdXJyZW50SXRlbVRyYW5zaXRpb249ZnVuY3Rpb24oaSx0LG8pe3ZhciBuPXRoaXMub3B0aW9ucy50cmFuc2l0aW9uLHI9bi5kdXJhdGlvbnx8bi5wZXJpb2QsZT1yKnRoaXMub3B0aW9ucy5kZWxheVJhdGlvO3ItPWU7dmFyIGEscyxsPW4ubWV0aG9kP3twZXJpb2Q6cixtZXRob2Q6bi5tZXRob2QsZGFtcGluZ1JhdGlvOm4uZGFtcGluZ1JhdGlvfTp7ZHVyYXRpb246cixjdXJ2ZTpuLmN1cnZlfTtvP1wieFwiPT09dGhpcy5vcHRpb25zLmRpcmVjdGlvbj8oYT10WzBdLHM9MCk6KGE9MCxzPS0xKnRbMV0pOlwieFwiPT09dGhpcy5vcHRpb25zLmRpcmVjdGlvbj8oYT0tMSp0WzBdLHM9MCk6KGE9MCxzPXRbMV0pLGkub3BhY2l0eS5zZXQoMSksaS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnRyYW5zbGF0ZShhLHMpKSxpLm9wYWNpdHkuZGVsYXkoZSxmdW5jdGlvbigpe2kuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS50cmFuc2xhdGUoMCwwKSxsKX0pLHRoaXMuY2VudGVySXRlbSh0aGlzLmNvbnRyb2xsZXIuaW5kZXgpfSxTaW5ndWxhclNsaWRlSW4ucHJvdG90eXBlLnByZXZpb3VzSXRlbVRyYW5zaXRpb249ZnVuY3Rpb24oaSx0LG8pe3ZhciBuLHIsZTtvPyhcInhcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/KG49WzAsLjVdLHI9WzAsLjVdKToobj1bLjUsMV0scj1bLjUsMV0pLGU9MSk6KFwieFwiPT09dGhpcy5vcHRpb25zLmRpcmVjdGlvbj8obj1bMSwuNV0scj1bMSwuNV0pOihuPVsuNSwwXSxyPVsuNSwwXSksZT0tMSksaS5jaGlsZE9yaWdpbi5zZXQobiksaS5jaGlsZEFsaWduLnNldChyKSxcInhcIj09PXRoaXMub3B0aW9ucy5kaXJlY3Rpb24/aS5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnJvdGF0ZVkoTWF0aC5QSS80KmUpLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKTppLmNoaWxkVHJhbnNmb3JtLnNldChUcmFuc2Zvcm0ucm90YXRlWChNYXRoLlBJLzMqZSksdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pLGkub3BhY2l0eS5zZXQoMCx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiksdGhpcy5jZW50ZXJJdGVtKHRoaXMuY29udHJvbGxlci5sYXN0SW5kZXgpfSxtb2R1bGUuZXhwb3J0cz1TaW5ndWxhclNsaWRlSW47IiwiZnVuY3Rpb24gU2luZ3VsYXJTb2Z0U2NhbGUodCl7U2luZ3VsYXJMYXlvdXQuY2FsbCh0aGlzLHQpfXZhciBTaW5ndWxhckxheW91dD1yZXF1aXJlKFwiLi9TaW5ndWxhckxheW91dFwiKSxUcmFuc2Zvcm09cmVxdWlyZShcImZhbW91cy9jb3JlL1RyYW5zZm9ybVwiKSxVdGlsaXR5PXJlcXVpcmUoXCJmYW1vdXMvdXRpbGl0aWVzL1V0aWxpdHlcIik7U2luZ3VsYXJTb2Z0U2NhbGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoU2luZ3VsYXJMYXlvdXQucHJvdG90eXBlKSxTaW5ndWxhclNvZnRTY2FsZS5wcm90b3R5cGUuY29uc3RydWN0b3I9U2luZ3VsYXJTb2Z0U2NhbGUsU2luZ3VsYXJTb2Z0U2NhbGUuaWQ9XCJTaW5ndWxhclNvZnRTY2FsZVwiLFNpbmd1bGFyU29mdFNjYWxlLkRFRkFVTFRfT1BUSU9OUz17dHJhbnNpdGlvbjp7ZHVyYXRpb246NjAwLGN1cnZlOlwiZWFzZU91dFwifSxzY2FsZVVwVmFsdWU6MS4zLHNjYWxlRG93blZhbHVlOi45LGRlbGF5UmF0aW86LjA1fSxTaW5ndWxhclNvZnRTY2FsZS5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKHQsbyxhKXt2YXIgaT1hP3RoaXMub3B0aW9ucy5zY2FsZURvd25WYWx1ZTp0aGlzLm9wdGlvbnMuc2NhbGVVcFZhbHVlO3Qub3BhY2l0eS5zZXQoMCksdC5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnNjYWxlKGksaSkpO3ZhciBlPXRoaXMub3B0aW9ucy50cmFuc2l0aW9uLHI9ZS5kdXJhdGlvbnx8ZS5wZXJpb2Qsbj1yKnRoaXMub3B0aW9ucy5kZWxheVJhdGlvO3ItPW47dmFyIGw9ZS5tZXRob2Q/e3BlcmlvZDpyLGRhbXBpbmdSYXRpbzplLmRhbXBpbmdSYXRpbyxtZXRob2Q6ZS5tZXRob2R9OntkdXJhdGlvbjpyLGN1cnZlOmUuY3VydmV9O3Qub3BhY2l0eS5kZWxheShuLGZ1bmN0aW9uKCl7dC5vcGFjaXR5LnNldCgxLGwpLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5zY2FsZSgxLDEpLGwpfSl9LFNpbmd1bGFyU29mdFNjYWxlLnByb3RvdHlwZS5wcmV2aW91c0l0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKHQsbyxhKXt2YXIgaT1hP3RoaXMub3B0aW9ucy5zY2FsZVVwVmFsdWU6dGhpcy5vcHRpb25zLnNjYWxlRG93blZhbHVlLGU9dGhpcy5vcHRpb25zLnRyYW5zaXRpb24scj1lLm1ldGhvZD97cGVyaW9kOi40NSplLnBlcmlvZCxtZXRob2Q6ZS5tZXRob2QsZGFtcGluZ1JhdGlvOmUuZGFtcGluZ1JhdGlvfTp7ZHVyYXRpb246LjQ1KmUuZHVyYXRpb24sY3VydmU6ZS5jdXJ2ZX07dC5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLnNjYWxlKGksaSksZSksdC5vcGFjaXR5LnNldCgwLHIpfSxtb2R1bGUuZXhwb3J0cz1TaW5ndWxhclNvZnRTY2FsZTsiLCJmdW5jdGlvbiBTaW5ndWxhclR3aXN0KHQpe1Npbmd1bGFyTGF5b3V0LmNhbGwodGhpcyx0KSx0aGlzLm9wdGlvbnMuZGlyZWN0aW9uPXRoaXMub3B0aW9ucy5kaXJlY3Rpb24udG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBfZ2V0VHJhbnNmb3JtRnJvbURpcmVjdGlvbih0LGkscil7cmV0dXJuXCJ4XCI9PT10P1RyYW5zZm9ybS50aGVuTW92ZShUcmFuc2Zvcm0ucm90YXRlWShpKSxbMCwwLHJdKTpUcmFuc2Zvcm0udGhlbk1vdmUoVHJhbnNmb3JtLnJvdGF0ZVgoaSksWzAsMCxyXSl9dmFyIFNpbmd1bGFyTGF5b3V0PXJlcXVpcmUoXCIuL1Npbmd1bGFyTGF5b3V0XCIpLFRyYW5zZm9ybT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvVHJhbnNmb3JtXCIpLFV0aWxpdHk9cmVxdWlyZShcImZhbW91cy91dGlsaXRpZXMvVXRpbGl0eVwiKSxJc0lFPXJlcXVpcmUoXCIuLi9kb20vSUVcIik7U2luZ3VsYXJUd2lzdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTaW5ndWxhckxheW91dC5wcm90b3R5cGUpLFNpbmd1bGFyVHdpc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yPVNpbmd1bGFyVHdpc3QsU2luZ3VsYXJUd2lzdC5pZD1cIlNpbmd1bGFyVHdpc3RcIixTaW5ndWxhclR3aXN0LkRFRkFVTFRfT1BUSU9OUz17dHJhbnNpdGlvbjp7bWV0aG9kOlwic3ByaW5nXCIsZGFtcGluZ1JhdGlvOi44NSxwZXJpb2Q6NjAwfSxkaXJlY3Rpb246XCJ4XCIsZmxpcERpcmVjdGlvbjohMSxkZXB0aDotMTUwMH0sU2luZ3VsYXJUd2lzdC5wcm90b3R5cGUuY3VycmVudEl0ZW1UcmFuc2l0aW9uPWZ1bmN0aW9uKHQsaSxyKXt0LmNoaWxkVHJhbnNmb3JtLmhhbHQoKSx0Lm9wYWNpdHkuc2V0KDEpLElzSUUmJnQuaXRlbS5zZXRQcm9wZXJ0aWVzKHt6SW5kZXg6MX0pO3ZhciBvO3I/KG89X2dldFRyYW5zZm9ybUZyb21EaXJlY3Rpb24odGhpcy5vcHRpb25zLmRpcmVjdGlvbiwuOTkqTWF0aC5QSSx0aGlzLm9wdGlvbnMuZGVwdGgpLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KG8pLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSx0aGlzLm9wdGlvbnMudHJhbnNpdGlvbikpOihvPV9nZXRUcmFuc2Zvcm1Gcm9tRGlyZWN0aW9uKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24sLjk5Ki1NYXRoLlBJLHRoaXMub3B0aW9ucy5kZXB0aCksdC5jaGlsZFRyYW5zZm9ybS5zZXQobyksdC5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5LHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSksdGhpcy5jZW50ZXJJdGVtKHRoaXMuY29udHJvbGxlci5pbmRleCl9LFNpbmd1bGFyVHdpc3QucHJvdG90eXBlLnByZXZpb3VzSXRlbVRyYW5zaXRpb249ZnVuY3Rpb24odCxpLHIpe3QuY2hpbGRUcmFuc2Zvcm0uaGFsdCgpLHQub3BhY2l0eS5zZXQoMSksSXNJRSYmdC5pdGVtLnNldFByb3BlcnRpZXMoe3pJbmRleDotMX0pO3ZhciBvO3I/KHQuY2hpbGRUcmFuc2Zvcm0uc2V0KFRyYW5zZm9ybS5pZGVudGl0eSksbz1fZ2V0VHJhbnNmb3JtRnJvbURpcmVjdGlvbih0aGlzLm9wdGlvbnMuZGlyZWN0aW9uLC45OSotTWF0aC5QSSx0aGlzLm9wdGlvbnMuZGVwdGgpLHQuY2hpbGRUcmFuc2Zvcm0uc2V0KG8sdGhpcy5vcHRpb25zLnRyYW5zaXRpb24pKToodC5jaGlsZFRyYW5zZm9ybS5zZXQoVHJhbnNmb3JtLmlkZW50aXR5KSxvPV9nZXRUcmFuc2Zvcm1Gcm9tRGlyZWN0aW9uKHRoaXMub3B0aW9ucy5kaXJlY3Rpb24sLjk5Kk1hdGguUEksdGhpcy5vcHRpb25zLmRlcHRoKSx0LmNoaWxkVHJhbnNmb3JtLnNldChvLHRoaXMub3B0aW9ucy50cmFuc2l0aW9uKSksdGhpcy5jZW50ZXJJdGVtKHRoaXMuY29udHJvbGxlci5sYXN0SW5kZXgpfSxtb2R1bGUuZXhwb3J0cz1TaW5ndWxhclR3aXN0OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbmZ1bmN0aW9uIEZhbW91c0NvbnRhaW5lcihlLG4pe3ZhciBvPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZSksYT1FbmdpbmUuY3JlYXRlQ29udGV4dChvKTtuIGluc3RhbmNlb2YgRmFtb3VzUGx1Z2lufHwobj1uKCkpO3ZhciBzPW4uaW5pdChDbGFzc1RvSW1hZ2VzKGUpKTtyZXR1cm4gYS5hZGQocyksc312YXIgRmFtb3VzUGx1Z2luPXJlcXVpcmUoXCIuL0ZhbW91c1BsdWdpblwiKSxDbGFzc1RvSW1hZ2VzPXJlcXVpcmUoXCIuLi9kb20vQ2xhc3NUb0ltYWdlc1wiKSxFbmdpbmU9cmVxdWlyZShcImZhbW91cy9jb3JlL0VuZ2luZVwiKTtFbmdpbmUuc2V0T3B0aW9ucyh7YXBwTW9kZTohMX0pLGdsb2JhbC5GYW1vdXNDb250YWluZXI9RmFtb3VzQ29udGFpbmVyLG1vZHVsZS5leHBvcnRzPUZhbW91c0NvbnRhaW5lcjtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsImZ1bmN0aW9uIEZhbW91c1BsdWdpbigpe31GYW1vdXNQbHVnaW4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt9LG1vZHVsZS5leHBvcnRzPUZhbW91c1BsdWdpbjsiLCJmdW5jdGlvbiBGYW1vdXNDYXJvdXNlbChlKXtyZXR1cm4gZXx8KGU9e30pLG5ldyBDYXJvdXNlbFBsdWdpbihlKX1mdW5jdGlvbiBDYXJvdXNlbFBsdWdpbihlKXtGYW1vdXNQbHVnaW4uYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMub3B0cz1lfXJlcXVpcmUoXCIuLi9zdHlsZXNcIikscmVxdWlyZShcImZhbW91cy1wb2x5ZmlsbHNcIik7dmFyIEVuZ2luZT1yZXF1aXJlKFwiZmFtb3VzL2NvcmUvRW5naW5lXCIpLE1vZGlmaWVyPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9Nb2RpZmllclwiKSxUaW1lcj1yZXF1aXJlKFwiZmFtb3VzL3V0aWxpdGllcy9UaW1lclwiKSxSZWdpc3RlckVhc2luZz1yZXF1aXJlKFwiLi4vcmVnaXN0cmllcy9FYXNpbmdcIiksUmVnaXN0ZXJQaHlzaWNzPXJlcXVpcmUoXCIuLi9yZWdpc3RyaWVzL1BoeXNpY3NcIiksQ2xhc3NUb0ltYWdlcz1yZXF1aXJlKFwiLi4vZG9tL0NsYXNzVG9JbWFnZXNcIiksQ2Fyb3VzZWw9cmVxdWlyZShcIi4uL0Nhcm91c2VsXCIpLEZhbW91c0NvbnRhaW5lcj1yZXF1aXJlKFwiLi9GYW1vdXNDb250YWluZXJcIiksRmFtb3VzUGx1Z2luPXJlcXVpcmUoXCIuL0ZhbW91c1BsdWdpblwiKTtDYXJvdXNlbFBsdWdpbi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShGYW1vdXNQbHVnaW4ucHJvdG90eXBlKSxDYXJvdXNlbFBsdWdpbi5wcm90b3R5cGUuY29uc3RydWN0b3I9Q2Fyb3VzZWxQbHVnaW4sQ2Fyb3VzZWxQbHVnaW4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5vcHRzLml0ZW1zfHwodGhpcy5vcHRzLml0ZW1zPWUpO3ZhciB1PW5ldyBDYXJvdXNlbCh0aGlzLm9wdHMsITApO3JldHVybiB1fSxGYW1vdXNDYXJvdXNlbC5HcmlkTGF5b3V0PUNhcm91c2VsLkdyaWRMYXlvdXQsRmFtb3VzQ2Fyb3VzZWwuQ292ZXJmbG93TGF5b3V0PUNhcm91c2VsLkNvdmVyZmxvd0xheW91dCxGYW1vdXNDYXJvdXNlbC5TZXF1ZW50aWFsTGF5b3V0PUNhcm91c2VsLlNlcXVlbnRpYWxMYXlvdXQsRmFtb3VzQ2Fyb3VzZWwuU2luZ3VsYXJPcGFjaXR5PUNhcm91c2VsLlNpbmd1bGFyT3BhY2l0eSxGYW1vdXNDYXJvdXNlbC5TaW5ndWxhclNsaWRlSW49Q2Fyb3VzZWwuU2luZ3VsYXJTbGlkZUluLEZhbW91c0Nhcm91c2VsLlNpbmd1bGFyU2xpZGVCZWhpbmQ9Q2Fyb3VzZWwuU2luZ3VsYXJTbGlkZUJlaGluZCxGYW1vdXNDYXJvdXNlbC5TaW5ndWxhclBhcmFsbGF4PUNhcm91c2VsLlNpbmd1bGFyUGFyYWxsYXgsRmFtb3VzQ2Fyb3VzZWwuU2luZ3VsYXJUd2lzdD1DYXJvdXNlbC5TaW5ndWxhclR3aXN0LEZhbW91c0Nhcm91c2VsLlNpbmd1bGFyU29mdFNjYWxlPUNhcm91c2VsLlNpbmd1bGFyU29mdFNjYWxlLG1vZHVsZS5leHBvcnRzPUZhbW91c0Nhcm91c2VsOyIsImZ1bmN0aW9uIGdldEF2YWlsYWJsZVRyYW5zaXRpb25DdXJ2ZXMoKXtmb3IodmFyIHI9Z2V0S2V5cyhFYXNpbmcpLnNvcnQoKSxlPXt9LG49MDtuPHIubGVuZ3RoO24rKyllW3Jbbl1dPUVhc2luZ1tyW25dXTtyZXR1cm4gZX1mdW5jdGlvbiBnZXRLZXlzKHIpe3ZhciBlLG49W107Zm9yKGUgaW4gcilyLmhhc093blByb3BlcnR5KGUpJiZuLnB1c2goZSk7cmV0dXJuIG59ZnVuY3Rpb24gcmVnaXN0ZXJLZXlzKCl7dmFyIHI9Z2V0QXZhaWxhYmxlVHJhbnNpdGlvbkN1cnZlcygpO2Zvcih2YXIgZSBpbiByKVR3ZWVuVHJhbnNpdGlvbi5yZWdpc3RlckN1cnZlKGUscltlXSl9dmFyIEVhc2luZz1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL0Vhc2luZ1wiKSxUd2VlblRyYW5zaXRpb249cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9Ud2VlblRyYW5zaXRpb25cIik7cmVnaXN0ZXJLZXlzKCk7IiwidmFyIFRyYW5zaXRpb25hYmxlPXJlcXVpcmUoXCJmYW1vdXMvdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGVcIiksU3ByaW5nVHJhbnNpdGlvbj1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1NwcmluZ1RyYW5zaXRpb25cIiksU25hcFRyYW5zaXRpb249cmVxdWlyZShcImZhbW91cy90cmFuc2l0aW9ucy9TbmFwVHJhbnNpdGlvblwiKSxXYWxsVHJhbnNpdGlvbj1yZXF1aXJlKFwiZmFtb3VzL3RyYW5zaXRpb25zL1dhbGxUcmFuc2l0aW9uXCIpO1RyYW5zaXRpb25hYmxlLnJlZ2lzdGVyTWV0aG9kKFwic3ByaW5nXCIsU3ByaW5nVHJhbnNpdGlvbiksVHJhbnNpdGlvbmFibGUucmVnaXN0ZXJNZXRob2QoXCJzbmFwXCIsU25hcFRyYW5zaXRpb24pLFRyYW5zaXRpb25hYmxlLnJlZ2lzdGVyTWV0aG9kKFwid2FsbFwiLFdhbGxUcmFuc2l0aW9uKTsiLCJmdW5jdGlvbiBTbGlkZShlKXtTdXJmYWNlLmNhbGwodGhpcyx7Y29udGVudDplLHNpemU6WyEwLCEwXX0pfXZhciBTdXJmYWNlPXJlcXVpcmUoXCJmYW1vdXMvY29yZS9TdXJmYWNlXCIpO1NsaWRlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKFN1cmZhY2UucHJvdG90eXBlKSxTbGlkZS5wcm90b3R5cGUuY29uc3RydWN0b3I9U2xpZGUsbW9kdWxlLmV4cG9ydHM9U2xpZGU7IiwidmFyIGNzcz1cIi8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcXG4gKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXFxuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy5cXG4gKlxcbiAqIE93bmVyOiBtYXJrQGZhbW8udXNcXG4gKiBAbGljZW5zZSBNUEwgMi4wXFxuICogQGNvcHlyaWdodCBGYW1vdXMgSW5kdXN0cmllcywgSW5jLiAyMDE0XFxuICovXFxuLmZhbW91cy1jb250YWluZXIsIC5mYW1vdXMtZ3JvdXAge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogMHB4O1xcbiAgICBsZWZ0OiAwcHg7XFxuICAgIGJvdHRvbTogMHB4O1xcbiAgICByaWdodDogMHB4O1xcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcbiAgICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcbiAgICAtd2Via2l0LWJhY2tmYWNlLXZpc2liaWxpdHk6IHZpc2libGU7XFxuICAgIGJhY2tmYWNlLXZpc2liaWxpdHk6IHZpc2libGU7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cXG4uZmFtb3VzLWdyb3VwIHtcXG4gICAgd2lkdGg6IDBweDtcXG4gICAgaGVpZ2h0OiAwcHg7XFxuICAgIG1hcmdpbjogMHB4O1xcbiAgICBwYWRkaW5nOiAwcHg7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gICAgdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG59XFxuXFxuLmZhbW91cy1zdXJmYWNlIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XFxuICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XFxuICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgICBiYWNrZmFjZS12aXNpYmlsaXR5OiBoaWRkZW47XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtLXN0eWxlOiBmbGF0O1xcbiAgICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkOyAvKiBwZXJmb3JtYW5jZSAqL1xcbiAgICAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgcG9pbnRlci1ldmVudHM6IGF1dG87XFxufVxcblxcbi5mYW1vdXMtY29udGFpbmVyLWdyb3VwIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cIjtyZXF1aXJlKFwiL1VzZXJzL2ZsaXBzaWRlMTMwMC9Ob2RlL3dpZGdldC1jYXJvdXNlbC9ub2RlX21vZHVsZXMvY3NzaWZ5XCIpKGNzcyksbW9kdWxlLmV4cG9ydHM9Y3NzOyIsInJlcXVpcmUoXCIuL2ZhbW91cy1jYXJvdXNlbC5jc3NcIik7Il19

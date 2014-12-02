(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["VideoPreviewGen"] = factory();
	else
		root["VideoPreviewGen"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global $, _, IScroll */
	//call refresh when content is changed
	//when number of elements changes
	// if you have event handlers - if detecting a click on a specific element
	// if you replace on image with a new image, new image won't detect clicks necessarily
	//call refresh when dimensions change

	/**
	 * config
	 */

	__webpack_require__(1);

	var defaultSettings = {
	    numberOfFrames: 20,
	    el: "#thumbnails"
	};



	//set defaults of thumbnails overriding if user input
	function Thumbnails(settings, cb){
	    _.defaults(this, settings, defaultSettings);
	    this.doneCallback = cb;
	    // if (!options || !options.test)
	        // this.initialize();
	}

	Thumbnails.prototype.render = function(){
	    console.log("rendering modal");
	    $(this.el).append(__webpack_require__(3));
	};

	//tested successfully
	Thumbnails.prototype.initialize = function(){
	    //we need to inject a template here with modal html
	    this.render();
	    this.initializeScrollers();//what's being initialized here? is there a list to init?
	    this._defineCachedJqueryVars();
	    // this.determineWhichScreenToStart();
	    if (hasLargeArray.call(this))
	        this.launchFunctionsforSecondModal();
	    else
	        this.showFirstModal();
	};

	//tests to see if additional information is needed to launch iscrolls
	function hasLargeArray (){
	    // check to see if there's already an array of images
	    //if true, then hasLargeArray.call
	    return this.initialLargeArrayOfImages && this.initialLargeArrayOfImages.length;
	}

	//test to
	Thumbnails.prototype.showFirstModal = function (){
	    this.$firstModal.modal("show");
	    this.firstSubmitButton();
	};

	function hasNewArrayForSelection(){
	    return this.newArrayForSelection && this.newArrayForSelection.length;
	}

	//
	Thumbnails.prototype.showSecondModal = function(){
	    this.$secondModal.modal("show");
	    this.updateHtmlListInFirstScroller();//this requires the LI
	};

	//test similarly to hasLargeArray
	Thumbnails.prototype.launchFunctionsforSecondModal = function (){
	    if (!hasNewArrayForSelection.call(this)){
	        this.newFramesetFromWholeSet();
	    }
	    this.showSecondModal();
	};

	Thumbnails.prototype.setImages = function(params){
	    if (params && params.initialLargeArrayOfImages) {
	        console.log('initialLargeArrayOfImages');
	        this.initialLargeArrayOfImages = params.initialLargeArrayOfImages;
	        if (params.selectedImages)
	            this.newArrayForSelection = params.selectedImages;
	    }
	};

	//not testing
	Thumbnails.prototype._defineCachedJqueryVars =function(){
	    console.log("vars");
	    this.$secondModal = $("#secondModal");
	    this.$firstModal =  $("#firstModal");
	    this.$secondModal = $("#secondModal");
	    this.$submitButton =  $("#submitButton");
	    this.$randomButton = $("#random");
	    this.$showFirstPage = $("#showFirstPage");
	    this.$scroller = $("#scroller");
	    this.$scroller2 = $("#scroller2");
	    this.$imagesInScroller = $("#scroller2 li > img");
	    this.$showFirstPage = $("#showFirstPage");
	};

	Thumbnails.prototype.initializeScrollers = function(){
	    var settings = {
	        scrollX: true,
	        scrollY: false,
	        mouseWheel: true,
	        interactiveScrollbars: false,
	        click: true
	    };
	    this.myScroll1 = new IScroll('#wrapper', settings);
	    this.myScroll2 = new IScroll('#wrapper2', settings);
	};

	/**
	 * add html objects
	 */

	Thumbnails.prototype.updateHtmlListInFirstScroller = function(){
	    console.log("called");
	    if(!this.newArrayForSelection){
	        this.newFramesetFromWholeSet();
	    }
	    replaceList(this.$scroller, this.newArrayForSelection);
	    this.getWidth();
	    this.clickFirstImageArrayToGetImage();
	    var self = this;
	    setTimeout(function () {
	        self.myScroll1.refresh();
	    }, 200);
	};

	Thumbnails.prototype.updateHtmlListInSecondScroller = function(){
	    replaceList(this.$scroller2, this.arrayOfImagesToSelectFrom);
	    var self = this;
	    setTimeout(function () {
	        self.myScroll2.refresh();
	    }, 200);
	    // toDo: generate width of second scroller dynamically
	};

	//maps images to html
	//tested successfully
	function createHtmlBlockOfLi(urls){
	    var template = __webpack_require__(4);
	    return _.map(urls, function(url, i){
	        return  template({url: url, i:i});
	        // return "<li id=sample_frame"+i+"><img src="+url+"></img></li>";
	    }).join("");
	}

	function replaceList($el, array){
	    $el.find("ul").html(createHtmlBlockOfLi(array));
	}



	Thumbnails.prototype.determineSizeOfNewArrayForSelection = function(){
	    return this.initialLargeArrayOfImages.length / this.numberOfFrames;
	};

	//Test: is this array generated as expected?
	Thumbnails.prototype.newFramesetFromWholeSet = function(){
	    console.log("new frameset");
	        var sizeOfNewArrayForSelection = this.determineSizeOfNewArrayForSelection();
	        //question -- what does num do below? Why do we need num and index?
	        this.newArrayForSelection = _.map(_.groupBy(this.initialLargeArrayOfImages,function(num, index){
	            return Math.floor(index / sizeOfNewArrayForSelection);
	        }), _.first);
	};



	Thumbnails.prototype.getWidth = function(){
	    console.log("Get width");
	    var lengthOfArray = this.newArrayForSelection.length;
	    var scrollerWidth = (lengthOfArray * 200) + "px";
	    $("#scroller").css({"width": scrollerWidth});
	};

	/**
	 * image array events
	 */

	//unbind for testing
	//handle click event for first array to generate second array
	Thumbnails.prototype.clickFirstImageArrayToGetImage = function(){
	    console.log("clickFirstImageArrayToGetImage function");
	    this.$scroller.find("img").click(clickToGetFirstImage.bind(this));//undefined
	};

	//Test this, using an HTML fixture, to find out if the DOM manipulation behavior is as predicted - are classes being added and removed, are variables being reassigned
	function clickToGetFirstImage (evt) {
	    var $el = $(evt.target);
	    this.$scroller2.show();
	    var $clickedLi = $el.parent();
	    // this.initialIscrollId = $clickedLi.parent().parent().attr('id');
	    $clickedLi.addClass('selected_frame');
	    //added clickedImgUrl to prototype for testing/decoupling purposes
	    this.clickedImgUrl = $el.attr('src');
	    console.log(this.clickedImgUrl);
	    if (this.$initialLi){
	        this.$initialLi.removeClass('selected_frame');
	    }
	    this.$initialLi = $clickedLi;
	    // this.initialImgUrl = clickedImgUrl;
	    this.showSecondScrollerandCallNeighboringImages();
	}

	//testable
	Thumbnails.prototype.getImageIndexFromUrl = function (url) {
	    return _.indexOf(this.newArrayForSelection, url, this);
	};

	//decoupled for testing getNeighboringImages
	Thumbnails.prototype.showSecondScrollerandCallNeighboringImages = function(){
	    this.$scroller2.show();
	    this.getNeighboringImages(this.clickedImgUrl, 7);
	};

	//test to see if arrayOfImagesToSelectFrom is an array
	//pass in dummy values for both params
	Thumbnails.prototype.getNeighboringImages = function(initialImgUrl, arrayLength){
	    console.log("getNeighboringImages function");
	    var index = this.getImageIndexFromUrl(initialImgUrl);
	    console.log(index);
	    var half_array_length = Math.ceil(arrayLength /2);
	    var lowerBound = Math.max(index- half_array_length, 0);
	    var upperBound = Math.min(index+ half_array_length, this.newArrayForSelection.length-1);
	    if(lowerBound === 0){
	        upperBound = arrayLength;
	    }
	    if(upperBound === this.newArrayForSelection.length-1){
	        lowerBound = upperBound-arrayLength;
	    }
	    this.arrayOfImagesToSelectFrom = this.newArrayForSelection.slice(lowerBound, upperBound);
	    this.updateHtmlListInSecondScroller();
	    this.selectReplacementImage();
	    //refresh
	};

	//For testing: unbind and create single function
	Thumbnails.prototype.selectReplacementImage = function(){
	    console.log("selectReplacementImage function");
	    this.$scroller2.find("li > img").click(clickToSelectImage.bind(this));
	};

	//Test to see if original array is updated and a new replacement frame is chosen
	function clickToSelectImage(evt){
	    var $el= $(evt.target);
	    var $replacementLi = $el.parent();
	    console.log($replacementLi);
	    this.replacementSelectedFrameId = $replacementLi.attr('id');
	    $replacementLi.addClass('replacement_frame');
	    var $replacementImgUrl = $el.attr('src');
	    if (this.$replacementLi){
	        //place in seperate function
	       this.$replacementLi.removeClass('replacement_frame');
	        if(this.$replacementImgUrl === $replacementImgUrl){
	            this.updateOriginal();
	        }
	    }
	    this.$replacementLi = $replacementLi;
	    this.$replacementImgUrl = $replacementImgUrl;
	}



	/**
	 * data management after array alteration
	 */

	//modified subarray
	Thumbnails.prototype.generateNewArrayOfImagesFromModifiedScroller = function(){
	    var arr = [];
	    $('#scroller ul li img').each(function(){
	        arr.push($(this).attr('src'));
	    });
	    this.newArrayForSelection = arr;
	    return this.newArrayForSelection;
	};

	//replace frame and close second iscroll
	Thumbnails.prototype.updateOriginal = function(){
	    this.$initialLi.find('img').attr('src', this.$replacementImgUrl);//this is the problem-
	    this.replacementImgUrl = undefined;
	    this.$replacementLi = undefined;
	    this.$scroller2.hide();
	    this.generateNewArrayOfImagesFromModifiedScroller();
	    // this.serialize();
	};

	//Set up empty test
	//called by the developer
	Thumbnails.prototype.serialize = function () {
	    // var objToConvertToJson = {};
	    // objToConvertToJson.arrayOfImages = this.newArrayForSelection;
	    // this.newJsonOfSelection = JSON.stringify(objToConvertToJson);
	    // console.log("JSON");
	    // console.log(this.newJsonOfSelection);
	    // var array = JSON.parse(JSON.stringify(this.newArrayForSelection));
	    var array = _.clone(this.newArrayForSelection);
	    // return this.newJsonOfSelection;
	    return {
	        images: array
	    };
	};

	Thumbnails.prototype.onDone = function(){
	    if(_.isFunction(this.doneCallback))
	        this.doneCallback(this.serialize());
	    this.cleanUp();
	};

	Thumbnails.prototype.cleanUp = function(){
	    //toDo: cleanup
	    this.$secondModal.modal("hide");
	};

	/**
	 * jquery click events
	 */



	Thumbnails.prototype.selectReplacementImage = function(){
	    console.log("selectReplacementImage function");
	    this.$scroller2.find("li > img").click(clickToSelectImage.bind(this));
	    };


	function clickToSelectImage(evt){
	    var $el= $(evt.target);
	    var $replacementLi = $el.parent();
	    console.log($replacementLi);
	    this.replacementSelectedFrameId = $replacementLi.attr('id');
	    $replacementLi.addClass('replacement_frame');
	    var $replacementImgUrl = $el.attr('src');
	    if (this.$replacementLi){
	       this.$replacementLi.removeClass('replacement_frame');
	        if(this.$replacementImgUrl === $replacementImgUrl){
	            this.updateOriginal();
	        }
	    }
	    this.$replacementLi = $replacementLi;
	    this.$replacementImgUrl = $replacementImgUrl;
	}


	/**
	 * buttons
	 */

	//toggle to form
	Thumbnails.prototype.navToFirst = function(){
	    this.showFirstPage.click(clickToNavToFirst.bind(this));
	};

	//navigate to the first page while retaining values
	function clickToNavToFirst(evt){
	    var $el= $(evt.target);
	        this.$secondModal.modal("hide");
	        this.$firstModal.modal("show");
	        this.firstSubmitButton();
	}

	module.exports = Thumbnails;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(5)
		// The css code:
		(__webpack_require__(2));
	// Hot Module Replacement
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"button {\n  width: 90px;\n  height: 20px;\n  color: red;\n}\n.modal-dialog {\n  width: 900px;\n}\n.form-group {\n  width: 200px;\n}\n.selected_frame {\n  opacity: .5;\n}\n.replacement_frame {\n  opacity: .70;\n}\n#container {\n  width: 500px;\n  height: 300px;\n  background-color: red;\n  border: 1px solid #000;\n  background-position: center center;\n  background-repeat: no-repeat;\n}\n#img {\n  width: 500px;\n  height: 300px;\n}\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\nhtml {\n  -ms-touch-action: none;\n}\nbody,\nul,\nli {\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\nbody {\n  font-size: 12px;\n  font-family: ubuntu, helvetica, arial;\n}\n.wrapper {\n  z-index: 1;\n  width: 100%;\n  overflow: hidden;\n}\n#scroller {\n  width: 5000px;\n  height: 200px;\n}\n#scroller2 {\n  width: 1600px;\n  height: 200px;\n}\n.scroller {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  /*ßbackground-color: #a00;*/\n  -webkit-transform: translateZ(0);\n  -moz-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-text-size-adjust: none;\n  -moz-text-size-adjust: none;\n  -ms-text-size-adjust: none;\n  -o-text-size-adjust: none;\n  text-size-adjust: none;\n}\n.scroller ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  width: 100%;\n  height: 50%;\n  text-align: center;\n}\n.scroller li {\n  display: block;\n  float: left;\n  width: 200px;\n  height: 100px;\n  border-right: 1px solid #ccc;\n  background-color: #fafafa;\n  font-size: 14px;\n}\n";

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(6);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div id=\"secondModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"basicModal\" aria-hidden=\"false\" class=\"modal fade container col-md-12\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\"></button><h4 id=\"myModalLabel\" class=\"modal-title\">Modal title</h4></div><div class=\"modal-body\"><div id=\"wrapper\" class=\"wrapper\"><div id=\"scroller\" class=\"scroller\"><ul id=\"frames\"></ul></div></div><div id=\"wrapper2\" class=\"wrapper\"><div id=\"scroller2\" class=\"scroller\"><ul id=\"frames2\"></ul></div></div><form role=\"form\" position:\"top=\"\"><div class=\"form_group\"><div class=\"row\"><div id=\"arrayLengthButton\"></div></div></div></form></div></div></div></div>");;return buf.join("");
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(6);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (i, url) {
	buf.push("<li" + (jade.attr("id", "sample_frame"+i, true, false)) + "><img" + (jade.attr("src", url, true, false)) + "/></li>");}.call(this,"i" in locals_for_with?locals_for_with.i:typeof i!=="undefined"?i:undefined,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));;return buf.join("");
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function addStyle(cssCode) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(styleElement);
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		return function() {
			head.removeChild(styleElement);
		};
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	exports.escape = function escape(html){
	  var result = String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(7).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* (ignored) */

/***/ }
/******/ ])
});

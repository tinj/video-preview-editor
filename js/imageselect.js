/* global $, _, IScroll */
//call refresh when content is changed
//when number of elements changes
// if you have event handlers - if detecting a click on a specific element
// if you replace on image with a new image, new image won't detect clicks necessarily
//call refresh when dimensions change

/**
 * config
 */

require('../styles/styles.less');

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
    $(this.el).append(require('../templates/modal.jade'));
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
    var template = require('../templates/scrollerLi.jade');
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
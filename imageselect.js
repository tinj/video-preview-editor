/* global $, _, IScroll */


/**
 * config
 */

var defaultSettings = {
    numberOfFrames: 20
};

//set defaults of thumbnails overriding if user input
function Thumbnails(settings){
    _.defaults(this, settings, defaultSettings);
    this.initialize();
}

//calls functions to generate arrays of images and enables selections
Thumbnails.prototype.initialize = function(){
    this.defineCachedJqueryVars();
    this.initializeImageArrays();
    this.updateHtmlListInFirstScroller();
    this.clickFirstImageArrayToGetImage();
    this.determineWhichScreenToStart();
};

Thumbnails.prototype.defineCachedJqueryVars =function(){
    console.log("vars");
    this.$secondModal = $("#secondModal");
    this.$firstModal =  $("#firstModal");
    this.$secondModal = $("#secondModal");
    this.$submitButton =  $("#submitButton");
    this.$showFirstPage = $("#showFirstPage");
    this.$scroller = $("#scroller");
    this.$scroller2 = $("#scroller2");
    this.$currentUrl = $("#currentUrl");
    this.$imagesInScroller = $("#scroller2 li > img");
};

Thumbnails.prototype.initializeImageArrays = function(){
    var settings = {
        scrollX: true,
        scrollY: false,
        mouseWheel: true,
        click: true
    };
   this.myScroll1 = new IScroll('#wrapper',
        settings);
   this.myScroll2 = new IScroll('#wrapper2',
        settings);
};

//tests to see if additional information is needed to launch iscrolls
Thumbnails.prototype.determineWhichScreenToStart = function(){
    // check to see if there's already an array of images
    if(this.initialLargeArrayOfImages && this.initialLargeArrayOfImages.length){
        if (this.newArrayForSelection && this.newArrayForSelection.length){
            this.$secondModal.modal("show");
        }
        else if(this.numberOfFrames){
            //generate newArrayForSelection
            this.newArrayForSelection = this.newFramesetFromWholeSet();
            this.$secondModal.modal("show");
        }
    }
    else{
        this.$firstModal.modal("show");
        firstSubmitButton();
    }
};


/**
 * add html objects
 */

//add new smaller array to first iscroll
Thumbnails.prototype.updateHtmlListInFirstScroller = function(){
    if(this.newArrayForSelection === undefined){
        this.newArrayForSelection = this.newFramesetFromWholeSet();
    }
    replaceList(this.$scroller, this.newArrayForSelection);
};

Thumbnails.prototype.updateHtmlListInSecondScroller = function(){
    replaceList(this.$scroller2, this.arrayOfImagesToSelectFrom);
};

//maps images to html
function createHtmlBlockOfLi(urls){
    return _.map(urls, function(url, i){
        return "<li id=sample_frame"+i+"><img src="+url+"></img></li>";
    }).join("");
}

function replaceList($el, array){
    $el.find("ul").html(createHtmlBlockOfLi(array));
}

//FIXME - this needs to connect to createArrayOfUrls() in imageselectform.js
//generate the smaller subarray that will be shown in first iscroll
Thumbnails.prototype.newFramesetFromWholeSet = function(){
    //check if there's already a subarray
    //
    if (this.sizeOfNewArrayForSelection === undefined){
    this.sizeOfNewArrayForSelection = this.initialLargeArrayOfImages.length / this.numberOfFrames; //5
    }
    //if there isn't one create it from the initial larger array
    if (this.newArrayForSelection===undefined){
    this.newArrayForSelection = _.groupBy(this.initialLargeArrayOfImages,function(num, index){
        return Math.floor(index / this.sizeOfNewArrayForSelection);
    }, this);
   return  _.map(this.newArrayForSelection, function(array){
        return _.first(array);
    });
    }
};

/**
 * image array events
 */

//handle click event for first array to generate second array
Thumbnails.prototype.clickFirstImageArrayToGetImage = function(){
    console.log("clickFirstImageArrayToGetImage function");
    this.$scroller.find("img").click(clickToGetFirstImage.bind(this));
};

function clickToGetFirstImage (evt) {
    var $el = $(evt.target);
    // console.log($el);
    this.$scroller2.show();
    var $clickedLi = $el.parent();
    // this.initialIscrollId = $clickedLi.parent().parent().attr('id');
    $clickedLi.addClass('selected_frame');
    var clickedImgUrl = $el.attr('src'); //not defined
    console.log(clickedImgUrl);
    if (this.$initialLi){
        this.$initialLi.removeClass('selected_frame');
    }
    this.$initialLi = $clickedLi;
    this.initialImgUrl = clickedImgUrl;
    this.getNeighboringImages(7);
}

//TEST ME
//for second iscroll
Thumbnails.prototype.getNeighboringImages = function(arrayLength){
    console.log("getNeighboringImages function");
    this.$scroller2.show();
    var index = _.indexOf(this.initialLargeArrayOfImages, this.initialImgUrl, this);
    console.log(index);
    var half_array_length = Math.ceil(arrayLength /2);
    var lowerBound = Math.max(index- half_array_length, 0);
    var upperBound = Math.min(index+ half_array_length, this.initialLargeArrayOfImages.length-1);
    if(lowerBound === 0){
        upperBound = arrayLength;
    }
    if(upperBound === this.initialLargeArrayOfImages.length-1){
        lowerBound = upperBound-arrayLength;
    }
    this.arrayOfImagesToSelectFrom = this.initialLargeArrayOfImages.slice(lowerBound, upperBound);
    this.updateHtmlListInSecondScroller();
    this.selectReplacementImage();
};

Thumbnails.prototype.selectReplacementImage = function(){
    console.log("selectReplacementImage function");
    this.$scroller2.find("li > img").click(clickToSelectImage.bind(this));
    };

//new bug???
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
console.log(this.currentUrl);//undefined
            //close up second iscroll
            this.$currentUrl.append(this.$replacementImgUrl); //undefined
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
    // this.$secondModal.modal("hide");
    this.$initialLi.find('img').attr('src', this.$replacementImgUrl);//this is the problem
    this.replacementImgUrl = undefined;
    this.$replacementLi = undefined;
    //this.$scroller2.hide();
    this.generateNewArrayOfImagesFromModifiedScroller();
};

Thumbnails.prototype.serialize = function () {
    return {
        newArrayForSelection: this.newArrayForSelection
    };
};

/**
 * jquery click events
 */

//toggle to form
Thumbnails.prototype.navToFirst = function(){
    this.showFirstPage.click(function(){
        this.$secondModal.modal("hide");
        this.$firstModal.modal("show");
        this.firstSubmitButton();
    }.bind(this));
};

//first screen form
Thumbnails.prototype.firstSubmitButton = function(){
    this.$submitButton.click(function(){
        this.getFormValues();
        this.create_initial_li();
        this.clickFirstImageArrayToGetImage();
        this.$firstModal.modal("hide");
        this.$secondModal.modal("show");
    }.bind(this));
};

/* global $, _, IScroll */
//call refresh when content is changed
//when number of elements changes
// if you have event handlers - if detecting a click on a specific element
// if you replace on image with a new image, new image won't detect clicks necessarily
//call refresh when dimensions change

/**
 * config
 */

function add(a, b){
    return a+b;
}

var defaultSettings = {
    numberOfFrames: 20
};

//set defaults of thumbnails overriding if user input
function Thumbnails(settings){
    console.log(settings);
    console.log(this.initialLargeArrayOfImages);
    _.defaults(this, settings, defaultSettings);
    console.log(this.initialLargeArrayOfImages);
    this.initialize();
}

//TESTME: is this called?
//TESTME: if user supplies array, does the function yield correct page?
//tests to see if additional information is needed to launch iscrolls

Thumbnails.prototype.determineWhichScreenToStart = function(){
    // check to see if there's already an array of images
    console.log("determineWhichScreenToStart");
    if(this.initialLargeArrayOfImages && this.initialLargeArrayOfImages.length){
        if (this.newArrayForSelection && this.newArrayForSelection.length){
            this.$secondModal.modal("show");
            this.updateHtmlListInFirstScroller();//this requires the LI
        }
        else if(this.numberOfFrames){
            //generate newArrayForSelection
            console.log("Has all, picking subset");
            this.$secondModal.modal("show");

            this.newArrayForSelection = this.newFramesetFromWholeSet();
            this.updateHtmlListInFirstScroller();//this requires the LI
        }
    }
    else{
        this.$firstModal.modal("show");
        this.firstSubmitButton();
    }
};


Thumbnails.prototype.setImages = function(params){
    if (params && params.initialLargeArrayOfImages) {
        console.log('initialLargeArrayOfImages');
        this.initialLargeArrayOfImages = params.initialLargeArrayOfImages;
        if (params.selectedImages)
            this.newArrayForSelection = params.selectedImages;
    }
};


//do not test
//calls functions to generate arrays of images and enables selections
Thumbnails.prototype.initialize = function(){
    this.initializeImageArrays();//what's being initialized here? is there a list to init?
    this._defineCachedJqueryVars();
    this.determineWhichScreenToStart();
};

//no need to test
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

//no need to test
//
Thumbnails.prototype.initializeImageArrays = function(){
    var settings = {
        scrollX: true,
        scrollY: false,
        mouseWheel: true,
        interactiveScrollbars: false,
        click: true
    };
   this.myScroll1 = new IScroll('#wrapper',
        {
        scrollX: true,
        scrollY: false,
        mouseWheel: true,
        interactiveScrollbars: false,
        click: true
    });
   this.myScroll2 = new IScroll('#wrapper2',
        settings);
};

/**
 * add html objects
 */

//TESTME :
//add new smaller array to first iscroll
Thumbnails.prototype.updateHtmlListInFirstScroller = function(){
    console.log("called");
    if(this.newArrayForSelection === undefined){
        this.newArrayForSelection = this.newFramesetFromWholeSet();
    }
    replaceList(this.$scroller, this.newArrayForSelection);
    this.getWidth();
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
    console.log("new frameset");
    if (this.newArrayForSelection===undefined){
        var sizeOfNewArrayForSelection = this.initialLargeArrayOfImages.length / this.numberOfFrames; //5
        this.newArrayForSelection = _.groupBy(this.initialLargeArrayOfImages,function(num, index){
            return Math.floor(index / sizeOfNewArrayForSelection);
        }, this);
        return  _.map(this.newArrayForSelection, function(array){
            return _.first(array);
        });
    }
};

Thumbnails.prototype.getWidth = function(){
    console.log("Get width");
    var lengthOfArray = this.newArrayForSelection.length;
    console.log(lengthOfArray);
    var scrollerWidth = (lengthOfArray * 200) + "px";
    console.log(scrollerWidth);
    $("#scroller").css({"width": scrollerWidth});
    this.clickFirstImageArrayToGetImage();
};

/**
 * image array events
 */

///////////////////////////
/////BOOKMARK//////////////
///////////////////////////
//handle click event for first array to generate second array
Thumbnails.prototype.clickFirstImageArrayToGetImage = function(){
    console.log("clickFirstImageArrayToGetImage function");
    this.$scroller.find("img").click(clickToGetFirstImage.bind(this));//undefined
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
    var index = _.indexOf(this.newArrayForSelection, this.initialImgUrl, this);
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
    this.serialize();
};

//where is this called?
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

/**
 * jquery click events
 */



// Thumbnails.prototype.selectReplacementImage = function(){
//     console.log("selectReplacementImage function");
//     this.$scroller2.find("li > img").click(clickToSelectImage.bind(this));
//     };

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

//testing more systematically without form button - creating arrays, then clearing.
// how to automate this?
function createArraysOfTestNumbers (){
    var startFrameNumber = 00001;
    var endFrameNumber = 05361;
    var length = 20;
    var distanceToNextStart = length *20;
    var beginningOfSet;
    var newArray= [];
    var jump = distanceToNextStart+startFrameNumber;
    console.log(jump);
   // while (startFrameNumber <= (endFrameNumber- distanceToNextStart)){
        for (var n=startFrameNumber; n<jump; n+=20){
            console.log("yup");
            newArray.push(n);
            startFrameNumber=(startFrameNumber+distanceToNextStart);
        }
    //}
    console.log(newArray);
}
//testing only
function add(x, y){
    return x+y;
}



/* global $, _, IScroll */

/////////////////////////////////////////////
//////    initializations              //////
/////////////////////////////////////////////

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
    clickFirstImageArrayToGetImage(this);
    this.determineWhichScreenToStart();
};

//iscroll. fameo.us later?
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
    if(this.initialLargeArrayOfImages && this.initialLargeArrayOfImages.length){
        if (this.newArrayForSelection && this.newArrayForSelection.length){
            this.launchSecondModalScreen();
        }
        else if(this.numberOfFrames){
            //generate newArrayForSelection
            this.newArrayForSelection = this.newFramesetFromWholeSet();
            this.launchSecondModalScreen();
        }
    }
    else{
       this.launchFirstModalScreen();
    }
};

/////////////////////////////////////////////
//////   add html objects             //////
/////////////////////////////////////////////


//add new smaller array to first iscroll
Thumbnails.prototype.updateHtmlListInFirstScroller = function(){
    if(this.newArrayForSelection === undefined){
        this.newArrayForSelection = this.newFramesetFromWholeSet();
    }
    // FIXME - does not want variable
    replaceList($("#scroller"), this.newArrayForSelection);
};

Thumbnails.prototype.updateHtmlListInSecondScroller = function(){
    replaceList($("#scroller2"), this.arrayOfImagesToSelectFrom);
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

//generate the smaller subarray that will be shown in first iscroll
Thumbnails.prototype.newFramesetFromWholeSet = function(){
    if (this.sizeOfNewArrayForSelection === undefined){
    this.sizeOfNewArrayForSelection = this.initialLargeArrayOfImages.length / this.numberOfFrames; //5
    }
    if (this.newArrayForSelection===undefined){
    this.newArrayForSelection = _.groupBy(this.initialLargeArrayOfImages,function(num, index){
        return Math.floor(index / this.sizeOfNewArrayForSelection);
    }, this);
   return  _.map(this.newArrayForSelection, function(array){
        return _.first(array);
    });
    }
};


/////////////////////////////////////////////
//////    image array events           //////
/////////////////////////////////////////////

//handle click event for first array to generate second array

// make prototype
//FIXME - refactor to cached jquery
function clickFirstImageArrayToGetImage(thumbnails){
    console.log("clickFirstImageArrayToGetImage function");
    $("#scroller img").click(function(){
        thumbnails.$scroller2.show();
        var $initialImage = $(this);
        var $initialLi = $initialImage.parent();
        var initialIscrollId = $initialLi.parent().parent().attr('id');
        $initialLi.addClass('selected_frame');
        var initialImgUrl = $initialImage.attr('src');
        if (thumbnails.$initialLi){
            thumbnails.$initialLi.removeClass('selected_frame');
            if(thumbnails.$initialImgUrl  === initialImgUrl){
            }
        }
        thumbnails.$initialLi = $initialLi;
        thumbnails.initialImgUrl = initialImgUrl;
        thumbnails.getNeighboringImages(thumbnails.imgUrlFirst, 7);
    });
}

//for second iscroll
Thumbnails.prototype.getNeighboringImages = function(imageFrame, arrayLength){
    console.log("getNeighboringImages function");
    this.openImageSelector("#scroller2");
    this.index = _.indexOf(this.initialLargeArrayOfImages, this.imgUrlFirst, this);
    this.half_array_length = Math.ceil(arrayLength /2);
    var lowerBound = Math.max(this.index- this.half_array_length, 0);
    var upperBound = Math.min(this.index+ this.half_array_length, this.initialLargeArrayOfImages.length-1);
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

//FIXME not working
Thumbnails.prototype.selectReplacementImage = function(){
    console.log("selectReplacementImage function");
    //FIXME: does not work if $("#scroller2 li > img") is replaced with this.$imagesInScroller
    $("#scroller2 li > img").click(function(){
        console.log("selectReplacementImage");//not called
        this.replacementImage = $(this);
        this.$replacementLi = this.replacementImage.parent();
        this.replacementSelectedFrameId = this.$replacementLi.attr('id');
        this.$replacementLi.addClass('replacement_frame');
        this.replacementImgUrl = this.replacementImage.attr('src');
        if (this.$replacementLi){
            //if there is a last selected frame
            this.$replacementLi.removeClass('replacement_frame');
            //check to see if the second click is on the same image as the first click
            if(this.replacementImgUrl === this.replacementImgUrl){
                //close up second iscroll
                $("#currentUrl").append(this.replacementImgUrl);
                return this.updateOriginal();
            }
        }
        this.$replacementLi = $replacementLi;
        this.replacementImgUrl = replacementImgUrl;
    }.bind(this));
};

/////////////////////////////////////////////
// data management after array alteration  //
/////////////////////////////////////////////

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
    this.$initialLi.find('img').attr('src', this.replacementImgUrl);
    this.$replacementImgUrl = undefined;
    thisreplacementImage_url = undefined;
    this.replacementLi = undefined;
    thumbnails.closeImageSelector("#scroller2");
    return this.generateNewArrayOfImagesFromModifiedScroller();
};

/////////////////////////////////////////////
//////    jquery click events           //////
/////////////////////////////////////////////
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
    // this.$scroller2Img = $("#scroller2 li > img");
};

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
    this.submitButton.click(function(){
        this.$firstModal.modal("hide");
        this.$secondModal.modal("show");
    }.bind(this));
};

//requires initial array and number of frames at minimum
Thumbnails.prototype.launchSecondModalScreen = function(){
     this.$secondModal.modal("show");
};

//only necessary if more data is required
Thumbnails.prototype.launchFirstModalScreen = function(){
    this.$firstModal.modal("show");
    firstSubmitButton();
};

Thumbnails.prototype.closeImageSelector = function(id) {
    $(id).hide();
};

Thumbnails.prototype.openImageSelector = function(id){
    $(id).show();
};
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
/* global $, _, IScroll */


/**
 * jfdsafjkl;
 * jfewioao
 */

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
    this.clickFirstImageArrayToGetImage();
    this.determineWhichScreenToStart();
};

//refresh iscroll whenever content is replaced thumbnails.myScroll2.refresh()
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
    replaceList(this.$scroller, this.newArrayForSelection);
};
    // FIXME - does not want variable
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

//FIXME - once in Thumbnail prototype, remove selected_frame from $initialLi
Thumbnails.prototype.clickFirstImageArrayToGetImage = function(){
    console.log("clickFirstImageArrayToGetImage function");
    this.$scroller.find("img").click(somethingClicked.bind(this));
};

function somethingClicked (evt) {
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
    this.openImageSelector("#scroller2");
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

//FIXME not working
Thumbnails.prototype.selectReplacementImage = function(){
    console.log("selectReplacementImage function");
    //FIXME: does not work if $("#scroller2 li > img") is replaced with this.$imagesInScroller
    this.$scroller2.find("li > img").click(function(evt){
        var $el = $(evt.target);
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
    this.replacementImgUrl = undefined;
    this.$replacementLi = undefined;
    thumbnails.closeImageSelector("#scroller2");
    return this.generateNewArrayOfImagesFromModifiedScroller();
};

Thumbnails.prototype.serialize = function () {
    return {
        newArrayForSelection: this.newArrayForSelection
    };
};

/////////////////////////////////////////////
//////  first page form processing     //////
/////////////////////////////////////////////

//has defaults
Thumbnails.prototype.get_form_values = function(){
    this.base_url = $("#baseurl").val();
    this.url_extension = "."+$("#url_extension").val();
    this.num_of_frames =parseInt($("#total").val());
    this.end_frame =parseInt($("#end_frame").val());
    this.start_frame = parseInt($("#start_frame").val());
    this.step = parseInt($("#step").val());
    this.frame_label_length = parseInt($("#frame_label_length").val());
};

//create iscroll
Thumbnails.prototype.create_string_with_zeros = function(frame_number){
    var string_frame = ""+ frame_number;
    var length_of_number = string_frame.length;
    var required_string_length = parseInt(this.frame_label_length)-length_of_number;
    for(var i=0; i< required_string_length; i++){
        string_frame="0"+string_frame;
    }
    return string_frame;
};

//maps create_string function to range of frames
Thumbnails.prototype.create_padded_range = function(){
    this.frame_nums = _.range(this.start_frame, this.end_frame, this.step);
    return _.map(this.frame_nums, function(frame_number){
        //undefined
        return this.create_string_with_zeros(frame_number);
    }, this);
};

//maps new url strings to specified params.
Thumbnails.prototype.create_array_of_urls = function(){
    this.padded_frame_nums = this.create_padded_range();
    return _.map(this.padded_frame_nums, function(frame_number){
        return this.base_url+frame_number+this.url_extension;
    }, this);
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

    // this.$scroller2.find('li > img')
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
Thumbnails.prototype.first_submit_button = function(){
    $("#submit_butn").click(function(){
        this.get_form_values();
        this.create_initial_li();
        click_first_iscroll_to_get_image(this);
        $("#firstModal").modal("hide");
        $("#secondModal").modal("show");
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

//FIXME remove
Thumbnails.prototype.closeImageSelector = function(id) {
    $(id).hide();
};


//FIXME remove
Thumbnails.prototype.openImageSelector = function(id){
    $(id).show();
};
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
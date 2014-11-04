
/**
 * first page form processing 1
 */

//needs to have this.initialLargeArrayOfImages1
//maps new url strings to specified params.
Thumbnails.prototype.createArrayOfUrls = function(){
    console.log("Create Array of Urls");
    this.paddedFrameNumbers = this.createPaddedRangeOfNumbers();
    //create array
    this.newArrayForSelection =  _.map(this.paddedFrameNumbers, function(frameNumber){
        return this.baseUrl+ frameNumber +this.urlExtention;
    }, this);
    this.updateHtmlListInFirstScroller();//this requires the LI
    this.clickFirstImageArrayToGetImage();
};


Thumbnails.prototype.createStringWithZeros = function(frameNumber){
    var stringOfFrameNumber = ""+ frameNumber ;
    var lengthOfNumber = stringOfFrameNumber.length;
    var required_string_length = parseInt(this.frameLabelLength)-lengthOfNumber;
    for(var i=0; i< required_string_length; i++){
        stringOfFrameNumber="0"+stringOfFrameNumber;
    }
    return stringOfFrameNumber;
};

//maps create_string function to range of frames
Thumbnails.prototype.createPaddedRangeOfNumbers = function(){
    this.frameNumbers = _.range(this.startFrame, this.endFrame, this.step);
    return _.map(this.frameNumbers, this.createStringWithZeros, this);
};

Thumbnails.prototype.firstSubmitButton = function(){
    console.log("click submit");
    this.$submitButton.click(clickToSubmit.bind(this));
};
function clickToSubmit(evt){
     var $el= $(evt.target);
        console.log("submit");
        this.getFormValues();
        this.createArrayOfUrls();
        this.$firstModal.modal("hide");
        this.$secondModal.modal("show");
}


 //has defaults
Thumbnails.prototype.getFormValues = function(){
    console.log("Form values");
    this.baseUrl = $("#baseUrl").val();
    this.urlExtention = "."+$("#urlExtention").val();
    this.numberOfFrames =parseInt($("#total").val());//determines how many to display in the scroller
    this.endFrame =parseInt($("#endFrame").val());
    this.startFrame = parseInt($("#startFrame").val());
    this.step = parseInt($("#step").val());
    this.frameLabelLength = parseInt($("#frameLabelLength").val());
};


///Testing from form button



Thumbnails.prototype.createTestArrays = function(startNum, endNum, stepNum){
    $("#startFrame").val(startNum);
    $("#endFrame").val(endNum);
    this.createArrayOfUrls();
};

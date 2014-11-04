
//set defaults of thumbnails overriding if user input
//Do not test //
function Thumbnails(settings){
    console.log(settings);
    console.log(this.initialLargeArrayOfImages);
    _.defaults(this, settings, defaultSettings);
    console.log(this.initialLargeArrayOfImages);
    this.initialize(); // is this called
}


Thumbnails.prototype.determineWhichScreenToStart = function(){
    // check to see if there's already an array of images
    console.log("determineWhichScreenToStart");
    //test: is there an initialLargeArrayOfImages with a length of at least one
    if(this.initialLargeArrayOfImages && this.initialLargeArrayOfImages.length){
        if (this.newArrayForSelection && this.newArrayForSelection.length){
            this.$secondModal.modal("show");
            this.updateHtmlListInFirstScroller();//this requires the LI
        }
        //test: is there a number of frames object
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

//mock params
Thumbnails.prototype.setImages = function(params){
    if (params && params.initialLargeArrayOfImages) {
        console.log('initialLargeArrayOfImages');
        this.initialLargeArrayOfImages = params.initialLargeArrayOfImages;
        if (params.selectedImages)
            this.newArrayForSelection = params.selectedImages;
    }
};


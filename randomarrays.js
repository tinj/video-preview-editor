//keep testing function in separate file
//test with random outcomes generated from form?
Thumbnails.prototype.createRange = function(){
    console.log("createRange");
    var startFrameNumber = 00001;
    var endFrameNumber = 05361;
    var factor = 20;
    //between 7 and 25 frames
    var numFrames = Math.floor(Math.random() * (25 - 7 +1) + 7);
    this.startFrame  = 20 * (Math.floor(Math.random() * (20-1 + 1) + 1)) + 1;
    this.endFrame = (numFrames*20) + startFrame;
    this.step = 20;
    console.log(startFrame, endFrame, numFrames);
    if (endFrame > endFrameNumber){
        createRange();
    }
    else{
        return;
    }
    // random end frame var endFrame = 20 * (Math.floor(Math.random() * (20-startFrame + 1) +startFrame)) + 1;
    //create array

};

Thumbnails.prototype.generateRandom = function(){
    this.$randomButton.click(clickForRandom.bind(this));
};

function clickForRandom(evt){
    var $el = $(evt.target);
    thumbnails.createRange();

};
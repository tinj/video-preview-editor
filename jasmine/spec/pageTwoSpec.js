

// impossible to test.
describe("Second Page of Module Tests", function() {
        // var Thumbnails = function(){};
        // beforeEach(function(){

        var settings = {
            initialLargeArrayOfImages: [
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png"
            ]
        };
        var thumbnails = new Thumbnails(settings);
    it("thumbnails.determineWhichScreenToStart() should run the second page if this.initialLargeArrayOfImages is provided",function(){
        //since array is present, this should be called.
            expect(thumbnails.determineWhichScreenToStart()).toHaveBeenCalled();
    });
});
describe("createHtmlBlockOfLi Test", function(){
    //create html fixture:
    it("should create a new li item for each item in the array", function(){
    beforeEach(function(){
    });
    var  arrayOfUrls = [
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png"];
        // });}
    var newUrls = createHtmlBlockOfLi(arrayOfUrls);
    var resultingUrls =
        "<li id=sample_frame0><img src=https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png></img></li><li id=sample_frame1><img src=https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png></img></li><li id=sample_frame2><img src=https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png></img></li>"

    expect(newUrls).toBe(resultingUrls);
    });
});




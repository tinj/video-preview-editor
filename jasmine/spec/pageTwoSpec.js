
var env = jasmine.getEnv();

// impossible to test.
describe("instantiate thumbnails that doesn't auto-initialize", function() {
    var thumbnails;
    var settings = {};
    var options = {test: true};
    thumbnails = new Thumbnails();
    // beforeEach(function(){
    // });

    it("create thumbnails object independent of initialize function with various",function(){
        spyOn(Thumbnails.prototype, 'initialize');
        // expect("#wrapper").not.toBeInDom();
        expect(thumbnails.initialize).not.toHaveBeenCalled();
        // expect(true).toBe(true);
    });
});

describe("DOM testing for elements", function(){
    var thumbnails;
    thumbnails = new Thumbnails();
    // loadFixtures('fixtures.html');
    it("should fail if it does not have a wrapper", function(){
        expect($("#wrapper")).not.toBeInDOM();
        expect(thumbnails.initialize).toThrow();
        expect(thumbnails.initializeScrollers).toThrow();
    });
});



//collisions between variables:
    var thumbnails =new Thumbnails();
    describe("get neighboring images", function(){
    thumbnails.newArrayForSelection = [
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png"
            ];
    // var thumbnails = this;
    // beforeEach(function(){
    // });
    it("should generate a new array of images from the initial large array, by calculating the upper and lower indeces", function(){
        expect(thumbnails.getNeighboringImages.call()).toBeTruthy();
    });
});

describe("Second Page of Module Tests", function() {
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
    it("hasLargeArray()) should check to see if array of images is provided",function(){
        //since array is present, this should be called.
            expect(hasLargeArray()).toBeFalsy();
            expect(hasLargeArray.call(settings)).toBeTruthy();
    });
});

describe("launchFunctionsforSecondModal() should show second modal if ", function(){
    var thumbnails =new Thumbnails();
    thumbnails.initialLargeArrayOfImages = [
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png",
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png",
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png",
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png",
            "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png"
        ];
    var settings = {

            newArrayForSelection: [
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png",
                "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png"
            ]
        };
        var fixture = setFixtures('<div class="modal" id="secondModal">foo</div>');
beforeEach(function(){
    newFramesetFromWholeSet=function(){return true};
    secondModal.show = function(){return true};
    showSecondModal = function(){return true};
    secondModal = true;
});
it("should check to see if the newArrayForSelection exists by checking to see if ithe function has been called", function(){
        expect(thumbnails.launchFunctionsforSecondModal.call()).toBeTruthy();
    });
});

describe("createHtmlBlockOfLi Test", function(){
    //create html fixture:
    it("should create a new li item for each item in the array", function(){

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

describe("serialize() should return a JSON object", function(){
    var thumbnails = new Thumbnails();
    thumbnails.newArrayForSelection =[
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png"];
    it("should return the original images if there were no changes", function(){
        expect(thumbnails.serialize).toEqual()
    });
    it("should return a different array if images were changed", function(){

    });
});






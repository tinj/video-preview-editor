describe("testSpy function", function(){
    var testspy, addMethod;
    beforeEach(){
    // var testSpy = {
    //     addMethod: function(a, b){
    //         return a+b;
    //     }
    };

    spyOn(testSpy, "addMethod");
    var newTestSpy = jasmine.createSpy("Test method");
    it("should spy on a function", function(){
        spyOn(testSpy, 'addMethod').andReturn("called");
    });

});



describe("add function", function(){
    it ("should add two numberm,.s", function(){
    expect(add(1,3)).toEqual(4);
    });
    it("should perform string operations", function(){
        expect(add("x","y")).toBe("xy");
    });
    it("should work with negative numbers", function(){
        expect(add(0, -10)).toBeLessThan(0);
    });
});

describe("click function", function(){
    beforeEach(function(){
        loadFixtures('fixtures.html');
    });
    it("should add a class when you click on the 'p' element", function(){
        var spyOnClick = spyOnEvent('#one', 'click');
        $("#one").click();
        expect("click").toHave
    });
});


// var testSpy = function(){
// };
// testSpy.addMethod = function(num){
//     return num+3;
// };

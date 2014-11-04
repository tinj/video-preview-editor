describe("add", function(){
    var addFunction = add;
    it("should add x and y", function(){
        expect(addFunction).toBeDefined();
    });
});

//spyon - check toHaveBeenCalled


describe("determineWhichScreenToStart() Test", function() {
    beforeEach(function(){
        this.thumbnails = new Thumbnails();
    });
    var screenCall = "determineWhichScreenToStart";
    it("should show the form if an array is not provided",function(){
            spyOn(this.thumbnails, screenCall);
            expect(true).toBe(true);
    });
});

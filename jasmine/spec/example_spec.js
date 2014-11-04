describe("Name of the group", function() {
    describe("someFunction", function(){
        it("should return true", function(){
            expect(someFunction()).toBeTruthy();
        });

        it("returns an array of names", function(){
            expect(anotherFunction()).toContain("andy");
            expect(anotherFunction()).not.toContain('boobs');
        });
    });
});
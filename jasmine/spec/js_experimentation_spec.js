describe("Experimentation", function(){
    var elem;
    beforeEach(function(){
        elem = $('<div id="container"><p>Hello World</p></div>');
        });
    it("allows us to search with CSS selectors", function(){
        expect($('#container')).not.toBeInDOM();
        expect(elem).toContainElement("p");
        expect(elem).toHaveText("Hello World");
    });
});
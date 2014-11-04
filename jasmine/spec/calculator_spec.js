describe("Calculator", function(){
    beforeEach(function(){
        Calculator.current =0;
    });
    it("should store the current value at all times", function(){
        expect(Calculator.current).toBeDefined();
        expect(Calculator.current).toEqual(0);
    });
    it("should add numbers", function() {
        expect(Calculator.add(5)).toEqual(5);
    });
    it("should add any number of numbers", function(){
        expect(Calculator.add(1,2,3)).toEqual(6);
    });
    describe("When subtracting numbers", function(){
        expect(Calculator.subtract(5)).toEqual(-5);
    });
});
it("should resent the current value", function(){
    Calculator.current = 20;
    Calculator.reset();
    expect(Calculator.current).toEqual(0);
    Calculator.add(5);
    Calculator.add(20);
});

function add(a, b){
    return a+b;
}

var clickThing = function(){
    $( "p" ).click(function() {
        ("#testDiv").addClass(".testClass");
        ("#testDiv").fadeOut("fast");
    });
};

var testSpy = function(){
};
testSpy.addMethod = function(num){
    return num+3;
};

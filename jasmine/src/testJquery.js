
var clickThing = function(){
    $( "p" ).click(function() {
        console.log("click");
        $("#testDiv").addClass(".testClass");
        $("#testDiv").fadeOut("fast");
    });
};
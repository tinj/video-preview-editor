

var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_";
var url_extension = ".png";
var n = "00001";
var frame_numbers = [];
var url_frame_number_length = 5;


function create_padded_range(start, stop, step, length){
	var frame_nums = _.range(start, stop, step);
	return _.map(frame_nums, function(frame_number){
		return create_string_with_zeros(frame_number, length);
	});
}
	console.log(create_padded_range(1, 30, 4, 5));

function create_array_of_urls(base, extension, start, stop, step, length){
	var frame_nums = create_padded_range(start, stop, step, length);
	return _.map(frame_nums, function(frame_number){
		return base+frame_number+extension;
	});
}

function create_string_with_zeros(frame_number, desired_length){
		var string_frame = ""+ frame_number;
		var length_of_number = string_frame.length;
		var required_string_length = parseInt(desired_length)-parseInt(length_of_number);
		for(var i=0; i<required_string_length; i++){
			string_frame="0"+string_frame;
		}
		return string_frame;
	}

function create_li(){
	//put in new num_frames variable here
	var urls = create_array_of_urls(base_url, url_extension, 1, 400, 20, 5);
	for (var i = 0; i < urls.length; i++){
		$("#scroller > ul").append("<li id=sample_frame"+i+"><img src="+urls[i]+"></img></li>");
	}
}
function click_image_get_url(){
	$("li > img").click(function(){
		var img_url = $(this).attr('src');
		$("#urlstext").append(img_url+"\n");
		console.log(img_url)
	});
}

// you should probably make a new function for computing the right step value to generate an array of length number_of_frames between start and stop.
// function total_num_of_frames(start, stop, number){

// }


//returns number of frames from form value, w default of 20
//calls functions that recreate page


var myScroll;

function init_iscroll () {
	myScroll = new IScroll('#wrapper',
		{
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			click: true
		});
}
function init(){
	create_li();
	init_iscroll();
	click_image_get_url();
	//get_num_of_frames();
}

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

$(document).ready(function() {
//this is what changes
	$("#num_frames_butn").click(function(){
	    	var num =$("#num_of_frames").val();
	    	if (num){
	    		num_of_frames = num;
	    	}
	    	else {
	    		num_of_frames=20;
	    	}
	    console.log(num_of_frames);
	    return num_of_frames;
	    //call function to determine new number of frames

	});
});

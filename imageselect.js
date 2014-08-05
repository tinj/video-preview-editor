/* global $, _, IScroll */

var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_";
var url_extension = ".png";
var n = "00001";
var frame_numbers = [];
var url_frame_number_length = 5;
// you should probably make a new function for computing the right step value to generate an array of length number_of_frames between start and stop.

//get interval between frames
function get_frame_step(start, stop, num_frames){
	var step = Math.floor((stop-start)/(num_frames - 2));
	return step;
}
//get length of array
function create_frame_array(start, stop, step){
	var frame_nums = _.range(start, stop, step);
	return frame_nums;
	}
function get_length(frame_array){
	var length_of_frame_array = frame_array.length;
	return length_of_frame_array;
}

function create_padded_range(frame_array, length){
	return _.map(frame_array, function(frame_number){
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
	var urls = create_array_of_urls(base_url, url_extension, 1, 400, get_frame_step(), get_length());
	for (var i = 0; i < urls.length; i++){
		$("#scroller > ul").append("<li id=sample_frame"+i+"><img src="+urls[i]+"></img></li>");
	}
}
function click_image_get_url(){
	$("li > img").click(function(){
		var img_url = $(this).attr('src');
		$("#urlstext").append(img_url+"\n");
		console.log(img_url);
	});
}

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
	//get total number of frames
	$("#num_frames_butn").click(function(){
	    	var num =$("#num_of_frames").val();
	    	if (num >= 5){
	    		num_of_frames = num;
	    	}
	    	else {
	    		alert("Invalid number of frames.  You must have a minium of five frames. Setting to default of 20");
	    		num_of_frames=20;
	    	}
	    console.log(num_of_frames);

	    return num_of_frames;
	});
});

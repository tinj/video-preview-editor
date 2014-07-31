$(document).ready(function() {

var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_";
var url_extension = ".png";
var n = "00001";
var frame_numbers = [];
//each function should do smallest little thing.
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

	// console.log(create_array_of_urls(base_url, url_extension, 1, 100, 20, 5));


function create_string_with_zeros(frame_number, desired_length){
		var string_frame = ""+ frame_number;
		var length_of_number = string_frame.length;
		var required_string_length = parseInt(desired_length)-parseInt(length_of_number);
		for(var i=0; i<required_string_length; i++){
			string_frame="0"+string_frame;
		}
		return string_frame;
	}
console.log(create_string_with_zeros());

function create_li(){
	var urls = create_array_of_urls(base_url, url_extension, 1, 400, 20, 5);
	for (var i = 0; i < urls.length; i++){
		$("#scroller > ul").append("<li id=sample_frame"+i+"><img src="+urls[i]+"></img></li>");
	}
}

function click_image_get_url(){
	$("li > img").click(function(){
		var img_url = $(this).attr('src');
		$("#urlstext").append(img_url+"\n");
	});
}


//returns number of frames from form value, w default of 20
function get_num_of_frames(){
    $("#num_frames_butn").click(function(){
    	//if undefined get placeholder
    	var n=$("#num_of_frames").val();
    	if (n){
    		var num_of_frames = n;
    	}
    	else {
    		var num_of_frames = 20;
    	}
    return num_of_frames
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
	get_num_of_frames();
}

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

});
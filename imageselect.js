/* global $, _, IScroll */

//var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_";
//var url_extension = ".png";1
var n = "00001";
var url_frame_number_length = 5;
// var num_of_frames = 20;
base_url = $("#baseurl").val();
num_of_frames =$("#num_of_frames").val();
end_frame =$("#end_frame").val();
start_frame =$("#start_frame").val();
url_extension = $("#url_extension").val();
frame_numberlength = $("#frame_label_length").val();
//get form values from js, not other way around.

var thumbnail_properties = {
	base_url: "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_",
	url_extension: "png"
	//add dot later
};

function Thumbnails(settings){
	_.defaults(this, settings, thumbnail_properties);
}

Thumbnails.prototype.get_form_values = function(){
	this.base_url = $("#baseurl").val();
	this.url_extension = $("#url_extension").val();
	this.num_of_frames =$("#num_of_frames").val();
	this.end_frame =$("#end_frame").val();
	this.start_frame =$("#start_frame").val();
};

//creates url with specified length and adds correct # of zeros
function create_string_with_zeros(frame_number, name_length){
	var string_frame = ""+ frame_number;
	var length_of_number = string_frame.length;
	var required_string_length = parseInt(name_length)-parseInt(length_of_number);
	for(var i=0; i<required_string_length; i++){
		string_frame="0"+string_frame;
	}
	return string_frame;
}

//maps create_string function to range of frames
function create_padded_range(start, stop, step, name_length){
	var frame_nums = _.range(start, stop, step);
	return _.map(frame_nums, function(frame_number){
		return create_string_with_zeros(frame_number, name_length);
	});
}

//maps new url strings to specified params.
function create_array_of_urls(base, extension, start, stop, step, name_length){
	var frame_nums = create_padded_range(start, stop, step, name_length);
	return _.map(frame_nums, function(frame_number){
		return base+frame_number+extension;
	});
}

function new_frameset_from_whole_set(all_the_frame_urls, num_of_frames){
	var group_size = all_the_frame_urls.length / num_of_frames;
	var subarray = _.groupBy(all_the_frame_urls,function(num, index){return Math.floor(index / group_size);
	});
	return _.map(subarray, function(array){
		return _.first(array);
	});
}

function create_html_block_of_li(urls){
	return _.map(urls, function(url, i){
		return "<li id=sample_frame"+i+"><img src="+url+"></img></li>";
	}).join("");
}

//adds list items to HTML
function create_initial_li(base, extension, start, stop, step, name_length){
	//store all_frame_urls and subset arrays as properties, instead of variables
	var all_frame_urls = create_array_of_urls(base_url, url_extension, 1, 400, 20, 5);
	var subset = new_frameset_from_whole_set(all_frame_urls, num_of_frames);
	var html_block = create_html_block_of_li(subset);
	$("#scroller > ul").html(html_block);
}

//retrieves the url of the image
function click_image_get_url(){
	$("li > img").click(function(){
		var img_url = $(this).attr('src');
		$("#urlstext").append(img_url+"\n");
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
	var thumbnails = new Thumbnails();
	thumbnails.get_form_values();


	create_initial_li();
	// init_iscroll();
	// click_image_get_url();
	$("#submit_butn").click(thumbnails.get_form_values);
	window.thumbnails = thumbnails;


}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);


//this function doesn't get called now - useful in edge case when array isn't already avail.
function get_frame_step(start, stop, num_of_frames){
	return Math.floor((stop-start)/(num_of_frames - 2));
}

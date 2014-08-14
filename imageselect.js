/* global $, _, IScroll */

//var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_";
//var url_extension = ".png";1
// var n = "00001";
// var url_frame_number_length = 5;
// // var num_of_frames = 20;
// base_url = $("#baseurl").val();
// num_of_frames =$("#num_of_frames").val();
// end_frame =$("#end_frame").val();
// start_frame =$("#start_frame").val();
// url_extension = $("#url_extension").val();
//frame_numberlength = $("#frame_label_length").val();
//get form values from js, not other way around.

//1name_length is the old name for frame_numberlength

var thumbnail_properties = {
	base_url: "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_",
	url_extension: "png"
};

function Thumbnails(settings){
	_.defaults(this, settings, thumbnail_properties);
}

Thumbnails.prototype.get_form_values = function(){
	this.base_url = $("#baseurl").val();
	this.url_extension = "."+$("#url_extension").val(); //added dot
	this.num_of_frames =parseInt($("#num_of_frames").val());
	this.end_frame =parseInt($("#end_frame").val());
	this.start_frame = parseInt($("#start_frame").val());
	this.step = parseInt($("#step").val());
	this.frame_label_length = parseInt($("#frame_label_length").val());
};

Thumbnails.prototype.create_initial_li = function(){
	//store all_frame_urls and subset arrays as properties, instead of variables
	this.all_frame_urls = create_array_of_urls(this.base_url, this.url_extension, this.start_frame, this.end_frame, this.step, this.frame_label_length);
	this.subset = new_frameset_from_whole_set(this.all_frame_urls, this.num_of_frames);
	this.html_block = create_html_block_of_li(this.subset);
	$("#scroller > ul").html(html_block);
};

//create iscroll

//not sure how to turn this into a prototype
//creates url with specified length and adds correct # of zeros
//undefined
Thumbnails.prototype.create_string_with_zeros = function(frame_number){
	var string_frame = ""+ frame_number;
	var length_of_number = string_frame.length;
	var required_string_length = parseInt(this.frame_label_length)-length_of_number;
	for(var i=0; i< required_string_length; i++){
		string_frame="0"+string_frame;
	}
	return string_frame;
};

//maps create_string function to range of frames
Thumbnails.prototype.create_padded_range = function(){
	this.frame_nums = _.range(this.start_frame, this.end_frame, this.step);
	return _.map(this.frame_nums, function(frame_number){
		//undefined
		return this.create_string_with_zeros(frame_number);
	}, this);
};


//maps new url strings to specified params.
Thumbnails.prototype.create_array_of_urls = function(){
	this.padded_frame_nums = this.create_padded_range();
	return _.map(this.padded_frame_nums, function(frame_number){
		return this.base_url+frame_number+this.url_extension;
	}, this);
};

//this one's a little tricky. not finished.
Thumbnails.prototype.new_frameset_from_whole_set = function(){
	this.all_frame_urls = this.create_array_of_urls();
	this.group_size = this.all_frame_urls.length / this.num_of_frames;
	this.subarray = _.groupBy(this.all_frame_urls,function(num, index){
		return Math.floor(index / this.group_size);
	}, this);
	return _.map(this.subarray, function(array){
		return _.first(array);
	});
};

function create_html_block_of_li(urls){
	return _.map(urls, function(url, i){
		return "<li id=sample_frame"+i+"><img src="+url+"></img></li>";
	}).join("");
}

//adds list items to HTML
//attach this to Thumbnail
Thumbnails.prototype.create_initial_li = function(){
	//store all_frame_urls and subset arrays as properties, instead of variables
	this.all_frame_urls = this.create_array_of_urls();
	this.subset = this.new_frameset_from_whole_set();
	var html_block = create_html_block_of_li(this.subset);
	$("#scroller > ul").html(html_block);
};

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
	// thumbnails.get_form_values();
	// create_initial_li();
	init_iscroll();
	// click_image_get_url();
	$("#submit_butn").click(function(){
		thumbnails.get_form_values();
		thumbnails.create_initial_li();
		$("#urlstext").append("blah");

	});
	window.thumbnails = thumbnails;
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

//this function doesn't get called now - useful in edge case when array isn't already avail.
function get_frame_step(start, stop, num_of_frames){
	return Math.floor((stop-start)/(num_of_frames - 2));
}

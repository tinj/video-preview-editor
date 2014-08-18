/* global $, _, IScroll */


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
Thumbnails.prototype.create_initial_li = function(){
	//store all_frame_urls and subset arrays as properties, instead of variables
	this.all_frame_urls = this.create_array_of_urls();
	this.subset = this.new_frameset_from_whole_set();
	var html_block = create_html_block_of_li(this.subset);
	$("#scroller > ul").html(html_block);
};

//retrieves the url of the image
function click_image_get_url(thumbnails){
	$("li > img").click(function(){
		thumbnails.img_url = $(this).attr('src');
		$("#currenturl").append(thumbnails.img_url);
		//make it exclusive
		$(this).toggleClass("selected_frame");
		thumbnails.get_neighboring_images(thumbnails.img_url);
	});
}

//creates array of links neighboring selected image
Thumbnails.prototype.get_neighboring_images = function(image_frame){
	//find index of selected image in all frame
	this.index = _.indexOf(this.all_frame_urls, this.img_url, this);
	//set lower bound:
	var lower_bound = Math.max(this.index-3, 0);
	var upper_bound = Math.min(this.index+3, this.all_frame_urls.length-1);
	this.array_of_images_to_select_from = this.all_frame_urls.slice(lower_bound, upper_bound);
	this.init_image_picking_iscroll('#wrapper2');
	this.create_second_li();
	select_replacement_image(thumbnails);

};


Thumbnails.prototype.create_second_li = function(){
	//store all_frame_urls and subset arrays as properties, instead of variables
	console.log("called");
	var html_block = create_html_block_of_li(this.array_of_images_to_select_from);
	$("#scroller2 > ul").html(html_block);
};

Thumbnails.prototype.init_image_picking_iscroll = function(){
	this.second_iScroll = new IScroll('#wrapper2',
		{
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			click: true
		});
};
//Becka, you're here.


//click on selected image
function select_replacement_image(thumbnails){
	$("#scroller2 li > img").click(function(){
		var $image = $(this);
		var $li = $image.parent();
		var currently_selected_frame_id = $li.attr('id');
		console.log(currently_selected_frame_id);
		$li.addClass('replacement_frame');
		var img_url = $image.attr('src');
		if (thumbnails.$last_selected_li){
			//is there a last selected frame?
			//if so,
			thumbnails.$last_selected_li.removeClass('replacement_frame');
		}
		thumbnails.$last_selected_li = $li;
		thumbnails.currently_selected_url = img_url;
		console.log(thumbnails.currently_selected_url);
	});
}
//change css to
//set var to the value of img_src
//replace subset[this.index] with

//

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
	$("#submit_butn").click(function(){
		thumbnails.get_form_values();
		thumbnails.create_initial_li();
		click_image_get_url(thumbnails);
	});

	window.thumbnails = thumbnails;

}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

//this function doesn't get called now - useful in edge case when array isn't already avail.
function get_frame_step(start, stop, num_of_frames){
	return Math.floor((stop-start)/(num_of_frames - 2));
}

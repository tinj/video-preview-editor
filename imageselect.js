/* global $, _, IScroll */

//default url data on thumbnails - is this necessary?
var thumbnail_properties = {
	base_url: "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_",
	url_extension: "png"
};

// forceNumeric() plug-in implementation
 jQuery.fn.forceNumeric = function () {
     return this.each(function () {
         $(this).keydown(function (e) {
             var key = e.which || e.keyCode;

             if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
             // numbers
                 key >= 48 && key <= 57 ||
             // Numeric keypad
                 key >= 96 && key <= 105 ||
             // comma, period and minus, . on keypad
                key == 190 || key == 188 || key == 109 || key == 110 ||
             // Backspace and Tab and Enter
                key == 8 || key == 9 || key == 13 ||
             // Home and End
                key == 35 || key == 36 ||
             // left and right arrows
                key == 37 || key == 39 ||
             // Del and Ins
                key == 46 || key == 45)
                 return true;

             return false;
         });
     });
 };

//set defaults of thumbnails
function Thumbnails(settings){
	//applies thumbnail defaults to settings
	_.defaults(this, settings, thumbnail_properties);
	this.initialize();
}

//gets values from form
Thumbnails.prototype.get_form_values = function(){
	this.base_url = $("#baseurl").val();
	this.url_extension = "."+$("#url_extension").val();
	this.num_of_frames =parseInt($("#total").val());
	this.end_frame =parseInt($("#end_frame").val());
	this.start_frame = parseInt($("#start_frame").val());
	this.step = parseInt($("#step").val());
	this.frame_label_length = parseInt($("#frame_label_length").val());
};

//create iscroll
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

function replace_list($el, array){
	$el.find("ul").html(create_html_block_of_li(array));
}

//FIXME - rename to "update_list"
Thumbnails.prototype.create_second_li = function(){
	replace_list($("#scroller2"), this.array_of_images_to_select_from);
};

//FIXME - rename to update list
Thumbnails.prototype.create_initial_li = function(){
	this.all_frame_urls = this.create_array_of_urls();
	this.subset = this.new_frameset_from_whole_set();
	replace_list($("#scroller"), this.subset);
};


//handle click event for first array to generate second array
function click_first_iscroll_to_get_image(thumbnails){
	$("#scroller img").click(function(){
		var $initial_image = $(this);
		var $initial_li = $initial_image.parent();
		var initial_iscroll_id = $initial_li.parent().parent().attr('id');
		$initial_li.addClass('selected_frame');
		var initial_img_url = $initial_image.attr('src');
		if (thumbnails.$initial_li){
			thumbnails.$initial_li.removeClass('selected_frame');
			if(thumbnails.$initial_img_url  === initial_img_url){
			//close iscroll
			//update_original()
			}
		}
		thumbnails.$initial_li = $initial_li;
		thumbnails.initial_img_url = initial_img_url;
		thumbnails.get_neighboring_images(thumbnails.img_url_first, 7);
	});
}


//FIXME - first click or second click behavior - second click makes it hide. have a dedicated hide function
//if it's a double click, trigger the close. otherwise, trigger an update and show.

//creates array of links shown in second iscroll neighboring selected image
Thumbnails.prototype.get_neighboring_images = function(image_frame, array_length){
	this.index = _.indexOf(this.all_frame_urls, this.img_url_first, this);
	this.half_array_length = Math.ceil(array_length /2);
	var lower_bound = Math.max(this.index- this.half_array_length, 0);
	var upper_bound = Math.min(this.index+ this.half_array_length, this.all_frame_urls.length-1);
	if(lower_bound === 0){
		upper_bound = array_length;
	}
	if(upper_bound === this.all_frame_urls.length-1){
		lower_bound = upper_bound-array_length;
	}
	this.init_image_picking_iscroll('#wrapper2'); // FIXME init this once, somewhere else - preemptively
	this.array_of_images_to_select_from = this.all_frame_urls.slice(lower_bound, upper_bound);
	this.create_second_li();
	select_replacement_image(thumbnails);
};

//call different elements original and replacement
//click on selected image
function select_replacement_image(thumbnails){
	$("#scroller2 li > img").click(function(){
		var $replacement_image = $(this);
		var $replacement_li = $replacement_image.parent();
		var replacement_selected_frame_id = $replacement_li.attr('id');
		$replacement_li.addClass('replacement_frame');
		var replacement_img_url = $replacement_image.attr('src');
		if (thumbnails.$replacement_li){
			//if there is a last selected frame
			thumbnails.$replacement_li.removeClass('replacement_frame');
			//check to see if the second click is on the same image as the first click
			if(thumbnails.replacement_img_url === replacement_img_url){
				//close up second iscroll
				return thumbnails.update_original();
			}
		}
		thumbnails.$replacement_li = $replacement_li;
		thumbnails.replacement_img_url = replacement_img_url;
	});
}

Thumbnails.prototype.update_original = function(){
	this.$initial_li.find('img').attr('src', this.replacement_img_url);

	this.$last_selected_li_first = undefined;
	this.replacement_image_url = undefined;
	this.replacement_li = undefined;
	this.close_image_selector("#scroller2");
};

Thumbnails.prototype.close_image_selector = function(id) {
	// body...
	$(id).hide();
};

var myScroll;

//BECKA to do : refactor into single function

//initialize second iscroll
Thumbnails.prototype.init_image_picking_iscroll = function(){
	//check parent.
	this.second_iScroll = new IScroll('#wrapper2',
		{
			scrollX: true,
			scrollY: false,
			mouseWheel: false,
			click: true
		});

};

//initialize first iscroll
function init_iscroll () {
	myScroll = new IScroll('#wrapper',
		{
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			click: true
		});
}

Thumbnails.prototype.nav_to_first = function(){
	$("#show_first_page").click(function(){
		$("#secondModal").modal("hide");
		$("#firstModal").modal("show");
		this.first_submit_button();
	}.bind(this));
};

Thumbnails.prototype.first_submit_button = function(){
	$("#submit_butn").click(function(){
		this.get_form_values();
		this.create_initial_li();
		click_first_iscroll_to_get_image(this);
		$("#firstModal").modal("hide");
		$("#secondModal").modal("show");
	}.bind(this));
};

Thumbnails.prototype.initialize = function(){
	$("#firstModal").modal("show");
	init_iscroll();
	this.first_submit_button();
	this.nav_to_first();
};

function init(){
	var thumbnails = new Thumbnails();
	window.thumbnails = thumbnails;
}

$(init);

/* global $, _, IScroll */

//url data on thumbnails
var thumbnail_properties = {
	base_url: "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_",
	url_extension: "png"
};

//set defaults of thumbnails
function Thumbnails(settings){
	_.defaults(this, settings, thumbnail_properties);
}

//gets values from form
Thumbnails.prototype.get_form_values = function(){
	this.base_url = $("#baseurl").val();
	this.url_extension = "."+$("#url_extension").val(); //added dot
	this.num_of_frames =parseInt($("#num_of_frames").val());
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

//adds list items to HTML

//create html list that contains the image files inside the second scroller

///////////////////////
// 		BOOKMARK  	 //
//  work to become,  //
//  not to acquire.  //
///////////////////////



//I can eliminate this function by placing it in the get_neighbo
Thumbnails.prototype.create_second_li = function(){
	this.html_block = create_html_block_of_li(this.array_of_images_to_select_from);
	$("#scroller2 > ul").html(this.html_block);
};

//refactor
function create_html_block_of_li(urls){
	return _.map(urls, function(url, i){
		return "<li id=sample_frame"+i+"><img src="+url+"></img></li>";
	}).join("");
}

Thumbnails.prototype.create_initial_li = function(){
	this.all_frame_urls = this.create_array_of_urls();
	this.subset = this.new_frameset_from_whole_set();
	var html_block = create_html_block_of_li(this.subset);
	$("#scroller > ul").html(html_block);
};

//figures out which iscroll you click on
function click_iscroll_to_get_image(thumbnails){
	console.log("ping");
	$("img").click(function(){
		var $image = $(this);
		var $li = $image.parent();
		var clicked_iscroll_id = $li.parent().parent().attr('id');
		$li.addClass('selected_frame');
		thumbnails.img_url_first = $image.attr('src');
		if (thumbnails.$last_selected_li_first){
			thumbnails.$last_selected_li_first.removeClass('selected_frame');
		}
		thumbnails.$last_selected_li_first = $li;
		thumbnails.currently_selected_url_first = thumbnails.img_url_first;
		if(clicked_iscroll_id == "scroller"){
			thumbnails.get_neighboring_images(thumbnails.img_url_first, 7);
			create_form_to_determine_array_length();
		}
		else if(clicked_iscroll_id == "scroller2"){
			create_form_to_determine_array_length()
		}
	});
}



function create_form_to_determine_array_length(){
	var array_length_form_item = '<form>Number of frames to show<input type="text" id="iscroll2_array_length" name="num_frames" value="7"></form>';
		var array_length_button = '<imput type="submit" id="confirm_array_length" class="btn btn-default">Confirm array length</button>';
	$("#array_length_button").append(array_length_form_item);
	$("#array_length_button").append(array_length_button);
	//$("#selectbuttondiv").append(array_length_button);
	set_array_length_from_user_input(thumbnails);
}

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


//click function also tests value
function set_array_length_from_user_input(thumbnails){
	$("#confirm_array_length").click(function(){
		$("#array_length_button").forceNumeric();
		var $second_iscroll_array_length_form = $("#iscroll2_array_length").val();
		thumbnails.second_iscroll_array_length = $second_iscroll_array_length_form;
		console.log(thumbnails.second_iscroll_array_length);
		thumbnails.get_neighboring_images(thumbnails.img_url_first, thumbnails.second_iscroll_array_length);
	});
}

//creates array of links shown in second iscroll neighboring selected image
Thumbnails.prototype.get_neighboring_images = function(image_frame, array_length){
	//find index of selected image in all frame
	console.log("ping");
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
	this.init_image_picking_iscroll('#wrapper2');
	this.array_of_images_to_select_from = this.all_frame_urls.slice(lower_bound, upper_bound);
	this.create_second_li();
	//determine_which_iscroll_clicked(thumbnails);
};

//dynamically create button that confirms selection
// function create_confirm_button(){

// 	var button='<button type="button" class="btn btn-default">Select</button>';
// 	if($('#selectbutton').length ===0){
// 		$("#selectbuttondiv").append(button);
// 	}
// 	replace_image_in_array_with_new_image(thumbnails);
// }

//places selected image from second iscroll into first iscroll
function replace_image_in_array_with_new_image(thumbnails){
	$("#selectbutton").click(function(){
		thumbnails.$last_selected_li_first.find('img').attr('src', thumbnails.currently_selected_url);
	});
}

var myScroll;

//BECKA to do : refactor into single function

//initialize second iscroll
Thumbnails.prototype.init_image_picking_iscroll = function(){
	//check to see which
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

function init(){
	var thumbnails = new Thumbnails();
	init_iscroll();
	$("#submit_butn").click(function(){
		thumbnails.get_form_values();
		thumbnails.create_initial_li();
		click_iscroll_to_get_image(thumbnails);
	});

	window.thumbnails = thumbnails;

}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

//this function doesn't get called now - useful in edge case when array isn't already avail.
function get_frame_step(start, stop, num_of_frames){
	return Math.floor((stop-start)/(num_of_frames - 2));
}

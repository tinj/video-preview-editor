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

//retrieves the url of the image in first iScroll


///////////////////////
// 		BOOKMARK  	 //
//  work to become,  //
//  not to acquire.  //
///////////////////////



function click_image_get_url(thumbnails){
	$("#scroller li > img").click(function(){
		var $image = $(this);
		var $li = $image.parent();
		var currently_selected_frame_id = $li.attr('id');
		$li.addClass('selected_frame');
		thumbnails.img_url_first = $image.attr('src');
		if (thumbnails.$last_selected_li_first){
			thumbnails.$last_selected_li_first.removeClass('selected_frame');
		}
		thumbnails.$last_selected_li_first = $li;
		thumbnails.currently_selected_url_first = thumbnails.img_url_first;
		//$("#currenturl").append(thumbnails.img_url_first);
		thumbnails.get_neighboring_images(thumbnails.img_url_first, 7);
		//add buttons that allow you to page over
		//add form item that allows you to set number of images shown
		create_form_to_determine_array_length()
	});
}



function create_form_to_determine_array_length(){
	var array_length_form_item = '<form>Number of frames to show<input type="text" id="iscroll2_array_length" name="num_frames" value="7"></form>';
	$("#array_length_button").append(array_length_form_item);
	var array_length_button = '<imput type="submit" id="array_length_button" class="btn btn-default">Confirm array length. Odd numbers will be rounded up.</button>';
	$("#selectbuttondiv").append(array_length_button);
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
	$("#array_length_button").click(function(){
		$("#array_length_button").forceNumeric();
		var $second_iscroll_array_length_form = $("#iscroll2_array_length").val();
		thumbnails.second_iscroll_array_length = $second_iscroll_array_length_form;
		console.log(thumbnails.second_iscroll_array_length);
		thumbnails.get_neighboring_images(thumbnails.img_url_first, thumbnails.second_iscroll_array_length);
	});
}


///////////////////////
// 		BOOKMARK  	 //
//  work to become,  //
//  not to acquire.  //
///////////////////////

//creates array of links neighboring selected image
Thumbnails.prototype.get_neighboring_images = function(image_frame, array_length){
	//find index of selected image in all frame
	this.index = _.indexOf(this.all_frame_urls, this.img_url_first, this);
	//undefined below
	console.log(this.second_iscroll_array_length);
	//set lower bound:
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
	select_replacement_image(thumbnails);//where does this go?

};


//////////////////
// END BOOKMARK //
//////////////////

Thumbnails.prototype.create_second_li = function(){
	//store all_frame_urls and subset arrays as properties, instead of variables
	var html_block = create_html_block_of_li(this.array_of_images_to_select_from);
	$("#scroller2 > ul").html(html_block);
};

Thumbnails.prototype.init_image_picking_iscroll = function(){
	this.second_iScroll = new IScroll('#wrapper2',
		{
			scrollX: true,
			scrollY: false,
			mouseWheel: false,
			click: true
		});
};
//click on selected image in second iScroll
function select_replacement_image(thumbnails){
	$("#scroller2 li > img").click(function(){
		var $image_second = $(this);
		var $li_second = $image_second.parent();
		var currently_selected_frame_id_second = $li_second.attr('id');
		console.log(currently_selected_frame_id_second);
		$li_second.addClass('replacement_frame');
		var img_url_second = $image_second.attr('src');
		if (thumbnails.$last_selected_li){
			//is there a last selected frame?
			//if so,
			thumbnails.$last_selected_li.removeClass('replacement_frame');
		}
		thumbnails.$last_selected_li = $li_second;
		thumbnails.currently_selected_url = img_url_second;
		console.log(thumbnails.currently_selected_url);
		//call function to confirm value
		create_confirm_button();
	});
}

//dynamically create button to confirm selection
function create_confirm_button(){
	var button='<input type="button" id="selectbutton" value="Confirm selection">';
	if($('#selectbutton').length ===0){
		$("#selectbuttondiv").append(button);
	}
	replace_image_in_array_with_new_image(thumbnails);
};


function replace_image_in_array_with_new_image(thumbnails){
	//find url in html block
	$("#selectbutton").click(function(){
		console.log("calling this");
		thumbnails.$last_selected_li_first.find('img').attr('src', thumbnails.currently_selected_url);
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
	//$("#submit_butn").click(function(){
		thumbnails.get_form_values();
		thumbnails.create_initial_li();
		click_image_get_url(thumbnails);
	//});

	window.thumbnails = thumbnails;

}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

//this function doesn't get called now - useful in edge case when array isn't already avail.
function get_frame_step(start, stop, num_of_frames){
	return Math.floor((stop-start)/(num_of_frames - 2));
}

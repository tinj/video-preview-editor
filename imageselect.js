var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_";
var url_extension = ".png";
var n = "00001";
var url_frame_number_length = 5;
// var num_of_frames = 20;
var all_frames = create_array_of_urls(base_url, url_extension, 1, 400, 20, 5);


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

//creates subset of frames with correct number of frames based on user input
//call this with num_frames submit button; generate new list in HTML
function new_frameset_from_whole_set(all_the_frame_urls, num_of_frames){
	var group_size = all_the_frame_urls.length / num_of_frames;
	var subarray = _.groupBy(all_the_frame_urls,function(num, index){return Math.floor(index / group_size);
	});
	return _.map(subarray, function(array){
		return _.first(array);
	});
}

//maps new url strings to specified params.
function create_array_of_urls(base, extension, start, stop, step, name_length){
	var frame_nums = create_padded_range(start, stop, step, name_length);
	return _.map(frame_nums, function(frame_number){
		return base+frame_number+extension;
	});
}

//adds list items to HTML
function create_li(){
	var urls = create_array_of_urls(base_url, url_extension, 1, 400, 20, 5);
	for (var i = 0; i < urls.length; i++){
		$("#scroller > ul").append("<li id=sample_frame"+i+"><img src="+urls[i]+"></img></li>");
	}
}

//retrieves the url of the image
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
	click_num_button();
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(init);

function click_num_button(){
	$("#num_frames_butn").click(function(){
	    	var num =$("#num_of_frames").val();
	    	if (num >= 5){
	    		num_of_frames = num;
	    		//call the new fucntion to build array
	    	}
	    	else {
	    		alert("Invalid number of frames.  You must have a minium of five frames. Setting to default of 20");
	    		num_of_frames=20;
	    	}
	    console.log(num_of_frames);
	    return num_of_frames;
	});
}

//this function doesn't get called now - useful in edgec case when array isn't already avail.
function get_frame_step(start, stop, num_of_frames){
	return Math.floor((stop-start)/(num_of_frames - 2));
}

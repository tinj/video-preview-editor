var base_url= "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_"
var url_extension = ".png"
var n = "00001"
var frame_numbers = []
//each function should do smallest little thing. 
var url_frame_number_length = 5

function create_padded_range(start, stop, step, length){
	var frame_nums = _.range(start, stop, step)
	return _.map(frame_nums, function(frame_number){
		return create_string_with_zeros(frame_number, length)
	})
}

function create_array_of_urls(base, extension, start, stop, step, length){
	var frame_nums = create_padded_range(start, stop, step, length)
	return _.map(frame_nums, function(frame_number){
		return base+frame_number+extension
	})
}

//creates five digit frame number in url 
function create_string_with_zeros(frame_number, desired_length){
		var string_frame = ""+ frame_number; 
		var length_of_number = string_frame.length;  
		var required_string_length = parseInt(desired_length)-parseInt(length_of_number); 
		for(var i=0; i<required_string_length; i++){
			string_frame="0"+string_frame  
		} 
		return string_frame
	}



/* global $, _, IScroll */


 //FIXME this now becomes part of var constantine_settings
var default_settings = {
    all_frame_urls: ["https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00141.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00161.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00181.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00201.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00221.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00241.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00261.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00281.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00301.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00321.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00341.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00361.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00381.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00401.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00421.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00441.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00461.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00481.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00501.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00521.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00541.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00561.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00581.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00601.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00621.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00641.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00661.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00681.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00701.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00721.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00741.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00761.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00781.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00801.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00821.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00841.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00861.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00881.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00901.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00921.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00941.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00961.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00981.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00141.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00161.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00181.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00201.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00221.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00241.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00261.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00281.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00301.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00321.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00341.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00361.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00381.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00401.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00421.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00441.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00461.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00481.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00501.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00521.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00541.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00561.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00581.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00601.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00621.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00641.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00661.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00681.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00701.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00721.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00741.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00761.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00781.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00801.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00821.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00841.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00861.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00881.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00901.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00921.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00941.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00961.png", "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00981.png"
    ],
    num_of_frames: 20
};


var constantine_settings = {
    all_frame_urls: [
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00141.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00161.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00181.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00201.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00221.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00241.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00261.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00281.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00301.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00321.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00341.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00361.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00381.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00401.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00421.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00441.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00461.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00481.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00501.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00521.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00541.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00561.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00581.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00601.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00621.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00641.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00661.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00681.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00701.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00721.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00741.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00761.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00781.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00801.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00821.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00841.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00861.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00881.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00901.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00921.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00941.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00961.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00981.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00041.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00061.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00081.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00101.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00121.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00141.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00161.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00181.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00201.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00221.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00241.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00261.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00281.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00301.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00321.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00341.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00361.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00381.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00401.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00421.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00441.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00461.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00481.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00501.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00521.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00541.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00561.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00581.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00601.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00621.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00641.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00661.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00681.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00701.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00721.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00741.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00761.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00781.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00801.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00821.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00841.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00861.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00881.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00901.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00921.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00941.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00961.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00981.png"
    ],
    num_of_frames: 15
};

//set defaults of thumbnails overriding if user input
function Thumbnails(settings){
    _.defaults(this, settings, default_settings);
    this.initialize();
}

//
Thumbnails.prototype.new_frameset_from_whole_set = function(){
    this.group_size = this.all_frame_urls.length / this.num_of_frames; //5
    this.subarray = _.groupBy(this.all_frame_urls,function(num, index){
        return Math.floor(index / this.group_size);
    }, this);
   return  _.map(this.subarray, function(array){
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

Thumbnails.prototype.update_html_list_in_first_scroller = function(){
    // this.all_frame_urls = default_settings.full_array;
    this.subset = this.new_frameset_from_whole_set();
    replace_list($("#scroller"), this.subset);
};


Thumbnails.prototype.update_html_list_in_second_scroller = function(){
    //FIXME --- why won't this work?
    replace_list($("#scroller2"), this.array_of_images_to_select_from);
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
            }
        }
        thumbnails.$initial_li = $initial_li;
        thumbnails.initial_img_url = initial_img_url;
        thumbnails.get_neighboring_images(thumbnails.img_url_first, 7);
    });
}


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

    this.array_of_images_to_select_from = this.all_frame_urls.slice(lower_bound, upper_bound);
    this.update_html_list_in_second_scroller();
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
                $("#currenturl").append(thumbnails.replacement_img_url);
                generate_new_array_of_images_from_modified_scroller();
                console.log(generate_new_array_of_images_from_modified_scroller());
                return thumbnails.update_original();
            }
        }
        thumbnails.$replacement_li = $replacement_li;
        thumbnails.replacement_img_url = replacement_img_url;
    });
}
function generate_new_array_of_images_from_modified_scroller(){
    // return $obj;
    var arr = [];
    $('#scroller ul li img').each(function(){arr.push($(this).attr('src'))});
    console.log(arr);
}

generate_new_array_of_images_from_modified_scroller();

Thumbnails.prototype.update_original = function(){
    this.$initial_li.find('img').attr('src', this.replacement_img_url);
    this.$last_selected_li_first = undefined;
    this.replacement_image_url = undefined;
    this.replacement_li = undefined;
    this.close_image_selector("#scroller2");
};

Thumbnails.prototype.close_image_selector = function(id) {
    $(id).hide();
};

Thumbnails.prototype.initialize_image_arrays = function(){   // (id) {
    var settings = {
        scrollX: true,
        scrollY: false,
        mouseWheel: true,
        click: true
    };
   this.myScroll1 = new IScroll('#wrapper',
        settings);
   this.myScroll2 = new IScroll('#wrapper2',
        settings);
};

Thumbnails.prototype.nav_to_first = function(){
    $("#show_first_page").click(function(){
        $("#secondModal").modal("hide");
        $("#firstModal").modal("show");
        this.first_submit_button();
    }.bind(this));
};

Thumbnails.prototype.first_submit_button = function(){
    $("#submit_butn").click(function(){
        $("#firstModal").modal("hide");
        $("#secondModal").modal("show");
    }.bind(this));
};

Thumbnails.prototype.launch_second_modal_screen = function(){
    //needs to detect what fields are lacking, add some customizable features
     $("#secondModal").modal("show");


};

Thumbnails.prototype.launch_first_modal_screen = function(){
    $("#firstModal").modal("show");
    first_submit_button();
};

Thumbnails.prototype.determine_which_screen_to_start = function(){
    if(this.all_frame_urls && this.all_frame_urls.length){
        if (this.subset && this.subset.length){
            this.launch_second_modal_screen();
        }
        else if(this.num_of_frames){
            //generate subset
            this.subset = this.new_frameset_from_whole_set();
            this.launch_second_modal_screen();
        }
    }
    else{
       this.launch_first_modal_screen();
    }
};

Thumbnails.prototype.initialize = function(){
    //initializes iscroll
    this.initialize_image_arrays();
    this.update_html_list_in_first_scroller();
    click_first_iscroll_to_get_image(this);
    this.determine_which_screen_to_start();

};

function init(){
    var thumbnails = new Thumbnails(constantine_settings);
    window.thumbnails = thumbnails;
}

$(init);
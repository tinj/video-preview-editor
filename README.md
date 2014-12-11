# Video Preview Editor

VPE is a compact, standalone module which allows for the seamless and simple creation of a custom video preview.  It will generate an array of images to represent a video and permits simple editing of that array.  By default, the array will display every twentieth image, and the user can easily edit the generated preview in order to make it more representative of content.  

##Importing Data

The user imports an array consisting of all images in their video.  You can do this by adding your array to the file settings.js, in the place of the the constantine array:

'''
var constantine_settings = {
    el: "#thumbnails",
    initialLargeArrayOfImages: [
     "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00001.png",
        "https://s3-us-west-1.amazonaws.com/curv/constantine-tv-trailer/constantine_trailer_00021.png",
        ....
        ]
'''


The exported array will contain images that accurately convey important highlights in a presentation. You’ll first
see the default array that shows every twentieth image of the full array.

![image](https://github.com/tinj/video-preview-editor/blob/master/screenshots/initialScreen.jpg)

This array is scrollable…

![image](https://github.com/tinj/video-preview-editor/blob/master/screenshots/scrollScreenshot.jpg)

… and when you click on an image a second array
appears:

![image](https://github.com/tinj/video-preview-editor/blob/master/screenshots/secondArray.jpg)

This second array shows the images surrounding
the selected frame in the _original full
array of images. _You can then double click on the image you want to use as
the replacement, and it will replace the old image.

![image](https://github.com/tinj/video-preview-editor/blob/master/screenshots/replacedImage..jpg)

**//how?**

##Exporting Data

When you have completed changing your preview, call thumbnails.onDone()

##Customization

If you want to change the styles of the modal,
make sure you are in the directory in your terminal, and do the following:

- edit in styles folder
- type “gulp” in your terminal to
     rebuild the modal

##Dependencies

*jQuery
*Bootstrap
*Underscore
*Node

##Build Process

VPE was built with Jade, LESS, Gulp, Templatizer and Webpack.  You have to run the terminal commands to build it. 

##Launch

To launch the modal:

1. make
sure you’re in directory in terminal

2. type the following commands:
*gulp
*npm start  

npm run build  


## Future features

We plan to add the following features to make this module more robust and flexible.

1. Publish
   1. On Node
   2. On Bower
2. Add timestamps to images 
3. Allow for deletion of images instead of replacement
4. Export new array to clipboard with button
5. Skip ahead without scrolling
6. Create github page - eventually you can [Click here to see a demo at our github page. ] (http://tinj.github.io/video-preview-generator)
7. UI fix - Done button is too narrow
8. Remove from modal to be free standing 

##Credits 

Built in the name of freedom and open source for Tinj by:

*Mat Tyndall (@flipside)
*Rebecca Robbins (@beckastar) 

##License

VPE is released under the terms of the MIT License.

 

  

 

 

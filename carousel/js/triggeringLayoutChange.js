//Initialize the carousel.
var carousel = FamousContainer('#carousel-container', FamousCarousel({
  contentLayout: FamousCarousel.SingularTwist,
  dotsEnabled: true,
  arrowsEnabled: true,
  loop: true
}));

//Change layout to 'focused' mode on slide click
carousel.on('itemClick', function (slideIndex) {
  //If current layout is Grid, activate SingularSoftscale layout
  if(carousel.getContentLayout().id === 'GridLayout') {
    carousel.setSelectedIndex(slideIndex, false); //Pass 'false' as 2nd arguemnt to avoid triggering layout animation twice
    carousel.setContentLayout(FamousCarousel.SingularTwist); //Triggers layout activation animation
  }
  else if(carousel.getContentLayout().id === 'CoverflowLayout') {
    carousel.setSelectedIndex(slideIndex);
  }
});

var gridIndex = 1;
var gridSizes = [
  {label: '1 x 1 (SingularTwist)', value: FamousCarousel.SingularTwist},
  {label: '2 x 2 (GridLayout)', value: [2, 2]},
  {label: '3 x 3 (GridLayout)', value: [3, 3]},
  {label: '4 x 4 (GridLayout)', value: [4, 4]},
  {label: '5 x 5 (GridLayout)', value: [5, 5]},
  {label: '6 x 6 (GridLayout)', value: [6, 6]}
]

function displayGrid(gridDimensions) {
  var layout = gridSizes[gridIndex].value;
  if(gridIndex === 0) {
    carousel.setContentLayout(layout)
  } else {
    carousel.setContentLayout(FamousCarousel.GridLayout({
      gridDimensions: layout
    }));
  }
}

function displayCoverflow() {
  carousel.setContentLayout(FamousCarousel.CoverflowLayout);
}

//Set up buttons
var label = document.getElementById('gridDimension');

//Grab icons
var gridIcon = document.getElementById('gridIcon');
var reduceGrid = document.getElementById('reduceGrid');
var enlargeButton = document.getElementById('enlargeGrid');
var coverflowIcon = document.getElementById('coverflowIcon');

//Set up events
gridIcon.onclick = displayGrid;
coverflowIcon.onclick = displayCoverflow;

reduceGrid.onclick = function(){
  if((gridIndex - 1) >= 0) {
    gridIndex--;
    label.innerHTML = gridSizes[gridIndex].label;
    displayGrid();
  }
}

enlargeButton.onclick = function(){
  if((gridIndex + 1) < gridSizes.length) {
    gridIndex++;
    label.innerHTML = gridSizes[gridIndex].label;
    displayGrid();
  }
}

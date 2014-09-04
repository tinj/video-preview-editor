var layouts = [
  FamousCarousel.GridLayout({ 
    gridDimensions: [2,2] 
  }),
  FamousCarousel.SingularSoftScale
];

var carousel = FamousContainer('#carousel-container', FamousCarousel({ 
  arrowsEnabled: true,
  dotsEnabled: true,
  dotsPosition: 'middle',
  dotsPadding: [-20, 15],
  contentLayout: FamousCarousel.SingularSoftScale
}));

var index = 0;

console.log(carousel);
carousel.on('itemClick', function (slideIndex) { 
  carousel.setSelectedIndex(slideIndex, false);
  carousel.setContentLayout(layouts[index++ % layouts.length]);
});

document.body.addEventListener('keyup', function (e) {
  if (e.keyCode == 16) { // shift
    carousel.setContentLayout(layouts[index++ % layouts.length]);
  }
  else if (e.keyCode == 65) { // a
    carousel.setContentLayout(FamousCarousel.SingularParallax);
  }
  else if (e.keyCode == 83) { //s
    carousel.setContentLayout(FamousCarousel.SingularSlideIn({'direction': 0}));
  }
  else if (e.keyCode == 68) { // d
    carousel.setContentLayout(FamousCarousel.SingularSlideIn({'direction': 1}));
  }
  else if (e.keyCode == 70) { // f
    carousel.setContentLayout(FamousCarousel.SingularSlideBehind());
  }
  else if (e.keyCode == 71) { // g
    carousel.setContentLayout(FamousCarousel.SingularTwist({'direction': 'y'}));
  }
  else if (e.keyCode == 72) { // h
    carousel.setContentLayout(FamousCarousel.SingularTwist({'direction': 'x'}));
  } 
  else if(e.keyCode == 74) { // j
    carousel.setContentLayout(FamousCarousel.SingularSoftScale);
  }
  else if(e.keyCode == 49) { // 1
    carousel.setContentLayout(FamousCarousel.GridLayout({
      gridDimensions: [2,2]
    }));
    index = 1;
  }
  else if(e.keyCode == 50) { // 2
    carousel.setContentLayout(FamousCarousel.GridLayout({
      gridDimensions: [3,3]
    }));
    index = 1;
  }
  else if(e.keyCode == 51) { // 3
    carousel.setContentLayout(FamousCarousel.GridLayout({
      gridDimensions: [4,4]
    }));
    index = 1;
  }
  else if(e.keyCode == 52) { // 3
    carousel.setContentLayout(FamousCarousel.GridLayout({
      gridDimensions: [5,4]
    }));
    index = 1;
  }
  else if(e.keyCode == 13) { // Enter
    carousel.setContentLayout(FamousCarousel.CoverflowLayout);
  }
  
  
});

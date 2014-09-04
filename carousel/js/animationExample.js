var carousel = FamousContainer('#carousel-container', FamousCarousel({
  contentLayout: FamousCarousel.SingularTwist,
  contentPadding: [0, 0],
  dotsEnabled: true,
  arrowsEnabled: true,
  loop: true,
  margin: 1
}));

var options = {
  'Twist X' : FamousCarousel.SingularTwist,
  'Twist Y' : FamousCarousel.SingularTwist({
    direction: 'y'
  }),
  'Soft Scale' : FamousCarousel.SingularSoftScale,
  'Parallax' : FamousCarousel.SingularParallax,
  'Slide In X' : FamousCarousel.SingularSlideIn({
    direction: 'x'
  }),
  'Slide In Y' : FamousCarousel.SingularSlideIn({
    direction: 'y'
  }),
  'Slide Behind' : FamousCarousel.SingularSlideBehind,
  'Grid 3x3' : FamousCarousel.GridLayout,
  'Grid 5x3' : FamousCarousel.GridLayout({ 
    gridDimensions: [5, 3]
  }),
  'Grid 3x5' : FamousCarousel.GridLayout({ 
    gridDimensions: [3, 5]
  }),
  'Coverflow' : FamousCarousel.CoverflowLayout,
  'SequentialLayout': FamousCarousel.SequentialLayout
};

var container = document.getElementById('animation-button-container');
var divs = [];
for (var key in options) { 

  var div = document.createElement('div');
  div.className = 'col1-4 option-button button centered pointer';
  if(options[key] === FamousCarousel.SingularTwist) {
    div.className += ' selected';
  }
  div.innerHTML = key;

  div.addEventListener('click', (function (layout) {
    removeSelected('option-button');
    carousel.setContentLayout(layout);
    this.classList.add('selected');
  }).bind(div, options[key]));

  divs.push(div);
}

for (var i = 0; i < divs.length; i++) {
  container.appendChild(divs[i]);
};

function removeSelected () {
  for (var i = 0; i < divs.length; i++) {
    divs[i].classList.remove('selected');
  };
}

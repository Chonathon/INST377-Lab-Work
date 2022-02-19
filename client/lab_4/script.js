let slidePosition = 0;
const slides = document.querySelectorAll('.photo_grid_item');
const totalSlides = slides.length;

function updateSlidePosition() {
  for (let slide of slides) {
    slide.classList.remove('carousel_item--visible');
  }

  slides[slidePosition].classList.add('carousel_item--visible');
}

function moveToNextSlide() {
  if (slidePosition === totalSlides - 1) {
    slidePosition = 0;
  } else {
    slidePosition += 1;
  }

  updateSlidePosition();
}

function moveToPrevSlide() {
  if (slidePosition === 0) {
    slidePosition = totalSlides - 1;
  } else {
    slidePosition -= 1;
  }

  updateSlidePosition();
}

document
  .querySelector('button#next')
  .addEventListener('click', () => {
    moveToNextSlide();
  });

document
  .querySelector('button#prev')
  .addEventListener('click', () => {
    moveToPrevSlide();
  });

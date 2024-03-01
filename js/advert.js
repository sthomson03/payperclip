document.addEventListener('DOMContentLoaded', () => {
  const texts = document.querySelectorAll('.text');
  const container = document.getElementById('container');
  const image = document.getElementById('logo');
  const buttons = document.querySelector('.buttons');

  function randomPosition(element, image, buttons) {
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const imageRect = image.getBoundingClientRect();
    const buttonsRect = buttons.getBoundingClientRect();

    let x, y;
    do {
      x = Math.random() * (containerWidth - elementWidth);
      y = Math.random() * (containerHeight - elementHeight);
    } while (isOverlapping(x, y, elementWidth, elementHeight, imageRect) || isOverlapping(x, y, elementWidth, elementHeight, buttonsRect));

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  function isOverlapping(x, y, elementWidth, elementHeight, rect) {
    const elementRect = {
      left: x,
      top: y,
      right: x + elementWidth,
      bottom: y + elementHeight
    };

    return !(elementRect.right < rect.left ||
             elementRect.left > rect.right ||
             elementRect.bottom < rect.top ||
             elementRect.top > rect.bottom);
  }

  function showAndHideText(element) {
    randomPosition(element, image, buttons);
    element.style.opacity = 1;

    setTimeout(() => {
      element.style.opacity = 0;
      setTimeout(() => showAndHideText(element), 1000); 
    }, 3000);
  }

  texts.forEach(showAndHideText);
});

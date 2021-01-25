/* Bonus: Use JS to improve even more CSS @keyframes
Here we just use it to update the color */

const doc = document.documentElement;
const container = document.getElementsByClassName('container')[0];

doc.addEventListener("touchmove", updateBubbleColors);
doc.addEventListener("mousemove", updateBubbleColors);

function updateBubbleColors(e) {
  const w = window.innerWidth / 255;
  const h = window.innerHeight / 255;
  const x = parseInt(e.pageX / w, 10);
  const y = parseInt(e.pageY / h, 10);

  const r = x;
  const g = (y - 255) * -1;
  const b = x <= y ? y - x : 0;

  container.style.setProperty('--colorEnd', `rgb(${r},${g},${b})`);
}
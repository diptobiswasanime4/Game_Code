const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageHeight = 320;
const imageWidth = 1280 / 4;

let start = 0;
let end = 4;
let speed = 75;

let grassImage = new Image();
grassImage.src = "./Character-Sprite-02.png";

function animate() {
  console.log(1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  start++;
  if (start == end * speed) {
    start = 0;
  }

  animateSprite(
    grassImage,
    imageWidth,
    imageHeight,
    100,
    100,
    start,
    end,
    speed,
    ctx
  );
  requestAnimationFrame(animate);
}

animate();

function animateSprite(
  spriteImage,
  imageWidth,
  imageHeight,
  px,
  py,
  start,
  end,
  speed,
  ctx
) {
  start++;
  if (start == end * speed) {
    start = 0;
  }
  ctx.drawImage(
    spriteImage,
    imageWidth * Math.floor(start / speed),
    0,
    imageWidth,
    imageHeight,
    px,
    py,
    canvas.width / 2,
    canvas.height / 2
  );
}

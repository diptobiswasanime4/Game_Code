const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const playerImage = new Image();
playerImage.src = "Girl-Sprite-0003.png";

const IMG_ROWS = 4;
const IMG_COLS = 4;
const IMG_HEIGHT = 1280 / IMG_ROWS;
const IMG_WIDTH = 1280 / IMG_COLS;

let imageFrame = 0;
let imageMode = 1;

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (imageFrame == 4) {
    imageFrame = 0;
  }

  ctx.save();

  ctx.drawImage(
    playerImage,
    imageFrame * IMG_WIDTH,
    imageMode * IMG_HEIGHT,
    IMG_WIDTH,
    IMG_HEIGHT,
    80,
    80,
    160,
    160
  );

  ctx.restore();

  imageFrame++;
}, 1000);

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "W":
    case "w":
      break;
    case "S":
    case "s":
      break;
    case "A":
    case "a":
      imageMode = 3;
      break;
    case "D":
    case "d":
      imageMode = 3;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "W":
    case "w":
      break;
    case "S":
    case "s":
      break;
    case "A":
    case "a":
      break;
    case "D":
    case "d":
      break;
  }
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageHeight = 320;
const imageWidth = 320;

const gridWidth = 100;
const gridHeight = 100;

let start = 0;
let end = 4;
let speed = 75;

let mode = "idle";

let grassImage = new Image();
grassImage.src = "./Girl-Sprite-0001.png";

let i = 0;
let j = 0;
let k = 0;
let l = 0;

let animateIter = 0;

function animate() {
  console.log(1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  start++;
  if (start == end * speed) {
    start = 0;
  }

  // animateSprite(
  //   grassImage,
  //   imageWidth,
  //   imageHeight,
  //   100,
  //   100,
  //   start,
  //   end,
  //   speed,
  //   ctx
  // );
  if (i == 4) {
    i = 0;
  } else if (i < 0) {
    i = 4 + i;
  }
  if (j == 4) {
    j = 0;
  } else if (j < 0) {
    j = 4 + j;
  }
  if (l == 4) {
    l = 0;
  } else if (l < 0) {
    l = 4 + l;
  }
  if (mode == "walk-down") {
    animateIter++;
    drawSprite(i, j, k, l);
  } else {
    drawSprite(i, j, k, l);
  }
  if (animateIter == 2) {
    animateIter = 0;
    mode = "idle";
  }

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

function drawSprite(i, j, k, l) {
  ctx.drawImage(
    grassImage,
    imageWidth * i, // x of image
    imageHeight * k, // y of image
    imageWidth, // w of image
    imageHeight, // h of image
    gridWidth * l, // x of canvas
    gridHeight * j + (animateIter * gridHeight) / 2, // y of canvas
    canvas.width / 4,
    canvas.height / 4
  );
}

drawSprite();

let keys = {
  down: {
    pressed: false,
  },
};

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "W":
    case "w":
      keys.down.pressed = true;
      k = 2;
      i--;
      j--;
      keys.down.pressed = false;
      break;
    case "S":
    case "s":
      keys.down.pressed = true;
      mode = "walk-down";
      k = 0;
      i++;
      j++;
      keys.down.pressed = false;
      break;
    case "A":
    case "a":
      keys.down.pressed = true;
      k = 4;
      i--;
      l--;
      keys.down.pressed = false;
      break;
    case "D":
    case "d":
      keys.down.pressed = true;
      k = 3;
      i++;
      l++;
      keys.down.pressed = false;
      break;
  }
});

function moveDown() {
  ctx.drawImage(
    grassImage,
    0, // x of image
    0, // y of image
    1280, // w of image
    320, // h of image
    0, // x of canvas
    100, // y of canvas
    canvas.width,
    canvas.height / 4
  );
}

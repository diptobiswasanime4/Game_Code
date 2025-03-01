const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageHeight = 1280 / 4;
const imageWidth = 1280 / 4;

let characterMode = "idle";

let start = 0;
let end = 4;
let speed = 75;

let grassImage = new Image();
grassImage.src = "./Girl-Sprite-0003.png";

class Player {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.velX = 1;
    this.velY = 1;
    this.mode = "idle";
  }
  draw(ctx, spriteImage, start, speed) {
    ctx.drawImage(
      spriteImage,
      imageWidth * Math.floor(start / speed),
      imageHeight,
      imageWidth,
      imageHeight,
      this.x,
      this.y,
      canvas.width / 4,
      canvas.height / 4
    );
  }
}

let player = new Player();
player.draw(ctx, grassImage, start, end);

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

// animate();

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
    imageHeight,
    imageWidth,
    imageHeight,
    px,
    py,
    canvas.width / 4,
    canvas.height / 4
  );
}

let keys = {
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
      keys.up.pressed = true;
      characterMode = "move-up";
      player.update(ctx);
      keys.up.pressed = false;
      break;
    case "s":
    case "S":
      keys.down.pressed = true;
      characterMode = "move-down";
      player.update(ctx);
      keys.down.pressed = false;
      break;
    case "a":
    case "A":
      keys.left.pressed = true;
      characterMode = "move-left";
      player.update(ctx);
      keys.left.pressed = false;
      break;
    case "d":
    case "D":
      keys.right.pressed = true;
      characterMode = "move-right";
      player.update(ctx);
      keys.right.pressed = false;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "W":
      keys.up.pressed = false;
      characterMode = "idle";
      break;
    case "s":
    case "S":
      keys.down.pressed = false;
      characterMode = "idle";
      break;
    case "a":
    case "A":
      keys.left.pressed = false;
      characterMode = "idle";
      break;
    case "d":
    case "D":
      keys.right.pressed = false;
      characterMode = "idle";
      break;
  }
});

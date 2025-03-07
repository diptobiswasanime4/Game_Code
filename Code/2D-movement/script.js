const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const playerImage = new Image();
playerImage.src = "Girl-Sprite-0003.png";

const totalImageHeight = 1280;
const totalImageWidth = 1280;
const spriteWidth = totalImageWidth / 4;
const spriteHeight = totalImageHeight / 4;
const scale = 0.25;
const scaledWidth = spriteWidth * scale;
const scaledHeight = spriteHeight * scale;

const player = {
  x: canvas.width / 2 - scaledWidth / 2,
  y: canvas.height / 2 - scaledHeight / 2,
  speed: 3,
  frameX: 0,
  frameY: 1,
  maxFrame: 4,
  frameTimer: 0,
  frameInterval: 10,
  moving: false,
  direction: "idle",
};

const animations = {
  walkDown: 0,
  idle: 1,
  walkUp: 2,
  walkLeft: 3,
  walkRight: 3,
};

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

function updatePlayer() {
  player.moving = false;

  // Determine direction and move
  if (keys.w && player.y > 0) {
    player.y -= player.speed;
    player.direction = "walkUp";
    player.moving = true;
  } else if (keys.s && player.y < canvas.height - scaledHeight) {
    player.y += player.speed;
    player.direction = "walkDown";
    player.moving = true;
  } else if (keys.a && player.x > 0) {
    player.x -= player.speed;
    player.direction = "walkLeft";
    player.moving = true;
  } else if (keys.d && player.x < canvas.width - scaledWidth) {
    player.x += player.speed;
    player.direction = "walkRight";
    player.moving = true;
  } else {
    player.direction = "idle";
    player.moving = false;
  }

  // Set animation row
  player.frameY = animations[player.direction];

  // Animate frames if moving
  if (player.moving) {
    player.frameTimer++;
    if (player.frameTimer >= player.frameInterval) {
      player.frameX = (player.frameX + 1) % player.maxFrame;
      player.frameTimer = 0;
    }
  } else {
    player.frameX = 0; // Reset to first idle frame
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (player.frameX == 4) {
        player.frameX = 0;
      }

      ctx.save();

      ctx.drawImage(
        playerImage,
        player.frameX * spriteWidth,
        player.frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        80,
        80,
        160,
        160
      );

      ctx.restore();

      player.frameX++;
    }, 1000);
  }
}

function drawPlayer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  if (player.direction === "walkLeft") {
    ctx.scale(-1, 1);
    ctx.drawImage(
      playerImage,
      player.frameX * spriteWidth,
      player.frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      -(player.x + scaledWidth),
      player.y,
      scaledWidth,
      scaledHeight
    );
  } else {
    ctx.drawImage(
      playerImage,
      player.frameX * spriteWidth,
      player.frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      player.x,
      player.y,
      scaledWidth,
      scaledHeight
    );
  }

  ctx.restore();
}

function gameLoop() {
  updatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "w":
      keys.w = true;
      break;
    case "a":
      keys.a = true;
      break;
    case "s":
      keys.s = true;
      break;
    case "d":
      keys.d = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key.toLowerCase()) {
    case "w":
      keys.w = false;
      break;
    case "a":
      keys.a = false;
      break;
    case "s":
      keys.s = false;
      break;
    case "d":
      keys.d = false;
      break;
  }
});

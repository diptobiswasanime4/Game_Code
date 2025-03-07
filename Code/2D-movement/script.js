const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

// Load player sprite sheet
const playerImage = new Image();
playerImage.src = "Girl-Sprite-0003.png";

const totalImageHeight = 1280;
const totalImageWidth = 1280;
const spriteWidth = totalImageWidth / 4; // 320px
const spriteHeight = totalImageHeight / 4; // 320px
const scale = 0.25; // Scale factor: 1/4 size (80x80px)
const scaledWidth = spriteWidth * scale; // 80px
const scaledHeight = spriteHeight * scale; // 80px

// Player properties
const player = {
  x: canvas.width / 2 - scaledWidth / 2,
  y: canvas.height / 2 - scaledHeight / 2,
  speed: 3,
  frameX: 0,
  frameY: 1, // Start with idle
  maxFrame: 4,
  frameTimer: 0,
  frameInterval: 10,
  idleFrameInterval: 30,
  moving: false,
  direction: "idle",
};

// Animation states
const animations = {
  walkDown: 0, // 00 01 02 03
  idle: 1, // 10 11 12 13
  walkUp: 2, // 20 21 22 23
  walkLeft: 3, // 30 31 32 33
  walkRight: 3, // Same as left, but flipped
};

// Keyboard controls
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Update player movement and animation
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

  // Animate frames based on moving or idle state
  player.frameTimer++;
  const currentInterval = player.moving
    ? player.frameInterval
    : player.idleFrameInterval;
  if (player.frameTimer >= currentInterval) {
    player.frameX = (player.frameX + 1) % player.maxFrame;
    player.frameTimer = 0;
  }

  //   // Animate frames if moving
  //   if (player.moving) {
  //     player.frameTimer++;
  //     if (player.frameTimer >= player.frameInterval) {
  //       player.frameX = (player.frameX + 1) % player.maxFrame;
  //       player.frameTimer = 0;
  //     }
  //   } else {
  //     player.frameX = 0; // Reset to first idle frame
  //     player.frameTimer++;
  //     if (player.frameTimer >= player.idleFrameInterval) {
  //       player.frameX = (player.frameX + 1) % player.maxFrame;
  //       player.frameTimer = 0;
  //     }
  //   }
}

// Draw player
function drawPlayer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  // Handle drawing based on direction
  if (player.direction === "walkLeft") {
    // Flip horizontally for right movement
    ctx.scale(-1, 1);
    ctx.drawImage(
      playerImage,
      player.frameX * spriteWidth,
      player.frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      -(player.x + scaledWidth), // Adjust for flip
      player.y,
      scaledWidth,
      scaledHeight
    );
  } else {
    // Normal drawing for all other directions
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

// Game loop
function gameLoop() {
  updatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

// Start game when image loads
playerImage.onload = function () {
  gameLoop();
};

// Fallback in case image is already loaded
if (playerImage.complete) {
  gameLoop();
}

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

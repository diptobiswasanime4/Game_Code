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
  let moveX = 0;
  let moveY = 0;

  // Calculate movement based on key combinations
  if (keys.w && player.y > 0) moveY -= player.speed; // Up
  if (keys.s && player.y < canvas.height - scaledHeight) moveY += player.speed; // Down
  if (keys.a && player.x > 0) moveX -= player.speed; // Left
  if (keys.d && player.x < canvas.width - scaledWidth) moveX += player.speed; // Right

  // Apply diagonal movement with normalized speed
  if (moveX !== 0 && moveY !== 0) {
    // Normalize diagonal speed to maintain consistent movement
    const diagonalSpeed = player.speed / Math.sqrt(2); // Divide by sqrt(2) ≈ 1.414
    moveX = moveX > 0 ? diagonalSpeed : -diagonalSpeed;
    moveY = moveY > 0 ? diagonalSpeed : -diagonalSpeed;
  }

  // Update position
  player.x += moveX;
  player.y += moveY;

  // Determine direction based on movement
  if (moveX === 0 && moveY === 0) {
    player.direction = "idle";
    player.moving = false;
  } else {
    player.moving = true;

    // Diagonal movements
    if (moveX > 0 && moveY < 0) {
      // WD (up-right)
      player.direction = "walkUp";
    } else if (moveX < 0 && moveY < 0) {
      // WA (up-left)
      player.direction = "walkUp";
    } else if (moveX > 0 && moveY > 0) {
      // SD (down-right)
      player.direction = "walkDown";
    } else if (moveX < 0 && moveY > 0) {
      // SA (down-left)
      player.direction = "walkDown";
    }
    // Single direction movements
    else if (moveY < 0) {
      // W only
      player.direction = "walkUp";
    } else if (moveY > 0) {
      // S only
      player.direction = "walkDown";
    } else if (moveX < 0) {
      // A only
      player.direction = "walkLeft";
    } else if (moveX > 0) {
      // D only
      player.direction = "walkRight";
    }
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

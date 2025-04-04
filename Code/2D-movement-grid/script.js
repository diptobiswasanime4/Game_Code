const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

// Grid properties
const tileSize = 80; // Each tile is 80x80px to match scaled sprite size
const gridWidth = Math.floor(canvas.width / tileSize); // 6 tiles wide
const gridHeight = Math.floor(canvas.height / tileSize); // 6 tiles tall

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
  gridX: Math.floor(gridWidth / 2), // Current grid position
  gridY: Math.floor(gridHeight / 2),
  targetGridX: Math.floor(gridWidth / 2), // Target grid position
  targetGridY: Math.floor(gridHeight / 2),
  pixelX: Math.floor(gridWidth / 2) * tileSize, // Current pixel position
  pixelY: Math.floor(gridHeight / 2) * tileSize,
  speed: 4, // Pixels per frame for smooth movement
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

  // If currently moving toward a target, update pixel position
  if (
    player.pixelX !== player.targetGridX * tileSize ||
    player.pixelY !== player.targetGridY * tileSize
  ) {
    player.moving = true;

    // Smoothly move toward target
    if (player.pixelX < player.targetGridX * tileSize) {
      player.pixelX = Math.min(
        player.pixelX + player.speed,
        player.targetGridX * tileSize
      );
    } else if (player.pixelX > player.targetGridX * tileSize) {
      player.pixelX = Math.max(
        player.pixelX - player.speed,
        player.targetGridX * tileSize
      );
    }

    if (player.pixelY < player.targetGridY * tileSize) {
      player.pixelY = Math.min(
        player.pixelY + player.speed,
        player.targetGridY * tileSize
      );
    } else if (player.pixelY > player.targetGridY * tileSize) {
      player.pixelY = Math.max(
        player.pixelY - player.speed,
        player.targetGridY * tileSize
      );
    }

    // Snap to target when close enough
    if (
      Math.abs(player.pixelX - player.targetGridX * tileSize) < player.speed &&
      Math.abs(player.pixelY - player.targetGridY * tileSize) < player.speed
    ) {
      player.pixelX = player.targetGridX * tileSize;
      player.pixelY = player.targetGridY * tileSize;
      player.gridX = player.targetGridX;
      player.gridY = player.targetGridY;
    }
  } else {
    // Check for new movement input only when not moving
    if (keys.w && player.gridY > 0) {
      player.targetGridY = player.gridY - 1;
      player.direction = "walkUp";
      player.moving = true;
    } else if (keys.s && player.gridY < gridHeight - 1) {
      player.targetGridY = player.gridY + 1;
      player.direction = "walkDown";
      player.moving = true;
    } else if (keys.a && player.gridX > 0) {
      player.targetGridX = player.gridX - 1;
      player.direction = "walkLeft";
      player.moving = true;
    } else if (keys.d && player.gridX < gridWidth - 1) {
      player.targetGridX = player.gridX + 1;
      player.direction = "walkRight";
      player.moving = true;
    } else {
      player.direction = "idle";
      player.moving = false;
    }
  }

  // Set animation row based on direction
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
    // Flip horizontally for left movement
    ctx.scale(-1, 1);
    ctx.drawImage(
      playerImage,
      player.frameX * spriteWidth,
      player.frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      -(player.pixelX + scaledWidth), // Adjust for flip
      player.pixelY,
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
      player.pixelX,
      player.pixelY,
      scaledWidth,
      scaledHeight
    );
  }

  ctx.restore();

  // Optional: Draw grid for debugging
  drawGrid();
}

// Draw grid (for visualization)
function drawGrid() {
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
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

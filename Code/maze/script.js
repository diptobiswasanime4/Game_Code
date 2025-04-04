const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 25;
const COLS = 25;
const CELL_SIZE = 20;
const WALL_COLOR = "#333";
const PATH_COLOR = "#eee";
const PLAYER_COLOR = "blue";
const APPLE_COLOR = "red";
const VISITED_PATH_COLOR = "#b3c6ff";
const SOLUTION_PATH_COLOR = "#66ff66";
const BACKTRACK_COLOR = "#ff9966";

canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let maze = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(1));
let playerPos = { x: 1, y: 1 };
let applePos = { x: COLS - 2, y: ROWS - 2 };
let visitedCells = [];
let solutionPath = [];
let currentPath = [];
let solving = false;
let animationDelay = 50;

function generateMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      maze[r][c] = 1;
    }
  }

  const startRow = 1;
  const startCol = 1;
  maze[startRow][startCol] = 0;

  carvePassages(startRow, startCol);

  // Place player and apple
  playerPos = { x: 1, y: 1 };
  // Find a suitable place for the apple (far from player)
  let maxDistance = 0;
  for (let r = 1; r < ROWS - 1; r += 2) {
    for (let c = 1; c < COLS - 1; c += 2) {
      if (maze[r][c] === 0) {
        const distance = Math.abs(r - playerPos.y) + Math.abs(c - playerPos.x);
        if (distance > maxDistance) {
          maxDistance = distance;
          applePos = { x: c, y: r };
        }
      }
    }
  }
}

function carvePassages(r, c) {
  const directions = [
    [-2, 0],
    [0, 2],
    [2, 0],
    [0, -2],
  ];
  directions.sort(() => Math.random() - 0.5);

  for (let [dr, dc] of directions) {
    const newR = r + dr;
    const newC = c + dc;

    if (
      newR > 0 &&
      newR < ROWS - 1 &&
      newC > 0 &&
      newC < COLS - 1 &&
      maze[newR][newC] === 1
    ) {
      maze[r + dr / 2][c + dc / 2] = 0;
      maze[newR][newC] = 0;
      carvePassages(newR, newC);
    }
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillStyle = maze[r][c] === 1 ? WALL_COLOR : PATH_COLOR;
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  // Draw visited cells
  for (const cell of visitedCells) {
    ctx.fillStyle = VISITED_PATH_COLOR;
    ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  // Draw current path
  for (const cell of currentPath) {
    ctx.fillStyle = SOLUTION_PATH_COLOR;
    ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  // Draw solution path
  if (solutionPath.length > 0) {
    for (const cell of solutionPath) {
      ctx.fillStyle = SOLUTION_PATH_COLOR;
      ctx.fillRect(
        cell.x * CELL_SIZE,
        cell.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  // Draw apple
  ctx.fillStyle = APPLE_COLOR;
  ctx.fillRect(
    applePos.x * CELL_SIZE,
    applePos.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );

  // Draw player
  ctx.fillStyle = PLAYER_COLOR;
  ctx.fillRect(
    playerPos.x * CELL_SIZE,
    playerPos.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );

  // Add a status display
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";
  if (solutionPath.length > 0) {
    ctx.fillText(
      "Path found! Length: " + solutionPath.length,
      10,
      ROWS * CELL_SIZE - 5
    );
  } else if (solving) {
    ctx.fillText(
      "Searching... Visited: " + visitedCells.length,
      10,
      ROWS * CELL_SIZE - 5
    );
  }
}

// Find path to apple using backtracking (DFS)
async function findPathToApple() {
  if (solving) return;
  solving = true;
  visitedCells = [];
  solutionPath = [];
  currentPath = [];

  // Reset player position
  playerPos = { x: 1, y: 1 };
  drawMaze();

  // Start DFS
  const found = await dfs(playerPos.y, playerPos.x);

  if (found) {
    console.log("Path found!");
  } else {
    console.log("No path found!");
  }
  solving = false;
}

// DFS backtracking algorithm with explicit visualization of backtracking
async function dfs(r, c) {
  // Check if we're out of bounds or hit a wall
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS || maze[r][c] === 1) {
    return false;
  }

  // Check if we've already visited this cell
  for (const cell of visitedCells) {
    if (cell.x === c && cell.y === r) {
      return false;
    }
  }

  // Check if we found the apple
  if (r === applePos.y && c === applePos.x) {
    // Add current position to path
    currentPath.push({ x: c, y: r });
    solutionPath = [...currentPath];
    playerPos = { x: c, y: r };
    drawMaze();
    return true;
  }

  // Mark as visited
  visitedCells.push({ x: c, y: r });

  // Add current position to current path
  currentPath.push({ x: c, y: r });

  // Update player position for visualization
  playerPos = { x: c, y: r };
  drawMaze();

  // Wait for animation delay
  await new Promise((resolve) => setTimeout(resolve, animationDelay));

  // Try all four directions
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ]; // up, right, down, left
  for (const [dr, dc] of directions) {
    if (await dfs(r + dr, c + dc)) {
      return true;
    }
  }

  // If no path found, backtrack - actually show the backtracking visually
  // Remove current cell from current path (visual backtracking)
  currentPath.pop();

  // Show player moving back
  if (currentPath.length > 0) {
    const lastPos = currentPath[currentPath.length - 1];

    // Briefly highlight the backtrack move
    ctx.fillStyle = BACKTRACK_COLOR;
    ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Move player back visually
    playerPos = { x: lastPos.x, y: lastPos.y };
    drawMaze();

    // Wait for animation delay to show the backtracking
    await new Promise((resolve) => setTimeout(resolve, animationDelay));
  }

  return false;
}

// Set up event listeners for UI elements
document.getElementById("generateButton").addEventListener("click", () => {
  generateMaze();
  visitedCells = [];
  solutionPath = [];
  currentPath = [];
  drawMaze();
});

document
  .getElementById("findPathButton")
  .addEventListener("click", findPathToApple);

document.getElementById("speedSlider").addEventListener("input", (e) => {
  animationDelay = 101 - e.target.value;
});

// Initialize
generateMaze();
drawMaze();

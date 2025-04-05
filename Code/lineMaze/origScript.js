// Get our canvas and context
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Set initial variables
const cellSize = 25;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

// Player and apple positions
let playerPos = { x: 0, y: 0 };
let applePos = { x: 0, y: 0 };

// Store the maze structure
let maze = [];
let visited = [];
let solution = [];
let solutionFound = false;

// Track player's visited cells
let playerVisited = new Set();

// Game state
let gameWon = false;
let isAnimating = false;

// Animation controls
const animationSpeed = 150; // milliseconds between moves

// Colors
const colors = {
  background: "#FFFFFF",
  wall: "#333333",
  player: "#4CAF50",
  apple: "#FF5252",
  visited: "#E1F5FE",
  solution: "#2196F3",
  playerVisited: "#B3E5FC", // Light blue for player's visited path
};

// Initialize the maze
function initMaze() {
  maze = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      // Each cell has 4 walls: top, right, bottom, left
      row.push({ x: j, y: i, walls: [true, true, true, true] });
    }
    maze.push(row);
  }
}

// Generate a maze using DFS
function generateMaze() {
  // Don't generate if animation is running
  if (isAnimating) return;

  // Reset everything
  initMaze();
  solutionFound = false;
  solution = [];
  playerVisited = new Set();
  gameWon = false;

  // Create a stack for DFS
  const stack = [];

  // Start at a random cell
  const startX = Math.floor(Math.random() * cols);
  const startY = Math.floor(Math.random() * rows);

  // Create grid of visited cells
  const visitedCells = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));

  // Mark the first cell as visited and add it to the stack
  visitedCells[startY][startX] = true;
  stack.push({ x: startX, y: startY });

  // While there are cells in the stack
  while (stack.length > 0) {
    // Get the current cell
    const current = stack[stack.length - 1];

    // Get unvisited neighbors
    const neighbors = getUnvisitedNeighbors(current.x, current.y, visitedCells);

    // If no unvisited neighbors, backtrack by popping the stack
    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    // Choose a random unvisited neighbor
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];

    // Remove walls between current and next
    removeWalls(current, next);

    // Mark the next cell as visited and add it to the stack
    visitedCells[next.y][next.x] = true;
    stack.push(next);
  }

  // Place player at top-left corner
  playerPos = { x: 0, y: 0 };
  playerVisited.add("0,0"); // Mark starting position as visited

  // Place apple at a random location (not where the player is)
  do {
    applePos = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (applePos.x === playerPos.x && applePos.y === playerPos.y);

  // Draw the maze
  drawMaze();
}

// Get unvisited neighbors
function getUnvisitedNeighbors(x, y, visitedCells) {
  const neighbors = [];

  // Check top, right, bottom, left
  const directions = [
    { x: 0, y: -1 }, // top
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // bottom
    { x: -1, y: 0 }, // left
  ];

  directions.forEach((dir) => {
    const newX = x + dir.x;
    const newY = y + dir.y;

    // Check if the new position is in bounds and not visited
    if (
      newX >= 0 &&
      newX < cols &&
      newY >= 0 &&
      newY < rows &&
      !visitedCells[newY][newX]
    ) {
      neighbors.push({ x: newX, y: newY });
    }
  });

  return neighbors;
}

// Remove walls between two cells
function removeWalls(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  if (dx === 1) {
    // a is to the right of b
    maze[a.y][a.x].walls[3] = false; // Remove a's left wall
    maze[b.y][b.x].walls[1] = false; // Remove b's right wall
  } else if (dx === -1) {
    // a is to the left of b
    maze[a.y][a.x].walls[1] = false; // Remove a's right wall
    maze[b.y][b.x].walls[3] = false; // Remove b's left wall
  }

  if (dy === 1) {
    // a is below b
    maze[a.y][a.x].walls[0] = false; // Remove a's top wall
    maze[b.y][b.x].walls[2] = false; // Remove b's bottom wall
  } else if (dy === -1) {
    // a is above b
    maze[a.y][a.x].walls[2] = false; // Remove a's bottom wall
    maze[b.y][b.x].walls[0] = false; // Remove b's top wall
  }
}

// Draw the maze
function drawMaze() {
  // Clear the canvas
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw visited cells by player
  playerVisited.forEach((pos) => {
    const [x, y] = pos.split(",").map(Number);
    // Don't draw visited cell under player or apple
    if (
      (x === playerPos.x && y === playerPos.y) ||
      (x === applePos.x && y === applePos.y)
    ) {
      return;
    }
    ctx.fillStyle = colors.playerVisited;
    ctx.fillRect(
      x * cellSize + 2,
      y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
  });

  // Draw solution path if found
  if (solutionFound && !isAnimating) {
    solution.forEach((cell) => {
      // Don't draw solution under player or apple
      if (
        (cell.x === playerPos.x && cell.y === playerPos.y) ||
        (cell.x === applePos.x && cell.y === applePos.y)
      ) {
        return;
      }
      const x = cell.x * cellSize;
      const y = cell.y * cellSize;

      ctx.fillStyle = colors.solution;
      ctx.fillRect(x + 4, y + 4, cellSize - 8, cellSize - 8);
    });
  }

  // Draw cells and walls
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = maze[i][j];
      const x = j * cellSize;
      const y = i * cellSize;

      // Draw walls
      ctx.strokeStyle = colors.wall;
      ctx.lineWidth = 2;

      // Top wall
      if (cell.walls[0]) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }

      // Right wall
      if (cell.walls[1]) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }

      // Bottom wall
      if (cell.walls[2]) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }

      // Left wall
      if (cell.walls[3]) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
    }
  }

  // Draw apple
  ctx.fillStyle = colors.apple;
  ctx.fillRect(
    applePos.x * cellSize + 4,
    applePos.y * cellSize + 4,
    cellSize - 8,
    cellSize - 8
  );

  // Draw player
  ctx.fillStyle = colors.player;
  ctx.fillRect(
    playerPos.x * cellSize + 4,
    playerPos.y * cellSize + 4,
    cellSize - 8,
    cellSize - 8
  );

  // Show win message if player found the apple
  if (gameWon) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You found the apple!", canvas.width / 2, canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText(
      'Press "Reset" or "Generate" to play again',
      canvas.width / 2,
      canvas.height / 2 + 40
    );
  }
}

// Solve the maze using backtracking
function solveMaze() {
  // Don't start solving if already animating
  if (isAnimating) return;

  // Don't solve if game is already won
  if (gameWon) return;

  // Reset solution
  solution = [];
  solutionFound = false;

  // Initialize visited array
  visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));

  // Start from player position
  backtrack(playerPos.x, playerPos.y);

  // If solution found, animate player movement
  if (solutionFound) {
    animatePlayerAlongSolution();
  } else {
    // Redraw the maze without animation
    drawMaze();

    // Show an alert if no solution is found
    setTimeout(() => {
      alert("No solution found! The player may be trapped.");
    }, 100);
  }
}

// Backtracking algorithm to find the apple
function backtrack(x, y) {
  // If we've already found the apple, return
  if (solutionFound) return true;

  // If out of bounds or hit a wall or already visited, return
  if (x < 0 || x >= cols || y < 0 || y >= rows || visited[y][x]) return false;

  // Mark current cell as visited
  visited[y][x] = true;

  // If this is the apple, we found the solution
  if (x === applePos.x && y === applePos.y) {
    solutionFound = true;
    solution.push({ x, y });
    return true;
  }

  // Check all four directions
  const directions = [
    { dx: 0, dy: -1, wallIdx: 0 }, // top
    { dx: 1, dy: 0, wallIdx: 1 }, // right
    { dx: 0, dy: 1, wallIdx: 2 }, // bottom
    { dx: -1, dy: 0, wallIdx: 3 }, // left
  ];

  for (const dir of directions) {
    const newX = x + dir.dx;
    const newY = y + dir.dy;

    // Check if there's a wall in this direction
    if (maze[y][x].walls[dir.wallIdx]) continue;

    // Recursively backtrack in this direction
    if (backtrack(newX, newY)) {
      // If solution found, add current cell to the path
      solution.unshift({ x, y });
      return true;
    }
  }

  return false;
}

// Animate player along the solution path
function animatePlayerAlongSolution() {
  isAnimating = true;

  // Create a copy of the solution (excluding the starting point which is the player's current position)
  const solutionPath = [...solution].slice(1);

  // Recursive function to animate movement one step at a time
  function moveStep(index) {
    if (index >= solutionPath.length) {
      // Animation complete
      isAnimating = false;
      gameWon = true;
      drawMaze();
      return;
    }

    // Move player to the next position in the solution
    const nextPos = solutionPath[index];
    playerPos.x = nextPos.x;
    playerPos.y = nextPos.y;

    // Add to visited path
    playerVisited.add(`${nextPos.x},${nextPos.y}`);

    // Redraw the maze
    drawMaze();

    // Schedule the next step
    setTimeout(() => moveStep(index + 1), animationSpeed);
  }

  // Start the animation
  moveStep(0);
}

// Move player if there's no wall in the given direction
function movePlayer(direction) {
  if (gameWon || isAnimating) return; // Don't allow movement if game is won or animating

  let newX = playerPos.x;
  let newY = playerPos.y;
  let wallIdx;

  // Determine new position and wall to check based on direction
  switch (direction) {
    case "up":
      newY -= 1;
      wallIdx = 0; // top wall
      break;
    case "right":
      newX += 1;
      wallIdx = 1; // right wall
      break;
    case "down":
      newY += 1;
      wallIdx = 2; // bottom wall
      break;
    case "left":
      newX -= 1;
      wallIdx = 3; // left wall
      break;
  }

  // Check if movement is valid (within bounds and no wall)
  if (
    newX >= 0 &&
    newX < cols &&
    newY >= 0 &&
    newY < rows &&
    !maze[playerPos.y][playerPos.x].walls[wallIdx]
  ) {
    // Update player position
    playerPos.x = newX;
    playerPos.y = newY;

    // Add to visited cells
    playerVisited.add(`${newX},${newY}`);

    // Check if player found the apple
    if (playerPos.x === applePos.x && playerPos.y === applePos.y) {
      gameWon = true;
    }

    // Redraw maze
    drawMaze();
  }
}

// Reset the game
function resetGame() {
  // Don't reset if animation is running
  if (isAnimating) return;

  playerPos = { x: 0, y: 0 };
  playerVisited = new Set();
  playerVisited.add("0,0"); // Mark starting position as visited
  solution = [];
  solutionFound = false;
  gameWon = false;
  drawMaze();
}

// Handle keyboard controls
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      movePlayer("up");
      break;
    case "ArrowRight":
      movePlayer("right");
      break;
    case "ArrowDown":
      movePlayer("down");
      break;
    case "ArrowLeft":
      movePlayer("left");
      break;
  }
});

// Event listeners for buttons
document.getElementById("generateBtn").addEventListener("click", generateMaze);
document.getElementById("solveBtn").addEventListener("click", solveMaze);
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("clearPathBtn").addEventListener("click", () => {
  // Don't clear if animation is running
  if (isAnimating) return;

  // Keep only current position in visited set
  playerVisited = new Set([`${playerPos.x},${playerPos.y}`]);
  solution = [];
  solutionFound = false;
  drawMaze();
});

// Movement button controls
document
  .getElementById("upBtn")
  .addEventListener("click", () => movePlayer("up"));
document
  .getElementById("rightBtn")
  .addEventListener("click", () => movePlayer("right"));
document
  .getElementById("downBtn")
  .addEventListener("click", () => movePlayer("down"));
document
  .getElementById("leftBtn")
  .addEventListener("click", () => movePlayer("left"));

// Initialize and generate the first maze
generateMaze();

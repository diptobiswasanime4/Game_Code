const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 25;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

let maze = [];

const colors = {
  background: "#FFFFFF",
  wall: "#333333",
};

const visitedCells = Array(rows)
  .fill()
  .map(() => Array(cols).fill(false));

function initMaze() {
  maze = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ x: j, y: i, walls: [true, true, true, true] });
    }
    maze.push(row);
  }
}

async function generateMaze() {
  initMaze();
  console.log(maze);

  const stack = [];

  const startX = Math.floor(Math.random() * cols);
  const startY = Math.floor(Math.random() * rows);

  visitedCells[startY][startX] = true;
  stack.push({ x: startX, y: startY });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    const neighbors = getUnvisitedNeighbors(current.x, current.y, visitedCells);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const next = neighbors[Math.floor(Math.random() * neighbors.length)];

    removeWalls(current, next);

    visitedCells[next.y][next.x] = true;
    stack.push(next);
    drawMaze();

    await delay(100);
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getUnvisitedNeighbors(x, y, visitedCells) {
  const neighbors = [];

  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  directions.forEach((dir) => {
    const newX = x + dir.x;
    const newY = y + dir.y;

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

function removeWalls(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  if (dx === 1) {
    maze[a.y][a.x].walls[3] = false;
    maze[b.y][b.x].walls[1] = false;
  } else if (dx === -1) {
    maze[a.y][a.x].walls[1] = false;
    maze[b.y][b.x].walls[3] = false;
  }

  if (dy === 1) {
    maze[a.y][a.x].walls[0] = false;
    maze[b.y][b.x].walls[2] = false;
  } else if (dy === -1) {
    maze[a.y][a.x].walls[2] = false;
    maze[b.y][b.x].walls[0] = false;
  }
}

function drawMaze() {
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = maze[i][j];
      const x = j * cellSize;
      const y = i * cellSize;

      if (visitedCells[i][j]) {
        ctx.fillStyle = "orange";
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      ctx.strokeStyle = colors.wall;
      ctx.lineWidth = 2;

      if (cell.walls[0]) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }

      if (cell.walls[1]) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }

      if (cell.walls[2]) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }

      if (cell.walls[3]) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
    }
  }
}

document.getElementById("generateBtn").addEventListener("click", generateMaze);

generateMaze();

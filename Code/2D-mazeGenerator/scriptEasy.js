const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const generateBtn = document.getElementById("generate-btn");

const ROWS = 25;
const COLS = 25;
const CELL_SIZE = 20;
const WALL_COLOR = "#333";
const PATH_COLOR = "#eee";
canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let maze = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(1));

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
}

function carvePassages(r, c) {
  const directions = [
    [-4, 0],
    [0, 4],
    [4, 0],
    [0, -4],
  ];

  directions.sort(() => Math.random() - 0.5);

  console.log(directions);

  for (let [dr, dc] of directions) {
    const newR = r + dr;
    const newC = c + dc;

    console.log(newR, newC);

    if (
      newR > 0 &&
      newR < ROWS - 1 &&
      newC > 0 &&
      newC < COLS - 1 &&
      maze[newR][newC] === 1
    ) {
      maze[r + dr / 2][c + dc / 2] = 0;
      maze[r + dr / 4][c + dc / 4] = 0;
      maze[r + (dr / 4) * 3][c + (dc / 4) * 3] = 0;
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
}

generateMaze();
drawMaze();

generateBtn.addEventListener("click", () => {
  generateMaze();
  drawMaze();
});

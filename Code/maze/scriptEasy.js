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

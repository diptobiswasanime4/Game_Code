const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.098;

let dialogElem = document.getElementById("dialog");
let dialogIndex = 0;

let keys = {
  jump: {
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
  dialog: {
    pressed: false,
  },
};

class Player {
  constructor({ x, y, color, type }) {
    this.x = x;
    this.y = x;
    this.velX = 1;
    this.velY = 1;
    this.width = 20;
    this.height = 50;
    this.color = color;
    this.character = {
      type,
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
    if (this.y + this.height < canvas.width) {
      this.velY += GRAVITY;
      this.y += this.velY;
    } else {
      this.velY = 1;
    }
    if (this.color == "red") {
      if (keys.right.pressed) {
        this.x += this.velX;
      } else if (keys.left.pressed) {
        this.x -= this.velX;
      }
    }
  }
}

let player_1 = new Player({ x: 50, y: 50, color: "red", type: "main" });
let player_2 = new Player({ x: 300, y: 50, color: "blue", type: "NPC" });

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  player_1.update(ctx);
  player_2.update(ctx);
  // console.log(player_1);
}

animate();

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
      player_1.y -= 200;
      break;
    case "s":
    case "S":
      break;
    case "a":
    case "A":
      keys.left.pressed = true;
      player_1.update(ctx);
      if (player_2.x - player_1.x - 20 < 75) {
        console.log("Dialog is on!");
      }
      console.log(player_2.x - player_1.x - 20);
      break;
    case "d":
    case "D":
      keys.right.pressed = true;
      player_1.update(ctx);
      if (player_2.x - player_1.x - 20 < 75) {
        console.log("Dialog is on!");
      }
      console.log(player_2.x - player_1.x - 20);
      break;
    case "z":
    case "Z":
      if (player_2.x - player_1.x - 20 < 75) {
        keys.dialog.pressed = true;
        showDialog(dialogIndex);
      }
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "W":
      break;
    case "s":
    case "S":
      break;
    case "a":
    case "A":
      keys.left.pressed = false;
      break;
    case "d":
    case "D":
      keys.right.pressed = false;
      break;
    case "z":
    case "Z":
      if (player_2.x - player_1.x - 20 < 75) {
        keys.dialog.pressed = false;
        dialogIndex++;
      }
      break;
  }
});

let dialog = [
  {
    characterType: "main",
    index: 1,
    text: "Hi Blue",
  },
  {
    characterType: "NPC",
    index: 2,
    text: "Hi Red",
  },
  {
    characterType: "main",
    index: 3,
    text: "How're you doing?",
  },
  {
    characterType: "NPC",
    index: 4,
    text: "Good good!",
  },
];

function showDialog(index) {
  if (dialog.length == index) {
    dialogIndex = 0;
    return;
  }
  dialogElem.textContent = `${dialog[index].characterType}: ${dialog[index].text}`;
}

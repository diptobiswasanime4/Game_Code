const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let dialogElem = document.getElementById("dialog");
let dialogIndex = 0;

let keys = {
  up: {
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
  talk: {
    pressed: false,
  },
};

class Scene {
  constructor() {
    this.index = 1;
  }
}

let scene = new Scene();
canvas.style.backgroundColor = "grey";

class Player {
  constructor({ x, y, color = "blue", type }) {
    this.x = x;
    this.y = y;
    this.velX = 1;
    this.velY = 1;
    this.width = 30;
    this.height = 30;
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
    if (this.character.type == "MC") {
      if (keys.up.pressed) {
        this.y -= this.velY;
      } else if (keys.down.pressed) {
        this.y += this.velY;
      }
      if (keys.left.pressed) {
        this.x -= this.velX;
      } else if (keys.right.pressed) {
        this.x += this.velX;
      }
    }
  }
}

let player = new Player({ x: 50, y: 50, color: "red", type: "MC" });
let npc = new Player({ x: 250, y: 250, type: "NPC" });

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  player.update(ctx);
  npc.update(ctx);
  // console.log(player);
}

animate();

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
      keys.up.pressed = true;
      break;
    case "s":
    case "S":
      keys.down.pressed = true;
      break;
    case "a":
    case "A":
      keys.left.pressed = true;
      break;
    case "d":
    case "D":
      keys.right.pressed = true;
      break;
    case "z":
    case "Z":
      if (npc.x - player.x - 20 < 75 && npc.y - player.y < 75) {
        keys.talk.pressed = true;
        showDialog(dialogIndex);
      }
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "W":
      keys.up.pressed = false;
      break;
    case "s":
    case "S":
      keys.down.pressed = false;
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
      if (npc.x - player.x - 20 < 75 && npc.y - player.y < 75) {
        keys.talk.pressed = false;
        dialogIndex++;
      }
      break;
  }
});

let dialog = [
  {
    characterType: "MC",
    index: 1,
    text: "Hi Blue",
  },
  {
    characterType: "NPC",
    index: 2,
    text: "Hi Red",
  },
  {
    characterType: "MC",
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

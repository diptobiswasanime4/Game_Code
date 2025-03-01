const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let dialogElem = document.getElementById("dialog");
let dialogIndex = 0;

let sceneElem = document.getElementById("scene");

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
    this.name = "White Sand Beach";
  }
  draw(ctx) {
    if (this.index == 1) {
    } else if (this.index == 2) {
      canvas.style.backgroundColor = "green";
    } else if (this.index == 3) {
      canvas.style.backgroundColor = "teal";
    }
  }

  update(ctx) {
    this.draw(ctx);
  }
}

let scene = new Scene();
console.log("Scene Index", scene.index);

canvas.style.backgroundColor = "lightyellow";
sceneElem.textContent = `Scene ${scene.index} - ${scene.name}`;

class Player {
  constructor({ x, y, color = "blue", type, sceneIndex }) {
    this.x = x;
    this.y = y;
    this.velX = 1;
    this.velY = 1;
    this.width = 30;
    this.height = 30;
    this.color = color;
    this.character = {
      type,
      sceneIndex,
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    if (this.character.type == "MC") {
      this.draw(ctx);
    } else if (this.character.type == "NPC" && this.character.sceneIndex == 1) {
      this.draw(ctx);
    }
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

let player = new Player({
  x: 50,
  y: 50,
  color: "red",
  type: "MC",
  sceneIndex: 1,
});
let npc = new Player({ x: 250, y: 250, type: "NPC", sceneIndex: 1 });

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  scene.update(ctx);
  player.update(ctx);
  npc.update(ctx);
  // console.log(player);
  if (player.x > 400) {
    player.character.sceneIndex = 2;
    scene.index = 2;
    npc.character.sceneIndex = 2;
    scene.name = "Black Forest";
    player.x -= 400;
  }
  if (player.y > 400) {
    player.character.sceneIndex = 3;
    scene.index = 3;
    npc.character.sceneIndex = 3;
    scene.name = "Great Temple";
    player.y -= 400;
  }
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

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

class Player {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.velX = 1;
    this.velY = 1;
    this.width = 30;
    this.height = 30;
    this.color = "red";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
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

let player = new Player();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  player.update(ctx);
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
      break;
  }
});

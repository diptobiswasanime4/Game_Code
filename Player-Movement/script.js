const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.098;

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
};

class Player {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.velX = 1;
    this.velY = 1;
    this.width = 20;
    this.height = 50;
    this.color = "red";
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
    if (keys.right.pressed) {
      this.x += this.velX;
    } else if (keys.left.pressed) {
      this.x -= this.velX;
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
      player.y -= 200;
      break;
    case "s":
    case "S":
      break;
    case "a":
    case "A":
      keys.left.pressed = true;
      player.update(ctx);
      console.log(player);
      break;
    case "d":
    case "D":
      keys.right.pressed = true;
      player.update(ctx);
      console.log(player);
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
  }
});

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
  constructor({ x, y, color }) {
    this.x = x;
    this.y = x;
    this.velX = 1;
    this.velY = 1;
    this.width = 20;
    this.height = 50;
    this.color = color;
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

let player_1 = new Player({ x: 50, y: 50, color: "red" });
let player_2 = new Player({ x: 300, y: 50, color: "blue" });

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
      console.log(player_1);
      break;
    case "d":
    case "D":
      keys.right.pressed = true;
      player_1.update(ctx);
      console.log(player_1);
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

let dialog = {
  red: {
    index: 1,
    text: "Hi Blue",
  },
  red: {
    index: 2,
    text: "Hi Red",
  },
  red: {
    index: 3,
    text: "How're you doing?",
  },
  red: {
    index: 4,
    text: "Good good!",
  },
};

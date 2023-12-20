//Changes theses const to personalise your game

const refreshRate = 50; // Page-size refresh rate
const playerSpeed = 5; //player px per refresh
const playerShootingSpeed = 10; // bullet px per refresh
const playerShootingRate = 50; // refresh per shot
const enemySpeed = 2; // enemy px per refresh
const spawnRate = 5; // % chance to spawn
const initMaxEnemies = 5; // max enemies to spawn at start
const TTL = 70; // time to live
const playerHP = 50000; //HP at start
const dropRate = 20; // % chance to drop
const invincibilityFrame = 70; // invincibility after hit
const dashCooldown = 50; // cooldown in refresh
const dashLenght = 500; // lenght in px
const playerNumber = 1;

let loop = true;
var highScore = document.getElementById("highScore");
var width = window.innerWidth; // get window width
var height = window.innerHeight; // get window height
var score = 0;
var enemies = [];
var bullets = [];
var drops = [];

let player = CreatePlayer();

player.object.style.left = player.left;
player.object.style.top = player.top;
var refresh = refreshRate;

player.object.style.backgroundImage =
  "url('./Prefab/Sprites/Player/catwalk1.png')";
player.sprite = 0;

function CreatePlayer() {
  let player = new Player(
    (id = 1),
    (object = document.getElementById("player")),
    (HP = playerHP),
    (HPDiv = document.getElementById("hp")),
    (score = 0),
    (scoreDiv = document.getElementById("score")),
    (speed = playerSpeed),
    (top = 0),
    (left = 0),
    (right = 0),
    (bottom = 0),
    (invincibilityCounter = invincibilityFrame),
    (shootSpeed = playerShootingSpeed),
    (shootTimer = playerShootingRate),
    (upMov = false),
    (downMov = false),
    (leftMov = false),
    (rightMov = false),
    (move = false),
    (looking = "right"),
    (spriteCounter = 50),
    (sprite = null),
    (dashCounter = 50),
    (uDashLenght = dashLenght)
  );
  return player;
}

function Init() {
  if (!localStorage.getItem(highScore)) {
    localStorage.setItem(highScore, 0);
  }

  highScore = "HighScore : " + localStorage.getItem(highScore);
  if (loop) {
    GameLoop();
  }
}

function restartGame() {
  location.reload();
}

//Get key press
function GetKey(e) {
  switch (e.key) {
    case "ArrowLeft":
      player.looking = "left";
      player.leftMov = true;
      FrameLeft();
      break;
    case "ArrowUp":
      player.looking = "up";
      player.upMov = true;
      break;
    case "ArrowRight":
      player.looking = "right";
      player.rightMov = true;
      FrameRight();
      break;
    case "ArrowDown":
      player.looking = "down";
      player.downMov = true;
      break;
    case "p":
      if (loop) {
        loop = false;
      } else {
        loop = true;
      }
      break;
    case " ":
      if (player.dashCounter <= 0) {
        Dash();
      }
  }
}
//Get key release
function ReleaseKey(e) {
  switch (e.key) {
    case "ArrowLeft":
      player.leftMov = false;
      break;
    case "ArrowUp":
      player.upMov = false;
      break;
    case "ArrowRight":
      player.rightMov = false;
      break;
    case "ArrowDown":
      player.downMov = false;
      break;
  }
}

function MoveLeft() {
  player.object.style.left = parseInt(player.object.style.left) - player.speed;
}
function MoveRight() {
  player.object.style.left = parseInt(player.style.left) + player.speed;
}
function MoveDown() {
  player.object.style.top = parseInt(player.style.top) + player.speed;
}
function MoveUp() {
  player.object.style.top = parseInt(player.style.top) - player.speed;
}

function FrameLeft() {
  if (player.sprite == 0 || player.sprite == 1) {
    player.object.style.backgroundImage =
      "url('./Prefab/Sprites/Player/catwalk1r.png')";
    player.sprite = 2;
  }
}
function FrameRight() {
  if (player.sprite == 2 || player.sprite == 3) {
    player.object.style.backgroundImage =
      "url('./Prefab/Sprites/Player/catwalk1.png')";
    player.sprite = 0;
  }
}

function GameLoop() {
  UpdatePlayer();

  CheckCollision();
  UpdateCounters();

  if (
    Random(0, 100) < spawnRate &&
    enemies.length < initMaxEnemies + score / 10
  ) {
    Spawn();
  }

  if (player.upMov || player.downMov || player.leftMov || player.rightMov) {
    player.move = true;
  } else {
    player.move = false;
  }
  if (player.upMov && player.top > 0) {
    MoveUp();
  }
  if (player.downMov && player.bottom < height) {
    MoveDown();
  }
  if (player.leftMov && player.left > 0) {
    MoveLeft();
  }
  if (player.rightMov && player.right < width) {
    MoveRight();
  }
  EnemeyMovement();
  BulletMovement();
  if (loop) {
    requestAnimationFrame(Init);
  }
}

function UpdateCounters() {
  if (player.dashCounter > 0) {
    player.dashCounter--;
  }
  if (refresh > 0) {
    refresh--;
  }
  if (player.shootTimer > 0) {
    player.shootTimer--;
  }
  if (player.spriteCounter > 0) {
    player.spriteCounter--;
}
  if (player.invincibilityCounter > 0) {
    player.invincibilityCounter--;
  }
  if (player.spriteCounter > 0) {
    player.spriteCounter--;
  } else if (player.invincibilityCounter == 0) {
    player.spriteCounter = 50;
    UpdateSprite(0);
  }

  if (!player.move && player.shootTimer <= 0) {
    //Shoot if not moving
    player.shootTimer = player.shootRate;
    Shoot();
  }
}

function MoveLeft() {
  player.object.style.left = parseInt(player.object.style.left) - player.speed;
}
function MoveRight() {
  player.object.style.left = parseInt(player.object.style.left) + player.speed;
}
function MoveDown() {
  player.object.style.top = parseInt(player.object.style.top) + player.speed;
}
function MoveUp() {
  player.object.style.top = parseInt(player.object.style.top) - player.speed;
}
function RefreshPage() {
  width = window.innerWidth;
  height = window.innerHeight;
}


//Function to Spawn Bullets at player's position
function Shoot() {
  var bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left =
    parseInt(player.object.style.left) + player.object.scrollWidth / 2;
  bullet.style.top =
    parseInt(player.object.style.top) + player.object.scrollHeight / 2;
  bullets.push({
    id: "bullet",
    object: bullet,
    facing: player.looking,
    TTL: TTL,
  });
  document.body.appendChild(bullet);
}

//Function to Dash
function Dash() {
//Give player 30 refresh of invincibility
  player.invincibilityCounter = 30;
//Dash in player's Facing direction
  switch (player.looking) {
    case "left":
      if (player.left > player.uDashLenght) {
        player.object.style.left =
          parseInt(player.object.style.left) - player.uDashLenght;
      } else {
        player.object.style.left =
          parseInt(player.object.style.left) - player.left;
      }
      break;
    case "right":
      if (player.right + player.uDashLenght < width) {
        player.object.style.left =
          parseInt(player.object.style.left) + player.uDashLenght;
      } else {
        player.object.style.left =
          parseInt(player.object.style.left) + width - player.right;
      }
      break;
    case "up":
      if (player.top > player.uDashLenght) {
        player.object.style.top =
          parseInt(player.object.style.top) - player.uDashLenght;
      } else {
        player.object.style.top =
          parseInt(player.object.style.top) - player.top;
      }
      break;
    case "down":
      if (player.bottom + player.uDashLenght < height) {
        player.object.style.top =
          parseInt(player.object.style.top) + player.uDashLenght;
      } else {
        player.object.style.top =
          parseInt(player.object.style.top) + height - player.bottom;
      }
      break;
  }
//Put dash on cooldown
  player.dashCounter = dashCooldown;
}

//Function to Spawn enemies
function Spawn() {
//Create Enemy element
  var enemy = document.createElement("div");
  enemy.id = "enemy";
  enemy.className = "enemy";
  let enemyX = 0;
  let enemyY = 0;
  let enemyWidth = 0;
  let enemyHeight = 0;
//Choose side and position to spawn
  let side = Math.trunc(Random(0, 4));
  switch (side) {
    case 0:
      enemyX = 0;
      enemyY = Random(0, height);
      break;
    case 1:
      enemyX = Random(0, width);
      enemyY = 0;
      break;
    case 2:
      enemyX = width;
      enemyY = Random(0, height);
      break;
    case 3:
      enemyX = Random(0, width);
      enemyY = height;
      break;
    default:
      enemyX = 0;
      enemyY = 0;
  }
//Put Enemy on the screen
  enemy.style.left = enemyX;
  enemy.style.top = enemyY;
  enemyWidth = enemyX + enemy.scrollWidth;
  enemyHeight = enemyY + enemy.scrollHeight;
  enemies.push({ id: enemy.id, x: enemyX, y: enemyY, object: enemy });
  document.body.appendChild(enemy);
}

//Function to Update all player's parameters
function UpdatePlayer() {
//Death if Health reach zero
  if (player.HP <= 0) {
    UpdateSprite(2);
    End();
  }
//Alternating sprite
  if (player.spriteCounter <= 0 && player.invincibilityCounter <= 0) {
    player.spriteCounter = 50;
    UpdateSprite(0);
  }
// Link player object position to Player
  player.left = parseInt(player.object.style.left); 
  player.top = parseInt(player.object.style.top);
  player.right = player.left + player.object.scrollWidth;
  player.bottom = player.top + player.object.scrollHeight;
// Update the player's health display
  player.HPDiv.innerHTML = "HP: " + player.HP + " / " + player.maxHP;
// Update the score display
  player.scoreDiv.innerHTML = "Score: " + score;
}

// Function to Update Player's sprite
function UpdateSprite(parameter) {
  switch (parameter) {
// Switch to alternating normal Sprite
    case 0: 
// Match side, 0,1 ==> Right, 2,3 ==> Left
      switch (player.sprite) {
        case 0:
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk2.png')";
          player.sprite = 1;
          break;
        case 1:
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk1.png')";
          player.sprite = 0;
          break;
        case 2:
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk2r.png')";
          player.sprite = 3;
          break;
        case 3:
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk1r.png')";
          player.sprite = 2;
          break;
        default:
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk1.png')";
          player.sprite = 0;
          break;
      }
      break;
//Switch to Damage Sprite
    case 1: 
      switch (player.sprite) {
//Match side
        case (0, 1):
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk1Damage.png')";
          player.sprite = 4;
          break;
        case (2, 3):
          player.object.style.backgroundImage =
            "url('./Prefab/Sprites/Player/catwalk1rDamage.png')";
          player.sprite = 5;
          break;
      }
      break;
//Switch to Dead Sprite
    case 2: 
      player.object.style.backgroundImage =
        "url('./Prefab/Sprites/Player/catmort.png')";
      player.sprite = -1;
      break;
  }
}

// Function to End the Game
function End() {
  loop = false;
  let restart = confirm("You are dead, not a big suprise! Wanna replay ?");
  if (restart == true) {
    restartGame();
  }
}

// Function to Move Enemies
function EnemeyMovement() {
  for (let element of enemies) {
//Enemy try to align with Player on X axis
    if (
      element.x <
      player.object.scrollWidth / 3 + parseInt(player.object.style.left)
    ) {
      element.x = element.x + enemySpeed;
    } else {
      element.x = element.x - enemySpeed;
    }


//Enemy try to align with Player on Y axis
    if (
      element.y >
      player.object.scrollHeight / 3 + parseInt(player.object.style.top)
    ) {
      element.y = element.y - enemySpeed;
    } else {
      element.y = element.y + enemySpeed;
    }
    element.object.style.top = element.y;
    element.object.style.left = element.x;
  }
}

// Function to Move Bullets
function BulletMovement() {
  for (var i = 0; i < bullets.length; i++) {
    let element = bullets[i];
//Remove Bullet if it existed for X time
    element.TTL--;
    if (element.TTL == 0) {
      document.body.removeChild(element.object);
      bullets.splice(i, 1);
    }
    elementX = parseInt(element.object.style.left);
    elementY = parseInt(element.object.style.top);
//Move Bullet depending on direction
    switch (element.facing) {
      case "left":
        element.object.style.left = elementX - player.shootSpeed;
        break;
      case "right":
        element.object.style.left = elementX + player.shootSpeed;
        break;
      case "up":
        element.object.style.top = elementY - player.shootSpeed;
        break;
      case "down":
        element.object.style.top = elementY + player.shootSpeed;
        break;
    }
  }
}

// Function to check if 2 object intersect
function CheckCollision() {
  for (var i = 0; i < enemies.length; i++) {
//Check Collision with Player
    if (Intersect(enemies[i], player) && player.invincibilityCounter == 0) {
//Damage Player if touching
      player.invincibilityCounter = invincibilityFrame;
      UpdateSprite(1);
      player.HP--;
    }
    for (var j = 0; j < bullets.length; j++) {
//Check Collision with Bullets
      if (Intersect(enemies[i], bullets[j])) {
//Chance to Drop on enemy Death
        if (Random(0, 100) < dropRate) {
          Drop(enemies[i]);
        }
//Remove Bullet and Enemy
        document.body.removeChild(bullets[j].object);
        document.body.removeChild(enemies[i].object);
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
      }
    }
  }
//Check if player intersects with Drop
  for (var i = 0; i < drops.length; i++) {
    if (Intersect(player, drops[i])) {
//Apply Drop Effect
      switch (drops[i].object.className) {
        case "dropHeal":
          if (player.HP <= player.HPMax) {
            player.HP++;
          }
          break;
        case "dropSpeed":
          player.speed += 1;
          break;
        case "dropShootingSpeed":
          if (player.shootSpeed < 100) {
            player.shootSpeed += 1;
          }
          break;
        case "dropShootingRate":
          if (player.shootRate > 10) {
            player.shootRate -= 1;
          }
          break;
        case "dropHP":
          player.maxHP++;
          break;
      }
//Remove Drop after Use
      document.body.removeChild(drops[i].object);
      drops.splice(i, 1);
    }
  }
}

// Function to create a drop at the enemy's position
function Drop(enemy) {
  var drop = document.createElement("div");
  let random = Math.floor(Random(0, 5));
  switch (random) {
    case 0:
      drop.className = "dropHeal";
      break;
    case 1:
      drop.className = "dropSpeed";
      break;
    case 2:
      drop.className = "dropShootingSpeed";
      break;
    case 3:
      drop.className = "dropShootingRate";
      break;
    case 4:
      drop.className = "dropHP";
      break;
    default:
      drop.className = "dropHeal";
      break;
  }
  drop.id = "drop";
  drop.style.left = parseInt(enemy.object.style.left);
  drop.style.top = parseInt(enemy.object.style.top);
  document.body.appendChild(drop);
  drops.push({ id: drop.id, object: drop });
}


// Intersect function to check if two inputed elements intersect
function Intersect(element1, element2) {
  let rect1 = element1.object.getBoundingClientRect();
  let rect2 = element2.object.getBoundingClientRect();
  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

//Duh...
function Random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min) + min;
  }
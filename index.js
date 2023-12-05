const tickRate = 20;
var player = document.getElementById("player");
var up=false, down =false, left = false, right = false, move = false;
const refreshRate = 50;
const speed = 5;
const spawnRate = 100;
player.style.left = "0px";
player.style.top = "0px";
var width = window.innerWidth;
var height = window.innerHeight;
var playerLeft = parseInt(player.style.left);
var playerTop = parseInt(player.style.top);
var playerRight = playerLeft + player.scrollWidth;
var playerBottom = playerTop + player.scrollHeight;
var enemyID = 0;
var enemies = [];





function Init(){
    refresh = refreshRate;
    GameLoop();
    
}
function GetKey(e){
    switch (e.key) {
        case 'ArrowLeft':
            left = true;
            break;
        case 'ArrowUp':
            up = true;
            break;
        case 'ArrowRight':
            right = true;
            break;
        case 'ArrowDown':
            down = true;
            break;
    }
}
function ReleaseKey(e){
    switch (e.key) {
        case 'ArrowLeft':
            left = false;
            break;
        case 'ArrowUp':
            up = false;
            break;
        case 'ArrowRight':
            right = false;
            break;
        case 'ArrowDown':
            down = false;
            break;
    }
}

function GameLoop(){
    playerLeft = parseInt(player.style.left);
    playerTop = parseInt(player.style.top);
    playerRight = playerLeft + player.scrollWidth;
    playerBottom = playerTop + player.scrollHeight;

if (random(0,100)< spawnRate){
    Spawn();
}



    if (refresh >0) refresh--;
    if (refresh == 0){
        console.log("refresh");
        refresh = refreshRate;
        Shoot();
    }
    

    if (up || down || left || right){
        move = true;
    }
    else {
        move = false;}
    if (up && playerTop > 0){
        MoveUp();
    }
    if (down && playerBottom < height){
        MoveDown();
    }
    if (left && playerLeft > 0){
        MoveLeft();
    }
    if (right && playerRight < width){
        MoveRight();
    }
 
    requestAnimationFrame(GameLoop);
}


function MoveLeft(){
    player.style.left = parseInt(player.style.left) -speed;
}
function MoveRight(){
    player.style.left = parseInt(player.style.left)+ speed;
}
function MoveDown(){
    player.style.top = parseInt(player.style.top) + speed;
}
function MoveUp(){
    player.style.top = parseInt(player.style.top) - speed;
}
function RefreshPage(){
    width = window.innerWidth;
    height = window.innerHeight;
    
}
function Shoot(){
    var bullet = document.createElement("div");
    bullet.style.left = player.style.left;
    bullet.style.top = player.style.top;
}

function Spawn(){
    enemyID ++;
    var enemy = document.createElement("div");
    let enemyX = 0;
    let enemyY = 0;
    let enemyWidth = 0;
    let enemyHeight = 0;
    let side = random(0,4);
    switch (side){
        case 0:
            enemyX = 0;
            enemyY = random(0,height);
            break;
        case 1:
            enemyX = random(0,width);
            enemyY = 0;
            break;
        case 2:
            enemyX = width;
            enemyY = random(0,height);
            break;
        case 3:
            enemyX = random(0,width);
            enemyY = height;
            break;
        default:
            enemyX = 0;
            enemyY = 0;
        }
    enemy.style.left = enemyX;
    enemy.style.top = enemyY;
    enemyWidth = enemyX + enemy.scrollWidth;
    enemyHeight = enemyY + enemy.scrollHeight;
    enemies.push({id: enemyID, x: enemyX, y: enemyY});
    
}

function random(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min) + min;
}
const refreshRate = 50;  // update page size each 50 refreshes
const playerSpeed = 5; //player px per refresh
const playerShootingSpeed = 10; // bullet px per refresh
const playerShootingRate = 50; // refresh per shot
const enemySpeed = 2; // enemy px per refresh
const spawnRate = 5; // % chance to spawn
const initMaxEnemies = 5; // max enemies to spawn at start
const TTL = 70; // time to live
const playerHP = 3;
const dropRate = 20; // % chance to drop
const invincibilityFrame = 30; // refresh invincibility after hit
const playerNumber = 1;
var playerShoot = playerShootingRate;
var loop = true;
var highScore = document.getElementById("highScore");
var width = window.innerWidth; // get window width
var height = window.innerHeight; // get window height
var score = 0;
var enemyID = 0;
var bulletID = 0;
var dropID = 0;
var enemies = [];
var bullets = [];
var drops = [];
var deletList = [];

var player = new Player(
    id = 1, 
    object = document.getElementById("player"), 
    HP = playerHP, 
    HPDiv = document.getElementById("hp"), 
    score = 0, 
    scoreDiv = document.getElementById("score"), 
    speed = playerSpeed, 
    top = 0, 
    left = 0, 
    right = 0,
    bottom = 0, 
    invincibilityCounter = invincibilityFrame, 
    shootSpeed = playerShootingSpeed, 
    shootTimer = playerShootingRate, 
    upMov = false, 
    downMov = false, 
    leftMov = false, 
    rightMov = false, 
    move = false, 
    looking = "right");
player.object.style.left = player.left;
player.object.style.top = player.top
var refresh = refreshRate;
function Init(){
    if (!localStorage.getItem(highScore)){
        localStorage.setItem(highScore, 0);
    }
    highScore ="HighScore : " + localStorage.getItem(highScore);
    GameLoop();
    
}





//Get key press
function GetKey(e){
    switch (e.key) {
        case 'ArrowLeft':
            player.looking = "left";
            player.leftMov = true;
            break;
        case 'ArrowUp':
            player.looking = "up";
            player.upMov = true;
            break;
        case 'ArrowRight':
            player.looking = "right";
            player.rightMov = true;
            break;
        case 'ArrowDown':
            player.looking = "down";
            player.downMov = true;
            break;
    }
}
//Get key release
function ReleaseKey(e){
    switch (e.key) {
        case 'ArrowLeft':
            player.leftMov = false;
            break;
        case 'ArrowUp':
            player.upMov = false;
            break;
        case 'ArrowRight':
            player.rightMov = false;
            break;
        case 'ArrowDown':
            player.downMov = false;
            break;
    }
}


function MoveLeft(){
    player.object.style.left = parseInt(player.object.style.left) -player.speed;
}
function MoveRight(){
    player.object.style.left = parseInt(player.style.left)+ player.speed;
}
function MoveDown(){
    player.object.style.top = parseInt(player.style.top) + player.speed;
}
function MoveUp(){
    player.object.style.top = parseInt(player.style.top) - player.speed;
}


function GameLoop(){
    UpdatePlayer();
    GarbageCollector();
    CheckCollision();
    

    if (!player.move && player.shootTimer <= 0){ //Shoot if not moving
        player.shootTimer = player.shootRate;
        Shoot();
    }
    if (player.shootTimer> 0){
        player.shootTimer--;
    }
    if (player.invincibilityCounter >0){
        player.invincibilityCounter--;
    }


    if (Random(0,100)< spawnRate && enemies.length < initMaxEnemies+ score/10){
    Spawn();
}

    if (refresh >0){
        refresh--;
    }
    if (refresh == 0){
        refresh = refreshRate;
        RefreshPage();
    }
    

    if (player.upMov || player.downMov || player.leftMov || player.rightMov){
        player.move = true;
    }
    else {
        player.move = false;}
    if (player.upMov && player.top > 0){
        MoveUp();
    }
    if (player.downMov && player.bottom < height){
        MoveDown();
    }
    if (player.leftMov && player.left > 0){
        MoveLeft();
    }
    if (player.rightMov && player.right < width){
        MoveRight();
    }
    EnemeyMovement();
    BulletMovement();
    if (loop){
    requestAnimationFrame(Init);}
}


function MoveLeft(){
    player.object.style.left = parseInt(player.object.style.left) - player.speed;
}
function MoveRight(){
    player.object.style.left = parseInt(player.object.style.left)+ player.speed;
}
function MoveDown(){
    player.object.style.top = parseInt(player.object.style.top) + player.speed;
}
function MoveUp(){
    player.object.style.top = parseInt(player.object.style.top) - player.speed;
}
function RefreshPage(){
    width = window.innerWidth;
    height = window.innerHeight;
    
}
function Shoot(){

    bulletID++;
    var bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.id = "bullet" + bulletID;
    bullet.style.left = parseInt(player.object.style.left) + player.object.scrollWidth / 2;
    bullet.style.top = parseInt(player.object.style.top) + player.object.scrollHeight / 2;
    bullets.push({id:bulletID, object: bullet, facing: player.looking, TTL: TTL});
    document.body.appendChild(bullet);
}

function Spawn(){
    enemyID ++;
    var enemy = document.createElement("div");
    enemy.id = "enemy" + enemyID;
    enemy.className = "enemy";
    let enemyX = 0;
    let enemyY = 0;
    let enemyWidth = 0;
    let enemyHeight = 0;
    let side =Math.trunc(Random(0,4));
    switch (side){
        case 0:
            enemyX = 0;
            enemyY = Random(0,height);
            break;
        case 1:
            enemyX = Random(0,width);
            enemyY = 0;
            break;
        case 2:
            enemyX = width;
            enemyY = Random(0,height);
            break;
        case 3:
            enemyX = Random(0,width);
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
    enemies.push({id: enemy.id, x: enemyX, y: enemyY, object: enemy});
    document.body.appendChild(enemy);
    
}

function Random(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min) + min;
}
function UpdatePlayer(){
    if (player.HP <= 0){
        Fin();
    }   
    player.left = parseInt(player.object.style.left); //Update player position
    player.top = parseInt(player.object.style.top);
    player.right = player.left + player.object.scrollWidth;
    player.bottom = player.top + player.object.scrollHeight;
    player.HPDiv.innerHTML = "HP: " + player.HP + " / " + player.maxHP;
    player.scoreDiv.innerHTML = "Score: " + score;


}
function Fin(){
    loop = false;
    let restart = confirm("You are dead, not a big suprise! Wanna replay ?");
    if (restart == true){
    for (let i = 0; i < bullets.length; i++){
        document.body.removeChild(bullets[i].object);
        bullets.splice(i, 1);
    }
    for (let i = 0; i < enemies.length; i++){
        document.body.removeChild(enemies[i].object);
        enemies.splice(i, 1);
    }
    if (score > localStorage.getItem(highScore)){
    localStorage.setItem(highScore, score);
    }
    location.reload();}
}
function EnemeyMovement(){
    for (var i = 0; i < enemies.length; i++){
        let element = enemies[i]
        if (element.x < player.object.scrollWidth / 3 + parseInt(player.object.style.left)){
            element.x = element.x + enemySpeed;
        }
        else{
            element.x = element.x - enemySpeed;}
        
        if (element.y > player.object.scrollHeight / 3 + parseInt(player.object.style.top)){
    element.y = element.y - enemySpeed;}
        else{
            element.y = element.y + enemySpeed;
        }
    enemies[i].object.style.top = element.y;
    enemies[i].object.style.left = element.x;
    }
}
function BulletMovement(){
    for (var i = 0; i < bullets.length; i++){
        let element = bullets[i]
        element.TTL--;
        if (element.TTL == 0){
            document.body.removeChild(element.object);
            bullets.splice(i, 1);
        }

        elementX = parseInt(element.object.style.left);
        elementY = parseInt(element.object.style.top);
        
        switch (element.facing){
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

function CheckCollision(){
    for (var i = 0; i < enemies.length; i++){
        if (Intersect(enemies[i], player) && player.invincibilityCounter ==0){
            player.invincibilityCounter= invincibilityFrame;
            player.HP--;
        }
        for (var j = 0; j < bullets.length; j++){
            if (Intersect(enemies[i], bullets[j])){
                if (Random(0,100) < dropRate){
                    Drop(enemies[i]);
                }
                document.body.removeChild(bullets[j].object);
                document.body.removeChild(enemies[i].object);
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
                
                
            }
        }


    }
    for (var i = 0; i < drops.length; i++){
        if (Intersect(player, drops[i])){
            switch (drops[i].object.className){
                case "dropHeal":
                    if (player.HP <= player.HPMax){
                    player.HP++;
                    }
                    break;
                case "dropSpeed":
                    player.speed += 1;
                    break;
                case "dropShootingSpeed":
                    if (player.shootSpeed < 100){
                    player.shootSpeed += 1;}
                    break;
                case "dropShootingRate":
                    if (player.shootRate > 10){
                    player.shootRate -= 1;
                    }
                    break;
                case "dropHP":
                    player.maxHP ++;
                    break;
                };
            document.body.removeChild(drops[i].object);
            drops.splice(i, 1);
            
    
        }
    }

}
function Drop(enemy){
    dropID++;
    var drop = document.createElement("div");
    let random = Math.floor(Random(0,5));
    switch (random){
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
    drop.style.left = parseInt(enemy.object.style.left)
    drop.style.top = parseInt(enemy.object.style.top)
    document.body.appendChild(drop);
    drops.push({id: drop.id, object: drop});

}

function Intersect(element1, element2){
    let rect1 = element1.object.getBoundingClientRect();
    let rect2 = element2.object.getBoundingClientRect();
    return !(rect1.top > rect2.bottom || rect1.bottom < rect2.top || rect1.right < rect2.left || rect1.left > rect2.right);
}

function GarbageCollector(){
    for (var i = 0; i < arguments.length; i++){
    document.body.removeChild(deletList[i])
    }
}
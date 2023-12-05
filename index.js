var tickRate = 20;
var player = document.getElementById("player");
var up=false, down =false, left = false, right = false, move = false;
var debug = 0;
player.style.left = "250px";
player.style.top = "250px";




function Init(){
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
    console.log("up, down, left, right, move");
    console.log(up, down, left, right, move);
    console.log(player.style.left, player.style.top);
    console.log("left, top");
    if (up || down || left || right){
        move = true;
    }
    else move = false;
    if (up){
        MoveUp();
    }
    if (down){
        MoveDown();
    }
    if (left){
        MoveLeft();
    }
    if (right){
        MoveRight();
    }
 
    requestAnimationFrame(GameLoop);
}


function MoveLeft(){
    player.style.left = parseInt(player.style.left) -5;
}
function MoveRight(){
    player.style.left = parseInt(player.style.left)+ 5;
}
function MoveDown(){
    player.style.top = parseInt(player.style.top) + 5;
}
function MoveUp(){
    player.style.top = parseInt(player.style.top) - 5;
}
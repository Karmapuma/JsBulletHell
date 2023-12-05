var tickRate = 20;
var player = null;



function Init(){
    player = document.getElementById("player");
    GameLoop();
}
function GetKey(e){
    var key_code = e.wich || e.key_code;
    switch (key_code) {
        case 37:
            MoveLeft();
        case 38:
            MoveUp();
        case 39:
            MoveRight();
        case 40:
            MoveDown();
    }
}
function GameLoop(){
    



    player.style.top = parseInt(player.style.top - 5 +"px");
    player.style.position.top = parseInt(player.style.position.top + 5 +"px");
    //setTimeout(GameLoop, 1000/tickRate);
}


function MoveLeft(){
    player.style.left = parseInt(player.style.left - 5 + "px");
}
function MoveRight(){
    player.style.left = parseInt(player.style.left + 5 + "px");
}
function MoveDown(){
    player.style.top = parseInt(player.style.top - 5 + "px");
}
function MoveUp(){
    player.style.top = parseInt(player.style.top + 5 + "px");
}
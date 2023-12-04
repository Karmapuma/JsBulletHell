var tickRate = 20;


function init(){
    document.getElementById("Player")
}

function GameLoop(){
function getKey(e){
    var key_code = e.wich || e.key_code
    switch (key_code) {
        case 37:
            moveLeft();
        case 38:
            moveUp();
        case 39:
            moveRight();
        case 40:
            moveDown();
    }
    
}


    setTimeout(GameLoop, 1000/tickRate)
}


function moveLeft(){

}
function moveRight(){

}
function moveDown(){

}
function moveUp(){

}
class Player {
    constructor(id, object, HP, HPDiv, score, scoreDiv, speed, top, left, right, bottom, invincibilityCounter, shootSpeed, shootTimer, upMov, downMov, leftMov, rightMov, move, looking) {
        this.id = id;
        this.object = object;
        this.HP = HP;
        this.maxHP = HP;
        this.HPDiv = HPDiv;
        this.score = score;
        this.scoreDiv = scoreDiv;
        this.speed = speed;
        this.top = top;
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.invincibilityCounter = invincibilityCounter;
        this.shootSpeed = shootSpeed;
        this.shootRate = shootTimer;
        this.shootTimer = shootTimer;
        this.upMov = upMov;
        this.downMov = downMov;
        this.leftMov = leftMov;
        this.rightMov = rightMov;
        this.move = move;
        this.looking = looking;
    }}

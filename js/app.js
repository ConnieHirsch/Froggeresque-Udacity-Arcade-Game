// Enemies our player must avoid
var Enemy = function(enemy_x, enemy_y, startSpeed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = enemy_x;
    this.y = enemy_y;
    this.speed = startSpeed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
        this.speed = this.reset();
    }
    // invoke collision detection
    this.findCollision();
};

Enemy.prototype.reset = function(speed){
    this.x = -100;
    var speed = Math.floor(Math.random() * 140 + 40);
    //console.log("Bug reset, new speed is " + speed + "!");
    return speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// method to handle
Enemy.prototype.findCollision = function(){

    var pngWidth = 56; //total width of png: 101
    var pngHeight = 56; // total height of png : 171

    if (player.x < this.x + pngWidth &&
        player.x + pngWidth > this.x &&
        player.y < this.y + pngHeight &&
        player.y + pngHeight > this.y) {
        //collision?
        //document.getElementById("canvasTop").style.display = "block";
        console.log("Enemy Collision!!!1!");

        player.reset("You lost, please Restart!");
    }

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Now write your own player class
var Player = function() {
    this.x = 200;
    this.y = 410;
    this.sprite = 'images/char-pink-girl.png';
};

Player.prototype.update = function() {

};
// if we have a collision, restart the player back to start square
Player.prototype.reset = function(msg) {
    this.x = 200;
    this.y = 410;
    console.log("Player starts over!");
            //document.getElementById("canvasTop").style.display = "block";
    gameMessage(msg);
    restartEnemies();

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

    var player_base_move = 30;
Player.prototype.handleInput = function(event) {
    this.ctlKey = event;
    //console.log(this.ctlKey);

    if (this.ctlKey === 'left' && this.x > 0) {
        this.x -= player_base_move;
    } else if (this.ctlKey === 'right' && this.x < 410) {
        this.x = this.x + player_base_move;
    } else if (this.ctlKey === 'up' && this.y > 18 ) {
        this.y = this.y - player_base_move;
    } else if (this.ctlKey === 'down' && this.y < 410) {
        this.y = this.y + player_base_move;
    }

    if (player.y === -10) {
        player.reset("You WON!");
    }
    //console.log(this.ctlKey + ": I am at x" + this.x + ", y" + this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var paths = [65, 145, 226];
var allEnemies = [];

for (var path = 0; path < paths.length; path++ ) {
        //var speed = Math.floor(Math.random() * 140 + 40);
        //var startingLine = Math.floor(Math.random() * 300 + 100);
    // now we START all enemies offscreen, and let the player 'restart' them
    // when they are ready to actually START
    var newEnemy = new Enemy(-200, paths[path], 0);
    //console.log(newEnemy);
    allEnemies.push(newEnemy);
}
console.log(allEnemies);

function restartEnemies () {
    // add activity to offscreen enemies
    for (var enemy = 0; enemy < allEnemies.length; enemy++){
        var speed = Math.floor(Math.random() * 140 + 40);
        var startingLine = Math.floor(Math.random() * 300 + 100);
        allEnemies[enemy].x = -startingLine;
        allEnemies[enemy].speed = speed;
    };
    console.log("Restarted enemies!");
    console.log(allEnemies);
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);


});


// create a canvas screen to show won, lost message
function createCanvasTop(){
    var canvasTop = document.createElement('canvas'),
    ctx = canvasTop.getContext('2d');
    canvasTop.id = "canvasTop";
    canvasTop.width = 505;
    canvasTop.height = 606;
    document.body.appendChild(canvasTop);

}

function gameMessage(msg){
    createCanvasTop();
    var c = document.querySelector("#canvasTop");
    var ctxTop = c.getContext("2d");

    ctxTop.strokeStyle = "black";
    ctxTop.font = "36px Impact";
    ctxTop.textBaseline = "top";
    ctxTop.lineWidth = 2;
    ctxTop.strokeText(msg, 50, 20);

    document.getElementById("game").style.display = "none";
    document.getElementById("canvasTop").style.display = "block";

}

document.getElementById("start").addEventListener("click", function(){
    document.getElementById("start").style.display = "none";
    restartEnemies();
});
document.getElementById("restart").addEventListener("click", function(){
    document.getElementById("game").style.display = "block";
    // remove won, lost msg
    var oldTop = document.getElementById("canvasTop");
    document.body.removeChild(oldTop);

    restartEnemies();
});
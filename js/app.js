// Enemies our player must avoid
var Enemy = function(enemy_x, enemy_y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = enemy_x;
    this.y = enemy_y;
    this.speed = 80;
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
    speed = Math.floor(Math.random() * 140 + 40);
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
    var pngHeight = 85; // total height of png : 171

    if (player.x < this.x + pngWidth &&
        player.x + pngWidth > this.x &&
        player.y < this.y + pngHeight &&
        player.y + pngHeight > this.y) {
        //collision?
        console.log("Enemy Collision!!!1!");
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
    console.log(this.ctlKey + ": I am at x" + this.x + ", y" + this.y);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var Vader = new Enemy(-75, 226);
var Voldermort = new Enemy(-145, 145);
var Darkseid = new Enemy(-215, 65);

var allEnemies = [Vader, Voldermort, Darkseid];
//console.log(allEnemies);

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

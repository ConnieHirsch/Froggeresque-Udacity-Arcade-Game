// variables to hold values...
    var player_base_move = 30;
    var allEnemies = [];
    var score = 0;
    var lives = 3;


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

// method to handle collisions!
Enemy.prototype.findCollision = function(){

    var pngWidth = 56; //total width of png: 101
    var pngHeight = 56; // total height of png : 171

    if (player.x < this.x + pngWidth &&
        player.x + pngWidth > this.x &&
        player.y < this.y + pngHeight &&
        player.y + pngHeight > this.y) {
        //collision?
        console.log("Enemy Collision!!!1!");
        lives--;
        document.getElementById("lives").value = lives;
        if (lives < 1) {
            parkEnemies();
            score = 0;
            lives = 0;
            gameMessage("I'm sorry, you're out of lives!");
            hideRestart();
            showReplay();
        } else {
        player.reset("You lost, please Restart!");
        }
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
// event is win or lose, restart the player back to start square
//  and, send on the game message.
Player.prototype.reset = function(msg) {
    this.x = 200;
    this.y = 410;
    console.log("Player starts over!");
    gameMessage(msg);
    parkEnemies();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
        score++;
        document.getElementById("score").value = score;
        console.log(score);
        player.reset("You WON!");
    }
    //console.log(this.ctlKey + ": I am at x" + this.x + ", y" + this.y);
};


// decided I wanted predictable paths for bugs, hence the array.
var paths = [65, 145, 226];

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

// all bugs start off at 0 speed offscreen, only get moving when we tell them to
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

function parkEnemies() {
    // hide them offscreen until player is ready to restart
    for (var enemy = 0; enemy < allEnemies.length; enemy++){
        allEnemies[enemy].x = -200;
        allEnemies[enemy].speed = 0;
    };
}

//this is all it takes to start the player object.
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


// take the success/failure/whatever message and send it on to the headline div
function gameMessage(msg){
    document.getElementById("headline").style.display = "block";
    document.getElementById("headline").innerHTML = msg;
    document.getElementById("game").style.display = "none";
}


document.getElementById("start").addEventListener("click", function(){
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "inline";
    document.getElementById("headline").style.display = "none";
    restartEnemies();
});

document.getElementById("restart").addEventListener("click", function(){
    document.getElementById("game").style.display = "inline";
    document.getElementById("headline").style.display = "none";
    restartEnemies();
});

document.getElementById("replay").addEventListener("click", function() {
    hideReplay();
    hideRestart();
    document.getElementById("headline").style.display = "none";
    document.getElementById("game").style.display = "inline";
    player.x = 200;
    player.y = 410;
    score = 0;
    lives = 3;
    restartEnemies();
});

function hideRestart(){
    document.getElementById("restart").style.display = "none";
}

function showReplay() {
    document.getElementById("replay").style.display = "inline";
}

function hideReplay() {
    document.getElementById("replay").style.display = "none";
}
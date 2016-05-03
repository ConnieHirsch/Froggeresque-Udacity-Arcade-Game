// variables to hold values...
    var player_base_move = 30;
    var allEnemies = [];
    var allGems = [];
    var score = 0;
    var lives = 3;
    var pngWidth = 56; //total width of png: 101
    var pngHeight = 56; // total height of png : 171

/////////////////////////////////////////////////////////////////////////////
// Gems
var Gem = function(gem_x, gem_y) {
    this.x = gem_x;
    this.y = gem_y;
    //image sprite
    this.sprite = 'images/Gem Blue.png';
};

Gem.prototype.update = function(gem_x, gem_y) {
    this.x = gem_x;
    this.y = gem_y;
};

Gem.prototype.reset = function(){
    var place_x = Math.floor(Math.random() * 450 + 30);
    var place_y = Math.floor(Math.random() * 250 + 30);
    //console.log("Gem reset, now x:" + place_x + " y:" + place_y + "!");
    this.update(place_x, place_y);
};
// Draw the enemy on the screen, required method for game
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// place the gems
for (var gem = 0; gem < 3; gem++ ) {
    var place_x = Math.floor(Math.random() * 300 + 30);
    var place_y = Math.floor(Math.random() * 300 + 30);
    var newGem = new Gem(place_x, place_y);
    //console.log(newGem);
    allGems.push(newGem);
}
console.log(allGems);


/////////////////////////////////////////////////////////////////
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
    this.gemCollision();
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

// method to handle collisions!
Enemy.prototype.gemCollision = function(){

    // there are multiple gems!
    for (var gem = 0; gem < allGems.length; gem++){
    if (allGems[gem].x < this.x + pngWidth &&
        allGems[gem].x + pngWidth > this.x &&
        allGems[gem].y < this.y + pngHeight &&
        allGems[gem].y + pngHeight > this.y) {
        //collision?
        //console.log("Gem Collision!!!1!");
        allGems[gem].reset();
        }
    }
};

// Now write your own player class ////////////////////////////////////////////
// This class requires an update(), render() and
// a handleInput() method.
// Now write your own player class
var Player = function() {
    this.x = 200;
    this.y = 410;
    this.sprite = 'images/char-pink-girl.png';
};

Player.prototype.update = function() {
    //check to see if we've scored a gem.
    this.gemCollision();
    //NOTE: incrementing the score inside here means that it updates multiple times!
};

// event is win or lose, restart the player back to start square
//  and, send on the game message.
Player.prototype.reset = function(msg) {
    this.x = 200;
    this.y = 410;
    console.log("Player starts over!");
    // pass msg on from whereever reset is called.
    gameMessage(msg);
    // get enemies into position to start over
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
        adjustScore();
        player.reset("You WON this round!");
    }
    //console.log(this.ctlKey + ": I am at x" + this.x + ", y" + this.y);
};

// method to handle collisions!
Player.prototype.gemCollision = function(){

    // there are multiple gems!
    for (var gem = 0; gem < allGems.length; gem++){
    if (allGems[gem].x < this.x + pngWidth &&
    allGems[gem].x + pngWidth > this.x &&
    allGems[gem].y < this.y + pngHeight &&
    allGems[gem].y + pngHeight > this.y) {
        //collision?
        console.log("Player Gem Collision!!!1!");
        // move the gem offscreen where it won't count anymore
        allGems[gem].y = 1000;
        // increment the score
        adjustScore();
        }
    }

};

////////////////////////////////////////////////////////////////////////////
// Game functions
////////////////////////////////////////////////////////////////////////////

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

// increment the score
function adjustScore() {
        score++;
        document.getElementById("score").value = score;
        if (score >= 3) {
            player.reset("You WON! You are the BEST!");
        }
};

// take the success/failure/whatever message and send it on to the headline div
function gameMessage(msg){
    document.getElementById("headline").style.display = "block";
    document.getElementById("headline").innerHTML = msg;
    document.getElementById("game").style.display = "none";
}


// Start button to begin game binding
document.getElementById("start").addEventListener("click", function(){
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "inline";
    document.getElementById("headline").style.display = "none";
    restartEnemies();
});

// Next turn button binding
document.getElementById("restart").addEventListener("click", function(){
    document.getElementById("game").style.display = "inline";
    document.getElementById("headline").style.display = "none";
    restartEnemies();
});

// Start over button binding
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

/////////////////////////////////////////////////////////////////////////////
// Avatars-specific
// first, narrow down the buttons that get the click event added -- only
// the "characters" buttons

var allButtons = document.getElementsByTagName("button");
var characterButtons = [];
for (var btn = 0; btn < allButtons.length; btn++) {
    //console.log(allButtons[btn].parentNode.id);
    if (allButtons[btn].parentNode.id === "characters") {
    //console.log(allButtons[btn].innerHTML);
    characterButtons.push(allButtons[btn]);
    }
}
console.log(characterButtons);

// now add click event for the character buttons
for (var btn = 0; btn < characterButtons.length; btn++){

    var playerIcon = "images/char-" + characterButtons[btn].id + ".png";
    var charID = characterButtons[btn].id;
    console.log("adding " + playerIcon);

    characterButtons[btn].addEventListener("click", function(){
        console.log("clicked " + playerIcon);
        //alert(charID);
        player.sprite = playerIcon;
        //player.sprite = "images/char-" + charID + ".png";
    });
}
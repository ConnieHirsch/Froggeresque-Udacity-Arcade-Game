// variables to hold values...
    var player_base_move = 30;
    var allEnemies = [];
    var allGems = [];
    var score = 0;
    var lives = 3;
    var pngWidth = 56; //total width of png: 101
    var pngHeight = 56; // total height of png : 171
    const WINNING_SCORE = 4; // arbitrary WIN condition


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

// if we restart the game, all gems have to be replaced on teh board
function resetAllGems(){
    for (var gem = 0; gem < 3; gem++ ) {
    allGems[gem].y = Math.floor(Math.random() * 300 + 30);
    allGems[gem].x = Math.floor(Math.random() * 300 + 30);
    }
};

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
            gameMessage("<img src='images/enemy-bug.png'><p>Sorry, you're out of lives!<br/>Start over?</p>");
            hideStart();
            hideRestart();
            showReplay();
        } else {
        player.reset(lives + " lives left, continue?");
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
    // NOTE: default player is a girl!
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
        var leftToGo = WINNING_SCORE-score;
        if (score >= WINNING_SCORE || leftToGo === 0) {
            restartGame();
        } else {
            player.reset("You WON this round!<br/>Only " + leftToGo + " points to go!");
        }
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
        // test if we've gotten to WIN...
        if (score >= WINNING_SCORE) {
            restartGame();
            }
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
function startEnemies () {
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
// Player.handleInput() method.
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
};

///////////////////////////////////////////////////////////////////////////////
// Game Messaging

// take the success/failure/whatever message and send it on to the headline div
function gameMessage(msg){
    document.getElementById("headline").style.display = "block";
    document.getElementById("headline").innerHTML = msg;
    document.getElementById("game").style.display = "none";
}


// 'Start' button to begin game binding
document.getElementById("start").addEventListener("click", function(){
    showStart();
    hideRestart();
    document.getElementById("game").style.display = "inline";
    document.getElementById("headline").style.display = "none";
    startEnemies();
});

// Next turn button binding
document.getElementById("restart").addEventListener("click", function(){
    showReplay();
    document.getElementById("game").style.display = "inline";
    document.getElementById("headline").style.display = "none";
    startEnemies();
});

// Start over button binding
document.getElementById("replay").addEventListener("click", function() {
    restartGame();
});

// Choose Avatar Button
document.getElementById("chooseAvatar").addEventListener("click", function() {
    console.log("Calling avatar function");
    chooseAvatar();
});

// make the restart a function so that we can call it from player.reset too.
function restartGame() {
    console.log("Resetting game over, score: " + score + " / lives: " + lives);
    if (lives === 0) {
    document.getElementById("headline").style.display = "none";
    document.getElementById("game").style.display = "inline";
    } else {
    document.getElementById("headline").style.display = "block";
    // get current player icon (it can have been changeed) and display it with
    //  won msg
    var sprite = player.sprite;
    var playerPic = "<img src='" + sprite + "'>";
    document.getElementById("headline").innerHTML = playerPic + "<p>Terrific! You WON!<br/> Play Again?</p>";
    document.getElementById("game").style.display = "none";
    }
    hideReplay();
    hideRestart();
    showStart();
    player.x = 200;
    player.y = 410;
    score = 0;
    document.getElementById("score").value = score;
    console.log("score reset to " + score);
    lives = 3;
    document.getElementById("lives").value = lives;
    //startEnemies();
    resetAllGems();

};

// what the Choose Player Avatar button DOES
//
function chooseAvatar () {
    document.getElementById("avatar").style.display = "block";
    document.getElementById("gameArea").style.display = "none";
    document.getElementById("menu").style.display = "none";
}

function hideRestart(){
    document.getElementById("restart").style.display = "none";
}
function showRestart() {
    document.getElementById("restart").style.display = "inline";
}

function showReplay() {
    document.getElementById("replay").style.display = "inline";
}

function hideReplay() {
    document.getElementById("replay").style.display = "none";
}

function showStart() {
        document.getElementById("start").style.display = "inline";
}
function hideStart() {
        document.getElementById("start").style.display = "none";
}

/////////////////////////////////////////////////////////////////////////////
// Avatars-specific
// first, narrow down the buttons that get the click event added -- only
// the "characters" buttons

var allButtons = document.getElementsByTagName("button");
var characterButtons = [];
for (var btn = 0; btn < allButtons.length; btn++) {
    if (allButtons[btn].parentNode.id === "characters") {
    characterButtons.push(allButtons[btn]);
    }
}
console.log(characterButtons);

// now take that set of character buttons and assign click actions to them
// but we'll have to make it a CLOSURE FUNCTION

// actual action called by callback
function changeCharacter(playerIcon) {
  player.sprite = "images/char-" + playerIcon + ".png";
  //And when we've changed the image, put the screen back the way it was...
  document.getElementById("avatar").style.display = "none";
  document.getElementById("menu").style.display = "inline";
  document.getElementById("gameArea").style.display = "block";
}

// callback to send on the data to the sprite change
function makeChangeCallback(playerIcon) {
  return function() {
    changeCharacter(playerIcon);
  };
}

// function to go through the character buttons, set up the value to be passed
// on to the callback, and instantiate the onclick eventlistener.
function setupPlayerIcon() {

  for (var btn = 0; btn < characterButtons.length; btn++) {
    var playerIcon = characterButtons[btn].id;
    console.log("Setting up onclick for " + playerIcon);
    characterButtons[btn].onclick = makeChangeCallback(playerIcon);
  }
}

// and run the function now!
setupPlayerIcon();

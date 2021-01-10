check_cookie_name("arcade");

// Character
var character = document.getElementById("meta");

// gamemode
var gamemode = undefined;

// Game data
var game = false;

// Game score
var score = 0;

// Defining the state of ending
var allowed = true;

// Default variables for the starting positions that the character is allowed to move
var moveRight = true;
var moveLeft = false;
var moveUp = false;     // Remains false because it is a 2D game {extends +1 line}
var moveDown = false;

// Character positions (in pixels) for next move (as-is Default)
var posLeft = 150;
var posTop = 50;

// Character pin-points as a "grid" format
var gridX = 1;
var gridY = null;

// Identify if it's the first move
var firstMove = true;

// Dedicate menu
var menu = true;

// setTimeout() variable store (as "global")
var gHr1 = undefined;

// Generate random number variable [used for loadMeteor()]
var rand = Math.floor(Math.random() * 11);

var retry = false;

// Generate computed level as "undefined" 
var exeLevel = undefined; 


// function() for checking for user inputs on keyboard (checkKey() is executed @ "onkeydown" event located in the <body> tag)
function checkKey(event) {  // "event" is the keyboardEvent which is called when the function is triggered
  var x = event.key;      // Detects the "key" event and stores it as "x" variable
  
  if(x === "d" || x === "D") {        // Changing X
    if(moveRight === true) {    // Checks if the movement the user inputs is allowed by the program
      if(firstMove === true) {  // Determine if the input is the first one
        posLeft = 0;          // Allocates the characters position correctly [fixes bug] {extends +1 line}   currently disbled as game is 2D
        posTop = 0;             // Remains as value "0" as it is only used for 3D programs (as well as variable "gridY")
      }
      firstMove = false;        // Will always happen as the first move can only happen once per window
      
      character.src = "./meta-right.png"
      
      posLeft = posLeft + 150;  // !IMPORTANT: Must be infront of line [37 or 52] due to incorrect movement [fixes bug]
      
      moveLeft = true;          // Tells the program to allow moving left
      character.style.transform = "translate3d(" + posLeft + "px, " + posTop + "px, 0)" // X, Y, Z    [width, height, depth]  Moves the character to the correct position reletive to its X and Y coordinate
      gridX = gridX + 1;        // Updates the X coordinate (as: grid) to the position of the character
      
      console.log(gridX)        // Determines if the character is too far left / right and then returns the correct variable to "false" {extends +3 lines}
      if(gridX === 11) {        // "11" is the final move before the character is too far right
        moveRight = false;      // "moveRight" is the variable that allows the character to move right [located in: line 27]
      }
    };
  } else if(x === "a" || x === "A") {     // Remaining code is a mirrored-version of the code above ^^^ (but has minor changes at line [47])
    if(moveLeft === true) {
      // First move ID is removed as the first move cannot be left
      
      character.src = "./meta-left.png"
      
      posLeft = posLeft - 150;
      
      moveRight = true;
      character.style.transform = "translate3d(" + posLeft + "px, " + posTop + "px, 0)" // X, Y, Z    [width, height, depth]
      gridX = gridX - 1;
      
      console.log(gridX)
      if(gridX === 1) {
        moveLeft = false;
      }
    }
  } else if(x === "e" || x === "E") {
    if(gamemode === 'normal' && retry === true) {
      score = 0;
      startGame()
      allowed = true;
    } else if(gamemode === 'arcade') {
      document.cookie = "arcade=true";
      reloadWindow()
    }
  } else if(x === "n" || x === "N") {
    if(exeLevel === 2) {
      startGame()
      level2()
    }
  }
};


function startGame() {                                // Function to start the game
  var menu = document.getElementById("menu");         // Hides the starting menu {extends +1 line} 
  var otherMenu = document.getElementById("ending")
  menu.style.transform = "translate3d(200vh, 0, 0)";
  game = true;                                        // Changes the state of the game to "true"
  menu = false;
  otherMenu.style.transform = "translate3d(0, -100vh, 0)"
  //var levelMenu = document.getElementById("lvl-menu");
  score = 0;
}

function endGame() {                                  
  if(allowed === true) {
    var endDiv = document.getElementById("ending");
    game = false;
    var endDisplay = document.getElementById("end-display");
    endDisplay.innerText = "You got: " + score;
    endDiv.style.transform = "translate3d(0, 100vh, 0)";
    allowed = false;
    countdown()
  }
}

function countdown() {
  var ele = document.getElementById("g5Fr5");
  ele.innerText = 'Press "E" to retry (3)';
  setTimeout(() => {
    ele.innerText = 'Press "E" to retry (2)';
    setTimeout(() => {
      ele.innerText = 'Press "E" to retry (1)';
      setTimeout(() => {
        ele.innerText = 'Press "E" to retry';
        retry = true;
      }, 1200);
    }, 1000);
  }, 1000)
}

function reloadWindow() {
  location.reload();
}

function loadMeteor(mPos) {
  if (game === true) {
    var grid = mPos * 150;

    var meteor = document.createElement("img");
    meteor.src = "./meteor.png";
    meteor.classList.add("meteorMeta");
    meteor.style.left = grid + "px";
    document.body.appendChild(meteor)

    setTimeout(() => {
      meteor.style.transform = "translate3d( 0, " + 1500 + "px, 0)" // X, Y, Z
      setTimeout(() => {
        if ((gridX - 1) === mPos) {
          endGame();
        } else {
          changeScore(100)
        }
      }, 1050)
    }, 500)
    refresh()
  }
}

function setLoop(tickspeed) {
  var gameLoop = setInterval(() => {
    loadMeteor(rand);
  }, tickspeed)
}

function refresh() {
  rand = Math.floor(Math.random()* 11)
}

function changeScore(amt) {
  var display = document.getElementById("doc-display")
  score = score + amt;
  display.innerText = score;
}

var starting = 1000;

function arcadeMode() {
  setLoop(1000);
  var definer = undefined;
  setInterval(() => {
    if(score > 900 && definer === undefined) {
      setLoop(900);
      definer = 1;
    } else if(score > 1900 && definer === 1) {
      setLoop(850);
      definer = 2;
    } else if(score > 2900 && definer === 2) {
      setLoop(800);
      definer = 3;
    }
  }, 100)
}

/* MODS */
function loadMod(name) {
  var script = document.createElement("script");
  script.src = "./modifications" + name + ".js";
  document.body.appendChild(script);
}

function mode(levelName) {
  gamemode = levelName;
}

function check_cookie_name(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    document.cookie = "arcade=tobedeleted; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    var btn115 = document.getElementById("arcadeBtn");
    alert("Timed out (sent incorrect data towards servers)")
    console.log("Data found & destroyed")
  } else {
    console.log('Data unknown');
  }
}

/*                                                Adventrue
*/

function openLevels() {
  var levelMenu = document.getElementById("lvl-menu");
  levelMenu.style.transform = "translate3d(0, -100vh, 0)"
}

function level1() {
  if (score < 1000) {
    loadMeteor(rand);
    level1();
  } else {
    var endDisplay = document.getElementById("end-display");
    var endDiv = document.getElementById("ending");
    endDiv.style.transform = "translate3d(0, 100vh, 0)";
    endDisplay.innerText = "Level " + currentLevel + " completed!"
    var ele = document.getElementById("g5Fr5");
    ele.innerText = 'Press "N" to go to level ' + nextLevel;
    exeLevel = nextLevel;
  }
}

function level2() {
}



//INIT CANVAS + SCREEN CONFIGURATION

//get our drawwable canvas
const canvasEl = document.getElementById('canvas');
const context = canvasEl.getContext('2d');

//grid and canvas size
const gridSizeX = 128;
const gridSizeY = 80;
const width = canvasEl.width = gridSizeX;
const height = canvasEl.height = gridSizeY;
const backgroundColor = "#000000";


//GAME VARIABLES

//speed is in units per second, a unit is a square on the playfield
let ballSpeedX = -25;
let ballSpeedY = -10;
let ballSizeX = 1;
let ballSizeY = 1;
let ballColor = "#FFFFFF";
let ballPositionX = Math.round(gridSizeX * .5);
let ballPositionY = Math.round(gridSizeY * .5);

let batSpeedY = 40;
let batSizeX = 1;
let batSizeY = 12;
let batColor = "#FFFFFF";

let ballImageSrc = "https://www.colora.be/nl/media/catalog/product/cache/1/image/620x/17f82f742ffe127f42dca9de82fb58b1/7/1/71014-1/voetbal-30.png";

//player 1 variables
let bat1PositionX = 1;
let bat1PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);
let bat1movingUp = false
let bat1movingDown = false;

//player 2 variables
let bat2PositionX = gridSizeX - 2;
let bat2PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);
let bat2movingUp = false;
let bat2movingDown = false;

let scoreLeft = 0;
let scoreRight = 0;
let player1Text = "Player 1";
let player2Text = "Player 2";

let gameOver = false;

//RENDER FUNCTIONS

/**
 * Draw a rectangle at given positon and given size with given color
 * @param {number} xPos 
 * @param {number} yPos 
 * @param {number} xWidth 
 * @param {number} yWidth 
 * @param {string} color example and default: "#FFFFFF"
 */

 //play audiofile (folder: sounds)
function playAudio(filename)
{
    var audio = new Audio(filename);
    audio.play();
}


function drawRectangle(xPos, yPos, width, height, color = "#FFFFFF") {
    context.fillStyle = color;
    context.fillRect(Math.round(xPos), Math.round(yPos), width, height);
}

function drawImages(xPos, yPos, width, height)
{
    var img = document.getElementById("image");
    context.drawImage(img, Math.round(xPos), Math.round(yPos));
}

/**
 * Draws the current score
 */
function drawScore() {
    context.textAlign = "center";
    context.font = "7px 'MS UI Gothic'";
    context.fillStyle = "#FFFFFF";
    context.fillText(scoreLeft + " - " + scoreRight, gridSizeX * .5, 10);

    if(gameOver) {
        context.fillText("GG", gridSizeX * .5, 20);
    }
}

/**
 * Actually draws the background, the players and the ball
 */
function drawGame() {
    //draw the background
    drawRectangle(0,0,width,height, backgroundColor);

    //draw player 1
    drawRectangle(bat1PositionX, bat1PositionY, batSizeX, batSizeY, batColor);

    //draw player 2
    drawRectangle(bat2PositionX, bat2PositionY, batSizeX, batSizeY, batColor);

    //draw ball
    drawImages(ballPositionX, ballPositionY, ballSizeX, ballSizeY);


    //draw the score
    drawScore();
}

//GAMELOOP
/**
 * Restarts the game
 */
function restart() {
    setTimeout(function() {

        //play game start sound
        playAudio('sounds/gamestart.wav');

        //change game over to false
        gameOver = false;
        
        //reset all the positions
        ballPositionX = Math.round(gridSizeX * .5);
        ballPositionY = Math.round(gridSizeY * .5);
        bat1PositionX = 1;
        bat1PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);
        
        bat2PositionX = gridSizeX - 2;
        bat2PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);

        //@TODO: give the ball a random direction, by creating the 
        //       generateRandomValueBetween function and ucommenting
        //       the assignment calls made below        
        // ballSpeedX = generateRandomValueBetween(-40,40);
        // ballSpeedY = generateRandomValueBetween(-20,20);

        function generateRandomValueBetween(numberMin, numberMax)
        {
            //number between (0 and 1 * min userinput converted to positive * 2 + 1) - max userinput
            numberN = Math.floor(Math.random() * Math.abs(numberMin) * 2 + 1) - numberMax; 
            return numberN; //returns generated number to ballspeedX or Y
        }

        ballSpeedX = generateRandomValueBetween(-40, 40);
        ballSpeedY = generateRandomValueBetween(-20, 20);

    }, 1000);
}

let deltaTime = 0;
let lastTime = performance.now();
let now = performance.now();

//update is called every frame
function update() {

    //calculate the time difference (deltaTime) with last frame
    now = performance.now();
    deltaTime = (now - lastTime) * .001;
    lastTime = now;

    //move ball
    ballPositionX = ballPositionX + ballSpeedX * deltaTime;
    ballPositionY = ballPositionY + ballSpeedY * deltaTime;

    //for colission checking we will use a rounded ball position so we can check if a ball is matching an exact round number
    let roundedBallPositionX = Math.round(ballPositionX);
    let roundedBallPositionY = Math.round(ballPositionY);

    //check for ball colission with player 1
    if(roundedBallPositionX === bat1PositionX) { //check if the ballposition is the same as the players x position
        if(
            roundedBallPositionY >= bat1PositionY && //the rounded ballPosition is greater or equal to the position of the bat
            roundedBallPositionY < bat1PositionY + batSizeY //the roudned ballPosition is smaller than the batPosition plus its size
            //if both statements are true we are connecting vertically with the bat
        ) {
            //ball collided with player so we reverse it's xSpeed so we have a "bounce"
            ballSpeedX = ballSpeedX * -1;
            playAudio('sounds/bat1blip.wav');
        }
    }

    //@TODO: check for ball colission with player 2
    if(roundedBallPositionX === bat2PositionX) { //check if the ballposition is the same as the players x position
        if(
            roundedBallPositionY >= bat2PositionY && //the rounded ballPosition is greater or equal to the position of the bat
            roundedBallPositionY < bat2PositionY + batSizeY //the roudned ballPosition is smaller than the batPosition plus its size
            //if both statements are true we are connecting vertically with the bat
        ) {
            //ball collided with player so we reverse it's xSpeed so we have a "bounce"
            ballSpeedX = ballSpeedX * -1;
            playAudio('sounds/bat2blip.wav');
        }
    }

    //@TODO: check for ball with top and bottom boundary colission
    if(roundedBallPositionY < 0) 
    {
        ballSpeedY = ballSpeedY * -1;
        playAudio('sounds/bounce.wav');
    }

    if(roundedBallPositionY === gridSizeY) 
    {
        ballSpeedY = ballSpeedY * -1;
        playAudio('sounds/bounce.wav');
    }

    //check if the ball is passed the left boundary
    if(roundedBallPositionX < 0 && !gameOver) {
        gameOver = true;
        playAudio('sounds/gameover.wav');
        scoreRight++;
        restart();
    }
    
    //@TODO: check if the ball is passed the right boundary
        // -> Restart the game if the boundaries are hit and update the scoreLeft or scoreRight
    if(roundedBallPositionX > gridSizeX && !gameOver) {
        gameOver = true;
        playAudio('sounds/gameover.wav');
        scoreLeft++;
        restart();
    }       

    //@TODO: check if player hits boundary
    if(bat1PositionY <= gridSizeY)
    {
        bat1PositionY === 1;
    }

    //move player 1 up or down
    if(bat1movingUp) {
        bat1PositionY = bat1PositionY - batSpeedY * deltaTime;
    } else if (bat1movingDown) {
        bat1PositionY = bat1PositionY + batSpeedY * deltaTime; 
    }

    //@TODO: move player 2 up an down
    if(bat2movingUp) {
        bat2PositionY = bat2PositionY - batSpeedY * deltaTime;
    } else if (bat2movingDown) {
        bat2PositionY = bat2PositionY + batSpeedY * deltaTime; 
    }

    //call the drawGame functions so that we actually draw the game after all variable changes inside the gameloop are done
    drawGame();

    //request an animation from the browser to start the next update loop
    window.requestAnimationFrame(update);
}

//start the game loop by requesting an animation frame from the browser
window.requestAnimationFrame(update);

//INPUT HANDLING

//listen for player 1 input
document.addEventListener('keydown', function(e){
    switch(e.key) {
        case "w":
            bat1movingUp = true;
            break;
        case "s":
            bat1movingDown = true;
            break;
    }
});

document.addEventListener('keyup', function(e){
    switch(e.key) {
        case "w":
            bat1movingUp = false;
            break;
        case "s":
            bat1movingDown = false;
            break;
    }
});

//player 2 input
//@TODO: listen for player 2 input
document.addEventListener('keydown', function(e){
    switch(e.key) {
        case "i":
            bat2movingUp = true;
            break;
        case "k":
            bat2movingDown = true;
            break;
    }
});

document.addEventListener('keyup', function(e){
    switch(e.key) {
        case "i":
            bat2movingUp = false;
            break;
        case "k":
            bat2movingDown = false;
            break;
    }
});

//@TODO: add graphical enhancement to the game
//game has sounds
//images

//@TODO: add an interesting mechanic to the game
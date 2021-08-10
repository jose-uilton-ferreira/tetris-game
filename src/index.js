import Game from './modules/Game';
import * as constants from './modules/constants';

// Control the music
const ICON_MUTE = 'fas fa-volume-mute';
const ICON_PLAY = 'fas fa-volume-up';
const musicButton = document.getElementById('music-toggle');
const iconMusic = document.getElementById('icon-music');

let toggleMusic = false;
let music = new Audio('./assets/tetris.mp3');
music.loop = true;

musicButton.addEventListener('click', event => {

    toggleMusic = !toggleMusic;

    iconMusic.className = toggleMusic ? ICON_PLAY : ICON_MUTE;
    toggleMusic ? music.play() : music.pause(); 

});

// Modal game over
const modalBack = document.querySelector('.modal-back');

// Create the game
const game = new Game();

// variables that control the frames
let lastFrameTimeMs = 0;
let maxFPS = 60;
let delta = 0;
let timestep = 1000 / 60;
let running = false;
let started = false;
let frameID = 0;


function panic() {
    delta = 0;
}

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) {
        started = true;
        frameID = requestAnimationFrame(function(timestamp) {
            game.draw();
            running = true;
            lastFrameTimeMs = timestamp;
            frameID = requestAnimationFrame(mainLoop);
        });
    }
}

function mainLoop(timestamp) {
    // Throttle the frame rate.    
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        frameID = requestAnimationFrame(mainLoop);
        return;
    }

    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    let numUpdateSteps = 0;
    while (delta >= timestep) {
        game.update(timestep);
        delta -= timestep;
        if (++numUpdateSteps >= 240) {
            panic();
            break;
        }
    }

    if (game.gameOver) {
        stop();
        modalBack.style.display = 'flex';
        return;
    }

    game.draw();

    frameID = requestAnimationFrame(mainLoop);
}

start();

// listen keys down
window.addEventListener('keydown', event => {

    let keyCode = event.code;

    if (keyCode === constants.KEYS_CODE.left) game.keysPressed.left = true;
    if (keyCode === constants.KEYS_CODE.right) game.keysPressed.right = true;
    if (keyCode === constants.KEYS_CODE.up) game.keysPressed.up = true;
    if (keyCode === constants.KEYS_CODE.down) game.keysPressed.down = true; 

});

// Listen keys up
window.addEventListener('keyup', event => {

    let keyCode = event.code;

    if (keyCode === constants.KEYS_CODE.left) game.keysPressed.left = false;
    if (keyCode === constants.KEYS_CODE.right) game.keysPressed.right = false;
    if (keyCode === constants.KEYS_CODE.up) game.keysPressed.up = false;
    if (keyCode === constants.KEYS_CODE.down) game.keysPressed.down = false; 

});
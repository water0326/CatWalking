import * as Character from './character.js'
import * as Road from './road.js'

var canvas = document.getElementById('cvs');
var ctx = canvas.getContext('2d');

const INIT_IMG_URL = "./image/";
const MOBILE_SLIDE_VALUE = 60;

var maxWidth;
var maxHeight;

var loop_func;

var Screen = document.getElementById('screen');
var Text = document.getElementById('text');
var Button = document.getElementById('button');

Button.onclick = () => {StartGame()};

var isStart = false;

const fps = 30;

function Awake() {
    ScreenSet();
    Road.Awake();
    Character.Awake();
}

function ScreenSet() {

    maxWidth = window.innerWidth;
    maxHeight = window.innerHeight;

    canvas.width = String(maxWidth);
    canvas.height = String(maxHeight);
    canvas.style.width = String(maxWidth) + "px";
    canvas.style.height = String(maxHeight) + "px";
}

function Start() {
    Character.Start();
    Road.Start();
}

function Update() {
    Road.Update();
    Character.Update();
}

function Render() {
    Road.Render();
    Character.Render();
    Character.ScoreRender();
}

function StopGame() {
    
    canvas.style.filter = 'blur(5px)';
    isStart = false;
    Text.innerText = Character.Character.score + "점";
    Button.innerText = "다시 하기";
    Screen.style.display = "flex";
}

function StartGame() {
    clearInterval(loop_func);
    canvas.style.filter = 'blur(100px)';
    
    isStart = true;
    Screen.style.display = "none";
    
    setTimeout(() => {
        StartLoop();
        canvas.style.filter = 'blur(0px)';
    }, 500);
    console.log("start");
}

function StartLoop() {
    
    Awake();
    Start();
    loop_func = setInterval(() => {
        ctx.clearRect(0, 0, maxWidth, maxHeight);
        Update();
        Render();
    }, 1000/fps);
}

window.onload = () => {
    Awake();
    Start();
    StartLoop();
};

export {maxWidth, maxHeight, ctx, fps, StopGame, isStart, INIT_IMG_URL, MOBILE_SLIDE_VALUE};
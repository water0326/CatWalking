import * as Main from './index.js';
import * as Road from './road.js';

var Character = {
    "sprite": new Image(),
    "spriteUrl": "Cat.png",
    "spriteOffset": 1.1,
    "score": 0,
    "backwardScore": 0,
    "color": "#ABABAB",
    "x": 0,
    "y": 0,
    "InitYRatio": 5/6,
    "InitY": 0,
    "size": 60
};

var keyPressed = false;
var keyValue = -1;
var curKeyCooldown = 0;
var keyCooldown = 0.15;

var mousePos = [0, 0];
var mouseDown = false;


addEventListener("touchstart", (e) => {
    if(Main.isStart && curKeyCooldown >= keyCooldown && !mouseDown) {
        mousePos = [e.touches[0].clientX, e.touches[0].clientY];
        mouseDown = true;
    }
})

addEventListener("touchend", (e) => {
    if(Main.isStart && curKeyCooldown >= keyCooldown && mouseDown) {
        mouseDown = false;
        mousePos[0] = -(mousePos[0] - e.changedTouches[0].clientX);
        mousePos[1] = -(mousePos[1] - e.changedTouches[0].clientY);

        if(mousePos[0] > Main.MOBILE_SLIDE_VALUE && Math.abs(mousePos[0]) > Math.abs(mousePos[1])) {
            keyValue = "Right";
            keyPressed = true;
        }
        else if(mousePos[0] < -Main.MOBILE_SLIDE_VALUE && Math.abs(mousePos[0]) > Math.abs(mousePos[1])) {
            keyValue = "Left";
            keyPressed = true;
        }
        else if(mousePos[1] > Main.MOBILE_SLIDE_VALUE && Math.abs(mousePos[0]) < Math.abs(mousePos[1])) {
            keyValue = "Down";
            keyPressed = true;
        }
        else {
            keyValue = "Up";
            keyPressed = true;
        }
    }
})


addEventListener("keydown", (e) => {
    if(Main.isStart && curKeyCooldown >= keyCooldown) {
        if(e.keyCode == 38) {
            keyValue = "Up";
            keyPressed = true;
        }
        else if(e.keyCode == 40) {
            keyValue = "Down";
            keyPressed = true;
        }
        else if(e.keyCode == 37) {
            keyValue = "Left";
            keyPressed = true;
        }
        else if(e.keyCode == 39) {
            keyValue = "Right";
            keyPressed = true;
        }
    }
    
});

function Awake() {

    mousePos = [0, 0];
    mouseDown = false;
    keyPressed = false;
    keyValue = -1;
    curKeyCooldown = 0;

    Character.InitY = Main.maxHeight * Character.InitYRatio;
    Character.sprite.src = Main.INIT_IMG_URL + Character.spriteUrl;
    Character_Reset();
}

function Character_Reset() {
    Character.score = 0;
    Character.y = Character.InitY;
    Character.x = Main.maxWidth / 2;
    Character.backwardScore = 0;
}

function Start() {

}

function Update() {
    curKeyCooldown += 1 / Main.fps;
    if(keyPressed) {
        keyPressed = false;
        curKeyCooldown = 0;
        if(keyValue == "Up") {

            if(isObstacle(Character.x, Road.config.CharacterToRoadIdx+1)) return;

            Character.y -= Road.config.RoadSize;
            Road.DeleteFrontRoad();
            Road.CreateNewRoad(Math.random());
            if(Character.backwardScore >= 0) {
                Character.score += 1;
            }
            else {
                Character.backwardScore++;
            }

            
            
        }
        else if(keyValue == "Down") {

            if(isObstacle(Character.x, Road.config.CharacterToRoadIdx-1)) return;

            Character.y += Road.config.RoadSize;
            Character.backwardScore--;
            Road.CreateFrontTempRoad();   
        }
        else if(keyValue == "Left") {

            if(isObstacle(Character.x - Road.config.RoadSize, Road.config.CharacterToRoadIdx)) return;

            Character.x -= Road.config.RoadSize;
        }
        else if(keyValue == "Right") {

            if(isObstacle(Character.x + Road.config.RoadSize, Road.config.CharacterToRoadIdx)) return;

            Character.x += Road.config.RoadSize;
        }
        
        
    }
    Character.y += (Character.InitY - Character.y) * 0.1;
}

function isObstacle(x,checkIdx) {
    for(var i = 0 ; i < Road.roadList[checkIdx].objectList.length ; i++) {
       if(Road.roadList[checkIdx].objectList[i].x == x) {
            curKeyCooldown = keyCooldown;
            return true;
       }
    }
    return false;
}

function ScoreRender() {
    Main.ctx.fillStyle = "#FFFFFF";
    Main.ctx.font = "bold 80px 'Gaegu', cursive";
    Main.ctx.fillText(Character.score, Main.maxWidth * 0.5 - 30 * Character.score.toString().length, Main.maxHeight * 0.1);
}

function Render() {
    Main.ctx.fillStyle = Character.color;
    Main.ctx.drawImage(Character.sprite, Character.x-Character.size*Character.spriteOffset/2, Character.y - Character.size*Character.spriteOffset/2, Character.size*Character.spriteOffset, Character.size*Character.spriteOffset);
    
}

export {Awake, Start, Update, Render, Character, ScoreRender};
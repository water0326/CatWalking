import * as Main from './index.js';
import * as Character from './character.js'

class Road {
    constructor(roadType, objectSpeed, objectGenCooldown, direction, objectLength) {

        this.curCooldown = 0;

        this.roadType = roadType; // 0 : driveway, 1 : sidewalk

        this.objectLength = objectLength;
        this.objectSpeed = objectSpeed;
        this.objectGenCooldown = objectGenCooldown;
        this.direction = direction;
        this.objectList = [];
    }
}

class Car {
    constructor(x, spriteIdx) {
        this.spriteIdx = spriteIdx;
        this.x = x;
    }
}

class Obstacle {
    constructor(x, spriteIdx) {
        this.spriteIdx = spriteIdx;
        this.x = x;
    }
}


var roadList = [];
const config = {
    "sprite": [new Image(), new Image()],
    "spriteUrl": ["DriveWay.png", "SideWalk.png"],
    "RoadColor": "#FFFFFF",
    "InitCount": 20, 
    "objectSpeedRange": [20, 35],
    "objectGenCooldownRange": [1.3, 3.3],
    "DirectionList": ["Left", "Right"],
    "RoadSize": 90,
    "RoadSizeOffset": 0,
    "CharacterToRoadIdx": 5,
    "CarOffset": 10,
    "RoadPercentage": [0.8, 0.2],
    "Obstacle_Percentage": 0.3,
    "CarSprite": [new Image(), new Image(), new Image()],
    "CarSpriteUrl": ["Car.png", "Car2.png", "Car3.png"],
    "ObstacleSprite": [new Image(), new Image(), new Image()],
    "ObstacleSpriteUrl": ["Tree1.png", "Tree2.png", "Tree3.png"],
    "ObstacleScale": 0.8
};



function Awake() {

    roadList = [];

    for(var i = 0 ; i < config.sprite.length ; i++) {
        config.sprite[i].src = Main.INIT_IMG_URL + config.spriteUrl[i];
    }

    for(var i = 0 ; i < config.CarSprite.length ; i++) {
        config.CarSprite[i].src = Main.INIT_IMG_URL + config.CarSpriteUrl[i];
    }

    for(var i = 0 ; i < config.ObstacleSprite.length ; i++) {
        config.ObstacleSprite[i].src = Main.INIT_IMG_URL + config.ObstacleSpriteUrl[i];
    }
    
    for(var i = 0 ; i < config.InitCount ; i++) {
        if(i == config.CharacterToRoadIdx) {
            CreateNewRoad(0.9); // Generate SideWalk
        }
        CreateNewRoad(Math.random());
    }
}

function CreateNewRoad(percentage) {
    
    for(var i = 0 ; i < config.RoadPercentage.length ; i++) {
        percentage -= config.RoadPercentage[i];
        //console.log(i,percentage)
        if(percentage < 0) {
            var roadTypeIdx = i;
            break;
        }
    }
    if(roadTypeIdx == 0) { // driveway
        roadList.push(new Road(
            0,
            GetRandomByFloat(config.objectSpeedRange),
            GetRandomByFloat(config.objectGenCooldownRange),
            ChooseRandom(config.DirectionList),
            120
        ));
        
        
    }
    else if(roadTypeIdx == 1) { // sideWalk
        roadList.push(new Road(
            1,
            0,
            1,
            "Left",
            config.RoadSize
        ));
        for(var i = Main.maxWidth * 0.5 % roadList[roadList.length - 1].objectLength - roadList[roadList.length - 1].objectLength ; i <= Main.maxWidth ; i += roadList[roadList.length - 1].objectLength) {
            
            if(i == Main.maxWidth * 0.5) continue;
            if(Math.random() < config.Obstacle_Percentage) {
                roadList[roadList.length - 1].objectList.push(new Obstacle(
                    i,
                    Math.floor(config.ObstacleSprite.length * Math.random())
                ));
            } 
        }
    }

    
}
function CreateFrontTempRoad() {
    roadList.splice(0,0,
        new Road(
        0,
        "#FFFFFF",
        100,
        1,
        100
    ));
}

function DeleteFrontRoad() {
    roadList.splice(0,1);
}

function GetRandomByFloat(range) {
    return Math.random() * (range[1] - range[0]) + range[0];
}

function ChooseRandom(range) {
    return range[Math.floor(Math.random() * range.length)];
}

function Start() {

}

function Update() {
    for(var i = 0 ; i < roadList.length ; i++) {

        if(roadList[i].roadType == 1) {
            continue;
        }

        roadList[i].curCooldown += 1 / Main.fps;
        var dir = roadList[i].direction == "Left" ? -1 : 1;

        if(roadList[i].curCooldown >= roadList[i].objectGenCooldown) {
            roadList[i].curCooldown = 0;
            roadList[i].objectList.push(new Car(
                dir == 1 ? Main.maxWidth : 0,
                Math.floor(Math.random() * config.CarSprite.length)
            ));
        }

        for(var j = 0 ; j < roadList[i].objectList.length ; j++) {
            roadList[i].objectList[j].x -= dir * roadList[i].objectSpeed;
            if((dir == 1 && roadList[i].objectList[j].x < 0)
            && (dir == -1 && roadList[i].objectList[j].x > Main.maxWidth)) {
                roadList[i].objectList = roadList[i].objectList.splice(j,1);
                j--;
            }
            if(i == config.CharacterToRoadIdx) {
                if(Math.abs(Character.Character.x - roadList[i].objectList[j].x) < Character.Character.size/2 + roadList[i].objectLength/2) {
                    Main.StopGame();
                }
            }
        }
    }

}

function Render() {
    for(var i = 0 ; i < roadList.length ; i++) {
        Main.ctx.drawImage(config.sprite[roadList[i].roadType], 0, Character.Character.y - ((i-config.CharacterToRoadIdx) * config.RoadSize) - (config.RoadSize/2) + config.RoadSizeOffset, Main.maxWidth, config.RoadSize - config.RoadSizeOffset * 2);
        if(roadList[i].roadType == 0) {
            for(var j = 0 ; j < roadList[i].objectList.length ; j++) {
                Main.ctx.save();
                Main.ctx.translate(roadList[i].objectList[j].x, Character.Character.y - ((i-config.CharacterToRoadIdx) * config.RoadSize));
                if(roadList[i].direction == "Right") {
                    Main.ctx.rotate(Math.PI);
                }
                Main.ctx.drawImage(config.CarSprite[roadList[i].objectList[j].spriteIdx], -roadList[i].objectLength/2, - (config.RoadSize/2) + config.RoadSizeOffset + config.CarOffset, roadList[i].objectLength, config.RoadSize - config.RoadSizeOffset * 2 - config.CarOffset * 2);
                Main.ctx.restore();
    
            }
        }
        else if(roadList[i].roadType == 1) {
            for(var j = 0 ;  j < roadList[i].objectList.length ; j++) {
                Main.ctx.save();
                Main.ctx.translate(roadList[i].objectList[j].x, Character.Character.y - ((i-config.CharacterToRoadIdx) * config.RoadSize));
                Main.ctx.drawImage(config.ObstacleSprite[roadList[i].objectList[j].spriteIdx], -roadList[i].objectLength * config.ObstacleScale * 0.5, - (roadList[i].objectLength * config.ObstacleScale * 0.5), roadList[i].objectLength * config.ObstacleScale, roadList[i].objectLength * config.ObstacleScale);
                Main.ctx.fillStyle = "#FFFFFF";
                Main.ctx.restore();
            }
        }
        
    }
}

export {Awake, Start, Update, Render, config, roadList, CreateNewRoad, DeleteFrontRoad, CreateFrontTempRoad};
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import Tile from "../engine/game_objects/tile.js";
import engine from "../engine/index.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        this.kWall1 = "assets/Red_Wall.png";
        this.kWall2 = "assets/Blue_Wall.png";
        this.kWall3 = "assets/missing_texture.png";
        this.kSprite = "assets/Coin_Sprite.png";
        // The camera to view the scene
        this.mCamera = null;
        this.mGridMap = null;
        this.mMsg = null;
        this.tile1 = null;
        this.tile2 = null;
        this.tile3 = null;
        this.tile0 = null;
        this.tileArray = [];
        this.mSquare = null;
        this.mSpriteRenderable = null;
        this.mPlayerScore = 0;

        this.mCoinPos = [7,7];
    }
    load(){

        engine.texture.load(this.kWall1);
        engine.texture.load(this.kWall2);
        engine.texture.load(this.kWall3);
        engine.texture.load(this.kSprite);
        

    }
    unload()
    {
        engine.texture.unload(this.kWall1);
        engine.texture.unload(this.kWall2);
        engine.texture.unload(this.kWall3);
        engine.texture.unload(this.kSprite);
    }
    init() {
        this.mCamera = new engine.RCCamera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0, 1, 1, 1]);
        this.mCamera.setResolution(120);

        this.tile1 = new Tile([this.kWall1, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32]);
        this.tile2 = new Tile([this.kWall2, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32]);
        this.tile3 = new Tile([this.kWall2, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32]);
        this.tileArray = [
            [this.tile1, this.tile1, this.tile1, this.tile2, this.tile1],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile1],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile1],
            [this.tile2, this.tile0, this.tile0, this.tile0, this.tile1],
            [this.tile1, this.tile3, this.tile1, this.tile2, this.tile1]
        ];

        this.mGridMap = new engine.GridMap();
        this.mGridMap.setTiles(this.tileArray);
        this.mCamera.Raycast(this.mGridMap);

        this.mMsg = new engine.FontRenderable("Score:");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(2, 2);
        this.mMsg.setTextHeight(2);

        this.mSpriteRenderable = new engine.RCSpriteRenderable(this.kSprite);
        this.mSpriteRenderable.setScaleX(0.5);
        this.mSpriteRenderable.setScaleY(0.5);
        this.mSpriteRenderable.setYOffset(-0.25);

    }
    
    draw() {
        this.mCamera.Raycast(this.mGridMap);
        //engine.clearCanvas([0.7, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        this.mCamera.DrawRays();
        this.mMsg.draw(this.mCamera);
        this.mSpriteRenderable.draw(this.mCamera, this.mCoinPos);
    }
    
    update () {
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            this.mCamera.moveRayCasterAngle(0.03);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            this.mCamera.moveRayCasterAngle(-0.03);
        }

        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            this.mCamera.moveRayCasterForward(0.09);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            this.mCamera.moveRayCasterForward(-0.09);
        }

        let pos = this.mCamera.getRayCasterPos();
        let ang = this.mCamera.getRayCasterAngle();
        
        if(pos[0]>19) {
            pos[0]=19;
        } else if (pos[0]<6) {
            pos[0]=6;
        }

        if(pos[1]>19) {
            pos[1]=19;
        } else if (pos[1]<6) {
            pos[1]=6;
        }

        this.mCamera.setRayCasterPos(pos[0], pos[1]);

        let dist = 1.0;

        if (Math.sqrt(Math.pow((pos[0]-this.mCoinPos[0]),2)+Math.pow((pos[1]-this.mCoinPos[1]),2))<0.8) {
            this.mPlayerScore += 1;
            this.mCoinPos = [Math.random()*10+7.5,Math.random()*10+7.5];
        }

        this.mMsg.setText("Score: " + this.mPlayerScore);

    }

}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
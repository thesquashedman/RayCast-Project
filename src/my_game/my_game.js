"use strict";  // Operate in Strict mode such that variables must be declared before used!

import Tile from "../engine/game_objects/tile.js";
import engine from "../engine/index.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        this.kWall1 = "assets/realisticwall.webp";
        this.kWall2 = "assets/Vikings_tilemaps_000.bmp";
        this.kWall3 = "assets/missing_texture.png";
        this.kSprite = "assets/favicon.png";
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
    }
    init() {
        this.mCamera = new engine.RCCamera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0, 0, 0, 1]);

        this.tile1 = new Tile([this.kWall1, 0, 1300, 0, 1300], [this.kWall1, 0, 1300, 0, 1300], [this.kWall1, 0, 1300, 0, 1300], [this.kWall1, 0, 1300, 0, 1300]);
        this.tile2 = new Tile([this.kWall2, 0, 20, 0, 20], [this.kWall2, 0, 20, 0, 20], [this.kWall2, 0, 20, 0, 20], [this.kWall2, 0, 20, 0, 20]);
        this.tile3 = new Tile([this.kWall2, 0, 20, 0, 20], [this.kWall1, 0, 1300, 0, 1300], [this.kWall2, 20, 40, 20, 40], [this.kWall3, 0, 200, 0, 200]);
        this.tileArray = [
            [this.tile1, this.tile1, this.tile3, this.tile1, this.tile0, this.tile1],
            [this.tile1, this.tile2, this.tile0, this.tile2, this.tile0, this.tile1],
            [this.tile1, this.tile3, this.tile0, this.tile0, this.tile0, this.tile1],
            [this.tile2, this.tile0, this.tile0, this.tile0, this.tile0, this.tile1],
            [this.tile1, this.tile3, this.tile2, this.tile1, this.tile0, this.tile1]
        ];

        this.mGridMap = new engine.GridMap();
        this.mGridMap.setTiles(this.tileArray);
        this.mCamera.Raycast(this.mGridMap);

        this.mMapCam = new engine.Camera(
            vec2.fromValues(12.5, 12.5), // position of the camera
            100,                       // width of camera
            [0, 480, 640, 240]           // viewport (orgX, orgY, width, height)
        );

        this.mGridMap2DRenderables = [];

        let height = this.mGridMap.getHeightInTiles();
        let width = this.mGridMap.getWidthInTiles();
        let offsetX = this.mGridMap.getWidthOfTile()/2;
        let offsetY = this.mGridMap.getHeightOfTile()/2;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (this.mGridMap.getTileAtIndex(i, j) == null) {
                    continue;
                }
                let renderable = new engine.Renderable();
                renderable.getXform().setPosition(this.mGridMap.getWidthOfTile()*i + offsetX + this.mGridMap.getPosition()[0], this.mGridMap.getHeightOfTile()*j  + offsetY + this.mGridMap.getPosition()[1]);
                renderable.getXform().setSize(this.mGridMap.getWidthOfTile(), this.mGridMap.getHeightOfTile());
                this.mGridMap2DRenderables.push(renderable);
            }
        }
        this.mMapCharRenderable = new engine.Renderable();
        this.mMapCharRenderable.setColor([1,0,0,1]);
        this.mMapCharLineR = new engine.LineRenderable();

        this.mMsg = new engine.FontRenderable("Status");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(2, 2);
        this.mMsg.setTextHeight(2);

        this.mSquare = new engine.Renderable();
        this.mSquare.getXform().setPosition(7,7);
        this.mSquare.setColor([0,0,1,1]);

        this.mSpriteRenderable = new engine.RCSpriteRenderable(this.kSprite);


    }
    
    draw() {
        this.mCamera.Raycast(this.mGridMap);
        //engine.clearCanvas([0.7, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        this.mCamera.DrawRays();
        this.mMsg.draw(this.mCamera);
        this.mSpriteRenderable.draw(this.mCamera, [this.mSquare.getXform().getPosition()[0], this.mSquare.getXform().getPosition()[1]]);

        this.mMapCam.setViewAndCameraMatrix();
        for (let i = 0; i < this.mGridMap2DRenderables.length; i++) {
            this.mGridMap2DRenderables[i].draw(this.mMapCam);
        }
        this.mMapCharRenderable.draw(this.mMapCam);
        this.mCamera.drawRayLines(this.mMapCam);
        this.mMapCharLineR.draw(this.mMapCam);
        this.mSquare.draw(this.mMapCam);
        
        
        
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
        if(engine.input.isKeyClicked(engine.input.keys.Space))
        {
            this.mCamera.enableEffect1();
        }
        if(engine.input.isKeyClicked(engine.input.keys.F))
        {
            this.mCamera.toggleFishEye();
        }
        if(engine.input.isKeyPressed(engine.input.keys.K))
        {
            this.mCamera.setFOV(this.mCamera.getFOV() - 0.03);
        }
        if(engine.input.isKeyPressed(engine.input.keys.L))
        {
            this.mCamera.setFOV(this.mCamera.getFOV() + 0.03);
        }
        if(engine.input.isKeyPressed(engine.input.keys.N))
        {
            this.mCamera.setResolution(this.mCamera.getResolution() -0.5);
        }
        if(engine.input.isKeyPressed(engine.input.keys.M))
        {
            this.mCamera.setResolution(this.mCamera.getResolution() + 0.5);
        }
        
        if(engine.input.isKeyPressed(engine.input.keys.O))
        {
            this.mCamera.incHorizonLine(-0.3);
        }
        if(engine.input.isKeyPressed(engine.input.keys.P))
        {
            this.mCamera.incHorizonLine(0.3);
        }
        if(engine.input.isKeyPressed(engine.input.keys.Right))
        {
            this.mSquare.getXform().incXPosBy(0.075);
        }
        if(engine.input.isKeyPressed(engine.input.keys.Left))
        {
            this.mSquare.getXform().incXPosBy(-0.075);
        }
        if(engine.input.isKeyPressed(engine.input.keys.Up))
        {
            this.mSquare.getXform().incYPosBy(0.075);
        }
        if(engine.input.isKeyPressed(engine.input.keys.Down))
        {
            this.mSquare.getXform().incYPosBy(-0.075);
        }


        /*
        if(this.mCamera.mouseWCX() > 60)
        {
            let r = (this.mCamera.mouseWCX() - 60) / 40
            this.mCamera.moveRayCasterAngle(-0.06 * r);
        }
        if(this.mCamera.mouseWCX() < 40)
        {
            let r = this.mCamera.mouseWCX() / 40
            this.mCamera.moveRayCasterAngle(0.06 * (1 -r));
        }
        */
        

        let pos = this.mCamera.getRayCasterPos();
        let ang = this.mCamera.getRayCasterAngle();
        let dist = 1.0;
        this.mMapCharRenderable.getXform().setPosition(pos[0], pos[1]);
        this.mMapCharLineR.setFirstVertex(pos[0], pos[1]);
        this.mMapCharLineR.setSecondVertex(pos[0]+dist*Math.cos(ang), pos[1]+dist*Math.sin(ang));

        this.mMsg.setText("Resolution: " + this.mCamera.getResolution().toFixed(0) + ", FOV:" + this.mCamera.getFOV().toFixed(4) + ", Fisheye: " + this.mCamera.getFishEye() + ", Effect1: " + this.mCamera.getEffect1());
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
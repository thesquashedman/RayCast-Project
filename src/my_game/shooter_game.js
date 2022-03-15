"use strict";  // Operate in Strict mode such that variables must be declared before used!

//import Tile from "../engine/game_objects/tile.js";
import engine from "../engine/index.js";
import PlayerObject from "./objects/player_object.js";
import Bullet from "./objects/Bullet.js";
import Renderable from "../engine/renderables/renderable.js";
import RCSpriteRenderable from "../engine/renderables/rc_sprite_renderable.js";

class ShooterGame extends engine.Scene {
    constructor() {
        super();

        this.kWall1 = "assets/Red_Wall.png";
        this.kWall2 = "assets/Blue_Wall.png";
        //this.kWall3 = "assets/missing_texture.png";
        this.kSprite = "assets/Player_Sprite.png";
        this.kTree = "assets/Tree_Sprite.png";
        this.kBullet = "assets/Projectile_Sprite.png";
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
        this.mGridMap2DRenderables = [];

        this.mPlayer = null;
        this.mPlayer2 = null;
        this.mTree1 = null;
        this.mTree2 = null;
        this.mTree3 = null;
        this.mTree4 = null;
        this.mTree5 = null;
        this.mTree6 = null;
        this.mTree7 = null;
        
        this.forward = true;

        this.forward2 = true;

        this.Player1SpriteArray = [];
        this.Player2SpriteArray = [];

        this.treeArray = [];
        this.bulletArray1 = [];
        this.bulletArray2 = [];
    }
    load(){

        engine.texture.load(this.kWall1);
        engine.texture.load(this.kWall2);
        engine.texture.load(this.kSprite);
        engine.texture.load(this.kTree);
        engine.texture.load(this.kBullet);

        

    }
    unload()
    {
        engine.texture.unload(this.kWall1);
        engine.texture.unload(this.kWall2);
        engine.texture.unload(this.kSprite);
        engine.texture.unload(this.kTree);
        engine.texture.unload(this.kBullet);
    }
    init() {
        this.mCamera = new engine.RCCamera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 250, 640, 220]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera2 = new engine.RCCamera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 230]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.1, 0.1, 0.1, 1]);
        this.mCamera2.setBackgroundColor([0.1, 0.1, 0.1, 1]);
        this.mCamera.setRayCasterPos(6.251, 6.251);
        this.mCamera2.setRayCasterPos(18.751, 18.751);
        this.mCamera.setResolution(100);
        this.mCamera2.setResolution(100);

        this.tile1 = new engine.Tile([this.kWall1, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32], [this.kWall1, 0, 32, 0, 32]);
        this.tile2 = new engine.Tile([this.kWall2, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32], [this.kWall2, 0, 32, 0, 32]);
        //this.tile3 = new engine.Tile([this.kWall2, 0, 20, 0, 20], [this.kWall1, 0, 1300, 0, 1300], [this.kWall2, 20, 40, 20, 40], [this.kWall3, 0, 200, 0, 200]);
        this.tileArray = [
            [this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile1, this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2, this.tile2, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile0, this.tile2],
            [this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1, this.tile1]
        ];

        this.mGridMap = new engine.GridMap();
        this.mGridMap.setHeight(25);
        this.mGridMap.setHeight(25);

        this.mGridMap.setTiles(this.tileArray);
        this.mCamera.Raycast(this.mGridMap);
        this.mCamera2.Raycast(this.mGridMap);

        this.mMapCam = new engine.Camera(
            vec2.fromValues(12.5, 12.5), // position of the camera
            100,                       // width of camera
            [0, 480, 640, 240]           // viewport (orgX, orgY, width, height)
        );

        

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
                let wall = new engine.GameObject(renderable);
                this.mGridMap2DRenderables.push(wall);
            }
        }
        this.mMapCharRenderable = new engine.Renderable();
        this.mMapCharRenderable.setColor([1,0,0,1]);
        this.mMapCharRenderable.getXform().setSize(0.5, 0.5);
        this.mMapCharLineR = new engine.LineRenderable();

        

        let playerRenderable2 = new engine.Renderable();
        playerRenderable2.setColor([0,0,1,1]);
        playerRenderable2.getXform().setSize(0.5, 0.5);
        this.mMapCharLineR2 = new engine.LineRenderable();

        this.mMsg = new engine.FontRenderable("Status");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(2, 2);
        this.mMsg.setTextHeight(2);

        this.mSquare = new engine.Renderable();
        this.mSquare.getXform().setPosition(7,7);
        this.mSquare.setColor([0,0,1,1]);

        
        let PlayerSprite = new engine.RCSpriteRenderable(this.kSprite);
        PlayerSprite.setColor([0.5, 0, 0, 0.5]);
        PlayerSprite.setScaleX(2);
        PlayerSprite.setScaleY(2);
        let PlayerSprite2 = new engine.RCSpriteRenderable(this.kSprite);
        PlayerSprite2.setColor([0, 0, 0.5, 0.5]);
        PlayerSprite2.setScaleX(2);
        PlayerSprite2.setScaleY(2);

        this.mPlayer = new PlayerObject(this.mMapCharRenderable, PlayerSprite);
        this.mPlayer2 = new PlayerObject(playerRenderable2, PlayerSprite2);

        this.Player1SpriteArray.push(this.mPlayer2);
        this.Player2SpriteArray.push(this.mPlayer);

        let treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(7,7);
        treeRenderable.getXform().setSize(1.25,1.25);
        let treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);
        
        this.mTree1 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree1);
        this.Player1SpriteArray.push(this.mTree1);
        this.Player2SpriteArray.push(this.mTree1);

        treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(9, 20);
        treeRenderable.getXform().setSize(1.25,1.25);

        treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);

        this.mTree2 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree2);
        this.Player1SpriteArray.push(this.mTree2);
        this.Player2SpriteArray.push(this.mTree2);
        
        treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(21, 18);
        treeRenderable.getXform().setSize(1.25,1.25);

        treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);

        this.mTree3 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree3);
        this.Player1SpriteArray.push(this.mTree3);
        this.Player2SpriteArray.push(this.mTree3);

        treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(16.5, 9);
        treeRenderable.getXform().setSize(1.25,1.25);

        treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);

        this.mTree4 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree4);
        this.Player1SpriteArray.push(this.mTree4);
        this.Player2SpriteArray.push(this.mTree4);

        treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(15, 17);
        treeRenderable.getXform().setSize(1.25,1.25);

        treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);

        this.mTree5 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree5);
        this.Player1SpriteArray.push(this.mTree5);
        this.Player2SpriteArray.push(this.mTree5);

        treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(3, 11);
        treeRenderable.getXform().setSize(1.25,1.25);

        treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);

        this.mTree6 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree6);
        this.Player1SpriteArray.push(this.mTree6);
        this.Player2SpriteArray.push(this.mTree6);
        
        treeRenderable = new engine.Renderable();
        treeRenderable.setColor([0,0.3,0,1]);
        treeRenderable.getXform().setPosition(21, 4.8);
        treeRenderable.getXform().setSize(1.25,1.25);

        treeSprite = new engine.RCSpriteRenderable(this.kTree);
        treeSprite.setScaleX(4);
        treeSprite.setScaleY(4);
        treeSprite.setYOffset(.15);

        this.mTree7 = new PlayerObject(treeRenderable, treeSprite);
        this.treeArray.push(this.mTree7);
        this.Player1SpriteArray.push(this.mTree7);
        this.Player2SpriteArray.push(this.mTree7);

    }
    
    draw() {
        let drawStuff = [];

        this.mCamera.Raycast(this.mGridMap);
        this.mCamera2.Raycast(this.mGridMap);
        //engine.clearCanvas([0.7, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        this.mCamera.DrawRays();
        this.mMsg.draw(this.mCamera);
        //this.mPlayer2.drawRC(this.mCamera);
        for(let i = 0; i < this.Player1SpriteArray.length; i++)
        {
            drawStuff.push(this.Player1SpriteArray[i]);
            //this.Player1SpriteArray[i].drawRC(this.mCamera);
        }
        for(let i = 0; i < this.bulletArray1.length; i++)
        {
            drawStuff.push(this.bulletArray1[i]);
            
            //this.bulletArray1[i].drawRC(this.mCamera);
        }
        for(let i = 0; i < this.bulletArray2.length; i++)
        {
            drawStuff.push(this.bulletArray2[i]);
            //this.bulletArray2[i].drawRC(this.mCamera);
        }
        
        while(drawStuff.length > 0)
        {
            let index = 0;
            let camPos = this.mCamera.getRayCasterPos();
            let largestDistance = Math.sqrt((Math.pow(camPos[0] - drawStuff[0].getXform().getPosition()[0], 2)) + (Math.pow(camPos[1] - drawStuff[0].getXform().getPosition()[1], 2)));
            for(let i = 1; i < drawStuff.length; i++)
            {
                let distance = Math.sqrt((Math.pow(camPos[0] - drawStuff[i].getXform().getPosition()[0], 2)) + (Math.pow(camPos[1] - drawStuff[i].getXform().getPosition()[1], 2)));
                if(distance > largestDistance)
                {
                    largestDistance = distance;
                    index = i;
                }
                

            }
            drawStuff[index].drawRC(this.mCamera);
            drawStuff.splice(index, 1);
        }
        
        

        this.mCamera2.setViewAndCameraMatrix();
        this.mCamera2.DrawRays();
        this.mMsg.draw(this.mCamera2);
        for(let i = 0; i < this.Player2SpriteArray.length; i++)
        {
            
            drawStuff.push(this.Player2SpriteArray[i]);
            //this.Player2SpriteArray[i].drawRC(this.mCamera2);
        }
        for(let i = 0; i < this.bulletArray1.length; i++)
        {
            drawStuff.push(this.bulletArray1[i]);
            //this.bulletArray1[i].drawRC(this.mCamera2);
        }
        for(let i = 0; i < this.bulletArray2.length; i++)
        {
            drawStuff.push(this.bulletArray2[i]);
            //this.bulletArray2[i].drawRC(this.mCamera2);
        }
        while(drawStuff.length > 0)
        {
            let index = 0;
            let camPos = this.mCamera2.getRayCasterPos();
            let largestDistance = Math.sqrt((Math.pow(camPos[0] - drawStuff[0].getXform().getPosition()[0], 2)) + (Math.pow(camPos[1] - drawStuff[0].getXform().getPosition()[1], 2)));
            for(let i = 1; i < drawStuff.length; i++)
            {
                let distance = Math.sqrt((Math.pow(camPos[0] - drawStuff[i].getXform().getPosition()[0], 2)) + (Math.pow(camPos[1] - drawStuff[i].getXform().getPosition()[1], 2)));
                if(distance > largestDistance)
                {
                    largestDistance = distance;
                    index = i;
                }
                

            }
            drawStuff[index].drawRC(this.mCamera2);
            drawStuff.splice(index, 1);
        }



        this.mMapCam.setViewAndCameraMatrix();
        for (let i = 0; i < this.mGridMap2DRenderables.length; i++) {
            this.mGridMap2DRenderables[i].draw(this.mMapCam);
        }

        //this.mMapCharRenderable.draw(this.mMapCam);
        
        this.mCamera.drawRayLines(this.mMapCam);
        this.mCamera2.drawRayLines(this.mMapCam);
        this.mMapCharLineR.draw(this.mMapCam);
        this.mMapCharLineR2.draw(this.mMapCam);
        this.mSquare.draw(this.mMapCam);
        this.mPlayer.draw(this.mMapCam);
        this.mPlayer2.draw(this.mMapCam);
        for(let i = 0; i < this.treeArray.length; i++)
        {
            this.treeArray[i].draw(this.mMapCam);
        }
        for(let i = 0; i < this.bulletArray1.length; i++)
        {
            this.bulletArray1[i].draw(this.mMapCam);
        }
        for(let i = 0; i < this.bulletArray2.length; i++)
        {
            this.bulletArray2[i].draw(this.mMapCam);
        }
        
        
        
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
            this.forward = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            this.mCamera.moveRayCasterForward(-0.09);
            this.forward = false;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            this.mCamera2.moveRayCasterAngle(0.03);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            this.mCamera2.moveRayCasterAngle(-0.03);
        }

        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            this.mCamera2.moveRayCasterForward(0.09);
            this.forward2 = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            this.mCamera2.moveRayCasterForward(-0.09);
            this.forward2 = false;
        }
        if(engine.input.isKeyClicked(engine.input.keys.F))
        {
            let bulletRenderable = new Renderable();
            let camPos = this.mCamera.getRayCasterPos();
            bulletRenderable.getXform().setPosition(camPos[0], camPos[1]);
            bulletRenderable.getXform().setSize(0.5, 0.5);
            let bSprite = new RCSpriteRenderable(this.kBullet);
            let bObject = new Bullet(bulletRenderable, bSprite, this.mCamera.getRayCasterAngle());
            this.bulletArray1.push(bObject);
        }
        if(engine.input.isKeyClicked(engine.input.keys.M))
        {
            let bulletRenderable = new Renderable();
            let camPos = this.mCamera2.getRayCasterPos();
            bulletRenderable.getXform().setPosition(camPos[0], camPos[1]);
            bulletRenderable.getXform().setSize(0.5, 0.5);
            let bSprite = new RCSpriteRenderable(this.kBullet);
            let bObject = new Bullet(bulletRenderable, bSprite, this.mCamera2.getRayCasterAngle());
            this.bulletArray2.push(bObject);
        }
        


        
        

        let pos = this.mCamera.getRayCasterPos();
        let ang = this.mCamera.getRayCasterAngle();
        let dist = 1.0;
        this.mPlayer.getRenderable().getXform().setPosition(pos[0], pos[1]);
        let pos2 = this.mCamera2.getRayCasterPos();
        let ang2 = this.mCamera2.getRayCasterAngle();
        this.mPlayer2.getRenderable().getXform().setPosition(pos2[0], pos2[1]);
        this.mMapCharLineR.setFirstVertex(pos[0], pos[1]);
        this.mMapCharLineR.setSecondVertex(pos[0]+dist*Math.cos(ang), pos[1]+dist*Math.sin(ang));
        this.mMapCharLineR2.setFirstVertex(pos2[0], pos2[1]);
        this.mMapCharLineR2.setSecondVertex(pos2[0]+dist*Math.cos(ang2), pos2[1]+dist*Math.sin(ang2));

        this.mMsg.setText("Resolution: " + this.mCamera.getResolution().toFixed(0) + ", FOV:" + this.mCamera.getFOV().toFixed(4) + ", Fisheye: " + this.mCamera.getFishEye());


        for(let i = 0; i < this.mGridMap2DRenderables.length; i++)
        {
            
            let b = this.mPlayer.getBBox();
            if(b.intersectsBound(this.mGridMap2DRenderables[i].getBBox()))
            {
                
                if(this.forward)
                {
                    this.mCamera.moveRayCasterForward(-0.09);
                }
                else{
                    this.mCamera.moveRayCasterForward(0.09);
                }
                
                let pos = this.mCamera.getRayCasterPos();
                this.mPlayer.getRenderable().getXform().setPosition(pos[0], pos[1]);
            }
            let b2 = this.mPlayer2.getBBox();
            if(b2.intersectsBound(this.mGridMap2DRenderables[i].getBBox()))
            {
                
                if(this.forward2)
                {
                    this.mCamera2.moveRayCasterForward(-0.09);
                }
                else{
                    this.mCamera2.moveRayCasterForward(0.09);
                }
                
                let pos = this.mCamera2.getRayCasterPos();
                this.mPlayer2.getRenderable().getXform().setPosition(pos[0], pos[1]);
            }

        }
        for(let i = 0; i < this.treeArray.length; i++)
        {
            
            let b = this.mPlayer.getBBox();
            if(b.intersectsBound(this.treeArray[i].getBBox()))
            {
                
                if(this.forward)
                {
                    this.mCamera.moveRayCasterForward(-0.09);
                }
                else{
                    this.mCamera.moveRayCasterForward(0.09);
                }
                
                let pos = this.mCamera.getRayCasterPos();
                this.mPlayer.getRenderable().getXform().setPosition(pos[0], pos[1]);
            }
            let b2 = this.mPlayer2.getBBox();
            if(b2.intersectsBound(this.treeArray[i].getBBox()))
            {
                
                if(this.forward2)
                {
                    this.mCamera2.moveRayCasterForward(-0.09);
                }
                else{
                    this.mCamera2.moveRayCasterForward(0.09);
                }
                
                let pos = this.mCamera2.getRayCasterPos();
                this.mPlayer2.getRenderable().getXform().setPosition(pos[0], pos[1]);
            }

        }

        for(let i = 0; i < this.bulletArray1.length; i++)
        {
            this.bulletArray1[i].update();
            let b2 = this.mPlayer2.getBBox();
            if(b2.intersectsBound(this.bulletArray1[i].getBBox()))
            {
                this.bulletArray1.splice(i, 1);
                i--;
                this.mCamera2.setResolution(this.mCamera2.getResolution() - 15);
                
                
            }
            else{
                for(let j = 0; j < this.mGridMap2DRenderables.length; j++)
                {
                    
                    if(this.bulletArray1[i].getBBox().intersectsBound(this.mGridMap2DRenderables[j].getBBox()))
                    {
                        this.bulletArray1.splice(i, 1);
                        i--;
                        
                    }
                    
                    
                }
                for(let j = 0; j < this.treeArray.length; j++)
                {
                    if(this.bulletArray1[i].getBBox().intersectsBound(this.treeArray[j].getBBox()))
                    {
                        this.bulletArray1.splice(i, 1);
                        i--;
                        
                    }
                    
                }
            }
        }
        for(let i = 0; i < this.bulletArray2.length; i++)
        {
            this.bulletArray2[i].update();
            let b2 = this.mPlayer.getBBox();
            if(b2.intersectsBound(this.bulletArray2[i].getBBox()))
            {
                this.bulletArray2.splice(i, 1);
                i--;
                this.mCamera.setResolution(this.mCamera.getResolution() - 15);
                
                
            }
            else{
                for(let j = 0; j < this.mGridMap2DRenderables.length; j++)
                {
                    
                    if(this.bulletArray2[i].getBBox().intersectsBound(this.mGridMap2DRenderables[j].getBBox()))
                    {
                        this.bulletArray2.splice(i, 1);
                        i--;
                        
                    }
                    
                    
                }
                for(let j = 0; j < this.treeArray.length; j++)
                {
                    if(this.bulletArray2[i].getBBox().intersectsBound(this.treeArray[j].getBBox()))
                    {
                        this.bulletArray2.splice(i, 1);
                        i--;
                        
                    }
                    
                }
            }
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new ShooterGame();
    myGame.start();
}

    

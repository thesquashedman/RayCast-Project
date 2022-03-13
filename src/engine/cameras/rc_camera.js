"use strict";

import engine from "../index.js";
import Camera from "./camera.js";

class RCCamera extends Camera {

    constructor(wcCenter, wcWidth, viewportArray, bound)
    {
        super(wcCenter, wcWidth, viewportArray, bound);
        this.fov =  Math.PI/2;
        this.resolution = 50;
        this.raycasterPosition = [12.5, 12.5];
        this.raycasterAngle = 0;
        this.raycastLengths = [];
        this.raycastHitPosition = [];
        this.raycastHitDirection = []; //True corresponds to hitting top or bottom wall, false corresponds to hitting left or right wall.
        this.rayAngles = [];
        this.raycastWallsHit = [];
        this.raycastWallsUVPixels = [];
        this.effect1 = false;

        this.tempTextureHolder = null;
        this.textureWidth = 32;
        this.textureHeight = 32;
        this.fisheye = false;
        this.horizonLine = 0;
        this.tempWallHeight = 1;
        this.wallShadows = true;
    }
    TempTextureSetter(texture)
    {
        this.tempTextureHolder = texture;
    }
    TempTexWidthHeightSetter(width, height)
    {
        this.textureWidth = width;
        this.textureHeight = height;
    }
    
    Raycast(GridMap)
    {
        this.raycastLengths = []; // empty it
        this.raycastHitPosition = [];
        this.raycastHitDirection = [];
        this.rayAngles = [];
        this.raycastWallsHit = [];
        this.raycastWallsUVPixels = [];
        for(let i = 0; i < this.resolution; i++)
        {
            let theta = this.raycasterAngle + this.fov/2 - i * (this.fov/(this.resolution - 1));
            if((this.resolution <= 1))
            {
                theta = this.raycasterAngle;
            }
            this.raycastLengths.push(this._CastRay(theta, GridMap));
            //console.log("length: " + this.raycastLengths[i] + " Angle: " + theta);

        }
        
    }
    //Complete mess, don't even try to make sense of it, just straight up contact me if you something from it.
    _CastRay(theta, GridMap)
    {
        this.rayAngles.push(theta);
        let positionInGrid = [this.raycasterPosition[0] - GridMap.getPosition()[0], this.raycasterPosition[1] - GridMap.getPosition()[1]];
        let numberOfTime = 0;
        let currentDistance = 0;
        let perfectY = false;
        let perfectX = false;
        let perfectXIndex = 0;
        let perfectYIndex = 0;
        //Checks whether the current position it's checking for the raycast is within the GridMap
        while (
            positionInGrid[0] > 0
            && positionInGrid[0] < GridMap.getWidth()
            && positionInGrid[1] > 0
            && positionInGrid[1] < GridMap.getHeight()
            ) 
        {
            //Calculates the next vertical and horizontal walls
            let nextY = Math.floor(positionInGrid[1] / GridMap.getHeightOfTile());
            let nextX = Math.floor(positionInGrid[0] / GridMap.getWidthOfTile());
            
            if(Math.sin(theta) >= 0)
            {
                if(perfectY)
                {
                    nextY = perfectYIndex;
                }
                
                nextY = (nextY + 1);
                perfectYIndex = nextY;
                nextY *= GridMap.getHeightOfTile();
                
                
            } 
            else if (Math.sin(theta) < 0)
            {
                if(perfectY)
                {
                    nextY = (perfectYIndex - 1);
                }
                
                perfectYIndex = nextY;
                nextY *= GridMap.getHeightOfTile();
                
                
            }
            else
            {
                //Should never get here
                nextY = null;
            }
            
            if(Math.cos(theta) >= 0)
            {
                if(perfectX)
                {
                    nextX = perfectXIndex;
                }
                nextX = (nextX + 1);
                perfectXIndex = nextX;
                nextX *= GridMap.getWidthOfTile();
            } 
            else if (Math.cos(theta) < 0)
            {
                if(perfectX)
                {
                    nextX = (perfectXIndex - 1);
                }
                
                perfectXIndex = nextX;
                nextX *= GridMap.getWidthOfTile();
                
                
            }
            else
            {
                //Should never get here
                nextX = null;
            }
            
            let yOfX = positionInGrid[1] + ((nextX - positionInGrid[0]) * Math.tan(theta));
            let xOfY = positionInGrid[0] + ((nextY - positionInGrid[1]) / Math.tan(theta));

            let xDistance = Math.sqrt(Math.pow(positionInGrid[0] - nextX, 2) + Math.pow(positionInGrid[1] - yOfX, 2));
            let yDistance = Math.sqrt(Math.pow(positionInGrid[1] - nextY, 2) + Math.pow(positionInGrid[0] - xOfY, 2));

            if (yDistance <= xDistance)
            {   
                //let yIndex = Math.floor(nextY / GridMap.getHeightOfTile());
                let yIndex = perfectYIndex;
                let xIndex = Math.floor(xOfY / GridMap.getWidthOfTile());
                currentDistance += yDistance;
                positionInGrid = [xOfY, nextY];

                if(Math.sin(theta) < 0)
                {
                    yIndex -= 1;
                }
                if(yIndex >= 0 && yIndex < GridMap.getHeight() / GridMap.getHeightOfTile())
                {
                    let tile = GridMap.getTileAtIndex(xIndex, yIndex);
                    if(tile != null)
                    {
                        //console.log(positionInGrid[0] + " " + positionInGrid[1]);
                        this.raycastHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
                        this.raycastHitDirection.push(true);
                        let texture = null;
                        let up = null;
                        if(Math.sin(theta) < 0)
                        {
                            texture = tile.getTopTexture();
                            this.raycastWallsHit.push(texture[0]);
                            up = false;
                        }
                        else
                        {
                            texture = tile.getBottomTexture();
                            this.raycastWallsHit.push(texture[0]);
                            up = true;
                        }
                        let pixelWidth = (texture[2] - texture[1])/this.resolution;
                        let x = xOfY / GridMap.getWidthOfTile();
                        x = x - Math.floor(x);
                        x *= (texture[2] - texture[1]);
                        if(x + pixelWidth >= texture[2] - texture[1])
                        {
                            if(up)
                            {
                                this.raycastWallsUVPixels.push([x + texture[1], texture[2], texture[3], texture[4]]);
                            }
                            else{
                                this.raycastWallsUVPixels.push([(texture[2] - x) + texture[1], texture[1], texture[3], texture[4]]);
                            }
                            
                        }
                        else{
                            //this.raycastWallsUVPixels.push([x + texture[1], texture[2], texture[3], texture[4]]);
                            if(up)
                            {
                                this.raycastWallsUVPixels.push([x + texture[1], x + texture[1] + pixelWidth, texture[3], texture[4]]);
                            }
                            else{
                                this.raycastWallsUVPixels.push([(texture[2] - x) + texture[1], (texture[2] - x) + texture[1] - pixelWidth, texture[3], texture[4]]);
                            }
                            
                        }
                        //this.raycastWallsUVPixels.push([null, null, null, null]);
                        return currentDistance;
                    }
                }
                perfectX = false;
                perfectY = true;
                
                
            }
            else
            {
                //let xIndex = Math.floor(nextX / GridMap.getWidthOfTile());
                let xIndex = perfectXIndex;
                let yIndex = Math.floor(yOfX / GridMap.getHeightOfTile());
                currentDistance += xDistance;
                positionInGrid = [nextX, yOfX];
                if(Math.cos(theta) < 0)
                {
                    xIndex -= 1;
                }
                
                if(xIndex >= 0  && xIndex < GridMap.getWidth() / GridMap.getWidthOfTile())
                {
                    let tile = GridMap.getTileAtIndex(xIndex, yIndex);
                    if(tile != null)
                    {
                        //console.log(positionInGrid[0] + " " + positionInGrid[1]);
                        this.raycastHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
                        this.raycastHitDirection.push(false);

                        let texture = null;
                        let left = null;
                        if(Math.cos(theta) < 0)
                        {
                            texture = tile.getRightTexture();
                            this.raycastWallsHit.push(texture[0]);
                            left = true;
                        }
                        else
                        {
                            texture = tile.getLeftTexture();
                            this.raycastWallsHit.push(texture[0]);
                            left = false;
                        }
                        let pixelWidth = (texture[2] - texture[1])/this.resolution;
                        let x = yOfX / GridMap.getHeightOfTile();
                        x = x - Math.floor(x);
                        x *= (texture[2] - texture[1]);
                        if(x + pixelWidth >= texture[2] - texture[1])
                        {
                            if(left)
                            {
                                this.raycastWallsUVPixels.push([x + texture[1], texture[2], texture[3], texture[4]]);
                            }
                            else{
                                this.raycastWallsUVPixels.push([(texture[2] - x) + texture[1], texture[1], texture[3], texture[4]]);
                            }
                            
                        }
                        else{
                            //this.raycastWallsUVPixels.push([x + texture[1], texture[2], texture[3], texture[4]]);
                            if(left)
                            {
                                this.raycastWallsUVPixels.push([x + texture[1], x + texture[1] + pixelWidth, texture[3], texture[4]]);
                            }
                            else{
                                this.raycastWallsUVPixels.push([(texture[2] - x) + texture[1], (texture[2] - x) + texture[1] - pixelWidth, texture[3], texture[4]]);
                            }
                            
                        }
                        
                        return currentDistance;
                    }
                }
                perfectX = true;
                perfectY = false;
                
            }
            
            numberOfTime++;
            if(numberOfTime >250)
            {
                console.log("Stuck in loop " + positionInGrid[0] + " " + positionInGrid[1] + " " + (theta / Math.PI) * 180 + " " + this.raycasterPosition[0] + " " + this.raycastHitPosition);
                this.raycastHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
                this.raycastHitDirection.push(null);
                this.raycastWallsHit.push(null);
                this.raycastWallsUVPixels.push([null, null, null, null]);
                return -15;
            }
            


        }
        //If it gets outside the GridMap, return -1 to show that it didn't hit
        this.raycastHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
        this.raycastHitDirection.push(null);
        this.raycastWallsHit.push(null);
        this.raycastWallsUVPixels.push([null, null, null, null]);
        return -1;
    }

    DrawRays() {
        let xStart = this.getWCCenter()[0]-this.getWCWidth()/2;
        let ymiddle = this.getWCCenter()[1];
        let width = this.getWCWidth();
        for (let i = 0; i < this.resolution; i++) {
            if(this.raycastLengths[i] >= 0)
            {
                let xpos = xStart + (i/this.resolution)*width;
                xpos += 1/(2 * this.resolution) * width; // Moves it over slightly so that it fills the screen.
                let height = this.getWCHeight() / this.raycastLengths[i];
                if(!this.fisheye)
                {
                    let r = this.raycastLengths[i] * Math.abs(Math.cos(this.rayAngles[i] - this.raycasterAngle));

                    //Applies back warping if the angle is greater than 45 degrees, not necissary but effect makes FOVS greater than 90 degrees less vomit inducing
                    if(Math.abs(this.rayAngles[i] - this.raycasterAngle) > Math.PI/4 && this.effect1)
                    {
                        r = this.raycastLengths[i] * Math.abs(Math.sin(this.rayAngles[i] - this.raycasterAngle));
                        //r /= Math.abs(Math.cos(2 * (this.rayAngles[i] - this.raycasterAngle) - Math.PI/2));
                    }
                    if(r == 0)
                    {
                        r = 0.000001;
                    }
                    height = this.getWCHeight() / r;
                    
                }
                if(height > this.getWCHeight())
                {    
                    height = this.getWCHeight();
                }
                
                
                    
                    
                
                let yStart = ymiddle + height/2;
                let yEnd = ymiddle - height/2;
                
                
                let renderable = new engine.SpriteRenderable(this.raycastWallsHit[i]);
                renderable.getXform().setPosition(xpos, ymiddle  + this.horizonLine);
                renderable.getXform().setSize(width/(this.resolution), height);
                //console.log(this.raycastWallsUVPixels[i][0] + " " + this.raycastWallsUVPixels[i][1] + " " + this.raycastWallsUVPixels[i][2] + " " + this.raycastWallsUVPixels[i][3]);
                renderable.setElementPixelPositions(this.raycastWallsUVPixels[i][0], this.raycastWallsUVPixels[i][1], this.raycastWallsUVPixels[i][2], this.raycastWallsUVPixels[i][3]);
                
                
                
                
                
                
                renderable.draw(this);
                
                
            }
        }

    }
    drawRayLines(secondCamera)
    {

        //secondCamera.setViewAndCameraMatrix();
        
        for (let i = 0; i < this.resolution; i++) {
            
            let lineRay = new engine.LineRenderable();
            lineRay.setColor([0,1,0,1]);
            lineRay.setFirstVertex(this.raycasterPosition[0], this.raycasterPosition[1]);
            //Currently, raycast hit position is within the grid coordinates (center is at grid bottom left) and not in real world coordinates
            lineRay.setSecondVertex(this.raycastHitPosition[i][0], this.raycastHitPosition[i][1]);
            
            lineRay.draw(secondCamera);
            
        }
        
    }

    setFOV(fov)
    {
        this.fov = fov;
    }
    getFOV()
    {
        return this.fov;
    }
    setResolution(resolution)
    {
        this.resolution = resolution;
    }
    getResolution()
    {
        return this.resolution;
    }

    setRayCasterAngle(t) {
        this.raycasterAngle = t;
    }

    moveRayCasterAngle(d) {
        this.raycasterAngle += d;
        while(this.raycasterAngle > 2 * Math.PI)
        {
            this.raycasterAngle -= 2 * Math.PI;
        }
        while(this.raycasterAngle < 0)
        {
            this.raycasterAngle += 2 * Math.PI;
        }
    }

    moveRayCasterForward(d) {
        this.raycasterPosition[0] += Math.cos(this.raycasterAngle)*d;
        this.raycasterPosition[1] += Math.sin(this.raycasterAngle)*d;
    }

    getRayCasterPos() {
        return this.raycasterPosition;
    }

    getRayCasterAngle() {
        return this.raycasterAngle;
    }
    getEffect1()
    {
        return this.effect1;
    }
    enableEffect1()
    {
        this.effect1 = !this.effect1;
    }
    getFishEye()
    {
        return this.fisheye;
    }
    toggleFishEye()
    {
        this.fisheye = !this.fisheye;
    }
    incHorizonLine(d)
    {
        this.horizonLine += d;
    }
    getRaycastLengths()
    {
        return this.raycastLengths;
    }

}
export default RCCamera;
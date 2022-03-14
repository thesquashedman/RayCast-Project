"use strict";

import engine from "../index.js";
import Camera from "./camera.js";

class RCCamera extends Camera {

    constructor(wcCenter, wcWidth, viewportArray, bound)
    {
        super(wcCenter, wcWidth, viewportArray, bound);
        this.fov =  Math.PI/2;
        this.resolution = 50;
        this.raycasterAngle = 0;
        this.raycasterPosition = [12.5, 12.5];
        this.horizonLine = 0;
        this.rayLengths = [];
        this.rayHitPosition = [];
        this.rayHitDirection = []; //True corresponds to hitting top or bottom wall, false corresponds to hitting left or right wall.
        this.rayAngles = [];
        this.rayWallsHit = [];
        this.rayWallsUVPixels = [];

        this.fisheye = false;
        this.wallShadows = true;
    }

    setRayLengths(a)
    {
        if(a.length != this.resolution)
        {
            console.log("Warning, rays don't correspond to resolution");
        }
        this.rayLengths = a;
    }

    getRayLengths()
    {
        return this.rayLengths;
    }

    setRayHitPosition(a)
    {
        if(a.length != this.resolution)
        {
            console.log("Warning, rays don't correspond to resolution");
        }
        this.rayHitPosition = a;
    }

    getRayHitPosition()
    {
        return this.rayHitPosition;
    }

    setRayHitDirection(a)
    {
        if(a.length != this.resolution)
        {
            console.log("Warning, rays don't correspond to resolution");
        }
        this.rayHitDirection = a;
    }

    getRayHitDirection()
    {
        return this.rayHitDirection;
    }

    setRayAngles(a)
    {
        if(a.length != this.resolution)
        {
            console.log("Warning, rays don't correspond to resolution");
        }
        this.rayAngles = a;
    }

    getRayAngles()
    {
        return this.rayAngles;
    }

    setRayWallsHit(a)
    {
        if(a.length != this.resolution)
        {
            console.log("Warning, rays don't correspond to resolution");
        }
        this.rayWallsHit = a;
    }

    getRayWallsHit()
    {
        return this.rayWallsHit;
    }

    setRayWallsUVPixels(a)
    {
        if(a.length != this.resolution)
        {
            console.log("Warning, rays don't correspond to resolution");
        }
        this.rayWallsUVPixels = a;
    }

    getRayWallsUVPixels()
    {
        return this.rayWallsUVPixels;
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
        while(this.raycasterAngle > 2 * Math.PI)
        {
            this.raycasterAngle -= 2 * Math.PI;
        }
        while(this.raycasterAngle < 0)
        {
            this.raycasterAngle += 2 * Math.PI;
        }
    }

    getRayCasterAngle() {
        return this.raycasterAngle;
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

    setRayCasterPos(posX, posY)
    {
        this.raycasterPosition[0] = posX;
        this.raycasterPosition[1] = posY;
    }

    getRayCasterPos() {
        return this.raycasterPosition;
    }

    getRayCasterXPos()
    {
        return this.raycasterPosition[0];
    }

    getRayCasterYPos()
    {
        return this.raycasterPosition[1];
    }

    moveRayCasterForward(d) {
        this.raycasterPosition[0] += Math.cos(this.raycasterAngle)*d;
        this.raycasterPosition[1] += Math.sin(this.raycasterAngle)*d;
    }

    getFishEye()
    {
        return this.fisheye;
    }

    setFishEye(b)
    {
        this.fisheye = b;
    }

    toggleFishEye()
    {
        this.fisheye = !this.fisheye;
    }

    setHorizonLine(t)
    {
        this.horizonLine = t;
    }

    getHorizonLine()
    {
        return this.horizonLine;
    }

    moveHorizonLine(d)
    {
        this.horizonLine += d;
    }

    


    


    Raycast(GridMap)
    {
        this.rayLengths = []; // empty it
        this.rayHitPosition = [];
        this.rayHitDirection = [];
        this.rayAngles = [];
        this.rayWallsHit = [];
        this.rayWallsUVPixels = [];
        for(let i = 0; i < this.resolution; i++)
        {
            let theta = this.raycasterAngle + this.fov/2 - i * (this.fov/(this.resolution - 1));
            if((this.resolution <= 1))
            {
                theta = this.raycasterAngle;
            }
            this.rayLengths.push(this._CastRay(theta, GridMap));
            //console.log("length: " + this.raycastLengths[i] + " Angle: " + theta);

        }
        
    }
    //Complete mess, don't even try to make sense of it, just straight up contact me if you something from it at pavo_peev@yahoo.com.
    _CastRay(theta, GridMap)
    {
        this.rayAngles.push(theta);
        let positionInGrid = [this.raycasterPosition[0] - GridMap.getPosition()[0], this.raycasterPosition[1] - GridMap.getPosition()[1]];
        let numberOfTime = 0;
        let currentDistance = 0;
        let perfectY = false; //If it moved the position to a y gridline, then use the index of that line instead of calculating a new one
        let perfectX = false; //If it moved the position to a x gridline, then use the index of that line instead of calculating a new one
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
                        this.rayHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
                        this.rayHitDirection.push(true);
                        let texture = null;
                        let up = null;
                        if(Math.sin(theta) < 0)
                        {
                            texture = tile.getTopTexture();
                            this.rayWallsHit.push(texture[0]);
                            up = false;
                        }
                        else
                        {
                            texture = tile.getBottomTexture();
                            this.rayWallsHit.push(texture[0]);
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
                                this.rayWallsUVPixels.push([x + texture[1], texture[2], texture[3], texture[4]]);
                            }
                            else{
                                this.rayWallsUVPixels.push([(texture[2] - x) + texture[1], texture[1], texture[3], texture[4]]);
                            }
                            
                        }
                        else{
                            
                            if(up)
                            {
                                this.rayWallsUVPixels.push([x + texture[1], x + texture[1] + pixelWidth, texture[3], texture[4]]);
                            }
                            else{
                                this.rayWallsUVPixels.push([(texture[2] - x) + texture[1], (texture[2] - x) + texture[1] - pixelWidth, texture[3], texture[4]]);
                            }
                            
                        }
                        
                        return currentDistance;
                    }
                }
                perfectX = false;
                perfectY = true;
                
                
            }
            //Next horizontal gridline closer than next vertical gridline
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
                        this.rayHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
                        this.rayHitDirection.push(false);

                        let texture = null;
                        let left = null;
                        if(Math.cos(theta) < 0)
                        {
                            texture = tile.getRightTexture();
                            this.rayWallsHit.push(texture[0]);
                            left = true;
                        }
                        else
                        {
                            texture = tile.getLeftTexture();
                            this.rayWallsHit.push(texture[0]);
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
                                this.rayWallsUVPixels.push([x + texture[1], texture[2], texture[3], texture[4]]);
                            }
                            else{
                                this.rayWallsUVPixels.push([(texture[2] - x) + texture[1], texture[1], texture[3], texture[4]]);
                            }
                            
                        }
                        else{
                            
                            if(left)
                            {
                                this.rayWallsUVPixels.push([x + texture[1], x + texture[1] + pixelWidth, texture[3], texture[4]]);
                            }
                            else{
                                this.rayWallsUVPixels.push([(texture[2] - x) + texture[1], (texture[2] - x) + texture[1] - pixelWidth, texture[3], texture[4]]);
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
                this.rayHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
                this.rayHitDirection.push(null);
                this.rayWallsHit.push(null);
                this.rayWallsUVPixels.push([null, null, null, null]);
                return -15;
            }
            


        }
        //If it gets outside the GridMap, return -1 to show that it didn't hit
        this.rayHitPosition.push([positionInGrid[0] + GridMap.getPosition()[0], positionInGrid[1] + GridMap.getPosition()[1]]);
        this.rayHitDirection.push(null);
        this.rayWallsHit.push(null);
        this.rayWallsUVPixels.push([null, null, null, null]);
        return -1;
    }




    DrawRays() {
        let xStart = this.getWCCenter()[0]-this.getWCWidth()/2;
        let ymiddle = this.getWCCenter()[1];
        let width = this.getWCWidth();
        for (let i = 0; i < this.resolution; i++) {
            if(this.rayLengths[i] >= 0)
            {
                let xpos = xStart + (i/this.resolution)*width;
                xpos += 1/(2 * this.resolution) * width; // Moves it over slightly so that it fills the screen.
                let height = this.getWCHeight() / this.rayLengths[i];
                if(!this.fisheye)
                {
                    let r = this.rayLengths[i] * Math.abs(Math.cos(this.rayAngles[i] - this.raycasterAngle));

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
                
                
                let renderable = new engine.SpriteRenderable(this.rayWallsHit[i]);
                renderable.getXform().setPosition(xpos, ymiddle  + this.horizonLine);
                renderable.getXform().setSize(width/(this.resolution), height);
                //console.log(this.raycastWallsUVPixels[i][0] + " " + this.raycastWallsUVPixels[i][1] + " " + this.raycastWallsUVPixels[i][2] + " " + this.raycastWallsUVPixels[i][3]);
                renderable.setElementPixelPositions(this.rayWallsUVPixels[i][0], this.rayWallsUVPixels[i][1], this.rayWallsUVPixels[i][2], this.rayWallsUVPixels[i][3]);
                if(this.wallShadows)
                {
                    if(!this.rayHitDirection[i])
                    {
                        renderable.setColor([0, 0, 0, 0.3]);
                    }
                }
                
                
                
                
                
                
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
            lineRay.setSecondVertex(this.rayHitPosition[i][0], this.rayHitPosition[i][1]);
            
            lineRay.draw(secondCamera);
            
        }
        
    }

    

}
export default RCCamera;
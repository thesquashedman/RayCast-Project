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
        this.effect1 = false;

        this.tempTextureHolder = null;
        this.textureWidth = 32;
        this.textureHeight = 32;
        this.fisheye = false;
    }
    TempTextureSetter(texture)
    {
        this.tempTextureHolder = texture;
    }
    Raycast(GridMap)
    {
        this.raycastLengths = []; // empty it
        this.raycastHitPosition = [];
        this.raycastHitDirection = [];
        this.rayAngles = [];
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
    _CastRay(theta, GridMap)
    {
        this.rayAngles.push(theta);
        let positionInGrid = [this.raycasterPosition[0] - GridMap.getPosition()[0], this.raycasterPosition[1] - GridMap.getPosition()[1]];
        let numberOfTime = 0;
        let currentDistance = 0;
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
                nextY = (nextY + 1) * GridMap.getHeightOfTile();
            } 
            else if (Math.sin(theta) < 0)
            {
                if(positionInGrid[1] % GridMap.getHeightOfTile() == 0)
                {
                    nextY = (nextY - 1) * GridMap.getHeightOfTile();
                }
                else
                {
                    nextY = nextY * GridMap.getHeightOfTile();
                }
                
            }
            else
            {
                //Should never get here
                nextY = null;
            }
            
            if(Math.cos(theta) >= 0)
            {
                nextX = (nextX + 1) * GridMap.getWidthOfTile();
            } 
            else if (Math.cos(theta) < 0)
            {
                if(positionInGrid[0] % GridMap.getWidthOfTile() == 0)
                {
                    nextX = (nextX - 1) * GridMap.getWidthOfTile();
                }
                else
                {
                    nextX = nextX * GridMap.getWidthOfTile();
                }
                
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
                let yIndex = nextY / GridMap.getHeightOfTile();
                let xIndex = Math.floor(xOfY / GridMap.getWidthOfTile());
                currentDistance += yDistance;
                positionInGrid = [xOfY, nextY];

                if(Math.sin(theta) < 0)
                {
                    yIndex -= 1;
                }
                if(yIndex >= 0 && yIndex < GridMap.getHeight() / GridMap.getHeightOfTile())
                {
                    if(GridMap.getTileAtIndex(xIndex, yIndex))
                    {
                        //console.log(positionInGrid[0] + " " + positionInGrid[1]);
                        this.raycastHitPosition.push(positionInGrid);
                        this.raycastHitDirection.push(true);
                        return currentDistance;
                    }
                }
                
                
            }
            else
            {
                let xIndex = nextX / GridMap.getWidthOfTile();
                let yIndex = Math.floor(yOfX / GridMap.getHeightOfTile());
                currentDistance += xDistance;
                positionInGrid = [nextX, yOfX];
                if(Math.cos(theta) < 0)
                {
                    xIndex -= 1;
                }
                if(xIndex >= 0  && xIndex < GridMap.getWidth() / GridMap.getWidthOfTile())
                {
                    if(GridMap.getTileAtIndex(xIndex, yIndex))
                    {
                        //console.log(positionInGrid[0] + " " + positionInGrid[1]);
                        this.raycastHitPosition.push(positionInGrid);
                        this.raycastHitDirection.push(false);
                        return currentDistance;
                    }
                }
                
            }
            numberOfTime++;
            if(numberOfTime >250)
            {
                this.raycastHitPosition.push([null, null]);
                this.raycastHitDirection.push(null);
                return -15;
            }


        }
        //If it gets outside the GridMap, return -1 to show that it didn't hit
        this.raycastHitPosition.push([null, null]);
        this.raycastHitDirection.push(null);
        return -1;
    }

    DrawRays() {
        let xStart = this.getWCCenter()[0]-this.getWCWidth()/2;
        let ymiddle = this.getWCCenter()[1];
        let width = this.getWCWidth();
        for (let i = 0; i < this.resolution; i++) {
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
            //console.log("line " + i + " xpos: " + xpos + "height: " + height);

            //let renderable = new engine.Renderable(); // this can be a texture later.
            let renderable = new engine.SpriteRenderable(this.tempTextureHolder);
            renderable.getXform().setPosition(xpos, ymiddle);
            renderable.getXform().setSize(width/(this.resolution), height);
            //let pixelStart = 0;
            let pixelWidth = this.textureWidth / this.resolution;
            let temp = 0
            if(!this.raycastHitDirection[i])
            {
                temp = 1;
                
            }
            let x = this.raycastHitPosition[i][temp] / 5;
            x = x - Math.floor(x);
            x = x * this.textureWidth;
            if(x + pixelWidth > this.textureWidth)
            {
                x = this.textureWidth - this.pixelWidth;
            }
            renderable.setElementPixelPositions(x, x + pixelWidth, 0, this.textureHeight);

            if(this.raycastHitDirection[i])
            {
                //renderable.setColor([0.4,0.1,0.1,1]);
                renderable.setColor([0,0,0,.4]);
            }
            else{
                //renderable.setColor([0.6,0.2,0.2,1]);
                renderable.setColor([1,1,1,0]);
            }
            
            
            
            renderable.draw(this);
            
            
        }

    }
    drawRayLines(secondCamera)
    {

        //secondCamera.setViewAndCameraMatrix();
        for (let i = 0; i < this.resolution; i++) {
            let lineRay = new engine.LineRenderable();
            lineRay.setColor([0,1,0,1]);
            lineRay.setFirstVertex(this.raycasterPosition[0], this.raycasterPosition[1]);
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

}
export default RCCamera;
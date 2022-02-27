import Camera from "./camera.js";

class RCCamera extends Camera {

    constructor(wcCenter, wcWidth, viewportArray, bound)
    {
        super(wcCenter, wcWidth, viewportArray, bound);
        this.fov = Math.PI;
        this.resolution = 50;
        this.raycasterPosition = [12.5, 12.5];
        this.raycasterAngle = 0;
        this.raycastLengths = [];
    }
    Raycast(GridMap)
    {
        for(let i = 0; i < this.resolution; i++)
        {
            let theta = this.raycasterAngle + this.fov/2 - i * (this.fov/(this.resolution - 1));
            this.raycastLengths.push(this._CastRay(theta, GridMap));
            console.log("length: " + this.raycastLengths[i] + " Angle: " + theta);
        }
        
    }
    _CastRay(theta, GridMap)
    {
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
                //If it's PI or 0, we never intersect any Y lines, so we don't care about it
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
                //If it's PI/2 or 3/2 PI, we never intersect any X lines, so we don't care about it
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
                        console.log(positionInGrid[0] + " " + positionInGrid[1]);
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
                        console.log(positionInGrid[0] + " " + positionInGrid[1]);
                        return currentDistance;
                    }
                }
                
            }
            numberOfTime++;
            if(numberOfTime >250)
            {
                return -15;
            }


        }
        //If it gets outside the GridMap, return -1 to show that it didn't hit
        return -1;
    }
    
}
export default RCCamera;
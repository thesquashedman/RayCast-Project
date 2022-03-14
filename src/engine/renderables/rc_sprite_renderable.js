"use strict";

import SpriteRenderable from "./sprite_renderable.js";
import SpriteAnimateRenderable from "./sprite_animate_renderable.js";
import engine from "../index.js";

class RCSpriteRenderable extends SpriteAnimateRenderable{
    constructor(myTexture) {
        super(myTexture);
        this.mScaleX = 1;
        this.mScaleY = 1;
        //Proportional to height. If yOffset = 1, moves up 1 * height of model.
        this.mYOffset = 0;
        this.visible = false;
    }
    getScaleX()
    {
        return this.mScaleX;
    }
    setScaleX(x)
    {
        this.mScaleX = x;
    }
    getScaleY()
    {
        return this.mScaleY;
    }
    setScaleY(y)
    {
        this.mScaleY = y;
    }
    getYOffset()
    {
        return this.mYOffset;
    }
    setYOffset(y)
    {
        this.mYOffset = y;
    }



    draw(camera, position)
    {
        let cameraPos = camera.getRayCasterPos();
        let resolution = Math.floor(camera.getResolution());
        let angle = Math.atan((cameraPos[1] - position[1])/(cameraPos[0] - position[0]));
        let distance = Math.sqrt(Math.pow(cameraPos[1] - position[1], 2) + Math.pow(cameraPos[0] - position[0], 2));
        if(cameraPos[0] < position[0] && cameraPos[1] > position[1])
        {
            
            angle += Math.PI;
        }
        else if(cameraPos[0] < position[0] && cameraPos[1] < position[1])
        {
            angle -= Math.PI;
        }
        if(angle < 0)
        {
            angle += Math.PI;
        }
        else{
            angle -= Math.PI;
        }
        let lowerBound = camera.getRayCasterAngle() - (1/2) * camera.getFOV();
        let upperBound = camera.getRayCasterAngle() + (1/2) * camera.getFOV();
        let inverseLower = false;
        let inverseUpper = false;
        let tempAngle = angle;
        if(tempAngle < 0)
        {
            tempAngle += 2 * Math.PI;
        }
        if(lowerBound < 0)
        {
            lowerBound += Math.PI * 2;
            inverseLower = true;
        }
        if(upperBound > Math.PI * 2)
        {
            upperBound -= Math.PI * 2;
            inverseUpper = true;
        }
        //console.log("Within");
        let index = 0;
        let indexProportion = 0;
        if(inverseLower || inverseUpper)
        {

            let offset = 2* Math.PI - lowerBound;
            index = (resolution - 2) - Math.floor((offset + angle)/(upperBound + offset) * (resolution - 1));
            indexProportion = index - ((resolution - 2) - (offset + angle)/(upperBound + offset) * (resolution - 1));
            indexProportion = 1- Math.abs(indexProportion);


        }
        else{
            index = (resolution - 2) - Math.floor((tempAngle - lowerBound)/(upperBound - lowerBound) * (resolution - 1));
            indexProportion = index - ((resolution - 2) - (tempAngle - lowerBound)/(upperBound - lowerBound) * (resolution - 1));
            indexProportion = 1- Math.abs(indexProportion);
            
        }
        if(index >= 0 && index < resolution - 1)
        {
            
            if( (camera.getRayLengths()[index] > distance && camera.getRayLengths()[index + 1] > distance) || 
                (camera.getRayLengths()[index] < 0 && camera.getRayLengths()[index + 1] > distance) ||
                (camera.getRayLengths()[index] > distance && camera.getRayLengths()[index + 1] < 0) ||
                (camera.getRayLengths()[index] < 0 && camera.getRayLengths()[index + 1] < 0)
            )
            {
                
                
                let scale = camera.getWCHeight() / distance;
                if(!camera.getFishEye())
                {
                    let r = distance * Math.abs(Math.cos(angle - camera.getRayCasterAngle()));
                    scale = camera.getWCHeight() / r;
                }
                let yPosition = camera.getWCCenter()[1] + camera.getHorizonLine() + this.mYOffset * scale * this.mScaleX;
                let xPosition = (camera.getWCCenter()[0]-camera.getWCWidth()/2 - (scale *this.mScaleX)/2) + ((index+indexProportion)/resolution) * (camera.getWCWidth() + scale * this.mScaleX);
                
                
                this.getXform().setPosition(xPosition, yPosition);
                this.getXform().setSize(scale *this.mScaleX, scale *this.mScaleY);
                this.visible = true;
                super.draw(camera);
                
                //renderable.draw(camera);
                //super.draw(camera);
            }
            else{
                this.visible = false;
            }
        }
        
        
    
        
        
        
        
        
    }

}
export default RCSpriteRenderable;
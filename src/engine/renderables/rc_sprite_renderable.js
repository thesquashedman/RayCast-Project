"use strict";

import SpriteRenderable from "./sprite_renderable.js";
import engine from "../index.js";

class RCSpriteRenderable extends SpriteRenderable{
    constructor(myTexture) {
        super(myTexture);
        this.mSpriteSize = 1;
        this.yOffset = 0;
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
        console.log((360 * angle)/(2 * Math.PI));
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

            console.log("inverse");
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
        console.log(index + " Index");
        console.log(indexProportion + " IndexProportion");
        if(index >= 0 && index < resolution - 1)
        {
            console.log("within");
            if(camera.getRaycastLengths()[index] > distance && camera.getRaycastLengths()[index + 1] > distance)
            {
                console.log("Visible");
                //let renderable = new engine.SpriteRenderable(this.mTexture);
                
                let scale = camera.getWCHeight() / distance;
                if(!camera.getFishEye())
                {
                    let r = distance * Math.abs(Math.cos(angle - camera.getRayCasterAngle()));
                    scale = camera.getWCHeight() / r;
                }
                let yPosition = camera.getWCCenter()[1] + camera.getHorizonLine();
                let xPosition = (camera.getWCCenter()[0]-camera.getWCWidth()/2 - scale/2) + ((index+indexProportion)/resolution) * (camera.getWCWidth() + scale);
                
                
                this.getXform().setPosition(xPosition, yPosition);
                this.getXform().setSize(scale, scale);
                super.draw(camera);
                //renderable.draw(camera);
                //super.draw(camera);
            }
        }
        
    
        
        
        
        //this.mXform.getSize()
        
    }

}
export default RCSpriteRenderable;
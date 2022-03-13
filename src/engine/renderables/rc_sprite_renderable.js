"use strict";

import SpriteRenderable from "./sprite_renderable.js";


class RCSpriteRenderable extends SpriteRenderable{
    constructor(myTexture) {
        super(myTexture);
        this.mSpriteSize = 1;
        this.yOffset = 0;
    }
    draw(camera, position)
    {
        let cameraPos = camera.getRayCasterPos();
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
        if(camera.getFOV() >= 2 * Math.PI)
        {
            console.log("SpriteRenderable is not supported above FOVs of 2pi");
        }
        else{
            console.log((360 * angle)/(2 * Math.PI));
            let lowerBound = camera.getRayCasterAngle() - (1/2) * camera.getFOV();
            console.log((360 * lowerBound)/(2 * Math.PI) + " Lower");
            let upperBound = camera.getRayCasterAngle() + (1/2) * camera.getFOV();
            console.log((360 * upperBound)/(2 * Math.PI) + " Upper");
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
            if(tempAngle < upperBound && angle > lowerBound)
            {
                console.log("Within");
                let index = 0;
                if(inverseLower || inverseUpper)
                {
                    let offset = 2* Math.PI - lowerBound;
                    index = (camera.getResolution() - 2) - Math.floor((offset + angle)/(upperBound + offset) * (camera.getResolution() - 1));


                }
                else{
                    index = (camera.getResolution() - 2) - Math.floor((tempAngle - lowerBound)/(upperBound - lowerBound)) * (camera.getResolution() - 1);
                    
                }
                if(camera.getRaycastLengths[index] > distance && camera.getRaycastLengths[index + 1] > distance)
                {
                    console.log("Visible");
                }
                    
            }
        }
        
        
        
        //this.mXform.getSize()
        //super.draw(camera);
    }

}
export default RCSpriteRenderable;
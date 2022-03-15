"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";

class PlayerObject extends engine.GameObject {
    constructor(renderable, rcRenderable)
    {
        super(renderable);
        this.mRCRenderable = rcRenderable;
        

    }
    draw(camera)
    {
        super.draw(camera);
        
        

    }
    drawRC(camera)
    {
        let position = this.mRenderComponent.getXform().getPosition();
        this.mRCRenderable.draw(camera, position);
    }
    
}
export default PlayerObject;

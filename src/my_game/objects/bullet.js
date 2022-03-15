"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";

class Bullet extends engine.GameObject {
    constructor(renderable, rcRenderable, angle)
    {
        super(renderable);
        this.mRCRenderable = rcRenderable;
        this.mAngle = angle;

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
    update()
    {
        let pos = this.mRenderComponent.getXform().getPosition();
        let d = 0.08;
        pos[0] += Math.cos(this.mAngle) * d;
        pos[1] += Math.sin(this.mAngle) * d;

    }
    
}
export default Bullet;
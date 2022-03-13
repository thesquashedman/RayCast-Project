"use strict";
class Tile {
    constructor(topTexture, bottomTexture, leftTexture, rightTexture)
    {
        this.mTopTexture = topTexture;
        this.mBottomTexture = bottomTexture;
        this.mLeftTexture = leftTexture;
        this.mRightTexture = rightTexture
    }
    getTopTexture()
    {
        return this.mTopTexture;
    }
    setTopTexture(topTexture)
    {
        this.mTopTexture = topTexture;
    }
    getBottomTexture()
    {
        return this.mBottomTexture;
    }
    setBottomTexture(bottomTexture)
    {
        this.mBottomTexture = bottomTexture;
    }
    getLeftTexture()
    {
        return this.mLeftTexture;
    }
    setLeftTexture(leftTexture)
    {
        this.mLeftTexture = leftTexture;
    }
    getRightTexture()
    {
        return this.mRightTexture;
    }
    setRightTexture(topTexture)
    {
        this.mRightTexture = rightTexture;
    }
}
export default Tile;

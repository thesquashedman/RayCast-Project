"use strict";
class GridMap{
    constructor()
    {
        this.mTiles = [
            [true, true, true, true, true],
            [true, true, null, true, true],
            [true, true, null, null, true],
            [true, null, null, null, true],
            [true, true, true, null, true]
        ];
        this.mPos = [0, 0];
        this.mWidth = 25;
        this.mHeight = 25;

    }
    setTiles(TileArray)
    {
        this.mTiles = TileArray;
    }
    setPosition(pos)
    {
        this.mPos = pos;
    }
    setWidth(width)
    {
        this.mWidth = width;
    }
    setHeight(height)
    {
        this.mHeight = height;
    }
    getPosition()
    {
        return this.mPos;
        
    }
    getWidth()
    {
        return this.mWidth;
        
    }
    getHeight()
    {
        return this.mHeight;
        
    }
    getHeightOfTile()
    {
        return this.mHeight / this.mTiles.length;
        
    }
    getWidthOfTile()
    {
        return this.mWidth / this.mTiles[0].length;
        
    }
    getHeightInTiles()
    {
        return this.mTiles.length;
    }
    getWidthInTiles()
    {
        return this.mTiles[0].length;
    }
    getTileAtIndex(x, y)
    {
        return this.mTiles[(this.mTiles.length - 1) - y][x];
    }
}
export default GridMap;
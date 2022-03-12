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
        this.mPos = [3, 7];
        this.mWidth = 15.5;
        this.mHeight = 25;

    }
    setTiles(TileArray)
    {
        Tiles = TileArray;
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
        return [0, 0];
    }
    getWidth()
    {
        return this.mWidth;
        return 25;
    }
    getHeight()
    {
        return this.mHeight;
        return 25;
    }
    getHeightOfTile()
    {
        return this.mHeight / this.mTiles.length;
        return 5;
    }
    getWidthOfTile()
    {
        return this.mWidth / this.mTiles[0].length;
        return 5;
    }
    getHeightInTiles()
    {
        return this.mTiles.length;
    }
    getWidthInTiles()
    {
        return this.mTiles.length;
    }
    getTileAtIndex(x, y)
    {
        let Tiles = [
            [true, true, true, true, true],
            [true, true, null, true, true],
            [true, true, null, null, true],
            [true, null, null, null, true],
            [true, true, true, null, true]
        ];
        return Tiles[(Tiles.length - 1) - y][x];
    }
}
export default GridMap;
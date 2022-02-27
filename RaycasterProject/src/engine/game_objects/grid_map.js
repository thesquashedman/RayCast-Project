class GridMap{
    constructor()
    {

    }
    getPosition()
    {
        return [0, 0];
    }
    getWidth()
    {
        return 25;
    }
    getHeight()
    {
        return 25;
    }
    getHeightOfTile()
    {
        return 5;
    }
    getWidthOfTile()
    {
        return 5;
    }
    getTileAtIndex(x, y)
    {
        let Tiles = [
            [true, true, true, true, true],
            [true, false, false, true, true],
            [true, false, false, false, true],
            [true, false, false, false, true],
            [true, true, true, true, true]
        ]
        return Tiles[y][x];
    }
}
export default GridMap;
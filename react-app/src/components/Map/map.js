class Node{
    constructor(data) {
        this.data = data;
        this.north = null;
        this.south = null;
        this.east = null;
        this.west = null;
    }
}

class LinkedList {
    constructor(start = null, end= null){
        this.start = start
        this.end = end
    }
}

export default class Map{

    constructor(width, height, canvas, gridX, gridY){

        //dimensions of canvas
        this.width = width
        this.height = height

        //canvas
        this.canvas = canvas

        //context for canvas for graphic rendering
        this.context = canvas.current.getContext('2d')

        //size of tile
        this.tileWidth = width / gridX
        this.tileHeight = height / gridY

        //grid dimensions
        this.gridX = gridX
        this.gridY = gridY

        //2d matrix
        this.matrix = Array.from(Array(gridY), () => new Array(gridX))

        //node matrix
        this.nodeMatrix = Array.from(Array(gridY), () => new Array(gridX))

        //start and end coordinates
        this.start = null
        this.end = null

        //path result
        this.pathBFS = null
        this.pathDFS = null
        this.pathLL = null

        //north, east, west, south
        this.directions = {
            0 : [0,1],
            1 : [1,0],
            2 : [-1,0],
            3 : [0, -1]
        }

        this.tiles = [
            `rgba(0, 0, 0, 0.5)`, // black
            `rgba(15, 112, 15, 1)`, // dark green
            `rgba(255, 253, 23, 1)`, // bright yellow
            `rgba(28, 168, 218, 0.54)`, // sky blue
            `rgba(255, 0, 0, 1)`, // red
            `rgba(184, 50, 208, 1)` // purple
        ]
    }

    //draw the clicked tile
    drawTile(x, y){
        this.context.fillStyle = this.tiles[0]
        this.fillRect(x, y)
        this.matrix[y][x] = 1
    }

    //draw grid
    drawGrid(){
        this.context.beginPath();

        //starting position of x
        let posX = this.tileWidth

        for (let i = 0; i < this.gridX; i ++){
            this.context.moveTo(posX, 0)
            this.context.lineTo(posX, this.height)
            this.context.stroke()
            posX += this.tileWidth
            console.log(posX)
        }

        //starting position of y
        let posY = this.tileHeight

        for (let i = 0; i < this.gridY; i ++){
            this.context.moveTo(0, posY)
            this.context.lineTo(this.width, posY)
            this.context.stroke()
            posY += this.tileHeight
        }
    }

    //set Canvas dimensions
    setCanvasDimensions(){
        this.canvas.current.width = this.width
        this.canvas.current.height = this.height
    }

    //draw nodes
    drawNode(x, y){
        this.context.fillStyle = this.tiles[5]
        this.fillRect(x, y)
    }

    //fill rect
    fillRect(x, y){
        this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight)
    }

    //plot node in the nodematrix
    plotNode(x, y){
        let data = (y * this.gridY) + (x + 1)

        const node = new Node(data)

        this.nodeMatrix[y][x] = node

        for (let i = 0; i < 4; i++){

            let newX = y + this.directions[i][0]
            let newY = x + this.directions[i][1]

            if(newX >= 0 && newX < this.nodeMatrix.length && newY >= 0 && newY < this.nodeMatrix[newX].length){

                if (i === 0){
                    if(this.nodeMatrix[newX][newY] instanceof Node){
                        node.east = this.nodeMatrix[newX][newY]
                        this.nodeMatrix[newX][newY].west = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newX][newY])
                    }
                } else if(i === 1){
                    if(this.nodeMatrix[newX][newY] instanceof Node){
                        node.south = this.nodeMatrix[newX][newY]
                        this.nodeMatrix[newX][newY].north = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newX][newY])
                    }
                } else if(i === 2){
                    if(this.nodeMatrix[newX][newY] instanceof Node){
                        node.north = this.nodeMatrix[newX][newY]
                        this.nodeMatrix[newX][newY].south = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newX][newY])
                    }
                } else {
                    if(this.nodeMatrix[newX][newY] instanceof Node){
                        node.west = this.nodeMatrix[newX][newY]
                        this.nodeMatrix[newX][newY].east = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newX][newY])
                    }
                }
            }
        }
    }

}

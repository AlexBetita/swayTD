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
        this.pathBFS = []
        this.pathDFS = []
        this.pathLL = []

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
            `rgba(184, 50, 208, 1)`, // purple
            `rgba(0, 255, 27, 1)`, // bright green
            `rgba(225, 137, 24, 1)` // orange
        ]
    }

    //get shortest path
    get shortestPath(){
        return Math.min([this.pathBFS.length, this.pathDFS.length, this.pathLL.length])
    }

    //draw the clicked tile
    drawTile(x, y){
        this.context.fillStyle = this.tiles[0]
        this.fillRect(x, y)
        this.matrix[y][x] = 1
    }

    //draw node
    drawNode(x, y){
        this.context.fillStyle = this.tiles[5]
        this.fillRect(x, y)
    }

    //draw start
    drawStart(x, y){
        this.context.fillStyle = this.tiles[1]
        this.fillRect(x, y)
        this.plotNode(x, y)
        this.start = [x, y]
    }

    //draw end
    drawEnd(x, y){
        this.context.fillStyle = this.tiles[4]
        this.fillRect(x, y)
        this.plotNode(x, y)
        this.end = [x, y]
        this.matrix[y][x] = 'end'
    }

    //draw path
    drawPath(type){
        if(type === 'dfs'){
            let pathDFS = this.pathDFS.slice(1, this.pathDFS.length - 1)

            for (let i = 0; i < pathDFS.length; i++){
                this.context.fillStyle = this.tiles[3]
                this.fillRect(pathDFS[i][1], pathDFS[i][0])
            }
        } else if(type === 'bfs'){
            let pathBFS = this.pathBFS.slice(1, this.pathBFS.length - 1)

            for (let i = 0; i < pathBFS.length; i++){
                this.context.fillStyle = this.tiles[2]
                this.fillRect(pathBFS[i][1], pathBFS[i][0])
            }
        } else if(type === 'dfs'){
            let pathLL = this.pathLL.slice(1, this.pathLL.length - 1)

            for (let i = 0; i < pathLL.length; i++){
                this.context.fillStyle = this.tiles[6]
                this.fillRect(pathLL[i][1], pathLL[i][0])
            }
        }
    }

    //draw all paths
    drawPaths(){
        let pathBFS = this.pathBFS.slice(1, this.pathBFS.length - 1)

        for (let i = 0; i < pathBFS.length; i++){
            this.context.fillStyle = this.tiles[2]
            this.fillRect(pathBFS[i][1], pathBFS[i][0])
        }

        let pathDFS = this.pathDFS.slice(1, this.pathDFS.length - 1)

        for (let i = 0; i < pathDFS.length; i++){
            this.context.fillStyle = this.tiles[3]
            this.fillRect(pathDFS[i][1], pathDFS[i][0])
        }


        let pathLL = this.pathLL.slice(1, this.pathLL.length - 1)

        for (let i = 0; i < pathLL.length; i++){
            this.context.fillStyle = this.tiles[6]
            this.fillRect(pathLL[i][1], pathLL[i][0])
        }
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

    //checks if possible to traverse
    checkBoundary(current, visited){
        let x = current[0]
        let y = current[1]

        return x >= 0 && x < this.matrix.length && y >= 0 && y < this.matrix[x].length &&
               !visited[`${current[0]}, ${current[1]}`] && this.matrix[x][y] !== undefined;
    }

    //start dfs
    startDFS(){
        let current = this.start
        let visited = {}
        visited[`${current[0]}, ${current[1]}`] = true
        this.pathDFS.push(current)
        this.DFS(current, visited)
    }

    //recursive dfs
    DFS(current, visited){
        if(this.matrix[current[0]][current[1]] === 'end'){
            return true
        }

        let neighbors;

        for (let i = 0; i < 4; i ++){
            neighbors = [current[0] + this.directions[i][0], current[1]  + this.directions[i][1]];
            if (this.checkBoundary(neighbors, visited)){
                visited[`${neighbors[0]}, ${neighbors[1]}`] = true
                this.pathDFS.push(neighbors)
                if (this.DFS(neighbors, visited)){
                    return true
                }
            }
        }
        return false
    }

}

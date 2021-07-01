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

    constructor(width, height, canvas, row, column){

        //dimensions of canvas
        this.width = width
        this.height = height

        //canvas
        this.canvas = canvas

        //context for canvas for graphic rendering
        this.context = canvas.current.getContext('2d')

        //size of tile
        this.tileWidth = width / column
        this.tileHeight = height / row

        //grid dimensions
        this.row = Math.floor(row)
        this.column = Math.floor(column)

        //2d matrix
        this.matrix = Array.from(Array(row), () => new Array(column))

        //node matrix
        this.nodeMatrix = Array.from(Array(row), () => new Array(column))

        //start and end coordinates
        this.start = [0,0]
        this.end = [0,0]


        //linked list
        this.linkedlist = new LinkedList()

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

        //tiles
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

        //map data
        this._mapData = {
            'width': this.width,
            'height' : this.height,
            'rows' : this.row,
            'columns' : this.column,
            'plotted_tiles' : {
                /*
                '0,0' : {
                    ...data
                    'fill_color' : `rgba(x, x, x, x)`
                }
                */
            }
        }
    }

    //get shortest path
    get shortestPath(){
        return Math.min([this.pathBFS.length, this.pathDFS.length, this.pathLL.length])
    }

    //get map data
    get mapData(){
        return this._mapData
    }

    //set map data
    set mapData(tileObj){
        this._mapData.plotted_tiles[tileObj.coordinates] = {...tileObj}
    }

    //draw the clicked tile
    drawTile(x, y){
        console.log(x)
        console.log(y)
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
        this.plotNode(x, y, 'start')
        this.start = [x, y]
    }

    //draw end
    drawEnd(x, y){
        this.context.fillStyle = this.tiles[4]
        this.fillRect(x, y)
        this.plotNode(x, y, 'end')
        this.end = [x, y]
    }

    //draw path
    drawPath(type){
        if(type === 'dfs'){
            let pathDFS = this.pathDFS.slice(1, this.pathDFS.length - 1)

            for (let i = 0; i < pathDFS.length; i++){
                this.context.fillStyle = this.tiles[3]
                this.fillRect(pathDFS[i][0], pathDFS[i][1])
            }
        } else if(type === 'bfs'){
            let pathBFS = this.pathBFS.slice(1, this.pathBFS.length - 1)

            for (let i = 0; i < pathBFS.length; i++){
                this.context.fillStyle = this.tiles[2]
                this.fillRect(pathBFS[i][0], pathBFS[i][1])
            }
        } else if(type === 'll'){
            let pathLL = this.pathLL.slice(1, this.pathLL.length - 1)

            for (let i = 0; i < pathLL.length; i++){
                this.context.fillStyle = this.tiles[6]
                this.fillRect(pathLL[i][0], pathLL[i][1])
            }
        }
    }

    //draw all paths
    drawPaths(){
        let pathBFS = this.pathBFS.slice(1, this.pathBFS.length - 1)

        for (let i = 0; i < pathBFS.length; i++){
            this.context.fillStyle = this.tiles[2]
            this.fillRect(pathBFS[i][0], pathBFS[i][1])
        }

        let pathDFS = this.pathDFS.slice(1, this.pathDFS.length - 1)

        for (let i = 0; i < pathDFS.length; i++){
            this.context.fillStyle = this.tiles[3]
            this.fillRect(pathDFS[i][0], pathDFS[i][1])
        }


        let pathLL = this.pathLL.slice(1, this.pathLL.length - 1)

        for (let i = 0; i < pathLL.length; i++){
            this.context.fillStyle = this.tiles[6]
            this.fillRect(pathLL[i][0], pathLL[i][1])
        }
    }


    //draw grid
    drawGrid(){
        this.context.beginPath();

        //starting position of x
        let posX = this.tileWidth

        for (let i = 0; i < this.column; i ++){
            this.context.moveTo(posX, 0)
            this.context.lineTo(posX, this.height)
            this.context.stroke()
            posX += this.tileWidth
        }

        //starting position of y
        let posY = this.tileHeight

        for (let i = 0; i < this.row; i ++){
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
    plotNode(x, y, position = null){
        let data = (y * this.column) + (x + 1)

        const node = new Node(data)

        this.nodeMatrix[y][x] = node

        if(position === 'start'){
            this.linkedlist.start = node
        } else if(position === 'end'){
            this.linkedlist.end = node
        }

        for (let i = 0; i < 4; i++){

            let newY = y + this.directions[i][0]
            let newX = x + this.directions[i][1]

            if(newY >= 0 && newY < this.nodeMatrix.length && newX >= 0 && newX < this.nodeMatrix[newY].length){

                if (i === 0){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.west = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].east = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                } else if(i === 1){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.north = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].south = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                } else if(i === 2){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.south = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].north = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                } else if(i === 3){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.east = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].west = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                }
            }
        }
    }

    //checks if possible to traverse
    checkBoundary(current, visited){
        let x = current[0]
        let y = current[1]

        return y >= 0 && y < this.matrix.length && x >= 0 && x < this.matrix[y].length &&
              !visited[`${current[0]}, ${current[1]}`] && this.matrix[y][x] !== undefined;
    }

    //start dfs
    startDFS(){
        const visited = {}
        let current = this.start

        visited[`${current[0]}, ${current[1]}`] = true
        this.pathDFS.push(current)
        this.DFS(current, visited)
    }

    //recursive dfs
    DFS(current, visited){
        if(current[0] === this.end[0] && current[1] === this.end[1]){
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


    //start bfs
    startBFS(){
        const visited = {}
        let current = this.start

        visited[`${current[0]}, ${current[1]}`] = true
        this.pathBFS.push(current)
        this.BFS(current, visited)
    }

    //bfs
    BFS(current, visited){
        const queue = [current];

        while (queue.length != 0) {

            current = queue[0]
            let neighbors;

            queue.shift();

            for (let i = 0; i < 4; i ++ ){

                neighbors = [current[0] + this.directions[i][0], current[1]  + this.directions[i][1]];

                if(this.checkBoundary(neighbors, visited)) {
                    visited[`${neighbors[0]}, ${neighbors[1]}`] = true
                    this.pathBFS.push(neighbors)
                    queue.push(neighbors)
                }

            }
        }
    }

    //start linked list
    startLL(){
        const visited = {}

        const result = this.LL(this.linkedlist.start, visited).reverse()
        const convertResultToCoords = []
        for (let i = 0; i < result.length; i++){
            let x = (result[i] % this.column) - 1
            let y = Math.floor(result[i] / this.column) % this.column
            convertResultToCoords.push([x, y])
        }
        
        this.pathLL=convertResultToCoords
    }

    //linked list
    LL(current, visited, result = []){
        if(current === this.linkedlist.end){
            return result.push(current.data)
        }

        if(current.north){
            if(!visited[current.north.data]){
                visited[current.north.data] = true
                if(this.LL(current.north, visited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        if(current.south){
            if(!visited[current.south.data]){
                visited[current.south.data] = true
                if(this.LL(current.south, visited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        if(current.east){
            if(!visited[current.east.data]){
                visited[current.east.data] = true
                if(this.LL(current.east, visited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        if(current.west){
            if(!visited[current.west.data]){
                visited[current.west.data] = true
                if(this.LL(current.west, visited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        return false
    }
}

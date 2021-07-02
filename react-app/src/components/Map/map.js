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
        this.matrix = Array.from(Array(row), () => new Array(column).fill(0))

        //node matrix
        this.nodeMatrix = Array.from(Array(row), () => new Array(column).fill(0))

        //start and end coordinates
        this.start = [0,0]
        this.end = [0,1]


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
            `rgba(225, 137, 24, 1)`, // orange
            `rgba(255, 255, 255, 1)` // white
        ]

        //map data
        this._mapData = {
            'width': this.width,
            'height' : this.height,
            'rows' : this.row,
            'columns' : this.column,
            'plotted_tiles' : {
                /*
                '1' : {
                    'data' : 1,
                    'start' : true,
                    'end' : false,
                    'x' : 0,
                    'y' : 0,
                    'fill_color' : `rgba(x, x, x, x)`
                }
                */
            }
        }
    }

    //get shortest path
    get shortestPath(){
        const paths = [this.pathBFS, this.pathDFS, this.pathLL]

        let min = Infinity;
        let currentMin;

        for (let i = 0; i < 3; i ++){
            if(paths[i].length !== 0){
                if(paths[i].length < min){
                    min = paths[i].length
                    currentMin = i
                }
            }
        }

        return paths[currentMin]
    }

    //get map data
    get mapData(){
        return this._mapData
    }

    //set map data
    set mapData(arr){

        this._mapData.plotted_tiles[arr[0]] = {
            'data' : arr[1],
            'start' : arr[2],
            'end' : arr[3],
            'x' : arr[4],
            'y' : arr[5],
            'fill_color' : arr[6]
        }

    }

    //set row
    set _row(row){
        this.row = row
    }

    //set column
    set _column(column){
        this.column = column
    }

    //set row
    set _height(height){
        this.height = height
    }

    //set width
    set _width(width){
        this.width = width
    }

    //resets map
    cleanMap(){
        this.setCanvasDimensions()
        this.matrix = Array.from(Array(this.row), () => new Array(this.column).fill(0))
        this.nodeMatrix = Array.from(Array(this.row), () => new Array(this.column).fill(0))
        this.linkedlist = new LinkedList()
        this.start = [0,0]
        this.end = [0,1]
        this.pathBFS = []
        this.pathDFS = []
        this.pathLL = []
        this._mapData = {
            'width': this.width,
            'height' : this.height,
            'rows' : this.row,
            'columns' : this.column,
            'plotted_tiles' : {
            }
        }
    }

    //draw the clicked tile
    drawTile(x, y){
        let data = this.getTileNumber(x, y)

        if(y < 0 || y >= this.column){
            return false
        }

        if(this.matrix[y][x] !== 1){
            this.context.fillStyle = this.tiles[0]
            this.fillRect(x, y)
            this.matrix[y][x] = 1

            this.mapData = [data, data, false, false, x, y, this.tiles[0]]

            return true
        }
        return false
    }

    //draw node
    drawNode(x, y){
        let data = this.getTileNumber(x, y)

        if(y < 0 || y >= this.column){
            return false
        }

        if(!(this.nodeMatrix[y][x] instanceof Node)){
            this.context.fillStyle = this.tiles[5]
            this.fillRect(x, y)
            this.plotNode(x, y)

            this.mapData = [data + 'n', data, false, false, x, y, this.tiles[5]]

            return true
        }
        return false
    }

    //draw start
    drawStart(x, y){
        let data = this.getTileNumber(x, y)

        //These two if statements can cause bugs
        if(this.matrix[this.start[1]][this.start[0]] === 1){

            this.clearTile(this.start[0], this.start[1])
        }

        if(this.nodeMatrix[this.start[1]][this.start[0]] instanceof Node){

            this.clearTile(this.start[0], this.start[1])
        }

        this.mapData = [data, data, true, false, x, y, this.tiles[1]]

        this.context.fillStyle = this.tiles[1]

        this.plotNode(x, y, 'start')
        this.matrix[y][x] = 1
        this.start = [x, y]
        this.fillRect(x, y)
    }

    //draw end
    drawEnd(x, y){
        let data = this.getTileNumber(x, y)

        //These two if statements can cause bugs
        if(this.matrix[this.end[1]][this.end[0]] === 1 && this.end[0]){
            this.clearTile(this.end[0], this.end[1])
        }

        if(this.nodeMatrix[this.end[1]][this.end[0]] instanceof Node){
            this.clearTile(this.end[0], this.end[1])
        }

        this.mapData = [data, data, false, true, x, y, this.tiles[4]]

        this.context.fillStyle = this.tiles[4]

        this.end = [x, y]
        this.fillRect(x, y)
        this.plotNode(x, y, 'end')
        this.matrix[y][x] = 1
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
            let pathLL = this.pathLL.slice(0, this.pathLL.length - 2)

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


        let pathLL = this.pathLL.slice(0, this.pathLL.length - 2)

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

    //remove grid
    removeGrid(){
        this.context.beginPath();

        //starting position of x
        let posX = this.tileWidth
        this.context.lineWidth = 1.7
        this.context.strokeStyle = "rgba(255, 255, 255, 1)";

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
    setCanvasDimensions(width = this.width, height = this.height){
        this.canvas.current.width = width
        this.canvas.current.height = height
    }

    //fill rect
    fillRect(x, y){
        this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth - 1, this.tileHeight - 1)
    }

    //remove fill rect
    clearTile(x, y){
        this.context.fillStyle = this.tiles[8]
        this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight)
        this.matrix[y][x] = 0
        this.nodeMatrix[y][x] = 0
    }

    //get exact number of tile in grid
    getTileNumber(x, y){
        return (y * this.column) + (x + 1)
    }

    //plot node in the nodematrix
    plotNode(x, y, position = null){

        let data = this.getTileNumber(x, y)

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
                        node.east = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].west = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                } else if(i === 1){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.south = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].north = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                } else if(i === 2){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.north = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].south = this.nodeMatrix[y][x]
                        console.log(this.nodeMatrix[newY][newX])
                    }
                } else if(i === 3){
                    if(this.nodeMatrix[newY][newX] instanceof Node){
                        node.west = this.nodeMatrix[newY][newX]
                        this.nodeMatrix[newY][newX].east = this.nodeMatrix[y][x]
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
              !visited[`${current[0]}, ${current[1]}`] && this.matrix[y][x] !== 0;
    }

    //start dfs
    startDFS(){
        //reset path
        this.pathDFS = []

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
        //reset path
        this.pathBFS = []

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
            if(current[0] === this.end[0] && current[1] === this.end[1]){
                return
            }
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
        //reset path
        this.pathLL = []

        const visited = {}
        visited[`${this.start[0]}, ${this.start[1]}`] = true
        const result = this.LL(this.linkedlist.start, visited).reverse()
        const convertResultToCoords = []
        for (let i = 0; i < result.length; i++){
            let x = result[i] === 0 ? 0
                    : result[i] <= this.column ? result[i] - 1
                    : (result[i] % this.column) - 1 === -1 ? (result[i] - (result[i] - this.column)) - 1
                    : (result[i] % this.column) - 1
            let y = result[i] <= this.column ? 0
                    : Math.floor((result[i] - 1) / this.column) % this.column
            convertResultToCoords.push([x, y])
        }
        this.pathLL=convertResultToCoords
    }

    LL(current, visited, result =[]){
        if(current === this.linkedlist.end){
            return result.push(current.data)
        }

        const queue = [current.north, current.south, current.east, current.west]

        while (queue.length){
            current = queue.shift()
            if(current){
                if(!visited[current.data]){
                    visited[current.data] = true
                    if(this.LL(current, visited, result)){
                        result.push(current.data)
                        return [...result]
                    }
                }
            }

        }
        return false
    }

    static loadMap(mapData, canvas){

        const {width, height, rows, columns, plotted_tiles} = mapData

        const newMap = new Map(width, height, canvas, rows, columns)

        newMap.setCanvasDimensions()
        newMap.drawGrid()

        Object.keys(plotted_tiles).map((key, id)=>{
            let x = plotted_tiles[key].x
            let y = plotted_tiles[key].y

            let start = plotted_tiles[key].start
            let end = plotted_tiles[key].end

            if(start){
                newMap.drawStart(x, y)
            } else if(end){
                newMap.drawEnd(x, y)
            } else {
                newMap.drawTile(x, y)
            }
        })

        return newMap
    }
}

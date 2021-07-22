class Node{
    constructor(data) {
        this.data = data;
        this.north = null;
        this.south = null;
        this.east = null;
        this.west = null;

        //dj
        this.distance = 1
    }
}

class LinkedList {
    constructor(start = null, end= null){
        this.start = start
        this.end = end
    }
}

//djkstra
class Djkstra {
    constructor(){
        this.graph = {
            start: {},
            end: {},
        }

        this.costs = {
            end: Infinity
        }
        this.parents = {
            end: null
        }
        this.processed =  []
    }

    lowestCoseNode(){
        return Object.keys(this.costs).reduce((lowest, node)=>{
            if (lowest === null || this.costs[node] < this.costs[lowest]){
                if(!this.processed.includes(node)){
                    lowest = node;
                }
            }
            return lowest;
        }, null);
    };
}

export default class Map{

    constructor(width, height, canvas, row, column){

        //dimensions of canvas
        this.width = width
        this.height = height

        //canvas
        this.canvas = canvas

        //context for canvas for graphic rendering
        this.context = canvas.getContext('2d')

        //size of tile
        this.tileWidth = width / column
        this.tileHeight = height / row

        //grid dimensions
        this.rows = Math.floor(row)
        this.columns = Math.floor(column)

        //2d matrix
        this.matrix = Array.from(Array(row), () => new Array(column).fill(0))

        //start and end coordinates
        this.start = null
        this.end = null

        //linked list
        this.linkedlist = new LinkedList()

        //path result
        this.pathBFS = []
        this.pathDFS = []
        this.pathLL = []

        //djkstra

        this.djkstra = new Djkstra()

        this.pathDJ = []

        //north, east, west, south
        this.directions = {
            0 : [0,1],
            1 : [1,0],
            2 : [-1,0],
            3 : [0, -1]
        }

        //tiles
        this.tiles = [
            `rgba(0, 0, 0, 1)`, // black
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
            'rows' : this.rows,
            'columns' : this.columns,
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

        this._undoPath = {
            'bfs' : false,
            'dfs' : false,
            'll' : false,
            'paths' : {
                /*
                'x,y': {
                    'bfs': false,
                    'dfs': false,
                    'll': false,
                    'fill_color': 'rgb(r, g, b, o / 255)'
                }
                */
            }
        }

        this.undo = []
        this.drawing = false;
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

    //get graph
    get djkstraData(){
        return this.djkstra
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

    //delete key
    set delMapKey(arr){
        delete this._mapData.plotted_tiles[arr]
    }

    //delete cost
    set delCost(data){
        delete this.djkstra.costs[data]
    }

    //delete parent
    set delParents(data){
        delete this.djkstra.parents[data]
    }

    //delete start
    set delStart(data){
        delete this.djkstra.graph.start[data]
    }

    //delete graph
    set delGraph(data){
        delete this.djkstra.graph[data]
    }

    //delete processed
    set delProcessed(data){
        const index = this.djkstra.processed.indexOf(data)
        this.djkstra.processed.splice(index, 1)

    }

    //set row
    set _row(row){
        this.rows = row
        this.tileHeight = this.height / row
        this._mapData['rows'] = row
    }

    //set column
    set _column(column){
        this.columns = column
        this.tileWidth = this.width / column
        this._mapData['columns'] = column
    }

    //set height
    set _height(height){
        this.height = height
        this.tileHeight = height / this.rows
        this._mapData['height'] = height
    }

    //set width
    set _width(width){
        this.width = width
        this.tileWidth = width / this.columns
        this._mapData['width'] = width
    }

    set _drawing(condition){
        this.drawing = condition
    }


    getDataUrl(){
        return this.canvas.toDataURL()
    }

    getImageData(x, y){
        // get center of image
        // this.context.fillStyle = `rgba(0, 0, 0, 1)`
        // this.context.fillRect(x * this.tileWidth + (this.tileWidth / 2), y * this.tileHeight + (this.tileHeight/2), 1 , 1)
        return this.context.getImageData(x * this.tileWidth + (this.tileWidth / 2), y * this.tileHeight + (this.tileHeight/2), 1 , 1)
    }

    getRGBAOfPixel(x, y){
        const pixel = this.getImageData(x,y)
        const data = pixel.data

        //12 13 14 15
        //28 29 30 31
        // this.context.fillStyle = `rgba(0, 0, 0, 1)`
        // this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth , this.tileHeight)
        return `rgb(${data[0]},${data[1]},${data[2]}, ${data[3] / 255})`;
    }

    /*
        RGB to hex implementation credits to this post
        https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    */

    getRGBAToHex(x, y){
        const rgb = this.getRGBAOfPixel(x, y).split(',')
        const r = parseInt(rgb[0].substring(4,7))
        const g = parseInt(rgb[1])
        const b = parseInt(rgb[2])

        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    //resets map
    cleanMap(){
        this.setCanvasDimensions()
        this.matrix = Array.from(Array(this.rows), () => new Array(this.columns).fill(0))
        this.linkedlist = new LinkedList()
        this.start = null
        this.end = null
        this.pathBFS = []
        this.pathDFS = []
        this.pathLL = []
        this._mapData = {
            'width': this.width,
            'height' : this.height,
            'rows' : this.rows,
            'columns' : this.columns,
            'plotted_tiles' : {
            }
        }

        //dj
        this.djkstra = new Djkstra()
    }

    //draw tile
    drawTile(x, y, color = false){
        let data = this.getTileNumber(x, y)
        if(!this.drawing){
            this.undo = []
        }
        //HAD TO PUT IN TRY CATCH CAUSE MY INITIAL SOLUTION WAS NOT WORKING ON BIG BOY ROWS AND GRID
        //When Y is bigger than column and you go out of bounds an error happens
        try{
            if(!(this.matrix[y][x] instanceof Node)){

                if(!color){
                    this.context.fillStyle = this.tiles[0]
                    this.mapData = [data, data, false, false, x, y, this.tiles[0]]
                } else {
                    this.context.fillStyle = color
                    this.mapData = [data, data, false, false, x, y, color]
                }

                this.fillRect(x, y)
                this.plotNode(x, y)
                if(this.undo.length > 200){
                    this.undo.shift()
                    this.undo.push(`${x},${y}`)
                } else {
                    this.undo.push(`${x},${y}`)
                }
                return true
            }
        } catch {
            return false
        }

    }

    //draw start
    drawStart(x, y){
        let data = this.getTileNumber(x, y)

        if(this.start){
            if(this.matrix[this.start[1]][this.start[0]] instanceof Node){

                this.clearTile(this.start[0], this.start[1])
                this.delMapKey = this.getTileNumber(this.start[0], this.start[1])

                //dj
                this.djkstra.graph.start = {}
                this.djkstra.processed = []
                this.djkstra.parents = {
                    end: null
                }
            }
        }

        this.context.fillStyle = this.tiles[1]

        this.start = [x, y]
        this.plotNode(x, y, 'start')
        this.fillRect(x, y)
        this.mapData = [data, data, true, false, x, y, this.tiles[1]]

        //dj
        this.djkstra.processed.push('start')
    }

    //draw end
    drawEnd(x, y){
        let data = this.getTileNumber(x, y)

        if(this.end){
            if(this.matrix[this.end[1]][this.end[0]] instanceof Node){

                this.clearTile(this.end[0], this.end[1])
                this.delMapKey = this.getTileNumber(this.end[0], this.end[1])

            }
        }

        this.context.fillStyle = this.tiles[4]

        this.end = [x, y]
        this.plotNode(x, y, 'end')
        this.fillRect(x, y)
        this.mapData = [data, data, false, true, x, y, this.tiles[4]]
    }

    //undo
    undoDraw(){
        let x;
        let y;
        for(let i = 0; i < this.undo.length; i++){
            x = this.undo[i].split(',')[0]
            y = this.undo[i].split(',')[1]
            this.clearTile(parseInt(x), parseInt(y))
        }

        this.undo = []
    }

    saveUndoData(x, y, dfs = false, bfs = false, ll = false){
        //initialize defaults
        if(!this._undoPath['paths'][`${x},${y}`]){
            this._undoPath['paths'][`${x},${y}`] = {
                // reason for this is to keep track if color was overwritten
                'bfs' : false,
                'dfs' : false,
                'll' : false,
                'fille_color' : 'rgb(0,0,0,1)' //default to black
            }
        }

        if (bfs){
            if(!this._undoPath['bfs']){
                this._undoPath['bfs'] = true;
            }
            //check if path was previously traveled
            if(this._undoPath['paths'][`${x},${y}`]['bfs']){
                return
            }
            this._undoPath['paths'][`${x},${y}`]['bfs'] = true;

            if(!this._undoPath['paths'][`${x},${y}`]['dfs'] && !this._undoPath['paths'][`${x},${y}`]['ll']){
                this._undoPath['paths'][`${x},${y}`]['fill_color'] = this.getRGBAOfPixel(x, y)
            }

        } else if (dfs){
            if(!this._undoPath['dfs']){
                this._undoPath['dfs'] = true;
            }

            if(this._undoPath['paths'][`${x},${y}`]['dfs']){
                return
            }

            this._undoPath['paths'][`${x},${y}`]['dfs'] = true;

            if(!this._undoPath['paths'][`${x},${y}`]['bfs'] && !this._undoPath['paths'][`${x},${y}`]['ll']){
                this._undoPath['paths'][`${x},${y}`]['fill_color'] = this.getRGBAOfPixel(x, y)
            }

        } else if (ll){
            if(!this._undoPath['ll']){
                this._undoPath['ll'] = true;
            }

            if(this._undoPath['paths'][`${x},${y}`]['ll']){
                return
            }

            this._undoPath['paths'][`${x},${y}`]['ll'] = true;

            if(!this._undoPath['paths'][`${x},${y}`]['dfs'] && !this._undoPath['paths'][`${x},${y}`]['bfs']){
                this._undoPath['paths'][`${x},${y}`]['fill_color'] = this.getRGBAOfPixel(x, y)
            }
        }
    }

    //draw path
    drawPath(type = null, speed = null, color = null){
        let promises = []
        if(type === 'dfs'){
            //disregard start and end point
            let pathDFS = this.pathDFS.slice(1, this.pathDFS.length - 1)

            if(!color){
                color = this.tiles[3]
            }

            if(speed){
                for (let i = 0; i < pathDFS.length; i++){

                    this.context.fillStyle = color
                    promises.push(new Promise((res, rej) =>{
                        setTimeout(()=>{
                            //track undo
                            this.saveUndoData(pathDFS[i][0], pathDFS[i][1], true)

                            this.fillRect(pathDFS[i][0], pathDFS[i][1])
                            res('true')
                        }, i * speed)
                    }))
                }
                return promises
            } else {
                for (let i = 0; i < pathDFS.length; i++){

                    //track undo
                    this.saveUndoData(pathDFS[i][0], pathDFS[i][1], true)

                    this.context.fillStyle = color
                    this.fillRect(pathDFS[i][0], pathDFS[i][1])
                }
            }
        } else if(type === 'bfs'){

            //disregard start and end point
            let pathBFS = this.pathBFS.slice(1, this.pathBFS.length - 1)

            if(!color){
                color = this.tiles[2]
            }

            if(speed){
                for (let i = 0; i < pathBFS.length; i++){
                    this.context.fillStyle = color
                    promises.push(new Promise((res, rej) =>{
                        setTimeout(()=>{

                            //track undo
                            this.saveUndoData(pathBFS[i][0], pathBFS[i][1], false, true)

                            this.fillRect(pathBFS[i][0], pathBFS[i][1])
                            res('true')
                        }, i * speed)
                    }))
                }
                return promises
            } else {
                for (let i = 0; i < pathBFS.length; i++){

                    //track undo
                    this.saveUndoData(pathBFS[i][0], pathBFS[i][1], false, true)

                    this.context.fillStyle = color
                    this.fillRect(pathBFS[i][0], pathBFS[i][1])
                }
            }

        } else if(type === 'll'){

            //disregard start and end point
            let pathLL = this.pathLL.slice(0, this.pathLL.length - 2)

            if(!color){
                color = this.tiles[6]
            }

            if(speed){
                for (let i = 0; i < pathLL.length; i++){
                    this.context.fillStyle = color
                    promises.push(new Promise((res, rej) =>{
                        setTimeout(()=>{

                            //track undo
                            this.saveUndoData(pathLL[i][0], pathLL[i][1], false, false, true)

                            this.fillRect(pathLL[i][0], pathLL[i][1])
                            res('true')
                        }, i * speed)
                    }))
                }
                return promises
            } else {
                for (let i = 0; i < pathLL.length; i++){

                    //track undo
                    this.saveUndoData(pathLL[i][0], pathLL[i][1], false, false, true)

                    this.context.fillStyle = color
                    this.fillRect(pathLL[i][0], pathLL[i][1])
                }
            }
        } else if(type === 'djkstra'){
            //disregard start
            let pathDJ = this.pathDJ.slice(1, this.pathDJ.length)

            for (let i = 0; i < pathDJ.length; i++){
                this.context.fillStyle = this.tiles[6]
                this.fillRect(pathDJ[i][0], pathDJ[i][1])
            }
        }

        return promises
    }

    undoPath(dfs = false, bfs = false, ll = false, speed = 0){
        let reverse;
        let color;
        let promises = []
        if(dfs){
            if(!this._undoPath['dfs']){
                return false
            }
            reverse = this.pathDFS.slice(1, this.pathDFS.length - 1);
            reverse = reverse.reverse()


            for(let i = 0; i < reverse.length; i++){
                promises.push(new Promise((res, rej) =>{
                    setTimeout(()=>{
                        //set dfs undo back to false
                        this._undoPath['paths'][`${reverse[i][0]},${reverse[i][1]}`]['dfs'] = false
                        color = this._undoPath['paths'][`${reverse[i][0]},${reverse[i][1]}`]['fill_color']
                        this.context.fillStyle = 'rgb(255,255,255,1)' //clear first
                        this.fillRect(reverse[i][0], reverse[i][1])
                        this.context.fillStyle = color //set back to initial color before traveling
                        this.fillRect(reverse[i][0], reverse[i][1])
                        res('true')
                    }, i * speed)
                }))
            }

            //set undo to false
            this._undoPath['dfs'] = false

            return promises
            // return {
            //     'status'  : true,
            //     'message' : 'successfully undid dfs'
            // }
        } else if(bfs){
            if(!this._undoPath['bfs']){
                return false
            }
            reverse = this.pathBFS.slice(1, this.pathBFS.length - 1);
            reverse = reverse.reverse()

            for(let i = 0; i < reverse.length; i++){
                promises.push(new Promise((res, rej) =>{
                    setTimeout(()=>{
                        //set bfs undo back to false
                        this._undoPath['paths'][`${reverse[i][0]},${reverse[i][1]}`]['bfs'] = false
                        color = this._undoPath['paths'][`${reverse[i][0]},${reverse[i][1]}`]['fill_color']
                        this.context.fillStyle = 'rgb(255,255,255,1)' //clear first
                        this.fillRect(reverse[i][0], reverse[i][1])
                        this.context.fillStyle = color //set back to initial color before traveling
                        this.fillRect(reverse[i][0], reverse[i][1])
                        res('true')
                    }, i * speed)
                }))
            }

            //set undo to false
            this._undoPath['bfs'] = false

            return promises

        } else if(ll){
            if(!this._undoPath['ll']){
                return false
            }
            reverse = this.pathLL.slice(0, this.pathLL.length - 2);
            reverse = reverse.reverse()

            for(let i = 0; i < reverse.length; i++){
                promises.push(new Promise((res, rej) =>{
                    setTimeout(()=>{
                        //set ll undo back to false
                        this._undoPath['paths'][`${reverse[i][0]},${reverse[i][1]}`]['ll'] = false
                        color = this._undoPath['paths'][`${reverse[i][0]},${reverse[i][1]}`]['fill_color']
                        this.context.fillStyle = 'rgb(255,255,255,1)' //clear first
                        this.fillRect(reverse[i][0], reverse[i][1])
                        this.context.fillStyle = color //set back to initial color before traveling
                        this.fillRect(reverse[i][0], reverse[i][1])
                        res('true')
                    }, i * speed)
                }))
            }

            this._undoPath['ll'] = false

            return promises
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
        this.context.strokeStyle = "rgba(0, 0, 0, 1)";
        this.context.lineWidth = 1

        //starting position of x
        let posX = this.tileWidth

        for (let i = 0; i < this.columns; i ++){
            this.context.moveTo(posX, 0)
            this.context.lineTo(posX, this.height)
            this.context.stroke()
            posX += this.tileWidth
        }

        //starting position of y
        let posY = this.tileHeight

        for (let i = 0; i < this.rows; i ++){
            this.context.moveTo(0, posY)
            this.context.lineTo(this.width, posY)
            this.context.stroke()
            posY += this.tileHeight
        }
    }

    //remove grid
    removeGrid(){
        this.context.beginPath();
        this.context.strokeStyle = "rgba(255, 255, 255, 1)";

        //starting position of x
        let posX = this.tileWidth
        this.context.lineWidth = 2

        for (let i = 0; i < this.columns; i ++){
            this.context.moveTo(posX, 0)
            this.context.lineTo(posX, this.height)
            this.context.stroke()
            posX += this.tileWidth
        }

        //starting position of y
        let posY = this.tileHeight

        for (let i = 0; i < this.rows; i ++){
            this.context.moveTo(0, posY)
            this.context.lineTo(this.width, posY)
            this.context.stroke()
            posY += this.tileHeight
        }
    }

    //set Canvas dimensions
    setCanvasDimensions(width = this.width, height = this.height){
        this.canvas.width = width
        this.canvas.height = height
    }

    //fill rect
    fillRect(x, y){
        this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth , this.tileHeight)
    }

    //remove fill rect
    clearTile(x, y){
        try{
            let data = this.getTileNumber(x, y)
            let currentDistance = this.matrix[y][x].distance

            this.context.fillStyle = this.tiles[8]
            this.context.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight)

            this.context.strokeStyle = "rgba(255, 255, 255, 1)";
            this.context.lineWidth  = 1.5;
            this.context.strokeRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);

            this.matrix[y][x] = 0
            this.delMapKey = data

            //dj
            this.delCost = data
            this.delParents = data
            this.delProcessed = data
            if(this.djkstra.graph.start[data]){
                if(this.start[0] === x && this.start[1] === y){
                    this.delStart = 'start'
                } else{
                    this.delStart = data
                    this.delGraph = data
                }
            }
            //check surrounding tiles to properly reduce cost
            for (let i = 0; i < 4; i++){
                let newY = y + this.directions[i][0]
                let newX = x + this.directions[i][1]
                if(newY >= 0 && newY < this.matrix.length && newX >= 0 && newX < this.matrix[newY].length){

                    if (i === 0){
                        if(this.matrix[newY][newX] instanceof Node){
                            if(this.djkstra.costs[this.matrix[newY][newX].data] - currentDistance >= 1){
                                this.djkstra.costs[this.matrix[newY][newX].data] -= currentDistance
                            }
                        }
                    } else if(i === 1){
                        if(this.matrix[newY][newX] instanceof Node){
                            if(this.djkstra.costs[this.matrix[newY][newX].data] - currentDistance >= 1){
                                this.djkstra.costs[this.matrix[newY][newX].data] -= currentDistance
                            }
                        }
                    } else if(i === 2){
                        if(this.matrix[newY][newX] instanceof Node){
                            if(this.djkstra.costs[this.matrix[newY][newX].data] - currentDistance >= 1){
                                this.djkstra.costs[this.matrix[newY][newX].data] -= currentDistance
                            }
                        }
                    } else if(i === 3){
                        if(this.matrix[newY][newX] instanceof Node){
                            if(this.djkstra.costs[this.matrix[newY][newX].data] - currentDistance >= 1){
                                this.djkstra.costs[this.matrix[newY][newX].data] -= currentDistance
                            }
                        }
                    }
                }
            }

        } catch {
            //out of bounds
            return false
        }
    }

    //get exact number of tile in grid
    getTileNumber(x, y){
        return (y * this.columns) + (x + 1)
    }

    //plot node in the nodematrix
    plotNode(x, y, position = null){

        let data = this.getTileNumber(x, y)

        const node = new Node(data)

        this.matrix[y][x] = node

        if(position === 'start'){
            this.linkedlist.start = node
        } else if(position === 'end'){
            this.linkedlist.end = node
        } else {
            //dj
            //add to graph
            this.djkstra.graph[data] = {}
        }

        //dj
        //we initialize the costs
        // this.djkstra.costs[data] = this.matrix[y][x].distance

        for (let i = 0; i < 4; i++){

            let newY = y + this.directions[i][0]
            let newX = x + this.directions[i][1]

            if(newY >= 0 && newY < this.matrix.length && newX >= 0 && newX < this.matrix[newY].length){

                if (i === 0){
                    if(this.matrix[newY][newX] instanceof Node){
                        //dj
                        if(position === 'start'){
                            //we add the adjacent cells to the start of the graph
                            this.djkstra.graph.start[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            //we add them to the processed/visited array
                            this.djkstra.processed.push(this.matrix[newY][newX].data)
                            //we add their parents
                            this.djkstra.parents[this.matrix[newY][newX].data] = 'start'

                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance + this.djkstra.costs[this.matrix[y][x].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.start){
                            this.djkstra.graph.start[this.matrix[y][x].data] = this.matrix[y][x].distance
                            this.djkstra.processed.push(this.matrix[y][x].data)
                            this.djkstra.parents[this.matrix[y][x].data] = this.matrix[newY][newX].data

                            this.djkstra.costs[data] = this.matrix[y][x].distance
                            // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.end){
                            this.djkstra.graph[data]['end'] = this.matrix[newY][newX].distance
                        } else if (position !== 'end'){
                            this.djkstra.graph[data][this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            this.djkstra.graph[this.matrix[newY][newX].data][data] = this.matrix[y][x].distance
                        } else if (position === 'end'){
                            this.djkstra.graph[this.matrix[newY][newX].data]['end'] = this.matrix[y][x].distance
                        }
                        //we increment the costs based on the distances from one another
                        //experimental
                        // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]

                        node.east = this.matrix[newY][newX]
                        this.matrix[newY][newX].west = this.matrix[y][x]
                    }
                } else if(i === 1){
                    if(this.matrix[newY][newX] instanceof Node){
                        //dj
                        if(position === 'start'){
                            //we add the adjacent cells to the start of the graph
                            this.djkstra.graph.start[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            //we add them to the processed/visited array
                            this.djkstra.processed.push(this.matrix[newY][newX].data)
                            //we add their parents
                            this.djkstra.parents[this.matrix[newY][newX].data] = 'start'

                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance + this.djkstra.costs[this.matrix[y][x].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.start){
                            this.djkstra.graph.start[this.matrix[y][x].data] = this.matrix[y][x].distance
                            this.djkstra.processed.push(this.matrix[y][x].data)
                            this.djkstra.parents[this.matrix[y][x].data] = this.matrix[newY][newX].data

                            this.djkstra.costs[data] = this.matrix[y][x].distance
                            // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.end){
                            this.djkstra.graph[data]['end'] = this.matrix[newY][newX].distance
                        } else if (position !== 'end'){
                            this.djkstra.graph[data][this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            this.djkstra.graph[this.matrix[newY][newX].data][data] = this.matrix[y][x].distance
                        } else if (position === 'end'){
                            this.djkstra.graph[this.matrix[newY][newX].data]['end'] = this.matrix[y][x].distance
                        }
                        // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]

                        node.south = this.matrix[newY][newX]
                        this.matrix[newY][newX].north = this.matrix[y][x]
                    }
                } else if(i === 2){
                    if(this.matrix[newY][newX] instanceof Node){
                        //dj
                        if(position === 'start'){
                            //we add the adjacent cells to the start of the graph
                            this.djkstra.graph.start[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            //we add them to the processed/visited array
                            this.djkstra.processed.push(this.matrix[newY][newX].data)
                            //we add their parents
                            this.djkstra.parents[this.matrix[newY][newX].data] = 'start'

                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance + this.djkstra.costs[this.matrix[y][x].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.start){
                            this.djkstra.graph.start[this.matrix[y][x].data] = this.matrix[y][x].distance
                            this.djkstra.processed.push(this.matrix[y][x].data)
                            this.djkstra.parents[this.matrix[y][x].data] = this.matrix[newY][newX].data

                            this.djkstra.costs[data] = this.matrix[y][x].distance
                            // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.end){
                            this.djkstra.graph[data]['end'] = this.matrix[newY][newX].distance
                        } else if (position !== 'end'){
                            this.djkstra.graph[data][this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            this.djkstra.graph[this.matrix[newY][newX].data][data] = this.matrix[y][x].distance
                        } else if (position === 'end'){
                            this.djkstra.graph[this.matrix[newY][newX].data]['end'] = this.matrix[y][x].distance
                        }
                        // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]

                        node.north = this.matrix[newY][newX]
                        this.matrix[newY][newX].south = this.matrix[y][x]
                    }
                } else if(i === 3){
                    if(this.matrix[newY][newX] instanceof Node){
                        //dj
                        if(position === 'start'){
                            //we add the adjacent cells to the start of the graph
                            this.djkstra.graph.start[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            //we add them to the processed/visited array
                            this.djkstra.processed.push(this.matrix[newY][newX].data)
                            //we add their parents
                            this.djkstra.parents[this.matrix[newY][newX].data] = 'start'

                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            // this.djkstra.costs[this.matrix[newY][newX].data] = this.matrix[newY][newX].distance + this.djkstra.costs[this.matrix[y][x].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.start){
                            this.djkstra.graph.start[this.matrix[y][x].data] = this.matrix[y][x].distance
                            this.djkstra.processed.push(this.matrix[y][x].data)
                            this.djkstra.parents[this.matrix[y][x].data] = this.matrix[newY][newX].data

                            this.djkstra.costs[data] = this.matrix[y][x].distance
                            // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]
                        } else if (this.matrix[newY][newX] === this.linkedlist.end){
                            this.djkstra.graph[data]['end'] = this.matrix[newY][newX].distance
                        } else if (position !== 'end'){
                            this.djkstra.graph[data][this.matrix[newY][newX].data] = this.matrix[newY][newX].distance
                            this.djkstra.graph[this.matrix[newY][newX].data][data] = this.matrix[y][x].distance
                        } else if (position === 'end'){
                            this.djkstra.graph[this.matrix[newY][newX].data]['end'] = this.matrix[y][x].distance
                        }
                        // this.djkstra.costs[data] = this.matrix[y][x].distance + this.djkstra.costs[this.matrix[newY][newX].data]

                        node.west = this.matrix[newY][newX]
                        this.matrix[newY][newX].east = this.matrix[y][x]
                    }
                }
            }
        }
    }

    //adjust matrix
    adjustMatrix(){
        //2d matrix
        this.matrix = Array.from(Array(this.rows), () => new Array(this.columns).fill(0))
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

        if(!this.start){
            return {
                'status' : 'Please input a start node'
            }
        } else if (!this.end){
            return {
                'status' : 'Please input a end node even though its not necessary for dfs'
            }
        }

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

        if(!this.start){
            return {
                'status' : 'Please input a start node'
            }
        } else if (!this.end){
            return {
                'status' : 'Please input a end node even though its not necessary for bfs'
            }
        }

        visited[`${current[0]}, ${current[1]}`] = true
        this.pathBFS.push(current)
        this.BFS(current, visited)
    }

    //bfs
    BFS(current, visited){
        const queue = [current];

        while (queue.length !== 0) {

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

        if(!this.start){
            return {
                'status' : 'Please input a start node'
            }
        } else if (!this.end){
            return {
                'status' : 'Please input a end node'
            }
        }

        const visited = {}
        visited[`${this.start[0]}, ${this.start[1]}`] = true
        const result = this.LL(this.linkedlist.start, visited)
        if(!result){
            return
        }

        result.reverse()

        return this.pathLL=this.convertPathDataToXY(result)
    }

    LL(current, visited, result =[]){
        if(current === this.linkedlist.end){
            if(!current){
                return false
            }
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


    //djkstra
    startDJKSTRA(){
        //reset path
        this.pathDJ = ['end']

        if(!this.start){
            return {
                'status' : 'Please input a start node'
            }
        } else if (!this.end){
            return {
                'status' : 'Please input a end node'
            }
        } else {
            let node = this.djkstra.lowestCoseNode();
            while (node){
                let cost = this.djkstra.costs[node];
                let children = this.djkstra.graph[node];
                for (let i in children){
                    let newCost = cost + children[i];
                    if (!this.djkstra.costs[i]){
                        this.djkstra.costs[i] = newCost;
                        this.djkstra.parents[i] = parseInt(node);
                    }
                    if (this.djkstra.costs[i] > newCost){
                        this.djkstra.costs[i] =  newCost;
                        this.djkstra.parents[i] = parseInt(node);
                    }
                }
                this.djkstra.processed.push(node);
                node = this.djkstra.lowestCoseNode();
            }

            let parent = this.djkstra.parents.end;
            while (parent){
                this.pathDJ.push(parent);
                parent = this.djkstra.parents[parent];
            }

            const result = this.pathDJ.reverse();
            const results = {
                distance: this.djkstra.costs.end,
                path: this.pathDJ
            }

            this.pathDJ = this.convertPathDataToXY(result)

            this.drawPath('djkstra')

            return results
        }
    }

    convertPathDataToXY(result){
        const convertResultToCoords = []
            for (let i = 0; i < result.length; i++){
                let x = (result[i] - 1)% this.columns
                let y = Math.floor((result[i] - 1)/ this.columns)
                convertResultToCoords.push([x, y])
            }

            return convertResultToCoords
    }

    static loadMap(mapData, canvas, grid = false){

        const {width, height, rows, columns, plotted_tiles} = JSON.parse(mapData)

        const newMap = new Map(width, height, canvas, rows, columns)
        let fill_color;

        newMap.setCanvasDimensions()
        if(grid){
            newMap.drawGrid()
        }
        Object.keys(plotted_tiles).map((key, id)=>{
            let x = plotted_tiles[key].x
            let y = plotted_tiles[key].y

            let start = plotted_tiles[key].start
            let end = plotted_tiles[key].end

            fill_color = plotted_tiles[key].fill_color

            if(start){
                newMap.drawStart(x, y)
            } else if(end){
                newMap.drawEnd(x, y)
            } else {
                newMap.drawTile(x, y, fill_color)
            }
            return id
        })
        return {'new_map' : newMap, 'fill_color':  fill_color}
    }

    static reloadMap(mapData, canvas){
        const {width, height, rows, columns, plotted_tiles} = JSON.parse(mapData)
        //reset map data
        let fill_color;

        canvas._mapData = {
            'width': canvas.width,
            'height' : canvas.height,
            'rows' : canvas.rows,
            'columns' : canvas.columns,
            'plotted_tiles' : {

            }
        }
        canvas.cleanMap()
        canvas._width = width;
        canvas._height = height;
        canvas._row = rows;
        canvas._column = columns;

        Object.keys(plotted_tiles).map((key, id)=>{
            let x = plotted_tiles[key].x
            let y = plotted_tiles[key].y

            let start = plotted_tiles[key].start
            let end = plotted_tiles[key].end

            fill_color = plotted_tiles[key].fill_color

            if(start){
                canvas.drawStart(x, y)
            } else if(end){
                canvas.drawEnd(x, y)
            } else {
                canvas.drawTile(x, y, fill_color)
            }
            return id
        })
        return canvas;
    }

    static rgbtohex(str){
        const rgb = str.split(',')
        const r = parseInt(rgb[0].substring(5,8))
        const g = parseInt(rgb[1])
        const b = parseInt(rgb[2])
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}

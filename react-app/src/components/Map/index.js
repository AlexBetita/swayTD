import React, {useRef, useEffect, useState} from 'react';

import './Map.css';

function addClick(clicky){
    window.addEventListener('click', clicky)
}


class LinkedList {
    constructor(start = null, end= null){
        this.start = start
        this.end = end
    }
}


const Map = () => {

    class Node{
        constructor(data) {
            this.data = data;
            this.north = null;
            this.south = null;
            this.east = null;
            this.west = null;
        }
    }

    const dictionaryMatrix = {

    }

    const nodeMatrix = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const matrix = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const visited = {}
    const llVisited = {}

    const canvas = useRef();
    const startB = useRef();
    const endB = useRef();
    const nodeB = useRef();
    const squareB = useRef();
    const tClick = useRef();

    const [x, setX] = useState('')
    const [y, setY] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [r, setR] = useState('')
    const [g, setG] = useState('')
    const [b, setB] = useState('')
    const [o, setO] = useState('')
    const [squareX, setSquareX] = useState('')
    const [squareY, setSquareY] = useState('')
    const [layerX10, setLayerX] = useState(window.innerWidth / 10)
    const [layerY10, setLayerY] = useState(window.innerHeight / 10)
    const [stateMatrix, setStateMatrix] = useState(matrix)
    const [matrixDictionary, setMatrixDictionary] = useState(dictionaryMatrix)
    const [nodeMatrixState, setNodeMatrixState] = useState(nodeMatrix)
    const [context, setContext] = useState('')
    const [canvasWidth, setCanvasWidth] = useState('')
    const [canvasHeight, setCanvasHeight] = useState('')
    const [linkedList, setLinkedList] = useState(new LinkedList())

    const [start, setStart] = useState([0,0])
    const [end, setEnd] = useState([10,10])
    const [path, setPath] = useState([])
    const [llPath, setLLPath] = useState([])

    useEffect(() =>{
        setContext(canvas.current.getContext('2d'))
        setCanvasWidth(canvas.current.width = window.innerWidth)
        setCanvasHeight(canvas.current.height = window.innerHeight)
    },[])


    const clicky = (e) =>{
        if (e.target.tagName === 'CANVAS'){
            console.log(e)
            console.log(e.target)
            const yC = Math.ceil(e.layerY / (window.innerHeight / 10)) - 1
            const xC = Math.ceil(e.layerX / (window.innerWidth / 10)) - 1
            setX(e.layerX)
            setY(e.layerY)
            setSquareX(xC)
            setSquareY(yC)

            if(startB.current.classList.contains('active')){
                console.log('hmmm')
                drawStart(yC, xC)
                startB.current.classList.remove('active')
            }

            if(endB.current.classList.contains('active')){
                drawEnd(yC, xC)
                endB.current.classList.remove('active')
            }

            if(squareB.current.classList.contains('active')){
                fillSquare(yC, xC)
            }

            if(nodeB.current.classList.contains('active')){
                drawNode(yC, xC)

                let data = (yC * 10) + (xC + 1)
                const node = new Node(data)
                nodeMatrixState[yC][xC] = node

                const directions = {
                    0 : [0,1],
                    1 : [1,0],
                    2 : [-1,0],
                    3 : [0,-1]
                }

                for (let i = 0; i < 4; i++){
                    let x = yC + directions[i][0]
                    let y = xC + directions[i][1]
                    if(x >= 0 && x < nodeMatrixState.length && y >= 0 && y < nodeMatrixState[x].length){

                        if (i === 0){
                            if(nodeMatrixState[x][y] instanceof Node){
                                node.east = nodeMatrixState[x][y]
                                nodeMatrixState[x][y].west = nodeMatrixState[yC][xC]
                                console.log(nodeMatrixState[x][y])
                            }
                        } else if(i === 1){
                            if(nodeMatrixState[x][y] instanceof Node){
                                node.south = nodeMatrixState[x][y]
                                nodeMatrixState[x][y].north = nodeMatrixState[yC][xC]
                                console.log(nodeMatrixState[x][y])
                            }
                        } else if(i === 2){
                            if(nodeMatrixState[x][y] instanceof Node){
                                node.north = nodeMatrixState[x][y]
                                nodeMatrixState[x][y].south = nodeMatrixState[yC][xC]
                                console.log(nodeMatrixState[x][y])
                            }
                        } else {
                            if(nodeMatrixState[x][y] instanceof Node){
                                node.west = nodeMatrixState[x][y]
                                nodeMatrixState[x][y].east = nodeMatrixState[yC][xC]
                                console.log(nodeMatrixState[x][y])
                            }
                        }
                    }
                }

                console.log(nodeMatrixState)
                console.log(node)
            }

        }
    }

    const fillRect = () => {
        context.fillRect(x, y, width, height)
    }

    const beginPath = () => {
        context.beginPath();
    }

    const moveTo = () => {
        context.moveTo(x, y)
    }

    const lineTo = () =>{
        context.lineTo(x, y)
    }

    const stroke = () => {
        context.stroke()
    }

    const fillStyle = () => {
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${o})`;
        // context.fillStyle = `rgba(255, 0, 0 , 0.1)`;
    }

    const strokeStyle = () => {
        context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${o})`;
    }



    const fillSquare = (squareY, squareX) => {
        context.fillStyle = `rgba(0, 0, 0, 0.5)`;
        context.fillRect(squareX * layerX10, squareY * layerY10, layerX10, layerY10)
        stateMatrix[squareY][squareX] = 1
        console.log(stateMatrix)
        console.log(squareX)
        console.log(squareY)
    }

    const drawGrid = () => {
        context.beginPath();
        let gridX = layerX10
        let gridY = window.innerHeight
        for (let  i = 0; i < 10; i++){
            context.moveTo(gridX,0)
            context.lineTo(gridX, gridY)
            context.stroke()
            gridX += layerX10
        }

        gridX = window.innerWidth
        gridY = layerY10
        for (let  i = 0; i < 10; i++){
            context.moveTo(0,gridY)
            context.lineTo(gridX, gridY)
            context.stroke()
            gridY += layerY10
        }
    }

    const showImageData = () => {
        console.log(context.getImageData(x, y, layerX10, layerY10).data[0])
        console.log(context.getImageData(x, y, layerX10, layerY10).data[1])
        console.log(context.getImageData(x, y, layerX10, layerY10).data[2])
        console.log(context.getImageData(x, y, layerX10, layerY10).data[3])
    }

    const checkBoundary = (stateMatrix, neighbors, visited) =>{
        let x = neighbors[0]
        let y = neighbors[1]

        return x >= 0 && x < stateMatrix.length && y >= 0 && y < stateMatrix[x].length && !visited[`${neighbors[0]}, ${neighbors[1]}`] && stateMatrix[x][y] !== 1;
    }

    const dfs = (stateMatrix, current, visited) => {
        console.log(current)
        if(stateMatrix[current[0]][current[1]] === 'end'){
            return true
        }

        const directions = {
            0 : [0,1],
            1 : [1,0],
            2 : [-1,0],
            3 : [0,-1]
        }

        let neighbors;

        for (let i = 0; i < 4; i ++){
            neighbors = [current[0] + directions[i][0], current[1]  + directions[i][1]];
            if (checkBoundary(stateMatrix, neighbors, visited)){
                visited[`${neighbors[0]}, ${neighbors[1]}`] = true
                // path.push(neighbors)
                path.push(neighbors)
                setPath(path)
                if (dfs(stateMatrix, neighbors, visited)){
                    return true
                }
            }
        }
        return false
    }

    const startDfs = () =>{
        let current = start
        console.log('start', start)
        visited[`${current[0]}, ${current[1]}`] = true
        path.push(current)
        setPath(path)
        dfs(stateMatrix, current, visited)
        drawPath(path)
    }

    const drawEnd = (squareY, squareX) => {
        stateMatrix[squareY][squareX] = 'end'

        let data = (squareY * 10) + (squareX + 1)
        const node = new Node(data)
        nodeMatrixState[squareY][squareX] = node
        linkedList.end = node

        console.log(context, 'context')
        context.fillStyle = `rgba(255, 0, 0, 0.50)`;
        context.fillRect(squareX * layerX10, squareY * layerY10, layerX10, layerY10)
    }

    const drawStart = (squareY, squareX) => {
        setStart([squareY, squareX])
        console.log(context, 'context')

        let data = (squareY * 10) + (squareX + 1)
        const node = new Node(data)
        nodeMatrixState[squareY][squareX] = node
        linkedList.start = node

        context.fillStyle = `rgba(0, 255, 0, 0.50)`;
        context.fillRect(squareX * layerX10, squareY * layerY10, layerX10, layerY10)
    }

    const drawNode = (squareY, squareX) =>{
        context.fillStyle = `rgba(0, 0, 255, 0.50)`;
        context.fillRect(squareX * layerX10, squareY * layerY10, layerX10, layerY10)
    }


    const showNodeMatrix = () => {
        console.log(nodeMatrixState)
    }

    const matrixGen = () => {
        let count = 1
        for (let i = 0; i < 10; i++){
            for (let j= 0; j < 10; j++){
                matrixDictionary[count] = [i, j]
                count += 1
            }
        }
        // console.log(matrixDictionary)
    }

    const toggleStart = () => {
        if(startB.current.classList.contains('active')){
            startB.current.classList.remove('active')
        } else{
            startB.current.classList.add('active')
        }
    }

    const toggleEnd = () => {
        if(endB.current.classList.contains('active')){
            endB.current.classList.remove('active')
        } else{
            endB.current.classList.add('active')
        }
    }

    const toggleNode = () => {
        if(nodeB.current.classList.contains('active')){
            nodeB.current.classList.remove('active')
        } else{
            nodeB.current.classList.add('active')
        }
    }

    const toggleFillSquare = () => {
        if(squareB.current.classList.contains('active')){
            squareB.current.classList.remove('active')
        } else{
            squareB.current.classList.add('active')
        }
    }


    const showLinkedList = () =>{
        console.log(linkedList)
        console.log(linkedList.start)
        console.log(linkedList.end)
    }

    const toggleClick = () => {
        addClick(clicky)
        tClick.current.setAttribute('disabled', 'true')
    }

    const traverseLL = () => {
        llVisited[linkedList.start.data] = true
        const res = dfsLL(linkedList.start, llVisited)
        console.log(res.reverse(), 'result')
        drawLinkedListPath(res)
    }

    const dfsLL = (current, llVisited, result = []) =>{
        if(current === linkedList.end){
            return result.push(current.data)
        }

        if(current.north){
            if(!llVisited[current.north.data]){
                llVisited[current.north.data] = true
                llPath.push(current.north.data)
                if (dfsLL(current.north, llVisited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        if(current.east){
            if(!llVisited[current.east.data]){
                llVisited[current.east.data] = true
                llPath.push(current.east.data)
                if (dfsLL(current.east, llVisited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        if(current.west){
            if(!llVisited[current.west.data]){
                llVisited[current.west.data] = true
                llPath.push(current.west.data)
                if (dfsLL(current.west, llVisited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }
        if(current.south){
            if(!llVisited[current.south.data]){
                llVisited[current.south.data] = true
                llPath.push(current.south.data)
                if (dfsLL(current.south, llVisited, result)){
                    result.push(current.data)
                    return [...result]
                }
            }
        }

        return false
    }

    // const dfsLL = (current, llVisited, result = []) =>{
    //     if(current === linkedList.end){
    //         foundEnd = true
    //         return result.push(current.data)
    //     }

    //     if(current.north){
    //         if(!llVisited[current.north.data]){
    //             llVisited[current.north.data] = true
    //             llPath.push(current.north.data)
    //             current.north.south = null
    //             if (dfsLL(current.north, llVisited, result)){
    //                 return [...result, current.data]
    //             }
    //         }
    //     }
    //     if(current.east){
    //         if(!llVisited[current.east.data]){
    //             llVisited[current.east.data] = true
    //             llPath.push(current.east.data)
    //             current.east.west = null
    //             if (dfsLL(current.east, llVisited, result)){
    //                 return [...result, current.data]
    //             }
    //         }
    //     }
    //     if(current.west){
    //         if(!llVisited[current.west.data]){
    //             llVisited[current.west.data] = true
    //             llPath.push(current.west.data)
    //             current.west.east = null
    //             if (dfsLL(current.west, llVisited, result)){
    //                 return [...result, current.data]
    //             }
    //         }
    //     }
    //     if(current.south){
    //         if(!llVisited[current.south.data]){
    //             llVisited[current.south.data] = true
    //             llPath.push(current.south.data)
    //             current.south.north = null
    //             if (dfsLL(current.south, llVisited, result)){
    //                 return [...result, current.data]
    //             }
    //         }
    //     }

    //     return false
    // }

    const showLLPath = () => {
        console.log(llPath)
    }

    const drawPath = (path) => {
        path = path.splice(1, path.length - 2)
        for (let i = 0; i < path.length; i++){
            context.fillStyle = `rgba(194, 246, 248, 1)`;
            context.fillRect(path[i][1] * layerX10, path[i][0] * layerY10, layerX10, layerY10)
        }
    }

    const drawLinkedListPath = (path) =>{
        path = path.splice(1, path.length - 2)
        matrixGen()

        for(let i = 0; i < path.length; i++){

            let grid = matrixDictionary[path[i]]
            context.fillStyle = `rgba(252, 255, 0, 1)`;
            context.fillRect(grid[1] * layerX10, grid[0] * layerY10, layerX10, layerY10)
        }
    }

    return (
    <>
        <button onClick={fillRect}>
            Create Rectangle
        </button>
        <button onClick={beginPath}>
            Begin Path
        </button>
        <button onClick={moveTo}>
            Move To
        </button>
        <button onClick={stroke}>
            Stroke
        </button>
        <button onClick={lineTo}>
            Line to
        </button>
        <button onClick={fillStyle}>
            Fill Style
        </button>
        <button onClick={strokeStyle}>
            Stroke Style
        </button>
        <button onClick={drawGrid}>
            Draw Grid
        </button>
        <button ref={squareB} onClick={toggleFillSquare}>
            Toggle Fill Square
        </button>
        <button onClick={showImageData}>
            Show Image Data
        </button>
        <button onClick={startDfs}>
            DFS
        </button>
        <button onClick={drawEnd}>
            Add End Point
        </button>
        <button onClick={showNodeMatrix}>
            Node Matrix
        </button>
        <button onClick={matrixGen}>
            Genereate Matrix
        </button>
        <button className="start" ref={startB} onClick={toggleStart}>
            Set Start
        </button>
        <button className="end" ref={endB} onClick={toggleEnd}>
            Set End
        </button>
        <button className="activate" ref={nodeB} onClick={toggleNode}>
            Activate Node
        </button>
        <button ref={tClick} onClick={toggleClick}>
            Toggle Click
        </button>
        <button onClick={showLinkedList}>
            Show Linked List
        </button>
        <button onClick={traverseLL}>
            Traverse Link List
        </button>
        <button onClick={showLLPath}>
            Show Linked List Path
        </button>
        <input
            type='text'
            value={x}
            onChange = {(e)=> setX(e.target.value)}
            placeholder='x'
        >
        </input>
        <input
            type='text'
            value={y}
            onChange = {(e)=> setY(e.target.value)}
            placeholder='y'
        >
        </input>
        <input
            type='text'
            value={width}
            onChange = {(e)=> setWidth(e.target.value)}
            placeholder='width'
        >
        </input>
        <input
            type='text'
            value={height}
            onChange = {(e)=> setHeight(e.target.value)}
            placeholder='height'
        >
        </input>

        <input
            type='text'
            value={r}
            onChange = {(e)=> setR(e.target.value)}
            placeholder='r'
        >
        </input>
        <input
            type='text'
            value={g}
            onChange = {(e)=> setG(e.target.value)}
            placeholder='g'
        >
        </input>
        <input
            type='text'
            value={b}
            onChange = {(e)=> setB(e.target.value)}
            placeholder='b'
        >
        </input>
        <input
            type='text'
            value={o}
            onChange = {(e)=> setO(e.target.value)}
            placeholder='o'
        >
        </input>
        <canvas ref={canvas}>

        </canvas>
    </>
    )
}


export default Map;

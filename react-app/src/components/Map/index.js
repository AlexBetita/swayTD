import React, {useRef, useEffect, useState} from 'react';

import Map from './map';

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


const Map_ = () => {

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

    const canvasElement = useRef();
    const startB = useRef();
    const endB = useRef();
    const nodeB = useRef();
    const squareB = useRef();
    const tClick = useRef();

    const [layerX10, setLayerX] = useState(window.innerWidth / 10)
    const [layerY10, setLayerY] = useState(window.innerHeight / 10)
    const [stateMatrix, setStateMatrix] = useState(matrix)
    const [matrixDictionary, setMatrixDictionary] = useState(dictionaryMatrix)
    const [context, setContext] = useState('')
    const [linkedList, setLinkedList] = useState(new LinkedList())

    const [pathBFS, setPathBFS] = useState([])
    const [llPath, setLLPath] = useState([])
    const [canvas, setCanvas] = useState()


    useEffect(() =>{
        setContext(canvasElement.current.getContext('2d'))
        setCanvas(new Map(200, 200, canvasElement, 5, 10))

    },[])


    const clicky = (e) =>{
        if (e.target.tagName === 'CANVAS'){
            console.log(e)
            const yC = Math.ceil(e.layerY / (canvas.height / canvas.row)) - 1
            const xC = Math.ceil(e.layerX / (canvas.width/ canvas.column)) - 1

            if(startB.current.classList.contains('active')){
                canvas.drawStart(xC, yC)
                startB.current.classList.remove('active')
            }

            if(endB.current.classList.contains('active')){
                canvas.drawEnd(xC, yC)
                endB.current.classList.remove('active')
            }

            if(squareB.current.classList.contains('active')){
                canvas.drawTile(xC, yC)
            }

            if(nodeB.current.classList.contains('active')){
                canvas.drawNode(xC, yC)
                canvas.plotNode(xC, yC)
            }

        }
    }


    const drawGrid = () => {
        canvas.setCanvasDimensions()
        canvas.drawGrid()
    }


    const checkBoundary = (stateMatrix, neighbors, visited) =>{
        let x = neighbors[0]
        let y = neighbors[1]

        return x >= 0 && x < stateMatrix.length && y >= 0 && y < stateMatrix[x].length && !visited[`${neighbors[0]}, ${neighbors[1]}`] && stateMatrix[x][y] !== 0;
    }

    const startDfs = () =>{
        canvas.startDFS()
        let type = 'dfs'
        // canvas.drawPath(type)
        canvas.drawPaths()
    }

    const bfs = (stateMatrix, current, visited) => {
        const queue = [current];

        while (queue.length != 0) {

            current = queue[0]

            queue.shift();

            const directions = {
                0 : [0,1],
                1 : [1,0],
                2 : [-1,0],
                3 : [0,-1]
            }

            for (let i = 0; i < 4; i ++ ){

                let neighbors = [current[0] + directions[i][0], current[1]  + directions[i][1]];

                if(checkBoundary(stateMatrix, neighbors, visited)) {
                    visited[`${neighbors[0]}, ${neighbors[1]}`] = true
                    pathBFS.push(neighbors)
                    setPathBFS(pathBFS)
                    queue.push(neighbors)
                }

            }
        }

    }

    const startBfs = () => {
        canvas.startBFS()
        let type = 'bfs'
        canvas.drawPath(type)
    }

    // const matrixGen = () => {
    //     let count = 1
    //     for (let i = 0; i < 10; i++){
    //         for (let j= 0; j < 10; j++){
    //             matrixDictionary[count] = [i, j]
    //             count += 1
    //         }
    //     }
    // }

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
        // llVisited[linkedList.start.data] = true
        // const res = dfsLL(linkedList.start, llVisited)
        // console.log(res.reverse(), 'result')
        // drawLinkedListPath(res)
        canvas.startLL()
        canvas.drawPath('ll')
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

    const showLLPath = () => {
        console.log(llPath)
    }

    const drawLinkedListPath = (path) =>{
        path = path.splice(1, path.length - 2)
        // matrixGen()

        for(let i = 0; i < path.length; i++){

            let grid = matrixDictionary[path[i]]
            context.fillStyle = `rgba(252, 255, 0, 1)`;
            context.fillRect(grid[1] * layerX10, grid[0] * layerY10, layerX10, layerY10)
        }
    }

    return (
    <>
        <button onClick={drawGrid}>
            Draw Grid
        </button>
        <button ref={squareB} onClick={toggleFillSquare}>
            Toggle Fill Square
        </button>
        <button onClick={startDfs}>
            DFS
        </button>
        <button onClick={startBfs}>
            BFS
        </button>
{/*
        <button onClick={matrixGen}>
            Genereate Matrix
        </button> */}

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

        <canvas ref={canvasElement}>

        </canvas>
    </>
    )
}


export default Map_;

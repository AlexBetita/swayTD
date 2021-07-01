import React, {useRef, useEffect, useState} from 'react';

import Map from './map';

import './Map.css';

function addClick(clicky){
    window.addEventListener('click', clicky)
}

function removeClick(clicky){
    window.removeEventListener('click', clicky)
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
            }

        }
    }


    const drawGrid = () => {
        canvas.setCanvasDimensions()
        canvas.drawGrid()
    }

    const startDfs = () =>{
        canvas.startDFS()
        let type = 'dfs'
        // canvas.drawPath(type)
        canvas.drawPaths()
    }

    const startBfs = () => {
        canvas.startBFS()
        let type = 'bfs'
        canvas.drawPath(type)
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
        canvas.startLL()
        canvas.drawPath('ll')
    }

    const showLLPath = () => {
        console.log(llPath)
    }

    const shortestPath = () => {
        console.log(canvas.shortestPath)
    }

    const getMapData = () => {
        console.log(canvas.mapData)
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

        <button onClick={shortestPath}>
            Shortest path
        </button>
        <button onClick={getMapData}>
            Get map data
        </button>
        <canvas ref={canvasElement}>

        </canvas>
    </>
    )
}


export default Map_;

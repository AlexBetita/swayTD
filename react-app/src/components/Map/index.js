import React, {useRef, useEffect, useState} from 'react';

import './Map.css';

const Map = () => {

    const matrix = [
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const visited = {}
    const canvas = useRef();
    const [context, setContext] = useState('')
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
    const [layerX10, setLayerX] = useState('')
    const [layerY10, setLayerY] = useState('')
    const [stateMatrix, setStateMatrix] = useState(matrix)
    const start = [0,0]
    const end = [10,10]
    const path = []

    useEffect(() =>{
        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;

        setContext(canvas.current.getContext('2d'))
        window.addEventListener('click', clicky)
        setLayerX(window.innerWidth / 10)
        setLayerY(window.innerHeight / 10)
    },[])

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

    const clicky = (e) =>{
        if (e.target.tagName === 'CANVAS'){
            console.log(e)
            console.log(e.target)
            setX(e.layerX)
            setY(e.layerY)
            setSquareX(Math.ceil(e.layerX / (window.innerWidth / 10)) - 1)
            setSquareY(Math.ceil(e.layerY / (window.innerHeight / 10)) - 1)
        }
    }

    const fillSquare = () => {
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
                path.push(neighbors)
                if (dfs(stateMatrix, neighbors, visited)){
                    return true
                }
            }
        }
        return false
    }

    const startDfs = () =>{
        let current = start
        visited[`${current[0]}, ${current[1]}`] = true
        path.push(current)
        dfs(stateMatrix, current, visited)
        console.log(path, 'path')
    }

    const addEnd = () => {
        stateMatrix[squareY][squareX] = 'end'
        context.fillStyle = `rgba(255, 0, 0, 0.50)`;
        context.fillRect(squareX * layerX10, squareY * layerY10, layerX10, layerY10)
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
        <button onClick={fillSquare}>
            Fill Square
        </button>
        <button onClick={showImageData}>
            Show Image Data
        </button>
        <button onClick={startDfs}>
            DFS
        </button>
        <button onClick={addEnd}>
            Add End Point
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

/*
    Credits:
    https://www.iconpacks.net/free-icon/coin-dollar-2686.html

*/
import React, {useRef, useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux"

import {addMapData, fetchMapData} from "../../store/map";
import Map from './map';

import coin from '../img/coin.png'
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

    let isPathing = false;

    const dispatch = useDispatch()
    const user = useSelector(state  => state.session.user)

    const canvasElement = useRef();
    const startB = useRef();
    const endB = useRef();
    const nodeB = useRef();
    const squareB = useRef();
    const tClick = useRef();
    const mousDownClick = useRef();
    const clearB = useRef();
    const popUpTile = useRef();

    const [canvas, setCanvas] = useState()
    const [name, setName] = useState('test')
    const [map_data, setMapData] = useState()
    const [errors, setErrors] = useState([]);
    const [load_map, setLoadMap] = useState()
    const [mapId, setMapId] = useState('')
    const [row, setRow] = useState(90)
    const [column, setColumn] = useState(90)
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(800)

    const m = (e) => {
        // setTimeout(()=>{
        //     clickyGo('move', e)
        // }, 0)
        clickyGo('move', e)
    }

    useEffect(() =>{
        let c = new Map(width, height, canvasElement, row, column)
        setCanvas(c)
        c.setCanvasDimensions()
    },[])

    const onSubmit = async (e) =>{
        e.preventDefault();
        const user_id = user.id;
        const data = await dispatch(addMapData({name, map_data, user_id}))
        if(data.errors){
            setErrors(data.errors);
        }
        setMapId(data.id)
    }

    const getMap = async (e) =>{
        e.preventDefault();
        const id = mapId
        console.log(id)
        const data = await dispatch(fetchMapData({id}))
        if(data.errors){
            setErrors(data.errors)
        }
        setLoadMap(data['map_data'])
        setMapId(data.id)
        setName(data.name)
    }

    const clicky = (e) =>{
        if (e.target.tagName === 'CANVAS'){
            const y = Math.ceil(e.offsetY / (canvas.height / canvas.row)) - 1
            const x = Math.ceil(e.offsetX / (canvas.width/ canvas.column)) - 1

            if(startB.current.classList.contains('active')){
                canvas.drawStart(x, y)
                startB.current.classList.remove('active')
            }

            if(endB.current.classList.contains('active')){
                canvas.drawEnd(x, y)
                endB.current.classList.remove('active')
            }

            if(squareB.current.classList.contains('active')){
                canvas.drawTile(x, y)
            }

            if(nodeB.current.classList.contains('active')){
                canvas.drawNode(x, y)
            }

            if(clearB.current.classList.contains('active')){
                canvas.clearTile(x, y)
            }
        }
    }


    const clickyGo = (trigger, e) =>{
        if(trigger === 'down'){
            isPathing = true
            canvasElement.current.addEventListener('mousemove', (e)=> m(e))
        }

        if(trigger === 'up' || trigger === 'out'){
            isPathing = false
            canvasElement.current.removeEventListener('mousemove', (e)=> m(e))
        }

        if (e.target.tagName === 'CANVAS' && isPathing && trigger === 'move'){
            const y = Math.ceil(e.offsetY / (canvas.height / canvas.row)) - 1
            const x = Math.ceil(e.offsetX / (canvas.width/ canvas.column)) - 1

            if(startB.current.classList.contains('active')){
                canvas.drawStart(x, y)
                startB.current.classList.remove('active')
            }

            if(endB.current.classList.contains('active')){
                canvas.drawEnd(x, y)
                endB.current.classList.remove('active')
            }

            if(squareB.current.classList.contains('active')){
                canvas.drawTile(x, y)
            }

            if(nodeB.current.classList.contains('active')){
                canvas.drawNode(x, y)
            }

            if(clearB.current.classList.contains('active')){
                canvas.clearTile(x, y)
            }

        }
    }

    const drawGrid = () => {
        canvas.cleanMap()
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

    const clearTile = () => {
        if(clearB.current.classList.contains('active')){
            clearB.current.classList.remove('active')
        } else{
            clearB.current.classList.add('active')
        }
    }


    const showLinkedList = () =>{
    }

    const toggleClick = () => {
        if(tClick.current.classList.contains('active')){
            removeClick(clicky)
            tClick.current.classList.remove('active')
        } else{
            addClick(clicky)
            tClick.current.classList.add('active')
        }
    }

    const traverseLL = () => {
        canvas.startLL()
        canvas.drawPath('ll')
    }

    const showLLPath = () => {
    }

    const shortestPath = () => {
        console.log(canvas.shortestPath)
    }

    const generateMapData = () => {
        console.log(canvas.mapData)
        setMapData(canvas.mapData)
    }

    function addMouseDown(clickyGo){

        canvasElement.current.addEventListener('mousedown', (e) =>{
            clickyGo('down', e)
        })

        canvasElement.current.addEventListener('mouseup', (e)=>{
            clickyGo('up', e)
        })

        canvasElement.current.addEventListener('mouseout', (e)=>{
            clickyGo('out', e)
        })
    }

    const toggleMouseDown = () => {
        if(mousDownClick.current.classList.contains('active')){

            canvasElement.current.removeEventListener('mousemove', (e)=> m(e))
            isPathing = false

            mousDownClick.current.classList.remove('active')
        } else{
            addMouseDown(clickyGo)
            mousDownClick.current.classList.add('active')
        }
    }

    const loadMap = () =>{
        setCanvas(Map.loadMap(load_map, canvasElement))
    }

    const cleanMap = () =>{
        canvas.cleanMap()
    }

    const removeGrid = () =>{
        canvas.removeGrid()
    }

    const canvasWidthChange = (e) =>{
        e = parseInt(e.target.value)

        if(!isNaN(e)){
            if(e > 1000 || e  < 50){
                return
            }
            setWidth(e)
            canvas._width = e
            canvas.setCanvasDimensions()
        }
    }

    const canvasHeightChange = (e) =>{
        e = parseInt(e.target.value)
        if(!isNaN(e)){
            if(e > 1000 || e  < 50){
                return
            }
            setHeight(e)
            canvas._height = e
            canvas.setCanvasDimensions()
        }
    }

    const canvasRowChange = (e) =>{

        e = parseInt(e.target.value)
        if(!isNaN(e)){
            if(e> 80 || e < 5){
                return
            }
            setRow(e)
            canvas._row= e
            canvas.adjustMatrix()
        }
    }

    const canvasColumnChange = (e) =>{
        e = parseInt(e.target.value)

        if(!isNaN(e)){
            if(e > 80 || e < 5){
                return
            }
            setColumn(e)
            canvas._column= e
            canvas.adjustMatrix()
        }
    }

    return (
    <>
        <div className='map__editor__body'>
            {height < 900 &&
                <div className='map__dimensions__text__900'>
                    <label>
                        Map Dimensions
                    </label>
                    <label>
                        {width} x {height}
                    </label>
                    <label>
                        {row} x {column}
                    </label>
                </div>
            }
            {height > 900 &&
                <div className='map__dimensions__text__1000'>
                    <label>
                    Map Dimensions
                    </label>
                        <label>
                            {width} x {height}
                        </label>
                        <label>
                            {row} x {column}
                    </label>
                </div>
            }
            <canvas ref={canvasElement}>

            </canvas>

            <div className='map__name'>
                Map Name:
                <input
                    maxLength = "9"
                    className='input__map__name'
                    type='text'
                    name='name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                >

                </input>
            </div>
            <div className='map__ui'>
                <div className=''>
                    <img
                        className='profile__icon'
                        src={user.profileImage}
                        alt='profileImage'>
                    </img>
                </div>
                <div className='profile__details'>
                    <div>
                        <label className='map__username'>
                            {user.username}
                        </label>
                        <label className='star'>☆</label>
                    </div>
                    <div>
                        <img className='coin' src={coin} alt='coin'></img>
                        <label className='currency'>
                            {user.currency}
                        </label>
                    </div>
                </div>
                <div className='dimension__names'>
                    <label>
                        Row
                    </label>
                    <label>
                        Column
                    </label>
                    <label>
                        Width
                    </label>
                    <label>
                        Height
                    </label>
                </div>
                <div className='dimensions'>
                    <label>
                    </label>
                    <input maxLength = "2"
                        type='number'
                        placeholder='row'
                        value={row}
                        onChange={(e)=>
                            canvasRowChange(e)
                        }
                    >

                    </input>
                    <input maxLength = "2"
                        placeholder='column'
                        type='number'
                        value={column}
                        onChange={(e)=>
                            canvasColumnChange(e)
                        }
                    >
                    </input>
                    <label>
                    </label>
                    <input maxLength='4'
                        placeholder='width'
                        type='number'
                        value={width}
                        onChange={(e)=>
                            canvasWidthChange(e)
                        }
                    >

                    </input>
                    <input maxLength='4'
                        placeholder='height'
                        type='number'
                        value={height}
                        onChange={(e)=>
                            canvasHeightChange(e)
                        }
                    >

                    </input>
                </div>

                <div>
                    <button onClick={drawGrid}>
                        Draw Grid
                    </button>

                    <button onClick={removeGrid}>
                        Remove Grid
                    </button>
                </div>

                <div>
                    <button onClick={clearTile} ref={clearB}>
                        Clear Tile
                    </button>

                    <button onClick={cleanMap}>
                        Clean Map
                    </button>
                </div>

                <button ref={squareB} onClick={toggleFillSquare}>
                    Toggle Fill Square
                </button>

                <div>
                    <button onClick={startDfs}>
                        DFS
                    </button>
                    <button onClick={startBfs}>
                        BFS
                    </button>
                </div>


                <div>
                    <button className="start" ref={startB} onClick={toggleStart}>
                        Set Start
                    </button>
                    <button className="end" ref={endB} onClick={toggleEnd}>
                        Set End
                    </button>
                </div>
                <button className="activate" ref={nodeB} onClick={toggleNode}>
                    Activate Node
                </button>

                <div>
                    <button ref={tClick} onClick={toggleClick}>
                        Single Click
                    </button>
                    <button ref={mousDownClick} onClick={toggleMouseDown}>
                        Hold Click
                    </button>
                </div>

                <div>
                    <button onClick={showLinkedList}>
                        Show LL
                    </button>
                    <button onClick={traverseLL}>
                        Travel LL
                    </button>
                </div>

                <button onClick={showLLPath}>
                    LL Path
                </button>

                <div>
                    <button onClick={generateMapData}>
                        Generate Map Data
                    </button>
                    <button onClick={getMap}>
                        Get Map Data
                    </button>
                </div>

                <div>
                    <button onClick={onSubmit}>
                        Save Map Data
                    </button>
                    <button onClick={loadMap}>
                        Load Map Data
                    </button>
                </div>

                <input
                    className='map__id'
                    value={mapId}
                    name='mapId'
                    placeholder='map id'
                    onChange={(e)=>setMapId(e.target.value)}
                >

                </input>

            </div>
            {/* <div ref={popUpTile}>
                <div>

                </div>
                <div>

                </div>
                <div>

                </div>
            </div> */}
        </div>
    </>
    )
}


export default Map_;

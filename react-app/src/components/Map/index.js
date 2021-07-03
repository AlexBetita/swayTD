/*
    Credits:
    https://www.iconpacks.net/free-icon/coin-dollar-2686.html

*/
import React, {useRef, useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from 'react-router-dom';

import {addMapData, fetchMapData, editMapData, deleteMapData} from "../../store/map";
import Map from './map';

import coin from '../img/coin.png'
import './Map.css';

function addClick(clicky){
    window.addEventListener('click', clicky)
}

function removeClick(clicky){
    window.removeEventListener('click', clicky)
}

//moved color here to become big boy color
let color = ''

const Map_ = () => {

    let isPathing = false;
    let { id } = useParams()

    const history = useHistory()
    const dispatch = useDispatch()

    const user = useSelector(state => state.session.user)
    const currentMap = useSelector(state=> {
        if(id){
            if(state.session.maps[id]){
                return {'owner' : true,
                        ...state.session.maps[id]
                        }
            } else if(state.map[id]) {
                return {'owner' : false,
                        ...state.map[id]
                       }
            } else {
                history.push('/maps/create')
            }
        }
        return false
    })

    const canvasElement = useRef();
    const startB = useRef();
    const endB = useRef();
    const nodeB = useRef();
    const squareB = useRef();
    const mousDownClick = useRef();
    const clearB = useRef();
    const deleteB = useRef();
    const popUpTile = useRef();

    const [canvas, setCanvas] = useState()
    const [name, setName] = useState('')
    const [map_data, setMapData] = useState()
    const [errors, setErrors] = useState([]);
    const [load_map, setLoadMap] = useState()
    const [mapId, setMapId] = useState('')
    const [row, setRow] = useState(50)
    const [column, setColumn] = useState(50)
    const [width, setWidth] = useState(700)
    const [height, setHeight] = useState(700)
    const [stateColor, setStateColor] = useState(color)

    const m = (e) => {
        // setTimeout(()=>{
        //     clickyGo('move', e)
        // }, 0)
        clickyGo('move', e)
    }

    useEffect(() =>{
        if(currentMap){
            let c = Map.loadMap(JSON.parse(currentMap.map_data), canvasElement)
            setCanvas(c)
            setName(currentMap['name'])
            setRow(currentMap['rows'])
            setColumn(currentMap['columns'])
            setWidth(currentMap['width'])
            setHeight(currentMap['height'])
            setMapId(currentMap['id'])
        } else {
            let c = new Map(width, height, canvasElement, row, column)
            setCanvas(c)
            c.setCanvasDimensions()
        }

    },[])

    const onSubmit = async (e) =>{
        e.preventDefault();
        let newErrors = []
        setErrors([])

        if(name.length <= 2){
            newErrors.push('name is too short, minimum 3')
        }

        const user_id = user.id;
        let map_data = canvas.mapData
        
        const data = await dispatch(addMapData({name, map_data, user_id}))

        if(data.errors){
            setErrors(data.errors);
        } else if (newErrors.length) {
            setErrors(newErrors)
        } else {
            history.push(`/maps/create/${data.id}`)
        }
        map_data = null
    }

    const loadMap = async (e) =>{
        e.preventDefault();
        let newErrors = []
        setErrors([])

        const id = mapId
        if(!mapId){
            newErrors.push(['Please provide an id'])
            setErrors(newErrors)
            return
        }
        const data = await dispatch(fetchMapData({id}))
        if(data.errors){
            setErrors(data.errors)
        }
        if(!data){
            newErrors.push('Map Does not exist')
            setErrors(newErrors)
        } else {
            setLoadMap(data['map_data'])
            setCanvas(Map.loadMap(data['map_data'], canvasElement))
            setMapId(data.id)
            setName(data.name)
        }
    }

    const editMap = async (e) =>{
        e.preventDefault();
        setMapData(canvas.mapData)
        const user_id = user.id;
        let map_data = canvas.mapData
        const data = await dispatch(editMapData({name, map_data, user_id, id}))
        map_data = null
        if(data.errors){
            setErrors(data.errors);
        }
        alert("Succesfully Edited");
    }

    const deleteMap = async (e) =>{
        e.preventDefault();
        const data = await dispatch(deleteMapData({id}))
        if(data.errors){
            setErrors(data.errors);
        }
        history.push('/maps/create')
    }

    const clicky = (e) =>{
        if(!color){
            color = stateColor
        }
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
                canvas.drawTile(x, y, color)
            }

            if(nodeB.current.classList.contains('active')){
                canvas.drawNode(x, y, color)
            }

            if(clearB.current.classList.contains('active')){
                canvas.clearTile(x, y)
            }
        }
    }

    const clickyGo = (trigger, e) =>{
        if(!color){
            color = stateColor
        }
        if(!mousDownClick.current.classList.contains('active')){
            return
        }
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
                canvas.drawTile(x, y, color)
            }

            if(nodeB.current.classList.contains('active')){
                canvas.drawNode(x, y, color)
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

    const traverseLL = () => {
        canvas.startLL()
        canvas.drawPath('ll')
    }

    const showLLPath = () => {
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
            removeClick(clicky)
            mousDownClick.current.classList.remove('active')
        } else{
            addMouseDown(clickyGo)
            addClick(clicky)
            mousDownClick.current.classList.add('active')
        }
    }

    const cleanMap = () =>{
        canvas.cleanMap()
    }

    const removeGrid = () =>{
        canvas.removeGrid()
    }

    const canvasWidthChange = (e) =>{
        canvas.cleanMap()
        e = parseInt(e.target.value)

        if(!isNaN(e)){
            // if(e > 800 || e  < 50){
            //     return
            // }
            setWidth(e)
            canvas._width = e
            canvas.setCanvasDimensions()
        }
    }

    const canvasHeightChange = (e) =>{
        canvas.cleanMap()
        e = parseInt(e.target.value)
        if(!isNaN(e)){
            // if(e > 800 || e  < 50){
            //     return
            // }
            setHeight(e)
            canvas._height = e
            canvas.setCanvasDimensions()
        }
    }

    const canvasRowChange = (e) =>{
        canvas.cleanMap()

        e = parseInt(e.target.value)
        if(!isNaN(e)){
            if(e > 100 || e < 5){
                return
            }
            setRow(e)
            canvas._row= e
            canvas.adjustMatrix()
        }
    }

    const canvasColumnChange = (e) =>{
        e = parseInt(e.target.value)
        canvas.cleanMap()
        if(!isNaN(e)){
            if(e > 100 || e < 5){
                return
            }
            setColumn(e)
            canvas._column= e
            canvas.adjustMatrix()
        }
    }

    const showColor = (e) => {
        color = e.target.value
        setStateColor(color)
    }

    return (
    <>

            <div className='map__editor__body'>
                {height <= 800  &&
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
                {height >= 801 &&
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

                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="error">{error}</li>
                    ))}
                </ul>

                <canvas ref={canvasElement}>

                </canvas>

            {!id  &&
                <>
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
                            <input maxLength = "3"
                                type='number'
                                placeholder='row'
                                value={row}
                                onChange={(e)=>
                                    canvasRowChange(e)
                                }
                            >

                            </input>
                            <input maxLength = "3"
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
                            <input maxLength='3'
                                placeholder='width'
                                type='number'
                                value={width}
                                onChange={(e)=>
                                    canvasWidthChange(e)
                                }
                            >

                            </input>
                            <input maxLength='3'
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
                        <div>
                            <input
                                className='color__picker'
                                type='color'
                                onChange={(e)=>showColor(e)}
                                >
                            </input>
                            {/* style={{ backgroundColor : color }} */}
                            <button ref={squareB} onClick={toggleFillSquare}>
                                Toggle Fill Square
                            </button>
                        </div>
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
                            <button ref={mousDownClick} onClick={toggleMouseDown}>
                                Turn on click
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
                    </>
                }

                {id && currentMap['owner'] &&
                    <>
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
                            <input maxLength = "3"
                                type='number'
                                placeholder='row'
                                value={row}
                                onChange={(e)=>
                                    canvasRowChange(e)
                                }
                            >

                            </input>
                            <input maxLength = "3"
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
                            <input maxLength='3'
                                placeholder='width'
                                type='number'
                                value={width}
                                onChange={(e)=>
                                    canvasWidthChange(e)
                                }
                            >

                            </input>
                            <input maxLength='3'
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

                        <div>
                            <input
                                className='color__picker'
                                type='color'
                                onChange={(e)=>showColor(e)}
                                >
                            </input>
                            <button
                                ref={squareB} onClick={toggleFillSquare}>
                                Toggle Fill Square
                            </button>
                        </div>

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
                            <button ref={mousDownClick} onClick={toggleMouseDown}>
                                Turn on click
                            </button>
                        </div>

                        <div>
                            <button onClick={traverseLL}>
                                Travel LL
                            </button>
                        </div>

                        <div>
                            <button
                            className='delete__button'
                            ref={deleteB} onClick={deleteMap} >
                                Delete Map
                            </button>
                        </div>

                        <div>
                            <button onClick={editMap}>
                                Edit Map Data
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
                    </>
                }
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

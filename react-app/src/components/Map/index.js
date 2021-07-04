/*
    Credits:
    https://www.iconpacks.net/free-icon/coin-dollar-2686.html
    https://iconmonstr.com/license/
*/

import React, {useRef, useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory, NavLink } from 'react-router-dom';

import {addMapData, fetchMapData, editMapData, deleteMapData} from "../../store/map";
import Map from './map';

import coin from '../img/coin.png';
import arrow from '../img/arrow.png';
import start from '../img/start.png';
import stop from '../img/stop.png';
import pencil from '../img/pencil.png';
import eraser from '../img/eraser.png';
import grid from '../img/grid.png';
import path from '../img/path.png';
import save from '../img/save.png';
import fill from '../img/fill.png';
import square from '../img/square.png';
import edit from '../img/edit.png';
import delete_icon from '../img/delete_red.png';
import load from '../img/load.png';
import search from '../img/search.png';
import grid_red from '../img/grid_red.png'

import './Map.css';


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


    if(!user){
        history.push('/login')
    }

    const canvasElement = useRef();
    const startB = useRef();
    const endB = useRef();
    const squareB = useRef();
    const mousDownClick = useRef();
    const clearB = useRef();
    const pathPopUp = useRef();
    const pathPopUpB = useRef();
    const mapIdDiv = useRef();
    const mapEditorBody = useRef();

    if(id && !currentMap['owner']){
        //not a good fix
        /*
            im catching this because im rendering the element to be hidden if
            a player is looking at a map the player doesn't own making it
            impossible for them to edit
        */
        try{
            mapEditorBody.current.classList.add('invi')
        } catch {
            //
        }
    }

    const searchPopUp = useRef();
    const searchPopUpB = useRef();

    const [canvas, setCanvas] = useState()
    const [name, setName] = useState('')
    const [errors, setErrors] = useState([]);
    const [mapId, setMapId] = useState(()=>{
        if(id){
            return id
        } else {
            return ''
        }
    })
    const [row, setRow] = useState(50)
    const [column, setColumn] = useState(50)
    const [width, setWidth] = useState(700)
    const [height, setHeight] = useState(700)
    const [stateColor, setStateColor] = useState(color)
    const [searchValue, setSearchValue] = useState('')

    const m = (e) => {
        // setTimeout(()=>{
        //     clickyGo('move', e)
        // }, 0)
        clickyGo('move', e)
    }

    useEffect(() =>{
        if(currentMap){
            let c = Map.loadMap(currentMap.map_data, canvasElement)
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
        document.addEventListener('mousedown', handlePathPopUpClick)
        document.addEventListener('mousedown', handleLoadPopUpClick)
        return ()=> {
            canvasElement.current = false
            startB.current = false
            endB.current = false
            squareB.current = false
            mousDownClick.current = false
            clearB.current = false
            pathPopUp.current = false
            pathPopUpB.current = false
            mapEditorBody.current = false
            mapIdDiv.current = false
            document.removeEventListener("mousedown", handlePathPopUpClick);
            document.removeEventListener("mousedown", handleLoadPopUpClick);
        };
    },[dispatch])

    const onSubmit = async (e) =>{
        e.preventDefault();
        let newErrors = []
        setErrors([])

        if(name.length < 2 || !name){
            newErrors.push('name is too short, minimum 3')
        }

        const user_id = user.id;
        let map_data = canvas.mapData
        let map_image = canvas.getDataUrl()

        setErrors(newErrors)

        if(!newErrors.length){
            const data = await dispatch(addMapData({name, map_data, user_id, map_image}))

            if(data.errors){
                setErrors(data.errors);
            } else if (newErrors.length) {
                setErrors(newErrors)
            } else {
                alert('Successfully Saved')
                setTimeout(()=>{
                    history.push(`/maps/create/${data.id}`)
                }, 0)
            }
        }
        map_data = null
    }

    //clickers
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

        if (e.target.tagName === 'CANVAS' && isPathing && (trigger === 'move' || trigger === 'down')){
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

            if(clearB.current.classList.contains('active')){
                canvas.clearTile(x, y)
            }

        }
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

    const loadMap = async (e) =>{
        e.preventDefault();
        let newErrors = []
        setErrors([])

        const value = searchValue
        if(!searchValue){
            newErrors.push(['Please provide an value'])
            setErrors(newErrors)
            return
        }
        const data = await dispatch(fetchMapData({value}))

        if(data.errors){
            setErrors(data.errors)
        } else if (!data){
            newErrors.push('Map Does not exist')
            setErrors(newErrors)
        } else {
            setCanvas(Map.loadMap(data['map_data'], canvasElement))
            setMapId(data.id)
            setName(data.name)
            setTimeout(()=>{
                history.push(`/maps/create/${data.id}`)
            }, 0)
        }
    }

    const editMap = async (e) =>{
        e.preventDefault();
        setErrors([])
        const user_id = user.id;

        let map_data = canvas.mapData
        let map_image = canvas.getDataUrl()

        const data = await dispatch(editMapData({name, map_data, user_id, id, map_image}))
        map_data = null
        if(data.errors){
            setErrors(data.errors);
        } else{
            alert("Succesfully Edited");
        }
    }

    const deleteMap = async (e) =>{
        e.preventDefault();
        setErrors([])
        const data = await dispatch(deleteMapData({id}))
        if(data.errors){
            setErrors(data.errors);
        } else{
            setName('')
            setRow(50)
            setColumn(50)
            setWidth(700)
            setHeight(700)
            alert('Succesfully deleted')
            history.push('/maps/create')
        }
    }


    const drawGrid = () => {
        canvas.cleanMap()
        canvas.drawGrid()
    }

    const startDfs = () =>{
        canvas.startDFS()
        // let type = 'dfs'
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
            endB.current.classList.remove('active')
        }
    }

    const toggleEnd = () => {
        if(endB.current.classList.contains('active')){
            endB.current.classList.remove('active')
        } else{
            endB.current.classList.add('active')
            startB.current.classList.remove('active')
        }
    }

    const toggleFillSquare = () => {
        if(squareB.current.classList.contains('active')){
            squareB.current.classList.remove('active')
        } else{
            squareB.current.classList.add('active')
            clearB.current.classList.remove('active')
        }
    }

    const togglePopUpPath = (e) =>{
        if(pathPopUpB.current.classList.contains('active')){
            pathPopUpB.current.classList.remove('active')
            pathPopUp.current.classList.add('hidden')
        } else{
            pathPopUpB.current.classList.add('active')
            pathPopUp.current.classList.remove('hidden')
        }
    }


    const togglePopUpSearch = (e) =>{
        if(searchPopUpB.current.classList.contains('active')){
            searchPopUpB.current.classList.remove('active')
            searchPopUp.current.classList.add('hidden')
        } else{
            searchPopUpB.current.classList.add('active')
            searchPopUp.current.classList.remove('hidden')
        }
    }

    const handlePathPopUpClick = (e) =>{
        if(pathPopUp.current.contains(e.target)){
            return
        }

        pathPopUp.current.classList.add('hidden')
        pathPopUpB.current.classList.remove('active')
    }

    const handleLoadPopUpClick = (e) =>{
        if(searchPopUp.current.contains(e.target)){
            return
        }
        searchPopUp.current.classList.add('hidden')
        searchPopUpB.current.classList.remove('active')
    }

    const toggleClearTile = () => {
        if(clearB.current.classList.contains('active')){
            clearB.current.classList.remove('active')
        } else{
            clearB.current.classList.add('active')
            squareB.current.classList.remove('active')
        }
    }

    const traverseLL = () => {
        canvas.startLL()
        canvas.drawPath('ll')
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
            if(e > 800 || e  < 50){
                return
            }
            setWidth(e)
            canvas._width = e
            canvas.setCanvasDimensions()
        }
    }

    const canvasHeightChange = (e) =>{
        canvas.cleanMap()
        e = parseInt(e.target.value)
        if(!isNaN(e)){
            if(e > 800 || e  < 50){
                return
            }
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
                    <NavLink
                        className='arrowMap'
                        to='/maps'>
                    <img src={arrow} alt='arrow'>
                    </img>
                    </NavLink>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="error_map">{error}</li>
                    ))}
                </ul>

                <canvas ref={canvasElement}>

                </canvas>

            {
                id && !currentMap['owner'] &&
                <>
                    <div className='map__name'>
                            Map Name:
                            <input
                                className='input__map__name'
                                type='text'
                                name='name'
                                value={name}
                                disabled
                                onChange={(e)=>setName(e.target.value)}
                            >

                            </input>

                    </div>

                    <div className='not__user'>

                        <div className='not__user__pop__up' ref={pathPopUp}>
                            <button onClick={startDfs}>
                                DFS
                            </button>
                            <button onClick={startBfs}>
                                BFS
                            </button>
                            <button onClick={traverseLL}>
                                Shortest Path
                            </button>
                        </div>

                    </div>
                </>
            }

            <div className='hide'ref={mapEditorBody}>

            {!id  &&
                <>
                    <div className='map__name'>
                        Map Name:
                        <input
                            maxLength = "50"
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
                            <div className='map__icon__container' ref={mousDownClick}>
                                <img className='map__icon' src={pencil} alt='pencil' onClick={toggleMouseDown}/>
                            </div>
                        </div>

                        <div>
                            <div className='map__icon__container'>
                                <img className='map__icon' src={grid} alt='grid' onClick={drawGrid}/>
                            </div>

                            <div className='map__icon__container'>
                                <img className='map__icon'
                                    src={grid_red} alt='grid' onClick={removeGrid}
                                    // style={{
                                    //     /*  credits
                                    //         https://www.domysee.com/blogposts/coloring-white-images-css-filter
                                    //     */
                                    //     // 'filter': `opacity(0.6) drop-shadow(0 0 0 rgb(255, 0, 0)`
                                    //     'filter' : 'brightness(0.5) sepia(1) saturate(1000000%)'
                                    // }}
                                    />
                            </div>
                        </div>

                        <div>

                            <div className='map__icon__container' ref={clearB}>
                                <img className='map__icon' src={eraser} alt='eraser' onClick={toggleClearTile}/>
                            </div>

                            <div className='map__icon__container'>
                                <img className='map__icon' src={square} alt='square' onClick={cleanMap}/>
                            </div>

                        </div>
                        <div>
                            <input
                                className='color__picker'
                                type='color'
                                onChange={(e)=>showColor(e)}
                                >
                            </input>
                            <div className='map__icon__container' ref={squareB} >
                                <img
                                    className='map__icon' src={fill} alt='fill'
                                    onClick={toggleFillSquare}
                                    // style={{
                                    //     'filter': `opacity(0.5) drop-shadow(0 0 0 ${color}})`
                                    // }}
                                    />
                            </div>

                        </div>

                        <div>

                            <div className='map__icon__container' ref={pathPopUpB}>
                                <img className='map__icon' src={path} alt='path' onClick={togglePopUpPath}/>
                            </div>

                            <div className='popup__path hidden' ref={pathPopUp}>
                                <button onClick={startDfs}>
                                    DFS
                                </button>
                                <button onClick={startBfs}>
                                    BFS
                                </button>
                                <button onClick={traverseLL}>
                                    Shortest Path
                                </button>
                            </div>

                        </div>

                        <div>
                            <div className='map__icon__container' ref={startB}>
                                <img className='map__icon' src={start} alt='start' onClick={toggleStart}/>
                            </div>

                            <div className='map__icon__container' ref={endB}>
                                <img className='map__icon' src={stop} alt='stop' onClick={toggleEnd}/>
                            </div>
                        </div>


                        <div>
                            {/* <button onClick={onSubmit}>
                                Save Map Data
                            </button> */}

                            <div className='map__icon__container'>
                                <img className='map__icon' src={save} alt='save' onClick={onSubmit}/>
                            </div>

                            {/* <button onClick={loadMap}>
                                Load Map Data
                            </button> */}
                        </div>

                        <div>
                            <div className='map__icon__container' ref={searchPopUpB}>
                                <img className='map__icon' src={search} alt='search' onClick={togglePopUpSearch}/>
                            </div>
                            <div className='popup__search hidden' ref={searchPopUp}>
                                <input
                                    className='search__bar'
                                    value={searchValue}
                                    name='searchBar'
                                    placeholder='search'
                                    onChange={(e)=>setSearchValue(e.target.value)}
                                >
                                </input>
                                <div className='map__icon__container'>
                                    <img className='map__icon' src={load} alt='load' onClick={loadMap}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                }

                {id &&
                    <>
                        <div className='map__name'>
                        Map Name:
                            <input
                                maxLength = "50"
                                className='input__map__name'
                                type='text'
                                name='name'
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            >

                            </input>
                        </div>

                        <div className='map__id__div'>
                            Map Id:
                            <input
                                className='map__id'
                                value={mapId}
                                name='mapId'
                                ref={mapIdDiv}
                                disabled
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
                            <div className='map__icon__container' ref={mousDownClick}>
                                <img className='map__icon' src={pencil} alt='pencil' onClick={toggleMouseDown}/>
                            </div>
                        </div>

                        <div>
                            <div className='map__icon__container'>
                                <img className='map__icon' src={grid} alt='grid' onClick={drawGrid}/>
                            </div>

                            <div className='map__icon__container'>
                                <img className='map__icon'
                                    src={grid_red} alt='grid' onClick={removeGrid}
                                    // style={{
                                    //     /*  credits
                                    //         https://www.domysee.com/blogposts/coloring-white-images-css-filter
                                    //     */
                                    //     // 'filter': `opacity(0.6) drop-shadow(0 0 0 rgb(255, 0, 0)`
                                    //     'filter' : 'brightness(0.5) sepia(1) saturate(1000000%)'
                                    // }}
                                    />
                            </div>
                        </div>

                        <div>
                            <div className='map__icon__container' ref={clearB}>
                                <img className='map__icon' src={eraser} alt='eraser' onClick={toggleClearTile}/>
                            </div>

                            <div className='map__icon__container'>
                                <img className='map__icon' src={square} alt='square' onClick={cleanMap}/>
                            </div>
                        </div>

                        <div>
                            <input
                                className='color__picker'
                                type='color'
                                onChange={(e)=>showColor(e)}
                                >
                            </input>
                            <div className='map__icon__container' ref={squareB} >
                                <img className='map__icon' src={fill} alt='fill' onClick={toggleFillSquare}/>
                            </div>
                        </div>

                        <div>
                            <div className='map__icon__container' ref={pathPopUpB}>
                                <img className='map__icon' src={path} alt='path' onClick={togglePopUpPath}/>
                            </div>

                            <div className='popup__path hidden' ref={pathPopUp}>
                                <button onClick={startDfs}>
                                    DFS
                                </button>
                                <button onClick={startBfs}>
                                    BFS
                                </button>
                                <button onClick={traverseLL}>
                                    Shortest Path
                                </button>
                            </div>

                        </div>


                        <div>
                            <div className='map__icon__container' ref={startB}>
                                <img className='map__icon' src={start} alt='start' onClick={toggleStart}/>
                            </div>

                            <div className='map__icon__container' ref={endB}>
                                <img className='map__icon' src={stop} alt='stop' onClick={toggleEnd}/>
                            </div>
                        </div>

                        <div>
                            {/* <button onClick={editMap}>
                                Edit Map Data
                            </button>
                            <button onClick={loadMap}>
                                Load Map Data
                            </button> */}

                            <div className='map__icon__container'>
                                <img className='map__icon' src={edit} alt='edit' onClick={editMap}/>
                            </div>

                        </div>

                        <div>
                            {/* <button
                            className='delete__button'
                            ref={deleteB} onClick={deleteMap} >
                                Delete Map
                            </button> */}
                            <div className='map__icon__container'>
                                <img className='map__icon' src={delete_icon} alt='delete_icon' onClick={deleteMap}/>
                            </div>
                        </div>

                            <div>
                                <div className='map__icon__container' ref={searchPopUpB}>
                                    <img className='map__icon' src={search} alt='search' onClick={togglePopUpSearch}/>
                                </div>
                                <div className='popup__search hidden' ref={searchPopUp}>
                                    <input
                                        className='search__bar'
                                        value={searchValue}
                                        name='searchBar'
                                        placeholder='search'
                                        onChange={(e)=>setSearchValue(e.target.value)}
                                    >
                                    </input>
                                    <div className='map__icon__container'>
                                        <img className='map__icon' src={load} alt='load' onClick={loadMap}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                }
                </div>
            </div>
    </>
    )
}


export default Map_;

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
import grid_red from '../img/grid_red.png';
import undo from '../img/undo.png';

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
                setTimeout(()=>{
                    history.push('/maps/create')
                },0)
            }
        }
        return false
    })


    if(!user){
        history.push('/login')
    }

    const balls = useRef();
    const searchInput = useRef();
    const searchImage = useRef();
    const mapNameInput = useRef();

    const saveB = useRef();
    const editB = useRef();
    const deleteB = useRef();

    const dfsB = useRef();
    const llB = useRef();
    const bfsB = useRef();
    const undoDFSB = useRef();
    const undoBFSB = useRef();
    const undoLLB = useRef();

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
    const [dfsColor, setDFSColor] = useState('#000000');
    const [dfsSpeed, setDFSSpeed] = useState(0);
    const [bfsColor, setBFSColor] = useState('#000000');
    const [bfsSpeed, setBFSSpeed] = useState(0);
    const [llSpeed, setLLSpeed] = useState(0);
    const [llColor, setLLColor] = useState('#000000');

    const eventHandler = (e) => {
        // setTimeout(()=>{
        //     clickyGo('move', e)
        // }, 0)
        clickyGo('move', e)
    }

    const isLoading = () =>{
        balls.current.classList.remove('hidden')
        searchImage.current.classList.remove('hidden')
        searchInput.current.setAttribute("disabled", true)
        if(!id){
            saveB.current.classList.add('disabled')
        } else{
            editB.current.classList.add('disabled')
            deleteB.current.classList.add('disabled')
        }
    }

    const finishedLoading = () =>{
        balls.current.classList.add('hidden')
        searchImage.current.classList.add('hidden')
        searchInput.current.removeAttribute("disabled")
        if(!id){
            saveB.current.classList.remove('disabled')
        } else {
            editB.current.classList.remove('disabled')
            deleteB.current.classList.remove('disabled')
        }
    }

    const isTraversing = () => {
        if(dfsB.current && bfsB.current && llB.current){
            dfsB.current.setAttribute("disabled", true)
            bfsB.current.setAttribute("disabled", true)
            llB.current.setAttribute("disabled", true)
            undoBFSB.current.classList.add('disabled')
            undoDFSB.current.classList.add('disabled')
            undoLLB.current.classList.add('disabled')
        }
    }

    const finishedTraversing = () => {
        if(dfsB.current && bfsB.current && llB.current){
            dfsB.current.removeAttribute("disabled")
            bfsB.current.removeAttribute("disabled")
            llB.current.removeAttribute("disabled")
            undoBFSB.current.classList.remove('disabled')
            undoDFSB.current.classList.remove('disabled')
            undoLLB.current.classList.remove('disabled')
        }
    }

    useEffect(() =>{
        if(currentMap){
            if(!currentMap['owner']){
                history.push(`/maps/${id}`)
            } else {
                let c = Map.loadMap(currentMap.map_data, canvasElement)
                setCanvas(c)
                setName(currentMap['name'])
                setRow(currentMap['rows'])
                setColumn(currentMap['columns'])
                setWidth(currentMap['width'])
                setHeight(currentMap['height'])
                setMapId(currentMap['id'])
            }
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
            setCanvas()
            setErrors()
            document.removeEventListener("mousedown", handlePathPopUpClick);
            document.removeEventListener("mousedown", handleLoadPopUpClick);
        };
    },[dispatch])

    const onSave = async (e) =>{
        e.preventDefault();

        if(saveB.current.classList.contains('disabled')){
            return
        }

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
            isLoading();
            const data = await dispatch(addMapData({name, map_data, user_id, map_image}))
            finishedLoading();
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
        if(!mousDownClick.current.classList.contains('active')){
            return
        }
        if(!color){
            color = stateColor
        }
        if(trigger === 'down'){
            isPathing = true
            canvasElement.current.addEventListener('mousemove', (e)=> eventHandler(e), true)
        }

        if(trigger === 'up' || trigger === 'out'){
            isPathing = false
            canvasElement.current.removeEventListener('mousemove', (e)=> eventHandler(e), true)
        }

        if (e.target.tagName === 'CANVAS' && isPathing && (trigger === 'move' || trigger === 'down')){
            const y = Math.ceil(e.offsetY / (canvas.height / canvas.row)) - 1
            const x = Math.ceil(e.offsetX / (canvas.width/ canvas.column)) - 1

            if(startB.current.classList.contains('active')){
                canvas.drawStart(x, y)
                setErrors([])
                startB.current.classList.remove('active')
            }

            if(endB.current.classList.contains('active')){
                canvas.drawEnd(x, y)
                setErrors([])
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
            canvasElement.current.removeEventListener('mousemove', (e)=> eventHandler(e))
            isPathing = false
            mousDownClick.current.classList.remove('active')
        } else{
            addMouseDown(clickyGo)
            mousDownClick.current.classList.add('active')
        }
    }

    const loadMap = async (e) =>{
        e.preventDefault();
        if(searchImage.current.classList.contains('disabled')){
            return
        }
        let newErrors = []
        setErrors([])

        const value = searchValue
        if(!searchValue){
            newErrors.push(['Please provide an value'])
            setErrors(newErrors)
            return
        }

        isLoading()
        const data = await dispatch(fetchMapData({value}))
        finishedLoading()

        if(data.errors){
            setErrors(data.errors)
        } else if (!data){
            newErrors.push('Map Does not exist')
            setErrors(newErrors)
        } else {
            setCanvas(Map.loadMap(data['map_data'], canvasElement))
            setMapId(data.id)
            setName(data.name)
            if(data.user_id !== user.id){
                setTimeout(()=>{
                    history.push(`/maps/${data.id}`)
                }, 0)
            } else {
                setTimeout(()=>{
                    history.push(`/maps/create/${data.id}`)
                }, 0)
            }
        }
    }

    const editMap = async (e) =>{
        e.preventDefault();
        setErrors([])
        if(!balls.current.classList.contains("hidden")){
            return
        }
        const user_id = user.id;

        let map_data = canvas.mapData
        let map_image = canvas.getDataUrl()

        isLoading();
        const data = await dispatch(editMapData({name, map_data, user_id, id, map_image}))
        finishedLoading();

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
        if(!balls.current.classList.contains("hidden")){
            return
        }
        await isLoading();
        const data = await dispatch(deleteMapData({id}))
        await finishedLoading();

        if(data.errors){
            setErrors(data.errors);
        } else{
            setName('')
            setRow(50)
            setColumn(50)
            setWidth(700)
            setHeight(700)
            alert('Succesfully deleted')
            setTimeout(()=>{
                history.push('/maps/create')
            }, 0)
        }
    }


    const drawGrid = () => {
        canvas.drawGrid()
    }

    const startDfs = () =>{
        setErrors([])
        isTraversing();
        const dfs = canvas.startDFS()
        if(dfs === undefined){
            const res = canvas.drawPath('dfs', dfsSpeed, dfsColor)
            if(res){
                Promise.all(res).then(()=>{
                   finishedTraversing();
                })
            }
        }
        else if('status' in dfs){
            setErrors(["Please provide a start and end node."])
            finishedTraversing();
        }
    }

    const startBfs = async () => {
        setErrors([])
        isTraversing();
        const bfs = canvas.startBFS()
        if(bfs === undefined){
            const res = canvas.drawPath('bfs', bfsSpeed, bfsColor)
            if(res){
                Promise.all(res).then(()=>{
                    finishedTraversing();
                })
            }
        } else if('status' in bfs){
            setErrors(["Please provide a start and end node."])
            finishedTraversing();
        }
    }

    const traverseLL = () => {
        setErrors([])
        isTraversing();
        const ll = canvas.startLL()
        if(ll === undefined){
            alert('Start and end nodes are not connected so no path found.')
            finishedTraversing();
        } else if('status' in ll){
            setErrors(["Please provide a start and end node for LL and make sure they are connected."])
            finishedTraversing();
        } else {
            const res = canvas.drawPath('ll', llSpeed, llColor)
            if(res){
                Promise.all(res).then(()=>{
                    finishedTraversing();
                })
            }
        }
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

    const undoDFS = async () => {
        setErrors([])
        if(undoDFSB.current.classList.contains('disabled')){
            return
        }
        isTraversing();
        const res = canvas.undoPath(true, false, false, dfsSpeed)
        if(res){
            Promise.all(res).then(()=>{
                console.log('finsihed undoing')
                finishedTraversing();
            })
        } else {
            setErrors(['No DFS path to undo'])
            finishedTraversing();
        }
    }

    const undoBFS = () => {
        setErrors([])
        if(undoBFSB.current.classList.contains('disabled')){
            return
        }
        isTraversing();
        const res = canvas.undoPath(false, true, false, bfsSpeed)
        if(res){
            Promise.all(res).then(()=>{
                finishedTraversing();
            })
        } else {
            setErrors(['No BFS path to undo'])
            finishedTraversing();
        }
    }

    const undoLL = () => {
        setErrors([])
        if(undoLLB.current.classList.contains('disabled')){
            return
        }
        isTraversing();
        const res = canvas.undoPath(false, false, true, llSpeed)
        if(res){
            Promise.all(res).then(()=>{
                finishedTraversing();
            })
        } else {
            setErrors(['No LL path to undo'])
            finishedTraversing();
        }
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

                <div className='canvas__loading'>
                    <div className='balls hidden' ref={balls}>
                        <div className='ball1'></div>
                        <div className='ball2'></div>
                        <div className='ball1'></div>
                    </div>
                </div>

                <canvas ref={canvasElement}>

                </canvas>

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
                            ref={mapNameInput}
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
                                    <div>
                                        <button onClick={startDfs} ref={dfsB}>
                                            DFS
                                        </button>
                                        <img src={undo} alt='undo' onClick={undoDFS} ref={undoDFSB}/>
                                    </div>
                                    DFS Speed: {dfsSpeed}
                                    <input
                                        type="range" min="0" max="100" value={dfsSpeed}
                                        onChange={(e)=> setDFSSpeed(e.target.value)}
                                    >
                                    </input>
                                    <input
                                        className='color__picker'
                                        type='color'
                                        onChange={(e)=>setDFSColor(e.target.value)}
                                        >
                                    </input>
                                    <div>
                                        <button onClick={startBfs}  ref={bfsB}>
                                            BFS
                                        </button>
                                        <img src={undo} alt='undo' onClick={undoBFS} ref={undoBFSB}/>
                                    </div>
                                    BFS Speed: {bfsSpeed}
                                    <input
                                        type="range" min="0" max="100" value={bfsSpeed}
                                        onChange={(e)=> setBFSSpeed(e.target.value)}
                                    >
                                    </input>
                                    <input
                                        className='color__picker'
                                        type='color'
                                        onChange={(e)=>setBFSColor(e.target.value)}
                                        >
                                    </input>
                                    <div>
                                        <button onClick={traverseLL} ref={llB}>
                                            LinkedList

                                        </button>
                                        <img src={undo} alt='undo' onClick={undoLL} ref={undoLLB}/>
                                    </div>
                                    LL Speed: {llSpeed}
                                    <input
                                        type="range" min="0" max="100" value={llSpeed}
                                        onChange={(e)=> setLLSpeed(e.target.value)}
                                    >
                                    </input>
                                    <input
                                        className='color__picker'
                                        type='color'
                                        onChange={(e)=>setLLColor(e.target.value)}
                                        >
                                    </input>
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
                            {/* <button onClick={onSave}>
                                Save Map Data
                            </button> */}

                            <div className='map__icon__container'>
                                <img className='map__icon' src={save} alt='save' onClick={onSave} ref={saveB}/>
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
                                    ref={searchInput}
                                >
                                </input>
                                <div className='map__icon__container'>
                                    <img className='map__icon' src={load} alt='load' onClick={loadMap}
                                        ref={searchImage}
                                    />
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
                                ref={mapNameInput}
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
                                    <div>
                                        <button onClick={startDfs} ref={dfsB}>
                                            DFS
                                        </button>
                                        <img src={undo} alt='undo' onClick={undoDFS} ref={undoDFSB}/>
                                    </div>
                                    DFS Speed: {dfsSpeed}
                                    <input
                                        type="range" min="0" max="100" value={dfsSpeed}
                                        onChange={(e)=> setDFSSpeed(e.target.value)}
                                    >
                                    </input>
                                    <input
                                        className='color__picker'
                                        type='color'
                                        onChange={(e)=>setDFSColor(e.target.value)}
                                        >
                                    </input>
                                    <div>
                                        <button onClick={startBfs}  ref={bfsB}>
                                            BFS
                                        </button>
                                        <img src={undo} alt='undo' onClick={undoBFS} ref={undoBFSB}/>
                                    </div>
                                    BFS Speed: {bfsSpeed}
                                    <input
                                        type="range" min="0" max="100" value={bfsSpeed}
                                        onChange={(e)=> setBFSSpeed(e.target.value)}
                                    >
                                    </input>
                                    <input
                                        className='color__picker'
                                        type='color'
                                        onChange={(e)=>setBFSColor(e.target.value)}
                                        >
                                    </input>
                                    <div>
                                        <button onClick={traverseLL} ref={llB}>
                                            LinkedList

                                        </button>
                                        <img src={undo} alt='undo' onClick={undoLL} ref={undoLLB}/>
                                    </div>
                                    LL Speed: {llSpeed}
                                    <input
                                        type="range" min="0" max="100" value={llSpeed}
                                        onChange={(e)=> setLLSpeed(e.target.value)}
                                    >
                                    </input>
                                    <input
                                        className='color__picker'
                                        type='color'
                                        onChange={(e)=>setLLColor(e.target.value)}
                                        >
                                    </input>
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
                                <img className='map__icon' src={edit} alt='edit' onClick={editMap} ref={editB}/>
                            </div>

                        </div>

                        <div>
                            {/* <button
                            className='delete__button'
                            ref={deleteB} onClick={deleteMap} >
                                Delete Map
                            </button> */}
                            <div className='map__icon__container'>
                                <img className='map__icon' src={delete_icon} alt='delete_icon' onClick={deleteMap} ref={deleteB}/>
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
                                        ref={searchInput}
                                    >
                                    </input>
                                    <div className='map__icon__container'>
                                        <img className='map__icon' src={load} alt='load' onClick={loadMap}
                                            ref={searchImage}
                                        />
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

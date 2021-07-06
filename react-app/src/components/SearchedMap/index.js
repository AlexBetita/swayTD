/*
    Credits:
    https://www.iconpacks.net/free-icon/coin-dollar-2686.html
    https://iconmonstr.com/license/
*/

import React, {useRef, useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory, NavLink } from 'react-router-dom';

import { fetchMapData } from "../../store/map";
import Map from '../Map/map';

import arrow from '../img/arrow.png';
import path from '../img/path.png';
import load from '../img/load.png';
import search from '../img/search.png';
import undo from '../img/undo.png';

import './SearchedMap.css';


const SearchedMap = () => {

    let { id } = useParams()

    const history = useHistory()
    const dispatch = useDispatch()

    const user = useSelector(state=>{
        if(!state.session.user){
            history.push('/login')
            return
        } else {
            return true
        }
    })

    const currentMap = useSelector(state=> {
        if(id){
            } if(state.map[id]) {
                return {
                        ...state.map[id]
                       }
            }
            return false
        })


    const balls = useRef();
    const searchInput = useRef();
    const searchImage = useRef();
    const canvasElement = useRef();
    const pathPopUp = useRef();
    const pathPopUpB = useRef();
    const mapEditorBody = useRef();

    const searchPopUp = useRef();
    const searchPopUpB = useRef();

    const [canvas, setCanvas] = useState()
    const [name, setName] = useState('')
    const [errors, setErrors] = useState([]);

    const [row, setRow] = useState(50)
    const [column, setColumn] = useState(50)
    const [width, setWidth] = useState(700)
    const [height, setHeight] = useState(700)
    const [searchValue, setSearchValue] = useState(id)
    const [dfsColor, setDFSColor] = useState('#000000');
    const [dfsSpeed, setDFSSpeed] = useState(0);
    const [bfsColor, setBFSColor] = useState('#000000');
    const [bfsSpeed, setBFSSpeed] = useState(0);
    const [llSpeed, setLLSpeed] = useState(0);
    const [llColor, setLLColor] = useState('#000000');

    if(!currentMap && user){
        history.push('/maps')
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
        } else {
            loadMap()
        }

        document.addEventListener('mousedown', handlePathPopUpClick)
        document.addEventListener('mousedown', handleLoadPopUpClick)
        return ()=> {
            canvasElement.current = false
            pathPopUp.current = false
            pathPopUpB.current = false
            setCanvas()
            setErrors()
            document.removeEventListener("mousedown", handlePathPopUpClick);
            document.removeEventListener("mousedown", handleLoadPopUpClick);
        };
    },[dispatch])

    const isLoading = () =>{
        balls.current.classList.remove('hidden')
        searchImage.current.classList.remove('hidden')
        searchInput.current.setAttribute("disabled", true)
    }

    const finishedLoading = () =>{
        if(balls.current){
            balls.current.classList.add('hidden')
            searchImage.current.classList.add('hidden')
            searchInput.current.removeAttribute("disabled")
        }
    }

    const loadMap = async (effectLoad = false) =>{
        if(searchImage.current.classList.contains('disabled')){
            return
        }
        let newErrors = []
        setErrors([])
        const value = searchValue
        if(!searchValue){
            setErrors(newErrors)
            return
        }

        isLoading()
        const data = await dispatch(fetchMapData({value}))
        finishedLoading()

        if(data.errors && effectLoad){
            setErrors(data.errors)
        } else if (!data && effectLoad){
            setErrors(newErrors)
        } else if (effectLoad || !data.errors){
            setTimeout(()=>{
                history.push(`/maps/create/${data.id}`)
            }, 0)
        } else{
            alert('Map does not exist')
        }
    }



    const startDfs = () =>{
        setErrors([])
        const dfs = canvas.startDFS()
        if(dfs === undefined){
            canvas.drawPath('dfs', dfsSpeed, dfsColor)
        }
        else if('status' in dfs){
            setErrors(["Looks like this user didn't place an end or start node"])
        }
    }

    const startBfs = () => {
        setErrors([])
        const bfs = canvas.startBFS()
        if(bfs === undefined){
            canvas.drawPath('bfs', bfsSpeed, bfsColor)
        } else if('status' in bfs){
            setErrors(["Looks like this user didn't place an end or start node"])
        }
    }

    const traverseLL = () => {
        setErrors([])
        const ll = canvas.startLL()
        if(ll === undefined){
            alert('Start and end nodes are not connected so no path found')
        } else if('status' in ll){
            setErrors(["Looks like this user didn't place an end or start node"])
        } else {
            canvas.drawPath('ll', llSpeed, llColor)
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

    const undoDFS = () => {
        setErrors([])
        const res = canvas.undoPath(true, false, false, dfsSpeed)
        if(!res['status']){
            setErrors([res['message']])
        }
    }

    const undoBFS = () => {
        setErrors([])
        const res = canvas.undoPath(false, true, false, bfsSpeed)
        if(!res['status']){
            setErrors([res['message']])
        }
    }

    const undoLL = () => {
        setErrors([])
        const res = canvas.undoPath(false, false, true, llSpeed)
        if(!res['status']){
            setErrors([res['message']])
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

                    <div className='map__name'>
                        Map Name:
                        <input
                            maxLength = "50"
                            className='input__map__name'
                            type='text'
                            name='name'
                            disabled
                            value={name}
                        >

                        </input>
                    </div>

                    <div className='map__ui'>
                        <div className=''>
                            <img
                                className='profile__icon'
                                src={currentMap.profileImage}
                                alt='profileImage'>
                            </img>
                        </div>
                        <div className='profile__details'>
                            <div>
                                <label className='map__username'>
                                    {currentMap.username}
                                </label>
                                <label className='star'>☆</label>
                            </div>
                        </div>
                        <div>

                            <div className='map__icon__container' ref={pathPopUpB}>
                                <img className='map__icon' src={path} alt='path' onClick={togglePopUpPath}/>
                            </div>

                            <div className='popup__path hidden' ref={pathPopUp}>
                                <div>
                                    <button onClick={startDfs}>
                                        DFS
                                    </button>
                                    <img src={undo} alt='undo' onClick={undoDFS}/>
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
                                    <button onClick={startBfs}>
                                        BFS
                                    </button>
                                    <img src={undo} alt='undo' onClick={undoBFS}/>
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
                                    <button onClick={traverseLL}>
                                        LinkedList
                                    </button>
                                    <img src={undo} alt='undo' onClick={undoLL}/>
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
                </div>
            </div>
    </>
    )
}


export default SearchedMap;

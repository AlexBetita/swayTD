/*
    Credits:
    https://www.iconpacks.net/free-icon/coin-dollar-2686.html
    https://iconmonstr.com/license/
*/

import React, {useRef, useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory, NavLink } from 'react-router-dom';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import SearchResults from "./SearchResults";
import { fetchMapData, searchMapData } from "../../store/map";

import TipsModal from '../Tips';
import Map from '../Map/map';

import arrow from '../img/arrow.png';
import path from '../img/path.png';
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

    // const searchResultElements = useRef();

    const balls = useRef();
    const searchInput = useRef();
    const searchImage = useRef();
    const canvasElement = useRef();
    const pathPopUp = useRef();
    const pathPopUpB = useRef();
    const mapEditorBody = useRef();

    const dfsB = useRef();
    const llB = useRef();
    const bfsB = useRef();
    const undoDFSB = useRef();
    const undoBFSB = useRef();
    const undoLLB = useRef();

    const searchPopUp = useRef();
    const searchPopUpB = useRef();

    const colorPickerDFSB = useRef();
    const colorPickerBFSB = useRef();
    const colorPickerLLB = useRef();
    const speedScrollDFS = useRef();
    const speedScrollBFS = useRef();
    const speedScrollLL = useRef();

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

    const [searchResultElements, setSearchResultElements] = useState();

    if(!currentMap && user){
        history.push('/maps')
    }

    useEffect(() =>{
        if(currentMap){
            let {new_map} = Map.loadMap(currentMap.map_data, canvasElement.current)
            setCanvas(new_map)
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
        if(balls.current){
            balls.current.classList.remove('hidden')
            searchImage.current.classList.remove('hidden')
            searchInput.current.setAttribute("disabled", true)
        }
    }

    const finishedLoading = () =>{
        if(balls.current){
            balls.current.classList.add('hidden')
            searchImage.current.classList.add('hidden')
            searchInput.current.removeAttribute("disabled")
        }
    }

    //CHANGES
    const isTraversing = () => {
        if (dfsB.current && bfsB.current && llB.current) {
          dfsB.current.setAttribute('disabled', true);
          bfsB.current.setAttribute('disabled', true);
          llB.current.setAttribute('disabled', true);
          colorPickerDFSB.current.setAttribute('disabled', true)
          colorPickerBFSB.current.setAttribute('disabled', true)
          colorPickerLLB.current.setAttribute('disabled', true)
          speedScrollDFS.current.setAttribute('disabled', true)
          speedScrollBFS.current.setAttribute('disabled', true)
          speedScrollLL.current.setAttribute('disabled', true)
          undoBFSB.current.classList.add('disabled');
          undoDFSB.current.classList.add('disabled');
          undoLLB.current.classList.add('disabled');
        }
      };

      const finishedTraversing = () => {
        if (dfsB.current && bfsB.current && llB.current) {
          dfsB.current.removeAttribute('disabled');
          bfsB.current.removeAttribute('disabled');
          llB.current.removeAttribute('disabled');
          colorPickerDFSB.current.removeAttribute('disabled');
          colorPickerBFSB.current.removeAttribute('disabled')
          colorPickerLLB.current.removeAttribute('disabled');
          speedScrollDFS.current.removeAttribute('disabled')
          speedScrollBFS.current.removeAttribute('disabled');
          speedScrollLL.current.removeAttribute('disabled')
          undoBFSB.current.classList.remove('disabled');
          undoDFSB.current.classList.remove('disabled');
          undoLLB.current.classList.remove('disabled');
        }
      };

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


    const searchMap = async () =>{
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
        const data = await dispatch(searchMapData({value}))
        finishedLoading()

        if(data.errors){
            setErrors(data.errors)
        } else if (!data){
            setErrors(newErrors)
        } else if(data){
            const results = data.maps
            setSearchResultElements(Object.keys(results).map((key)=>{
                return (
                    <SearchResults key={`sr${key}`} data={results[key]}/>
                )
            }))
            searchPopUp.current.classList.add('results')
        } else {
            setErrors(['No maps found'])
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
        searchPopUp.current.classList.remove('results')
        searchPopUpB.current.classList.remove('active')
        setSearchResultElements()
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
            setErrors(["Looks like this user didn't place an end or start node"])
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
            setErrors(["Looks like this user didn't place an end or start node"])
            finishedTraversing();
        }
    }

    const traverseLL = () => {
        setErrors([])
        isTraversing();
        const ll = canvas.startLL()
        if(ll === undefined){
            alert('Start and end nodes are not connected so no path found')
            finishedTraversing();
        } else if('status' in ll){
            setErrors(["Looks like this user didn't place an end or start node"])
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

    const undoDFS = async () => {
        setErrors([])
        if(undoDFSB.current.classList.contains('disabled')){
            return
        }
        isTraversing();
        const res = canvas.undoPath(true, false, false, dfsSpeed)
        if(res){
            Promise.all(res).then(()=>{
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
        <div>
            <TipsModal />
        </div>

            <div className='map__editor__body'>
                {height <= 800  &&
                    <div className='map__dimensions__text__900'>
                        <label id='dimensions'>
                            Map Dimensions
                        </label>
                        <label id='dimensions'>
                            {width} x {height}
                        </label>
                        <label id='dimensions'>
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
                        <Tippy content="Back to maps"
                                inertia={true}
                                arrow={true}
                                theme='sway'
                        >
                            <img src={arrow} alt='arrow' className='back__arrow__image'>
                            </img>
                        </Tippy>
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
                        {/* <input
                            maxLength = "50"
                            className='input__map__name'
                            type='text'
                            name='name'
                            disabled
                            value={name}
                        >

                        </input> */}
                        {` ${name}`}
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
                        <Tippy content="Pathing"
                                inertia={true}
                                arrow={true}
                                theme='sway'
                                >
                          <img className='map__icon' src={path} alt='path' onClick={togglePopUpPath}/>
                        </Tippy>
                      </div>

                      <div className='popup__path hidden' ref={pathPopUp}>
                        <div>
                          <Tippy content="Start Depth First Search"
                                inertia={true}
                                arrow={true}
                                theme='sway'
                                >
                            <button onClick={startDfs} ref={dfsB}>
                                              DFS
                            </button>
                          </Tippy>

                          <Tippy content="Undo Depth First Search"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <img src={undo} alt='undo' onClick={undoDFS} ref={undoDFSB}/>
                          </Tippy>

                        </div>
                                    DFS Speed: {dfsSpeed}

                        <Tippy content="Adjust Depth First Search Speed"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                            <input
                              type="range" min="0" max="100" value={dfsSpeed}
                              onChange={(e)=> setDFSSpeed(e.target.value)}
                              ref={speedScrollDFS}
                            >
                            </input>
                        </Tippy>

                        <Tippy content="Adjust Depth First Search Color"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <input
                            className='color__picker'
                            type='color'
                            onChange={(e)=>setDFSColor(e.target.value)}
                            ref={colorPickerDFSB}
                          >
                          </input>
                        </Tippy>
                        <div>
                        <Tippy content="Start Breadth First Search"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <button onClick={startBfs} ref={bfsB}>
                                            BFS
                          </button>
                          </Tippy>

                          <Tippy content="Undo Breadth First Search"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                            <img src={undo} alt='undo' onClick={undoBFS} ref={undoBFSB}/>
                          </Tippy>
                        </div>
                                    BFS Speed: {bfsSpeed}
                        <Tippy content="Adjust Breadth First Search Speed"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                        <input
                          type="range" min="0" max="100" value={bfsSpeed}
                          onChange={(e)=> setBFSSpeed(e.target.value)}
                          ref={speedScrollBFS}
                        >
                        </input>
                        </Tippy>

                        <Tippy content="Adjust Breadth First Search Color"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                        <input
                          className='color__picker'
                          type='color'
                          onChange={(e)=>setBFSColor(e.target.value)}
                          ref={colorPickerBFSB}
                        >
                        </input>
                        </Tippy>
                        <div>
                        <Tippy content="Start Linked List Traversal"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <button onClick={traverseLL} ref={llB}>
                                            LinkedList

                          </button>
                          </Tippy>

                          <Tippy content="Undo Linked List Traversal"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <img src={undo} alt='undo' onClick={undoLL} ref={undoLLB}/>
                          </Tippy>
                        </div>
                                    LL Speed: {llSpeed}
                        <Tippy content="Adjust Linked List Traversal Speed"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <input
                            type="range" min="0" max="100" value={llSpeed}
                            onChange={(e)=> setLLSpeed(e.target.value)}
                            ref={speedScrollLL}
                          >
                          </input>
                        </Tippy>

                        <Tippy content="Adjust Linked List Color"
                               inertia={true}
                               arrow={true}
                               theme='sway'
                               >
                          <input
                            className='color__picker'
                            type='color'
                            onChange={(e)=>setLLColor(e.target.value)}
                            ref={colorPickerLLB}
                          >
                          </input>
                        </Tippy>
                      </div>

                    </div>

                        <div>

                            <div className='map__icon__container' ref={searchPopUpB}>
                              <Tippy content="Search"
                                  inertia={true}
                                  arrow={true}
                                  theme='sway'
                                  >
                                <img className='map__icon' src={search} alt='search' onClick={togglePopUpSearch}/>
                              </Tippy>
                            </div>
                            <div className='popup__search hidden' ref={searchPopUp}>
                              {searchResultElements && searchResultElements}
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
                                <Tippy content="Search For Results"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                >
                                  {/* <img className='map__icon' src={load} alt='load' onClick={searchMap}
                                      ref={searchImage}
                                  /> */}
                                  <button type='button' onClick={searchMap} ref={searchImage}>
                                        Search
                                  </button>
                                </Tippy>
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

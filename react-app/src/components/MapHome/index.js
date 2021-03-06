import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { NavLink, useHistory } from 'react-router-dom';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import  { fetchMapData, setMapData } from "../../store/map";
import { fetchMapsByIndex, setIndex } from "../../store/session";

import MapComponent from './MapComponent.js';

import arrow from '../img/arrow.png';
import search from '../img/search.png';
import './MapHome.css';

const MapHome = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const mapIndex = useSelector((state)=>{
        return state.session.current_index
    })

    const balls = useRef();
    const ballsMain = useRef();
    const searchInput = useRef();
    const searchImage = useRef();
    const mapIndexButtons = useRef([]);
    const currentPage = useRef(mapIndex);
    const mapButtonElements = useRef([]);
    const searchContainer = useRef();
    const searchMapIndex = useRef(1);

    const mapTotal = useSelector((state)=>{
        return state.session.map_total
    })

    const user = useSelector((state)=>{
        mapIndexButtons.current = []
        let totalIndices =  Math.ceil(state.session.map_total / 10)

        for(let i = 0; i < totalIndices; i++){
            mapIndexButtons.current.push(
                <button className='map__index__button' key={`mi${i + 1}`}
                        type='button' value={i} onClick={loadMapByIndex}
                        ref={ el => mapButtonElements.current[i] = el}
                        >
                    {i + 1}
                </button>
            )
        }

        return state.session.user
        })

    for(let i = 0; i < mapButtonElements.current.length; i++){
        if(currentPage.current === (i + 1)){
            mapButtonElements.current[i].setAttribute('disabled', true)

        } else if(mapButtonElements.current[i]){
            mapButtonElements.current[i].removeAttribute('disabled')
        }
    }

    const maps = useSelector((state)=>{
        return {
            ...state.session.maps
        }
    })

    const otherMaps = useSelector((state)=>{
        return {
            ...state.map
        }
    })

    const reverse = Object.keys(otherMaps).reverse()
    const reverseUserMaps = Object.keys(maps).reverse()

    const [searchValue, setSearchValue] = useState('')
    const [errors, setErrors] = useState([]);
    const [fetchedMap, setFetchedMap] = useState();

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

    const isLoadingMain = () =>{
        ballsMain.current.classList.remove('hidden')
    }

    const finishedLoadingMain = () =>{
        ballsMain.current.classList.add('hidden')
    }


    if(!user){
        history.push('/login')
    }

    useEffect(()=>{
        searchContainer.current.addEventListener('scroll', ()=>{
            if(searchContainer.current.scrollTop + searchContainer.current.clientHeight >=
               searchContainer.current.scrollHeight){
                loadMoreMaps()
            }
        })
        if(Object.keys(otherMaps).length === 0){
            const setMap = async () =>{
                isLoading()
                await dispatch(setMapData(searchMapIndex.current))
                finishedLoading()
            }
            setMap()
        }
    },[dispatch])

    async function loadMoreMaps(){
        searchMapIndex.current += 1
        isLoading()
        const data = await dispatch(setMapData(searchMapIndex.current))
        finishedLoading()
        if(!Object.keys(data.maps).length){
            searchMapIndex.current -= 1
        }
    }

    const onSearch = async () =>{
        if(searchImage.current.classList.contains('disabled')){
            return
        }
        let newErrors = []
        let value = searchValue
        setErrors([])
        if(searchValue.length <= 0){
            newErrors.push('Please provide a value')
        }
        if(!newErrors.length){
            isLoading();
            const data = await dispatch(fetchMapData({value}))
            setFetchedMap(data.id)
            finishedLoading();
            if(data.errors){
                setErrors(data.errors)
            }
        } else {
            setErrors(newErrors)
        }
    }

    //e is element
    async function loadMapByIndex(e, newIndex = false){
        setErrors([])
        isLoadingMain()
        let index;
        if(e){
            currentPage.current = parseInt(e.target.value) + 1
            index = parseInt(e.target.value)
        } else if(newIndex){
            currentPage.current = parseInt(newIndex)
            index = parseInt(newIndex) - 1
        }
        dispatch(setIndex(currentPage.current))
        const data = await dispatch(fetchMapsByIndex(index))
        if(data.errors){
            setErrors(data.errors)
        }
        finishedLoadingMain()
    }

    const changeCurrentPageIndexOnDelete = () => {
        let newMapTotal = mapTotal - 1
        let newMapIndex = Math.ceil(newMapTotal / 10)
        if(newMapIndex !== 0 && (newMapIndex < currentPage.current)){
            currentPage.current = newMapIndex
            loadMapByIndex(false, newMapIndex)
        }
    }

    return (
        <>
        {user &&
            <div className='map__home__container'>

                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="error_map">{error}</li>
                    ))}
                </ul>

                <div className='main__map__home__container'>
                    <NavLink
                            className='back__arrow'
                            to='/'>
                        <Tippy content="Back to home"
                            inertia={true}
                            arrow={true}
                            theme='sway'
                        >
                            <img src={arrow} alt='arrow'>
                            </img>
                        </Tippy>
                    </NavLink>
                    <NavLink to='/maps/create'>
                        <Tippy content="Create a map"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                    >
                            <button className='create__map'>
                                Create Map
                            </button>
                        </Tippy>
                    </NavLink>

                    <div className='div__current__page'>
                        Current Page: {currentPage.current}
                        <div className='balls hidden' ref={ballsMain}>
                            <div className='ball1'></div>
                            <div className='ball2'></div>
                            <div className='ball1'></div>
                        </div>
                    </div>


                    {reverseUserMaps.map((map, key)=>{
                        return <MapComponent key={key}
                                            map={maps[map]}
                                            user={user.id}
                                            helperFunction={changeCurrentPageIndexOnDelete}
                                            />
                    })}

                    <div className='div__map__index__buttons'>
                        {mapIndexButtons.current.map((b)=>{
                            return b
                        })}
                    </div>
                </div>

                <div className='map__home__search__container' ref={searchContainer}>
                    <label>
                        Search Map
                    </label>
                    <div className='search__container'>
                        <input
                            placeholder='name or id'
                            value={searchValue}
                            name='searchValue'
                            className='search__input'
                            onChange={(e)=>{setSearchValue(e.target.value)}}
                            ref={searchInput}
                        >
                        </input>
                            <Tippy content="Search"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                    >
                                <img
                                    className='map__home__load' src={search} alt='load'
                                    onClick={onSearch}
                                    ref={searchImage}
                                ></img>
                            </Tippy>
                        <div className='balls hidden' ref={balls}>
                            <div className='ball1'></div>
                            <div className='ball2'></div>
                            <div className='ball1'></div>
                        </div>
                    </div>

                    {reverse.map((map, key)=>{
                        const maps = []
                        if(fetchedMap && key === 0){
                            maps.push(<MapComponent key={`sm${fetchedMap}`}
                                                    map={otherMaps[fetchedMap]}
                                                    user={user.id}
                                                    helperFunction={changeCurrentPageIndexOnDelete}
                                                    />)
                        }
                        if(!(fetchedMap === parseInt(map))){
                            maps.push(<MapComponent key={`sm${map}`}
                                                    map={otherMaps[map]}
                                                    user={user.id}
                                                    helperFunction={changeCurrentPageIndexOnDelete}
                                                    />)
                        }
                        return maps
                    })}

                    <div className='balls hidden' ref={balls}>
                        <div className='ball1'></div>
                        <div className='ball2'></div>
                        <div className='ball1'></div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default MapHome;

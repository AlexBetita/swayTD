import React, {useState, useEffect, useRef, createRef} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { NavLink, useHistory } from 'react-router-dom';

import  { fetchMapData, setMapData } from "../../store/map";
import { fetchMapsByIndex } from "../../store/session";

import MapComponent from './MapComponent.js';

import arrow from '../img/arrow.png';
import search from '../img/search.png';
import './MapHome.css';

const MapHome = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const balls = useRef();
    const ballsMain = useRef();
    const searchInput = useRef();
    const searchImage = useRef();
    const mapIndexButtons = useRef([]);
    const currentPage = useRef(1);
    const mapButtonElements = useRef([]);

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

        } else {
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
        balls.current.classList.remove('hidden')
        searchImage.current.classList.remove('hidden')
        searchInput.current.setAttribute("disabled", true)
    }

    const finishedLoading = () =>{
        balls.current.classList.add('hidden')
        searchImage.current.classList.add('hidden')
        searchInput.current.removeAttribute("disabled")
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
        if(Object.keys(otherMaps).length === 0){
            const setMap = async () =>{
                isLoading()
                await dispatch(setMapData())
                finishedLoading()
            }
            setMap()
        }
    },[dispatch])

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

    async function loadMapByIndex(e){
        setErrors([])
        isLoadingMain()
        currentPage.current = parseInt(e.target.value) + 1
        const data = await dispatch(fetchMapsByIndex(e.target.value))
        if(data.errors){
            setErrors(data.errors)
        }
        finishedLoadingMain()
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
                        <img src={arrow} alt='arrow'>
                        </img>
                    </NavLink>
                    <NavLink to='/maps/create'>
                        <button className='create__map'>
                            Create Map
                        </button>
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
                        return <MapComponent key={key} map={maps[map]} user={user.id}/>
                    })}

                    <div className='div__map__index__buttons'>
                        {mapIndexButtons.current.map((b)=>{
                            return b
                        })}
                    </div>
                </div>

                <div className='map__home__search__container'>
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
                        <img
                            className='map__home__load' src={search} alt='load'
                            onClick={onSearch}
                            ref={searchImage}
                        ></img>
                        <div className='balls hidden' ref={balls}>
                            <div className='ball1'></div>
                            <div className='ball2'></div>
                            <div className='ball1'></div>
                        </div>
                    </div>

                    {reverse.map((map, key)=>{
                        const maps = []
                        if(fetchedMap && key === 0){
                            maps.push(<MapComponent key={key} map={otherMaps[fetchedMap]} user={user.id}/>)
                        }
                        if(!(fetchedMap === parseInt(map))){
                            maps.push(<MapComponent key={key} map={otherMaps[map]} user={user.id}/>)
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

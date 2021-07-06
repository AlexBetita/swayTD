import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { NavLink, useHistory } from 'react-router-dom';

import  { fetchMapData } from "../../store/map";
import { setMapData } from "../../store/map";

import MapComponent from './MapComponent.js';

import arrow from '../img/arrow.png';
import search from '../img/search.png';
import './MapHome.css';

const MapHome = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const balls = useRef();
    const searchInput = useRef();
    const searchImage = useRef();

    const user = useSelector((state)=>{
        return state.session.user
        })

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

    const [searchValue, setSearchValue] = useState('')
    const [errors, setErrors] = useState([]);

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

    if(!user){
        history.push('/login')
    }

     useEffect(()=>{
        if(Object.keys(otherMaps).length === 0){
            const setMap = async () =>{
                await dispatch(setMapData())
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
            finishedLoading();
            if(data.errors){
                setErrors(data.errors)
            }
        } else {
            setErrors(newErrors)
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
                        <img src={arrow} alt='arrow'>
                        </img>
                    </NavLink>
                    <NavLink to='/maps/create'>
                        <button className='create__map'>
                            Create Map
                        </button>
                    </NavLink>
                    {Object.keys(maps).map((map, key)=>{
                        return <MapComponent key={key} map={maps[map]} user={user.id}/>
                    })}

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
                        return <MapComponent key={key} map={otherMaps[map]} user={user.id}/>
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

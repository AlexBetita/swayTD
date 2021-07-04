import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux"
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import User from '../User';

import MapComponent from './MapComponent.js';

import arrow from '../img/arrow.png';
import './MapHome.css';

const MapHome = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state)=>{
        return {
            ...state.session.user
        }})
    const maps = useSelector((state)=>{
        return {
            ...state.session.maps
        }
    })

    const [currentMaps, setCurrentMaps] = useState(maps)

    if(!user){
        history.push('/login')
    }

    useEffect(()=>{
        setCurrentMaps(maps)
    },[dispatch])

    return (
        <>
        {user &&
            <div className='map__home__container'>

                <div className='main__map__home__container'>
                    <NavLink
                            className='back__arrow'
                            to='/profile'>
                        <img src={arrow} alt='arrow'>
                        </img>
                    </NavLink>
                    {Object.keys(currentMaps).map((map, key)=>{
                        return <MapComponent key={key} map={maps[map]}/>
                    })}

                    <NavLink to='/maps/create'>
                        <button>
                            Create Map
                        </button>
                    </NavLink>
                </div>

                <div className='map__home__search__container'>
                    <label>
                        Search Map
                    </label>
                    <input>
                    </input>
                </div>
            </div>
        }
        </>
    )
}

export default MapHome;

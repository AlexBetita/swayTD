import React from 'react';
import { useSelector, useDispatch } from "react-redux"
import { NavLink } from 'react-router-dom';

import User from '../User';

import MapComponent from './MapComponent.js';

import './MapHome.css';

const MapHome = () => {

    const maps = useSelector((state)=>state.session.maps)

    return (
        <>
            <div className='map__home__container'>
                <div className='main__map__home__container'>
                    {Object.keys(maps).map((map, key)=>{
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
        </>
    )
}

export default MapHome;

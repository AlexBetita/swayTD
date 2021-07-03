import React from 'react';
import { useSelector } from "react-redux"
import { NavLink, useHistory } from 'react-router-dom';

import User from '../User';

import MapComponent from './MapComponent.js';

import arrow from '../img/arrow.png';
import './MapHome.css';

const MapHome = () => {
    const history = useHistory();

    const user = useSelector((state)=>state.session.user)
    const maps = useSelector((state)=>state.session.maps)

    if(!user){
        history.push('/login')
    }

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
        }
        </>
    )
}

export default MapHome;

import React, {useState} from 'react';
import { useSelector, useDispatch } from "react-redux"
import { NavLink, useHistory } from 'react-router-dom';

import  { fetchMapData } from "../../store/map";

import MapComponent from './MapComponent.js';

import arrow from '../img/arrow.png';
import search from '../img/search.png';
import './MapHome.css';

const MapHome = () => {
    const history = useHistory();
    const dispatch = useDispatch();

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

    const [searchValue, setSearchValue] = useState('')
    const [errors, setErrors] = useState([]);

    if(!user){
        history.push('/login')
    }

    const onSearch = async () =>{
        let newErrors = []
        let value = searchValue
        setErrors([])
        if(searchValue.length <= 0){
            newErrors.push('Please provide a value')
        }
        if(!newErrors.length){
            const data = await dispatch(fetchMapData({value}))
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
                            to='/profile'>
                        <img src={arrow} alt='arrow'>
                        </img>
                    </NavLink>
                    {Object.keys(maps).map((map, key)=>{
                        return <MapComponent key={key} map={maps[map]} user={user.id}/>
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
                    <div>
                        <input
                            placeholder='name or id'
                            value={searchValue}
                            name='searchValue'
                            onChange={(e)=>{setSearchValue(e.target.value)}}
                        >
                        </input>
                        <img
                            className='map__home__load' src={search} alt='load'
                            onClick={onSearch}
                        ></img>
                    </div>

                    {Object.keys(otherMaps).map((map, key)=>{
                        return <MapComponent key={key} map={otherMaps[map]} user={user.id}/>
                    })}
                </div>
            </div>
        }
        </>
    )
}

export default MapHome;

import React from 'react';
import { useHistory } from 'react-router-dom';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import './SearchResults.css'

import load from '../img/load.png';

const SearchResults = ({data, create}) =>{

    const history = useHistory()

    const loadMap = () =>{
        if(create){
            history.push(`/maps/${data.id}`)
        } else {
            history.push(`/maps/create/${data.id}`)
        }
    }

    return(
        <>
            <div id='search__results__container'>
                <img className='img__search__results__owner' src={data.profileImage}/>
                <label className='map__username'>
                                {data.username}
                </label>
                <label className='star'>☆</label>
                <img className='img__search__results' src={data.map_image}/>
                <div>
                    Map Name: { data.name}
                </div>

                <Tippy content="Load"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                >
                    <img className='map__icon' src={load} alt='load' onClick={loadMap}/>
                </Tippy>

            </div>
        </>
    )
}

export default SearchResults;

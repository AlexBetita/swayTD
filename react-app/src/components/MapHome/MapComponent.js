import React, {useRef, useState} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { deleteMapData } from '../../store/map';

import edit from '../img/edit.png';
import delete_red from '../img/delete_red.png';
import view from '../img/view.png';

import './MapComponent.css';

const MapComponent = ({map, user}) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const mapImageElement = useRef();

    const [errors, setErrors] = useState([]);


    const enlargeImage = (e) =>{
        e.preventDefault();
        if(mapImageElement.current.classList.contains('active')){
            // mapImageElement.current.style.width = `60px`
            // mapImageElement.current.style.height = `60px`
            mapImageElement.current.classList.remove('active');
        } else {
            mapImageElement.current.classList.add('active');
            // mapImageElement.current.style.width = `${map.width}px`
            // mapImageElement.current.style.height = `${map.height}px`
        }
    }

    const editMap = () =>{
        setTimeout(()=>{
            history.push(`/maps/create/${map.id}`)
        }, 0)
    }

    const deleteMap = async () =>{
        setErrors([])
        let id = map.id
        const data = await dispatch(deleteMapData({id}))
        if(data.errors){
            setErrors(data.errors);
        } else {
            alert('Successfully Deleted')
        }
    }

    const viewMap = () =>{
        history.push(`maps/create/${map.id}`)
    }

    return (
        <>
        {map &&
            <div className='map__component__container'>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="error_map">{error}</li>
                    ))}
                </ul>
                <div>
                    <img
                        ref={mapImageElement}
                        className='map__component__image'
                        src={map.map_image}
                        onClick={enlargeImage}
                        alt='maps icon'
                        >
                    </img>
                </div>
                <div className='map__component__details'>
                    <div>
                        Map Name: {map.name}
                    </div>
                    <div>
                        {map.width} x {map.height}
                    </div>
                    <div>
                        {map.rows} x {map.columns}
                    </div>
                </div>
                {user === map.user_id &&
                    <div className='map__component__buttons'>
                        <img src={delete_red} alt='delete' onClick={deleteMap}/>
                        <img src={edit} alt='edit' onClick={editMap}/>
                    </div>
                }
                {user !== map.user_id &&
                    <div className='map__component__buttons'>
                        <img src={view} alt='view' onClick={viewMap}></img>
                    </div>
                }
            </div>
        }
        </>
    )
}

export default MapComponent;

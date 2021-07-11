import React, {useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { deleteMapData } from '../../store/map';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import edit from '../img/edit.png';
import delete_red from '../img/delete_red.png';
import view from '../img/view.png';

import './MapComponent.css';

const MapComponent = ({map, user, helperFunction}) => {


    const history = useHistory()
    const dispatch = useDispatch();

    // const deleted = useRef(false)
    const mapImageElement = useRef();

    const [errors, setErrors] = useState([]);
    // const [deleted, setDeleted] = useState(false)

    // useEffect(()=>{
    //     console.log(deleted, 'deleted')
    //     if(deleted){
    //         return (()=>{
    //             helperFunction(mapIndex)
    //         })
    //     }
    // }, [dispatch])

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

    async function deleteMap(){
        setErrors([])
        let id = map.id
        // await setDeleted(true)
        const data = await dispatch(deleteMapData({id}))
        if(data.errors){
            setErrors(data.errors);
        } else {
            // deleted = true
            helperFunction()
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
                        <Tippy content="Delete Map"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                    >
                            <img src={delete_red} alt='delete' onClick={deleteMap}/>
                        </Tippy>
                        <Tippy content="Edit Map"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                    >
                            <img src={edit} alt='edit' onClick={editMap}/>
                        </Tippy>
                    </div>
                }
                {user !== map.user_id &&
                    <div className='map__component__buttons'>
                        <Tippy content="View Map"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                    >
                            <img src={view} alt='view' onClick={viewMap}></img>
                        </Tippy>
                    </div>
                }
            </div>
        }
        </>
    )
}

export default MapComponent;

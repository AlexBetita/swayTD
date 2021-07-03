import React, {useRef} from 'react';

import './MapComponent.css';

const MapComponent = ({map}) => {

    const mapImageElement = useRef();

    const enlargeImage = (e) =>{
        e.preventDefault();
        if(mapImageElement.current.classList.contains('active')){
            mapImageElement.current.style.width = `60px`
            mapImageElement.current.style.height = `60px`
            mapImageElement.current.classList.remove('active');
        } else {
            mapImageElement.current.classList.add('active');
            mapImageElement.current.style.width = `${map.width}px`
            mapImageElement.current.style.height = `${map.height}px`
        }
    }

    return (
        <>
            <div className='map__component__container'>
                <div>
                    <img
                        ref={mapImageElement}
                        className='map__component__image'
                        src={map.map_image}
                        onClick={enlargeImage}
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

            </div>
        </>
    )
}

export default MapComponent;

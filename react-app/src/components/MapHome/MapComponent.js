import React from 'react';

import './MapHome.css';

const MapComponent = ({map}) => {
    return (
        <>
            <div>
                <label>
                    Map Name: {map.name}
                </label>
                <img src={map.map_image}>
                    
                </img>
            </div>
        </>
    )
}

export default MapComponent;

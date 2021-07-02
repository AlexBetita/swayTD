import React from 'react';

import './MapHome.css';

const MapComponent = ({map}) => {
    return (
        <>
            <div>
                <label>
                    Map Name: {map.name}
                </label>
            </div>
        </>
    )
}

export default MapComponent;

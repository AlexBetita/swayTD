//constants
const ADD_MAP = "maps/ADD_MAP"
const GET_MAP = "maps/GET_MAP"

//action creators
const addMap = (payload) => ({
    type: ADD_MAP,
    payload
})

const getMap = (payload) => ({
    type: GET_MAP,
    payload
})

//thunks
export const addMapData = (payload) => async (dispatch) => {
    const {name, map_data, user_id} = payload
    const {width, height, rows, columns} = map_data
    const response = await fetch("/api/maps/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            map_data,
            user_id,
            width,
            height,
            rows,
            columns
        })
    });

    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(addMap(data))
    return data
}

export const fetchMapData = (payload) => async (dispatch) => {
    const {id} = payload;
    const response = await fetch(`/api/maps/${id}`)
    const data = await response.json();
    if (data.errors){
        return data;
    }
    dispatch(getMap(data))
    return data
}

const initialState = {
    maps: null,
    owned_maps: null,
}

export default function reducer(state = initialState, action){
    let newState;
    switch (action.type){
        case ADD_MAP:
            newState = {...state}
            newState.owned_maps = action.payload
            return newState
        case GET_MAP:
            newState = {...state}
            newState.owned_maps = action.payload
        default:
            return state;
    }
}
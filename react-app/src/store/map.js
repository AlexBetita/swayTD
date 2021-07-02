//constants
export const ADD_MAP = "maps/ADD_MAP"
const GET_MAP = "maps/GET_MAP"
export const DELETE_MAP = "maps/DELETE_MAP"

//action creators
const addMap = (payload) => ({
    type: ADD_MAP,
    payload
})

const getMap = (payload) => ({
    type: GET_MAP,
    payload
})

const deleteMap = (payload) => ({
    type: DELETE_MAP,
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


export const editMapData = (payload) => async (dispatch) => {
    const {name, map_data, user_id, id} = payload
    const {width, height, rows, columns} = map_data
    const response = await fetch(`/api/maps/${id}`, {
        method: "PUT",
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

export const deleteMapData = (payload) => async (dispatch) => {
    const {id} = payload
    const response = await fetch(`/api/maps/${id}`,{
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(deleteMap(data))
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

const initialState = {}

export default function reducer(state = initialState, action){
    let newState;
    switch (action.type){
        case ADD_MAP:
            newState = {...state}
            newState = {
                [action.payload.id] : action.payload
            }
            return newState
        case GET_MAP:
            newState = {...state}
            newState = {
                [action.payload.id] : action.payload
            }
            return newState
        case DELETE_MAP:
            newState = {...state}
            delete newState[action.payload.id]
            return newState
        default:
            return state;
    }
}

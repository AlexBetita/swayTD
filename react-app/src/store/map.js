import { REMOVE_USER } from "./session";
//constants
export const ADD_MAP = "maps/ADD_MAP"
const GET_MAP = "maps/GET_MAP"
export const DELETE_MAP = "maps/DELETE_MAP"
const SET_MAP = "maps/SET_MAP"
export const SEARCH_MAPS = "maps/SEARCH_MAPS"

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

const setMap = (payload) => ({
    type: SET_MAP,
    payload
})

const searchMaps = (payload) =>({
    type: SEARCH_MAPS,
    payload
})

//thunks
export const setMapData = index => async (dispatch) =>{
    const response = await fetch(`/api/maps/page/${index}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if(data.errors){
        return data
    }
    dispatch(setMap(data))
    return data
}

export const addMapData = (payload) => async (dispatch) => {
    const {name, map_data, user_id, map_image} = payload
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
            columns,
            map_image
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
    const {name, map_data, user_id, id, map_image} = payload
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
            columns,
            map_image
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
    const {value} = payload;
    const response = await fetch(`/api/maps/load/${value}`)
    const data = await response.json();
    if (data.errors){
        return data;
    }
    dispatch(getMap(data))
    return data
}

export const searchMapData = (payload) => async (dispatch) => {
    const {value} = payload;
    const response = await fetch(`/api/maps/${value}`)
    const data = await response.json();
    if (data.errors){
        return data;
    }
    dispatch(searchMaps(data))
    return data
}

const initialState = {}

export default function reducer(state = initialState, action){
    let newState;
    switch (action.type){
        case SET_MAP:
            newState = {
                ...state,
                ...action.payload.maps
            }
            return newState
        case ADD_MAP:
            newState = {...state}

            // newState = {
            //     ...state,
            //     [action.payload.id] : action.payload
            // }
            return newState
        case GET_MAP:
            newState = {...state}
            newState = {
                ...state,
                [action.payload.id] : action.payload,
            }
            return newState
        case DELETE_MAP:
            newState = {...state}
            delete newState[action.payload.id]
            return newState
        case SEARCH_MAPS:
            newState = {...state}
            newState = {
                ...state,
                ...action.payload.maps
            }
            return newState
        case REMOVE_USER:
            return newState = {}
        default:
            return state;
    }
}

import { ADD_MAP, DELETE_MAP } from "./map"
// constants
export const SET_USER = "session/SET_USER"
export const REMOVE_USER = "session/REMOVE_USER"
export const GET_USER_MAP_BY_INDEX = "session/GET_USER_MAP_BY_INDEX"
export const SET_INDEX = "session/SET_INDEX"

// action creators
const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

const removeUser = () => ({
    type: REMOVE_USER,
})

const setUsersMapByIndex = (payload) => ({
    type: GET_USER_MAP_BY_INDEX,
    payload
})

export const setIndex = (payload) => ({
    type: SET_INDEX,
    payload
})

// thunks
export const authenticate = () => async (dispatch) => {
    const response = await fetch('/api/auth/', {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (data.errors) {
        return;
    }
    dispatch(setUser(data))
    return data
}

export const login = (email, password) => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(setUser(data))
    return {}
}

export const demologin = () => async (dispatch) => {
    const response = await fetch('/api/auth/login/demo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(setUser(data))
    return {}
}

export const logout = () => async (dispatch) => {
    const response = await fetch("/api/auth/logout", {
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await response.json();
    if(data.errors){
        return data
    }
    dispatch(removeUser());
};


export const signUp = (username, email, password, profileImage) => async (dispatch) => {
    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    // for single file
    if (profileImage) formData.append("image", profileImage);

    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "enctype": "multipart/form-data",
        },
        body: formData,
    });

    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(setUser(data))
    return {};
}

export const edit = payload => async (dispatch) => {
    const {id, username, email, profileImage, password} = payload

    const date = new Date()

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("updated_at", date)

    if (password) formData.append("password", password);
    if (profileImage) formData.append("image", profileImage);

    const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
            "enctype": "multipart/form-data",
        },
        body: formData,
    });

    const data = await response.json();

    if (data.errors) {
        return data;
    }

    dispatch(setUser(data))
    return data
}

export const fetchMapsByIndex = index => async (dispatch) =>{
    const response = await fetch(`/api/users/maps/${index}`)

    const data = await response.json();

    if(data.errors) {
        return data;
    }

    dispatch(setUsersMapByIndex(data))
    return data
}

const initialState = {
                    user: null,
                    maps: null,
                    user_maps_offset: [],
                    maps_offset: [],
                    map_total: null,
                    current_index: null,
            }

export default function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = {...state.user, ...state.maps,
                        ...state.user_maps_offset, ...state.maps_offset,
                        ...state.map_total,
                        ...state.current_index
                    }

            newState.maps = action.payload.maps
            newState.map_total = action.payload.map_total
            newState.current_index = 1
            //save memory? i guess
            delete action.payload.maps
            newState.user = action.payload
            return newState
        case ADD_MAP:
            newState = {...state}

            if(!newState.maps[action.payload.id]){
                newState.map_total += 1
            }

            newState.maps = {
                ...state.maps,
                [action.payload.id] : {
                    ...action.payload,
                }
            }

            return newState
        case GET_USER_MAP_BY_INDEX:
            newState = {...state}

            newState.maps = {...action.payload}

            return newState
        case REMOVE_USER:
            newState = {...state.user, ...state.maps,
                        ...state.user_maps_offset, ...state.maps_offset}
            return newState = {}
        case SET_INDEX:
            newState = {...state}

            newState.current_index = action.payload

            return newState
        case DELETE_MAP:
            newState = {...state}

            newState.map_total -= 1
            delete newState.maps[action.payload.id]

            return newState
        default:
            return state;
    }
}

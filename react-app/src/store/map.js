//constants
const ADD_MAP = "maps/ADD_MAP"

//action creators
const addMap = (payload) => ({
    type: ADD_MAP,
    payload
})

//thunks
export const addMapData = (payload) => async (dispatch) => {
    let {name, map_data, user_id} = payload

    name = JSON.stringify(name)
    user_id = JSON.stringify(user_id)

    const response = await fetch("/api/maps", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            name,
            map_data,
            user_id
        }
    });
    const data = await response.json();
    if (data.errors) {
        return data;
    }
    dispatch(addMap(data))
    return data
}


const initialState = {
    maps: null,
    owned_maps: null,
}

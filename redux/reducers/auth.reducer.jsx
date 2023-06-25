import KEYS from "../keys";

const initialState = {
    IS_REQUEST: false,
    IS_SUCCESS: false,
    IS_FAILURE: false,
}

export default function reducer (state = initialState, action) {
    switch(action.type) {
        default: 
            return state;
    }
}
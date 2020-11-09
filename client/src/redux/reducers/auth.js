import { CHECK_LS_TOKEN, LOAD_USER_DATA } from '../actions/auth';

const initialState = {
    isFetching: false,
    user:{
        role: 'Guest'
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        case CHECK_LS_TOKEN:
            return {
                ...state,
                isFetching: true
            }
        case LOAD_USER_DATA:
            return {
                isFetching: false,
                user: action.payload
            }
    
    }
    return state;
}
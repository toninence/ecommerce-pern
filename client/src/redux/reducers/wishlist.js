import { REQUEST_WISHLIST_IDS, RECEIVE_WISHLIST_IDS } from '../actions/wishlist';

const initialState = {
    isFetching: false,
    productIDs: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case REQUEST_WISHLIST_IDS:
            return {
                ...state,
                isFetching: true
            }
        case RECEIVE_WISHLIST_IDS:
            return {
                isFetching: false,
                productIDs: action.payload
            }
    }

    return state;
}
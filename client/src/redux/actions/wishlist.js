import axios from 'axios';

export const REQUEST_WISHLIST_IDS = 'REQUEST_WISHLIST_IDS';
export const RECEIVE_WISHLIST_IDS = 'RECEIVE_WISHLIST_IDS';
export const GET_WISHLIST_IDS = 'GET_WISHLIST_IDS';

export const requestWishlistIDs = () => {
    return {
        type: REQUEST_WISHLIST_IDS
    }
}

export const receiveWishlistIDs = array => {
    return {
        type: RECEIVE_WISHLIST_IDS,
        payload: array
    }
}

export const getWishlistIDs = user_id => {
    return dispatch => {
        dispatch(requestWishlistIDs);
        axios.get(`http://localhost:3001/users/${user_id}/wishlist`)
        .then(response => {
            const { data } = response;
            let wlProductIDs = [];

            data.forEach( p => {
                wlProductIDs.push(p.product_id);
            });
            //Sólo rescato de cada producto de la wishlist su product_id, para guardar en la store un array con sólo ese dato de cada uno
            dispatch(receiveWishlistIDs(wlProductIDs));
        })
    }
}
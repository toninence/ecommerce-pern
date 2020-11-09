import axios from 'axios';
import { getWishlistIDs } from './wishlist';

//acciones para el login/logout/¿registro?

export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const CHECK_LS_TOKEN = 'CHECK_LS_TOKEN';

export const checkLSToken = () => {
    //Setea isFetching a true
    return {
        type: CHECK_LS_TOKEN
    }
}

export const loadUserData = (userData) => {
    //Setea isFetching a false, y carga datos a state.auth.user
    return {
        type: LOAD_USER_DATA,
        payload: userData
    }
}

export const checkSession = token => {
    return dispatch => {
        //Si el token es null, no lo mando
        if(token === null) return dispatch(
            loadUserData({
                role: 'Guest'
            })
        );

        //isFetching = true;
        dispatch(checkLSToken());
        axios.get('http://localhost:3001/auth/me', 
            {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            }
        )
        .then(response => {
            //isFetching = false;
            //Cargamos los datos del usuario al store de redux
            dispatch(loadUserData(response.data.user));
            //Traemos los IDs de cada producto de la wishlist del usuario que se logeó
            dispatch(getWishlistIDs(response.data.user.user_id));
        }
        )
        .catch(err => console.log('ERROR EN LLAMADO A /auth/me:', err));
    }

}
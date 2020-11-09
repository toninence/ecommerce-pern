import React from 'react'
import GoogleLogin from 'react-google-login'
import {GoogleButton} from 'react-google-button';
import axios from 'axios';
import styles from './register.module.scss'
//Redux
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadUserData } from '../../redux/actions/auth';
import { fetchUserCart } from '../../redux/actions/cart';
import { FcGoogle } from 'react-icons/fc'
function Google (props) {
    const { loadUserData, fetchUserCart } = props;
    const history = useHistory();

    let userIdParaFetch;

    const responseSuccess=(googleResponse) => {
        axios.post("http://localhost:3001/auth/externalLogin?external=google",{
            email : googleResponse.profileObj.email,
            first_name : googleResponse.profileObj.givenName,
            last_name : googleResponse.profileObj.familyName
        })
        .then( response =>{
            // el objeto user tiene los datos relevantes del usuario ( id, nombre, apellido,rol)
            // el objeto accessToken es el token de sesion
            //Sacamos el accessToken y la información del usuario de la respuesta
            const { user, accessToken } = response.data
            userIdParaFetch = user.user_id;
            //Llamando a loadUserData, mandamos el usuario recibido como respuesta a la store de Redux
            loadUserData(user);
            //El accessToken, por otro lado, lo guardamos en el Local storage
            localStorage.setItem("actualToken", accessToken);
            
            //Mandar carrito localStorage al del usuario que se está logeando con google:
            const lStorCart = localStorage.getItem('guestCart');
            if(lStorCart != null){
                //Si no está vacío, osea, no es null, lo parseo
                let currentCart = JSON.parse(lStorCart);
                //Y a cada producto se lo mando al carrito del usuario logeado
                currentCart.products.forEach(prod => {
                    axios.post(`http://localhost:3001/users/${user.user_id}/cart`, {
                    product_id: prod.product_id,
                    quantity: 1,
                    price: prod.price
                    });
                });
                //Por último, vacío el carrito local
                localStorage.removeItem('guestCart');
            }
        })
        .then(()=>fetchUserCart(userIdParaFetch))
        .then(()=>history.push('/'))
        .catch(err => console.log('error en responseSuccess al logearse con Google:', err))
    }

    const responseFailure = (response) =>{
        console.log(response)
    }

    return (
            <GoogleLogin
            //guardarla en .env
            clientId='243862763103-9oer77jtoipa8qhd4ooflsjv5u31lmj2.apps.googleusercontent.com'
            buttonText='Ingresar'
            onSuccess={responseSuccess}
            onFailure={responseFailure}
            cookiePolicy={'single_host_origin'}
            className={styles.googleButton}
            render={renderProps => (
                <button className='btn d-flex justify-content-around align-items-center' onClick={renderProps.onClick} style={{width: '100%', maxWidth: '200px', backgroundColor: 'cornflowerblue', color:'white'}}><FcGoogle style={{height: '100%'}}/>Login with Google</button>
              )}
            />
    )
}

const mapDispatchToProps = dispatch => {
    return {
        loadUserData: data => dispatch(loadUserData(data)),
        fetchUserCart: user_id => dispatch(fetchUserCart(user_id))
    }
}

export default connect(null, mapDispatchToProps)(Google);
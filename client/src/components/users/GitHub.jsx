import React from 'react'
import GitHubLogin from 'react-github-login';
import axios from 'axios';

//Redux
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadUserData } from '../../redux/actions/auth';
import { fetchUserCart } from '../../redux/actions/cart';
import styles from './register.module.scss';

import style from './github.module.scss';
import { FaGithub } from 'react-icons/fa'
function Github(props) {

    const { loadUserData, fetchUserCart } = props;
    const history = useHistory();

    let userIdParaFetch;

    const onSuccess = resp => {
        console.log(resp);
        axios.get(`http://localhost:3001/auth/githublogin/${resp.code}`)
        //.then( response => console.log(response))
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
    const onFailure = response => console.error(response);
    return (
        
        <GitHubLogin className={`btn d-flex justify-content-around align-items-center ${style.githubButton}`}
        clientId="658de51c3bbf0db736fc"
        redirectUri="http://localhost:3000"
        onSuccess={onSuccess}
        onFailure={onFailure}
        >
            <FaGithub/> Login with GitHub</GitHubLogin>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        loadUserData: data => dispatch(loadUserData(data)),
        fetchUserCart: user_id => dispatch(fetchUserCart(user_id))
    }
}

export default connect(null, mapDispatchToProps)(Github);
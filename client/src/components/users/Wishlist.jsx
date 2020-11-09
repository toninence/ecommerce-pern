import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {  Button } from '@material-ui/core';
import {FaRegTrashAlt} from 'react-icons/fa'

import styles from './wishlist.module.css'

//Redux
import { fetchUserCart } from '../../redux/actions/cart'
import { connect } from 'react-redux';


const Wishlist = props => {
    const history = useHistory();

    const { user, isFetching, fetchUserCart } = props;
    if(!isFetching && user.role === 'Guest'){
        history.push('/');
    }

    const [ products, setProducts ] = useState([]);

    const getWishlist = () => {
        axios.get(`http://localhost:3001/users/${user.user_id}/wishlist`)
        .then(resp => setProducts(resp.data))
        .catch(err => {if(!isFetching)console.log('ERROR AL TRAER WISHLIST', err)});
    }

    const enviarACarrito =  (product_id,quantity,price) => {        
        axios.post(`http://localhost:3001/users/${user.user_id}/cart`, {
            product_id : product_id,
            quantity : quantity, 
            price : price,
        })
        .then( () => {
            fetchUserCart(user.user_id);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const eliminarDeWishlist = product_id => {
        axios({
            method: 'DELETE',
            url: `http://localhost:3001/users/${user.user_id}/wishlist`,
            data: {
                product_id
            }
        })
        .then(respuesta => setProducts(respuesta.data))
        .catch(err => console.log('ERROR AL ELIMINAR PRODUCTO DE LA WISHLIST:', err));
    }

    useEffect(()=>{
        if(!isFetching) getWishlist();
    }, [isFetching]);

    return (
        <div className={styles.container}>
            <table className={styles.tablaContenedora}>

                <tbody>
                    <div>
                    {(isFetching== false && !products.length)?<h1 className={styles.titleWish}>No tienes productos en tu lista de deseados</h1>:<h1 className={styles.titleWish}>Tu lista de deseados</h1>}
                    </div>
                    {isFetching==false && !products.length?<div className={styles.contBack}>
                        <Link className={styles.backCatalogo} to='/products'>Volver al catálogo</Link>
                    </div>:null}
                    {products.length ? products.map( p => 
                        <tr  key={p.product_id}>
                            <div className={styles.rowWish}>

                            <div className={styles.imgNameSection}>

                            <td>
                                <img className={styles.imageWish} src={p.images[0].img_url} alt={p.name}/>
                            </td>

                            <td className={styles.priceNameWish}><Link to={`/products/${p.product_id}`}>{p.name}</Link> <p className={styles.price}>${p.price}</p> <p className={styles.description}>{p.description.substr(0,150)}</p></td>

                            </div>

                            <td className={styles.buttonSection}>
                                
                                <Button
                                    onClick={() => enviarACarrito(p.product_id, 1, p.price)}
                                    className={styles.buttonCart}
                                >
                                    Agregar al carrito
                                </Button>

                                <Button
                                    onClick={() => {
                                        console.log('PRODUCTO:', p)
                                        eliminarDeWishlist(p.product_id)
                                    }}
                                    className={styles.buttonDelete}

                                >
                                    <FaRegTrashAlt/>
                                </Button>
                            </td>
                            </div>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        isFetching: state.auth.isFetching
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUserCart: user_id => dispatch(fetchUserCart(user_id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
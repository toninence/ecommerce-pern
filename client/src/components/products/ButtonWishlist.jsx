import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button } from "react-bootstrap";
import { connect } from 'react-redux';
import styles from './ProductCard.module.css'
import { getWishlistIDs } from '../../redux/actions/wishlist';


const ButtonWishlist = props => {
    const { product_id, wishlistProductIDs } = props;

    //Redux
    const { user, getWishlistIDs } = props;

    //Si el producto está en la wishlist del usuario logeado, isFav será true
    const isFav = wishlistProductIDs.includes(product_id);

    const agregarAWishlist = () => {
        console.log('HOLA');
        axios.post(`http://localhost:3001/users/${user.user_id}/wishlist`,
            {
                product_id: product_id
            })
            .then(() => getWishlistIDs(user.user_id))
            .catch(err => console.log('ERROR AL AGREGAR A WISHLIST DESDE PRODUCTCARD', err))
    }

    const removerDeWishlist = () => {
        console.log('HOLAAAAA');
        axios({
            method: 'DELETE',
            url: `http://localhost:3001/users/${user.user_id}/wishlist`,
            data: {
                product_id: product_id
            }
        })
            .then(() => getWishlistIDs(user.user_id))
            .catch(err => console.log('ERROR AL ELIMINAR DE WISHLIST DESDE PRODUCTCARD', err))
    }


    return (
        <>
            {
                user.role !== 'Guest' ?
                <Button
                    className={styles.buttonWish}
                    onClick={isFav ? removerDeWishlist : agregarAWishlist}
                >
                {
                isFav ?
                    <AiFillHeart />
                    : <AiOutlineHeart />
                }
                </Button>
                : null
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getWishlistIDs: user_id => dispatch(getWishlistIDs(user_id))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ButtonWishlist);
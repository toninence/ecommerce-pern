import React, { useEffect } from "react";
import { Link } from "react-router-dom"
import { Button, Carousel } from "react-bootstrap"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { useState } from 'react'
import styles from './ProductCard.module.css'
import axios from 'axios';

//Redux
import { connect } from 'react-redux';
import { fetchUserCart } from '../../redux/actions/cart';
import { getWishlistIDs } from '../../redux/actions/wishlist';

import ButtonWishlist from './ButtonWishlist';

const HowManyStars = (review) => {
    switch (review) {
        case 1:
            return <span>
                {<AiFillStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}

            </span>//1 sola estrella

        case 2:
            return <span>
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}

            </span>//3 estrellas

        case 3:
            return <span>
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
            </span> //3 estrellas

        case 4:
            return <span>
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiOutlineStar />}
            </span>//4 estrellas

        case 5:
            return <span>
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiFillStar />}
                {<AiFillStar />}
            </span> //3 estrellas

        default:
            return <span>
                {<AiOutlineStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
                {<AiOutlineStar />}
            </span> //estrellas vacias
    }
}
// props.data.images.length && <img src={props.data.images && props.data.images[0].img_url} className="card-img" alt={`Imagen ${props.data.name}`}/>
const ProductCard = (props) => {
    const { user, fetchUserCart, wishlistProductIDs, isFetching } = props;

    const [flag, setFlag] = useState(true);

    const [index, setIndex] = useState(0)
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const enviarACarrito = async (product_id, quantity, price) => {
        if (user.role === 'Guest') {
            const lStorCart = localStorage.getItem('guestCart');

            if (lStorCart == null) {
                let currentCart = {
                    products: []
                }
                currentCart.products.push(props.data);
                return localStorage.setItem('guestCart', JSON.stringify(currentCart));
            } else {
                let currentCart = JSON.parse(lStorCart);
                currentCart.products.push(props.data);
                return localStorage.setItem('guestCart', JSON.stringify(currentCart));
            }
        }

        await axios.post(`http://localhost:3001/users/${user.user_id}/cart`, {
            product_id: product_id,
            quantity: quantity,
            price: price,
        })
            .then(() => {
                fetchUserCart(user.user_id)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    useEffect(() => {
        getWishlistIDs(user.user_id)
    }, [flag]);

    return (
        <div className={`${styles.linkProductCard} mr-4 mb-3  ${props.data.stock <= 0 ? `${styles.noDisponible}` : null} `}>
            
            

            <div className={`${styles.card} d-flex ${styles.productCard} mr-3 mx-auto ${styles.cardStyles}`} >
                <Carousel className={`${styles.carouselCard} ${styles.cardImg}`} controls={props.data.images.length >= 2 && true} activeIndex={index} onSelect={handleSelect} >{props.data.images.map(function (image) {
                    return <Carousel.Item key={image.img_id}><img className={`d-block w-100 `} controls={false} src={image.img_url} /></Carousel.Item>
                })}
                </Carousel>

                <div className="info-card">
                    <h5 className={`card-title ${styles.productTitle}`}>{props.data.name}</h5>
                    <p className={`card-star ${styles.estrella}`}>{HowManyStars(props.data.rating)}</p>
                    <p className="card-text font-weight-bold">$ {Number.parseFloat(props.data.price).toFixed(2)}</p>
                </div>
                <hr className="hr" />
                {/* Si el producto está en la wishlist del usuario logeado, se muestra el ícono AiFillHeart, sino, AiOutlineHeart */}
                
                <ButtonWishlist
                    className={styles.buttonWishA}
                    product_id={props.data.product_id}
                    wishlistProductIDs={wishlistProductIDs}
            />

                <Link to={`/products/${props.data.product_id}`}  >
                    <Button className={`mt-2 w-75 align-self-center nodisplay`} className={`${styles.btnComprar}`} >Ver detalles</Button>
                </Link>

                {props.data.stock ?
                    <Button className={`mt-2 w-75 align-self-center nodisplay`} className={`${styles.btnComprar}`} onClick={() => enviarACarrito(props.data.product_id, 1, props.data.price)} >Agregar al carrito</Button>
                    :
                    <Button className={`mt-2 w-75 align-self-center nodisplay`} style={{ backgroundColor: 'gray' }} className={`${styles.btnComprar}`}>Agregar al carrito</Button>}


            
            </div>
            
        </div>
    )
}


const mapStateToProps = state => {
    return {
        user: state.auth.user,
        wishlistProductIDs: state.wishlist.productIDs,
        isFetching: state.wishlist.isFetching
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUserCart: user_id => dispatch(fetchUserCart(user_id)),
        getWishlistIDs: user_id => dispatch(getWishlistIDs(user_id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
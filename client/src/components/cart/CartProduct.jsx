import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap'
import styles from './CartProduct.module.css';

import { connect } from 'react-redux';
import {changeQuantity,deleteProduct,fetchUserCart} from '../../redux/actions/cart'


const CartProduct = props => {
    //Redux
    const { user, fetchUserCart, changeQuantity, deleteProduct } = props;
    //Info del producto
    const { name, price, quantity, product_id, stock, description, product, images } = props;
    
    const sumarCantidad = (e,product) =>{
        e.preventDefault()
        const newQuantity = product.LineaDeOrden.quantity+1
        changeQuantity(user.user_id, product.product_id, newQuantity);
        fetchUserCart(user.user_id);
    }
    const restarCantidad = (e,product) =>{
        e.preventDefault();
        const newQuantity = product.LineaDeOrden.quantity - 1
        changeQuantity(user.user_id, product.product_id, newQuantity);
        fetchUserCart(user.user_id);
    }

    const eliminarProducto = async (user_id, product_id) => {
        await deleteProduct(user_id, product_id)
        await fetchUserCart(user.user_id)
    }

    useEffect(()=>{
        fetchUserCart(user.user_id);
    }, [quantity]);

    return (
        <div key={product_id} className='d-flex mb-4'>
        <div className="imagen col-md-2 text-center d-flex align-items-center justify-content-center">
            <img src={images[0].img_url} style={{height: '60px'}}/>
        </div>
        <div className="descripcion col-md-5 d-flex flex-column">
            <h4 className='font-weight-bold'>{name}</h4>
            <h5 className={styles.description}>{ `${description.substr(0,100)}...`}</h5>
        </div>
        <div className="cantidad col-md-2 text-center" style={{padding:0}}>
            <div className="col-md-12 mb-1">
                <Form.Control type="text" value={quantity} className='m-auto col-md-4 text-center' />
            </div>
            <div className="buttons">
                <Button className={`${styles.masMenos}`} onClick={ e => quantity > 1 && restarCantidad(e,product)}>-</Button>
                <Button className={`${styles.masMenos}`} onClick={ e => sumarCantidad(e,product)} >+</Button>
            </div>
            <Form.Text className="text-muted">Stock: {stock} </Form.Text>
        </div>

        <div className="precio col-md-2 d-flex align-items-center justify-content-center ">
            <h3 className={styles.price}>${price*quantity}</h3>
        </div>

        <div className='eliminar col-md-1 d-flex justify-content-center align-items-center'>
            <Button variant='danger' onClick={ () =>eliminarProducto(user.user_id, product_id) }>
            <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg> 
            </Button>
        </div>    
       
    </div> 

    )
}

const mapStateToProps = state => {
    return {
        user : state.auth.user
    }
}


const mapDispatchToProps = (dispatch, props) => {
    return {
        deleteProduct: (userId, product_id) => dispatch(deleteProduct(userId, product_id)),
        fetchUserCart: (userId) => dispatch(fetchUserCart(userId)),
        changeQuantity: (userId, product_id, quantity) => dispatch(changeQuantity(userId, product_id, quantity)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartProduct);
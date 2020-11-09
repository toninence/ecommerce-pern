import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import styles from './index.module.scss'
import {  useDispatch, connect } from 'react-redux'
//import { receiveProducts,fetchProducts, fetchUserCart, setId, changeQuantity, deleteProduct } from '../../redux/actions/actions'
import {receiveCartData,changeQuantity,deleteProduct,fetchUserCart} from '../../redux/actions/cart'
import {fillOrderData} from '../../redux/actions/order'

import axios from "axios";
import {Link,useHistory} from 'react-router-dom'

function GuestCart(props) {
    const dispatch = useDispatch()
    const history =useHistory()

    const { userInfo } = props;
    //let products = props.products || [];
    const [products, setProducts ] = useState(props.products)

    const deleteProduct = (pId) => {
        const lStorCart = JSON.parse(localStorage.getItem('guestCart'));

        lStorCart.products = lStorCart.products.filter( p => p.product_id != pId);
        setProducts(products.filter( p => p.product_id != pId))

        // console.log(lStorCart)
        return localStorage.setItem('guestCart', JSON.stringify(lStorCart));
    }
    useEffect(()=>{
    }, [products])
    return (
    <div className={`${styles.card} offset-1 col-md-10 col-12 mt-3 pt-4 pb-4`}>
            <h4 className='text-center pb-3'>Carrito de Invitado </h4>
            {products.length ? products.map( product =>                 
               <div className='d-flex justify-content-center mb-4'>
                    <div className="imagen col-md-2 text-center d-flex align-items-center justify-content-center">
                        <img src={product.images[0].img_url} style={{height: '60px'}}/>
                    </div>
                    <div className="descripcion col-md-5 d-flex flex-column">
                        <h4 className='font-weight-bold'>{product.name}</h4>
                        <h5 className={styles.description}>{ `${product.description.substr(0,100)}...`}</h5>
                    </div>
                    <Form.Text className="text-muted">Stock: {product.stock} </Form.Text>
                    <div className='eliminar col-md-1 d-flex justify-content-center align-items-center'>
                        <Button variant='danger' onClick={()=>deleteProduct(product.product_id)}>
                        <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg> 
                        </Button>
                    </div>    
                   
                </div> 
            ):<h3 style={{margin:'auto'}}>No hay productos en tu carrito, hace click <Link to='/products'>acá</Link> para continuar tu compra</h3>}

            {/* {products.length ?
            // <span>Precio total: {products.reduce((acc, p) => acc + 0, 0)}</span>
             : null} */}
             <br></br>
             <h5 className='text-center pb-3'>Para concretar la compra y/o modificar cantidades, <a href='/login'>inicia sesión</a></h5>
            
        </div>
    )
}

const mapStateToProps = state => {

    return {

        userInfo : state.auth
    }
}
  
const mapDispatchToProps = (dispatch, props) => {

    return {}
}
    
export default connect(mapStateToProps, mapDispatchToProps)(GuestCart);
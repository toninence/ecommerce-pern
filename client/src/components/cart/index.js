import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import styles from './index.module.scss'
import { connect } from 'react-redux'
import {receiveCartData,changeQuantity,deleteProduct,fetchUserCart} from '../../redux/actions/cart'
import {fillOrderData} from '../../redux/actions/order';
import CartProduct from './CartProduct'

import axios from "axios";
import {Link,useHistory} from 'react-router-dom';

import GuestCart from './guestCart'

function Cart({cartData, products, isFetching,userInfo,fetchUserCart,deleteProduct,changeQuantity,fillOrderData,emptyCart}) {
    const history =useHistory()
    const [cant, setCant] = useState(1)
    //const [idCarrito,setIdCarrito] = useState()

    //Productos locales para pasarle al carrito guest
    const localStorageCart = JSON.parse(localStorage.getItem('guestCart')) ||  { products: [] }


    const checkout= (orderId) =>{
        fillOrderData(cartData)

        axios.put(`http://localhost:3001/orders/${orderId}`,{
            state : "Creada"
        })
        .then(() => emptyCart() )
        .then(() => history.push('/order'))
        .catch(err => console.log('error al ir a checkout:', err))
    }
    

    // const sumarCantidad = (e,product) =>{
    //     e.preventDefault()
    //     const newQuantity = product.LineaDeOrden.quantity+1
    //     changeQuantity(userInfo.user_id, product.product_id, newQuantity)
    //     setCant(newQuantity)
    // }
    // const restarCantidad = (e,product) =>{
    //     e.preventDefault();
    //     const newQuantity = product.LineaDeOrden.quantity - 1
    //     changeQuantity(userInfo.user_id, product.product_id, newQuantity)
    //     setCant(newQuantity)
    // }

    // const eliminarProducto = async (user_id, product_id) => {
    //     await deleteProduct(user_id, product_id)
    //     await fetchUserCart(userInfo.user_id)
    // }
    
    useEffect( () => {
        fetchUserCart(userInfo.user_id)
    }, [userInfo,cant])
  
    //Si no hay usuario logeado, retorna carrito de guest que saca sus productos de localStorage, en vez del carrito normal
    if(userInfo.role === 'Guest') return <GuestCart products = {localStorageCart.products}/>
    return (
    <div className={`${styles.card} offset-1 col-md-10 col-12 mt-3 pt-4 pb-4`}>
            <h4 className='text-center pb-3'>Carrito de { userInfo.first_name } {userInfo.last_name} </h4>
            {products.length ? products.map( product => 
                <CartProduct
                    product={product}
                    name={product.name}
                    description={product.description}
                    stock={product.stock}
                    price={product.LineaDeOrden.price}
                    quantity={product.LineaDeOrden.quantity}
                    product_id={product.product_id}
                    images={product.images}
                />
            ):<h3 style={{margin:'auto'}}>No hay productos en tu carrito, hace click <Link to='/products'>acá</Link> para continuar tu compra</h3>}

            {products.length ?
            <span style={{textAlign:'end',fontWeight:'bold',fontSize:'20px',marginBottom:'10px',marginRight:'20px'}}>Precio total: ${products.reduce((acc, p) => acc + (p.LineaDeOrden.price * p.LineaDeOrden.quantity), 0)}</span>
             : null}
             
            <span  className={`d-flex justify-content-end`} >
                <Button className="btn btn-warning font-weight-bold" style={{width:'15%'}} onClick={() => checkout(cartData.order_id)} >SIGUIENTE</Button>            
            </span>
            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isFetching: state.cart.isFetching,
        cartData: state.cart.cartData,
        products: state.cart.cartData.products || [],
        userInfo : state.auth.user
    }
}
  
const mapDispatchToProps = (dispatch, props) => {
    const emptyCartData =  {
            products : []
        }    
    return {
        deleteProduct: (userId, product_id) => dispatch(deleteProduct(userId, product_id)),
        fetchUserCart: (userId) => dispatch(fetchUserCart(userId)),
        changeQuantity: (userId, product_id, quantity) => dispatch(changeQuantity(userId, product_id, quantity)),
        fillOrderData: (data) => dispatch(fillOrderData(data)),
        emptyCart : () => dispatch(receiveCartData(emptyCartData))
    }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(Cart)
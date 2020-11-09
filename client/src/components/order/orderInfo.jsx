import React, { useEffect } from 'react'
import styles from './orderStyle.module.css'
import {  useDispatch, connect } from 'react-redux'
import {set_id,axiosProducts} from '../../redux/actions/order_info'
import {useParams}  from 'react-router-dom'


function OrderInfo(props){
	const dispatch = useDispatch()
	const { id } = useParams()
	
	
	const sumaTotal=()=>{
		var suma = 0
		props.products_order.map(product => 
			suma += product.price*product.LineaDeOrden.quantity
			) 
		// console.log(suma)
		return suma
		
	}
	
	

	useEffect(() => {
        dispatch(set_id(id))
        dispatch(axiosProducts(id))
    }, [])
	




	return(
		<div className='col-md-10 offset-1 mt-3'>

			<div className="card container" style={{width: 50+'rem'}}>
			  <div className="card-body">
			    <h5 className="card-title">ORDEN ID: {id} </h5>
			    <h5 className="card-title"> Productos:  </h5>
			    <p className="card-text ">
			    <ul>
			   		{ props.products_order.map(product => 
			   			<li>
			    			{product.name}, Precio: $ {product.LineaDeOrden.price}, cantidad:  {product.LineaDeOrden.quantity}
			    		</li>   
			    	)}
			    </ul> 
			    </p>
			    <p className="card-text">{
			    	
			    	"TOTAL: $" + sumaTotal()
			    	

			    }  </p>
			    <span><a onClick={ () => window.history.back()} className="btn btn-primary"> BACK</a></span>
			  </div>
			</div>
		</div>
		)
}


const mapStateToProps = state => {
  const productsOrder = state.orderInfo.products_order
  
  return {
    products_order: productsOrder,
             
    }
}
  
const mapDispatchToProps = (dispatch, props) => {
    
}
    


export default connect(mapStateToProps, [])(OrderInfo)
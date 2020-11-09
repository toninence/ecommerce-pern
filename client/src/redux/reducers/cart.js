
import { 
	REQUEST_CART_DATA,
	RECEIVE_CART_DATA,
	REQUEST_DELETE,
	RECEIVE_DELETE,
	REQUEST_QUANTITY,
	RECEIVE_QUANTITY,
	
} from '../actions/cart'


const initialState = {
	isFetching: false,
    didInvalidate: false,	
	cartData : {
		products : []
	}
	
};

export default (state= initialState, action) => {

	switch(action.type){
		case(REQUEST_QUANTITY):
		return {
			...state,
			isFetching: true,
		}
		case(RECEIVE_QUANTITY):
		const products = state.cartData.products.map(prod => {
			if(prod.product_id === action.payload.product_id) prod.quantity = action.payload.quantity
			return prod
		})
		return {
			...state,
			isFetching: false,
			cartData : {
				...state.cartData,
				products: products
			}
		}
		case(REQUEST_CART_DATA):
			return{
				...state,
				isFetching: true,
		}
		case(RECEIVE_CART_DATA):
			return{
				...state,
				isFetching: false,
				cartData: action.cartData
			}
		
		case(REQUEST_DELETE):
			return {
				...state,
				isFetching: true,
			}

		case(RECEIVE_DELETE):
			
			return {
				...state,
				isFetching: false,
				cartData : {
					...state.cartData,
					products: state.cartData.products.filter(product => product.product_id !== action.payload)
				}
			}
		}

	return state;
	
}
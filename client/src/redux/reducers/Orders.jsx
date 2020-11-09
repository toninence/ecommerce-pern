import { 
    REQUEST_ORDERS, 
    RECEIVE_ORDERS, 
    CHANGE_STATUS, 
    REQUEST_CHANGE_STATUS, 
    RECEIVE_CHANGE_STATUS 
} from '../actions/Orders'

const initialState = {
    /* Cada objeto order va a tener un order_id, un user_id y un status */
	isFetching: false,
    didInvalidate: false,
	orders : [],
	// modo de envio , fecha de envio
};

export default (state= initialState, action) => {

	switch(action.type){

        case(REQUEST_CHANGE_STATUS):
        return {
            ...state,
            isFetching: true,
        }
		case(RECEIVE_CHANGE_STATUS):
			return {
                ...state,
                isFetching: false,
				orders: state.orders.map( order => {
                    if(order.order_id === action.order_id){
                        order.state = action.state
                    }
                    return order
                }) 
            }

        case(REQUEST_ORDERS):
        return {
            ...state,
            isFetching: true,
        }

        case(RECEIVE_ORDERS):
            return {
                ...state,
                isFetching: false,
                orders: action.orders,
            }
	}

	return state;
	
};
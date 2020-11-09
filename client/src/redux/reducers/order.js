import {
	FILL_ORDER_DATA
} from '../actions/order'

const initialState = {
	orderData : {
		products : []
	}


}


export default (state= initialState, action) => {
	switch(action.type){
		case FILL_ORDER_DATA:
			return{
				...state,
				orderData : action.payload

			}

	}
	return state
}
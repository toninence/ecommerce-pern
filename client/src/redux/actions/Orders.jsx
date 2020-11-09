import order from "../../components/order";

export const CHANGE_STATUS = 'CHANGE_STATUS';
export const REQUEST_ORDERS = 'REQUEST_ORDERS'
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS'
export const REQUEST_CHANGE_STATUS = 'REQUEST_CHANGE_STATUS'
export const RECEIVE_CHANGE_STATUS = 'RECEIVE_CHANGE_STATUS'



export const changeStatus = (state, order_id) => {
    console.log('state', state, 'orderId', order_id)
    return dispatch => {
        dispatch(requestChangeStatus());

        

        fetch(`http://localhost:3001/orders/${order_id}`, {
            method: 'PUT',
            body: JSON.stringify({state:state}), // 
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then( response => response.text())
        .then( json => dispatch(receiveChangeStatus(state, order_id)))
    }
}

export const receiveChangeStatus = (state, order_id) =>{
	return{
        type: RECEIVE_CHANGE_STATUS,
        isFetching: false,
        state,
        order_id,
	}
}
export const requestChangeStatus = () => {
    return {
        type: REQUEST_CHANGE_STATUS,
        isFetching: true,
	}
}
export function fetchOrders() { 
    return dispatch => {
        dispatch(requestOrders())
        fetch(`http://localhost:3001/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
            }
        })
        .then( response => response.json())
        .then( json => dispatch(receiveOrders(json)))
        
    }
}
export function fetchOrdersUserId(user_id) { 
    return dispatch => {
        dispatch(requestOrders())
        fetch(`http://localhost:3001/users/${user_id}/orders`)
        .then( response => response.json())
        .then( json => dispatch(receiveOrders(json)))        
    }
}
export function fetchOrdersFilter(status) { 
    return dispatch => {
        dispatch(requestOrders())
        fetch(`http://localhost:3001/orders?status=${status}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
            }
        })
        .then( response => response.json())
        .then( json => dispatch(receiveOrders(json))) 
    }
}

export function fetchOrdersId(order_id) { 
    return dispatch => {
        dispatch(requestOrders())
        fetch(`http://localhost:3001/orders/table/${order_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
            }
        })
        .then( response => response.json())
        .then( json => dispatch(receiveOrders(json))) 
    }
}

export const requestOrders = () => {
	return {
        type: REQUEST_ORDERS,
        isFetching: true,
	}
}
export const receiveOrders = orders => {
	return {
        type: RECEIVE_ORDERS,
        isFetching: false,
		orders: orders,
	}
}
export const FILL_ORDER_DATA = "FILL_ORDER_DATA";



export const fillOrderData = (orderData) =>{
	return{
		type: FILL_ORDER_DATA,
		payload : orderData
	}
}
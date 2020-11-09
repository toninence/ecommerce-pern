import axios from "axios"

export const add_product = (products) =>{
	return{
		type : "ADD_PRODUCT_ORDER",
		products : products
	}
}

export const set_id = (id) =>{
	return{
		type : "SET_ID",
		id : id
	}
}

export const set_owner = (owner) =>{
	return {
		type : "SET_OWNER",
		owner : owner
	}
}

export const set_total_price = (total) =>{
	return{
		type : "SET_TOTAL_PRICE",
		total : total
	}
}


export function axiosProducts(id){
	return dispatch => {
		axios.get(`http://localhost:3001/orders/${id}`)
		.then(response => response.data.products)
		.then(products => {
			dispatch(add_product(products))
		})

		
	}
}
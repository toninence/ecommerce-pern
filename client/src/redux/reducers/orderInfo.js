const initialState = {
	order_id : "",
	owner : "",
	total_price : 0,
	products_order : [],

}


export default (state = initialState,action) =>{
	switch(action.type){
		case("ADD_PRODUCT_ORDER"):
			return{
				...state,
				products_order : action.products
			}
		case("SET_ID"):
			return{
				...state,
				order_id : action.id
			}
		case("SET_OWNER"):
			return{
				...state,
				owner : action.owner
			}
		case("SET_TOTAL"):
			return{
				...state,
				total_price : action.total
			}
	}

	return state
}
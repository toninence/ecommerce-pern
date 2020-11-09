import axios from "axios"

//import order from "../../components/order";


export const REQUEST_USERS = "REQUEST_USERS"
export const ADD_USERS = "ADD_USERS"


export const addUsers = (users) => {
	return{
		type: ADD_USERS,
		payload : users
	}
}

export function requestUsers(){
	return dispatch => {
		axios.get(`http://localhost:3001/users`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
			}
		})
		.then(response => {
			dispatch(addUsers(response.data))
		})
		.catch(err => console.log(err))
	}
}



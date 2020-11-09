import { 
    REQUEST_USERS, 
    ADD_USERS,
} from '../actions/users_info'

const initialState = {
    /* Le ponemos estado inicial de usuarios vacios*/
	users : []
};

export default (state= initialState, action) => {

	switch(action.type){
        case(ADD_USERS):
            return{
                users : action.payload
            }
        
	}

	return state;
	
};
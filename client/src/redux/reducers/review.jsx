
import { ALL_REVIEW, AVERAGE_REVIEW } from '../actions/review';

const initialState = {
    reviewsProduct: [],
    averageReview: null,
}

export default (state = initialState, action) => {
    
    switch(action.type){
        case ALL_REVIEW:
            return {
                ...state,
                reviewsProduct: action.payload
            }
        case AVERAGE_REVIEW:
            return {
                ...state,
                averageReview: action.payload
            }
    }

    return state;
}
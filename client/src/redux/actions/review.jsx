import axios from "axios";

export const AVERAGE_REVIEW = 'AVERAGE_REVIEW';
export const ALL_REVIEW = 'ALL_REVIEW';



export function allReview (payload){
    return function(dispatch) {
        return fetch(`http://localhost:3001/reviews/${payload}`)
          .then(response => response.json())
          .then(json => {
            dispatch({ type: ALL_REVIEW, 
                     payload: json 
                });
          });
      };
}

export function averageReview (payload){
    return function(dispatch) {
        return fetch(`http://localhost:3001/reviews/${payload}`)
        .then(review => review.json())
        .then(response => {

            const sumaRating = response.map(x => {
                return x.rating})
            const suma = sumaRating.reduce((a, b) => {
                return a+b}) 
            const stars = Math.round(suma / response.length); 
            const product_id = response[0].product_id

            const obj = { stars, product_id }

            return obj;

        })
        .then(obj => {
            axios.put(`http://localhost:3001/products/${obj.product_id}`,{
                rating: obj.stars
            })
            return obj.stars
        })
        .then(json => {
            dispatch({ type: AVERAGE_REVIEW, 
                     payload: json 
                });
          });
      };
}


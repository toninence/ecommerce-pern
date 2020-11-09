import React,{  useEffect} from 'react';
import s from './reviews.module.css';
import Review from './review';
import Stars from './stars';
import { allReview } from '../../redux/actions/review';
import { connect, useDispatch } from 'react-redux';



function Reviews (props) {

    const dispatch = useDispatch();
    const { id, reviewsProduct } = props;
    
    useEffect(() => {
            dispatch(allReview(id))  
    } ,[]) 

    
    return (
            <div className={s.caja}>
                <h2 className={s.titulo}>{reviewsProduct.length ? 'Comentarios': 'Sin comentarios'}</h2>
                <hr/>
                <div> <Stars product_id={id}/> </div>
                
                     {/* x es cada review del producto traido de back */}
                    { reviewsProduct.map( x => <Review 
                            // review_id={x.review_id}
                            // product={x.product}
                            rating={x.rating} 
                            description={x.description}
                            first_name={x.user?x.user.first_name:''}
                            last_name={x.user?x.user.last_name:''}
                            updatedAt={x.updatedAt}
                            avatar={x.user?x.user.avatar:"https://i.ibb.co/x6cBfn9/ASD.png"}
                            />
                    ) }          
            </div>
    )
}

const mapStateToProps = (state) => {
    
    return {
        reviewsProduct : state.review.reviewsProduct
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        allReview: () => dispatch(allReview())
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Reviews);

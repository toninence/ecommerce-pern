import React, {useState, useEffect}from 'react'
import { FaStar }from 'react-icons/fa';
import s from './stars.module.css';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { useHistory }  from 'react-router-dom'
import { allReview, averageReview } from '../../redux/actions/review';

function StarRating (props) {

   let { user_id } = props.auth.user;
   let { product_id } = props;
   const history = useHistory();

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [input, setInput] = useState('');

    const handleonChange = (e) => {
        setInput(e)
    }

    const dispatch = useDispatch();

    const createReview = async (e) => {
        e.preventDefault();
        if(user_id){ 
                await axios.post(`http://localhost:3001/reviews/${product_id}`, {
                rating,  
                description: input,
                user_id         
            })
            .then((response) => {
            setRating(null);
            setInput('');
            dispatch(allReview(response.data.message.product_id))
            dispatch(averageReview(response.data.message.product_id))
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            history.push('/login');
        }
    }


    return (
            <div className={s.div}>
                <div >
                    <TextField
                    id="standard-multiline-flexible"
                    label="Deja tu comentario"
                    multiline
                    rowsMax={4}
                    className={s.input}
                    value={input}
                    onChange={(e) => handleonChange(e.target.value)}
                    />                
                </div>
                <div>
                    <div>
                    {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        
                        return (
                        <label>
                            <input 
                            type='radio' 
                            name='rating' 
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            
                            />
                        <FaStar 
                        className={s.stars} 
                        color={ratingValue <= (hover || rating) ? '#FFFF01' : '#000000'} 
                        size={30}
                        onMouseEnter={() =>  setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                        />

                        </label>
                        )
                    })}
                    </div>
                    <Button className={s.button} onClick={(e) => createReview(e)}>Enviar</Button>
                </div>
        
            </div>
            )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allReview: () => dispatch(allReview()),
        averageReview: () => dispatch(averageReview())
    };
}
        
export default connect(mapStateToProps, mapDispatchToProps)(StarRating)
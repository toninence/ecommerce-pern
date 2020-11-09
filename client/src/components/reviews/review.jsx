import React from 'react';
import s from './review.module.css';
import Rating from '../product-id/Rating';


export default function Review (props) {

    const {updatedAt, rating, description, first_name, last_name, avatar } = props;
    const fullName =  first_name + ' ' + last_name;

    return (

                <div className='comment-container' className={s.commentContainer}>
                    
                    <ul id='comments-list' className='comments-list' className={s.commentsList} >
                        
                        <li className={s.list}>
                            <div className='comment-main-level'>
                                <div className='comments-avatar' className={s.commentsAvatar}><img src={avatar} className={s.img}/></div>
                                <div className='comment-box' className={s.commentsBox}>
                                    <div className='comment-head' className={s.commentsHead}>
                                        <h6 className='comment-name-by-author' className={s.author}><a className={s.a}>{fullName.length>1?fullName:<p style={{color:'red',fontWeight:'bold',margin:'px',padding:'0px'}}>Usuario eliminado</p>}</a></h6>
                                        <span className={s.date}>{updatedAt}</span>
                                        <i className={s.commentsIcons}><Rating rating={rating}/></i>
                                    </div>
                                    <div className='comment-content' className={s.commentsContent}>{description}</div>

                                </div>
                            </div>
                        </li>
                    </ul>
                </div>


            )
};
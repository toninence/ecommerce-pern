import React from 'react';

import {  Link } from 'react-router-dom';
import styles from "./card-style.module.css";




const Card = props => {

	return(
		<div className={`${styles.cardAdmin} card text-center h-100 w-100 d-flex `} style={{borderRadius: '35px'}}>
				<div >
					<img src={props.imgsrc} alt="usersImg" className={`${styles.imgCard} card-img-top`}/>
				</div>

				<div className={`${styles.CardBody} text-dark`}>
					<h4 className=""> {props.title}</h4>
					<p className="card-text">
						{props.text}
					</p>
					
				</div>
				<Link to={props.linkto}>
					<button className={styles.btnAdmin}>Ingresar</button>
				</Link>
			</div>



	
		)


}

export default Card;

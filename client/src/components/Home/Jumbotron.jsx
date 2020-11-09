import React from "react";
import s from  './Jumbotron.module.css'
import image from './electronic6.png'
import button from './BotonJumbotron.svg'
import {Link} from 'react-router-dom'

const Jumbotron = () =>{
	return (

		<div className={s.container}>
			<img src={image} className={s.img} alt=""/>  	
		</div>
		
	)

}


export default Jumbotron


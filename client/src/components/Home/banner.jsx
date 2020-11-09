import React from "react";
import s from  './Jumbotron.module.css'
import button from './BotonJumbotron.svg'
import { Link } from 'react-router-dom'

const Banner = () =>{
	return(
		<div className={s.banner}>	    
		    <p className={s.titulo}> Navegá y accedé a los mejores precios de nuestros productos.</p>
			<Link to='/products' className={s.boxImg}><img src={button} className={s.button}/></Link>
		</div>
	)

}


export default Banner;
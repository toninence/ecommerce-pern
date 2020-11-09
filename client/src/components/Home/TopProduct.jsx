import React from "react";
import s from  './Jumbotron.module.css'
import button from './BotonJumbotron.svg'
import { Link } from 'react-router-dom'

const TopProduct = (props) =>{

	const { product_id } = props;

	return(
		// <div className={s.banner}>	    
		//     <p className={s.titulo}> Crea tu cuenta, descubrí y accede a los mejores precios de hardware.</p>
		// 	<Link to='/products' className={s.boxImg}><img src={button} className={s.button}/></Link>
        // </div>
        <div className={s.top}>

        </div>
	)

}


export default TopProduct;
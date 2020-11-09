import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap'
import Jumbotron from './Jumbotron';
import {Link} from 'react-router-dom'
import styles from './home.module.css'
import './home .css'
import Banner from './banner';
import TopProduct from './TopProduct';
import TopCard from '../products/TopCard'
import axios from "axios"


const Home = (props) => {


    const [topFive,setTopFive] = useState([]);


    //traemos todos los productos
    const fetchProducts = async () =>{
        await axios.get(`http://localhost:3001/products`)
        .then(response => {
            //los ordenamos segun el rating
            const orden = response.data.sort((a, b) => {
                return a.rating - b.rating
            })
            const topProducts = [];
            var cantidad = 5;
            //esto lo que hace es mostrar solo los primeros 5, o la 
            //cantidad que traigan ( cuando son menos que 5)
            if(orden.length < 5) {cantidad = orden.length}
           
            for(let i = 1; i <= cantidad;i++){
                topProducts.push(orden[orden.length-i])    
            }
                     
            setTopFive(topProducts)}

        )
    }
   
    

    useEffect(()=>{
        fetchProducts();
    }, []);

    return (
        <>
            <Jumbotron/>
            <Banner/>
    
            <div className={styles.topFive}>

                <h3 className={styles.titulotop}>Nuestro TOP5 de productos</h3>
                <div className={styles.topBox}>

                {topFive.length >1 && topFive.map((product) => 
                         
                        <TopCard key={product.product_id} data={product} className={styles.card}/>
                        
                    )

                }
                

                </div>
                
            </div>

            
                    
          

            {/* <Carousel className={`carousel ${styles.carousel}`} activeIndex={carouselIndex} onSelect={handleCarouselSelect}>


                {products.map(prod => 
                    <Carousel.Item>
                        <Link to={`/products/${prod.product_id}`}>
                        <img
                            className="d-block sliderImage"
                            src={prod.images[0] && prod.images[0].img_url}
                            alt={prod.name}
                        />
                        <Carousel.Caption>
                            <h3>{prod.name}</h3>
                            <p>{prod.description.length>15?prod.description.slice(0, 50)+'...':prod.description}</p>
                        </Carousel.Caption>
                        </Link>
                    </Carousel.Item>
                    )}                    
                </Carousel> */}
            </>
    )
}



export default Home
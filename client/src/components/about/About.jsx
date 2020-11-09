import React from 'react'

import styles from './about.module.css'
import {AiFillLinkedin} from 'react-icons/ai'
import {MdSignalWifiOff} from 'react-icons/md'
import {Animated} from "react-animated-css";
import {Link} from 'react-router-dom'
import HTML5 from './HTML5.png'
import CSS3 from './CSS3.png'
import JS from './JS.png'
import NODE from './NODE.png'
import POSTGRE from './POSTGRE.png'
import REACT from './REACT.png'
import REDUX from './REDUX.png'
import SEQUELIZE from './SEQUELIZE.svg'
import SCRUM from './SCRUM.svg'

const boxStyle = {
    border: '1px solid black'
}



export default function About() {
    return (
      
        <div className={`container-fluid ${styles.about}`}>
            <Animated animationIn="fadeIn" animationInDelay='150' isVisible={true}> 

            <div className={`${styles.introAbout} `}>
                <h1>Sobre nosotros</h1>

                <p className={styles.descAbout}>
                Hola! Somos <b>HENRYWARE</b>. Este e-commerce fue desarrollado con el esfuerzo combinado de seis estudiantes de <a className={styles.LinkHenry} href='https://www.soyhenry.com'>HENRY</a> y el apoyo de nuestro TL Arturo Lidueña. En este bootcamp a lo largo de los últimos tres meses,  nos enseñaron de manera intensiva, a lo largo de +700 horas de estudio, los fundamentos de varias tecnologías de última generación como <span style={{color:'#52B9D4',fontWeight:'bold'}}>React</span>, <span style={{color:'#7649BB',fontWeight:'bold'}}>Redux</span>, <span style={{color:'#8BC74B',fontWeight:'bold'}}>Express</span>, <span style={{color:'#8BC74B',fontWeight:'bold'}}>Node.js</span>, <span style={{color:'#03AEEE',fontWeight:'bold'}}>Sequelize</span>, entre muchos otros. El último mes, nuestro grupo estuvo poniendo en práctica todos estos conocimientos y también familiarizándonos con metodologías ágiles como <span style={{color:'#40586F',fontWeight:'bold'}}>SCRUM</span>. El objetivo final de HENRY es capacitarnos para lograr comenzar nuestras carreras en este emocionante rubro que está cobrando cada vez más y más importancia en la vida diaria de todos.
                </p>
            </div>
            </Animated>  

            <div className='text-center d-flex flex-row justify-content-center align-items-center mb-3'>

            <Animated animationIn="fadeIn" animationInDelay='1900' isVisible={true}> 
                <img className={styles.ImagenTecno} src={CSS3}/>
                </Animated>  

            <Animated animationIn="fadeIn" animationInDelay='1500' isVisible={true}> 

                <img className={styles.ImagenTecno} src={REACT}/>
                </Animated>  

            <Animated animationIn="fadeIn" animationInDelay='1200' isVisible={true}> 

                <img className={styles.ImagenTecno} src={REDUX}/>
                </Animated>  

            <Animated animationIn="fadeIn" animationInDelay='900' isVisible={true}> 

                <img className={`${styles.ImagenTecno} ${styles.node}`} src={NODE}/>
                </Animated>  

            <Animated animationIn="fadeIn" animationInDelay='700' isVisible={true}> 

                <img className={styles.ImagenTecno} src={POSTGRE}/>
                </Animated>  

            <Animated animationIn="fadeIn" animationInDelay='500' isVisible={true}> 

                <img className={styles.ImagenTecno} src={SEQUELIZE}/>
                </Animated>  

            <Animated animationIn="fadeIn" animationInDelay='300' isVisible={true}> 

                <img className={styles.ImagenTecno} src={JS}/>
            </Animated>

            <Animated animationIn="fadeIn" animationInDelay='200' isVisible={true}> 

                <img className={styles.ImagenTecno} src={SCRUM}/>
            </Animated>    

            </div>
            <div className='text-center'>

            

            <Animated animationIn="fadeIn" animationInDelay='150' isVisible={true}> 

                <h1 className={styles.h1NE}>Nuestro equipo</h1>
                </Animated>  

                <div className={`${styles.cardsAbout} `}>
                <Animated animationIn="fadeIn" animationInDelay='150' isVisible={true}> 
                <div className={`${styles.cardAbout} card `}>
                    <img src="https://i.ibb.co/89859Sh/Colo-Henry.jpg" className={`card-img-top  ${styles.cardImg}`}/>

                    <div className={`card-body ${styles.bodyCard}`}>
                    <h5 class={`card-title ${styles.cardTitle}`}>Nicolas Velandia</h5>
                    <p class={`${styles.cardText} card-text`}>"Me aprueban el pull request por favor?"</p>
                    <a href="https://www.linkedin.com/in/nicolas-velandia-8849b71b6/" className={`${styles.linkedinButton}`}><AiFillLinkedin/></a>
                    </div>

                </div>
                </Animated>  
                <Animated animationIn="fadeIn" animationInDelay='400' isVisible={true}> 
                <div className={`${styles.cardAbout} card `}>
                    <img src="https://i.ibb.co/0VWSxq2/Tongas-Henry.jpg" className={`card-img-top  ${styles.cardImg}`}/>

                    <div className={`card-body ${styles.bodyCard}`}>
                    <h5 class={`card-title ${styles.cardTitle}`}>Gastón Ferreyra</h5>
                    <p class={`${styles.cardText} card-text`}>"Yo...Haria est...Hola?... Me escuc...hol...%&($ .. hol·#&@ <MdSignalWifiOff style={{fontSize:"20px"}} />"</p>
                    <a href="#" className={`${styles.linkedinButton}`}><AiFillLinkedin/></a>
                    </div>

                </div>
                </Animated>  

                <Animated animationIn="fadeIn" animationInDelay='700' isVisible={true}>
                <div className={`${styles.cardAbout} card `}>
                    <img src="https://i.ibb.co/WHBtr7D/Juan-Henry.jpg" className={`card-img-top  ${styles.cardImg}`}/>
                    <div className={`card-body ${styles.bodyCard}`}>
                    <h5 class={`card-title ${styles.cardTitle}`}>Juan Cruz Barneix</h5>
                    <p class={`${styles.cardText} card-text`}>"Vuelvo en un TOKEN"</p>
                    <a href="https://www.linkedin.com/in/juan-cruz-barneix-9a0a17188/" className={`${styles.linkedinButton}`}><AiFillLinkedin/></a>
                    </div>
                </div>
                </Animated > 
                <Animated animationIn="fadeIn" animationInDelay='1000' isVisible={true}>

                <div className={`${styles.cardAbout} card `}>
                    <img src="https://i.ibb.co/g93zwSF/Kenny-Henry.jpg" className={`card-img-top  ${styles.cardImg}`}/>

                    <div className={`card-body ${styles.bodyCard}`}>
                    <h5 class={`card-title ${styles.cardTitle}`}>Nicolas Kenny</h5>
                    <p class={`${styles.cardText} card-text`}>"Me hago un café y vuelvo...."</p>
                    <a href="https://www.linkedin.com/in/nicolasdkenny/" className={`${styles.linkedinButton}`}><AiFillLinkedin/></a>
                    </div>

                </div>
                </Animated > 

                <Animated animationIn="fadeIn" animationInDelay='1300' isVisible={true}>
                <div className={`${styles.cardAbout} card `}>
                    <img src="https://i.ibb.co/w6wr2Ln/Fran-Henry-jpeg-1.png" className={`card-img-top  ${styles.cardImg}`}/>

                    <div className={`card-body ${styles.bodyCard}`}>
                    <h5 class={`card-title ${styles.cardTitle}`}>Francisco Zapiola</h5>
                    <p class={`${styles.cardText} card-text`}>"Saquen los console.log, me dan TOC"</p>
                    <a href="https://www.linkedin.com/in/francisco-zapiola-martin-44301b1a6/" className={`${styles.linkedinButton}`}><AiFillLinkedin/></a>
                    </div>

                </div>
                </Animated >
                <Animated animationIn="fadeIn" animationInDelay='1600' isVisible={true}>
                
                <div className={`${styles.cardAbout} card `}>
                    <img src="https://i.ibb.co/ZVkMkGn/Exi-Henry.jpg" className={`card-img-top  ${styles.cardImg}`}/>

                    <div className={`card-body ${styles.bodyCard}`}>
                    <h5 class={`card-title ${styles.cardTitle}`}>Alexis Enriquez</h5>
                    <p class={`${styles.cardText} card-text`}>"Termino los cursos de Passport y me conecto"</p>
                    <a href="#" className={`${styles.linkedinButton}`}><AiFillLinkedin/></a>
                    </div>

                </div>
                </Animated >

                </div>
            </div>
        </div>
    )
}

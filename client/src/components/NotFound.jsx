import React from 'react'
import img from './404notfound.svg'
import {Link} from 'react-router-dom'

const NotFound = () =>{
    return(
            <Link to='/'>
            <img style={{maxHeight:"50%"}}src={img} alt=""/>
            </Link>
    )
}

export default NotFound
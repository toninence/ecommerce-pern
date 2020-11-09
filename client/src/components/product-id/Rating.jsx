import React from 'react'
import {AiFillStar,AiOutlineStar} from "react-icons/ai"

export default function Rating(props) {

    const { rating } = props;
    
switch (rating) {
    case 1:
        return <span>
        {<AiFillStar/>}
        {<AiOutlineStar/>}
        {<AiOutlineStar/>}
        {<AiOutlineStar/>}
        {<AiOutlineStar/>}
        
    </span>//1 sola estrella
        
    case 2: 
        return  <span>
        {<AiFillStar/>}
        {<AiFillStar/>}
        {<AiOutlineStar/>}
        {<AiOutlineStar/>}
        {<AiOutlineStar/>}
        
    </span>//3 estrellas
    
    case 3: 
        return <span>
        {<AiFillStar/>}
        {<AiFillStar/>}
        {<AiFillStar/>}
        {<AiOutlineStar/>}
        {<AiOutlineStar/>}
    </span> //3 estrellas
            
    case 4:
        return <span>
        {<AiFillStar/>}
        {<AiFillStar/>}
        {<AiFillStar/>}
        {<AiFillStar/>}
        {<AiOutlineStar/>}
    </span>//4 estrellas
        
    case 5:
        return <span>
            {<AiFillStar/>}
            {<AiFillStar/>}
            {<AiFillStar/>}
            {<AiFillStar/>}
            {<AiFillStar/>}
        </span> //3 estrellas
    
    default:
        return <span>
            {<AiOutlineStar/>}
            {<AiOutlineStar/>}
            {<AiOutlineStar/>}
            {<AiOutlineStar/>}
            {<AiOutlineStar/>}
        </span> //estrellas vacias
    } 
}

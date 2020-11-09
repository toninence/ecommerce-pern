import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Container } from 'react-bootstrap'
import axios from 'axios'
import { FormControl, TextField, Button } from '@material-ui/core';

//Redux
import { loadUserData } from '../../redux/actions/auth'
import { connect } from 'react-redux';

import styles from './PasswordForgot.module.css'


function PasswordForgot(props){

    const [mail,setEmail] = useState('')
    const [error,setError] = useState('')

    const mostrarError = string => {
        setError(string);
        setTimeout(()=>{
            setError('');
        }, 3000);
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

        axios.post('http://localhost:3001/users/forgotpassword',{

            email:mail

        })
        .then(res => mostrarError(res.data))
        .catch(err => setError(err.data))


    }


    return (
        <Container className={styles.contenedor}>

            <Form className={styles.form} onSubmit={handleSubmit}>
                <Form.Group className='m-0' controlId="categoryName">

                <div className={`${styles.formInput} d-flex flex-column text-center justify-content-center`}>

                    <Form.Label>Ingrese su correo electrónico:</Form.Label>
                    
                    <FormControl className='col-md-12'>
                        <TextField  
                        value={mail}
                        id="email"
                        label="Ingrese su correo electrónico"
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                    </FormControl>
                    
                    
                    
                </div>

                <div className={`d-flex justify-content-center`}>
                    <Button className='btn-warning w-50' type='submit'>Enviar</Button>
                </div>
                <p className={styles.error}>{(error && !error.email)?error:''}</p>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default PasswordForgot
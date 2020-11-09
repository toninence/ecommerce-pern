import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Container } from 'react-bootstrap'
import axios from 'axios'
import { FormControl, TextField, Button } from '@material-ui/core';
import jwt from 'jsonwebtoken';


//Redux
import { loadUserData } from '../../redux/actions/auth'
import { connect } from 'react-redux';

import styles from './PasswordForgot.module.css'

require ( 'dotenv' ).config();

function PasswordReset({passResetToken, user_id}){
    const history = useHistory()
    const [password,setPassword] = useState('')
    const [checkPassword,setcheckPassword] = useState('')
    const [error,setError] = useState('')

    //Verificar que el id guardado en el token sea el que corresponde
    jwt.verify(passResetToken, 'process.env.ACCESS_TOKEN_SECRET',(err, resp) =>{
        // console.log('TOKENID', tokenID);
        if (err) return history.push('/404');
        if (resp.tokenID != user_id) return history.push('/404');
	})


    const mostrarError = string => {
        setError(string);
        setTimeout(()=>{
            setError('');
        }, 3000);
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

        if(password.length<8) return mostrarError('La contraseña tiene que tener al menos 8 caracteres')
        if(password !== checkPassword) return mostrarError('Las contraseñas tienen que coincidir')

        axios.put(`http://localhost:3001/users/${user_id}/password-reset`,
        {
            newPassword:password
        })
        .then(()=> history.push('/'))


    }


    return (
        <Container className={styles.contenedor}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='m-0' controlId="categoryName">

                <div className={`${styles.formInput} d-flex flex-column text-center justify-content-center`}>

                    <Form.Label>Ingrese la nueva contraseña:</Form.Label>
                    
                    <FormControl className='col-md-12'>
                        <TextField  
                        type='password'
                        value={password}
                        id="newPassword"
                        label="Ingrese la nueva contraseña"
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                    </FormControl>

                    <FormControl className='col-md-12 mt-3'>
                        <TextField  
                        type='password'

                        value={checkPassword}
                        id="CheckPassword"
                        label="Ingrese nuevamente su nueva contraseña"
                        onChange={(e)=>setcheckPassword(e.target.value)}
                        />
                    </FormControl>
                    
                    <span>{error?error:''}</span>
                    
                </div>

                <div className={`d-flex justify-content-center`}>
                    <Button className='btn-warning w-50' type='submit'>Enviar</Button>
                </div>

                </Form.Group>
            </Form>
        </Container>
    )
}

export default PasswordReset
import React, { useState } from 'react'
import styles from './register.module.scss'
import { FormControl, TextField, Button } from '@material-ui/core';
import GoogleButton from 'react-google-button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

 function Register (props) {
    //Redux
    const { user } = props;
    const history = useHistory();
    //form carga los datos del formulario
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        phone_number: '',
        password: ''
    });
    const [confirmPass, setConfirmPass] = useState('');
    //errors carga los errores que devuelve la api
    const [errors, setErrors] = useState('');

    const mostrarError = string => {
        setErrors(string);
        setTimeout(()=>{
            setErrors('');
        }, 5000);
    }
    //update field va a gregando al form los datos cargados en el formulario 
    const updateField = async e => {
        const { id, value } = e.target
        await setForm({ 
            ...form,
            [id]: value
        })
    }
    //handlesubmit envia al servidor la data para ingresar el nuevo usuario
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!form.first_name) return mostrarError('Debes ingresar tu nombre');
        if(!form.last_name) return mostrarError('Debes ingresar tu apellido');
        //Checkeo que el email sea un email válido con regex
        const emailCheck = new RegExp(/^([a-zA-Z0-9-.]+)@([a-zA-Z0-9-.]+)\.([a-zA-Z]{2,3})$/);
        if (!emailCheck.test(form.email)) return mostrarError('La dirección de email no es válida');
        //Checkeo la dirección
        if(!form.address) return mostrarError('Debes ingresar una dirección válida');
        //Checkeo número de teléfono
        if(form.phone_number.length < 5 || form.phone_number.length > 25) return mostrarError('El número de teléfono debe tener entre 5 y 25 dígitos')
        //Checkeo password
        if (form.password.length < 8) return mostrarError('La contraseña debe tener al menos 8 caracteres');
        //Checkeo que las password sean iguales
        if (confirmPass != form.password) return mostrarError('Las contraseñas deben ser iguales');

        //envio datos al servidor
        const result = fetch(`http://localhost:3001/users`, {
            method: 'POST',
            body: JSON.stringify(form), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result.then(res => res.json())
            .then(res => {
                console.log(res);
                //Si el back devuelve algún error, lo muestro. Igual en teoría no debería llegar hasta acá el error
                if (res.errorMail) return mostrarError(res.errorMail);

                if (res.status === 201) {
                    //si la respuesta es 201 crea el usuario y vacia los states
                    setForm({
                        first_name: '',
                        last_name: '',
                        email: '',
                        address: '',
                        phone_number: '',
                        password: ''                
                    })
                    setErrors('');
                    setConfirmPass('');
                    notify();
                    return history.push('/login');
                }
            })

    }
    

    const notify = (message = 'Usuario creado con exito', type = 'success') => toast[type](message, { position: toast.POSITION.TOP_CENTER });

    	//Si ya hay un usuario loggeado, redirigirlo automáticamente al home
	if(user.role != 'Guest'){
		history.push('/');
    }
    
    return (
        <div className={styles.bodyContainerRegister}>
        <div className={`pt-3  d-flex align-items-center w-75 mx-auto ${styles.container2} position-relative`}>
            <div className="d-flex align-items-center mx-auto h-75 col-md-8 mt-5">
                
                <form className={styles.formulario} onSubmit={handleSubmit}>
                    <div className="row mt-5">
                        <div className="col-md-4 offset-2 mb-4">
                            <FormControl className='col-md-12'>
                                <TextField
                                    value={form.first_name}
                                    id="first_name"
                                    label="Nombre"
                                    onChange={updateField} />
                            </FormControl>
                        </div>
                        <div className="col-md-4 mb-4">
                            <FormControl className='col-md-12'>
                                <TextField
                                    value={form.last_name}
                                    id="last_name"
                                    label="Apellido"
                                    onChange={updateField} />
                            </FormControl>
                        </div>
                        <div className="col-md-8 offset-2 mb-4">
                            <FormControl className='col-md-12'>
                                <TextField
                                    value={form.email}
                                    id="email" label="Email"
                                    onChange={updateField} />
                            </FormControl>
                        </div>
                        <div className="col-md-4 offset-2">
                            <FormControl className='col-md-12'>
                                <TextField
                                    value={form.address}
                                    id="address"
                                    label="Dirección"
                                    onChange={updateField} />
                            </FormControl>
                        </div>
                        <div className="col-md-4 mb-4 mb-4">
                            <FormControl className='col-md-12'>
                                <TextField
                                    value={form.phone_number}
                                    id="phone_number"
                                    label="Teléfono"
                                    onChange={updateField} />
                            </FormControl>
                        </div>
                        <div className="col-md-8 offset-2 mb-4">
                            <FormControl className='col-md-12'>
                                <TextField
                                    type='password'
                                    id="password"
                                    label="Contraseña"
                                    value={form.password}
                                    onChange={updateField} />
                            </FormControl>
                        </div>
                        <div className="col-md-8 offset-2 mb-4">
                            <FormControl className='col-md-12'>
                                <TextField
                                    type='password'
                                    id="confirmPassword"
                                    label="Confirme su contraseña"
                                    value={confirmPass}
                                    onChange={(e)=>{setConfirmPass(e.target.value)}} />
                            </FormControl>
                        </div>
                        <div className={`col-md-4 offset-4 mb-4 ${styles.buttonErrorDiv}`}>
                            <Button
                                type='submit'
                                variant="contained"
                                className={`${styles.henryColor} col-md-12`}>
                                Registrarme
                            </Button>
                        </div>
                    </div>
                            <span className={styles.error}>{errors ? errors : null}</span>
                </form>
            </div>
            <ToastContainer />
        </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(Register);
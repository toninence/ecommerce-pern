import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap'
import axios from 'axios'
//Redux
import { loadUserData } from '../../redux/actions/auth'
import { connect } from 'react-redux';

import styles from './passwordchange.module.css'


const PasswordChange = props => {
    const history = useHistory();
    const { user, loadUserData } = props;
	const [ errorMsg, setErrorMsg ] = useState('');

    if(user.role === 'Guest'){
        history.push('/login');
    }
    
    const [form, setForm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(form.length<=7){
            setErrorMsg('La contraseña tiene que tener al menos 8 caracteres')

            return setTimeout(()=>{setErrorMsg('')},3000)
        }

        axios.put(`http://localhost:3001/users/${user.user_id}/password-reset`, {
            newPassword: form
        })
        .then(() => {
            //Se cierra sesión luego de cambiar la password
            loadUserData({ role: 'Guest'});
            localStorage.removeItem('actualToken');
        })
        .then(() => history.push('/'))
        .catch(err => console.log(err));
    }

    return (
        <Container className={styles.contenedor}>
            <div className={styles.titlePasRes}>
            <h4  className={styles.titlePasRes}>Hola, {user.first_name}!</h4>
            <h5  className={styles.titlePasRes}>¿Deseas cambiar tu contraseña?</h5>
            </div>
            <Form onSubmit = {(e)=> handleSubmit(e)}>
                <Form.Group className='m-0' controlId="categoryName">
                <div className={`${styles.formInput} d-flex flex-column text-center justify-content-center`}>

                    <Form.Label>Ingresá la nueva contraseña:</Form.Label>

                    <Form.Control className={`${styles.inputPassword}`} type="password" value={form} placeholder='Nueva contraseña...' onChange={(e)=>{setForm(e.target.value)}}/>

                    <Form.Text className="text-muted">
                        Tendrás que volver a iniciar sesión luego de hacer el cambio.
                    </Form.Text>
                    <Form.Text className={`text-muted ${styles.redMuted}`}>
                        {errorMsg.length?errorMsg:null}
                    </Form.Text>
                    </div>
                    <div className={`d-flex justify-content-center`}>
                    <Button className='btn-warning w-50' type='submit'>Enviar</Button>
                    </div>
                </Form.Group>
            </Form>
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUserData: (data) => dispatch(loadUserData(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange);
import React,{ useState, useEffect } from 'react';
import { loadUserData } from '../../redux/actions/auth';
import { connect } from 'react-redux';
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import styles from './profile.module.css'
import {Link} from 'react-router-dom'
import FileBase64 from 'react-file-base64'


const Profile = (props)=>{


    const history = useHistory()
    // avatar por defecto 
    const [avatar,setAvatar] = useState("https://i.ibb.co/x6cBfn9/ASD.png")
    
    const [fullUser, setUser] = useState()

    const {user} = props

    const getFile = (file) => {
        
        axios.put(`http://localhost:3001/users/${user.user_id}`,{
            avatar : file.base64
        })
        .then(() => setAvatar(file.base64))
        .catch(err => console.log(err))        
        console.log(avatar)
    }

    const getUser = ()=>{

        axios.get(`http://localhost:3001/users/${user.user_id}`)
        .then(response => setUser(response.data))
        .catch(err => console.log(err))
        
    }

    useEffect(()=>{
        if(user.user_id) getUser();
    },[user,avatar])

    console.log(fullUser)
    return(

        <div className={`card ${styles.cardProfile} w-50 mx-auto my-5`}>
             <div className={`${styles.cardProfileHeader} card-header text-center`}>
                <h3 className={`${fullUser && fullUser.role=='admin'?styles.adminTitle:null}`}>Hola {fullUser?fullUser.first_name:null}! &#128540;</h3>
                {/*<h3>actualID: {localStorage.getItem("actualUserId")}</h3>*/}
            </div>
            <div className={`${styles.cardProfileBody} card-body`}>
                <div className='row'>
                    <div className='col-6'>

                        <img className={styles.imgProfile} src={fullUser && fullUser.avatar} alt="avatar"/>
                        <FileBase64 multiple={false} onDone={getFile} />

                    </div>

                    <div className='col-6'>
                    <h4 className={styles.cardLabel}>Nombre y apellido</h4>
                    <h6 className={styles.cardText}>{fullUser?fullUser.first_name:null} {fullUser?fullUser.last_name:null}</h6>

                    {fullUser && fullUser.role == 'admin'?<div><h4 className={styles.cardLabel}>Tipo de usuario</h4>

                    <h6 className={styles.cardText}>{fullUser?fullUser.role:null}</h6></div>:null}

                    <h4 className={styles.cardLabel}>Dirección</h4>
                    <h6 className={styles.cardText}>{fullUser?fullUser.address:null}</h6>

                    <h4 className={styles.cardLabel}>Correo electrónico</h4>
                    <h6 className={styles.cardText}>{fullUser?fullUser.email:null}</h6>

                    <h4 className={styles.cardLabel}>Teléfono</h4>
                    <h6 className={styles.cardText}>{fullUser?fullUser.phone_number:null}</h6>

                    <div>
                    <h4 className={styles.cardLabel}>Contraseña</h4>
                    <h6 className={styles.cardText}>{fullUser?'**********':null}</h6>
                    <Link to="/profile/password-reset"><button className={styles.newPassButton}>CAMBIAR CONTRASEÑA</button></Link>
                    </div>
                    
                    </div>
                    <hr/>

                </div> 
            </div>
        </div>

    )
}








const mapStateToProps = state => {
	return {
		user: state.auth.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		loadUserData: userData => dispatch(loadUserData(userData))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
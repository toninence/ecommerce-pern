import React, { useState,useEffect } from 'react'
import {  useDispatch, connect } from 'react-redux'
import Select from 'react-select'
import {useHistory} from 'react-router-dom'

import axios from "axios"
import {addUsers,requestUsers} from '../../redux/actions/users_info'


function UsersTable(props) {
    const dispatch = useDispatch()
    const {user, isFetching, usersTable} = props
    const history = useHistory()
    const [ role,setRole] = useState()
    
    //comprobamos que el usuario tenga privilegios de ADMIN
    //Descomentar estas lineas 
    if(!isFetching && user.role != "admin"){
         history.push("/404")
    }


    const promote = async (userId,oldRole) =>{
        let newRole = "admin";
        if(oldRole == "admin") newRole = "user"
        await axios.put(`http://localhost:3001/users/${userId}`,{
            role : newRole
        })
        .then((response) => console.log(response))
        .then(() => {
            setRole(oldRole)
            setRole(newRole)
        })

    }

    const deleteUser = async (userId) =>{
        await axios.delete(`http://localhost:3001/users/${userId}`,{
            headers: {
                        'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
                }})
        .then((response) => console.log(response))
        .then(() => dispatch(requestUsers()))
    }

    const getRole = async (userId) => {
        await axios.get(`http://localhost:3001/users/${userId}`)
        .then( response => {
            //setRole(response.data.role)
            console.log(response.data.role)
        })
        .catch(err => console.log(err))
    }

    useEffect(() =>{
        dispatch(requestUsers())

    },[role])

    return (

        <div className='col-md-10 offset-1 mt-3'>
            <div >
                <table className='table table-striped table-hover table-collapse'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Cambiar Rol</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                       {
                        usersTable.users.length && usersTable.users.map( user => ( 
                                 <tr>
                                    <td>{user.user_id}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td> <a className="btn btn-success" onClick={() => promote(user.user_id,user.role)} > + </a></td>
                                    <td> <a className="btn btn-danger" onClick={() => deleteUser(user.user_id)} > - </a></td> 
                                </tr>
                                ))

                        }
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        usersTable : state.usersInfo,
        user: state.auth.user,
        isFetching: state.auth.isFetching
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        requestUsers : () => dispatch(requestUsers())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable)
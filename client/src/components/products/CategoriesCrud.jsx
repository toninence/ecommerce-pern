import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Container } from 'react-bootstrap'
import {connect} from 'react-redux'
import {useHistory} from 'react-router-dom'

import styles from './categorisCrud.module.css'

const CategoriesCrud = (props) => {
    const {user, isFetching} = props
    const history = useHistory()
    if(isFetching === false && user.role != "admin"){
         history.push("/404")
    }
    const { categories, getCategories } = props;

    //Contiene la información de la categoría seleccionada, ya sea para modificarla o eliminarla
    const [ selectedCat, setSelectedCat ] = useState({});

    //Determina si se muestra o no el modal de confirmar eliminación
    const [ showModalEliminar, setShowModalEliminar] = useState(false);

    //Determina si se muestra o no el modal de editar
    const [ showModalEditar, setShowModalEditar] = useState(false);
    //Nuevo nombre de categoría recibido del modal de editar
    const [ form, setForm ] = useState();

    //Almacena el contenido del input de agregar categoría
    const [ formAgregar, setFormAgregar ] = useState({name:''});

    const deleteCat = () => {
        fetch(`http://localhost:3001/products/category/${selectedCat.category_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
            }
        })
        .then(getCategories)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModalEditar(false);
        fetch(`http://localhost:3001/products/category/${selectedCat.category_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: form
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
            }
        })
        .then(getCategories)
    }

    const handleSubmitAgregar = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/products/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('actualToken')}`
            },
            body: JSON.stringify(formAgregar)
        })
        .then(()=>{
            setFormAgregar({name:''});
            getCategories();
        })
        .catch(err=>console.log(err));
    }


    useEffect(()=>{
        getCategories();
    }, [selectedCat, showModalEditar])

    return (
        <div className='col-md-8 offset-2 pt-3 table-responsive'>
            <h2>Administrar categorías</h2>
            <br/>
            <div>
                <h4>Agregar nueva</h4>
                <br />
                <Form onSubmit = {(e)=>{handleSubmitAgregar(e);}}>
                    <Form.Group controlId="categoryName">
                        <Form.Label>Ingresá el nombre deseado:</Form.Label>
                        <div className={styles.inputCat}>
                        <Form.Control type="text" value={formAgregar.name} placeholder="Nueva categoría..." onChange={(e)=>{setFormAgregar({name: e.target.value})}}/>
                        <Button type='submit' >Agregar</Button>
                        </div>
                        <Form.Text className="text-muted">
                            Un ID único le será asignado automáticamente a la nueva categoría.
                        </Form.Text>
                        
                    </Form.Group>
                </Form>
            </div>
            <br/>
            <div>
                <h4 style={{marginLeft: 'auto', marginRight: 'auto'}}>Lista</h4>
                <table style={{backgroundColor: 'whitesmoke', width: '100%'}} className='table table-striped table-collapse'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Cantidad de productos</th>
                            <th>Editar</th>
                            <th>Borrar</th>
                        </tr>
                    </thead>
                    <tbody className={styles.categoriesTable}>
                        {categories.map( cat => {
                            return (
                                <tr key={cat.category_id}>
                                    <td>{cat.category_id}</td>
                                    <td>{cat.name}</td>
                                    <td>{cat.products.length}</td>
                                    <td>
                                        <Button variant='primary' onClick = {() => {
                                            setSelectedCat(cat);
                                            setShowModalEditar(true);
                                            setForm('')
                                        }}>
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant='danger' onClick = {() => {
                                            setSelectedCat(cat);
                                            setShowModalEliminar(true);
                                        }}>
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>    
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>       
                </table>
            </div>

                        {/* MODAL ELIMINAR CATEGORÍA */}
            <Modal show={showModalEliminar} onHide={() => setShowModalEliminar(false)}>
                <Modal.Header closeButton>
            <Modal.Title> Seguro que desea eliminar la categoría {selectedCat.name}?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={()=>{
                        deleteCat();
                        setSelectedCat({});
                        setShowModalEliminar(false);
                    }}>
                        Sí
                    </Button>
                    <Button variant="primary"  onClick={()=>{
                        setShowModalEliminar(false);
                        setSelectedCat({})
                    }}>
                        No
                    </Button>                
                </Modal.Footer>
            </Modal>

                        {/* MODAL EDITAR NOMBRE DE CATEGORÍA */}
            <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                    <Modal.Header closeButton>
                        <Modal.Title>Categoría "{selectedCat.name}"</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label>Ingrese el nombre de la categoría</Form.Label>
                        <Form.Control id='name' name='name' value={form} type="text" placeholder="Ingrese nueva categoría" onChange={(e) => setForm(e.target.value)} />
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" type='submit'>
                        Cambiar nombre
                    </Button>                
                    </Modal.Footer>
                    </Form.Group>
                </Form>
            </Modal>

        </div>
    )
}

const mapStateToProps = state => {
    return{
        user : state.auth.user,
        isFetching: state.auth.isFetching
    }
}

export default connect(mapStateToProps)(CategoriesCrud)
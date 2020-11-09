import React,{ useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import s from './orderUser.module.css'
import { changeStatus } from '../../redux/actions/Orders'
import { AiOutlineStop } from "react-icons/ai"
import axios from 'axios'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
 

const OrderUser = (props)=>{

    
    // let { user_id } = props.auth.user;

    const {user,isFetching} = props
    const {user_id} = user

    const dispatch = useDispatch()
    const [ordersUser, setordersUser] = useState([])
    const value = 'Cancelada';

    const getOrders = () => {

        axios.get(`http://localhost:3001/users/${user_id}/orders`)
        .then(response => {
            setordersUser(response.data.filter(order => order.state != "Carrito"))
        })
        .catch(err => console.log(err))
        
    }

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    function agree(value, order_id) {
        handleClose();
        dispatch(changeStatus(value, order_id))
        getOrders()
    }

    useEffect(() => {
        getOrders()
    }, [isFetching])


    return (

        <div className='col-md-10 offset-1 mt-3'>
             <hr/>

      
            <div >
                <table className='table table-striped table-hover table-collapse'>
                    <thead className={s.center}>
                        <tr>
                            <th>Order id</th>
                            <th>Estado</th>
                            <th>Creada</th>
                            <th>Modificada</th>
                            <th>Productos</th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody className={s.center}> 
                                               
                        {ordersUser.map(order => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.state}</td>
                                <td>{order.createdAt.slice(0,10)}</td>
                                <td>{order.updatedAt.slice(0,10)}</td>
                                <td><a href={`/orders/table/${order.order_id}`} className="btn btn-primary"> +</a></td>
                                { order.state !== value && order.state != "Completa" ? <td>
                                    <button className={s.button} onClick={handleClickOpen}> X </button>
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">¿Está seguro que desea cancelar esta orden?</DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Perderá todos los productos, deberá volver a crear una nueva orden.
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                       Cancelar
                                    </Button>
                                    <Button onClick={() => agree(value, order.order_id)} color="primary" autoFocus>
                                       Si, seguro
                                    </Button>
                                    </DialogActions>
                                    </Dialog>
                                    
                                    
                                </td> :  <td></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {ordersUser.length === 0 ?
                 <div className={s.divv}> <AiOutlineStop className={s.i}/> <div>Aún no registra ninguna orden
                    </div>
                    </div>
                    : '' }
                
            </div>
    

        </div>

    )
}

const mapStateToProps = state => {
	return {
        user: state.auth.user,
        isFetching: state.auth.isFetching
	}
}

const mapDispatchToProps = dispatch => {
	return {
		
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderUser);


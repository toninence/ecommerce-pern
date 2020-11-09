import React from 'react'
import Card from './card'
import {connect} from 'react-redux'
import {useHistory} from 'react-router-dom'
import { Fade } from '@material-ui/core'

const imgAdd= "http://images.all-free-download.com/images/graphicthumb/document_add_100293.jpg";
const imgOrders = "https://http2.mlstatic.com/100-hojas-papel-bond-blanco-alta-blancura-medida-33-x-483-D_NQ_NP_922905-MLM25110687502_102016-F.jpg";
const imgUsers = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.knack.com%2F_images%2Flive%2Fusers.png&f=1&nofb=1";
const imgCats = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-gNMIOHboLMo%2FT1Dlp5pi3uI%2FAAAAAAAAAVc%2F80O8Ao9rrfQ%2Fs1600%2FCategories%2BExcel.jpg&f=1&nofb=1"

const ControlPanel = function(props){
	const {user, isFetching} = props
	const history = useHistory();
	//Si ya se recibió la respuesta de /auth/me, y el usuario recibido no es admin, sacarlo cagan2 de ahí
	if(isFetching === false && user.role != "admin"){
		 history.push("/404");
	}
	
	return(
		<Fade
                        in={true}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(true ? { timeout: 800 } : {})}
                    >
		<div className="container-fluid  d-flex mt-4 justify-content-around">
			<div className="row">
				<div className="col-md-4 pt-4">
					<Card
					imgsrc={imgAdd}
					title="Administrar Productos"
					text={`Agregar/editar productos y administrar imágenes`}
					linkto="/products/edit"
					/>
				</div>
				<div className="col-md-4  pt-4">
					<Card
					imgsrc={imgCats}
					title="Administrar Categorías"
					text={`Agregar o editar categorías`}
					linkto='/products/categories/edit'
					/>
				</div>
				<div className="col-md-4  pt-4">
					<Card imgsrc={imgOrders}
					title="Órdenes"
					text="Listado completo"
					linkto = "/orders/table"
					/>
				</div>
				<div className="col-md-4  pt-4">
					<Card imgsrc={imgUsers}
					title="Gente"
					text="Listado de staff y de usuarios registrados"
					linkto = "/admin/usersTable"
					/>
				</div>
			</div>

		</div>
		</Fade>
		);
}

const mapStateToProps = state => {
	return{
		user : state.auth.user,
		isFetching: state.auth.isFetching
	}
}

export default connect(mapStateToProps)(ControlPanel);
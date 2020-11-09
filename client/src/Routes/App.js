import React, { useState, useEffect } from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import axios from "axios";

//Estilo
import './App.css';
import './App.scss'; 
import 'bootstrap/dist/css/bootstrap.min.css';

//Componentes
import Crud from '../components/products/Crud'
import Catalog from '../components/products/Catalog';
import NavBar from '../components/navbar/navbar';
import Producto from '../components/product-id/Producto';
import CategoriesCrud from '../components/products/CategoriesCrud';
import Footer from '../components/Footer'
import Register from '../components/users/Register';
import Cart from '../components/cart/index'
import Order from '../components/order'
import OrdersTable from '../components/order/OrdersTable';
import Home from '../components/Home/Home'
import Login from '../components/users/login'
import OrderInfo from '../components/order/orderInfo'
import ControlPanel from '../components/admin/controlPanel'
import UsersTable from '../components/users/UsersTable'
import NotFound from  '../components/NotFound'
import Profile from '../components/users/profile'
import OrderUser from '../components/order/orderUser'
import About from '../components/about/About'
import PasswordForgot from '../components/users/PasswordForgot'
import PasswordChange from '../components/users/PasswordChange';
import PasswordReset from '../components/users/PasswordReset';
import Wishlist from '../components/users/Wishlist';

//Redux
import { connect } from 'react-redux';
//import store from '../redux/store';
import { checkSession } from '../redux/actions/auth';


const App = (props) => {
  
  //Estado de productos: los que va a mostrar el catálogo en la ruta /products
  const [ products, setProducts ] = useState([]);

  //Estado categorías. Lo actualiza getCategories
  const [ categories, setCategories ] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  //Redux
  const { view, searchInput, selectedCategory, currentPage, checkSession } = props;

  //Hacemos *siempre* un axios a /auth/me para que, si hay una sesión activa (es decir, hay un accessToken presente en localStorage),
  //ésta se mantenga vigente a través de recargas de la página, o salir y volver a entrar. Hasta que el usuario haga logout. (y ponerle un tiempo de expiracion al token?)
  const actualToken = localStorage.getItem('actualToken');
  checkSession(actualToken);

  //Traer lista entera actualizada de categorías de la base de datos
  const getCategories = async ()=>{
    try {
        const response = await fetch(`http://localhost:3001/products/categories`);
        const jsonData = await response.json();
        setCategories(jsonData)
    } catch (error) {
        console.error(error.message)
    }
  }

  //getProducts: trae productos de la BD y setea el estado local products DEPENDIENDO del estado global 'view'.
  //El valor de este estado se modifica en ocasiones específicas y va a determinar si getProducts:||||
  //  -trae *todos* los productos (view === 'All')
  //  -trae según selectedCategory (view === 'Category')
  //  -trae según searchInput (view === 'Search')
  const getProducts = ()=>{
    switch(view){
      case 'All':
        fetch(`http://localhost:3001/products?offset=${(currentPage - 1) * 15}&limit=15`)
        .then(r=>r.json())
        .then(json=>setProducts(json))
        .catch(err => console.log(err));
        break;
      case 'Category':
        fetch(`http://localhost:3001/products/categorias/${selectedCategory}?offset=${(currentPage - 1) * 15}&limit=15`)
        .then(r => r.json())
        .then(json => setProducts(json))
        .catch(err => console.log(err));
        break;
      case 'Search':
        fetch(`http://localhost:3001/products/search?product=${searchInput}&offset=${(currentPage - 1) * 15}&limit=15`)
        .then(res=> res.json())
        .then(res=> setProducts(res))
        .catch(err => console.log(err));
        break;
    } 
  }

  useEffect(()=>{
    //Comenté este getProducts porque creo que no es necesario, lo dejo por las dudas, si se llega a romper el catálogo quiza tenga que ver -fran
    //getProducts();
    getCategories();
  },[])

  return(
    <BrowserRouter>
      <Route path ='/' render={ ()=><NavBar/> }/>
      <Switch>
        <Route exact path='/' render={()=>{
          return <Home products={products}/>
        }}/>
          
        <Route exact path='/signup'>
              <Register/>
        </Route>
        
        <Route exact path='/products' render={()=>{
          return <Catalog
            getProducts={getProducts}
            categories={categories}
            products={products}
            getCategories={getCategories}
          />
        }}/>

        <Route exact path='/products/edit'> 
          <Crud
            categories={categories}
          />
        </Route>
        <Route exact path='/products/categories/edit' render = {()=><CategoriesCrud categories={categories} getCategories={getCategories}/>}/>
        <Route path='/products/:id' component={Producto}/>
        <Route path='/cart'>
          <Cart/>
        </Route>
        <Route exact path='/order'>
          <Order/>
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path='/orders/table/:id'>
          <OrderInfo />
        </Route>
         <Route exact path="/admin"> <ControlPanel/> </Route> 
        <Route exact path='/orders/table'>
          <OrdersTable/>
        </Route>
        <Route exact path="/admin/usersTable"><UsersTable/></Route>

        <Route exact path='/profile'><Profile/></Route>
        <Route exact path='/orderUser'><OrderUser/></Route>
        <Route exact path='/profile/wishlist'>
          <Wishlist/>
        </Route>
        <Route exact path='/profile/password-reset'>
          <PasswordChange/>
        </Route>
        <Route exact path='/about' component={About} />
        <Route path='/passwordforgot' component={PasswordForgot}/>
        <Route path='/passwordreset/:user_id/:passResetToken' render={({match}) => <PasswordReset user_id={match.params.user_id} passResetToken={match.params.passResetToken}/>} />
        <Route component={NotFound} />
      </Switch>
        <Route path='/' component={Footer}/>
    </BrowserRouter>
    )
}

const mapStateToProps = state => {
  return {
    view: state.main.view,
    selectedCategory: state.main.selectedCategory,
    searchInput: state.main.searchInput,
    currentPage: state.main.currentPage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkSession: token => dispatch(checkSession(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

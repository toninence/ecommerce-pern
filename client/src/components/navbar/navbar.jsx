import React from 'react';
//Redux
import { connect } from 'react-redux';
import AdminNavBar from './admin-navbar';
import NormalNavBar from './normal-navbar';

function NavBar (props) {
    const { getProducts, categories } = props;

    //Redux
    const { user } = props;

    if (user.role === 'admin'){
        return <AdminNavBar getProducts={getProducts} categories={categories}/>
    }
    else return <NormalNavBar getProducts={getProducts} categories={categories}/>
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(NavBar);
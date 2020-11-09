import axios from 'axios';

export const SEARCH_CRUD = 'SEARCH_CRUD';
export const SELECT_CATEGORY_CRUD = 'SELECT_CATEGORY_CRUD';
export const SELECT_ALL_CRUD = 'SELECT_ALL_CRUD';
export const CHANGE_PAGE_CRUD = 'CHANGE_PAGE_CRUD';
export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const SEARCH_ID_CRUD = 'SEARCH_ID_CRUD';

export const search = searchInput => {
    return {
        type: SEARCH_CRUD,
        payload: searchInput
    }
};
export const selectCategory = category => {
    return {
        type: SELECT_CATEGORY_CRUD,
        payload: category
    }
};
export const selectAll = () => {
    return {
        type: SELECT_ALL_CRUD
    }
};
export const changePage = num => {
    return {
        type: CHANGE_PAGE_CRUD,
        payload: num
    }
}

export const selectID = ID => {
    return {
        type: SEARCH_ID_CRUD,
        payload: ID
    }
}

export const requestProducts = () => {
    return {
        type: REQUEST_PRODUCTS
    }
}

export const receiveProducts = products => {
    return {
        type: RECEIVE_PRODUCTS,
        payload: products
    }
}

export const getProducts = (view, searchInput, selectedCategory, currentPage, selectedID) => {
    return dispatch => {
        dispatch(requestProducts());
        switch(view){
            case 'All':
                axios.get(`http://localhost:3001/products?offset=${(currentPage - 1) * 15}&limit=15`)
                .then(response => dispatch(receiveProducts(response.data)))
                .catch(err => console.log('error al hacer getProducts-All en CRUD:',err));
                break;
            case 'Category':
                axios.get(`http://localhost:3001/products/categorias/${selectedCategory}?offset=${(currentPage - 1) * 15}&limit=15`)
                .then(response => dispatch(receiveProducts(response.data)))
                .catch(err => console.log('error al hacer getProducts-Category en CRUD:',err));
                break;
            case 'Search':
                axios.get(`http://localhost:3001/products/search?product=${searchInput}&offset=${(currentPage - 1) * 15}&limit=15`)
                .then(response => dispatch(receiveProducts(response.data)))
                .catch(err => console.log('error al hacer getProducts-Search en CRUD:',err));
                break;
            case 'ID':
                axios.get(`http://localhost:3001/products/${selectedID}`)
                .then(response => {dispatch(receiveProducts(response.data)); console.log(response.data)})
                .catch(err => console.log('error al hacer getProducts-ID en CRUD:', err))
        }
    }
}
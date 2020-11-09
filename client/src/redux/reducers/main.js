import { SEARCH, SELECT_CATEGORY, SELECT_ALL, CHANGE_PAGE } from '../actions/main'
//view determina qué se va a mostrar en el catálogo...
//'All' : se muestran todos los productos (SELECT_ALL)
//'Category': se muestran los productos de la categoría selectedCategory (SELECT_CATEGORY)
//'Search': se muestran los resultados de la búsqueda del usuario (SEARCH)
//(estos funcionamientos tienen que ser implementados en cada componente. Redux sólo le va a indicar
// mediante este state 'view' qué es lo que el usuario desea ver)
const initialState = {
    searchInput: '',
    selectedCategory: null,
    view: 'All',
    currentPage: 1
}

export default (state = initialState, action) => {
    switch(action.type){
        case SEARCH:
            if(action.payload === ''){
                return {
                    ...state,
                    view: 'All',
                    searchInput: action.payload
                }
            } else
            return {
                ...state,
                view: 'Search',
                searchInput: action.payload
            };
        case SELECT_CATEGORY:
            return {
                ...state,
                view: 'Category',
                selectedCategory: action.payload
            }
        case SELECT_ALL:
            return {
                ...state,
                selectedCategory: null,
                view: 'All'
            }
        case CHANGE_PAGE:
            return {
                ...state,
                currentPage: action.payload
            }
    }
    return state;
}
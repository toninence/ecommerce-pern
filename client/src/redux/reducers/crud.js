import { SEARCH_CRUD, SELECT_CATEGORY_CRUD, SELECT_ALL_CRUD, CHANGE_PAGE_CRUD, REQUEST_PRODUCTS, RECEIVE_PRODUCTS, SEARCH_ID_CRUD } from '../actions/crud';

const initialState = {
    isFetching: false,
    settings: {
        searchInput: '',
        selectedCategory: null,
        view: 'All',
        currentPage: 1,
        selectedID: null
    },
    products: []
}

export default (state = initialState, action) => {
    switch(action.type){
        case SEARCH_CRUD:
            if(action.payload === ''){
                return {
                    ...state,
                    settings: {
                        ...state.settings,
                        view: 'All',
                        searchInput: action.payload
                    }
                }
            } else
            return {
                ...state,
                settings: {
                    ...state.settings,
                    view: 'Search',
                    searchInput: action.payload    
                }
            };
        case SELECT_CATEGORY_CRUD:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    view: 'Category',
                    selectedCategory: action.payload
                }
            }
        case SELECT_ALL_CRUD:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    selectedCategory: null,
                    view: 'All'
                }
            }
        case CHANGE_PAGE_CRUD:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    currentPage: action.payload
                }
            }
        case SEARCH_ID_CRUD:
            if(action.payload === ''){
                return {
                    ...state,
                    settings: {
                        ...state.settings,
                        view: 'All',
                        selectedID: null
                    }
                }
            }
            return {
                ...state,
                settings: {
                    ...state.settings,
                    view: 'ID',
                    selectedID: action.payload
                }
            }
        case REQUEST_PRODUCTS:
            return {
                ...state,
                isFetching: true
            }
        case RECEIVE_PRODUCTS:
            return {
                ...state,
                isFetching: false,
                products: action.payload
            }
    }
    return state;
}
export const SEARCH = 'SEARCH';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SELECT_ALL = 'SELECT_ALL';
export const CHANGE_PAGE = 'CHANGE_PAGE';

export const search = searchInput => {
    return {
        type: 'SEARCH',
        payload: searchInput
    }
};
export const selectCategory = category => {
    return {
        type: SELECT_CATEGORY,
        payload: category
    }
};
export const selectAll = () => {
    return {
        type: SELECT_ALL
    }
};
export const changePage = pageNumber => {
    return {
        type: CHANGE_PAGE,
        payload: pageNumber
    }
}
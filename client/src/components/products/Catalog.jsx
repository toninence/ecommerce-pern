import React, { useEffect } from 'react'
import ProductCard from './ProductCard.jsx';
import { Button } from 'react-bootstrap';
import styles from './catalog.module.css'
//Redux
import store from '../../redux/store';
import { selectAll, selectCategory, changePage } from '../../redux/actions/main'
import { connect } from 'react-redux';
import { Fade, Grow } from '@material-ui/core'
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa'

function Catalogo(props) {
    const { categories, products, getProducts, getCategories } = props;

    //Redux
    const { selectAll, selectCategory, selectedCategory, view, searchInput, currentPage, changePage } = props;

    const retrocederPagina = () => {
        changePage(currentPage - 1);
    };
    const avanzarPagina = () => {
        changePage(currentPage + 1);
    };

    const active = styles.activo

    useEffect(() => {
        getProducts();
        getCategories();
    }, [view, selectedCategory, searchInput, currentPage]);

    return (
        <div className='container-fluid mt-2 pt-2 mb-2'>
            <div className='d-flex flex-row'>
                <div className={`${styles.categorias} col-md-3`} >
                    {/* <Button>Todos los productos</Button> */}
                    <ul className="list-group">

                        {/* Botón mostrar todos */}
                        <li onClick={() => {
                            selectAll();
                            getProducts();
                        }}
                            className={`list-group-item list-group-item-action ${view === 'All' && active}`}
                        >Todos los productos</li>
                        {/* Botón mostrar todos */}

                        {categories.map(cat => {
                            let categoryClass = 'list-group-item list-group-item-action '
                            if (selectedCategory === cat.name && view === 'Category') categoryClass += active
                            return <li key={cat.category_id} className={`${categoryClass} ${styles.category}`} onClick={() => {
                                selectCategory(cat.name);
                                changePage(1);
                                getProducts();
                            }}>{cat.name}</li>
                        })}
                    </ul>
                </div>
                <div className='container-fluid'>
                    <div>
                        {(view === 'Category' && products.length) ? <h4>{`Mostrando productos de la categoría ${selectedCategory}`}</h4> : null}
                        {(view === 'Search' && products.length) ? <h4>{`Resultados de búsqueda para "${searchInput}"`}</h4> : null}
                    </div>
                    <Fade
                        in={true}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(true ? { timeout: 800 } : {})}
                    >
                        <div className="main d-flex flex-wrap align-content-start">

                            {products.length ? products.map(prod =>
                                <ProductCard key={prod.product_id} data={prod} />
                            ) : <h4>{view === 'Search' ? `No se encontraron resultados para "${searchInput}"...` : (selectedCategory !== null ? `La categoría "${selectedCategory}" no contiene ningún producto...` : 'No hay productos cargados')}</h4>}

                        </div>
                    </Fade>
                    {/* NAVEGACIÓN DE PÁGINAS */}
                    <div className={`d-flex justify-content-around ${styles.navigationPages}`}>

                        {currentPage > 1 ? <Button className={styles.buttonPagination} onClick={() => {
                            retrocederPagina();
                        }}
                        ><FaArrowCircleLeft /></Button> : <FaArrowCircleLeft />}

                        <span className={styles.currentPage}>{currentPage}</span>

                        {!(products.length < 12) ? <Button className={styles.buttonPagination} onClick={() => {
                            avanzarPagina();
                        }}
                        ><FaArrowCircleRight /></Button> : <FaArrowCircleRight />}

                    </div>

                </div>
            </div>

        </div>


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
        selectAll: () => dispatch(selectAll()),
        selectCategory: catName => dispatch(selectCategory(catName)),
        changePage: pageNumber => dispatch(changePage(pageNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalogo);
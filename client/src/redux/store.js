import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from './reducers/rootReducer';
import thunkMiddleware from 'redux-thunk'

//import { createLogger } from 'redux-logger'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* thunkMiddleware,  */composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

//console.log(store.getState())

export default store;

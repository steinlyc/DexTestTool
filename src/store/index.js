import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger'
import reducer from '../reducer';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk, logger)
));

export default store;
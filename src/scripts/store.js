import { createStore } from 'redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
import reducer from './reducer';

const store = createStore(reducer, responsiveStoreEnhancer);

export default store;
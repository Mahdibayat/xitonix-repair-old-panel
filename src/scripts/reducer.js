import { combineReducers } from 'redux';
import { responsiveStateReducer } from 'redux-responsive';
import { Actions } from '../scripts/settings';

const initialState = {
    openKey: '',
    selectedKey: '',
    user: {
        rules: []
    }
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.OPEN_MENU: {
            return {
                ...state,
                openKey: action.payload
            };
        }
        case Actions.SET_ROUTE: {
            return {
                ...state,
                openKey: action.payload.openKey,
                selectedKey: action.payload.selectedKey
            };
        }
        case Actions.UPDATE_USER: {
            return {
                ...state,
                user: action.payload
            };
        }
        default:
            return state;
    }
};

export default combineReducers({
    browser: responsiveStateReducer,
    app: rootReducer
});
import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import Immutable from 'immutable';
import dataReducer from './data.reducer';

const testApp = combineReducers({
    dataReducer,
    routeReducer
});

export default testApp;
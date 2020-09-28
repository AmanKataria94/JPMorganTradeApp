import { combineReducers } from 'redux';
import placeOrder from './placeOrder';
import lastUpdated from './lastUpdated';

export default combineReducers({
    placeOrder,
    lastUpdated
})
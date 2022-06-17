// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import money from './money';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, money });

export default reducers;

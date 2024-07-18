import { combineReducers } from 'redux';
import playerReducer from './playerReducer';
import gameReducer from './gameReducer';
import timerReducer from './timerReducer';
import configurationReducer from './configurationReducer';

const rootReducer = combineReducers({
  playerReducer,
  gameReducer,
  timerReducer,
  configurationReducer,
});

export default rootReducer;

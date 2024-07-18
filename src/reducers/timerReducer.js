import {
  UPDATE_TIMER,
  RESET_TIMER,
  STOP_TIMER,
} from '../actions';

const maxTime = 30;

const INITIAL_STATE = {
  timer: maxTime,
  timerStopped: false,
};

const timerReducer = (state = INITIAL_STATE, { type }) => {
  switch (type) {
  case UPDATE_TIMER:
    return {
      ...state,
      timer: state.timer - 1,
    };
  case RESET_TIMER:
    return {
      ...state,
      timer: maxTime,
      timerStopped: false,
    };
  case STOP_TIMER:
    return {
      ...state,
      timerStopped: true,
    };
  default:
    return state;
  }
};

export default timerReducer;

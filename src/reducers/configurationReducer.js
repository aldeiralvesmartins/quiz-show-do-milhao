import {
  UPDATE_CATEGORY,
  UPDATE_DIFFICULTY,
  UPDATE_TYPE,
} from '../actions';

const INITIAL_STATE = {
  category: 0,
  difficulty: '',
  type: '',
};

const configurationReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case UPDATE_CATEGORY:
    return {
      ...state,
      category: payload,
    };
  case UPDATE_DIFFICULTY:
    return {
      ...state,
      difficulty: payload,
    };
  case UPDATE_TYPE:
    return {
      ...state,
      type: payload,
    };
  default:
    return state;
  }
};

export default configurationReducer;

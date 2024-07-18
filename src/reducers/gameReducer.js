import {
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_ERROR,
  NEXT_QUESTION,
  UPDATE_SCORE,
  RESET_QUESTIONS,
} from '../actions';

const INITIAL_STATE = {
  questions: [],
  question: {},
  answers: [],
  isLoading: true,
  error: null,
  score: 0,
  assertions: 0,
};

const questionsReset = {
  questions: [],
  question: {},
  answers: [],
  isLoading: true,
  error: null,
};

const getNextQuestion = (
  { questions, question },
) => questions[questions.indexOf(question) + 1];

const fiftyPercent = 0.5;
const caseTrue = 1;
const caseFalse = -1;
const getAnswers = (question) => {
  const answers = question
    ? [question.correct_answer, ...question.incorrect_answers]
    : [];

  /*
    shuffle array js
    source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  */
  return answers.sort(() => (Math.random() > fiftyPercent ? caseTrue : caseFalse));
};

const gameReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case GET_QUESTIONS:
    return {
      ...INITIAL_STATE,
    };
  case GET_QUESTIONS_SUCCESS:
    return {
      ...state,
      questions: payload,
      question: payload[0],
      answers: getAnswers(payload[0]),
      isLoading: false,
    };
  case GET_QUESTIONS_ERROR:
    return {
      ...state,
      error: payload,
      isLoading: false,
    };
  case NEXT_QUESTION:
    return {
      ...state,
      question: getNextQuestion(state),
      answers: getAnswers(getNextQuestion(state)),
    };
  case UPDATE_SCORE:
    return {
      ...state,
      score: payload,
      assertions: state.assertions + 1,
    };
  case RESET_QUESTIONS:
    return {
      ...state,
      ...questionsReset,
    };
  default:
    return state;
  }
};

export default gameReducer;

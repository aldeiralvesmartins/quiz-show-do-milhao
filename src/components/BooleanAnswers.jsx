import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const correctAnswer = 'correct-answer';

class BooleanAnswers extends React.Component {
  render() {
    const { question, disabled, handleQuestionAnswered } = this.props;
    return (
      <>
        <button
          type="button"
          onClick={ handleQuestionAnswered }
          disabled={ disabled }
          data-testid={
            question.correct_answer === 'True' ? correctAnswer : 'wrong-answer-0'
          }
        >
          VERDADEIRO
        </button>
        <button
          type="button"
          onClick={ handleQuestionAnswered }
          disabled={ disabled }
          data-testid={
            question.correct_answer === 'False' ? correctAnswer : 'wrong-answer-0'
          }
        >
          FALSO
        </button>
      </>
    );
  }
}

const mapStateToProps = ({ gameReducer: { question } }) => ({
  question,
});

export default connect(mapStateToProps)(BooleanAnswers);

BooleanAnswers.propTypes = {
  question: PropTypes.shape({
    correct_answer: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  handleQuestionAnswered: PropTypes.func,
}.isRequired;

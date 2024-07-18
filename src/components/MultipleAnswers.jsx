import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './QuestionCard.module.css';

class MultipleAnswers extends React.Component {
  render() {
    const { question, disabled, handleQuestionAnswered, answers } = this.props;

    return (
        <div className={styles.buttonContainer}>
          {answers.map((answer, index) => (
              <button
                  key={index}
                  type="button"
                  onClick={(event) => handleQuestionAnswered(event, index)}
                  disabled={disabled}
                  data-testid={
                    question.incorrect_answers.includes(answer)
                        ? `wrong-answer-${question.incorrect_answers.indexOf(answer)}`
                        : 'correct-answer'
                  }
                  className={styles.answerButton}
              >
                <span className={styles.buttonCircle}>{index + 1}</span>
                {answer}
              </button>
          ))}
        </div>
    );
  }
}

const mapStateToProps = ({ gameReducer: { question, answers } }) => ({
  question,
  answers,
});

export default connect(mapStateToProps)(MultipleAnswers);

MultipleAnswers.propTypes = {
  question: PropTypes.shape({
    correct_answer: PropTypes.string,
    incorrect_answers: PropTypes.arrayOf(PropTypes.string),
  }),
  disabled: PropTypes.bool,
  handleQuestionAnswered: PropTypes.func,
}.isRequired;

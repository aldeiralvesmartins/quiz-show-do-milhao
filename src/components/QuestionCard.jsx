import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import BooleanAnswers from './BooleanAnswers';
import MultipleAnswers from './MultipleAnswers';
import Timer from './Timer';
import {
  nextQuestion, resetQuestions, resetTimer, stopTimer, updateScore,
} from '../actions';
import style from './QuestionCard.module.css';
import certaRespostaAudio from '../certa-resposta.wav';
import dinheiro from '../DINHEIRO.WAV';
import quePenaAudio from '../que-pena.wav';

const baseScore = 10;

class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disableButtons: false,
      nexButtonVisible: false,
    };

    this.audioRef = React.createRef();

    this.toggleDisableButtons = this.toggleDisableButtons.bind(this);
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);

    // Refs para os elementos de áudio
    this.audioCertaRespostaRef = React.createRef();
    this.audioDinheiroRef = React.createRef();
    this.audioQuePenaRef = React.createRef();
  }

  componentDidMount() {
    this.audioRef.current.play();
  }

  componentWillUnmount() {
    const { dispatchResetQuestions } = this.props;
    dispatchResetQuestions();
  }

  setScore() {
    const { question, timer, dispatchUpdateScore } = this.props;

    const difficultyScore = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    const stateObj = JSON.parse(localStorage.getItem('state'));

    stateObj.player.score += baseScore + (timer * difficultyScore[question.difficulty]);
    stateObj.player.assertions += 1;

    localStorage.setItem('state', JSON.stringify(stateObj));

    dispatchUpdateScore(stateObj.player.score);
  }

  toggleDisableButtons() {
    this.setState((prevState) => ({
      // disableButtons: !prevState.disableButtons,
    }));
  }

  resetColor() {
    const buttons = document.querySelectorAll('button[data-testid*="answer"]');
    buttons.forEach(button => button.classList.remove(style.correct, style.incorrect));
  }

  handleNextQuestion() {
    const { dispatchNextQuestion, dispatchResetTimer, questions, question, history, gravatar } = this.props;

    if (questions.indexOf(question) === questions.length - 1) {
      const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
      const { player } = JSON.parse(localStorage.getItem('state'));

      ranking.push({
        name: player.name,
        score: player.score,
        picture: gravatar,
      });

      ranking.sort((first, second) => second.score - first.score);

      localStorage.setItem('ranking', JSON.stringify(ranking));

      history.push('/feedback');
    } else {
      dispatchNextQuestion();
      this.resetColor();
      this.toggleNextButtonVisibility();
    }

    this.toggleDisableButtons();
    dispatchResetTimer();
  }

  changeColor({ target }, index) {
    const getButtons = target.parentElement.children;

    for (let i = 0; i < getButtons.length; i += 1) {
      if (i === index) {
        if (getButtons[i].dataset.testid === 'correct-answer') {
          getButtons[i].classList.add(style.correct);
          // Reproduz o áudio de resposta correta
          this.audioDinheiroRef.current.play();


          setTimeout(() => {
            this.audioCertaRespostaRef.current.play();
          }, 1000);

        } else {
          getButtons[i].classList.add(style.incorrect);
          // Reproduz o áudio de resposta incorreta
          this.audioQuePenaRef.current.play();
        }
      }
    }
  }

  toggleNextButtonVisibility() {
    this.setState((prevState) => ({
      nexButtonVisible: !prevState.nexButtonVisible,
    }));
  }

  handleQuestionAnswered(event, index) {
    const { dispatchStopTimer } = this.props;

    this.changeColor(event, index);
    this.toggleNextButtonVisibility();

    if (event.target.dataset.testid === 'correct-answer') {
      this.setScore();
    }

    dispatchStopTimer();
  }

  renderAnswers() {
    const { question } = this.props;
    const { disableButtons } = this.state;

    return (
        <section className={style.answersContainer}>
          {question.type === 'boolean' ? (
              <BooleanAnswers
                  handleQuestionAnswered={this.handleQuestionAnswered}
                  disabled={disableButtons}
              />
          ) : (
              <MultipleAnswers
                  handleQuestionAnswered={this.handleQuestionAnswered}
                  disabled={disableButtons}
              />
          )}
        </section>
    );
  }

  render() {
    const { question, isLoading, error } = this.props;
    const { nexButtonVisible } = this.state;

    if (isLoading) return <Loading />;
    if (error) return <p>{error.message}</p>;
    if (!question) {
      return (
          <section className={style.noQuestions}>
            <p>Não foram encontradas questões suficientes com estas configurações</p>
            <Link to="/">Voltar</Link>
          </section>
      );
    }

    return (
        <section className={style.container}>
          <section className={style.questionContainer}>
            <div className={style.questionBalloon}>
              <p data-testid="question-text">{question.question}</p>
            </div>
            <img
                src={require('../silvio.png')}
                alt="Jogar!"
                className={style.silvioImage}
            />
          </section>

          {/* Áudio de resposta correta */}
          <audio ref={this.audioCertaRespostaRef} src={certaRespostaAudio}/>
          <audio ref={this.audioDinheiroRef} src={dinheiro}/>
          {/* Áudio de resposta incorreta */}
          <audio ref={this.audioQuePenaRef} src={quePenaAudio}/>

          <Timer toggleDisableButtons={this.toggleDisableButtons}/>

          <section className={style.questionCard}>
            {this.renderAnswers()}
          </section>

          <button
              className={style.nextButton}
              type="button"
              onClick={this.handleNextQuestion}
              hidden={!nexButtonVisible}
              data-testid="btn-next"
          >
            Próxima
          </button>
          <audio
              ref={this.audioRef}
              src={require('../suspense.wav')}
              loop
              hidden
          />
        </section>
    );
  }
}

const mapStateToProps = ({
                           gameReducer: {questions, question, isLoading, error},
                           playerReducer: { gravatar },
                           timerReducer: { timer },
                         }) => ({
  questions,
  question,
  isLoading,
  error,
  gravatar,
  timer,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchNextQuestion: () => dispatch(nextQuestion()),
  dispatchResetTimer: () => dispatch(resetTimer()),
  dispatchUpdateScore: (score) => dispatch(updateScore(score)),
  dispatchStopTimer: () => dispatch(stopTimer()),
  dispatchResetQuestions: () => dispatch(resetQuestions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard);

QuestionCard.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object),
  question: PropTypes.shape({
    category: PropTypes.string,
    type: PropTypes.string,
    difficulty: PropTypes.string,
    question: PropTypes.string,
    correct_answer: PropTypes.string,
    incorrect_answer: PropTypes.arrayOf(PropTypes.string),
  }),
}.isRequired;

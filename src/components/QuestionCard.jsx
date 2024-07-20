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
import okParouAudio from '../ok-parou.wav';
import tempoAcabouAudio from '../ah-nao-da-mais-nao-tempo-acabou.wav'; // Ensure the file path is correct


const baseScore = 10; // Definição de baseScore

class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disableButtons: false,
      nextButtonVisible: false,
    };

    this.audioRef = React.createRef();
    this.audioCertaRespostaRef = React.createRef();
    this.audioDinheiroRef = React.createRef();
    this.audioQuePenaRef = React.createRef();
    this.audioOkParouRef = React.createRef();
    this.audioTempoAcabouRef = React.createRef(); // Ref for the new audio


    this.toggleDisableButtons = this.toggleDisableButtons.bind(this);
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
    this.handleStopGame = this.handleStopGame.bind(this);
    this.handleTimeUp = this.handleTimeUp.bind(this);
  }

  componentDidMount() {
    if (this.audioRef.current) {
      this.audioRef.current.play();
    }
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
      disableButtons: !prevState.disableButtons,
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
      this.setState({ disableButtons: false, nextButtonVisible: false });
    }

    dispatchResetTimer();
  }

  handleStopGame() {
    const { history } = this.props;

    if (this.audioOkParouRef.current) {
      this.audioOkParouRef.current.addEventListener('ended', () => {
        history.push('/feedback');
      });

      this.audioOkParouRef.current.play().catch(error => console.error('Error playing audio:', error));
    } else {
      history.push('/feedback');
    }
  }

  handleTimeUp() {
    const { history } = this.props;

    // Verifique se o elemento de áudio está disponível
    if (this.audioTempoAcabouRef.current) {
      // Adicione um listener para o evento 'ended' do áudio
      this.audioTempoAcabouRef.current.addEventListener('ended', () => {
        // Redireciona para a tela de feedback após o áudio ter terminado de tocar
        history.push('/feedback');
      });

      // Inicia a reprodução do áudio
      this.audioTempoAcabouRef.current.play().catch(error => console.error('Error playing audio:', error));
    } else {
      // Se o áudio não estiver disponível, redireciona imediatamente
      history.push('/feedback');
    }
  }

  changeColor({ target }, index) {
    const getButtons = target.parentElement.children;

    for (let i = 0; i < getButtons.length; i += 1) {
      if (i === index) {
        if (getButtons[i].dataset.testid === 'correct-answer') {
          getButtons[i].classList.add(style.correct);
          this.audioDinheiroRef.current.play();

          setTimeout(() => {
            this.audioCertaRespostaRef.current.play();
          }, 1000);

        } else {
          getButtons[i].classList.add(style.incorrect);
          this.audioQuePenaRef.current.play();
        }
      }
    }
  }

  handleQuestionAnswered(event, index) {
    const { dispatchStopTimer, history } = this.props;

    this.changeColor(event, index);
    this.setState({ disableButtons: true, nextButtonVisible: true });

    if (event.target.dataset.testid === 'correct-answer') {
      this.setScore();
      setTimeout(this.handleNextQuestion, 3000);
    } else {
      setTimeout(() => {
        history.push('/feedback');
      }, 3000);
    }

    dispatchStopTimer();
  }

  calculateScore() {
    const { question, timer } = this.props;
    const difficultyScore = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    return baseScore + (timer * difficultyScore[question.difficulty]);
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
    const { nextButtonVisible } = this.state;
    const currentScore = this.calculateScore();
    const nextQuestionScore = currentScore + baseScore;

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

          <audio ref={this.audioCertaRespostaRef} src={certaRespostaAudio}/>
          <audio ref={this.audioDinheiroRef} src={dinheiro}/>
          <audio ref={this.audioQuePenaRef} src={quePenaAudio}/>
          <audio ref={this.audioOkParouRef} src={okParouAudio}/>
          {/* Nova linha */}
          <audio ref={this.audioTempoAcabouRef} src={tempoAcabouAudio}/>
          {/* Add this line */}


          <Timer toggleDisableButtons={this.toggleDisableButtons} onTimeUp={this.handleTimeUp}/>

          <section className={style.questionCard}>
            {this.renderAnswers()}
          </section>

          <section className={style.buttonsContainer}>
            <button
                className={style.next1Button}
                type="button"
                data-testid="btn-current-points"
            >
              Errar: {currentScore}
            </button>
            <button
                className={style.next1Button}
                type="button"
                onClick={this.handleStopGame}
                data-testid="btn-stop"
            >
              Parar
            </button>
            <button
                className={style.next1Button}
                type="button"
                data-testid="btn-next-points"
            >
              Acertar: {nextQuestionScore}
            </button>
          </section>

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
                           playerReducer: {gravatar},
                           timerReducer: {timer},
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

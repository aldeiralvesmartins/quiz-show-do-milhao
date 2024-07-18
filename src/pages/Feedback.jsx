import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PlayerHeader from '../components/PlayerHeader';
import style from './Feedback.module.css';

const niceGrade = 3;

class Feedback extends React.Component {
  render() {
    const { assertions, score, history } = this.props;

    return (
      <main>
        <PlayerHeader />
        <div className={ style.container }>
          <section className={ style.feedbackCard }>
            <h1 className={ style.title } data-testid="feedback-text">
              Feedback
            </h1>
            <p className={ style.assertions } data-testid="feedback-total-question">
              {assertions}
            </p>
            <p className={ style.score } data-testid="feedback-total-score">
              {score}
            </p>
            <p
              className={
                `${style.feedbackText} ${assertions < niceGrade && style.badScore}`
              }
              data-testid="feedback-text"
            >
              {
                assertions >= niceGrade ? 'Mandou bem!' : 'Podia ser melhor...'
              }
            </p>
            <section className={ style.buttonsContainer }>
              <button
                className={ style.button }
                type="button"
                onClick={ () => history.push('/ranking') }
                data-testid="btn-ranking"
              >
                Ver Ranking
              </button>
              <button
                className={ style.button }
                type="button"
                onClick={ () => history.push('/') }
                data-testid="btn-play-again"
              >
                Jogar novamente
              </button>
            </section>
          </section>
        </div>
      </main>
    );
  }
}

const mapStateToProps = ({ gameReducer: { assertions, score } }) => ({
  assertions,
  score,
});

export default connect(mapStateToProps)(Feedback);

Feedback.propTypes = {
  assertions: PropTypes.number,
}.isRequired;

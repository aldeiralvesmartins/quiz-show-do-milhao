import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { savePlayer, fetchQuestions } from '../actions';
// import { fetchToken } from '../services/api';
import style from './LoginForm.module.css';

class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      isDisabled: false, // Inicialize como false para permitir jogar imediatamente
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setPlayer() {
    const { dispatchPlayer } = this.props;
    const player = {
      name: 'Anonymous', // Nome padrão
      assertions: 0,
      score: 0,
      gravatarEmail: '', // Email padrão vazio
    };
    localStorage.setItem('state', JSON.stringify({ player }));
    dispatchPlayer(player);
  }

  setQuestions() {
    const { dispatchQuestions } = this.props;
    const token = localStorage.getItem('token');

    const payload = {
      token,
    };

    dispatchQuestions(payload);
  }

  handleSubmit() {
    this.setPlayer();
  }

  render() {
    return (
      <form className={ style.container }>
        <Link to="/game">
          <button
            className={ style.button }
            type="button"
            onClick={ this.handleSubmit }
            data-testid="btn-play"
          >
           <img src={ require('../butonJogar.png') } alt="Jogar!" className={style.buttonImage} />

          </button>
        </Link>
      </form>
    );
  }
}
const mapStateToProps = ({ configurationReducer: { category, difficulty, type } }) => ({
  category,
  difficulty,
  type,
});
const mapDispatchToProps = (dispatch) => ({
  dispatchPlayer: (player) => dispatch(savePlayer(player)),
  dispatchQuestions: (payload) => dispatch(fetchQuestions(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

LoginForm.propTypes = {
  dispatchPlayer: PropTypes.func.isRequired,
  dispatchQuestions: PropTypes.func.isRequired,
};

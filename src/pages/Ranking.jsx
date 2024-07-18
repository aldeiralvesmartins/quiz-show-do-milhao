import React from 'react';
import PropTypes from 'prop-types';
import style from './Ranking.module.css';

const maxRankersCount = 5;

class Ranking extends React.Component {
  getRankingPlayers() {
    return JSON.parse(localStorage.getItem('ranking'));
  }

  render() {
    const { history } = this.props;
    return (
      <main className={ style.container }>
        <h1 className={ style.title } data-testid="ranking-title">
          Ranking:
        </h1>
        <ol className={ style.listContainer }>
          {
            this.getRankingPlayers().map((player, index) => index < maxRankersCount && (
              <li className={ style.listItem } key={ index }>
                <img
                  className={ style.gravatar }
                  src={ player.picture }
                  alt="gravatar"
                />
                <p className={ style.playerName } data-testid={ `player-name-${index}` }>
                  {player.name}
                </p>
                <p data-testid={ `player-score-${index}` }>{player.score}</p>
              </li>
            ))
          }
        </ol>
        <button
          className={ style.button }
          type="button"
          onClick={ () => history.push('/') }
          data-testid="btn-go-home"
        >
          Início
        </button>
      </main>
    );
  }
}

export default Ranking;

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import style from './PlayerHeader.module.css';

class PlayerHeader extends React.Component {
  render() {
    const { score } = this.props;

    return (
      <div className={style.header}>
        <div className={style.userInfo}>
          <p className={style.headerScore} data-testid="header-score">R$ {score}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gameReducer: { score } }) => ({
  score,
});

export default connect(mapStateToProps)(PlayerHeader);

PlayerHeader.propTypes = {
  score: PropTypes.number.isRequired,
};

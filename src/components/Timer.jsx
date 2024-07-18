import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetTimer, updateTimer } from '../actions';
import style from './Timer.module.css';

const interval = 1000;
const maxTime = 30;
const ten = 10;
const timeEnding = 30;

class Timer extends React.Component {
  constructor() {
    super();

    this.state = {
      timerReference: null,
    };
  }

  componentDidMount() {
    this.timerControl();
  }

  componentDidUpdate() {
    const { timer, timerStopped } = this.props;
    const { timerReference } = this.state;

    if ((timer === 0 || timerStopped) && timerReference) {
      this.clearTimer();
    }

    if (timer === maxTime && !timerStopped && !timerReference) {
      this.timerControl();
    }
  }

  componentWillUnmount() {
    const { timerReference } = this.state;

    if (timerReference) this.clearTimer();
  }

  timerControl() {
    const {
      dispatchtUpdateTimer, dispatchResetTimer,
    } = this.props;

    const reference = setInterval(() => {
      dispatchtUpdateTimer();
    }, interval);

    dispatchResetTimer();

    this.setState({
      timerReference: reference,
    });
  }

  clearTimer() {
    const { toggleDisableButtons } = this.props;
    const { timerReference } = this.state;

    clearInterval(timerReference);

    toggleDisableButtons();

    this.setState({
      timerReference: null,
    });
  }

  render() {
    const { timer } = this.props;
    const progress = (timer / maxTime) * 100;

    return (
        <div className={style.imageContainer}>
          <div className={style.timerContainer}>
            <svg className={style.timerSvg} viewBox="0 0 36 36">
              <path
                  className={style.circleBg}
                  d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                  className={`${style.circle} ${timer <= timeEnding && style.ending}`}
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className={style.timerText}>
                {`${timer < ten ? `0${timer}` : timer}`}
              </text>
            </svg>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ timerReducer: { timer, timerReference, timerStopped } }) => ({
  timer,
  timerReference,
  timerStopped,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchtUpdateTimer: () => dispatch(updateTimer()),
  dispatchResetTimer: () => dispatch(resetTimer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer);

Timer.propTypes = {
  toggleDisableButtons: PropTypes.func,
}.isRequired;

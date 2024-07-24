import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetTimer, updateTimer } from '../actions';
import style from './Timer.module.css';
import timeUpAudio from '../certa-resposta.wav'; // Import audio file

const interval = 1000;
const maxTime = 30;
const ten = 10;
const timeEnding = 30;

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timerReference: null,
    };

    this.audioTimeUpRef = React.createRef(); // Create a ref for the time-up audio
  }

  componentDidMount() {
    this.timerControl();
    this.audioTimeUpRef.current.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
    });
  }

  componentDidUpdate(prevProps) {
    const { timer, timerStopped } = this.props;
    const { timerReference } = this.state;

    if ((timer === 0 || timerStopped) && timerReference) {
      this.clearTimer();
    }

    if (timer === maxTime && !timerStopped && !timerReference) {
      this.timerControl();
    }

    // Check if the time has reached zero to trigger time up action
    if (timer === 0 && !prevProps.timerStopped) {
      this.handleTimeUp();
    }
  }

  componentWillUnmount() {
    const { timerReference } = this.state;

    if (timerReference) this.clearTimer();
  }

  timerControl() {
    const { dispatchUpdateTimer, dispatchResetTimer } = this.props;

    const reference = setInterval(() => {
      dispatchUpdateTimer();
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

  handleTimeUp() {
    const { onTimeUp } = this.props;
    if (onTimeUp) {
      onTimeUp(); // Trigger the callback when time is up
    }
    const audio = this.audioTimeUpRef.current;
    if (audio) {
      audio.oncanplaythrough = () => {
        audio.play(); // Play the time-up audio when it's ready
      };
    }
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
          {/* Time-up audio */}
          <audio ref={this.audioTimeUpRef} src={timeUpAudio} />
        </div>
    );
  }
}

const mapStateToProps = ({ timerReducer: { timer, timerStopped } }) => ({
  // timer,
  timerStopped,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateTimer: () => dispatch(updateTimer()),
  dispatchResetTimer: () => dispatch(resetTimer()),
});

Timer.propTypes = {
  toggleDisableButtons: PropTypes.func.isRequired,
  onTimeUp: PropTypes.func,
  timer: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);

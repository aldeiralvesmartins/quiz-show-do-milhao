import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PlayerHeader from '../components/PlayerHeader';
import style from './Feedback.module.css';

const Feedback = ({ assertions, score, history }) => {
  // Define a contagem regressiva para 10 minutos (600 segundos)
  const countdownTime = 600; // em segundos
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const suspenseAudioRef = useRef(null); // Ref para o áudio de suspense
  const countdownAudioRef = useRef(null); // Ref para o áudio de contagem regressiva

  useEffect(() => {
    // Inicia o temporizador para a contagem regressiva
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Limpa o temporizador quando o componente é desmontado
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    // Reproduz o áudio quando o componente é montado
    if (suspenseAudioRef.current) {
      suspenseAudioRef.current.play();
    }

    if (countdownAudioRef.current) {
      countdownAudioRef.current.play();
    }

    // Para os áudios quando o componente é desmontado
    return () => {
      if (suspenseAudioRef.current) {
        suspenseAudioRef.current.pause();
        suspenseAudioRef.current.currentTime = 0;
      }

      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
        countdownAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Converte o tempo restante em formato mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
      <main className={style.mainContainer}>
        <PlayerHeader />
        <div className={style.container}>
          <section className={style.feedbackCard}>
            <h1 className={style.h1i}></h1>
            <p className={style.message} data-testid="feedback-total-question">
              Você terminou o quiz com sucesso! 🎉 Aqui estão os seus resultados:
            </p>
            <p className={style.assertions} data-testid="feedback-total-question">
              {assertions}
            </p>
            <p className={style.score} data-testid="feedback-total-score">
              {score}
            </p>
            <p className={style.message} data-testid="feedback-info">
              Explore a Jequit: Use seus pontos para obter descontos em nossos produtos!
            </p>
            <p className={style.message} data-testid="feedback-info">
              Clique no botão abaixo para visitar nosso site e conferir todas as ofertas.
            </p>
            <p className={style.timer} data-testid="feedback-timer">
              Tempo restante para usar os pontos: {formatTime(timeLeft)}
            </p>
            <section className={style.buttonsContainer}>
              <button
                  className={`${style.button} ${style.pulsingButton}`}
                  type="button"
                  onClick={() => history.push('/')}
                  data-testid="btn-play-again"
              >
                Jogar novamente
              </button>
              <a
                  className={`${style.button} ${style.pulsingButton}`}
                  href="https://www.jequiti.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="btn-ranking"
              >
                Trocar Pontos
              </a>
              <audio
                  ref={suspenseAudioRef}
                  src={require('../suspense.wav')}
                  loop
                  hidden
              />
              <audio
                  ref={countdownAudioRef}
                  src={require('../regressiva.mp3')}
                  loop
                  hidden
              />
            </section>
          </section>
        </div>
      </main>
  );
}

const mapStateToProps = ({ gameReducer: { assertions, score } }) => ({
  assertions,
  score,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Feedback);

import React from 'react';
import style from './Loading.module.css';

class Loading extends React.Component {
  render() {
    return (
        <div className={style.loadingContainer}>
          <img src={require('../loading.gif')} alt="loading!" className={style.loading} />
        </div>
    );
  }
}

export default Loading;

import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import style from './Home.module.css';

class Home extends React.Component {
  render() {
  
    return (
      <main className={ style.container }>
     <LoginForm />
      </main>
    );
  }
}

export default Home;

Home.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

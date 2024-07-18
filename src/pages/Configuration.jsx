import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api';
import Loading from '../components/Loading';
import { updateCategory, updateDifficulty, updateType } from '../actions';
import style from './Configuration.module.css';

class Configuration extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      categories: [],
    };
  }

  componentDidMount() {
    this.setCategories();
  }

  async setCategories() {
    const categories = await fetchCategories();

    this.setState({
      isLoading: false,
      categories,
    });
  }

  renderCategoriesSelect() {
    const { categories } = this.state;
    const { category, dispatchUpdateCategory } = this.props;

    return (
      <label className={ style.label } htmlFor="category">
        Categoria
        <select
          className={ style.select }
          name="category"
          id="category"
          value={ category }
          onChange={ ({ target: { value } }) => dispatchUpdateCategory(Number(value)) }
        >
          <option value={ 0 }>All</option>
          {
            categories.map(({ id, name }) => (
              <option key={ id } value={ id }>{name}</option>
            ))
          }
        </select>
      </label>
    );
  }

  renderDifficultiesSelect() {
    const { difficulty, dispatchUpdateDifficulty } = this.props;
    const difficulties = ['easy', 'medium', 'hard'];

    return (
      <label className={ style.label } htmlFor="difficulty">
        Dificuldade
        <select
          className={ style.select }
          name="difficulty"
          id="difficulty"
          value={ difficulty }
          onChange={ ({ target: { value } }) => dispatchUpdateDifficulty(value) }
        >
          <option>All</option>
          {
            difficulties.map((diff) => (
              <option key={ diff }>{diff}</option>
            ))
          }
        </select>
      </label>
    );
  }

  renderTypesSelect() {
    const { type, dispatchUpdateType } = this.props;
    const types = [
      { id: 'multiple', name: 'Multiple' },
      { id: 'boolean', name: 'True/False' },
    ];

    return (
      <label className={ style.label } htmlFor="type">
        Tipo de questão
        <select
          className={ style.select }
          name="type"
          id="type"
          value={ type }
          onChange={ ({ target: { value } }) => dispatchUpdateType(value) }
        >
          <option>All</option>
          {
            types.map(({ id, name }) => (
              <option key={ id } value={ id }>{name}</option>
            ))
          }
        </select>
      </label>
    );
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) return <Loading />;

    return (
      <main className={ style.container }>
        <h1 className={ style.title } data-testid="settings-title">
          Configurações
        </h1>

        <section className={ style.selectContainer }>
          { this.renderCategoriesSelect() }
          <div className={ style.formControl }>
            { this.renderDifficultiesSelect() }
            { this.renderTypesSelect() }
          </div>
        </section>

        <Link to="/">
          Voltar
        </Link>
      </main>
    );
  }
}

const mapStateToProps = ({ configurationReducer: { category, difficulty, type } }) => ({
  category,
  difficulty,
  type,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateCategory: (categoryId) => dispatch(updateCategory(categoryId)),
  dispatchUpdateDifficulty: (difficulty) => dispatch(updateDifficulty(difficulty)),
  dispatchUpdateType: (type) => dispatch(updateType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);

Configuration.propTypes = {
  category: PropTypes.number,
  dispatchUpdateCategory: PropTypes.func,
  dispatchUpdateDifficulty: PropTypes.func,
  dispatchUpdateType: PropTypes.func,
}.isRequired;

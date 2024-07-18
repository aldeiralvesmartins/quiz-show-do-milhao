import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QuestionCard from '../components/QuestionCard';
import PlayerHeader from '../components/PlayerHeader';
import { fetchQuestions } from '../actions';
import Loading from '../components/Loading'; // Supondo que você tenha um componente Loading

class Game extends React.Component {
    componentDidMount() {
        const { dispatchFetchQuestions } = this.props;
        dispatchFetchQuestions();
    }

    render() {
        const { history, isLoading, error } = this.props;
        if (isLoading) return <Loading />;
        if (error) return <p>Error: {error.message}</p>;

        return (
            <div>
                <PlayerHeader />
                <QuestionCard history={history} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.gameReducer.isLoading,
    error: state.gameReducer.error,
});

const mapDispatchToProps = (dispatch) => ({
    dispatchFetchQuestions: () => dispatch(fetchQuestions()),
});

Game.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
    dispatchFetchQuestions: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

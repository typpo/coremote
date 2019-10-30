import React from 'react';
import PropTypes from 'prop-types';

const MOOD_TO_EMOJI = {
  'PRODUCTIVE': '✍️',
  'THOUGHTFUL': '🤔',
  'HAPPY': '😁',
  'SAD': '😢',
  'ANXIOUS': '😟',
  'EXCITED': '🤩',
  'BORED': '🤤',
  'ENNUI': '❓',
};

function getMoodEmoji(mood) {
  return MOOD_TO_EMOJI[mood] || '';
}

class Person extends React.Component {
  render() {
    const { image, status, mood } = this.props;
    return (
      <div id="me-container" className="person-container">
        <div className="reacts">
          <span className="react">✌️</span>
        </div>
        <img id="me" src={image} />
        <div className="overlay">
          <div className="caption"><span className="mood">{getMoodEmoji(mood)}</span> {status}</div>
          <div className="progress-image"></div>
        </div>
      </div>
    );
  }
}

Person.propTypes = {
  image: PropTypes.string.isRequired,
  status: PropTypes.string,
  mood: PropTypes.string,
};

export default Person;

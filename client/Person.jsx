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
    const { image, status, mood, isMe } = this.props;
    return (
      <div id={isMe ? 'me-container' : ''} className="person-container">
        <div className="reacts">
          <span className="react">✌️</span>
        </div>
        <img id="me" src={image} />
        <div className="overlay">
          <div className="caption"><span className="mood">{getMoodEmoji(mood)}</span> {status}</div>
          {isMe ? <div className="progress-image"></div> : null}
        </div>
      </div>
    );
  }
}

Person.propTypes = {
  image: PropTypes.string.isRequired,
  status: PropTypes.string,
  mood: PropTypes.string,
  isMe: PropTypes.bool,
};

export default Person;

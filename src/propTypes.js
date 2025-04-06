import PropTypes from 'prop-types';

export const messageShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
  sentTime: PropTypes.string,
  sender: PropTypes.string,
  direction: PropTypes.oneOf(['incoming', 'outgoing'])
});

Chatbot.propTypes = {
  onClose: PropTypes.func
};

CustomMessage.propTypes = {
  message: messageShape.isRequired,
  isUser: PropTypes.bool.isRequired
};

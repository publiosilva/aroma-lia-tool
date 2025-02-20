import PropTypes from 'prop-types';

export const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardContent = ({ children }) => <div className="card-content">{children}</div>;

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

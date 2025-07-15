import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) => {
  const classes = classNames(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    { 'btn-disabled': disabled },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;

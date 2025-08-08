import React from 'react';

const Button = ({ asChild, size, children, ...props }) => {
  const sizeClasses = size === 'lg' ? 'px-8 py-3 text-lg' : 'px-4 py-2';
  const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";

  if (asChild) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${variantClasses} ${sizeClasses} ${children.props.className || ''}`,
      ...props
    });
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses}`} {...props}>
      {children}
    </button>
  );
};

export { Button };

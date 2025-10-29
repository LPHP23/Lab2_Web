/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';

// Button Component
export interface ButtonProps extends ComponentProps {
  onClick?: (e: Event) => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { onClick, children, className = '', type = 'button', disabled = false } = props;
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Card Component
export interface CardProps extends ComponentProps {
  title?: string;
  className?: string;
  onClick?: (e: Event) => void;
}

export const Card = (props: CardProps) => {
  const { title, children, className = '', onClick } = props;
  
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
};

// Input Component
export interface InputProps extends ComponentProps {
  type?: string;
  value?: string;
  onChange?: (e: Event) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Input = (props: InputProps) => {
  const { 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    className = '',
    disabled = false
  } = props;
  
  return (
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className}`}
      disabled={disabled}
    />
  );
};

// Form Component
export interface FormProps extends ComponentProps {
  onSubmit?: (e: Event) => void;
  className?: string;
}

export const Form = (props: FormProps) => {
  const { onSubmit, children, className = '' } = props;
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`form ${className}`}>
      {children}
    </form>
  );
};

// Modal Component
export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose, title, children } = props;
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: Event) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      onClose();
    }
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
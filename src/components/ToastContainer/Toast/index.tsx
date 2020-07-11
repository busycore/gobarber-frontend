import React, { useEffect } from 'react';

import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { Container } from './styles';
import { IToastMessage, useToast } from '../../../hooks/Toast';

interface IToastProps {
  message: IToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={18} />,
  error: <FiAlertCircle size={18} />,
  success: <FiCheckCircle size={18} />,
};

const Toast: React.FC<IToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 5000);

    // Esta função dentro do useEffect é automaticamente executada se nosso componente
    // deixar de existir
    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);
  return (
    <Container
      type={message.type}
      hasDescription={Number(!!message.description)}
      style={style}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button type="button" onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;

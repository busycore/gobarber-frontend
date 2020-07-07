import React from 'react';
import { FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { useTransition } from 'react-spring';
import { Container } from './styles';
import { IToastMessage } from '../../hooks/Toast';
import Toast from './Toast';

interface IToastContainerProps {
  messages: IToastMessage[];
}

const ToastContainer: React.FC<IToastContainerProps> = ({ messages }) => {
  const messagesWithTransition = useTransition(
    messages,
    (ourMessage) => ourMessage.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  return (
    <Container>
      {messagesWithTransition.map(({ item, key, props }) => {
        return <Toast key={key} style={props} message={item} />;
      })}
    </Container>
  );
};

export default ToastContainer;

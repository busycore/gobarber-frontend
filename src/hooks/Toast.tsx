import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

interface IToastContextData {
  addToast(message: Omit<IToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

export interface IToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const ToastContext = createContext<IToastContextData>({} as IToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<IToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<IToastMessage, 'id'>) => {
      const id = uuid();
      const toast = {
        id,
        type,
        title,
        description,
      };
      // TODO: Adicionar ao Notion
      // Esta é uma forma nova de imutabilidade do estado do React
      // Estamos recebendo o valor antigo e passando para a criação de um novo
      // usando os dados antigos, mais o novo
      // A Diferença é que não precisamos adicionar esta variavel messages como
      // Uma dependencia do useCallback no []. Pois estamos trabalhando com uma função
      setMessages((oldMessages) => [...oldMessages, toast]);
      console.log('toast');
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setMessages((oldMessages) =>
      oldMessages.filter((eachMessage) => eachMessage.id !== id),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

// Criação do Hook useToast
function useToast(): IToastContextData {
  // carregar o context em uma constante
  const context = useContext(ToastContext);
  // verificar se o contexto existe, ou se foi usado o useToast fora de um provider
  if (!context) {
    throw new Error('useToast must be used within a toast provider');
  }
  // retonar o contexto
  return context;
}

export { ToastProvider, useToast };

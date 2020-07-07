import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useField } from '@unform/core';
import { IconBaseProps } from 'react-icons/';
import { FiAlertCircle } from 'react-icons/fi';
import { Container, Error } from './styles';
import Tooltip from '../Tooltip';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setisFocused] = useState(false);
  const [isFilled, setisFilled] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name); // Este name é passado pelas props

  const handleInputFocuse = useCallback(() => {
    setisFocused(true);
  }, []);
  // Funciona da mesma forma que o useEffect
  const handleInputBlur = useCallback(() => {
    setisFocused(false);
    if (inputRef.current?.value) {
      setisFilled(true);
    } else {
      setisFilled(false);
    }
    // Uma outra forma mais simples é converter para boolean
    // setIsFilled(!!inputRef.current?.value)
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}

      <input
        /* Precisa passar via Arrow senao da problema e executa de cara */
        onFocus={handleInputFocuse}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Input;

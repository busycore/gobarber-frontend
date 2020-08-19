import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should highlight the focused input', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');
    // FOCA NO INPUT E VALIDA SE FICOU COM BORDA COLORIDA
    fireEvent.focus(inputElement);
    await wait(() => {
      expect(containerElement).toHaveStyle('border-color:#ff9000');
      expect(containerElement).toHaveStyle('color:#ff9000');
    });
    // TIRA O FOCO NO INPUT E VALIDA SE A BORDA COLORIDA SAIU
    fireEvent.blur(inputElement);
    await wait(() => {
      expect(containerElement).not.toHaveStyle('border-color:#ff9000');
      expect(containerElement).not.toHaveStyle('color:#ff9000');
    });
  });
});

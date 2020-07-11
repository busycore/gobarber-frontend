/* eslint-disable @typescript-eslint/camelcase */
import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Container, Content, AnimationContainer, Background } from './styles';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';
import api from '../../services/Api';

interface IResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const location = useLocation();
  const { addToast } = useToast();
  const history = useHistory();
  const handleSubmit = useCallback(
    async (data: IResetPasswordFormData) => {
      try {
        // Importante setar os Errors como vazios no caso de sucesso
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha invalida'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Senhas devem ser iguais',
          ),
        });

        await schema.validate(data, { abortEarly: false });
        const token = location.search.replace('?token=', '');
        if (!token) {
          throw new Error();
        }
        const { password, password_confirmation } = data;

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });
        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar a senha',
          description: 'Ocorreu um erro ao resetar sua senha,tente novamente',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="logo" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da nova senha"
            />
            <Button type="submit">Alterar Senha!</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default ResetPassword;

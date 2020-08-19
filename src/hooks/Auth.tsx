import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/Api';

interface IUser {
  name: string;
  avatar_url: string;
  id: string;
  email: string;
}
interface ISignInCredentials {
  email: string;
  password: string;
}
interface IAuthContextData {
  user: IUser;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
}
interface IAuthState {
  token: string;
  user: IUser;
}

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      // Define o token padrão como Bearer e associa na API
      // Esta função é executada sempre que o usuario pressionar F5
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // Define o token padrão como Bearer e associa na API
    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');

    localStorage.removeItem('@GoBarber:user');
    setData({} as IAuthState);
  }, []);

  const updateUser = useCallback(
    (user: IUser) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({ token: data.token, user });
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);
  // if (!context) {
  //   throw new Error('useAuth must be used within an AuthProvider');
  // }

  return context;
}

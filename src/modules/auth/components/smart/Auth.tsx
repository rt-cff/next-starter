import React, { useState, useEffect } from 'react';
import { AuthModel, AuthService } from '@onr/auth';
import { message, Modal } from 'antd';

enum AuthState {
  Prepare,
  Authorized,
  Unauthorized,
  NeedRefresh,
}
interface IAuthContext extends AuthModel.IAuthContext {
  authState: AuthState;
}
const AuthContext = React.createContext<IAuthContext | undefined>(undefined);

const AuthProvider: React.FC = props => {
  const [data, setData] = useState<AuthModel.SigninResponse | null>(null);
  const [state, setState] = useState<AuthState>(AuthState.Prepare);
  const [refreshTimeout, setRefreshTimeout] = useState(-1);

  const setExpiredTimeout = (expiredTime: number) => {
    // Add expired time detect. When achieved expired time show confirm modal
    const timeId = setTimeout(() => {
      setState(AuthState.NeedRefresh);
    }, expiredTime);
    if (refreshTimeout !== -1) {
      clearTimeout(refreshTimeout);
    }
    setRefreshTimeout(timeId);
  };

  useEffect(() => {
    if (state === AuthState.NeedRefresh) {
      Modal.confirm({
        title: 'This page has expired due to inactivity. Please refresh and try again.',
        onOk: async () => {
          const token = data?.access_token;
          if (token) {
            try {
              const renewData = await AuthService.loginWithJWT(token);
              setData(Object.assign({}, data as AuthModel.SigninResponse, renewData));
              localStorage.setItem('session', JSON.stringify(renewData));
              setState(AuthState.Authorized);
            } catch (error) {
              message.error(error.message);
              setState(AuthState.Unauthorized);
            }
          }
        },
        cancelButtonProps: { style: { display: 'none' } },
      });
    }
  }, [state]);

  useEffect(() => {
    const localSession: string|null = localStorage.getItem('session');
    if (localSession) {
      (async (token: string) => {
        const session: AuthModel.SessionData = JSON.parse(token);
        try {
          const renewData = await AuthService.loginWithJWT(session.access_token);
          const sessionData = Object.assign(renewData, { email: session.email });
          setExpiredTimeout(sessionData.expires_in * 1000);
          setData(sessionData);
          localStorage.setItem('session', JSON.stringify(sessionData));
          setState(AuthState.Authorized);
        } catch (error) {
          console.error(error);
          message.info('Token expired.');
          setState(AuthState.Unauthorized);
        }
      })(localSession);
    } else {
      setState(AuthState.Unauthorized);
    }
    return () => {
      if (refreshTimeout !== -1) {
        clearTimeout(refreshTimeout);
      }
    };
  }, []);

  const login = async (form: AuthModel.SigninPayload) => {
    setState(AuthState.Prepare);
    let loginData: AuthModel.SigninResponse;
    try {
      loginData = await AuthService.login(form);
      const sessionData = Object.assign(loginData, { email: form.params.email });
      setData(sessionData);
      setExpiredTimeout(sessionData.expires_in * 1000);
      localStorage.setItem('session', JSON.stringify(sessionData));
      setState(AuthState.Authorized);
    } catch (error) {
      setState(AuthState.Unauthorized);
      throw error;
    }
    return loginData;
  };

  const logout = async () => {
    setState(AuthState.Prepare);
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      throw error;
    } finally {
      setData(null);
      localStorage.removeItem('session');
      localStorage.removeItem('settings');
      setState(AuthState.Unauthorized);
    }
  };

  return (
    <AuthContext.Provider
      {...(props as any)}
      value={{
        data: data,
        login,
        logout,
        authState: state,
      }}
    />
  );
};

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth, AuthState };

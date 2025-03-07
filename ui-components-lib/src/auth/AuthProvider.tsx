import { useRef, useImperativeHandle, forwardRef } from 'react';
import AuthContext from './AuthContext';
import appConfig from '@/configs/app.config';
import { useSessionUser, useToken } from '@/store/authStore';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { useNavigate } from 'react-router-dom';
import type {
  SignInCredential,
  SignUpCredential,
  AuthResult,
  OauthSignInCallbackPayload,
  User,
  Token,
  SignInResponse,
  SignUpResponse,
} from '@/@types/auth';
import type { ReactNode } from 'react';
import type { NavigateFunction } from 'react-router-dom';

export type AuthServiceProps = {
  signIn: (values: SignInCredential) => Promise<SignInResponse | null>;
  signUp: (values: SignUpCredential) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  oAuthSignIn: (
    callback: (payload: OauthSignInCallbackPayload) => void,
  ) => void;
};

type AuthProviderProps = {
  children: ReactNode;
  authService: AuthServiceProps;
};

export type IsolatedNavigatorRef = {
  navigate: NavigateFunction;
};

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef>((_, ref) => {
  const navigate = useNavigate();

  useImperativeHandle(ref, () => {
    return {
      navigate,
    };
  }, [navigate]);

  return <></>;
});

function AuthProvider({
  children,
  authService: { signIn: apiSignIn, signOut: apiSignOut, signUp: apiSignUp },
}: AuthProviderProps) {
  const signedIn = useSessionUser((state) => state.session.signedIn);
  const user = useSessionUser((state) => state.user);
  const setUser = useSessionUser((state) => state.setUser);
  const setSessionSignedIn = useSessionUser(
    (state) => state.setSessionSignedIn,
  );
  const { token, setToken } = useToken();

  const authenticated = Boolean(token && signedIn);

  const navigatorRef = useRef<IsolatedNavigatorRef>(null);

  const redirect = () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const redirectUrl = params.get(REDIRECT_URL_KEY);

    navigatorRef.current?.navigate(
      redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
    );
  };

  const handleSignIn = (token: Token, user?: User) => {
    setToken(token.accessToken);
    setSessionSignedIn(true)

    if (user) {
      setUser(user);
    }
  };

  const handleSignOut = () => {
    setToken('');
    setUser({});
    setSessionSignedIn(false);
  };

  const signIn = async (values: SignInCredential): AuthResult => {
    try {
      const resp = await apiSignIn(values);
      if (resp) {
        handleSignIn({ accessToken: resp.token }, resp.user);
        redirect();
        return {
          status: 'success',
          message: '',
        };
      }
      return {
        status: 'failed',
        message: 'Usuario o contraseña incorrectos',
      };
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signUp = async (values: SignUpCredential): AuthResult => {
    try {
      const resp = await apiSignUp(values);
      if (resp) {
        handleSignIn({ accessToken: resp.token }, resp.user);
        redirect();
        return {
          status: 'success',
          message: '',
        };
      }
      return {
        status: 'failed',
        message: 'Unable to sign up',
      };
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signOut = async () => {
    try {
      await apiSignOut();
    } finally {
      handleSignOut();
      navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath);
    }
  };
  const oAuthSignIn = (
    callback: (payload: OauthSignInCallbackPayload) => void,
  ) => {
    callback({
      onSignIn: handleSignIn,
      redirect,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        signIn,
        signUp,
        signOut,
        oAuthSignIn,
      }}
    >
      {children}
      <IsolatedNavigator ref={navigatorRef} />
    </AuthContext.Provider>
  );
}

IsolatedNavigator.displayName = 'IsolatedNavigator';

export default AuthProvider;

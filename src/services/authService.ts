import { AuthServiceProps } from '@/auth/AuthProvider';
import ApiService from './apiService';
import { SignInCredential, SignInResponse } from '@/@types/auth';

export const AuthService: AuthServiceProps = {
  signIn: async (credentials: SignInCredential) => {
    const response = await ApiService.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.status !== 200) {
      return null;
    }
    
    const body = await response.json();
    return body as unknown as SignInResponse;
    // return {
    //   token: 'token',
    //   user: {
    //     id: '1',
    //     email: 'test@test.com',
    //     authority: ['admin'],
    //     avatar:
    //       'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    //     userId: '1',
    //     userName: 'test',
    //   },
    // };
  },
  signOut: async () => {
    return;
  },
  signUp: async () => {
    return {
      token: 'token',
      user: {
        id: '1',
        email: 'test@test.com',
        authority: ['admin'],
        avatar:
          'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
        userId: '1',
        userName: 'test',
      },
    };
  },
  oAuthSignIn: () => {
    return;
  },
};

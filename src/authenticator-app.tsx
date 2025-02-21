import {
  Authenticator,
  View,
  Image,
  useTheme,
  Text,
  Heading,
  useAuthenticator,
  Button,
} from '@aws-amplify/ui-react';
import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui-react';
import React, { useEffect } from 'react';
import App from './app';
import HeaderLogo from '@/components/template/HeaderLogo';
import { UserContextProvider } from './context/userContext';

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <HeaderLogo innerLink={false} />
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>
          &copy; All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          {I18n.get('Sign in')}
        </Heading>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            {I18n.get('Forgot Password')}
          </Button>
        </View>
      );
    },
  },

  SignUp: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          {I18n.get('Create a new account')}
        </Heading>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            {I18n.get('Back to Sign In')}
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  SetupTotp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmSignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ForgotPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'juan@mail.com',
    },
  },
  signUp: {
    email: {
      isRequired: true,
      order: 1,
    },
    password: {
      isRequired: false,
      order: 2,
    },
    confirm_password: {
      order: 3,
    },
    name: {
      label: 'Nombre',
      placeholder: 'Ingrese su nombre',
      isRequired: true,
      order: 4,
    },
    middle_name: {
      label: 'Segundo Nombre',
      placeholder: 'Ingrese su segundo nombre',
      order: 5,
    },
    family_name: {
      label: 'Apellido',
      placeholder: 'Ingrese su apellido',
      required: true,
      order: 6,
    },
    second_family_name: {
      label: 'Segundo Apellido',
      placeholder: 'Ingrese su segundo apellido',
      order: 7,
    },
  },
  forgotPassword: {
    username: {
      placeholder: 'Enter your email:',
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Enter your Confirmation Code:',
      label: 'New Label',
      isRequired: false,
    },
    confirm_password: {
      placeholder: 'Enter your Password Please:',
    },
  },
};

const customTranslations = {
  es: {
    'Sign in': 'Iniciar sesión',
    'Create a new account': 'Crear una nueva cuenta',
    'Forgot Password': 'Olvidé mi contraseña',
    'Back to Sign In': 'Volver a Iniciar sesión',
    'Enter your Password Please:': 'Ingrese su contraseña por favor:',
    'Enter your email:': 'Ingrese su correo electrónico:',
    'Enter your Confirmation Code:': 'Ingrese su código de confirmación:',
    'New Label': 'Nueva etiqueta',
    'La contraseña debe tener al menos 8 caracteres':
      'La contraseña debe tener al menos 8 caracteres',
    'Password must have upper case letters':
      'La contraseña debe tener letras mayúsculas',
    'Password must have numbers': 'La contraseña debe tener números',
    'Password must have special characters':
      'La contraseña debe tener caracteres especiales',
  },
};

export default function AuthenticatorApp() {
  useEffect(() => {
    I18n.putVocabularies(translations);
    I18n.putVocabularies(customTranslations);
    I18n.setLanguage('es');
  }, []);

  return (
    <Authenticator formFields={formFields} components={components}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </Authenticator>
  );
}

import React, { useEffect, useState } from 'react';
import { Button, Input, Card, Tabs, Alert } from '@/components/ui';
import Logo from '@/components/template/Logo';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import { User } from '@prisma/client';

import apiService from './services/apiService';

import { validatePasswordStrength } from './helpers/passwordValidation';

type AuthFormProps = {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (user: Partial<User>, password: string) => void;
  onPasswordReset: (email: string, newPassword: string) => void;
  onConfirmEmail: (email: string, code: string) => void;
  loginError: string | null;
  forcePasswordReset: boolean;
  confirmationCodeNeeded: boolean;
  confirmationError: string | null;
  confirmFinished: boolean;
};

const { TabNav, TabList, TabContent } = Tabs;

const AuthForm: React.FC<AuthFormProps> = ({
  onSignIn,
  onSignUp,
  onPasswordReset,
  onConfirmEmail,
  loginError,
  forcePasswordReset,
  confirmationCodeNeeded,
  confirmFinished,
  confirmationError,
}) => {
  const [activeTab, setActiveTab] = useState<
    'signIn' | 'signUp' | 'passwordReset' | 'confirmation'
  >('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [passwordStrengthError, setPasswordStrengthError] = useState<string[]>(
    []
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const validateForm = () => {
    return (
      email.length > 0 &&
      password.length > 0 &&
      (!passwordStrengthError || passwordStrengthError.length === 0) &&
      name.length > 0 &&
      lastName.length > 0 &&
      confirmPassword === password
    );
  };
  useEffect(() => {
    if (activeTab === 'signUp') {
      setIsFormValid(validateForm());
    }
  }, [
    email,
    password,
    confirmPassword,
    name,
    middleName,
    lastName,
    secondLastName,
    passwordStrengthError,
    activeTab,
  ]);

  useEffect(() => {
    if (forcePasswordReset) {
      setActiveTab('passwordReset');
      setPassword('');
      setConfirmPassword('');
    }
  }, [forcePasswordReset]);

  useEffect(() => {
    if (confirmationCodeNeeded) {
      setActiveTab('confirmation');
    }
  }, [confirmationCodeNeeded]);

  useEffect(() => {
    if (confirmFinished) {
      setActiveTab('signIn');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setMiddleName('');
      setLastName('');
      setSecondLastName('');
      setConfirmationCode('');
    }
  }, [confirmFinished]);

  useEffect(() => {
    if (password && activeTab !== 'signIn') {
      const validationErrors = validatePasswordStrength(password);
      setPasswordStrengthError(validationErrors);
    }
  }, [password, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signIn') {
      onSignIn(email, password);
    } else if (activeTab === 'signUp') {
      onSignUp(
        {
          email,
          firstName: name,
          middleName,
          lastName,
          secondLastName,
        },
        password
      );
    } else if (activeTab === 'passwordReset') {
      onPasswordReset(email, password);
    } else {
      onConfirmEmail(email, confirmationCode);
    }
  };

  return (
    <div
      style={{
        padding: 16,
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(89, 148, 255, 0.85)',
      }}
    >
      <Card
        style={{
          width: '90vw',
          maxWidth: '500px',
          margin: 'auto',
          maxHeight: '90vh',
          height: 'auto',
        }}
      >
        <Logo mode="light" type="full" style={{ margin: 24 }} />
        <Tabs
          value={activeTab}
          onChange={(tab) => setActiveTab(tab as 'signIn' | 'signUp')}
        >
          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            {activeTab === 'signIn' || activeTab === 'signUp' ? (
              <TabList>
                <TabNav value="signIn">Iniciar sesión</TabNav>
                <TabNav value="signUp">Crear cuenta</TabNav>
              </TabList>
            ) : null}
            <TabContent value={'signIn'}>
              {confirmFinished ? (
                <Alert showIcon type="success" style={{ marginBottom: 16 }}>
                  Confirmación de correo electrónico exitosa. Puedes iniciar
                  sesión.
                </Alert>
              ) : null}
              <span>Email</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: 16 }}
              />
              <span>Contraseña</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suffix={
                    <Button
                      variant="plain"
                      style={{ position: 'relative' }}
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                    >
                      {passwordVisible ? <TbEyeOff /> : <TbEye />}
                    </Button>
                  }
                />
              </div>
              {loginError && (
                <span style={{ color: 'red', marginTop: 8 }}>{loginError}</span>
              )}
              <Button
                type="submit"
                variant="solid"
                style={{ marginTop: 24, width: '100%' }}
              >
                Iniciar sesión
              </Button>
            </TabContent>
            <TabContent value={'signUp'}>
              <span>Email</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: 16 }}
              />
              <span>Contraseña</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suffix={
                    <Button
                      variant="plain"
                      style={{ position: 'relative' }}
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                    >
                      {passwordVisible ? <TbEyeOff /> : <TbEye />}
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                />
              </div>
              {passwordStrengthError.map((error, index) => (
                <p key={index} style={{ color: 'red', marginTop: 8 }}>
                  {error}
                </p>
              ))}
              <span>Confirmar Contraseña</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  suffix={
                    <Button
                      variant="plain"
                      style={{ position: 'relative' }}
                      type="button"
                      onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                    >
                      {confirmPasswordVisible ? <TbEyeOff /> : <TbEye />}
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                />
              </div>
              {password !== confirmPassword && confirmPassword && (
                <span style={{ color: 'red', marginTop: 8 }}>
                  Las contraseñas no coinciden
                </span>
              )}
              <span>Primer Nombre</span>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ marginBottom: 16 }}
              />
              <span>Segundo Nombre</span>
              <Input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              <span>Apellido</span>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{ marginBottom: 16 }}
              />
              <span>Segundo Apellido</span>
              <Input
                type="text"
                value={secondLastName}
                onChange={(e) => setSecondLastName(e.target.value)}
                style={{ marginBottom: 16 }}
              />

              <Button
                type="submit"
                variant="solid"
                style={{ marginTop: 24, width: '100%' }}
                disabled={!isFormValid}
              >
                Crear cuenta
              </Button>
            </TabContent>
            <TabContent value={'passwordReset'}>
              <Alert showIcon type="warning">
                <span>Es necesario que reinicies tu contraseña</span>
              </Alert>
              <span>Contraseña</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suffix={
                    <Button
                      variant="plain"
                      style={{ position: 'relative' }}
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                    >
                      {passwordVisible ? <TbEyeOff /> : <TbEye />}
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                />
              </div>
              {passwordStrengthError.map((error, index) => (
                <p key={index} style={{ color: 'red', marginTop: 8 }}>
                  {error}
                </p>
              ))}
              <span>Confirmar Contraseña</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  suffix={
                    <Button
                      variant="plain"
                      style={{ position: 'relative' }}
                      type="button"
                      onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                    >
                      {confirmPasswordVisible ? <TbEyeOff /> : <TbEye />}
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                />
              </div>
              {password !== confirmPassword && confirmPassword && (
                <span style={{ color: 'red', marginTop: 8 }}>
                  Las contraseñas no coinciden
                </span>
              )}
              <Button
                type="submit"
                variant="solid"
                style={{ marginTop: 24, width: '100%' }}
                disabled={
                  !password ||
                  password !== confirmPassword ||
                  passwordStrengthError.length > 0
                }
              >
                Confirmar
              </Button>
            </TabContent>
            <TabContent value={'confirmation'}>
              <h5>Código de Confirmación</h5>
              <span>
                Ingresa el código de confirmación enviado a tu correo
                electrónico (
                {email.replace(
                  /^(.{3})[^@]*@(.)([^.]*)\..*$/,
                  (_, firstChars, domainFirstChar) =>
                    `${firstChars}***@${domainFirstChar}***`
                )}
                )
              </span>
              <Input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
                style={{ marginBottom: 16 }}
              />
              {confirmationError && (
                <Alert showIcon type="danger" style={{ marginBottom: 16 }}>
                  {confirmationError}
                </Alert>
              )}
              <Button
                type="submit"
                variant="solid"
                style={{ marginTop: 24, width: '100%' }}
                disabled={!confirmationCode}
              >
                Confirmar
              </Button>
            </TabContent>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

export default function LoginPage() {
  const [forcePasswordReset, setForcePasswordReset] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSession, setLoginSession] = useState<string | null>(null);
  const [confirmFinished, setConfirmFinished] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem('idToken', loginSession || '');
  }, [loginSession]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { forcePasswordReset, tempPassword, userName, confirmPending } =
        await apiService.post<{
          forcePasswordReset: boolean;
          tempPassword: string;
          userName: string;
          confirmPending?: boolean;
        }>('/auth/pre-login', {
          email,
          password,
        });

      if (confirmPending) {
        setConfirmPending(true);
      }
      setForcePasswordReset(forcePasswordReset);

      localStorage.setItem('userName', userName);
      if (!forcePasswordReset) {
        const { tokens } = await apiService.post<any>('/auth/login', {
          email: email,
          password: forcePasswordReset ? tempPassword : password,
        });

        const { IdToken } = tokens;
        setLoginSession(IdToken);
        window.location.reload();
      }
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('404')) {
        setLoginError('Invalid email or password');
      }
    }
  };

  const handleSignUp = async (user: Partial<User>, password: string) => {
    try {
      const response = await apiService.post('/auth/register', {
        ...user,
        password,
      });
      console.log(response);
      setConfirmPending(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (email: string, newPassword: string) => {
    await apiService.post('/auth/new-password', {
      email,
      newPassword,
    });

    const { tokens } = await apiService.post<any>('/auth/login', {
      email,
      password: newPassword,
    });

    const { IdToken } = tokens;

    setLoginSession(IdToken);
    window.location.reload();
  };

  const handleConfirmEmail = async (email: string, code: string) => {
    try {
      await apiService.post('/auth/confirm-signup', {
        email,
        confirmationCode: code,
      });
      setConfirmPending(false);
      setConfirmFinished(true);
    } catch (error) {
      console.error(error);
      setConfirmationError('Código de confirmación inválido o expirado.');
    }
  };

  return (
    <AuthForm
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onPasswordReset={handlePasswordReset}
      onConfirmEmail={handleConfirmEmail}
      loginError={loginError}
      forcePasswordReset={forcePasswordReset}
      confirmationCodeNeeded={confirmPending}
      confirmationError={confirmationError}
      confirmFinished={confirmFinished}
    />
  );
}

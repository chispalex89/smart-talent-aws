import { useEffect, useState } from 'react';
import App from './app';
import { UserContextProvider } from './context/userContext';
import LoginPage from './login';


export default function AuthenticatorApp() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('idToken'));
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('idToken'));
  }, [localStorage.getItem('idToken')]);

  return (
      <UserContextProvider>
        {
          isLoggedIn ?
          <App />
          :
          <LoginPage />
        }
      </UserContextProvider>
  );
}

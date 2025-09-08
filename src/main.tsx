import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app';
import { Amplify } from 'aws-amplify';
import { ThemeProvider } from '@aws-amplify/ui-react';
import outputs from '../amplify_outputs.json';

import '@aws-amplify/ui-react/styles.css';
import './styles.css'; // Import Tailwind CSS
import '@/index.css';
import AuthenticatorApp from './authenticator-app';

Amplify.configure(outputs);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <ThemeProvider>
    <AuthenticatorApp />
  </ThemeProvider>,
);

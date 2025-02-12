import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Theme from '@/components/template/Theme';
import Layouts from '@/components/layouts';
import { AuthProvider } from '@/auth';

import { AuthService } from './services/authService';
import Views from './views';

import './styles.css'; // Import Tailwind CSS
import { CatalogContextProvider } from './context/catalogContext';

const App: FC = () => {
  return (
    <Theme>
      <BrowserRouter>
        <AuthProvider authService={AuthService}>
          <CatalogContextProvider>
            <Layouts>
              <Views />
            </Layouts>
          </CatalogContextProvider>
        </AuthProvider>
      </BrowserRouter>
    </Theme>
  );
};

export default App;

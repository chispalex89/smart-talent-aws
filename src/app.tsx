import React, { FC, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Theme from '@/components/template/Theme';
import Layouts from '@/components/layouts';
import Views from './views';

import { CatalogContextProvider } from './context/catalogContext';
import { useUserContext } from './context/userContext';
import { getCurrentUser } from 'aws-amplify/auth';
import navigationConfigByRole from './config/navigation.config';

const App: FC = () => {
  const { setAuthUser, role, user, recruiter, membershipType } = useUserContext();

  useEffect(() => {
    getCurrentUser().then((user) => {
      setAuthUser(user);
    });
  }, [getCurrentUser]);

  return (
    <Theme>
      <BrowserRouter>
        <CatalogContextProvider>
          <Layouts
            navigationConfig={navigationConfigByRole(role, membershipType || '')}
            user={{
              avatar: user?.profileImage || recruiter?.company?.logoUrl || '',
              email: user?.email,
              userName: `${user?.firstName} ${user?.lastName}`,
              role: role,
            }}
          >
            <Views />
          </Layouts>
        </CatalogContextProvider>
      </BrowserRouter>
    </Theme>
  );
};

export default App;

import React, { FC, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Theme from '@/components/template/Theme';
import Layouts from '@/components/layouts';
import Views from './views';

import { CatalogContextProvider } from './context/catalogContext';
import { useUserContext } from './context/userContext';
import navigationConfigByRole from './config/navigation.config';
import { profileImageUrl } from './helpers/s3Url';

const App: FC = () => {
  const { setAuthUser, role, user, recruiter, membershipType } =
    useUserContext();

  useEffect(() => {
    setAuthUser({
      username: localStorage.getItem('userName') || '',
      userId: '',
    });
  }, [localStorage.getItem('userName')]);

  return (
    <Theme>
      <BrowserRouter>
        <CatalogContextProvider>
          <Layouts
            navigationConfig={navigationConfigByRole(
              role,
              membershipType || ''
            )}
            user={{
              avatar:
                profileImageUrl(
                  user?.profileImage || recruiter?.company?.logoUrl
                ) || '',
              email: user?.email,
              userName: `${user?.firstName} ${user?.lastName}`,
              role: role as string,
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

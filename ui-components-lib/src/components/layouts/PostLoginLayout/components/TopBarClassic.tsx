import Header from '@/components/template/Header';
import UserProfileDropdown from '@/components//template/UserProfileDropdown';
import HeaderLogo from '@/components/template/HeaderLogo';
import MobileNav from '@/components/template/MobileNav';
import HorizontalNav from '@/components/template/HorizontalNav';
import LayoutBase from '@/components//template/LayoutBase';
import useResponsive from '@/utils/hooks/useResponsive';
import { LAYOUT_TOP_BAR_CLASSIC } from '@/constants/theme.constant';
import type { CommonProps } from '@/@types/common';
import { PiUserDuotone } from 'react-icons/pi';
import { LayoutProps } from './LayoutProps.interface';

const TopBarClassic = ({ children, navigationConfig }: LayoutProps) => {
  const { larger, smaller } = useResponsive();

  return (
    <LayoutBase
      type={LAYOUT_TOP_BAR_CLASSIC}
      className="app-layout-top-bar-classic flex flex-auto flex-col min-h-screen"
    >
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          <Header
            container
            className="shadow dark:shadow-2xl"
            headerStart={
              <>
                {smaller.lg && (
                  <MobileNav navigationConfig={navigationConfig} />
                )}
                <HeaderLogo innerLink={true} />
              </>
            }
            headerMiddle={
              <>
                {larger.lg && (
                  <HorizontalNav navigationConfig={navigationConfig} />
                )}
              </>
            }
            headerEnd={
              <>
                <UserProfileDropdown
                  hoverable={false}
                  dropdownItemList={[
                    {
                      label: 'Perfil',
                      icon: <PiUserDuotone />,
                      path: '/profile/company',
                    },
                  ]}
                />
              </>
            }
          />
          {children}
        </div>
      </div>
    </LayoutBase>
  );
};

export default TopBarClassic;

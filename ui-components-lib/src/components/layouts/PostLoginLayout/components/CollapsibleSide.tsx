import SideNav from '@/components/template/SideNav';
import Header from '@/components/template/Header';
import SideNavToggle from '@/components/template/SideNavToggle';
import MobileNav from '@/components/template/MobileNav';
import UserProfileDropdown from '@/components/template/UserProfileDropdown';
import LayoutBase from '@/components//template/LayoutBase';
import useResponsive from '@/utils/hooks/useResponsive';
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant';
import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher';
import { PiUserDuotone } from 'react-icons/pi';
import { LayoutProps } from './LayoutProps.interface';

const CollapsibleSide = ({ children, navigationConfig, user }: LayoutProps) => {
  const { larger, smaller } = useResponsive();

  return (
    <LayoutBase
      user={user}
      type={LAYOUT_COLLAPSIBLE_SIDE}
      className="app-layout-collapsible-side flex flex-auto flex-col"
    >
      <div className="flex flex-auto min-w-0">
        {larger.lg && <SideNav navigationConfig={navigationConfig} />}
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          <Header
            className="shadow dark:shadow-2xl"
            headerStart={
              <>
                {smaller.lg && (
                  <MobileNav navigationConfig={navigationConfig} />
                )}
                {larger.lg && <SideNavToggle />}
              </>
            }
            headerEnd={
              <>
                <ModeSwitcher />
                <UserProfileDropdown
                  userName={user.userName}
                  avatar={user.avatar}
                  email={user.email}
                  hoverable={false}
                  dropdownItemList={[
                    {
                      label: 'Perfil',
                      icon: <PiUserDuotone />,
                      path:
                        user.role === 'Admin'
                          ? '/profile/company'
                          : user.role === 'Recruiter'
                            ? '/profile/company'
                            : '/profile/applicant',
                    },
                  ]}
                />
              </>
            }
          />
          <div className="h-full flex flex-auto flex-col">{children}</div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default CollapsibleSide;

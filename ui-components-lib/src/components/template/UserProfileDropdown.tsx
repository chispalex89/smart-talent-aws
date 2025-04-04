import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import withHeaderItem, {
  WithHeaderItemProps,
} from '@/utils/hoc/withHeaderItem';
import { useSessionUser } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { PiUserDuotone, PiSignOutDuotone } from 'react-icons/pi';
import { JSX } from 'react';

type DropdownList = {
  label: string;
  path: string;
  icon: JSX.Element;
};

export interface UserDropdownProps {
  avatar?: string;
  userName?: string;
  email?: string;
  dropdownItemList: DropdownList[];
}

const _UserDropdown = (
  { dropdownItemList, avatar, userName, email }: UserDropdownProps = {
    dropdownItemList: [],
  }
) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/logout');
  };

  const avatarProps = {
    ...(avatar ? { src: avatar } : { icon: <PiUserDuotone /> }),
  };

  return (
    <Dropdown
      className="flex"
      toggleClassName="flex items-center"
      renderTitle={
        <div className="cursor-pointer flex items-center">
          <Avatar size={32} {...avatarProps} />
        </div>
      }
      placement="bottom-end"
    >
      <Dropdown.Item variant="header">
        <div className="py-2 px-3 flex items-center gap-3">
          <Avatar {...avatarProps} />
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {userName || 'Usuario no registrado'}
            </div>
            <div className="text-xs">{email || 'Email no disponible'}</div>
          </div>
        </div>
      </Dropdown.Item>
      <Dropdown.Item variant="divider" />
      {dropdownItemList.map((item) => (
        <Dropdown.Item key={item.label} eventKey={item.label} className="px-0">
          <Link className="flex h-full w-full px-2" to={item.path}>
            <span className="flex gap-2 items-center w-full">
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </span>
          </Link>
        </Dropdown.Item>
      ))}
      <Dropdown.Item
        eventKey="Sign Out"
        className="gap-2"
        onClick={handleSignOut}
      >
        <span className="text-xl">
          <PiSignOutDuotone />
        </span>
        <span>Cerrar Sesión</span>
      </Dropdown.Item>
    </Dropdown>
  );
};

const UserDropdown = withHeaderItem<UserDropdownProps & WithHeaderItemProps>(
  _UserDropdown
);

export default UserDropdown;

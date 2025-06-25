import Menu from '@/components/ui/Menu';
import ScrollBar from '@/components/ui/ScrollBar';
import { useSettingsStore } from '../store/settingsStore';
import useQuery from '@/utils/hooks/useQuery';
import { TbUserSquare, TbLock, TbBuilding, TbFileDollar } from 'react-icons/tb';
import type { View } from '../types';
import { useEffect, type ReactNode } from 'react';
import { useUserContext } from '../../../../context/userContext';

const { MenuItem } = Menu;
type MenuItemType = { label: string; value: View; icon: ReactNode };
const menuList: MenuItemType[] = [
  { label: 'Perfil', value: 'profile', icon: <TbUserSquare /> },
  { label: 'Seguridad', value: 'security', icon: <TbLock /> },
];

export const SettingsMenu = ({ onChange }: { onChange?: () => void }) => {
  const { recruiter } = useUserContext();
  const menuItemList: MenuItemType[] = recruiter?.isAdmin
    ? [
        ...menuList,
        { label: 'Compañía', value: 'company', icon: <TbBuilding /> },
        { label: 'Pagos', value: 'billing', icon: <TbFileDollar /> },
      ]
    : menuList;

  const query = useQuery();

  const { currentView, setCurrentView } = useSettingsStore();

  const currentPath = query.get('category') || 'profile';

  const handleSelect = (value: View) => {
    setCurrentView(value);
    query.set('category', value);
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${query.toString()}`
    );
    onChange?.();
  };

  useEffect(() => {
    if (!menuItemList.some((item) => item.value === currentPath)) {
      setCurrentView(currentPath as View);
    }
  }, [currentPath]);

  return (
    <div className="flex flex-col justify-between h-full">
      <ScrollBar className="h-full overflow-y-auto">
        <Menu className="mx-2 mb-10">
          {menuItemList.map((menu) => (
            <MenuItem
              key={menu.value}
              eventKey={menu.value}
              className={`mb-2 ${
                currentView === menu.value ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              isActive={currentPath === menu.value}
              onSelect={() => handleSelect(menu.value)}
            >
              <span className="text-2xl ltr:mr-2 rtl:ml-2">{menu.icon}</span>
              <span>{menu.label}</span>
            </MenuItem>
          ))}
        </Menu>
      </ScrollBar>
    </div>
  );
};

export default SettingsMenu;

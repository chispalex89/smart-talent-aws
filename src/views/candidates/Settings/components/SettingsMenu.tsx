import Menu from '@/components/ui/Menu';
import ScrollBar from '@/components/ui/ScrollBar';
import { useSettingsStore } from '../store/settingsStore';
import useQuery from '@/utils/hooks/useQuery';
import {
  TbUserSquare,
  TbHome2,
  TbFile,
  TbAward,
  TbChecklist,
  TbMessageLanguage,
} from 'react-icons/tb';
import type { View } from '../types';
import { useEffect, type ReactNode } from 'react';

const { MenuItem } = Menu;

const menuList: { label: string; value: View; icon: ReactNode }[] = [
  { label: 'Datos Personales', value: 'profile', icon: <TbUserSquare /> },
  { label: 'Residencia', value: 'residence', icon: <TbHome2 /> },
  {
    label: 'Perfil Profesional',
    value: 'professionalProfile',
    icon: <TbFile />,
  },
  {
    label: 'Formación Académica',
    value: 'academicFormation',
    icon: <TbAward />,
  },
  {
    label: 'Idiomas y Conocimientos',
    value: 'languagesAndSkills',
    icon: <TbMessageLanguage />,
  },
  {
    label: 'Experiencia Laboral',
    value: 'workExperience',
    icon: <TbChecklist />,
  },
];

export const SettingsMenu = ({ onChange }: { onChange?: () => void }) => {
  const query = useQuery();

  const { currentView, setCurrentView } = useSettingsStore();

  const currentPath = query.get('category') || 'profile';

  const handleSelect = (value: View) => {
    setCurrentView(value);
    query.set('category', value);
    onChange?.();
  };

  useEffect(() => {
    setCurrentView(currentPath as View);
  }, [currentPath]);

  return (
    <div className="flex flex-col justify-between h-full">
      <ScrollBar className="h-full overflow-y-auto">
        <Menu className="mx-2 mb-10">
          {menuList.map((menu) => (
            <MenuItem
              key={menu.value}
              eventKey={menu.value}
              className={`mb-2 ${
                currentView === menu.value
                  ? 'bg-[#B9D0DB] dark:bg-gray-700 dark:text-white'
                  : ''
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

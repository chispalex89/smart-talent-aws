import { lazy, Suspense } from 'react';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import SettingsMenu from './components/SettingsMenu';
import SettingMobileMenu from './components/SettingMobileMenu';
import useResponsive from '@/utils/hooks/useResponsive';
import { useSettingsStore } from './store/settingsStore';

const Profile = lazy(() => import('./components/SettingsProfile'));
const Location = lazy(() => import('./components/SettingsLocation'));
const Knowledge = lazy(() => import('./components/SettingsKnowledge'));
const SettingsProfessionalProfile = lazy(
  () => import('./components/SettingsProfessionalProfile')
);
const WorkingExperience = lazy(() => import('./components/SettingWorkingExperience'));
const AcademicFormation = lazy(
  () => import('./components/SettingsAcademicFormation')
);

const Settings = () => {
  const { currentView } = useSettingsStore();

  const { smaller, larger } = useResponsive();

  return (
    <AdaptiveCard className="h-full">
      <div className="flex flex-auto h-full">
        {larger.lg && (
          <div className="'w-[200px] xl:w-[280px]">
            <SettingsMenu />
          </div>
        )}
        <div className="ltr:xl:pl-6 rtl:xl:pr-6 flex-1 py-2">
          {smaller.lg && (
            <div className="mb-6">
              <SettingMobileMenu />
            </div>
          )}
          <Suspense fallback={<></>}>
            {currentView === 'profile' && <Profile />}
            {currentView === 'academicFormation' && <AcademicFormation />}
            {currentView === 'languagesAndSkills' && <Knowledge />}
            {currentView === 'professionalProfile' && (
              <SettingsProfessionalProfile />
            )}
            {currentView === 'residence' && <Location />}
            {currentView === 'workExperience' && <WorkingExperience />}
            {currentView === 'workPreferences' && <WorkingExperience />}
          </Suspense>
        </div>
      </div>
    </AdaptiveCard>
  );
};

export default Settings;

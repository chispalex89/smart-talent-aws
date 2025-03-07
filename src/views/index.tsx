import { Suspense, useEffect, useState } from 'react';
import Loading from '@/components/shared/Loading';
import type { LayoutType } from '@/@types/theme';
import { Route, Routes } from 'react-router-dom';
import BusinessDashboard from './dashboards/BusinessDashboard';
import JobList from './job/JobList';
import JobCreate from './job/JobCreate';
import FavoriteCandidateList from './candidates/favorite';
import CandidateList from './candidates/all';
import Pricing from './pricing';
import PageContainer from '@/components/template/PageContainer';
import Settings from './company/settings';
import ArchivedJobList from './archive/JobList';
import { useUserContext } from '../context/userContext';
// import ArchivedCandidateList from './archive/CandidateList';
import ApplicantDashboard from './dashboards/ApplicantDashboard';
import ApplicantSettings from './candidates/Settings';
import Logout from './auth/logout';
import ChangePassword from './auth/changePassword';

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained';
  layout?: LayoutType;
}

const renderRoutes = (role: string | null) => {
  if (role === 'Recruiter') {
    return (
      <Routes>
        <Route path="/home" element={<BusinessDashboard />} />
        <Route path="/job">
          <Route path="/job/create" element={<JobCreate />} />
          <Route path="/job/edit/:id" element={<JobCreate />} />
          <Route path="/job/my-jobs" element={<JobList />} />
        </Route>
        <Route path="/candidates">
          <Route
            path="/candidates/favorite"
            element={<FavoriteCandidateList />}
          />
          <Route path="/candidates/find" element={<CandidateList />} />
        </Route>
        <Route path="/membership">
          <Route path="/membership/plans" element={<Pricing />} />
        </Route>
        <Route path="/profile">
          <Route path="/profile/company" element={<Settings />} />
        </Route>
        <Route path="/archive">
          <Route path="/archive/jobOffers" element={<ArchivedJobList />} />
          {/* <Route path="/archive/candidates" element={<ArchivedCandidateList />} /> */}
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<BusinessDashboard />} />
      </Routes>
    );
  }

  if (role === 'Applicant') {
    return (
      <Routes>
        <Route path="/home" element={<ApplicantDashboard />} />
        <Route path="/profile" element={<ApplicantSettings />} />
        <Route path="/account" element={<ChangePassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<ApplicantDashboard />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

const Views = () => {
  const { role } = useUserContext();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setUserType(role);
    }
  }, [role]);

  return (
    <Suspense fallback={<Loading loading={true} className="w-full" />}>
      <PageContainer>{renderRoutes(userType)}</PageContainer>
    </Suspense>
  );
};

export default Views;

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
import JobOfferSearch from './job/JobSearch';

import NewClient from './auth/newClient';

import BackOfficeDashboard from './backOffice/components/dashboard';
import BackOfficeUserList from './backOffice/components/users/list';
import BackOfficeRoleList from './backOffice/components/roles/list';
import BackOfficePermissionList from './backOffice/components/permissions/list';
import BackOfficeCompanyList from './backOffice/components/companies/list';

const renderRoutes = (role: string | null, membershipType: string | null) => {
  if (role === 'Recruiter') {
    if (!membershipType || membershipType === 'Bronce') {
      <Routes>
        <Route path="/" element={<BusinessDashboard />} />
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
      </Routes>;
    }
    return (
      <Routes>
        <Route path="/" element={<BusinessDashboard />} />
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
        <Route path="/" element={<ApplicantDashboard />} />
        <Route path="/home" element={<ApplicantDashboard />} />
        <Route path="/profile/applicant" element={<ApplicantSettings />} />
        <Route path="/account" element={<ChangePassword />} />
        <Route path="/job/search" element={<JobOfferSearch />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<ApplicantDashboard />} />
      </Routes>
    );
  }

  if (role === 'Admin') {
    return (
      <Routes>
        <Route path="/" element={<BackOfficeDashboard />} />
        <Route path="/home" element={<BackOfficeDashboard />} />
        <Route path="/users">
          <Route path="/users/all" element={<BackOfficeUserList />} />
          <Route path="/users/roles" element={<BackOfficeRoleList />} />
          <Route
            path="/users/permissions"
            element={<BackOfficePermissionList />}
          />
        </Route>
        <Route path="/companies">
          <Route path="/companies/list" element={<BackOfficeCompanyList />} />
          <Route path="/companies/users" element={<BackOfficeDashboard />} />
        </Route>
        <Route path="/candidates">
          <Route path="/candidates/all" element={<BackOfficeDashboard />} />
          <Route
            path="/candidates/{id}/edit"
            element={<BackOfficeDashboard />}
          />
        </Route>
        <Route path="/configurations">
          <Route
            path="/configurations/roles"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/permissions"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/documentTypes"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/genders"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/maritalStatus"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/countries"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/states"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/cities"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/driverLicenses"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/academicLevels"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/professions"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/jobHierarchies"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/employmentStatus"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/employmentSectors"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/salaryRanges"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/workShifts"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/contractTypes"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/genderPreferences"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/software"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/languages"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/skillLevels"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/otherSkills"
            element={<BackOfficeDashboard />}
          />
          <Route
            path="/configurations/academicDataStatuses"
            element={<BackOfficeDashboard />}
          />
        </Route>

        <Route path="/logout" element={<Logout />} />
      </Routes>
    );
  }

  if (role === null) {
    return (
      <Routes>
        <Route path="/" element={<NewClient />} />
        <Route path="/home" element={<NewClient />} />
        <Route path="/logout" element={<Logout />} />
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
  const { role, membershipType } = useUserContext();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setUserType(role);
    }
  }, [role]);

  return (
    <Suspense fallback={<Loading loading={true} className="w-full" />}>
      <PageContainer>{renderRoutes(userType, membershipType)}</PageContainer>
    </Suspense>
  );
};

export default Views;

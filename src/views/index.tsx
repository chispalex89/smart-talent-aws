import { Suspense, useEffect, useState } from 'react';
import Loading from '@/components/shared/Loading';
import type { LayoutType } from '@/@types/theme';
import { Route, Routes } from 'react-router-dom';
import BusinessDashboard from './dashboards/BusinessDashboard';
import AppliedJobOfferList from './job/AppliedJobList/JobOfferList';
import JobList from './job/JobList';
import JobCreate from './job/JobCreate';
import FavoriteCandidateList from './candidates/favorite';
import CandidateList from './candidates/all';
import Pricing from './company/pricing';
import PageContainer from '@/components/template/PageContainer';
import Settings from './company/settings';
import ArchivedJobList from './archive/JobList';
import { useUserContext } from '../context/userContext';
import ArchivedCandidateList from './archive/CandidateList';
import ApplicantDashboard from './dashboards/ApplicantDashboard';
import ApplicantSettings from './candidates/Settings';
import Logout from './auth/logout';
import ChangePassword from './auth/changePassword';
import JobOfferSearch from './job/JobSearch';
import CandidateDetails from './candidates/details';
import NewClient from './auth/newClient';

import BackOfficeDashboard from './backOffice/components/dashboard';
import BackOfficeUserList from './backOffice/components/users/list';
import BackOfficeRoleList from './backOffice/components/roles/list';
import BackOfficePermissionList from './backOffice/components/permissions/list';
import BackOfficeCompanyList from './backOffice/components/companies/list';
import BackOfficeDocumentTypeList from './backOffice/components/document-types/list';
import BackOfficeGenderList from './backOffice/components/genders/list';
import BackOfficeGenderPreferenceList from './backOffice/components/gender-preferences/list';
import BackOfficeMaritalStatusList from './backOffice/components/marital-statuses/list';
import BackOfficeCountryList from './backOffice/components/countries/list';
import BackOfficeStateList from './backOffice/components/states/list';
import BackOfficeCityList from './backOffice/components/cities/list';
import BackOfficeDriverLicenseList from './backOffice/components/driver-licenses/list';
import BackOfficeAcademicLevelList from './backOffice/components/academic-levels/list';
import BackOfficeAcademicDataStatusList from './backOffice/components/academic-data-statuses/list';
import BackOfficeProfessionList from './backOffice/components/professions/list';
import BackOfficeJobHierarchy from './backOffice/components/job-hierarchies/list';
import BackOfficeEmploymentStatusList from './backOffice/components/employment-statuses/list';
import BackOfficeEmploymentSectorList from './backOffice/components/employment-sectors/list';
import BackOfficeSalaryRangeList from './backOffice/components/salary-ranges/list';
import BackOfficeContractTypeList from './backOffice/components/contract-types/list';
import BackOfficeWorkShiftList from './backOffice/components/working-shifts/list';
import BackOfficeSoftwareList from './backOffice/components/software-skills/list';
import BackOfficeLanguageList from './backOffice/components/languages/list';
import BackOfficeSkillLevelList from './backOffice/components/skill-levels/list';
import BackOfficeOtherSkillList from './backOffice/components/other-skills/list';
import JobDetails from './job/JobDetails';
import MembershipCard from './backOffice/components/membership-plans/membershipCards';

const renderRoutes = (role: string | null, membershipType: string | null) => {
  if (role === 'Recruiter') {
    return (
      <Routes>
        <Route path="/" element={<BusinessDashboard />} />
        <Route path="/home" element={<BusinessDashboard />} />
        <Route path="/job">
          <Route path="/job/create" element={<JobCreate />} />
          <Route path="/job/edit/:id" element={<JobCreate />} />
          <Route path="/job/my-jobs" element={<JobList />} />
          <Route path="/job/:uuid" element={<JobDetails />} />
        </Route>
        <Route path="/candidates">
          <Route
            path="/candidates/details/:id"
            element={<CandidateDetails />}
          />
          <Route
            path="/candidates/favorite"
            element={<FavoriteCandidateList />}
          />
          {membershipType && membershipType !== 'Bronce' && (
            <Route path="/candidates/find" element={<CandidateList />} />
          )}
        </Route>
        <Route path="/membership">
          <Route path="/membership/plans" element={<Pricing />} />
        </Route>
        <Route path="/profile">
          <Route path="/profile/company" element={<Settings />} />
        </Route>
        <Route path="/archive">
          <Route path="/archive/jobOffers" element={<ArchivedJobList />} />
          <Route path="/archive/candidates" element={<ArchivedCandidateList />} />
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
        <Route path="/job">
          <Route path="/job/my-jobs" element={<AppliedJobOfferList />} />
          <Route path="/job/favorite" element={<JobList />} />
          <Route path="/job/search" element={<JobOfferSearch />} />
          <Route path="/job/:uuid" element={<JobDetails />} />
        </Route>
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
            path="/configurations/membershipPlans"
            element={<MembershipCard />}
          />
          <Route
            path="/configurations/roles"
            element={<BackOfficeRoleList />}
          />
          <Route
            path="/configurations/permissions"
            element={<BackOfficePermissionList />}
          />
          <Route
            path="/configurations/documentTypes"
            element={<BackOfficeDocumentTypeList />}
          />
          <Route
            path="/configurations/genders"
            element={<BackOfficeGenderList />}
          />
          <Route
            path="/configurations/genderPreferences"
            element={<BackOfficeGenderPreferenceList />}
          />
          <Route
            path="/configurations/maritalStatus"
            element={<BackOfficeMaritalStatusList />}
          />
          <Route
            path="/configurations/countries"
            element={<BackOfficeCountryList />}
          />
          <Route
            path="/configurations/states"
            element={<BackOfficeStateList />}
          />
          <Route
            path="/configurations/cities"
            element={<BackOfficeCityList />}
          />
          <Route
            path="/configurations/driverLicenses"
            element={<BackOfficeDriverLicenseList />}
          />
          <Route
            path="/configurations/academicLevels"
            element={<BackOfficeAcademicLevelList />}
          />

          <Route
            path="/configurations/academicDataStatuses"
            element={<BackOfficeAcademicDataStatusList />}
          />
          <Route
            path="/configurations/professions"
            element={<BackOfficeProfessionList />}
          />
          <Route
            path="/configurations/jobHierarchies"
            element={<BackOfficeJobHierarchy />}
          />
          <Route
            path="/configurations/employmentStatus"
            element={<BackOfficeEmploymentStatusList />}
          />
          <Route
            path="/configurations/employmentSectors"
            element={<BackOfficeEmploymentSectorList />}
          />
          <Route
            path="/configurations/salaryRanges"
            element={<BackOfficeSalaryRangeList />}
          />
          <Route
            path="/configurations/workShifts"
            element={<BackOfficeWorkShiftList />}
          />
          <Route
            path="/configurations/contractTypes"
            element={<BackOfficeContractTypeList />}
          />
          <Route
            path="/configurations/software"
            element={<BackOfficeSoftwareList />}
          />
          <Route
            path="/configurations/languages"
            element={<BackOfficeLanguageList />}
          />
          <Route
            path="/configurations/skillLevels"
            element={<BackOfficeSkillLevelList />}
          />
          <Route
            path="/configurations/otherSkills"
            element={<BackOfficeOtherSkillList />}
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
  const { role, membershipType, loadingUser, loadingRole } = useUserContext();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setUserType(role);
    }
  }, [role]);

  return (
    <Loading loading={loadingUser || loadingRole}>
      <PageContainer>{renderRoutes(userType, membershipType)}</PageContainer>
    </Loading>
  );
};

export default Views;

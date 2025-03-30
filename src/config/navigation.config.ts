import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant';

import type { NavigationTree } from '@/@types/navigation';

const navigationConfigByRole = (role: string): NavigationTree[] => {
  switch (role) {
    case 'Recruiter':
      return [
        {
          key: 'home',
          path: '/home',
          title: 'Dashboard',
          translateKey: 'nav.home',
          icon: 'home',
          type: NAV_ITEM_TYPE_ITEM,
          authority: ['Recruiter'],
          subMenu: [],
        },
        {
          key: 'job',
          path: '',
          title: 'Job',
          translateKey: 'nav.job.job',
          icon: 'job',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: ['Recruiter'],
          subMenu: [
            {
              key: 'jobOffers',
              path: '/job/my-jobs',
              title: 'Job Offers',
              translateKey: 'nav.job.jobOffers',
              icon: 'list',
              type: NAV_ITEM_TYPE_ITEM,
              authority: ['Recruiter'],
              subMenu: [],
            },
            {
              key: 'createJob',
              path: '/job/create',
              title: 'createJob',
              translateKey: 'nav.job.createJob',
              icon: 'new',
              type: NAV_ITEM_TYPE_ITEM,
              authority: ['Recruiter'],
              subMenu: [],
            },
          ],
        },
        {
          key: 'candidates',
          path: '',
          title: 'Candidates',
          translateKey: 'nav.candidates.candidates',
          icon: 'candidates',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: ['Recruiter'],
          subMenu: [
            {
              key: 'candidates.favorite',
              path: '/candidates/favorite',
              title: 'Favorite Candidates',
              translateKey: 'nav.candidates.favorite',
              icon: 'favorites',
              type: NAV_ITEM_TYPE_ITEM,
              authority: ['Recruiter'],
              subMenu: [],
            },
            {
              key: 'candidates.all',
              path: '/candidates/find',
              title: 'All Candidates',
              translateKey: 'nav.candidates.all',
              icon: 'search',
              type: NAV_ITEM_TYPE_ITEM,
              authority: ['Recruiter'],
              subMenu: [],
              isExternalLink: true,
            },
          ],
        },
        {
          key: 'archive',
          path: '',
          title: 'Archive',
          translateKey: 'nav.archive.archive',
          icon: 'archive',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: ['Recruiter'],
          subMenu: [
            {
              key: 'jobOffers',
              path: '/archive/jobOffers',
              title: 'Job Offers',
              translateKey: 'nav.archive.jobOffers',
              icon: 'list',
              type: NAV_ITEM_TYPE_ITEM,
              authority: ['Recruiter'],
              subMenu: [],
            },
            {
              key: 'candidates',
              path: '/archive/candidates',
              title: 'Candidates',
              translateKey: 'nav.archive.candidates',
              icon: 'candidates',
              type: NAV_ITEM_TYPE_ITEM,
              authority: ['Recruiter'],
              subMenu: [],
            },
          ],
        },
        {
          key: 'membershipPlans',
          path: '/membership/plans',
          title: 'Plans',
          translateKey: 'nav.membership.pricing',
          icon: 'membership',
          authority: ['Recruiter'],
          subMenu: [],
          type: NAV_ITEM_TYPE_ITEM,
        },
      ];
    case 'Applicant':
      return [
        {
          key: 'home',
          path: '/home',
          title: 'Dashboard',
          translateKey: 'nav.home',
          icon: 'home',
          type: NAV_ITEM_TYPE_ITEM,
          authority: [],
          subMenu: [],
        },
        {
          key: 'cv',
          path: '/profile/applicant',
          title: 'CV',
          translateKey: 'nav.cv',
          icon: 'cv',
          authority: [],
          subMenu: [],
          type: NAV_ITEM_TYPE_ITEM,
        },
        {
          key: 'account',
          path: '/account',
          title: 'Account',
          translateKey: 'nav.account',
          icon: 'account',
          authority: [],
          subMenu: [],
          type: NAV_ITEM_TYPE_ITEM,
        },
        {
          key: 'job.search',
          path: '/job/search',
          title: 'Job Search',
          translateKey: 'nav.job.search',
          icon: 'search',
          authority: [],
          subMenu: [],
          type: NAV_ITEM_TYPE_ITEM,
        },
        {
          key: 'logout',
          path: '/logout',
          title: 'Logout',
          translateKey: 'nav.logout',
          icon: 'logout',
          authority: [],
          subMenu: [],
          type: NAV_ITEM_TYPE_ITEM,
        },
      ];
    case 'Admin':
      return [
        {
          key: 'home',
          path: '/home',
          title: 'Dashboard',
          translateKey: 'nav.home',
          icon: 'home',
          type: NAV_ITEM_TYPE_ITEM,
          authority: [],
          subMenu: [],
        },
        {
          key: 'users',
          path: '',
          title: 'Users',
          translateKey: 'nav.users.users',
          icon: 'users',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: [],
          subMenu: [
            {
              key: 'all',
              path: '/users/all',
              title: 'All Users',
              translateKey: 'nav.users.all',
              icon: 'list',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'roles',
              path: '/users/roles',
              title: 'Roles',
              translateKey: 'nav.users.roles',
              icon: 'roles',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'permissions',
              path: '/users/permissions',
              title: 'Permissions',
              translateKey: 'nav.users.permissions',
              icon: 'permissions',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
          ],
        },

        {
          key: 'companies',
          path: '',
          title: 'Companies',
          translateKey: 'nav.companies.companies',
          icon: 'companies',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: [],
          subMenu: [
            {
              key: 'list',
              path: '/companies/list',
              title: 'Company List',
              translateKey: 'nav.companies.list',
              icon: 'list',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'users',
              path: '/companies/users',
              title: 'Company Users',
              translateKey: 'nav.companies.users',
              icon: 'users',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
          ],
        },
        {
          key: 'candidates',
          path: '',
          title: 'Candidates',
          translateKey: 'nav.candidates.candidates',
          icon: 'candidates',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: [],
          subMenu: [
            {
              key: 'all',
              path: '/candidates/all',
              title: 'All Candidates',
              translateKey: 'nav.candidates.all',
              icon: 'list',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'edit',
              path: '/candidates/{id}/edit',
              title: 'Edit Candidate',
              translateKey: 'nav.candidates.edit',
              icon: 'edit',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
          ],
        },
        {
          key: 'configurations',
          path: '',
          title: 'Configurations',
          translateKey: 'nav.configurations.configurations',
          icon: 'configurations',
          type: NAV_ITEM_TYPE_COLLAPSE,
          authority: [],
          subMenu: [
            {
              key: 'roles',
              path: '/configurations/roles',
              title: 'Roles',
              translateKey: 'nav.configurations.roles',
              icon: 'roles',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'permissions',
              path: '/configurations/permissions',
              title: 'Permissions',
              translateKey: 'nav.configurations.permissions',
              icon: 'permissions',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'documentTypes',
              path: '/configurations/documentTypes',
              title: 'Document Types',
              translateKey: 'nav.configurations.documentTypes',
              icon: 'documentTypes',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'genders',
              path: '/configurations/genders',
              title: 'Genders',
              translateKey: 'nav.configurations.genders',
              icon: 'genders',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'maritalStatus',
              path: '/configurations/maritalStatus',
              title: 'Marital Status',
              translateKey: 'nav.configurations.maritalStatus',
              icon: 'maritalStatus',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'countries',
              path: '/configurations/countries',
              title: 'Countries',
              translateKey: 'nav.configurations.countries',
              icon: 'countries',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'states',
              path: '/configurations/states',
              title: 'States',
              translateKey: 'nav.configurations.states',
              icon: 'states',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'cities',
              path: '/configurations/cities',
              title: 'Cities',
              translateKey: 'nav.configurations.cities',
              icon: 'cities',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'driverLicenses',
              path: '/configurations/driverLicenses',
              title: 'Driver Licenses',
              translateKey: 'nav.configurations.driverLicenses',
              icon: 'driverLicenses',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'academicLevels',
              path: '/configurations/academicLevels',
              title: 'Academic Levels',
              translateKey: 'nav.configurations.academicLevels',
              icon: 'academicLevels',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'professions',
              path: '/configurations/professions',
              title: 'Professions',
              translateKey: 'nav.configurations.professions',
              icon: 'professions',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'jobHierarchies',
              path: '/configurations/jobHierarchies',
              title: 'Job Hierarchies',
              translateKey: 'nav.configurations.jobHierarchies',
              icon: 'jobHierarchies',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'employmentStatus',
              path: '/configurations/employmentStatus',
              title: 'Employment Status',
              translateKey: 'nav.configurations.employmentStatus',
              icon: 'employmentStatus',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'employmentSectors',
              path: '/configurations/employmentSectors',
              title: 'Employment Sectors',
              translateKey: 'nav.configurations.employmentSectors',
              icon: 'employmentSectors',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'salaryRanges',
              path: '/configurations/salaryRanges',
              title: 'Salary Ranges',
              translateKey: 'nav.configurations.salaryRanges',
              icon: 'salaryRanges',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'workShifts',
              path: '/configurations/workShifts',
              title: 'Work Shifts',
              translateKey: 'nav.configurations.workShifts',
              icon: 'workShifts',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'contractTypes',
              path: '/configurations/contractTypes',
              title: 'Contract Types',
              translateKey: 'nav.configurations.contractTypes',
              icon: 'contractTypes',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'genderPreferences',
              path: '/configurations/genderPreferences',
              title: 'Gender Preferences',
              translateKey: 'nav.configurations.genderPreferences',
              icon: 'genderPreferences',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'software',
              path: '/configurations/software',
              title: 'Software',
              translateKey: 'nav.configurations.software',
              icon: 'software',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'languages',
              path: '/configurations/languages',
              title: 'Languages',
              translateKey: 'nav.configurations.languages',
              icon: 'languages',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'skillLevels',
              path: '/configurations/skillLevels',
              title: 'Skill Levels',
              translateKey: 'nav.configurations.skillLevels',
              icon: 'skillLevels',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'otherSkills',
              path: '/configurations/otherSkills',
              title: 'Other Skills',
              translateKey: 'nav.configurations.otherSkills',
              icon: 'otherSkills',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
            {
              key: 'academicDataStatuses',
              path: '/configurations/academicDataStatuses',
              title: 'Academic Data Statuses',
              translateKey: 'nav.configurations.academicDataStatuses',
              icon: 'academicDataStatuses',
              type: NAV_ITEM_TYPE_ITEM,
              authority: [],
              subMenu: [],
            },
          ],
        },
      ];
    default:
      return [];
  }
};

export default navigationConfigByRole;

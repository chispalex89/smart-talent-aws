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
      return [];
    default:
      return [];
  }
};

export default navigationConfigByRole;

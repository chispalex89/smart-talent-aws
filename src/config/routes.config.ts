import { lazy } from 'react';
import authRoute from '@/configs/routes.config/authRoute';
import othersRoute from '@/configs/routes.config/othersRoute';
import type { Routes } from '@/@types/routes';

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes: Routes = [
  {
    key: 'home',
    path: '/home',
    component: lazy(() => import('../views/dashboards/ProjectDashboard')),
    authority: ['Recruiter'],
  },
  {
    key: 'jobOffers',
    path: '/job/my-jobs',
    component: lazy(() => import('../views/job/JobList')),
    authority: ['Recruiter'],
  },
  {
    key: 'createJob',
    path: '/job/create',
    component: lazy(() => import('../views/job/JobCreate')),
    authority: ['Recruiter'],
  },
  {
    key: 'editJob',
    path: '/job/edit/:id',
    component: lazy(() => import('../views/job/JobCreate')),
    authority: ['Recruiter'],
  },
  {
    key: 'candidates.favorite',
    path: '/candidates/favorite',
    component: lazy(() => import('../views/candidates/favorite')),
    authority: ['Recruiter'],
  },
  {
    key: 'candidates.all',
    path: '/candidates',
    component: lazy(() => import('../views/candidates/all')),
    authority: ['Recruiter'],
  },
  {
    key: 'membershipPlans',
    path: '/membership/plans',
    component: lazy(() => import('../views/pricing')),
    authority: ['Recruiter'],
  },
  {
    key: 'companyProfile',
    path: '/company/profile',
    component: lazy(() => import('../views/company/settings')),
    authority: ['Recruiter'],
  },
  ...othersRoute,
];

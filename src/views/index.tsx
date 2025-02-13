import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import AllRoutes from '@/components/route/AllRoutes';
import type { LayoutType } from '@/@types/theme';
import { protectedRoutes, publicRoutes } from '../config/routes.config';
import { Route, Routes } from 'react-router-dom';
import ProjectDashboard from './dashboards/ProjectDashboard';
import JobList from './job/JobList';
import JobCreate from './job/JobCreate';
import FavoriteCandidateList from './candidates/favorite';
import CandidateList from './candidates/all';

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained';
  layout?: LayoutType;
}

// const Views = (props: ViewsProps) => {
//   return (
//     <Suspense fallback={<Loading loading={true} className="w-full" />}>
//       <AllRoutes
//         protectedRoutes={[]}
//         publicRoutes={[...publicRoutes, ...protectedRoutes]}
//         {...props}
//       />
//     </Suspense>
//   );
// };

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={<Loading loading={true} className="w-full" />}>
      <Routes>
        <Route path="/home" element={<ProjectDashboard />} />
        <Route path="/job">
          <Route path="/job/create" element={<JobCreate />} />
          <Route path="/job/my-jobs" element={<JobList />} />
        </Route>
        <Route path="/candidates">
          <Route
            path="/candidates/favorite"
            element={<FavoriteCandidateList />}
          />
          <Route path="/candidates/all" element={<CandidateList />} />
        </Route>
        <Route path="/" element={<ProjectDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default Views;

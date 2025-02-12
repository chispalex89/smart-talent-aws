import Loading from '@/components/shared/Loading';
import UpcomingSchedule from './components/UpcomingSchedule';
import TaskOverview from './components/TaskOverview';
import CurrentTasks from './components/CurrentTasks';
import Schedule from './components/Schedule';
import DashboardOverview from './components/DashboardOverview';
import RecentActivity from './components/RecentActivity';
import useSWR from 'swr';
import type { GetBusinessDashboardResponse } from './types';
import useFetch from '../../../hooks/useFetch';

const ProjectDashboard = () => {
  const { data, loading } = useFetch<GetBusinessDashboardResponse>(`dashboard/business/${1}`);

  return (
    <Loading loading={loading}>
      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1 xl:max-w-[calc(100%-350px)]">
              <DashboardOverview data={data} />
              {/* <Schedule data={data.schedule} /> */}
            </div>
            <div>{/* <UpcomingSchedule /> */}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="md:col-span-1 xl:col-span-1 order-1">
              {/* <CurrentTasks data={data.currentTasks} /> */}
            </div>
            <div className="md:col-span-1 xl:col-span-1 order-2 xl:order-3">
              {/* <RecentActivity data={data.recentActivity} /> */}
            </div>
            <div className="md:col-span-2 xl:col-span-1 order-3 xl:order-2">
              {/* <TaskOverview data={data.taskOverview} /> */}
            </div>
          </div>
        </div>
      )}
    </Loading>
  );
};

export default ProjectDashboard;

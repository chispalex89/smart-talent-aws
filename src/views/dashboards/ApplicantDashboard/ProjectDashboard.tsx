import Loading from '@/components/shared/Loading';
import UpcomingSchedule from './components/UpcomingSchedule';
import QuickActions from './components/TaskOverview';
import CurrentTasks from './components/CurrentTasks';
import Schedule from './components/Schedule';
import DashboardOverview from './components/DashboardOverview';
import RecentActivity from './components/RecentActivity';
import useSWR from 'swr';
import type { GetApplicantDashboardResponse } from './types';
import useFetch from '../../../hooks/useFetch';
import { GetJobOffersResponse } from '../../../views/job/JobList/types';
import { useUserContext } from '../../../context/userContext';
import { useEffect, useState } from 'react';
import apiService from '../../../services/apiService';

const ProjectDashboard = () => {
  const { data: jobs, loading: jobsLoading } = useFetch<GetJobOffersResponse>(
    `job-applicant?pageIndex=1&pageSize=5&applicantId=${1}`
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetApplicantDashboardResponse>();
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiService
        .get<GetApplicantDashboardResponse>(`/dashboard/applicant/${user.id}`)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="md:col-span-1 xl:col-span-2 order-1">
              <CurrentTasks data={jobs?.list || []} />
            </div>
          </div>
        </div>
      )}
    </Loading>
  );
};

export default ProjectDashboard;

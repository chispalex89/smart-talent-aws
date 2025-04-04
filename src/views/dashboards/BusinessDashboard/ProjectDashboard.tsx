import Loading from '@/components/shared/Loading';
import UpcomingSchedule from './components/UpcomingSchedule';
import QuickActions from './components/TaskOverview';
import CurrentTasks from './components/CurrentTasks';
import DashboardOverview from './components/DashboardOverview';
import type { GetBusinessDashboardResponse } from './types';
import { GetJobOffersResponse } from '../../../views/job/JobList/types';
import { useUserContext } from '../../../context/userContext';
import { useEffect, useState } from 'react';
import apiService from '../../../services/apiService';

const ProjectDashboard = () => {
  const { recruiter } = useUserContext();
  const [data, setData] = useState<GetBusinessDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<GetJobOffersResponse | null>(null);

  const fetchRecruiter = async () => {
    const response = await apiService.get<GetJobOffersResponse>(
      `/job-offer?pageIndex=1&pageSize=5&companyId=${recruiter?.companyId}&status=active`
    );
    setJobs(response);
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<GetBusinessDashboardResponse>(
        `/dashboard/business/${recruiter?.companyId}`
      );
      setData(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recruiter) {
      fetchDashboard();
      fetchRecruiter();
    }
  }, [recruiter]);

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
            <div className="md:col-span-2 xl:col-span-1 order-3 xl:order-2">
              <QuickActions membershipType={data?.membership?.name} />
            </div>
          </div>
        </div>
      )}
    </Loading>
  );
};

export default ProjectDashboard;

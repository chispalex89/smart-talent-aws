import Loading from '@/components/shared/Loading';
import CurrentTasks from './components/CurrentTasks';
import DashboardOverview from './components/DashboardOverview';
import type { GetApplicantDashboardResponse } from './types';
import { GetJobApplicationsResponse, GetJobOffersResponse } from '../../../views/job/JobList/types';
import { useUserContext } from '../../../context/userContext';
import { useEffect, useState } from 'react';
import apiService from '../../../services/apiService';

const ProjectDashboard = () => {
  const { user, applicant } = useUserContext();
  const [data, setData] = useState<GetApplicantDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<GetJobApplicationsResponse | null>(null);

  const fetchAppliedJobs = async () => {
    const response = await apiService.get<GetJobApplicationsResponse>(
      `/job-applicant?pageIndex=1&pageSize=5&applicantId=${applicant?.id}`
    );
    setJobs(response);
    };

  const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<GetApplicantDashboardResponse>(
          `/dashboard/applicant/${applicant?.id}`
        );
        setData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (applicant) {
      fetchDashboard();
      fetchAppliedJobs();
    }
  }, [applicant]);
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

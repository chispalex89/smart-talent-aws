import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import classNames from '@/utils/classNames';
import { Link, useNavigate } from 'react-router-dom';
import { TbBriefcase2Filled, TbCopyCheck, TbStar } from 'react-icons/tb';
import { MdCardMembership } from 'react-icons/md';
import { GetApplicantDashboardResponse, Project } from '../types';
import type { ReactNode } from 'react';

type StatisticCardProps = {
  title: string;
  icon: ReactNode;
  className: string;
  value: string | number | ReactNode;
  onClick?: () => void;
};

type DashboardOverviewData = {
  data: GetApplicantDashboardResponse;
};

const StatisticCard = ({
  title,
  className,
  icon,
  value,
  onClick,
}: StatisticCardProps) => {
  return (
    <div
      className={classNames(
        'rounded-2xl p-4 flex flex-col justify-center',
        onClick ? 'cursor-pointer' : '',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center relative">
        <div>
          <div className="mb-4 text-gray-900 font-bold">{title}</div>
          {typeof value === 'object' ? (
            value
          ) : (
            <h1 className="mb-1 text-gray-900">{value}</h1>
          )}
        </div>
        <div
          className={
            'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 bg-gray-900 text-white rounded-full text-2xl'
          }
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = ({ data }: DashboardOverviewData) => {
  const navigate = useNavigate();
  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl mt-4">
        <StatisticCard
          title="Empleos Favoritos"
          className="bg-yellow-100 dark:bg-opacity-75"
          value={data.favoriteJobOffers}
          icon={<TbStar />}
          onClick={() => navigate('/job/favorite')}
        />
        <StatisticCard
          title="Trabajos a los que he Aplicado"
          className="bg-emerald-100 dark:bg-opacity-75"
          value={data.jobOffers}
          icon={<TbCopyCheck />}
        />
        <StatisticCard
          title="Empresas que han visto mi Perfil"
          className="bg-[#5994ff] dark:bg-opacity-75 text-white"
          value={data.resumeCheckedByCompany}
          icon={<TbCopyCheck />}
        />
      </div>
    </Card>
  );
};

export default DashboardOverview;

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import classNames from '@/utils/classNames';
import { Link, useNavigate } from 'react-router-dom';
import { TbBriefcase2Filled, TbCopyCheck, TbStar } from 'react-icons/tb';
import { MdCardMembership } from 'react-icons/md';
import { GetBusinessDashboardResponse, Project } from '../types';
import type { ReactNode } from 'react';

type StatisticCardProps = {
  title: string;
  icon: ReactNode;
  className: string;
  value: string | number | ReactNode;
  onClick?: () => void;
};

type DashboardOverviewData = {
  data: GetBusinessDashboardResponse;
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
          title="Empleos Publicados Activos"
          className="bg-sky-100 dark:bg-opacity-75"
          value={data.activeJobOffers}
          icon={<TbBriefcase2Filled />}
          onClick={() => navigate('/job/my-jobs')}
        />
        <StatisticCard
          title="Candidatos Postulados"
          className="bg-emerald-100 dark:bg-opacity-75"
          value={data.activeCandidates}
          icon={<TbCopyCheck />}
        />
        <StatisticCard
          title="Candidatos Favoritos"
          className="bg-purple-100 dark:bg-opacity-75"
          value={data.favoriteCandidates}
          icon={<TbStar />}
          onClick={() => navigate('/candidates/favorite')}
        />
        <StatisticCard
          title="Membresía Actual"
          className="bg-yellow-100 dark:bg-opacity-75"
          value={
            <div>
              <h2 className="mb-1 text-gray-900">{data.membership.name}</h2>
              <div className={classNames('heading-text font-bold mb-1')}>
                Fecha de expiración:{' '}
                {data.membership.expirationDate
                  ? new Date(data.membership.expirationDate).toUTCString()
                  : 'Nunca'}
              </div>
            </div>
          }
          icon={<MdCardMembership />}
        />
      </div>
    </Card>
  );
};

export default DashboardOverview;

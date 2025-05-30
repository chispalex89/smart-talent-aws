/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import classNames from '@/utils/classNames';
import isLastChild from '@/utils/isLastChild';
import { TbCircleCheckFilled, TbCalendar } from 'react-icons/tb';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { JobApplicant, JobOffer } from '@prisma/client';

type JobApplied = JobApplicant & { job: JobOffer };

type CurrentTasksProps = {
  data: Array<JobApplied>;
};

export const labelClass: Record<string, string> = {
  'In Progress': 'bg-sky-200 dark:bg-sky-200 dark:text-gray-900',
  Completed: 'bg-emerald-200 dark:bg-emerald-200 dark:text-gray-900',
  Pending: 'bg-amber-200 dark:bg-amber-200 dark:text-gray-900',
  High: 'bg-red-200 dark:bg-red-200 dark:text-gray-900',
  Medium: 'bg-orange-200 dark:bg-orange-200 dark:text-gray-900',
  Low: 'bg-purple-200 dark:bg-purple-200 dark:text-gray-900',
};

const CurrentTasks = ({ data }: CurrentTasksProps) => {
  const [tasks, setTasks] = useState<JobApplied[]>([]);

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(data);
    }
  }, [data, tasks.length]);

  const handleChange = (taskId: number) => {};

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h4>Mis trabajos</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aquí puedes ver los últimos 5 trabajos que has aplicado
          </p>
        </div>
        <Link to="/job/my-jobs">
          <Button asElement="div" size="sm">
            Todos mis trabajos
          </Button>
        </Link>
      </div>
      <div className="mt-4 min-h-[380px]">
        {tasks.map((jobOffer, index) => (
          <div
            key={jobOffer.id}
            className={classNames(
              'flex items-center justify-between py-4 border-gray-200 dark:border-gray-600',
              !isLastChild(tasks, index) && 'border-b'
            )}
          >
            <div className="flex items-center gap-4">
              <button
                className=" text-[26px] cursor-pointer"
                role="button"
                onClick={() => handleChange(jobOffer.id)}
              >
                <TbCircleCheckFilled className="text-primary" />
              </button>
              <div>
                <div className={'heading-text font-bold mb-1'}>
                  <Link
                    to={`/job/${jobOffer.job.uuid}`}
                    className="text-primary hover:underline"
                  >
                    {jobOffer.job.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <TbCalendar className="text-lg" />
                    {jobOffer.job.publicationDate
                      ? dayjs(jobOffer.job.publicationDate).format(
                          'DD/MMM/YYYY'
                        )
                      : '-'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* <Tag
                className={`mr-2 rtl:ml-2 mb-2 ${
                  jobOffer.priority ? labelClass[jobOffer.priority] : ''
                }`}
              >
                {jobOffer.priority}
              </Tag> */}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CurrentTasks;

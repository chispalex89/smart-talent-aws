import { useState } from 'react';
import Card from '@/components/ui/Card';
import Segment from '@/components/ui/Segment';
import Badge from '@/components/ui/Badge';
import Chart from '@/components/shared/Chart';
import { COLORS } from '@/constants/chart.constant';
import isEmpty from 'lodash/isEmpty';
import type { TaskOverviewChart } from '../types';
import { Button } from '@/components/ui';
import { PiBriefcase, PiUserBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { MdCardMembership } from 'react-icons/md';

export interface IQuickActionsProps {
  membershipType: string;
}

const QuickActions = ({ membershipType }: IQuickActionsProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4>Atajos</h4>
      </div>
      <div className="mt-4 min-h-[380px] flex flex-col gap-4">
        {membershipType.toLowerCase() !== 'gratis' ? (
          <Button>
            <Link
              to="/candidates/find"
              className="flex items-center gap-2 justify-center"
              target="_blank"
            >
              <PiUserBold />
              <span>Ver Candidatos</span>
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            className="flex items-center gap-2 justify-center"
            title="Solo disponible para membresías oro o plata"
          >
            <PiUserBold />
            <span>Ver Candidatos</span>
          </Button>
        )}
        <Button variant="solid">
          <Link
            to="/job/create"
            className="flex items-center gap-2 justify-center"
          >
            <PiBriefcase />
            <span>Nuevo Trabajo</span>
          </Link>
        </Button>
        <Button variant="solid" color="warning">
          <Link
            to="/job/create"
            className="flex items-center gap-2 justify-center"
          >
            <MdCardMembership />
            <span>Membresías</span>
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;

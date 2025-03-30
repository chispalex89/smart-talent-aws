import React from 'react';
import { Tag } from '@/components/ui';

const statusColor: Record<
  string,
  {
    label: string;
    bgClass: string;
    textClass: string;
  }
> = {
  active: {
    label: 'Activo',
    bgClass: 'bg-success-subtle',
    textClass: 'text-success',
  },
  inactive: {
    label: 'Inactivo',
    bgClass: 'bg-warning-subtle',
    textClass: 'text-warning',
  },
  archived: {
    label: 'Archivado',
    bgClass: 'bg-error-subtle',
    textClass: 'text-error',
  },
};

export const renderStatus = (status: string) => {
  return (
    <Tag className={statusColor[status].bgClass}>
      <span
        className={`capitalize font-semibold ${statusColor[status].textClass}`}
      >
        {statusColor[status].label}
      </span>
    </Tag>
  );
};

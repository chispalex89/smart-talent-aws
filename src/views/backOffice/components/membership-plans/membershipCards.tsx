import React, { useEffect, useMemo, useState } from 'react';
import MembershipPlanForm from './components/MembershipPlanForm';
import useSWR from 'swr';
import apiService from '../../../../services/apiService';
import { Card, Select, toast } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import { MembershipType } from '@prisma/client';

type Option = {
  value: number;
  label: string;
  className: string;
};

const MembershipCard = () => {
  const { data, mutate } = useSWR(
    '/membership-type',
    (url) => apiService.get<MembershipType[]>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [selectedMembership, setSelectedMembership] =
    useState<MembershipType | null>(null);

  const membershipOptions: Option[] = useMemo(() => {
    return data
      ? data.map((membership) => ({
          label: membership.name,
          value: membership.id,
          className: 'text-gray-900',
        }))
      : [
          {
            label: 'No hay membresías disponibles',
            value: -1,
            className: 'text-gray-500',
          },
        ];
  }, [data]);

  return (
    <Card bodyClass="flex flex-col gap-4">
      <h4 className="mb-4">Planes de Membresía</h4>
      <Select<Option>
        options={membershipOptions}
        placeholder="Selecciona una membresía"
        value={
          selectedMembership
            ? membershipOptions.find(
                (option) => option.value === selectedMembership.id
              )
            : null
        }
        onChange={(option) =>
          setSelectedMembership(
            data?.find((m) => m.id === option!.value) || null
          )
        }
      />
      {selectedMembership && (
        <MembershipPlanForm
          key={selectedMembership.id}
          membership={selectedMembership}
          onSubmit={() => {
            toast.push(
              <Notification type="success">
                Plan de membresía actualizado correctamente
              </Notification>,
              {
                placement: 'top-center',
              }
            );
            mutate();
          }}
        />
      )}
    </Card>
  );
};
export default MembershipCard;

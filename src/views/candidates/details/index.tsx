import Container from '@/components/shared/Container';
import { Avatar, Card, Tooltip } from '@/components/ui';
import React, { use } from 'react';
import useFetch from '../../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { nameFormat } from '../../../helpers/textConverter';
import dayjs from 'dayjs';
import { HiPencil } from 'react-icons/hi';
import { UserApplicant } from '../../../types/user';

type CandidateDetailProps = {
  title?: string;
  value?: string;
};

const CandidateInfoField = ({ title, value }: CandidateDetailProps) => {
  return (
    <div>
      <span className="font-semibold">{title}</span>
      <p className="heading-text font-bold">{value}</p>
    </div>
  );
};

const CandidateMainDetails = ({ title, value }: CandidateDetailProps) => {
  return (
    <div>
      <span className="heading-text font-bold">{title}</span>
      <p className="font-semibold">{value}</p>
    </div>
  );
};

const CandidateDetails = () => {
  const { id } = useParams();

  const {
    data: user,
    error,
    loading,
  } = useFetch<UserApplicant>(`applicant/${id}/applicant-data`);

  console.log(user);
  return (
    <Container>
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="min-w-[330px] 2xl:min-w-[300px]">
          <Card className="w-full">
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[250px] mx-auto">
              <div className="flex xl:flex-col items-center gap-4 mt-6">
                <Avatar
                  size={90}
                  shape="circle"
                  src={user?.profileImage || ''}
                />
                <h4 className="font-bold">{user ? nameFormat(user) : ''}</h4>
                <span className="text-sm text-muted-foreground">
                  Última actualización:{' '}
                  {dayjs(user?.personalData[0]?.updated_at).format(
                    'DD MMM YYYY'
                  ) || ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-5 gap-x-4 mt-10">
                <CandidateInfoField title="Email" value={user?.email} />
                <CandidateInfoField
                  title="Teléfono"
                  value={user?.personalData[0]?.phone || 'No especificado'}
                />
                <CandidateInfoField
                  title="Celular"
                  value={user?.personalData[0]?.mobile || 'No especificado'}
                />
                <CandidateInfoField
                  title="Fecha de nacimiento"
                  value={
                    user?.personalData[0]?.dateOfBirth
                      ? dayjs(user?.personalData[0]?.dateOfBirth).format(
                          'DD MMM YYYY'
                        )
                      : 'No especificada'
                  }
                />
                <CandidateInfoField
                  title="Edad"
                  value={
                    user?.personalData[0]?.dateOfBirth
                      ? dayjs()
                          .diff(user?.personalData[0]?.dateOfBirth, 'year')
                          .toString() + ' años'
                      : 'No especificada'
                  }
                />
                <CandidateInfoField
                  title="Estado Civil"
                  value={
                    user?.personalData[0]?.marital_status?.name ||
                    'No especificado'
                  }
                />
                <CandidateInfoField
                  title="Departamento"
                  value={user?.personalData[0]?.city?.name || 'No especificado'}
                />
                <CandidateInfoField
                  title="Dirección"
                  value={user?.personalData[0]?.address || 'No especificada'}
                />
                <CandidateInfoField
                  title="Zona"
                  value={user?.personalData[0]?.zone || ''}
                />
              </div>
            </div>
          </Card>
        </div>
        <Card className="w-full">
          <h4 className="font-bold">Descripción</h4>
          <p className="font-semibold">
            {user?.professionalData[0]?.description || ''}
          </p>
          <hr className="my-4" />
          <div className="flex flex-col mt-4">
            <h4 className="font-bold">Perfil Profesional</h4>
            {user?.jobExperienceData.map((item, index) => (
              <CandidateMainDetails
                key={index}
                title={`${item.companyName} ${item.useForReference ? '(Referencia)' : ''}`}
                value={`${item.position} - ${dayjs(item.startDate).format('MMM YYYY')} ${item.endDate ? `a ${dayjs(item.endDate).format('MMM YYYY')}` : 'Actualidad'}`}
              />
            ))}
            <hr className="my-4" />
            <h4 className="font-bold">Perfil Académico</h4>
            {user?.academicData.map((item, index) => (
              <CandidateMainDetails
                key={index}
                title={item.institutionName}
                value={`${item.titleObtained} - ${dayjs(item.startDate).format('MMM YYYY')} ${item.endDate ? `a ${dayjs(item.endDate).format('MMM YYYY')}` : '(En curso)'}`}
              />
            ))}
            <hr className="my-4" />
            <h4 className="font-bold mt-4">Idiomas y Conocimientos</h4>
            {user?.languageSkillsData.map((item, index) => (
              <CandidateMainDetails
                key={index}
                title={item.language.name}
                value={item.skillLevel.name}
              />
            ))}
            <hr className="my-4" />
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default CandidateDetails;

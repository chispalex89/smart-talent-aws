import Container from '@/components/shared/Container';
import { Avatar, Card } from '@/components/ui';
import React, { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import { nameFormat } from '../../../helpers/textConverter';
import dayjs from 'dayjs';
import { UserApplicant } from '../../../types/user';
import { useCatalogContext } from '../../../context/catalogContext';
import apiService from '../../../services/apiService';
import { useUserContext } from '../../../context/userContext';
import { CompanyViewedApplicant } from '@prisma/client';
import { profileImageUrl } from '../../../helpers/s3Url';

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
  const { otherSkills } = useCatalogContext();
  const { recruiter } = useUserContext();
  const [availableToView, setAvailableToView] = useState(false);

  const {
    data: user,
    error,
    loading,
  } = useFetch<UserApplicant>(`applicant/${id}/applicant-data`);

  const {
    data: userViewed,
    loading: loadingUserViewed,
    refetch,
  } = useFetch<any>(`company-viewed-applicant/${id}/${recruiter?.id}`, {
    lazy: true,
  });

  useEffect(() => {
    if (recruiter && id) {
      refetch();
    }
  }, [recruiter, id]);

  useEffect(() => {
    if (recruiter && id) {
      apiService.post('/company-viewed-applicant', {
        applicantId: +id,
        companyId: recruiter.companyId,
        recruiterId: recruiter.id,
      });
    }
  }, [id, recruiter]);

  useEffect(() => {
    if (userViewed) {
      setAvailableToView(
        recruiter?.company?.Membership[0].membership_type.name !== 'Bronce'
      );
    } else {
      apiService
        .get<
          CompanyViewedApplicant[]
        >(`/company-viewed-applicant?companyId=${recruiter?.companyId}`)
        .then((response) => {
          const viewed = response.find((item) => item.applicantId === +id!);
          if (
            !viewed &&
            recruiter?.company?.Membership[0].membership_type.name === 'Plata'
          ) {
            setAvailableToView(response.length < 1);
          } else {
            setAvailableToView(!!viewed);
          }
        });
    }
  }, [userViewed, recruiter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!availableToView) {
    return (
      <Container>
        <Card className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-center">
              No tienes permiso para ver más candidatos. <br />
              Considera actualizar tu plan{' '}
              <Link
                to="/membership/plans"
                className="text-blue-500 hover:underline"
              >
                aquí
              </Link>{' '}
              para obtener acceso.
            </h3>
          </div>
        </Card>
      </Container>
    );
  }

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
                  src={profileImageUrl(user?.profileImage) || ''}
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
                value={`${item.titleObtained} - ${dayjs(item.startDate).format('MMM YYYY')} ${item.endDate ? `a ${dayjs(item.endDate).format('MMM YYYY')}` : ''} ${item.academic_status?.name ? `(${item.academic_status.name})` : ''}`}
              />
            ))}
            <hr className="my-4" />
            <h4 className="font-bold mt-4">Idiomas</h4>
            {user?.languageSkillsData.map((item, index) => (
              <CandidateMainDetails
                key={index}
                title={item.language.name}
                value={item.skillLevel.name}
              />
            ))}
            {user?.languageSkillsData.length === 0 && (
              <p className="text-muted-foreground">
                No hay idiomas registrados
              </p>
            )}
            <hr className="my-4" />
            <h4 className="font-bold mt-4">Habilidades Informáticas</h4>
            <div className="flex flex-row flex-wrap items-center w-full gap-2">
              {user?.softwareSkillsData.map((item, index) => (
                <CandidateMainDetails
                  key={index}
                  title={item.software.name}
                  value={item.skillLevel.name}
                />
              ))}
            </div>
            {user?.softwareSkillsData.length === 0 && (
              <p className="text-muted-foreground">
                No hay habilidades informáticas registradas
              </p>
            )}
            <hr className="my-4" />
            <h4 className="font-bold mt-4">Habilidades Adicionales</h4>
            {user?.otherSkillsData && user.otherSkillsData.length > 0 ? (
              <>
                <h4 className="font-bold mt-4">Descripción</h4>
                {user.otherSkillsData[0].otherSkills ? (
                  <p className="font-semibold">
                    {user.otherSkillsData[0].otherSkills}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    No hay descripción registrada
                  </p>
                )}
                <h4 className="font-bold mt-4">Otras Habilidades</h4>
                {user.otherSkillsData[0].skillIds.map((item, index) => {
                  const skill = otherSkills.find((skill) => skill.id === item);
                  if (skill) {
                    return (
                      <CandidateMainDetails
                        key={index}
                        title={skill.name}
                        value={skill.description || ''}
                      />
                    );
                  }
                  return <></>;
                })}
              </>
            ) : (
              <p className="text-muted-foreground">
                No hay habilidades adicionales registradas
              </p>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default CandidateDetails;

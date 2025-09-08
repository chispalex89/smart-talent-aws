import React, { useEffect, useState } from 'react';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import Container from '@/components/shared/Container';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { toast, Tooltip } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import { Avatar, Button, Card, Spinner } from '@/components/ui';
import { JobOfferDetails } from './types';
import { BsCheck2Circle, BsStar } from 'react-icons/bs';
import { useUserContext } from '../../../context/userContext';
import apiService from '../../../services/apiService';
import { FavoriteJobOffer, JobApplicant } from '@prisma/client';
import { profileImageUrl } from '../../../helpers/s3Url';

const JobDetails = () => {
  const { applicant, recruiter } = useUserContext();
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [appliedJobUuid, setAppliedJobUuid] = useState<string | null>(null);

  const {
    data: jobDetails,
    error,
    loading,
  } = useFetch<JobOfferDetails>(`job-offer/${uuid}`);

  useEffect(() => {
    if (
      jobDetails &&
      jobDetails.FavoriteJobOffer &&
      jobDetails.FavoriteJobOffer.length > 0 &&
      applicant?.id
    ) {
      const id = jobDetails.FavoriteJobOffer.find(
        (favorite) => favorite.applicantId === applicant?.id
      )?.id;

      setFavoriteId(id ?? null);
    }
  }, [jobDetails, applicant]);

  useEffect(() => {
    if (jobDetails && applicant) {
      apiService
        .get<JobApplicant[]>(`/job-applicant?applicantId=${applicant?.id}`)
        .then((response) => {
          const uuid = response.find(
            (job) => job.jobUuid === jobDetails.uuid
          )?.jobUuid;
          setAppliedJobUuid(uuid ?? null);
        });
    }
  }, [jobDetails, applicant]);

  const handleFavorite = async (jobId: number) => {
    try {
      const data = await apiService.post<FavoriteJobOffer>(
        '/favorite-job-offer',
        {
          applicantId: applicant?.id,
          jobId,
        }
      );

      if (!data) {
        throw new Error('No se pudo añadir la oferta a favoritos');
      }

      setFavoriteId(data.id);

      toast.push(
        <Notification type="info">
          Oferta de empleo añadida a favoritos
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al añadir la oferta de empleo a favoritos
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  const handleUnfavorite = async () => {
    try {
      await apiService.delete(`/favorite-job-offer/${favoriteId}`);
      setFavoriteId(null);
      toast.push(
        <Notification type="info">
          Oferta de empleo eliminada de favoritos
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la oferta de empleo de favoritos
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  const handleApply = async () => {
    try {
      const response = await apiService.post('/job-applicant', {
        applicantId: applicant!.id,
        jobId: jobDetails!.id,
        jobUuid: jobDetails!.uuid,
      });

      if (!response) {
        throw new Error('No se pudo aplicar a la oferta');
      }

      toast.push(<Notification type="info">Aplicación enviada</Notification>, {
        placement: 'top-center',
      });
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al enviar la aplicación
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  return (
    <Container>
      {applicant && (
        <div>
          <Link
            to="/job/search"
            className="flex items-center gap-2 text-blue-600 hover:underline mb-4 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver a empleos
          </Link>
        </div>
      )}
      {recruiter && (
        <div>
          <Link
            to="/job/my-jobs"
            className="flex items-center gap-2 text-blue-600 hover:underline mb-4 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver a empleos
          </Link>
        </div>
      )}
      <Card bodyClass="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <Avatar
            size={80}
            shape="square"
            src={profileImageUrl(jobDetails?.company?.logoUrl) || undefined}
            alt={jobDetails?.company?.name}
          />
          <h3>{jobDetails?.name}</h3>
        </div>
        <div>
          <div className="flex flex-col items-end gap-2">
            {applicant && (
              <>
                {appliedJobUuid ? (
                  <Tooltip
                    wrapperClass="flex w-full"
                    title="Ya has aplicado a esta oferta"
                  >
                    <Button
                      variant="success"
                      disabled={true}
                      className="w-full flex flex-row items-center justify-center gap-1"
                    >
                      <BsCheck2Circle />
                      Aplicar
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => handleApply()}
                    className="w-full flex flex-row items-center justify-center gap-1"
                  >
                    <BsCheck2Circle />
                    Aplicar
                  </Button>
                )}
                {favoriteId ? (
                  <Button
                    variant="solid"
                    size="md"
                    customColorClass={() =>
                      'border-warning ring-1 ring-warning text-warning hover:bg-warning hover:ring-warning hover:text-white bg-transparent'
                    }
                    className="flex items-center justify-center gap-2 w-[150px]"
                    onClick={() => handleUnfavorite()}
                  >
                    <BsStar /> Quitar Favorito
                  </Button>
                ) : (
                  <Button
                    variant="solid"
                    size="md"
                    customColorClass={() =>
                      'border-warning ring-1 ring-warning text-warning hover:bg-warning hover:ring-warning hover:text-white bg-transparent'
                    }
                    className="flex items-center justify-center gap-2 w-[150px]"
                    onClick={() => handleFavorite(jobDetails?.id || 0)}
                  >
                    <BsStar /> Favorito
                  </Button>
                )}
              </>
            )}
            {recruiter && (
              <Button
                onClick={() => navigate(`/job/edit/${jobDetails?.uuid}`)}
                variant="solid"
                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Editar
              </Button>
            )}
          </div>
        </div>
      </Card>
      <br />
      <div className="flex flex-col xl:flex-row gap-4">
        <Card className="min-w-[330px] xl:min-w-[400px]">
          <h4>Detalles Principales</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold w-40">Fecha de Publicación:</span>
              <span>
                {jobDetails?.publicationDate &&
                  new Date(jobDetails.publicationDate).toLocaleDateString(
                    'es-GT',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }
                  )}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Rango Salarial:</span>
              <span>
                {jobDetails?.salary_range?.range || 'No especificado'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">País:</span>
              <span>{jobDetails?.country?.name || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Departamento:</span>
              <span>{jobDetails?.state?.name || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Ciudad:</span>
              <span>{jobDetails?.city?.name || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Zona:</span>
              <span>{jobDetails?.zone || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Jornada:</span>
              <span>{jobDetails?.work_shift?.name || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Contrato:</span>
              <span>
                {jobDetails?.contract_type?.name || 'No especificado'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Área:</span>
              <span>
                {jobDetails?.employment_sector?.name || 'No especificado'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Edad:</span>
              <span>
                {jobDetails?.ageRangeFrom && jobDetails?.ageRangeTo
                  ? `${jobDetails?.ageRangeFrom} - ${jobDetails?.ageRangeTo} años`
                  : 'No especificado'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Horario:</span>
              <span>{jobDetails?.schedule || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Vacantes:</span>
              <span>{jobDetails?.vacancies || 'No especificado'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Experiencia:</span>
              <span>
                {jobDetails?.isExperienceRequired
                  ? (jobDetails?.requiredExperience ?? 'No especificado')
                  : 'No'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Estudios Mínimos:</span>
              <span>
                {jobDetails?.minimum_academic_level?.name || 'No especificado'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">
                Disponibilidad para Viajar:
              </span>
              <span>
                {jobDetails?.requiredAvailabilityToTravel ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-40">Licencia de Conducir:</span>
              <span>{jobDetails?.requiredDriverLicense ? 'Sí' : 'No'}</span>
            </div>
          </div>
        </Card>
        <Card className="w-full overflow-scroll">
          <h4>Descripción</h4>
          <div className="space-y-3">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p>Error al cargar los detalles de la oferta.</p>
            ) : (
              <p>{jobDetails?.description}</p>
            )}
          </div>
          <h4>Beneficios</h4>
          <div className="space-y-3">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p>Error al cargar los beneficios de la oferta.</p>
            ) : (
              <p>{jobDetails?.publicDescription}</p>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default JobDetails;

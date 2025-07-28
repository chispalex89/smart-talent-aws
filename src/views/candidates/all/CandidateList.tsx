import AdaptiveCard from '@/components/shared/AdaptiveCard';
import Container from '@/components/shared/Container';
import CandidatesListTable from './components/CandidateListTable';
import CandidatesListActionTools from './components/CandidateListActionTools';
import CandidatesListTableTools from './components/CandidateListTableTools';
import CandidatesListSelected from './components/CandidateListSelected';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useState } from 'react';
import useCandidateList from './hooks/useCandidateList';
import apiService from '../../../services/apiService';
import Notification from '@/components/ui/Notification';
import { toast } from '@/components/ui';
import { useUserContext } from '../../../context/userContext';

const CandidateList = () => {
  const { recruiter } = useUserContext();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationArchiveOpen, setConfirmationArchiveOpen] = useState(false);
  const [confirmationReportOpen, setConfirmationReportOpen] = useState(false);
  const [confirmationFavoriteOpen, setConfirmationFavoriteOpen] =
    useState(false);
  const { mutate } = useCandidateList();
  const [id, setId] = useState(0);
  const [isRemoveAction, setIsRemoveAction] = useState(false);

  const handleConfirmReport = async () => {
    // await apiService.post(`/company-report-applicant/${id}`);
    toast.push(<Notification type="info">Candidato reportado</Notification>, {
      placement: 'top-center',
    });
    setConfirmationOpen(false);
    mutate();
  };

  const handleConfirmArchive = async () => {
    if (isRemoveAction) {
      await apiService.delete(`/company-archived-applicant/${id}`);
      toast.push(
        <Notification type="info">Candidato eliminado del archivo</Notification>,
        {
          placement: 'top-center',
        }
      );
    } else {
      await apiService.post('/company-archived-applicant', {
        applicantId: id,
        companyId: recruiter?.companyId,
      });
      toast.push(<Notification type="info">Candidato archivado</Notification>, {
        placement: 'top-center',
      });
    }
    handleCancel();
    mutate();
  };

  const handleConfirmDelete = async () => {
    await apiService.delete(`/company-favorite-applicant/${id}`);
    toast.push(
      <Notification type="info">
        Candidato eliminado de los favoritos
      </Notification>,
      {
        placement: 'top-center',
      }
    );
    handleCancel();
    mutate();
  };

  const handleConfirmFavorite = async () => {
    await apiService.post('/company-favorite-applicant', {
      applicantId: id,
      companyId: recruiter?.companyId,
    });
    toast.push(
      <Notification type="info">Candidato agregado a favoritos</Notification>,
      {
        placement: 'top-center',
      }
    );
    handleCancel();
    mutate();
  };

  const handleArchive = (id: number, unarchive: boolean) => {
    setConfirmationArchiveOpen(true);
    setId(id);
    setIsRemoveAction(unarchive);
  };

  const handleReport = (id: number) => {
    setConfirmationReportOpen(true);
    setId(id);
  };

  const handleFavorite = (id: number, unfavorite: boolean) => {
    if (unfavorite) {
      setConfirmationOpen(true);
    } else {
      setConfirmationFavoriteOpen(true);
    }
    setId(id);
    setIsRemoveAction(unfavorite);
  };

  const handleDownload = (id: number) => {
    console.log('Download', id);
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
    setConfirmationArchiveOpen(false);
    setConfirmationReportOpen(false);
    setConfirmationFavoriteOpen(false);
    setId(0);
  };
  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Candidatos</h3>
              <CandidatesListActionTools />
            </div>
            <CandidatesListTableTools />
            <CandidatesListTable
              handleArchive={handleArchive}
              handleReport={handleReport}
              handleFavorite={handleFavorite}
              handleDownload={handleDownload}
            />
          </div>
        </AdaptiveCard>
      </Container>
      <ConfirmDialog
        isOpen={confirmationOpen}
        type="danger"
        title=""
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      >
        <p>¿Está seguro de eliminar al candidato de sus favoritos?</p>
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={confirmationArchiveOpen}
        type="info"
        title=""
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmArchive}
      >
        <p>
          ¿Está seguro de {isRemoveAction ? 'quitar del archivo ' : 'archivar '}
          al candidato?
        </p>
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={confirmationReportOpen}
        type="danger"
        title=""
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmReport}
      >
        <p>¿Está seguro de reportar al candidato?</p>
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={confirmationFavoriteOpen}
        type="info"
        title=""
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmFavorite}
      >
        <p>¿Está seguro de guardar como favorito al candidato?</p>
      </ConfirmDialog>
      <CandidatesListSelected />
    </>
  );
};

export default CandidateList;

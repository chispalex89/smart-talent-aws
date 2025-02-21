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

const CandidateList = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationArchiveOpen, setConfirmationArchiveOpen] = useState(false);
  const [confirmationReportOpen, setConfirmationReportOpen] = useState(false);
  const [confirmationFavoriteOpen, setConfirmationFavoriteOpen] =
    useState(false);
  const { mutate } = useCandidateList();
  const [id, setId] = useState(0);

  const handleConfirmReport = async () => {
    // await apiService.post(`/company-report-applicant/${id}`);
    toast.push(<Notification type="info">Candidato reportado</Notification>, {
      placement: 'top-center',
    });
    setConfirmationOpen(false);
    mutate();
  };

  const handleConfirmArchive = async () => {
    // await apiService.post(`/company-archive-applicant/${id}`);
    toast.push(<Notification type="info">Candidato archivado</Notification>, {
      placement: 'top-center',
    });
    setConfirmationOpen(false);
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
    setConfirmationOpen(false);
    mutate();
  };

  const handleConfirmFavorite = async () => {
    // await apiService.post(`/company-favorite-applicant/${id}`);
    toast.push(
      <Notification type="info">Candidato agregado a favoritos</Notification>,
      {
        placement: 'top-center',
      }
    );
    setConfirmationOpen(false);
    mutate();
  };

  const handleDelete = (id: number) => {
    setConfirmationOpen(true);
    setId(id);
  };

  const handleArchive = (id: number) => {
    setConfirmationArchiveOpen(true);
    setId(id);
  };

  const handleReport = (id: number) => {
    setConfirmationReportOpen(true);
    setId(id);
  };

  const handleFavorite = (id: number) => {
    setConfirmationOpen(true);
    setId(id);
  };

  const handleDownload = (id: number) => {
    console.log('Download', id);
  }

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
              handleDelete={handleDelete}
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
        type="danger"
        title=""
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmArchive}
      >
        <p>¿Está seguro de archivar al candidato?</p>
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
        onConfirm={handleConfirmArchive}
      >
        <p>¿Está seguro de guardar como favorito al candidato?</p>
      </ConfirmDialog>
      <CandidatesListSelected />
    </>
  );
};

export default CandidateList;

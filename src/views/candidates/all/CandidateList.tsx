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
  const { mutate } = useCandidateList();
  const [id, setId] = useState(0);

  const handleConfirmDelete = async () => {
    await apiService.delete(`/company-favorite-applicant/${id}`);
    toast.push(
      <Notification type="info">Candidato eliminado de los favoritos</Notification>,
      {
        placement: 'top-center',
      },
    );
    setConfirmationOpen(false);
    mutate();
  };

  const handleDelete = (id: number) => {
    setConfirmationOpen(true);
    setId(id);
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
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
            <CandidatesListTable handleDelete={handleDelete} />
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
      <CandidatesListSelected />
    </>
  );
};

export default CandidateList;

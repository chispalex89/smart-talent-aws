import AdaptiveCard from '@/components/shared/AdaptiveCard';
import Container from '@/components/shared/Container';
import FavoriteCandidatesListTable from './components/FavoriteCandidateListTable';
import FavoriteCandidatesListActionTools from './components/FavoriteCandidateListActionTools';
import FavoriteCandidatesListTableTools from './components/FavoriteCandidateListTableTools';
import FavoriteCandidatesListSelected from './components/FavoriteCandidateListSelected';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useState } from 'react';
import useFavoriteCandidateList from './hooks/useFavoriteCandidateList';
import apiService from '../../../services/apiService';
import Notification from '@/components/ui/Notification';
import { toast } from '@/components/ui';

const FavoriteCandidateList = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { mutate } = useFavoriteCandidateList();
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
              <h3>Candidatos Favoritos</h3>
              <FavoriteCandidatesListActionTools />
            </div>
            <FavoriteCandidatesListTableTools />
            <FavoriteCandidatesListTable handleDelete={handleDelete} />
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
      <FavoriteCandidatesListSelected />
    </>
  );
};

export default FavoriteCandidateList;

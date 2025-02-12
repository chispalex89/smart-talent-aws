import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import JobListTable from './components/JobListTable';
import JobOfferListActionTools from './components/JobListActionTools';
import JobOfferListTableTools from './components/JobListTableTools';
import { useState } from 'react';
import { toast } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import useJobOfferList from './hooks/useJobOfferList';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import apiService from '../../../services/apiService';

const JobOfferList = () => {
  const [deleteJobOfferConfirmationOpen, setDeleteJobOfferConfirmationOpen] =
    useState(false);

  const [uuid, setUuid] = useState('');
  const { mutate } = useJobOfferList();
  const handleConfirmDelete = async () => {
    await apiService.delete(`/job-offer/${uuid}`);
    toast.push(<Notification type="info">Oferta de empleo eliminada</Notification>, {
      placement: 'top-center',
    });
    setDeleteJobOfferConfirmationOpen(false);
    mutate();
  };

  const handleDelete = (uuid: string) => {
    setDeleteJobOfferConfirmationOpen(true);
    setUuid(uuid);
  };

  const handleCancel = () => {
    setDeleteJobOfferConfirmationOpen(false);
    setUuid('');
  };
  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Mis Ofertas de Empleo</h3>
            <JobOfferListActionTools />
          </div>
          <JobOfferListTableTools />
          <JobListTable handleDelete={handleDelete} />
        </div>
      </AdaptiveCard>
      <ConfirmDialog
        isOpen={deleteJobOfferConfirmationOpen}
        type="danger"
        title="Eliminar Oferta de Empleo"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      >
        <p>¿Está seguro de eliminar la oferta de empleo?</p>
      </ConfirmDialog>
    </Container>
  );
};

export default JobOfferList;

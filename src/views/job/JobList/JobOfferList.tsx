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
  const [archiveJobOfferConfirmationOpen, setArchiveJobOfferConfirmationOpen] =
    useState(false);

  const [uuid, setUuid] = useState('');
  const { mutate } = useJobOfferList();
  const handleConfirmDelete = async () => {
    try {
      await apiService.delete(`/job-offer/${uuid}`);
      toast.push(
        <Notification type="info">Oferta de empleo eliminada</Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la oferta de empleo
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      handleCancel();
      mutate();
    }
  };

  const handleConfirmArchive = async () => {
    try {
      await apiService.put(`/job-offer/${uuid}`, { status: 'archived' });
      toast.push(
        <Notification type="info">Oferta de empleo archivada</Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al archivar la oferta de empleo
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      handleCancel();
      mutate();
    }
  };

  const handleDelete = (uuid: string) => {
    setDeleteJobOfferConfirmationOpen(true);
    setUuid(uuid);
  };

  const handleArchive = (uuid: string) => {
    setArchiveJobOfferConfirmationOpen(true);
    setUuid(uuid);
  };

  const handleRepublish = async (uuid: string) => {
    try {
      await apiService.put(`/job-offer/${uuid}`, {
        status: 'active',
        publicationDate: new Date(),
      });
      toast.push(
        <Notification type="info">Oferta de empleo republicada</Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al republicar la oferta de empleo
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      handleCancel();
      mutate();
    }
  };

  const handleCancel = () => {
    setDeleteJobOfferConfirmationOpen(false);
    setArchiveJobOfferConfirmationOpen(false);
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
          <JobListTable
            handleDelete={handleDelete}
            handleArchive={handleArchive}
            handleRepublish={handleRepublish}
          />
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
      <ConfirmDialog
        isOpen={archiveJobOfferConfirmationOpen}
        type="danger"
        title="Archivar Oferta de Empleo"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmArchive}
      >
        <p>¿Está seguro de archivar la oferta de empleo?</p>
      </ConfirmDialog>
    </Container>
  );
};

export default JobOfferList;

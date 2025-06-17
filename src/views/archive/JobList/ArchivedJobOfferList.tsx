import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import ArchivedJobListTable from './components/ArchivedJobListTable';
import JobOfferListTableTools from './components/ArchivedJobListTableTools';
import { useState } from 'react';
import { toast } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import useJobOfferList from './hooks/useArchivedJobOfferList';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import apiService from '../../../services/apiService';


const ArchivedJobOfferList = () => {
  
  const [archiveJobOfferConfirmationOpen, setArchiveJobOfferConfirmationOpen] =
    useState(false);

  const [uuid, setUuid] = useState('');
  const { mutate } = useJobOfferList();


  const handleConfirmUnArchive = async () => {
    try {
      await apiService.put(`/job-offer/${uuid}`, { status: 'active' });
      toast.push(
        <Notification type="info">Oferta de empleo restaurada</Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          Error al restaurar la oferta de empleo
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



  const handleUnArchive = (uuid: string) => {
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
    setArchiveJobOfferConfirmationOpen(false);
    setUuid('');
  };
  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Mis Ofertas de Empleo Archivadas</h3>
          </div>
          <JobOfferListTableTools

          />
          <ArchivedJobListTable
             
            handleArchive={handleUnArchive}
          />
        </div>
      </AdaptiveCard>


      <ConfirmDialog
        isOpen={archiveJobOfferConfirmationOpen}
        type="danger"
        title="Restaurar Oferta de Empleo"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmUnArchive}
      >
        <p>¿Está seguro de restaurar la oferta de empleo archivada?</p>
      </ConfirmDialog>
    </Container>
  );
};

export default ArchivedJobOfferList;

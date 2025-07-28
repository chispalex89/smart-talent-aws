import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Container from '@/components/shared/Container';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import JobForm from './JobForm';
import { useNavigate, useParams } from 'react-router-dom';
import { TbTrash } from 'react-icons/tb';
import type { JobFormSchema } from './JobForm';
import apiService from '../../services/apiService';

interface JobCreateProps {
  isEdit?: boolean;
}

const JobCreate = ({ isEdit }: JobCreateProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultValues, setDefaultValues] = useState<JobFormSchema | null>(
    null
  );

  useEffect(() => {
    if (id) {
      // Fetch the data based on the id
      apiService.get(`/job-offer/${id}`).then((response) => {
        setDefaultValues(response as JobFormSchema);
      });
    }
  }, [id, apiService]);

  const handleFormSubmit = async (values: JobFormSchema) => {
    try {
      setIsSubmitting(true);
      values.isPublished = values.publicationDate.getTime() < Date.now();
      if (isEdit) {
        await apiService.put(`/job-offer/${values.uuid}`, values);
      } else {
        await apiService.post('/job-offer', values);
      }
      toast.push(
        <Notification type="success">
          ¡Empleo guardado exitosamente!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
      setIsSubmitting(false);
      navigate('/job/my-jobs');
    } catch (error) {
      console.error(error);
      if (
        error instanceof Error &&
        error.message.includes(
          'You have more published job offers at a time than your membership allows'
        )
      ) {
        toast.push(
          <Notification type="warning">
            ¡Empleo guardado, pero no publicado! Ya tienes el máximo de ofertas
            de empleo publicadas.
          </Notification>,
          {
            placement: 'top-center',
          }
        );
        setIsSubmitting(false);
        navigate('/job/my-jobs');
      } else {
        toast.push(
          <Notification type="danger">
            ¡Error al guardar el empleo!
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDiscard = () => {
    setDiscardConfirmationOpen(true);
    toast.push(<Notification type="info">Cambios descartados</Notification>, {
      placement: 'top-center',
    });
    navigate('/job/my-jobs');
  };

  const handleDiscard = () => {
    setDiscardConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDiscardConfirmationOpen(false);
  };

  return (
    <>
      <JobForm
        onSubmit={handleFormSubmit}
        defaultValues={defaultValues ?? undefined}
      >
        <Container>
          <div className="flex items-center justify-between px-8">
            <span></span>
            <div className="flex items-center">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                customColorClass={() =>
                  'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                }
                icon={<TbTrash />}
                onClick={handleDiscard}
              >
                Descartar
              </Button>
              <Button variant="solid" type="submit" loading={isSubmitting}>
                Guardar
              </Button>
            </div>
          </div>
        </Container>
      </JobForm>
      <ConfirmDialog
        isOpen={discardConfirmationOpen}
        type="danger"
        title="Descartar Cambios"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDiscard}
      >
        <p>¿Está seguro de descartar los cambios?</p>
      </ConfirmDialog>
    </>
  );
};

export default JobCreate;

import { useState } from 'react';
import StickyFooter from '@/components/shared/StickyFooter';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useArchivedCandidateList from '../hooks/useArchivedCandidateList';
import { TbChecks } from 'react-icons/tb';
import apiService from '../../../../services/apiService';

const ArchivedCandidateListSelected = () => {
  const {
    selectedArchivedCandidate,
    archivedCandidateList,
    mutate,
    setSelectAllArchivedCandidate,
  } = useArchivedCandidateList();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    await Promise.all(
      archivedCandidateList.map((candidate) => {
        apiService.delete(`/company-archived-applicant/${candidate.id}`);
      }),
    );
    setSelectAllArchivedCandidate([]);
    mutate();
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      {selectedArchivedCandidate.length > 0 && (
        <StickyFooter
          className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
          stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
          defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <span>
                {selectedArchivedCandidate.length > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg text-primary">
                      <TbChecks />
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <span className="heading-text">
                        {selectedArchivedCandidate.length} Candidatos Archivados
                      </span>
                      <span>seleccionados</span>
                    </span>
                  </span>
                )}
              </span>

              <div className="flex items-center">
                <Button
                  size="sm"
                  className="ltr:mr-3 rtl:ml-3"
                  type="button"
                  customColorClass={() =>
                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                  }
                  onClick={handleDelete}
                >
                  Quitar de mis candidatos archivados
                </Button>
              </div>
            </div>
          </div>
        </StickyFooter>
      )}
      <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title=""
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      >
        <p> ¿Seguro que deseas eliminar a los candidatos seleccionados de tus archivados?</p>
      </ConfirmDialog>
    </>
  );
};

export default ArchivedCandidateListSelected;

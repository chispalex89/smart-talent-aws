import { useState } from 'react';
import StickyFooter from '@/components/shared/StickyFooter';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useCandidateList from '../hooks/useCandidateList';
import { TbChecks } from 'react-icons/tb';
import apiService from '../../../../services/apiService';

const CandidateListSelected = () => {
  const {
    selectedCandidates,
    candidateList,
    mutate,
    setSelectAllCandidate,
  } = useCandidateList();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDelete = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    await Promise.all(
      candidateList.map((candidate) => {
        apiService.delete(`/company-favorite-applicant/${candidate.id}`);
      }),
    );
    setSelectAllCandidate([]);
    mutate();
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      {selectedCandidates.length > 0 && (
        <StickyFooter
          className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
          stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
          defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <span>
                {selectedCandidates.length > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg text-primary">
                      <TbChecks />
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <span className="heading-text">
                        {selectedCandidates.length} Candidatos
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
                  Quitar de mis favoritos
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
        <p> ¿Seguro que deseas eliminar a los candidatos seleccionados de tus favoritos?</p>
      </ConfirmDialog>
    </>
  );
};

export default CandidateListSelected;

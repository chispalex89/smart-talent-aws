import useJobOfferList from '../hooks/useJobOfferList';
import DebounceInput from '@/components/shared/DebounceInput';
import JobOfferSearchFilter from './JobListTableFilter';
import { TbSearch } from 'react-icons/tb';
import cloneDeep from 'lodash/cloneDeep';
import type { ChangeEvent } from 'react';

const JobOfferListTableTools = () => {
  const { tableData, setTableData } = useJobOfferList();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const newTableData = cloneDeep(tableData);
    newTableData.query = val;
    newTableData.pageIndex = 1;
    if (typeof val === 'string' && val.length > 1) {
      setTableData(newTableData);
    }

    if (typeof val === 'string' && val.length === 0) {
      setTableData(newTableData);
    }
  };

  return (
    <div className="flex flex-col md:flex-col md:items-center md:justify-between gap-2">
      <DebounceInput
        placeholder="Buscar"
        suffix={<TbSearch className="text-lg" />}
        onChange={handleInputChange}
      />
      <JobOfferSearchFilter />
    </div>
  );
};

export default JobOfferListTableTools;

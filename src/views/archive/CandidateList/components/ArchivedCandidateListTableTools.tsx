import useArchivedCandidateList from '../hooks/useArchivedCandidateList';
import ArchivedCandidateListSearch from './ArchivedCandidateListSearch';
import FavoriteCandidateTableFilter from './ArchivedCandidateListTableFilter';
import cloneDeep from 'lodash/cloneDeep';

const ArchivedCandidateListTableTools = () => {
  const { tableData, setTableData } = useArchivedCandidateList();

  const handleInputChange = (val: string) => {
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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <ArchivedCandidateListSearch onInputChange={handleInputChange} />
      <FavoriteCandidateTableFilter />
    </div>
  );
};

export default ArchivedCandidateListTableTools;

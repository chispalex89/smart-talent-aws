import useCandidateList from '../hooks/useCandidateList';
import CandidateListSearch from './CandidateListSearch';
import CandidateTableFilter from './CandidateListTableFilter';
import cloneDeep from 'lodash/cloneDeep';

const FavoriteCandidateListTableTools = () => {
  const { tableData, setTableData } = useCandidateList();

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
      <CandidateListSearch onInputChange={handleInputChange} />
      <CandidateTableFilter />
    </div>
  );
};

export default FavoriteCandidateListTableTools;

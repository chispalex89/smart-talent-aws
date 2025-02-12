import useFavoriteCandidateList from '../hooks/useFavoriteCandidateList';
import FavoriteCandidateListSearch from './FavoriteCandidateListSearch';
import FavoriteCandidateTableFilter from './FavoriteCandidateListTableFilter';
import cloneDeep from 'lodash/cloneDeep';

const FavoriteCandidateListTableTools = () => {
  const { tableData, setTableData } = useFavoriteCandidateList();

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
      <FavoriteCandidateListSearch onInputChange={handleInputChange} />
      <FavoriteCandidateTableFilter />
    </div>
  );
};

export default FavoriteCandidateListTableTools;

import Button from '@/components/ui/Button'
import { TbCloudDownload } from 'react-icons/tb'
import useCandidateList from '../hooks/useCandidateList'
import { CSVLink } from 'react-csv'

const CandidateListActionTools = () => {

    const { candidateList } = useCandidateList()

    return (
      <div className="flex flex-col md:flex-row gap-3">
        <CSVLink
          className="w-full"
          filename="favoriteCandidateList.csv"
          data={candidateList}
        >
          <Button
            icon={<TbCloudDownload className="text-xl" />}
            className="w-full"
          >
            Descargar
          </Button>
        </CSVLink>
      </div>
    );
}

export default CandidateListActionTools

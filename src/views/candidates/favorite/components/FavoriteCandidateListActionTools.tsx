import Button from '@/components/ui/Button'
import { TbCloudDownload } from 'react-icons/tb'
import useFavoriteCandidateList from '../hooks/useFavoriteCandidateList'
import { CSVLink } from 'react-csv'

const FavoriteCandidateListActionTools = () => {

    const { favoriteCandidateList } = useFavoriteCandidateList()

    return (
      <div className="flex flex-col md:flex-row gap-3">
        <CSVLink
          className="w-full"
          filename="favoriteCandidateList.csv"
          data={favoriteCandidateList}
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

export default FavoriteCandidateListActionTools

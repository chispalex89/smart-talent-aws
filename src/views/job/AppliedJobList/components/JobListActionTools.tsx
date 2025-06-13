import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
// import useJobOfferList from '../hooks/useJobOfferList'
// import { CSVLink } from 'react-csv'

const JobOfferListActionTools = () => {
    const navigate = useNavigate()

    // const { jobOfferList: orderList } = useJobOfferList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/* <CSVLink
                className="w-full"
                filename="listado_trabajos.csv"
                data={orderList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Descargar
                </Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate('/job/create')}
            >
                Crear nuevo trabajo
            </Button>
        </div>
    )
}

export default JobOfferListActionTools

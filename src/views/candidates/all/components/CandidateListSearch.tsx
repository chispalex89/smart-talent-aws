import { forwardRef } from 'react'
import DebounceInput from '@/components/shared/DebounceInput'
import { TbSearch } from 'react-icons/tb'

type CandidateListSearchProps = {
    onInputChange: (value: string) => void
}

const CandidateListSearch = forwardRef<
    HTMLInputElement,
    CandidateListSearchProps
>((props, ref) => {
    const { onInputChange } = props

    return (
        <DebounceInput
            ref={ref}
            placeholder="Buscar..."
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
})

CandidateListSearch.displayName = 'FavoriteCandidateListSearch';

export default CandidateListSearch

import { forwardRef } from 'react'
import DebounceInput from '@/components/shared/DebounceInput'
import { TbSearch } from 'react-icons/tb'

type FavoriteCandidateListSearchProps = {
    onInputChange: (value: string) => void
}

const ArchivedCandidateListSearch = forwardRef<
    HTMLInputElement,
    FavoriteCandidateListSearchProps
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

ArchivedCandidateListSearch.displayName = 'ArchivedCandidateListSearch';

export default ArchivedCandidateListSearch

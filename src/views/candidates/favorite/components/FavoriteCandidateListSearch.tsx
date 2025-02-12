import { forwardRef } from 'react'
import DebounceInput from '@/components/shared/DebounceInput'
import { TbSearch } from 'react-icons/tb'

type FavoriteCandidateListSearchProps = {
    onInputChange: (value: string) => void
}

const FavoriteCandidateListSearch = forwardRef<
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

FavoriteCandidateListSearch.displayName = 'FavoriteCandidateListSearch';

export default FavoriteCandidateListSearch

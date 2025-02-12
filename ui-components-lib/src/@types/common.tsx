import type { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sort?: {
        [key: string]: 'asc' | 'desc' | ''
    }
}

export type TranslationFn = (
    key: string,
    fallback?: string | Record<string, string | number>,
) => string

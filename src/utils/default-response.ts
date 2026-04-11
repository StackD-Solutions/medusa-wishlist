export type PagingMeta = {
	offset: number
	limit: number
	count: number
}

export type PaginatedOutput<T> = {
	data: Array<T>
	page: PagingMeta
}

export const buildPaginatedResponse = <T>(data: Array<T>, count: number, offset: number, limit: number): PaginatedOutput<T> => ({
	data,
	page: {
		offset,
		limit,
		count
	}
})

export type DeleteOutput = {
	id: string
}

export const buildDeleteResponse = (id: string): DeleteOutput => ({id})

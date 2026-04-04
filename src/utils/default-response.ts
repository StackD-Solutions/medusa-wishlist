export type PaginatedOutput<T> = {
	data: Array<T>
	count: number
	skip: number
	take: number
	totalPages: number
	currentPage: number
	nextPage: number
	prevPage: number
}

export function buildPaginatedResponse<T>(data: Array<T>, count: number, skip: number, take: number): PaginatedOutput<T> {
	const totalPages = Math.ceil(count / take)
	const currentPage = Math.floor(skip / take) + 1

	return {
		data,
		count,
		skip,
		take,
		totalPages,
		currentPage,
		nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
		prevPage: currentPage > 1 ? currentPage - 1 : currentPage
	}
}

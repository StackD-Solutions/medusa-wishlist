import {buildPaginatedResponse} from '../../../src/utils/default-response'

describe('buildPaginatedResponse', () => {
	it('should return correct pagination for first page', () => {
		const result = buildPaginatedResponse(['a', 'b'], 10, 0, 2)
		expect(result).toEqual({
			data: ['a', 'b'],
			count: 10,
			skip: 0,
			take: 2,
			totalPages: 5,
			currentPage: 1,
			nextPage: 2,
			prevPage: 1
		})
	})

	it('should return correct pagination for middle page', () => {
		const result = buildPaginatedResponse(['c', 'd'], 10, 4, 2)
		expect(result).toEqual({
			data: ['c', 'd'],
			count: 10,
			skip: 4,
			take: 2,
			totalPages: 5,
			currentPage: 3,
			nextPage: 4,
			prevPage: 2
		})
	})

	it('should return correct pagination for last page', () => {
		const result = buildPaginatedResponse(['i', 'j'], 10, 8, 2)
		expect(result).toEqual({
			data: ['i', 'j'],
			count: 10,
			skip: 8,
			take: 2,
			totalPages: 5,
			currentPage: 5,
			nextPage: 5,
			prevPage: 4
		})
	})

	it('should handle single page', () => {
		const result = buildPaginatedResponse([1, 2, 3], 3, 0, 10)
		expect(result).toEqual({
			data: [1, 2, 3],
			count: 3,
			skip: 0,
			take: 10,
			totalPages: 1,
			currentPage: 1,
			nextPage: 1,
			prevPage: 1
		})
	})

	it('should handle empty data', () => {
		const result = buildPaginatedResponse([], 0, 0, 10)
		expect(result).toEqual({
			data: [],
			count: 0,
			skip: 0,
			take: 10,
			totalPages: 0,
			currentPage: 1,
			nextPage: 1,
			prevPage: 1
		})
	})
})

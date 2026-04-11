import {buildDeleteResponse, buildPaginatedResponse} from '../../../src/utils/default-response'

describe('buildPaginatedResponse', () => {
	it('should return correct pagination for first page', () => {
		const result = buildPaginatedResponse(['a', 'b'], 10, 0, 2)
		expect(result).toEqual({
			data: ['a', 'b'],
			page: {offset: 0, limit: 2, count: 10}
		})
	})

	it('should return correct pagination for middle page', () => {
		const result = buildPaginatedResponse(['c', 'd'], 10, 4, 2)
		expect(result).toEqual({
			data: ['c', 'd'],
			page: {offset: 4, limit: 2, count: 10}
		})
	})

	it('should return correct pagination for last page', () => {
		const result = buildPaginatedResponse(['i', 'j'], 10, 8, 2)
		expect(result).toEqual({
			data: ['i', 'j'],
			page: {offset: 8, limit: 2, count: 10}
		})
	})

	it('should handle single page', () => {
		const result = buildPaginatedResponse([1, 2, 3], 3, 0, 10)
		expect(result).toEqual({
			data: [1, 2, 3],
			page: {offset: 0, limit: 10, count: 3}
		})
	})

	it('should handle empty data', () => {
		const result = buildPaginatedResponse([], 0, 0, 10)
		expect(result).toEqual({
			data: [],
			page: {offset: 0, limit: 10, count: 0}
		})
	})
})

describe('buildDeleteResponse', () => {
	it('should return the deleted id', () => {
		const result = buildDeleteResponse('wish_123')
		expect(result).toEqual({id: 'wish_123'})
	})
})

import {TotalItemsCountQuerySchema} from '../../../../../../src/api/store/wishlists/total-items-count/validators'

describe('TotalItemsCountQuerySchema', () => {
	it('should accept valid wishlist_id', () => {
		const result = TotalItemsCountQuerySchema.safeParse({wishlist_id: 'wl_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({wishlist_id: 'wl_123'})
	})

	it('should accept empty object', () => {
		const result = TotalItemsCountQuerySchema.safeParse({})
		expect(result.success).toBe(true)
	})

	it('should reject non-string wishlist_id', () => {
		const result = TotalItemsCountQuerySchema.safeParse({wishlist_id: 123})
		expect(result.success).toBe(false)
	})
})

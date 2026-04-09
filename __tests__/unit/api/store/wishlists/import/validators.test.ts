import {ImportWishlistRequestSchema} from '../../../../../../src/api/store/wishlists/import/validators'

describe('ImportWishlistRequestSchema', () => {
	it('should accept valid wishlist_id', () => {
		const result = ImportWishlistRequestSchema.safeParse({wishlist_id: 'wl_abc123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({wishlist_id: 'wl_abc123'})
	})

	it('should reject missing wishlist_id', () => {
		const result = ImportWishlistRequestSchema.safeParse({})
		expect(result.success).toBe(false)
	})

	it('should reject non-string wishlist_id', () => {
		const result = ImportWishlistRequestSchema.safeParse({wishlist_id: 123})
		expect(result.success).toBe(false)
	})
})

import {ImportWishlistRequestSchema} from '../../../../../../src/api/store/wishlists/import/validators'

describe('ImportWishlistRequestSchema', () => {
	it('should accept valid share_token', () => {
		const result = ImportWishlistRequestSchema.safeParse({share_token: 'eyJhbGciOiJIUzI1NiJ9.test'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({share_token: 'eyJhbGciOiJIUzI1NiJ9.test'})
	})

	it('should reject missing share_token', () => {
		const result = ImportWishlistRequestSchema.safeParse({})
		expect(result.success).toBe(false)
	})

	it('should reject non-string share_token', () => {
		const result = ImportWishlistRequestSchema.safeParse({share_token: 123})
		expect(result.success).toBe(false)
	})
})

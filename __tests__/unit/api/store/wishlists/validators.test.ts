import {
	CreateWishlistRequestSchema,
	UpdateWishlistRequestSchema,
	AddWishlistItemRequestSchema
} from '../../../../../src/api/store/wishlists/validators'

describe('CreateWishlistRequestSchema', () => {
	it('should accept valid data with name and sales_channel_id', () => {
		const result = CreateWishlistRequestSchema.safeParse({name: 'My List', sales_channel_id: 'sc_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({name: 'My List', sales_channel_id: 'sc_123'})
	})

	it('should accept data without optional name', () => {
		const result = CreateWishlistRequestSchema.safeParse({sales_channel_id: 'sc_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({sales_channel_id: 'sc_123'})
	})

	it('should reject missing sales_channel_id', () => {
		const result = CreateWishlistRequestSchema.safeParse({name: 'My List'})
		expect(result.success).toBe(false)
	})

	it('should reject empty object', () => {
		const result = CreateWishlistRequestSchema.safeParse({})
		expect(result.success).toBe(false)
	})

	it('should reject non-string sales_channel_id', () => {
		const result = CreateWishlistRequestSchema.safeParse({sales_channel_id: 123})
		expect(result.success).toBe(false)
	})

	it('should reject blank name', () => {
		const result = CreateWishlistRequestSchema.safeParse({name: '', sales_channel_id: 'sc_123'})
		expect(result.success).toBe(false)
	})
})

describe('UpdateWishlistRequestSchema', () => {
	it('should accept all updatable fields', () => {
		const result = UpdateWishlistRequestSchema.safeParse({name: 'Updated', visibility: 'public'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({name: 'Updated', visibility: 'public'})
	})

	it('should reject invalid visibility value', () => {
		const result = UpdateWishlistRequestSchema.safeParse({visibility: 'unlisted'})
		expect(result.success).toBe(false)
	})

	it('should accept empty object', () => {
		const result = UpdateWishlistRequestSchema.safeParse({})
		expect(result.success).toBe(true)
	})

	it('should reject blank name', () => {
		const result = UpdateWishlistRequestSchema.safeParse({name: ''})
		expect(result.success).toBe(false)
	})

	it('should strip unknown fields', () => {
		const result = UpdateWishlistRequestSchema.safeParse({name: 'Updated', sales_channel_id: 'sc_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({name: 'Updated'})
	})

	it('should accept valid private visibility', () => {
		const result = UpdateWishlistRequestSchema.safeParse({visibility: 'private'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({visibility: 'private'})
	})
})

describe('AddWishlistItemRequestSchema', () => {
	it('should accept valid product_id', () => {
		const result = AddWishlistItemRequestSchema.safeParse({product_id: 'prod_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({product_id: 'prod_123'})
	})

	it('should reject missing product_id', () => {
		const result = AddWishlistItemRequestSchema.safeParse({})
		expect(result.success).toBe(false)
	})

	it('should reject non-string product_id', () => {
		const result = AddWishlistItemRequestSchema.safeParse({product_id: 123})
		expect(result.success).toBe(false)
	})
})

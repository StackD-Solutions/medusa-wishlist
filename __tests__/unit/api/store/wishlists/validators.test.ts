import {
	CreateWishlistRequestSchema,
	UpdateWishlistRequestSchema,
	ListWishlistsQuerySchema,
	RetrieveWishlistQuerySchema,
	AddItemToWishlistRequestSchema
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
})

describe('UpdateWishlistRequestSchema', () => {
	it('should accept valid name', () => {
		const result = UpdateWishlistRequestSchema.safeParse({name: 'Updated'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({name: 'Updated'})
	})

	it('should accept empty object', () => {
		const result = UpdateWishlistRequestSchema.safeParse({})
		expect(result.success).toBe(true)
	})

	it('should strip unknown fields', () => {
		const result = UpdateWishlistRequestSchema.safeParse({name: 'Updated', sales_channel_id: 'sc_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({name: 'Updated'})
	})
})

describe('ListWishlistsQuerySchema', () => {
	it('should accept items_fields array', () => {
		const result = ListWishlistsQuerySchema.safeParse({items_fields: ['id', 'name']})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({items_fields: ['id', 'name']})
	})

	it('should accept empty object', () => {
		const result = ListWishlistsQuerySchema.safeParse({})
		expect(result.success).toBe(true)
	})

	it('should reject non-string array items', () => {
		const result = ListWishlistsQuerySchema.safeParse({items_fields: [123]})
		expect(result.success).toBe(false)
	})
})

describe('RetrieveWishlistQuerySchema', () => {
	it('should accept all optional fields', () => {
		const result = RetrieveWishlistQuerySchema.safeParse({
			items_fields: ['id'],
			include_inventory_count: true,
			include_calculated_price: false
		})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({
			items_fields: ['id'],
			include_inventory_count: true,
			include_calculated_price: false
		})
	})

	it('should accept empty object', () => {
		const result = RetrieveWishlistQuerySchema.safeParse({})
		expect(result.success).toBe(true)
	})

	it('should reject non-boolean include_inventory_count', () => {
		const result = RetrieveWishlistQuerySchema.safeParse({include_inventory_count: 'yes'})
		expect(result.success).toBe(false)
	})
})

describe('AddItemToWishlistRequestSchema', () => {
	it('should accept valid product_variant_id', () => {
		const result = AddItemToWishlistRequestSchema.safeParse({product_variant_id: 'variant_123'})
		expect(result.success).toBe(true)
		expect(result.data).toEqual({product_variant_id: 'variant_123'})
	})

	it('should reject missing product_variant_id', () => {
		const result = AddItemToWishlistRequestSchema.safeParse({})
		expect(result.success).toBe(false)
	})

	it('should reject non-string product_variant_id', () => {
		const result = AddItemToWishlistRequestSchema.safeParse({product_variant_id: 123})
		expect(result.success).toBe(false)
	})
})

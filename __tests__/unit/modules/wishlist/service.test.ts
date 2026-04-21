jest.mock('@medusajs/framework/utils', () => {
	const passthrough = (): any => passthrough
	const chainable: any = new Proxy(() => chainable, {get: () => chainable})
	return {
		MedusaService: () =>
			class {
				constructor(_container?: unknown, _options?: unknown) {}
			},
		model: new Proxy({}, {get: () => chainable}),
		Module: passthrough
	}
})

import WishlistModuleService from '../../../../src/modules/wishlist/service'

type MockKnex = {
	raw: jest.Mock
}

const createService = (opts: {options?: Record<string, unknown>; knex?: MockKnex | null} = {}): WishlistModuleService => {
	const service = new WishlistModuleService({}, opts.options ?? {})
	if (opts.knex !== null) {
		;(service as any).__container__ = {__pg_connection__: opts.knex ?? {raw: jest.fn()}}
	}
	return service
}

describe('WishlistModuleService', () => {
	describe('constructor', () => {
		it('should accept empty options and apply defaults', () => {
			const service = createService()
			expect(service.maxWishlistNameLength).toBe(40)
			expect(service.defaultPageSize).toBe(10)
		})

		it('should accept valid options', () => {
			const service = createService({options: {maxWishlistNameLength: 100, defaultPageSize: 25}})
			expect(service.maxWishlistNameLength).toBe(100)
			expect(service.defaultPageSize).toBe(25)
		})

		it('should throw on invalid option type', () => {
			expect(() => createService({options: {maxWishlistNameLength: 'not-a-number'}})).toThrow()
		})
	})

	describe('getWishlistCountsOfProduct', () => {
		it('should return parsed count from knex', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({rows: [{count: '7'}]})}
			const service = createService({knex})

			const result = await service.getWishlistCountsOfProduct('prod_1')

			expect(result).toBe(7)
			expect(knex.raw).toHaveBeenCalledWith(expect.stringContaining('FROM wishlist_item wi'), ['prod_1'])
		})

		it('should return 0 when knex returns no rows', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({rows: []})}
			const service = createService({knex})

			const result = await service.getWishlistCountsOfProduct('prod_1')

			expect(result).toBe(0)
		})

		it('should return 0 when knex is not available', async () => {
			const service = createService({knex: null})

			const result = await service.getWishlistCountsOfProduct('prod_1')

			expect(result).toBe(0)
		})
	})

	describe('getWishlistCountsOfProductVariant', () => {
		it('should return parsed count from knex', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({rows: [{count: '3'}]})}
			const service = createService({knex})

			const result = await service.getWishlistCountsOfProductVariant('variant_1')

			expect(result).toBe(3)
			expect(knex.raw).toHaveBeenCalledWith(expect.stringContaining('WHERE wi.product_variant_id'), ['variant_1'])
		})

		it('should return 0 when knex returns no rows', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({rows: []})}
			const service = createService({knex})

			const result = await service.getWishlistCountsOfProductVariant('variant_1')

			expect(result).toBe(0)
		})

		it('should return 0 when knex is not available', async () => {
			const service = createService({knex: null})

			const result = await service.getWishlistCountsOfProductVariant('variant_1')

			expect(result).toBe(0)
		})
	})

	describe('getWishlistIdsByProductVariantId', () => {
		it('should return wishlist ids from knex', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({rows: [{wishlist_id: 'wl_1'}, {wishlist_id: 'wl_2'}]})}
			const service = createService({knex})

			const result = await service.getWishlistIdsByProductVariantId('variant_1', 'cust_1')

			expect(result).toEqual(['wl_1', 'wl_2'])
			expect(knex.raw).toHaveBeenCalledWith(expect.stringContaining('w.customer_id'), ['variant_1', 'cust_1'])
		})

		it('should return empty array when knex returns no rows', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({})}
			const service = createService({knex})

			const result = await service.getWishlistIdsByProductVariantId('variant_1', 'cust_1')

			expect(result).toEqual([])
		})

		it('should return empty array when knex is not available', async () => {
			const service = createService({knex: null})

			const result = await service.getWishlistIdsByProductVariantId('variant_1', 'cust_1')

			expect(result).toEqual([])
		})
	})

	describe('getItemsCountByWishlistIds', () => {
		it('should return counts keyed by wishlist id', async () => {
			const knex = {
				raw: jest.fn().mockResolvedValue({
					rows: [
						{wishlist_id: 'wl_1', count: '2'},
						{wishlist_id: 'wl_2', count: '5'}
					]
				})
			}
			const service = createService({knex})

			const result = await service.getItemsCountByWishlistIds(['wl_1', 'wl_2'])

			expect(result).toEqual({wl_1: 2, wl_2: 5})
			expect(knex.raw).toHaveBeenCalledWith(expect.stringContaining('wishlist_id IN (?, ?)'), ['wl_1', 'wl_2'])
		})

		it('should return empty object when given no ids', async () => {
			const knex = {raw: jest.fn()}
			const service = createService({knex})

			const result = await service.getItemsCountByWishlistIds([])

			expect(result).toEqual({})
			expect(knex.raw).not.toHaveBeenCalled()
		})

		it('should return empty object when knex is not available', async () => {
			const service = createService({knex: null})

			const result = await service.getItemsCountByWishlistIds(['wl_1'])

			expect(result).toEqual({})
		})

		it('should return empty object when knex returns no rows', async () => {
			const knex = {raw: jest.fn().mockResolvedValue({})}
			const service = createService({knex})

			const result = await service.getItemsCountByWishlistIds(['wl_1'])

			expect(result).toEqual({})
		})
	})
})

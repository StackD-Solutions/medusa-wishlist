import {WISHLIST_MODULE} from '../../../../../src'
import {GET, POST} from '../../../../../src/api/store/wishlists/route'
import {createMockRequest, createMockResponse, createMockWishlistService} from '../../../helpers/mock-route'

const setup = (
	opts: {customerId?: string | null; query?: Record<string, string>; body?: Record<string, unknown>} = {}
): {
	req: any
	res: ReturnType<typeof createMockResponse>
	wishlistService: ReturnType<typeof createMockWishlistService>
} => {
	const wishlistService = createMockWishlistService()
	const res = createMockResponse()
	const req = createMockRequest({
		customerId: 'customerId' in opts ? opts.customerId : 'cust_1',
		query: opts.query,
		body: opts.body,
		services: {[WISHLIST_MODULE]: wishlistService}
	})
	return {req, res, wishlistService}
}

describe('GET /store/wishlists', () => {
	it('should return paginated wishlists with items count', async () => {
		const {req, res, wishlistService} = setup({query: {limit: '5', offset: '0'}})
		wishlistService.listAndCountWishlists.mockResolvedValue([[{id: 'wl_1', name: 'My List'}], 1])
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({wl_1: 3})

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			data: [{id: 'wl_1', name: 'My List', items_count: 3}],
			page: {offset: 0, limit: 5, count: 1}
		})
	})

	it('should default limit to 10 and offset to 0', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.listAndCountWishlists.mockResolvedValue([[], 0])

		await GET(req, res)

		expect(wishlistService.listAndCountWishlists).toHaveBeenCalledWith({customer_id: 'cust_1'}, {order: {created_at: 'DESC'}, take: 10, skip: 0})
	})

	it('should default items_count to 0 when no items', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.listAndCountWishlists.mockResolvedValue([[{id: 'wl_1', name: 'Empty'}], 1])
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({})

		await GET(req, res)

		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: [{id: 'wl_1', name: 'Empty', items_count: 0}]
			})
		)
	})

	it('should filter by name', async () => {
		const {req, res, wishlistService} = setup({query: {name: 'Favorites'}})
		wishlistService.listAndCountWishlists.mockResolvedValue([[{id: 'wl_1', name: 'Favorites'}], 1])
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({wl_1: 2})

		await GET(req, res)

		expect(wishlistService.listAndCountWishlists).toHaveBeenCalledWith(
			{customer_id: 'cust_1', name: 'Favorites'},
			expect.any(Object)
		)
	})

	it('should filter by sales_channel_id', async () => {
		const {req, res, wishlistService} = setup({query: {sales_channel_id: 'sc_1'}})
		wishlistService.listAndCountWishlists.mockResolvedValue([[], 0])

		await GET(req, res)

		expect(wishlistService.listAndCountWishlists).toHaveBeenCalledWith(
			{customer_id: 'cust_1', sales_channel_id: 'sc_1'},
			expect.any(Object)
		)
	})

	it('should filter by visibility', async () => {
		const {req, res, wishlistService} = setup({query: {visibility: 'public'}})
		wishlistService.listAndCountWishlists.mockResolvedValue([[], 0])

		await GET(req, res)

		expect(wishlistService.listAndCountWishlists).toHaveBeenCalledWith(
			{customer_id: 'cust_1', visibility: 'public'},
			expect.any(Object)
		)
	})

	it('should filter by product_variant_id', async () => {
		const {req, res, wishlistService} = setup({query: {product_variant_id: 'variant_1'}})
		wishlistService.getWishlistIdsByProductVariantId.mockResolvedValue(['wl_1', 'wl_2'])
		wishlistService.listAndCountWishlists.mockResolvedValue([[{id: 'wl_1'}, {id: 'wl_2'}], 2])
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({wl_1: 1, wl_2: 3})

		await GET(req, res)

		expect(wishlistService.getWishlistIdsByProductVariantId).toHaveBeenCalledWith('variant_1', 'cust_1')
		expect(wishlistService.listAndCountWishlists).toHaveBeenCalledWith(
			{customer_id: 'cust_1', id: ['wl_1', 'wl_2']},
			expect.any(Object)
		)
	})

	it('should return empty when product_variant_id matches no wishlists', async () => {
		const {req, res, wishlistService} = setup({query: {product_variant_id: 'variant_none'}})
		wishlistService.getWishlistIdsByProductVariantId.mockResolvedValue([])

		await GET(req, res)

		expect(wishlistService.listAndCountWishlists).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			data: [],
			page: {offset: 0, limit: 10, count: 0}
		})
	})

	it('should throw when not authenticated', async () => {
		const {req, res} = setup({customerId: null})

		await expect(GET(req, res)).rejects.toThrow('Customer authentication required')
	})
})

describe('POST /store/wishlists', () => {
	it('should create wishlist and return 201', async () => {
		const body = {name: 'New List', sales_channel_id: 'sc_1'}
		const {req, res, wishlistService} = setup({body})
		wishlistService.createWishlists.mockResolvedValue({id: 'wl_new', ...body, customer_id: 'cust_1'})

		await POST(req, res)

		expect(wishlistService.createWishlists).toHaveBeenCalledWith({...body, customer_id: 'cust_1'})
		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith({
			data: {id: 'wl_new', ...body, customer_id: 'cust_1', items_count: 0}
		})
	})

	it('should return 400 when name exceeds max length', async () => {
		const body = {name: 'A'.repeat(41), sales_channel_id: 'sc_1'}
		const {req, res, wishlistService} = setup({body})

		await POST(req, res)

		expect(wishlistService.createWishlists).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({message: 'Wishlist name must be at most 40 characters'})
	})

	it('should allow creation without a name', async () => {
		const body = {sales_channel_id: 'sc_1'}
		const {req, res, wishlistService} = setup({body})
		wishlistService.createWishlists.mockResolvedValue({id: 'wl_new', sales_channel_id: 'sc_1', customer_id: 'cust_1'})

		await POST(req, res)

		expect(res.status).toHaveBeenCalledWith(201)
	})

	it('should throw when not authenticated', async () => {
		const {req, res} = setup({customerId: null, body: {sales_channel_id: 'sc_1'}})

		await expect(POST(req, res)).rejects.toThrow('Customer authentication required')
	})
})

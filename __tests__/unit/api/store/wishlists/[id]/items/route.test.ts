import {Modules} from '@medusajs/framework/utils'
import {WISHLIST_MODULE} from '../../../../../../../src'
import {WishlistVisibility} from '../../../../../../../src/modules/wishlist/models/wishlist'
import {GET, POST} from '../../../../../../../src/api/store/wishlists/[id]/items/route'
import {
	createMockRequest,
	createMockResponse,
	createMockWishlistService,
	createMockProductService
} from '../../../../../helpers/mock-route'

const WISHLIST = {
	id: 'wl_1',
	name: 'My List',
	customer_id: 'cust_1',
	visibility: WishlistVisibility.PRIVATE
}

const setup = (opts: {
	customerId?: string | null
	params?: Record<string, string>
	query?: Record<string, string>
	body?: Record<string, unknown>
} = {}): {
	req: any
	res: ReturnType<typeof createMockResponse>
	wishlistService: ReturnType<typeof createMockWishlistService>
	productService: ReturnType<typeof createMockProductService>
} => {
	const wishlistService = createMockWishlistService()
	const productService = createMockProductService()
	const res = createMockResponse()
	const req = createMockRequest({
		customerId: 'customerId' in opts ? opts.customerId : 'cust_1',
		params: opts.params ?? {id: 'wl_1'},
		query: opts.query,
		body: opts.body,
		services: {[WISHLIST_MODULE]: wishlistService, [Modules.PRODUCT]: productService}
	})
	return {req, res, wishlistService, productService}
}

describe('GET /store/wishlists/:id/items', () => {
	it('should return paginated items for own wishlist', async () => {
		const items = [{id: 'wi_1', product_id: 'prod_1', wishlist_id: 'wl_1'}]
		const {req, res, wishlistService} = setup({query: {limit: '5', offset: '0'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.listWishlistItems.mockResolvedValue(items)
		wishlistService.listAndCountWishlistItems.mockResolvedValue([items, 1])

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			data: items,
			page: {offset: 0, limit: 5, count: 1}
		})
	})

	it('should return items for public wishlist when unauthenticated', async () => {
		const publicWishlist = {...WISHLIST, visibility: WishlistVisibility.PUBLIC, customer_id: 'other'}
		const {req, res, wishlistService} = setup({customerId: null})
		wishlistService.retrieveWishlist.mockResolvedValue(publicWishlist)
		wishlistService.listWishlistItems.mockResolvedValue([])
		wishlistService.listAndCountWishlistItems.mockResolvedValue([[], 0])

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(200)
	})

	it('should return 404 for private wishlist of another customer', async () => {
		const {req, res, wishlistService} = setup({customerId: 'other_cust'})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({message: 'Wishlist not found'})
	})

	it('should default limit to 10 and offset to 0', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.listWishlistItems.mockResolvedValue([])
		wishlistService.listAndCountWishlistItems.mockResolvedValue([[], 0])

		await GET(req, res)

		expect(wishlistService.listWishlistItems).toHaveBeenCalledWith(
			{wishlist_id: 'wl_1'},
			{take: 10, skip: 0}
		)
	})
})

describe('POST /store/wishlists/:id/items', () => {
	it('should add item and return 201', async () => {
		const item = {id: 'wi_new', product_id: 'prod_1', wishlist_id: 'wl_1'}
		const {req, res, wishlistService, productService} = setup({body: {product_id: 'prod_1'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		productService.retrieveProduct.mockResolvedValue({id: 'prod_1'})
		wishlistService.listWishlistItems.mockResolvedValue([])
		wishlistService.createWishlistItems.mockResolvedValue(item)

		await POST(req, res)

		expect(wishlistService.createWishlistItems).toHaveBeenCalledWith({product_id: 'prod_1', wishlist_id: 'wl_1'})
		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith({data: item})
	})

	it('should return 404 when wishlist belongs to another customer', async () => {
		const {req, res, wishlistService} = setup({customerId: 'other_cust', body: {product_id: 'prod_1'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await POST(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({message: 'Wishlist not found'})
	})

	it('should return 404 when product does not exist', async () => {
		const {req, res, wishlistService, productService} = setup({body: {product_id: 'prod_missing'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		productService.retrieveProduct.mockRejectedValue(new Error('Not found'))

		await POST(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({message: 'Product "prod_missing" not found'})
	})

	it('should return 409 when item already exists', async () => {
		const {req, res, wishlistService, productService} = setup({body: {product_id: 'prod_1'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		productService.retrieveProduct.mockResolvedValue({id: 'prod_1'})
		wishlistService.listWishlistItems.mockResolvedValue([{id: 'wi_existing'}])

		await POST(req, res)

		expect(res.status).toHaveBeenCalledWith(409)
		expect(res.json).toHaveBeenCalledWith({message: 'This item is already in the wishlist'})
		expect(wishlistService.createWishlistItems).not.toHaveBeenCalled()
	})

	it('should throw when not authenticated', async () => {
		const {req, res} = setup({customerId: null, body: {product_id: 'prod_1'}})

		await expect(POST(req, res)).rejects.toThrow('Customer authentication required')
	})
})

import {WISHLIST_MODULE} from '../../../../../../../src/modules/wishlist'
import {GET} from '../../../../../../../src/api/admin/products/[product_id]/wishlist/route'
import {createMockRequest, createMockResponse, createMockWishlistService} from '../../../../../helpers/mock-route'

const setup = (opts: {params?: Record<string, string>} = {}): {
	req: any
	res: ReturnType<typeof createMockResponse>
	wishlistService: ReturnType<typeof createMockWishlistService>
} => {
	const wishlistService = createMockWishlistService()
	const res = createMockResponse()
	const req = createMockRequest({
		params: opts.params ?? {product_id: 'prod_1'},
		services: {[WISHLIST_MODULE]: wishlistService}
	})
	return {req, res, wishlistService}
}

describe('GET /admin/products/:product_id/wishlist', () => {
	it('should return wishlist count for product', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.getWishlistCountsOfProduct.mockResolvedValue(7)

		await GET(req, res)

		expect(wishlistService.getWishlistCountsOfProduct).toHaveBeenCalledWith('prod_1')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({count: 7})
	})

	it('should return 0 when product has no wishlists', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.getWishlistCountsOfProduct.mockResolvedValue(0)

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({count: 0})
	})
})

import {WISHLIST_MODULE} from '../../../../../../../../src'
import {DELETE} from '../../../../../../../../src/api/store/wishlists/[id]/items/[product_id]/route'
import {createMockRequest, createMockResponse, createMockWishlistService} from '../../../../../../helpers/mock-route'

const WISHLIST = {
	id: 'wl_1',
	name: 'My List',
	customer_id: 'cust_1'
}

const setup = (opts: {
	customerId?: string | null
	params?: Record<string, string>
} = {}): {
	req: any
	res: ReturnType<typeof createMockResponse>
	wishlistService: ReturnType<typeof createMockWishlistService>
} => {
	const wishlistService = createMockWishlistService()
	const res = createMockResponse()
	const req = createMockRequest({
		customerId: 'customerId' in opts ? opts.customerId : 'cust_1',
		params: opts.params ?? {id: 'wl_1', product_id: 'prod_1'},
		services: {[WISHLIST_MODULE]: wishlistService}
	})
	return {req, res, wishlistService}
}

describe('DELETE /store/wishlists/:id/items/:product_id', () => {
	it('should remove item and return id', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.listWishlistItems.mockResolvedValue([{id: 'wi_1', product_id: 'prod_1', wishlist_id: 'wl_1'}])
		wishlistService.deleteWishlistItems.mockResolvedValue(undefined)

		await DELETE(req, res)

		expect(wishlistService.deleteWishlistItems).toHaveBeenCalledWith('wi_1')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({id: 'wi_1'})
	})

	it('should return 404 when wishlist belongs to another customer', async () => {
		const {req, res, wishlistService} = setup({customerId: 'other_cust'})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await DELETE(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({message: 'Wishlist not found'})
		expect(wishlistService.deleteWishlistItems).not.toHaveBeenCalled()
	})

	it('should return 404 when product not in wishlist', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.listWishlistItems.mockResolvedValue([])

		await DELETE(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({message: 'Product "prod_1" not found in wishlist'})
		expect(wishlistService.deleteWishlistItems).not.toHaveBeenCalled()
	})

	it('should throw when not authenticated', async () => {
		const {req, res} = setup({customerId: null})

		await expect(DELETE(req, res)).rejects.toThrow('Customer authentication required')
	})
})

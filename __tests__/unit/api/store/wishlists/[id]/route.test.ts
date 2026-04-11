import {WISHLIST_MODULE} from '../../../../../../src'
import {WishlistVisibility} from '../../../../../../src/modules/wishlist/models/wishlist'
import {GET, PUT, DELETE} from '../../../../../../src/api/store/wishlists/[id]/route'
import {createMockRequest, createMockResponse, createMockWishlistService} from '../../../../helpers/mock-route'

const WISHLIST = {
	id: 'wl_1',
	name: 'My List',
	customer_id: 'cust_1',
	sales_channel_id: 'sc_1',
	visibility: WishlistVisibility.PRIVATE
}

const setup = (opts: {
	customerId?: string | null
	params?: Record<string, string>
	body?: Record<string, unknown>
} = {}): {
	req: any
	res: ReturnType<typeof createMockResponse>
	wishlistService: ReturnType<typeof createMockWishlistService>
} => {
	const wishlistService = createMockWishlistService()
	const res = createMockResponse()
	const req = createMockRequest({
		customerId: 'customerId' in opts ? opts.customerId : 'cust_1',
		params: opts.params ?? {id: 'wl_1'},
		body: opts.body,
		services: {[WISHLIST_MODULE]: wishlistService}
	})
	return {req, res, wishlistService}
}

describe('GET /store/wishlists/:id', () => {
	it('should return wishlist with items count', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({wl_1: 5})

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({data: {...WISHLIST, items_count: 5}})
	})

	it('should return public wishlist to unauthenticated user', async () => {
		const publicWishlist = {...WISHLIST, visibility: WishlistVisibility.PUBLIC, customer_id: 'other'}
		const {req, res, wishlistService} = setup({customerId: null})
		wishlistService.retrieveWishlist.mockResolvedValue(publicWishlist)
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({wl_1: 2})

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

	it('should return 404 for private wishlist when unauthenticated', async () => {
		const {req, res, wishlistService} = setup({customerId: null})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await GET(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({message: 'Wishlist not found'})
	})

	it('should default items_count to 0', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({})

		await GET(req, res)

		expect(res.json).toHaveBeenCalledWith({data: {...WISHLIST, items_count: 0}})
	})
})

describe('PUT /store/wishlists/:id', () => {
	it('should update and return wishlist', async () => {
		const updated = {...WISHLIST, name: 'Renamed'}
		const {req, res, wishlistService} = setup({body: {name: 'Renamed'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.updateWishlists.mockResolvedValue(updated)
		wishlistService.getItemsCountByWishlistIds.mockResolvedValue({wl_1: 1})

		await PUT(req, res)

		expect(wishlistService.updateWishlists).toHaveBeenCalledWith({id: 'wl_1', name: 'Renamed'})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({data: {...updated, items_count: 1}})
	})

	it('should return 404 when wishlist belongs to another customer', async () => {
		const {req, res, wishlistService} = setup({customerId: 'other_cust', body: {name: 'X'}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await PUT(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(wishlistService.updateWishlists).not.toHaveBeenCalled()
	})

	it('should return 400 when name exceeds max length', async () => {
		const {req, res, wishlistService} = setup({body: {name: 'A'.repeat(41)}})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await PUT(req, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({message: 'Wishlist name must be at most 40 characters'})
		expect(wishlistService.updateWishlists).not.toHaveBeenCalled()
	})

	it('should throw when not authenticated', async () => {
		const {req, res} = setup({customerId: null, body: {name: 'X'}})

		await expect(PUT(req, res)).rejects.toThrow('Customer authentication required')
	})
})

describe('DELETE /store/wishlists/:id', () => {
	it('should delete wishlist and return id', async () => {
		const {req, res, wishlistService} = setup()
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)
		wishlistService.deleteWishlists.mockResolvedValue(undefined)

		await DELETE(req, res)

		expect(wishlistService.deleteWishlists).toHaveBeenCalledWith('wl_1')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({id: 'wl_1'})
	})

	it('should return 404 when wishlist belongs to another customer', async () => {
		const {req, res, wishlistService} = setup({customerId: 'other_cust'})
		wishlistService.retrieveWishlist.mockResolvedValue(WISHLIST)

		await DELETE(req, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(wishlistService.deleteWishlists).not.toHaveBeenCalled()
	})

	it('should throw when not authenticated', async () => {
		const {req, res} = setup({customerId: null})

		await expect(DELETE(req, res)).rejects.toThrow('Customer authentication required')
	})
})

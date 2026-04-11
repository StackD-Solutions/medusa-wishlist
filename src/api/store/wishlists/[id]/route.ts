import type {AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import {WishlistVisibility} from '../../../../modules/wishlist/models/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {buildDeleteResponse} from '../../../../utils/default-response'
import {getCustomerId, requireCustomerId} from '../../../../utils/utils'
import type {UpdateWishlistRequest} from '../validators'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = getCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.visibility !== WishlistVisibility.PUBLIC && wishlist.customer_id !== customerId) {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	const itemsCounts = await wishlistService.getItemsCountByWishlistIds([id])

	return res.status(200).json({data: {...wishlist, items_count: itemsCounts[id] || 0}})
}

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateWishlistRequest>, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	if (req.body.name && req.body.name.length > wishlistService.maxWishlistNameLength) {
		return res.status(400).json({message: `Wishlist name must be at most ${wishlistService.maxWishlistNameLength} characters`})
	}

	const updated = await wishlistService.updateWishlists({id, ...req.body})
	const itemsCounts = await wishlistService.getItemsCountByWishlistIds([id])

	return res.status(200).json({data: {...updated, items_count: itemsCounts[id] || 0}})
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	await wishlistService.deleteWishlists(id)
	return res.status(200).json(buildDeleteResponse(id))
}

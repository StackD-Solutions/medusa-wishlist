import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {requireCustomerId} from '../../../../utils/utils'
import type {UpdateWishlistBody} from '../validators'

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to access this wishlist'})
	}

	const items = await wishlistService.listWishlistItems({wishlist_id: id})

	return res.status(200).json({
		...wishlist,
		items,
		items_count: items.length
	})
}

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateWishlistBody>, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to update this wishlist'})
	}

	const updated = await wishlistService.updateWishlists({id, ...req.body})
	return res.status(200).json(updated)
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to delete this wishlist'})
	}

	await wishlistService.deleteWishlists(id)
	return res.status(200).json({id})
}

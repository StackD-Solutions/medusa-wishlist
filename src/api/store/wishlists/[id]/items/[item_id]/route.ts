import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../../../modules/wishlist'
import type WishlistModuleService from '../../../../../../modules/wishlist/service'
import {requireCustomerId} from '../../../../../../utils/utils'

export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
	const {id, item_id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to modify this wishlist'})
	}

	await wishlistService.deleteWishlistItems(item_id)
	return res.status(200).json({id: item_id})
}

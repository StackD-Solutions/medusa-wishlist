import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../../../modules/wishlist'
import type WishlistModuleService from '../../../../../../modules/wishlist/service'
import {buildDeleteResponse} from '../../../../../../utils/default-response'
import {requireCustomerId} from '../../../../../../utils/utils'

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id, product_variant_id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	const [item] = await wishlistService.listWishlistItems({wishlist_id: id, product_variant_id})
	if (!item) {
		return res.status(404).json({message: `Product variant "${product_variant_id}" not found in wishlist`})
	}

	await wishlistService.deleteWishlistItems(item.id)
	return res.status(200).json(buildDeleteResponse(item.id))
}

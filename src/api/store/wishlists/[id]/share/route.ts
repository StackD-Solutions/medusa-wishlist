import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../../modules/wishlist'
import type WishlistModuleService from '../../../../../modules/wishlist/service'
import {requireCustomerId} from '../../../../../utils/utils'

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to share this wishlist'})
	}

	const shareToken = await wishlistService.generateShareToken({wishlist_id: id})
	return res.status(200).json({share_token: shareToken})
}

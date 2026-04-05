import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {requireCustomerId} from '../../../../utils/utils'

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)
	const customerId = requireCustomerId(req)
	const wishlistId = req.query.wishlist_id as string | undefined

	if (wishlistId) {
		const wishlist = await wishlistService.retrieveWishlist(wishlistId)
		if (wishlist.customer_id !== customerId) {
			return res.status(403).json({message: 'Not authorized to access this wishlist'})
		}
	}

	const totalItemsCount = await wishlistService.totalItemsCount({
		customer_id: customerId,
		wishlist_id: wishlistId
	})

	return res.status(200).json({total_items_count: totalItemsCount})
}

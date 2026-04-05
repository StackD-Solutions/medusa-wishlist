import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../../modules/wishlist'
import type WishlistModuleService from '../../../../../modules/wishlist/service'
import {requireCustomerId} from '../../../../../utils/utils'

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	let wishlist
	try {
		wishlist = await wishlistService.retrieveWishlist(id)
	} catch {
		return res.status(404).json({message: 'Wishlist not found'})
	}
	if (wishlist.customer_id !== null) {
		return res.status(400).json({message: 'Wishlist is already owned by a customer'})
	}

	const updated = await wishlistService.updateWishlists({id, customer_id: customerId})
	return res.status(200).json(updated)
}

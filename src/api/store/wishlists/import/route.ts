import type {MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {getCustomerId} from '../../../../utils/utils'
import type {ImportWishlistRequest} from './validators'

export const POST = async (req: MedusaRequest<ImportWishlistRequest>, res: MedusaResponse): Promise<MedusaResponse> => {
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	let decoded: {wishlist_id: string}
	try {
		decoded = await wishlistService.validateShareToken(req.body.share_token)
	} catch {
		return res.status(400).json({message: 'Invalid or expired share token'})
	}

	let sourceWishlist
	try {
		sourceWishlist = await wishlistService.retrieveWishlist(decoded.wishlist_id)
	} catch {
		return res.status(404).json({message: 'Shared wishlist no longer exists'})
	}
	const customerId = getCustomerId(req)

	const newWishlist = await wishlistService.importWishlist({
		id: decoded.wishlist_id,
		customer_id: customerId,
		sales_channel_id: sourceWishlist.sales_channel_id
	})

	return res.status(201).json(newWishlist)
}

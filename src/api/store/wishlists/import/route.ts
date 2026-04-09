import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import {WishlistVisibility} from '../../../../modules/wishlist/models/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {requireCustomerId} from '../../../../utils/utils'
import type {ImportWishlistRequest} from './validators'

export const POST = async (req: AuthenticatedMedusaRequest<ImportWishlistRequest>, res: MedusaResponse): Promise<MedusaResponse> => {
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	let sourceWishlist
	try {
		sourceWishlist = await wishlistService.retrieveWishlist(req.body.wishlist_id)
	} catch {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	if (sourceWishlist.visibility !== WishlistVisibility.PUBLIC) {
		return res.status(403).json({message: 'Not authorized to import this wishlist'})
	}

	const newWishlist = await wishlistService.importWishlist({
		id: req.body.wishlist_id,
		customer_id: customerId,
		sales_channel_id: sourceWishlist.sales_channel_id
	})

	return res.status(201).json(newWishlist)
}

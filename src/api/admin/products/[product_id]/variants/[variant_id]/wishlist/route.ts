import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../../../../modules/wishlist'
import type WishlistModuleService from '../../../../../../../modules/wishlist/service'

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {variant_id} = req.params
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const count = await wishlistService.getWishlistCountsOfProductVariant(variant_id)
	return res.status(200).json({count})
}

import type {MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {ImportWishlistRequestSchema} from './validators'
import {getCustomerId} from '../../../../utils/utils'

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const parsed = ImportWishlistRequestSchema.safeParse(req.body)
	if (!parsed.success) {
		return res.status(400).json({message: 'Invalid request body', errors: parsed.error.issues})
	}

	let decoded: {wishlist_id: string}
	try {
		decoded = await wishlistService.validateShareToken(parsed.data.share_token)
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

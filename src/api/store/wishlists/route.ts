import type {AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../modules/wishlist'
import type WishlistModuleService from '../../../modules/wishlist/service'
import {buildPaginatedResponse} from '../../../utils/default-response'
import {getCustomerId, requireCustomerId} from '../../../utils/utils'
import type {CreateWishlistBody} from './validators'

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const limit = parseInt(req.query.limit as string) || 10
	const offset = parseInt(req.query.offset as string) || 0

	const wishlists = await wishlistService.listWishlists({customer_id: customerId}, {take: limit, skip: offset, order: {created_at: 'DESC'}})

	const [, count] = await wishlistService.listAndCountWishlists({customer_id: customerId})

	for (const wl of wishlists) {
		const [items, itemsCount] = await wishlistService.listAndCountWishlistItems(
			{wishlist_id: wl.id},
			...(wishlistService.includeWishlistItems ? [{take: wishlistService.includeWishlistItemsTake}] : [])
		)
		if (wishlistService.includeWishlistItems) {
			;(wl as Record<string, any>).items = items
		}
		;(wl as Record<string, any>).items_count = itemsCount
	}

	return res.status(200).json(buildPaginatedResponse(wishlists, count, offset, limit))
}

export const POST = async (req: MedusaRequest<CreateWishlistBody>, res: MedusaResponse): Promise<MedusaResponse> => {
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)
	const customerId = getCustomerId(req)

	if (!customerId && !wishlistService.allowGuestWishlist) {
		return res.status(401).json({message: 'Authentication required'})
	}

	const wishlist = await wishlistService.createWishlists({
		...req.body,
		customer_id: customerId
	})

	return res.status(201).json(wishlist)
}

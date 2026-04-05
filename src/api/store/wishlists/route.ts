import type {AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../modules/wishlist'
import type WishlistModuleService from '../../../modules/wishlist/service'
import {CreateWishlistRequestSchema} from './validators'
import {buildPaginatedResponse} from '../../../utils/default-response'
import {getCustomerId, requireCustomerId} from '../../../utils/utils'

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
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

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)
	const customerId = getCustomerId(req)

	if (!customerId && !wishlistService.allowGuestWishlist) {
		return res.status(401).json({message: 'Authentication required'})
	}

	const parsed = CreateWishlistRequestSchema.safeParse(req.body)
	if (!parsed.success) {
		return res.status(400).json({message: 'Invalid request body', errors: parsed.error.issues})
	}

	const wishlist = await wishlistService.createWishlists({
		...parsed.data,
		customer_id: customerId
	})

	return res.status(201).json(wishlist)
}

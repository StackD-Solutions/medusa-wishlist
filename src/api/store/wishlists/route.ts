import type {AuthenticatedMedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../modules/wishlist'
import type WishlistModuleService from '../../../modules/wishlist/service'
import {buildPaginatedResponse} from '../../../utils/default-response'
import {requireCustomerId} from '../../../utils/utils'
import type {CreateWishlistRequest} from './validators'

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const limit = parseInt(req.query.limit as string) || wishlistService.defaultPageSize
	const offset = parseInt(req.query.offset as string) || 0

	const filters: Record<string, unknown> = {customer_id: customerId}

	if (req.query.name) {
		filters.name = req.query.name
	}
	if (req.query.sales_channel_id) {
		filters.sales_channel_id = req.query.sales_channel_id
	}
	if (req.query.visibility) {
		filters.visibility = req.query.visibility
	}
	if (req.query.product_variant_id) {
		const wishlistIds = await wishlistService.getWishlistIdsByProductVariantId(
			req.query.product_variant_id as string,
			customerId
		)
		if (wishlistIds.length === 0) {
			return res.status(200).json(buildPaginatedResponse([], 0, offset, limit))
		}
		filters.id = wishlistIds
	}

	const [wishlists, totalCount] = await wishlistService.listAndCountWishlists(
		filters,
		{order: {created_at: 'DESC'}, take: limit, skip: offset}
	)

	const itemsCounts = await wishlistService.getItemsCountByWishlistIds(wishlists.map(w => w.id))

	return res.status(200).json(
		buildPaginatedResponse(
			wishlists.map(wistlist => ({...wistlist, items_count: itemsCounts[wistlist.id] || 0})),
			totalCount,
			offset,
			limit
		)
	)
}

export const POST = async (req: AuthenticatedMedusaRequest<CreateWishlistRequest>, res: MedusaResponse): Promise<MedusaResponse> => {
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	if (req.body.name && req.body.name.length > wishlistService.maxWishlistNameLength) {
		return res.status(400).json({message: `Wishlist name must be at most ${wishlistService.maxWishlistNameLength} characters`})
	}

	const wishlist = await wishlistService.createWishlists({
		...req.body,
		customer_id: customerId
	})

	return res.status(201).json({data: {...wishlist, items_count: 0}})
}

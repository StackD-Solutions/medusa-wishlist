import type {AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {Modules} from '@medusajs/framework/utils'
import type {IProductModuleService} from '@medusajs/framework/types'
import {WISHLIST_MODULE} from '../../../../../modules/wishlist'
import {WishlistVisibility} from '../../../../../modules/wishlist/models/wishlist'
import type WishlistModuleService from '../../../../../modules/wishlist/service'
import {buildPaginatedResponse} from '../../../../../utils/default-response'
import {getCustomerId, requireCustomerId} from '../../../../../utils/utils'
import type {AddWishlistItemRequest} from '../../validators'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = getCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.visibility !== WishlistVisibility.PUBLIC && wishlist.customer_id !== customerId) {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	const limit = parseInt(req.query.limit as string) || wishlistService.defaultPageSize
	const offset = parseInt(req.query.offset as string) || 0

	const filters: Record<string, unknown> = {wishlist_id: id}

	if (req.query.product_variant_id) {
		filters.product_variant_id = req.query.product_variant_id
	}

	const items = await wishlistService.listWishlistItems(filters, {take: limit, skip: offset})

	const [, count] = await wishlistService.listAndCountWishlistItems(filters)

	return res.status(200).json(buildPaginatedResponse(items, count, offset, limit))
}

export const POST = async (req: AuthenticatedMedusaRequest<AddWishlistItemRequest>, res: MedusaResponse): Promise<MedusaResponse> => {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(404).json({message: 'Wishlist not found'})
	}

	const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
	try {
		await productService.retrieveProductVariant(req.body.product_variant_id)
	} catch {
		return res.status(404).json({message: `Product variant "${req.body.product_variant_id}" not found`})
	}

	const [existing] = await wishlistService.listWishlistItems({
		wishlist_id: id,
		product_variant_id: req.body.product_variant_id
	})
	if (existing) {
		return res.status(409).json({message: 'This item is already in the wishlist'})
	}

	const item = await wishlistService.createWishlistItems({
		product_variant_id: req.body.product_variant_id,
		wishlist_id: id
	})

	return res.status(201).json({data: item})
}

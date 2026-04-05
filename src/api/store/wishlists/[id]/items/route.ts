import type {AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {Modules} from '@medusajs/framework/utils'
import type {IProductModuleService} from '@medusajs/framework/types'
import {WISHLIST_MODULE} from '../../../../../modules/wishlist'
import type WishlistModuleService from '../../../../../modules/wishlist/service'
import {buildPaginatedResponse} from '../../../../../utils/default-response'
import {getCustomerId, requireCustomerId} from '../../../../../utils/utils'
import {AddItemToWishlistRequestSchema} from '../../validators'

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to access this wishlist'})
	}

	const limit = parseInt(req.query.limit as string) || 10
	const offset = parseInt(req.query.offset as string) || 0

	const items = await wishlistService.listWishlistItems({wishlist_id: id}, {take: limit, skip: offset})

	const [, count] = await wishlistService.listAndCountWishlistItems({wishlist_id: id})

	return res.status(200).json(buildPaginatedResponse(items, count, offset, limit))
}

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<MedusaResponse> {
	const {id} = req.params
	const customerId = getCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to modify this wishlist'})
	}

	const parsed = AddItemToWishlistRequestSchema.safeParse(req.body)
	if (!parsed.success) {
		return res.status(400).json({message: 'Invalid request body', errors: parsed.error.issues})
	}

	const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
	try {
		await productService.retrieveProductVariant(parsed.data.product_variant_id)
	} catch {
		return res.status(404).json({message: `Product variant "${parsed.data.product_variant_id}" not found`})
	}

	const [existing] = await wishlistService.listWishlistItems({
		wishlist_id: id,
		product_variant_id: parsed.data.product_variant_id
	})
	if (existing) {
		return res.status(409).json({message: 'This item is already in the wishlist'})
	}

	const item = await wishlistService.createWishlistItems({
		product_variant_id: parsed.data.product_variant_id,
		wishlist_id: id
	})

	return res.status(201).json(item)
}

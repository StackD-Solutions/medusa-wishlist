import type {AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse} from '@medusajs/framework/http'
import {WISHLIST_MODULE} from '../../../../modules/wishlist'
import type WishlistModuleService from '../../../../modules/wishlist/service'
import {UpdateWishlistRequestSchema} from '../validators'
import {requireCustomerId} from '../../../../utils/utils'

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to access this wishlist'})
	}

	const items = await wishlistService.listWishlistItems({wishlist_id: id})

	return res.status(200).json({
		...wishlist,
		items,
		items_count: items.length
	})
}

export async function PUT(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to update this wishlist'})
	}

	const parsed = UpdateWishlistRequestSchema.safeParse(req.body)
	if (!parsed.success) {
		return res.status(400).json({message: 'Invalid request body', errors: parsed.error.issues})
	}

	const updated = await wishlistService.updateWishlists({id, ...parsed.data})
	return res.status(200).json(updated)
}

export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
	const {id} = req.params
	const customerId = requireCustomerId(req)
	const wishlistService: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

	const wishlist = await wishlistService.retrieveWishlist(id)
	if (wishlist.customer_id !== customerId) {
		return res.status(403).json({message: 'Not authorized to delete this wishlist'})
	}

	await wishlistService.deleteWishlists(id)
	return res.status(200).json({id})
}

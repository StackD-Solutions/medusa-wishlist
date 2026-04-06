import {defineMiddlewares, authenticate, validateAndTransformBody} from '@medusajs/framework/http'
import {CreateWishlistRequestSchema, UpdateWishlistRequestSchema, AddItemToWishlistRequestSchema} from './store/wishlists/validators'
import {ImportWishlistRequestSchema} from './store/wishlists/import/validators'

const customerAuth = authenticate('customer', ['session', 'bearer'])

export default defineMiddlewares({
	routes: [
		{matcher: '/store/wishlists', method: 'POST', middlewares: [customerAuth, validateAndTransformBody(CreateWishlistRequestSchema)]},
		{matcher: '/store/wishlists/:id/items', method: 'POST', middlewares: [customerAuth, validateAndTransformBody(AddItemToWishlistRequestSchema)]},
		{matcher: '/store/wishlists', method: 'GET', middlewares: [customerAuth]},
		{matcher: '/store/wishlists/:id', method: 'PUT', middlewares: [customerAuth, validateAndTransformBody(UpdateWishlistRequestSchema)]},
		{matcher: '/store/wishlists/:id', method: ['GET', 'DELETE'], middlewares: [customerAuth]},
		{matcher: '/store/wishlists/:id/items', method: 'GET', middlewares: [customerAuth]},
		{matcher: '/store/wishlists/:id/items/:item_id', method: 'DELETE', middlewares: [customerAuth]},
		{matcher: '/store/wishlists/:id/transfer', method: 'POST', middlewares: [customerAuth]},
		{matcher: '/store/wishlists/:id/share', method: 'POST', middlewares: [customerAuth]},
		{matcher: '/store/wishlists/import', method: 'POST', middlewares: [customerAuth, validateAndTransformBody(ImportWishlistRequestSchema)]},
		{matcher: '/store/wishlists/total-items-count', method: 'GET', middlewares: [customerAuth]},
		// Admin
		{matcher: '/admin/products/:id/wishlist', method: 'GET', middlewares: [authenticate('user', ['session', 'bearer'])]}
	]
})

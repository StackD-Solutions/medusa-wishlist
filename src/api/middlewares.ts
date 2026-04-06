import {defineMiddlewares, authenticate, validateAndTransformBody} from '@medusajs/framework/http'
import {CreateWishlistRequestSchema, UpdateWishlistRequestSchema, AddItemToWishlistRequestSchema} from './store/wishlists/validators'
import {ImportWishlistRequestSchema} from './store/wishlists/import/validators'

const customerAuth = authenticate('customer', ['session', 'bearer'])
const guestAuth = authenticate('customer', ['session', 'bearer'], {allowUnregistered: true})

export default defineMiddlewares({
	routes: [
		// Guest-allowed routes (create wishlist, add items)
		{matcher: '/store/wishlists', method: 'POST', middlewares: [guestAuth, validateAndTransformBody(CreateWishlistRequestSchema)]},
		{matcher: '/store/wishlists/:id/items', method: 'POST', middlewares: [guestAuth, validateAndTransformBody(AddItemToWishlistRequestSchema)]},
		// Authenticated customer routes
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

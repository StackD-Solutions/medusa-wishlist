import {defineMiddlewares, authenticate, validateAndTransformBody} from '@medusajs/framework/http'
import {CreateWishlistRequestSchema, UpdateWishlistRequestSchema, AddWishlistItemRequestSchema} from './store/wishlists/validators'

const customerAuth = authenticate('customer', ['session', 'bearer'])
const optionalCustomerAuth = authenticate('customer', ['session', 'bearer'], {allowUnauthenticated: true})

export default defineMiddlewares({
	routes: [
		{matcher: '/store/wishlists', method: 'GET', middlewares: [customerAuth]},
		{matcher: '/store/wishlists', method: 'POST', middlewares: [customerAuth, validateAndTransformBody(CreateWishlistRequestSchema)]},
		{matcher: '/store/wishlists/:id', method: 'GET', middlewares: [optionalCustomerAuth]},
		{matcher: '/store/wishlists/:id', method: 'PUT', middlewares: [customerAuth, validateAndTransformBody(UpdateWishlistRequestSchema)]},
		{matcher: '/store/wishlists/:id', method: 'DELETE', middlewares: [customerAuth]},
		{matcher: '/store/wishlists/:id/items', method: 'GET', middlewares: [optionalCustomerAuth]},
		{matcher: '/store/wishlists/:id/items', method: 'POST', middlewares: [customerAuth, validateAndTransformBody(AddWishlistItemRequestSchema)]},
		{matcher: '/store/wishlists/:id/items/:product_id', method: 'DELETE', middlewares: [customerAuth]},
		// Admin
		{matcher: '/admin/products/:product_id/wishlist', method: 'GET', middlewares: [authenticate('user', ['session', 'bearer'])]}
	]
})

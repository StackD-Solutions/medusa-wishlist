import type {InferTypeOf} from '@medusajs/framework/types'
import {MedusaService} from '@medusajs/framework/utils'
import jwt from 'jsonwebtoken'
import {z} from 'zod'
import Wishlist from './models/wishlist'
import WishlistItem from './models/wishlist-item'

type WishlistType = InferTypeOf<typeof Wishlist>

const PluginOptionsSchema = z.object({
	wishlistFields: z.array(z.string()).optional(),
	wishlistItemsFields: z.array(z.string()).optional(),
	includeWishlistItems: z.boolean().default(false),
	includeWishlistItemsTake: z.number().default(5),
	allowGuestWishlist: z.boolean().default(false),
	shareTokenSecret: z.string().min(1),
	shareTokenExpiryDays: z.number().default(7)
})

export type WishlistPluginOptions = z.infer<typeof PluginOptionsSchema>

class WishlistModuleService extends MedusaService({Wishlist, WishlistItem}) {
	private readonly pluginOptions_: WishlistPluginOptions

	constructor(container: Record<string, unknown>, options: Record<string, unknown>) {
		super(container, options)
		this.pluginOptions_ = this.validateOptions(options)
	}

	private validateOptions(options: Record<string, unknown>): WishlistPluginOptions {
		return PluginOptionsSchema.parse(options)
	}

	get allowGuestWishlist(): boolean {
		return this.pluginOptions_.allowGuestWishlist
	}

	get includeWishlistItems(): boolean {
		return this.pluginOptions_.includeWishlistItems
	}

	get includeWishlistItemsTake(): number {
		return this.pluginOptions_.includeWishlistItemsTake
	}

	async getWishlistCountsOfProduct(productId: string): Promise<number> {
		const knex = (this as Record<string, any>).__container__?.['__pg_connection__']
		if (!knex) {
			return 0
		}

		const result = await knex.raw(
			`SELECT COUNT(DISTINCT wi.wishlist_id) as count
			 FROM wishlist_item wi
			 INNER JOIN wishlist w ON wi.wishlist_id = w.id AND w.deleted_at IS NULL
			 INNER JOIN product_variant pv ON wi.product_variant_id = pv.id
			 WHERE pv.product_id = ? AND wi.deleted_at IS NULL`,
			[productId]
		)

		return parseInt(result.rows?.[0]?.count || '0', 10)
	}

	async totalItemsCount(args: {customer_id?: string; wishlist_id?: string}): Promise<number> {
		const {customer_id, wishlist_id} = args
		const knex = (this as Record<string, any>).__container__?.resolve('__pg_connection__')
		if (!knex) {
			return 0
		}

		if (wishlist_id) {
			const result = await knex.raw(
				`SELECT COUNT(*) as count
				 FROM wishlist_item wi
				 WHERE wi.wishlist_id = ? AND wi.deleted_at IS NULL`,
				[wishlist_id]
			)
			return parseInt(result.rows?.[0]?.count || '0', 10)
		}

		if (customer_id) {
			const result = await knex.raw(
				`SELECT COUNT(*) as count
				 FROM wishlist_item wi
				 INNER JOIN wishlist w ON wi.wishlist_id = w.id AND w.deleted_at IS NULL
				 WHERE w.customer_id = ? AND wi.deleted_at IS NULL`,
				[customer_id]
			)
			return parseInt(result.rows?.[0]?.count || '0', 10)
		}

		return 0
	}

	async generateShareToken(args: {wishlist_id: string}): Promise<string> {
		return jwt.sign({wishlist_id: args.wishlist_id}, this.pluginOptions_.shareTokenSecret, {expiresIn: `${this.pluginOptions_.shareTokenExpiryDays}d`})
	}

	async validateShareToken(shareToken: string): Promise<{wishlist_id: string}> {
		const decoded = jwt.verify(shareToken, this.pluginOptions_.shareTokenSecret) as {wishlist_id: string}
		return {wishlist_id: decoded.wishlist_id}
	}

	async importWishlist(args: {id: string; customer_id: string | null; sales_channel_id: string}): Promise<WishlistType> {
		const sourceItems = await this.listWishlistItems({wishlist_id: args.id})
		const sourceWishlist = await this.retrieveWishlist(args.id)

		const newWishlist = await this.createWishlists({
			name: sourceWishlist.name,
			customer_id: args.customer_id,
			sales_channel_id: args.sales_channel_id
		})

		for (const item of sourceItems) {
			await this.createWishlistItems({
				product_variant_id: item.product_variant_id,
				wishlist_id: newWishlist.id
			})
		}

		return newWishlist
	}
}

export default WishlistModuleService

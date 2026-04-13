import {MedusaService} from '@medusajs/framework/utils'
import {z} from 'zod'
import Wishlist from './models/wishlist'
import WishlistItem from './models/wishlist-item'

const PluginOptionsSchema = z.object({
	maxWishlistNameLength: z.number().default(40),
	defaultPageSize: z.number().default(10)
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

	get maxWishlistNameLength(): number {
		return this.pluginOptions_.maxWishlistNameLength
	}

	get defaultPageSize(): number {
		return this.pluginOptions_.defaultPageSize
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

	async getWishlistCountsOfProductVariant(productVariantId: string): Promise<number> {
		const knex = (this as Record<string, any>).__container__?.['__pg_connection__']
		if (!knex) {
			return 0
		}

		const result = await knex.raw(
			`SELECT COUNT(DISTINCT wi.wishlist_id) as count
			 FROM wishlist_item wi
			 INNER JOIN wishlist w ON wi.wishlist_id = w.id AND w.deleted_at IS NULL
			 WHERE wi.product_variant_id = ? AND wi.deleted_at IS NULL`,
			[productVariantId]
		)

		return parseInt(result.rows?.[0]?.count || '0', 10)
	}

	async getWishlistIdsByProductVariantId(productVariantId: string, customerId: string): Promise<Array<string>> {
		const knex = (this as Record<string, any>).__container__?.['__pg_connection__']
		if (!knex) {
			return []
		}

		const result = await knex.raw(
			`SELECT DISTINCT wi.wishlist_id
			 FROM wishlist_item wi
			 INNER JOIN wishlist w ON wi.wishlist_id = w.id AND w.deleted_at IS NULL
			 WHERE wi.product_variant_id = ? AND wi.deleted_at IS NULL AND w.customer_id = ?`,
			[productVariantId, customerId]
		)

		return (result.rows || []).map((row: Record<string, string>) => row.wishlist_id)
	}

	async getItemsCountByWishlistIds(wishlistIds: Array<string>): Promise<Record<string, number>> {
		if (wishlistIds.length === 0) {
			return {}
		}

		const knex = (this as Record<string, any>).__container__?.['__pg_connection__']
		if (!knex) {
			return {}
		}

		const placeholders = wishlistIds.map(() => '?').join(', ')
		const result = await knex.raw(
			`SELECT wishlist_id, COUNT(*) as count
			 FROM wishlist_item
			 WHERE wishlist_id IN (${placeholders}) AND deleted_at IS NULL
			 GROUP BY wishlist_id`,
			wishlistIds
		)

		const counts: Record<string, number> = {}
		for (const row of result.rows || []) {
			counts[row.wishlist_id] = parseInt(row.count, 10)
		}
		return counts
	}
}

export default WishlistModuleService

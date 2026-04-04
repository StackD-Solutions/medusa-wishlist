import type {ProductVariantDTO, ProductDTO, PriceDTO} from '@medusajs/framework/types'

export type Wishlist = {
	id: string
	name: string | null
	customer_id: string | null
	sales_channel_id: string
	created_at: Date | string
	updated_at: Date | string
	deleted_at: Date | string | null
	items: Array<WishlistItem>
	items_count: number
}

export type WishlistItem = {
	id: string
	product_variant_id: string
	wishlist_id: string
	created_at: string
	updated_at: string
	deleted_at: string | null
	product_variant:
		| (Omit<ProductVariantDTO, 'product'> & {
				product: Pick<ProductDTO, 'id' | 'thumbnail'>
				prices: Array<PriceDTO>
		  })
		| null
}

export type {PaginatedOutput} from '../../../utils/default-response'

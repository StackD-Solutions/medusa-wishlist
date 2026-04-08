import {z} from 'zod'

export const WishlistItem = z.object({
	id: z.string(),
	product_id: z.string(),
	wishlist_id: z.string(),
	created_at: z.string().datetime({offset: true}),
	updated_at: z.string().datetime({offset: true}),
	deleted_at: z.string().datetime({offset: true}).nullish(),
	product: z.object({}).partial().nullish()
})
export type WishlistItem = z.infer<typeof WishlistItem>
export const Wishlist = z.object({
	id: z.string(),
	name: z.string().nullish(),
	customer_id: z.string().nullish(),
	sales_channel_id: z.string(),
	created_at: z.string().datetime({offset: true}),
	updated_at: z.string().datetime({offset: true}),
	deleted_at: z.string().datetime({offset: true}).nullish(),
	items: z.array(WishlistItem).optional(),
	items_count: z.number().int().optional()
})
export type Wishlist = z.infer<typeof Wishlist>
export const PaginatedWishlistResponse = z.object({
	data: z.array(Wishlist),
	count: z.number().int(),
	skip: z.number().int(),
	take: z.number().int(),
	totalPages: z.number().int(),
	currentPage: z.number().int(),
	nextPage: z.number().int(),
	prevPage: z.number().int()
})
export type PaginatedWishlistResponse = z.infer<typeof PaginatedWishlistResponse>
export const Error = z.object({message: z.string(), code: z.string().optional()})
export type Error = z.infer<typeof Error>
export const CreateWishlistRequest = z.object({name: z.string().min(1).optional(), sales_channel_id: z.string()})
export type CreateWishlistRequest = z.infer<typeof CreateWishlistRequest>
export const UpdateWishlistRequest = z.object({name: z.string().min(1)}).partial()
export type UpdateWishlistRequest = z.infer<typeof UpdateWishlistRequest>
export const DeleteResponse = z.object({id: z.string()})
export type DeleteResponse = z.infer<typeof DeleteResponse>
export const PaginatedWishlistItemResponse = z.object({
	data: z.array(WishlistItem),
	count: z.number().int(),
	skip: z.number().int(),
	take: z.number().int(),
	totalPages: z.number().int(),
	currentPage: z.number().int(),
	nextPage: z.number().int(),
	prevPage: z.number().int()
})
export type PaginatedWishlistItemResponse = z.infer<typeof PaginatedWishlistItemResponse>
export const AddItemToWishlistRequest = z.object({product_id: z.string()})
export type AddItemToWishlistRequest = z.infer<typeof AddItemToWishlistRequest>
export const ShareTokenResponse = z.object({share_token: z.string()})
export type ShareTokenResponse = z.infer<typeof ShareTokenResponse>
export const ImportWishlistRequest = z.object({share_token: z.string()})
export type ImportWishlistRequest = z.infer<typeof ImportWishlistRequest>
export const TotalItemsCountResponse = z.object({total_items_count: z.number().int()})
export type TotalItemsCountResponse = z.infer<typeof TotalItemsCountResponse>
export const ListWishlistsQuery = z.object({items_fields: z.array(z.string())}).partial()
export type ListWishlistsQuery = z.infer<typeof ListWishlistsQuery>
export const RetrieveWishlistQuery = z
	.object({items_fields: z.array(z.string()), include_inventory_count: z.boolean(), include_calculated_price: z.boolean()})
	.partial()
export type RetrieveWishlistQuery = z.infer<typeof RetrieveWishlistQuery>
export const TotalItemsCountQuery = z.object({wishlist_id: z.string()}).partial()
export type TotalItemsCountQuery = z.infer<typeof TotalItemsCountQuery>

import {z} from 'zod'

export const WishlistVisibility = z.enum(['private', 'public'])
export type WishlistVisibility = z.infer<typeof WishlistVisibility>
export const Wishlist = z.object({
	id: z.string(),
	name: z.string(),
	customer_id: z.string(),
	sales_channel_id: z.string(),
	visibility: WishlistVisibility.default('private'),
	items_count: z.number().int(),
	created_at: z.string().datetime({offset: true}),
	updated_at: z.string().datetime({offset: true}),
	deleted_at: z.string().datetime({offset: true}).nullish()
})
export type Wishlist = z.infer<typeof Wishlist>
export const PaginationMetadata = z.object({offset: z.number().int(), limit: z.number().int(), count: z.number().int()})
export type PaginationMetadata = z.infer<typeof PaginationMetadata>
export const WishlistListResponse = z.object({data: z.array(Wishlist), page: PaginationMetadata})
export type WishlistListResponse = z.infer<typeof WishlistListResponse>
export const Error = z.object({message: z.string(), code: z.string().optional()})
export type Error = z.infer<typeof Error>
export const CreateWishlistRequest = z.object({name: z.string().min(1).optional(), sales_channel_id: z.string()})
export type CreateWishlistRequest = z.infer<typeof CreateWishlistRequest>
export const WishlistResponse = z.object({data: Wishlist})
export type WishlistResponse = z.infer<typeof WishlistResponse>
export const UpdateWishlistRequest = z.object({name: z.string().min(1), visibility: WishlistVisibility.default('private')}).partial()
export type UpdateWishlistRequest = z.infer<typeof UpdateWishlistRequest>
export const DeleteResponse = z.object({id: z.string()})
export type DeleteResponse = z.infer<typeof DeleteResponse>
export const WishlistItem = z.object({
	id: z.string(),
	product_id: z.string(),
	wishlist_id: z.string(),
	created_at: z.string().datetime({offset: true}),
	updated_at: z.string().datetime({offset: true}),
	deleted_at: z.string().datetime({offset: true}).nullish()
})
export type WishlistItem = z.infer<typeof WishlistItem>
export const WishlistItemsResponse = z.object({data: z.array(WishlistItem), page: PaginationMetadata})
export type WishlistItemsResponse = z.infer<typeof WishlistItemsResponse>
export const AddWishlistItemRequest = z.object({product_id: z.string()})
export type AddWishlistItemRequest = z.infer<typeof AddWishlistItemRequest>
export const WishlistItemResponse = z.object({data: WishlistItem})
export type WishlistItemResponse = z.infer<typeof WishlistItemResponse>
export const ProductWishlistCountResponse = z.object({count: z.number().int()})
export type ProductWishlistCountResponse = z.infer<typeof ProductWishlistCountResponse>

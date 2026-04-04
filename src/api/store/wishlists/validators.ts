import {z} from 'zod'

export const CreateWishlistRequestSchema = z.object({
	name: z.string().optional(),
	sales_channel_id: z.string()
})

export type CreateWishlistRequest = z.infer<typeof CreateWishlistRequestSchema>

export const UpdateWishlistRequestSchema = CreateWishlistRequestSchema.pick({name: true})

export type UpdateWishlistRequest = z.infer<typeof UpdateWishlistRequestSchema>

export const ListWishlistsQuerySchema = z.object({
	items_fields: z.array(z.string()).optional()
})

export type ListWishlistsQuery = z.infer<typeof ListWishlistsQuerySchema>

export const RetrieveWishlistQuerySchema = z.object({
	items_fields: z.array(z.string()).optional(),
	include_inventory_count: z.boolean().optional(),
	include_calculated_price: z.boolean().optional()
})

export type RetrieveWishlistQuery = z.infer<typeof RetrieveWishlistQuerySchema>

export const AddItemToWishlistRequestSchema = z.object({
	product_variant_id: z.string()
})

export type AddItemToWishlistRequest = z.infer<typeof AddItemToWishlistRequestSchema>

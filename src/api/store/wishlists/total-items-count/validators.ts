import {z} from 'zod'

export const TotalItemsCountQuerySchema = z.object({
	wishlist_id: z.string().optional()
})

export type TotalItemsCountQuery = z.infer<typeof TotalItemsCountQuerySchema>

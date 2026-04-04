import {z} from 'zod'

export const ImportWishlistRequestSchema = z.object({
	share_token: z.string()
})

export type ImportWishlistRequest = z.infer<typeof ImportWishlistRequestSchema>

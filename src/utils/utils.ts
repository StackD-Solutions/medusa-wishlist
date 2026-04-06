import type {MedusaRequest} from '@medusajs/framework/http'

export const getCustomerId = (req: MedusaRequest): string | null => {
	return (req as Record<string, any>).auth_context?.actor_id ?? null
}

export const requireCustomerId = (req: MedusaRequest): string => {
	const customerId = getCustomerId(req)
	if (!customerId) {
		throw new Error('Customer authentication required')
	}
	return customerId
}

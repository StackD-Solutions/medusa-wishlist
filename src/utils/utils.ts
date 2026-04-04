import type {MedusaRequest} from '@medusajs/framework/http'

export function getCustomerId(req: MedusaRequest): string | null {
	return (req as Record<string, any>).auth_context?.actor_id ?? null
}

export function requireCustomerId(req: MedusaRequest): string {
	const customerId = getCustomerId(req)
	if (!customerId) {
		throw new Error('Customer authentication required')
	}
	return customerId
}


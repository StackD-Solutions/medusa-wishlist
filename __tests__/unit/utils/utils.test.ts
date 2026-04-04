import type {MedusaRequest} from '@medusajs/framework/http'
import {getCustomerId, requireCustomerId} from '../../../src/utils/utils'

const mockRequest = (actorId?: string | null) =>
	({auth_context: actorId !== undefined ? {actor_id: actorId} : undefined}) as unknown as MedusaRequest

describe('getCustomerId', () => {
	it('should return customer id when authenticated', () => {
		expect(getCustomerId(mockRequest('cust_123'))).toBe('cust_123')
	})

	it('should return null when actor_id is null', () => {
		expect(getCustomerId(mockRequest(null))).toBeNull()
	})

	it('should return null when auth_context is missing', () => {
		expect(getCustomerId(mockRequest(undefined))).toBeNull()
	})

	it('should return null when auth_context has no actor_id', () => {
		expect(getCustomerId({auth_context: {}} as unknown as MedusaRequest)).toBeNull()
	})
})

describe('requireCustomerId', () => {
	it('should return customer id when authenticated', () => {
		expect(requireCustomerId(mockRequest('cust_456'))).toBe('cust_456')
	})

	it('should throw error when not authenticated', () => {
		expect(() => requireCustomerId(mockRequest(null))).toThrow('Customer authentication required')
	})

	it('should throw error when auth_context is missing', () => {
		expect(() => requireCustomerId(mockRequest(undefined))).toThrow('Customer authentication required')
	})
})

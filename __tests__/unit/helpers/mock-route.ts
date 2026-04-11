type MockJson = jest.Mock
type MockStatus = jest.Mock

export type MockResponse = {
	status: MockStatus
	json: MockJson
}

export type MockWishlistService = {
	maxWishlistNameLength: number
	defaultPageSize: number
	retrieveWishlist: jest.Mock
	listAndCountWishlists: jest.Mock
	createWishlists: jest.Mock
	updateWishlists: jest.Mock
	deleteWishlists: jest.Mock
	listWishlistItems: jest.Mock
	listAndCountWishlistItems: jest.Mock
	createWishlistItems: jest.Mock
	deleteWishlistItems: jest.Mock
	getItemsCountByWishlistIds: jest.Mock
	getWishlistCountsOfProduct: jest.Mock
	getWishlistCountsOfProductVariant: jest.Mock
}

export type MockProductService = {
	retrieveProductVariant: jest.Mock
}

export const createMockResponse = (): MockResponse => {
	const json = jest.fn()
	const status = jest.fn().mockReturnValue({json})
	return {status, json}
}

export const createMockWishlistService = (overrides?: Partial<MockWishlistService>): MockWishlistService => ({
	maxWishlistNameLength: 40,
	defaultPageSize: 10,
	retrieveWishlist: jest.fn(),
	listAndCountWishlists: jest.fn(),
	createWishlists: jest.fn(),
	updateWishlists: jest.fn(),
	deleteWishlists: jest.fn(),
	listWishlistItems: jest.fn(),
	listAndCountWishlistItems: jest.fn(),
	createWishlistItems: jest.fn(),
	deleteWishlistItems: jest.fn(),
	getItemsCountByWishlistIds: jest.fn().mockResolvedValue({}),
	getWishlistCountsOfProduct: jest.fn(),
	getWishlistCountsOfProductVariant: jest.fn(),
	...overrides
})

export const createMockProductService = (): MockProductService => ({
	retrieveProductVariant: jest.fn()
})

export const createMockRequest = (opts: {
	params?: Record<string, string>
	query?: Record<string, string>
	body?: Record<string, unknown>
	customerId?: string | null
	services?: Record<string, unknown>
}): Record<string, unknown> => {
	const serviceMap: Record<string, unknown> = opts.services || {}

	return {
		params: opts.params || {},
		query: opts.query || {},
		body: opts.body || {},
		auth_context: opts.customerId ? {actor_id: opts.customerId} : undefined,
		scope: {
			resolve: (key: string): unknown => serviceMap[key]
		}
	}
}

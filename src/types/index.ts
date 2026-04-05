import type {components, operations} from '../generated/openapi'

export type Wishlist = components['schemas']['Wishlist']
export type WishlistItem = components['schemas']['WishlistItem']
export type PaginatedWishlistResponse = components['schemas']['PaginatedWishlistResponse']
export type PaginatedWishlistItemResponse = components['schemas']['PaginatedWishlistItemResponse']
export type CreateWishlistRequest = components['schemas']['CreateWishlistRequest']
export type UpdateWishlistRequest = components['schemas']['UpdateWishlistRequest']
export type AddItemToWishlistRequest = components['schemas']['AddItemToWishlistRequest']
export type ImportWishlistRequest = components['schemas']['ImportWishlistRequest']
export type ShareTokenResponse = components['schemas']['ShareTokenResponse']
export type DeleteResponse = components['schemas']['DeleteResponse']
export type TotalItemsCountResponse = components['schemas']['TotalItemsCountResponse']

export type ListWishlistsQuery = NonNullable<operations['listWishlists']['parameters']['query']>
export type RetrieveWishlistQuery = NonNullable<operations['retrieveWishlist']['parameters']['query']>
export type ListItemsQuery = NonNullable<operations['listWishlistItems']['parameters']['query']>
export type TotalItemsCountQuery = NonNullable<operations['getTotalItemsCount']['parameters']['query']>

export type {WishlistPluginOptions} from '../modules/wishlist/service'

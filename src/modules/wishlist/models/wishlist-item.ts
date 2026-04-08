import {model} from '@medusajs/framework/utils'
import Wishlist from './wishlist'

const WishlistItem = model
	.define('wishlist_item', {
		id: model.id({prefix: 'wli'}).primaryKey(),
		product_id: model.text(),
		wishlist: model.belongsTo(() => Wishlist, {mappedBy: 'items'})
	})
	.indexes([
		{
			on: ['product_id', 'wishlist_id'],
			unique: true,
			where: 'deleted_at IS NULL'
		}
	])

export default WishlistItem

import {model} from '@medusajs/framework/utils'
import WishlistItem from './wishlist-item'

const Wishlist = model
	.define('wishlist', {
		id: model.id({prefix: 'wl'}).primaryKey(),
		name: model.text().nullable(),
		customer_id: model.text().nullable(),
		sales_channel_id: model.text(),
		items: model.hasMany(() => WishlistItem)
	})
	.cascades({
		delete: ['items']
	})
	.indexes([
		{
			on: ['customer_id', 'sales_channel_id'],
			where: 'customer_id IS NOT NULL AND deleted_at IS NULL'
		}
	])

export default Wishlist

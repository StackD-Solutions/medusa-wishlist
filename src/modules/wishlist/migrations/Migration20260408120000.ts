import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260408120000 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`alter table if exists "wishlist_item" drop constraint if exists "wishlist_item_wishlist_id_foreign";`)
		this.addSql(
			`alter table "wishlist_item" add constraint "wishlist_item_wishlist_id_foreign" foreign key ("wishlist_id") references "wishlist" ("id") on update cascade on delete cascade;`
		)
	}

	override async down(): Promise<void> {
		this.addSql(`alter table if exists "wishlist_item" drop constraint if exists "wishlist_item_wishlist_id_foreign";`)
		this.addSql(
			`alter table "wishlist_item" add constraint "wishlist_item_wishlist_id_foreign" foreign key ("wishlist_id") references "wishlist" ("id") on update cascade;`
		)
	}
}

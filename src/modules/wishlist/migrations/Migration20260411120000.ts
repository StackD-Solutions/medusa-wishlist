import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260411120000 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`ALTER TABLE IF EXISTS "wishlist_item" RENAME COLUMN "product_id" TO "product_variant_id";`)
		this.addSql(`DROP INDEX IF EXISTS "IDX_wishlist_item_product_id_wishlist_id_unique";`)
		this.addSql(
			`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wishlist_item_product_variant_id_wishlist_id_unique" ON "wishlist_item" ("product_variant_id", "wishlist_id") WHERE deleted_at IS NULL;`
		)
	}

	override async down(): Promise<void> {
		this.addSql(`ALTER TABLE IF EXISTS "wishlist_item" RENAME COLUMN "product_variant_id" TO "product_id";`)
		this.addSql(`DROP INDEX IF EXISTS "IDX_wishlist_item_product_variant_id_wishlist_id_unique";`)
		this.addSql(
			`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wishlist_item_product_id_wishlist_id_unique" ON "wishlist_item" ("product_id", "wishlist_id") WHERE deleted_at IS NULL;`
		)
	}
}

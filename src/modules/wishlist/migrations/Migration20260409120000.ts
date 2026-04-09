import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260409120000 extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`alter table if exists "wishlist" add column if not exists "visibility" text check ("visibility" in ('private', 'public')) not null default 'private';`
		)
	}

	override async down(): Promise<void> {
		this.addSql(`alter table if exists "wishlist" drop column if exists "visibility";`)
	}
}

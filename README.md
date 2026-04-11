<!--suppress HtmlDeprecatedAttribute -->
<h1 align="center">
  <br>
  <a href="https://www.stackd-solutions.io"><img src="https://raw.githubusercontent.com/StackD-Solutions/medusa-wishlist/main/docs/logo.svg" alt="StackD Solutions" width="250"></a>
  <br>Medusa Wishlist Plugin
  <br>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@stackd-solutions/medusa-wishlist"><img src="https://img.shields.io/npm/v/@stackd-solutions/medusa-wishlist" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@stackd-solutions/medusa-wishlist"><img src="https://img.shields.io/npm/dm/@stackd-solutions/medusa-wishlist" alt="npm downloads"></a>
  <img src="https://img.shields.io/npm/l/@stackd-solutions/medusa-wishlist" alt="Apache License">
  <img src="https://img.shields.io/npm/types/@stackd-solutions/medusa-wishlist" alt="Types Included">
</p>

A [Medusa v2](https://medusajs.com/) plugin that adds wishlist functionality for customers. Customers can create, manage, and share wishlists of product variants. Supports public/private visibility and an admin widget showing wishlist counts per product.

## Features

- Create, update, and delete wishlists
- Add and remove product variants from wishlists
- Multiple wishlists per customer
- Public/private wishlist visibility
- Admin widget showing wishlist count per product
- Pagination on all list endpoints

## Installation

```bash
yarn add @stackd-solutions/medusa-wishlist
```

## Configuration

Register the plugin and its module in your `medusa-config.ts`:

```typescript
import {defineConfig} from '@medusajs/framework/utils'

export default defineConfig({
	// ... other config
	plugins: [
		{
			resolve: '@stackd-solutions/medusa-wishlist',
			options: {}
		}
	],
	modules: [
		{
			resolve: '@stackd-solutions/medusa-wishlist/modules/wishlist',
			options: {}
		}
	]
})
```

After adding the plugin, run migrations:

```bash
npx medusa db:migrate
```

### Plugin Options

| Option                  | Type     | Default | Description                                   |
| ----------------------- | -------- | ------- | --------------------------------------------- |
| `maxWishlistNameLength` | `number` | `40`    | Maximum characters allowed for wishlist names |
| `defaultPageSize`       | `number` | `10`    | Default number of items per page              |

## API Endpoints

| Method | Endpoint                                                    | Scope | Auth | Description                              |
| ------ |-------------------------------------------------------------| ----- | ---- |------------------------------------------|
| GET    | `/store/wishlists`                                          | Store | ✅   | List wishlists for the current customer  |
| POST   | `/store/wishlists`                                          | Store | ✅   | Create a new wishlist                    |
| GET    | `/store/wishlists/:id`                                      | Store | ⚠️   | Retrieve a wishlist by ID                |
| PUT    | `/store/wishlists/:id`                                      | Store | ✅   | Update wishlist metadata and visibility  |
| DELETE | `/store/wishlists/:id`                                      | Store | ✅   | Delete a wishlist                        |
| GET    | `/store/wishlists/:id/items`                                | Store | ⚠️   | Get items in a wishlist                  |
| POST   | `/store/wishlists/:id/items`                                | Store | ✅   | Add an item to the wishlist              |
| DELETE | `/store/wishlists/:id/items/:product_variant_id`            | Store | ✅   | Remove an item from the wishlist         |
| GET    | `/admin/products/:product_id/wishlist`                      | Admin | ✅   | Get wishlist count for a product         |
| GET    | `/admin/products/:product_id/variants/:variant_id/wishlist` | Admin | ✅   | Get wishlist count for a product variant |

✅ = Requires authentication. ⚠️ = Public wishlists can be accessed without authentication.

## Admin Widget

The plugin adds a widget to the **product detail page** in the Medusa Admin dashboard. It displays how many wishlists contain the product.

## Build

```bash
yarn build
```

## Development

```bash
yarn dev
```

## Types

```typescript
import type {
	Wishlist,
	WishlistItem,
	WishlistVisibility,
	WishlistListResponse,
	WishlistResponse,
	WishlistItemsResponse,
	WishlistItemResponse,
	DeleteResponse,
	PaginationMetadata,
	CreateWishlistRequest,
	UpdateWishlistRequest,
	AddWishlistItemRequest,
	ProductWishlistCountResponse,
	WishlistPluginOptions
} from '@stackd-solutions/medusa-wishlist'
```

The module key is also exported:

```typescript
import {WISHLIST_MODULE} from '@stackd-solutions/medusa-wishlist'
```

## License

Apache 2.0

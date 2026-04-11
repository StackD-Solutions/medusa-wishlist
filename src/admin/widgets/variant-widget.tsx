import {useEffect, useState} from 'react'
import {defineWidgetConfig} from '@medusajs/admin-sdk'
import {Container, Heading} from '@medusajs/ui'

const WishlistVariantWidget = ({data}: {data: {id: string; product_id: string}}) => {
	const [count, setCount] = useState<number | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		fetch(`/admin/products/${data.product_id}/variants/${data.id}/wishlist`, {
			credentials: 'include'
		})
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`)
				}
				return res.json()
			})
			.then(json => setCount(json.count))
			.catch(() => setError(true))
			.finally(() => setLoading(false))
	}, [data.id, data.product_id])

	const renderContent = () => {
		if (loading) {
			return <span className='text-ui-fg-muted text-sm'>Loading...</span>
		}
		if (error) {
			return <span className='text-ui-fg-error text-sm'>Failed to load wishlist data</span>
		}
		return <span className='text-ui-fg-muted text-sm'>This variant is in {count ?? 0} wishlist(s)</span>
	}

	return (
		<Container className='divide-y p-0'>
			<div className='flex items-center justify-between px-6 py-4'>
				<Heading level='h2'>Wishlists</Heading>
				{renderContent()}
			</div>
		</Container>
	)
}

export const config = defineWidgetConfig({
	zone: 'product_variant.details.before'
})

export default WishlistVariantWidget

'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchProperty } from '@/utils/requests'

const PropertyPage = () => {
	// Get id from url
	const { id } = useParams()

	// States
	const [property, setProperty] = useState(null)
	const [loading, setLoading] = useState(true)

	// Use effect to get property
	useEffect(() => {
		const fetchPropertyData = async () => {
			if (!id) return

			try {
				const property = await fetchProperty(id)
				setProperty(property)
			} catch (error) {
				console.error('Error fetching property:' + id, error)
			} finally {
				setLoading(false)
			}
		}

		// call if property is null
		if (property === null) {
			fetchPropertyData()
		}
	}, [id, property])

	return <div>PropertyPage</div>
}

export default PropertyPage

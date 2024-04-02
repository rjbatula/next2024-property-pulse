'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const SearchResultsPage = () => {
	const searchParams = useSearchParams()

	const [properties, setProperties] = useState([])
	const [loading, setLoading] = useState(true)

	// Get params
	const location = searchParams.get('location')
	const propertyType = searchParams.get('propertyType')

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				const res = await fetch(
					`/api/properties/search?location=${location}&propertyType=${propertyType}`
				)

				// Check status
				if (res.status === 200) {
					const data = await res.json()
					setProperties(data)
				} else {
					setProperties([])
				}
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		fetchSearchResults()
	}, [location, propertyType])

	return <div>SearchResultsPage</div>
}

export default SearchResultsPage

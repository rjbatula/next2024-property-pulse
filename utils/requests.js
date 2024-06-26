const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null

// Fetch all properties
async function fetchProperties({ showFeatured = false } = {}) {
	try {
		//Handle case if domain is not available
		if (!apiDomain) {
			return []
		}

		const res = await fetch(
			`${apiDomain}/properties${showFeatured ? '/featured' : ''}`,
			{ cache: 'no-store' }
		)

		if (!res.ok) {
			throw new Error('Failed to fetch data')
		}

		return res.json()
	} catch (error) {
		console.log(error)
		return []
	}
}

// Fetch single property
async function fetchProperty(id) {
	try {
		//Handle case if domain is not available
		if (!apiDomain) {
			return null
		}

		const res = await fetch(`${apiDomain}/properties/${id}`, {
			cache: 'no-store',
		})

		if (!res.ok) {
			throw new Error('Failed to fetch data')
		}

		return res.json()
	} catch (error) {
		console.log(error)
		return null
	}
}

export { fetchProperties, fetchProperty }

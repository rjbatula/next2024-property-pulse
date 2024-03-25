const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null

async function fetchProperties() {
	try {
		//Handle case if domain is not available
		if (!apiDomain) {
			return []
		}

		const res = await fetch(`${apiDomain}/properties`, { cache: 'no-store' })

		if (!res.ok) {
			throw new Error('Failed to fetch data')
		}

		return res.json()
	} catch (error) {
		console.log(error)
		return []
	}
}

export { fetchProperties }

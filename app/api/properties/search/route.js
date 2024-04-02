import connectDB from '@/config/database'
import Property from '@/models/Property'

// GET /api/properties/search
export const GET = async (request) => {
	try {
		await connectDB()

		// Get search params
		const { searchParams } = new URL(request.url)
		const location = searchParams.get('location')
		const propertyType = searchParams.get('propertyType')

		const locationPattern = new RegExp(location, 'i')

		// Build query string by matching locationPattern against db fields
		let query = {
			$or: [
				{ name: locationPattern },
				{ description: locationPattern },
				{ 'location.street': locationPattern },
				{ 'location.city': locationPattern },
				{ 'location.state': locationPattern },
				{ 'location.zipcode': locationPattern },
			],
		}

		// Check for property type if its not 'All'
		if (propertyType && propertyType !== 'All') {
			const typePattern = new RegExp(propertyType, 'i')
			query.type = typePattern
		}

		// Get Properties
		const properties = await Property.find(query)

		return new Response(JSON.stringify(properties), { status: 200 })
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

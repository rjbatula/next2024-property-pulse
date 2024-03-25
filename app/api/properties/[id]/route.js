import connectDB from '@/config/database'
import Property from '@/models/Property'

//GET /api/properties/:id
export const GET = async (request, { params }) => {
	try {
		//Connect to DB
		await connectDB()

		//Fetch all properties in the DB
		const property = await Property.findById(params.id)

		// If no properties were found
		if (!property) {
			return new Response('Property not found',  { status: 404 })
		}

		//Return all properties
		return new Response(JSON.stringify(property), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

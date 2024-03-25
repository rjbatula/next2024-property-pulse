import connectDB from '@/config/database'
import Property from '@/models/Property'

//GET /api/properties
export const GET = async (request) => {
	try {
		//Connect to DB
		await connectDB()

		//Fetch all properties in the DB
		const properties = await Property.find({})

		//Return all properties
		return new Response(JSON.stringify(properties), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

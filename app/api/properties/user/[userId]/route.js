import connectDB from '@/config/database'
import Property from '@/models/Property'

// GET /api/properties/user/:userId
export const GET = async (request, { params }) => {
	try {
		//Connect to DB
		await connectDB()

		// Get userId
		const userId = params.userId

		if (!userId) {
			return new Response('UserId is required', { status: 400 })
		}

		//Fetch all properties in the DB
		const properties = await Property.find({ owner: userId })

		//Return all properties
		return new Response(JSON.stringify(properties), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

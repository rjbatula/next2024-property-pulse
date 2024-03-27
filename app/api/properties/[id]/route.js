import connectDB from '@/config/database'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'

//GET /api/properties/:id
export const GET = async (request, { params }) => {
	try {
		//Connect to DB
		await connectDB()

		//Fetch all properties in the DB
		const property = await Property.findById(params.id)

		// If no properties were found
		if (!property) {
			return new Response('Property not found', { status: 404 })
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

//DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
	try {
		const propertyId = params.id

		const sessionUser = await getSessionUser()
		console.log(sessionUser)

		// Check for session user
		if (!sessionUser || !sessionUser.userId) {
			return new Response('User ID is required', { status: 401 })
		}

		const { userId } = sessionUser

		//Connect to DB
		await connectDB()

		//Fetch all properties in the DB
		const property = await Property.findById(propertyId)

		// If no properties were found
		if (!property) {
			return new Response('Property not found', { status: 404 })
		}

		// Verify ownership for delete
		if (property.owner.toString() !== userId) {
			return new Response('Unauthorised', { status: 401 })
		}

		// If owner matches userId
		await property.deleteOne()

		//Return all properties
		return new Response('Property Deleted', {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

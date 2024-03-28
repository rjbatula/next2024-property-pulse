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

// PUT /api/properties/:id
export const PUT = async (request, { params }) => {
	try {
		// connect to DB
		await connectDB()

		// Get id from session
		const sessionUser = await getSessionUser()

		if (!sessionUser || !sessionUser.userId) {
			return new Response('User ID is required', { status: 401 })
		}

		const { id } = params
		const { userId } = sessionUser

		const formData = await request.formData()

		// Handle all values from amenities
		const amenities = formData.getAll('amenities')

		// Get property to update
		const existingProperty = await Property.findById(id)

		// Check if it exists
		if (!existingProperty) {
			return new Response('Property does not exist', { status: 404 })
		}

		//Verify ownership
		if (existingProperty.owner.toString() !== userId) {
			return new Response('Unauthorised', { status: 401 })
		}

		// Build the property data object for DB
		const propertyData = {
			type: formData.get('type'),
			name: formData.get('name'),
			description: formData.get('description'),
			location: {
				street: formData.get('location.street'),
				city: formData.get('location.city'),
				state: formData.get('location.state'),
				zipcode: formData.get('location.zipcode'),
			},
			beds: formData.get('beds'),
			baths: formData.get('baths'),
			square_feet: formData.get('square_feet'),
			amenities,
			rates: {
				weekly: formData.get('rates.weekly'),
				monthly: formData.get('rates.monthly'),
				nightly: formData.get('rates.nightly'),
			},
			seller_info: {
				name: formData.get('seller_info.name'),
				email: formData.get('seller_info.email'),
				phone: formData.get('seller_info.phone'),
			},
			owner: userId,
		}

		// Update property in DB
		const updatedProperty = await Property.findByIdAndUpdate(id, propertyData)

		return new Response(JSON.stringify(updatedProperty), { status: 200 })
	} catch (error) {
		console.log(error)
		return new Response(JSON.stringify('Failed to add property'), {
			status: 500,
		})
	}
}

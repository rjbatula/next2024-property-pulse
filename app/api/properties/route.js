import connectDB from '@/config/database'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'
import cloudinary from '@/config/cloudinary'

// GET /api/properties
export const GET = async (request) => {
	try {
		//Connect to DB
		await connectDB()

		// For pagination
		const page = request.nextUrl.searchParams.get('page') || 1
		const pageSize = request.nextUrl.searchParams.get('pageSize') || 6

		const skip = (page - 1) * pageSize

		const total = await Property.countDocuments({})

		//Fetch all properties in the DB
		const properties = await Property.find({}).skip(skip).limit(pageSize)

		const result = {
			total,
			properties,
		}

		//Return all properties
		return new Response(JSON.stringify(result), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

// POST /api/properties
export const POST = async (request) => {
	try {
		// connect to DB
		await connectDB()

		// Get id from session
		const sessionUser = await getSessionUser()

		if (!sessionUser || !sessionUser.userId) {
			return new Response('User ID is required', { status: 401 })
		}

		const { userId } = sessionUser

		const formData = await request.formData()

		// Handle all values from amenities and images
		const amenities = formData.getAll('amenities')
		const images = formData
			.getAll('images')
			.filter((image) => image.name !== '')

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

		// Upload images to cloudinary
		const imageUploadPromises = []

		for (const image of images) {
			const imageBuffer = await image.arrayBuffer()
			const imageArray = Array.from(new Uint8Array(imageBuffer))
			const imageData = Buffer.from(imageArray)

			// Convert image data to base64
			const imageBase64 = imageData.toString('base64')

			// Make req to upload to cloudinary
			const result = await cloudinary.uploader.upload(
				`data:image/png;base64,${imageBase64}`,
				{
					folder: 'propertypulse',
				}
			)

			// Push to array
			imageUploadPromises.push(result.secure_url)

			//Wait for all images to upload
			const uploadedImages = await Promise.all(imageUploadPromises)

			// Add uploaded images to propertyData object
			propertyData.images = uploadedImages
		}

		// Save to DB
		const newProperty = new Property(propertyData)
		await newProperty.save()

		// Redirect to the created property details page
		return Response.redirect(
			`${process.env.NEXT_AUTH_URL}/properties/${newProperty._id}`
		)

		// return new Response(JSON.stringify({ message: 'Success' }), { status: 200 })
	} catch (error) {
		console.log(error)
		return new Response(JSON.stringify('Failed to add property'), {
			status: 500,
		})
	}
}

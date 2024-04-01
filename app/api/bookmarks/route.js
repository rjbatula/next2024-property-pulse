import connectDB from '@/config/database'
import User from '@/models/User'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'

export const dynamic = 'force-dynamic'

export const POST = async (request) => {
	try {
		await connectDB()

		// Get Property Id
		const { propertyId } = await request.json()

		// Get User Id
		const sessionUser = await getSessionUser()

		// Check session
		if (!session || !session.userId) {
			return new Response('User ID is required', { status: 401 })
		}

		const { userId } = sessionUser

		// Find User in DB
		const user = await User.findOne({ _id: userId })

		// Check if property is bookmarked
		let isBookmarked = user.bookmarks.includes(propertyId)

		// Create a variable message
		let message

		// If already bookmaked, then remove
		if (isBookmarked) {
			user.bookmarks.pull(propertyId)
			message = 'Bookmark removed successfully'
			isBookmarked = false
		} else {
			user.bookmarks.push(propertyId)
			message = 'Bookmark added successfully'
			isBookmarked = true
		}

		// Save to DB
		await user.save()

		return new Response(JSON.stringify({ message, isBookmarked }), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

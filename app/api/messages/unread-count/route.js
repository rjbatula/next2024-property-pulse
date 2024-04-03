import connectDB from '@/config/database'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export const dynamic = 'force-dynamic'

// GET /api/messages/unread-count
export const GET = async (request) => {
	try {
		await connectDB()

		// Get Session User
		const sessionUser = await getSessionUser()

		// Check session
		if (!sessionUser || !sessionUser.user) {
			return new Response('User ID is required', {
				status: 401,
			})
		}

		// Get User
		const { userId } = sessionUser

		const unreadMessageCount = await Message.countDocuments({
			recipient: userId,
			read: false,
		})

		return new Response(JSON.stringify({ count: unreadMessageCount }), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

import connectDB from '@/config/database'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export const dynamic = 'force-dynamic'

// PUT /api/messages/:id
export const PUT = async (request, { params }) => {
	try {
		await connectDB()

		// Get Params id
		const { id } = params

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

		const message = await Message.findById(id)

		if (!message) {
			return new Response('Message not found', { status: 404 })
		}

		// Verfiy ownership
		if (message.recipient.toString() !== userId) {
			return new Response('Unauthorised', { status: 401 })
		}

		// Set message.read to toggle opposite value
		message.read = !message.read

		//Save
		await message.save()
		return new Response(JSON.stringify(message), { status: 200 })
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}

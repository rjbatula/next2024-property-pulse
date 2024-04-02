import connectDB from '@/config/database'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export const dynamic = 'force-dynamic'

// POST /api/messages
export const POST = async (request) => {
	try {
		await connectDB()

		// Get data from contact form
		const { name, email, phone, message, property, recipient } =
			await request.json()

		// Get Session User
		const sessionUser = await getSessionUser()

		// Check session
		if (!sessionUser || !sessionUser.user) {
			return new Response(
				JSON.stringify({ message: 'You must be logged in to send a message' }),
				{
					status: 401,
				}
			)
		}

		// Get User
		const { user } = sessionUser

		// Prevent sending message to self
		if (user.id === recipient) {
			return new Response(
				JSON.stringify({ message: 'Unable to send message to self' }),
				{ status: 400 }
			)
		}

		// Create new message
		const newMessage = new Message({
			sender: user.id,
			recipient,
			property,
			name,
			email,
			phone,
			body: message,
		})

		await newMessage.save()

		return new Response(JSON.stringify({ message: 'Message Sent' }), {
			status: 200,
		})
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', {
			status: 500,
		})
	}
}

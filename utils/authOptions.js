import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	callbacks: {
		// Invoked on successful sign in
		async asignIn({ profile }) {
			//1. Connect to DB
			//2. Check if user exist
			//3. If not, add user to DB
			//4. return true to allow sign in
		},
		// Modifiy the session obj
		async session({ session }) {
			//1. Get user from DB
			//2. Assign user id to session
			//3. return session
		},
	},
}

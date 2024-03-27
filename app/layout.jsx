import '@/assets/styles/globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
	title: 'Property Pulse | Find The Perfect Rental',
	description: 'Find your dream rental property',
	keywords: 'rental, find rentals, find properties',
}

const MainLayout = ({ children }) => {
	return (
		<AuthProvider>
			<html lang='en'>
				<body>
					<Navbar />
					<main> {children} </main>
					<Footer />
					<ToastContainer />
				</body>
			</html>
		</AuthProvider>
	)
}

export default MainLayout

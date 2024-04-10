import '@/assets/styles/globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GlobalProvider } from '@/context/GlobalContext'
import 'photoswipe/dist/photoswipe.css'

export const metadata = {
	title: 'Property Pulse | Find The Perfect Rental',
	description: 'Find your dream rental property',
	keywords: 'rental, find rentals, find properties',
}

const MainLayout = ({ children }) => {
	return (
		<GlobalProvider>
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
		</GlobalProvider>
	)
}

export default MainLayout

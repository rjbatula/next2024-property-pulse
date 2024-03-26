import '@/assets/styles/globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'

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
				</body>
			</html>
		</AuthProvider>
	)
}

export default MainLayout

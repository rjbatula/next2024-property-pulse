'use client'
import { createContext, useContext, useState } from 'react'

// Create a new context
const GlobalContext = createContext()

// Create a provider
export function GlobalProvider({ children }) {
	const [unreadCount, setUnreadCount] = useState(0)
	return (
		<GlobalContext.Provider
			value={{
				unreadCount,
				setUnreadCount,
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}

//Export custom hook to access context
export function useGlobalContext() {
	return useContext(GlobalContext)
}

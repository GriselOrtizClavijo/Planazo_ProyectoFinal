import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'
import { SessionContext } from 'contexts/Session'
import SidebarProvider from 'contexts/Sidebar'

export const AdminRoutes = () => {
	const { state } = useContext(SessionContext)
	return state.user?.role === 'ADMIN' ? (
		<SidebarProvider>
			<Outlet />
		</SidebarProvider>
	) : (
		<Navigate to="/login" />
	)
}

export const UserRoutes = () => {
	const { state } = useContext(SessionContext)
	return state.isLogged && state.user?.role === 'USER' ? <Outlet /> : <Navigate to="/login" />
}

import { FC, ReactNode, createContext, useReducer } from 'react'

export interface ISession {
	firstName: string | null
	lastName: string | null
	email: string | null
	role: string | null
	token: string | null
}

interface ISessionState {
	isLogged: boolean
	user: ISession | null
}

interface ISessionActions {
	type: any
	payload?: any
}

const handleDispatch = (state: ISessionState, { type, payload }: ISessionActions): any => {
	switch (type) {
		case 'LOGIN':
			localStorage.setItem('token', payload.token)
			localStorage.setItem('firstName', payload.firstName)
			localStorage.setItem('lastName', payload.lastName)
			localStorage.setItem('email', payload.email)
			localStorage.setItem('role', payload.role)
			return {
				...state,
				isLogged: true,
				user: payload,
			}
		case 'LOGOUT':
			localStorage.clear()
			return {
				...state,
				isLogged: false,
				user: null,
			}
		default:
			return state
	}
}

interface ISessionProvider {
	children: ReactNode
}

export const SessionContext = createContext<{
	state: ISessionState
	dispatch: React.Dispatch<ISessionActions>
}>({
	state: {
		isLogged: false,
		user: null,
	},
	dispatch: () => null,
})

const SessionProvider: FC<ISessionProvider> = ({ children }) => {
	const initialState: ISessionState = {
		isLogged: localStorage.getItem('token') !== null,
		user: {
			token: localStorage.getItem('token'),
			firstName: localStorage.getItem('firstName'),
			lastName: localStorage.getItem('lastName'),
			email: localStorage.getItem('email'),
			role: localStorage.getItem('role'),
		},
	}

	const [state, dispatch] = useReducer(handleDispatch, initialState)

	return <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>
}

export default SessionProvider

import { FC, ReactNode, createContext, useReducer } from 'react'

interface ISidebarState {
	isOpen: boolean
}

export interface ISidebarActions {
	type: 'SWITCH'
}

const handleDispatch = (state: ISidebarState): ISidebarState => {
	if (state.isOpen) {
		localStorage.removeItem('sidebar')
		return { isOpen: false }
	} else {
		localStorage.setItem('sidebar', 'true')
		return { isOpen: true }
	}
}

interface ISidebarProvider {
	children: ReactNode
}

export const SidebarContext = createContext<{
	state: ISidebarState
	dispatch: React.Dispatch<ISidebarActions>
}>({
	state: {
		isOpen: false,
	},
	dispatch: () => null,
})

const SidebarProvider: FC<ISidebarProvider> = ({ children }) => {
	const initialState: ISidebarState = {
		isOpen: localStorage.getItem('sidebar') === 'true',
	}

	const [state, dispatch] = useReducer(handleDispatch, initialState)

	return <SidebarContext.Provider value={{ state, dispatch }}>{children}</SidebarContext.Provider>
}

export default SidebarProvider

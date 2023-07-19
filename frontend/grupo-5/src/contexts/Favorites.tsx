import { FC, ReactNode, createContext, useReducer } from 'react'

interface IFavoritesState {
	favs: number[]
}

export interface IFavoritePayload {
	idProduct: number
}

const handleDispatch = (state: IFavoritesState, { idProduct }: IFavoritePayload): IFavoritesState => {
	if (state.favs.includes(idProduct)) {
		localStorage.setItem('favs', state.favs.filter((f) => f !== idProduct).toString())
		return {
			...state,
			favs: state.favs.filter((f) => f !== idProduct),
		}
	} else {
		localStorage.setItem('favs', [...state.favs, idProduct].toString())
		return {
			...state,
			favs: [...state.favs, idProduct],
		}
	}
}

interface IFavoritesProvider {
	children: ReactNode
}

export const FavoritesContext = createContext<{
	state: IFavoritesState
	dispatch: React.Dispatch<IFavoritePayload>
}>({
	state: {
		favs: [],
	},
	dispatch: () => null,
})

const FavoritesProvider: FC<IFavoritesProvider> = ({ children }) => {
	const localFavs = localStorage.getItem('favs')
	const initialState: IFavoritesState = {
		favs: localFavs !== null ? localFavs.split(',').map(Number) : [],
	}

	const [state, dispatch] = useReducer(handleDispatch, initialState)

	return <FavoritesContext.Provider value={{ state, dispatch }}>{children}</FavoritesContext.Provider>
}

export default FavoritesProvider

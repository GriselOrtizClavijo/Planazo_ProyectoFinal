import { useLocation, useNavigate } from 'react-router-dom'

interface QueryParams {
	[key: string]: string | string[] | number | number[]
}

export const useQueryParams = <T>() => {
	const navigate = useNavigate()
	const location = useLocation()

	const getQueryParams = (): T => {
		const queryParams: QueryParams = {}
		const searchParams = new URLSearchParams(location.search)

		for (const [key, value] of searchParams.entries()) {
			const numericValue = Number(value)

			if (isNaN(numericValue)) {
				if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
					if (typeof queryParams[key] === 'string') {
						queryParams[key] = [queryParams[key] as string]
					}
					;(queryParams[key] as string[]).push(value)
				} else {
					queryParams[key] = value
				}
			} else {
				if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
					if (typeof queryParams[key] === 'number') {
						queryParams[key] = [queryParams[key] as number]
					}
					;(queryParams[key] as number[]).push(numericValue)
				} else {
					queryParams[key] = numericValue
				}
			}
		}

		return queryParams as T
	}

	const addQueryParams = (paramsToAdd: Partial<T>) => {
		const searchParams = new URLSearchParams(location.search)

		// Agregar parámetros
		Object.entries(paramsToAdd).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((v) => searchParams.append(key, String(v)))
			} else {
				searchParams.set(key, String(value))
			}
		})

		// Actualizar la ruta
		navigate({ search: searchParams.toString() })
	}

	const deleteQueryParams = (paramsToRemove: string[]) => {
		const searchParams = new URLSearchParams(location.search)

		// Eliminar parámetros
		paramsToRemove.forEach((param) => {
			searchParams.delete(param)
		})

		// Actualizar la ruta
		navigate({ search: searchParams.toString() })
	}

	const queryParams = getQueryParams()

	return { queryParams, addQueryParams, deleteQueryParams }
}

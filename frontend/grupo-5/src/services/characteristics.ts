import { useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'

const URLS = {
	CHARACTERISTICS_LIST: '/characteristic/list',
}

// Get categories

export interface ICharacteristicItemAPI {
	id: number
	title: string
}

export const getCharacteristics = async () => {
	const { data } = await api.get<ICharacteristicItemAPI[]>(URLS.CHARACTERISTICS_LIST)
	return data
}

export const useGetCharacteristics = () => {
	return useQuery<ICharacteristicItemAPI[], IResponseError<string>, ICharacteristicItemAPI[]>(
		['GET_CHARACTERISTICS'],
		getCharacteristics,
		{
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

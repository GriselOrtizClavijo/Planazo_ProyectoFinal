import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'

const URLS = {
	PROVINCES: '/provinces',
	CITIES: '/cities',
	DELETE_CITY: '/cities/delete/',
	UPDATE_CITY: 'cities/update/',
	SEARCH_CITY: 'cities/search/',
}

// Create city

export interface ICreateCategoryReq {
	token: string
	name: string
	province: number
}

const createCity = async (body: ICreateCategoryReq) => {
	const bodyDTO = {
		name: body.name,
		province: { id: body.province },
	}
	const { data } = await api.post<number>(URLS.CITIES, bodyDTO, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useCreateCity = () => {
	return useMutation<number, IResponseError<string>, ICreateCategoryReq>(['CREATE_CITY'], createCity, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Get provinces

export interface IProvince {
	id: number
	name: string
}

export interface ICity {
	id: number
	name: string
	province: string
}

export const getProvinces = async () => {
	const { data } = await api.get<IProvince[]>(URLS.PROVINCES)
	return data
}

export const useGetProvinces = () => {
	return useQuery<IProvince[], IResponseError<string>, IProvince[]>(['GET_PROVINCES'], getProvinces, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Get cities by id

export const getCitiesByprovince = async (id: number | null) => {
	if (id !== null) {
		const { data } = await api.get<ICity[]>(URLS.CITIES, { params: { idProvince: id } })
		return data
	} else {
		return []
	}
}

export const useGetCitiesByprovince = (id: number | null) => {
	return useQuery<ICity[], IResponseError<string>, ICity[]>(
		['GET_CITY_BY_PROVINCE_ID_' + id],
		() => getCitiesByprovince(id),
		{
			retry: false,
			refetchOnMount: 'always',
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Get all cities

export const getCities = async (body?: { name?: string }) => {
	const res = await api.get<ICity[]>(URLS.CITIES, {
		params: { ...(body?.name !== undefined && { name: body?.name }) },
	})

	if (Array.isArray(res.data)) {
		return res.data
	} else {
		return []
	}
}

export const useGetCities = (body?: { name?: string; refetchOnMount?: boolean | 'always' }) => {
	return useQuery<ICity[], IResponseError<string>, ICity[]>(
		['GET_CITIES' + (body?.name ?? '')],
		() => getCities(body),
		{
			enabled: body?.name === undefined,
			refetchOnMount: body?.refetchOnMount,
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Delete city

interface IDeleteCity {
	id: number
	token: string
}

export const deleteCity = async (body: IDeleteCity) => {
	const { data } = await api.delete<string>(URLS.DELETE_CITY + body.id, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useDeleteCity = () => {
	return useMutation<string, IResponseError<IDeleteCity>, IDeleteCity>(['DELETE_CITY'], deleteCity, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Update city

export interface IUpdateCityReq {
	id: number
	name: string
	province: number
	token: string
}

const updateCity = async (body: IUpdateCityReq) => {
	const bodyDTO = {
		name: body.name,
		province: { id: body.province },
	}
	const { data } = await api.put<ICity>(URLS.UPDATE_CITY + body.id, bodyDTO, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useUpdateCity = () => {
	return useMutation<ICity, IResponseError<string>, IUpdateCityReq>(['UPDATE_CITY'], updateCity, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Get city by id

export interface ICityDetailRes {
	id: number
	name: string
	province: {
		id: number
		name: string
	}
}

export const getCity = async (id: string) => {
	const { data } = await api.get<ICityDetailRes>(URLS.SEARCH_CITY + id)
	return data
}

export const useGetCityById = (id: string) => {
	return useQuery<ICityDetailRes, IResponseError<string>, ICityDetailRes>(['GET_CITY_' + id], () => getCity(id), {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

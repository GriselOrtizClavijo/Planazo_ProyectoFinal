import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'

const URLS = {
	CATEGORY_LIST: '/categories/list',
	CATEGORY_SEARCH: '/categories/search',
	CATEGORY_CREATE: '/categories/create',
	CATEGORY_UPDATE: '/categories/update',
	CATEGORY_DELETE: '/categories/delete',
}

// Get categories

export interface ICategoryItemAPI {
	id: number
	title: string
	description: string
	urlImg: string
	video: string
}

export const getCategories = async () => {
	const { data } = await api.get<ICategoryItemAPI[]>(URLS.CATEGORY_LIST)
	return data
}

export const useGetCategories = (body?: { refetchOnMount?: boolean | 'always' }) => {
	return useQuery<ICategoryItemAPI[], IResponseError<string>, ICategoryItemAPI[]>(['GET_CATEGORIES'], getCategories, {
		retry: false,
		refetchOnMount: body?.refetchOnMount,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Get category by id

export interface ICategoryDetailAPI {
	id: number
	title: string
	description: string
	urlImg: string
	video: string
}

export const getCategoryById = async (id: string) => {
	const { data } = await api.get<ICategoryDetailAPI>(URLS.CATEGORY_SEARCH + '/' + id)
	return data
}

export const useGetCategoryById = (id: string) => {
	return useQuery<ICategoryDetailAPI, IResponseError<string>, ICategoryItemAPI>(
		['GET_CATEGORY_BY_ID_' + id],
		() => getCategoryById(id),
		{
			retry: false,
			enabled: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Delete category

interface IDeleteCategory {
	id: number
	token: string
}

export const deleteCategory = async (body: IDeleteCategory) => {
	const { data } = await api.delete<string>(URLS.CATEGORY_DELETE + '/' + body.id, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useDeleteCategory = () => {
	return useMutation<string, IResponseError<IDeleteCategory>, IDeleteCategory>(['DELETE_CATEGORY'], deleteCategory, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Create new category

const createCategory = async (body: FormData) => {
	const { data } = await api.post<number>(URLS.CATEGORY_CREATE, body, {
		headers: { Authorization: 'Bearer ' + body.get('token') },
	})
	return data
}

export const useCreateCategory = () => {
	return useMutation<number, IResponseError<string>, FormData>(['CREATE_CATEGORY'], createCategory, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Update category

export interface IUpdateCategoryResponse {
	id: number
	title: string
	description: string
	img: string
	video: string
}

const updateCategory = async (body: FormData) => {
	const { data } = await api.patch<IUpdateCategoryResponse>(URLS.CATEGORY_UPDATE + '/' + body.get('id'), body, {
		headers: { Authorization: 'Bearer ' + body.get('token') },
	})
	return data
}

export const useUpdateCategory = () => {
	return useMutation<IUpdateCategoryResponse, IResponseError<string>, FormData>(['UPDATE_CATEGORY'], updateCategory, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

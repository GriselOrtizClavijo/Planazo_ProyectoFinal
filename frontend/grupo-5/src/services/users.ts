import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'

const URLS = {
	GET_USERS: '/session/list',
	GET_USER_BY_ID: '/session/search/',
	UPDATE_USER: '/session/update/',
	DELETE_USER: '/session/delete/',
}

// Get users

export interface IUser {
	id: number
	firstName: string
	lastName: string
	email: string
	phoneNumber: number
	role: 'USER' | 'ADMIN'
}

interface IListUserReq {
	token: string
	refetchOnMount?: boolean | 'always'
}

export const getUsers = async (token: string) => {
	const { data } = await api.get<IUser[]>(URLS.GET_USERS, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useGetUsers = (body: IListUserReq) => {
	return useQuery<IUser[], IResponseError<string>, IUser[]>(['GET_USERS'], () => getUsers(body.token), {
		retry: false,
		refetchOnMount: body?.refetchOnMount,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Update user

export interface IUpdateUserReq {
	id: string
	role: 'USER' | 'ADMIN'
	firstName: string
	lastName: string
	phoneNumber: number | null
	token: string
}

const updateUser = async (body: IUpdateUserReq) => {
	const { token, id, ...restOfBody } = body
	const { data } = await api.patch<IUser>(URLS.UPDATE_USER + id, restOfBody, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useUpdateUser = () => {
	return useMutation<IUser, IResponseError<string>, IUpdateUserReq>(['UPDATE_USER'], updateUser, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Delete user

interface IDeleteUser {
	id: number
	token: string
}

export const deleteUser = async (body: IDeleteUser) => {
	const { data } = await api.delete<string>(URLS.DELETE_USER + body.id, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useDeleteUser = () => {
	return useMutation<string, IResponseError<IDeleteUser>, IDeleteUser>(['DELETE_USER'], deleteUser, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Ger user by id

export const getUserById = async ({ id, token }: { id: string; token: string }) => {
	const { data } = await api.get<IUser>(URLS.GET_USER_BY_ID + id, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useGetUserById = ({ id, token }: { id: string; token: string }) => {
	return useQuery<IUser, IResponseError<string>, IUser>(['GET_USER_BY_ID' + id], () => getUserById({ id, token }), {
		retry: false,
		enabled: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

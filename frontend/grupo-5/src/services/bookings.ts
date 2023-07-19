import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'

const URLS = {
	BOOKING_LIST: '/booking/list',
	BOOKING_SEARCH: '/booking/search/',
	BOOKING_CREATE: '/booking/create',
	BOOKING_DELETE: '/booking/delete/',
}

// Create new booking

export interface ICreateBookingReq {
	dateStart: string
	dateEnd: string
	totalPrice: number
	countAdults: number
	countChildren: number
	COVIDvaccine: boolean
	reducedMobility: boolean
	comment: string
	paymentType: {
		id: number
	}
	product: {
		id: number
	}
}

const createBooking = async (body: ICreateBookingReq & { token: string }) => {
	const { token, ...restOfBody } = body
	const { data } = await api.post<number>(URLS.BOOKING_CREATE, restOfBody, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useCreateBooking = () => {
	return useMutation<number, IResponseError<string>, ICreateBookingReq & { token: string }>(
		['CREATE_BOOKING'],
		createBooking,
		{
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Get booking by id

export interface IBookingDetailAPI {
	id: number
	dateStart: string
	dateEnd: string
	totalPrice: number
	paymentType: {
		id: number
		tittle: string
	}
	countAdults: number
	countChildren: number
	COVIDvaccine: boolean
	reducedMobility: boolean
	comment: string
	title: string
	img: string
	city: string
	characteristic: {
		id: number
		title: string
	}
	firstName: string
	lastName: string
	email: string
	phoneNumber: number
	idProduct: number
}

export const getBookingById = async ({ id, token }: { id: string; token: string }) => {
	const { data } = await api.get<IBookingDetailAPI>(URLS.BOOKING_SEARCH + id, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useGetBookingById = (body: { id: string; token: string }) => {
	return useQuery<IBookingDetailAPI, IResponseError<string>, IBookingDetailAPI>(
		['GET_BOOKING_BY_ID_' + body.id],
		() => getBookingById(body),
		{
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Get list of bookings

export interface IBookingItem {
	id: number
	dateStart: string
	dateEnd: string
	totalPrice: number
	product: {
		id: number
		title: string
		img: Array<{
			id: number
			imgUrl: string
		}>
	}
}

export const getBookings = async (token: string) => {
	const { data } = await api.get<IBookingItem[]>(URLS.BOOKING_LIST, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useGetBookings = (token: string) => {
	return useQuery<IBookingItem[], IResponseError<string>, IBookingItem[]>(['GET_BOOKINGS'], () => getBookings(token), {
		retry: false,
		refetchOnMount: 'always',
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Delete booking

interface IDeleteBooking {
	id: number
	token: string
}

export const deleteBooking = async (body: IDeleteBooking) => {
	const { data } = await api.delete<string>(URLS.BOOKING_DELETE + body.id, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useDeleteBooking = () => {
	return useMutation<string, IResponseError<IDeleteBooking>, IDeleteBooking>(['DELETE_BOOKING'], deleteBooking, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'

const URLS = {
	REVIEW_CREATE: '/reviews/create',
	REVIEW_LIST: '/reviews/list/',
	REVIEW_DELETE: '/reviews/delete/',
	REVIEW_SEARCH: '/reviews/search/',
}

// Create new review

export interface ICreateReviewReq {
	product: {
		id: number
	}
	comment: string
	rate: number
	booking: {
		id: number
	}
}

const createReview = async (body: ICreateReviewReq & { token: string }) => {
	const { token, ...restOfBody } = body
	const { data } = await api.post<number>(URLS.REVIEW_CREATE, restOfBody, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useCreateReview = () => {
	return useMutation<number, IResponseError<string>, ICreateReviewReq & { token: string }>(
		['CREATE_REVIEW'],
		createReview,
		{
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Get reviews by product id

export interface IReviewItem {
	id: number
	date: string
	rate: number
	name: string
	comment: string
}

export const getReviewsByProductId = async (id: string) => {
	const { data } = await api.get<IReviewItem[]>(URLS.REVIEW_LIST + id)
	return data
}

export const useGetReviewsByProductId = (id: string) => {
	return useQuery<IReviewItem[], IResponseError<string>, IReviewItem[]>(
		['GET_REVIEWS_BY_PRODUCT_ID_' + id],
		() => getReviewsByProductId(id),
		{
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Delete review

interface IDeleteReview {
	id: number
	token: string
}

export const deleteReview = async (body: IDeleteReview) => {
	const { data } = await api.delete<string>(URLS.REVIEW_DELETE + body.id, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useDeleteReview = () => {
	return useMutation<string, IResponseError<IDeleteReview>, IDeleteReview>(['DELETE_BOOKING'], deleteReview, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Get personal review by booking id

export const getPersonalReviewByBookingId = async ({ id, token }: { id: string; token: string }) => {
	const { data } = await api.get<IReviewItem>(URLS.REVIEW_SEARCH + id, {
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}

export const useGetPersonalReviewByBookingId = (body: { id: string; token: string }) => {
	return useQuery<IReviewItem, IResponseError<string>, IReviewItem>(
		['GET_PERSONAL_REVIEW_BY_BOOKING_ID_' + body.id],
		() => getPersonalReviewByBookingId(body),
		{
			retry: false,
			enabled: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

import axios, { AxiosError } from 'axios'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

// interface IQueryErrorResponse {
// 	code: string
// 	message: string
// }

export type IResponseError<V> = AxiosError<string, V>

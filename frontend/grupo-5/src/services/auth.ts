import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'
import { ILoginForm, ISigninForm } from 'schemas/auth'

const URLS = {
	AUTH_SIGNIN: '/auth/register',
	AUTH_LOGIN: '/auth/authenticate',
	AUTH_VERIFY: '/mail/verified-account',
}

// User login

export interface ILoginResponse {
	firstName: string
	lastName: string
	email: string
	role: string
	token: string
}

const postLogin = async (body: ILoginForm) => {
	const { data } = await api.post<ILoginResponse>(URLS.AUTH_LOGIN, body)
	return data
}

export const useLogin = () => {
	return useMutation<ILoginResponse, IResponseError<string>, ILoginForm>(['LOG_IN'], postLogin, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// New user register

const postSignin = async (body: ISigninForm) => {
	const { data } = await api.post<string>(URLS.AUTH_SIGNIN, body)
	return data
}

export const useSignin = () => {
	return useMutation<string, IResponseError<string>, ISigninForm>(['SIGN_IN'], postSignin, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Account verification

const verifyAccount = async (token: string) => {
	const { data } = await api.get<string>(URLS.AUTH_VERIFY, { params: { token } })
	return data
}

export const useVerifyAccount = (token: string) => {
	return useQuery<string, IResponseError<string>, string>(['VERIFY_ACCOUNT'], () => verifyAccount(token), {
		retry: false,
		enabled: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

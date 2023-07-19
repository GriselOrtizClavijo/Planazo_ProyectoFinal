import { useMutation, useQuery } from '@tanstack/react-query'
import { IResponseError, api } from 'config/api'
import { useCallback } from 'react'
import { generateMultipleParams } from 'utils/generateParams'

const URLS = {
	PRODUCT_LIST: '/products/list',
	PRODUCT_SEARCH: '/products/search',
	PRODUCT_CREATE: '/products/create',
	PRODUCT_UPDATE: '/products/update',
	PRODUCT_DELETE: '/products/delete',
	PRODUCT_LOCATIONS: '/products/list/locations',
}

// Delete product by id

interface IDeleteProduct {
	id: number
	token: string
}

export const deleteProduct = async (body: IDeleteProduct) => {
	const { data } = await api.delete<string>(URLS.PRODUCT_DELETE + '/' + body.id, {
		headers: { Authorization: 'Bearer ' + body.token },
	})
	return data
}

export const useDeleteProduct = () => {
	return useMutation<string, IResponseError<IDeleteProduct>, IDeleteProduct>(['DELETE_PRODUCT'], deleteProduct, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Create new product

const createProduct = async (body: FormData) => {
	const { data } = await api.post<number>(URLS.PRODUCT_CREATE, body, {
		headers: { Authorization: 'Bearer ' + body.get('token') },
	})
	return data
}

export const useCreateProduct = () => {
	return useMutation<number, IResponseError<string>, FormData>(['CREATE_PRODUCT'], createProduct, {
		retry: false,
		onError: (error) => {
			console.error(error.response?.data)
		},
	})
}

// Get product by id

interface IProductDetailAPI {
	id: number
	categories: Array<{
		id: number
		title: string
	}>
	city: string
	location: string
	img: string[]
	title: string
	priceAdult: number
	priceMinor: number
	description: string
	rating: number
	state: boolean
	characteristics: Array<{
		id: number
		title: string
	}>
	bookings: Array<{
		from: string
		to: string
	}>
	policy: string | null
}

export const getProductById = async (id: string) => {
	const { data } = await api.get<IProductDetailAPI>(URLS.PRODUCT_SEARCH + '/' + id)
	return data
}

interface IProductDetailDTO {
	id: number
	title: string
	rating: number
	price_adult: number
	price_minor: number
	images: Array<{
		imgAlt: string
		imgUrl: string
		width: number
		height: number
	}>
	description: string
	location: {
		description: string
		lat: number
		lng: number
	}
	characteristics: Array<{
		id: number
		title: string
	}>
	bookings: Array<{
		from: string
		to: string
	}>
	policy: string | null
}

const productDetailDTO = async (product: IProductDetailAPI): Promise<IProductDetailDTO> => {
	const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
		return new Promise((resolve, reject) => {
			const image = new Image()
			image.src = url
			image.onload = () => {
				resolve({ width: image.width, height: image.height })
			}
			image.onerror = () => {
				reject(new Error('No se pudo cargar la imagen.'))
			}
		})
	}

	const imagesPromises = product.img.map(async (url) => {
		try {
			const imgSize = await getImageSize(url)
			return {
				imgUrl: url,
				imgAlt: 'image of ' + (product.title ?? ''),
				width: imgSize.width,
				height: imgSize.height,
			}
		} catch (error) {
			console.error('Error al obtener el tamaño de la imagen:', error)
			return null
		}
	})

	const images = await Promise.all(imagesPromises)
	const coordinates = product.location.split(',')

	return {
		id: product.id ?? 0,
		title: product.title ?? '',
		rating: product.rating ?? '',
		price_adult: product.priceAdult ?? 0,
		price_minor: product.priceMinor ?? 0,
		images: images.filter((img) => img !== null) as {
			imgAlt: string
			imgUrl: string
			width: number
			height: number
		}[],
		location: {
			description: product.city ?? '',
			lat: parseFloat(coordinates[0]),
			lng: parseFloat(coordinates[1]),
		},
		description: product.description ?? '',
		characteristics: product.characteristics ?? [],
		bookings: product.bookings ?? [],
		policy: product.policy ?? null,
	}
}

export const useGetProductById = (id: string) => {
	return useQuery<IProductDetailDTO, IResponseError<string>>(
		['GET_PRODUCT_SEARCH_' + id],
		async () => {
			const productData = await getProductById(id)
			const productDTO = await productDetailDTO(productData)
			return productDTO
		},
		{
			retry: false,
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

// Get products

interface IProductItemAPI {
	id: number
	img: string
	price: number
	rating: number
	title: string
	city: string
}

interface IProductsRes {
	data: IProductItemAPI[]
	pagination: IPagination
}

export interface IProductItemDTO {
	id: number
	img: string
	title: string
	rating: number
	price: number
	location: string
}

export interface IPagination {
	total_elements: number
	page_size: number
	current_page: number
	previous_page: number | null
	next_page: number | null
	total_pages: number
}

interface IProductsResDTO {
	data: IProductItemDTO[]
	pagination: IPagination
}

const productsDTO = (products: IProductItemAPI[]): IProductItemDTO[] => {
	const newProducts: IProductItemDTO[] = []
	products.forEach((p) => {
		newProducts.push({
			id: p.id ?? '',
			img: p.img,
			title: p.title,
			rating: p.rating,
			price: p.price,
			location: p.city,
		})
	})
	return newProducts
}

interface IProductRequest {
	params?: IFilterParams
}

export const getProducts = async (body?: IProductRequest) => {
	const { data } = await api.get<IProductsRes>(
		URLS.PRODUCT_LIST + (body?.params !== undefined ? generateMultipleParams<IFilterParams>(body.params) : ''),
	)
	return data
}

export const useGetProducts = (body?: IProductRequest & { refetchOnMount?: boolean | 'always' }) => {
	return useQuery<IProductsRes, IResponseError<string>, IProductsResDTO>(
		['GET_PRODUCTS_' + (body?.params !== undefined ? generateMultipleParams<IFilterParams>(body.params) : '')],
		() => getProducts(body),
		{
			retry: false,
			refetchOnMount: body?.refetchOnMount,
			select: useCallback((res: IProductsRes): IProductsResDTO => {
				return { ...res, data: productsDTO(res.data) }
			}, []),
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

export interface IFilterParams {
	page: number
	random?: boolean
	page_size?: number
	idCategory?: number[] | number
	city?: number
	cityName?: string
	dateStart?: string
	dateEnd?: string
}

// Get product locations

export interface IProductLocation {
	img: string
	lng: number
	id: number
	title: string
	lat: number
}

export const getProductLocations = async () => {
	const { data } = await api.get<IProductLocation[]>(URLS.PRODUCT_LOCATIONS)
	return data
}

export const useGetProductLocations = () => {
	return useQuery<IProductLocation[], IResponseError<string>, IProductLocation[]>(
		['GET_PRODUCT_LOCATIONS'],
		getProductLocations,
		{
			retry: false,
			refetchOnMount: 'always',
			onError: (error) => {
				console.error(error.response?.data)
			},
		},
	)
}

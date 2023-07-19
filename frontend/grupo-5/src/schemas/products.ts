import * as Yup from 'yup'

// Search products

export interface IProductSearchForm {
	dateStart: string | null
	dateEnd: string | null
	city: number | null
	cityName: string | null
	idCategory: number[]
}

export const productSearchInitialValuesForm: IProductSearchForm = {
	dateStart: null,
	dateEnd: null,
	city: null,
	cityName: null,
	idCategory: [],
}

// Create product

export interface IProductForm {
	title: string
	province: number | null
	city: number | null
	categories: any[]
	characteristics: any[]
	adultPrice: number
	minorPrice: number
	description: string
	images: File[]
	lat: number | null
	lng: number | null
}

export const productInitialValuesForm: IProductForm = {
	title: '',
	province: null,
	city: null,
	categories: [],
	characteristics: [],
	adultPrice: 0,
	minorPrice: 0,
	description: '',
	images: [],
	lat: null,
	lng: null,
}

export const productSchema = Yup.object().shape({
	title: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	province: Yup.number().strict().required('Campo obligatorio'),
	city: Yup.number().strict().required('Campo obligatorio'),
	categories: Yup.array().min(1, 'Se debe seleccionar al menos una categoría'),
	characteristics: Yup.array().min(1, 'Se debe seleccionar al menos una característica'),
	images: Yup.array().length(5, 'Se deben subir 5 (cinco) imágenes en total'),
	description: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	adultPrice: Yup.number().strict().min(1, 'El monto no puede ser 0').required('Campo obligatorio'),
	minorPrice: Yup.number().strict().min(1, 'El monto no puede ser 0').required('Campo obligatorio'),
	lat: Yup.number().required('La ubicación es requerida'),
	lng: Yup.number().required('La ubicación es requerida'),
})

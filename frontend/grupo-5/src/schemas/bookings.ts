import * as Yup from 'yup'

export interface IBookingForm {
	adult: number
	child: number
	dateStart: string | null
	dateEnd: string | null
	covid: boolean
	mobility: boolean
	comments: string
	policies: boolean
	payment: number | null
}

export const bookingInitialValuesForm: IBookingForm = {
	adult: 0,
	child: 0,
	dateStart: null,
	dateEnd: null,
	covid: false,
	mobility: false,
	comments: '',
	policies: false,
	payment: null,
}

export const bookingSchema = Yup.object().shape({
	adult: Yup.number().strict().required('Campo obligatorio').min(1, 'Debe haber 1 (un) adulto al menos.'),
	child: Yup.number().strict().required('Campo obligatorio'),
	payment: Yup.number().strict().required('Campo obligatorio'),
	dateStart: Yup.string().strict().required('Campo obligatorio'),
	policies: Yup.boolean().oneOf([true], 'Debes aceptar esta declaración.'),
})

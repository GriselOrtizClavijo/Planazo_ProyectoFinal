import * as Yup from 'yup'

export interface IReviewForm {
	comment: string
	rate: number | null
}

export const reviewInitialValuesForm: IReviewForm = {
	comment: '',
	rate: null,
}

export const reviewSchema = Yup.object().shape({
	comment: Yup.string().strict().trim('No debe tener espacios al inicio ni al final.').required('Campo obligatorio'),
	rate: Yup.number().strict().required('Campo obligatorio'),
})

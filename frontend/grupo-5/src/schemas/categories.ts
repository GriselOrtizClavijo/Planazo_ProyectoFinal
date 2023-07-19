import * as Yup from 'yup'

export interface ICategoryForm {
	title: string
	description: string
	images: File[]
	video: string
}

export const categoryInitialValuesForm: ICategoryForm = {
	title: '',
	description: '',
	images: [],
	video: '',
}

export const categorySchema = Yup.object().shape({
	title: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	description: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	images: Yup.array().min(1, 'La imagen es obligatoria'),
})

export const categoryUpdateSchema = Yup.object().shape({
	title: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	description: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
})

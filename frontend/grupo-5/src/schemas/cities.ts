import * as Yup from 'yup'

// Create city

export interface ICreateCityForm {
	name: string
	province: number | null
}

export const createCityInitialValuesForm: ICreateCityForm = {
	name: '',
	province: null,
}

export const createCitySchema = Yup.object().shape({
	name: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	province: Yup.number().strict().required('Campo obligatorio'),
})

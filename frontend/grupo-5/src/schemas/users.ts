import * as Yup from 'yup'

// User update

export interface IUserForm {
	firstName: string
	lastName: string
	email: string
	phoneNumber: number | null
	role: 'USER' | 'ADMIN'
}

export const userInitialValuesForm: IUserForm = {
	firstName: '',
	lastName: '',
	email: '',
	phoneNumber: null,
	role: 'USER',
}

export const userFormSchema = Yup.object().shape({
	firstName: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	lastName: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	email: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	phoneNumber: Yup.number().strict().required('Campo obligatorio'),
	role: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
})

import * as Yup from 'yup'

// User login

export interface ILoginForm {
	email: string
	password: string
}

export const loginInitialValuesForm: ILoginForm = {
	email: '',
	password: '',
}

export const loginSchema = Yup.object().shape({
	email: Yup.string()
		.trim('No debe tener espacios al inicio o final')
		.email('Dirección de correo inválida')
		.strict()
		.required('Campo obligatorio'),
	password: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
})

// New user register

export interface ISigninForm {
	firstName: string
	lastName: string
	email: string
	password: string
	dni: number | string
	phoneNumber: number | string
}

export const signinInitialValuesForm: ISigninForm = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	dni: '',
	phoneNumber: '',
}

export const signinSchema = Yup.object().shape({
	firstName: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	lastName: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	email: Yup.string()
		.trim('No debe tener espacios al inicio o final')
		.email('Dirección de correo inválida')
		.strict()
		.required('Campo obligatorio'),
	password: Yup.string().trim('No debe tener espacios al inicio o final').strict().required('Campo obligatorio'),
	dni: Yup.number().strict().required('Campo obligatorio'),
	phoneNumber: Yup.number().strict().required('Campo obligatorio'),
})

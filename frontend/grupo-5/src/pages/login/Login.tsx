import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logotype from 'assets/icons/Logotype'
import Button from 'components/Button'
import Modal from 'components/Modal'
import Input from 'components/form/Input'
import { useFormik } from 'formik'
import LoginLayout from 'layouts/LoginLayout'
import { useContext, useState } from 'react'
import {
	ILoginForm,
	ISigninForm,
	loginInitialValuesForm,
	loginSchema,
	signinInitialValuesForm,
	signinSchema,
} from 'schemas/auth'
import { ILoginResponse, useLogin, useSignin } from 'services/auth'
import EmailSended from 'assets/img/EmailSended.svg'
import { SessionContext } from 'contexts/Session'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
	const [isRegistering, setIsRegistering] = useState(false)
	const [isSubmittingSignin, setIsSubmittingSignin] = useState(false)
	const [isSubmittingLogin, setIsSubmittingLogin] = useState(false)
	const [emailSended, setEmailSended] = useState(false)
	const [messageError, setMessageError] = useState('')

	const { dispatch } = useContext(SessionContext)
	const signin = useSignin()
	const login = useLogin()
	const navigate = useNavigate()

	const {
		handleSubmit: handleSubmitLogin,
		handleChange: handleChangeLogin,
		resetForm: resetLogin,
		values: valuesLogin,
		errors: errorsLogin,
	} = useFormik<ILoginForm>({
		initialValues: loginInitialValuesForm,
		validationSchema: loginSchema,
		onSubmit: async (formData) => {
			const body = {
				email: formData.email,
				password: formData.password,
			}
			setIsSubmittingLogin(true)
			login.mutate(body, {
				onSuccess: (payload: ILoginResponse) => {
					resetLogin()
					setIsRegistering(false)
					setIsSubmittingLogin(false)
					dispatch({ type: 'LOGIN', payload })
					if (payload.role === 'ADMIN') {
						navigate('/admin/products')
					} else {
						navigate('/')
					}
				},
				onError: (error) => {
					console.error(error)
					setMessageError(typeof error.response?.data === 'string' ? error.response?.data : '')
					setIsSubmittingLogin(false)
				},
			})
		},
		validateOnChange: false,
	})

	const {
		handleSubmit: handleSubmitSignin,
		handleChange: handleChangeSignin,
		resetForm: resetSignin,
		values: valuesSignin,
		errors: errorsSignin,
		dirty: dirtySignin,
	} = useFormik<ISigninForm>({
		initialValues: signinInitialValuesForm,
		validationSchema: signinSchema,
		onSubmit: async (formData) => {
			setIsSubmittingSignin(true)
			setMessageError('')
			const body = {
				...formData,
				password: formData.password,
			}
			signin.mutate(body, {
				onSuccess: () => {
					setEmailSended(true)
					resetSignin()
					setIsRegistering(false)
					setIsSubmittingSignin(false)
				},
				onError: (error) => {
					setIsSubmittingSignin(false)
					console.error(error)
					setMessageError(typeof error.response?.data === 'string' ? error.response?.data : '')
				},
			})
		},
		validateOnChange: false,
	})

	return (
		<LoginLayout>
			{emailSended && (
				<Modal className="items-center">
					<div className="relative flex w-full h-[180px]">
						<img src={EmailSended} alt="background" className="w-full z-0 h-full absolute inset-y-0" />
					</div>
					<h1 className="font-semibold text-xl">¡Tu cuenta ha sido creada con éxito!</h1>
					<p className="text-justify">
						Solo falta un último paso para comenzar a disfrutar de todos nuestros servicios.
					</p>
					<p className="text-justify">
						Hemos enviado un correo electrónico a tu bandeja de entrada con instrucciones para validar tu identidad.
					</p>
					<p className="text-justify">
						Por favor, revisalo dentro de las próximas 48 horas. Si no encuentras el correo, revisa la carpeta de spam.
					</p>
					<div>
						<Button onClick={() => setEmailSended(false)}>Volver al inicio</Button>
					</div>
				</Modal>
			)}
			<div className="w-full max-w-3xl flex flex-col items-center px-6 pt-10 text-white gap-8">
				<div className="w-48">
					<Logotype />
				</div>
				<div className="text-center duration-200 transform">
					<h2 className="text-lg">Busca paquetes turísticos</h2>
					<h2 className="text-xl font-bold">Encuentra experiencias inolvidables</h2>
				</div>
			</div>
			<div className="w-full max-w-[400px] bg-white p-6 rounded-2xl mb-8 shadow-lg">
				{!isRegistering ? (
					<form onSubmit={handleSubmitLogin} className="w-full flex flex-col gap-3 items-center">
						<h1 className="font-bold text-2xl text-start w-full mt-2 mb-4">Iniciar sesión</h1>
						<Input
							name="email"
							label="Correo electrónico"
							placeholder="ejemplo@gmail.com"
							value={valuesLogin.email}
							onChange={handleChangeLogin}
							error={errorsLogin.email}
						/>
						<Input
							name="password"
							label="Contraseña"
							type="password"
							placeholder="Contraseña"
							value={valuesLogin.password}
							onChange={handleChangeLogin}
							error={errorsLogin.password}
						/>
						{messageError !== '' && <span className="text-red-600 font-semibold">{messageError}</span>}
						{login.error?.response?.status === 403 && (
							<button className="text-indigo-900 font-semibold hover:underline">
								Solicitar reenvío del correo electrónico
							</button>
						)}
						<div className="flex flex-col gap-4 w-full mt-4">
							<Button
								fullWidth
								secondary
								disabled={isSubmittingLogin}
								onClick={() => {
									window.scrollTo({
										top: 0,
										left: 0,
									})
									setMessageError('')
									resetLogin()
									setIsRegistering(true)
								}}
							>
								Registrarme
							</Button>
							<Button fullWidth type="submit" isLoading={isSubmittingLogin}>
								Ingresar
							</Button>
							<div className="inline-flex items-center justify-center w-full">
								<hr className="w-64 h-px my-4 bg-gray-200 border-0" />
								<span className="absolute px-3 font-medium text-slate-900 -translate-x-1/2 bg-white left-1/2">o</span>
							</div>
							<Link className="w-full text-center text-indigo-800 font-semibold hover:underline" to={'/'}>
								Continuar como invitado
							</Link>
						</div>
					</form>
				) : (
					<form onSubmit={handleSubmitSignin} className="w-full flex flex-col gap-3 items-center">
						<div className="flex w-full items-center gap-3 mt-2 mb-4">
							<button
								className="h-[35px] w-[35px] rounded-full duration-200 hover:bg-slate-100"
								onClick={() => {
									window.scrollTo({
										top: 0,
										left: 0,
									})
									setIsRegistering(false)
									resetSignin()
								}}
							>
								<FontAwesomeIcon icon={faArrowLeft} />
							</button>
							<h1 className="font-bold text-2xl text-start">Crear usuario</h1>
						</div>
						<Input
							name="firstName"
							label="Nombre/s"
							placeholder="Dorian"
							value={valuesSignin.firstName}
							onChange={handleChangeSignin}
							error={errorsSignin.firstName}
						/>
						<Input
							name="lastName"
							label="Apellido/s"
							placeholder="Battiato"
							value={valuesSignin.lastName}
							onChange={handleChangeSignin}
							error={errorsSignin.lastName}
						/>
						<Input
							name="dni"
							label="DNI"
							type="number"
							placeholder="35773921"
							value={valuesSignin.dni}
							onChange={handleChangeSignin}
							error={errorsSignin.dni}
						/>
						<Input
							name="email"
							label="Correo electrónico"
							placeholder="ejemplo@gmail.com"
							type="email"
							value={valuesSignin.email}
							onChange={handleChangeSignin}
							error={errorsSignin.email}
						/>
						<Input
							name="password"
							label="Contraseña"
							placeholder="Contraseña"
							type="password"
							value={valuesSignin.password}
							onChange={handleChangeSignin}
							error={errorsSignin.password}
						/>
						<Input
							name="phoneNumber"
							label="Teléfono"
							placeholder="0116654244"
							type="number"
							value={valuesSignin.phoneNumber}
							onChange={handleChangeSignin}
							error={errorsSignin.phoneNumber}
						/>
						{messageError !== '' && <span className="text-red-600 font-semibold">{messageError}</span>}
						<div className="flex flex-col gap-4 w-full mt-4">
							<Button
								fullWidth
								secondary
								onClick={() => {
									resetSignin()
									setMessageError('')
								}}
								disabled={isSubmittingSignin || !dirtySignin}
							>
								Limpiar
							</Button>
							<Button type="submit" fullWidth isLoading={isSubmittingSignin}>
								Registrarme
							</Button>
						</div>
					</form>
				)}
			</div>
		</LoginLayout>
	)
}

export default Login

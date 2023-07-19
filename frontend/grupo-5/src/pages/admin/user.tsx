import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdminLayout from 'layouts/AdminLayout'
import { faChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from 'components/Spinner'
import Button from 'components/Button'
import Input from 'components/form/Input'
import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { SessionContext } from 'contexts/Session'
import Select from 'components/form/Select'
import { IUpdateUserReq, useGetUserById, useUpdateUser } from 'services/users'
import { IUserForm, userFormSchema, userInitialValuesForm } from 'schemas/users'

const AdminUser = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const updateUser = useUpdateUser()
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const { state } = useContext(SessionContext)

	const user = useGetUserById({ id: id ?? '', token: state.user?.token ?? '' })

	const { handleSubmit, handleChange, resetForm, values, isSubmitting, setFieldValue, errors, dirty } =
		useFormik<IUserForm>({
			initialValues: {
				...userInitialValuesForm,
				...(user.data !== undefined && { ...user.data }),
			},
			validationSchema: userFormSchema,
			onSubmit: (formData, { setSubmitting }) => {
				const body: IUpdateUserReq = {
					...formData,
					id: id ?? '',
					token: state.user?.token ?? '',
				}

				updateUser.mutate(body, {
					onSuccess: () => {
						user.refetch().then(() => {
							setSubmitting(false)
							setIsEditing(false)
						})
					},
				})
			},
			validateOnChange: false,
		})

	useEffect(() => {
		user.refetch().then((res) => {
			if (res.status === 'success') {
				resetForm({
					values: res.data,
				})
			} else {
				navigate('/notFound')
			}
		})
	}, [])

	return (
		<AdminLayout>
			{user.data !== undefined && !user.isFetching ? (
				<div className="w-full max-w-3xl items-center py-6 flex flex-col gap-6 flex-1">
					<div className="flex justify-between items-center gap-2 px-6 md:px-0 w-full">
						<button
							onClick={() => navigate('/admin/users')}
							className="flex items-center text-lg text-indigo-700 font-semibold gap-2 cursor-pointer hover:underline"
						>
							<FontAwesomeIcon icon={faChevronLeft} />
							Volver
						</button>
						<button
							onClick={() => {
								setIsEditing(true)
							}}
							className="h-10 w-10 p-2 text-lg flex justify-center items-center rounded-full text-slate-500 hover:bg-slate-300 hover:text-indigo-600 duration-100"
						>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					</div>
					<form onSubmit={handleSubmit} className="flex flex-1 flex-col w-full gap-2 px-6 md:px-0">
						<Input
							name="firstName"
							label="Nombre"
							value={values.firstName}
							onChange={handleChange}
							error={errors.firstName}
							className="col-span-2"
							editable={isEditing}
						/>
						<Input
							name="lastName"
							label="Apellido"
							value={values.lastName}
							onChange={handleChange}
							error={errors.lastName}
							className="col-span-2"
							editable={isEditing}
						/>
						<Input
							name="email"
							label="Correo electrónico"
							value={values.email}
							onChange={handleChange}
							error={errors.email}
							className="col-span-2"
							editable={false}
						/>
						<Input
							name="phoneNumber"
							label="Teléfono"
							type="number"
							value={values.phoneNumber}
							onChange={handleChange}
							error={errors.phoneNumber}
							className="col-span-2"
							editable={isEditing}
						/>
						<Select
							name="role"
							label="Rol"
							value={values.role}
							onChange={(r) => {
								setFieldValue('role', r)
							}}
							error={errors.role}
							className="col-span-2"
							editable={isEditing}
							options={[
								{ id: 0, value: 'ADMIN', label: 'Administrador' },
								{ id: 1, value: 'USER', label: 'Usuario' },
							]}
						/>
						{isEditing && (
							<div className="flex w-full gap-2 items-end flex-1">
								{dirty && !isSubmitting ? (
									<Button secondary onClick={resetForm} fullWidth>
										Limpiar
									</Button>
								) : (
									<Button
										secondary
										onClick={() => {
											setIsEditing(false)
											resetForm()
										}}
										fullWidth
									>
										Cancelar
									</Button>
								)}
								<Button
									fullWidth
									onClick={() => {
										if (dirty) {
											handleSubmit()
										} else {
											setIsEditing(false)
										}
									}}
									isLoading={isSubmitting}
								>
									Guardar
								</Button>
							</div>
						)}
					</form>
				</div>
			) : (
				<div className="flex flex-1 justify-center items-center">
					<Spinner fill="#DB2777" />
				</div>
			)}
		</AdminLayout>
	)
}

export default AdminUser

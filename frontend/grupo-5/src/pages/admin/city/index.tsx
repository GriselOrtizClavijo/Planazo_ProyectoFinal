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
import { useGetCityById, useGetProvinces, useUpdateCity } from 'services/cities'
import { ICreateCityForm, createCitySchema } from 'schemas/cities'
import Select from 'components/form/Select'

const AdminCity = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const updateCity = useUpdateCity()
	const provinces = useGetProvinces()
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const { state } = useContext(SessionContext)

	const city = useGetCityById(id ?? '')

	const { handleSubmit, handleChange, resetForm, values, isSubmitting, setFieldValue, errors, dirty } =
		useFormik<ICreateCityForm>({
			initialValues: {
				name: city.data?.name ?? '',
				province: city.data?.province.id ?? null,
			},
			validationSchema: createCitySchema,
			onSubmit: (formData, { setSubmitting }) => {
				const body = {
					...formData,
					province: formData.province ?? 0,
					id: parseInt(id ?? '0'),
					token: state.user?.token ?? '',
				}

				updateCity.mutate(body, {
					onSuccess: () => {
						city.refetch().then(() => {
							setSubmitting(false)
							setIsEditing(false)
						})
					},
				})
			},
			validateOnChange: false,
		})

	useEffect(() => {
		city.refetch().then((res) => {
			if (res.status === 'success') {
				resetForm({
					values: {
						name: res.data?.name ?? '',
						province: res.data?.province.id ?? null,
					},
				})
			} else {
				navigate('/notFound')
			}
		})
	}, [])

	return (
		<AdminLayout>
			{city.data !== undefined && !city.isFetching ? (
				<div className="w-full max-w-3xl items-center py-6 flex flex-col gap-6 flex-1">
					<div className="flex justify-between items-center gap-2 px-6 md:px-0 w-full">
						<button
							onClick={() => navigate('/admin/cities')}
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
							name="name"
							label="Título"
							value={values.name}
							onChange={handleChange}
							error={errors.name}
							className="col-span-2"
							editable={isEditing}
						/>
						<Select
							name="province"
							label="Provincia"
							value={values.province}
							onChange={(p) => {
								setFieldValue('province', p)
							}}
							isLoading={provinces.isFetching}
							placeholder="Seleccione provincia"
							options={(provinces.data ?? []).map((p) => ({ id: p.id, value: p.id, label: p.name }))}
							editable={isEditing}
							error={errors.province}
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

export default AdminCity

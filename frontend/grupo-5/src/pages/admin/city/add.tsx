import Button from 'components/Button'
import Input from 'components/form/Input'
import Select from 'components/form/Select'
import { SessionContext } from 'contexts/Session'
import { useFormik } from 'formik'
import AdminLayout from 'layouts/AdminLayout'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ICreateCityForm, createCityInitialValuesForm, createCitySchema } from 'schemas/cities'
import { ICreateCategoryReq, useCreateCity, useGetProvinces } from 'services/cities'

const AddCity = () => {
	const navigate = useNavigate()
	const createCity = useCreateCity()
	const provinces = useGetProvinces()
	const { state } = useContext(SessionContext)

	const { handleSubmit, handleChange, resetForm, values, isSubmitting, setFieldValue, errors, dirty } =
		useFormik<ICreateCityForm>({
			initialValues: createCityInitialValuesForm,
			validationSchema: createCitySchema,
			onSubmit: (formData) => {
				const body: ICreateCategoryReq = {
					token: state.user?.token ?? '',
					name: formData.name,
					province: formData.province ?? 0,
				}

				createCity.mutate(body, {
					onSuccess: (res: number) => {
						resetForm()
						navigate('/admin/city/' + res)
					},
				})
			},
			validateOnChange: false,
		})

	return (
		<AdminLayout>
			<div className="w-full max-w-3xl py-10 px-6 flex flex-1 flex-col gap-8">
				<h1 className="text-2xl font-bold">Agregar ciudad</h1>
				<form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2 bg-white p-6 rounded-lg">
					<div className="flex flex-col gap-2 w-full md:flex-row">
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
						/>
						<Input
							name="name"
							label="Nombre"
							value={values.name}
							onChange={handleChange}
							error={errors.name}
							className="col-span-2"
						/>
					</div>
					<div className="gap-4 pt-2 flex flex-1 justify-end flex-col md:flex-row md:items-end md:justify-center">
						{dirty ? (
							<Button fullWidth secondary type="button" onClick={resetForm} disabled={isSubmitting}>
								Limpiar
							</Button>
						) : (
							<Button
								fullWidth
								secondary
								type="button"
								onClick={() => {
									resetForm()
									navigate('/admin/cities')
								}}
							>
								Cancelar
							</Button>
						)}
						<Button
							fullWidth
							type="submit"
							isLoading={isSubmitting}
							disabled={!dirty}
							className="col-span-2 sm:col-span-1"
						>
							Guardar
						</Button>
					</div>
				</form>
			</div>
		</AdminLayout>
	)
}

export default AddCity

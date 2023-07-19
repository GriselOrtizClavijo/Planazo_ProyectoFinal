import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'components/Button'
import ImageFiles from 'components/form/ImageFiles'
import Input from 'components/form/Input'
import TextArea from 'components/form/TextArea'
import { SessionContext } from 'contexts/Session'
import { useFormik } from 'formik'
import AdminLayout from 'layouts/AdminLayout'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ICategoryForm, categoryInitialValuesForm, categorySchema } from 'schemas/categories'
import { useCreateCategory } from 'services/categories'

const AddCategory = () => {
	const navigate = useNavigate()
	const createCategory = useCreateCategory()
	const [previews, setPreviews] = useState<{ url: string; name?: string }[]>([])
	const { state } = useContext(SessionContext)

	const { handleSubmit, handleChange, resetForm, values, isSubmitting, setFieldValue, errors, dirty } =
		useFormik<ICategoryForm>({
			initialValues: categoryInitialValuesForm,
			validationSchema: categorySchema,
			onSubmit: (formData) => {
				const body = new FormData()

				body.append('token', state.user?.token ?? '')

				body.append('image', formData.images[0])
				body.append('title', formData.title)
				body.append('description', formData.description)
				body.append('video', formData.video)

				createCategory.mutate(body, {
					onSuccess: (res: number) => {
						resetForm()
						navigate('/admin/category/' + res)
					},
				})
			},
			validateOnChange: false,
		})

	return (
		<AdminLayout>
			<div className="w-full max-w-3xl py-10 px-6 flex flex-1 flex-col gap-8">
				<h1 className="text-2xl font-bold">Agregar categoría</h1>
				<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg flex-1 flex flex-col gap-2 justify-between">
					<div className="grid grid-cols-2 gap-2">
						<Input
							name="title"
							label="Título"
							value={values.title}
							onChange={handleChange}
							error={errors.title}
							className="col-span-2"
						/>
						<TextArea
							name="description"
							label="Descripción"
							value={values.description}
							onChange={handleChange}
							error={errors.description}
							className="col-span-2"
						/>
						<ImageFiles
							name="images"
							label="Imagen de la categoría"
							placeholder="Seleccionar imagen"
							value={values.images}
							onChange={(files) => {
								setFieldValue('images', files)
							}}
							error={errors.images}
							previews={previews}
							setPreviews={setPreviews}
							maxSizeMB={1.5}
							className="col-span-2"
						/>
						<Input
							name="video"
							icon={<FontAwesomeIcon icon={faLink} />}
							label="Link video"
							value={values.video}
							onChange={handleChange}
							error={errors.video}
							className="col-span-2"
						/>
					</div>
					<div className="gap-4 col-span-2 grid grid-cols-2">
						{dirty ? (
							<Button
								secondary
								type="button"
								onClick={() => {
									resetForm()
									setPreviews([])
								}}
								disabled={isSubmitting}
								className="col-span-2 sm:col-span-1"
							>
								Limpiar
							</Button>
						) : (
							<Button
								secondary
								type="button"
								onClick={() => {
									resetForm()
									navigate('/admin/categories')
								}}
								className="col-span-2 sm:col-span-1"
							>
								Cancelar
							</Button>
						)}
						<Button type="submit" isLoading={isSubmitting} disabled={!dirty} className="col-span-2 sm:col-span-1">
							Guardar
						</Button>
					</div>
				</form>
			</div>
		</AdminLayout>
	)
}

export default AddCategory

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdminLayout from 'layouts/AdminLayout'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from 'components/Spinner'
import { IUpdateCategoryResponse, useGetCategoryById, useUpdateCategory } from 'services/categories'
import Button from 'components/Button'
import Input from 'components/form/Input'
import TextArea from 'components/form/TextArea'
import { useFormik } from 'formik'
import { ICategoryForm, categoryInitialValuesForm, categoryUpdateSchema } from 'schemas/categories'
import { useContext, useEffect, useState } from 'react'
import ImageFiles from 'components/form/ImageFiles'
import { SessionContext } from 'contexts/Session'

const AdminCategory = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const updateCategory = useUpdateCategory()
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [previews, setPreviews] = useState<{ url: string; name?: string }[]>([])
	const { state } = useContext(SessionContext)

	const category = useGetCategoryById(id ?? '')

	const { refetch } = category

	const { handleSubmit, handleChange, resetForm, values, isSubmitting, setFieldValue, errors, dirty, setFieldError } =
		useFormik<ICategoryForm>({
			initialValues: categoryInitialValuesForm,
			validationSchema: categoryUpdateSchema,
			onSubmit: (formData, { setSubmitting }) => {
				if (previews.length > 0) {
					const body = new FormData()

					body.append('token', state.user?.token ?? '')

					body.append('id', (category.data?.id ?? 0).toString())

					if (formData.title !== category.data?.title) {
						body.append('title', formData.title)
					}

					if (formData.description !== category.data?.description) {
						body.append('description', formData.description)
					}

					if (formData.images.length > 0) {
						body.append('image', formData.images[0])
					}

					updateCategory.mutate(body, {
						onSuccess: (res: IUpdateCategoryResponse) => {
							resetForm()
							navigate('/admin/category/' + res.id)
						},
					})
				} else {
					setFieldError('images', 'La imagen es obligatoria')
					setSubmitting(false)
				}
			},
			validateOnChange: false,
		})

	const handleResetForm = () => {
		setPreviews([{ url: category.data?.urlImg ?? '' }])
		resetForm({
			values: {
				...categoryInitialValuesForm,
				title: category.data?.title ?? '',
				description: category.data?.description ?? '',
			},
		})
	}

	useEffect(() => {
		refetch().then((res) => {
			if (res.status === 'success') {
				setPreviews([{ url: res.data.urlImg }])
				resetForm({
					values: {
						...categoryInitialValuesForm,
						title: res.data?.title ?? '',
						description: res.data?.description ?? '',
					},
				})
			} else {
				navigate('/notFound')
			}
		})
	}, [])

	return (
		<AdminLayout>
			{category.data !== undefined && !category.isFetching ? (
				<div className="w-full max-w-3xl items-center py-6 flex flex-col gap-6 flex-1">
					<div className="flex justify-between items-center gap-2 px-6 md:px-0 w-full">
						<button
							onClick={() => navigate('/admin/categories')}
							className="flex items-center text-lg text-indigo-700 font-semibold gap-2 cursor-pointer hover:underline"
						>
							<FontAwesomeIcon icon={faChevronLeft} />
							Volver
						</button>
						{/* <div className="flex gap-2">
							<button
								onClick={() => navigate('/')}
								className="h-10 w-10 p-2 text-lg flex justify-center items-center rounded-full text-slate-500 hover:bg-slate-300 hover:text-indigo-600 duration-100"
							>
								<FontAwesomeIcon icon={faEye} />
							</button>
							<button
								onClick={() => {
									setIsEditing(true)
								}}
								className="h-10 w-10 p-2 text-lg flex justify-center items-center rounded-full text-slate-500 hover:bg-slate-300 hover:text-indigo-600 duration-100"
							>
								<FontAwesomeIcon icon={faPenToSquare} />
							</button>
						</div> */}
					</div>
					<form onSubmit={handleSubmit} className="flex flex-1 flex-col w-full gap-2 px-6 md:px-0">
						<Input
							name="title"
							label="Título"
							value={values.title}
							onChange={handleChange}
							error={errors.title}
							className="col-span-2"
							editable={isEditing}
						/>
						<TextArea
							name="description"
							label="Descripción"
							value={values.description}
							onChange={handleChange}
							error={errors.description}
							className="col-span-2"
							editable={isEditing}
						/>
						<ImageFiles
							name="images"
							label="Imagen de la categoría"
							placeholder="Seleccionar imagen"
							value={values.images}
							onChange={(files) => {
								setFieldValue('images', files)
							}}
							previews={previews}
							setPreviews={setPreviews}
							error={errors.images}
							className="col-span-2"
							maxSizeMB={1.5}
							editable={isEditing}
						/>
						{isEditing && (
							<div className="flex w-full gap-2 items-end flex-1">
								{dirty && !isSubmitting ? (
									<Button
										secondary
										onClick={() => {
											handleResetForm()
										}}
										fullWidth
									>
										Limpiar
									</Button>
								) : (
									<Button
										secondary
										onClick={() => {
											setIsEditing(false)
											handleResetForm()
										}}
										fullWidth
									>
										Cancelar
									</Button>
								)}
								<Button
									fullWidth
									onClick={() => {
										if (dirty || previews.length === 0) {
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

export default AdminCategory

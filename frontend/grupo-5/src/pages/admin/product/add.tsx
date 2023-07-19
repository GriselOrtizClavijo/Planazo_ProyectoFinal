import { faChevronLeft, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'components/Button'
import Map from 'components/Map'
import ImageFiles from 'components/form/ImageFiles'
import Input from 'components/form/Input'
import MultiSelect from 'components/form/MultiSelect'
import Select from 'components/form/Select'
import TextArea from 'components/form/TextArea'
import { SessionContext } from 'contexts/Session'
import { useFormik } from 'formik'
import AdminLayout from 'layouts/AdminLayout'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IProductForm, productInitialValuesForm, productSchema } from 'schemas/products'
import { useGetCategories } from 'services/categories'
import { useGetCharacteristics } from 'services/characteristics'
import { useGetCitiesByprovince, useGetProvinces } from 'services/cities'
import { useCreateProduct } from 'services/products'
import DotLocation from 'assets/img/DotLocation.svg'

const AddProduct = () => {
	const categories = useGetCategories()
	const characteristics = useGetCharacteristics()
	const navigate = useNavigate()
	const createProduct = useCreateProduct()
	const [previews, setPreviews] = useState<{ url: string; name?: string }[]>([])
	const { state } = useContext(SessionContext)

	const { handleSubmit, handleChange, resetForm, values, isSubmitting, setFieldValue, errors } =
		useFormik<IProductForm>({
			initialValues: productInitialValuesForm,
			validationSchema: productSchema,
			onSubmit: (formData) => {
				const body = new FormData()
				body.append('token', state.user?.token ?? '')

				formData.images.forEach((img, i) => {
					body.append('img-' + i, img, img.name)
				})

				formData.categories.forEach((cat, i) => {
					body.append('cat-' + i, cat)
				})

				formData.characteristics.forEach((cat, i) => {
					body.append('char-' + i, cat)
				})

				body.append('title', formData.title)
				body.append('city', (formData.city ?? '').toString())
				body.append('adultPrice', formData.adultPrice.toString())
				body.append('minorPrice', formData.minorPrice.toString())
				body.append('description', formData.description)
				body.append('lat', (formData.lat ?? 0).toString())
				body.append('lng', (formData.lng ?? 0).toString())

				createProduct.mutate(body, {
					onSuccess: (res: number) => {
						resetForm()
						navigate('/admin/product/' + res)
					},
				})
			},
			validateOnChange: false,
		})

	const provinces = useGetProvinces()
	const cities = useGetCitiesByprovince(values.province)

	return (
		<AdminLayout>
			<div className="w-full max-w-3xl py-10 px-6 flex flex-col gap-8">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center justify-center text-lg text-indigo-700 font-semibold gap-2 cursor-pointer w-10 h-10 p-2 hover:bg-slate-300 rounded-full hover:underline"
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<h1 className="text-2xl font-bold">Agregar producto</h1>
				</div>
				<form onSubmit={handleSubmit} className="addProduct-form">
					<Input
						name="title"
						label="Título"
						placeholder="Ingrese un título para el producto"
						value={values.title}
						onChange={handleChange}
						className="col-span-2"
						error={errors.title}
					/>
					<Select
						name="province"
						label="Provincia"
						value={values.province}
						onChange={(p) => {
							setFieldValue('province', p)
							setFieldValue('city', null)
						}}
						className="addProduct-form-item"
						placeholder="Seleccione provincia"
						isLoading={provinces.isFetching}
						options={(provinces.data ?? []).map((p) => ({ id: p.id, value: p.id, label: p.name }))}
						error={errors.province}
					/>
					<Select
						name="city"
						label="Ciudad"
						value={values.city}
						onChange={(c) => {
							setFieldValue('city', c)
						}}
						className="addProduct-form-item"
						placeholder="Seleccione ciudad"
						isLoading={cities.isFetching}
						options={(cities.data ?? []).map((c) => ({ id: c.id, value: c.id, label: c.name }))}
						error={errors.city}
					/>
					<MultiSelect
						name="categories"
						placeholder="Seleccione una o varias categorías"
						options={(categories.data ?? []).map((c) => ({ id: c.id, value: c.id, label: c.title }))}
						label="Categoría/s"
						isLoading={categories.isLoading}
						value={values.categories}
						onChange={(cats) => {
							setFieldValue('categories', cats)
						}}
						className="col-span-2"
						error={errors.categories}
					/>
					<MultiSelect
						name="characteristics"
						placeholder="Seleccione una o varias características"
						options={(characteristics.data ?? []).map((c) => ({ id: c.id, value: c.id, label: c.title }))}
						label="Característica/s"
						isLoading={characteristics.isLoading}
						value={values.characteristics}
						onChange={(chars) => {
							setFieldValue('characteristics', chars)
						}}
						className="col-span-2"
						error={errors.characteristics}
					/>
					<Input
						name="adultPrice"
						type="number"
						label="Precio por adulto"
						value={values.adultPrice}
						onChange={handleChange}
						icon={<FontAwesomeIcon icon={faDollarSign} />}
						className="addProduct-form-item"
						error={errors.adultPrice}
					/>
					<Input
						name="minorPrice"
						type="number"
						label="Precio por menor"
						value={values.minorPrice}
						onChange={handleChange}
						icon={<FontAwesomeIcon icon={faDollarSign} />}
						className="addProduct-form-item"
						error={errors.minorPrice}
					/>
					<TextArea
						name="description"
						label="Descripción"
						value={values.description}
						onChange={handleChange}
						className="col-span-2"
						error={errors.description}
					/>
					<div className="flex w-full flex-col h-80 gap-1 col-span-2">
						<span className="text-sm font-semibold">Ubicación</span>
						<Map
							className="rounded-lg overflow-hidden"
							handleSetMarker={(location) => {
								setFieldValue('lat', location.lat)
								setFieldValue('lng', location.lng)
							}}
							customMarker={DotLocation}
						/>
						<span className="font-semibold text-red-500 text-sm min-h-[16px]">{errors.lat ?? ''}</span>
					</div>
					<ImageFiles
						name="images"
						multiple
						max={5}
						label="Imagen del producto"
						placeholder="Seleccionar imágenes"
						value={values.images}
						onChange={(files) => {
							setFieldValue('images', files)
						}}
						className="col-span-2"
						previews={previews}
						setPreviews={setPreviews}
						maxSizeMB={1.5}
						error={errors.images}
					/>
					<div className="grid gap-4 col-span-2 pt-2 addProduct-form-container-item">
						<Button
							secondary
							type="button"
							onClick={() => {
								resetForm()
								setPreviews([])
							}}
							disabled={isSubmitting}
							className="addProduct-form-item"
						>
							Limpiar
						</Button>
						<Button type="submit" isLoading={isSubmitting} className="addProduct-form-item">
							Guardar
						</Button>
					</div>
				</form>
			</div>
		</AdminLayout>
	)
}

export default AddProduct

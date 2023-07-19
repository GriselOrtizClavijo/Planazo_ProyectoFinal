import { FC, useEffect, useState } from 'react'
import DatePicker from './form/DatePicker'
import Search from './form/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from './Button'
import { useFormik } from 'formik'
import { IProductSearchForm, productSearchInitialValuesForm } from 'schemas/products'
import { useGetCities } from 'services/cities'
import { format } from 'date-fns'
import { faLocationDot, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useGetCategories } from 'services/categories'
import CategoryPill from './CategoryPill'

interface ISearchProducts {
	onSearch: (arg: IProductSearchForm) => void
	className?: string
	defaultState?: {
		city?: number
		cityName?: string
		dateStart?: string
		dateEnd?: string
		idCategory?: number[]
	}
	disableCategories?: boolean
	isLoading?: boolean
}

const SearchProducts: FC<ISearchProducts> = ({
	onSearch,
	className = '',
	defaultState,
	disableCategories = false,
	isLoading = false,
}) => {
	const [errorSearch, setErrorSearch] = useState<string>()
	const [citySearch, setCitySearch] = useState('')
	const cities = useGetCities({ ...(citySearch !== '' && { name: citySearch }) })
	const categories = useGetCategories()

	const handleCategorySelect = async (category: number) => {
		if (!values.idCategory.includes(category)) {
			const newCategories = [...values.idCategory]
			newCategories.push(category)
			setFieldValue('idCategory', newCategories)
		} else {
			setFieldValue(
				'idCategory',
				values.idCategory.filter((c) => c !== category),
			)
		}
	}

	const { handleSubmit, setFieldValue, values } = useFormik<IProductSearchForm>({
		initialValues: {
			city: defaultState?.city ?? productSearchInitialValuesForm.city,
			dateStart: defaultState?.dateStart ?? productSearchInitialValuesForm.dateStart,
			dateEnd: defaultState?.dateEnd ?? productSearchInitialValuesForm.dateEnd,
			idCategory: defaultState?.idCategory ?? productSearchInitialValuesForm.idCategory,
			cityName: defaultState?.cityName ?? productSearchInitialValuesForm.cityName,
		},
		onSubmit: (formData) => {
			if (formData.city !== null || formData.dateStart !== null || location.pathname.includes('/products')) {
				setErrorSearch(undefined)
				onSearch(formData)
			} else {
				console.log(location.pathname)

				setErrorSearch('Debes filtrar por algún campo')
			}
		},
		validateOnChange: false,
	})

	useEffect(() => {
		if (citySearch !== '') {
			cities.refetch().then((res) => {
				if (res.status === 'error') {
					cities.remove()
				}
			})
		}
	}, [citySearch])

	return (
		<form
			onSubmit={handleSubmit}
			className={'flex flex-col w-full gap-4 ' + (disableCategories ? 'md:flex-row ' : '') + className}
		>
			<div className={'flex flex-col w-full gap-4 ' + (disableCategories ? 'grid md:grid-cols-2 ' : '')}>
				<DatePicker
					name="dateRange"
					label="Fechas"
					validation={false}
					defaultSelected={
						defaultState?.dateEnd !== undefined && defaultState?.dateStart !== undefined
							? {
									from: new Date(defaultState?.dateStart + 'T06:00:00'),
									to: new Date(defaultState?.dateEnd + 'T06:00:00'),
							  }
							: undefined
					}
					placeholder="Elige el rango de fechas"
					min={3}
					handleSelect={(range) => {
						setFieldValue('dateStart', range?.from !== undefined ? format(range.from, 'yyyy-MM-dd') : null)
						setFieldValue('dateEnd', range?.to !== undefined ? format(range.to, 'yyyy-MM-dd') : null)
						setErrorSearch(undefined)
					}}
					handleClear={() => {
						setFieldValue('dateStart', null)
						setFieldValue('dateEnd', null)
					}}
				/>
				<Search
					label="Ubicación"
					name="cityName"
					defaultValue={defaultState?.cityName ?? ''}
					icon={<FontAwesomeIcon icon={faLocationDot} />}
					placeholder="Busca por ciudad"
					options={(cities.data ?? []).map((c) => ({ id: c.id, value: c.id, label: c.name }))}
					handleDebounceChange={(search) => setCitySearch(search)}
					handleSelectOption={(option) => {
						setFieldValue('city', option.value)
						setFieldValue('cityName', option.label)
						setErrorSearch(undefined)
					}}
					isLoading={cities.isFetching}
					validation={false}
					handleClear={() => {
						setFieldValue('city', null)
						setFieldValue('cityName', '')
					}}
				/>
				{!disableCategories && (
					<div className="flex flex-col gap-2 w-full md:col-span-2">
						<span className="text-sm font-semibold">Categorías</span>
						<div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar lg:flex-wrap">
							{categories.isFetching ? (
								Array.from({ length: 3 }).map((_, index) => (
									<div
										key={index}
										className="flex items-center gap-2 w-[80px] h-[34px] bg-slate-100 border-slate-400 border rounded-full animate-pulse"
									/>
								))
							) : categories.data !== undefined ? (
								categories.data.map((cat) => (
									<CategoryPill
										key={cat.id}
										id={cat.id}
										label={cat.title}
										selected={values.idCategory.includes(cat.id)}
										handleSelect={handleCategorySelect}
									/>
								))
							) : (
								<span className="h-[30] text-slate-500">No existen filtros</span>
							)}
						</div>
					</div>
				)}
			</div>
			<div className={'flex flex-col items-center gap-1 md:min-w-[200px] ' + (disableCategories ? 'md:mt-6' : '')}>
				<Button isLoading={isLoading} fullWidth type="submit">
					<FontAwesomeIcon icon={faSearch} />
					<span>Buscar</span>
				</Button>
				{errorSearch !== undefined && <span className="text-sm text-red-500 font-semibold">{errorSearch}</span>}
			</div>
		</form>
	)
}

export default SearchProducts

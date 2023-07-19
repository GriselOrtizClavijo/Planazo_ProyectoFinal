import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGetCategories } from 'services/categories'
import CategoryPill from './CategoryPill'
import { IFilterParams } from 'services/products'
import { FC, useState } from 'react'

interface IFilters {
	queryParams: IFilterParams
	handleCategory: (arg: number[]) => void
}

const Filters: FC<IFilters> = ({ queryParams, handleCategory }) => {
	const categories = useGetCategories()

	const [categoriesSelected, setCategoriesSelected] = useState<number[]>(
		queryParams.idCategory !== undefined
			? typeof queryParams.idCategory === 'number'
				? [queryParams.idCategory]
				: queryParams.idCategory
			: [],
	)

	const handleCategorySelect = async (category: number) => {
		if (!categoriesSelected.includes(category)) {
			const newCategories = [...categoriesSelected]
			newCategories.push(category)
			setCategoriesSelected(newCategories)
			handleCategory(newCategories)
		} else {
			setCategoriesSelected(categoriesSelected.filter((c) => c !== category))
			handleCategory(categoriesSelected.filter((c) => c !== category))
		}
	}

	return (
		<div className="flex flex-col w-full bg-white gap-3 p-5 rounded-xl shadow-lg">
			<div className="flex items-center gap-2 pr-1">
				<FontAwesomeIcon icon={faFilter} className="text-indigo-500" />
				<h3 className="text-xl font-semibold">Filtros</h3>
			</div>
			<div className="flex flex-col gap-2 w-full">
				<h4 className="font-semibold">Categorías</h4>
				<div className="flex items-center gap-2 px-6 overflow-x-auto pb-4">
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
								selected={categoriesSelected.includes(cat.id)}
								handleSelect={handleCategorySelect}
							/>
						))
					) : (
						<span className="h-[30] text-slate-500">No existen filtros</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default Filters

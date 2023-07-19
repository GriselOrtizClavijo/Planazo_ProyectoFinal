import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { IPagination } from 'services/products'

interface IPaginationComponent extends IPagination {
	className?: string
	handleNextPage: () => void
	handlePreviousPage: () => void
}

const Pagination: FC<Omit<IPaginationComponent, 'total_elements'>> = ({
	className,
	total_pages,
	current_page,
	next_page,
	previous_page,
	handleNextPage,
	handlePreviousPage,
}) => {
	return (
		<div className={'flex flex-1 justify-center items-end px-6 lg:px-0 ' + className}>
			<div className="flex items-center w-full justify-between gap-2">
				{previous_page !== null ? (
					<button onClick={handlePreviousPage} className="flex items-center gap-2 text-indigo-800 font-semibold">
						<FontAwesomeIcon icon={faChevronLeft} />
						<span>Anterior</span>
					</button>
				) : (
					<div className="w-[86px]" />
				)}
				<div className="flex items-center gap-2">
					<span className="flex justify-center items-center bg-slate-300 w-10 font-semibold h-10 rounded-md">
						{current_page}
					</span>
					<span className="text-slate-600">de</span>
					<span className="text-slate-600">{total_pages}</span>
				</div>
				{next_page !== null ? (
					<button onClick={handleNextPage} className="flex items-center gap-2 text-indigo-800 font-semibold">
						<span>Siguiente</span>
						<FontAwesomeIcon icon={faChevronLeft} className="rotate-180" />
					</button>
				) : (
					<div className="w-[86px]" />
				)}
			</div>
		</div>
	)
}

export default Pagination

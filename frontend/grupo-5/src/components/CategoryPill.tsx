import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'

interface ICategoryPill {
	id: number
	label: string
	selected: boolean
	handleSelect: (arg: number) => void
}

const CategoryPill: FC<ICategoryPill> = ({ id, label, selected = false, handleSelect }) => {
	return (
		<button
			type="button"
			className={
				'flex items-center gap-2 px-3 py-1 border duration-200 rounded-full ' +
				(selected ? 'border-pink-800 bg-pink-800 text-white' : 'bg-slate-100 border-slate-400')
			}
			onClick={() => {
				handleSelect(id)
			}}
		>
			<span className="whitespace-nowrap">{label}</span>
			<FontAwesomeIcon icon={faXmark} className={!selected ? 'hidden' : ''} />
		</button>
	)
}

export default CategoryPill

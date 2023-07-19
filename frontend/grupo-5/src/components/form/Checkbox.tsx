import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'

interface ICheckbox {
	name: string
	label: string
	value: boolean
	onChange: (value: boolean) => void
	className?: string
	error?: any
	editable?: boolean
}

export const Checkbox: FC<ICheckbox> = ({
	name,
	value = false,
	onChange,
	label,
	className,
	error,
	editable = true,
}) => {
	const handleChange = () => {
		onChange(!value)
	}

	return (
		<div
			className={
				'w-full flex items-center gap-2 p-2 rounded-md ' +
				(error !== undefined ? 'border-2 border-red-400 outline-red-500 ' : '') +
				(className ?? '')
			}
		>
			<input id={name} type="checkbox" value={value ? 0 : 1} className="accent-indigo-700 hidden" />
			<button
				type="button"
				disabled={!editable}
				onClick={handleChange}
				className={
					'w-5 h-5 min-w-[20px] text-sm text-white cursor-pointer rounded-md border  flex justify-center items-center hover:shadow-md duration-200 ' +
					(value ? 'bg-indigo-700 border-indigo-700' : 'bg-white border-slate-300')
				}
			>
				{value && <FontAwesomeIcon icon={faCheck} />}
			</button>
			<label htmlFor={name} className="text-sm font-medium text-justify">
				{label}
			</label>
		</div>
	)
}

export default Checkbox

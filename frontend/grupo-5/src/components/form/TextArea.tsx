import { FC } from 'react'

interface ITextArea {
	name: string
	label: string
	placeholder?: string
	value: string
	onChange: (e: any) => void
	className?: string
	error?: any
	editable?: boolean
}

const TextArea: FC<ITextArea> = ({ name, label, placeholder, value, onChange, className, error, editable = true }) => {
	return (
		<div className={'flex w-full flex-col gap-1 ' + (className ?? '')}>
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			{editable ? (
				<textarea
					rows={4}
					value={value}
					onChange={onChange}
					id={name}
					placeholder={placeholder}
					className={
						'bg-slate-100 rounded-md py-2 px-3 w-full' +
						(error !== undefined
							? ' border-2 border-red-400 outline-red-500'
							: ' border border-slate-200 outline-indigo-500')
					}
				/>
			) : (
				<p className="rounded-md py-2 w-full">{value}</p>
			)}
			<span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>
		</div>
	)
}

export default TextArea

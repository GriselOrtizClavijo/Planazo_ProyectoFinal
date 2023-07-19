import { FC, ReactNode } from 'react'

interface IInput {
	name: string
	label: string
	type?: React.HTMLInputTypeAttribute
	placeholder?: string
	value: any
	onChange: (e: any) => void
	icon?: ReactNode
	className?: string
	error?: any
	editable?: boolean
	validation?: boolean
}

const Input: FC<IInput> = ({
	name,
	label,
	type = 'text',
	placeholder,
	value,
	onChange,
	icon,
	className,
	error,
	editable = true,
	validation = true,
}) => {
	return (
		<div className={'flex w-full flex-col gap-1 relative ' + (className ?? '')}>
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			<div className="relative w-full">
				{icon !== undefined && (
					<div className="absolute top-[55%] -translate-y-[55%] left-4 text-slate-400">{icon}</div>
				)}
				{editable ? (
					<input
						type={type}
						id={name}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						className={
							'bg-slate-100 rounded-md h-12 py-2 w-full' +
							(icon !== undefined ? ' pl-10 pr-3' : ' px-3') +
							(error !== undefined
								? ' border-2 border-red-400 outline-red-500'
								: ' border border-slate-200 outline-indigo-500')
						}
					/>
				) : (
					<span className={'leading-none flex items-center rounded-md h-12 py-2 w-full'}>{value}</span>
				)}
			</div>
			{validation && <span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>}
		</div>
	)
}

export default Input

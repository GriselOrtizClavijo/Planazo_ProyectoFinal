import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Transition } from '@headlessui/react'
import { FC, ReactNode } from 'react'

interface IOption {
	id: number
	value: string | number
	label: string
}

interface IMultiSelect {
	name: string
	label?: string
	placeholder?: string
	isLoading?: boolean
	options: IOption[]
	value: any[]
	onChange: (e: any) => void
	icon?: ReactNode
	inputRef?: any
	error?: any
	className?: string
}

const MultiSelect: FC<IMultiSelect> = ({
	name,
	label,
	placeholder,
	options = [],
	value,
	onChange,
	icon,
	inputRef,
	error,
	className,
}) => {
	const unselectItem = ({ e, item }: { e?: any; item: string | number }) => {
		if (e !== undefined) {
			e.preventDefault()
		}
		onChange(value.filter((op: string | number) => op !== item))
	}

	return (
		<div className={'flex w-full flex-col gap-1 ' + (className ?? '')}>
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			<div className="relative">
				<div className="absolute top-0 bottom-0 left-0 flex items-center pl-4 text-slate-400">{icon}</div>
				<Listbox value={value} onChange={onChange} multiple>
					{({ open }) => (
						<>
							<Listbox.Button
								ref={inputRef}
								className={
									'py-2 w-full min-h-[48px] flex flex-wrap items-center gap-2 text-left cursor-default rounded-md bg-slate-100 outline-indigo-500 ' +
									(icon !== undefined ? ' pl-10 pr-3' : ' p-3') +
									(error !== undefined ? ' border-2 border-red-400' : ' border border-slate-200') +
									(value.length > 0 ? ' text-slate-800' : ' text-slate-500')
								}
							>
								{value.length > 0 ? (
									<>
										{value.map((item: string | number) => (
											<div
												key={item}
												className="text-sm py-1 px-2 bg-white border border-slate-300 rounded-md flex items-center gap-2"
											>
												<span className="whitespace-nowrap">{options.find((op) => op.value === item)?.label}</span>
												<div
													role="button"
													tabIndex={0}
													onKeyDown={(event) => {
														if (event.key === 'Enter' || event.key === ' ') {
															unselectItem({ item })
														}
													}}
													className="px-1 cursor-pointer"
													onClick={(e: any) => {
														unselectItem({ e, item })
													}}
												>
													<FontAwesomeIcon icon={faXmark} className="text-slate-600 pointer-events-none" width={10} />
												</div>
											</div>
										))}
									</>
								) : (
									<span className="text-gray-400">{placeholder}</span>
								)}
							</Listbox.Button>
							<Transition
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0"
								className="z-10 relative"
							>
								{open && (
									<Listbox.Options
										static
										className={
											'absolute top-13 left-0 right-0 rounded-md mt-1 bg-white cursor-pointer focus:outline-none border border-slate-300 max-h-[290px] overflow-y-auto'
										}
									>
										{options
											.filter((op) => !(value as any[]).includes(op.value))
											.map((op) => (
												<Listbox.Option
													key={op.value}
													value={op.value}
													className={'p-3 hover:bg-slate-100 flex gap-2 items-center '}
												>
													<span>{op.label}</span>
												</Listbox.Option>
											))}
									</Listbox.Options>
								)}
							</Transition>
							<div
								className={
									'pointer-events-none absolute top-4 right-2 flex items-center px-2 text-indigo-400 ' +
									(open ? 'rotate-180' : '')
								}
							>
								<FontAwesomeIcon icon={faChevronDown} className="text-indigo-800" />
							</div>
						</>
					)}
				</Listbox>
			</div>
			<span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>
		</div>
	)
}

export default MultiSelect

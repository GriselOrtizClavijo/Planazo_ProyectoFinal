import { faChevronDown, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import { FC, ReactNode } from 'react'

interface IOption {
	id: number
	value: string | number
	label: string
}

interface ISelect {
	name: string
	label?: string
	placeholder?: string
	isLoading?: boolean
	options: IOption[]
	value: any
	onChange: (e: any) => void
	className?: string
	icon?: ReactNode
	inputRef?: any
	error?: any
	direction?: 'top' | 'down'
	editable?: boolean
}

const Select: FC<ISelect> = ({
	name,
	label,
	placeholder,
	isLoading = false,
	options = [],
	value,
	onChange,
	className,
	icon,
	inputRef,
	error,
	direction = 'down',
	editable = true,
}) => {
	return (
		<div className={'flex w-full flex-col gap-1 ' + (className ?? '')}>
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			<div className="relative w-full">
				<div className="absolute top-0 bottom-0 left-0 flex items-center pl-4 text-slate-400">{icon}</div>
				<Listbox value={value} onChange={onChange} disabled={!editable}>
					{({ open }) =>
						editable ? (
							<>
								<Listbox.Button
									ref={inputRef}
									as="button"
									className={
										'py-2 w-full bg-slate-100 flex items-center gap-2 text-left rounded-md h-12 focus:outline-none focus:ring-[1.5px] focus:ring-indigo-400 ' +
										(icon !== undefined ? ' pl-10 pr-3' : ' p-3') +
										(error !== undefined ? ' border-2 border-red-400' : ' border border-slate-200') +
										(value !== '' ? ' text-slate-800' : ' text-slate-500') +
										(isLoading ? ' cursor-default' : ' cursor-pointer')
									}
								>
									{isLoading ? (
										<div className="py-2 px-3 w-full flex justify-center items-center">
											<Spinner className="h-[26px] w-[26px]" />
										</div>
									) : (
										<>
											{value !== null ? (
												<span>{options.find((op) => op.value === value)?.label}</span>
											) : (
												<span className="text-gray-400">{placeholder}</span>
											)}
										</>
									)}
								</Listbox.Button>
								<Transition
									enter="transition duration-100 ease-out"
									enterFrom="transform scale-95 opacity-0"
									enterTo="transform scale-100 opacity-100"
									leave="transition duration-75 ease-out"
									leaveFrom="transform scale-100 opacity-100"
									leaveTo="transform scale-95 opacity-0"
									className="relative z-50"
								>
									{open && (
										<Listbox.Options
											static
											className={
												'absolute left-0 right-0 rounded-md mt-2 bg-slate-100 shadow-lg cursor-pointer ring-1 ring-black ring-opacity-5 focus:outline-none focus:ring-[1px] focus:ring-slate-300 max-h-[290px] overflow-y-auto text-base sm:text-sm ' +
												(direction === 'top' ? 'bottom-full mb-14' : '')
											}
										>
											{options.map((op) => (
												<Listbox.Option
													key={op.id}
													value={op.value}
													className={({ active }) =>
														'relative p-3 flex gap-2 items-center select-none cursor-pointer ' +
														(active ? 'bg-indigo-600 text-white' : 'text-gray-900')
													}
												>
													{({ selected, active }) => (
														<>
															<span className={'block truncate' + (selected ? 'font-medium' : 'font-normal')}>
																{op.label}
															</span>
															{selected ? (
																<span
																	className={
																		'absolute inset-y-0 right-0 flex items-center pr-3 ' +
																		(active ? 'text-white' : 'text-indigo-600')
																	}
																>
																	<FontAwesomeIcon icon={faCircleCheck} />
																</span>
															) : null}
														</>
													)}
												</Listbox.Option>
											))}
										</Listbox.Options>
									)}
								</Transition>
								{!isLoading && editable && (
									<div
										className={
											'pointer-events-none text-indigo-800 absolute top-4 right-2 flex items-center px-2 ' +
											(open ? 'rotate-180' : '')
										}
									>
										<FontAwesomeIcon icon={faChevronDown} />
									</div>
								)}
							</>
						) : (
							<span className="py-2 w-full flex items-center text-left h-12">
								{options.find((op) => op.value === value)?.label}
							</span>
						)
					}
				</Listbox>
			</div>
			<span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>
		</div>
	)
}

export default Select

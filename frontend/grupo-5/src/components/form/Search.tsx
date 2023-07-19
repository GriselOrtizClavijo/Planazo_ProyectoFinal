import { faCircleCheck, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Combobox, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'

interface IOption {
	id: number
	value: any
	label: string
}

interface ISearch {
	name: string
	label?: string
	placeholder?: string
	handleDebounceChange?: (e: any) => void
	handleSelectOption?: (e: any) => void
	className?: string
	error?: any
	isLoading?: boolean
	delay?: number
	options: IOption[]
	inputRef?: React.MutableRefObject<HTMLInputElement | null>
	validation?: boolean
	icon?: ReactNode
	handleClear?: () => void
	defaultValue?: string
}

const Search: FC<ISearch> = ({
	name,
	label,
	placeholder,
	className,
	error,
	isLoading = false,
	delay = 500,
	handleDebounceChange,
	handleSelectOption,
	options = [],
	inputRef,
	validation = false,
	icon,
	handleClear,
	defaultValue,
}) => {
	const [value, setValue] = useState(defaultValue ?? '')
	const [optionSelected, setOptionSelected] = useState<IOption | null>(null)
	const debouncedValue = useDebounce<string>(value, delay)

	useEffect(() => {
		if (handleDebounceChange !== undefined) {
			handleDebounceChange(debouncedValue)
		}
	}, [debouncedValue])

	const onSelectOption = (option: IOption) => {
		setOptionSelected(option)
		if (handleSelectOption) {
			handleSelectOption(option)
		}
	}

	const onClear = () => {
		setOptionSelected(null)
		setValue('')
		if (handleClear) {
			handleClear()
		}
	}

	return (
		<div className={'flex w-full flex-col gap-1 relative ' + (className ?? '')}>
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			<Combobox value={optionSelected} onChange={onSelectOption}>
				<div className="relative">
					<div className="absolute top-[55%] -translate-y-[55%] left-4 text-slate-400">
						{icon ?? <FontAwesomeIcon icon={faSearch} />}
					</div>
					<Combobox.Input
						ref={inputRef}
						value={value}
						id={name}
						className={
							'bg-slate-100 rounded-md h-12 py-2 px-10 w-full' +
							(error !== undefined
								? ' border-2 border-red-400 outline-red-500'
								: ' border border-slate-200 outline-indigo-500')
						}
						placeholder={placeholder}
						displayValue={(item: IOption) => (item !== null && defaultValue === undefined ? item.label : value)}
						onChange={(event) => setValue(event.target.value)}
					/>
					{optionSelected !== null && !isLoading && (
						<button
							onClick={onClear}
							type="button"
							className="absolute top-[55%] right-2 -translate-y-[55%] flex cursor-pointer justify-center items-center hover:bg-slate-200 w-8 h-8 rounded-full text-slate-400"
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					)}
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						afterLeave={() => setValue(optionSelected?.label ?? '')}
					>
						<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{options.length === 0 ? (
								<div className="relative cursor-default select-none py-3 px-4 text-gray-700">Sin resultados</div>
							) : (
								options.map((item) => (
									<Combobox.Option
										key={item.id}
										className={({ active }) =>
											`relative cursor-pointer select-none py-3 pl-10 pr-4 ${
												active ? 'bg-indigo-600 text-white' : 'text-gray-900'
											}`
										}
										value={item}
									>
										{({ selected, active }) => (
											<>
												<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
													{item.label}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
															active ? 'text-white' : 'text-indigo-600'
														}`}
													>
														<FontAwesomeIcon icon={faCircleCheck} />
													</span>
												) : null}
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
					{isLoading && (
						<div className="absolute top-[55%] -translate-y-[55%] right-2 w-8 h-8 p-1">
							<Spinner className="h-full w-full text-slate-300" />
						</div>
					)}
				</div>
			</Combobox>
			{validation && <span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>}
		</div>
	)
}

export default Search

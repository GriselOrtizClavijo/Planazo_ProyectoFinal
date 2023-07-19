import { format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { FC, Fragment, useEffect, useState } from 'react'
import 'react-day-picker/dist/style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Popover, Transition } from '@headlessui/react'
import Button from 'components/Button'
import { DayPicker } from 'react-day-picker'
import { useWindowSize } from 'usehooks-ts'

type DateRange = {
	from: Date | undefined
	to?: Date | undefined
}

interface IDatePicker {
	label: string
	name: string
	error?: any
	validation?: boolean
	placeholder?: string
	defaultSelected?: DateRange
	disabled?: DateRange[]
	handleSelect: (e: DateRange | undefined) => void
	handleClear?: () => void
	min?: number
	max?: number
	editable?: boolean
}

const DatePicker: FC<IDatePicker> = ({
	label,
	error,
	placeholder,
	defaultSelected,
	disabled,
	handleSelect = () => null,
	handleClear,
	validation = true,
	editable = true,
}) => {
	const disabledDays = [{ from: new Date(1995, 3, 7), to: subDays(new Date(), 1) }]
	disabled?.forEach((d) => {
		if (d.from !== undefined && d.to !== undefined) {
			disabledDays.push({ from: d.from, to: d.to })
		}
	})

	const { width } = useWindowSize()

	const [range, setRange] = useState<DateRange | undefined>(defaultSelected)
	const [value, setValue] = useState('')

	useEffect(() => {
		if (range?.from !== undefined && range.to !== undefined) {
			setValue(format(range.from, 'dd/MM/yyyy') + ' - ' + format(range.to, 'dd/MM/yyyy'))
		}
	}, [range])

	const onClear = () => {
		setRange({
			from: undefined,
			to: undefined,
		})
		setValue('')
		if (handleClear) {
			handleClear()
		}
	}

	return (
		<Popover className={'flex w-full flex-col gap-1 ' + (width > 430 ? 'relative' : '')}>
			<span className="text-sm font-semibold">{label}</span>
			<div className="relative w-full">
				{editable ? (
					<>
						<Popover.Button
							className={
								'bg-slate-100 rounded-md whitespace-nowrap text-ellipsis h-12 py-2 pl-10 pr-3 flex items-center w-full' +
								(placeholder !== undefined && value === '' ? ' text-slate-400' : '') +
								(error !== undefined
									? ' border-2 border-red-400 outline-red-500'
									: ' border border-slate-200 outline-indigo-500')
							}
						>
							{value !== '' ? value : placeholder}
							<div className="absolute left-4 top-4 flex cursor-pointer justify-center items-center text-slate-400">
								<FontAwesomeIcon icon={faCalendar} className="" />
							</div>
						</Popover.Button>
						{value !== '' && (
							<button
								onClick={onClear}
								type="button"
								className="absolute right-2 top-2 flex cursor-pointer justify-center items-center hover:bg-slate-200 w-8 h-8 rounded-full text-slate-400"
							>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						)}
					</>
				) : (
					<span className="whitespace-nowrap text-ellipsis h-12 py-2 flex items-center w-full">{value}</span>
				)}
			</div>
			{validation && <span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>}
			<Popover.Overlay className="fixed inset-0 z-30 bg-black/60 xs:hidden" />
			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1"
			>
				<Popover.Panel
					className={
						'bg-white shadow-lg rounded-lg border border-slate-300 flex flex-col gap-2 items-center ' +
						(width > 430 ? ' z-20 absolute top-20' : ' z-40 fixed top-32 inset-x-6')
					}
				>
					{({ close }) => (
						<>
							<DayPicker
								mode="range"
								selected={range}
								onSelect={(e) => {
									setRange(e)
									handleSelect(e)
								}}
								numberOfMonths={width < 730 ? 1 : 2}
								modifiersClassNames={{
									selected: 'bg-indigo-700 text-white hover:bg-indigo-500',
									today: 'bg-pink-500 text-white font-semibold',
									disabled: 'text-gray-300 hover:bg-white hover:!text-gray-300 line-through',
								}}
								classNames={{
									button: 'hover:bg-indigo-400 hover:text-white cursor-pointer duration:100',
								}}
								locale={es}
								disabled={disabledDays}
								showOutsideDays={width < 730}
								fromMonth={new Date()}
								defaultMonth={new Date()}
							/>
							<div className="w-full flex gap-2 flex-row px-4 pb-4 justify-center items-center">
								{range?.from !== undefined || range?.to !== undefined ? (
									<Button secondary fullWidth onClick={onClear}>
										Limpiar
									</Button>
								) : (
									<Button secondary fullWidth onClick={close}>
										Cancelar
									</Button>
								)}
								<Button fullWidth onClick={close}>
									Guardar
								</Button>
							</div>
						</>
					)}
				</Popover.Panel>
			</Transition>
		</Popover>
	)
}

export default DatePicker

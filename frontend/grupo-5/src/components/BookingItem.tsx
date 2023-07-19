import { FC } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { IBookingItem } from 'services/bookings'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface IBooking extends IBookingItem {
	handleDelete: (arg: any) => void
	pending?: boolean
	to: string
}

const BookingItem: FC<IBooking> = ({
	id,
	dateStart,
	dateEnd,
	totalPrice,
	product,
	handleDelete,
	pending = false,
	to,
}) => {
	return (
		<Link to={to} key={id} className="booking-item">
			<div className="w-[80px] min-w-[80px] h-full max-h-[100px] rounded-md relative overflow-hidden bg-slate-200">
				{product.img !== null && (
					<img className="object-cover h-full w-full" src={product.img[0].imgUrl} alt={'image of ' + product.title} />
				)}
			</div>
			<div className="flex flex-col w-full h-full gap-1 overflow-hidden justify-between">
				<div className="flex flex-col w-full h-full gap-1 ">
					<span className="font-semibold leading-tight">{id + ' | ' + product.title}</span>
					<span className="line-clamp-2">
						{format(new Date(dateStart + 'T06:00:00'), 'ccc. dd MMM.', { locale: es }) +
							' | ' +
							format(new Date(dateEnd + 'T06:00:00'), 'ccc. dd MMM.', { locale: es })}
					</span>
				</div>
				<span>{'Precio servicio: $' + totalPrice.toLocaleString('es-ES')}</span>
			</div>
			{!pending && (
				<button
					onClick={(e) => {
						e.preventDefault()
						handleDelete(id)
					}}
					className="flex justify-center items-center h-10 min-w-[40px] w-10 text-slate-400 hover:text-indigo-700 rounded-full hover:bg-slate-200 duration-200"
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			)}
		</Link>
	)
}

export default BookingItem

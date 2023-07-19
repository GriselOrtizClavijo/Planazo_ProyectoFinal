import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Spinner from 'components/Spinner'
import { SessionContext } from 'contexts/Session'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import AdminLayout from 'layouts/AdminLayout'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useGetBookingById } from 'services/bookings'

const AdminBooking = () => {
	const { id } = useParams()
	const { state: session } = useContext(SessionContext)
	const booking = useGetBookingById({ id: id ?? '', token: session.user?.token ?? '' })

	return (
		<AdminLayout
			className="bg-slate-50"
			title={booking.data?.title !== undefined ? 'Reserva | ' + booking.data?.title : undefined}
			image={booking.data?.img}
			type="article"
			url={'http://planazo-hosting.s3-website.us-east-2.amazonaws.com' + location.pathname}
		>
			<div className="w-full flex-1 max-w-3xl items-center py-6 flex flex-col gap-6">
				<h1 className="text-2xl font-bold w-full px-6 md:px-0">Reserva</h1>
				{booking.isFetching || booking.data === undefined ? (
					<div className="flex flex-1 w-full justify-center items-center">
						<Spinner className="h-10 w-10" />
					</div>
				) : (
					<div className="bg-white p-6 shadow-lg w-full flex flex-col gap-6 sm:rounded-lg">
						<div className="flex flex-col gap-1 w-full">
							<div className="flex gap-3 items-center w-full">
								<div className="w-20 h-20 min-w-[80px] rounded-md overflow-hidden">
									<img src={booking.data.img} alt={booking.data.title} className="w-full h-full object-cover" />
								</div>
								<div className="flex flex-col w-full gap-1">
									<span className="text-lg font-semibold">{booking.data.title}</span>
									<div className="text-slate-600 flex items-center gap-2 text-sm font-semibold">
										<FontAwesomeIcon icon={faLocationDot} />
										<span className="line-clamp-1">{booking.data.city}</span>
									</div>
									<span>
										{format(new Date(booking.data.dateStart + 'T06:00:00'), 'ccc. dd MMM.', { locale: es }) +
											' | ' +
											format(new Date(booking.data.dateEnd + 'T06:00:00'), 'ccc. dd MMM.', { locale: es })}
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<h3 className="font-semibold text-lg text-indigo-800">Datos del usuario</h3>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Nombre completo</span>
								<span>{session.user?.firstName + ' ' + session.user?.lastName}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Correo electrónico</span>
								<span>{session.user?.email}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Movilidad reducida</span>
								<span>{booking.data.reducedMobility ? 'Si' : 'No'}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Vacunación COVID</span>
								<span>{booking.data.COVIDvaccine ? 'Si' : 'No'}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Comentarios extra</span>
								<p>{booking.data.comment !== '' ? booking.data.comment : 'No'}</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<h3 className="text-lg font-semibold text-indigo-800">Pago</h3>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Método de pago</span>
								<span>{booking.data.paymentType.tittle}</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm">Precio total</span>
								<span>{'$' + booking.data.totalPrice.toLocaleString('es-ES')}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	)
}

export default AdminBooking

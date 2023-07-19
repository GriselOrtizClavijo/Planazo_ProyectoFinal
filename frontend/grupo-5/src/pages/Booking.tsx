import { faLocationDot, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'components/Button'
import Modal from 'components/Modal'
import Spinner from 'components/Spinner'
import StarRatingSelector from 'components/form/RatingSelector'
import TextArea from 'components/form/TextArea'
import { SessionContext } from 'contexts/Session'
import { format, isAfter, isBefore, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useFormik } from 'formik'
import MainLayout from 'layouts/MainLayout'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IReviewForm, reviewInitialValuesForm, reviewSchema } from 'schemas/reviews'
import { useDeleteBooking, useGetBookingById } from 'services/bookings'
import { ICreateReviewReq, useCreateReview, useDeleteReview, useGetPersonalReviewByBookingId } from 'services/reviews'

const Booking = () => {
	const { id } = useParams()
	const { state: session } = useContext(SessionContext)
	const booking = useGetBookingById({ id: id ?? '', token: session.user?.token ?? '' })
	const [isEditing, setIsEditing] = useState(true)
	const [isDeletingReview, setIsDeletingReview] = useState(false)
	const [isFetchingDelete, setIsFetchingDelete] = useState(false)
	const [isFetchingCreate, setIsFetchingCreate] = useState(false)
	const [isFetchingCancelBooking, setIsFetchingCancelBooking] = useState(false)
	const [isCancelingBooking, setIsCancelingBooking] = useState(false)
	const deleteReview = useDeleteReview()
	const personalReview = useGetPersonalReviewByBookingId({ id: id ?? '', token: session.user?.token ?? '' })
	const createReview = useCreateReview()
	const deleteBooking = useDeleteBooking()
	const navigate = useNavigate()

	const { handleSubmit, handleChange, values, setFieldValue, errors, resetForm } = useFormik<IReviewForm>({
		initialValues: reviewInitialValuesForm,
		validationSchema: reviewSchema,
		onSubmit: async (formData) => {
			setIsFetchingCreate(true)
			const body: ICreateReviewReq & { token: string } = {
				product: {
					id: booking.data?.idProduct ?? 0,
				},
				comment: formData.comment,
				rate: formData.rate ?? 0,
				token: session.user?.token ?? '',
				booking: {
					id: booking.data?.id ?? 0,
				},
			}
			createReview.mutate(body, {
				onSuccess: () => {
					setIsEditing(false)
					setIsFetchingCreate(false)
					personalReview.refetch()
				},
				onError: () => {
					setIsFetchingCreate(false)
				},
			})
		},
		validateOnChange: false,
	})

	useEffect(() => {
		personalReview.refetch().then((res) => {
			if (res.isSuccess) {
				setIsEditing(false)
				setFieldValue('rate', res.data.rate)
				setFieldValue('comment', res.data.comment)
			}
		})
	}, [])

	const confirmDelete = () => {
		setIsFetchingDelete(true)
		const body = {
			id: personalReview.data?.id ?? 0,
			token: session.user?.token ?? '',
		}
		deleteReview.mutate(body, {
			onSuccess: () => {
				setIsFetchingDelete(false)
				setIsDeletingReview(false)
				personalReview.refetch().then((res) => {
					if (res.isSuccess) {
						setIsEditing(false)
						setFieldValue('rate', res.data.rate)
						setFieldValue('comment', res.data.comment)
					} else {
						setIsEditing(true)
						resetForm()
					}
				})
			},
			onError: () => {
				setIsFetchingDelete(false)
				setIsDeletingReview(false)
			},
		})
	}

	const confirmCancelBooking = () => {
		setIsFetchingCancelBooking(true)
		const body = {
			id: parseInt(id ?? '0'),
			token: session.user?.token ?? '',
		}
		deleteBooking.mutate(body, {
			onSuccess: () => {
				setIsFetchingCancelBooking(false)
				setIsCancelingBooking(false)
				navigate('/bookings')
			},
			onError: () => {
				setIsFetchingCancelBooking(false)
				setIsCancelingBooking(false)
			},
		})
	}

	return (
		<MainLayout
			buttonBack
			className="bg-slate-50"
			title={booking.data?.title !== undefined ? 'Reserva | ' + booking.data?.title : undefined}
			image={booking.data?.img}
			type="article"
			url={'http://planazo-hosting.s3-website.us-east-2.amazonaws.com' + location.pathname}
		>
			<Modal open={isDeletingReview}>
				<span className="text-2xl font-semibold">Eliminar opinión</span>
				<span>¿Estás seguro que deseas eliminar esta opinión?</span>
				<div className="flex gap-2 w-full justify-between">
					<Button
						onClick={() => {
							setIsDeletingReview(false)
						}}
						fullWidth
						secondary
					>
						Cancelar
					</Button>
					<Button
						onClick={async () => {
							confirmDelete()
						}}
						fullWidth
						isLoading={isFetchingDelete}
					>
						Aceptar
					</Button>
				</div>
			</Modal>
			<Modal open={isCancelingBooking}>
				<span className="text-2xl font-semibold">Cancelar reserva</span>
				<span>¿Estás seguro que deseas cancelar esta reserva?</span>
				<div className="flex gap-2 w-full justify-between">
					<Button
						onClick={() => {
							setIsCancelingBooking(false)
						}}
						fullWidth
						secondary
					>
						Cancelar
					</Button>
					<Button
						onClick={async () => {
							confirmCancelBooking()
						}}
						fullWidth
						isLoading={isFetchingCancelBooking}
					>
						Aceptar
					</Button>
				</div>
			</Modal>
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
						{isBefore(new Date(), subDays(new Date(booking.data.dateStart), 10)) && (
							<div>
								<Button onClick={() => setIsCancelingBooking(true)}>Cancelar reserva</Button>
							</div>
						)}
						{!isAfter(new Date(booking.data.dateStart), new Date()) && (
							<div className="flex flex-1 flex-col border border-slate-300 rounded-md overflow-hidden min-h-[200px]">
								{personalReview.isFetching ? (
									<div className="flex flex-1 w-full justify-center items-center">
										<Spinner className="w-12 h-12" />
									</div>
								) : (
									<>
										{!personalReview.isSuccess ? (
											<>
												<div className="py-2 px-4 bg-indigo-800 text-white">
													<h2 className="text-lg font-semibold">Puntúa el servicio y deja tu comentario</h2>
												</div>
												<span className="p-4">
													Tu opinión nos interesa y servirá a otros para asegurarse de la calidad de nuestros productos.
												</span>
											</>
										) : (
											<div className="py-2 px-4 bg-indigo-800 text-white flex gap-4 items-center justify-between">
												<h2 className="text-lg font-semibold">Tu opinión</h2>
												<button
													onClick={() => setIsDeletingReview(true)}
													className="p-2 text-white hover:bg-white/20 w-8 h-8 rounded-full flex justify-center items-center"
												>
													<FontAwesomeIcon icon={faTrash} />
												</button>
											</div>
										)}
										<form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
											<StarRatingSelector
												label="Puntuación"
												name="rate"
												value={values.rate}
												onChange={(rate) => setFieldValue('rate', rate)}
												error={errors.rate}
												editable={isEditing}
											/>
											<TextArea
												label="Comentario"
												name="comment"
												value={values.comment}
												onChange={handleChange}
												error={errors.comment}
												editable={isEditing}
											/>
											{isEditing && (
												<div className="w-full flex flex-col gap-2 md:flex-row mt-2">
													<Button fullWidth secondary onClick={resetForm}>
														Limpiar
													</Button>
													<Button fullWidth type="submit" isLoading={isFetchingCreate}>
														Guardar
													</Button>
												</div>
											)}
										</form>
									</>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</MainLayout>
	)
}

export default Booking

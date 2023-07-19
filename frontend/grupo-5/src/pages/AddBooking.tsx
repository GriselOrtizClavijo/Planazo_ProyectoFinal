import MainLayout from 'layouts/MainLayout'

import { useLocation, useParams } from 'react-router-dom'
import { IFilterParams, useGetProductById } from 'services/products'
import 'photoswipe/dist/photoswipe.css'
import { useContext, useState } from 'react'
import { SessionContext } from 'contexts/Session'
import { useQueryParams } from 'hooks/useQueryParams'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import Input from 'components/form/Input'
import { useFormik } from 'formik'
import DatePicker from 'components/form/DatePicker'
import { IBookingForm, bookingInitialValuesForm, bookingSchema } from 'schemas/bookings'
import Checkbox from 'components/form/Checkbox'
import Button from 'components/Button'
import Spinner from 'components/Spinner'
import TextArea from 'components/form/TextArea'
import { ICreateBookingReq, useCreateBooking } from 'services/bookings'
import Select from 'components/form/Select'
import paymentOptions from '../mocks/payments.json'
import { format, intervalToDuration } from 'date-fns'
import { sleep } from 'utils/sleep'
import { es } from 'date-fns/locale'
import Modal from 'components/Modal'

const AddBooking = () => {
	const { id } = useParams()
	const location = useLocation()
	const { queryParams } = useQueryParams<IFilterParams>()
	const [isConfirming, setIsConfirming] = useState(false)
	const [bookingId, setBookingId] = useState<number>()
	const [subTotals, setSubTotals] =
		useState<Array<{ id: number; label: string; duration: number; quantity: number; price: number }>>()

	const { state: session } = useContext(SessionContext)

	const product = useGetProductById(id ?? '')

	const createBooking = useCreateBooking()

	const { handleSubmit, handleChange, values, setFieldValue, errors, resetForm } = useFormik<IBookingForm>({
		initialValues: {
			...bookingInitialValuesForm,
			dateStart: queryParams.dateStart !== undefined ? queryParams.dateStart : null,
			dateEnd: queryParams.dateEnd !== undefined ? queryParams.dateEnd : null,
		},
		validationSchema: bookingSchema,
		onSubmit: async (formData) => {
			const duration =
				(intervalToDuration({
					start: new Date(formData.dateStart ?? ''),
					end: new Date(formData.dateEnd ?? ''),
				}).days ?? 0) + 1

			setSubTotals([
				{
					id: 1,
					label: 'Adultos',
					quantity: formData.adult,
					duration,
					price: product.data?.price_adult ?? 0,
				},
				{
					id: 2,
					label: 'Menores',
					quantity: formData.child,
					duration,
					price: product.data?.price_minor ?? 0,
				},
			])
			sleep(100)
			setIsConfirming(true)
		},
		validateOnChange: false,
	})

	const onConfirmBooking = () => {
		const duration =
			(intervalToDuration({
				start: new Date(values.dateStart ?? ''),
				end: new Date(values.dateEnd ?? ''),
			}).days ?? 0) + 1

		const adultSubtotal = duration * values.adult * (product.data?.price_adult ?? 0)
		const minorSubtotal = duration * values.child * (product.data?.price_minor ?? 0)

		const body: ICreateBookingReq & { token: string } = {
			dateStart: values.dateStart ?? '',
			dateEnd: values.dateEnd ?? '',
			totalPrice: adultSubtotal + minorSubtotal,
			countAdults: values.adult,
			countChildren: values.child,
			COVIDvaccine: values.covid,
			reducedMobility: values.mobility,
			comment: values.comments,
			paymentType: {
				id: values.payment ?? 0,
			},
			product: {
				id: parseInt(id ?? '0'),
			},
			token: session.user?.token ?? '',
		}
		createBooking.mutate(body, {
			onSuccess: (res: number) => {
				setBookingId(res)
			},
		})
	}

	return (
		<MainLayout
			buttonBack
			className="bg-slate-50"
			title={'Reserva | ' + product.data?.title ?? ''}
			image={product.data?.images[0].imgUrl}
			description={product.data?.description}
			type="article"
			url={'http://planazo-hosting.s3-website.us-east-2.amazonaws.com' + location.pathname}
		>
			{bookingId !== undefined && (
				<Modal>
					<div className="w-full flex justify-center items-center my-2">
						<FontAwesomeIcon icon={faCircleCheck} className="text-8xl text-pink-600" />
					</div>
					<div className="flex flex-col gap-2 w-full">
						<span className="text-2xl font-bold w-full text-center text-pink-800">¡Muchas gracias!</span>
						<span className="text-lg font-semibold w-full text-center text-slate-700">
							Su reserva ha sido realizada con éxito
						</span>
					</div>
					<div className="flex flex-col gap-2 md:flex-row w-full">
						<Button secondary type="link" to={'/booking/' + bookingId} fullWidth>
							Ir a la reserva
						</Button>
						<Button type="link" to="/" fullWidth>
							Volver al inicio
						</Button>
					</div>
				</Modal>
			)}
			<div className="w-full max-w-3xl items-center py-6 flex flex-col gap-6">
				{!isConfirming ? (
					<>
						<h1 className="text-2xl font-bold w-full px-6 md:px-0">Reserva</h1>
						<div className="w-full flex flex-col gap-1 px-6 md:px-0">
							<h3 className="font-semibold mb-2 text-lg text-indigo-800">Detalle del producto</h3>
							<div
								className={
									'rounded-lg w-full flex flex-col gap-2 shadow-lg pb-3 bg-white border border-slate-200 ' +
									(product.isLoading ? 'h-[320px] justify-center items-center' : '')
								}
							>
								{!product.isLoading ? (
									<>
										<div className="h-full w-full rounded-t-md overflow-hidden">
											<img
												src={product.data?.images[0].imgUrl}
												alt={product.data?.images[0].imgAlt}
												className="w-full h-[150px] object-cover"
											/>
										</div>
										<div className="w-full flex flex-col gap-1 px-3">
											<span className="font-semibold text-lg">{product.data?.title}</span>
											<div className="text-slate-600 flex items-center gap-2 text-sm font-semibold">
												<FontAwesomeIcon icon={faLocationDot} />
												<span className="line-clamp-1">{product.data?.location.description}</span>
											</div>
										</div>
										<div className="w-full flex flex-col gap-1 px-3">
											<span className="text-lg font-semibold pt-1">Precios</span>
											<span>
												Adultos:{' '}
												<span className="font-semibold text-lgc">
													${product.data?.price_adult.toLocaleString('es-ES')}
												</span>{' '}
												(por día)
											</span>
											<span>
												Menores:{' '}
												<span className="font-semibold text-lgc">
													${product.data?.price_minor.toLocaleString('es-ES')}
												</span>{' '}
												(por día)
											</span>
										</div>
									</>
								) : (
									<Spinner className="w-10 h-10" />
								)}
							</div>
						</div>
						<div className="w-full flex flex-col gap-3">
							<form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 p-6 bg-white shadow-lg md:rounded-lg">
								<h3 className="font-semibold mb-2 text-lg text-indigo-800">Detalle de reserva</h3>
								<DatePicker
									placeholder="Selecciona un rango de fechas"
									label="Fechas"
									defaultSelected={
										values.dateStart && values.dateEnd
											? {
													from: new Date((values.dateStart ?? '') + 'T06:00:00'),
													to: new Date((values.dateEnd ?? '') + 'T06:00:00'),
											  }
											: undefined
									}
									name="dateRange"
									handleSelect={(range) => {
										if (range?.from !== undefined && range.to !== undefined) {
											setFieldValue('dateStart', format(range?.from, 'yyyy-MM-dd'))
											setFieldValue('dateEnd', format(range?.to, 'yyyy-MM-dd'))
										}
									}}
									disabled={product.data?.bookings.map((b) => ({
										from: new Date(b.from + 'T06:00:00'),
										to: new Date(b.to + 'T06:00:00'),
									}))}
									error={errors.dateStart || errors.dateEnd}
								/>
								<div className="flex gap-4">
									<Input
										label="Adultos"
										name="adult"
										type="number"
										onChange={handleChange}
										value={values.adult}
										error={errors.adult}
									/>
									<Input
										label="Menores"
										name="child"
										type="number"
										onChange={handleChange}
										value={values.child}
										error={errors.child}
									/>
								</div>
								<Select
									name="payment"
									value={values.payment}
									label="Método de pago"
									placeholder="Seleccione un método de pago"
									onChange={(p) => setFieldValue('payment', p)}
									options={paymentOptions.map((po) => ({ value: po.id, label: po.title, id: po.id }))}
									error={errors.payment}
								/>
								<TextArea
									label="Comentarios"
									name="comments"
									onChange={handleChange}
									value={values.comments}
									error={errors.comments}
								/>
								<Checkbox
									name="mobility"
									label="Integrante con movilidad reducida."
									value={values.mobility}
									onChange={(value) => setFieldValue('mobility', value)}
									error={errors.mobility}
								/>
								<Checkbox
									name="covid"
									label="Declaro que todos los integrantes de mi grupo cuentan con el esquema completo de COVID-19."
									value={values.covid}
									onChange={(value) => setFieldValue('covid', value)}
									error={errors.covid}
								/>
								<Checkbox
									name="policies"
									label="Estoy de acuerdo con las políticas de uso impuestas por la organización."
									value={values.policies}
									onChange={(value) => setFieldValue('policies', value)}
									error={errors.policies}
								/>
								<div className="flex flex-col mt-4 gap-4 sm:flex-row">
									<Button fullWidth secondary onClick={resetForm}>
										Limpiar
									</Button>
									<Button fullWidth type="submit">
										Siguiente
									</Button>
								</div>
							</form>
						</div>
					</>
				) : (
					<>
						<h1 className="text-2xl font-bold w-full px-6 md:px-0">Confirma reserva</h1>
						<div className="bg-white p-6 shadow-lg w-full flex flex-col gap-6 sm:rounded-lg">
							<div className="flex flex-col gap-1 w-full">
								<div className="flex gap-3 items-center w-full">
									<div className="w-20 h-20 min-w-[80px] rounded-md overflow-hidden">
										<img
											src={product.data?.images[0].imgUrl}
											alt={product.data?.images[0].imgAlt}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex flex-col w-full gap-1">
										<span className="text-lg font-semibold">{product.data?.title}</span>
										<div className="text-slate-600 flex items-center gap-2 text-sm font-semibold">
											<FontAwesomeIcon icon={faLocationDot} />
											<span className="line-clamp-1">{product.data?.location.description}</span>
										</div>
										<span>
											{values.dateStart &&
												values.dateEnd &&
												format(new Date(values.dateStart + 'T06:00:00'), 'ccc. dd MMM.', { locale: es }) +
													' | ' +
													format(new Date(values.dateEnd + 'T06:00:00'), 'ccc. dd MMM.', { locale: es })}
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
									<span>{values.mobility ? 'Si' : 'No'}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="font-semibold text-sm">Vacunación COVID</span>
									<span>{values.covid ? 'Si' : 'No'}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="font-semibold text-sm">Comentarios extra</span>
									<p>{values.comments !== '' ? values.comments : 'No'}</p>
								</div>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<h3 className="text-lg font-semibold text-indigo-800">Pago</h3>
								<div className="flex flex-col gap-1">
									<span className="font-semibold text-sm">Método de pago</span>
									<span>{paymentOptions.find((po) => po.id === values.payment)?.title}</span>
								</div>
								<table className="table-subtotals">
									<thead className="">
										<tr>
											<th className="text-start">Concepto</th>
											<th>Cant.</th>
											<th>Precio</th>
											<th className="text-end">Subtotal</th>
										</tr>
									</thead>
									<tbody>
										{(subTotals ?? []).map((item) => (
											<tr key={item.id}>
												<td>{item.label}</td>
												<td className="text-center">{item.quantity}</td>
												<td className="text-center">${item.price.toLocaleString('es-ES')}</td>
												<td className="text-end">${(item.quantity * item.price).toLocaleString('es-ES')}</td>
											</tr>
										))}
									</tbody>
									<tfoot>
										<tr>
											<td colSpan={2} className="text-lg">
												{'Días: ' + (subTotals ?? [])[0].duration ?? 0}
											</td>
											<td colSpan={2} className="text-end text-lg">
												TOTAL:{' '}
												<span className="font-semibold">
													{'$' +
														(subTotals ?? [])
															.reduce((accumulator, item) => {
																const itemTotal = item.duration * item.price * item.quantity
																return accumulator + itemTotal
															}, 0)
															.toLocaleString('es-ES')}
												</span>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
							<div className="flex flex-col mt-4 gap-4 sm:flex-row">
								<Button fullWidth secondary onClick={() => setIsConfirming(false)}>
									Volver
								</Button>
								<Button fullWidth onClick={onConfirmBooking} isLoading={createBooking.isLoading}>
									Confirmar
								</Button>
							</div>
						</div>
					</>
				)}
			</div>
		</MainLayout>
	)
}

export default AddBooking

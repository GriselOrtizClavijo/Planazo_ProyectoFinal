import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Like from 'components/Like'
import StarsClasification from 'components/StarsClasification'
import MainLayout from 'layouts/MainLayout'

import {
	faBowlFood,
	faBus,
	faHotel,
	faKitMedical,
	faLocationDot,
	faMugSaucer,
	faTicket,
	faUtensils,
	faWalkieTalkie,
} from '@fortawesome/free-solid-svg-icons'
import { getParagraphs } from 'utils/getParagraphs'
import Button from 'components/Button'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IFilterParams, useGetProductById } from 'services/products'
import Spinner from 'components/Spinner'
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import Share from 'assets/icons/Share'
import { format, startOfMonth, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import Map from 'components/Map'
import { useContext, useRef } from 'react'
import useSmoothScroll from 'hooks/useSmoothScroll'
import { DayPicker } from 'react-day-picker'
import { useWindowSize } from 'usehooks-ts'
import DotLocation from 'assets/img/DotLocation.svg'
import { FavoritesContext } from 'contexts/Favorites'
import { ShareContext } from 'contexts/Share'
import { SessionContext } from 'contexts/Session'
import { useQueryParams } from 'hooks/useQueryParams'
import { generateMultipleParams } from 'utils/generateParams'
import { useGetReviewsByProductId } from 'services/reviews'

export const attributes = [
	{
		id: 6,
		name: 'Seguro Médico',
		icon: <FontAwesomeIcon icon={faKitMedical} />,
	},
	{ id: 7, name: 'Transporte', icon: <FontAwesomeIcon icon={faBus} /> },
	{ id: 8, name: 'Alojamiento', icon: <FontAwesomeIcon icon={faHotel} /> },
	{
		id: 9,
		name: 'Pensión completa',
		icon: <FontAwesomeIcon icon={faUtensils} />,
	},
	{
		id: 10,
		name: 'Media Pensión',
		icon: <FontAwesomeIcon icon={faBowlFood} />,
	},
	{ id: 11, name: 'Desayuno', icon: <FontAwesomeIcon icon={faMugSaucer} /> },
	{
		id: 12,
		name: 'Guía turístico',
		icon: <FontAwesomeIcon icon={faWalkieTalkie} />,
	},
	{ id: 13, name: 'Tickets', icon: <FontAwesomeIcon icon={faTicket} /> },
]

const Product = () => {
	const { id } = useParams()
	const targetRef = useRef<HTMLDivElement | null>(null)
	const navigate = useNavigate()
	const scrollTo = useSmoothScroll()
	const { width } = useWindowSize()
	const location = useLocation()
	const { queryParams } = useQueryParams<IFilterParams>()

	const { state: favState, dispatch: switchFav } = useContext(FavoritesContext)
	const { state: session } = useContext(SessionContext)
	const { dispatch: switchShare } = useContext(ShareContext)

	const product = useGetProductById(id ?? '')
	const reviews = useGetReviewsByProductId(id ?? '')

	return (
		<MainLayout
			buttonBack
			className="bg-slate-50"
			title={product.data?.title}
			image={product.data?.images[0].imgUrl}
			description={product.data?.description}
			type="article"
			url={'http://planazo-hosting.s3-website.us-east-2.amazonaws.com' + location.pathname}
		>
			{product.data !== undefined && !product.isFetching ? (
				<div className="w-full max-w-3xl items-center pb-6 md:pt-6 flex flex-col gap-6">
					<Gallery>
						<div className="gallery">
							{product.data.images.slice(0, 4).map((img) => (
								<Item
									cropped
									key={img.imgUrl}
									original={img.imgUrl}
									thumbnail={img.imgUrl}
									width={img.width}
									height={img.height}
								>
									{({ open, ref }) => (
										<button onClick={open}>
											<img ref={ref as React.MutableRefObject<HTMLImageElement>} src={img.imgUrl} alt={img.imgAlt} />
										</button>
									)}
								</Item>
							))}
							<Item
								cropped
								key={product.data.images[4].imgUrl}
								original={product.data.images[4].imgUrl}
								thumbnail={product.data.images[4].imgUrl}
								width={product.data.images[4].width}
								height={product.data.images[4].height}
							>
								{({ open, ref }) => (
									<button onClick={open} className="relative">
										{product.data.images.length > 5 && (
											<div className="absolute inset-0 bg-black/50 flex justify-center items-center">
												<span className="text-white font-semibold text-lg">Ver más</span>
											</div>
										)}
										<img
											ref={ref as React.MutableRefObject<HTMLImageElement>}
											src={product.data.images[4].imgUrl}
											alt={product.data.images[4].imgAlt}
										/>
									</button>
								)}
							</Item>
						</div>
					</Gallery>
					<div className="w-full flex flex-col gap-1 px-6 md:px-0">
						<h1 className="text-2xl font-bold leading-tight">{product.data.title}</h1>
						<div className="flex justify-between items-center gap-2 md:px-0">
							<StarsClasification clasification={product.data.rating} />
							<div className="flex items-center gap-2">
								<button
									onClick={() => {
										switchShare({
											url: 'http://planazo-hosting.s3-website.us-east-2.amazonaws.com' + location.pathname,
										})
									}}
									className="text-slate-500 flex gap-2 items-center rounded-full p-2 hover:bg-slate-300"
								>
									<Share width={18} />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation()
										e.preventDefault()
										if (session.isLogged) {
											switchFav({ idProduct: product.data.id })
										} else {
											navigate('/login')
										}
									}}
									className="text-slate-500 flex gap-2 items-center rounded-full p-2 hover:bg-slate-300"
								>
									<Like isLiked={session.isLogged && favState.favs.includes(product.data.id)} className="text-xl" />
								</button>
							</div>
						</div>
						<button
							className="text-slate-600 flex items-center gap-2 font-semibold"
							onClick={() => scrollTo(targetRef, 130)}
						>
							<FontAwesomeIcon icon={faLocationDot} />
							<span className="text-start">{product.data.location.description}</span>
						</button>
					</div>
					<div className="flex flex-col gap-3 px-6 w-full md:px-0">
						<h2 className="text-xl font-bold my-2">Descripción</h2>
						{getParagraphs(product.data.description ?? '').map((p, i) => (
							<p key={i} className="text-justify">
								{p}
							</p>
						))}
					</div>
					<div className="sticky bottom-0 inset-x-0 px-6 py-3 w-full md:relative md:rounded-lg shadow-lg z-30 bg-indigo-700 text-white flex justify-between gap-2 items-center">
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-semibold">
								<span className="text-lg">$ </span>
								{product.data.price_adult.toLocaleString('es-ES')}
								<span className="text-sm font-normal"> (por día)</span>
							</span>
							<span className="text-sm opacity-80">Impuestos incluídos</span>
						</div>
						<Button
							secondary
							type="link"
							to={'/addBooking/' + id + generateMultipleParams(queryParams)}
							className="hover:shadow-indigo-600"
						>
							Reservar
						</Button>
					</div>
					<div className="flex flex-col gap-3 px-6 md:px-0 w-full">
						<h2 className="text-xl font-bold w-full">Características</h2>
						<div className="flex flex-wrap gap-4 pt-4 w-full">
							{product.data.characteristics.map((ch) => (
								<div
									key={ch.id}
									className="flex items-center gap-2 border border-slate-300 px-4 py-3 rounded-lg [&>svg]:text-2xl [&>svg]:text-indigo-900"
								>
									{attributes.find((at) => at.id === ch.id)?.icon}
									<span className="whitespace-nowrap">{ch.title}</span>
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col h-80 gap-3 px-6 md:px-0 w-full">
						<h2 className="text-xl font-bold my-2">Ubicación</h2>
						<Map
							targetRef={targetRef}
							className="rounded-lg overflow-hidden"
							markers={[{ id: id ?? 0, position: { lat: product.data.location.lat, lng: product.data.location.lng } }]}
							zoom={12}
							customMarker={DotLocation}
						/>
					</div>
					<div className="flex flex-col gap-3 px-6 md:px-0 w-full">
						<h2 className="text-xl font-bold my-2">Políticas de uso</h2>
						<div className="policies">
							<div>
								<h2>Normas</h2>
								<p>
									La aceptación de mascotas en nuestras propuestas, tanto en alojamiento como en traslados y actividades
									queda sujeta al prestador individual del servicio.
								</p>
							</div>
							<div>
								<h2>Edad</h2>
								<p>
									Consideramos para las reservas como ‘Menores’ a niños de 0 a 17 años inclusive, y ‘Mayores’ a todos
									aquellos de 18 años en adelante.
								</p>
							</div>
							<div>
								<h2>Cancelaciones</h2>
								<p>
									Recibirás un reembolso del 100% del precio del tour si cancelas al menos 10 días antes de la fecha de
									inicio del tour. Las cancelaciones realizadas dentro de los 9 días previos a la fecha de inicio del
									tour no son reembolsables.
								</p>
							</div>
						</div>
					</div>
					{reviews.isFetched && reviews.data !== undefined && (
						<div className="flex flex-col gap-3 px-6 md:px-0 w-full">
							<h2 className="text-xl font-bold my-2">Opiniones de usuarios</h2>
							<div className="flex items-center gap-4">
								<span className="text-5xl font-bold text-center min-w-[40px]">{product.data.rating}</span>
								<div className="flex flex-col mt-2">
									<StarsClasification clasification={product.data.rating} />
									<span>{reviews.data?.length + (reviews.data?.length > 1 ? ' calificaciones' : ' calificación')}</span>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-6 mt-3 md:grid-cols-2">
								{reviews.data.map((rev) => (
									<div
										key={rev.id}
										className="flex flex-col w-full gap-3 pb-6 border-slate-200 border-b md:rounded-xl md:p-4 md:border md:bg-white"
									>
										<div className="flex items-start gap-2">
											<div className="flex flex-col justify-between items-start w-full">
												<span className="font-semibold line-clamp-1">{rev.name}</span>
												<span className="text-sm">
													{format(new Date(rev.date + 'T06:00:00'), 'd MMM. yyyy', { locale: es })}
												</span>
											</div>
											<div className="flex flex-col gap-1">
												<StarsClasification clasification={rev.rate} />
											</div>
										</div>
										<p>{rev.comment}</p>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="flex flex-col gap-3 px-6 md:px-0 w-full">
						<h2 className="text-xl font-bold my-2">Fechas disponibles</h2>
						<DayPicker
							className="bg-white flex border border-slate-200 justify-center m-0 p-6 rounded-xl"
							numberOfMonths={width < 730 ? 1 : 2}
							modifiersClassNames={{
								selected: 'bg-indigo-700 text-white hover:bg-indigo-500',
								today: 'bg-pink-500 text-white font-semibold',
								disabled: 'text-gray-300 hover:bg-white hover:!text-gray-300 line-through',
							}}
							classNames={{
								button: 'hover:bg-indigo-400 hover:text-white cursor-pointer duration:100',
								months: 'flex w-full gap-4 justify-around',
							}}
							mode="range"
							selected={
								queryParams.dateStart !== undefined && queryParams.dateEnd !== undefined
									? {
											from: new Date(queryParams.dateStart + 'T06:00:00'),
											to: new Date(queryParams.dateEnd + 'T06:00:00'),
									  }
									: undefined
							}
							locale={es}
							disabled={product.data.bookings
								.map((b) => ({
									from: new Date(b.from + 'T06:00:00'),
									to: new Date(b.to + 'T06:00:00'),
								}))
								.concat({ from: startOfMonth(new Date()), to: subDays(new Date(), 1) })}
							fromMonth={new Date()}
							showOutsideDays={width < 730}
						/>
					</div>
					<div className="px-6 md:px-0 w-full max-w-[330px]">
						<Button type="link" to={'/addBooking/' + id + generateMultipleParams(queryParams)} fullWidth>
							Reservar
						</Button>
					</div>
				</div>
			) : (
				<div className="flex flex-1 justify-center items-center">
					<Spinner fill="#DB2777" />
				</div>
			)}
		</MainLayout>
	)
}

export default Product

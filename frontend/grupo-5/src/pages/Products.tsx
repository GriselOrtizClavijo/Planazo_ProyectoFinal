import MainLayout from 'layouts/MainLayout'
import { useEffect, useState } from 'react'
import ProductCard from 'components/ProductCard'
import Pagination from 'components/Pagination'
import { IFilterParams, useGetProductLocations, useGetProducts } from 'services/products'
import { sleep } from 'utils/sleep'
import { useQueryParams } from 'hooks/useQueryParams'
import SearchProducts from 'components/SearchProducts'
import { IProductSearchForm } from 'schemas/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faFilter, faLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { generateMultipleParams } from 'utils/generateParams'
import MapSVG from 'assets/img/Map.svg'
import DotLocation from 'assets/img/DotLocation.svg'
import Modal from 'components/Modal'
import Map from 'components/Map'
import Spinner from 'components/Spinner'
import InfoWindowMap from 'components/InfoWindowMap'
import ReactDOMServer from 'react-dom/server'

const Products = () => {
	const navigate = useNavigate()
	const [filterOptions, setFilterOptions] = useState(false)
	const [isShowingMap, setIsShowingMap] = useState(false)

	const { queryParams } = useQueryParams<IFilterParams>()
	const [params, setParams] = useState<IFilterParams>({
		page: 1,
		...(queryParams.idCategory !== undefined && { idCategory: queryParams.idCategory }),
		...(queryParams.city !== undefined && { city: queryParams.city }),
		...(queryParams.cityName !== undefined && { cityName: queryParams.cityName }),
		...(queryParams.dateStart !== undefined && { dateStart: queryParams.dateStart }),
		...(queryParams.dateEnd !== undefined && { dateEnd: queryParams.dateEnd }),
	})

	const getProducts = useGetProducts({ params })
	const productLocations = useGetProductLocations()

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
		})
	}, [params.page])

	const handleNextPage = async () => {
		setParams({ ...params, page: params?.page + 1 })
		await sleep(100)
		getProducts.refetch()
	}

	const handlePreviousPage = async () => {
		setParams({ ...params, page: params?.page - 1 })
		await sleep(100)
		getProducts.refetch()
	}

	const handleSearch = async (formParams: IProductSearchForm) => {
		const newParams: IFilterParams = {
			page: params.page ?? 1,
			...(params.page_size !== undefined && { page_size: params.page_size }),
			...(formParams.idCategory !== undefined && { idCategory: formParams.idCategory }),
			...(formParams.city !== undefined && formParams.city !== null && { city: formParams.city }),
			...(formParams.cityName !== undefined && formParams.cityName !== null && { cityName: formParams.cityName }),
			...(formParams.dateStart !== undefined && formParams.dateStart !== null && { dateStart: formParams.dateStart }),
			...(formParams.dateEnd !== undefined && formParams.dateEnd !== null && { dateEnd: formParams.dateEnd }),
		}
		setParams(newParams)
		navigate('/products/' + generateMultipleParams<IFilterParams>(newParams))
		await sleep(100)
		getProducts.refetch().then(() => {
			setFilterOptions(false)
		})
	}

	const handleClickMap = (id: number) => {
		console.log(id)

		navigate('/product/' + id)
	}

	return (
		<MainLayout>
			<div className="w-full max-w-6xl pb-10 h-full flex flex-1 flex-col gap-6 lg:px-6 lg:pt-8 lg:flex-row xl:px-0">
				<Modal open={isShowingMap} className="!p-0 overflow-hidden !gap-0 w-full flex-1 !max-w-4xl">
					<div className="flex items-center justify-between gap-2 p-4">
						<h1 className="text-xl font-semibold">Productos por ubicación</h1>
						<button
							onClick={() => {
								setIsShowingMap(false)
							}}
							className="text-indigo-800 hover:bg-slate-200 w-8 h-8 rounded-full duration-100"
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					</div>
					<div className={'flex justify-center duration-400 items-center h-[600px]'}>
						{productLocations.isFetching ? (
							<Spinner className="w-10 h-10" />
						) : (
							<Map
								bounds={{
									NW: { lat: -56.87663728788259, lng: -84.67676026290708 },
									SE: { lat: -15.910397333292126, lng: -50.603719944507475 },
								}}
								center={{ lat: -35.173098159107255, lng: -65.33673604482283 }}
								customMarker={DotLocation}
								markers={productLocations.data?.map((p) => ({
									id: p.id,
									position: {
										lat: p.lat,
										lng: p.lng,
									},
									infoContent: ReactDOMServer.renderToString(
										<InfoWindowMap {...p} onClick={() => handleClickMap(p.id)} />,
									),
								}))}
							/>
						)}
					</div>
				</Modal>
				<div className="lg:max-w-[300px] flex flex-col gap-4">
					<div className="px-6 lg:px-0 order-2">
						<button
							onClick={() => setIsShowingMap(true)}
							className="w-full bg-white rounded-xl h-[72px] overflow-hidden shadow-lg relative flex gap-2 justify-center items-center lg:order-1"
						>
							<div className="z-20 h-10">
								<img src={DotLocation} alt="background" className="w-full h-full" />
							</div>
							<span className="z-20 text-white font-semibold">Ver en mapa</span>
							<img src={MapSVG} alt="background" className="w-full z-0 h-full object-cover absolute inset-y-0" />
							<div className="bg-black/50 absolute inset-0 z-10" />
						</button>
					</div>
					<div
						className={
							'p-5 bg-white w-full shadow-lg flex-col gap-4 lg:flex order-1 lg:order-2 lg:rounded-xl ' +
							(!filterOptions ? 'hidden' : 'flex')
						}
					>
						<div className="flex justify-between gap-2 items-center">
							<div className="flex items-center gap-2">
								<FontAwesomeIcon className="text-indigo-600" icon={faFilter} />
								<span className="font-semibold text-xl">Filtros</span>
							</div>
							<button
								onClick={() => setFilterOptions(false)}
								className="text-slate-400 w-8 h-8 flex justify-center items-center text-xl lg:hidden"
							>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</div>
						<SearchProducts
							onSearch={handleSearch}
							isLoading={getProducts.isFetching}
							defaultState={{
								...(queryParams.city !== undefined && { city: queryParams.city }),
								...(queryParams.cityName !== undefined && { cityName: queryParams.cityName }),
								...(queryParams.dateStart !== undefined && { dateStart: queryParams.dateStart }),
								...(queryParams.dateEnd !== undefined && { dateEnd: queryParams.dateEnd }),
								...(queryParams.idCategory !== undefined && {
									idCategory:
										typeof queryParams.idCategory === 'number' ? [queryParams.idCategory] : queryParams.idCategory,
								}),
							}}
						/>
					</div>
					<div
						className={
							'bg-white shadow-lg p-4 items-center w-full gap-2 lg:hidden ' + (filterOptions ? 'hidden' : 'flex')
						}
					>
						<div className="flex flex-col gap-2 w-full">
							<div className="flex items-center gap-2 text-slate-500">
								<div className="w-5 flex justify-center items-center">
									<FontAwesomeIcon icon={faCalendar} />
								</div>
								<span>
									{queryParams.dateStart && queryParams.dateEnd
										? format(new Date(queryParams.dateStart + 'T06:00:00'), 'ccc. dd MMM.', { locale: es }) +
										  ' | ' +
										  format(new Date(queryParams.dateEnd + 'T06:00:00'), 'ccc. dd MMM.', { locale: es })
										: 'Cualquier fecha'}
								</span>
							</div>
							<div className="flex items-center gap-2 text-slate-500">
								<div className="w-5 flex justify-center items-center">
									<FontAwesomeIcon icon={faLocationDot} />
								</div>
								<span>{queryParams.cityName !== undefined ? queryParams.cityName : 'Cualquier ubicación'}</span>
							</div>
						</div>
						<div className="relative">
							<button
								onClick={() => setFilterOptions(true)}
								className="w-10 h-10 min-w-[40px] flex justify-center items-center rounded-full text-white bg-indigo-700 shadow-md"
							>
								<FontAwesomeIcon icon={faFilter} />
							</button>
							{queryParams.idCategory !== undefined && (
								<div className="absolute top-[-10px] right-[-10px] bg-red-500 text-white w-6 h-6 rounded-full flex justify-center items-center font-semibold text-sm">
									1
								</div>
							)}
						</div>
					</div>
				</div>
				{getProducts.isFetching ? (
					<div className="product-container h-fit">
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className="product-card-placeholder"></div>
						))}
					</div>
				) : getProducts.data?.data !== undefined ? (
					<div className="flex flex-col gap-2 flex-1">
						<div className="py-3 px-6 lg:px-0">
							<h1 className="text-xl lg:text-2xl font-bold">Resultados para tu búsqueda</h1>
							<span>{getProducts.data?.pagination.total_elements} experiencias encontradas</span>
						</div>
						<div className="product-container">
							{getProducts.data.data.map((item) => (
								<ProductCard
									key={item.id}
									id={item.id}
									img={item.img}
									title={item.title}
									rating={item.rating}
									price={item.price}
									location={item.location}
									params={params}
								/>
							))}
						</div>
						{getProducts.data !== undefined && (
							<Pagination
								className="pt-4 lg:col-span-2 lg:col-end-3"
								current_page={getProducts.data.pagination.current_page}
								page_size={getProducts.data.pagination.page_size}
								previous_page={getProducts.data.pagination.previous_page}
								next_page={getProducts.data.pagination.next_page}
								total_pages={getProducts.data.pagination.total_pages}
								handleNextPage={handleNextPage}
								handlePreviousPage={handlePreviousPage}
							/>
						)}
					</div>
				) : (
					<div className="w-full flex flex-1 justify-center items-center">
						<span className="text-slate-500">No existen resultados</span>
					</div>
				)}
			</div>
		</MainLayout>
	)
}

export default Products

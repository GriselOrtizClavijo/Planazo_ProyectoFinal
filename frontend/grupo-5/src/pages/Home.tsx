import Button from 'components/Button'
import ProductCard from 'components/ProductCard'
import MainLayout from 'layouts/MainLayout'
import { useGetProducts } from 'services/products'
import { useGetCategories } from 'services/categories'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import Share from 'assets/icons/Share'
import { ShareContext } from 'contexts/Share'
import SearchProducts from 'components/SearchProducts'
import { generateMultipleParams } from 'utils/generateParams'

const Home = () => {
	const products = useGetProducts({ params: { page: 1, random: true } })
	const categories = useGetCategories()
	const { dispatch: switchShare } = useContext(ShareContext)
	const [itemHovered, setItemHovered] = useState<number | null>()
	const navigate = useNavigate()

	return (
		<MainLayout>
			<div className="bg-pink-800 px-6 flex flex-col gap-6 py-10 pb-32 w-full items-center pattern-bg">
				<h1 className="text-3xl text-start w-full max-w-5xl font-bold py-6 drop-shadow-md text-white">
					Encuentra tu próxima aventura
				</h1>
				<SearchProducts
					className="rounded-xl max-w-5xl p-5 bg-white w-full shadow-lg"
					onSearch={(formData) => {
						const params = {
							...(formData.city !== null && { city: formData.city }),
							...(formData.cityName !== null && { cityName: formData.cityName }),
							...(formData.dateStart !== null && { dateStart: formData.dateStart }),
							...(formData.dateEnd !== null && { dateEnd: formData.dateEnd }),
						}
						navigate('/products' + generateMultipleParams(params))
					}}
					disableCategories
				/>
			</div>
			<div className="py-4 w-full flex flex-col gap-2 items-center -mt-28">
				<h2 className="text-start w-full max-w-5xl px-6 lg:px-0 text-xl font-bold text-white">Categorías</h2>
				<div className="w-full flex min-h-[230px] max-w-5xl items-center relative overflow-x-auto pb-2 custom-scrollbar">
					<div className="px-6 lg:px-2 py-3 flex items-center gap-4">
						{categories.isFetching ? (
							Array.from({ length: 8 }).map((_, index) => (
								<div key={index} className="h-48 w-36 bg-slate-50 shadow-lg rounded-xl animate-pulse" />
							))
						) : categories.data !== undefined ? (
							categories?.data.map((cat) => (
								<Link
									key={cat.id}
									to={'/products?idCategory=' + cat.id}
									onMouseEnter={() => setItemHovered(cat.id)}
									onMouseLeave={() => setItemHovered(null)}
									className="bg-slate-500 h-48 w-36 rounded-xl shadow-lg text-indigo-950 relative overflow-hidden duration-200 hover:scale-110"
								>
									<img
										src={cat.urlImg}
										className={'object-cover h-full inset-0 w-full '}
										alt={'image of ' + cat.title}
									/>
									<video
										autoPlay
										muted
										loop
										className={
											'absolute inset-0 h-full w-full object-cover delay-500 duration-500 ' +
											(cat.id === itemHovered ? 'opacity-100' : 'opacity-0')
										}
									>
										<source src={cat?.video ?? ''} type="video/mp4" />
									</video>
									<span className="absolute bottom-4 left-4 text-white z-10 font-semibold whitespace-nowrap">
										{cat.title}
									</span>
									<div className="absolute inset-0 h-full w-full bg-gradient-to-t from-10% from-black to-60%" />
								</Link>
							))
						) : (
							<span className="text-slate-500 w-full">Hubo un problema con las categorías</span>
						)}
					</div>
				</div>
			</div>
			<div className="mt-2 mb-8 w-full flex flex-col gap-4 items-center max-w-5xl">
				<h2 className="mb-2 w-full max-w-5xl text-xl px-6 lg:px-0 font-bold">Recomendaciones</h2>
				{!products.isFetching ? (
					products.data?.data !== undefined && products.data.data.length > 0 ? (
						<>
							<div className="product-container">
								{products.data.data.map((item) => (
									<ProductCard
										key={item.id}
										id={item.id}
										img={item.img}
										title={item.title}
										rating={item.rating}
										price={item.price}
										location={item.location}
									/>
								))}
							</div>
							<div className="px-6 w-full max-w-[350px]">
								<Button type="link" to="/products" fullWidth>
									Ver más
								</Button>
							</div>
						</>
					) : (
						<span className="px-4 py-10 text-slate-500">No existen resultados</span>
					)
				) : (
					<div className="product-container">
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className="product-card-placeholder" />
						))}
					</div>
				)}
			</div>
			<div className="relative lg:my-8 w-full flex flex-col h-[200px] lg:h-[250px] gap-4 lg:rounded-lg overflow-hidden items-center max-w-5xl bg-slate-400 ">
				<div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col gap-4 p-4 md:p-2 justify-center items-center bg-black/60 text-white">
					<span className="text-lg lg:text-2xl font-bold text-center">
						La vida se disfruta más cuando se comparte con amigos
					</span>
					<button
						onClick={() => {
							switchShare({
								url: 'http://planazo-hosting.s3-website.us-east-2.amazonaws.com',
							})
						}}
						className="h-12 border border-white px-6 rounded-lg flex items-center gap-3"
					>
						<Share width={18} />
						<span>Compartir aplicación</span>
					</button>
				</div>
				<img
					className="object-cover h-full w-full"
					src="https://proyectointegrador-c7-grupo5.s3.us-east-2.amazonaws.com/share.png"
					alt="share app"
				/>
			</div>
		</MainLayout>
	)
}

export default Home

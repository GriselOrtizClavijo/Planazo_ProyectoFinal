import ProductCard from 'components/ProductCard'
import { FavoritesContext } from 'contexts/Favorites'
import MainLayout from 'layouts/MainLayout'
import { useContext, useState } from 'react'
import { IFilterParams, useGetProducts } from 'services/products'

const Favorites = () => {
	const [params] = useState<IFilterParams>({
		page: 1,
		page_size: 100,
	})
	const { state } = useContext(FavoritesContext)
	const getProducts = useGetProducts({ params })

	return (
		<MainLayout>
			<div className="w-full max-w-3xl items-center py-10 flex flex-1 flex-col gap-6">
				<h1 className="text-2xl w-full font-bold leading-tight px-6 lg:px-0">Mis favoritos</h1>
				<div className="w-full">
					{getProducts.isFetching ? (
						<div className="product-container">
							{Array.from({ length: 10 }).map((_, index) => (
								<div key={index} className="product-card-placeholder"></div>
							))}
						</div>
					) : getProducts.data?.data !== undefined ? (
						<div className="product-container">
							{getProducts.data.data
								.filter((item) => state.favs.includes(item.id))
								.map((item) => (
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
					) : (
						<div className="w-full flex flex-1 justify-center items-center">
							<span className="text-slate-500">No existen resultados</span>
						</div>
					)}
				</div>
			</div>
		</MainLayout>
	)
}

export default Favorites

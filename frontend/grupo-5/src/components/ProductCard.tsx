import { FC, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StarsClasification from './StarsClasification'
import { IFilterParams, IProductItemDTO } from 'services/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import Like from './Like'
import { FavoritesContext } from 'contexts/Favorites'
import { SessionContext } from 'contexts/Session'
import { generateMultipleParams } from 'utils/generateParams'

const ProductCard: FC<IProductItemDTO & { params?: Partial<IFilterParams> }> = ({
	id,
	title,
	rating,
	price,
	img,
	location,
	params,
}) => {
	const { state, dispatch } = useContext(FavoritesContext)
	const navigate = useNavigate()
	const { state: session } = useContext(SessionContext)

	return (
		<Link to={'/product/' + id + generateMultipleParams(params)} key={id} className="product-card">
			<div className="w-[100px] min-w-[100px] rounded-md relative overflow-hidden">
				<img className="object-cover h-full w-full" src={img} alt={'image of ' + title} />
			</div>
			<div className="flex flex-col w-full gap-1">
				<div className="flex flex-1 flex-col w-full gap-1">
					<p className="font-semibold leading-tight">{title}</p>
					<div className="text-slate-600 flex items-center gap-2 font-semibold">
						<FontAwesomeIcon icon={faLocationDot} />
						<span className="line-clamp-1">{location}</span>
					</div>
					<StarsClasification clasification={rating} />
				</div>
				<span>
					desde <span className="font-semibold">${price.toLocaleString('es-ES')}</span>
				</span>
				<button
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
						if (session.isLogged) {
							dispatch({ idProduct: id })
						} else {
							navigate('/login')
						}
					}}
				>
					<Like
						className="absolute top-3 right-3 hover:bg-slate-200 p-2 duration-200 rounded-full"
						isLiked={session.isLogged && state.favs.includes(id)}
					/>
				</button>
			</div>
		</Link>
	)
}

export default ProductCard

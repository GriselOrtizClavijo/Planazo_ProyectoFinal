import { FC } from 'react'
import { Link } from 'react-router-dom'
import { IProductItemDTO } from 'services/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faTrash } from '@fortawesome/free-solid-svg-icons'

interface IProductItem extends IProductItemDTO {
	handleDelete: (arg: any) => void
}

const ProductItem: FC<IProductItem> = ({ id, title, price, img, location, handleDelete }) => {
	return (
		<Link to={'/admin/product/' + id} key={id} className="product-item">
			<div className="w-[80px] min-w-[80px] h-[80px] rounded-md relative overflow-hidden bg-slate-200">
				{img !== null && <img className="object-cover h-full w-full" src={img} alt={'image of ' + title} />}
			</div>
			<div className="flex flex-col justify-between w-full items-center gap-1">
				<div className="flex flex-1 flex-col w-full gap-1">
					<p className="font-semibold leading-tight">{title}</p>
					<div className="text-slate-600 flex items-center gap-2 font-semibold">
						<FontAwesomeIcon icon={faLocationDot} />
						<span className="line-clamp-1">{location}</span>
					</div>
				</div>
				<span className="w-full">
					desde <span className="font-semibold">${price}</span>
				</span>
			</div>
			<button
				onClick={(e) => {
					e.preventDefault()
					handleDelete(id)
				}}
				className="flex justify-center items-center h-10 min-w-[40px] w-10 text-slate-400 hover:text-indigo-700 rounded-full hover:bg-slate-200 duration-200"
			>
				<FontAwesomeIcon icon={faTrash} />
			</button>
		</Link>
	)
}

export default ProductItem

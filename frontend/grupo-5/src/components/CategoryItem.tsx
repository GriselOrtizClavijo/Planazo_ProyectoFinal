import { FC } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { ICategoryItemAPI } from 'services/categories'

interface ICategoryItem extends ICategoryItemAPI {
	handleDelete: (arg: any) => void
}

const CategoryItem: FC<ICategoryItem> = ({ id, title, description, urlImg, handleDelete }) => {
	return (
		<Link to={'/admin/category/' + id} key={id} className="category-item">
			<div className="w-[80px] min-w-[80px] h-[80px] rounded-md relative overflow-hidden bg-slate-200">
				{urlImg !== null && <img className="object-cover h-full w-full" src={urlImg} alt={'image of ' + name} />}
			</div>
			<div className="flex flex-col w-full h-full gap-1 justify-between overflow-hidden">
				<span className="font-semibold leading-tight">{title}</span>
				<span className="line-clamp-2">{description}</span>
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

export default CategoryItem

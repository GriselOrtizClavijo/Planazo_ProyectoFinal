import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faOutlinedHeart } from '@fortawesome/free-regular-svg-icons'
import { FC } from 'react'

interface ILike {
	isLiked: boolean
	className?: string
}

const Like: FC<ILike> = ({ isLiked, className }) => {
	return (
		<>
			{isLiked ? (
				<FontAwesomeIcon className={'text-red-500 ' + className} icon={faHeart} />
			) : (
				<FontAwesomeIcon className={'text-slate-500 ' + className} icon={faOutlinedHeart} />
			)}
		</>
	)
}

export default Like

import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'

interface IStarsClasification {
	clasification: number
	range?: number
	className?: string
}

const StarsClasification: FC<IStarsClasification> = ({ clasification, range = 5, className = '' }) => {
	const items = []

	for (let i = 0; i < range; i++) {
		if (i < Math.floor(clasification)) {
			// estrella completa
			items.push(<FontAwesomeIcon className="text-yellow-400" icon={faStar} />)
		} else if (i === Math.floor(clasification) && clasification % 1 !== 0) {
			// mitad de estrella
			items.push(
				<div className="flex relative">
					<FontAwesomeIcon
						className="text-slate-400"
						style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
						icon={faStar}
					/>
					<FontAwesomeIcon
						className="absolute top-0 left-0 text-yellow-400"
						style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
						icon={faStar}
					/>
				</div>,
			)
		} else {
			// estrella vacía
			items.push(<FontAwesomeIcon className="text-slate-400" icon={faStar} />)
		}
	}

	return (
		<div className={'flex items-center relative ' + className}>
			{items.map((item, index) => (
				<div key={index}>{item}</div>
			))}
		</div>
	)
}

export default StarsClasification

import { FC, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

interface IStarRatingSelector {
	value: number | null
	label?: string
	name: string
	onChange: (e: number) => void
	error?: any
	editable?: boolean
}

const StarRatingSelector: FC<IStarRatingSelector> = ({ value, label, name, onChange, error, editable }) => {
	const [ratingHover, setRatingHover] = useState(0)

	const handleStarHover = (hoverValue: number) => {
		if (editable) {
			setRatingHover(hoverValue)
		}
	}

	const handleStarLeave = (hoverValue: number) => {
		if (editable) {
			if (value !== null) {
				if (hoverValue > value) {
					setRatingHover(value)
				}
			} else {
				setRatingHover(0)
			}
		}
	}

	const handleStarClick = (hoverValue: number) => {
		if (editable) {
			setRatingHover(hoverValue)
			onChange(hoverValue)
		}
	}

	useEffect(() => {
		if (value === null) {
			setRatingHover(0)
		}
	}, [value])

	return (
		<div className="flex flex-col gap-1">
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			<div className="h-8 flex items-center">
				{[1, 2, 3, 4, 5].map((star) => (
					<FontAwesomeIcon
						key={star}
						icon={faStar}
						className={
							'cursor-pointer text-xl ' +
							(star <= ratingHover || (value !== null && star <= value) ? 'text-yellow-400' : 'text-slate-400')
						}
						onMouseEnter={() => handleStarHover(star)}
						onMouseLeave={() => handleStarLeave(star)}
						onClick={() => handleStarClick(star)}
					/>
				))}
			</div>
			<span className="font-semibold text-red-500 text-sm min-h-[16px]">{error ?? ''}</span>
		</div>
	)
}

export default StarRatingSelector

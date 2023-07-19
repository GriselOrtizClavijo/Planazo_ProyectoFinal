import { FC } from 'react'
import { IProductLocation } from 'services/products'

const InfoWindowMap: FC<IProductLocation & { onClick: (id: number) => void }> = ({ id, img, title }) => {
	return (
		<div className="flex w-full flex-col gap-2 max-w-[144px] p-2 pr-1">
			<div className="h-32 w-32 overflow-hidden">
				<img className="w-full h-full object-cover" src={img} alt={'img of ' + title} />
			</div>
			<span className="text-base font-semibold whitespace-normal">{title}</span>
			<a className="bg-indigo-700 text-white rounded-md px-3 py-2 text-sm text-center" href={'/product/' + id}>
				Ir al producto
			</a>
		</div>
	)
}

export default InfoWindowMap

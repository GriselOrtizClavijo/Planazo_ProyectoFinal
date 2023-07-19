import { FC } from 'react'

interface IToggle {
	name: string
	label: string
	className?: string
}

const Toggle: FC<IToggle> = ({ name, label, className }) => {
	return (
		<label className={'relative inline-flex h-12 py-2 items-center cursor-pointer ' + (className ?? '')}>
			<input id={name} type="checkbox" value="" className={'sr-only peer'} />
			<div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[50%] after:transform after:-translate-y-[50%] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-800"></div>
			<span className="ml-2 text-sm font-medium text-gray-900">{label}</span>
		</label>
	)
}

export default Toggle

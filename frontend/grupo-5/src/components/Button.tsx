import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Spinner from './Spinner'

interface IButtonBase {
	children: ReactNode
	fullWidth?: boolean
	secondary?: boolean
	onClick?: (arg: any) => void
	type?: 'button' | 'link' | 'submit'
	to?: string
	isLoading?: boolean
	disabled?: boolean
	className?: string
}

interface ILinkButton extends IButtonBase {
	type: 'link'
	to: string
}

type IButton = IButtonBase | ILinkButton

const Button: FC<IButton> = ({
	children,
	fullWidth = false,
	secondary = false,
	onClick,
	type = 'button',
	to,
	isLoading = false,
	disabled = false,
	className,
}) => {
	return (
		<>
			{type === 'link' ? (
				<Link
					to={to ?? ''}
					onClick={onClick}
					className={
						'h-12 font-semibold rounded-md whitespace-nowrap duration-200 flex items-center justify-center shadow-md px-4 py-2 hover:shadow-indigo-200 ' +
						(fullWidth ? 'w-full ' : '') +
						(!secondary ? 'bg-indigo-800 text-white ' : 'bg-white text-indigo-700 border-2 border-indigo-700 ') +
						(className ?? '')
					}
				>
					{isLoading ? <Spinner className="h-[26px] w-[26px]" /> : children}
				</Link>
			) : (
				<button
					onClick={onClick}
					type={type}
					disabled={isLoading || disabled}
					className={
						'h-12 font-semibold rounded-md whitespace-nowrap duration-200 flex items-center justify-center px-4 py-2 gap-2 ' +
						(fullWidth ? 'w-full ' : '') +
						(!secondary
							? 'text-white ' +
							  (isLoading || disabled ? 'bg-slate-300 ' : 'bg-indigo-800 shadow-md hover:shadow-indigo-200 ')
							: ' border-2 ' +
							  (isLoading || disabled
									? 'bg-white text-slate-300 border-slate-300 '
									: 'bg-white text-indigo-700 border-indigo-700 shadow-md hover:shadow-indigo-200 ')) +
						(className ?? '')
					}
				>
					{isLoading ? <Spinner className="h-[26px] w-[26px]" /> : children}
				</button>
			)}
		</>
	)
}

export default Button

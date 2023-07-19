import { FC, ReactNode } from 'react'

interface IModal {
	children: ReactNode
	className?: string
	open?: boolean
}

const Modal: FC<IModal> = ({ children, className, open = true }) => {
	return (
		<>
			{open && (
				<>
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" aria-hidden="true" />
					<div className="flex min-h-full items-center justify-center p-4 fixed inset-0 z-[60]">
						<div className={'w-full max-w-md rounded-lg bg-white p-5 flex flex-col gap-6 ' + className}>{children}</div>
					</div>
				</>
			)}
		</>
	)
}

export default Modal

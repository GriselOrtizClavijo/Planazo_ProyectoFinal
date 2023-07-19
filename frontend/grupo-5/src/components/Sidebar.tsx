import {
	faBellConcierge,
	faCube,
	faLocationDot,
	faRightFromBracket,
	faTags,
	faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, ReactNode, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import { SessionContext } from 'contexts/Session'
import { IWindowSize } from 'hooks/useWindowSize'
import { SidebarContext } from 'contexts/Sidebar'

interface ISidebar {
	isOpen: boolean
	handleBlockScroll: () => void
	size: IWindowSize
}

interface IItem {
	label: string
	icon: ReactNode
	to: string
	type: 'button' | 'link'
}

const productItems: IItem[] = [
	{ label: 'Productos', icon: <FontAwesomeIcon icon={faCube} />, to: '/admin/products', type: 'link' },
	{ label: 'Categorías', icon: <FontAwesomeIcon icon={faTags} />, to: '/admin/categories', type: 'link' },
	{ label: 'Reservas', icon: <FontAwesomeIcon icon={faBellConcierge} />, to: '/admin/bookings', type: 'link' },
	{ label: 'Usuarios', icon: <FontAwesomeIcon icon={faUsers} />, to: '/admin/users', type: 'link' },
	{ label: 'Ciudades', icon: <FontAwesomeIcon icon={faLocationDot} />, to: '/admin/cities', type: 'link' },
]

const configItems: IItem[] = [
	{ label: 'Cerrar sesion', icon: <FontAwesomeIcon icon={faRightFromBracket} />, to: '', type: 'button' },
]

const Sidebar: FC<ISidebar> = ({ isOpen, size, handleBlockScroll }) => {
	const Item = (item: IItem) => {
		const handleClick = (type: string) => {
			if (type === 'link') {
				handleBlockScroll()
				if (size.width !== undefined && size.width < 640) {
					sidebarDispatch({ type: 'SWITCH' })
				}
			} else if (type === 'button') {
				setIsModalExitOpen(true)
				handleBlockScroll()
			}
		}

		return (
			<li className="rounded-md overflow-hidden hover:bg-slate-600 cursor-pointer">
				{item.type === 'link' ? (
					<Link
						className="w-full px-4 py-3 flex items-center gap-3"
						to={item.to}
						onClick={() => handleClick(item.type)}
					>
						<div className="w-4 flex justify-center items-center">{item.icon}</div>
						<span className="whitespace-nowrap">{item.label}</span>
					</Link>
				) : (
					<button className="w-full px-4 py-3 flex items-center gap-3" onClick={() => handleClick(item.type)}>
						<div className="w-4 flex justify-center items-center">{item.icon}</div>
						<span className="whitespace-nowrap">{item.label}</span>
					</button>
				)}
			</li>
		)
	}

	const [isModalOpen, setIsModalExitOpen] = useState(false)

	const { dispatch } = useContext(SessionContext)
	const { dispatch: sidebarDispatch } = useContext(SidebarContext)

	const handleLogout = () => {
		dispatch({ type: 'LOGOUT' })
		setIsModalExitOpen(false)
	}

	return (
		<div className={'fixed top-16 left-0 z-30 flex lg:relative lg:h-auto lg:top-0'}>
			<Transition show={isModalOpen} as={Fragment}>
				<Dialog
					open={isModalOpen}
					onClose={() => {
						setIsModalExitOpen(false)
					}}
					className="relative z-40"
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div className="flex min-h-full items-center justify-center p-4 fixed inset-0">
							<Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-5 flex flex-col gap-6">
								<Dialog.Title className="text-2xl font-semibold">Cerrar sesión</Dialog.Title>
								<Dialog.Description>¿Estas seguro/a que deseas cerrar sesión?</Dialog.Description>
								<div className="flex gap-2 w-full justify-between">
									<Button
										onClick={() => {
											setIsModalExitOpen(false)
										}}
										fullWidth
										secondary
									>
										Cancelar
									</Button>
									<Button onClick={handleLogout} fullWidth>
										Aceptar
									</Button>
								</div>
							</Dialog.Panel>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition>
			<nav
				style={{
					height: size.height === undefined ? `calc(100vh - 4rem)` : (size.height - 64).toString() + 'px',
				}}
				className={
					'sticky top-16 flex flex-col items-center z-10 divide-y divide-slate-600 bg-slate-800 duration-200 text-white ' +
					(isOpen ? 'w-52 px-2 lg:overflow-hidden ' : 'w-0 px-0 overflow-hidden lg:overflow-visible ')
				}
			>
				<div className="flex flex-col flex-1 w-full py-2">
					<ul className="w-full">
						{productItems.map((item, i) => (
							<Item key={i} {...item} />
						))}
					</ul>
				</div>
				<div className="flex flex-col w-full py-2">
					<ul className="w-full flex flex-col">
						{configItems.map((item, i) => (
							<Item key={i} {...item} />
						))}
					</ul>
				</div>
			</nav>
			<div
				role="button"
				tabIndex={0}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						sidebarDispatch({ type: 'SWITCH' })
					}
				}}
				onClick={() => {
					sidebarDispatch({ type: 'SWITCH' })
					handleBlockScroll()
				}}
				className={
					'bg-black fixed top-0 left-0 bottom-0 right-0 z-0 ' +
					(isOpen ? 'opacity-60 flex lg:hidden' : 'opacity-0 hidden')
				}
			></div>
		</div>
	)
}

export default Sidebar

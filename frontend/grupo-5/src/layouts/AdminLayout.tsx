import { FC, Fragment, ReactNode, useContext, useState } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import useScrollBlock from 'hooks/useScrollBlock'
import Footer from 'components/Footer'
import Sidebar from 'components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import Logotype from 'assets/icons/Logotype'
import { SessionContext } from 'contexts/Session'
import { Menu, Transition } from '@headlessui/react'
import { getInitials } from 'utils/getInitials'
import Modal from 'components/Modal'
import Button from 'components/Button'
import { SidebarContext } from 'contexts/Sidebar'
import SEO from 'components/SEO'

interface IAdminLayout {
	children: ReactNode
	className?: string
	title?: string
	image?: string
	type?: string
	url?: string
	description?: string
}

const AdminLayout: FC<IAdminLayout> = ({ children, className, title, image, type, url, description }) => {
	const { state: sidebarState, dispatch: sidebarDispatch } = useContext(SidebarContext)
	const windowSize = useWindowSize()
	const { state, dispatch } = useContext(SessionContext)

	const navigate = useNavigate()

	const [blockScroll, allowScroll] = useScrollBlock()
	const [isClosing, setIsClosing] = useState(false)

	const handleBlockScroll = () => {
		if (windowSize.width !== undefined && windowSize.width < 640) {
			if (sidebarState.isOpen) {
				allowScroll()
			} else {
				blockScroll()
			}
		}
	}

	const handleLogout = () => {
		dispatch({ type: 'LOGOUT' })
		setIsClosing(false)
		navigate('/')
	}

	return (
		<div className="min-h-screen w-full flex flex-1 items-center flex-col">
			<SEO
				title={title}
				image={image}
				type={type}
				url={url !== undefined ? url + location.pathname : undefined}
				description={description}
			/>
			{isClosing && (
				<Modal>
					<h1 className="text-xl font-semibold">Cerrar sesión</h1>
					<p>¿Estas seguro/a que deseas cerrar sesión?</p>
					<div className="grid grid-cols-2 gap-3">
						<Button onClick={() => setIsClosing(false)} fullWidth secondary className="col-span-2 sm:col-span-1">
							Volver
						</Button>
						<Button fullWidth onClick={handleLogout} className="col-span-2 sm:col-span-1">
							Aceptar
						</Button>
					</div>
				</Modal>
			)}
			<header className="fixed top-0 z-40 left-0 right-0 select-none">
				<div className="h-16 flex w-full justify-between text-white bg-pink-600 items-center gap-2 py-3 px-4 shadow-lg">
					<div className="flex items-center gap-2">
						<button
							className="w-10 h-10"
							onClick={() => {
								sidebarDispatch({ type: 'SWITCH' })
								handleBlockScroll()
							}}
						>
							<FontAwesomeIcon icon={faBars} />
						</button>
						<Link to={'/'} className="w-28 p-2">
							<Logotype />
						</Link>
						<span className="uppercase font-semibold tracking-widest">Admin</span>
					</div>
					<Menu as="div" className="relative inline-block text-left">
						<div>
							<Menu.Button className="flex justify-center items-center rounded-full bg-white text-indigo-900 font-semibold h-[36px] w-[36px]">
								{state.user !== null && getInitials(state.user.firstName + ' ' + state.user.lastName)}
							</Menu.Button>
						</div>
						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 mt-2 w-72 text-sm overflow-hidden text-slate-900 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div className="py-1">
									<Menu.Item as={'div'} className="px-4 py-4 text-left w-full">
										<span className="font-semibold">
											{state.user !== null && '¡Hola ' + state.user.firstName + '!'}
										</span>
									</Menu.Item>
								</div>
								<div>
									<Menu.Item
										as={'button'}
										onClick={() => setIsClosing(true)}
										className="px-4 py-3 text-left w-full duration-100 hover:bg-indigo-800 hover:text-white"
									>
										Cerrar sesión
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</header>
			<div className="flex flex-1 w-full relative">
				<Sidebar isOpen={sidebarState.isOpen} handleBlockScroll={handleBlockScroll} size={windowSize} />
				<div className="w-full flex flex-col flex-1">
					<main className={'flex flex-col flex-1 w-full items-center bg-slate-200 mt-16 relative ' + className}>
						{children}
					</main>
					<Footer />
				</div>
			</div>
		</div>
	)
}

export default AdminLayout

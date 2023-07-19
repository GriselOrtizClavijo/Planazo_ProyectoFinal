import { FC, Fragment, useContext, useState } from 'react'
import Logotype from 'assets/icons/Logotype'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBellConcierge, faBookmark, faChevronLeft, faHammer } from '@fortawesome/free-solid-svg-icons'
import { ISession, SessionContext } from 'contexts/Session'
import { getInitials } from 'utils/getInitials'
import { Menu, Transition } from '@headlessui/react'
import Modal from './Modal'
import Button from './Button'

interface ITopbar {
	setMenuOpen?: (arg: boolean) => void
	menuOpen?: boolean
	handleBlockScroll?: () => void
	buttonBack: boolean
	session: ISession | null
}

const Topbar: FC<ITopbar> = ({ buttonBack = false, session }) => {
	const navigate = useNavigate()
	const { dispatch } = useContext(SessionContext)

	const [isClosing, setIsClosing] = useState(false)

	const handleLogout = () => {
		dispatch({ type: 'LOGOUT' })
		setIsClosing(false)
		navigate('/')
	}

	return (
		<>
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
						{buttonBack && (
							<button className="w-10 h-10" onClick={() => navigate(-1)}>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
						)}
						<Link to={'/'} className="w-28 p-2">
							<Logotype />
						</Link>
					</div>
					{session !== null && session.email !== null ? (
						<Menu as="div" className="relative inline-block text-left">
							<div>
								<Menu.Button className="flex justify-center items-center rounded-full bg-white text-indigo-900 font-semibold h-[36px] w-[36px]">
									{getInitials(session.firstName + ' ' + session.lastName)}
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
											<span className="font-semibold">{'¡Hola ' + session.firstName + '!'}</span>
										</Menu.Item>
									</div>
									<div className="py-1 flex flex-col w-full">
										{session.role === 'ADMIN' ? (
											<Menu.Item
												as={Link}
												to="/admin/products"
												onClick={() => null}
												className="px-4 py-3 text-left w-full flex items-center gap-2 duration-100 hover:bg-indigo-800 cursor-pointer hover:text-white"
											>
												<FontAwesomeIcon icon={faHammer} className="text-slate-400 w-5 flex justify-center" />
												<span>Panel de administración</span>
											</Menu.Item>
										) : (
											<>
												<Menu.Item
													as={Link}
													to="/favorites"
													onClick={() => null}
													className="px-4 py-3 text-left w-full flex items-center gap-2 duration-100 hover:bg-indigo-800 cursor-pointer hover:text-white"
												>
													<FontAwesomeIcon icon={faBookmark} className="text-slate-400 w-5 flex justify-center" />
													<span>Mis favoritos</span>
												</Menu.Item>
												<Menu.Item
													as={Link}
													to="/bookings"
													onClick={() => null}
													className="px-4 py-3 text-left w-full flex items-center gap-2 duration-100 hover:bg-indigo-800 cursor-pointer hover:text-white"
												>
													<FontAwesomeIcon icon={faBellConcierge} className="text-slate-400 w-5 flex justify-center" />
													<span>Mis reservas</span>
												</Menu.Item>
											</>
										)}
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
					) : (
						<Link to={'/login'} className="bg-indigo-800 py-2 px-3 rounded-lg font-semibold">
							Iniciar sesión
						</Link>
					)}
				</div>
			</header>
		</>
	)
}

export default Topbar

import { faInstagram, faFacebook, faWhatsapp, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, ReactNode, createContext, useReducer } from 'react'
import { isMobile } from 'react-device-detect'

interface IShareState {
	open: boolean
	url: string
	title: string
}

export interface ISharePayload {
	title?: string
	url: string
}

const handleDispatch = (state: IShareState, payload?: ISharePayload): IShareState => {
	if (!state.open && payload) {
		if (isMobile && navigator.share) {
			navigator
				.share({
					title: payload.title,
					url: payload.url,
				})
				.then(() => {
					console.log('Enlace compartido exitosamente.')
				})
				.catch((error) => {
					console.error('Error al compartir el enlace:', error)
				})
			return {
				open: false,
				url: payload.url,
				title: payload?.title ?? '',
			}
		} else {
			console.error('La Web Share API no es compatible en este navegador.')
			return {
				open: true,
				url: payload.url,
				title: payload?.title ?? '',
			}
		}
	} else {
		return {
			open: false,
			url: '',
			title: '',
		}
	}
}

interface IShareProvider {
	children: ReactNode
}

export const ShareContext = createContext<{
	state: IShareState
	dispatch: React.Dispatch<ISharePayload>
}>({
	state: {
		open: false,
		url: '',
		title: '',
	},
	dispatch: () => null,
})

const ShareProvider: FC<IShareProvider> = ({ children }) => {
	const initialState: IShareState = {
		open: false,
		url: '',
		title: '',
	}

	const [state, dispatch] = useReducer(handleDispatch, initialState)

	const handleShareFacebook = () => {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(state.url)}`
		const popupWidth = 600
		const popupHeight = 400
		const left = window.innerWidth / 2 - popupWidth / 2
		const top = window.innerHeight / 2 - popupHeight / 2

		window.open(url, 'FacebookPreview', `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`)
	}

	const handleShareTwitter = () => {
		const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(state.url)}`
		const popupWidth = 600
		const popupHeight = 400
		const left = window.innerWidth / 2 - popupWidth / 2
		const top = window.innerHeight / 2 - popupHeight / 2

		window.open(url, 'Twitter', `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`)
	}

	const handleShareWhatsApp = () => {
		const url = `https://wa.me/?text=${encodeURIComponent(state.url)}`
		window.open(url)
	}

	const handleShareEmail = () => {
		const url = `mailto:?&body=${encodeURIComponent(state.url)}`
		window.open(url)
	}

	const handleCopyClipboard = () => {
		navigator.clipboard.writeText(state.url)
	}

	const shareOptions = [
		{
			id: 1,
			title: 'Facebook',
			icon: <FontAwesomeIcon icon={faFacebook} />,
			onClick: handleShareFacebook,
		},
		{
			id: 5,
			title: 'Twitter',
			icon: <FontAwesomeIcon icon={faTwitter} />,
			onClick: handleShareTwitter,
		},
		{
			id: 0,
			title: 'Instagram',
			icon: <FontAwesomeIcon icon={faInstagram} />,
			onClick: () => null,
		},
		{
			id: 2,
			title: 'WhatsApp',
			icon: <FontAwesomeIcon icon={faWhatsapp} />,
			onClick: handleShareWhatsApp,
		},
		{
			id: 3,
			title: 'Correo',
			icon: <FontAwesomeIcon icon={faEnvelope} />,
			onClick: handleShareEmail,
		},
		{
			id: 4,
			title: 'Copiar URL',
			icon: <FontAwesomeIcon icon={faLink} />,
			onClick: handleCopyClipboard,
		},
	]

	return (
		<ShareContext.Provider value={{ state, dispatch }}>
			{children}
			<Transition show={state.open} as={Fragment}>
				<Dialog open={state.open} onClose={dispatch} className="relative z-40">
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
						enter="ease-out duration-300 transform"
						enterFrom="translate-y-full"
						enterTo="translate-y-0"
						leave="ease-in duration-200 transform"
						leaveFrom="translate-y-0"
						leaveTo="translate-y-full"
					>
						<div className="flex min-h-full items-end justify-center fixed inset-0 sm:items-center">
							<Dialog.Panel
								className={'w-full bg-slate-800 text-white p-5 flex flex-col gap-6 sm:w-fit sm:rounded-xl sm:p-8'}
							>
								<h3 className="text-xl font-semibold">Compartir</h3>
								<div className="flex items-start gap-4 overflow-x-auto">
									{shareOptions.map((item) => (
										<div key={item.id} className="flex flex-col items-center gap-2 pb-3">
											<button
												onClick={item.onClick}
												className="bg-slate-600 hover:bg-indigo-400 duration-200 text-2xl flex w-14 h-14 justify-center items-center rounded-full"
											>
												{item.icon}
											</button>
											<button onClick={item.onClick} className="whitespace-nowrap">
												{item.title}
											</button>
										</div>
									))}
								</div>
							</Dialog.Panel>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition>
		</ShareContext.Provider>
	)
}

export default ShareProvider

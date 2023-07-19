import { FC, ReactNode, useContext } from 'react'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { SessionContext } from 'contexts/Session'
import SEO from 'components/SEO'

interface IMainLayout {
	children: ReactNode
	buttonBack?: boolean
	className?: string
	title?: string
	image?: string
	type?: string
	url?: string
	description?: string
}

const MainLayout: FC<IMainLayout> = ({
	children,
	buttonBack = false,
	className,
	title,
	image,
	type,
	url,
	description,
}) => {
	const { state } = useContext(SessionContext)
	return (
		<div className="min-h-screen w-full flex flex-1 items-center flex-col">
			<SEO
				title={title}
				image={image}
				type={type}
				url={url !== undefined ? url + location.pathname : undefined}
				description={description}
			/>
			<Topbar buttonBack={buttonBack} session={state.user} />
			<main className={'flex flex-col flex-1 w-full items-center bg-slate-200 mt-16 ' + (className ?? '')}>
				{children}
			</main>
			<Footer />
		</div>
	)
}

export default MainLayout

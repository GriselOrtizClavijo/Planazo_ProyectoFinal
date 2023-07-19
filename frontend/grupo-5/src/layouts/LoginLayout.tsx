import { FC, ReactNode } from 'react'
import Footer from 'components/Footer'

interface ILoginLayout {
	children: ReactNode
	className?: string
}

const LoginLayout: FC<ILoginLayout> = ({ children, className }) => {
	return (
		<div className={'min-h-screen w-full flex flex-1 items-center flex-col ' + className}>
			<main className="flex flex-col flex-1 w-full items-center justify-center gap-6 bg-pink-600 login-pattern-bg px-8">
				{children}
			</main>
			<Footer />
		</div>
	)
}

export default LoginLayout

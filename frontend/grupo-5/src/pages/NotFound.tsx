import MainLayout from 'layouts/MainLayout'
import Background from 'assets/img/Background.svg'
import Lost from 'assets/img/Lost.svg'
import Button from 'components/Button'

const NotFound = () => {
	return (
		<MainLayout>
			<div className="flex flex-col flex-1 items-center w-full pt-40 relative">
				<img src={Background} alt="background" className="w-full z-0 h-full object-cover absolute inset-y-0" />
				<img src={Lost} alt="background" className="w-full max-w-[900px] z-10 object-cover absolute bottom-0" />
				<div className="z-20 flex flex-col gap-6">
					<div className="flex flex-col">
						<h3 className="text-7xl text-center font-bold">404</h3>
						<span className="text-center">Página no encontrada</span>
					</div>
					<div className="flex text-lg flex-col items-center gap-2">
						<h2>
							<span className="font-semibold">Ups!</span> Parece que te perdiste 😅
						</h2>
						<Button type="link" to={'/'} className="text-indigo-800 font-semibold hover:underline mt-4">
							Volver al inicio
						</Button>
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

export default NotFound

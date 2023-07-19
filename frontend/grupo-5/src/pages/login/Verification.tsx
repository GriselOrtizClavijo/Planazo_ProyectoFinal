import LoginLayout from 'layouts/LoginLayout'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EmailSended from 'assets/img/EmailSended.svg'
import { useVerifyAccount } from 'services/auth'
import Button from 'components/Button'
import Spinner from 'components/Spinner'

const Verification = () => {
	const [isFetching, setIsFetching] = useState(true)

	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const token = searchParams.get('token')
	const navigate = useNavigate()
	const verifyAccount = useVerifyAccount(token !== null ? token : '')

	useEffect(() => {
		if (token === null || token === '') {
			navigate('/login')
		} else {
			verifyAccount.refetch().then((res) => {
				if (res.status === 'success') {
					setIsFetching(false)
				} else {
					console.error(res)
				}
			})
		}
	}, [])

	return (
		<LoginLayout>
			<div className="bg-white p-6 flex flex-col gap-6 items-center w-full justify-center max-w-md min-h-[400px] rounded-lg">
				{isFetching ? (
					<Spinner className="w-[50px] h-[50px]" />
				) : (
					<>
						<div className="relative flex w-full h-[180px]">
							<img src={EmailSended} alt="background" className="w-full z-0 h-full absolute inset-y-0" />
						</div>
						<h1 className="font-semibold text-xl">¡Tu cuenta ha sido verificada con éxito!</h1>
						<div className="flex flex-col w-full gap-2">
							<p className="text-justify">
								Ya puedes disfrutar de todos los beneficios de nuestra web, como reservar productos y puntuar aquellos
								que contrataste.
							</p>
							<p className="text-justify">
								Hemos enviado un correo electrónico a tu bandeja de entrada con los datos personales que registraste,
								pero puedes acceder a ellos en cualquier momento desde la sección Mi perfil.
							</p>
						</div>
						<div>
							<Button onClick={() => navigate('/login')}>Volver al inicio</Button>
						</div>
					</>
				)}
			</div>
		</LoginLayout>
	)
}

export default Verification

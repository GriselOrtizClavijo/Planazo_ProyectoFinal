import Button from 'components/Button'
import { useContext, useState } from 'react'
import { sleep } from 'utils/sleep'
import { SessionContext } from 'contexts/Session'
import { useDeleteBooking, useGetBookings } from 'services/bookings'
import BookingItem from 'components/BookingItem'
import MainLayout from 'layouts/MainLayout'
import { isAfter } from 'date-fns'

const Bookings = () => {
	const [isDeleting, setIsDeleting] = useState(false)
	const [deletingFetch, setDeletingFetch] = useState(false)
	const [selected, setSelected] = useState<number>()
	const { state } = useContext(SessionContext)
	const bookings = useGetBookings(state.user?.token ?? '')
	const deleteBooking = useDeleteBooking()

	const handleDelete = (id: number) => {
		setSelected(id)
		setIsDeleting(true)
	}

	const confirmDelete = () => {
		if (selected !== undefined) {
			setDeletingFetch(true)
			const body = {
				id: selected,
				token: state.user?.token ?? '',
			}
			deleteBooking.mutate(body, {
				onSuccess: async () => {
					setSelected(undefined)
					setIsDeleting(false)
					setDeletingFetch(false)
					await sleep(100)
					bookings.refetch()
				},
			})
		}
	}

	return (
		<MainLayout title="Mis reservas">
			{isDeleting && (
				<>
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10" aria-hidden="true" />
					<div className="flex min-h-full items-center justify-center p-4 fixed inset-0 z-20">
						<div className="w-full max-w-sm rounded-lg bg-white p-5 flex flex-col gap-6">
							<span className="text-2xl font-semibold">Eliminar reserva</span>
							<span>¿Estás seguro que deseas eliminar esta reserva?</span>
							<div className="flex gap-2 w-full justify-between">
								<Button
									onClick={() => {
										setIsDeleting(false)
										setSelected(undefined)
									}}
									fullWidth
									secondary
								>
									Cancelar
								</Button>
								<Button
									onClick={async () => {
										confirmDelete()
									}}
									fullWidth
									isLoading={deletingFetch}
								>
									Aceptar
								</Button>
							</div>
						</div>
					</div>
				</>
			)}
			<div className="w-full max-w-3xl py-10 flex flex-col gap-8">
				<h1 className="text-2xl font-bold px-6 lg:px-0">Mis reservas</h1>
				{bookings.isFetching ? (
					<div className="product-container">
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className="product-item-placeholder"></div>
						))}
					</div>
				) : bookings.data !== undefined ? (
					<>
						{bookings.data.find((b) => isAfter(new Date(b.dateStart), new Date())) && (
							<div className="flex flex-col gap-4 w-full">
								<h2 className="text-slate-700 font-semibold text-xl px-6 lg:px-0">Pendientes</h2>
								<div className="product-container">
									{bookings.data
										.filter((b) => isAfter(new Date(b.dateStart), new Date()))
										.map((cat) => (
											<BookingItem
												key={cat.id}
												handleDelete={handleDelete}
												to={'/booking/' + cat.id}
												{...cat}
												pending
											/>
										))}
								</div>
							</div>
						)}
						{bookings.data.find((b) => !isAfter(new Date(b.dateStart), new Date())) && (
							<div className="flex flex-col gap-4 w-full">
								<h2 className="text-slate-700 font-semibold text-xl px-6 lg:px-0">Realizadas</h2>
								<div className="product-container">
									{bookings.data
										.filter((b) => !isAfter(new Date(b.dateStart), new Date()))
										.map((cat) => (
											<BookingItem key={cat.id} handleDelete={handleDelete} to={'/booking/' + cat.id} {...cat} />
										))}
								</div>
							</div>
						)}
					</>
				) : (
					<div className="w-full flex justify-center items-center text-slate-500 h-[200px]">
						<span>No existen resultados</span>
					</div>
				)}
			</div>
		</MainLayout>
	)
}

export default Bookings

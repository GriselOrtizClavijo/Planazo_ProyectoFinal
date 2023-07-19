import AdminLayout from 'layouts/AdminLayout'
import Button from 'components/Button'
import { useState, useContext } from 'react'
import Modal from 'components/Modal'
import { useDeleteUser, useGetUsers } from 'services/users'
import { SessionContext } from 'contexts/Session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { sleep } from 'utils/sleep'
import { Link } from 'react-router-dom'

const AdminUsers = () => {
	const [isDeleting, setIsDeleting] = useState(false)
	const { state } = useContext(SessionContext)
	const users = useGetUsers({ token: state.user?.token ?? '', refetchOnMount: 'always' })
	const deleteUser = useDeleteUser()
	const [selected, setSelected] = useState<number>()

	const handleDelete = (id: number) => {
		setSelected(id)
		setIsDeleting(true)
	}

	const confirmDelete = () => {
		if (selected !== undefined) {
			const body = {
				id: selected,
				token: state.user?.token ?? '',
			}
			deleteUser.mutate(body, {
				onSuccess: async () => {
					setSelected(undefined)
					setIsDeleting(false)
					await sleep(100)
					users.refetch()
				},
			})
		}
	}

	return (
		<AdminLayout>
			{isDeleting && (
				<Modal>
					<div className="text-2xl font-semibold">Eliminar usuario</div>
					<div>¿Estás seguro que deseas eliminar este usuario?</div>
					<div className="flex gap-2 w-full justify-between">
						<Button
							onClick={() => {
								setIsDeleting(false)
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
						>
							Aceptar
						</Button>
					</div>
				</Modal>
			)}
			<div className="w-full max-w-3xl py-10 flex flex-col flex-1 gap-6">
				<div className="flex items-center px-6 md:px-0 justify-between gap-4">
					<h1 className="text-2xl font-bold">Usuarios</h1>
				</div>
				<div className="product-container md:px-0">
					{users.isFetching ? (
						Array.from({ length: 10 }).map((_, index) => <div key={index} className="product-item-placeholder"></div>)
					) : users.data !== undefined ? (
						users.data.map((user) => (
							<Link
								to={'/admin/user/' + user.id}
								key={user.id}
								className="flex w-full justify-between bg-white shadow-lg gap-3 p-3 items-center cursor-pointer sm:rounded-lg hover:shadow-xl duration-200"
							>
								<div className="flex flex-col">
									<span
										className={'font-semibold text-sm ' + (user.role === 'ADMIN' ? 'text-pink-600' : 'text-indigo-600')}
									>
										{user.role}
									</span>
									<span>{user.email}</span>
								</div>
								{user.role !== 'ADMIN' && (
									<button
										onClick={(e) => {
											e.preventDefault()
											handleDelete(user.id)
										}}
										className="flex justify-center items-center h-10 min-w-[40px] w-10 text-slate-400 hover:text-indigo-700 rounded-full hover:bg-slate-200 duration-200"
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								)}
							</Link>
						))
					) : (
						<div className="w-full flex justify-center items-center text-slate-500 h-[200px]">
							<span>No existen resultados</span>
						</div>
					)}
				</div>
			</div>
		</AdminLayout>
	)
}

export default AdminUsers

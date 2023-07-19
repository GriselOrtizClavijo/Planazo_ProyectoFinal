import AdminLayout from 'layouts/AdminLayout'
import Button from 'components/Button'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow } from 'components/Table'
import { Fragment, useContext, useMemo, useState } from 'react'
import { SessionContext } from 'contexts/Session'
import { useDeleteCity, useGetCities } from 'services/cities'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { sleep } from 'utils/sleep'
import Modal from 'components/Modal'
import Spinner from 'components/Spinner'

interface IColumn {
	id: string
	label: string
	className?: string
}

const AdminCities = () => {
	const columns: IColumn[] = useMemo(
		() => [
			{
				id: 'id',
				label: 'ID',
			},
			{
				id: 'name',
				label: 'Nombre',
			},
			{
				id: 'province',
				label: 'Provincia',
			},
		],
		[],
	)
	const [isDeleting, setIsDeleting] = useState(false)
	const [selected, setSelected] = useState<number>()
	const { state } = useContext(SessionContext)
	const cities = useGetCities({ refetchOnMount: 'always' })
	const deleteCity = useDeleteCity()
	const navigate = useNavigate()

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
			deleteCity.mutate(body, {
				onSuccess: async () => {
					setSelected(undefined)
					setIsDeleting(false)
					await sleep(100)
					cities.refetch()
				},
			})
		}
	}

	return (
		<AdminLayout>
			{isDeleting && (
				<Modal>
					<span className="text-2xl font-semibold">Eliminar ciudad</span>
					<span>¿Estás seguro que deseas eliminar esta ciudad?</span>
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
			<div className="w-full max-w-3xl py-10 flex flex-1 flex-col gap-6">
				<div className="flex items-center justify-between gap-4 px-6 md:px-0">
					<h1 className="text-2xl font-bold">Ciudades</h1>
					<div className="flex max-w-[200px]">
						<Button type="link" to="/admin/city/add">
							Nueva
						</Button>
					</div>
				</div>
				{cities.data !== undefined && !cities.isFetching ? (
					<Table className="table-auto">
						<TableHead>
							<TableHeadRow>
								{columns.map((c) => (
									<TableHeadCell key={c.id} id={c.id} className={c.className}>
										{c.label}
									</TableHeadCell>
								))}
							</TableHeadRow>
						</TableHead>
						<TableBody>
							{cities.data?.map((city) => (
								<Fragment key={city.id}>
									<TableRow
										className="relative cursor-pointer"
										onClick={(e) => {
											e.preventDefault()
											navigate('/admin/city/' + city.id)
										}}
									>
										<TableCell className="max-w-[180px] text-ellipsis md:max-w-[220px]">{city.id}</TableCell>
										<TableCell className="max-w-[180px] text-ellipsis md:max-w-[220px]">{city.name}</TableCell>
										<TableCell className="max-w-[180px] text-ellipsis md:max-w-[220px]">{city.province}</TableCell>
										<TableCell
											onClick={(e) => {
												e.stopPropagation()
												e.preventDefault()
											}}
											className="max-w-[180px] text-ellipsis md:max-w-[220px]"
										>
											<button
												onClick={(e) => {
													e.preventDefault()
													handleDelete(city.id)
												}}
												className="flex justify-center items-center h-8 min-w-[32px] w-8 text-slate-400 hover:text-indigo-700 rounded-full hover:bg-slate-200 duration-200"
											>
												<FontAwesomeIcon icon={faTrash} />
											</button>
										</TableCell>
									</TableRow>
								</Fragment>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="flex flex-1 justify-center items-center">
						<Spinner fill="#DB2777" />
					</div>
				)}
			</div>
		</AdminLayout>
	)
}

export default AdminCities

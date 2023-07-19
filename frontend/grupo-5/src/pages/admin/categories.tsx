import AdminLayout from 'layouts/AdminLayout'
import Button from 'components/Button'
import { useContext, useState } from 'react'
import { sleep } from 'utils/sleep'
import { useDeleteCategory, useGetCategories } from 'services/categories'
import CategoryItem from 'components/CategoryItem'
import { SessionContext } from 'contexts/Session'

const AdminCategories = () => {
	const [isDeleting, setIsDeleting] = useState(false)
	const [selected, setSelected] = useState<number>()
	const getCategories = useGetCategories({ refetchOnMount: 'always' })
	const deleteCategory = useDeleteCategory()
	const { state } = useContext(SessionContext)

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
			deleteCategory.mutate(body, {
				onSuccess: async () => {
					setSelected(undefined)
					setIsDeleting(false)
					await sleep(100)
					getCategories.refetch()
				},
			})
		}
	}

	return (
		<AdminLayout>
			{isDeleting && (
				<>
					<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10" aria-hidden="true" />
					<div className="flex min-h-full items-center justify-center p-4 fixed inset-0 z-20">
						<div className="w-full max-w-sm rounded-lg bg-white p-5 flex flex-col gap-6">
							<span className="text-2xl font-semibold">Eliminar categoría</span>
							<span>¿Estás seguro que deseas eliminar esta categoría?</span>
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
								>
									Aceptar
								</Button>
							</div>
						</div>
					</div>
				</>
			)}
			<div className="w-full max-w-3xl py-10 flex flex-col flex-1 gap-6">
				<div className="flex items-center px-6 lg:px-0 justify-between gap-4">
					<h1 className="text-2xl font-bold">Categorías</h1>
					<div className="flex max-w-[200px]">
						<Button type="link" to="/admin/category/add">
							Nueva
						</Button>
					</div>
				</div>
				<div className="product-container">
					{getCategories.isFetching ? (
						Array.from({ length: 10 }).map((_, index) => <div key={index} className="product-item-placeholder"></div>)
					) : getCategories.data !== undefined ? (
						getCategories.data.map((cat) => <CategoryItem key={cat.id} handleDelete={handleDelete} {...cat} />)
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

export default AdminCategories

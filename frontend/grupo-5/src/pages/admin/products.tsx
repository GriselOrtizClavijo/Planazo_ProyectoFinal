import AdminLayout from 'layouts/AdminLayout'
import Button from 'components/Button'
import { useContext, useEffect, useState } from 'react'
import { IFilterParams, useDeleteProduct, useGetProducts } from 'services/products'
import { sleep } from 'utils/sleep'
import Pagination from 'components/Pagination'
import ProductItem from 'components/ProductItem'
import Modal from 'components/Modal'
import { SessionContext } from 'contexts/Session'

const AdminProducts = () => {
	const [params, setParams] = useState<IFilterParams>({ page: 1 })
	const [isDeleting, setIsDeleting] = useState(false)
	const [selected, setSelected] = useState<number>()
	const getProducts = useGetProducts({ params, refetchOnMount: 'always' })
	const deleteProduct = useDeleteProduct()
	const { state } = useContext(SessionContext)

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
		})
	}, [params.page])

	const handleNextPage = async () => {
		setParams({ ...params, page: params?.page + 1 })
		await sleep(100)
		getProducts.refetch()
	}

	const handlePreviousPage = async () => {
		setParams({ ...params, page: params?.page - 1 })
		await sleep(100)
		getProducts.refetch()
	}

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
			deleteProduct.mutate(body, {
				onSuccess: async () => {
					setSelected(undefined)
					setIsDeleting(false)
					await sleep(100)
					getProducts.refetch()
				},
			})
		}
	}

	return (
		<AdminLayout>
			{isDeleting && (
				<Modal>
					<div className="text-2xl font-semibold">Eliminar producto</div>
					<div>¿Estás seguro que deseas eliminar este producto?</div>
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
				</Modal>
			)}
			<div className="w-full max-w-3xl py-10 flex flex-col flex-1 gap-6">
				<div className="flex items-center px-6 lg:px-0 justify-between gap-4">
					<h1 className="text-2xl font-bold">Productos</h1>
					<div className="flex max-w-[200px]">
						<Button type="link" to="/admin/product/add">
							Nuevo
						</Button>
					</div>
				</div>
				<div className="product-container">
					{getProducts.data?.data !== undefined && !getProducts.isFetching ? (
						<>
							{getProducts.data.data.map((item) => (
								<ProductItem
									key={item.id}
									id={item.id}
									img={item.img}
									title={item.title}
									rating={item.rating}
									price={item.price}
									location={item.location}
									handleDelete={handleDelete}
								/>
							))}
						</>
					) : (
						<>
							{Array.from({ length: 10 }).map((_, index) => (
								<div key={index} className="product-item-placeholder"></div>
							))}
						</>
					)}
				</div>
				{getProducts.data !== undefined && (
					<Pagination
						className="px-6"
						current_page={getProducts.data.pagination.current_page}
						page_size={getProducts.data.pagination.page_size}
						previous_page={getProducts.data.pagination.previous_page}
						next_page={getProducts.data.pagination.next_page}
						total_pages={getProducts.data.pagination.total_pages}
						handleNextPage={handleNextPage}
						handlePreviousPage={handlePreviousPage}
					/>
				)}
			</div>
		</AdminLayout>
	)
}

export default AdminProducts

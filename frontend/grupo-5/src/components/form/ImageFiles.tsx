import { faCloudArrowUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useRef, ReactNode, useState, useEffect } from 'react'

interface IImageFilesBase {
	name: string
	label: string
	placeholder?: string
	value: any
	onChange: (e: any) => void
	editable?: boolean
	icon?: ReactNode
	className?: string
	error?: any
	previews?: Array<{ url: string }>
	maxSizeMB?: number
	setPreviews?: (arg: { url: string; name?: string }[]) => void
}

interface IImageFilesMultiple extends IImageFilesBase {
	multiple: true
	max: number
}

interface IImageFilesSimple extends IImageFilesBase {
	multiple?: never
	max?: never
}

type IImageFiles = IImageFilesSimple | IImageFilesMultiple

const ImageFiles: FC<IImageFiles> = ({
	name,
	label,
	placeholder,
	onChange,
	multiple = false,
	className,
	error,
	previews = [],
	setPreviews = () => null,
	editable = true,
	max = 1,
	maxSizeMB,
	value,
}) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [maxError, setMaxError] = useState<string>()

	useEffect(() => {
		if (value.length === 0) {
			setSelectedFiles([])
			setMaxError(undefined)
		}
	}, [value])

	const handleFileChange = () => {
		if (inputRef.current && inputRef.current.files) {
			const newFiles = Array.from(inputRef.current.files)
			if (maxSizeMB !== undefined && newFiles.some((file) => file.size > maxSizeMB * 1024 * 1024)) {
				setMaxError('Límite excedido. Tamáño máximo por imagen: ' + maxSizeMB + ' Mb.')
			} else {
				const newPreviews = newFiles.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
				if (selectedFiles.length + newPreviews.length > max) {
					setMaxError('No se pueden cargar mas de ' + max + ' imagenes.')
					const dt = new DataTransfer()
					selectedFiles.forEach((f) => {
						dt.items.add(f)
					})
					inputRef.current.files = dt.files
				} else {
					setMaxError(undefined)
					setPreviews(previews.concat(newPreviews))
					const newSelectedFiles = selectedFiles.concat(newFiles)
					setSelectedFiles(newSelectedFiles)
					onChange(newSelectedFiles)
				}
			}
		}
	}

	const handleButtonClick = () => {
		if (inputRef.current) {
			inputRef.current.click()
		}
	}

	const handleDeleteFile = (file: { url: string; name?: string }) => {
		if (inputRef.current && inputRef.current.files) {
			if (file.name !== undefined) {
				const newFiles = Array.from(inputRef.current.files).filter((f) => f.name !== file.name)
				const dt = new DataTransfer()
				newFiles.forEach((f) => {
					dt.items.add(f)
				})
				inputRef.current.files = dt.files
				onChange(newFiles)
			}

			const newPreviews = previews.filter((p) => p.url !== file.url)
			setPreviews(newPreviews)
		}
	}

	return (
		<div className={'flex w-full flex-col gap-1 relative ' + (className ?? '')}>
			<label className="text-sm font-semibold" htmlFor={name}>
				{label}
			</label>
			<div className="relative">
				<input
					type="file"
					accept="image/png, image/jpeg"
					id={name}
					ref={inputRef}
					placeholder={placeholder}
					onChange={handleFileChange}
					multiple={multiple}
					disabled={!editable}
					className={
						'hidden relative m-0 bg-slate-100 file:h-12 w-full min-w-0 flex-auto rounded bg-clip-padding py-[0.32rem] transition duration-200 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-indigo-800 file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] file:text-white hover:file:bg-indigo-900 hover:file:cursor-pointer focus:border-indigo focus:text-neutral-700 focus:shadow-te-indigo focus:outline-none' +
						(error !== undefined || maxError !== undefined
							? ' border-2 border-red-300 outline-red-500'
							: ' border border-slate-200 outline-indigo-500') +
						(inputRef.current && inputRef.current.files ? ' pl-3 pr-10' : ' px-3')
					}
				/>
			</div>
			<div className="h-40 bg-slate-100 rounded-md p-5 flex gap-4 items-center justify-between">
				{previews.length > 0 && (
					<div className="overflow-x-auto">
						<div className="flex w-fit gap-2">
							{previews.map((file, i) => (
								<div key={i} className="rounded-sm overflow-hidden relative h-[120px] w-[120px]">
									{editable && (
										<button
											onClick={() => {
												handleDeleteFile(file)
											}}
											type="button"
											className="absolute inset-0 bg-black/50 text-white flex justify-center items-center opacity-0 hover:opacity-100 duration-200"
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									)}
									<img
										className="object-cover h-full w-full"
										src={file.url}
										alt={`Preview ${i}`}
										width={100}
										height={100}
									/>
								</div>
							))}
						</div>
					</div>
				)}
				{previews.length < max && (
					<button
						type="button"
						onClick={handleButtonClick}
						className={
							'border-2 rounded border-dashed border-spacing-2 flex-col justify-center items-center gap-2 ' +
							(error !== undefined ? 'border-red-400 text-red-500 ' : 'border-slate-400 text-slate-600 ') +
							(previews.length > 0
								? multiple
									? 'flex w-[50px] h-[50px] min-w-[50px] rounded-full '
									: 'hidden '
								: 'w-full flex h-full ')
						}
					>
						{previews.length > 0 ? (
							<FontAwesomeIcon icon={faPlus} className="text-2xl" />
						) : (
							<>
								<FontAwesomeIcon icon={faCloudArrowUp} className="text-4xl" />
								<span className="font-semibold">{placeholder}</span>
							</>
						)}
					</button>
				)}
			</div>
			<span className="font-semibold text-red-500 text-sm min-h-[16px]">{(error || maxError) ?? ''}</span>
		</div>
	)
}

export default ImageFiles

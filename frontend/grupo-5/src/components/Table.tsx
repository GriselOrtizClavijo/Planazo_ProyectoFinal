import { type ComponentProps, type PropsWithChildren, type FC } from 'react'

const Table: FC<PropsWithChildren<ComponentProps<'table'>>> = ({ children, className = '' }) => {
	return <table className={'w-full border-separate border-spacing-y-2 ' + className}>{children}</table>
}

const TableHead: FC<PropsWithChildren<ComponentProps<'thead'>>> = ({ children, className = '' }) => {
	return <thead className={className}>{children}</thead>
}

const TableBody: FC<PropsWithChildren<ComponentProps<'tbody'>>> = ({ children, className = '' }) => {
	return <tbody className={className}>{children}</tbody>
}

const TableHeadRow: FC<PropsWithChildren<ComponentProps<'tr'>>> = ({ children, className = '' }) => {
	return <tr className={className}>{children}</tr>
}

const TableRow: FC<PropsWithChildren<ComponentProps<'tr'>>> = ({ children, className = '', ...props }) => {
	return (
		<tr
			className={'shadow-md rounded-lg bg-white overflow-hidden duration-200 hover:shadow-slate-400 ' + className}
			{...props}
		>
			{children}
		</tr>
	)
}

const TableHeadCell: FC<PropsWithChildren<ComponentProps<'th'>>> = ({ children, className = '' }) => {
	return (
		<th className={'p-2 px-0 md:px-2 text-center ' + className}>
			<div className="flex justify-center items-center gap-2 relative px-8">{children}</div>
		</th>
	)
}

const TableCell: FC<PropsWithChildren<ComponentProps<'td'>>> = ({ children, className = '', ...props }) => {
	return (
		<td
			className={
				'py-4 px-0 md:px-4 md:first:rounded-l-lg md:last:rounded-r-lg text-center overflow-hidden ' + className
			}
			{...props}
		>
			{children}
		</td>
	)
}

export { Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow }

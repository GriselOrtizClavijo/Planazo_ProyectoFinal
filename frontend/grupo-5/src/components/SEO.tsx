import { FC } from 'react'
import { Helmet } from 'react-helmet-async'

interface ISEO {
	title?: string
	description?: string
	name?: string
	type?: string
	url?: string
	image?: string
}

const SEO: FC<ISEO> = ({ title, description, name, type, image, url }) => {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{title !== undefined ? title + ' | Planazo' : 'Planazo'}</title>
			<meta name="description" content={description} />
			{/* End standard metadata tags */}
			{/* Facebook tags */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={title} />
			<meta property="og:url" content={url} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:image:alt" content={description} />
			{/* End Facebook tags */}
			{/* Twitter tags */}
			<meta name="twitter:creator" content={name} />
			<meta name="twitter:card" content={type} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{/* End Twitter tags */}
		</Helmet>
	)
}

export default SEO

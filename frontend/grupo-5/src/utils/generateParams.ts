export const generateMultipleParams = <T>(queryParams: T): string => {
	const transformedParams: string[] = []

	for (const key in queryParams) {
		const value = queryParams[key]

		if (Array.isArray(value)) {
			value.forEach((item) => {
				transformedParams.push(`${key}=${item}`)
			})
		} else {
			transformedParams.push(`${key}=${value}`)
		}
	}

	return `?${transformedParams.join('&')}`
}

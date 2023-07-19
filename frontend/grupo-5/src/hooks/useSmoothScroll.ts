import React, { useEffect, useRef } from 'react'

const useSmoothScroll = (): ((ref: React.RefObject<HTMLElement>, offset?: number) => void) => {
	const scrollRef = useRef<HTMLElement | null>(null)

	const smoothScroll = (ref: React.RefObject<HTMLElement>, offset?: number): void => {
		if (ref.current) {
			const { current } = ref
			const topOffset = offset !== undefined ? current.offsetTop - offset : current.offsetTop

			scrollRef.current?.scrollTo({
				top: topOffset,
				behavior: 'smooth',
			})
		}
	}

	useEffect(() => {
		scrollRef.current = document.documentElement
	}, [])

	return smoothScroll
}

export default useSmoothScroll

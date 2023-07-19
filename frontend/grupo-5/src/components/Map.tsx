import { FC, useEffect, useRef } from 'react'

interface MapProps extends google.maps.MapOptions {
	className?: string
	markers?: {
		id: string | number
		position: google.maps.LatLngLiteral
		infoContent?: string | Element | Text | null
	}[]
	center?: google.maps.LatLngLiteral
	zoom?: number
	targetRef?: any
	handleSetMarker?: (arg: google.maps.LatLngLiteral) => void
	bounds?: {
		NW: google.maps.LatLngLiteral
		SE: google.maps.LatLngLiteral
	}
	customMarker?: string
}

interface MapMarker {
	marker: google.maps.Marker
	infoWindow?: google.maps.InfoWindow
}

const Map: FC<MapProps> = ({
	className,
	markers,
	zoom = 4,
	center,
	targetRef,
	handleSetMarker,
	bounds = {
		NW: { lat: -55.77952154926162, lng: -88.541047044945 },
		SE: { lat: -21.320175270758586, lng: -45.68778785795011 },
	},
	customMarker,
}) => {
	const mapRef = useRef<google.maps.Map | null>(null)
	const markersRef = useRef<MapMarker[]>([])
	const geocoder = new google.maps.Geocoder()

	const defaultCenter = { lat: -35.173098159107255, lng: -65.33673604482283 }

	const markerIcon =
		customMarker !== undefined
			? {
					url: customMarker,
					scaledSize: new window.google.maps.Size(45, 45),
			  }
			: undefined

	const getCountry = (results: google.maps.GeocoderResult[]) => {
		for (const result of results) {
			for (const component of result.address_components) {
				if (component.types.includes('country')) {
					return component.long_name
				}
			}
		}
		return ''
	}

	// const [geoResults, setGeoResults] = useState<google.maps.GeocoderResult[] | undefined>()
	// const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[] | undefined>()

	// const autoCompleteRef = useRef<HTMLInputElement | null>(null)
	// const autoCompleteService = new window.google.maps.places.AutocompleteService()

	// const searchPredictions = (query: string) => {
	// 	autoCompleteService.getPlacePredictions(
	// 		{
	// 			input: query,
	// 			types: ['locality'],
	// 			componentRestrictions: { country: 'ar' },
	// 		},
	// 		function (newPredictions, status) {
	// 			if (status === google.maps.places.PlacesServiceStatus.OK && newPredictions !== null) {
	// 				setPredictions(newPredictions)
	// 			} else {
	// 				setPredictions(undefined)
	// 			}
	// 		},
	// 	)
	// }

	// const getProvince = (results: google.maps.GeocoderResult[]) => {
	// 	for (const result of results) {
	// 		for (const component of result.address_components) {
	// 			if (component.types.includes('administrative_area_level_1')) {
	// 				return component.long_name
	// 			}
	// 		}
	// 	}
	// 	return ''
	// }

	// const getCity = (results: google.maps.GeocoderResult[]) => {
	// 	for (const result of results) {
	// 		for (const component of result.address_components) {
	// 			if (component.types.includes('locality')) {
	// 				return component.long_name
	// 			}
	// 		}
	// 	}
	// 	return ''
	// }

	// const getGeoPosition = (address: string) => {
	// 	geocoder.geocode(
	// 		{
	// 			componentRestrictions: {
	// 				country: 'AR',
	// 			},
	// 			address: address,
	// 		},
	// 		function (results, status) {
	// 			if (status === 'OK' && mapRef.current && results !== null) {
	// 				setGeoResults(results)
	// 			} else {
	// 				console.error('Geocode was not successful for the following reason: ' + status)
	// 				setGeoResults(undefined)
	// 			}
	// 		},
	// 	)
	// }

	// const centerMap = (location: google.maps.LatLng) => {
	// 	if (mapRef.current) {
	// 		const newMarker = new google.maps.Marker({
	// 			position: location,
	// 			map: mapRef.current,
	// 		})

	// 		setMarker(newMarker)
	// 		mapRef.current.setCenter(location)
	// 		mapRef.current.setZoom(12)
	// 	} else {
	// 		window.alert('Geocode positioning error')
	// 	}
	// }

	// const getPlaceDetailsById = async (placeId: string): Promise<google.maps.GeocoderResult> => {
	// 	return new Promise((resolve, reject) => {
	// 		geocoder.geocode({ placeId: placeId }, (results, status) => {
	// 			if (status === 'OK' && results && results.length > 0) {
	// 				const result = results[0]
	// 				resolve(result)
	// 			} else {
	// 				console.error('Geocode error:', status)
	// 				reject(new Error(status))
	// 			}
	// 		})
	// 	})
	// }

	const handleClick = (e: google.maps.MapMouseEvent) => {
		const position: google.maps.LatLngLiteral = { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 }
		if (handleSetMarker) {
			geocoder.geocode({ location: position }, (results, status) => {
				if (status === 'OK' && results !== null && results[0] !== undefined) {
					const country = getCountry(results)
					if (country === 'Argentina') {
						const newMarker = new google.maps.Marker({
							position,
							map: mapRef.current,
							...(markerIcon !== undefined && {
								icon: markerIcon,
							}),
						})
						if (markersRef.current[0] !== undefined) {
							markersRef.current[0].marker.setMap(null)
							markersRef.current = [{ marker: newMarker }]
						} else {
							markersRef.current.push({ marker: newMarker })
						}
						handleSetMarker(position)
					} else {
						console.error('Debe seleccionarse un territorio argentino')
					}
				} else {
					console.error('Error en la geocodificación inversa:', status)
				}
			})
		}
	}

	useEffect(() => {
		const mapElement = document.getElementById('map')

		if (!mapElement) {
			console.error('El elemento con el ID "map" no se encuentra en el DOM.')
			return
		}

		mapRef.current = new google.maps.Map(mapElement, {
			center: center ?? (markers !== undefined ? markers[0].position : defaultCenter),
			zoom,
			restriction: {
				latLngBounds: new google.maps.LatLngBounds(
					new google.maps.LatLng(bounds.NW.lat, bounds.NW.lng),
					new google.maps.LatLng(bounds.SE.lat, bounds.SE.lng),
				),
				strictBounds: true,
			},
		})

		if (markers !== undefined) {
			markers.forEach((m) => {
				const newMarker = new google.maps.Marker({
					position: m.position,
					map: mapRef.current,
					...(markerIcon !== undefined && {
						icon: markerIcon,
					}),
				})

				if (m.infoContent) {
					const infoWindow = new google.maps.InfoWindow({
						content: m.infoContent,
					})

					newMarker.addListener('click', () => {
						infoWindow.open(mapRef.current, newMarker)
					})
					markersRef.current.push({ marker: newMarker, infoWindow })
				} else {
					markersRef.current.push({ marker: newMarker })
				}
			})
		}

		mapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => handleClick(event))
	}, [])

	return <div ref={targetRef} style={{ width: '100%', height: '100%' }} id="map" className={className ?? ''} />
}

export default Map

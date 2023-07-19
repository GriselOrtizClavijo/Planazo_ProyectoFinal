import { useEffect, useRef, useState } from 'react'

interface MapProps {
	center?: google.maps.LatLngLiteral
	marker?: google.maps.LatLngLiteral
	zoom?: number
	onClick?: (event: google.maps.MapMouseEvent) => void
}

const useGoogleMaps = ({
	center = { lat: -35.173098159107255, lng: -65.33673604482283 },
	zoom = 4,
	marker: originalMarker,
	onClick = () => null,
}: MapProps) => {
	const mapRef = useRef<google.maps.Map | null>(null)
	const geocoder = new google.maps.Geocoder()

	const [marker, setMarker] = useState<google.maps.Marker | null>(null)
	const [geoResults, setGeoResults] = useState<google.maps.GeocoderResult[] | undefined>()
	const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[] | undefined>()

	const autoCompleteRef = useRef<HTMLInputElement | null>(null)
	const autoCompleteService = new window.google.maps.places.AutocompleteService()

	const searchPredictions = (query: string) => {
		autoCompleteService.getPlacePredictions(
			{
				input: query,
				types: ['locality'],
				componentRestrictions: { country: 'ar' },
			},
			function (newPredictions, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK && newPredictions !== null) {
					setPredictions(newPredictions)
				} else {
					setPredictions(undefined)
				}
			},
		)
	}

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

	const getProvince = (results: google.maps.GeocoderResult[]) => {
		for (const result of results) {
			for (const component of result.address_components) {
				if (component.types.includes('administrative_area_level_1')) {
					return component.long_name
				}
			}
		}
		return ''
	}

	const getCity = (results: google.maps.GeocoderResult[]) => {
		for (const result of results) {
			for (const component of result.address_components) {
				if (component.types.includes('locality')) {
					return component.long_name
				}
			}
		}
		return ''
	}

	const bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(-55.77952154926162, -88.541047044945), // Coordenadas del límite suroeste
		new google.maps.LatLng(-21.320175270758586, -45.68778785795011), // Coordenadas del límite noreste
	)

	useEffect(() => {
		if (!marker) {
			setMarker(new google.maps.Marker())
		}

		return () => {
			if (marker) {
				marker.setMap(null)
			}
		}
	}, [marker])

	useEffect(() => {
		const mapElement = document.getElementById('map')

		if (!mapElement) {
			console.error('El elemento con el ID "map" no se encuentra en el DOM.')
			return
		}

		mapRef.current = new google.maps.Map(mapElement, {
			center: originalMarker ?? center,
			zoom,
			restriction: {
				latLngBounds: bounds,
				strictBounds: true,
			},
		})

		if (originalMarker !== undefined) {
			const newMarker = new google.maps.Marker({
				position: originalMarker,
				map: mapRef.current,
			})
			setMarker(newMarker)
		}

		mapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => onClick(event))
	}, [])

	const getGeoPosition = (address: string) => {
		geocoder.geocode(
			{
				componentRestrictions: {
					country: 'AR',
				},
				address: address,
			},
			function (results, status) {
				if (status === 'OK' && mapRef.current && results !== null) {
					setGeoResults(results)
				} else {
					console.error('Geocode was not successful for the following reason: ' + status)
					setGeoResults(undefined)
				}
			},
		)
	}

	const centerMap = (location: google.maps.LatLng) => {
		if (mapRef.current) {
			const newMarker = new google.maps.Marker({
				position: location,
				map: mapRef.current,
			})

			setMarker(newMarker)
			mapRef.current.setCenter(location)
			mapRef.current.setZoom(12)
		} else {
			window.alert('Geocode positioning error')
		}
	}

	const getPlaceDetailsById = async (placeId: string): Promise<google.maps.GeocoderResult> => {
		return new Promise((resolve, reject) => {
			geocoder.geocode({ placeId: placeId }, (results, status) => {
				if (status === 'OK' && results && results.length > 0) {
					const result = results[0]
					resolve(result)
				} else {
					console.error('Geocode error:', status)
					reject(new Error(status))
				}
			})
		})
	}

	return {
		mapRef,
		getGeoPosition,
		setMarker,
		getCity,
		getCountry,
		getProvince,
		centerMap,
		geoResults,
		autoCompleteRef,
		searchPredictions,
		predictions,
		getPlaceDetailsById,
	}
}

export default useGoogleMaps

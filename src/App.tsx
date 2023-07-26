import Wrapper from '$layouts/Wrapper'
import calculate from 'cords-distance'
import { useEffect, useRef, useState } from 'react'

const defaultCoords = { altitude: 0, altitudeAccuracy: 0 }

const App = () => {
  const [cords, setCords] = useState({})
  const prevCordsRef = useRef<any>()
  const [distance, setDistance] = useState({ distance: 0, min: 0, max: 0 })

  useEffect(() => {
    function handleCoords({ ...coords }: any) {
      coords.altitude ??= 0
      coords.altitudeAccuracy ??= 0

      const prevCoords = { ...(prevCordsRef.current ?? coords) }
      prevCordsRef.current = coords

      const distance = calculate(prevCoords, coords)
      setDistance((prev) => ({
        distance: prev.distance + distance.distance,
        min: prev.min + distance.min,
        max: prev.max + distance.max,
      }))
    }

    const id = navigator.geolocation.watchPosition(
      ({
        coords: {
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          speed,
          heading,
        },
      }) => {
        handleCoords({
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          speed,
          heading,
        })
      },
      () => {},
      { enableHighAccuracy: true }
    )

    return () => {
      navigator.geolocation.clearWatch(id)
    }
  }, [])

  return JSON.stringify(distance)
}

export default App

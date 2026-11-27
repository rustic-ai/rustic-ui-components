import 'ol/ol.css'
import './openLayersMap.css'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TileLayer from 'ol/layer/Tile.js'
import * as olMap from 'ol/Map.js'
import Overlay from 'ol/Overlay.js'
import { fromLonLat } from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
import View from 'ol/View.js'
import { useEffect, useRef, useState } from 'react'

import Icon from '../icon/icon'
import MarkedMarkdown from '../markdown/markedMarkdown'
import type { LocationFormat } from '../types'

/** The `OpenLayersMap` component supports OpenStreetMap tiles where users can easily zoom in and zoom out to navigate the map effectively. The `OpenLayersMap` component uses the [OpenLayers](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html) map library.
 *
 * Height and width are configured through the class `rustic-open-layers-map-canvas`.
 *
 * Note: `ol` is not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i ol
 * ```
 * If you are not seeing the component or come across the error "An error occurred while loading the map", ensure that `@import '@rustic-ai/ui-components/index.css';` is at the top of your `index.css` file. */
export default function OpenLayersMap(props: LocationFormat) {
  const [errorMessage, setErrorMessage] = useState('')
  const mapTargetElement = useRef<HTMLDivElement>(null)
  const markerElement = useRef<HTMLDivElement>(null)

  const maxAbsoluteLatitude = 90
  const maxAbsoluteLongitude = 180
  const initialZoomLevel = 12

  useEffect(() => {
    setErrorMessage('')
    if (
      props.latitude < -maxAbsoluteLatitude ||
      props.latitude > maxAbsoluteLatitude ||
      props.longitude < -maxAbsoluteLongitude ||
      props.longitude > maxAbsoluteLongitude
    ) {
      return setErrorMessage('Invalid coordinates')
    } else if (mapTargetElement.current && markerElement.current) {
      const newMap = new olMap.default({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([props.longitude, props.latitude]),
          zoom: initialZoomLevel,
        }),
        target: mapTargetElement.current,
      })

      const markerOverlay = new Overlay({
        element: markerElement.current,
        position: fromLonLat([props.longitude, props.latitude]),
        positioning: 'bottom-center',
        stopEvent: false,
      })
      newMap.addOverlay(markerOverlay)

      newMap.once('postrender', () => {
        // check if a map has been properly rendered by finding the canvas element
        const mapCanvas = mapTargetElement.current?.querySelector('canvas')
        if (!mapCanvas) {
          return setErrorMessage('An error occurred while loading the map')
        }
      })

      return () => {
        newMap.setTarget('')
        newMap.removeOverlay(markerOverlay)
      }
    }
  }, [])

  return (
    <>
      {errorMessage.length > 0 ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <Box>
          {props.title && <Typography variant="h6">{props.title}</Typography>}
          {props.description && <MarkedMarkdown text={props.description} />}
          <Box data-cy="marker-container" ref={markerElement}>
            <Icon
              className="rustic-open-layers-map-marker"
              name="location_on"
            />
          </Box>
          <div
            ref={mapTargetElement}
            data-cy="map-canvas"
            className="rustic-open-layers-map-canvas"
          ></div>
        </Box>
      )}
    </>
  )
}

import { useEffect, useState, MutableRefObject, useRef } from 'react';
import type { City } from '../types/offer';
import { Map, TileLayer } from 'leaflet';

const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_44ed_1_e1a13ff66092994678c0a819';
const TILE_LAYER_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City,
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);
  const { latitude, longitude, zoom } = city.location;

  useEffect(() => {
    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom,
      });

      const layer = new TileLayer(
        TILE_LAYER_URL,
        {
          attribution:
            TILE_LAYER_ATTRIBUTION
        }
      );

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, latitude, longitude, zoom]);

  useEffect(() => {
    if (map) {
      map.setView(
        [latitude, longitude],
        zoom
      );
    }
  }, [map, latitude, longitude, zoom]);

  return map;
}

export default useMap;

import { useEffect, useState, MutableRefObject, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { City } from '../types';

const TileLayerOptions = {
  URL: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_44ed_1_e1a13ff66092994678c0a819',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City,
): LeafletMap | null {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const isRenderedRef = useRef<boolean>(false);
  const { latitude, longitude, zoom } = city.location;

  useEffect(() => {
    let isCancelled = false;

    if (mapRef.current !== null && !isRenderedRef.current) {
      void (async () => {
        const { Map: LeafletMapConstructor, TileLayer } = await import('leaflet');
        if (isCancelled || !mapRef.current || isRenderedRef.current) {
          return;
        }

        const instance = new LeafletMapConstructor(mapRef.current, {
          center: {
            lat: latitude,
            lng: longitude,
          },
          zoom,
        });

        const layer = new TileLayer(
          TileLayerOptions.URL,
          {
            attribution:
              TileLayerOptions.ATTRIBUTION
          }
        );

        instance.addLayer(layer);

        setMap(instance);
        isRenderedRef.current = true;
      })();
    }

    return () => {
      isCancelled = true;
    };
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

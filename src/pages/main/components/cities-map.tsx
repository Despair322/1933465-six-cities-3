import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import useMap from '../../../hooks/use-map';
import { City } from '../../../types/offer';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from '../../../constants/app';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  city: City;
  points: City[];
  selectedPoint: City | undefined;
}

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});


function CitiesMap(props: MapProps): JSX.Element {
  const { city, points, selectedPoint } = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude,
        });
        marker.setIcon(
          (selectedPoint?.name === point.name)
          && (selectedPoint?.location.latitude === point.location.latitude) ? currentCustomIcon : defaultCustomIcon
        )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, selectedPoint]);

  return (
    <section className="cities__map map" ref={mapRef}></section>
  );
}

export default CitiesMap;

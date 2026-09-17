import { useRef, useEffect } from 'react';
import { Icon, Marker, LayerGroup, layerGroup } from 'leaflet';
import useMap from '../../hooks/use-map';
import type { City } from '../../types/offer';
import { MapVariants } from '../../constants/app';
import type { MapVariant, Point } from '../../types/types';
import 'leaflet/dist/leaflet.css';
import classNames from 'classnames';

type MapProps = {
  city: City;
  points: Point[];
  selectedPoint?: string | undefined | null;
  variant?: MapVariant;
}

const defaultCustomIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [20, 40]
});


function CitiesMap(props: MapProps): JSX.Element {
  const { city, points, selectedPoint, variant } = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  const isMain = variant === MapVariants.Main;
  const isOffer = variant === MapVariants.Offer;

  useEffect(() => {
    if (!map) {
      return;
    }
    const markerLayer = layerGroup().addTo(map);
    const markers = markersRef.current;
    markerLayerRef.current = markerLayer;
    return () => {
      map.removeLayer(markerLayer);
      markerLayerRef.current = null;
      markers.clear();
    };
  }, [map]);

  useEffect(() => {
    const markerLayer = markerLayerRef.current;
    if (!markerLayer) {
      return;
    }

    points.forEach((point) => {
      let marker = markersRef.current.get(point.id);
      if (!marker) {
        marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude,
        });
        marker.addTo(markerLayer);

        markersRef.current.set(point.id, marker);
      }

      marker.setIcon(
        (selectedPoint && point.id === selectedPoint)
          ? currentCustomIcon
          : defaultCustomIcon
      );
    });
  }, [map, points, selectedPoint]);

  return (
    <section className={classNames(
      { 'cities__map': isMain },
      { 'offer__map': isOffer }, 'map')} ref={mapRef}
    />
  );
}

export default CitiesMap;

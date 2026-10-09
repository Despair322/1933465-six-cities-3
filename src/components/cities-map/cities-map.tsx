import { useRef, useEffect, useState, memo } from 'react';
import { Icon, Marker, LayerGroup, layerGroup } from 'leaflet';
import useMap from '../../hooks/use-map';
import { MapVariants } from '../../constants/app';
import type { MapProps } from './cities-map.types';
import 'leaflet/dist/leaflet.css';
import classNames from 'classnames';
import { CURRENT_ICON_URL, DEFAULT_ICON_URL, ICON_ANCHOR, ICON_SIZE } from '../../constants/map';

const defaultCustomIcon = new Icon({
  iconUrl: DEFAULT_ICON_URL,
  iconSize: [ICON_SIZE.width, ICON_SIZE.height],
  iconAnchor: [ICON_ANCHOR.x, ICON_ANCHOR.y]
});

const currentCustomIcon = new Icon({
  iconUrl: CURRENT_ICON_URL,
  iconSize: [ICON_SIZE.width, ICON_SIZE.height],
  iconAnchor: [ICON_ANCHOR.x, ICON_ANCHOR.y]
});


function CitiesMap(props: MapProps): JSX.Element {
  const { city, points, selectedPoint, variant } = props;
  const [isMapInteractive, setIsMapInteractive] = useState(variant !== MapVariants.Offer);
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  const isMain = variant === MapVariants.Main;
  const isOffer = variant === MapVariants.Offer;

  function handleMapUnlock() {
    setIsMapInteractive(true);
  }

  function handleMapUnlockKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMapUnlock();
    }
  }

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
    if (!map || !isOffer) {
      return;
    }

    const interactionHandlers = [
      map.dragging,
      map.touchZoom,
      map.doubleClickZoom,
      map.scrollWheelZoom,
      map.boxZoom,
      map.keyboard,
    ];

    interactionHandlers.forEach((handler) => {
      if (isMapInteractive) {
        handler.enable();
      } else {
        handler.disable();
      }
    });

    return () => {
      interactionHandlers.forEach((handler) => handler.enable());
    };
  }, [map, isMapInteractive, isOffer]);

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
    <section
      className={classNames(
        { 'cities__map': isMain },
        { 'offer__map': isOffer }, 'map')}
      ref={mapRef}
      style={isOffer ? { position: 'relative' } : undefined}
    >
      {isOffer && !isMapInteractive && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Enable map interaction"
          onClick={handleMapUnlock}
          onKeyDown={handleMapUnlockKeyDown}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            cursor: 'pointer',
          }}
        />
      )}
    </section>
  );
}

const MemoizedCitiesMap = memo(CitiesMap);

export default MemoizedCitiesMap;

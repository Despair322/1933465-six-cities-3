import type { MutableRefObject } from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { City } from '../types/offer';
import useMap from './use-map';

const { mapInstance, mapLayer, MapConstructor, TileLayerConstructor } = vi.hoisted(() => ({
  mapInstance: {
    addLayer: vi.fn(),
    setView: vi.fn(),
  },
  mapLayer: {},
  MapConstructor: vi.fn(),
  TileLayerConstructor: vi.fn(),
}));

vi.mock('leaflet', () => ({
  Map: MapConstructor,
  TileLayer: TileLayerConstructor,
}));

const makeCity = (
  name: City['name'],
  latitude: number,
  longitude: number,
  zoom: number
): City => ({
  name,
  location: { latitude, longitude, zoom },
});

describe('useMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MapConstructor.mockImplementation(() => mapInstance);
    TileLayerConstructor.mockImplementation(() => mapLayer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Leaflet map with the city location and add the tile layer', () => {
    const element = document.createElement('div');
    const mapRef: MutableRefObject<HTMLElement | null> = { current: element };
    const city = makeCity('Paris', 48.8566, 2.3522, 13);

    const { result } = renderHook(() => useMap(mapRef, city));

    expect(MapConstructor).toHaveBeenCalledOnce();
    expect(MapConstructor).toHaveBeenCalledWith(element, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 13,
    });
    expect(TileLayerConstructor).toHaveBeenCalledOnce();
    expect(TileLayerConstructor).toHaveBeenCalledWith(
      expect.stringContaining('basemaps.cartocdn.com'),
      expect.any(Object)
    );
    expect(mapInstance.addLayer).toHaveBeenCalledWith(mapLayer);
    expect(mapInstance.setView).toHaveBeenCalledWith([48.8566, 2.3522], 13);
    expect(result.current).toBe(mapInstance);
  });

  it('should update the existing map view when the city changes', () => {
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };
    const initialCity = makeCity('Paris', 48.8566, 2.3522, 13);
    const nextCity = makeCity('Amsterdam', 52.3676, 4.9041, 11);

    const { rerender, result } = renderHook(
      ({ city }: { city: City }) => useMap(mapRef, city),
      { initialProps: { city: initialCity } }
    );

    rerender({ city: nextCity });

    expect(MapConstructor).toHaveBeenCalledOnce();
    expect(TileLayerConstructor).toHaveBeenCalledOnce();
    expect(mapInstance.setView).toHaveBeenLastCalledWith([52.3676, 4.9041], 11);
    expect(result.current).toBe(mapInstance);
  });

  it('should not create a map when the ref has no element', () => {
    const mapRef: MutableRefObject<HTMLElement | null> = { current: null };

    renderHook(() => useMap(mapRef, makeCity('Paris', 48.8566, 2.3522, 13)));

    expect(MapConstructor).not.toHaveBeenCalled();
    expect(TileLayerConstructor).not.toHaveBeenCalled();
    expect(mapInstance.addLayer).not.toHaveBeenCalled();
  });
});

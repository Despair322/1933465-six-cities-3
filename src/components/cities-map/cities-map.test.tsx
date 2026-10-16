import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CURRENT_ICON_URL, DEFAULT_ICON_URL, MapVariants } from '../../constants';
import type { City } from '../../types/offer';
import type { Point } from '../../types/types';
import CitiesMap from './cities-map';

const mocks = vi.hoisted(() => {
  const iconInstances: Array<{ options: unknown }> = [];
  const markerInstances: Array<{
    coordinates: { lat: number; lng: number };
    addTo: ReturnType<typeof vi.fn>;
    setLatLng: ReturnType<typeof vi.fn>;
    setIcon: ReturnType<typeof vi.fn>;
  }> = [];
  const layerInstances: Array<{
    addTo: ReturnType<typeof vi.fn>;
    removeLayer: ReturnType<typeof vi.fn>;
  }> = [];

  class MockIcon {
    options: unknown;

    constructor(options: unknown) {
      this.options = options;
      iconInstances.push(this);
    }
  }

  class MockMarker {
    coordinates: { lat: number; lng: number };
    addTo = vi.fn();
    setLatLng = vi.fn();
    setIcon = vi.fn();

    constructor(coordinates: { lat: number; lng: number }) {
      this.coordinates = coordinates;
      markerInstances.push(this);
    }
  }

  class MockLayerGroup {
    addTo = vi.fn(() => this);
    removeLayer = vi.fn();

    constructor() {
      layerInstances.push(this);
    }
  }

  const interactionHandler = () => ({
    enable: vi.fn(),
    disable: vi.fn(),
  });
  const map = {
    dragging: interactionHandler(),
    touchZoom: interactionHandler(),
    doubleClickZoom: interactionHandler(),
    scrollWheelZoom: interactionHandler(),
    boxZoom: interactionHandler(),
    keyboard: interactionHandler(),
    removeLayer: vi.fn(),
  };

  return {
    MockIcon,
    MockMarker,
    MockLayerGroup,
    iconInstances,
    markerInstances,
    layerInstances,
    map,
    useMap: vi.fn(() => map),
  };
});

vi.mock('leaflet', () => ({
  Icon: mocks.MockIcon,
  Marker: mocks.MockMarker,
  LayerGroup: mocks.MockLayerGroup,
  layerGroup: () => new mocks.MockLayerGroup(),
}));

vi.mock('../../hooks', () => ({
  useMap: mocks.useMap,
}));

const city: City = {
  name: 'Paris',
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
};

const makePoint = (id: string, latitude: number, longitude: number): Point => ({
  id,
  location: { latitude, longitude },
});

describe('CitiesMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.markerInstances.length = 0;
    mocks.layerInstances.length = 0;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates map markers and uses the selected marker icon', () => {
    const points = [
      makePoint('point-1', 48.85, 2.35),
      makePoint('point-2', 48.86, 2.36),
    ];

    const { container } = render(
      <CitiesMap
        city={city}
        points={points}
        selectedPoint="point-2"
        variant={MapVariants.Main}
      />
    );

    expect(container.querySelector('section')).toHaveClass('map', 'cities__map');
    expect(mocks.useMap).toHaveBeenCalledOnce();
    expect(mocks.layerInstances).toHaveLength(1);
    expect(mocks.layerInstances[0].addTo).toHaveBeenCalledWith(mocks.map);
    expect(mocks.markerInstances).toHaveLength(2);
    expect(mocks.markerInstances[0].coordinates).toEqual({ lat: 48.85, lng: 2.35 });
    expect(mocks.markerInstances[0].addTo).toHaveBeenCalledWith(mocks.layerInstances[0]);
    expect(mocks.markerInstances[0].setIcon).toHaveBeenCalledWith(mocks.iconInstances[0]);
    expect(mocks.markerInstances[1].setIcon).toHaveBeenCalledWith(mocks.iconInstances[1]);
    expect(mocks.iconInstances[0].options).toMatchObject({ iconUrl: DEFAULT_ICON_URL });
    expect(mocks.iconInstances[1].options).toMatchObject({ iconUrl: CURRENT_ICON_URL });
  });

  it('updates existing markers and removes markers no longer represented by points', () => {
    const firstPoint = makePoint('point-1', 48.85, 2.35);
    const removedPoint = makePoint('point-2', 48.86, 2.36);
    const { rerender } = render(
      <CitiesMap
        city={city}
        points={[firstPoint, removedPoint]}
        selectedPoint={null}
        variant={MapVariants.Main}
      />
    );
    const [existingMarker, removedMarker] = mocks.markerInstances;
    const updatedPoint = makePoint('point-1', 52.37, 4.9);

    rerender(
      <CitiesMap
        city={city}
        points={[updatedPoint]}
        selectedPoint="point-1"
        variant={MapVariants.Main}
      />
    );

    expect(mocks.markerInstances).toHaveLength(2);
    expect(existingMarker.setLatLng).toHaveBeenCalledWith({ lat: 52.37, lng: 4.9 });
    expect(existingMarker.setIcon).toHaveBeenLastCalledWith(mocks.iconInstances[1]);
    expect(mocks.layerInstances[0].removeLayer).toHaveBeenCalledWith(removedMarker);
  });

  it('locks offer map interactions until the overlay is clicked', () => {
    render(
      <CitiesMap
        city={city}
        points={[]}
        selectedPoint={null}
        variant={MapVariants.Offer}
      />
    );
    const overlay = screen.getByRole('button', { name: 'Enable map interaction' });
    const handlers = [
      mocks.map.dragging,
      mocks.map.touchZoom,
      mocks.map.doubleClickZoom,
      mocks.map.scrollWheelZoom,
      mocks.map.boxZoom,
      mocks.map.keyboard,
    ];

    handlers.forEach((handler) => {
      expect(handler.disable).toHaveBeenCalled();
    });

    fireEvent.click(overlay);

    expect(screen.queryByRole('button', { name: 'Enable map interaction' })).not.toBeInTheDocument();
    handlers.forEach((handler) => {
      expect(handler.enable).toHaveBeenCalled();
    });
  });

  it.each(['Enter', ' '])('unlocks offer map with the %s key', (key) => {
    render(
      <CitiesMap
        city={city}
        points={[]}
        selectedPoint={null}
        variant={MapVariants.Offer}
      />
    );
    const overlay = screen.getByRole('button', { name: 'Enable map interaction' });

    fireEvent.keyDown(overlay, { key });

    expect(screen.queryByRole('button', { name: 'Enable map interaction' })).not.toBeInTheDocument();
  });

  it('removes the marker layer from the map when unmounted', () => {
    const { unmount } = render(
      <CitiesMap
        city={city}
        points={[makePoint('point-1', 48.85, 2.35)]}
        selectedPoint={null}
        variant={MapVariants.Main}
      />
    );
    const layer = mocks.layerInstances[0];

    unmount();

    expect(mocks.map.removeLayer).toHaveBeenCalledWith(layer);
  });
});

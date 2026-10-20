export const ICON_SIZE = {
  width: 27,
  height: 39,
};

export const ICON_ANCHOR = {
  x: 20,
  y: 40,
};

const BASE_URL = import.meta.env?.BASE_URL ?? '/';

export const DEFAULT_ICON_URL = `${BASE_URL}img/pin.svg`;

export const CURRENT_ICON_URL = `${BASE_URL}img/pin-active.svg`;

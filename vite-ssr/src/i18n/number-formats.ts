import { SUPPORTED_LOCALES } from './locales'

const DEFAULT_FORMAT = {
  USD: {
    style: 'currency',
    currency: 'USD',
  },
  EUR: {
    style: 'currency',
    currency: 'EUR',
  },
  JPY: {
    style: 'currency',
    currency: 'JPY',
  },
  CAD: {
    style: 'currency',
    currency: 'CAD',
  },
  AUD: {
    style: 'currency',
    currency: 'AUD',
  },
  SGD: {
    style: 'currency',
    currency: 'SGD',
  },
  GBP: {
    style: 'currency',
    currency: 'GBP',
  },
  decimal: {
    style: 'decimal',
  },
}

export const NUMBER_FORMATS = Object.freeze({
  ...SUPPORTED_LOCALES.reduce(
    (acc, l) => ({ ...acc, [l]: DEFAULT_FORMAT }),
    {}
  ),
  // Overwrite formats here for specific locales
})

export const SUPPORTED_LANGUAGES = [
  {
    locale: 'en',
    name: 'English',
    default: true,
  },
  {
    locale: 'es',
    name: 'Spanish',
  },
  {
    locale: 'fr',
    name: 'French',
  },
  {
    locale: 'it',
    name: 'Italian',
  },
  {
    locale: 'ja',
    name: 'Japanese',
  },
  {
    locale: 'ko',
    name: 'Korean',
  },
  {
    locale: 'tr',
    name: 'Turkish',
  },
  {
    locale: 'vi',
    name: 'Vietnamese',
  },
  {
    locale: 'zh-CN',
    name: 'Chinese',
  },
]

export const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES.map((l) => l.locale)

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.find((l) => l.default)

export const DEFAULT_LOCALE = DEFAULT_LANGUAGE?.locale as string

export function extractLocaleFromPath(path = '') {
  const [_, maybeLocale] = path.split('/')
  return SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : DEFAULT_LOCALE
}

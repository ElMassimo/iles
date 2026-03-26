import { basename, extname } from 'pathe'

// Internal: Maps the specified path to its corresponding HTML filename.
//
// NOTE: `filename` can be an optional source for the specified path.
export function pathToHtmlFilename (path: string, filename?: string) {
  const ext = extname(path)
  if (ext) return path
  if (!path.endsWith('/') && filename && basename(filename).split('.')[0] === 'index') path += '/'
  return path + (path.endsWith('/') ? 'index.html' : '.html')
}

// Internal: Used when `prettyUrls: false`.
export function explicitHtmlPath (path: string, filename?: string) {
  const htmlFilename = pathToHtmlFilename(path, filename)
  return htmlFilename.endsWith('/index.html')
    ? htmlFilename.replace(/\/index\.html$/, '/')
    : htmlFilename
}

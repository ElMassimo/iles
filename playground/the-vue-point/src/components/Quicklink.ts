// Public: Example of an island that does not bring in the Vue runtime.
//
// In the future <ClientScript> will be provided to make this kind of usage
// more convenient.
export default async function setupQuicklinks () {
  if (!import.meta.env.SSR && import.meta.env.PROD)
    (await import('quicklink')).listen()
}

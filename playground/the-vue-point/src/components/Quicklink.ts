export default async function setupQuicklinks () {
  if (import.meta.env.PROD && !import.meta.env.SSR)
    (await import('quicklink')).listen()
}

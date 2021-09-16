export default async function prism () {
  const { refractor } = await import('refractor')
  // @ts-ignore
  const { default: rehypePrism } = await import('@mapbox/rehype-prism')
  refractor.alias({ markup: ['html', 'vue']})
  return rehypePrism
}

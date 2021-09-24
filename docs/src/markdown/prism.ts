export default async function prism () {
  // @ts-ignore
  const { default: rehypePrism } = await import('@mapbox/rehype-prism')
  return [rehypePrism, { alias: { markup: ['html', 'vue'] } }]
}

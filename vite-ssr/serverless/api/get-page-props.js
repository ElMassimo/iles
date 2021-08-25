export default (req, res) => {
  const url = new URL('http://e.g' + req.url)
  console.log('-- getPageProps', url.searchParams.toString())

  const routeName = url.searchParams.get('name') || ''

  res.setHeader(
    'Cache-Control',
    'max-age=0, s-maxage=86400, stale-while-revalidate'
  )

  res.end(
    JSON.stringify({
      server: true,
      message: `This is page "${routeName.toUpperCase()}"`,
    })
  )
}

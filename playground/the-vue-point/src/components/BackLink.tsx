const BackLink = (props: { href: string, children: any }) => (
  <a class="link" href={props.href}>
    ←
    { props.children }
  </a>
)

export default BackLink

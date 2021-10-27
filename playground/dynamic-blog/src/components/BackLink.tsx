const BackLink = ({ href, children }: { href: string, children: any }) =>
  <a class="link" href={ href }>← { children }</a>

export default BackLink

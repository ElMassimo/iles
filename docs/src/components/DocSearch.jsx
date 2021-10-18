import { DocSearch } from '@mussi/docsearch'
import '~/styles/docsearch.css'

const IlesDocSearch = (props) =>
  <DocSearch
    appId="GERZE019PN"
    apiKey="cdb4a3df8ecf73fadf6bde873fc1b0d2"
    indexName="iles"
    { ...props }
  />

export default IlesDocSearch

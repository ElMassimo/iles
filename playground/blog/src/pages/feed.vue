<script lang="ts">
import { createStaticVNode } from 'vue'

export default () => createStaticVNode(`
  <feed xmlns="http://www.w3.org/2005/Atom">
    <generator uri="http://jekyllrb.com" version="{{ jekyll.version }}">îles</generator>
  </feed>
`)
</script>

<route lang="yaml">
meta:
  extension: xml
  layout: false
</route>

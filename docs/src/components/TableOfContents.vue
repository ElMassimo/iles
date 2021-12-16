<script setup lang="ts">
import type { Heading } from '@islands/headings'
import type { SideBarItem } from '~/logic/config'

interface HeadingWithChildren extends Heading {
  children?: Heading[]
}

let { meta, frontmatter } = usePage()
let level = $computed(() => frontmatter.tocLevel || frontmatter.sidebar === 'auto' ? (frontmatter.sidebarLevel || 1) + 2 : frontmatter.sidebarLevel || 2)

let headings = $computed(() => resolveHeaders(meta.headings || []))

function resolveHeaders (headings: Heading[]): SideBarItem[] {
  return mapHeaders(groupHeaders(headings))
}

function groupHeaders (headings: Heading[]): HeadingWithChildren[] {
  headings = headings.map(h => Object.assign({}, h))
  let lastHeading: HeadingWithChildren
  headings.forEach((h) => {
    if (h.level === level)
      lastHeading = h
    else if (lastHeading)
      (lastHeading.children || (lastHeading.children = [])).push(h)
  })
  return headings.filter(h => h.level === level)
}

function mapHeaders (headings: HeadingWithChildren[]): SideBarItem[] {
  return headings.map(Heading => ({
    text: Heading.title,
    link: `#${Heading.slug}`,
    children: Heading.children ? mapHeaders(Heading.children) : undefined,
  }))
}
</script>

<template>
  <div v-if="headings.length > 0" class="py-4 pl-4 lg:pt-10">
    <SidebarLinkItem class="px-2" header :item="{ text: 'Table of Contents', link: '' }"/>
    <ul class="mb-2">
      <li v-for="child in headings" :key="child.text">
        <SidebarLinkItem :item="child" :table="true"/>
      </li>
    </ul>
  </div>
</template>

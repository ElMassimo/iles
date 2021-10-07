<script setup lang="ts">
import { usePage } from 'iles'

import { computed } from 'vue'
import type { Header, SideBarItem } from '~/logic/config'

interface HeaderWithChildren extends Header {
  children?: Header[]
}

let { meta } = $(usePage())

const headers = computed(() => resolveHeaders(meta.headers || []))

function resolveHeaders(headers: Header[]): SideBarItem[] {
  return mapHeaders(groupHeaders(headers))
}

function groupHeaders(headers: Header[]): HeaderWithChildren[] {
  headers = headers.map(h => Object.assign({}, h))
  let lastH2: HeaderWithChildren
  headers.forEach((h) => {
    if (h.level === 2)
      lastH2 = h

    else if (lastH2)
      (lastH2.children || (lastH2.children = [])).push(h)
  })
  return headers.filter(h => h.level === 2)
}

function mapHeaders(headers: HeaderWithChildren[]): SideBarItem[] {
  return headers.map(header => ({
    text: header.title,
    link: `#${header.slug}`,
    children: header.children ? mapHeaders(header.children) : undefined,
  }))
}
</script>

<template>
  <div v-if="headers.length > 0" class="py-4 pl-4 lg:pt-10">
    <SidebarLinkItem class="px-2" header :item="{ text: 'Table of Contents' }"/>
    <ul class="mb-2">
      <li v-for="child in headers" :key="child.text">
        <SidebarLinkItem :item="child" :table="true" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useAppConfig, usePage } from 'iles'

const config = useAppConfig()
const page = usePage()
const el = ref<HTMLElement | null>(null)
const open = ref(false)

const cleanPage = computed(() => {
  const rawMeta = page.meta.value
  const { frontmatter, ...meta } = rawMeta
  if (frontmatter?.filename)
    frontmatter.filename = frontmatter.filename.replace(config.root, '')
  return { meta, frontmatter }
})

watch(open, (open) => {
  if (!open) el.value!.scrollTop = 0
})
</script>

<script lang="ts">
export default {
  name: 'DebugIslands',
}
</script>

<template>
  <div class="debug" :class="{ open }" ref="el" @click="open = !open">
    <p class="title">Debug</p>
    <pre class="block">{{ cleanPage }}<br><br>Open DevTools to inspect <b>islands</b>.</pre>
  </div>
</template>

<style scoped>
.debug {
  box-sizing: border-box;
  position: fixed;
  right: 8px;
  bottom: 8px;
  z-index: 9999;
  border-radius: 4px;
  width: 74px;
  height: 32px;
  color: #eeeeee;
  overflow: hidden;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.85);
  transition: all 0.15s ease;
}

.debug:hover {
  background-color: rgba(0, 0, 0, 0.75);
}

.debug.open {
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  margin-top: 0;
  border-radius: 0;
  padding: 0 0;
  overflow: scroll;
}

@media (min-width: 512px) {
  .debug.open {
    width: 512px;
  }
}

.debug.open:hover {
  background-color: rgba(0, 0, 0, 0.85);
}

.title {
  margin: 0;
  padding: 6px 16px 6px;
  line-height: 20px;
  font-size: 13px;
}

.block {
  margin: 2px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  padding: 8px 16px;
  font-family: Hack, monospace;
  font-size: 13px;
}

.block + .block {
  margin-top: 8px;
}
</style>

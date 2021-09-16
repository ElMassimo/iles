<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useAppConfig, usePage } from 'iles'

const config = useAppConfig()
const page = usePage()
const el = ref<HTMLElement | null>(null)
const open = ref(false)

const cleanPage = computed(() => {
  const rawMeta = page.meta.value
  const { layout, frontmatter, ...meta } = rawMeta
  if (frontmatter?.filename)
    frontmatter.filename = frontmatter.filename.replace(config.root, '')
  return { layout, frontmatter, meta }
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
    <p class="title">Debug<span class="info">Open DevTools to inspect <b>islands</b> 🏝</span></p>
    <pre class="block">{{ cleanPage }}</pre>
  </div>
</template>

<style scoped>
.debug {
  --debug-rgba: 0, 0, 0;
  --debug-opacity: 0.75;
  --debug-bg: rgba(var(--debug-rgba), var(--debug-opacity));
  --debug-color: #EEE;

  box-sizing: border-box;
  position: fixed;
  right: 8px;
  bottom: 8px;
  z-index: 9999;
  border-radius: 4px;
  width: 74px;
  height: 32px;
  color: var(--debug-color);
  overflow: hidden;
  cursor: pointer;
  background-color: var(--debug-bg);
  transition: all 0.15s ease;
}

.info {
  display: none
}

.debug:not(.open):hover {
  --debug-opacity: 0.7;
}

.debug.open:hover {
  --debug-opacity: 1;
}

.debug.open {
  --debug-rgba: 40, 40, 40;

  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  margin-top: 0;
  border-radius: 0;
  padding: 0 0;
  overflow: auto;
}

.debug.open .info {
  display: inline;
  float:  right;
}

@media (prefers-color-scheme: light) {
  .debug.open {
    --debug-rgba: 255, 255, 255;
    --debug-color: #444;
    border-left: 1px solid #DDD;
  }
}

@media (min-width: 512px) {
  .debug.open {
    width: 512px;
  }
}

.title {
  margin: 0;
  padding: 6px 16px 6px;
  line-height: 20px;
  font-size: 13px;
}

.block {
  margin: 2px 0 0;
  border-top: 1px solid #DDD;
  padding: 8px 16px;
  font-family: Hack, monospace;
  font-size: 13px;
}

.block + .block {
  margin-top: 8px;
}
</style>

<script setup lang="ts">
defineProps({
  outline: { type: Boolean, default: false },
})
</script>

<template>
  <component :is="$attrs.href ? 'a' : 'button'" class="app-button font-medium" :class="{ outline, colored: !outline }">
    <div v-if="$slots.icon" class="inline-block mr-1">
      <slot name="icon" />
    </div>
    <slot />
  </component>
</template>

<style lang="postcss" scoped>
.colored {
  background: var(--fc-primary);
  color: white;

  &:hover {
    background: var(--fc-primary-soft);
  }
}

.outline {
  background: theme('colors.gray.100');
  color: theme('colors.gray.500');
  outline-style: none;
  &:hover {
    background: theme('colors.gray.200');
  }
}

html.dark {
  .colored {
    background: var(--fc-primary);
    color: white;

    &:hover {
      background: var(--fc-primary-intense);
    }
  }

  .outline {
    background: theme('colors.warmgray.800');
    color: theme('colors.gray.200');

    &:hover {
      background: theme('colors.warmgray.600');
    }
  }
}

.app-button {
  border-radius: 8px;
  font-size: 16px;
  padding: 7px 18px;

  :deep(.icon) {
    display: inline;
    width: 10px;
    position: relative;
    top: -1px;
    margin-left: 2px;
    fill: currentColor;
    transition: transform 0.2s;
  }

  &:hover :deep(.icon) {
    transform: translateX(3px);
  }

  + .app-button {
    margin-left: 18px;
  }
}
</style>

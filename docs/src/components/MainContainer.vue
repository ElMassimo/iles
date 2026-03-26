<script setup lang="ts">
defineProps({ grid: { type: Boolean, default: false } });
</script>

<template>
  <div
    :class="{ content: grid }"
    class="container !max-w-screen-2xl lg:px-6 mx-auto pt-$navbar-height"
  >
    <slot />
  </div>
</template>

<style scoped lang="postcss">
.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 0px 1rem;
}

@screen md {
  .content {
    grid-template-columns: 150px 1fr;
  }
}

@screen lg {
  .content {
    grid-template-columns: 230px 1fr;
  }
}

@screen xl {
  .content {
    grid-template-columns: 240px 1fr 250px;
  }
}
</style>

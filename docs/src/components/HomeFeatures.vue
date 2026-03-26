<template>
  <div
    v-if="$frontmatter.features?.length"
    class="mx-auto max-w-6xl grid md:grid-cols-4 gap-4 px-4 sm:px-0 py-8 justify-center"
  >
    <a
      v-for="feature in $frontmatter.features"
      :key="feature.title"
      :href="feature.href"
      :aria-label="feature.title"
    >
      <section class="feature px-4">
        <h2 class="my-2 font-semibold">{{ feature.title }}</h2>
        <p class="text-soft font-normal">{{ feature.details }}</p>
      </section>
    </a>
  </div>
</template>

<style scoped>
.feature h2 {
  font-size: 20px;
  letter-spacing: -0.4px;
}
</style>

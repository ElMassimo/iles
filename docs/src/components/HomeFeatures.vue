<template>
  <div v-if="$frontmatter.features.length > 0" class="mx-auto max-w-4xl grid md:grid-cols-3 gap-8 border-t border-b px-4 sm:px-0 py-8 justify-center">
    <section v-for="feature in $frontmatter.features" :key="feature.title" class="px-4">
      <h2 class="text-2xl font-medium my-2">{{ feature.title }}</h2>
      <p class="text-soft">{{ feature.details }}</p>
    </section>
  </div>
</template>

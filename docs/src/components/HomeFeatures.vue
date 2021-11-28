<template>
  <div v-if="$frontmatter.features?.length" class="mx-auto max-w-6xl grid md:grid-cols-4 gap-4 border-t border-b px-4 sm:px-0 py-8 justify-center">
    <a v-for="feature in $frontmatter.features" :key="feature.title" :href="feature.href" :aria-label="feature.title">
      <section class="px-4">
        <h2 class="text-2xl font-medium my-2">{{ feature.title }}</h2>
        <p class="text-soft">{{ feature.details }}</p>
      </section>
    </a>
  </div>
</template>

<template>
  <a
    class="inline-flex items-center text-2xl font-semibold"
    href="/"
    :aria-label="`${$site.title}, back to the main page`"
  >
    <iles:Logo class="inline-flex mr-2 lg:mr-3 h-6 lg:h-8" alt="Logo"/>
    {{ $site.title }}
  </a>
</template>

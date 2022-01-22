<template>
  <footer class="mx-auto text-center text-sm container !max-w-screen-2xl py-10 space-y-4">
    <p>Copyright © 2021–{{ $site.year }} <a class="hover:(underline text-primary-soft)" :href="$site.authorUrl" target="_blank">{{ $site.author }}</a>
    </p>
    <p>Library released under the MIT License</p>
    <a class="block text-sm text-intense hover:text-primary-soft" :href="$site.github" target="_blank" rel="noreferrer">
      Built with
      <IconAppText class="inline-block fill-current stroke-current stroke-2 -mt-2 h-6"/>
      <IconAppLogo class="inline-block -mt-2"/>
    </a>
  </footer>
</template>

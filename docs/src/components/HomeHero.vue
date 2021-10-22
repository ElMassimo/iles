<template>
  <header class="flex items-center justify-center pt-8vh md:px-6">
    <div>
      <div class="space-y-2 mb-12 md:mb-14">
        <figure class="grid place-items-center">
          <picture class="grid-item mx-auto block select-none">
            <source type="image/avif" srcset="/images/banner.avif">
            <img
              class="max-w-full h-auto w-auto max-h-64 md:h-64"
              height="256"
              width="768"
              src="/images/banner.jpg"
              :alt="$frontmatter.heroAlt"
            >
          </picture>
          <IlesText class="grid-item banner-text text-white fill-current" alt="îles"/>
        </figure>

        <div class="text-center">
          <h1 id="main-title" class="hidden text-3xl leading-10 font-semibold sm:(text-5xl leading-16)">
            {{ $site.title }}
          </h1>
          <p class="my-6 text-xl md:text-2xl md:font-light opacity-75 px-16">
            {{ $frontmatter.tagline || $site.description }}
          </p>

          <div class="flex mt-8 justify-center">
            <AppButton lg :href="$frontmatter.actionLink">
              {{ $frontmatter.actionText }}
            </AppButton>
            <AppButton class="ml-6" lg :href="$frontmatter.altActionLink" outline>
              {{ $frontmatter.altActionText }}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.grid-item {
  grid-area: 1 / 1;
}

.banner-text {
  grid-area: 1 / 1;
  width: 22%;
  padding-left: 1%;
  padding-bottom: 3.8%;
  filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
}
</style>

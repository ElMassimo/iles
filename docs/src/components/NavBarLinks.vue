<template>
  <div v-for="(item, index) in $site.nav" :key="item.text" class="item">
    <NavBarLink :class="{ '<md:hidden': index > 1 }" :href="item.link" :text="item.text"/>
  </div>
  <NavBarLink aria-label="Follow on Twitter" class="text-2xl hover:text-primary-soft ml-6" :href="$site.twitter" external>
    <IconCarbonLogoTwitter/>
  </NavBarLink>
  <NavBarLink aria-label="Fork in GitHub" class="text-xl hover:text-primary-soft ml-2" :href="$site.github" external>
    <IconCarbonLogoGithub/>
  </NavBarLink>
</template>

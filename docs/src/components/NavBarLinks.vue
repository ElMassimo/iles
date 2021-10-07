<template>
  <div v-for="item in $site.nav" :key="item.text" class="item">
    <NavBarLink class="" :href="item.link" :text="item.text"/>
  </div>
  <NavBarLink class="text-2xl hover:text-primary-soft ml-6" :href="$site.twitter" external>
    <carbon-logo-twitter/>
  </NavBarLink>
  <NavBarLink class="text-xl hover:text-primary-soft ml-2" :href="$site.github" external>
    <carbon-logo-github/>
  </NavBarLink>
</template>

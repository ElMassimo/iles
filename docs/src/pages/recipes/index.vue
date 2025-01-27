<page> 
    title: Recipes
    alias: ['/recipes']
</page>
 
<script setup lang="ts">
import { getPosts } from '~/logic/recipes'
import { getImage } from '~/logic/utils';
const recipes = getPosts()
</script>
 
<template layout="default"> 
  <section>
    <h1>Recipes</h1>
    <p>Îles recipes are concise, focused guides covering various use cases with step-by-step instructions. They offer a great way to learn Îles while enhancing your project with new features or functionality through clear, practical examples.</p>
    <div class="gap-8 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
      <article v-for="recipe in recipes" :key="recipe.href" class="dark:bg-[var(--bg-highlight)] overflow-hidden rounded-lg shadow-lg">
        <a class="!no-underline hover:!text-[var(--fc-intense)] active:!text-[var(--fc-intense)]" :href="recipe.href">
          <span class="w-full h-48 object-cover">
            <Image :src="getImage(recipe.ogimage)" alt=""/>
          </span>
          <div class="px-6 pb-6">
            <h2>{{ recipe.title }}</h2>
            <PostDate class="text-sm text-primary-600 dark:text-primary-200 font-medium mb-2 block" :date="recipe.frontmatter.date">
              {{ new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
            </PostDate>
            <component :is="recipe" class="text-gray-600 dark:text-gray-300 mb-4" excerpt>Discover a delightful blend of Mediterranean flavors in this recipe, featuring sun-dried tomatoes, kalamata olives, and aromatic herbs, all tossed with al dente pasta and finished with crumbled feta cheese.</component>
            <a class="link inline-block" :href="recipe.href">Read more →</a>
          </div></a>
      </article>
    </div>
  </section>     
</template>
 
<style scoped></style>

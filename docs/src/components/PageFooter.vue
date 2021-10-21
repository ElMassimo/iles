<template>
  <footer class="page-footer" v-if="!$frontmatter.skipFooter">
    <div class="flex justify-between items-center py-8">
      <EditLink/>
      <LastUpdated/>
    </div>
    <NextAndPrevLinks/>
  </footer>
</template>

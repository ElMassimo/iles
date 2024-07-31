<template>
  <footer v-if="!$frontmatter.skipFooter" class="page-footer">
    <div class="flex justify-between items-center py-8">
      <EditLink />
      <LastUpdated />
    </div>
    <NextAndPrevLinks />
  </footer>
</template>

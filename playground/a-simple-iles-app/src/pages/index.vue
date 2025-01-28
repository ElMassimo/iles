<page>
  title: Home
  description: First Coffee, Then Conquer!
</page>

<script setup lang="ts">
  const {site, frontmatter, meta} = usePage()

  const {title: siteTitle} = site
  const {description} = frontmatter
  const {lastUpdated} = meta
</script>

<template>
  <section class="hero">
    <div class="card">
      <h1>Welcome to {{ siteTitle }}</h1>
      <p>{{ description }}</p>
      <p>Site last updated: {{ lastUpdated.toDateString() }}</p>
      <small>- Built with îles 💚</small>
    </div>
  </section>
</template>

<style scoped>
  .hero {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
  }

  .card {
    text-align: center;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
  }

  .card h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .card p {
    font-size: 1rem;
    color: #555;
  }
</style>

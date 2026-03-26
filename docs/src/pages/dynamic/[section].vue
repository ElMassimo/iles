<script lang="ts">
const messageFor = (val: string) =>
  `This is example number <b>${val}</b>, and this message was provided in <code>getStaticPaths</code> and received as a prop.`;

export default definePageComponent({
  getStaticPaths() {
    return [
      { params: { section: "one" }, props: { message: messageFor("one") } },
      { params: { section: "two" }, props: { message: messageFor("two") } },
    ];
  },
});
</script>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <h1>Dynamic Path Example</h1>
  <p v-html="message" />
  <p>Back to <a href="/guide/routing#getstaticpaths">Routing</a>.</p>
</template>

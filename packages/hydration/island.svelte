<script>
const { component, slots, props } = $$props;
</script>

<svelte:component this={component} {...props}>
  {#if slots.default}
    <iles-content>
      {@html slots.default}
    </iles-content>
  {/if}
</svelte:component>

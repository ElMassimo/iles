if (import.meta.env.PROD && !import.meta.env.SSR)
  // @ts-ignore
  import('quicklink').then(mod => mod.listen())

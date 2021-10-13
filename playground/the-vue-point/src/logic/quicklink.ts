if (import.meta.env.PROD && !import.meta.env.SSR)
  import('quicklink').then(mod => mod.listen())

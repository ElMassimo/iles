const twitterHandle = 'ilesjs'

const site = {
  title: 'îles',
  description: 'Islands of interactivity with Vue in Vite.js',
  year: new Date().getFullYear(),

  url: 'https://iles-docs.netlify.app',
  canonical: 'iles-docs.netlify.app',

  tags: ['îles', 'iles', 'vuejs', 'vitejs', 'ssg', 'open source', 'partial hydration'],

  author: 'Máximo Mussini',
  github: 'https://github.com/ElMassimo/iles',
  twitterHandle,
  twitter: `https://twitter.com/${twitterHandle}`,

  nav: [
    { text: 'Guide', link: '/guide' },
    { text: 'Config', link: '/config' },
  ],

  sidebar: {
    '/': [
      {
        text: 'Guide',
        children: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide' },
          { text: 'Development', link: '/guide/development' },
          { text: 'Hydration', link: '/guide/hydration' },
          { text: 'Client Scripts', link: '/guide/client-scripts' },
          { text: 'Markdown', link: '/guide/markdown' },
          { text: 'Meta Tags', link: '/guide/meta-tags' },
          { text: 'Deployment', link: '/guide/deployment' },
          { text: 'Plugins', link: '/guide/plugins' },
          { text: 'Comparisons', link: '/guide/comparisons' },
        ],
      },
      { text: 'Config', link: '/config' },
    ],
  },
}

export default site

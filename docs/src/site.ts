import type { SiteConfig } from '~/logic/config'

const twitterHandle = 'ilesjs'

const site: SiteConfig = {
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

  algolia: {
    appId: 'GERZE019PN',
    apiKey: 'cdb4a3df8ecf73fadf6bde873fc1b0d2',
    indexName: 'iles',
  },

  nav: [
    { text: 'Guide', link: '/guide/' },
    { text: 'Config', link: '/config' },
  ],

  sidebar: {
    '/': [
      {
        text: 'Guide',
        children: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Development', link: '/guide/development' },
          { text: 'Deployment', link: '/guide/deployment' },
          { text: 'Plugins', link: '/guide/plugins' },
        ],
      },
    ],
  },
}

export default site

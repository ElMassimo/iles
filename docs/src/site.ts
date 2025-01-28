const twitterHandle = 'ilesjs'

const site = {
  title: 'îles',
  description: 'The Joyful Site Generator',
  year: new Date().getFullYear(),

  url: 'https://iles-docs.netlify.app',
  canonical: 'iles-docs.netlify.app',

  tags: ['îles', 'iles', 'vuejs', 'vitejs', 'ssg', 'open source', 'partial hydration', 'islands of interactivity'],

  author: 'Máximo Mussini',
  authorUrl: 'https://maximomussini.com',
  github: 'https://github.com/ElMassimo/iles',
  twitterHandle,
  authorHandle: 'MaximoMussini',
  twitter: `https://twitter.com/${twitterHandle}`,

  nav: [
    { text: 'Guide', link: '/guide' },
    { text: 'Config', link: '/config' },
    { text: 'FAQs', link: '/faqs' },
    { text: 'Recipes', link: '/recipes' },
  ],

  sidebar: [
    {
      text: 'Guide',
      link: '/guide',
      children: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Getting Started', link: '/guide' },
        { text: 'Project Structure', link: '/guide/project-structure' },
        { text: 'Routing', link: '/guide/routing' },
        { text: 'Markdown', link: '/guide/markdown' },
        { text: 'Documents', link: '/guide/documents' },
        { text: 'Head And Meta', link: '/guide/head-and-meta' },
        { text: 'Static Assets', link: '/guide/static-assets' },
        { text: 'Islands', link: '/guide/islands' },
        { text: 'Frameworks', link: '/guide/frameworks' },
        { text: 'Modules', link: '/guide/modules' },
        { text: 'Turbo', link: '/guide/turbo' },
        { text: 'RSS Feeds', link: '/guide/rss' },
        { text: 'PWA', link: '/guide/pwa' },
        { text: 'Deployment', link: '/guide/deployment' },
      ],
    },
    { text: 'Config', link: '/config' },
    {
      text: 'FAQs',
      link: '/faqs',
      children: [
        { text: 'FAQs', link: '/faqs' },
        { text: 'Troubleshooting', link: '/faqs/troubleshooting' },
      ],
    },
    {
      text: 'Recipes',
      link: '/recipes',
      children: [
        {
          text: 'Recipes',
          link: '/recipes'
        },
        {
          text: 'A Simple Iles App',
          link: '/recipes/a-simple-iles-app'
        },
        {
          text: 'Vanilla Vue to Îles',
          link: '/recipes/vanilla-vue-to-iles'
        }
      ],
    },    
    
  ],
}

export default site

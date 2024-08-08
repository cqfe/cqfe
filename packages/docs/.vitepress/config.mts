import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'CQFE Docs',
  description: 'cqfe docs',
  vite: {
    ssr: {
      noExternal: ['@cqfe/vue-hooks'],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'VueHooks', link: '/vue-hooks' },
      { text: 'Utils', link: '/utils' },
    ],

    sidebar: {
      '/vue-hooks/': [
        {
          text: 'VueHooks',
          items: [
            { text: 'useEvent', link: '/vue-hooks/useEvent' },
            { text: 'useAutoScroll', link: '/vue-hooks/useAutoScroll' },
            { text: 'useRem', link: '/vue-hooks/useRem' },
          ],
        },
      ],
      '/utils/': [
        {
          text: 'Utils',
          items: [{ text: 'xx', link: '/vue-hooks/useEvent' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/leoDreamer/cqfe' }],
  },
});

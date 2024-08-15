import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'CQFE Docs',
  description: 'cqfe docs',
  // base: '/cqfe/',
  // vite: {
  //   ssr: {
  //     noExternal: ['@cqfe/vue-hooks'],
  //   },
  // },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'VueHooks', link: '/vue-hooks' },
      { text: 'VueComponents', link: '/vue-components' },
      { text: 'Utils', link: '/utils' },
      { text: 'Toolkit', link: '/toolkit' },
    ],

    sidebar: {
      '/vue-hooks/': [
        {
          text: 'VueHooks',
          items: [
            { text: 'useEvent', link: '/vue-hooks/useEvent' },
            { text: 'useAutoScroll', link: '/vue-hooks/useAutoScroll' },
            { text: 'useRem', link: '/vue-hooks/useRem' },
            { text: 'useAmap', link: '/vue-hooks/useAmap' },
            { text: 'usePlayer', link: '/vue-hooks/usePlayer' },
          ],
        },
      ],
      '/utils/': [
        {
          text: 'Utils',
          items: [
            { text: 'String', link: '/utils/string' },
            { text: 'Request', link: '/utils/request' },
            { text: 'Timeout', link: '/utils/timeout' },
            { text: 'Url', link: '/utils/url' },
          ],
        },
      ],
      '/toolkit/': [
        {
          text: 'Toolkit',
          items: [
            { text: 'GenerateApi', link: '/toolkit/generateApi' },
            { text: 'ScpDeploy', link: '/toolkit/scpDeploy' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/leoDreamer/cqfe' }],
  },
});

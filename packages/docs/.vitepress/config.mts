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
  head: [
    ['script', {}, `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?301419e0e70831d2762cfecfa98da4ac";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();`]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'VueHooks', link: '/vue-hooks' },
      { text: 'VueComponents', link: '/vue-components' },
      { text: 'Utils', link: '/utils' },
      { text: 'Toolkit', link: '/toolkit' },
      { text: 'Animate', link: '/animate' },
    ],

    sidebar: {
      '/vue-components/': [
        {
          text: 'VueComponents',
          items: [
            { text: 'Table', link: '/vue-components/table' },
          ],
        },
      ],
      '/vue-hooks/': [
        {
          text: 'VueHooks',
          items: [
            { text: 'UseEvent', link: '/vue-hooks/useEvent' },
            { text: 'UseAutoScroll', link: '/vue-hooks/useAutoScroll' },
            { text: 'UseRem', link: '/vue-hooks/useRem' },
            { text: 'UseAmap', link: '/vue-hooks/useAmap' },
            { text: 'UsePlayer', link: '/vue-hooks/usePlayer' },
            { text: 'UsePaginationReq', link: '/vue-hooks/usePaginationReq' },
          ],
        },
      ],
      '/utils/': [
        {
          text: 'Utils',
          items: [
            { text: 'String', link: '/utils/string' },
            { text: 'Array', link: '/utils/array' },
            { text: 'Request', link: '/utils/request' },
            { text: 'Timeout', link: '/utils/timeout' },
            { text: 'Url', link: '/utils/url' },
            { text: 'Readable', link: '/utils/readable' },
            { text: 'Toolkit', link: '/utils/toolkit' },
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
      '/animate/': [
        {
          text: 'Animate',
          items: [
            { text: 'Canvas', link: '/animate/canvas' },
            { text: '按轨迹移动', link: '/animate/offsetPath' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/leoDreamer/cqfe' }],
  },
});

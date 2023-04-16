import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/vue-source/vue-ref-active' }
    ],

    sidebar: [
      {
        text: 'vue源码',
        items: [
          { text: 'vue响应式原型', link: '/vue-source/vue-ref-active' },
          { text: 'h函数', link: '/vue-source/h' },
          { text: 'render', link: '/vue-source/render'}
        ]
      },
      {
        text: '数据结构与算法',
        items: [
          { text: '二叉树', link: '/algorithms/Binary-tree' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

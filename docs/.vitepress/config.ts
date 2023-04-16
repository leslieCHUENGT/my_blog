import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/vue-ref-active' }
    ],

    sidebar: [
      {
        text: 'vue源码',
        items: [
          { text: 'vue响应式原型', link: '/vue-ref-active' },
          { text: 'h函数', link: '/h' },
          { text: 'render', link: '/render'}
        ]
      },
      {
        text: '算法与数据结构',
        items: [
          { text: '二叉树', link: '/Binary-tree' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

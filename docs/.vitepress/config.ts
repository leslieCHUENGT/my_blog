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
          { text: 'render', link: '/vue-source/render' },
          { text: 'react的Diff算法',link: '/vue-source/react-diff' }
        ]
      },
      {
        text: '数据结构与算法',
        items: [
          { text: '二叉树', link: '/algorithms/Binary-tree' },
          { text: '回溯算法', link: '/algorithms/Backtracking' },
          { text: '贪心算法', link: '/algorithms/Greedy' },
          { text: '动态规划',link: '/algorithms/Dynamic-programming'}
        ]
      },
      {
        text: 'js',
        items: [
          { text: 'promiseA+规范', link: '/js/promiseA+' },
          { text: '经典的js手写题', link: '/interview/hand_js' },
          { text: 'axios源码学习',link:'/js/axios' }
        ]
      },
    
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leslieCHUENGT/my_blog' }
    ]
  }
})

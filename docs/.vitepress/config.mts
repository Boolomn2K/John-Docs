import { defineConfig } from 'vitepress'
import { getNavbar } from './navbar.mts'
import { getSidebar } from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 文档左上角 logo 旁标题
  title: "John's Docs",
  description: "John's docs site",
  base: '/John-Docs/',
  lang: 'zh-cn',
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  // 在最终渲染出的 HTML 的 <head> 标签内加入的额外标签
  head: [
    // 浏览器标签栏 favicon
    ['link', { rel: 'icon', href: '/John-Docs/icon.png', type: 'image/png' }],
    ['meta', { name: 'author', content: 'John' }],
    ['link', { rel: 'mask-icon', href: '/John-Docs/icon.png', color: '#ffffff' }],
    ['link', { rel: 'apple-touch-icon', href: '/John-Docs/icon.png', sizes: '180x180' }]
  ],
  // 最后更新时间戳
  lastUpdated: true,

  // 主题相关配置
  themeConfig: {

    outline: {
      label: '文章目录',
      level: [2, 4],
    },
    // 设置搜索框
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    logo: { src: '/evil.png', alt: 'a triangle' },

    // 右上角导航栏配置
    nav: getNavbar(),

    // 侧边栏配置
    sidebar: getSidebar(),

    // 页脚
    footer: {
      copyright: "Copyright © 2025-present John"
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Boolomn2K/John-Docs' }]
  }
})

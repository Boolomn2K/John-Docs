import type { DefaultTheme } from 'vitepress'

type GetSidebarFunction = () => DefaultTheme.Sidebar
export const getSidebar: GetSidebarFunction = () => {
  return {
    '/core/html/': [
      {
        text: 'HTML',
        items: [
          { text: '目录', link: '/core/html/' },
          { text: '介绍', link: '/core/html/introduction' },
          { text: '内容', link: '/core/html/newContent' }
        ]
      }
    ],
    '/core/css/': [
      {
        text: 'CSS',
        items: [
          { text: '目录', link: '/core/css/' },
          { text: '介绍', link: '/core/css/introduction' },
          { text: '内容', link: '/core/css/newContent' }
        ]
      }
    ],
    '/core/js/': [
      {
        text: 'JS',
        items: [
          { text: '目录', link: '/core/js/' },
          { text: '介绍', link: '/core/js/introduction' },
          { text: '内容', link: '/core/js/newContent' }
        ]
      }
    ],
    '/core/ts/type_challenges': [
      {
        text: 'TS 体操',
        items: [
          { text: '目录', link: '/core/ts/type_challenges/' },
          { text: '介绍', link: '/core/ts/type_challenges/introduction' },
          { text: 'easy 类1-5题', link: '/core/ts/type_challenges/easy_1-5' },
          { text: 'easy 类6-10题', link: '/core/ts/type_challenges/easy_6-10' },
          { text: 'easy 类11-13题', link: '/core/ts/type_challenges/easy_11-13' },
        ]
      }
    ],
    '/core/ts/typescript_tutorial': [
      {
        text: 'TS 教程',
        items: [
          { text: '目录', link: '/core/ts/typescript_tutorial/' },
          { text: '介绍', link: '/core/ts/typescript_tutorial/introduction' },
          { text: '内容', link: '/core/ts/typescript_tutorial/newContent' }
        ]
      }
    ]
  }
}

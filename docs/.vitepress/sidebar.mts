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
          { text: '内容', link: '/core/ts/type_challenges/newContent' }
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

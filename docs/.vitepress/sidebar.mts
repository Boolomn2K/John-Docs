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
          { text: 'easy 类1-13题', link: '/core/ts/type_challenges/easy_1-13' },
          { text: 'medium 类1-10题', link: '/core/ts/type_challenges/medium_1-10' },
          { text: 'medium 类11-20题', link: '/core/ts/type_challenges/medium_11-20' },
          { text: 'medium 类21-30题', link: '/core/ts/type_challenges/medium_21-30' },
          { text: 'medium 类31-40题', link: '/core/ts/type_challenges/medium_31-40' },
          { text: 'medium 类41-50题', link: '/core/ts/type_challenges/medium_41-50' },
          { text: 'medium 类51-60题', link: '/core/ts/type_challenges/medium_51-60' },
          { text: 'medium 类61-70题', link: '/core/ts/type_challenges/medium_61-70' },
          { text: 'medium 类71-80题', link: '/core/ts/type_challenges/medium_71-80' },
          { text: 'medium 类81-90题', link: '/core/ts/type_challenges/medium_81-90' },
          { text: 'medium 类91-100题', link: '/core/ts/type_challenges/medium_91-100' },
          { text: 'medium 类101-110题', link: '/core/ts/type_challenges/medium_101-110' },
          { text: 'hard 类1-10题', link: '/core/ts/type_challenges/hard_1-10' },
          { text: 'hard 类11-20题', link: '/core/ts/type_challenges/hard_11-20' },
          { text: 'hard 类21-30题', link: '/core/ts/type_challenges/hard_21-30' },
          { text: 'hard 类31-40题', link: '/core/ts/type_challenges/hard_31-40' },
          { text: 'hard 类41-50题', link: '/core/ts/type_challenges/hard_41-50' },
          { text: 'hard 类51-60题', link: '/core/ts/type_challenges/hard_51-60' },
          { text: 'extreme 类1-10题', link: '/core/ts/type_challenges/extreme_1-10' },
          { text: 'extreme 类11-20题', link: '/core/ts/type_challenges/extreme_11-20' },
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
    ],
    '/frameworks/react/others': [
      {
        text: '其它',
        items: [
          { text: '目录', link: '/frameworks/react/others/' },
          { text: 'react18并发渲染原理', link: '/frameworks/react/others/concurrentRendering' },
        ]
      }
    ],
    '/fullstack/nestjs': [
      {
        text: 'Nestjs',
        items: [
          { text: '目录', link: '/fullstack/nestjs/' },
          { text: '介绍', link: '/fullstack/nestjs/introduction' },
          { text: 'nestjs 基础概念', link: '/fullstack/nestjs/basicConcept' }
        ]
      }
    ],
    '/others/others': [
      {
        text: '其它',
        items: [
          { text: '目录', link: '/others/others/' },
          { text: '工作排期', link: '/others/others/WorkScheduling' },
        ]
      }
    ],
    '/others/interview': [
      {
        text: '面试相关',
        items: [
          { text: '目录', link: '/others/interview/' },
          { text: 'JS', link: '/others/interview/js' },
          { text: 'HTML/CSS', link: '/others/interview/html&css' },
          { text: 'ES6', link: '/others/interview/es6' },
          { text: 'HTTP与计算机网络', link: '/others/interview/http&network' },
          { text: '前端工程化', link: '/others/interview/feEngineering' },
          { text: 'Vue', link: '/others/interview/vue' },
          { text: 'NodeJS', link: '/others/interview/nodejs' },
          { text: '手写代码', link: '/others/interview/handWritten' },
          { text: 'Vue 原理', link: '/others/interview/vuePrinciples' }
        ]
      }
    ],
  }
}

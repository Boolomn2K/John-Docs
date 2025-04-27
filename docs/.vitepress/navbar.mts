import type { DefaultTheme } from 'vitepress'

type NavbarFunction = () => DefaultTheme.NavItem[]

export const getNavbar: NavbarFunction = () => {
  return [
    {
      text: '🌐 核心基础',
      items: [
        {
          text: 'Web 三支柱',
          items: [
            { text: 'HTML5', link: '/core/html/' },
            { text: 'CSS3', link: '/core/css/' },
            { text: 'JS', link: '/core/js/' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: 'TypeScript 类型体操', link: '/core/ts/type_challenges' },
            { text: 'TypeScript 教程', link: '/core/ts/typescript_tutorial' },
            { text: 'ECMAScript 新特性', link: '/core/es-next/' }
          ]
        }
      ]
    },
    {
      text: '🚀 现代框架',
      items: [
        {
          text: 'React 生态',
          items: [
            { text: 'React 18 核心', link: '/frameworks/react/core' }
            // { text: 'Next.js 全栈开发', link: '/frameworks/react/nextjs/' },
            // { text: '状态管理（Redux/Zustand）', link: '/frameworks/react/state/' }
          ]
        },
        {
          text: 'Vue 生态',
          items: [
            { text: 'Vue 3', link: '/frameworks/vue/core' }
            // { text: 'Nuxt 服务端渲染', link: '/frameworks/vue/nuxt/' },
            // { text: 'Pinia 状态管理', link: '/frameworks/vue/state/' }
          ]
        }
      ]
    },
    {
      text: '🛠️ 工程化体系',
      items: [
        {
          text: '构建工具链',
          items: [
            { text: 'Webpack', link: '/engineering/webpack' },
            { text: 'Vite', link: '/engineering/vite' }
          ]
        }
        // {
        //   text: '质量保障',
        //   items: [
        //     { text: 'Jest 单元测试', link: '/engineering/test/jest/' },
        //     { text: 'Cypress E2E 测试', link: '/engineering/test/cypress/' },
        //     { text: 'SonarQube 代码审计', link: '/engineering/quality/sonar/' }
        //   ]
        // }
      ]
    },
    {
      text: '🔗 全栈领域',
      items: [
        {
          text: 'Node.js 生态',
          items: [
            { text: 'node.js', link: '/fullstack/node' },
            { text: 'NestJS', link: '/fullstack/nestjs' }
            // { text: 'GraphQL API 设计', link: '/fullstack/graphql/' },
            // { text: 'Serverless 实践', link: '/fullstack/serverless/' }
          ]
        },
        {
          text: 'golang',
          items: [
            { text: 'go 基础语法', link: '/fullstack/golang/go' },
            { text: '深入 go', link: '/fullstack/golang/DeepGo' }
          ]
        },
        {
          text: '数据库',
          items: [
            { text: 'MongoDB', link: '/fullstack/db/mongodb' },
            { text: 'MySQL', link: '/fullstack/db/mysql' }
          ]
        }
      ]
    },
    {
      text: '💡 实战沉淀',
      items: [
        {
          text: '疑难杂症簿',
          items: [
            { text: '浏览器奇技淫巧', link: '/troubleshooting/browser' },
            { text: '性能优化秘籍', link: '/troubleshooting/performance' }
          ]
        }
      ]
    },
    {
      text: '🌱 计算机基础',
      items: [
        { text: '计算机网络', link: '/cs/computerNetwork' },
        { text: '计算机组成', link: '/cs/computerArchitecture' },
        { text: '编译原理', link: '/cs/compilersPrinciples' },
        { text: '数据结构与算法', link: '/cs/dataStructuresAndAlgorithms' },
        { text: '操作系统', link: '/cs/operatingSystem' },
        { text: '数据库系统', link: '/cs/databaseSystem' }
      ]
    }
    // {
    //   text: '🎯 快捷入口',
    //   items: [
    //     { text: '开源项目集', link: '/opensource/' }
    //   ]
    // }
  ]
}

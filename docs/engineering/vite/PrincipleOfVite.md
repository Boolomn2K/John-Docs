# Vite 原理

## 关于 esModule 特性

`ESM` 在代码编译阶段（而非运行时）通过静态分析 `import/export` 语句构建完整的模块依赖图,

浏览器/工具链可提前规划加载顺序，避免运行时动态解析的开销。

## vite 插件原理

![vite 插件原理](/images/engineering/vite/vite-plugin-vue.png)


## vben 中 mock 插件原理

![vben 中 mock 插件原理](/images/engineering/vite/vben-mock-viteplugin.png)

# React 18 的并发渲染原理

## React 的三层执行架构

![React的三层执行架构](/images/react/others/concurrentRendering/ReactExecutionArchitecture.png)

演示案例

![滑动前](/images/react/others/concurrentRendering/initial.png)

![滑动后](/images/react/others/concurrentRendering/afterSilde.png)

通过下面 `Google` 浏览器的开发工具 `performance` 工具查看 `react` 里面都进行了哪些函数调用

外层调度器（`Scheduler`）不断循环调度任务，在这个循环调度里面在执行里面一些任务，这里重要的部分有

![调度器和协调器](/images/react/others/concurrentRendering/schedulerAndReconcile.png)

协调器（`reconciler`）完成 `workLoopSync` 后执行最后 渲染器（`Render`）

![渲染器](/images/react/others/concurrentRendering/Render.png)

渲染器 `finishConcurrentRender` 里面做的事情

![finishConcurrentRender](/images/react/others/concurrentRendering/finishConcurrentRender.png)

整个 react 初始化过程分为三个部分，首先初始化一个 `workLoop`,也就是调度器（`Scheduler`），接着是 `workLoopSync`,

其中里面最重要的是 协调器（`reconciler`），最后一步执行 渲染器（`Render`）commit 操作。

### 关于并行和并发

![parallelismAndConcurrency](/images/react/others/concurrentRendering/parallelismAndConcurrency.png)

### fiber

![fiber](/images/react/others/concurrentRendering/fiber.png)

#### 为什么要把 `tree` 转为 `fiber` ?

因为如果要执行上面并发的逻辑的话，最重要一点我们需要某一个任务在执行的过程中可以中断，比如说当前我们正在

遍历这个 `tree`, 当我们遍历到 `span` 这个标签，我们希望在此处中断，但其实在 `tree` 情况下是不能中断的，

因为当停在这个 `span` 时中断了，中断之后不能恢复回来，`span` 恢复后只能遍历到它的子节点 `text: "n"`,

它并不知道父节点是谁, 换句话说，在 `tree` 结构里面，父组件永远只知道子组件, 子组件不知道父组件，而且两个

兄弟组件之间也是相互不知道的，当我们中断后就很难恢复再从下一个节点去执行了。

`fiber` 它本身是一个链表，它能做到中断恢复

#### 遍历顺序

![遍历顺序](/images/react/others/concurrentRendering/traversalOrder.png)

## 开启并发渲染与关闭并发渲染区别

### 未开启并发渲染

![未开启并发渲染](/images/react/others/concurrentRendering/closeConcurrentRendering1.png)

![未开启并发渲染具体](/images/react/others/concurrentRendering/closeConcurrentRendering2.png)

### 开启并发渲染

![开启并发渲染](/images/react/others/concurrentRendering/openConcurrentRendering1.png)

![开启并发渲染具体1](/images/react/others/concurrentRendering/openConcurrentRendering2.png)

时间分片

![开启并发渲染具体2](/images/react/others/concurrentRendering/openConcurrentRendering3.png)

![开启并发渲染具体3](/images/react/others/concurrentRendering/openConcurrentRendering4.png)


# Vue

## 1.`vue`优点?

### 概念解析
Vue 是一套用于构建用户界面的渐进式框架，核心优势包括：

#### 1. **轻量级与易上手**
- 核心库仅关注视图层，体积小（生产版本约 33KB），学习曲线平缓
- 模板语法基于 HTML，熟悉前端基础即可快速入门

#### 2. **组件化开发**
- 支持单文件组件（.vue），将 HTML/CSS/JS 封装为独立模块
- 组件可复用，提高代码维护性和开发效率

#### 3. **响应式数据绑定**
- 采用数据劫持结合发布-订阅模式，数据变化自动更新视图
- 无需手动操作 DOM，减少 DOM 操作错误

#### 4. **虚拟 DOM 与 diff 算法**
- 通过虚拟 DOM 减少真实 DOM 操作，提升渲染性能
-  diff 算法只更新变化的 DOM 节点，而非整个页面重绘

#### 5. **丰富的生态系统**
- 官方提供 Vue Router（路由）、Vuex（状态管理）、Vue CLI（脚手架）
- 社区插件丰富，如 Element UI、Vuetify 等 UI 组件库

### 代码示例：核心优势体现
```vue
<!-- 组件化与响应式示例 -->
<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++; // 数据变化自动更新视图（响应式）
    }
  }
};
</script>

<style scoped>
/* scoped 实现样式隔离（组件化特性） */
.counter {
  font-size: 16px;
}
</style>
```

### 面试要点
- **核心差异**：与 React 相比，Vue 模板语法更接近 HTML，上手成本低；与 Angular 相比，Vue 更轻量，灵活性更高
- **性能优化**：虚拟 DOM、响应式系统、组件缓存（keep-alive）是 Vue 性能优势的关键
- **适用场景**：中小型单页应用（SPA）、移动端应用、后台管理系统

### 实际应用场景
- **快速原型开发**：通过 Vue CLI 快速搭建项目框架
- **复杂交互应用**：结合 Vuex 管理全局状态，Vue Router 实现路由跳转
- **跨平台开发**：使用 Vue + Weex 或 Vue + Ionic 开发移动端应用

## 2.`vue`父组件向子组件传递数据?

### 概念解析
父组件向子组件传递数据通过 **`props`** 实现，这是 Vue 组件通信的基础方式，遵循**单向数据流**原则（子组件不能直接修改 props，需通过事件通知父组件更新）。

#### 1. props 基本用法
- **父组件**：通过属性绑定（`:prop-name`）传递数据
- **子组件**：通过 `props` 选项声明接收的属性

#### 2. props 特性
- **单向绑定**：父组件数据更新时，子组件会自动同步
- **类型验证**：支持指定数据类型（String/Number/Boolean/Array/Object/Function等）
- **默认值**：可设置默认值，当父组件未传递时生效
- **必填项**：可标记为必填，未传递时会警告

### 代码示例
#### 1. 基础用法
```vue
<!-- 子组件 Child.vue -->
<template>
  <div class="child">
    <p>父组件传递的名称: {{ name }}</p>
    <p>父组件传递的年龄: {{ age }}</p>
  </div>
</template>

<script>
export default {
  // 声明接收的 props
  props: ['name', 'age']
};
</script>

<!-- 父组件 Parent.vue -->
<template>
  <div class="parent">
    <Child :name="userName" :age="userAge" />
  </div>
</template>

<script>
import Child from './Child.vue';
export default {
  components: { Child },
  data() {
    return {
      userName: 'Alice',
      userAge: 20
    };
  }
};
</script>
```

#### 2. 高级用法（类型验证、默认值、必填项）
```vue
<!-- 子组件 AdvancedChild.vue -->
<script>
export default {
  props: {
    // 基础类型检查
    name: { type: String, required: true },
    // 带默认值的数字
    age: { type: Number, default: 18 },
    // 带默认值的对象
    info: {
      type: Object,
      // 对象/数组的默认值必须通过函数返回
      default: () => ({ gender: 'unknown' })
    },
    // 自定义验证函数
    score: {
      validator: (value) => {
        return value >= 0 && value <= 100;
      }
    }
  }
};
</script>
```

### 单向数据流注意事项
```vue
<!-- 错误示例：子组件直接修改 props -->
<script>
export default {
  props: ['count'],
  methods: {
    increment() {
      this.count++; // ❌ 错误：直接修改 props
    }
  }
};
</script>

<!-- 正确示例：通过事件通知父组件更新 -->
<template>
  <button @click="handleClick">+1</button>
</template>
<script>
export default {
  props: ['count'],
  methods: {
    handleClick() {
      this.$emit('update:count', this.count + 1); // ✅ 通过事件通知
    }
  }
};
</script>
```

### 面试要点
- **单向数据流**：父组件数据变化会流向子组件，但子组件不能直接修改 props，避免数据流混乱
- **props 验证**：如何实现类型检查、必填项和自定义验证（如上文高级用法示例）
- **props vs data**：
  - props 来自父组件，单向绑定
  - data 是组件内部状态，可修改
- **复杂数据传递**：对象/数组作为 props 时，子组件修改其属性会影响父组件（引用类型特性）

### 实际应用场景
- **基础数据传递**：如标题、列表数据、状态标志等
- **条件渲染**：通过 props 控制子组件显示隐藏（如 `:visible="isShow"`）
- **配置型组件**：子组件通过 props 接收配置项（如分页组件的 `pageSize`、`currentPage`）

## 3.`vue`子组件向父组件传递事件?

### 概念解析
子组件向父组件传递事件通过 **`$emit`** 实现，子组件触发自定义事件并传递数据，父组件通过事件监听接收数据，这是 Vue 组件通信的核心方式之一，遵循**事件驱动**原则。

#### 1. 核心机制
- **子组件**：调用 `this.$emit('event-name', data)` 触发事件并传递数据
- **父组件**：通过 `@event-name="handler"` 监听事件并处理数据

#### 2. 事件特性
- **自定义事件**：事件名称可自定义，推荐使用**kebab-case**（短横线命名）
- **参数传递**：支持传递多个参数，父组件通过回调函数接收
- **事件修饰符**：支持 `.sync`（双向绑定语法糖）、`.once`（只触发一次）等修饰符

### 代码示例
#### 1. 基础用法
```vue
<!-- 子组件 Child.vue -->
<template>
  <button @click="handleClick">发送数据给父组件</button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      // 触发自定义事件并传递数据
      this.$emit('send-data', 'Hello from child', 20);
    }
  }
};
</script>

<!-- 父组件 Parent.vue -->
<template>
  <div>
    <Child @send-data="receiveData" />
    <p>子组件传递的数据: {{ message }}, {{ age }}</p>
  </div>
</template>

<script>
import Child from './Child.vue';
export default {
  components: { Child },
  data() {
    return {
      message: '',
      age: 0
    };
  },
  methods: {
    receiveData(msg, age) {
      this.message = msg;
      this.age = age;
    }
  }
};
</script>
```

#### 2. 高级用法（.sync 修饰符）
`.sync` 是 Vue 提供的双向绑定语法糖，简化“子组件触发事件-父组件更新数据”的流程：
```vue
<!-- 子组件 SyncChild.vue -->
<template>
  <input
    type="text"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  />
</template>

<script>
export default {
  props: ['value']
};
</script>

<!-- 父组件 Parent.vue -->
<template>
  <!-- .sync 等价于 @update:value="value = $event" -->
  <SyncChild :value.sync="inputValue" />
  <p>同步的值: {{ inputValue }}</p>
</template>

<script>
export default {
  data() {
    return { inputValue: '' };
  }
};
</script>
```

### 事件命名与参数传递
#### 1. 事件命名规范
- **推荐 kebab-case**：事件名使用短横线命名（如 `send-data`），与 HTML 事件属性命名一致
- **避免 camelCase/PascalCase**：HTML 模板中事件名不区分大小写，可能导致匹配失败

#### 2. 多参数传递与接收
```vue
<!-- 子组件传递多参数 -->
this.$emit('user-change', { name: 'Alice', age: 20 }, true);

<!-- 父组件接收 -->
@user-change="(user, isActive) => { ... }"
```

### 面试要点
- **事件流机制**：子组件 `$emit` 触发事件 → 父组件 `@event` 监听 → 数据传递完成，形成完整通信闭环
- **.sync 修饰符原理**：语法糖 `:value.sync="x"` 等价于 `:value="x" @update:value="x = $event"`
- **事件 vs props**：
  - props：父 → 子（数据下行）
  - 事件：子 → 父（事件上行）
- **常见误区**：事件名使用 camelCase 在 HTML 模板中可能不生效，需统一为 kebab-case

### 实际应用场景
- **表单组件**：输入框组件向父组件传递输入值（如自定义 Input 组件）
- **状态反馈**：子组件操作完成后通知父组件更新 UI（如弹窗关闭后刷新列表）
- **复杂交互**：子组件传递复杂数据对象，父组件进行业务逻辑处理

## 4.`v-show`和`v-if`指令的共同点和不同点?

### 概念解析
`v-show` 和 `v-if` 都是 Vue 用于条件渲染的指令，但实现机制和适用场景截然不同：

#### 1. 核心差异
| 特性                | `v-show`                          | `v-if`                              |
|---------------------|-----------------------------------|-------------------------------------|
| **渲染机制**        | 通过 CSS `display: none` 隐藏元素  | 通过条件判断是否生成 DOM 元素        |
| **DOM 存在性**      | 始终存在于 DOM 中                 | 条件为 false 时从 DOM 中移除         |
| **初始渲染成本**    | 较高（无论条件真假都渲染）         | 较低（条件为 false 时不渲染）         |
| **切换成本**        | 较低（仅修改 CSS）                 | 较高（需创建/销毁 DOM 元素）         |
| **支持场景**        | 不支持 `<template>` 标签           | 支持 `<template>` 标签和 `v-else` 链  |

#### 2. 共同点
- 都能根据条件控制元素显示/隐藏
- 都支持动态表达式（如 `v-if="isActive"`）

### 代码示例对比
#### 1. 基础用法
```vue
<template>
  <div>
    <!-- v-show: 元素始终存在，通过 CSS 隐藏 -->
    <p v-show="showVShow">v-show 内容</p>

    <!-- v-if: 条件为 false 时元素不存在于 DOM -->
    <p v-if="showVIf">v-if 内容</p>

    <!-- v-if 支持 v-else 链 -->
    <p v-if="num > 10">大于 10</p>
    <p v-else-if="num > 5">大于 5</p>
    <p v-else>小于等于 5</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showVShow: false, // 元素存在，display: none
      showVIf: false,   // 元素不存在于 DOM
      num: 7
    };
  }
};
</script>
```

#### 2. DOM 渲染差异（浏览器控制台观察）
```html
<!-- showVShow: false 时 -->
<p style="display: none;">v-show 内容</p>

<!-- showVIf: false 时 -->
<!-- 无对应 DOM 元素 -->
```

### 性能与适用场景
#### 1. 性能考量
- **频繁切换场景**（如 tabs 切换）：优先使用 `v-show`（切换成本低）
- **条件稳定场景**（如权限控制）：优先使用 `v-if`（初始渲染成本低）

#### 2. 典型应用
```vue
<template>
  <!-- 频繁切换的按钮 -->
  <button v-show="isEditing" @click="save">保存</button>

  <!-- 权限控制（条件极少变化） -->
  <admin-panel v-if="userRole === 'admin'" />

  <!-- v-if 支持 template 标签（不生成额外 DOM） -->
  <template v-if="hasItems">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
  </template>
</template>
```

### 面试要点
#### 1. 核心区别
- **渲染本质**：`v-show` 是 CSS 级别的显示控制，`v-if` 是 DOM 级别的条件渲染
- **性能取舍**：初始渲染 vs 切换成本的权衡

#### 2. 常见误区
- **滥用 v-if**：对频繁切换的元素使用 `v-if` 会导致性能问题
- **v-show 与 v-else**：`v-show` 不支持 `v-else`，需用 `v-if` 实现多条件分支

#### 3. 高级考点
```vue
<!-- 以下代码会报错（v-show 不支持 template） -->
<template v-show="hasContent">
  <p>内容</p>
</template>

<!-- 正确做法（v-if 支持 template） -->
<template v-if="hasContent">
  <p>内容</p>
</template>
```

### 最佳实践
- **移动端/性能敏感场景**：避免在滚动列表中使用 `v-if` 频繁切换
- **SEO 优化**：对需要被搜索引擎抓取的内容使用 `v-if="true"` 而非 `v-show`（避免 CSS 隐藏导致内容不被抓取）
- **条件组合**：复杂条件用计算属性封装（如 `v-if="shouldShowContent"`）

## 5.如何让 `CSS`只在当前组件中起作用?

### 概念解析
Vue 实现组件样式隔离的核心方案是 **`scoped CSS`**，通过在 `<style>` 标签添加 `scoped` 属性，使样式仅对当前组件生效。此外还有 **CSS Modules** 和 **深度选择器** 等补充方案。

#### 1. 核心方案对比
| 方案                | 实现方式                          | 适用场景                          | 局限性                              |
|---------------------|-----------------------------------|-----------------------------------|-------------------------------------|
| **scoped CSS**       | `<style scoped>`                  | 基础组件样式隔离                  | 无法直接修改子组件/第三方组件样式    |
| **CSS Modules**      | `<style module>` + `$style.class` | 复杂组件样式隔离，避免命名冲突    | 写法较繁琐，不支持 `scoped` 共存     |
| **深度选择器**       | `::v-deep` / `/deep/` / `>>>`      | 需要修改子组件/第三方组件样式      | 破坏样式隔离，可能影响其他组件       |

### 代码示例
#### 1. scoped CSS（最常用）
```vue
<!-- 组件内样式 -->
<template>
  <div class="component-box">
    <p class="text">组件内文本</p>
    <ChildComponent /> <!-- 子组件样式不受影响 -->
  </div>
</template>

<style scoped>
/* 添加 scoped 属性后，样式仅对当前组件生效 */
.component-box {
  border: 1px solid #000;
}
.text {
  color: red;
}
</style>
```

**编译后原理**：Vue 会为组件 DOM 添加唯一 `data-v-xxx` 属性，样式自动添加属性选择器：
```css
.component-box[data-v-abc123] {
  border: 1px solid #000;
}
.text[data-v-abc123] {
  color: red;
}
```

#### 2. 深度选择器（修改子组件样式）
```vue
<style scoped>
/* 穿透 scoped 限制，修改子组件样式 */
::v-deep .child-class {
  color: blue;
}

/* 兼容旧版本写法 */
/deep/ .child-class { /* Vue 2.x */
  font-size: 16px;
}

>>> .child-class { /* Vue 2.x 原生 CSS */
  margin: 10px;
}
</style>
```

#### 3. CSS Modules（避免命名冲突）
```vue
<template>
  <!-- 使用 $style 访问模块化类名 -->
  <div :class="$style.box">
    <p :class="$style.text">模块化样式</p>
  </div>
</template>

<style module>
/* 类名会被编译为唯一哈希值，避免冲突 */
.box {
  padding: 20px;
}
.text {
  color: green;
}
</style>
```

### 面试要点
#### 1. scoped 实现原理
- Vue 编译器会为组件每个 DOM 元素添加唯一 `data-v-hash` 属性
- CSS 选择器自动添加 `[data-v-hash]` 属性选择器，实现样式隔离
- 子组件根元素会同时继承父组件和自身的 `data-v-hash` 属性，因此父组件 scoped 样式可影响子组件根元素

#### 2. 如何修改第三方组件样式
```vue
<!-- 方法1：使用深度选择器 -->
<style scoped>
::v-deep .el-button {
  width: 100%;
}
</style>

<!-- 方法2：使用非 scoped 样式 -->
<style>
/* 全局样式，需注意命名冲突 */
.global-button {
  width: 100%;
}
</style>

<!-- 方法3：两个 style 标签混合使用 -->
<style scoped>
/* 组件私有样式 */
</style>
<style>
/* 第三方组件样式 */
.el-button {
  width: 100%;
}
</style>
```

#### 3. scoped 与 CSS Modules 区别
- **scoped**：通过属性选择器隔离，写法简单，适合基础组件
- **CSS Modules**：通过类名哈希隔离，适合大型项目避免命名冲突，但写法较繁琐
- 两者不可同时使用（`<style scoped module>` 不生效）

### 实际应用建议
- **基础组件**：优先使用 `scoped`，简单高效
- **复杂组件/大型项目**：使用 CSS Modules 避免命名冲突
- **修改第三方组件**：使用深度选择器（`::v-deep`），并限制作用域
- **性能考量**：scoped 会增加 CSS 选择器权重，大量使用可能影响性能

## 6.`<keep-alive>`的作用是什么?

### 概念解析
`<keep-alive>` 是 Vue 提供的**抽象组件**（不会渲染为 DOM 元素），用于**缓存不活动的组件实例**，避免组件反复创建和销毁带来的性能开销。核心作用是**保留组件状态**并**优化性能**。

#### 1. 核心特性
- **缓存机制**：缓存包裹的组件实例，而非销毁它们
- **状态保留**：组件切换时保留组件内部状态（如表单输入、滚动位置）
- **生命周期钩子**：触发 `activated`/`deactivated` 钩子，用于缓存前后的逻辑处理
- **条件缓存**：通过 `include`/`exclude` 属性控制哪些组件需要缓存

#### 2. 基本语法
```vue
<keep-alive>
  <!-- 动态组件或路由组件 -->
  <component :is="currentComponent" />
</keep-alive>
```

### 代码示例
#### 1. 基础用法（缓存动态组件）
```vue
<template>
  <div>
    <button @click="currentComponent = 'ComponentA'">组件 A</button>
    <button @click="currentComponent = 'ComponentB'">组件 B</button>

    <!-- 缓存组件 A 和 B -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';
export default {
  components: { ComponentA, ComponentB },
  data() {
    return { currentComponent: 'ComponentA' };
  }
};
</script>

<!-- ComponentA.vue -->
<template>
  <div>
    <p>A 组件</p>
    <input placeholder="输入内容会被缓存" />
  </div>
</template>
```

#### 2. 结合路由使用（缓存路由组件）
```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="Detail">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```
- **include**：仅缓存名称为 `Detail` 的组件（匹配组件 `name` 选项）
- **exclude**：排除指定组件（优先级高于 include）
- **max**：限制缓存实例数量（Vue 2.5+）

#### 3. 缓存钩子函数
被缓存的组件会触发特殊生命周期钩子：
```vue
<script>
export default {
  // 进入缓存组件时触发
  activated() {
    console.log('组件被激活（从缓存中取出）');
    this.timer = setInterval(() => {}, 1000);
  },

  // 离开缓存组件时触发
  deactivated() {
    console.log('组件被缓存');
    clearInterval(this.timer); // 清理定时器
  }
};
</script>
```

### 面试要点
#### 1. 核心原理
- **缓存存储**：使用 `cache` 对象存储组件实例，键为组件 `name` 或标签名
- **抽象组件**：自身不渲染 DOM，仅管理子组件的创建/缓存/销毁
- **避免过度缓存**：缓存过多会增加内存占用，建议配合 `max` 属性使用

#### 2. 常见面试题
**Q：`<keep-alive>` 和 `v-if` 的区别？**
A：`v-if` 控制组件销毁/重建，`<keep-alive>` 控制组件缓存/激活，前者会丢失状态，后者保留状态。

**Q：如何强制刷新 `<keep-alive>` 缓存的组件？**
A：
```vue
<!-- 方法1：改变 key 值 -->
<keep-alive>
  <component :is="currentComponent" :key="componentKey" />
</keep-alive>

<!-- 方法2：使用 exclude 动态切换 -->
<keep-alive :exclude="needRefresh ? 'ComponentA' : ''">
  <ComponentA />
</keep-alive>
```

#### 3. 适用场景
- **频繁切换组件**：如标签页、选项卡
- **保留表单状态**：如多步骤表单
- **优化性能**：避免列表页→详情页切换时的重复渲染

### 注意事项
- **不支持缓存函数式组件**：函数式组件没有实例，无法缓存
- **缓存会保留所有生命周期**：需在 `deactivated` 中清理副作用（如定时器、事件监听）
- **与 transition 结合使用**：需将 `<keep-alive>` 作为 `<transition>` 的子组件

## 7.如何获取 `dom`?

### 概念解析
Vue 推荐使用 **`ref` 属性 + `$refs` 对象** 安全地获取 DOM 元素或组件实例，避免直接操作 DOM。这是 Vue 提供的**声明式 DOM 访问方式**，确保 DOM 操作符合 Vue 的响应式生命周期。

#### 1. 核心机制
- **`ref` 属性**：在模板中为 DOM 元素或组件添加 `ref="name"` 标识
- **`$refs` 对象**：组件实例的 `$refs` 属性会自动收集带有 `ref` 的 DOM 元素/组件，键为 `ref` 值，值为 DOM 元素或组件实例
- **访问时机**：`$refs` 在组件**挂载后**（`mounted` 钩子）才可用，且**非响应式**（DOM 更新后不会自动同步）

### 代码示例
#### 1. 基础用法（获取 DOM 元素）
```vue
<template>
  <div>
    <!-- 添加 ref 属性 -->
    <p ref="textRef">这是一个 DOM 元素</p>
    <button @click="getDom">获取 DOM</button>
  </div>
</template>

<script>
export default {
  methods: {
    getDom() {
      // 通过 this.$refs 访问 DOM 元素
      const textElement = this.$refs.textRef;
      console.log(textElement.textContent); // 输出: 这是一个 DOM 元素
      textElement.style.color = 'red'; // 修改样式
    }
  },
  mounted() {
    // 组件挂载后才能访问 $refs
    console.log('mounted 中的 DOM:', this.$refs.textRef);
  }
};
</script>
```

#### 2. 获取子组件 DOM
```vue
<!-- 子组件 Child.vue -->
<template>
  <div ref="childDom">子组件 DOM</div>
</template>

<!-- 父组件 Parent.vue -->
<template>
  <Child ref="childRef" />
</template>

<script>
import Child from './Child.vue';
export default {
  components: { Child },
  mounted() {
    // 访问子组件的 DOM 元素
    console.log(this.$refs.childRef.$refs.childDom);
  }
};
</script>
```

#### 3. 动态 refs（配合 `v-for`）
```vue
<template>
  <div>
    <div v-for="(item, index) in list" :key="index" :ref="(el) => dynamicRefs[index] = el">
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: ['A', 'B', 'C'],
      dynamicRefs: [] // 存储动态 refs
    };
  },
  mounted() {
    console.log(this.dynamicRefs); // 数组包含 3 个 DOM 元素
  }
};
</script>
```

### 面试要点
#### 1. `$refs` 访问时机
- **错误示例**：在 `created` 钩子中访问 `$refs`（DOM 未生成）
- **正确时机**：`mounted` 钩子或用户交互事件（如 `click`）中访问
```vue
<script>
export default {
  created() {
    console.log(this.$refs.textRef); // undefined（DOM 未挂载）
  },
  mounted() {
    console.log(this.$refs.textRef); // DOM 元素（挂载完成）
  }
};
</script>
```

#### 2. 与原生 DOM 方法的区别
| 方式                  | 特点                                  | 适用场景                          |
|-----------------------|---------------------------------------|-----------------------------------|
| `this.$refs`          | Vue 声明式访问，无需选择器字符串       | 组件内部 DOM 操作                 |
| `document.querySelector` | 原生 API，需手动写选择器              | 跨组件/全局 DOM 查询               |
| `document.getElementById` | 通过 ID 查找，需保证 ID 唯一          | 简单页面的唯一元素查询             |

#### 3. 常见误区
- **过度依赖 `$refs`**：优先使用 Vue 数据驱动（如 `v-if`/`v-for`）而非手动 DOM 操作
- **`$refs` 响应性**：`$refs` 不是响应式的，DOM 更新后需通过 `this.$nextTick` 访问最新状态
```vue
<script>
export default {
  methods: {
    updateDom() {
      this.list.push('D'); // 修改数据触发 DOM 更新
      // DOM 更新是异步的，需用 $nextTick 访问最新 refs
      this.$nextTick(() => {
        console.log(this.dynamicRefs); // 包含新增的 DOM 元素
      });
    }
  }
};
</script>
```

### 最佳实践
- **组件封装**：通过 `ref` 暴露子组件的 DOM 操作方法，而非直接访问内部 DOM
- **避免频繁操作**：复杂 DOM 操作建议使用计算属性或监听器驱动
- **SSR 兼容性**：服务端渲染时 `$refs` 不可用，需添加客户端判断

## 8.说出几种`vue`当中的指令和它的用法?

### 概念解析
Vue 指令是带有 `v-` 前缀的特殊属性，用于在模板中声明式地绑定数据到 DOM 或执行特定行为。指令的职责是**当表达式的值变化时，将其产生的连带影响响应式地作用于 DOM**。

#### 1. 常用指令分类
| 类别          | 指令列表                                                                 |
|---------------|--------------------------------------------------------------------------|
| **数据绑定**  | `v-bind`、`v-model`、`v-text`、`v-html`                                 |
| **条件渲染**  | `v-if`、`v-else`、`v-else-if`、`v-show`                                 |
| **列表渲染**  | `v-for`                                                                 |
| **事件处理**  | `v-on`                                                                  |
| **行为控制**  | `v-pre`、`v-cloak`、`v-once`                                            |

### 核心指令详解与示例
#### 1. 数据绑定类
##### `v-bind`：动态绑定属性
- **作用**：将数据动态绑定到 HTML 属性或组件 props
- **简写**：`:`
- **示例**：
```vue
<template>
  <img v-bind:src="imageUrl" :alt="imageAlt" />
  <component :is="currentComponent" :prop="data" />
</template>
```

##### `v-model`：双向数据绑定
- **作用**：在表单元素上创建双向数据绑定（值与数据同步）
- **支持元素**：input、select、textarea、自定义组件
- **示例**：
```vue
<template>
  <input v-model="username" />
  <select v-model="selectedOption">
    <option value="1">选项1</option>
  </select>
</template>

<script>
export default {
  data() {
    return { username: '', selectedOption: '1' };
  }
};
</script>
```

##### `v-text` 与 `v-html`：文本渲染
| 指令      | 作用                          | 安全性                  |
|-----------|-------------------------------|-------------------------|
| `v-text`  | 渲染纯文本（替换元素文本内容）  | 安全（自动转义 HTML）    |
| `v-html`  | 渲染 HTML（替换元素 innerHTML）| 不安全（可能导致 XSS）   |

```vue
<template>
  <p v-text="plainText"></p> <!-- 输出: <b>文本</b> -->
  <p v-html="richText"></p> <!-- 输出: <b>文本</b> -->
</template>

<script>
export default {
  data() {
    return {
      plainText: '<b>文本</b>',
      richText: '<b>文本</b>'
    };
  }
};
</script>
```

#### 2. 事件处理类
##### `v-on`：绑定事件监听器
- **作用**：绑定 DOM 事件或组件自定义事件
- **简写**：`@`
- **修饰符**：`.stop`（阻止冒泡）、`.prevent`（阻止默认行为）、`.once`（只触发一次）等
- **示例**：
```vue
<template>
  <button v-on:click="handleClick">点击</button>
  <button @click.stop="handleClick">阻止冒泡</button>
  <form @submit.prevent="handleSubmit">提交</form>
</template>

<script>
export default {
  methods: {
    handleClick() { console.log('点击事件'); },
    handleSubmit() { console.log('表单提交'); }
  }
};
</script>
```

#### 3. 条件与列表类
##### `v-for`：列表渲染
- **作用**：基于数组/对象渲染列表
- **语法**：`v-for=
## 9.`vue-loader`是什么?使用它的用途有哪些?

### 概念解析
`vue-loader` 是 **Webpack 的加载器**（loader），专门用于处理 Vue 单文件组件（`.vue` 文件），将其解析为 JavaScript 模块。它是 Vue 生态系统的核心工具，使开发者能够使用 **单文件组件（SFC）** 格式开发 Vue 应用。

#### 1. 核心功能
- **解析 SFC**：将 `.vue` 文件拆分为模板（template）、脚本（script）和样式（style）三部分
- **预处理支持**：配合其他 loader（如 `babel-loader`、`sass-loader`）支持 TypeScript、Sass 等预处理器
- **热模块替换（HMR）**：开发时修改组件后无需刷新页面，保持应用状态
- **作用域样式**：实现 `<style scoped>` 的样式隔离功能
- **依赖解析**：处理组件内的资源引用（如 `<img src="./image.png">`）

### 工作原理
1. **解析阶段**：将 `.vue` 文件拆分为 template/script/style 块
2. **转换阶段**：
   - 模板 → 渲染函数（通过 `vue-template-compiler`）
   - 脚本 → JavaScript（通过 `babel-loader` 等）
   - 样式 → CSS（通过 `css-loader`、`style-loader` 等）
3. **合并阶段**：将处理后的三部分合并为一个 JavaScript 模块，导出 Vue 组件

### 代码示例
#### 1. 基本 .vue 文件结构
```vue
<!-- App.vue -->
<template>
  <div class="app">{{ message }}</div>
</template>

<script>
export default {
  data() { return { message: 'Hello Vue' }; }
}
</script>

<style scoped>
.app { color: red; }
</style>
```

#### 2. Webpack 配置示例
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // 处理 .vue 文件
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 处理 JavaScript（配合 babel）
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 处理 CSS
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', // 注入样式到 DOM
          'css-loader' // 解析 CSS
        ]
      }
    ]
  },
  plugins: [
    // 必须配合 VueLoaderPlugin
    new VueLoaderPlugin()
  ]
};
```

### 关键依赖
- **`vue-template-compiler`**：将模板编译为渲染函数，版本需与 Vue 一致
- **`vue-loader-plugin`**：确保 Vue 组件的各部分正确加载
- **预处理器 loader**：如 `sass-loader`（Sass）、`ts-loader`（TypeScript）

### 面试要点
#### 1. 核心用途
- **模块化开发**：将组件的 HTML/CSS/JS 封装在单个文件中
- **生态集成**：无缝对接 Webpack 生态（代码分割、懒加载等）
- **开发效率**：支持 HMR 和预处理器，提升开发体验

#### 2. 常见问题
**Q：为什么需要 `VueLoaderPlugin`？**
A：它会复制并应用 vue-loader 的规则到 .vue 文件内部分割出的每个块（template/script/style），确保这些块能被 Webpack 正确处理。

**Q：如何在 Vue 中使用 TypeScript？**
A：
```vue
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  data() { return { count: 0 }; }
});
</script>
```
需配置 `ts-loader` 和 `@vue/compiler-sfc`（Vue 3+）。

### 实际应用建议
- **版本匹配**：确保 `vue-loader`、`vue-template-compiler`、`vue` 版本一致
- **生产优化**：配合 `mini-css-extract-plugin` 将 CSS 提取为单独文件
- **缓存配置**：开发环境启用 `cacheDirectory` 提升构建速度

## 10.为什么使用 `key`?

### 概念解析
`key` 是 Vue 用于**标识列表中元素唯一性**的特殊属性，主要配合 `v-for` 使用。它的核心作用是帮助 Vue 的**虚拟 DOM (Virtual DOM)  diff 算法**识别元素身份，从而**优化渲染性能**并**避免状态异常**。

#### 1. 核心价值
- **提升 diff 效率**：通过唯一标识减少 DOM 操作（避免全量重新渲染）
- **保持组件状态**：确保列表重排/过滤时组件状态不丢失（如表单输入值、复选框选中状态）
- **避免元素复用错误**：防止 Vue 错误复用具有相同结构的元素

### 工作原理
Vue 的虚拟 DOM diff 算法在对比新旧节点时：
1. 无 `key`：通过**标签名 + 顺序**判断元素是否相同，可能导致错误复用
2. 有 `key`：通过**`key` 值**判断元素是否相同，精准匹配节点

### 代码示例
#### 1. 问题示例（无 key 或使用 index 作为 key）
```vue
<template>
  <div>
    <button @click="reverseList">反转列表</button>
    <ul>
      <!-- 使用 index 作为 key（不推荐） -->
      <li v-for="(item, index) in list" :key="index">
        <input type="text" placeholder="输入内容" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
    };
  },
  methods: {
    reverseList() {
      this.list.reverse(); // 反转列表后，输入框内容会错位
    }
  }
};
</script>
```
**问题**：反转列表后，输入框内容会与文本错位（Vue 复用了 DOM 元素，但状态未同步）

#### 2. 正确示例（使用唯一 ID 作为 key）
```vue
<template>
  <ul>
    <!-- 使用唯一 ID 作为 key（推荐） -->
    <li v-for="item in list" :key="item.id">
      <input type="text" placeholder="输入内容" />
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      list: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
    };
  }
};
</script>
```
**效果**：列表操作后，输入框内容与文本正确对应（key 确保元素身份唯一）

### key 使用对比表
| 场景                | 无 key / index 作为 key               | 唯一 ID 作为 key                      |
|---------------------|--------------------------------------|---------------------------------------|
| **diff 效率**       | 低（可能全量重新渲染）                | 高（仅更新变化元素）                  |
| **状态保持**        | 差（元素复用导致状态错位）            | 好（状态与元素绑定）                  |
| **适用场景**        | 静态列表（无排序/过滤/增删）          | 动态列表（有排序/过滤/增删操作）      |

### 面试要点
#### 1. 为什么不推荐使用 index 作为 key?
- **问题场景**：当列表发生**排序、过滤、逆序**等操作时，index 会跟随元素位置变化，导致 key 失效
- **底层原因**：Vue 会认为“新 key”对应“新元素”，触发不必要的**组件销毁/重建**，或错误复用旧元素状态

#### 2. key 与性能的关系
- **正向优化**：唯一 key 帮助 Vue 精准定位变化元素，减少 DOM 操作（如移动元素而非重建）
- **反向风险**：使用不稳定的 key（如随机数）会导致元素频繁销毁/重建，严重影响性能

#### 3. 常见误区
- **过度使用 key**：非列表场景（如单个元素）无需 key
- **key 必须是数字/字符串**：Vue 2 只接受字符串或数字作为 key；Vue 3 支持 Symbol
- **key 与 v-if 同用**：同一元素上 `v-for` 优先级高于 `v-if`，建议在父级使用 `v-if` 过滤列表

### 最佳实践
- **动态列表**：使用**唯一且稳定的 ID**（如后端返回的 id 字段）
- **静态列表**：可省略 key 或使用 index（但不推荐）
- **避免重复 key**：同一父节点下的 key 必须唯一，否则会导致渲染异常
- **配合 transition**：使用 key 确保过渡动画正确触发（如 `transition-group`）

## 11.分别简述`computed`和`watch`的使用场景

### 概念解析
`computed`（计算属性）和 `watch`（监听器）是 Vue 中两种**响应式数据处理方式**，但设计目标截然不同：

| 特性          | `computed`                              | `watch`                                  |
|---------------|----------------------------------------|------------------------------------------|
| **本质**      | 基于依赖的**派生值**（类似函数）        | 基于数据变化的**副作用触发器**（类似事件监听） |
| **缓存机制**  | 有缓存（依赖不变则不重新计算）          | 无缓存（数据变化即触发）                  |
| **适用场景**  | 数据转换/过滤/聚合（纯计算逻辑）        | 异步操作/复杂副作用（如 API 调用、DOM 操作）| 
| **返回值**    | 必须有返回值                           | 无返回值                                 |

### 核心使用场景与示例
#### 1. `computed`：数据派生与缓存
**适用场景**：当需要**基于现有数据生成新数据**，且计算逻辑**纯函数无副作用**时使用。

##### 示例1：数据过滤
```vue
<template>
  <div>
    <input v-model="searchText" placeholder="搜索" />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      items: [{ id: 1, name: 'Vue' }, { id: 2, name: 'React' }]
    };
  },
  computed: {
    // 基于 searchText 和 items 派生过滤后的列表
    filteredItems() {
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
};
</script>
```

##### 示例2：数据格式化
```vue
<script>
export default {
  data() { return { firstName: 'John', lastName: 'Doe' }; },
  computed: {
    // 计算全名（依赖变化时才重新计算）
    fullName() {
      console.log('computed 执行'); // 仅在 firstName/lastName 变化时执行
      return `${this.firstName} ${this.lastName}`;
    }
  }
};
</script>
```

#### 2. `watch`：副作用处理与异步操作
**适用场景**：当需要**响应数据变化执行异步操作**或**复杂副作用**（如修改 DOM、调用 API、定时器）时使用。

##### 示例1：监听 props 变化触发 API 调用
```vue
<script>
export default {
  props: ['userId'],
  watch: {
    // 监听 userId 变化，加载用户详情
    userId(newId) {
      this.loadUserDetail(newId);
    }
  },
  methods: {
    async loadUserDetail(id) {
      this.loading = true;
      try {
        const res = await fetch(`/api/user/${id}`);
        this.user = await res.json();
      } catch (err) {
        console.error('加载失败:', err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

##### 示例2：深度监听对象变化
```vue
<script>
export default {
  data() { return { user: { name: 'Alice', age: 20 } }; },
  watch: {
    // 深度监听 user 对象内部属性变化
    user: {
      handler(newVal) {
        console.log('用户信息变化:', newVal);
      },
      deep: true, // 开启深度监听
      immediate: true // 初始值时立即执行一次
    }
  }
};
</script>
```

### 关键区别与选择策略
#### 1. 缓存行为对比
- **`computed` 缓存**：连续多次访问 `filteredItems` 时，若 `searchText` 和 `items` 未变化，则**只计算一次**。
- **`watch` 无缓存**：每次监听数据变化都会触发 handler，即使前后值相同。

#### 2. 典型选择策略
| 场景                          | 推荐使用       | 不推荐使用     |
|-------------------------------|----------------|----------------|
| 简单数据转换（如拼接、过滤）    | `computed`     | `watch`        |
| 异步请求（如接口调用）          | `watch`        | `computed`     |
| 依赖多个数据项的复杂计算        | `computed`     | `watch`（需监听多个数据） |
| 数据变化时更新 DOM 或样式      | `watch`        | `computed`     |
| 频繁读取的派生数据            | `computed`（缓存优势） | `watch`（性能浪费） |

### 面试要点
#### 1. 经典面试题：`computed` 和 `method` 的区别？
- **`computed`**：有缓存，依赖不变则返回缓存值，适合频繁访问的场景。
- **`method`**：无缓存，每次调用都执行，适合每次需要重新计算的场景（如带参数的动态计算）。

#### 2. `watch` 的深度监听与性能问题
- **`deep: true`** 会递归监听对象所有属性，可能导致性能问题，建议：
  - 监听对象的**具体属性**（如 `'user.name'`）而非整个对象
  - 使用 **`Object.freeze`** 冻结不需要监听的对象

#### 3. 何时必须使用 `watch`？
- 当逻辑包含**异步操作**（如 `setTimeout`、API 调用）
- 当需要**监听数据变化的中间状态**（如加载中状态）
- 当需要**手动控制触发时机**（如防抖、节流）

### 最佳实践
- **优先使用 `computed`**：只要是纯数据转换场景，即使能用 `watch` 实现，也优先选择 `computed`（更简洁、性能更好）。
- **`watch` 最小化**：避免监听整个对象，尽量监听具体属性；复杂逻辑拆分到 methods 中。
- **避免过度使用 `watch`**：多个 `watch` 嵌套可能导致“回调地狱”，考虑用状态管理（Vuex/Pinia）或组合式 API（Vue 3）优化。

## 12.`$nextTick`的使用

### 概念解析
`$nextTick` 是 Vue 提供的**异步回调工具**，用于在**DOM 更新完成后**执行回调函数。由于 Vue 的 DOM 更新是**异步批量执行**的，当数据变化后，DOM 不会立即更新，`$nextTick` 确保回调在 DOM 更新完成后触发。

#### 1. 核心机制
- **异步更新**：Vue 将数据变化触发的 DOM 更新放入**微任务队列**，避免频繁 DOM 操作
- **执行时机**：`$nextTick` 回调会添加到 DOM 更新后的微任务队列末尾
- **返回值**：Vue 2.1+ 支持 Promise 风格调用（可配合 `async/await`）

### 代码示例
#### 1. 基础用法（获取更新后的 DOM）
```vue
<template>
  <div>
    <p ref="content">{{ message }}</p>
    <button @click="changeMessage">修改文本</button>
  </div>
</template>

<script>
export default {
  data() { return { message: '原始文本' }; },
  methods: {
    changeMessage() {
      this.message = '更新后的文本';
      // 直接访问 DOM 无法获取更新后的值
      console.log('同步访问:', this.$refs.content.textContent); // 原始文本

      // 使用 $nextTick 访问更新后的 DOM
      this.$nextTick(() => {
        console.log('nextTick 访问:', this.$refs.content.textContent); // 更新后的文本
      });
    }
  }
};
</script>
```

#### 2. Promise 风格与 async/await
```vue
<script>
export default {
  methods: {
    async updateData() {
      this.message = 'Hello Vue';
      // 异步/await 写法（更简洁）
      await this.$nextTick();
      console.log('async 访问:', this.$refs.content.textContent);
    }
  }
};
</script>
```

#### 3. 实际应用场景（表单聚焦）
```vue
<template>
  <div>
    <button @click="showInput">显示输入框并聚焦</button>
    <input v-if="show" ref="inputRef" type="text" />
  </div>
</template>

<script>
export default {
  data() { return { show: false }; },
  methods: {
    showInput() {
      this.show = true; // 显示输入框
      // 输入框刚渲染，直接聚焦会失败
      this.$nextTick(() => {
        this.$refs.inputRef.focus(); // DOM 更新后聚焦
      });
    }
  }
};
</script>
```

### 面试要点
#### 1. 工作原理
Vue 在数据变化后不会立即更新 DOM，而是将更新请求放入**异步队列**。当队列清空时（下一事件循环），才会执行所有 DOM 更新。`$nextTick` 就是将回调添加到这个队列的末尾。

#### 2. 与 `setTimeout` 的区别
| 特性         | `$nextTick`                     | `setTimeout(fn, 0)`              |
|--------------|--------------------------------|----------------------------------|
| **执行时机** | 微任务队列（DOM 更新后立即执行） | 宏任务队列（DOM 更新后延迟执行） |
| **性能**     | 更高（微任务优先级高于宏任务）   | 较低（多一次事件循环）           |
| **适用场景** | Vue 内部 DOM 更新后回调         | 通用延迟执行                     |

#### 3. 常见使用场景
- **访问更新后的 DOM**：如获取渲染后的元素尺寸、内容
- **操作动态渲染的组件**：如聚焦动态创建的输入框
- **避免多次 DOM 更新**：配合 `v-if`/`v-for` 确保元素存在后操作

### 最佳实践
- **优先使用 async/await**：比回调函数写法更清晰
- **避免过度使用**：仅在需要访问更新后 DOM 时使用
- **错误处理**：使用 try/catch 捕获异步操作中的错误
```vue
<script>
export default {
  methods: {
    async safeOperation() {
      try {
        this.data = 'new value';
        await this.$nextTick();
        // DOM 操作
      } catch (err) {
        console.error('操作失败:', err);
      }
    }
  }
};
</script>
```

## 13.`vue`组件中`data`为什么必须是一个函数?

### 概念解析
Vue 组件的 `data` 必须是**函数**，而非直接的对象。这是为了**确保每个组件实例拥有独立的数据副本**，避免多个实例共享同一数据对象导致的状态污染问题。

#### 1. 核心原因
- **对象是引用类型**：若 `data` 是对象，多个组件实例会共享同一内存地址，一个实例修改数据会影响其他实例
- **函数返回新对象**：`data` 作为函数时，每次调用会返回全新的数据对象，实现实例间数据隔离

### 代码示例对比
#### 1. 错误示例（data 是对象）
```javascript
// 组件定义（错误示范）
const MyComponent = {
  data: {
    count: 0 // 直接使用对象
  },
  template: `<button @click="count++">{{ count }}</button>`
};

// 创建两个实例
const instance1 = new Vue({ components: { MyComponent } }).$mount('#app1');
const instance2 = new Vue({ components: { MyComponent } }).$mount('#app2');

// 操作 instance1，instance2 数据也会变化（非预期）
instance1.$children[0].count++; // instance1.count: 1, instance2.count: 1（共享数据）
```
**问题**：两个组件实例共享同一 `data` 对象，数据修改相互干扰

#### 2. 正确示例（data 是函数）
```javascript
// 组件定义（正确示范）
const MyComponent = {
  data() {
    return { count: 0 }; // 函数返回新对象
  },
  template: `<button @click="count++">{{ count }}</button>`
};

// 创建两个实例
const instance1 = new Vue({ components: { MyComponent } }).$mount('#app1');
const instance2 = new Vue({ components: { MyComponent } }).$mount('#app2');

// 操作 instance1，instance2 不受影响
instance1.$children[0].count++; // instance1.count: 1, instance2.count: 0（数据隔离）
```
**效果**：每个实例通过 `data` 函数获得独立数据对象，状态互不干扰

### 底层原理
Vue 组件初始化时：
1. 调用 `data` 函数，获取返回的对象
2. 将对象转换为响应式数据（通过 `Object.defineProperty` 或 `Proxy`）
3. 每个实例的响应式数据指向独立内存空间

### 特殊情况：根实例的 data 可以是对象
Vue 根实例（`new Vue({...})`）的 `data` 允许是对象，因为**根实例只有一个**，不存在共享数据的问题：
```javascript
// 根实例（允许对象形式）
new Vue({
  data: { message: 'Hello' }, // 根实例唯一，无需函数
  template: `<div>{{ message }}</div>`
});
```

### 面试要点
#### 1. 核心区别：对象 vs 函数
| 形式          | 内存地址       | 组件实例共享数据？ | 适用场景               |
|---------------|----------------|-------------------|------------------------|
| `data: {}`    | 固定内存地址   | 是（污染风险）     | 根实例（唯一实例）     |
| `data() { return {} }` | 每次调用生成新地址 | 否（数据隔离）     | 所有组件定义           |

#### 2. 常见误区
- **“函数内部必须返回新对象”**：是的，若返回共享对象（如外部引用），仍会导致数据共享：
```javascript
// 错误示例（返回共享对象）
const sharedData = { count: 0 };
const MyComponent = {
  data() {
    return sharedData; // 返回外部共享对象，仍会导致实例间数据污染
  }
};
```

#### 3. 延伸问题：Vue 3 的 `setup` 函数
Vue 3 组合式 API 中，`setup` 函数返回的响应式数据本质与 `data` 函数相同，通过返回新对象实现隔离：
```javascript
// Vue 3 示例
export default {
  setup() {
    const count = ref(0);
    return { count }; // 每次实例化返回新的 ref 对象
  }
};
```

### 最佳实践
- **组件强制函数**：所有组件定义中，`data` 必须写成函数形式
- **避免共享引用**：函数内部应直接创建新对象，不返回外部引用类型数据
- **根实例例外**：仅根实例可使用对象形式的 `data`，但建议统一使用函数风格以保持一致性
## 14.`Vue`中双向数据绑定是如何实现的?

### 概念解析
Vue 的双向数据绑定（Two-Way Data Binding）通过 **`v-model` 指令**实现，本质是**语法糖**，底层依赖 **响应式系统** 和 **事件监听** 的结合：
- **Vue 2**：基于 `Object.defineProperty` 劫持数据 getter/setter
- **Vue 3**：基于 `Proxy` 代理对象，支持更深层次的响应式
- **核心流程**：数据变化 → 更新视图（数据驱动）；视图变化 → 更新数据（事件监听）

#### 1. 实现原理对比
| 版本    | 核心 API               | 优势                                  | 局限性                              |
|---------|------------------------|---------------------------------------|-------------------------------------|
| **Vue 2** | `Object.defineProperty` | 兼容性好（IE9+）                      | 无法监听数组索引/对象新增属性        |
| **Vue 3** | `Proxy`                | 支持数组/对象全特性监听，性能更优      | 不支持 IE 浏览器                    |

### 核心实现代码示例
#### 1. Vue 2 响应式核心（简化版）
```javascript
function defineReactive(obj, key, value) {
  // 递归监听子对象
  if (typeof value === 'object' && value !== null) {
    observe(value);
  }

  // 劫持 getter/setter
  Object.defineProperty(obj, key, {
    get() {
      console.log('获取数据:', value);
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        console.log('更新数据:', newVal);
        value = newVal;
        // 通知视图更新（依赖收集与派发更新）
        updateView();
      }
    }
  });
}

// 监听对象所有属性
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) return;
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

// 模拟视图更新
function updateView() {
  console.log('视图更新');
}

// 使用示例
const data = { name: 'Vue', age: 3 };
observe(data);
data.name = 'Vue 2'; // 触发 set → 更新视图
```

#### 2. Vue 3 Proxy 实现（简化版）
```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      console.log('获取数据:', target[key]);
      return target[key];
    },
    set(target, key, newVal) {
      if (target[key] !== newVal) {
        console.log('更新数据:', newVal);
        target[key] = newVal;
        updateView();
      }
    },
    deleteProperty(target, key) {
      console.log('删除数据:', key);
      delete target[key];
      updateView();
    }
  });
}

// 使用示例
const data = reactive({ name: 'Vue', age: 3 });
data.name = 'Vue 3'; // 触发 set → 更新视图
delete data.age; // 触发 delete → 更新视图
```

#### 3. v-model 语法糖原理
`v-model` 本质是 `:value` 和 `@input` 的组合：
```vue
<!-- 语法糖 -->
<input v-model="username" />

<!-- 等价于 -->
<input :value="username" @input="username = $event.target.value" />

<!-- 组件中使用 -->
<CustomInput v-model="username" />

<!-- 组件内部等价于 -->
<CustomInput :modelValue="username" @update:modelValue="username = $event" />
```

### 面试要点
#### 1. Vue 2 与 Vue 3 实现差异
- **监听范围**：Vue 2 无法监听数组索引变化、对象新增属性；Vue 3 Proxy 支持所有对象操作
- **性能优化**：Vue 3 减少了依赖追踪的开销，支持懒观察
- **数组处理**：Vue 2 重写了数组原型方法（如 push/pop）以触发更新；Vue 3 直接通过 Proxy 监听

#### 2. 双向绑定与单向数据流
- **表面矛盾**：双向绑定看似违背单向数据流，实则 `v-model` 是语法糖，本质仍是父组件向子组件传值，子组件通过事件通知父组件更新
- **最佳实践**：复杂场景建议使用单向绑定（`:value` + `@input`），更显式可控

#### 3. 实现自定义 v-model
```vue
<!-- 自定义组件 CustomInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: ['modelValue'] // 接收父组件值
};
</script>

<!-- 使用自定义 v-model -->
<CustomInput v-model="searchText" />
```

### 实际应用建议
- **优先使用 Vue 3**：Proxy 实现更完善，避免 Vue 2 的响应式陷阱
- **复杂状态管理**：大型应用建议使用 Vuex/Pinia，而非纯双向绑定
- **表单优化**：大量表单使用 `v-model` 配合 `.lazy`（失焦同步）、`.number`（类型转换）等修饰符

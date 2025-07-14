# hard 类1-10题

## 第一题 Simple Vue

### 问题 

实现类似Vue的类型支持的简化版本。

通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。

在此挑战中，我们假设`SimpleVue`接受只带有`data`，`computed`和`methods`字段的Object作为其唯一的参数，

- `data`是一个简单的函数，它返回一个提供上下文`this`的对象，但是你无法在`data`中获取其他的计算属性或方法。

- `computed`是将`this`作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。

- `methods`是函数的对象，其上下文也为`this`。函数中可以访问`data`，`computed`以及其他`methods`中的暴露的字段。 `computed`与`methods`的不同之处在于`methods`在上下文中按原样暴露为函数。

`SimpleVue`的返回值类型可以是任意的。

```ts
const instance = SimpleVue({
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
})
```

### 思路

1. **data**

- `data` 是一个函数，返回一个对象。
- 它不能访问 `this`（因为 `this` 不能引用 computed 和 methods）。
- 所以我们指定：`this: void`

2. **computed**

- 每个 computed 是一个函数，返回一个值。
- `this` 应该是 `data()` 返回的对象。
- 在类型上，我们先推断出 computed 返回值组成的对象类型（比如 `{ fullname: string }`），
  - 然后在 `methods` 中使用这些值。
- 因此需要先提取 computed 的值类型：通过工具类型 `GetComputed`。

3. **methods**

- `this` 可以访问：
  - `data` 的返回值
  - `computed` 的值（注意是值，不是函数）
  - 其他的 `methods`

这意味着：`this` 是 `TData & GetComputed<TComputed> & TMethods`

4. **用 `ThisType` 辅助设置 `this` 类型**

- TypeScript 提供了一个工具类型 `ThisType<T>`，可以设置对象中函数的 `this` 类型。
- 我们在 `computed` 和 `methods` 中分别使用它来指定 `this` 的上下文。

### 解答

```ts
type GetComputed<TComputed> = {
  [key in keyof TComputed]: TComputed[key] extends () => infer Result ? Result : never;
};

type Options<TData, TComputed, TMethods> = {
  data: (this: void) => TData;
  computed: TComputed & ThisType<TData>;
  methods: TMethods & ThisType<TData & GetComputed<TComputed> & TMethods>;
};

declare function SimpleVue<TData, TComputed, TMethods>(
  options: Options<TData, TComputed, TMethods>
): unknown;
```

## 第二题 Currying 1

### 问题 

> 在此挑战中建议使用TypeScript 4.0

[柯里化](https://en.wikipedia.org/wiki/Currying) 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。

例如：

```ts
const add = (a: number, b: number) => a + b
const three = add(1, 2)

const curriedAdd = Currying(add)
const five = curriedAdd(2)(3)
```

传递给 `Currying` 的函数可能有多个参数，您需要正确输入它的类型。

在此挑战中，柯里化后的函数每次仅接受一个参数。接受完所有参数后，它应返回其结果。

### 思路

柯里化的核心思想是将原本接受多个参数的函数，转化为一系列**嵌套的、每次只接受一个参数的函数**，直到接收完所有参数后执行原函数并返回结果。

#### 示例拆解：

```ts
const add = (a: number, b: number, c: number) => a + b + c
const curried = Currying(add)
const result = curried(1)(2)(3) // 返回 6
```

#### 1. 提取参数与返回类型

我们首先通过 `F extends (...args: infer Args) => infer Return` 提取原始函数的参数列表和返回值类型。

#### 2. 判断参数数量

- 如果参数个数为 0 或 1，则不需要柯里化，直接返回原函数类型。

#### 3. 拆分参数列表

- 如果参数长度大于 1，则将参数列表拆成：
  - 第一个参数（用元组 `[any]` 表示）
  - 剩余参数 `Rest`

#### 4. 递归构造柯里化函数类型

- 当前函数类型变为只接受一个参数
- 返回值类型是对剩余参数再柯里化，即递归调用 `Curried<...>` 构造下一层

#### 技巧说明：

- `FirstAsTuple<Args>` 是辅助类型，用来取出参数列表中第一个参数，并保留为元组 `[A]` 的形式，方便后续类型推导。
- 柯里化本质上是一个递归过程，直到所有参数都被拆完，最终返回结果类型。

### 解答

```ts
type FirstAsTuple<T extends any[]> = T extends [any, ...infer R]
  ? T extends [...infer F, ...R]
    ? F
    : never
  : never

type Curried<F> = F extends (...args: infer Args) => infer Return
  ? Args['length'] extends 0 | 1
    ? F
    : Args extends [any, ...infer Rest]
      ? (...args: FirstAsTuple<Args>) => Curried<(...rest: Rest) => Return>
      : never
  : never

declare function Currying<T extends Function>(fn: T): Curried<T>
```

## 第三题

### 问题 

### 思路

### 解答

## 第四题

### 问题 

### 思路

### 解答

## 第五题

### 问题 

### 思路

### 解答

## 第六题

### 问题 

### 思路

### 解答

## 第七题

### 问题 

### 思路

### 解答

## 第八题

### 问题 

### 思路

### 解答

## 第九题

### 问题 

### 思路

### 解答

## 第十题

### 问题 

### 思路

### 解答

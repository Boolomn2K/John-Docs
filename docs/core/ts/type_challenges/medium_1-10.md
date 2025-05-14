# medium 类1-10题

## 第一题 获取函数返回类型

### 问题 

不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。

例如：

```ts
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

### 思路

这里关键知识点是 `TS` 手册 `Conditional Types` 中 `infer` 关键字的运用

### 解答

```ts
type MyReturnType<T extends Function> = T extends (...args: any) => infer R ? R : never;
```

## 第二题 实现 Omit

### 问题

不使用 `Omit` 实现 TypeScript 的 `Omit<T, K>` 泛型。

`Omit` 会创建一个省略 `K` 中字段的 `T` 对象。

例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

### 思路

这里有两种思路，第一个是使用 `Mapped Types` 中的 `as` 关键字对映射类型中的 `key` 进行二次

映射。第二种是使用 `TS` 自带的 `Utility Types` 中的 `Exclude<UnionType， ExcludedMembers` 工

具类型排除掉不要的成员

### 解答

```ts
// first solution
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
// second solution
type MyOmit<T, K extends keyof T> = {
  [p in Exclude<keyof T, K>]: T[P]
}

```

## 第三题 对象部分属性只读

### 问题 

实现一个泛型`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。

类型 `K` 指定 `T` 中要被设置为只读 (readonly) 的属性。如果未提供`K`，则应使所有属性都变为

只读，就像普通的`Readonly<T>`一样。例如

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

### 思路

这里最重要的是对于 `Object Types` 中 `intersection Types` 的理解运用，手册上其实只展示了

简单的使用案例，在 `TS` 体操中能学会更多实际的应用。第一种是使用 `TS` 内置工具类型，第二

种自己再手写实现

### 解答

```ts
// first solution
type MyReadonly2<T, K extends keyof T = keyof T> = Omit<T, K> & Readonly<Pick<T,K>>

// second solution
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in K]: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

## 第四题 对象属性只读（递归）

### 问题

实现一个泛型 `DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。

您可以假设在此挑战中我们仅处理对象。不考虑数组、函数、类等。但是，您仍然可以通过覆盖尽

可能多的不同案例来挑战自己。例如

```ts
type X = { 
  x: { 
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = { 
  readonly x: { 
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey' 
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

### 思路

这里主要是考察对于 `Mapped Types` 的理解，下面解答能应对数组，联合类型和函数，但无法处

理被盒装基元( `Boxed primitives` )或一些特殊情况

例如

```ts
// Boxed Primitives
type Test = { str: String }; // Avoid this; use `string` instead.
type DeepTest = DeepReadonly<Test>;
// Result:
// {
//   readonly str: DeepReadonly<String>; // Unnecessary recursion
// }

// Class instances
class MyClass { x = 1; method() {} }
type Test = { instance: MyClass };
type DeepTest = DeepReadonly<Test>;
// Result:
// {
//   readonly instance: DeepReadonly<MyClass>; // Makes `x` readonly
// }

// Circular Reference
type Circular = { self: Circular };
type DeepCircular = DeepReadonly<Circular>; // ❌ Error: Type instantiation is excessively deep.
```

### 解答
```ts
type DeepReadonly<T> = {
  readonly [k in keyof T]: T[k] extends Record<any, any>
    ? T[k] extends Function
      ? T[k]
      : DeepReadonly<T[k]>
    : T[k]
}
```

## 第五题 元组转合集

### 问题

实现泛型 `TupleToUnion<T>` ，它返回元组所有值的合集。

例如

```ts
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

### 思路

第一种，使用 `infer` 关键字推导数组成员。

第二种，当 `T` 是元组或数组类型时，`T[number]` 表示访问所有数字索引对应的值的类型，最终

将这些类型合并成联合类型。例如，`Arr[number]` 会提取元组 `['1', '2', '3']` 中所有元素的类

型，得到`'1' | '2' | '3'`

### 解答

```ts
// first solution
type TupleToUnion<T> = T extends Array<infer Items> ? Items : never;

// second solution
type TupleToUnion<T extends unknown[]> = T[number]
```

## 第六题 可串联构造器

### 问题

在 `JavaScript` 中我们经常会使用可串联（`Chainable/Pipeline`）的函数构造一个对象，但在

 `TypeScript` 中，你能合理的给它赋上类型吗？

在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - `Interface`, `Type` 或 `Class` 都

行。你需要提供两个函数 `option(key, value)` 和 `get()`。在 `option` 中你需要使用提供的

 `key` 和 `value` 扩展当前的对象类型，通过 `get` 获取最终结果。

例如

```ts
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// 期望 result 的类型是：
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

你只需要在类型层面实现这个功能 - 不需要实现任何 `TS/JS` 的实际逻辑。

你可以假设 `key` 只接受字符串而 `value` 接受任何类型，你只需要暴露它传递的类型而不需要进

行任何处理。同样的 `key` 只会被使用一次。

### 思路

思路取自 [github Issue](https://github.com/type-challenges/type-challenges/issues/13951#issue-1326114004)

1. 可以使用 `T = {}` 来作为默认值，甚至默认参数与默认返回值，再通过递归传递 T 即可实现递归全局记录

2. `option` 是一个函数接收两个值：`K` 和 `V`，为了约束 `key` 不可重复必须范型传入，`value` 是任意类型范型不做约束直接透传

```ts
type Chainable<T = {}> = {
  option: <K extends string, V>(key: K, value: V) => Chainable<T & Record<K, V>>
  get: () => T
}
```

3. 先验证重复 `key` ，实现传入相同 `key` 报错

```ts
type Chainable<T = {}> = {
  option: <K extends string, V>(key: K extends keyof T ? never : K, value: V)
    => Chainable<T & Record<K, V>>
  get: () => T
}
```

4. 然后发现案例3无法通过，案例3是传入了相同的 `key` 但类型不同，因此在 `K extends keyof T` 后面增加验证只有类型相同才返回 `never`

```ts
type Chainable<T = {}> = {
  option: <K extends string, V>(key: K extends keyof T ?
    V extends T[K] ? never : K
    : K, value: V) => Chainable<T & Record<K, V>>
  get: () => T
}
```

5. 最后直接 `&` 联合并不能将相同 `key` 的类型覆盖，因此用 `Omit` 去掉前一个类型中相同的 `key`

```ts
type Chainable<T = {}> = {
  option: <K extends string, V>(key: K extends keyof T ?
    V extends T[K] ? never : K
    : K, value: V) => Chainable<Omit<T, K> & Record<K, V>>
  get: () => T
}
```

### 解答

```ts
type Chainable<T = {}> = {
    option: 
        <K extends string, V>(
            key: K extends keyof T
                ? V extends T[K]
                    ? never
                    : K
                : K,
            value: V
        ) => Chainable<Omit<T, K> & Record<K, V>>,
    get: () => T
}
```

## 第七题 最后一个元素

### 问题

> 在此挑战中建议使用TypeScript 4.0 或以上版本

实现一个`Last<T>`泛型，它接受一个数组`T`并返回其最后一个元素的类型。

例如

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // 应推导出 'c'
type tail2 = Last<arr2> // 应推导出 1
```

### 思路

第一种，使用 `infer` 关键字推导

第二种，使用索引类型

### 解答

```ts
// first solution
type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never; // 这里的 `_` 是占位符。

// second solution
type Last<T extends any[]> = [any, ...T][T['length']]
```

## 第八题 排除最后一项

### 问题

> 在此挑战中建议使用TypeScript 4.0

实现一个泛型 `Pop<T>` ，它接受一个数组 `T` ，并返回一个由数组 `T` 的前 N-1 项（N 为数组`T`的长

度）以相同的顺序组成的数组。

例如

```ts
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

**额外**：同样，您也可以实现`Shift`，`Push`和`Unshift`吗？

### 思路

同样是使用 `infer` 关键字

### 解答

```ts
type Pop<T extends any[]> = T extends [...infer F, infer _] ? F : never;
```

## 第九题 Promise.all

### 问题

给函数`PromiseAll`指定类型，它接受元素为 Promise 或者类似 Promise 的对象的数组，返回值

应为`Promise<T>`，其中`T`是这些 Promise 的结果组成的数组。

```ts
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// 应推导出 `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)
```

### 思路

**步骤解析**：

 1. 泛型约束： `T extends readonly unknown[]` 确保传入的参数是一个只读元组，保留每个元素的具体类型（如字面量类型`42`）。

 2. 映射类型： 使用映射类型遍历元组T的每个元素类型。对于每个元素 `T[K]`，使用 `Awaited<T[K]` 获取其解析后的类型：

    - 如果元素是 `Promise，Awaited` 会提取其解析值的类型（如 `Promise<number> → number` ）。

    - 如果元素是普通值，`Awaited` 直接保留原类型（如 `42 → 42` ）。

 3. 返回类型： 将处理后的元组类型包装在 `Promise` 中，得到最终的返回类型 `Promise<[...]>`。

**关键点**：

 - 使用 `as const` 确保传入的数组被视为只读元组，各元素类型不被拓宽。

 - `Awaited` 是 `TypeScript` 内置工具类型，用于递归解析 `Promise` 类型。

### 解答

```ts
declare function PromiseAll<T extends readonly unknown[]>(values: T): Promise<{ [P in keyof T]: Awaited<T[P]> }>; 
```

## 第十题 查找类型

### 问题

有时，您可能希望根据某个属性在联合类型中查找类型。

在此挑战中，我们想通过在联合类型`Cat | Dog`中通过指定公共属性`type`的值来获取相应的类

型。换句话说，在以下示例中`LookUp<Dog | Cat, 'dog'>`的结果应该是`Dog`，

`LookUp<Dog | Cat, 'cat'>`的结果应该是`Cat`。

```ts
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

### 思路

这里有两种方法，第一种比较简洁直观，第二种复杂点但核心都是利用了分布式条件类型进行判断。

### 解答

```ts
// first solution
type LookUp<T, V> = T extends { type: V } ? T : never;

// second solution
type LookUp<T, V extends string> = {
  [K in V]: T extends { type: V } ? T : never
}[V]
```

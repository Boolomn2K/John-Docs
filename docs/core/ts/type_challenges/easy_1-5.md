# esay 类1-5题

## 第一题 实现 Pick

### 问题

不使用 `Pick<T, K>` ，实现 TS 内置的 `Pick<T, K>` 的功能。

**从类型 `T` 中选出符合 `K` 的属性，构造一个新的类型**。

例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

### 思路

我们要从类 `T` 中取出符合 `K` 的属性，这一步我们可以在 `type MyPick<T, K>`中直接实现，直接

把 `K` 限制为类型 `T` 内的 `key`, 这样 `type MyPick<T, K extends keyof T>`。然后就是`T`类型中

这种 `object` 类型的 `value` 如何映射, 这里我们使用 `TS` 中的 `mapped type` 来实现。

### 答案

```ts
type Mypick<T, K extends keyof T> = { P in K: T[P] }
```

## 第二题 对象属性只读

### 问题

不要使用内置的`Readonly<T>`，自己实现一个。

泛型 `Readonly<T>` 会接收一个 _泛型参数_，并返回一个完全一样的类型，只是所有属性都会是只读

(readonly) 的。也就是不可以再对该对象的属性赋值。

例如：

```ts
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

### 思路

这里直接使用 `TS` 中的 `Mapped Types` 和 `Mapping Modifiers` 来实现

### 答案

```ts
type MyReadonly<T> = { readonly [P in keyof T]: T[P] }
```

## 第三题 元组转换为对象

### 问题

将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。

例如：

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

### 思路

从答案推导可知，只要我们得到这个元组内的所有成员再通过 `mapped type` 就可以得到。那么第

一步是思考如何得到元组内的所有值。

首先看看 `typeof tuple` 结果

```ts
type resultOfTypeof = typeof tuple // readonly ["tesla", "model 3", "model X", "model Y"]
```

看到这个结果可能有人就迫不及待的用了，但这时如果你直接使用这个结果去使用 `mapped type` 

就会得到报错

`Type 'T' is not assignable to type 'string | number | symbol'.Type 'readonly string[]' is not assignable to type 'string | number | symbol'.(2322)`

```ts
type TupleToObject<T extends readonly string[]> = {
    [P in T]: P // [!code error]
}
```

这里报错原因是为 `Mapped Types` 的键类型**不符合要求**。对象的键只能是 `string`、`number` 或

`symbol` 类型而这里的 `T` 是 `readonly string[]` 类型, 所以会报错。

所以接下来思路就是如何把 `T` 从 `readonly string[]` 转成合法值, 恰好在 `TS` 手册中的 

`Indexed Access Types` 章节就有一个获取思路

```ts
const MyArray_1 = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person_Arr = typeof MyArray_1; // { name: string; age: number; }[]

type Person_1 = typeof MyArray_1[number]; // { name: string; age: number; }
```

::: warning
`typeof` 不能用于类型上, 例如 `typeof number | string | boolean` , 这是不合法的
:::

我们可以像这样

```ts
type MyArray_2 = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person_2 = MyArray_2[number] // { name: "Alice"; age: 15; } | { name: "Bob"; age: 23; } | { name: "Eve"; age: 38; }
```

让 `T` 变成联合类型。

```ts
type resultOfTypeof = typeof tuple // readonly ["tesla", "model 3", "model X", "model Y"]

type resultOfIndex = resultOfTypeof[number]; // "tesla" | "model 3" | "model X" | "model Y"
```

### 答案

```ts
type TupleToObject<T extends readonly string[]> = {
    [P in T[number]]: P
}
```

## 第四题 数组第一个元素

### 问题

实现一个`First<T>`泛型，它接受一个数组`T`并返回它的第一个元素的类型。

例如：

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // 应推导出 'a'
type head2 = First<arr2> // 应推导出 3
```

### 思路

这里最简单易懂是使用 `Indexed Access Types` 取得数组第一个元素，也可使用 `T['length']` 获

取数组长度配合条件类型约束，当然也可以使用 `Inferring Within Conditional Types` 解决

### 答案

```ts
// answer1
type First<T extends any[]> = T extends [] ? never : T[0]

//answer2
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]

//answer3
type First<T extends any[]> = T extends [infer A, ...infer rest] ? A : never
```

::: details
这里答案取自 [github issue](https://github.com/type-challenges/type-challenges/issues/16315) 中的回答
:::

## 第五题 获取元组长度

### 问题

创建一个`Length`泛型，这个泛型接受一个只读的元组，返回这个元组的长度。

例如：

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

### 思路

::: details
- 普通数组（如 `Array<T>` 或 `T[]`）的长度是动态的，其 `length` 属性的类型始终为 `number`，无法通过类型系统获取具体数值
```ts
type Arr = number[];
type Length = Arr['length']; // type Length = number
```
- 元组（Tuple）是固定长度和类型的数组，其 `length` 属性是具体数值的字面量类型
```ts
type Tuple = [string, number];
type TupleLength = Tuple['length']; // type TupleLength = 2
```
:::

同样是使用 `TS` 手册中的 `Indexed Access Types`，有关 `TS` 索引的知识，但该章节并没有讲数

组元组的索引，真正有提到关于数组的索引在这 [Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)。

这里使用条件类型配合 `infer` 关键字也是一种巧思

### 答案

```ts
// answer1
type Length<T extends readonly any[]> = T['length']

// answer2
type Length<T extends any> = T extends { length : infer R } ? R : never;
```

::: details
answer2 思路来自 [github issue](https://github.com/type-challenges/type-challenges/issues/78)
:::

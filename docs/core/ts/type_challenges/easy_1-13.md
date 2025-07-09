# esay 类1-13题

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

## 第六题 实现 Exclude

### 问题

实现内置的 `Exclude<T, U>` 类型，但不能直接使用它本身。

> 从联合类型 `T` 中排除 `U` 中的类型，来构造一个新的类型。

例如：

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

### 思路

遍历 `T` 内所有成员,把符合 `U` 的 `T` 内成员剔除。

::: tip
这里涉及到 `conditional Types` 中的 `Distributive Conditional Types` 知识, 就是当条件类型作用在泛型类型时,你放进泛型变量 `T` 中的类型是 `union` 类型时,例如`type something<T> = T extends U ` 这里面这个 `T` 如果是 `union`类型, 就会触发分布式条件类型。
:::

容易混淆的是一般 `union` 类型使用条件类型时, 顺带一提， `unionType extends unionType` 判断依据是**前者是否后者的子集**

```ts
type result_1 = 'a' | 'b' extends 'a' | 'b' | 'c' ? true : false // true
type result_2 = 'a' | 'b' | 1 extends 'a' | 'b' | 'c' ? ture : false // false
```

这里的并没有触发分布式条件类型, 原因是这里根本没有使用泛型类型, 分布式条件类型触发的关键是**条件类型作用在泛型类型, 给定泛型变量 `T` 类型是 `union` 时**才会触发

::: details 顺带一提
在 `TS` 中有 `Top Type` 和 `Bottom Type` 这两个类型系统中的关键概念, `Top Type` 的成员分别是 `any`和 `unknown`, `Bottom Type` 的成员只有 `never`, `Top Type` 意味着在 `TS` 类型系统中任意的类型都是它的子类型, 它处在类型层级的顶端, 而 `Bottom Type` 则是任意类型的子类型, 处于类型层级的底端, 因此在条件类型中, **`anyType extends topType` 是必定成立的, 而 `bottomType extends anyType` 也同样必定成立**。( [更多关于 `Top Type` 和 `Bottom Type`](../extra/TopTypeAndBottomType.md) )
:::

分布式条件类型的工作行为代码演示会更加清楚

```ts
type ToArray<T> = T extends any ? T[] | never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]

// 当把 string | number 代入 T 时, 实际上变成了这样

ToArray<string> | ToArray<number>

// 所以得到的结果是 string[] | number[]

```

如果你不想触发分布式条件类型,最简洁的做法是给 `extends` 关键字左右用 `[]` 括起来(ps: 有其他[复杂的做法](../extra/AvoidDistributiveConditionalType.md))

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
type ArrOfStrOrNum = ToArrayNonDist<string | number>; // (string | number)[]
```

### 解答

```ts
type MyExclude<T, U> = T extends U ? never : T
```

## 第七题 Awaited

### 问题

假如我们有一个 `Promise` 对象，这个 `Promise` 对象会返回一个类型。在 TS 中，我们用

`Promise<T>` 中的 `T` 来描述这个 `Promise` 返回的类型。请你实现一个类型，可以获取这个类
 
型。例如：`Promise<ExampleType>`，请你返回 ExampleType 类型。

```ts
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

### 思路

首先 `Awaited<T>` 的职责是递归解包 `Promise resolve` 的 成功值类型链，而 `reject` 的类型在

 `TypeScript` 类型系统中无法（也不适合）被静态推导，因此无需也不应考虑 reject 的情况。要

 实现和 `TS` 手册中 `Utility Types` 一样的代码首先要理解 `Promise`, 这里直接上链接 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise), 其余
 
 补充在下方解答中的代码解释。

### 解答

```ts
type MyAwaited<T> = T extends undefined | null // 处理在不是 `strictNullChecks` 模式时 `T` 是 undefined | null 的情况
    ? T
    : T extends { then: (onfulfilled: infer F, ...args: infer _) => any } // 只去处理 `Thenable` 的对象并推断 F 用于下一步
        ? F extends ((value: infer V, ...args: infer _) => any) // 通过 `F extends` 获得第一个 Promise 的 T 
            ? MyAwaited<V> // 递归处理 Promise<Promise<...>> 嵌套使用情况
            : never
        : T
```

## 第八题 If

### 问题

实现一个 `IF` 类型，它接收一个条件类型 `C` ，一个判断为真时的返回类型 `T` ，以及一个判断为假时的返回类型 `F`。 `C` 只能是 `true` 或者 `false`， `T` 和 `F` 可以是任意类型。

例如：

```ts
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

### 思路

这里就是简单的 `conditionals Types` 内容。

### 解答

```ts
type If<C extends Boolean, T, F> = C extends true ? T : F 
```

## 第九题 Concat 

### 问题

在类型系统里实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

例如：

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

### 思路

这里重点是根据具体需要去限制 `T` 和 `U` 类型，剩下的就是展开数组的运算符了。

### 解答

```ts
type Concat<T extends readonly unknown[], U extends readonly unknown[]> = [...T, ...U];
```

## 第十题 Includes

### 问题

在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

例如：

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

### 思路

先实现一个 `IsEqual` 工具类型来实现相等判断,这里面会用到函数泛型协变特性，然后再进行元组包含检查。

### 解答
```ts
type IsEqual<T, U> =[T] extends [U]
  ? ([U] extends [T] ? true : false) // 处理 `T` 或者 `U` 为 `any` 的情况
  : (<G> => G extends T ? 1 : 2) extends (<G> => G extends U ? 1 : 2) // 若 `T` 和 `U` 严格相等，两个函数类型 `(<G>() => G extends T ? 1 : 2)` 和 `(<G>() => G extends U ? 1 : 2)` 会被视为相同，条件成立返回 `true`。
    ? true
    : false;

type Includes<T, I> = T extends [infer F, ...infer L]
  ? IsEqual<F, I> extends ture
    ? true
    : Includes<L, I>
  : false
```

## 第十一题 Push

### 问题

在类型系统里实现通用的 ```Array.push``` 。

例如：

```typescript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

### 思路

重点是限制 `T` 为元组，否则直接使用展开运算符会出错

### 解答

```ts
type Push<T extends readonly unknown[], I> = [...T, I];
```

## 第十二题 Unshift

### 问题

实现类型版本的 ```Array.unshift```。

例如：

```typescript
type Result = Unshift<[1, 2], 0> // [0, 1, 2]
```

### 思路

同样是记得限制 `T` 为元组

### 解答
```ts
type Unshift<T extends readonly unknown[], I> = [I, ...T];
```

## 第十三题 Parameters

### 问题

实现内置的 `Parameters<T>` 类型，而不是直接使用它，可参考[TypeScript官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)。

例如：

```ts
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

### 思路

这里使用 `TS` 手册中 `Conditional Types` 章节的 `infer` 关键字即可

### 解答

```ts
type Myparameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
  ? P
  : any
```

# esay 类6-10题

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

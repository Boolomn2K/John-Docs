# medium 类91-100题

## 第九十一题 Public Type

### 问题

从给定类型 `T` 中删除以 `_` 开头的键

```ts
type Example1 = PublicType<{ a: number }> // expected { a: number }
type Example2 = PublicType<{ _b: string | bigint }> // expected {}
type Example3 = PublicType<{ readonly c?: number }> // expected { readonly c?: number }
type Example4 = PublicType<{ d: string, _e: string }> // expected { d: string }
type Example5 = PublicType<{ _f: () => bigint[] }> // expected {}
type Example6 = PublicType<{ g: '_g' }> // expected { g: '_g' }
type Example7 = PublicType<{ __h: number, i: unknown }> // expected { i: unknown }
```

### 思路

1. **迭代键**：使用映射类型 `{ [K in keyof T as ...]: ... }`，遍历 `T` 的每个键 `K`。

2. **条件剔除**：在 `as` 子句中判断 `K` 是否以 `_` 开头：

    - 写法：`K extends \`_${any}\` ? never : K`

    - 若匹配到以 `_` 开头，则映射为 `never`，相当于删除该键；否则保留该键。

3. **保留修饰符**：映射类型在不显式更改的情况下，会自动保留原始的 `readonly`、可选 `?` 等属性修饰符。

4. **最终效果**：返回一个新对象类型，包含所有不以 `_` 开头的键及其对应类型和修饰符。

### 解答

```ts
type PublicType<T extends object> = { [K in keyof T as K extends `_${any}` ? never : K ]: T[K] }
```

## 第九十二题 ExtractToObject

### 问题

实现一个将 `prop` 值提取到接口的类型。该类型接受两个参数。输出应为一个包含 `prop` 值的对象。`prop` 值本身就是一个对象。

例如:

```ts
type Test = { id: '1', myProp: { foo: '2' }}
type Result = ExtractToObject<Test, 'myProp'> // expected to be { id: '1', foo: '2' }
```

### 思路

目标是将对象 `T` 中指定属性 `P` 对应的值（一个对象）“提取”到顶层，与原对象合并，同时移除原来的 `P` 属性。

具体做法如下：

1. **移除指定属性 `P`**：
   - 使用 `keyof T` 遍历对象键，通过 `as` 语法进行条件映射。
   - 如果当前键是 `P`，则映射为 `never`（即从结果中去掉）。
   - 其他键保留原样。

2. **合并剩余对象与 `T[P]`**：
   - 利用交叉类型 `&` 把移除 `P` 后的对象和 `T[P]`（它本身是个对象）合并。
   - 这样最终输出的类型就是：原对象减去 `P`，加上 `P` 的内部结构提升到顶层。

这个类型不会递归地提取嵌套属性，仅适用于一级对象展开。


### 解答

```ts
type ExtractToObject<T extends object, P extends keyof T> = {
    [K in keyof T as K extends P ? never : K ]: T[K]
} & T[P]
```

## 第九十三题 DeepOmit

### 问题

实现一个类型 `DeepOmit`，类似实用工具类型 `Omit`，该类型接受两个参数

```ts
type obj = {
  person: {
    name: string;
    age: {
      value: number
    }
  }
}

type test1 = DeepOmit<obj, 'person'>    // {}
type test2 = DeepOmit<obj, 'person.name'> // { person: { age: { value: number } } }
type test3 = DeepOmit<obj, 'name'> // { person: { name: string; age: { value: number } } }
type test4 = DeepOmit<obj, 'person.age.value'> // { person: { name: string; age: {} } }
```

### 思路

`DeepOmit` 要实现的是递归地省略一个对象中的某个属性，支持路径字符串的形式（如 `'person.name'` 表示嵌套删除）。因此我们需要考虑以下几点：

1. **路径分割**：

   - 利用模板字面量类型 `${infer K}.${infer Rest}` 把 `'a.b.c'` 分成 `K = 'a'` 和 `Rest = 'b.c'`。

   - 这一步是实现递归关键：通过不断拆分路径，深入对象结构。

2. **递归处理嵌套对象**：

   - 如果匹配到了 `K`，就对对应的值 `O[K]` 递归调用 `DeepOmit<O[K], Rest>`。

   - 其他键则保持原样。

3. **递归终点（基础情况）**：

   - 当路径不再包含 `.` 时，说明是最内层的属性，可以直接用标准 `Omit<O, P>` 处理。

4. **注意类型结构不变性**：

   - 只有在路径中明确指定的字段才会被剥离，其他结构保持不变（例如 `test3` 中删除 `'name'` 不影响 `person.name`）。


### 解答

```ts
type DeepOmit<O, P extends string> = P extends `${infer K}.${infer Rest}` ? {
  [key in keyof O]: key extends K ? DeepOmit<O[key], Rest> : O[key]
} : Omit<O, P>
```

## 第九十四题 IsOdd

### 问题

实现一个类型 `IsOdd`，它接收一个整数类型参数 `N`，并判断 `N` 是否为奇数。

例如: 

```ts
type Example1 = IsOdd<5>        // expected `true`
type Example2 = IsOdd<2023>     // expected `true`
type Example3 = IsOdd<1453>     // expected `true`
type Example4 = IsOdd<1926>     // expected `false`
type Example5 = IsOdd<2.3>      // expected `false`
type Example6 = IsOdd<3e23>     // expected `false`
type Example7 = IsOdd<3e0>      // expected `true`
type Example8 = IsOdd<number>   // expected `false`
```

### 思路

我们希望实现一个类型 `IsOdd<N>` 来判断某个数值字面量类型是否为奇数。

由于 TypeScript 类型系统中的算术能力有限，不能直接进行 `% 2` 运算，因此需要借助字符串模式匹配的技巧来判断一个数字的奇偶性。

核心思路如下：

1. **先将数字转为字符串**：
   - 使用模板字面量类型：`type Str = \`\${N}\``，可以将字面量类型 `N` 转为字符串类型。

2. **排除非法情况**：
   - 如果 `N` 是浮点数（例如 `2.3`）或科学计数法（例如 `3e23`），则直接返回 `false`。
   - 这些情况可以通过匹配字符串中是否包含 `.` 或 `e` 来识别：
     ```ts
     `${N}` extends `${any}e${any}` | `${any}.${any}`
     ```

3. **提取最后一位判断奇偶性**：
   - 将合法整数字符串的最后一位字符取出，判断是否是奇数字符 `'1' | '3' | '5' | '7' | '9'`。
   - 如果是奇数，则返回 `true`，否则为 `false`。

4. **处理特殊情况**：
   - 对于非字面量类型如 `number`，由于不能静态判断，也视为 `false`。

这种方式是基于字符串的模式匹配技巧来“静态计算”数字奇偶性。

### 解答

```ts
type IsOdd<N extends number | string> = `${N}` extends `${any}e${any}` | `${any}.${any}`
  ? false
  : `${N}` extends `${any}${1 | 3 | 5 | 7 | 9}`
    ? true
    : false
```

## 第九十五题 Tower of hanoi

### 问题

模拟汉诺塔谜题的解决方案。你的类型应该以环的数量作为输入，

并返回一个数组，该数组包含将环从塔 A 移动到塔 B 的步骤，并以塔 C 作为附加步骤。

数组中的每个条目都应该是一对字符串 `[From, To]`，表示环从 A 移动到 B。

例子:

```ts
type Example0 = Hanoi<0> // expected []
type Example1 = Hanoi<1> // expected [['A', 'B']]
type Example2 = Hanoi<2> // expected [['A', 'C'], ['A', 'B'], ['C', 'B']]
type Example3 = Hanoi<3> // expected [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B'], ['C', 'A'], ['C', 'B'], ['A', 'B']]
```

### 思路

1. 先把 `N - 1` 个盘从 A 移到 C（借助 B）
2. 再把第 `N` 个盘从 A 移到 B
3. 最后把之前的 `N - 1` 个盘从 C 移到 B（借助 A）

我们用类型系统模拟这个过程：

- 用一个累加器 `Acc` 来数当前层数，每次递归加一，直到达到目标层数 `Rings`。
- 每一层的结果由三部分组成：
  - 前半部分的递归（把 `N-1` 移到辅助塔）
  - 当前这一步 `[From, To]`
  - 后半部分的递归（把 `N-1` 从辅助塔移到目标塔）

### 解答

```ts
type Hanoi<
  Rings extends number,
  FromRod extends string = 'A',
  ToRod extends string = 'B',
  IntermediateRod extends string = 'C',
  Acc extends unknown[] = []
> =
  Acc['length'] extends Rings
    ? []
    : [
        ...Hanoi<Rings, FromRod, IntermediateRod, ToRod, [...Acc, unknown]>,
        [FromRod, ToRod],
        ...Hanoi<Rings, IntermediateRod, ToRod, FromRod, [...Acc, unknown]>
      ];
```

## 第九十六题 Pascal's triangle

### 问题

给定一个数字 `N`，构造具有 `N` 行的帕斯卡三角形

```ts
// example 1
type example1 = Pascal<1>
// 期望: [[1]]

// example 2
type example2 = Pascal<3>
// 期望: [[1], [1, 1], [1, 2, 1]]

// example 3
type example3 = Pascal<5>
// 期望: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]

// example 4
type example4 = Pascal<7>
// 期望: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1], [1, 6, 15, 20, 15, 6, 1]]
```

### 思路

帕斯卡三角形的特点是：

- 每一行的两边是 `1`，中间的每个数等于上一行相邻两个数之和。
  - 比如第 4 行是：`[1, 3, 3, 1]`，来源于上一行 `[1, 2, 1]`，其中 `3 = 1 + 2`，`3 = 2 + 1`

我们用类型系统递归构造：

1. **初始值**：
   - 第一行固定为 `[1]`，即 `R = [[1]]`

2. **每一行的生成**：
   - 取上一行的最后一项，比如 `[1, 2, 1]`
   - 计算相邻元素之和：`1+2=3`，`2+1=3`
   - 新行就是 `[1, 3, 3, 1]`

3. **工具类型设计**：
   - `GetLast`：取二维数组的最后一行
   - `ToTuple`：把数字转为对应长度的元组，方便加法
   - `Sum`：通过连接两个元组，计算长度，实现加法
   - `GenRow`：根据上一行生成下一行
   - `Pascal`：递归生成整个帕斯卡三角形，直到行数满足 `N`


### 解答

```ts
// 获取二维数组的最后一项
type GetLast<T extends number[][]> =
  T extends [...any, infer L extends number[]] ? L : never;

// 生成长度为 T 的元组
type ToTuple<
  T extends number,
  R extends number[] = []
> = R['length'] extends T ? R : ToTuple<T, [...R, 0]>;

// 对两个数字做加法，返回和
type Sum<
  T extends number,
  U extends number
> = [...ToTuple<T>, ...ToTuple<U>]['length'];

// 根据上一行生成下一行
type GenRow<
  T extends number[],
  R extends number[] = [1]
> =
  T extends [infer F extends number, infer S extends number, ...infer L extends number[]]
    ? [Sum<F, S>] extends [infer A extends number]
      ? GenRow<[S, ...L], [...R, A]>
      : never
    : [...R, 1];

// 生成帕斯卡三角形
type Pascal<
  N extends number,
  R extends number[][] = [[1]]
> =
  R['length'] extends N
    ? R
    : Pascal<N, [...R, GenRow<GetLast<R>>]>;
```

## 第九十七题 IsFixedStringLiteralType

### 问题

`IsFixedStringLiteralType<T>`，判断 `T` 是否是“完全固定”的字符串字面量，而不是任何带有变量动态部分或联合类型的字符串。

- `IsFixedStringLiteralType<'ABC'>` 应该返回 `true`，代表固定字符串字面量类型。

- `IsFixedStringLiteralType<string>` 应该返回 `false`，普通 `string` 类型不是固定字面量。

- `IsFixedStringLiteralType<'ABC' | 'DEF'>` 应该返回 `false`，联合类型不是单一字面量。

- 各种模版字面量类型（如 `${string}、ABC${string}、${number}DEF）`都应该返回 `false`，只要类型中有变量部分，就不是固定字面量。

- 但像 `${true}、${false}、${null}、${undefined}` 这些会被解析为固定字符串（比如 `"true"`），所以这些情况应返回 `true`。

### 思路

1. **排除 `string` 和模板变量类的动态字符串**：
   - 这些类型在 `Record<S, 1>` 中无法作为稳定的键，会导致 `{}` 兼容 `Record<S, 1>`。
   - 所以可以用：`{} extends Record<S, 1> ? false : ...` 来排除这类类型。

2. **排除联合类型**：
   - 联合类型会在 `S extends unknown` 分发时被展开，因此可以通过：
     ```ts
     Equal<[S], S extends unknown ? [S] : never>
     ```
     来判断是否是单一类型。

这个思路结合了两个维度的判断：
- 键的稳定性（是否可用于 `Record`
- 类型是否为联合（通过分发检测

最终只剩下最纯粹的字符串字面量（比如 `'Hello'`）会返回 `true`。

### 解答

```ts
type Equal<A, B> = (<G>() => G extends A ? 1 : 2) extends (<G>() => G extends B ? 1 : 2)
  ? true
  : false;

type IsFixedStringLiteralType<S extends string> = {} extends Record<S, 1>
  ? false
  : Equal<[S], S extends unknown ? [S] : never>
```

## 第九十八题 Compare Array Length

### 问题

实现 `CompareArrayLength` ，用于比较两个数组（`T` 和 `U`）的长度。

如果 `T` 数组的长度大于 `U`，返回 `1`；
如果 `U` 数组的长度大于 `T`，返回 `-1`；
如果 `T` 和 `U` 数组的长度相等，返回 `0`。

```ts
type Example1 = CompareArrayLength<[1, 2, 3, 4], [5, 6]> // expected 1
type Example2 = CompareArrayLength<[1, 2], [3, 4, 5, 6]> // expected -1
type Example3 = CompareArrayLength<[], []> // expected 0
type Example4 = CompareArrayLength<[1, 2, 3], [4, 5, 6]> // expected 0
```

### 思路

### 思路

TypeScript 在类型层面没有“>”“<”这样的比较运算符，但数组有一个可靠的 `length` 字段，所以我们可以依赖 **数字索引是否存在** 来判断大小：

1. **先判断相等**  
   - 直接比较 `T['length']` 与 `U['length']`，若二者互相 `extends`，说明长度一致，返回 `0`。

2. **利用索引存在性判断谁更长**  
   - 若长度不相等，再看 `U['length']` 这个数字能不能当作 `T` 的索引：  
     - 写成模板字面量再取键：``${U['length']}``；如果它是 `keyof T`，说明 `T` 至少比 `U` 长一位，因此返回 `1`。  
     - 否则说明 `T` 没有那么长，`U` 更长，返回 `-1`。

这种做法绕开了直接比较数字大小的限制，完全用类型系统的“索引存在”这一特性来确定谁的长度更大。


### 解答

```ts
type CompareArrayLength<T extends unknown[], U extends unknown[]> = T['length'] extends U['length']
  ? 0
  : `${U['length']}` extends keyof T ? 1 : -1;
```

## 第九十九题 Defined Partial Record

### 问题

使用联合类型作为键的 Record 时，不能只创建包含部分键的对象：

```ts
const record: Record<'a' | 'b' | 'c', number> = { a: 42, b: 10 } 
// 错误：类型 “{ a: number; b: number; }” 中缺少属性 “c”，但在类型 “Record<'a' | 'b' | 'c', number>” 中是必需的
```

使用 `Partial Record` 可以只包含部分联合成员，但所有键和值都变成了可选，这样可能会导致值为 `undefined`：

```ts
const partial: Partial<Record<'a' | 'b' | 'c', number>> = { a: 42 } 
const partialType = typeof partial // { a?: number | undefined, b?: number | undefined, c?: number | undefined }
const operation = 0 + partial.a // 错误：'partial.a' 可能为 'undefined'
const access = partial.c // 合法，类型系统无法判断该键不存在
```

你需要创建一个类型，结合两者的优点：它能生成联合类型所有键的所有组合。

这样，当你访问对象中实际存在的键时，能得到确定的类型；而访问联合类型中存在但对象中不存在的键时，会报错：

```ts
const best: DefinedPartial<Record<'a' | 'b' | 'c', number>> = { a: 42 }
const sum = 0 + best.a // 42
const error = best.b // 错误：类型 “{ a: number; }” 上不存在属性 “b”
```

例如:

```ts
type A1 = Record<'a' | 'b', string>
type E1 = { a: string } |
  { b: string } |
  { a: string, b: string }
type D1 = DefinedPartial<A1> // expected E1 等于 D1
```

### 思路

1. **利用联合分发的特性**：
   - 我们让 `K extends any`，就可以对每个键 `K` 分别展开处理（也就是子集组合的展开）。

2. **使用递归生成所有子集**：
   - 每次选择一个键 `K`，然后把这个键从对象中剔除，递归生成剩下的组合。
   - 当前这一层可以是整个 `U`，也可以是 `Omit<U, K>` 的组合之一。

3. **最终联合所有子集的组合**：
   - 每一层构造出来的对象都是合法的 DefinedPartial 的一种形式，最终结果是这些组合的联合。

### 解答

```ts
type DefinedPartial<U, K extends keyof U = keyof U> = K extends any
  ? U | DefinedPartial<Omit<U, K>>
  : never;
```

## 第一百题 Longest Common Prefix

### 问题

请编写一个类型 `LongestCommonPrefix`，它接受一个字符串元组，返回这些字符串中的最长公共前缀。

如果没有公共前缀，则返回空字符串 ""。

```ts
type Common = LongestCommonPrefix<["flower", "flow", "flight"]>
//   ?^ "fl"

type Uncommon = LongestCommonPrefix<["dog", "racecar", "race"]>
//   ?^ ""
```

### 思路

1. **从空字符串开始尝试构造前缀**：
   - 初始前缀 `P` 是 `""`。
   - 每次递归时尝试将 `P` 延长一个字符，看看是否还能匹配所有字符串的开头。

2. **尝试下一个字符 `Next`**：
   - 使用模板字符串类型：`T extends [\`${P}${infer Next}${any}\`, ...]`，可以从第一个字符串提取出前缀后的一个字符。

3. **验证所有字符串是否都匹配当前扩展前缀**：
   - 利用 `T extends \`${P}${Next}${any}\`[]`，来判断所有项是否都可以匹配这个更长的前缀。

4. **如果可以匹配，递归尝试更长的前缀**：
   - 即 `LongestCommonPrefix<T, \`${P}${Next}\`>`。

5. **递归终止条件**：
   - 如果不能再继续匹配所有字符串，就返回当前的前缀 `P`。

### 解答

```ts
type LongestCommonPrefix<T extends string[], P extends string = ''>
  = T extends [`${P}${infer Next}${any}`, ...any]
  ? T extends `${P}${Next}${any}`[]
    ? LongestCommonPrefix<T, `${P}${Next}`>
    : P // the longest
  : P   // T is empty or end of T[0]
```

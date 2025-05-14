# medium 类11-20题

## 第十一题 去除左侧空白

### 问题

实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除

了原字符串开头的空白字符串。

例如

```ts
type trimed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '
```

### 思路

首先定义空白符，字符串中 `" " | "\t" | "\n"` 都是空白符组成部分

然后通过遍历字符串元素把 `Hello World` 前面空白的部分剔除

### 解答
```ts
type TrimLeft<S extends string> = T extends `${infer F}${infer R}`
  ? F extends ' ' | '\t' | '\n'
    ? TrimLeft<R>
    : T
  : never
```

## 第十二题 去除两端空白字符

### 问题

实现`Trim<T>`，它接受一个明确的字符串类型，并返回一个新字符串，其中两端的空白符都已被

删除。例如

```ts
type trimed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

### 思路

与上题类似，无非是多处理右边也有空白符的情况，因此我们使用 `union` 类型把左右侧都有空白

符的情况涵盖进来

### 解答
```ts
type Space = ' ' | '\t' | '\n';
type Trim<S extends string> = 
  S extends `${Space}${infer T}` | `${infer T}${Space}` 
    ? Trim<T> 
    : S;
```

## 第十三题 Capitalize

### 问题

实现 `Capitalize<T>` 它将字符串的第一个字母转换为大写，其余字母保持原样。

例如

```ts
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

### 思路

构建一个小写映射大写字母表，在 `Template Literal Types` 使用 `infer` 关键字获取第一元素

`F`，然后让 `F` 与字母表一一比对直到找到对应字母为止（也可以偷懒直接使用 `TS` 内置的
 
`Uppercase<String Type>`

### 解答

```ts
interface AlphaMap {
    a: "A"
    b: "B"
    c: "C"
    d: "D"
    e: "E"
    f: "F"
    g: "G"
    h: "H"
    // ...more 
}

type Alphas = keyof AlphaMap
type MyCapitalize<S extends string> = S extends `${infer F extends Alphas}${infer R}` ? `${Alphas[F]}${R}` : S
```

## 第十四题 Replace

### 问题

实现 `Replace<S, From, To>` 将字符串 `S` 中的第一个子字符串 `From` 替换为 `To` 。

例如

```ts
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'
```

### 思路

1. 处理空字符串情况：如果 `From` 是空字符串，直接返回原字符串 `S`，因为没有内容需要替换。

2. 拆分字符串：使用模板字面量类型将 `S` 拆分为三部分：`${infer Prefix}${From}${infer Suffix}` 。这里 `Prefix` 是 `From` 前面的部分，`Suffix` 是后面的部分。

3. 替换并拼接：如果拆分成功，将 `From` 替换为 `To`，并拼接成新的字符串 `${Prefix}${To}${Suffix}`。

4. 无法拆分时返回原字符串：如果无法拆分（即 `From` 不存在于 `S` 中），返回原字符串 `S`。

### 解答

```ts
type Replace<S extends string, From extends stirng, To extends string> = From extends ''
  ? S
  : S extends `${infer Prefix}${From}${infer Suffix}`
    ? `${Prefix}${To}${Suffix}`
    : S
```

## 第十五题 ReplaceAll

### 问题

实现 `ReplaceAll<S, From, To>` 将一个字符串 `S` 中的所有子字符串 `From` 替换为 `To`。

例如

```ts
type replaced = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'
```

### 思路

1. 如果 `From` 为空字符串，直接返回原字符串。

2. 尝试将字符串分割为 `前缀` + `From` + `后缀`。

3. 若匹配成功，替换 `From` 为 `To`，并对剩余部分递归处理。

4. 若匹配失败，直接返回原字符串。

### 解答

```ts
type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer Prefix}${From}${infer Suffix}`
    ? `${Prefix}${To}${ReplaceAll<`${Suffix}`, From, To>}`
    : S
```

## 第十六题 追加参数

### 问题

实现一个泛型 `AppendArgument<Fn, A>`，对于给定的函数类型 `Fn`，以及一个任意类型 `A`，返回一个新的函数 `G`。`G` 拥有 `Fn` 的所有参数并在末尾追加类型为 `A` 的参数。

```ts
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// 期望是 (a: number, b: string, x: boolean) => number
```

### 思路

1. **提取原函数的参数和返回值**

    通过条件类型和 `infer` 关键字，从 `Fn` 中提取参数列表 `Args` 和返回值类型 `Return`。

2. **构造新参数列表**

    将新参数 `A` 追加到原参数列表 `Args` 的末尾，形成新的参数列表 `[...Args, A]`。

3. **保留原函数的返回值**

    确保新函数类型的返回值与原函数一致。

### 解答

```ts
type AppendArgument<T extends (...args: any) => any, A> = T extends (...args: infer Args) => infer Return
  ? (...args: [...Args, A]) => Return
  : never;
```

## 第十七题 Permutation

### 问题

实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。

```ts
type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

### 思路

1. **递归终止条件**
  - 当处理完所有元素时（剩余类型 `T` 变为 `never`），返回空数组结束递归
  - 使用 `[T]` 包裹避免意外触发分布式条件类型

```ts
[T] extends [never] ? [] : ...
```

2. **分布式分解**
  - 通过 `U extends U` 触发分布式条件类型
  - 将联合类型分解为单个元素处理（如 `'A' | 'B'` 分解为 `'A'` 和 `'B'` 两个分支）
  
```ts
U extends U ? [U, ...Permutation<Exclude<T, U>>] : never
```

3. **递归处理流程**
  - 取当前元素 `U` 作为元组首元素
  - 用 `Exclude<T, U>` 移除已选元素
  - 递归处理剩余元素

```ts
[U, ...Permutation<Exclude<T, U>>]
```

#### 执行流程示例（以 `'A' | 'B'` 为例）

```bash
Permutation<'A' | 'B'>
├─ 选'A'分支 → ['A', ...Permutation<'B'>]
│  └─ Permutation<'B'> → ['B']
│     └─ 结果：['A', 'B']
│
└─ 选'B'分支 → ['B', ...Permutation<'A'>]
   └─ Permutation<'A'> → ['A']
      └─ 结果：['B', 'A']
```

### 解答

```ts
type Permutation<T, U = T> = [T] extends [never]
  ? []
  : U extends U
    ? [U, ...Permutation<Exclude<T, U>>]
    : never
```

## 第十八题 Length of String

### 问题

计算字符串的长度，类似于 `String#length` 。

### 思路

1. **类型参数**

  - `T`: 被处理的字符串类型
  - `S`: 用于存储字符的数组（默认空数组）

```ts
<T extends string, S extends string[] = []>
```

2. **递归分解**

- 模式匹配分解字符串：
  - `F` 推断第一个字符
  - `R` 推断剩余字符串

```ts
T extends `${infer F}${infer R}` ? ... : ...
```

3. **递归过程**

- 将第一个字符 `F` 压入数组头部
- 对剩余字符串 `R` 继续递归处理

```ts
StringOfLength<R, [F, ...S]>
```

4. **终止条件**
```ts
S['length'] // 当 T 为空字符串时返回数组长度
```

#### 执行流程示例（以 "AB" 为例）

```bash
初始调用 → StringOfLength<"AB", []>
├─ 分解得到 F='A', R='B'
├─ 递归调用 → StringOfLength<"B", ['A']>
│  ├─ 分解得到 F='B', R=''
│  ├─ 递归调用 → StringOfLength<"", ['B', 'A']>
│  │  └─ 返回数组长度 2
│  └─ 最终结果：2
└─ 最终输出：2
```

### 解答

```ts
type StringOfLength<T extends string, S extends string[] = []> = T extends `${infer F}${infer R}`
  ? StringOfLength<R, [F, ...S]> 
  : S['length']
```

## 第十九题 Flatten

### 问题

在这个挑战中，你需要写一个接受数组的类型，并且返回扁平化的数组类型。

例如:

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

### 思路

1. **类型约束**

```ts
<T extends any[]>  // 确保输入是数组类型
```

2. **递归分解**

- 使用模式匹配分解数组：
  - `First` 获取第一个元素
  - `Rest` 获取剩余元素数组

```ts
T extends [infer First, ...infer Rest]
```

3. **嵌套处理逻辑**

```ts
First extends any[]
  ? [...Flatten<First>, ...Flatten<Rest>]  // 展开嵌套数组
  : [First, ...Flatten<Rest>]             // 保留非数组元素
```

4. 终止条件

```ts
: []  // 空数组返回空
```

#### 执行流程（以 [1, [2, [3]]] 为例）
```bash
Flatten<[1, [2, [3]]>  # 开始处理整个数组
├─ 步骤1：分解第一个元素
│  ├─ 取出首元素：1（不是数组）
│  ├─ 直接保留 → [1]
│  └─ 剩余部分：[[2, [3]]（需继续处理）
│
├─ 步骤2：处理剩余部分 [[2, [3]]
│  ├─ 分解首元素：[2, [3]（是数组）
│  ├─ 递归展开 → Flatten<[2, [3]>
│  │  ├─ 分解首元素：2（不是数组）
│  │  ├─ 直接保留 → [2]
│  │  └─ 剩余部分：[[3]]（需继续处理）
│  │
│  │  # 深入处理 [[3]]
│  │  ├─ 分解首元素：[3]（是数组）
│  │  ├─ 递归展开 → Flatten<[3]>
│  │  │  ├─ 分解首元素：3（不是数组）
│  │  │  └─ 结果 → [3]
│  │  └─ 合并结果 → [3]
│  │
│  └─ 合并步骤 → [2, 3]
│
└─ 最终组合：将步骤1和步骤2的结果合并 → [1, 2, 3]
```

### 解答

```ts
type Flatten<T extends any[], Arr extends any[] = []> =  T extends [infer F, ...infer Rest]
  ? F extends any[]
    ? Flatten<[...F, ...Rest], [...Arr]>
    : Flatten<Rest, [F, ...Arr]>
  : Arr
```

## 第二十题 Append to object

### 问题

实现一个为接口添加一个新字段的类型。该类型接收三个参数，返回带有新字段的接口类型。

例如:

```ts
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

### 思路

1. **合并键集合**
```ts
keyof T | K  // 将原对象键名与新键名合并
```

2. **值类型分配**

- _新键处理_：当遍历到新键名时，返回新值类型 `V`
- _原键保留_：当遍历到原有键名时，保留原始值类型 `T[P]`

```ts
P extends K ? V : T[P]
```

3. **类型保护**

```ts
: never  // 理论上不会执行（联合类型已覆盖所有可能情况）
```

### 解答

```ts
type AppendToObject<T, K extends PropertyKey, V> = {
  [P in keyof T | K]: P extends keyof T ? T[P] : P extends K ? V : never 
}
```

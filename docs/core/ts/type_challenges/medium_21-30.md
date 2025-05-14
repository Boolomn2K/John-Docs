# medium 类21-30题

## 第二十一题 Absolute

### 问题

实现一个接收 `string`, `number` 或` bigInt` 类型参数的 `Absolute` 类型,返回一个正数字符串。

例如

```ts
type Test = -100;
type Result = Absolute<Test>; // expected to be "100"
```

### 思路

1. **类型约束**

```ts
<T extends string | number | bigint>  // 限定输入类型范围
```

2. **统一字符串转换**

```ts
`${T}`  // 将所有输入转换为字符串格式
```

处理示例：
- `-100 → "-100"`
- `123n → "123"`
- `"-42" → "-42"`

3. **符号处理**

- 匹配负号开头的字符串
- 使用 `infer R` 提取负号后的内容
- 无负号则直接返回原字符串

```ts
extends `-${infer R}` ? R : `${T}`
```

### 解答

```ts
type Absolute<T extends string | number | bigint> = `${T}` extends `-${infer R}` ? R : `${T}`
```

## 第二十二题 String to Union

### 问题

实现一个将接收到的 `String` 参数转换为一个字母 `Union` 的类型。

例如

```ts
type Test = '123';
type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"
```

### 思路

1. **递归分解**

- 使用模板字面量类型分解字符串：

  - `First` 推断第一个字符

  - `Rest` 推断剩余字符串

```ts
T extends `${infer First}${infer Rest}`
```

2. **递归组合**

- 将当前字符与剩余字符的递归结果合并

- 使用联合类型 `|` 连接各个字符

```ts
First | StringToUnion<Rest>
```

3. **终止条件**

```ts
: never  // 当字符串为空时返回 never（最终会被联合类型过滤）
```

### 解答

```ts
type StringToUnion<T extends string> =  T extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest>
  : never
```

## 第二十三题 Merge

### 问题

将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。

例如

```ts
type foo = {
  name: string;
  age: string;
}

type coo = {
  age: number;
  sex: string
}

type Result = Merge<foo,coo>; // expected to be {name: string, age: number, sex: string}
```

### 思路

1. **交叉合并基础**

```ts
Omit<T, keyof U> & U
```

- _过滤冲突键_：`Omit<T, keyof U>` 移除 `T` 中与 `U` 重复的键
- _合并新类型_：通过交叉类型 `& U` 合并剩余属性

2. **类型展平处理**

```ts
extends infer O ? { [K in keyof O]: O[K] } : never
```

- _类型捕获_：`extends infer O` 获取交叉类型的实际类型
- _映射展平_：通过遍历键重新映射为普通对象类型

### 解答

```ts
type Merge<T, U> = Omit<T, keyof U> & U extends infer O 
  ? { [K in keyof O]: O[K] } 
  : never;
```

## 第二十四题 KebabCase

### 问题

用 `kebab-case` 格式代替 `camelCase` 或 `PascalCase` 格式的字符串 .

`FooBarBaz` -> `foo-bar-baz`

For example

```ts
type FooBarBaz = KebabCase<"FooBarBaz">
const foobarbaz: FooBarBaz = "foo-bar-baz"

type DoNothing = KebabCase<"do-nothing">
const doNothing: DoNothing = "do-nothing"
```

### 思路

1. **递归分解字符**
  - 将字符串分解为首字符 `First` 和剩余字符串 `Rest`
  
```ts
S extends `${infer First}${infer Rest}`
```

2. **大小写检测逻辑**
  - 判断剩余字符串是否以小写开头（ `Uncapitalize` 会将首字母转小写后比较）

```ts
Rest extends Uncapitalize<Rest> 
```

3. **短横线插入规则**

```ts
? `${Lowercase<First>}${KebabCase<Rest>}`  // 小写开头不添加短横线
: `${Lowercase<First>}-${KebabCase<Rest>}` // 大写开头添加短横线
```

### 解答

```ts
type KebabCase<S extends string> = 
  S extends `${infer First}${infer Rest}`
    ? Rest extends Uncapitalize<Rest> 
      ? `${Lowercase<First>}${KebabCase<Rest>}`
      : `${Lowercase<First>}-${KebabCase<Rest>}`
    : S;
```

## 第二十五题 Diff

### 问题

获取两个接口类型中的差值属性。

```ts
type Foo = {
  a: string;
  b: number;
}
type Bar = {
  a: string;
  c: boolean
}

type Result1 = Diff<Foo,Bar> // { b: number, c: boolean }
type Result2 = Diff<Bar,Foo> // { b: number, c: boolean }
```

### 思路

关键点在于：
- 联合类型 `|` 的 `keyof` 取公共键

- 交叉类型 `&` 的 `keyof` 取所有键

- `keyof A | keyof B` 是集合的并集

- `keyof A & keyof B` 是集合的交集

### 解答
```ts
type Diff<O1, O2> = Omit<O1 & O2, keyof (O1 | O2)>;
```


## 第二十六题 AnyOf

### 问题

在类型系统中实现类似于 Python 中 `any` 函数。类型接收一个数组，如果数组中任一个元素为真，则返回 `true`，否则返回 `false`。如果数组为空，返回 `false`。

例如：

```ts
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```

### 思路

1. **空数组优先判断**：  
   通过 `T extends []` 直接拦截空数组场景，避免后续误判
   
2. **联合类型整体判断**：  
   `T[number]` 将数组元素转换为联合类型，但不会触发分布式条件类型

3. **严格空对象定义**：  
   `{ [key: string]: never }` 精确匹配无属性的对象类型

### 解答

```ts
type falsy = 0 | "" | null | undefined | [] | { [key: string]: never } | false

type AnyOf<T extends readonly any[]> = T extends []
    ? false
    : T[number] extends falsy
        ? false
        : true 
```

## 第二十七题 IsNever

### 问题

实现一个 `IsNever` 类型，它接受输入类型 `T`。如果类型解析为 `never`，则返回 `true`，否则返回 `false`

For example:

```ts
type A = IsNever<never> // expected to be true
type B = IsNever<undefined> // expected to be false
type C = IsNever<null> // expected to be false
type D = IsNever<[]> // expected to be false
type E = IsNever<number> // expected to be false
```

### 思路

使用元组包装 `[T]` 和 `[never]`，防止 `never` 作为空联合类型触发条件类型分发机制

### 解答

```ts
type IsNever<T> = [T] extends [never] ? true : false;
```

## 第二十八题 IsUnion

### 问题

实现一个 `IsUnion` 类型，它接受一个输入类型 `T`，并根据 `T` 是否解析为联合类型返回 `true` 或 `false`

For example:

```ts
type case1 = IsUnion<string> // false
type case2 = IsUnion<string | number> // true
type case3 = IsUnion<[string | number]> // false
```

### 思路

1. **处理 `never` 特殊情况**

  - 当输入类型为 `never` 时直接返回 `false`
  - 使用元组包裹避免分布式条件类型的影响

```ts
[T] extends [never] ? false : ...
```

2. **触发分布式条件类型**

  - 当 `T` 是联合类型时，触发条件类型分发特性
  - 每个联合成员会被单独处理

```ts
T extends any ? ... : never
```

3. **联合类型检测核心逻辑**

  - `U` 保存原始输入类型
  - `T` 当前为分发后的单个类型
  - 如果原始类型 `U` 不能赋值给当前类型 `T` 的数组形式 → 存在多个类型 → 是联合类型

```ts
[U] extends [T] ? false : true
```

### 解答

```ts
type IsUnion<T, U = T> = 
  [T] extends [never]    // 处理 never 特殊情况
    ? false 
    : T extends any      // 触发联合类型分发
      ? [U] extends [T]  // 判断是否为单一类型
        ? false          // 是单一类型
        : true           // 是联合类型
      : never;
```

## 第二十九题 ReplaceKeys

### 问题

实现一个泛型类型 `ReplaceKeys<U, T, Y>`，将联合类型 `U` 中的指定键 `T` 替换为 `Y` 中对应类

型，若原类型不存在该键或 `Y` 未提供对应类型则设为 `never`

例子:

```ts
type NodeA = {
  type: "A"
  name: string
  flag: number
}

type NodeB = {
  type: "B"
  id: number
  flag: number
}

type NodeC = {
  type: "C"
  name: string
  flag: number
}

type Nodes = NodeA | NodeB | NodeC

type ReplacedNodes = ReplaceKeys<
  Nodes,
  "name" | "flag",
  { name: number; flag: string }
> // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.

type ReplacedNotExistKeys = ReplaceKeys<Nodes, "name", { aa: number }> // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never
```

### 思路

1. **分布式条件处理**

```ts
U extends any ? ... : never
```
  - 触发分布式条件类型，将联合类型 `U` 拆分为独立成员处理

2. **键替换逻辑**

```ts
[K in keyof U]: K extends T ? (K extends keyof Y ? Y[K] : never) : U[K]
```

 - 键存在且需替换：

    - 检查 `Y` 是否存在该键 → 存在则使用 Y[K]

    - 不存在则设为 `never`

 - 无需替换的键：保留原始类型 U[K]

### 解答

```ts
type ReplaceKeys<U, T, Y> = U extends any 
  ? {
      [K in keyof U]: K extends T 
        ? K extends keyof Y 
          ? Y[K] 
          : never
        : U[K]
    }
  : never;
```

## 第三十题 Remove Index Signature

### 问题

实现 `RemoveIndexSignature<T>` ，从对象类型中排除索引签名

例子:

```ts
type Foo = {
  [key: string]: any
  foo(): void
}

type A = RemoveIndexSignature<Foo> // expected { foo(): void }
```

### 思路

```ts
K extends `${infer _}`：
```

 - 利用模板字符串类型判断 `K` 是否是字符串字面量类型。
   - 如果 `K` 是字面量类型（例如 `"foo"`），则保留该键。
   - 如果 `K` 是索引签名（例如 `[key: string]`），则被剔除。

### 解答

```ts
type RemoveIndexSignature<T> = {
    [K in keyof T as K extends `${infer _}` ? K : never ]: T[K]
}
```

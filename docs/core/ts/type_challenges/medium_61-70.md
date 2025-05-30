# medium 类61-70题

## 第六十一题 Join

### 问题

实现 `Array.join` 的类型版本，`Join<T, U>` 接受一个数组 `T`、字符串或数字 `U`，并返回用

 `U` 拼接起来的数组 `T`

```ts
type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'
type Res3 = Join<["o"], "u">; // expected to be 'o'
```

### 思路

1. **限定输入类型**  

   - 要求 `T` 是字符串或数字的数组：`T extends Array<string | number>`  

   - 要求分隔符 `U` 是字符串或数字：`U extends string | number`  

2. **处理边界情况**  

   - 空数组 `[]` 时，结果是空字符串 `""`  

   - 单元素数组 `[X]` 时，结果就是该元素本身（用模板字面量 `${X}` 转为字符串）  

3. **递归拼接**  

   - 如果是至少两个元素 `[First, ...Rest]`，先把 `First` 转为字符串，再加上分隔符，
   
     再递归地对 `Rest` 调用 `Join`  

4. **模板字面量完成拼接**  

   - 利用 TypeScript 的模板字符串 `${…}`，将数字/字符串自动转为字符串并拼接  
  
### 解答

```ts
type Join<
  T extends Array<string | number>,
  U extends string | number
> =
  // 1. 空数组 => ""
  T extends []
    ? ""
    // 2. 单元素数组 => 直接返回该元素的字符串形式
    : T extends [infer F extends string | number]
      ? `${F}`
      // 3. 多元素数组 => First + 分隔符 + 递归拼接剩余
      : T extends [infer F extends string | number, ...infer Rest extends Array<string | number>]
        ? `${F}${U}${Join<Rest, U>}`
        // （按理不会走到这里，兜底返回 string）
        : string;
```

## 第六十二题 LastIndexOf

### 问题

实现类型版本的 ```Array.lastIndexOf```, ```LastIndexOf<T, U>```  接受数组 ```T```, any 类型 ```U```, 如果 ```U``` 存在于 ```T``` 中, 返回 ```U``` 在数组 ```T``` 中最后一个位置的索引, 不存在则返回 ```-1```

例子:

```typescript
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

### 思路

1. **维护两个“累积器”**  

   - `I` 用来记录当前已经“走过”了多少个元素（我们用它的长度来当作索引）  

   - `Last` 用来记录到目前为止，最后一次匹配到目标 `U` 时的索引（初始设为 `-1`，表示还没匹配到）  

2. **递归遍历数组**  
   - 如果数组形如 `[Head, ...Tail]`：  

     - 计算当前索引：就是 `I['length']`。  

     - 判断 `Head` 和 `U` 是否“相等”（用 `[Head] extends [U] ? [U] extends [Head] ? ...` 的写法保证严格同质匹配）  

       - 如果相等，就把 `Last` 更新为当前索引  

       - 否则保留原来的 `Last`  

     - 然后递归调用 `LastIndexOf`，把 `Tail` 传进去，同时把 `I` 增长一位（`[...I, any]`），`Last` 带着最新的“最后匹配位置”继续往下走。  

   - 当数组为空 `[]` 时，直接把最终的 `Last` （可能是某个 ≥ 0 的数字，也可能依然是 `-1`）返回。

### 解答

```ts
type LastIndexOf<
  T extends readonly any[],      // 输入数组
  U,                              // 要找的元素
  I extends any[] = [],           // 索引计数器（长度代表当前索引）
  Last extends number = -1        // 最后一次匹配到 U 时的索引，初始为 -1
> =
  T extends [infer Head, ...infer Tail]
    // 先判断 Head 和 U 是否严格相等
    ? [Head] extends [U]
        ? [U] extends [Head]
          // 相等：更新 Last 为 当前索引 I['length']
          ? LastIndexOf<Tail, U, [...I, any], I['length']>
          // 不相等（不会走到这里，兜底）
          : LastIndexOf<Tail, U, [...I, any], Last>
        // Head 不等于 U：Last 不变，继续下一个
        : LastIndexOf<Tail, U, [...I, any], Last>
    // 数组遍历完，返回最后一次匹配到的索引（或 -1）
    : Last;
```

## 第六十三题 

### 问题

实现类型版本的 `Lodash.uniq` 方法, `Unique<T>` 接收数组类型 `T`, 返回去重后的数组类型.

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
```

### 思路

1. **定义一个辅助类型 `Includes<T, U>` 来判断类型数组中是否已经包含某个类型**

   - 关键工具类型：`Equal<A, B>`: 判断两个类型是否相等

      ```ts
      type Equal<A, B> =
        (<T>() => T extends A ? 1 : 2) extends
        (<T>() => T extends B ? 1 : 2)
          ? true
          : false;
      ```
      > 利用函数的逆变特性来判断类型是否完全一致。

2. **使用递归遍历整个元组 `T`**

3. **通过 `Includes` 判断当前元素是否已存在于结果数组中**

   - 存在：跳过

   - 不存在：加入结果数组

4. **最终得到不含重复元素的新数组**

### 解答

```ts
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Includes<T extends readonly unknown[], U> =
  T extends [infer First, ...infer Rest]
    ? Equal<First, U> extends true
      ? true
      : Includes<Rest, U>
    : false;

type Unique<T extends unknown[], R extends unknown[] = []> =
  T extends [infer First, ...infer Rest]
    ? Includes<R, First> extends true
      ? Unique<Rest, R>
      : Unique<Rest, [...R, First]>
    : R;
```

## 第六十四题 MapTypes

### 问题

实现 `MapTypes<T, R>` ，将对象 `T` 中的类型转换为由类型 `R` 定义的不同类型，其结构如下

```ts
type StringToNumber = {
  mapFrom: string; // 键的值，其值为字符串
  mapTo: number; // 将转换为数字
}
```

例子:

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string}, StringToNumber> // gives { iWillBeANumberOneDay: number; }
```

请注意，用户可以提供类型的联合:

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
type StringToDate = { mapFrom: string; mapTo: Date;}
MapTypes<{iWillBeNumberOrDate: string}, StringToDate | StringToNumber> // gives { iWillBeNumberOrDate: number | Date; }
```

如果该类型在我们的映射中不存在，则保留原样:

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string, iWillStayTheSame: Function}, StringToNumber> // // gives { iWillBeANumberOneDay: number, iWillStayTheSame: Function }
```

### 思路

1. **遍历对象属性：**

   使用 `Mapped Types` 遍历 `T` 的键。

2. **匹配映射：**

   对每个属性的值类型 `T[K]`，判断它是否匹配 `R` 中任意一个 `mapFrom`。

3. **检查是否存在匹配项**

   `[... ] extends [never]`：利用 `tuple` 包装避免联合分布行为，从而判断是否有匹配项。

4. **从联合中提取匹配项：**

   通过 `Extract` + `infer` 提取所有满足 `mapFrom` 类型为 `T[K]` 的 `R` 成员。

5. **生成新类型：**

   将提取出的映射中的 `mapTo` 属性组成新类型。

### 解答

```ts
type MapTypes<T, R extends { mapFrom: any; mapTo: any }> = {
  [K in keyof T]:
    [Extract<R, { mapFrom: T[K] }>] extends [never] // 检查是否存在匹配项
      ? T[K]                                        // 如果没有匹配，则保留原类型
      : Extract<R, { mapFrom: T[K] }> extends { mapTo: infer To }
        ? To                                        // 提取匹配映射的 mapTo 类型
        : T[K];                                     // 安全兜底（理论上不会触发）
};
```

## 第六十五题

### 问题

构造一个给定长度的元组。

例如

```ts
type result = ConstructTuple<2> // 期望得到 [unknown, unkonwn]
```

### 思路

- 用一个辅助参数（通常叫做 `Result` 或 `R`）表示已经构建的元组。

- 每次递归给 `Result` 追加一个 `unknown`。

- 当 `Result` 的长度等于目标数字 `L` 时停止递归。

### 解答

```ts
type ConstructTuple<
  L extends number,
  R extends unknown[] = []
> = R['length'] extends L ? R : ConstructTuple<L, [...R, unknown]>;
```

## 第六十六题 Number Range

### 问题

有时我们想限制数字的范围...例如

```ts
type result = NumberRange<2 , 9> //  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 
```

### 思路

**`Enumerate<T>` 的含义：**

```ts
Enumerate<5> -> 0 | 1 | 2 | 3 | 4
```

- 它构造了从 `0` 到 `T - 1` 的联合类型；

- 用数组的 `length` 模拟递增，构建出 `R['length']`。

**`NumberRange<F, T>` 的关键在于：**

```ts
Exclude<Enumerate<T>, Enumerate<F>> | T
```

- `Exclude<0 | 1 | 2 | 3 | 4, 0 | 1>` → `2 | 3 | 4`

- 再加上 `T` 本身 → `2 | 3 | 4 | 5`

---

### 解答

```ts
type Enumerate<N extends number, Acc extends number[] = []> =
  Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;

type NumberRange<F extends number, T extends number> =
  Exclude<Enumerate<T>, Enumerate<F>> | T;
```

## 第六十七题 Combination

### 问题

给定一个字符串数组，进行排列组合。它对于视频等 prop 类型也很有用 [controlsList](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList)

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>
```

### 思路

1. `Combination<T, U>` 的核心在于：

   - `T extends any ? … : never` 让 TypeScript 对联合类型 `T` 自动做分发（distributive）。

   - 基本分支包括两种可能：

     - 只选当前项：`T`

     - 选当前项 + 剩余项的组合：`${T} ${Combination<Exclude<U, T>>}`

2. 第二个泛型 U 始终保持原始的全集合，不动；每次递归都用 `Exclude<U, T>` 去掉已经选过的

   那一项，避免重复或无限递归。

### 解答

```ts
type Combination<T extends string, U extends string = T> = T extends any
  ? T | `${T} ${Combination<Exclude<U, T>>}`
  : never;

type CombinationArr<T extends string[]> = Combination<T[number]>
```

## 第六十八题 Subsequence

### 问题

给定一个包含唯一元素的数组，返回所有可能的子序列。

子序列是指通过删除部分元素或不删除元素而不改变剩余元素顺序，可以从数组中导出的序列。

例如:

```ts
type A = Subsequence<[1, 2]> // [] | [1] | [2] | [1, 2]
```

### 思路

  对于一个数组 `T`，如果它的形式是 `[H, ...Rest]`，那么所有的子序列要么包含 `H`，要么不包含 `H`。
  - **不包含 `H`** 的子序列就是 `Subsequence<Rest>`  

  - **包含 `H`** 的子序列就是把 `H` 拼在 `Subsequence<Rest>` 得到的每一个序列前面  

  当 `T` 为空时，唯一的子序列就是空元组 `[]`。

  - `T extends [infer H, ...infer Rest]`：拆出头部 `H` 和剩余 `Rest`  

  - 递归式写成 `Subsequence<Rest> | Prepend<H, Subsequence<Rest>>`，前者是不选头部、后者是选头部 

  - 利用 TypeScript 对联合类型的 **分发式条件类型**，保证每一步都能把所有分支都枚举到 
   
  - 终止时 `T` 为空数组，就只返回空元组 `[]`  

### 解答

```ts
type Prepend<H, L> = L extends unknown[]
  ? [H, ...L]
  : never;

type Subsequence<T extends unknown[]> = T extends [infer F, ...infer Rest]
  ? (Subsequence<Rest> | Prepend<F, Subsequence<Rest>>)
  : []
```

## 第六十九题 CheckRepeatedChars

### 问题

判断一个string类型中是否有相同的字符

```ts
type CheckRepeatedChars<'abc'>   // false
type CheckRepeatedChars<'aba'>   // true
```

### 思路

1. **拆分首字符**  
   用 `S extends \`\${infer First}\${infer Rest}\`` 把字符串 `S` 的第一个字符提取到 
   
   `First`，剩余的子串放到 `Rest`。  

2. **检查剩余子串中是否含有 `First`**  
   再用模式匹配 `Rest extends \`\${string}\${First}\${string}\``：  

   - 如果匹配成功，说明 `First` 在 `Rest` 里出现过一次或多次，直接返回 `true`。

   - 如果不匹配，就对 `Rest` 继续递归判断，看下一个字符在剩余子串里是否重复。  

3. **终止条件**  
   当 `S` 为空串或只有一个字符时（即无法再拆分出 `First` 和 `Rest`），说明已经遍历完所有字
   
   符，都没发现重复，返回 `false`。

### 解答

```ts
type CheckRepeatedChars<S extends string> =
  // 如果能拆成 First + Rest，就继续下面的逻辑
  S extends `${infer First}${infer Rest}`
    ? // 如果 Rest 中能匹配到 First （即出现过），就算重复
      Rest extends `${string}${First}${string}`
      ? true
      // 否则丢掉第一个字符，继续判断 Rest
      : CheckRepeatedChars<Rest>
    // 不能再拆（空串或单字符），说明没重复
    : false;
```

## 第七十题 FirstUniqueCharIndex

### 问题

给定一个字符串 s，找到其中第一个非重复字符并返回其索引。如果不存在，则返回 -1。(Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

例子:

```ts
type test1 = FirstUniqueCharIndex<'aaa'>            // expected `-1`
type test2 = FirstUniqueCharIndex<''>               // expected `-1`
type test3 = FirstUniqueCharIndex<'aabb'>           // expected `-1`
type test4 = FirstUniqueCharIndex<'loveleetcode'>  // expected `2`
type test5 = FirstUniqueCharIndex<'leetcode'>      // expected `0`
```

### 思路

1. 模式拆解  

   ```ts
   S extends `${infer F}${infer Rest}`
   ```

   - **F**：当前要检查的第一个字符。  

   - **Rest**：剩下的字符串。

2. 前缀检查  

   ```ts
   P extends `${string}${F}${string}`
   ```

   - `P` 存着我们已经“扫过”的前面所有字符。  

   - 如果 `P` 模式匹配出一个 `F`，说明当前这个 `F` 在之前出现过，**不可能**是唯一字符。

   - 此时递归地把它丢掉：  

     - 新的前缀变成 ```${P}${F}```（把它加进已扫过的那堆里），  

     - 索引 `Offset` 多加一位。

3. 后缀检查  

   ```ts
   Rest extends `${string}${F}${string}`
   ```

   - 如果 `F` 在 **后面** 也出现过，那么它也不是全局唯一。  

   - 处理逻辑同上：把它丢到 `P` 里，偏移量 +1，继续往下走。

4. 命中唯一  

   - 当上面两个判断都失败时，就意味着：
     1. `F` 不在前缀出现过，  
     2. `F` 不在后缀出现过。  

   - 这时 `F` 就是 **第一个全局唯一字符**，直接返回 `Offset['length']`，它正好是当前 `F`
   
     在原字符串中的下标。

5. 终止条件  

   ```ts
   : -1
   ```

   - 如果 `S` 是空串（没有 `F` 和 `Rest` 可以拆），说明**扫完整个串都没找到**唯一字符，返
   
     回 `-1`。


### 解答

```ts
type FirstUniqueCharIndex<
S extends string, // 剩余待检字符串
Prefix extends string = '',  // 已扫描过的前缀
Offset extends unknown[] = [] // 偏移量：也就是当前字符在原串里的索引
> = S extends `${infer F}${infer Rest}` // 1. 拆首字符 F 和剩余 Rest
  // —— 2. 前缀里出现过 F？ ——
  ? Prefix extends `${string}${F}${string}`
    // 如果前缀里有，说明 F 不是“全局唯一”，跳过它
    ? FirstUniqueCharIndex<Rest, `${Prefix}${F}`, [...Offset, unknown]>
    // —— 3. 后缀里出现过 F？ —— 
    : Rest extends `${string}${F}${string}`
      // 如果后缀里也有，F 仍然不是“全局唯一”，同样跳过
      ? FirstUniqueCharIndex<Rest, `${Prefix}${F}`, [...Offset, unknown]>
      // —— 4. 前后都没出现过 —— F 就是全局唯一 ——
      : Offset['length']
  // 5. S 走到空串了，也没找到，则无唯一字符
  : -1
```

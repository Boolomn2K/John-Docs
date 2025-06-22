# medium 类81-90题

## 第八十一题 Combination key type

### 问题

1. 把多个修饰键两两组合，但不可以出现相同的修饰键组合。

2. 提供的 `ModifierKeys` 中，前面的值比后面的值高，即 `cmd ctrl` 是可以的，但 `ctrl cmd` 是不允许的。

```ts
type ModifierKeys = ['cmd', 'ctrl', 'opt', 'fn']

type CaseTypeOne = 'cmd ctrl' | 'cmd opt' | 'cmd fn' | 'ctrl opt' | 'ctrl fn' | 'opt fn'

type Example = Combs<ModifierKeys>  // expected be CaseTypeOne
```

### 思路

1. **递归分解数组**

```ts
T extends [infer F, ...infer R]
```

  - 将数组 `T` 拆分为第一个元素 `F` 和剩余部分 `R`。

  - 为递归处理提供基础结构。

2. **组合当前元素与剩余元素**

```ts
`${F} ${R[number]}`
```

  - `R[number]` 代表剩下所有元素组成的联合类型。

  - 使用模板字符串类型将当前元素 `F` 与 `R` 中的每个元素组合，形成如 `'cmd ctrl'` 的格式。

  - 因为只和“后面”的元素组合，天然避免重复或逆序（如 `ctrl cmd`）。

3. **递归处理剩余元素**

```ts
| Combs<R>
```

  - 在当前组合生成后，继续递归处理剩余的数组 `R`。

  - 累积所有合法组合直到数组耗尽。

4. **递归终止条件**

```ts
: never
```

  - 当数组无法再拆（空数组或只剩一个元素）时终止。

  - 返回 `never`，意味着没有更多组合可以生成。


### 解答

```ts
type Combs<T extends string[] = ModifierKeys> = 
  T extends [infer F extends string, ...infer R extends string[]] 
    ? `${F} ${R[number]}` | Combs<R> 
    : never;
```

## 第八十二题 Permutations of Tuple

### 问题

给定一个泛型元组类型 `T extends unknown[]`，编写一个类型，以并集的形式生成 `T` 的所有排列

例如:

```ts
PermutationsOfTuple<[1, number, unknown]>
// Should return:
// | [1, number, unknown]
// | [1, unknown, number]
// | [number, 1, unknown]
// | [unknown, 1, number]
// | [number, unknown, 1]
// | [unknown, number ,1]
```

### 思路

1. **`Insert<T, U>`：将 U 插入元组 T 的所有可能位置**

- 插入规则：

  - 每次递归将 `U` 插入当前元素 `F` 和后续部分之间。

  - 不断向后推进，直到插入到末尾。

- 返回的是所有可能插入 `U` 的结果的联合类型。

例子：

```ts
Insert<[1, 2], 0> 
// => [0,1,2] | [1,0,2] | [1,2,0]
```

2. **`PermutationsOfTuple<T, R>`：递归构造排列**

- `T` 是剩余未处理的原始元组；

- `R` 是已经构造出来的部分；

- 每次从 `T` 拿出一个元素 `F`，然后将它插入 `R` 的所有可能位置；

- 将结果作为新一轮 `R` 传入下一次递归。

最终当 `T` 空时，返回 `R`，它已经包含了所有的插入排列结果。

**_示例演示_**

```ts
PermutationsOfTuple<[1, 2, 3]>
// 大致逻辑过程：
Step 1: Insert `1` into [] → [1]
Step 2: Insert `2` into [1] → [2,1] | [1,2]
Step 3: Insert `3` into [2,1] → [3,2,1] | [2,3,1] | [2,1,3]
// 同理 [1,2] → [3,1,2] | [1,3,2] | [1,2,3]
// 最终得到：6 个排列
```

> 只要你在泛型里传入联合类型做参数，TypeScript 会自动对每一项分发递归，无论是不是条件类型。

::: tip
这也是为什么只要你调用 `PermutationsOfTuple<L, A | B>`，
TypeScript 就会自动分发参数，即 `PermutationsOfTuple<L, A> | PermutationsOfTuple<L, B>`。
这是因为泛型传参本身就会分发，只要你传入的类型参数是联合类型，TypeScript 会自动对每一项做递归。
:::
### 解答

```ts
type Insert<
  T extends unknown[],
  U
> = 
  T extends [infer F, ...infer L]
    ? [F, U, ...L] | [F, ...Insert<L, U>] 
    : [U];

type PermutationsOfTuple<
  T extends unknown[],
  R extends unknown[] = []
> = 
  T extends [infer F, ...infer L]
    ? PermutationsOfTuple<L, Insert<R, F> | [F, ...R]>
    : R;
```

## 第八十三题 Replace First

### 问题

实现类型 `ReplaceFirst<T, S, R>` ，它将元组 `T` 中第一次出现的 `S` 替换为 `R`。如果 `T` 中不存在这样的 `S`，则结果应为 `T`

例子:

```ts
type Example1 = ReplaceFirst<[1, 2, 3], 3, 4> // expected [1, 2, 4]
type Example2 =  ReplaceFirst<['A', 'B', 'C'], 'C', 'D'> // expected ['A', 'B', 'D']
type Example3 =  ReplaceFirst<[true, true, true], true, false> // expected [false, true, true]>>,
type Example4 =  ReplaceFirst<[string, boolean, number], boolean, string> // expected [string, string, number]
type Example5 =  ReplaceFirst<[1, 'two', 3], string, 2> // expected [1, 2, 3]
type Example6 =  ReplaceFirst<['six', 'eight', 'ten'], 'eleven', 'twelve'> // expected ['six', 'eight', 'ten']
```

### 思路

1. **结构匹配解构**  

```ts
T extends [infer F, ...infer Rest]
```

这是将元组 `T` 拆分为**首元素** `F` 和**其余部分** `Rest`。

2. **判断是否匹配要替换的类型**

```ts
F extends S
```

如果当前元素 `F` 是要替换的类型 `S`，就执行替换。

3. **进行替换或递归**

 - 替换：

```ts
? [R, ...Rest]
```

即：一旦找到第一个匹配项，立即用 `R` 替换，保留后续 `Rest` 不变。

 - 继续递归：

```ts
: [F, ...ReplaceFirst<Rest, S, R>]
```

否则保留当前项 `F`，并对剩下的 `Rest` 继续处理。

4. **递归终止条件**

```ts
: T
```

当 `T` 是空数组（即递归到底），返回 `T` 本身。

### 解答

```ts
type ReplaceFirst<T extends readonly any[], S, R> = T extends [infer F, ...infer Rest]
  ? F extends S
    ?  [R, ...Rest]
    : [F, ...ReplaceFirst<Rest, S, R>] 
  : T
```

## 第八十四题 Transpose

### 问题

矩阵的转置是一种将矩阵沿对角线翻转的运算符；也就是说，它通过生成另一个矩阵来交换矩阵 A 的行和列索引，通常表示为 A<sup>T</sup>

```ts
type Matrix = Transpose <[[1]]>; // expected to be [[1]]
type Matrix1 = Transpose <[[1, 2], [3, 4]]>; // expected to be [[1, 3], [2, 4]]
type Matrix2 = Transpose <[[1, 2, 3], [4, 5, 6]]>; // expected to be [[1, 4], [2, 5], [3, 6]]
```

### 思路

::: tip
`keyof 数组` 实际上是什么？

当你对一个数组类型使用 `keyof`，TypeScript 会返回这个数组所有可能的键（索引），包括：

- 数字索引（作为字符串字面量）`'0' | '1' | ...`
- 以及数组的原型方法和属性，如 `'length' | 'push' | 'pop' | ...`

例子：

```ts
type A = [1, 2, 3];
type Keys = keyof A; 
// => "0" | "1" | "2" | "length" | "toString" | ...
```
所以 `keyof A` 包含字符串类型的数字索引，而不是 number 类型！
:::

::: tip
为什么你不用担心 `keyof` 中的干扰属性？

即使 `keyof` 数组包括像 `'length'`、`'push'` 这样的原型属性，你在做类型映射时一般**不会受到它们的影响**，原因如下：

| 原因 | 解释 |
|------|------|
| TypeScript 会智能识别元组的“索引部分” | 对元组使用 `keyof` 时，TS 知道 `"0" \| "1" \| ..."` 是元素索引，而不会把 `'length'` 当作成员位置 |
| 原型属性只是对象上的普通属性 | `'length'`、`'push'` 等虽然在 `keyof` 中存在，但它们不会出现在 `[X in keyof T]` 的映射中，除非你显式使用它们 |
| 推导目标是数组结构时会自动优化为元组 | 只要返回的结构规整（比如映射结果是一个数组），TS 会尽可能推导为元组，忽略非索引 key |

:::

::: tip
**只有当**：

1. 你使用的是一个元组（如 [1, 2]）

2. keyof 映射的是它的索引（"0" | "1"）

3. TypeScript 能推断每个 K 对应的类型

4. 你用映射类型返回一个规整的结构（比如对象或数组）

**TypeScript 才会把这个结果自动推导为 tuple，而不是对象**
:::

第一步：确定输出的维度

想做转置，就要把**原来的第 i 行第 j 列的值，变成结果的第 j 行第 i 列的值**。

换句话说：

```
Result[j][i] = M[i][j]
```

所以最终构造的应该是“按列索引”来遍历，而每一列是从多个行中提取出来的值。

第二步：提取列数

```ts
R = M['length'] extends 0 ? [] : M[0]
```

获取矩阵中每行的列索引：
- 如果是空矩阵，则返回空数组；
- 否则，取第一行 `M[0]`，其索引相当于“列索引”。

例如：
```ts
M = [[1, 2], [3, 4]]  // M[0] = [1, 2]，其索引是 '0', '1'
```

第三步：外层映射列索引，内层映射行为新的一行

```ts
{
  [X in keyof R]: {
    [Y in keyof M]: X extends keyof M[Y] ? M[Y][X] : never;
  }
}
```

这部分是核心：
- 外层 `[X in keyof R]` 遍历的是 **原矩阵的列索引**；
- 内层 `[Y in keyof M]` 遍历的是 **原矩阵的行索引**；
- 对于每一个 `(X, Y)`，用 `M[Y][X]` 取出了原矩阵第 `Y` 行第 `X` 列的值；
- 组合成新矩阵的第 `X` 行（对应原来的第 `X` 列）；


### 解答

```ts
type Transpose<
  M extends unknown[][],
  R = M['length'] extends 0 ? [] : M[0]
> = 
  R extends [infer F, ...infer Rest]
    ? {
        [X in keyof R]: {
          [Y in keyof M]: Y extends keyof R[X] ? M[Y][X] : never;
        }
      }
    : [];
```

## 第八十五题 JSON Schema to TypeScript

### 问题

实现泛型 `JSONSchema` 到 `TS`，它将返回与给定 `JSON` 模式对应的 `TypeScript` 类型。 需要处理的其他挑战：

- 附加属性
- oneOf, anyOf, allOf
- 最大长度和最小长度

```ts
type Type1 = JSONSchema2TS<{
  type: 'string'
}> // expected `string`

type Type4 = JSONSchema2TS<{
  type: 'string'
  enum: ['a', 'b', 'c']
}> // expected `'a' | 'b' | 'c'`

type Type6 = JSONSchema2TS<{
  type: 'object'
}> // expected `Record<string, unknown>`

type Type7 = JSONSchema2TS<{
  type: 'object'
  properties: {}
}> // expected `{}`

type Type8 = JSONSchema2TS<{
  type: 'object'
  properties: {
    a: {
      type: 'string'
    }
  }
}> // expected `{ a?: string }`

type Type9 = JSONSchema2TS<{
  type: 'array'
}> // expected `unknown[]`

type Type10 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'string'
  }
}> // expected `string[]`

type Type11 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'object'
  }
}> // expected `Record<string, unknown>[]`
```

### 思路

1. 基本类型`（string、number、boolean）`用一个映射表 `Primitives` 把 `JSON Schema` 的基本类型对应成 TypeScript 类型。

2. 枚举处理（enum）如果有 `enum` 字段，就优先用 `T['enum'][number]` 生成联合类型，比如 `'a' | 'b' | 'c'`。

3. 对象类型（object）如果定义了` properties`，就递归处理每个字段的类型。如果还有 `required` 字段，就把对应字段标记为必填，其它字段是可选。

4. 数组类型（array）如果指定了 `items`，就递归处理 `items` 的类型，最终生成 `T[]`；没指定就返回 `unknown[]`。

5. 类型分发核心逻辑最后在 `JSONSchema2TS` 里，根据 `type` 来判断是用哪个处理函数。

### 解答

```ts
type Primitives = {
  string: string;
  number: number;
  boolean: boolean;
};

type HandlePrimitives<T, Type extends keyof Primitives> = T extends {
  enum: unknown[];
}
  ? T['enum'][number]
  : Primitives[Type];

type HandleObject<T> = T extends {
  properties: infer Properties extends Record<string, unknown>;
}
  ? T extends { required: infer Required extends unknown[] }
    ? Omit<
        {
          [K in Required[number] & keyof Properties]: JSONSchema2TS<
            Properties[K]
          >;
        } & {
          [K in Exclude<keyof Properties, Required[number]>]?: JSONSchema2TS<
            Properties[K]
          >;
        },
        never
      >
    : {
        [K in keyof Properties]?: JSONSchema2TS<Properties[K]>;
      }
  : Record<string, unknown>;

type HandleArray<T> = T extends { items: infer Items }
  ? JSONSchema2TS<Items>[]
  : unknown[];

type JSONSchema2TS<T> = T extends { type: infer Type }
  ? Type extends keyof Primitives
    ? HandlePrimitives<T, Type>
    : Type extends 'object'
    ? HandleObject<T>
    : HandleArray<T>
  : never;
```

## 第八十六题 Square

### 问题

给定一个数字，你的类型应该返回它的平方

例子:

```ts
type Example1 = Square<0> // expected: 0
type Example2 = Square<1> // expected: 1
type Example3 = Square<3> // expected: 9
type Example4 = Square<20> // expected: 400
type Example5 = Square<100> // expected: 10000
type Example6 = Square<101> // expected: 10201

// Negative numbers
type Example7 = Square<-2> // expected: 4
type Example8 = Square<-5> // expected: 25
type Example9 = Square<-31> // expected: 961
type Example10 = Square<-50> // expected: 2500
```

### 思路

1. **处理负数**
   - 使用`Abs`类型获取数字的绝对值
   - 通过模板字符串类型判断是否为负数

2. **数字分解**
   - 定义数字0-9的联合类型`Digit`
   - 将数字分解为单个数字的数组（`SplitNumber`）
   - 使用递归和模板字符串类型逐位分解

3. **基础运算**
   - 通过数组长度表示数字（`Tuple`）
   - 实现数字相加（`AddDigits`）和进位处理（`Carry`）
   - 将分解后的数字数组相加X次实现乘法（`AddListXTimes`）

4. **结果重组**
   - 将运算后的数字数组重新组合为数字（`JoinNumber`）
   - 使用递归和模板字符串类型拼接数字

5. **平方计算**
   - 平方就是数字乘以自身（`Multiply<M, M>`）
   - 最终组合为`Square`类型

### 解答

```ts
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Tuple<Length extends Digit, Result extends unknown[] = []> = Result["length"] extends Length
    ? Result
    : Tuple<Length, [...Result, unknown]>;
type Carry<N> = N extends number
    ? `${N}` extends `${infer X extends Digit}${infer Y extends Digit}`
        ? [X, Y]
        : `${N}` extends `${infer X extends Digit}`
            ? [0, X]
            : never
    : never;
type AddDigits<N extends Digit, M extends Digit, C extends Digit = 0> = Carry<[...Tuple<N>, ...Tuple<M>, ...Tuple<C>]["length"]>;
type SplitNumber<N extends number | string> = `${N}` extends `${infer X extends Digit}${infer Y}`
    ? [X, ...SplitNumber<Y>]
    : `${N}` extends `${infer X extends Digit}`
        ? [X]
        : [];
type ParseInt<N extends string> = N extends `${infer X extends number}` ? X : never;
type JoinNumberHelper<N> = N extends [infer X extends Digit, ...infer XS extends Digit[]]
    ? `${X}${JoinNumberHelper<XS>}`
    : "";
type JoinNumber<N extends Digit[]> = ParseInt<JoinNumberHelper<N>>;
type PadList<L extends unknown[], N extends number, P = 0, I extends unknown[] = []> = I["length"] extends N
    ? L
    : L[I["length"]] extends undefined
        ? PadList<[P, ...L], N, P, [unknown, ...I]>
        : PadList<L, N, P, [unknown, ...I]>;
type DePadList<L extends unknown[], P = 0> = L extends [P, ...infer XS]
    ? DePadList<XS, P>
    : L;
type AddListsHelper<
    A extends number[],
    B extends number[],
    C extends Digit = 0,
    L = PadList<A, B["length"]>,
    R = PadList<B, A["length"]>
> = L extends [...infer XS extends number[], infer X extends Digit]
    ? R extends [...infer YS extends number[], infer Y extends Digit]
        ? AddDigits<X, Y, C> extends [infer ThisCarry extends Digit, infer ThisDigit extends Digit]
            ? [...AddListsHelper<XS, YS, ThisCarry>, ThisDigit]
            : []
        : []
    : [];
type AddLists<A extends number[], B extends number[]> = DePadList<AddListsHelper<[0, ...A], [0, ...B]>>;
type AddListXTimes<A extends number[], X extends number, O extends number[] = A, I extends unknown[] = [unknown]> = X extends 0
    ? [0]
    : I["length"] extends X
        ? A
        : AddListXTimes<AddLists<A, O>, X, O, [...I, unknown]>;
type Multiply<N extends number, M extends number> = JoinNumber<AddListXTimes<SplitNumber<N>, M>>;
type Abs<N extends number> = `${N}` extends `-${infer X extends number}` ? X : N;
type Square<N extends number, M extends number = Abs<N>> = Multiply<M, M>;
```

## 第八十七题 Triangular number

### 问题

给定一个数 `N`，求第 `N` 个三角数，即 `1 + 2 + 3 + ... + N`

例子:

```ts
type Example1 = Triangular<0> // expected 0
type Example2 = Triangular<1> // expected 1
type Example3 = Triangular<3> // expected 6
type Example4 = Triangular<10> // expected 55
type Example5 = Triangular<20> // expected 210
type Example6 = Triangular<55> // expected 1540
type Example7 = Triangular<100> // expected 5050
```

### 思路

**参数含义**

- `N`: 要求的第 N 个三角数。

- `Counter`: 当前计数器，用来表示第几个数（它的长度是当前递归到了第几个数字）。

- `Acc`: 累积数组，表示目前为止的和（通过累加元组长度实现）。

**核心机制**

每一步：

1. `Counter` 的长度就是当前正在加的那个数，比如 `[0, 0, 0]` 的长度就是 `3`，表示加到了 3。

2. `Acc` 是通过扩展为 `[...Acc, ...Counter, 0]` 来模拟加法：

我们每次往 `Acc` 里加入 `Counter.length + 1` 个元素（因为是 `[...Counter, 0]`），也就是模拟加上当前的数字。

3. 终止条件是 `Counter['length'] extends N`，即从 0 累加到了 N 为止。

4. 最终结果就是 `Acc['length']`，因为整个累加过程就是通过不断扩展数组来模拟数字的加法。

我们来一步步看看 `Triangular<3>` 是怎么展开的：

- 初始：`P = []`, `A = []`
- 第一步：`P = [0]`, `A = [...[], ...[], 0] = [0]`
- 第二步：`P = [0, 0]`, `A = [...[0], ...[0], 0] = [0, 0, 0]`
- 第三步：`P = [0, 0, 0]`, `A = [...[0, 0, 0], ...[0, 0], 0] = [0, 0, 0, 0, 0, 0]`
- 此时 `P.length === 3`，递归结束。
- 最终 `A.length = 6`，正是 `1 + 2 + 3 = 6` 

### 解答

```ts
type Triangular<
  N extends number,
  Counter extends number[] = [],
  Acc extends number[] = []
> = Counter['length'] extends N
  ? Acc['length']
  : Triangular<N, [...Counter, 0], [...Counter, ...Acc, 0]>
```

## 第八十八题 CartesianProduct

### 问题

给定 2 个集合（并集），返回其笛卡尔积的一组元组，例如 

```ts

type Example1 = CartesianProduct<1 | 2, 'a' | 'b'> // expected [2, 'a'] | [1, 'a'] | [2, 'b'] | [1, 'b']

type Example2 = CartesianProduct<1 | 2 | 3, 'a' | 'b' | 'c'> // expected [2, 'a'] | [1, 'a'] | [3, 'a'] | [2, 'b'] | [1, 'b'] | [3, 'b'] | [2, 'c'] | [1, 'c'] | [3, 'c']

type Example3 = CartesianProduct<1 | 2, 'a' | never> // expected [2, 'a'] | [1, 'a']

type Example4 = CartesianProduct<'a', Function | string> // expected ['a', Function] | ['a', string]
```

### 思路

**思路详解**

1. **利用联合类型的分发特性** 

   在 TypeScript 中，条件类型（如 `A extends A ? ... : ...`）在遇到联合类型时会
   
   对每个成员分别计算（即“分发”）。

2. **A extends A 触发分发**

   当 `A` 是联合类型（比如 `1 | 2`），`A extends A ? ... : ...` 实际上会被拆成两
   
   次计算：一次 `A=1`，一次 `A=2`。

3. **B extends B 再次分发**
   在每一次 A 的分发里，`B extends B ? [A, B] : never` 又会对 B 的每个联合成员
   
   再次分发。比如 `B = 'a' | 'b'`，则分别计算 `[A, 'a']` 和 `[A, 'b']`。

4. **最终效果**

   这种“双重分发”就会把每个 A 和每个 B 组合，得到所有 `[A, B]` 的可能组合，即笛卡尔积。

**举例说明**

以 `CartesianProduct<1 | 2, 'a' | 'b'>` 为例：

- 第一次分发，A=1 时，B 分发得 `[1, 'a']`、`[1, 'b']`
- A=2 时，B 分发得 `[2, 'a']`、`[2, 'b']`

所有结果合并为：`[1, 'a'] | [1, 'b'] | [2, 'a'] | [2, 'b']`

**总结**
- 条件类型的分发性让我们可以实现组合所有联合类型成员的“笛卡尔积”。
- 这种写法在 TypeScript 类型体操中非常常用，适合生成所有可能的组合类型。

### 解答

```ts
type CartesianProduct<T, U> = T extends T
  ? U extends U
    ? [T, U]
    : never
  : never
```

## 第八十九题 MergeAll

### 问题

将可变数量的类型合并为一个新类型。如果键重叠，则其值应合并为一个并集。

例如: 

```ts
type Foo = { a: 1; b: 2 }
type Bar = { a: 2 }
type Baz = { c: 3 }

type Result = MergeAll<[Foo, Bar, Baz]> // expected to be { a: 1 | 2; b: 2; c: 3 }
```

### 思路

[思路来源](https://github.com/type-challenges/type-challenges/issues/29394)

1. `XS[number]`。如果你使用 `arrayOrTuple[number]`，结果将是所有元素的联合类型。因此，对于 `[1, 2, 3][number]`，它将是 `1 | 2 | 3`。

2. `U extends U ? ... : never` 用于分发联合类型，对联合类型的每个单独元素应用某个操作，然后获取这些操作结果的联合类型。

3. `PropertyKey` 是一个内置类型，等同于 `string | number | symbol`。它表示在 TypeScript 中可以作为对象有效属性键的所有类型。

4. `U[K & keyof U]` 主要是为了在索引类型 `U` 时保证类型安全。在 `MergeAll` 类型中，`K` 表示 `XS` 数组中所有类型的可能键的联合类型，而 `U` 是 `XS` 中所有类型的联合类型。

5. 由于 `K` 是键的联合，可能并非所有键都存在于 `U` 中的每个类型里，使用 `K & keyof U` 可以将 `K` 限制为仅在 `U` 中实际存在的键。这样一来，我们就可以安全地索引 `U` 而不会引发类型错误。本质上，这是一种更精确的 `U[K]` 写法，用于满足 TypeScript 编译器严格的类型检查要求。

### 解答

```ts
type MergeAll<
  XS extends object[],
  U = XS[number],
  Keys extends PropertyKey = U extends U ? keyof U : never
> = {
  [K in Keys]: U extends U ? U[K & keyof U] : never
}
```

## 第九十题 CheckRepeatedTuple

### 问题

判断一个元组类型中是否有相同的成员

For example:

```ts
type CheckRepeatedTuple<[1, 2, 3]>   // false
type CheckRepeatedTuple<[1, 2, 1]>   // true
```

### 思路

- 递归拆分：将元组 `T` 拆为 `[F, ...Rest]`，若无法拆分（长度 ≤ 1），返回 `false`。
- 对比剩余：使用 `Rest[number]` 获取剩余元素的联合类型，借助 `Equal<F, Rest[number]>` 判断 `F` 是否在其中：
  - 若相等，说明存在重复，返回 `true`；
  - 否则递归调用 `CheckRepeatedTuple<Rest>`。
- `Equal<A, B>` 通过函数返回类型对比，确保在类型层面进行严格相等判断。

示例：
```ts
// false，因为没有重复元素
type A = CheckRepeatedTuple<[1, 2, 3]>;
// true，因为 1 在剩余部分 [2, 1] 中出现
type B = CheckRepeatedTuple<[1, 2, 1]>;

### 解答

```ts
type Equal<A, B> = (<G>() => G extends A ? 1 : 2) extends (<G>() => G extends B ? 1 : 2) ? true : false

type CheckRepeatedTuple<T extends readonly any[]> = T extends [infer F, ...infer Rest]
  ? Equal<F, Rest[number]> extends true
    ? true
    : CheckRepeatedTuple<Rest>
  : false
```

# medium 类51-60题

## 第五十一题 AllCombinations

### 问题

实现类型 `AllCombinations<S>`，返回最多使用 `S` 中的字符一次的字符串的所有组合。

例如:

```ts
type AllCombinations_ABC = AllCombinations<'ABC'>;
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

### 思路

1. 字符串转 `union` 类型字符：将 `'ABC'` 转为 `'A' | 'B' | 'C'`。

    ```ts
    type StringToUnion<S extends string> =
      S extends `${infer First}${infer Rest}`
        ? First | StringToUnion<Rest>
        : never;
    ```

2. 从 `union` 中递归构造所有组合：使用递归+模板字面量类型组合字符，并在每层递归中移除

   已使用字符，避免重复。

   ```ts
   type AllCombinations<
     S extends string,
     U extends string = StringToUnion<S>
   > =
      '' |{[K in U]: `${K}${AllCombinations<never, Exclude<U, K>> }`}[U];
   ```

3. 拼接和递归：组合是从一个字符开始，后续递归将剩下的字符拼接上去。

### 解答

```ts
type StringToUnion<S extends string> = S extends `${infer F}${infer R}`
    ? F | StringToUnion<R>
    : never

type AllCombinations<
    S extends string,
    U extends string = StringToUnion<S>
> = '' | { [K in U]: `${K}${AllCombinations<never ,Exclude<U, K>>}` }[U]
```

## 第五十二题 Greater Than

### 问题

在这个挑战中，你应该实现一个 `GreaterThan<T, U>` 类型，比如 `T > U`

负数不需要考虑。

例子:

```ts
GreaterThan<2, 1> //should be true
GreaterThan<1, 1> //should be false
GreaterThan<10, 100> //should be false
GreaterThan<111, 11> //should be true
```

### 思路

**核心思路**: 使用构造数组的长度来代表数字大小，通过递归比较 `T` 和 `U` 哪个先“耗尽”。

1. 从 `[]` 开始构造一个数组；

2. 每一层递归都 `Push<unknown>` 一个元素；

3. 判断当前数组长度是否等于 `T` 或 `U`；

   - 如果等于 `T`，但还没等于 `U`，说明 `U` 更大；

   - 如果等于 `U`，但还没等于 `T`，说明 `T` 更大。

### 解答

```ts
type GreaterThan<T extends number, U extends number, A extends unknown[] = []> =
    T extends U
        ? false
        : A['length'] extends T
            ? false
            : A ['length'] extends U 
                ? true
                : GreaterThan<T, U, [...A, unknown]>
```

## 第五十三题 Zip

### 问题

在这个挑战中，你应该实现一个类型 `Zip<T, U>`，`T` 和 `U` 必须是 `Tuple`

```ts
type exp = Zip<[1, 2], [true, false]> // expected to be [[1, true], [2, false]]
```

### 思路

1. 利用 `TypeScript` 的条件类型和模式匹配来解构两个元组；

2. 每次从 `T` 和 `U` 中取出首个元素 `THead` 和 `UHead`，配对成 `[THead, UHead]`；

3. 然后递归地继续处理剩余部分 `TTail` 和 `UTail`；

4. 当任一元组为空时，递归结束。

### 解答

```ts
type Zip<
  T extends readonly any[],
  U extends readonly any[]
> = T extends [infer THead, ...infer TTail]
    ? U extends [infer UHead, ...infer UTail]
        ? [[THead, UHead], ...Zip<TTail, UTail>]
        : []
    : []
```

## 第五十四题 IsTuple

### 问题

实现一个类型 `IsTuple`，它接受一个输入类型 `T`，并返回 `T` 是否为元组类型

例子:

```ts
type case1 = IsTuple<[number]> // true
type case2 = IsTuple<readonly [number]> // true
type case3 = IsTuple<number[]> // false
```

### 思路

1. **元组 vs 数组的区别：**

元组的 `.length` 是具体的字面量（比如 `2`），而数组的 `.length` 是 `number`

所以：`T extends { length: infer L }`，再判断 `L extends number` 是否为 `number` 本身。

2. **判断 `T` 是否是数组或元组：**

使用 `T extends readonly any[]` 过滤出数组类（包括元组）类型。

3. 最终判断是否是元组：

若 T 是数组类类型，并且它的 `.length` 不是 `number`（而是具体数值或 `readonly` 属性下的值），则是元组。

### 解答

```ts
type IsTuple<T> = T extends readonly any[]
    ? number extends T['length']
        ? false
        : true
    : false
```

## 第五十五题 Chunk

### 问题

你知道 `lodash` `吗？Chunk` 是其中非常有用的函数，现在让我们来实现它。`Chunk<T, N>` 接受两

个必需的类型参数：`T` 必须是元组，`N` 必须是大于等于 `1` 的整数。

```ts
type exp1 = Chunk<[1, 2, 3], 2> // expected to be [[1, 2], [3]]
type exp2 = Chunk<[1, 2, 3], 4> // expected to be [[1, 2, 3]]
type exp3 = Chunk<[1, 2, 3], 1> // expected to be [[1], [2], [3]]
```

### 思路

1. **递归处理整个元组**
我们必须一次处理掉 `T` 的前几个元素（最多 `N` 个），然后递归处理剩下的。

2. **辅助收集当前小块**
由于我们要一边“走”一边“收集”，我们使用一个 `Current` 类型参数来表示正在构建的子数组。

例如：
- 处理 `[1, 2, 3]`，N = 2
- 当前正在构建的是 `[1]`，继续加 `2` 得到 `[1, 2]`
- 长度到了，就把 `[1, 2]` 存入结果中，重新开始下一个块。

3. **结果集累积**
我们用 `Result` 类型参数来累积最终结果。

4. **用 `infer` 解构元组**
TypeScript 中可以用条件类型配合 `infer` 提取元组的第一个元素和剩余部分：

```ts
T extends [infer First, ...infer Rest]
```

5. **判断当前收集的块是否满了**

通过 `Current['length'] extends N` 判断当前块是否已满。

---

#### **类型实现拆解**

```ts
type Chunk<
  T extends unknown[],       // 原始数组
  N extends number,          // 每组大小
  Current extends unknown[] = [], // 当前构建中的子数组
  Result extends unknown[][] = [] // 最终结果数组
> =
```

**第一步：递归分解**
```ts
T extends [infer First, ...infer Rest] 
```
用 `infer` 把 `T` 拆成 `First` 和剩下的 `Rest`。

**第二步：判断是否构建完成一块**
```ts
? Current['length'] extends N
  // 块满了，把它放进 Result，然后开始构建下一个块
  ? Chunk<T, N, [], [...Result, Current]>
```

**注意**这里没有消费掉 `First`，因为我们只是把满了的 `Current` 推入 `Result`，还没加上新元素。

**第三步：继续填当前块**
```ts
: Chunk<Rest, N, [...Current, First], Result>
```

如果还没满，那就把 `First` 放入 `Current`，继续处理 `Rest`。

**第四步：终止条件**
```ts
: Current extends [] 
  ? Result 
  : [...Result, Current];
```

当 `T` 为空了，说明没东西可处理了。如果 `Current` 还有东西（可能未满），要记得放入 `Result`。


### 解答

```ts
type Chunk<
  T extends unknown[], 
  N extends number, 
  Current extends unknown[] = [], 
  Result extends unknown[][] = []
> =T extends [infer First, ...infer Rest]
    ? Current['length'] extends N
      // 当前块已满，加入结果数组，重启 Current
      ? Chunk<T, N, [], [...Result, Current]>
      // 当前块未满，继续添加
      : Chunk<Rest, N, [...Current, First], Result>
    : Current extends [] 
      ? Result
      : [...Result, Current];
```

## 第五十六题 Fill

### 问题

`Fill`，一个常见的 JavaScript 函数，现在让我们用类型来实现它。`Fill<T, N, Start?, End?>`，

可以看到，`Fill` 接受四种类型的参数，其中 `T` 和 `N` 是必需参数，`Start` 和 `End` 是可选参

数。这些参数的要求是：`T` 必须是元组，`N` 可以是任何类型的值，`Start` 和 `End` 必须是大于等

于 `0` 的整数。

```ts
type exp = Fill<[1, 2, 3], 0> // expected to be [0, 0, 0]
```

为了模拟真实功能，测试可能包含一些边界条件，希望您喜欢

### 思路

**参数解析**

| 参数名     | 描述                                                                 |
|------------|----------------------------------------------------------------------|
| `T`        | 输入元组                                                             |
| `N`        | 要填充的新值                                                         |
| `Start`    | 起始填充索引，默认为 0                                               |
| `End`      | 结束填充索引（不包含 End 本身），默认值为元组长度                   |
| `Count`    | 模拟索引计数器，用空数组实现，`Count['length']` 表示当前索引        |
| `Flag`     | 填充状态标志，当到达 Start 时变为 `true`，控制是否进行替换         |

---

**类型逻辑流程详解**

一、终止条件判断

```ts
Count['length'] extends End ? T
```

- 当索引达到或超过 `End`，填充结束。
- 直接返回剩余未处理的元组部分。

二、元组结构解构

```ts
T extends [infer R, ...infer U]
```

- 使用 `infer` 将当前元组 `T` 拆成头元素 `R` 和尾元素 `U`。

三、判断是否替换元素

情况 A：尚未达到 Start

```ts
Flag extends false ? [R, ...Fill<U, N, Start, End, [...Count, 0]>]
```

- 保留当前元素 `R`；
- 继续处理剩余元组 `U`；
- `Count` 增加一个元素，表示索引前进。
- 不显式传入 `Flag`，下一次将自动重新判断是否进入替换阶段。

情况 B：已经开始替换

```ts
: [N, ...Fill<U, N, Start, End, [...Count, 0], Flag>]
```

- 将当前元素替换为 `N`；
- 继续处理剩余元组；
- 显式传入 `Flag = true`，保持当前为替换状态，防止自动回退为 `false`。

四、处理空数组情况

```ts
: T
```

- 当元组为空时，终止递归，返回空数组。

---

**示例分析**

```ts
type Result = Fill<[1, 2, 3, 4], 0, 1, 3>;
```

目标是将索引 1 到 2（不含 3）之间的元素替换为 0。

| 步骤 | 当前 T       | Count            | 是否替换 | 结果元素 |
|------|--------------|------------------|----------|-----------|
| 1    | [1, 2, 3, 4] | []               | 否       | 1         |
| 2    | [2, 3, 4]    | [0]              | 是       | 0         |
| 3    | [3, 4]       | [0, 0]           | 是       | 0         |
| 4    | [4]          | [0, 0, 0]        | 否（已到 End） | 4     |

最终结果：

```ts
[1, 0, 0, 4]
```

### 解答

```ts
type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
  Count extends any[] = [],
  Flag extends boolean = Count['length'] extends Start ? true : false
> = Count['length'] extends End
      ? T
      : T extends [infer R, ...infer U]
        ? Flag extends false
          ? [R, ...Fill<U, N, Start, End, [...Count, 0]>]
          : [N, ...Fill<U, N, Start, End, [...Count, 0], Flag>]
        : T;
```

## 第五十七题 Trim Right

### 问题

实现 `TrimRight<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串结尾的空白字符串。

例如

```ts
type Trimed = TrimRight<'  Hello World  '> // 应推导出 '  Hello World'
```

### 思路

1.检查字符串 `T` 是否以空白字符结尾。

2.如果是，则去掉这个空白字符，并对剩下的字符串再次调用 `TrimRight`。

3.如果不是，则返回字符串本身。

首先我们定义哪些字符算是“空白字符”（Whitespace）：
```ts
type WhiteSpace = ' ' | '\n' | '\t'
```

然后我们用条件类型和模板字符串类型进行递归匹配。

### 解答

```ts
type WhiteSpace = ' ' | '\n' | '\t'
type TrimRight<T extends string> = T extends `${infer R}${WhiteSpace}`
   ? TrimRight<R>
   : T
```

## 第五十八题 去除数组指定元素

### 问题

实现一个像 Lodash.without 函数一样的泛型 `Without<T, U>`，它接收数组类型的 `T` 和数字或数组类型的 `U` 为参数，会返回一个去除 `U` 中元素的数组 `T`。

例如：

```ts
type Res = Without<[1, 2], 1>; // expected to be [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]>; // expected to be [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>; // expected to be []
```

### 思路

1. **统一把 `U` 转成「要剔除的值的联合类型」**  
   ```ts
   // 如果传入的是数组，就取它的元素联合；否则把单个值当成 1 元素数组
   type ExcludeItem<U> = U extends any[] ? U[number] : U
   ```
2. **递归遍历 `T`**  
   - 如果当前头元素 `F` 属于 `ExcludeItem<U>`，就跳过它  
   - 否则把它保留下来

### 解答

```ts
// 1. 把 U 标准化成要排除的「值联合」
type ExcludeItem<U> = U extends any[] ? U[number] : U

// 2. 递归版 Without
type Without<
  T extends any[],
  U
> = T extends [infer F, ...infer R]
      // F 属于要排除的联合？是 → 不要 F，继续递归；否 → 留下 F
      ? F extends ExcludeItem<U>
        ? Without<R, U>
        : [F, ...Without<R, U>]
      : []  // 递归终止：空数组
```

## 第五十九题 Trunc

### 问题

实现 `Math.trunc` 的类型版本，它接受字符串或数字，并通过删除任何小数位来返回数字的整数部分

例如:

```typescript
type A = Trunc<12.34> // 12
```

### 思路

1. **统一转为字符串进行处理**  

   利用模板字符串类型 `${T}`，无论传入的是 `number` 还是 `string`，都转成字符串来操作。

2. **第一步尝试截断小数部分**  

   匹配格式 `${infer I}.${string}`，取得小数点前的整数部分 `I`。  

   然后通过 `I extends number` 来确保截取到的是合法的数字字面量。

3. **如果没有小数点，尝试整体解析为数字字面量**  

   若第一步失败（说明没有小数点），再次尝试整体匹配 `${infer N extends number}`。 

   若匹配成功则返回该整数字面量。

4. **返回值类型**  

   返回的都是数字字面量类型，如 `12`、`0`、`-42`，不会是字符串。

5. **注意事项**  

   TypeScript 中 `-0` 和 `0` 是等价的，最终类型都视为 `0`。  

   不做非法数值字符串校验（如 `'12.3abc'` 会被解析为 `12`）。

### 解答

```ts
type Trunc<T extends number | string> =
  // 1) 如果有小数点，就把小数点后面都丢掉
  `${T}` extends `${infer I extends number}.${string}` 
    ? I
    // 2) 否则，直接把整个字符串/数字解析成数字字面量
    : `${T}` extends `${infer N extends number}` 
      ? N 
      : never;
```

## 第六十题 IndexOf

### 问题

实现 `Array.indexOf` 的类型版本，`indexOf<T, U>` 接受一个数组 `T` 和任意 `U`，并返回数组 `T` 中第一个 `U` 的索引。

例子：

```ts
type Res = IndexOf<[1, 2, 3], 2>; // expected to be 1
type Res1 = IndexOf<[2,6, 3,8,4,1,7, 3,9], 3>; // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2>; // expected to be -1
```

### 思路

1. **递归遍历元组**  

   我们要一个一个地去看 `T` 的头部元素是不是 `U`，如果是，就返回当前的“序号”；
   
   如果不是，就继续看剩下的元素。

2. **记录当前索引**  

   在类型系统里没有变量可变，我们用一个辅助元组 `Acc` 来充当「计数器」：

   - 初始时 `Acc = []`（长度为 0）  
   - 每往下递归一步，就把 `Acc` 再“推入”一个元素（比如 `any`），这样 `Acc["length"]`
    就从 0 变 1，再变 2，以此类推。  

   当发现 `T[0]` 和 `U` 相等时，就返回 `Acc["length"]`。

3. **如果遍历完都没找到**  

   直接返回 `-1`。

4. **“相等”判断**  

   用下面这个经典的“同构条件类型”技巧，保证类型精确比较：

   ```ts
   type Equal<A, B> =
     (<X>() => X extends A ? 1 : 2) extends
     (<X>() => X extends B ? 1 : 2)
       ? true
       : false;
   ```

### 解答

```ts
// 1. 精确比较两个类型是否一模一样
type Equal<A, B> =
  (<X>() => X extends A ? 1 : 2) extends
  (<X>() => X extends B ? 1 : 2)
    ? true
    : false;

// 2. 主逻辑：T 是要查找的元组，U 是目标值，Acc 用来计数（初始为空元组）
type IndexOf<
  T extends any[],
  U,
  Acc extends any[] = []
> = T extends [infer First, ...infer Rest]
      // 如果 First 和 U 相等，就输出当前长度
      ? Equal<First, U> extends true
        ? Acc["length"]
        // 否则在 Acc 上再加一位，继续查 Rest
        : IndexOf<Rest, U, [...Acc, any]>
      // 空数组遍历完后还没找到，返回 -1
      : -1;
```

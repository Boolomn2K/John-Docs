# medium 类71-80题

## 第七十一题 Parse URL Params

### 问题

您需要实现一个类型级解析器来将 `URL` 参数字符串解析为 `Union`

例如：

```ts
type test1 = ParseUrlParams<':id'> // expected `id`
type test2 = ParseUrlParams<'posts/:id'> // expected `id`
type test3 = ParseUrlParams<'posts/:id/:user'> // expected `id | user`
```

### 思路

1. **整个字符串看成“前面任意字符 + `:参数名` + 剩余部分”**  

   我们想要的就是抓到所有以 `:` 开头的参数。例如对 `"posts/:id/:user"`，先抓到 `:id`，再
   
   去剩下的 `":user"` 中继续抓。

2. **使用 TypeScript 的模板字符串做“切分+提取”**  

   - 写成：  

     ```ts
     S extends `${any}:${infer Param}/${infer Rest}`
       ? // 先提取到一个 Param，然后把 Rest 继续交给自己去处理
     : S extends `${any}:${infer Param}`
       ? // 如果已经没有 `/`，那就提最后一个 Param
     : never
     ```

   - 这样，  

     - 如果匹配到 `${any}:${Param}/${Rest}`，说明路径里还有 “`:参数/后面还有东西`”，提取到第一个参数后，就递归去解析 `Rest`；  

     - 如果只剩下 `${any}:${Param}` 而没有 `/` 了，就把最后一个参数提取出来；  

     - 如果连 `:${Param}` 都没有，就返回 `never`（表示没再有参数了）。

3. **最终效果**  

   - 对 `":id"`，直接命中第二种分支，拿到 `"id"`。  

   - 对 `"posts/:id"`，同样是最后一个参数的情况，拿到 `"id"`。  

   - 对 `"posts/:id/:user"`，先拿到 `"id"`，再去处理 `":user"` 拿到 `"user"`，最后把它
   
     们合并成联合类型 `"id" | "user"`。


### 解答

```ts
type ParseUrlParams<S extends string> =
  S extends `${any}:${infer Param}/${infer Rest}`
    ? Param | ParseUrlParams<Rest>
    : S extends `${any}:${infer Param}`
      ? Param
      : never;
```

## 第七十二题 获取数组的中间元素

### 问题

通过实现一个 `GetMiddleElement` 方法，获取数组的中间元素，用数组表示

> 如果数组的长度为奇数，则返回中间一个元素
> 如果数组的长度为偶数，则返回中间两个元素

```ts
type sample1 = GetMiddleElement<[1, 2, 3, 4, 5]> // 返回 [3]
type sample2 = GetMiddleElement<[1, 2, 3, 4, 5, 6]> // 返回 [3, 4]
```

### 思路

**_（“头尾剥离”法）_**

1. **边界情况**  

   - 如果元组只有一个元素（长度为 1），直接把这个元素包成一个新元组返回。

   - 如果元组有两个元素（长度为 2），直接把这两个元素原封不动地按顺序组成一个新元组返回。  

2. **递归剥离头尾**  

   - 当元组长度 ≥ 3 时，我们先把“头和尾”分别剥掉，然后把中间剩下的部分继续递归“头尾剥离”。  

   - 假设当前的元组类型是 `[First, ...Middle, Last]`：  

     - `First` 就是当前头部要剥掉的第一个元素，  

     - `Last` 就是当前尾部要剥掉的最后一个元素，  

     - `Middle` 是头尾之间剩下的子元组。  

   - 反复做“剥掉头尾 → 递归处理 Middle”，直到碰到长度为 1 或长度为 2 的边界情况，再把
   
     那个（些）元素返回上层。  

3. **最终效果**  
   - 对于奇数长度的数组，剥到只剩 1 个元素时，就把这 1 个元素以 `[元素]` 的形式返回。

   - 对于偶数长度的数组，剥到只剩 2 个元素时，就把这 2 个元素以 `[元素1, 元素2]` 的形式返回。  

这样，就能根据要求：  
- **奇数长度 → 返回 1 个中间元素**  
- **偶数长度 → 返回 2 个中间元素**。  

### 解答

```ts
type GetMiddleElement<T extends any[]> = T['length'] extends 1
  ? T
  : T['length'] extends 2
    ? T
    : T extends [infer _F, ...infer M, infer _L]
      ? GetMiddleElement<M>
      : []
```

## 第七十三题 找出目标数组中只出现过一次的元素

### 问题

找出目标数组中只出现过一次的元素。例如：输入 `[1,2,2,3,3,4,5,6,6,6]`，输出 `[1,4,5]`

例子:

```ts
type test1 = FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]> // expected [1, 4, 5]
type test2 = FindEles<[2, 2, 3, 3, 6, 6, 6]>          // expected []
type test3 = FindEles<[1, 2, 3]>                      // expected [1, 2, 3]
type test4 = FindEles<[1, 2, number]>                // expected [1, 2, number]
type test5 = FindEles<[1, 2, number, number]>        // expected [1, 2]
```

### 思路

1. **辅助类型：`Equal`、`Includes`、`FilterOut`**  

   - `Equal<X, Y>`：用于在类型层面比较 `X` 和 `Y` 是否相同（兼容性比较）。  

   - `Includes<Arr, U>`：判断元组 `Arr` 中是否包含类型 `U`。  

   - `FilterOut<Arr, U, Acc>`：在元组 `Arr` 中，过滤掉所有与 `U` 相等的元素，返回剩余元素 `Acc`
   
   构成的新元组。  
   
2. **核心递归类型：`FindEles<T, Once, Multiple>`**  

   - `T`：待处理的原始元组（元素类型任意），初始调用时不指定 `Once` 与 `Multiple`，默认为 `[]`。  

   - `Once`：当前已经遍历过且仅出现一次的元素的「有序」集合（元组）。  

   - `Multiple`：当前已经遍历过且出现次数 ≥ 2 的元素集合（元组，可以重复出现，但由
   
     于逻辑只会将一个类型首次放入 `Multiple`，因此可视为「不再收录到结果」的集合）。递归逻辑（每次从 `T` 中取 `Head`，对比后分三种情况）：  

   - **若 `Head` 已在 `Once` 中**：说明这是第二次（或更多次）遇到 `Head`，此时要把它从
   
      `Once` 里移除（用 `FilterOut<Once, Head>`）并把 `Head` 放到 `Multiple` 里。  

   - **否则若 `Head` 已在 `Multiple` 中**：说明此前已经出现过至少两次，当前无需做任何操作，继续处理 `Tail`。  

   - **否则说明是第一次遇到 `Head`**：将 `Head` 追加到 `Once` 末尾。  
   
   递归到 `T` 为空时，`Once` 就是「只出现过一次」的所有元素，并且保留了它们在原始元组中第一次出现的顺序。


### 解答

```ts
/**
 * 等价比较：判断 X 与 Y 是否相同
 */
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2)
    ? true
    : false;

/**
 * Includes<Arr, U> —— 元组 Arr 是否包含类型 U？
 */
type Includes<Arr extends readonly any[], U> =
  Arr extends [infer Head, ...infer Tail]
    ? Equal<Head, U> extends true
      ? true
      : Includes<Tail, U>
    : false;

/**
 * FilterOut<Arr, U> —— 从 Arr 中剔除所有与 U 相同的元素，剩余部分保持原序返回
 */
type FilterOut<
  Arr extends readonly any[],
  U,
  Acc extends readonly any[] = []
> = Arr extends [infer Head, ...infer Tail]
  ? Equal<Head, U> extends true
    ? FilterOut<Tail, U, Acc>
    : FilterOut<Tail, U, [...Acc, Head]>
  : Acc;

/**
 * FindEles<T> —— 返回元组 T 中「只出现一次」的元素所组成的新元组（保留首次出现顺序）
 */
type FindEles<
  T extends readonly any[],
  Once extends readonly any[] = [],
  Multiple extends readonly any[] = []
> =
  T extends [infer Head, ...infer Tail]
    ? (
        Includes<Once, Head> extends true
          ? FindEles<Tail, FilterOut<Once, Head>, [...Multiple, Head]>
        : Includes<Multiple, Head> extends true
          ? FindEles<Tail, Once, Multiple>
          : FindEles<Tail, [...Once, Head], Multiple>
      )
    : Once;
```

## 第七十四题 CountElementNumberToObject

### 问题

通过实现一个``CountElementNumberToObject``方法，统计数组中相同元素的个数
```ts
type Simple1 = CountElementNumberToObject<[]> // return {}
type Simple2 = CountElementNumberToObject<[1,2,3,4,5]> 
/*
 return {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1
}
*/
type Simple3 = CountElementNumberToObject<[1,2,3,4,5,[1,2,3]]> 
/*
 return {
  1: 2,
  2: 2,
  3: 2,
  4: 1,
  5: 1
}
*/
```

### 思路

**1. 扁平化数组** `Flatten<T, R = []>`

```ts
type Flatten<T, R extends any[] = []> =
  T extends [infer F, ...infer L]
    ? [F] extends [never]
        ? Flatten<L, R>
        : F extends any[]
          ? Flatten<L, [...R, ...Flatten<F>]>
          : Flatten<L, [...R, F]>
    : R;
```

  - 思路：

    - **目的**：把嵌套数组扁平化，变成一维数组，便于后续统一处理。

    - **递归拆解数组**：判断数组是否还有元素，若有，取第一个元素 `F` 和剩下的 `L`。

    - **三种情况判断**：

      - `[F] extends [never]`：处理 `[undefined]`、`[never]` 这种情况（跳过）。

      - `F extends any[]`：如果 `F` 是数组，则递归扁平化。

      - 否则 `F` 是普通元素，追加到结果中。

  - 举例：

```ts
Flatten<[1, 2, [3, 4], 5]> --> [1, 2, 3, 4, 5]
Flatten<[1, [2, [3]]]>     --> [1, 2, 3]
```

**2. 元组计数 `Count<T, R = {}>`**

```ts
type Count<
  T,
  R extends Record<string | number, any[]> = {}
> =
  T extends [infer F extends string | number, ...infer L]
    ? F extends keyof R
        ? Count<L, Omit<R, F> & Record<F, [...R[F], 0]>>
        : Count<L, R & Record<F, [0]>>
    : {
        [K in keyof R]: R[K]['length']
      };
```

  - 思路：

    - **遍历数组 T**：

      - 如果元素 `F` 是已经存在于计数器 `R` 中的 key：

        - 就取出之前的计数（一个元组），在后面加一个 `0`。

        - `Record<F, [...R[F], 0]>`

      - 如果没出现过：

        - 新建 `Record<F, [0]>` 表示它出现过 1 次。

      - `Omit<R, F>` 是为了避免旧值覆盖不生效的问题。

    - **递归处理剩下的元素 `L`**

    - **递归结束**后，处理累加器 `R`：

      - 用映射类型把所有元组转成它们的 `.length`：

```ts
{
  [K in keyof R]: R[K]['length']
}
```

  - 举例：

```ts
Count<[1, 2, 1]> // 最终变成：{ 1: 2, 2: 1 }
```

> 例如：`R["1"] = [0, 0]` 表示 2 次出现，因为 `[0, 0]['length'] === 2`

### 解答

```ts
type Flatten<T, R extends any[] = []> =
  T extends [infer F, ...infer L]
    ? [F] extends [never]
        ? Flatten<L, R>
        : F extends any[]
          ? Flatten<L, [...R, ...Flatten<F>]>
          : Flatten<L, [...R, F]>
    : R;

type Count<
  T,
  R extends Record<string | number, any[]> = {}
> =
  T extends [infer F extends string | number, ...infer L]
    ? F extends keyof R
        ? Count<L, Omit<R, F> & Record<F, [...R[F], 0]>>
        : Count<L, R & Record<F, [0]>>
    : {
        [K in keyof R]: R[K]['length']
      };

type CountElementNumberToObject<T> = Count<Flatten<T>>;
```

## 第七十五题 Integer

### 问题

请完成类型 `Integer<T>`，类型 `T` 继承于 `number`，如果 `T` 是一个整数则返回它

否则返回 `never`。

```ts
type example1 = Integer<1>        // expected 1
type example2 = Integer<0.1>      // expected never
type example3 = Integer<1.0>      // expected 1
type example4 = Integer<1.000000000> // expected 1
type example5 = Integer<0.5>      // expected never
type example6 = Integer<28.00>    // expected 28
type example7 = Integer<28.101>   // expected never
```

### 思路

由于 TypeScript 类型系统**无法直接做数学运算**，但它可以用模板字符串处理字面量类型，所以我们可以：

**1.使用模板字符串将数字转为字符串**

   这可以用于分辨小数点，例如：

```ts
`${T}` extends `${infer I}.${infer D}` 
```

如果能匹配这个模式，就表示是小数，否则是整数。

**2.字面量 vs 普通 `number`** 

类型为 `number` 的变量不是字面量类型，无法参与模式匹配：

```ts
type A = `${1}`        // "1" ✅
type B = `${1.5}`      // "1.5" ✅
type C = `${number}`   // string ❌（不可分解）
```

### 解答

```ts
type Integer<T extends number> = `${T}` extends `${infer _}.${infer _}` ? never : T
```

## 第七十六题 ToPrimitive

### 问题

将对象中的文字类型（标签类型）的属性转换为原始类型

例子: 

```ts
type X = {
  name: 'Tom',
  age: 30,
  married: false,
  addr: {
    home: '123456',
    phone: '13111111111'
  }
}

type Expected = {
  name: string,
  age: number,
  married: boolean,
  addr: {
    home: string,
    phone: string
  }
}
type Todo = ToPrimitive<X> // should be same as `Expected`
```

### 思路

**1. `T extends object` → 对象递归处理**

```ts
T extends object
  ? { [K in keyof T]: ToPrimitive<T[K]> }
```

- **目的**：如果 `T` 是对象（包括数组、函数、字面量对象），则递归地将其每个属性都应用 `ToPrimitive`。

- **实现方式**：使用映射类型 `[K in keyof T]` 来遍历每一个 key，并对 `T[K]` 递归执行 `ToPrimitive<T[K]>`。

- **效果**：可以递归地将嵌套对象中的值也转为原始类型。

---

**2. `T extends { valueOf: () => infer P }` → 处理字面量和原始类型封装**

```ts
: T extends { valueOf: () => infer P }
  ? P
```

- **目的**：如果不是对象，可能是某些**字面量值**（如 `"abc"`、`123`、`false` 等），

  这些类型在 TypeScript 中其实是特殊的对象（`String`、`Number`、`Boolean`）。

- **原理**：

  - `"abc"` 是 `string` 字面量类型，但也可以理解为 `{ valueOf: () => string }`

  - `valueOf()` 方法能返回对应的原始类型。

- **使用 `infer P`**：

  - 自动推导 `valueOf()` 的返回类型。

  - 例如：`"abc".valueOf()` 返回 `string`，`false.valueOf()` 返回 `boolean`。

---

**3. 其他情况 → 保留原样**

```ts
: T
```

- 如果既不是对象，也没有 `valueOf()`（比如一些基础类型），就原样返回。

- 起到兜底作用，保持类型安全。

### 解答

```ts
type ToPrimitive<T> = T extends object
  ? { [K in keyof T]: ToPrimitive<T[K]> }
  : T extends { valueOf: () => infer P }
    ? P
    : T
```

## 第七十七题 DeepMutable

### 问题

实现一个通用的 `DeepMutable<T>` ，它使对象的每个属性，及其递归的子属性 - 可变。

例如：

```ts
type X = {
  readonly a: () => 1
  readonly b: string
  readonly c: {
    readonly d: boolean
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true
          readonly j: "s"
        }
        readonly k: "hello"
      }
    }
  }
}

type Expected = {
  a: () => 1
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: "s"
        }
        k: "hello"
      }
    }
  }
}

type Todo = DeepMutable<X> // should be same as `Expected`
```

你可以假设我们在这个挑战中只处理对象。 数组、函数、类等不需要考虑。 但是，您仍然可以通过涵盖尽可能多的不同案例来挑战自己。

### 思路

1. 先判断是否是函数，是则直接返回；

2. 不是函数再判断是否是对象（但要排除 `null`）；

3. 是对象且非 `null`，递归去除 `readonly`；

4. 其他类型保持不变。

### 解答

```ts
type DeepMutable<T> = T extends Function
  ? T
  : T extends object
    ? T extends null
      ? T
      : { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T
```

## 第七十八题 All

### 问题

如果传入的第一个参数中所有元素都等于传入的第二个参数，则返回 true；如果有不匹配，则返回 false。

例如：

```ts
type Test1 = [1, 1, 1]
type Test2 = [1, 1, 2]

type Todo = All<Test1, 1> // 应与 true 相同
type Todo2 = All<Test2, 1> // 应与 false 相同
```

### 思路

用递归遍历元组类型 `T` 的每个元素：

   - 如果是空元组 `[]`，说明没有不匹配的，返回 `true`；

   - 取出第一个元素 `Head`，检查它是否等于 `U`：

     - 是的话递归判断剩余元素 `Tail`；

     - 否则直接返回 `false`。

### 解答

```ts
type Equal<A, B> = (<G>() => G extends A ? 1 : 2) extends (<G>() => G extends B ? 1 : 2) ? true : false

type All<T extends any[], N extends any> = T extends [infer F, ...infer Rest]
  ? Equal<F, N> extends true
    ? All<Rest, N>
    : false 
  : true
```

## 第七十九题 Filter

### 问题

实现类型 `Filter<T, Predicate>` 接受一个数组 `T`、原始类型或联合原始类型 `Predicate`，并返回一个包含 `Predicate` 元素的数组。

```ts
type Example1 = Filter<[0, 1, 2], 2> // expected `[2]`
type Example2 = Filter<[0, 1, 2], 0 | 1> // expected `[0, 1]`
type Example3 = Filter<[0, 1, 2], Falsy> // expected `[0]`
```

### 思路

1. 遍历数组： 我们可以使用递归的条件类型来处理元组（数组）的每个元素。

2. 检查类型包含： 对于每个元素 `Head`，我们将检查 `Head extends Predicate`。

3. 构建新数组： 如果 `Head extends Predicate` 为真，我们就将 `Head` 添加到递归过滤后的 

   `Tail` 的前面。否则，我们只递归过滤 `Tail`。

### 解答

```ts
type Filter<T extends any[], Predicate> = T extends [infer Head, ...infer Tail]
  ? Head extends Predicate
    ? [Head, ...Filter<Tail, Predicate>]
    : [...Filter<Tail, Predicate>]
  : []
```

## 第八十题 FindAll

### 问题

给定一个模式字符串 `P` 和一个文本字符串 `T`，实现类型 `FindAll<T, P>`，返回一个数组，该数

组包含来自 `T` 中与 `P` 匹配的所有索引（从 `0` 开始）。

```ts
type Example1 = FindAll<'Collection of TypeScript type challenges', 'Type'> // expected [14]
type Example2 = FindAll<'Collection of TypeScript type challenges', 'pe'>   // expected [16, 27]
type Example3 = FindAll<'Collection of TypeScript type challenges', ''>     // expected []
type Example4 = FindAll<'', 'Type'>                                         // expected []
type Example5 = FindAll<'', ''>                                             // expected []
type Example6 = FindAll<'AAAA', 'A'>                                       // expected [0, 1, 2, 3]
type Example7 = FindAll<'AAAA', 'AA'>                                       // expected [0, 1, 2]
```

### 思路

1. 目标：在字符串 `T` 中查找所有子串 `P` 出现的位置（索引），结果是一个数字数组。

2. 特殊情况处理：

    如果 `P` 是空字符串，或者 `T` 是空字符串，返回 `[]`。

3. 核心思想：

    - 从左到右逐字符遍历 `T`，每次判断以当前位置开始的子串是否以 `P` 开头。

      如果是，就记录当前位置的索引。

      使用一个数组 `P` 累计当前索引位置（通过数组长度 `P['length']` 实现当前索引）。

4. 递归方式：

    - 每次递归去掉 `T` 的首字符（用 infer 提取剩下的部分），同时索引加一（通过 `P` 数组累
    
      加 `0` 实现索引偏移）。

最终返回所有匹配到的位置组成的数组。

### 解答

```ts
type NormalFindAll<
  T extends string, 
  S extends string,
  P extends any[] = [],
  R extends number[] = [],
> = 
T extends `${string}${infer L}`?
  T extends `${S}${string}`?
    NormalFindAll<L,S,[...P,0],[...R,P['length']]>
    :NormalFindAll<L,S,[...P,0],R>
  :R

type FindAll<
  T extends string, 
  P extends string,
> = 
P extends ''
  ? []
  : NormalFindAll<T,P>
```

# medium 类41-50题

## 第四十一题 ObjectEntries

### 问题

实现 `Object.entries` 的类型版本

例如:

```typescript
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
```

### 思路

1. **`keyof T`**

    `keyof T` 获取类型 `T` 的所有键的联合类型。例如，对于 `Model`，`keyof Model` 是      `'name' | 'age' | 'locations'`。

2. **映射类型 `{ [K in keyof T]: [K, T[K]] }`**

  - 使用映射类型遍历 `T` 的每个键 `K`，并为每个键构造一个元组类型 `[K, T[K]]`。
  - 对于 `Model`，这会生成如下类型：
    ```ts
    {
      name: ['name', string];
      age: ['age', number];
      locations: ['locations', string[] | null];
    }
    ```


3. **索引访问 `[keyof T]`**

  - 通过 `[keyof T]` 提取映射类型中所有属性的值（即元组类型）的联合。

  - 因为 `keyof T` 是 `'name' | 'age' | 'locations'`，所以结果是：
      ```ts
      ['name', string] | ['age', number] | ['locations', string[] | null]
      ```
### 解答

```ts
type ObjectEntries<T> = {
  [P in keyof T]: [P, T[P]]
}[keyof T]
```

## 第四十二题 Shift

### 问题

实现 `Array.shift` 的类型版本

例如：

```ts
type Result = Shift<[3, 2, 1]> // [2, 1]
```

### 思路

1. **约束输入类型：**

    使用 `T extends any[]` 约束 `T` 为数组或元组类型，确保输入是合法的。

2. **匹配非空元组：**

    使用 `T extends [any, ...infer R]` 检查 `T` 是否至少有一个元素。

    `any` 匹配第一个元素，`...infer R` 推导剩余元素为 `R`。

    如果匹配成功，返回 `R`，即移除第一个元素后的元组。

3. **处理空元组：**

    如果 `T` 不匹配 `[any, ...infer R]`，检查 `T extends []` 是否为真。

    如果是空元组，返回 `[]`，表示移除后仍为空元组。

4. **处理其他情况：**

    对于非元组类型（如 `number[]`）或其他不匹配的情况，返回 `never`，表示 `Shift` 不适用于这些类型。

### 解答

```ts
type Shift<T extends any[]> = T extends [any, ...infer R]
  ? R
  : T extends []
    ? []
    : never;
```

## 第四十三题 Tuple to Nested Object

### 问题

给定一个仅包含字符串类型的元组类型 `T` 和一个类型 `U`，递归地构建一个对象。

```typescript
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. 如果元组是空的，只返回 `U`
```

### 思路

1. **约束输入类型：**

   `T` 是一个字符串元组，定义为` T extends string[]`，确保 `T` 的元素是字
    
    符串类型（包括字符串字面量，如 `'a'`）。

    `U` 是任意类型，作为嵌套对象的最终值类型。

2. **处理空元组：**

   如果 `T` 是空元组（ `[]` ），直接返回 `U`。这通过条件类型 `T extends [] ? U` 实现。

3. **处理非空元组：**

   如果 `T` 至少有一个元素，使用 `T extends [infer First extends string, ...infer 
    Rest extends string[]]` 

    推导： `First` 是元组的第一个元素，约束为字符串类型。`Rest` 是剩余的元组元素，仍然是
    
    字符串元组。构造一个对象类型 `{ [K in First]: TupleToNestedObject<Rest, U> }`，
    
    其中： `First` 作为键（字符串字面量）。值是 `TupleToNestedObject<Rest, U>`，递归处
    
    理剩余元素。

4. **处理非法输入：**

   如果 `T` 既不为空元组，也不符合 `[First, ...Rest]` 模式（例如非元组的 `string[]`），

    返回 `never`，表示类型不适用。

### 解答

```ts
type TupleToNestedObject<T extends string[], U> = T extends []
  ? U
  : T extends [infer First extends string, ...infer Rest extends string[]]
    ? { [K in First]: TupleToNestedObject<Rest, U> }
    : never;
```

## 第四十四题  Reverse

### 问题

实现类型版本的数组反转 ```Array.reverse```

例如：

```typescript
type a = Reverse<['a', 'b']> // ['b', 'a']
type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
```

### 思路

1. **约束输入类型：**

    使用 `T extends any[]` 约束 `T` 为数组或元组类型，确保输入是合法的。
  
2. **处理空元组：**

    如果 `T` 是空元组（`[]`），返回 `T`，即 `[]`。这通过条件类型的默认分支实现，因为空元组
    
    不匹配 `[infer First, ...infer Rest]`。

3. **处理非空元组：**

    使用 `T extends [infer First, ...infer Rest]` 检查 `T` 是否至少有一个元素：`First` 推导
    
    为元组的第一个元素。`Rest` 推导为剩余的元组元素。递归计算 `Reverse<Rest>`，得到剩余元
    
    素反转后的元组。使用变长元组语法 `[...Reverse<Rest>, First]`,将 `First` 追加到 
    
    `Reverse<Rest>` 的末尾，形成反转后的元组。

### 解答

```ts
type Reverse<T extends any[]> = T extends [infer First, ...infer Rest] ? [...Reverse<Rest>, First] : T;
```

## 第四十五题 Flip Arguments

### 问题

实现 `lodash` 的 `_.flip` 类型版本。 类型 `FlipArguments<T>` 需要函数类型 `T`，并返回一个新

的函数类型，该函数类型与 `T` 具有相同的返回类型，但参数相反。例如：

```ts
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void> 
// (arg0: boolean, arg1: number, arg2: string) => void
```

### 思路

1. **约束输入**

    限制 `T` 必须是一个函数类型：`T extends (...args: any[]) => any`。

2. **拆分参数与返回值**

    使用条件类型和 `infer` 拆出参数列表 `Args`（一个元组）和返回类型 `R`：

    ```ts
    T extends (...args: infer Args) => infer R ? … : never
    ```

3. **反转参数元组**

    定义一个递归的类型` Reverse<Tuple>`，将元组 `[A, B, C, …]` 反转成 `[…, C, B, A]`：

    ```ts
    type Reverse<T extends any[]> =
      T extends [infer Head, ...infer Rest]
        ? [...Reverse<Rest>, Head]
        : [];
    ```

4. **重建函数类型**

    用反转后的元组和原来的返回类型重建函数签名：

    ```ts
    (...args: Reverse<Args>) => R
    ```

### 解答

```ts
type ReverseTuple<T extends any[]> = T extends [infer First, ...infer Rest]
  ? [...ReverseTuple<Rest>, First]
  : [];

type FlipArguments<T extends (...args: any[]) => any> = T extends (...args: infer Args) => infer R
  ? (...args: ReverseTuple<Args>) => R
  : never;
```

## 第四十六题 FlattenDepth

### 问题

递归地将数组展平至 `Depth` 倍数

例如:

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. 展平两次
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth 参数默认为 1
```

### 思路

第一步，使用递归方式处理展平操作， 第二步，通过一个额外的类型参数跟踪当前的递归深度

第三步,当递归深度达到指定值时停止进一步展平

1. `T extends any[]` - 输入必须是一个数组

2. `D extends number = 1` - 深度参数，默认为1

3. `U extends number[] = []` - 这是一个计数器，用来跟踪当前递归的深度

**实现的关键逻辑是**：

- 如果计数器长度 `U['length']` 等于深度 `D` ，就停止展平，直接返回 `T`
- 否则，我们拆分数组为首元素 `F` 和剩余元素 `R`

  - 如果 `F` 是数组，就递归展平 `F`（计数器深度 +1）并与展平后的 `R` 连接
  - 如果 `F` 不是数组，就直接保留 `F` 并与展平后的 `R` 连接

  这样就能精确控制展平的深度了。

### 解答

```ts
type FlattenDepth<
  T extends any[],
  D extends number = 1,
  U extends number[] = []
> = U['length'] extends D
  ? T
  : T extends [infer F, ...infer R]
    ? F extends any[]
      ? [...FlattenDepth<F, D, [...U, 1]>, ...FlattenDepth<R, D, U>]
      : [F, ...FlattenDepth<R, D, U>]
    : T;
```

## 第四十七题 BEM style string

### 问题

块、元素、修饰符 (`BEM`) 方法论是 `CSS` 中一种流行的类命名约定。例如，块组件可以表示为 `btn`，

依赖于块的元素可以表示为 `btn__price`，改变块样式的修饰符可以表示为 `btn--big` 或 

`btn__price--warning`。实现 `BEM<B, E, M>` ，它会根据这三个参数生成字符串并集。其中 `B` 是

字符串字面量，`E` 和 `M` 是字符串数组（可以为空）。

### 思路

**该类型接受三个泛型参数：**

- `B extends string` - 块名称（必填）
- `E extends string[] = []` - 元素名称数组（可选，默认为空数组）
- `M extends string[] = []` - 修饰符名称数组（可选，默认为空数组）

**输出是四种不同模式的联合类型：**

1. `B` - 仅块名称本身
2. `${B}__${E[number]}` - 块与每个元素的组合（使用索引访问类型 `E[number]` 获取所有元素）
3. `${B}--${M[number]}` - 块与每个修饰符的组合
4. `${B}__${E[number]}--${M[number]}` - 块与元素和修饰符的每种组合

代码中使用了条件类型（`E extends [] ? never : ...`）来确保只根据是否提供了元素或修饰符来生成相关部分。

### 解答

```ts
type BEM<
  B extends string,
  E extends string[] = [],
  M extends string[] = []
> = 
  | B // 块
  | (E extends [] ? never : `${B}__${E[number]}`) // 块__元素
  | (M extends [] ? never : `${B}--${M[number]}`) // 块--修饰符
  | (E extends [] ? never : M extends [] ? never : `${B}__${E[number]}--${M[number]}`) // 块__元素--修饰符

```

## 第四十八题 InorderTraversal

### 问题

实现二叉树中序遍历的类型版本。

例如:

```ts
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null,
    },
    right: null,
  },
} as const

type A = InorderTraversal<typeof tree1> // [1, 3, 2]
```

### 思路

**处理空节点（基线条件）**:

```ts
[T] extends [null | undefined]
    ? []
```
当 `T` 是 `null` 或 `undefined` 时（表示一个空节点），中序遍历的结果就是一个空数组 `[]`。这

里使用 `[T] extends [null | undefined]`包装 `T` 的原因是，当 `T` 直接是 `null` 或 `undefined`

时，它不能被直接用于 `extends` 检查，因为它不是一个具体的类型。将其放入一个元组中可以解

决这个问题，让 `extends` 检查能够正确处理 `null` 和 `undefined` 字面量类型。

**处理非空节点（递归步骤）:**

```ts
: T extends { left: infer L, val: infer V, right: infer R}
    ? [...InorderTraversal<L>, V, ...InorderTraversal<R>]
    : never;
```
  - **类型推断 (`infer`):** `T extends { left: infer L, val: infer V, right: infer R}` 这
  
    一部分是关键。它尝试将传入的类型 T 匹配一个包含 `left`、`val` 和 `right` 属性的对象。如
  
    果匹配成功，TypeScript 就会从 `T` 中推断出这些属性的类型，并将它们分别赋值给类型变量 
    
    `L` (left), `V` (val), 和 `R` (right)。
  - **中序遍历逻辑:**`[...InorderTraversal<L>, V, ...InorderTraversal<R>]` 完美地模拟了中序遍历的步骤：
    - `InorderTraversal<L>`: 递归地对左子树进行中序遍历，得到左子树的所有节点值。

    - `V`: 当前节点的 `val` 值。中序遍历的定义就是在遍历完左子树后访问当前节点。

    - `InorderTraversal<R>`: 递归地对右子树进行中序遍历，得到右子树的所有节点值。

    - `...`: 展开运算符（spread operator）在这里用于将递归结果的数组连接起来。
  - **处理不匹配的类型:**

    - `never`：如果 `T` 既不是 `null/undefined`，也不是一个符合 `{ left: ..., val: ..., right: ... }`
    
      结构的类型，那么它就不符合我们定义的二叉树节点结构。在这种情况下，返回 `never` 是
      
      合理的，因为它表示一个不可达或不合法的类型。

### 解答

```ts
type InorderTraversal<T> =  [T] extends [null | undefined]
    ? []
    : T extends { left: infer L, val: infer V, right: infer R}
        ? [...InorderTraversal<L>, V, ...InorderTraversal<R>]
        : never;
```

## 第四十九题 Flip

### 问题

实现 `just-flip-object` 的类型。示例:

```ts
Flip<{ a: "x", b: "y", c: "z" }>; // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1, b: 2, c: 3 }>; // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false, b: true }>; // {false: 'a', true: 'b'}
```

无需支持嵌套对象和不能作为对象键的值（例如数组）

### 思路

1. 遍历原始对象的每个属性 `K`（使用 `keyof T`）。

2. 利用「键重映射」（`Key Remapping`）语法，把原对象的值 `T[K]` 作为新键。

3. 为了支持布尔字面量（`true` / `false`），在重映射时做条件判断：
    - 如果 `T[K]` 是 boolean，就用模板字符串 `${T[K]}` 先转成字面量字符串 `"true"` / `"false"`。

    - 否则直接沿用原值（它必须满足 `PropertyKey：string | number | symbol`）。

4. 最终映射出的值类型就是原来的属性名 `K`。

5. 为了能包含 boolean，我们把约束从 `Record<PropertyKey, PropertyKey>`
  扩展成 `Record<PropertyKey | boolean, any>`。

### 解答

```ts
type Flip<
  T extends Record<PropertyKey | boolean, any>
> = {
  [K in keyof T as T[K] extends boolean
    ? `${T[K]}`          // 如果是 true/false，就变成 "true"/"false"
    : T[K]               // 否则就是原值，必须是 string | number | symbol
  ]: K
}
```

## 第五十题 Fibonacci Sequence

### 问题

实现一个通用的 `Fibonacci<T>`，它接受一个数字 `T` 并返回其对应的[斐波那契数](https://en.wikipedia.org/wiki/Fibonacci_number)。

序列起始于：1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

例如:

```ts
type Result1 = Fibonacci<3> // 2
type Result2 = Fibonacci<8> // 21
```

### 思路

1. 使用元组（ `Tuple` ）来模拟数字，通过长度（`.length`）来表示数值。

2. 定义递归类型 `Fibonacci<N, Prev, Cur, I>`：
   - `Prev`：第 `i-1` 项对应的元组
   - `Cur`：第 `i` 项对应的元组
   - `I`：当前计算到的索引元组，其长度表示当前的 `i`

3. 初始状态设为 `Prev = []`（表示 `0`），`Cur = [unknown]`（表示 `1`），`I = [unknown]`（表示 `i=1`）。

4. 递归结束条件：当 `I['length']` 等于目标 `N` 时，返回 `Cur['length']`。

5. 否则，推进一项：
     - 新的 `Prev` 变为当前 `Cur`
     - 新的 `Cur` 变为 `[...Prev, ...Cur]`，即 `Prev` + `Cur`
     - `I` 增加一个元素，`i` + `1`


### 解答

```ts
type Fibonacci<
  N extends number,
  Prev extends unknown[] = [],
  Cur extends unknown[] = [unknown],
  I extends unknown[] = [unknown]
> = I['length'] extends N
  ? Cur['length']
  : Fibonacci<
      N,
      Cur,
      [...Prev, ...Cur],
      [...I, unknown]
    >;
```

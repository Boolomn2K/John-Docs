# hard 类1-10题

## 第一题 Simple Vue

### 问题 

实现类似Vue的类型支持的简化版本。
通过提供一个函数`SimpleVue`（类似于`Vue.extend`或`defineComponent`），它应该正确地推断出 computed 和 methods 内部的`this`类型。

在此挑战中，我们假设`SimpleVue`接受只带有`data`，`computed`和`methods`字段的Object作为其唯一的参数，

- `data`是一个简单的函数，它返回一个提供上下文`this`的对象，但是你无法在`data`中获取其他的计算属性或方法。

- `computed`是将`this`作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。

- `methods`是函数的对象，其上下文也为`this`。函数中可以访问`data`，`computed`以及其他`methods`中的暴露的字段。 `computed`与`methods`的不同之处在于`methods`在上下文中按原样暴露为函数。

`SimpleVue`的返回值类型可以是任意的。

```ts
const instance = SimpleVue({
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
})
```

### 思路

1. **data**

- `data` 是一个函数，返回一个对象。
- 它不能访问 `this`（因为 `this` 不能引用 computed 和 methods）。
- 所以我们指定：`this: void`

2. **computed**

- 每个 computed 是一个函数，返回一个值。
- `this` 应该是 `data()` 返回的对象。
- 在类型上，我们先推断出 computed 返回值组成的对象类型（比如 `{ fullname: string }`），
  - 然后在 `methods` 中使用这些值。
- 因此需要先提取 computed 的值类型：通过工具类型 `GetComputed`。

3. **methods**

- `this` 可以访问：
  - `data` 的返回值
  - `computed` 的值（注意是值，不是函数）
  - 其他的 `methods`

这意味着：`this` 是 `TData & GetComputed<TComputed> & TMethods`

4. **用 `ThisType` 辅助设置 `this` 类型**

- TypeScript 提供了一个工具类型 `ThisType<T>`，可以设置对象中函数的 `this` 类型。
- 我们在 `computed` 和 `methods` 中分别使用它来指定 `this` 的上下文。

### 解答

```ts
type GetComputed<TComputed> = {
  [key in keyof TComputed]: TComputed[key] extends () => infer Result ? Result : never;
};

type Options<TData, TComputed, TMethods> = {
  data: (this: void) => TData;
  computed: TComputed & ThisType<TData>;
  methods: TMethods & ThisType<TData & GetComputed<TComputed> & TMethods>;
};

declare function SimpleVue<TData, TComputed, TMethods>(
  options: Options<TData, TComputed, TMethods>
): unknown;
```

## 第二题 Currying 1

### 问题 

> 在此挑战中建议使用TypeScript 4.0

[柯里化](https://en.wikipedia.org/wiki/Currying) 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。

例如：

```ts
const add = (a: number, b: number) => a + b
const three = add(1, 2)

const curriedAdd = Currying(add)
const five = curriedAdd(2)(3)
```

传递给 `Currying` 的函数可能有多个参数，您需要正确输入它的类型。

在此挑战中，柯里化后的函数每次仅接受一个参数。接受完所有参数后，它应返回其结果。

### 思路

柯里化的核心思想是将原本接受多个参数的函数，转化为一系列**嵌套的、每次只接受一个参数的函数**，直到接收完所有参数后执行原函数并返回结果。

#### 示例拆解：

```ts
const add = (a: number, b: number, c: number) => a + b + c
const curried = Currying(add)
const result = curried(1)(2)(3) // 返回 6
```

#### 1. 提取参数与返回类型

我们首先通过 `F extends (...args: infer Args) => infer Return` 提取原始函数的参数列表和返回值类型。

#### 2. 判断参数数量

- 如果参数个数为 0 或 1，则不需要柯里化，直接返回原函数类型。

#### 3. 拆分参数列表

- 如果参数长度大于 1，则将参数列表拆成：
  - 第一个参数（用元组 `[any]` 表示）
  - 剩余参数 `Rest`

#### 4. 递归构造柯里化函数类型

- 当前函数类型变为只接受一个参数
- 返回值类型是对剩余参数再柯里化，即递归调用 `Curried<...>` 构造下一层

#### 技巧说明：

- `FirstAsTuple<Args>` 是辅助类型，用来取出参数列表中第一个参数，并保留为元组 `[A]` 的形式，方便后续类型推导。
- 柯里化本质上是一个递归过程，直到所有参数都被拆完，最终返回结果类型。

### 解答

```ts
type FirstAsTuple<T extends any[]> = T extends [any, ...infer R]
  ? T extends [...infer F, ...R]
    ? F
    : never
  : never

type Curried<F> = F extends (...args: infer Args) => infer Return
  ? Args['length'] extends 0 | 1
    ? F
    : Args extends [any, ...infer Rest]
      ? (...args: FirstAsTuple<Args>) => Curried<(...rest: Rest) => Return>
      : never
  : never

declare function Currying<T extends Function>(fn: T): Curried<T>
```

## 第三题 Union to Intersection

### 问题

实现高级工具类型 `UnionToIntersection<U>`

例如

```ts
type I = UnionToIntersection<'foo' | 42 | true> // expected to be 'foo' & 42 & true
```

### 思路

- `U extends infer R ? (x: R) => any : never`

  将联合类型 `U` 拆解为各个成员 `R`，并变成一个函数 `(x: R) => any`。

  这样会生成一个联合类型的函数签名，例如：
  ```ts
  (x: 'foo') => any | (x: 42) => any | (x: true) => any
  ```

- 接下来再整体判断这个函数签名是否可以赋值给：
  ```ts
  (x: infer V) => any
  ```

  由于函数参数是**逆变**的，TypeScript 会将所有 `(x: T)` 合并为一个参数的**交叉类型**，即：
  ```ts
  x: 'foo' & 42 & true
  ```

- 最终推导出 `V` 就是我们想要的交叉类型。

### 解答

```ts
type UnionToIntersection<U> = (U extends infer R ? (x: R) => any : never) extends (x: infer V) => any ? V : never
```

## 第四题 Get Required

### 问题 

实现高级工具类型 `GetRequired<T>`，该类型保留所有必需的属性

例如

```ts
type I = GetRequired<{ foo: number, bar?: string }> // expected to be { foo: number }
```

### 思路

**关键点：如何判断某属性是否是必需的？**

我们可以利用 TypeScript 内置的 `Required<T>` 来构造一个“全部属性都为必需”的版本，再与原始属性类型进行比较。

判断方式如下：

```ts
T[P] extends Required<T>[P]
```

- 如果 `T[P]` 是必需的，这个判断结果为 `true`。
- 如果 `T[P]` 是可选的（即 `undefined` 是其联合类型的一部分），它就无法满足 `Required<T>[P]`，判断为 `false`。

**如何提取满足条件的键？**

借助映射类型的 `as` 语法进行**键重映射**，实现筛选：

```ts
{ [P in keyof T as 条件 ? P : never]: T[P] }
```

如果条件不满足（即不是必需属性），则将该键变为 `never`，从而在结果中移除。

### 解答

```ts
type GetRequired<T> = { [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P] };
```

## 第五题 Get Optional

### 问题 

实现高级工具类型 `GetOptional<T>`，该类型保留所有可选属性

例如

```ts
type I = GetOptional<{ foo: number, bar?: string }> // expected to be { bar?: string }
```

### 思路

- 对于每个属性 `P`，我们进行判断：
  ```ts
  T[P] extends Required<T>[P] ? never : P
  ```
  - `Required<T>[P]` 是强制为必选属性的版本。
  - 如果 `T[P]` 是可选的，那么它和 `Required<T>[P]` 就不会相同。

### 解答

```ts
type GetOptional<T> = { [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P] };
```

## 第六题 Required Keys

### 问题 

实现高级工具类型 `RequiredKeys<T>`，该类型返回 T 中所有必需属性的键组成的一个联合类型。

例如

```ts
type Result = RequiredKeys<{ foo: number; bar?: string }>
// expected to be “foo”
```

### 思路

- 通过 `Pick<T, K>` 提取单个属性；
- 用 `Required` 转换为必需版本；
- 再判断 `T` 是否兼容这个必需版本；

### 解答

```ts
type RequiredKeys<T , K = keyof T> = K extends keyof T
  ? T extends Required<Pick<T,K>>
    ? K
    : never
  :never
```

## 第七题 Optional Keys

### 问题 

实现高级工具类型`OptionalKeys<T>`，该类型将 T 中所有可选属性的键合并为一个联合类型。

### 思路

与上题类似，只是判断条件相反。

### 解答

```ts
type OptionalKeys<T,K = keyof T> = K extends keyof T
  ? T extends Required<Pick<T,K>>
    ? never
    : K
  :never;
```

## 第八题 Capitalize Words

### 问题 

实现`CapitalizeWords<T>`，它将**字符串的每个单词**的第一个字母转换为大写，其余部分保持原样。

例如

```ts
type capitalized = CapitalizeWords<"hello world, my friends"> // 预期为 'Hello World, My Friends'
```

### 思路

**如何判断是否是字母？**

```ts
Uppercase<A> extends Lowercase<A> // false 表示是字母
```

非字母字符（如空格、标点）在大小写转换后没有变化，而字母会变，因此可以用这个判断。

**策略：**

用变量 `W` 暂存正在收集的单词字符。

1. 遍历每个字符 `A`
2. 如果是字母 ➝ 加到 `W` 中继续收集
3. 如果不是字母 ➝ 说明一个单词结束：
   - 用 `Capitalize<W>` 将首字母大写
   - 输出该单词和当前字符（如空格）
   - 继续处理剩下的字符串
4. 处理完后，用 `Capitalize<W>` 补上最后一个单词

### 解答

```ts
type CapitalizeWords<
  S extends string,
  W extends string = ''
> = S extends `${infer A}${infer B}`
  ? Uppercase<A> extends Lowercase<A>
    ? `${Capitalize<`${W}${A}`>}${CapitalizeWords<B>}`
    : CapitalizeWords<B, `${W}${A}`>
  : Capitalize<W>
```

## 第九题 CamelCase

### 问题 

实现 `CamelCase<T>` ，将 `snake_case` 类型的表示的字符串转换为 `camelCase` 的表示方式。

例如

```ts
type camelCase1 = CamelCase<"hello_world_with_types"> // 预期为 'helloWorldWithTypes'
type camelCase2 = CamelCase<"HELLO_WORLD_WITH_TYPES"> // 期望与前一个相同
```

### 思路
1. **统一小写**  
   为了保证输出中，原本可能为大写的字母也能被正确处理为全小写开头（如示例中的 `"HELLO_WORLD"`），在最终返回没有 `_` 时，我们直接对整个剩余字符串做 `Lowercase<S>`。  

2. **匹配第一个下划线**  
   我们把输入拆成三段：  
   ```ts
   S extends `${infer F}_${infer R1}${infer R2}`
   ```  
   - `F`：下划线前的所有内容（可能是多个字符，或空串）。  
   - `_`：当前要处理的下划线分隔符。  
   - `R1`：下划线后紧跟的第一个字符。  
   - `R2`：`R1` 之后的其余部分。  

3. **判断下划线后面是不是“有效字母”**  
   我们要做的是：如果 `R1` 是一个字母（或数字、特殊字符……），就把它“提取”出来并大写；否则，把这个下划线当成普通字符保留下来。  
   ```ts
   Uppercase<R1> extends Lowercase<R1>
   ```  
   - 当且仅当 `R1` 在大小写转换前后都不变（例如数字、下划线本身、标点），才会成立。  
   - 成立的时候，我们认为它不应该被当作单词首字母去大写，就保留原下划线：  
     ```ts
     `${Lowercase<F>}_${CamelCase<`${R1}${R2}`>}`
     ```  
   - 否则，`R1` 是一个字母（或其他可大写的字符），我们去掉下划线，把它 `Uppercase<R1>`，并与前面的小写化结果拼接：  
     ```ts
     `${Lowercase<F>}${Uppercase<R1>}${CamelCase<R2>}`
     ```

4. **递归调用**  
   - 在上述两种分支中，都调用 `CamelCase<…>` 处理剩余的字符串。  
   - 递归会不断消耗掉每一个下划线／字母对，直到遇到没有下划线的纯字符串。  

5. **终止条件**  
   当 `S` 已经不再匹配 `${infer F}_${…}` 模式（即没有更多下划线），直接返回 `Lowercase<S>`，完成整个转换。

---

这样就可以保证：

- 首尾及中间所有单词都被正确拼接成驼峰形式；
- 输入中原有的大写或小写字母都被统一处理；
- 连续的非字母下划线（或其他分隔符）也能被合理保留或跳过。


### 解答

```ts
type CamelCase<S extends string> = S extends `${infer F}_${infer R1}${infer R2}`
  ? Uppercase<R1> extends Lowercase<R1>
    ? `${Lowercase<F>}_${CamelCase<`${R1}${R2}`>}`
    : `${Lowercase<F>}${Uppercase<R1>}${CamelCase<R2>}`
  : Lowercase<S>
```

## 第十题 C-printf Parser

### 问题

`C` 语言中有一个函数：`printf`。这个函数允许我们打印一些格式化的内容。像这样：

```c
printf("The result is %d.", 42);
```

本挑战要求你解析输入字符串并提取格式占位符，例如 `%d` 和` %f`。例如，如果输入字符串为`“The result is %d.”`，则解析结果为元组 `['dec']`。

这是映射表:

```ts
type ControlsMap = {
  c: 'char',
  s: 'string',
  d: 'dec',
  o: 'oct',
  h: 'hex',
  f: 'float',
  p: 'pointer',
}
```

### 思路

要实现对格式字符串的解析，需要利用 TypeScript 的 *模板字符串类型（template literal types）* 和 *条件类型（conditional types）* 结合递归来完成。具体思路如下：

1. **匹配“%”及后续字符**：使用条件类型判断 ```T extends `${string}%${infer C}${infer Rest}` ```，即先匹配任意前缀（`${string}`），然后遇到一个 `%`，接着提取 `%` 后面的第一个字符为 `C`，剩余的字符串为 `Rest`。这样可以递归地从左到右依次找到每个百分号占位符。

2. **判断提取字符是否为有效占位符**：利用 `C extends keyof ControlsMap` 判断刚才提取的字符 `C` 是否在 `ControlsMap` 的键中。如果是，则说明这是一个有效的格式占位符；否则就忽略这个占位符字符并继续解析。

3. **映射并递归**：若 `C` 在 `ControlsMap` 中，就将对应的控制名称 `ControlsMap[C]` 加入结果数组，并对剩余字符串 `Rest` 继续应用同样的解析逻辑。这里用 `[ControlsMap[C], ...ParsePrintFormat<Rest>]` 通过展开（`...`）实现将当前结果与递归结果连接成一个元组。

4. **忽略无效占位符并继续**：如果 `C` 不在 `ControlsMap` 中，则说明虽然匹配到了 `%`，但后面紧接的字符不是我们要找的控制字符（例如可能出现 `%%` 的情况）。此时不将任何新项加入结果，直接递归解析 `Rest`，即 `[...]` 不包含新的元素，只返回对 `Rest` 的解析结果。

5. **结束条件**：当字符串中不再包含 `%` 时，条件类型的匹配失败（不符合模式 `${string}%${infer C}${infer Rest}`），这时返回空元组 `[]` 作为递归结束的基线。


### 解答

```ts
type ParsePrintFormat<T extends string> =
  T extends `${string}%${infer C}${infer Rest}`
    ? C extends keyof ControlsMap
      ? [ControlsMap[C], ...ParsePrintFormat<Rest>]
      : [...ParsePrintFormat<Rest>]
    : [];
```

# medium 类31-40题

## 第三十一题 Percentage Parser

### 问题

实现类型 `PercentageParser<T extends string>`。根据规则 `/^(\+|\-)?(\d*)?(\%)?$/` 匹配类型 T。

匹配的结果由三部分组成，分别是：[`正负号`, `数字`, `单位`]，如果没有匹配，则默认是空字符串。

例如：

```ts
type PString1 = ''
type PString2 = '+85%'
type PString3 = '-85%'
type PString4 = '85%'
type PString5 = '85'

type R1 = PercentageParser<PString1> // expected ['', '', '']
type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
type R5 = PercentageParser<PString5> // expected ["", "85", ""]
```

### 思路

1. **符号处理**
  - 优先提取首字符判断是否为符号
  - 符号存在时分离出剩余部分 `Rest`

```ts
T extends `${infer Sign}${infer Rest}`
  ? Sign extends '+' | '-' 
    ? ...处理有符号情况...
    : ...处理无符号情况...
```

2. **数字与单位处理**
  - 对剩余部分判断是否包含 `%` 单位
  - 分离数字部分与单位部分

```ts
Rest extends `${infer Num}%` ? [Sign, Num, '%'] : [Sign, Rest, '']
```

3. **无符号处理**
  - 无符号时直接处理数字和单位
  - 分离数字部分与单位部分

```ts
: T extends `${infer Num}%` ? ['', Num, '%'] : ['', T, '']
```

### 解答

```ts
type PercentageParser<T extends string> = 
  T extends `${infer Sign}${infer Rest}` 
    ? Sign extends '+' | '-' 
      ? Rest extends `${infer Num}%` 
        ? [Sign, Num, '%'] 
        : [Sign, Rest, ''] 
      : T extends `${infer Num}%` 
        ? ['', Num, '%'] 
        : ['', T, ''] 
    : ['', '', ''];
```

## 第三十二题 Drop Char

### 问题

从字符串中剔除指定字符。

例如：

```ts
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
```

### 思路

1. **递归分解字符串**
  - 使用模板字面量类型将字符串分解为第一个字符 `First` 和剩余部分 `Rest`

```ts
T extends `${infer First}${infer Rest}`
```

2. **字符判断逻辑**
  - 如果首字符匹配目标字符 `C` → 跳过并递归处理剩余部分
  - 否则 → 保留首字符并递归处理剩余部分

```ts
First extends C ? `${DropChar<L, C>}` : `${F}${DropChar<L, C>}`
```

3. **终止条件**

```ts
: T // 当字符串为空时直接返回
```


### 解答

```ts
type DropChar<S extends string, C extends string> = S extends `${infer F}${infer L}`
  ? F extends C
    ? `${DropChar<L, C>}`
    : `${F}${DropChar<L, C>}`
  : S
```

## 第三十三题 MinusOne

### 问题

给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。

例如:

```ts
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```

### 思路

::: details
此处用到 `infer ... extends ...`
例子:
```ts
// SomeNum used to be 'number'; now it's '100'.
type SomeNum = "100" extends `${infer U extends number}` ? U : never;
// SomeBigInt used to be 'bigint'; now it's '100n'.
type SomeBigInt = "100" extends `${infer U extends bigint}` ? U : never;
// SomeBool used to be 'boolean'; now it's 'true'.
type SomeBool = "true" extends `${infer U extends boolean}` ? U : never;
```
[更多参考](https://github.com/microsoft/TypeScript/pull/48094)
:::

1. `DigitMap`  
这是一个**字符串数字减一的映射表**  
- `'0' → '9'`（借位时用到）  
- `'1' → '0'`，`'2' → '1'`，...，`'9' → '8'`  
用于单字符数字的减一。

2. `Reverse<S>`  
**字符串反转类型**  
- 递归地将字符串每一位翻转，使个位在前，便于递归模拟从个位到高位的减法（模拟手算减法的顺序）。

3. `MinusOneString<S, Borrow>`  
**主递归逻辑，逐位处理减一和借位问题**  
- **参数解释**  
  - `S`：当前待处理（反转后）的字符串  
  - `Borrow`：是否需要借位（默认 true，即刚开始需要对个位做减一）

- **递归逻辑**  
  - 拆分出首位 `D` 和剩余字符串 `Rest`
  - 如果 `D` 是 `'0'` 并且需要借位（`Borrow` 为 true）：  
    - 当前位变成 `'9'`（0-1借位），继续向后递归借位  
  - 如果 `D` 不是 `'0'` 且需要借位：  
    - 用 `DigitMap[D]` 得到减一结果，后面不再借位（借位只发生一次）  
  - 如果不需要借位，当前位直接原样拼接，递归处理剩余位

4. `TrimZero<S>`  
**去掉前导零（除了单独的 '0'）**  
- 递归地去掉最前面的 0，保证最终结果没有前导零。

5. `MinusOne<T>`  
**总入口类型，串联所有处理步骤**
- 把数字 `T` 转成字符串  
- 如果是 `'0'`，返回 `never`（因为不能减负数）  
- 否则：  
  1. 反转字符串  
  2. 用 `MinusOneString` 进行减一和借位处理  
  3. 再反转回来  
  4. 去除前导零  
  5. 用模板字符串把结果转成 number 字面量类型

6. 总结流程

    1. **把数字转成字符串**，如 1000 → "1000"
    2. **反转**，得 "0001"
    3. **从个位起递归处理减一和借位**
      - 如 1000-1，个位 0-1 得 9，十位 0 借位又变 9，百位 0 借位变 9，千位 1 借位变 0
      - 得到 "9990"
    4. **反转回来**，"9990" → "0999"
    5. **去掉前导零**，得到 "999"
    6. **转成 number 字面量**，类型为 999

### 解答

```ts
// 用于数字字符减一（支持 0-9），如 '3' => '2'
type DigitMap = {
  '0': '9', '1': '0', '2': '1', '3': '2', '4': '3',
  '5': '4', '6': '5', '7': '6', '8': '7', '9': '8'
}

// 字符串反转
type Reverse<S extends string> =
  S extends `${infer F}${infer R}` ? `${Reverse<R>}${F}` : ''

// 主体递归逻辑，从最低位开始减一，处理借位
type MinusOneString<S extends string, Borrow extends boolean = true> =
  S extends `${infer D}${infer Rest}`
    ? D extends keyof DigitMap
      ? Borrow extends true
        ? D extends '0'
          ? `9${MinusOneString<Rest, true>}`        // 0-1 借位，当前为9，继续借
          : `${DigitMap[D]}${Rest}`                 // 正常减一且后面不再借
        : `${D}${MinusOneString<Rest, false>}`      // 不再借位，后面原样
      : never // 非法字符
    : ''

// 去掉前导零（除了0本身）
type TrimZero<S extends string> =
  S extends '0' ? S :
  S extends `0${infer R}` ? TrimZero<R> : S

// 总入口：数字转字符串，反转，执行减一逻辑，再反转回来，去前导零，转回数字字面量
type MinusOne<T extends number> =
  `${T}` extends infer S extends string
    ? S extends '0'
      ? never
      : TrimZero<
          Reverse<MinusOneString<Reverse<S>>>
        > extends `${infer R extends number}`
          ? R
          : never
    : never
```

## 第三十四题 PickByType 

### 问题

实现 `PickByType` ,从 `T` 中选取一组属性，这些属性的类型可赋值给 `U`.

例如:

```typescript
type OnlyBoolean = PickByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { isReadonly: boolean; isEnable: boolean; }
```

### 思路

1. **利用键重映射**
  - *遍历每个属性*： 使用映射类型 `[K in keyof T]` 遍历类型 `T` 的所有键 `K`。
  - *条件判断*： 通过条件类型 `T[K] extends U ? K : never` 判断属性 `T[K]` 是否能赋值给类型 `U`。如果能，则保留键 `K`；否则映射为 `never`。
  - *键重映射过滤*： 在 TS 4.1+ 中，使用 `as` 关键字进行键重映射，当映射结果是 `never` 时，这个键不会出现在最终类型中。

2. **借助内置的 Pick 工具类型**
  - *生成键映射*： 构造一个映射类型，其中每个键 `K` 根据条件判断：如果 `T[K]` 能赋值给 `U` 则保留 `K`，否则映射为 `never`。
  - *联合键提取*： 使用索引访问 `[keyof T]` 将映射类型转换为联合类型，其中只包含满足条件的键（ `never` 会自动被排除）。
  - *使用 `Pick` 提取属性*: 配合内置工具类型 `Pick<T, ...>`，提取出这些键对应的属性，从而得到目标类型。
### 解答

```ts
// first solution
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
// second solution
type PickByType<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;
```

## 第三十五题 StartsWith

### 问题

实现`StartsWith<T, U>`,接收两个string类型参数,然后判断`T`是否以`U`开头,根据结果返回`true`或`false`

例如:

```typescript
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false
```

### 思路

1. **模板字符串匹配**\
   利用 TypeScript 模板字符串类型，通过 `${U}${string}` 模式来匹配所有以 `U` 开头的字符串。

2. **条件类型判断**\
   通过条件类型语法 ```T extends `${U}${string}` ? true : false``` 判断 `T` 是否符合以 `U` 开头的模式：若能匹配则返回 `true`，否则返回 `false`。

### 解答

```ts
type StartsWith<T extends string, U extends string> =
  T extends `${U}${string}` ? true : false;
```

## 第三十六题 EndsWith

### 问题

实现`EndsWith<T, U>`,接收两个string类型参数,然后判断`T`是否以`U`结尾,根据结果返回`true`或`false`

例如:

```typescript
type a = EndsWith<'abc', 'bc'> // expected to be true
type b = EndsWith<'abc', 'abc'> // expected to be true
type c = EndsWith<'abc', 'd'> // expected to be false
```

### 思路

与上题同理

### 解答

```ts
type EndsWith<T extends string, U extends string> = T extends `${string}${U}` ? true : false
```

## 第三十七题 PartialByKeys

### 问题

实现一个通用的`PartialByKeys<T, K>`，它接收两个类型参数`T`和`K`。

`K`指定应设置为可选的`T`的属性集。当没有提供`K`时，它就和普通的`Partial<T>`一样使所有属性都

是可选的。

例如:

```ts
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
```

### 思路

1. **约束并默认参数**  
   在泛型定义中直接写 `K extends keyof T = keyof T`，保证 `K` 必须是 `T` 的属性，且默认覆盖所有键。

2. **利用内置工具类型快速拆分**  
   - `Partial<Pick<T, K>>`：将 `K` 指定的属性设为可选。  
   - `Omit<T, K>`：将剩余属性保持必选。  
   直接组合这两者即可得到目标效果。

3. **扁平化交叉类型**  
   由于交叉类型会影响属性的 IDE 提示和顺序，通过 `extends infer O ? { [P in keyof O]: O[P] } : never` 再次映射，将结果扁平化。

### 解答

```ts
type PartialByKeys<T, K extends keyof T = keyof T> = Partial<Pick<T, K>> & Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }: never
```

## 第三十八题 RequiredByKeys

### 问题

实现一个通用的`RequiredByKeys<T, K>`，它接收两个类型参数`T`和`K`。

`K`指定应设为必选的`T`的属性集。当没有提供`K`时，它就和普通的`Required<T>`一样使所有的属性成

为必选的。

例如:

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }
```

### 思路

1. **定义 `Merge<T>` 扁平化映射**  
   ```ts
   type Merge<T> = { [P in keyof T]: T[P] }
   ```
   它只是把交叉类型或其他映射的结果再映射一遍，保证属性顺序和 IDE 补全。

2. **分别 Pick 后再合并**  
   - `Required<Pick<T, K>>`：把 `K` 指定的属性设为必选  
   - `Pick<T, Exclude<keyof T, K>>`：保留其余属性的原有可选/必选状态  

3. **整体合并并扁平化**  
   ```ts
   type RequiredByKeys<
     T,
     K extends keyof T = keyof T   // K 必须在 T 的键内，默认全键
   > = Merge<
     Required<Pick<T, K>>
     & Pick<T, Exclude<keyof T, K>>
   >
   ```

### 解答

```ts
// 扁平化辅助类型
type Merge<T> = { [P in keyof T]: T[P] }

// RequiredByKeys 实现
type RequiredByKeys<
  T,
  K extends keyof T = keyof T
> = Merge<
  Required<Pick<T, K>>
  & Pick<T, Exclude<keyof T, K>>
>
```

## 第三十九题 Mutable

### 问题

实现一个通用的类型 ```Mutable<T>```，使类型 `T` 的全部属性可变（非只读）。

例如：

```typescript
interface Todo {
  readonly title: string
  readonly description: string
  readonly completed: boolean
}

type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }
```

### 思路

1. **映射类型（Mapped Types）**：  
   TypeScript 提供了映射类型语法，用于基于已有类型创建新类型，例如：
   ```ts
   type Readonly<T> = { readonly [P in keyof T]: T[P] }
   ```
2. **去除修饰符（Modifier Removal）**：
   在映射类型中，可以使用 `-readonly` 或 `+readonly` 来显式地移除或添加 `readonly` 修饰符。
   ```ts
   type RemoveReadonly<T> = { -readonly [P in keyof T]: T[P] }
   ```

### 解答

```ts
type Mutable<T> = {
  - readonly[ P in keyof T]: T[P]
}
```
## 第四十题 OmitByType

### 问题

实现一个通用类型 `OmitByType<T, U>`，它会从类型 `T` 中移除所有属性类型可赋值给 `U` 的属性

For Example

```typescript
type OmitBoolean = OmitByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { name: string; count: number }
```

### 思路

1. **遍历所有属性**：  
   使用 `P in keyof T` 对源类型 `T` 的每个属性键进行遍历。  
2. **条件判断**：  
   对属性类型 `T[P]` 使用条件类型 `extends U` 判断是否可赋值给目标类型 `U`。  
3. **键重映射**：  
   利用映射类型中的 `as` 子句：如果 `T[P] extends U` 为 `true`，则将键名映射为 `never`（从结果中剔除）；否则保留原键 `P`。  
4. **保留属性类型**：  
   对于保留的键，直接将属性类型设为原类型 `T[P]`。  
### 解答

```ts
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}
```

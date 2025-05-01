# ts 避免分布式条件类型的非元组方法

在 ts 中，**分布式条件类型（Distributive Conditional Types）** 默认会对联合类型进行分发操作。除了使用 `[T] extends [U]` 的元组包装法外，还有以下方法可以禁用这一特性：

## 1. 交叉类型阻断法（需谨慎）
通过交叉类型 `T & {}` 阻断分发流程，保留联合类型的整体性。某些交叉类型可能避免分布，但需注意 `T & {}` 仍可能被视为裸类型。

### 代码实现
```ts
type NonDistributive<T> = (T & {}) extends U ? X : Y;
```

### 示例
```ts
type IsNever<T> = (T & {}) extends never ? true : false;

type Test1 = IsNever<never>;       // true ✅
type Test2 = IsNever<"a" | never>; // false ✅（分发被阻断）
```

### 原理
1. **交叉类型的作用**
  `T & {}` 的含义是将类型 `T` 与空对象类型交叉。对于非 `never` 类型：

    - 若 `T` 是具体类型（如 `string | number`），`T & {}` 等效于 `T`

    - 若 `T` 是 `never`，则 `never & {}` 仍为 `never`
2. **阻断分发的机制**
  ts 对条件类型 `T extends U ? X : Y` 的默认分发行为仅在 `T` 是"裸"类型参数时触发。通过修改类型参数形式（如 `T & {}`），可以绕过这一机制：
  ```ts
  // 默认分发行为（不期望）
  type Distributed<T> = T extends string ? true : false;
  type Result1 = Distributed<"a" | 1>; // boolean（等效于 true | false）

  // 使用交叉类型阻断分发
  type NonDistributive<T> = (T & {}) extends string ? true : false;
  type Result2 = NonDistributive<"a" | 1>; // false ✅（整体判断）
  ```

## 2. 函数参数逆变法
利用函数参数的逆变特性（Contravariance），将泛型参数作为函数参数类型进行整体判断。

### 代码实现
```ts
type NonDistributive<T> = 
  ((arg: T) => void) extends ((arg: U) => void) ? X : Y;
```

### 示例
```ts
type IsString<T> = 
  ((arg: T) => void) extends ((arg: string) => void) ? true : false;

type Test1 = IsString<"a" | "b">; // false ✅（整体判断）
type Test2 = IsString<string>;     // true ✅
```

### 原理
- 逆变（Contravariance）：函数参数类型遵循逆变规则，即 `(A => void) extends (B => void)` 当且仅当 `B extends A`
- 函数参数的逆变特性会阻止联合类型的分发。ts 在比较函数类型时会将 `T` 视为整体，而非逐个成员处理。

## 3. 映射类型包装法
通过映射类型转换联合类型，强制整体处理。

### 代码实现
```ts
type NonDistributive<T> = 
  { [K in keyof T]: T[K] } extends U ? X : Y;
```

### 示例
```ts
type CheckArray<T> = 
  { [K in keyof T]: T[K] } extends any[] ? true : false;

type Test1 = CheckArray<number[]>;  // true ✅
type Test2 = CheckArray<1 | 2>;     // false ✅（未分发）
```

### 原理
映射类型会将联合类型转换为对象类型，绕过默认的分发逻辑。`keyof T` 在此场景下会生成一个联合类型的键集合，但映射过程会强制整体处理。

## 4. 显式类型约束法
通过泛型约束限制联合类型的范围，间接避免分发。

### 代码实现
```ts
type NonDistributive<T extends Constraint> = T extends U ? X : Y;
```

### 示例
```ts
type ProcessNumbers<T extends number> = T extends 0 ? "Zero" : "Non-zero";
type Test = ProcessNumbers<0 | 1>; // "Zero" | "Non-zero" ✅（分发未被禁用，但约束了输入范围）
```

### 注意
此方法需结合其他技巧（如交叉类型阻断法）才能完全禁用分发。单独使用时仅限制输入类型范围。

## 5. 对象包装法
通过对象类型包装禁用分布式条件类型

### 代码实现
```ts
type NonDistributive<T> = { value: T } extends { value: infer U } ? U : never;
```

### 示例
```ts
type CheckString<T> = { value: T } extends { value: string } ? true : false;

// 测试
type Test1 = CheckString<"a" | "b">; // false ✅（整体判断 "a" | "b" 是否继承 string）
type Test2 = CheckString<string>;     // true ✅
```

## 方法对比与选择建议

| **方法**               | **适用场景**                | **优缺点**                     |
|------------------------|---------------------------|-------------------------------|
| 交叉类型阻断法         | 需保留原始类型推断         | 简单直接，但可能影响交叉类型逻辑 |
| 函数参数逆变法          | 函数类型处理              | 利用逆变特性，适合高阶类型工具  |
| 映射类型包装法          | 对象或数组类型处理         | 强制类型转换，适用于复杂结构    |
| 显式类型约束法          | 限制输入类型范围           | 需结合其他方法实现完整禁用      |
| 对象包装法          | 复杂业务对象模型           | 编译性能成本,冗余类型结构          |

## 实际应用案例

### 案例 1：禁用分发的类型过滤
```ts
type SafeExclude<T, U> = (T & {}) extends U ? never : T;

type Test1 = SafeExclude<"a" | "b", "a">; // "b" ✅（整体判断，非分发）
type Test2 = SafeExclude<number, 1>;       // number ✅
```

### 案例 2：联合类型的整体存在性检查
```ts
type ContainsString<T> = 
  ((arg: T) => void) extends ((arg: string) => void) ? true : false;

type Test1 = ContainsString<string | number>; // false ✅
type Test2 = ContainsString<string>;          // true ✅
```

### 案例 3：精确判断联合类型
```ts
type IsUnion<T> = [T] extends [any] 
  ? (T extends any ? ([any] extends [T] ? false : true) : never) 
  : false;

type Test1 = IsUnion<"a" | "b">; // true ✅
type Test2 = IsUnion<"a">;        // false ✅
```

### 案例 4：安全处理 API 响应
```ts
type ApiResponse<T> = 
  [T] extends [string | number] 
    ? { data: T[] } 
    : { error: string };

type Resp1 = ApiResponse<"ok" | 200>; // { data: ("ok" | 200)[] } ✅
type Resp2 = ApiResponse<boolean>;    // { error: string } ✅
```

## 总结
1. **核心目标**：将联合类型视为整体而非独立成员处理。
2. **推荐方案**：
   - 优先使用交叉类型阻断法（`T & {}`）
   - 函数参数逆变法适合处理高阶类型逻辑
3. **验证技巧**：通过 `never` 类型或交叉类型测试分发是否被禁用。

> **关键原则**  
> 当需要禁用联合类型的默认分发行为时，选择与场景匹配的非元组方法，确保类型系统的精确性和安全性。

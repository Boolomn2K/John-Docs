# TypeScript 中的 Top Type 和 Bottom Type

在 TypeScript 的类型系统中，**Top Type（顶层类型）** 和 **Bottom Type（底层类型）** 是类型层级理论的两个核心概念。理解它们对编写类型安全的代码至关重要。

## 一、Top Type（顶层类型）

### 定义
- **所有类型的父类型**，可以接受任何其他类型的赋值。
- TypeScript 中对应 `any` 和 `unknown`。

---

### 1. `any` 类型
**特点**：
- 可以接受任何类型的值（`string`、`number`、`object` 等）
- 可以赋值给任何其他类型（绕过类型检查）
- **完全关闭类型安全保护**，慎用

**示例**：
```typescript
let a: any = "hello";
a = 42;                   // ✅ 合法
let b: number = a;        // ✅ 合法（但运行时可能出错！）
```

---

### 2. `unknown` 类型
**特点**：
- 可以接受任何类型的值（类似 `any`）
- **不能直接赋值给其他类型**（需显式类型检查或断言）
- 强制开发者处理类型不确定性，更安全

**示例**：
```typescript
let u: unknown = JSON.parse('{"value": 100}'); // 动态内容

// 必须通过类型收窄（Type Narrowing）才能使用
if (typeof u === "object" && u !== null && "value" in u) {
  console.log(u.value);  // ✅ 合法（已确认 u 的类型）
}

// 直接赋值会报错
let n: number = u;       // ❌ 错误：需要类型断言（`u as number`）
```

---

## 二、Bottom Type（底层类型）

### 定义
- **所有类型的子类型**，可以赋值给任何其他类型，但自身只能接受 `never` 类型的值。
- TypeScript 中对应 `never`。

---

### `never` 类型
**特点**：
- 表示**永远不可能存在的值**（如抛出错误、死循环的函数返回值）
- 用于联合类型（Union Types）的**穷尽性检查**（Exhaustiveness Check）

**示例**：

#### 1. 抛出错误的函数
```typescript
function throwError(message: string): never {
  throw new Error(message); // 函数永远不会正常返回
}
```

#### 2. 穷尽性检查（确保处理所有分支）
```typescript
type Shape = "circle" | "square";

function handleShape(shape: Shape) {
  switch (shape) {
    case "circle": 
      // 处理圆形逻辑
      break;
    case "square": 
      // 处理方形逻辑
      break;
    default:
      // 如果未来新增类型（如 "triangle"），此处会报错
      const _exhaustiveCheck: never = shape; // ❌ 类型 'string' 不能赋值给 'never'
  }
}
```

---

## 三、关键特性对比

| **特性**              | `any`                     | `unknown`               | `never`                  |
|-----------------------|---------------------------|-------------------------|--------------------------|
| **可接受的值**         | 任何类型                  | 任何类型                | 无（只能接受 `never`）   |
| **可赋值给其他类型**   | ✅（不安全）              | ❌（需类型检查/断言）   | ✅（所有类型）           |
| **类型安全性**         | ❌（关闭检查）            | ✅（强制检查）          | ✅（表示不可能的值）     |

---

## 四、使用场景建议

- **`any`**  
  仅限快速原型开发或兼容旧代码，长期使用会破坏类型安全。

- **`unknown`**  
  处理动态内容（如第三方 API 响应、`JSON.parse` 结果）时优先使用。

- **`never`**  
  1. 标记无法返回的函数  
  2. 联合类型的穷尽性检查（避免遗漏分支逻辑）

---

## 总结
- 优先使用 `unknown` 替代 `any`，强制类型收窄以提高安全性
- 用 `never` 实现穷尽性检查，确保代码未来可维护性
- 理解类型层级（Type Hierarchy）是掌握 TypeScript 高级用法的基石

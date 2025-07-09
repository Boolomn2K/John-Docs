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

## 第二题

### 问题 

### 思路

### 解答

## 第三题

### 问题 

### 思路

### 解答

## 第四题

### 问题 

### 思路

### 解答

## 第五题

### 问题 

### 思路

### 解答

## 第六题

### 问题 

### 思路

### 解答

## 第七题

### 问题 

### 思路

### 解答

## 第八题

### 问题 

### 思路

### 解答

## 第九题

### 问题 

### 思路

### 解答

## 第十题

### 问题 

### 思路

### 解答

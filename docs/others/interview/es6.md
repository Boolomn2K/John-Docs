# ES6

## 1.`let`、`const`和`var`的概念与区别

### 概念与区别
- **作用域**：`var` 是函数作用域，`let` 和 `const` 是块级作用域（`{}` 内有效）。
- **变量提升**：`var` 存在变量提升，`let` 和 `const` 存在暂时性死区（TDZ），不会提升。
- **重复声明**：`var` 允许重复声明，`let` 和 `const` 不允许。
- **初始值**：`const` 声明时必须赋值且不可修改（引用类型可修改属性）。

### 代码示例
```js
// 作用域对比
testVar(); // 可访问 varVariable
testLet(); // 报错：Cannot access 'letVariable' before initialization

function testVar() {
  if (true) {
    var varVariable = 'var';
    let letVariable = 'let';
    const constVariable = 'const';
  }
  console.log(varVariable); // 'var'（函数作用域）
  console.log(letVariable); // 报错（块级作用域）
}

function testLet() {
  console.log(letVariable); // TDZ 暂时性死区
  let letVariable = 'let';
}

// 重复声明
testRepeat(); // 报错：Identifier 'a' has already been declared
function testRepeat() {
  var a = 1;
  let a = 2; // 重复声明报错
}

// const 特性
const PI = 3.14;
PI = 3.1415; // 报错：Assignment to constant variable

const obj = { name: 'es6' };
obj.name = 'ES6'; // 允许修改引用类型属性
obj = {}; // 报错：Assignment to constant variable
```

### 面试要点
- 优先使用 `const`，避免意外修改；变量可能被重新赋值时使用 `let`。
- 块级作用域解决了 `var` 导致的内层变量覆盖外层变量、循环计数泄露为全局变量等问题。

## 2.变量提升与暂时性死区

### 概念解析
- **变量提升（Hoisting）**：`var` 声明的变量会被提升到作用域顶部，但仅提升声明（赋值保留在原地）。
- **暂时性死区（TDZ）**：`let`/`const` 声明的变量存在块级作用域的“死区”，从作用域开始到变量声明行之间，访问变量会报错。

### 代码示例对比
```js
// var 变量提升
a = 10;
console.log(a); // 10（声明提升）
var a;

// var 函数作用域提升
function testVarHoist() {
  console.log(x); // undefined（声明提升，赋值未提升）
  if (false) {
    var x = 10;
  }
}

testVarHoist();

// let/const 暂时性死区
try {
  console.log(y); // TDZ 区域，报错
  let y = 20;
} catch (e) {
  console.log(e.message); // Cannot access 'y' before initialization
}

// TDZ 跨块级作用域示例
testTDZ(); // 正常执行
function testTDZ() {
  const a = 1;
  if (true) {
    // 此处为 b 的 TDZ 开始
    console.log(a); // 1（访问外部作用域变量正常）
    const b = 2; // b 的 TDZ 结束
    console.log(b); // 2
  }
}
```

### 面试要点
- **本质区别**：`var` 提升会导致变量可在声明前访问（值为 undefined），而 `let`/`const` 的 TDZ 强制开发者先声明后使用，减少逻辑错误。
- **常见误区**：`let`/`const` 并非完全不提升，而是提升后处于 TDZ 中，访问即报错（与未声明变量的“ReferenceError”不同）。

## 3.变量的结构赋值

### 概念解析
- **结构赋值**：ES6 允许按照一定模式从数组或对象中提取值，并赋值给变量，简化数据提取过程。
- **核心特点**：匹配模式（数组按索引，对象按属性名）、支持嵌套结构、可设置默认值。

### 代码示例（数组结构赋值）
```js
// 基本用法
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 跳过元素
const [x, , z] = [10, 20, 30];
console.log(x, z); // 10 30

// 剩余元素（必须是最后一个）
const [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail); // 1 [2, 3, 4]

// 默认值（当解构值为 undefined 时生效）
const [m = 0, n = 0] = [5];
console.log(m, n); // 5 0

// 嵌套数组
const [p, [q, r]] = [1, [2, 3]];
console.log(p, q, r); // 1 2 3
```

### 代码示例（对象结构赋值）
```js
// 基本用法（按属性名匹配）
const { name, age } = { name: 'Alice', age: 20 };
console.log(name, age); // Alice 20

// 重命名变量
const { id: userId, score: userScore } = { id: 1001, score: 90 };
console.log(userId, userScore); // 1001 90

// 默认值
const { city = 'Beijing', gender = 'unknown' } = { city: 'Shanghai' };
console.log(city, gender); // Shanghai unknown

// 嵌套对象
const { info: { address } } = { info: { address: 'China', zip: '100000' } };
console.log(address); // China

// 函数参数解构
function printUser({ name, age = 18 }) {
  console.log(`Name: ${name}, Age: ${age}`);
}
printUser({ name: 'Bob' }); // Name: Bob, Age: 18
```

### 实际应用场景
```js
// 交换变量
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1

// 提取函数返回值
function getUser() {
  return { id: 1, name: 'Charlie', roles: ['user', 'admin'] };
}
const { name, roles } = getUser();
console.log(name, roles); // Charlie ['user', 'admin']

// 忽略不需要的返回值
const [, second] = ['a', 'b', 'c'];
console.log(second); // b
```

### 面试要点
- **匹配规则**：数组按位置匹配，对象按属性名匹配（与顺序无关）。
- **默认值触发条件**：只有当解构的值严格等于 `undefined` 时，默认值才会生效（`null` 不会触发）。
- **性能考量**：解构赋值本质是语法糖，不会影响性能，但能显著提升代码可读性。
## 4.箭头函数及其`this`问题

### 概念与语法
- **箭头函数（Arrow Function）**：ES6 新增的函数简写语法，使用 `=>` 定义，具有词法绑定 `this` 的特性。
- **核心语法**：
  - 单参数可省略括号：`x => x * 2`
  - 多参数需括号：`(x, y) => x + y`
  - 函数体多语句需大括号和 return：`(x, y) => { return x + y; }`
  - 隐式返回对象需加括号：`() => ({ name: 'arrow' })`

### `this` 绑定规则对比
| 函数类型       | `this` 指向                          | 能否用 `call/apply/bind` 修改 | 构造函数使用 |
|----------------|--------------------------------------|------------------------------|--------------|
| 普通函数       | 调用时的上下文对象（动态绑定）        | 能                           | 能           |
| 箭头函数       | 定义时的外层 lexical `this`（静态绑定）| 不能（绑定后无法修改）        | 不能（报错） |

### 代码示例：`this` 行为差异
```js
// 1. 全局作用域中的 this
const globalArrow = () => console.log(this);
function globalNormal() { console.log(this); }

globalArrow(); // Window（浏览器环境）/ global（Node）
globalNormal(); // Window / global

// 2. 对象方法中的 this
const obj = {
  name: 'Test',
  arrowMethod: () => console.log(this.name), // this 继承自外层（全局）
  normalMethod: function() { console.log(this.name); } // this 指向 obj
};

obj.arrowMethod(); // undefined（全局 this 无 name 属性）
obj.normalMethod(); // 'Test'

// 3. 事件回调中的 this
const button = document.createElement('button');
button.textContent = 'Click';

button.addEventListener('click', function() {
  console.log(this); // 指向 button 元素（普通函数动态绑定）
});

button.addEventListener('click', () => {
  console.log(this); // 指向外层 this（如 Window）
});

// 4. 构造函数中的 this
const ArrowConstructor = () => {};
try {
  new ArrowConstructor(); // 箭头函数不能作为构造函数
} catch (e) {
  console.log(e.message); // "ArrowConstructor is not a constructor"
}
```

### 箭头函数适用场景
```js
// 1. 简化回调函数
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // [2, 4, 6]

// 2. 解决异步回调 this 丢失问题
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++; // 继承 Timer 实例的 this
    console.log(this.seconds);
  }, 1000);
}
new Timer(); // 每秒输出 1, 2, 3...（普通函数需用 bind 绑定 this）

// 3. 简洁返回值
const getUser = () => ({
  id: 1,
  name: 'Arrow User'
});
```

### 面试陷阱与注意事项
```js
// 反例1：对象方法误用箭头函数
const counter = {
  count: 0,
  increment: () => { this.count++; } // this 指向全局，无法修改 counter.count
};
counter.increment();
console.log(counter.count); // 0（未被修改）

// 反例2：原型方法使用箭头函数
function Person(name) { this.name = name; }
Person.prototype.sayHi = () => { console.log(this.name); };
const person = new Person('Alice');
person.sayHi(); // undefined（this 非实例对象）
```

### 面试要点
- **核心区别**：箭头函数无独立 `this`，继承自外层 lexical context；无 `arguments` 对象；不能用作构造函数。
- **使用建议**：优先用于纯函数/回调函数，避免用作对象方法、构造函数或需要动态 `this` 的场景。
- **绑定验证**：可通过 `call` 测试 `this` 能否修改（箭头函数修改无效）。
## 5.`Symbol`概念及其作用

### 概念解析
- **Symbol**：ES6 新增的第七种原始数据类型，表示**唯一且不可变**的值，主要用于解决对象属性名冲突问题。
- **核心特性**：
  - 唯一性：即使描述符相同，两个 Symbol 也不相等
  - 不可枚举：Symbol 作为对象属性时，不会被 `for...in`/`Object.keys()` 遍历到
  - 不可隐式转换：不能与字符串/数字直接拼接，需显式调用 `toString()`

### 基本使用与唯一性验证
```js
// 创建 Symbol（可选描述符，仅用于调试）
const s1 = Symbol('desc');
const s2 = Symbol('desc');
console.log(s1 === s2); // false（描述符相同也不相等）

// 使用 Symbol.for() 创建可复用 Symbol
const s3 = Symbol.for('global'); // 注册到全局 Symbol 注册表
const s4 = Symbol.for('global');
console.log(s3 === s4); // true（全局注册表中复用）

// 获取 Symbol 描述符
console.log(s1.description); // 'desc'（ES2019 新增）
console.log(Symbol.keyFor(s3)); // 'global'（仅对 Symbol.for 创建的有效）
```

### 作为对象属性的应用
```js
// 1. 避免属性名冲突
const name = Symbol('name');
const obj = {
  [name]: 'Symbol Property', // 作为属性名需用方括号
  age: 20
};

console.log(obj[name]); // 'Symbol Property'（必须用 Symbol 变量访问）

// 2. 定义“私有”属性（非真正私有，仅不可枚举）
const privateMethod = Symbol('private');
class MyClass {
  [privateMethod]() {
    return 'This is a pseudo-private method';
  }

  publicMethod() {
    return this[privateMethod]();
  }
}

const instance = new MyClass();
console.log(instance.publicMethod()); // 'This is a pseudo-private method'
console.log(instance[privateMethod]); // undefined（外部无法直接访问 Symbol 属性）

// 3. 遍历 Symbol 属性
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(name)]（获取所有 Symbol 属性）
console.log(Reflect.ownKeys(obj)); // [Symbol(name), 'age']（获取所有类型属性）
```

### 内置 Well-known Symbols
ES6 提供了一批内置 Symbol，用于修改对象的默认行为（称为“元编程”）：
```js
// 1. Symbol.iterator：定义对象的迭代器接口
const iterableObj = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.items[index++],
        done: index > this.items.length
      })
    };
  }
};
for (const item of iterableObj) { console.log(item); } // 1 2 3

// 2. Symbol.toStringTag：自定义对象的 toString 结果
const customObj = {
  [Symbol.toStringTag]: 'CustomObject'
};
console.log(Object.prototype.toString.call(customObj)); // '[object CustomObject]'

// 3. Symbol.hasInstance：自定义 instanceof 行为
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof MyArray); // true（自定义 instanceof 判断）
```

### 实际应用场景
```js
// 1. 模块间常量共享
// moduleA.js
export const STATUS = {
  PENDING: Symbol('pending'),
  RESOLVED: Symbol('resolved')
};

// moduleB.js
import { STATUS } from './moduleA.js';
if (status === STATUS.PENDING) { /* 避免字符串常量冲突 */ }

// 2. 扩展内置对象方法
Array.prototype[Symbol('customFilter')] = function(callback) {
  return this.filter(callback);
};
[1, 2, 3][Symbol('customFilter')](x => x > 1); // [2, 3]
```

### 面试要点
- **唯一性本质**：Symbol 是原始类型，每个 Symbol 实例独立存在，`Symbol.for()` 通过全局注册表实现复用。
- **与其他类型区别**：
  - 和字符串：Symbol 不可隐式转换，字符串可重复
  - 和对象：Symbol 作为属性不可枚举，对象属性默认可枚举
- **元编程能力**：通过 Well-known Symbols 可修改内置行为（如迭代、类型判断），是高级 ES6 特性的基础。
## 6.`Set` 和 `Map`数据结构

### 概念解析
- **Set**：无序且唯一的元素集合，不允许重复值，支持添加/删除/查找操作。
- **Map**：键值对集合，键可以是任意类型（原始值/对象），保持插入顺序，支持键值对的增删改查。
- **核心区别**：
  - Set 存储单一元素，类似“值的集合”
  - Map 存储键值对，类似“键到值的映射”
  - 两者均不支持重复键/值（Set 的值唯一，Map 的键唯一）

### Set 基本用法与方法
```js
// 创建 Set
const s = new Set();
const sWithValues = new Set([1, 2, 3, 3]); // 自动去重，结果: {1, 2, 3}

// 添加元素
s.add('a').add('b').add('a'); // 链式调用，重复值' a' 被忽略
console.log(s.size); // 2（当前元素数量）

// 检查元素
console.log(s.has('a')); // true

// 删除元素
console.log(s.delete('b')); // true（删除成功返回 true）
console.log(s.delete('c')); // false（元素不存在返回 false）

// 遍历元素
const numberSet = new Set([1, 2, 3]);
numberSet.forEach(value => console.log(value)); // 1 2 3
for (const value of numberSet) { console.log(value); } // 1 2 3

// 清空集合
numberSet.clear();
console.log(numberSet.size); // 0
```

### Map 基本用法与方法
```js
// 创建 Map
const m = new Map();
const mWithEntries = new Map([
  ['name', 'Map'],
  [123, 'number key'],
  [true, 'boolean key']
]);

// 添加键值对
m.set('age', 5).set({ obj: 'key' }, 'object value'); // 支持任意类型键
console.log(m.size); // 2

// 获取值
console.log(mWithEntries.get('name')); // 'Map'
console.log(m.get({ obj: 'key' })); // undefined（对象键引用不同）

// 检查键
console.log(m.has('age')); // true

// 删除键值对
m.delete('age');
console.log(m.size); // 1

// 遍历键值对
mWithEntries.forEach((value, key) => {
  console.log(`${key}: ${value}`); // name: Map, 123: number key, true: boolean key
});

// 获取键/值迭代器
for (const key of mWithEntries.keys()) { console.log(key); } // 'name', 123, true
for (const value of mWithEntries.values()) { console.log(value); } // 'Map', 'number key', 'boolean key'
for (const [key, value] of mWithEntries.entries()) { console.log(key, value); }
```

### 与传统数据结构的对比
| 特性/结构       | Array               | Object               | Set                  | Map                  |
|-----------------|---------------------|----------------------|----------------------|----------------------|
| 存储形式        | 索引-值             | 字符串键-值          | 唯一值集合           | 任意键-值对          |
| 重复值/键       | 允许重复值          | 键自动转为字符串     | 不允许重复值         | 键唯一（引用类型独立）|
| 插入顺序        | 有序                | ES6 后有序           | 有序（插入顺序）     | 有序（插入顺序）     |
| 迭代方式        | forEach, for...of   | for...in, Object.keys| forEach, for...of    | forEach, for...of    |
| 大小获取        | length 属性         | Object.keys(obj).length| size 属性           | size 属性           |

### 实际应用场景
```js
// 1. Set 数组去重
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = [...new Set(arr)]; // [1, 2, 3]

// 2. Set 存储 DOM 元素（避免重复操作）
const processedElements = new Set();
function processElement(el) {
  if (processedElements.has(el)) return;
  processedElements.add(el);
  // 处理元素逻辑...
}

// 3. Map 缓存（支持非字符串键）
const cache = new Map();
function getFromCache(key) {
  if (cache.has(key)) return cache.get(key);
  const result = expensiveCalculation(key);
  cache.set(key, result);
  return result;
}

// 4. Map 保留插入顺序的配置表
const config = new Map([
  ['debug', false],
  ['logLevel', 'info'],
  ['maxRetries', 3]
]);
// 按插入顺序遍历配置
for (const [key, value] of config) { console.log(`${key}=${value}`); }
```

### WeakSet 与 WeakMap 简介
- **WeakSet**：仅存储对象，弱引用（不阻止垃圾回收），不可遍历，无 size 属性。适用于临时关联对象。
- **WeakMap**：键必须是对象，弱引用（键对象回收后自动删除条目），不可遍历。适用于对象元数据存储。
```js
// WeakMap 示例：为 DOM 元素附加私有数据
const elementData = new WeakMap();
function attachData(el, data) {
  elementData.set(el, data);
}
function getData(el) {
  return elementData.get(el);
}
// 当 el 从 DOM 移除并被垃圾回收，对应数据自动清除
```

### 面试要点
- **选择策略**：需要唯一值用 Set，键值对用 Map，简单值列表用 Array，字符串键配置用 Object。
- **性能考量**：Set 的 has 操作复杂度为 O(1)（Array 的 includes 为 O(n)），Map 的查找性能优于 Object。
- **弱引用特性**：WeakSet/WeakMap 不会内存泄漏，适合临时关联数据，但功能有限（不可遍历、无 size）。
- **常见误区**：Map 的键是按引用比较的（对象键即使内容相同也视为不同），需注意引用一致性。
## 7.`Proxy`

### 概念解析
- **Proxy**：ES6 新增的对象代理机制，用于创建一个对象的“代理”，从而实现对目标对象基本操作的拦截和自定义（如属性读取、赋值、删除等）。
- **核心语法**：`new Proxy(target, handler)`，其中：
  - `target`：被代理的目标对象（可以是任何类型的对象，包括数组、函数等）
  - `handler`：拦截行为定义对象，包含各种“陷阱方法”（trap）
  - 返回值：一个全新的代理对象，对原对象的操作需通过代理对象进行

### 常用陷阱方法（Trap）与示例
#### 1. 基础数据拦截（get/set/has/deleteProperty）
```js
const user = {
  name: 'Alice',
  age: 20
};

// 创建代理对象
const userProxy = new Proxy(user, {
  // 拦截属性读取：target 目标对象，propKey 属性名，receiver 代理对象
  get(target, propKey, receiver) {
    // 不存在的属性返回默认值
    if (!Reflect.has(target, propKey)) {
      return `[${propKey}] 属性不存在`;
    }
    console.log(`读取属性：${propKey}`);
    return Reflect.get(target, propKey, receiver); // 调用原始操作
  },

  // 拦截属性赋值：target 目标对象，propKey 属性名，value 新值，receiver 代理对象
  set(target, propKey, value, receiver) {
    // 年龄必须是数字且大于 0
    if (propKey === 'age' && (typeof value !== 'number' || value <= 0)) {
      throw new Error('年龄必须是正数');
    }
    console.log(`设置属性：${propKey} = ${value}`);
    return Reflect.set(target, propKey, value, receiver); // 调用原始操作
  },

  // 拦截 in 运算符：target 目标对象，propKey 属性名
  has(target, propKey) {
    console.log(`检测属性是否存在：${propKey}`);
    return Reflect.has(target, propKey);
  },

  // 拦截 delete 操作：target 目标对象，propKey 属性名
  deleteProperty(target, propKey) {
    if (propKey === 'name') {
      throw new Error('name 属性不可删除');
    }
    console.log(`删除属性：${propKey}`);
    return Reflect.deleteProperty(target, propKey);
  }
});

// 测试代理行为
console.log(userProxy.name); // 读取属性：name → Alice
userProxy.age = 25; // 设置属性：age = 25
console.log('age' in userProxy); // 检测属性是否存在：age → true
userProxy.gender = 'female';
console.log(userProxy.gender); // [gender] 属性不存在
// delete userProxy.name; // 抛出错误：name 属性不可删除
```

#### 2. 函数与构造函数拦截（apply/construct）
```js
// 拦截函数调用
function sum(a, b) {
  return a + b;
}

const sumProxy = new Proxy(sum, {
  // 拦截函数调用：target 目标函数，thisArg 函数上下文，argumentsList 参数列表
  apply(target, thisArg, argumentsList) {
    console.log(`调用函数：${target.name}(${argumentsList.join(', ')})`);
    const result = Reflect.apply(target, thisArg, argumentsList);
    return result * 2; // 结果翻倍
  },

  // 拦截 new 调用：target 目标构造函数，argumentsList 参数列表，newTarget 创建实例的构造函数
  construct(target, argumentsList, newTarget) {
    console.log(`new 调用：${target.name}(${argumentsList.join(', ')})`);
    return Reflect.construct(target, argumentsList, newTarget);
  }
});

console.log(sumProxy(1, 2)); // 调用函数：sum(1, 2) → 6（原始结果 3 * 2）
new sumProxy(3, 4); // new 调用：sum(3, 4)
```

### 与 Object.defineProperty 的对比
| 特性                | Proxy                          | Object.defineProperty         |
|---------------------|--------------------------------|--------------------------------|
| 拦截范围            | 支持 13 种操作（get/set/delete 等） | 仅支持 get/set 等少数操作       |
| 数组代理            | 原生支持数组索引/方法拦截        | 需手动重写数组方法（如 push）    |
| 新增属性拦截        | 自动拦截新增属性                | 需重新定义属性才能拦截          |
| 嵌套对象代理        | 需手动递归代理嵌套对象          | 需手动递归定义嵌套属性          |
| 返回值              | 返回新代理对象，不修改原对象     | 直接修改原对象属性描述符        |

### 实际应用场景
#### 1. 数据校验与格式化
```js
const validator = {
  set(target, prop, value) {
    const rules = {
      name: v => typeof v === 'string' && v.length > 0,
      email: v => /^\S+@\S+\.\S+$/.test(v),
      age: v => typeof v === 'number' && v >= 0 && v <= 120
    };

    if (rules[prop] && !rules[prop](value)) {
      throw new Error(`${prop} 格式无效`);
    }
    target[prop] = value;
    return true;
  }
};

const user = new Proxy({}, validator);
user.name = 'Bob'; // 有效
user.age = 150; // 抛出错误：age 格式无效
```

#### 2. 实现响应式数据（Vue3 响应式原理）
```js
function reactive(target) {
  return new Proxy(target, {
    get(target, prop) {
      track(target, prop); // 依赖收集
      return isObject(target[prop]) ? reactive(target[prop]) : target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      trigger(target, prop); // 触发更新
      return true;
    }
  });
}
// 注：实际实现需配合 track/trigger 函数管理依赖
```

#### 3. 日志记录与性能监控
```js
function createLoggedProxy(target, name) {
  return new Proxy(target, {
    get(target, prop) {
      console.time(`${name}.${prop}`);
      const result = target[prop];
      console.timeEnd(`${name}.${prop}`);
      return result;
    }
  });
}

const api = createLoggedProxy({
  fetchData: () => new Promise(resolve => setTimeout(resolve, 100))
}, 'api');
api.fetchData(); // 输出：api.fetchData: 100ms+（监控函数执行时间）
```

### 面试要点
- **核心价值**：Proxy 是 ES6 提供的“元编程”能力，允许开发者自定义对象的基本操作逻辑，是实现框架（如 Vue/React）响应式、状态管理、数据校验的核心技术。
- **局限性**：
  - 无法拦截原对象的操作（必须通过代理对象访问才生效）
  - 兼容性：不支持 IE 浏览器，需通过 Babel 转译（但无法完全 polyfill 所有特性）
  - 性能：简单场景下略低于直接操作对象，但现代浏览器优化良好
- **经典问题**：
  - “Proxy 相比 Object.defineProperty 有哪些优势？”（参考对比表格）
  - “如何用 Proxy 实现一个简单的双向绑定？”（结合 get/set 拦截 + DOM 事件监听）
## 8.`Reflect`对象

### 概念解析
- **Reflect**：ES6 新增的内置对象，提供了一组用于操作对象的静态方法，这些方法与 Proxy 陷阱方法一一对应，旨在：
  - 将 Object 上的一些命令式操作（如 `delete obj.prop`）改为函数式调用（如 `Reflect.deleteProperty(obj, 'prop')`）
  - 统一对象操作的返回值（成功/失败用布尔值表示，而非抛出错误）
  - 与 Proxy 配合使用，简化拦截操作的实现

### 常用方法与示例
#### 1. 基本属性操作（get/set/has/deleteProperty）
```js
const obj = {
  name: 'Reflect',
  age: 5,
  get info() { return `${this.name} (${this.age})`; }
};

// 1. Reflect.get(target, propKey [, receiver])：读取属性值
console.log(Reflect.get(obj, 'name')); // 'Reflect'
// 支持 receiver 绑定 this（用于访问器属性）
console.log(Reflect.get(obj, 'info', { name: 'Proxy', age: 3 })); // 'Proxy (3)'

// 2. Reflect.set(target, propKey, value [, receiver])：设置属性值
console.log(Reflect.set(obj, 'age', 6)); // true（设置成功返回 true）
console.log(obj.age); // 6
// 设置不存在的属性
console.log(Reflect.set(obj, 'gender', 'unknown')); // true
console.log(obj.gender); // 'unknown'

// 3. Reflect.has(target, propKey)：检测属性是否存在（对应 in 运算符）
console.log(Reflect.has(obj, 'name')); // true
console.log(Reflect.has(obj, 'address')); // false

// 4. Reflect.deleteProperty(target, propKey)：删除属性（对应 delete 运算符）
console.log(Reflect.deleteProperty(obj, 'gender')); // true
console.log(obj.gender); // undefined
console.log(Reflect.deleteProperty(obj, 'nonExistent')); // true（删除不存在属性返回 true）
```

#### 2. 函数与构造函数操作（apply/construct）
```js
// 5. Reflect.apply(target, thisArg, args)：调用函数（对应 Function.prototype.apply）
function sum(a, b) { return a + b; }
console.log(Reflect.apply(sum, null, [1, 2])); // 3

// 6. Reflect.construct(target, args [, newTarget])：创建实例（对应 new 运算符）
class Person {
  constructor(name) { this.name = name; }
}
const instance = Reflect.construct(Person, ['Alice']);
console.log(instance instanceof Person); // true
console.log(instance.name); // 'Alice'
// 指定新的构造函数（继承）
class Student extends Person {}
const student = Reflect.construct(Person, ['Bob'], Student);
console.log(student instanceof Student); // true
```

#### 3. 属性描述符操作（getOwnPropertyDescriptor/defineProperty）
```js
// 7. Reflect.getOwnPropertyDescriptor(target, propKey)：获取属性描述符
const desc = Reflect.getOwnPropertyDescriptor(obj, 'name');
console.log(desc); // { value: 'Reflect', writable: true, enumerable: true, configurable: true }

// 8. Reflect.defineProperty(target, propKey, descriptor)：定义属性
console.log(Reflect.defineProperty(obj, 'id', { value: 1001, writable: false })); // true
console.log(obj.id); // 1001
obj.id = 2002; // 严格模式下会报错，非严格模式忽略
console.log(obj.id); // 1001
```

### 与 Object 方法的对比
| 操作场景               | Object 方法                          | Reflect 方法                          | 核心差异点                     |
|------------------------|-------------------------------------|--------------------------------------|--------------------------------|
| 删除属性               | `delete obj.prop`（返回布尔值）      | `Reflect.deleteProperty(obj, 'prop')`（返回布尔值） | 语法形式不同，功能一致         |
| 定义属性               | `Object.defineProperty(obj, prop, desc)`（失败抛出错误） | `Reflect.defineProperty(obj, prop, desc)`（失败返回 false） | 返回值类型不同（无返回值 vs 布尔值） |
| 检测属性存在           | `'prop' in obj`（返回布尔值）        | `Reflect.has(obj, 'prop')`（返回布尔值） | 语法形式不同，功能一致         |
| 获取原型               | `Object.getPrototypeOf(obj)`        | `Reflect.getPrototypeOf(obj)`        | 完全一致                       |
| 设置原型               | `Object.setPrototypeOf(obj, proto)`（失败抛出错误） | `Reflect.setPrototypeOf(obj, proto)`（失败返回 false） | 返回值类型不同（对象 vs 布尔值） |

### 与 Proxy 配合使用示例
```js
const user = {
  name: 'Proxy & Reflect',
  age: 20
};

const userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    console.log(`读取属性：${prop}`);
    // 使用 Reflect 调用原始操作，确保 receiver 正确绑定
    return Reflect.get(target, prop, receiver); 
  },
  set(target, prop, value, receiver) {
    console.log(`设置属性：${prop} = ${value}`);
    // 使用 Reflect 简化返回值处理（自动返回布尔值）
    return Reflect.set(target, prop, value, receiver);
  }
});

userProxy.age = 21; // 设置属性：age = 21 → 返回 true
console.log(userProxy.name); // 读取属性：name → "Proxy & Reflect"
```

### 实际应用场景
#### 1. 安全的属性操作（避免错误抛出）
```js
// 传统方式：删除不存在的属性不会报错，但无法判断是否成功
const obj = { a: 1 };
delete obj.b; // 无返回值，无法确认操作结果

// Reflect 方式：返回布尔值表示操作成功与否
if (Reflect.deleteProperty(obj, 'b')) {
  console.log('删除成功');
} else {
  console.log('删除失败（属性不存在）');
}
```

#### 2. 动态调用函数
```js
// 统一处理函数调用参数
function callFn(fn, ...args) {
  // 自动处理 this 绑定和参数传递
  return Reflect.apply(fn, null, args);
}

console.log(callFn(Math.max, 1, 3, 2)); // 3
console.log(callFn((a, b) => a * b, 4, 5)); // 20
```

### 面试要点
- **设计初衷**：Reflect 不是为了替代 Object，而是提供更规范、更函数式的对象操作方式，尤其适合与 Proxy 配合实现复杂拦截逻辑。
- **核心优势**：
  - **返回值标准化**：所有操作返回布尔值表示成功状态，便于错误处理（如 `Reflect.defineProperty` 失败返回 false 而非抛出错误）
  - **参数一致性**：方法参数顺序统一为 `(target, propKey, ...)`，符合直觉
  - **上下文绑定**：支持 receiver 参数，确保访问器属性的 this 指向正确
- **与 Proxy 的关系**：Proxy 陷阱方法的默认实现就是通过 Reflect 完成的（如 `handler.get = (target, prop) => Reflect.get(target, prop)`），二者配合使用可大幅简化代理逻辑的编写。
## 9.`Promise`(手撕`Promise` A+规范、`Promise.all`、`Promise`相关`API`和方法)

### 概念解析
- **Promise**：ES6 异步编程解决方案，表示异步操作的最终结果（成功/失败）。
- **核心特性**：
  - **状态不可逆**：pending → fulfilled/rejected，一旦改变无法逆转
  - **链式调用**：通过 `then` 实现异步操作顺序执行
  - **异常冒泡**：错误自动传递至最近的 `catch`

### 基础用法
```js
// 创建Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功结果'); // 状态变为fulfilled
    // reject(new Error('失败原因')); // 状态变为rejected
  }, 1000);
});

// 消费Promise
promise
  .then(result => console.log('成功回调:', result))
  .catch(error => console.log('错误捕获:', error.message))
  .finally(() => console.log('无论结果执行'));
```

### 核心API速查表
| 方法                | 作用                          | 示例                                  |
|---------------------|-------------------------------|---------------------------------------|
| `then(onFulfilled, onRejected)` | 处理成功/失败回调 | `promise.then(res => {}, err => {})`  |
| `catch(onRejected)` | 捕获错误（then语法糖）         | `promise.catch(err => {})`            |
| `finally(onFinally)`| 无论结果执行                  | `promise.finally(() => {})`           |
| `Promise.all(iterable)` | 等待所有完成       | `Promise.all([p1, p2]).then(res => {})`|

### 面试手撕Promise核心实现
```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(cb => cb());
      }
    };

    const reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(cb => cb());
      }
    };

    try { executor(resolve, reject); } catch (err) { reject(err); }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };

    return new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try { resolve(onFulfilled(this.value)); } catch (e) { reject(e); }
        }, 0);
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try { resolve(onRejected(this.reason)); } catch (e) { reject(e); }
        }, 0);
      }

      if (this.status === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try { resolve(onFulfilled(this.value)); } catch (e) { reject(e); }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try { resolve(onRejected(this.reason)); } catch (e) { reject(e); }
          }, 0);
        });
      }
    });
  }
}
```

### 面试要点
- **状态不可逆**：一旦变为fulfilled/rejected，无法再次改变
- **微任务执行**：then/catch回调会放入微任务队列，异步执行
- **常见考点**：手写Promise.all、Promise.race、Promise实现原理

## 10.`Iterator`和`for...of`(`Iterator`遍历器的实现)

### 概念解析
- **Iterator（遍历器）**：ES6 提供的统一遍历接口，用于遍历数据结构中的元素。任何数据结构只要部署了 `Symbol.iterator` 属性（返回遍历器对象），就可被 `for...of` 循环遍历。
- **核心作用**：为不同数据结构（数组、对象、Set、Map 等）提供统一的遍历语法（`for...of`），替代传统的 `for` 循环和 `forEach`。

### 遍历器协议与实现
遍历器对象需包含 `next()` 方法，返回 `{ value: 当前值, done: 是否完成 }` 对象：
```js
// 手动实现遍历器
const iterator = {
  index: 0,
  data: [1, 2, 3],
  next() {
    if (this.index < this.data.length) {
      return { value: this.data[this.index++], done: false };
    } else {
      return { value: undefined, done: true };
    }
  }
};

// 使用遍历器
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### 可迭代对象与`for...of`
**可迭代对象**：部署了 `Symbol.iterator` 属性的对象（数组、Set、Map、字符串等原生支持）。`for...of` 会自动调用对象的遍历器：
```js
// 数组（原生可迭代）
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item); // 1 2 3
}

// 字符串（原生可迭代）
const str = 'hello';
for (const char of str) {
  console.log(char); // h e l l o
}

// Set（原生可迭代）
const set = new Set([1, 2, 2, 3]);
for (const value of set) {
  console.log(value); // 1 2 3（自动去重）
}

// 手动让对象可迭代
const obj = {
  data: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
for (const item of obj) {
  console.log(item); // a b c
}
```

### 与其他遍历方式对比
| 遍历方式       | 适用场景                | 缺点                                  |
|----------------|-------------------------|---------------------------------------|
| `for` 循环     | 所有可索引数据结构      | 语法繁琐，需手动控制索引              |
| `forEach`      | 数组/类数组             | 无法中途跳出（break/return 无效）     |
| `for...in`     | 对象（遍历键名）        | 遍历原型链属性，不适用于数组          |
| `for...of`     | 所有可迭代对象          | 需对象部署 Symbol.iterator            |

### 实际应用场景
#### 1. 遍历自定义数据结构
```js
// 实现一个范围迭代器
class RangeIterator {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    return {
      current: this.start,
      end: this.end,
      next() {
        if (this.current <= this.end) {
          return { value: this.current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// 使用 for...of 遍历范围
for (const num of new RangeIterator(1, 5)) {
  console.log(num); // 1 2 3 4 5
}
```

#### 2. 解构赋值与扩展运算符
可迭代对象支持解构赋值和扩展运算符：
```js
const [first, ...rest] = new Set([1, 2, 3]);
console.log(first, rest); // 1 [2, 3]

const arr = [...new Map([['a', 1], ['b', 2]])];
console.log(arr); // [['a', 1], ['b', 2]]
```

### 面试要点
- **遍历器协议**：核心是 `Symbol.iterator` 属性和 `next()` 方法，返回 `{ value, done }` 对象。
- **原生可迭代对象**：数组、字符串、Set、Map、arguments、NodeList 等。
- **`for...of` 优势**：简洁语法、支持 break/continue、只遍历自身元素、兼容所有可迭代对象。
- **手写迭代器**：实现 `Symbol.iterator` 方法，返回带 `next()` 的对象（如 RangeIterator 示例）。

## 11.循环语法比较及使用场景(`for`、`forEach`、`for...in`、`for...of`)

### 概念解析
- **for 循环**：最基础的循环控制结构，通过索引或条件控制循环流程，支持 `break`/`continue`。
- **forEach**：数组原型方法，专用于遍历数组元素，接收回调函数但**不支持中途跳出**（`break`/`return` 无效）。
- **for...in**：用于遍历对象的**可枚举属性**（包括原型链上的属性），不适用于数组（可能遍历到非数字索引）。
- **for...of**：ES6 新增，用于遍历**可迭代对象**（数组、Set、Map、字符串等），遍历值而非键，支持 `break`/`continue`。

### 语法示例与特性对比
#### 1. for 循环
```js
const arr = [1, 2, 3, 4];
// 基础索引循环
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === 3) break; // 支持 break 跳出循环
  console.log(arr[i]); // 1 2
}

// 优化版（缓存长度）
for (let i = 0, len = arr.length; i < len; i++) {
  console.log(arr[i]); // 1 2 3 4
}
```

#### 2. forEach
```js
arr.forEach((item, index, array) => {
  console.log(`值: ${item}, 索引: ${index}`);
  if (item === 2) return; // 仅跳过当前迭代，无法终止循环
});
// 输出：
// 值: 1, 索引: 0
// 值: 2, 索引: 1
// 值: 3, 索引: 2
// 值: 4, 索引: 3
```

#### 3. for...in
```js
const obj = { a: 1, b: 2, c: 3 };
// 遍历对象属性（含原型链）
for (const key in obj) {
  // 需过滤原型链属性
  if (obj.hasOwnProperty(key)) {
    console.log(`${key}: ${obj[key]}`); // a: 1, b: 2, c: 3
  }
}

// 不推荐用于数组（可能遍历到非数字索引）
const arr = [1, 2, 3];
arr.foo = 'bar'; // 添加非数字属性
for (const index in arr) {
  console.log(index); // 0, 1, 2, foo（意外包含非索引属性）
}
```

#### 4. for...of
```js
// 遍历数组
const arr = [1, 2, 3];
for (const value of arr) {
  if (value === 2) continue; // 支持 continue 跳过当前迭代
  console.log(value); // 1 3
}

// 遍历 Set
const set = new Set([1, 2, 2, 3]);
for (const value of set) {
  console.log(value); // 1 2 3（自动去重）
}

// 遍历 Map
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(`${key}: ${value}`); // a: 1, b: 2
}
```

### 循环特性对比表
| 循环类型   | 适用对象                | 支持 `break`/`continue` | 遍历内容         | 缺点                                  |
|------------|-------------------------|-------------------------|------------------|---------------------------------------|
| `for`      | 数组、类数组、数字范围  | ✅ 支持                 | 索引/条件        | 语法繁琐，需手动控制索引              |
| `forEach`  | 数组                    | ❌ 不支持               | 元素、索引、原数组| 无法中途终止，性能略低                |
| `for...in` | 对象                    | ✅ 支持                 | 属性名（含原型） | 遍历数组易出错，需过滤原型链          |
| `for...of` | 可迭代对象（数组/Set等）| ✅ 支持                 | 元素值           | 普通对象需部署 `Symbol.iterator`      |

### 面试要点与最佳实践
#### 1. 经典面试题：`for...in` 与 `for...of` 的核心区别
```js
const arr = [10, 20, 30];
arr.name = '数组';

// for...in 遍历键名（含非数字属性）
for (const key in arr) {
  console.log(key); // 0, 1, 2, name
}

// for...of 遍历值（仅迭代元素）
for (const value of arr) {
  console.log(value); // 10, 20, 30
}
```

#### 2. 最佳实践建议
- **数组遍历**：优先使用 `for...of`（简洁且支持终止），避免 `for...in`。
- **对象遍历**：使用 `for...in` 需配合 `hasOwnProperty`，或使用 `Object.keys(obj).forEach`。
- **性能敏感场景**：大规模数据遍历优先选择 `for` 循环（性能最优）。
- **不可终止遍历**：简单数组遍历且无需终止时可使用 `forEach`（代码简洁）。

### 常见误区
- ❌ 用 `for...in` 遍历数组：可能遍历到扩展属性（如 `arr.name`）或原型链属性。
- ❌ 试图在 `forEach` 中使用 `break`：需改用 `for`/`for...of` 或抛出异常（不推荐）。
- ❌ 认为 `for...of` 可遍历普通对象：需手动部署 `Symbol.iterator` 接口。

## 12.`Generator`及其异步方面的应用

### 概念解析
- **Generator（生成器）**：ES6 引入的特殊函数，可**暂停执行**和**恢复执行**，通过 `function*` 定义，使用 `yield` 关键字控制流程。
- **核心特性**：
  - **状态暂停**：执行到 `yield` 时暂停，返回包含 `value` 和 `done` 的迭代器对象
  - **双向通信**：通过 `next()` 方法向生成器传递数据
  - **异步控制**：可将异步操作按顺序写在 `yield` 后面，实现“同步风格的异步代码”

### 基础语法与执行流程
```js
// 定义生成器函数
function* generatorDemo() {
  console.log('开始执行');
  const result1 = yield '第一个值'; // 暂停并返回值
  console.log('接收到:', result1);
  const result2 = yield '第二个值';
  console.log('接收到:', result2);
  return '结束';
}

// 创建迭代器对象
const iterator = generatorDemo();

// 执行流程
console.log(iterator.next());
// 输出：开始执行 → { value: '第一个值', done: false }

console.log(iterator.next('参数1'));
// 输出：接收到: 参数1 → { value: '第二个值', done: false }

console.log(iterator.next('参数2'));
// 输出：接收到: 参数2 → { value: '结束', done: true }

console.log(iterator.next());
// 输出：{ value: undefined, done: true }
```

### 异步操作应用（Generator + Promise）
Generator 可配合 Promise 实现异步流程控制，避免回调地狱：
```js
// 模拟异步请求
function fetchData(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`数据 from ${url}`);
    }, 1000);
  });
}

// Generator 异步流程
function* asyncGenerator() {
  try {
    const data1 = yield fetchData('url1');
    console.log(data1); // 1秒后输出: 数据 from url1

    const data2 = yield fetchData('url2');
    console.log(data2); // 2秒后输出: 数据 from url2
  } catch (error) {
    console.log('错误:', error);
  }
}

// 执行生成器的自动运行器
function runGenerator(generator) {
  const iterator = generator();

  function handleResult(result) {
    if (result.done) return;

    result.value.then(data => {
      handleResult(iterator.next(data));
    }).catch(error => {
      iterator.throw(error);
    });
  }

  handleResult(iterator.next());
}

// 启动异步流程
runGenerator(asyncGenerator);
// 输出：
// 数据 from url1（1秒后）
// 数据 from url2（2秒后）
```

### Generator 与 async/await 的关系
`async/await` 是 Generator + Promise 的语法糖，两者核心功能一致，但 `async/await` 更简洁：
| 特性         | Generator + Promise          | async/await                  |
|--------------|------------------------------|------------------------------|
| 定义方式     | `function*` + `yield`        | `async function` + `await`   |
| 自动执行     | 需要手动编写运行器           | 内置自动执行机制             |
| 错误处理     | `try/catch` + `iterator.throw()` | `try/catch` 直接捕获         |
| 返回值       | 迭代器对象                   | Promise 对象                 |

### 面试要点
#### 1. Generator 实现 async/await 核心原理
```js
// 简化版 async/await 实现（基于 Generator）
function myAsync(generatorFunc) {
  return function(...args) {
    const generator = generatorFunc(...args);

    return new Promise((resolve, reject) => {
      function handle(result) {
        if (result.done) return resolve(result.value);

        Promise.resolve(result.value)
          .then(data => handle(generator.next(data)))
          .catch(error => generator.throw(error));
      }

      try {
        handle(generator.next());
      } catch (error) {
        reject(error);
      }
    });
  };
}

// 使用自定义 myAsync
const fetchData = url => new Promise(resolve => {
  setTimeout(() => resolve(`数据 from ${url}`), 1000);
});

const getData = myAsync(function*() {
  const data = yield fetchData('test');
  return data;
});

getData().then(data => console.log(data)); // 1秒后输出: 数据 from test
```

#### 2. 经典面试题：使用 Generator 实现斐波那契数列
```js
function* fibonacciGenerator() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacciGenerator();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
console.log(fib.next().value); // 5
```

### 局限性与替代方案
- **手动执行复杂**：需编写运行器函数（如 `co` 库），不如 `async/await` 开箱即用
- **错误处理繁琐**：需通过 `iterator.throw()` 传递错误
- **现代替代**：`async/await` 已成为异步编程主流，Generator 更多用于迭代器生成场景

## 13.`async`函数

### 概念解析
- **async 函数**：ES2017 引入的异步编程语法糖，基于 Promise 和 Generator 实现，使异步代码看起来像同步代码。
- **核心特性**：
  - **自动包装 Promise**：async 函数的返回值会自动包装为 Promise 对象
  - **await 关键字**：只能在 async 函数内部使用，用于等待 Promise 完成并获取结果
  - **错误处理**：通过 `try/catch` 直接捕获异步错误，无需链式 `catch`

### 基础语法与执行流程
```js
// 定义 async 函数
async function asyncDemo() {
  console.log('开始执行');
  return '结果'; // 自动包装为 Promise.resolve('结果')
}

// 调用 async 函数（返回 Promise）
asyncDemo().then(result => {
  console.log(result); // 输出: 开始执行 → 结果
});

// await 基本用法
async function awaitDemo() {
  console.log('开始');
  const result = await new Promise(resolve => {
    setTimeout(() => resolve('异步结果'), 1000);
  });
  console.log(result); // 1秒后输出: 异步结果
  return '完成';
}

awaitDemo().then(finalResult => {
  console.log(finalResult); // 输出: 完成
});
```

### 错误处理机制
async/await 使用 `try/catch` 统一处理同步和异步错误：
```js
async function errorHandling() {
  try {
    // 同步错误
    const a = 1 / 0;

    // 异步错误
    const data = await new Promise((_, reject) => {
      setTimeout(() => reject(new Error('网络错误')), 1000);
    });

    console.log(data);
  } catch (error) {
    console.log('捕获错误:', error.message); // 输出: 捕获错误: 网络错误
  }
}

errorHandling();
```

### 异步流程控制示例
#### 1. 串行执行异步操作
```js
// 模拟异步请求
function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// 串行执行（按顺序）
async function serialAsync() {
  console.time('serial');
  const result1 = await delay(1000, '结果1');
  const result2 = await delay(2000, '结果2');
  console.timeEnd('serial'); // 约 3000ms
  return [result1, result2];
}

serialAsync().then(results => console.log('串行结果:', results)); // ['结果1', '结果2']
```

#### 2. 并行执行异步操作
```js
// 并行执行（同时进行）
async function parallelAsync() {
  console.time('parallel');
  const promise1 = delay(1000, '结果1');
  const promise2 = delay(2000, '结果2');
  const results = await Promise.all([promise1, promise2]);
  console.timeEnd('parallel'); // 约 2000ms（取最长耗时）
  return results;
}

parallelAsync().then(results => console.log('并行结果:', results)); // ['结果1', '结果2']
```

### 与其他异步方案对比
| 异步方案       | 语法复杂度 | 错误处理       | 可读性 | 适用场景                     |
|----------------|------------|----------------|--------|------------------------------|
| 回调函数       | 高         | 嵌套 try/catch | 差     | 简单异步操作                 |
| Promise        | 中         | .catch() 链式  | 中     | 异步流程、并行操作           |
| Generator + co | 中高       | try/catch + throw | 中     | 复杂异步流程控制             |
| async/await    | 低         | try/catch 同步 | 高     | 所有异步场景，推荐优先使用   |

### 面试要点
#### 1. async/await 实现原理
async/await 本质是 Generator + Promise 的语法糖，其核心实现逻辑如下：
```js
// 简化版 async/await 实现
function myAsync(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      const gen = fn(...args);
      function next(data) {
        try {
          const { value, done } = gen.next(data);
          if (done) return resolve(value);
          Promise.resolve(value).then(next).catch(reject);
        } catch (err) {
          reject(err);
        }
      }
      next();
    });
  };
}

// 使用自定义 async
const asyncFunc = myAsync(function*() {
  const data = yield Promise.resolve('测试数据');
  return data;
});
asyncFunc().then(data => console.log(data)); // 测试数据
```

#### 2. 经典面试题：限制并发请求数量
```js
// 实现并发限制的异步请求函数
async function requestWithLimit(urls, limit) {
  const results = [];
  const executing = [];

  for (const url of urls) {
    // 创建请求 Promise
    const promise = fetch(url).then(res => res.json());
    results.push(promise);

    // 当达到并发限制，等待任一请求完成
    if (executing.length >= limit) {
      await Promise.race(executing);
    }

    // 维护执行中的请求队列
    executing.push(promise);
    promise.then(() => executing.splice(executing.indexOf(promise), 1));
  }

  return Promise.all(results);
}
```

### 常见误区
- **忘记 await**：在 async 函数中调用异步操作忘记加 `await`，会导致函数立即执行而不等待结果
- **错误处理遗漏**：未使用 try/catch 捕获 await 可能抛出的错误，导致 Promise 状态变为 rejected
- **过度并行**：大量异步操作同时使用 `Promise.all` 可能导致请求拥堵，需配合并发限制

## 14.几种异步方式的比较(回调、`setTimeout`、`Promise`、`Generator`、`async`)

### 概念解析
- **异步编程**：JavaScript 处理非阻塞操作的编程模式，核心是避免程序等待耗时操作（如网络请求、文件读写）而阻塞执行。
- **五种主流方案**：
  - **回调函数**：最基础的异步模式，通过函数嵌套实现异步逻辑
  - **setTimeout**：通过延迟执行模拟异步，精度低且不适合复杂流程
  - **Promise**：ES6 标准异步解决方案，解决回调地狱问题
  - **Generator**：可暂停/恢复的函数，配合 Promise 实现复杂异步流程
  - **async/await**：ES2017 语法糖，基于 Promise 和 Generator，提供同步风格异步代码

### 实现对比与代码示例
#### 1. 回调函数（Callback）
```js
// 回调嵌套（回调地狱）
function getData(callback) {
  setTimeout(() => {
    callback({ data: '第一层' }, (result1) => {
      setTimeout(() => {
        callback({ data: result1 + '→第二层' }, (result2) => {
          setTimeout(() => {
            callback({ data: result2 + '→第三层' }, null);
          }, 1000);
        });
      }, 1000);
    });
  }, 1000);
}

// 调用（金字塔结构，难以维护）
getData((result, next) => {
  console.log(result.data);
  if (next) next(result.data);
});
// 输出：
// 第一层（1秒后）
// 第一层→第二层（2秒后）
// 第一层→第二层→第三层（3秒后）
```

#### 2. setTimeout（模拟异步）
```js
// 嵌套 setTimeout（时序不可靠）
console.log('start');
setTimeout(() => {
  console.log('第一层');
  setTimeout(() => {
    console.log('第二层');
    setTimeout(() => {
      console.log('第三层');
    }, 1000);
  }, 1000);
}, 1000);
console.log('end');
// 输出顺序：start → end → 第一层（1秒后）→ 第二层（2秒后）→ 第三层（3秒后）
```

#### 3. Promise（链式调用）
```js
// Promise 链式调用（解决回调地狱）
function fetchData(url) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`数据 from ${url}`), 1000);
  });
}

fetchData('url1')
  .then(data1 => {
    console.log(data1);
    return fetchData('url2'); // 返回新 Promise
  })
  .then(data2 => {
    console.log(data2);
    return fetchData('url3');
  })
  .then(data3 => {
    console.log(data3);
  })
  .catch(error => {
    console.log('错误:', error);
  });
// 输出：
// 数据 from url1（1秒后）
// 数据 from url2（2秒后）
// 数据 from url3（3秒后）
```

#### 4. Generator（状态暂停）
```js
// Generator + Promise 实现异步流程
function* asyncGenerator() {
  try {
    const data1 = yield fetchData('url1');
    console.log(data1);
    const data2 = yield fetchData('url2');
    console.log(data2);
  } catch (error) {
    console.log('错误:', error);
  }
}

// 手动执行生成器
const iterator = asyncGenerator();
iterator.next().value.then(data1 => {
  iterator.next(data1).value.then(data2 => {
    iterator.next(data2);
  });
});
```

#### 5. async/await（同步风格异步）
```js
// async/await 语法糖（最简洁的异步写法）
async function asyncAwaitDemo() {
  try {
    const data1 = await fetchData('url1');
    console.log(data1);
    const data2 = await fetchData('url2');
    console.log(data2);
  } catch (error) {
    console.log('错误:', error);
  }
}

asyncAwaitDemo();
// 输出与 Promise 相同，但代码更接近同步写法
```

### 五种异步方式对比表
| 异步方式       | 语法复杂度 | 可读性 | 错误处理       | 执行顺序控制 | 适用场景                     |
|----------------|------------|--------|----------------|--------------|------------------------------|
| 回调函数       | 高（嵌套） | 差     | 每层单独处理   | 嵌套控制     | 简单异步场景（如事件监听）   |
| `setTimeout`   | 中（嵌套） | 中     | 难以统一处理   | 时间延迟控制 | 简单定时任务                 |
| `Promise`      | 中（链式） | 中     | `.catch()` 链式 | 链式控制     | 复杂异步流程、并行任务       |
| `Generator`    | 高         | 中     | `try/catch` + `throw` | 手动迭代控制 | 异步迭代、自定义流程控制     |
| `async/await`  | 低         | 高     | `try/catch` 同步 | 顺序执行     | 所有异步场景，推荐生产使用   |

### 性能与适用场景分析
#### 1. 性能对比
- **同步代码 > Promise ≈ async/await > Generator > 回调嵌套**
- 现代浏览器对 Promise 和 async/await 优化良好，性能差异在实际开发中可忽略
- 回调嵌套因作用域链复杂，性能最差且可读性最低

#### 2. 典型应用场景
- **简单异步**：事件回调（如 `onclick`）、简单定时任务（`setTimeout`）
- **并行请求**：`Promise.all`/`Promise.race`（如同时加载多个资源）
- **复杂流程**：`async/await`（如表单提交→数据验证→文件上传→结果展示）
- **异步迭代**：`Generator` + `for...of`（如分页加载数据）

### 面试要点
#### 1. 手写 Promise 解决回调地狱
```js
// 将回调地狱转换为 Promise 链式调用
function callbackToPromise(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}

// 使用示例（Node.js 回调风格 API 转换）
const fs = require('fs');
const readFile = callbackToPromise(fs.readFile);

readFile('file1.txt', 'utf8')
  .then(data => readFile(data.trim(), 'utf8'))
  .then(content => console.log(content));
```

#### 2. 异步执行顺序面试题
```js
// 说出以下代码输出顺序
console.log('start');

setTimeout(() => console.log('setTimeout'), 0);

new Promise(resolve => {
  console.log('promise executor');
  resolve();
}).then(() => console.log('promise then'));

async function asyncDemo() {
  console.log('async start');
  await Promise.resolve();
  console.log('async end');
}

asyncDemo();

console.log('end');

// 正确输出顺序：
// start → promise executor → async start → end → promise then → async end → setTimeout
// 解析：同步代码优先执行，微任务（Promise.then/await）次之，宏任务（setTimeout）最后
```

## 15.`class`基本语法及继承

### 概念解析
- **class**：ES6 引入的类语法糖，本质是基于原型链的语法封装，使面向对象编程更接近传统语言风格。
- **核心特性**：
  - 类声明不会提升（与函数声明不同）
  - 类方法默认不可枚举
  - 支持继承（`extends`）、构造函数（`constructor`）、静态方法（`static`）
  - 类内部默认使用严格模式

### 基本语法与定义方式
#### 1. 类声明与构造函数
```js
// 基本类定义
class Person {
  // 构造函数（实例化时执行）
  constructor(name, age) {
    this.name = name; // 实例属性
    this.age = age;
  }

  // 实例方法（原型方法）
  sayHello() {
    return `Hello, I'm ${this.name}`;
  }

  // 静态方法（类方法，通过类名调用）
  static create(name, age) {
    return new Person(name, age); // 工厂方法
  }
}

// 使用类
const person = new Person('Alice', 20);
console.log(person.sayHello()); // Hello, I'm Alice
console.log(person.age); // 20

// 使用静态方法
const person2 = Person.create('Bob', 25);
console.log(person2.name); // Bob
```

#### 2. 类的访问器方法（getter/setter）
```js
class User {
  constructor(name) {
    this._name = name; // 私有属性约定（以下划线开头）
  }

  // getter：读取属性时触发
  get name() {
    return this._name.toUpperCase();
  }

  // setter：设置属性时触发
  set name(newName) {
    if (typeof newName !== 'string') {
      throw new Error('姓名必须是字符串');
    }
    this._name = newName;
  }
}

const user = new User('alice');
console.log(user.name); // ALICE
user.name = 'Bob';
console.log(user.name); // BOB
user.name = 123; // 抛出错误：姓名必须是字符串
```

### 继承实现与super关键字
#### 1. 基本继承语法
```js
// 父类
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    return `${this.name} is eating`;
  }
}

// 子类继承父类
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数（必须在this前调用）
    this.breed = breed;
  }

  // 重写父类方法
  eat() {
    return `${super.eat()} dog food`; // super调用父类方法
  }

  // 子类特有方法
  bark() {
    return `${this.name} is barking`;
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name); // Buddy
console.log(dog.breed); // Golden Retriever
console.log(dog.eat()); // Buddy is eating dog food
console.log(dog.bark()); // Buddy is barking
```

#### 2. 静态方法继承
```js
class Parent {
  static staticMethod() {
    return 'Parent static method';
  }
}

class Child extends Parent {
  static childStaticMethod() {
    return super.staticMethod() + ' from child';
  }
}

console.log(Child.staticMethod()); // Parent static method
console.log(Child.childStaticMethod()); // Parent static method from child
```

### ES5构造函数与ES6 class对比
| 特性                | ES5 构造函数                  | ES6 class                          |
|---------------------|------------------------------|-----------------------------------|
| 定义方式            | `function Person() {}`       | `class Person {}`                 |
| 继承实现            | `Child.prototype = new Parent()` | `class Child extends Parent`      |
| 构造函数调用        | 手动调用父类构造函数          | `super()` 自动调用                |
| 静态方法            | 直接挂载在构造函数上          | `static` 关键字声明               |
| 方法可枚举性        | 默认可枚举（需手动设置不可枚举） | 默认不可枚举                      |
| 提升                | 函数提升                      | 不存在提升（TDZ限制）             |
| 私有属性            | 无原生支持（约定下划线）      | ES2022 支持 `#` 私有属性          |

### 实际应用场景
#### 1. 实现复杂继承链
```js
// 基类
class Shape {
  constructor(color) {
    this.color = color;
  }

  getArea() {
    throw new Error('子类必须实现getArea方法');
  }
}

// 子类：圆形
class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }

  getArea() {
    return Math.PI * this.radius **2; // 圆面积公式
  }
}

// 子类：矩形
class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height; // 矩形面积公式
  }
}

// 使用多态特性
const shapes = [new Circle('red', 5), new Rectangle('blue', 4, 6)];
shapes.forEach(shape => {
  console.log(`${shape.color}图形面积:`, shape.getArea().toFixed(2));
});
// 输出：
// red图形面积: 78.54
// blue图形面积: 24.00
```

#### 2. 实现单例模式
```js
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.data = '单例数据';
  }

  getData() {
    return this.data;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true（指向同一实例）
```

### 面试要点
#### 1. class实现继承的本质
ES6 class继承本质仍是基于原型链，`extends`关键字主要做了两件事：
```js
// ES6 class继承的ES5等价实现
function Child(...args) {
  const _this = Parent.apply(this, args) || this;
  return _this;
}

// 设置原型链
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 静态方法继承
Object.setPrototypeOf(Child, Parent);
```

#### 2. 经典面试题：class私有属性实现
ES6/ES2022提供两种私有属性方案：
```js
// 方案1：ES2022 私有属性（#前缀）
class PrivateDemo {
  #privateField = '私有属性'; // 私有字段

  #privateMethod() {
    return this.#privateField;
  }

  getPrivate() {
    return this.#privateMethod();
  }
}

// 方案2：闭包模拟私有属性（ES5兼容）
function ClosurePrivate() {
  const privateField = '闭包私有属性'; // 私有变量

  this.getPrivate = function() {
    return privateField;
  };
}
```

### 常见误区
- **class不是新的对象模型**：ES6 class只是原型链的语法糖，并非引入新的面向对象模型
- **super的指向**：在构造函数中指向父类构造函数，在方法中指向父类原型
- **this绑定**：class方法默认绑定实例，但作为回调时可能丢失this（需用箭头函数或bind绑定）

## 16.模块加载方案比较(`CommonJS`和`ES6`的`Module`)

### 概念解析
- **CommonJS**：Node.js 采用的模块规范，通过 `require` 同步加载模块，`module.exports` 导出模块，主要用于服务器端。
- **ES6 Module (ESM)**：ES6 引入的官方模块规范，通过 `import`/`export` 异步加载模块，支持静态分析，用于浏览器和现代 Node.js。
- **核心差异**：CommonJS 是运行时加载，ESM 是编译时加载；前者输出值拷贝，后者输出值引用。

### 语法示例对比
#### 1. CommonJS 模块
```js
// 模块导出（module.js）
const name = 'CommonJS Module';
function greet() { return `Hello from ${name}`; }

// 导出方式1：单个导出
module.exports.name = name;
module.exports.greet = greet;

// 导出方式2：批量导出
module.exports = {
  name,
  greet,
  version: '1.0.0'
};

// 模块导入（main.js）
const module = require('./module');
console.log(module.name); // CommonJS Module
console.log(module.greet()); // Hello from CommonJS Module

// 解构导入
const { greet } = require('./module');
console.log(greet()); // Hello from CommonJS Module
```

#### 2. ES6 Module
```js
// 模块导出（module.js）
// 导出方式1：命名导出
export const name = 'ES6 Module';
export function greet() { return `Hello from ${name}`; }

export const version = '1.0.0';

// 导出方式2：默认导出（一个模块只能有一个默认导出）
export default {
  name,
  greet
};

// 模块导入（main.js）
// 导入命名导出
import { name, greet } from './module.js';
console.log(name); // ES6 Module
console.log(greet()); // Hello from ES6 Module

// 导入默认导出
import module from './module.js';
console.log(module.name); // ES6 Module

// 动态导入（返回Promise，支持运行时加载）
import('./module.js').then(module => {
  console.log(module.greet());
});
```

### 核心差异对比表
| 特性                | CommonJS                          | ES6 Module (ESM)                    |
|---------------------|-----------------------------------|-------------------------------------|
| **加载时机**        | 运行时同步加载（阻塞执行）         | 编译时异步加载（非阻塞）             |
| **导出值类型**      | 值拷贝（原始值拷贝，引用值浅拷贝） | 值引用（实时绑定，模块内值变化会同步） |
| **静态分析**        | 不支持（无法做 tree-shaking）      | 支持（编译时分析，可优化冗余代码）   |
| **导入提升**        | 无提升（需在运行时执行）           | 存在提升（import 会提升到模块顶部）   |
| **this 指向**       | module.exports（对象）             | undefined（模块顶层 this 为 undefined）|
| **循环依赖**        | 支持（输出已执行部分的拷贝值）     | 支持（输出实时引用，需注意初始化顺序）|
| **文件扩展名**      | 可省略（Node 自动补全 .js/.json）  | 不可省略（浏览器严格要求 .js 扩展名） |
| **适用环境**        | Node.js 服务器端                  | 浏览器/现代 Node.js (v14.3+)         |

### 循环依赖处理对比
#### 1. CommonJS 循环依赖
```js
// a.js
const b = require('./b');
console.log('a.js 加载', b.counter);
module.exports = { counter: 1 };

// b.js
const a = require('./a');
console.log('b.js 加载', a.counter); // undefined（a 尚未导出完成）
module.exports = { counter: 2 };

// main.js
require('./a');
// 输出顺序：
// b.js 加载 undefined
// a.js 加载 2
```

#### 2. ES6 Module 循环依赖
```js
// a.js
import { counter as bCounter } from './b.js';
console.log('a.js 加载', bCounter); // 0（b 初始值）
export let counter = 1;
setTimeout(() => counter = 100, 1000);

// b.js
import { counter as aCounter } from './a.js';
console.log('b.js 加载', aCounter); // 1（a 的初始值）
export let counter = 0;
setTimeout(() => counter = 200, 1000);

// main.js
import { counter as aCounter } from './a.js';
import { counter as bCounter } from './b.js';
console.log('初始值', aCounter, bCounter); // 1 0
setTimeout(() => console.log('1秒后', aCounter, bCounter), 1000); // 100 200
```

### 实际应用与互操作
#### 1. 环境选择
- **Node.js 项目**：
  - 传统项目用 CommonJS（require/module.exports）
  - 现代项目推荐 ESM（需在 package.json 设置 "type": "module"）
- **浏览器项目**：
  - 必须使用 ESM（`<script type="module" src="main.js"></script>`）

#### 2. 模块互操作
Node.js 支持 ESM 调用 CommonJS，反之亦然：
```js
// ESM 中导入 CommonJS
import cjsModule from './commonjs-module.js'; // 默认导入对应 module.exports

// CommonJS 中导入 ESM（需动态 require）
(async () => {
  const esmModule = await import('./esm-module.js');
})();
```

### 面试要点
#### 1. 核心差异总结
- **加载机制**：CommonJS 运行时同步加载，ESM 编译时异步加载
- **值传递**：CommonJS 拷贝导出值，ESM 引用导出值
- **静态分析**：ESM 支持 `import()` 动态加载和 tree-shaking，CommonJS 不支持

#### 2. 经典面试题：为什么 ESM 支持 tree-shaking？
ESM 在编译时进行静态分析，能识别未使用的导出成员，打包工具（如 Webpack/Rollup）可剔除冗余代码。而 CommonJS 是运行时加载，无法在编译阶段确定哪些导出被使用，因此不支持 tree-shaking。

#### 3. 模块顶层 this 指向差异
```js
// CommonJS 模块
alert(this === module.exports); // true

// ESM 模块
alert(this); // undefined
```

## 17.`ES6`模块加载与`CommonJS`加载的原理

### 概念解析
- **模块加载原理**：指模块从“引用”到“执行”的完整过程，包括路径解析、文件读取、代码执行、结果缓存等阶段。
- **CommonJS 原理**：基于 Node.js 运行时实现，采用“运行时同步加载 + 值拷贝”机制。
- **ES6 Module 原理**：基于浏览器/Node.js 引擎实现，采用“编译时异步加载 + 实时绑定”机制。

### CommonJS 加载原理（Node.js）
#### 1. 加载流程
1. **路径解析**：`require(X)` 通过 `require.resolve(X)` 解析模块路径（核心模块 > 相对路径 > node_modules）。
2. **文件读取**：根据路径读取文件内容，包裹为函数（模块包装器）。
3. **代码执行**：执行包装函数，将 `module.exports` 赋值为模块导出对象。
4. **缓存机制**：将导出对象缓存到 `require.cache`，下次加载直接返回缓存。

#### 2. 模块包装器（Module Wrapper）
Node.js 会将每个模块代码包裹为函数，隔离作用域并注入内置变量：
```js
// 模块包装器伪代码
(function(exports, require, module, __filename, __dirname) {
  // 模块原始代码
  const name = 'CommonJS';
  module.exports = { name };
});
```
- **参数作用**：
  - `exports`：`module.exports` 的引用（默认空对象）
  - `module`：模块元信息对象（含 `exports`、`id`、`parent` 等）
  - `__filename`/`__dirname`：模块绝对路径/目录路径

#### 3. 缓存机制
```js
// a.js
console.log('a.js 执行');
module.exports = { value: 1 };

// main.js
const a1 = require('./a');
const a2 = require('./a');
console.log(a1 === a2); // true（同一模块缓存）
```
- **缓存位置**：`require.cache`（可手动删除缓存强制重新加载）
- **缓存 key**：模块绝对路径，值为 `module` 对象

### ES6 Module 加载原理
#### 1. 加载流程（三阶段）
1. **解析（Parse）**：读取模块代码生成 AST，收集 `import`/`export` 信息（静态分析）。
2. **实例化（Instantiate）**：创建模块环境记录，建立模块间依赖引用（“链接”阶段，不执行代码）。
3. **求值（Evaluate）**：执行模块代码，计算导出值并填充到实例化阶段建立的引用中。

#### 2. 实时绑定（Live Bindings）
ESM 导出的是“值的引用”，模块内部值变化会同步到导入处：
```js
// module.js
export let count = 0;
export function increment() { count++ };

// main.js
import { count, increment } from './module.js';
console.log(count); // 0
increment();
console.log(count); // 1（值同步更新）
```
- **原理**：实例化阶段为每个导出值创建“绑定”，求值阶段通过绑定访问最新值。

#### 3. 异步加载（浏览器环境）
浏览器通过 `<script type="module">` 加载 ESM，过程完全异步且不阻塞 HTML 解析：
```html
<!-- 异步加载并执行模块 -->
<script type="module" src="main.js"></script>
<!-- 不会阻塞后续 DOM 解析 -->
<p>模块加载时我已显示</p>
```
- **加载优先级**：模块脚本默认延迟执行（等同于 `defer`），按文档顺序执行。

### 核心原理对比
| 阶段/机制       | CommonJS                          | ES6 Module                          |
|-----------------|-----------------------------------|-------------------------------------|
| **路径解析**    | 运行时动态解析（支持表达式）       | 编译时静态解析（不支持表达式）       |
| **作用域隔离**  | 函数包装隔离（`module` 作用域）   | 模块环境隔离（独立模块作用域）       |
| **依赖处理**    | 执行时递归加载（深度优先）         | 解析时构建依赖图（并行加载）         |
| **导出值绑定**  | 执行时值拷贝（导出后模块内修改不影响导入） | 实例化时引用绑定（实时同步模块内修改） |
| **循环依赖**    | 缓存未完成导出（可能获取到不完整值） | 绑定未求值变量（执行时需处理初始化顺序） |
| **执行时机**    | 加载时立即执行（同步阻塞）         | 解析后按需执行（异步非阻塞）         |

### 循环依赖处理原理对比
#### 1. CommonJS 循环依赖
```js
// a.js
console.log('a 开始加载');
const b = require('./b');
console.log('a 中 b 的值:', b);
module.exports = { value: 'a' };
console.log('a 加载完成');

// b.js
console.log('b 开始加载');
const a = require('./a');
console.log('b 中 a 的值:', a); // {}（a 尚未导出完成，缓存空对象）
module.exports = { value: 'b' };
console.log('b 加载完成');

// main.js
require('./a');
// 输出顺序：
// a 开始加载 → b 开始加载 → b 中 a 的值: {} → b 加载完成 → a 中 b 的值: { value: 'b' } → a 加载完成
```
- **原理**：`a` 加载时递归加载 `b`，`b` 加载 `a` 时从缓存获取未完成的 `a` 模块（`exports` 为空对象），最终 `a` 完成导出后缓存更新，但 `b` 已获取到旧值。

#### 2. ES6 Module 循环依赖
```js
// a.js
console.log('a 解析');
export let value;
import { setB } from './b.js';
setB();
value = 'a';
console.log('a 求值完成');

// b.js
console.log('b 解析');
export let value;
import { value as aValue } from './a.js';
export function setB() {
  value = aValue; // 此时 aValue 为 undefined（a 尚未求值）
};
console.log('b 求值完成');

// main.js
import { value as aValue } from './a.js';
import { value as bValue } from './b.js';
console.log(aValue, bValue); // 'a' undefined
```
- **原理**：解析阶段建立 `a.value` 与 `b.setB` 的引用绑定，求值阶段 `a` 调用 `setB` 时 `a.value` 尚未赋值（`undefined`），最终 `a.value` 赋值为 'a'，但 `b.value` 已定型为 `undefined`。

### 面试要点
#### 1. CommonJS 同步加载的设计原因
Node.js 作为服务器端环境，模块文件本地存储，加载速度快，同步加载可简化代码逻辑（无需回调）。而浏览器端模块需网络请求，异步加载可避免页面阻塞。

#### 2. ESM 静态分析的实现基础
ESM 在解析阶段通过 AST 提取 `import`/`export` 信息，确定依赖关系和导出成员，支持：
- **Tree-shaking**：剔除未使用的导出成员（如 Webpack 优化）
- **类型检查**：TS 等工具可基于静态导入做类型推断
- **死代码检测**：编译时识别未使用的模块代码

#### 3. 模块缓存差异对开发的影响
- **CommonJS**：修改模块后需重启服务（缓存不会自动失效）
- **ESM（Node.js）**：通过 `--experimental-watch` 启动可监听模块变化并清除缓存
- **浏览器 ESM**：依赖 HTTP 缓存，需通过版本号/哈希值控制缓存

### 实际开发建议
- **Node.js 项目**：
  - 传统项目用 CommonJS（成熟稳定，兼容所有 npm 包）
  - 新项目推荐 ESM（支持静态分析和现代特性，需设置 `package.json "type": "module"`）
- **浏览器项目**：
  - 优先使用 ESM + 打包工具（Webpack/Rollup），通过 `import()` 实现代码分割
  - 原生 ESM 适合简单场景，需注意路径完整（如 `./module.js` 不可省略 `.js`）

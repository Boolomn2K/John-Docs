# 手写代码

## 1.`Promise`(A+规范)、`then`、`all`方法

```js
class MyPromise {
  constructor(executor) {
    // 初始状态
    this.state = 'pending';
    this.value = null;
    this.reason = null;
    
    // 存储回调函数（支持多个then调用）
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    // 成功回调
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        
        // 执行所有成功回调
        this.onFulfilledCallbacks.forEach(cb => cb());
      }
    };
    
    // 失败回调
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        
        // 执行所有失败回调
        this.onRejectedCallbacks.forEach(cb => cb());
      }
    };
    
    try {
      // 立即执行执行器函数
      executor(resolve, reject);
    } catch (err) {
      // 捕获执行器中的同步错误
      reject(err);
    }
  }
  
  // then方法实现（核心）
  then(onFulfilled, onRejected) {
    // 参数校验：如果不是函数，则创建默认函数（值穿透）
    onFulfilled = typeof onFulfilled === 'function' 
      ? onFulfilled 
      : value => value;
      
    onRejected = typeof onRejected === 'function' 
      ? onRejected 
      : reason => { throw reason; };
    
    // 返回新的Promise以实现链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      // 封装执行函数
      const handleFulfilled = () => {
        // 使用setTimeout模拟微任务
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            // 解析新Promise的值
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      };
      
      const handleRejected = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      };
      
      // 根据当前状态执行相应操作
      if (this.state === 'fulfilled') {
        handleFulfilled();
      } else if (this.state === 'rejected') {
        handleRejected();
      } else {
        // pending状态，存储回调
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
    
    return promise2;
  }
  
  // catch方法实现
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  
  // finally方法实现
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason; })
    );
  }
  
  // 静态方法 resolve
  static resolve(value) {
    // 如果已经是Promise实例，直接返回
    if (value instanceof MyPromise) {
      return value;
    }
    
    // 处理thenable对象
    if (value && typeof value.then === 'function') {
      return new MyPromise(value.then);
    }
    
    // 普通值
    return new MyPromise(resolve => resolve(value));
  }
  
  // 静态方法 reject
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
  
  // 静态方法 all
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      
      if (promises.length === 0) {
        resolve(results);
        return;
      }
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value;
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          },
          reason => {
            reject(reason);
          }
        );
      });
    });
  }
  
  // 静态方法 race
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(
          value => resolve(value),
          reason => reject(reason)
        );
      });
    });
  }
}

// 解析Promise（Promise解决过程）
function resolvePromise(promise2, x, resolve, reject) {
  // 防止循环引用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  
  // 防止多次调用
  let called = false;
  
  if (x instanceof MyPromise) {
    // 如果x是Promise实例
    x.then(
      value => resolvePromise(promise2, value, resolve, reject),
      reason => reject(reason)
    );
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 处理thenable对象
    try {
      const then = x.then;
      
      if (typeof then === 'function') {
        then.call(
          x,
          value => {
            if (called) return;
            called = true;
            resolvePromise(promise2, value, resolve, reject);
          },
          reason => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        // 普通对象
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err);
    }
  } else {
    // 普通值
    resolve(x);
  }
}
```

## 2.`Iterator`遍历器实现

### 概念解析
**Iterator（遍历器）** 是ES6引入的一种统一的接口机制，用于遍历各种数据结构。其核心作用是提供一种顺序访问数据集合元素的方式，而无需暴露数据的内部结构。Iterator主要供`for...of`循环、扩展运算符(`...`)、解构赋值等语法使用，是实现数据可遍历的基础。

#### 遍历器协议
一个对象要成为可遍历的（iterable），必须实现**迭代器协议**，即对象必须有一个`Symbol.iterator`属性，该属性是一个无参数函数，返回一个符合**迭代器接口**的对象。迭代器接口要求包含`next()`方法，该方法返回一个具有`value`（当前值）和`done`（是否遍历结束）属性的对象。

### 核心实现
#### 1. 自定义迭代器
```javascript
// 实现一个数组迭代器
function createArrayIterator(arr) {
  let index = 0;
  return {
    // 实现迭代器接口
    next() {
      if (index < arr.length) {
        return {
          value: arr[index++],
          done: false
        };
      } else {
        return {
          value: undefined,
          done: true
        };
      }
    },
    // 使迭代器自身可遍历（支持再次迭代）
    [Symbol.iterator]() {
      return this;
    }
  };
}

// 使用示例
const arr = [1, 2, 3];
const iterator = createArrayIterator(arr);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

#### 2. 使对象可遍历
```javascript
// 为普通对象实现Symbol.iterator
const obj = {
  data: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return {
            value: this.data[index++],
            done: false
          };
        } else {
          return {
            value: undefined,
            done: true
          };
        }
      }
    };
  }
};

// 现在对象可以用for...of遍历
for (const item of obj) {
  console.log(item); // 'a', 'b', 'c'
}

// 也支持扩展运算符
console.log([...obj]); // ['a', 'b', 'c']
```

#### 3. 生成器实现迭代器
使用Generator函数可以更简洁地创建迭代器：
```javascript
// 生成器实现数组迭代器
function* arrayGenerator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}

// 使用生成器创建迭代器
const gen = arrayGenerator([1, 2, 3]);
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 生成器本身就是迭代器
for (const value of gen) {
  console.log(value); // 无输出（迭代器已遍历完毕）
}

// 创建新的生成器实例
const gen2 = arrayGenerator([4, 5, 6]);
for (const value of gen2) {
  console.log(value); // 4, 5, 6
}
```

### 内置可迭代对象
JavaScript中默认实现Iterator接口的数据结构有：
- Array
- String
- Map
- Set
- TypedArray（如Uint8Array）
- arguments对象
- NodeList等DOM集合

```javascript
// 字符串迭代示例
const str = 'hello';
for (const char of str) {
  console.log(char); // 'h','e','l','l','o'
}

// Map迭代示例
const map = new Map();
map.set('name', '张三');
map.set('age', 30);
for (const [key, value] of map) {
  console.log(`${key}: ${value}`); // 'name: 张三', 'age: 30'
}
```

### 面试要点
#### 1. 原理机制
**Q：Iterator遍历器的作用是什么？如何使自定义对象支持for...of遍历？**
A：Iterator的主要作用是提供统一的数据遍历接口，使不同数据结构可以用相同方式遍历。要使自定义对象支持for...of遍历，需为对象添加`Symbol.iterator`属性，该属性是一个返回迭代器对象的函数，迭代器对象需实现`next()`方法，返回包含`value`和`done`属性的对象。

**Q：Generator函数和Iterator的关系是什么？**
A：Generator函数是创建迭代器的语法糖。Generator函数执行后返回一个Generator对象，该对象既是迭代器（实现`next()`方法），又可遍历（实现`Symbol.iterator`属性）。每次调用`yield`会暂停执行并返回值，相当于手动实现迭代器的`next()`方法。

#### 2. 手写实现
**Q：手写实现一个支持无限序列的迭代器（如斐波那契数列）**
A：实现示例：
```javascript
// 斐波那契数列迭代器
function* fibonacciIterator() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// 使用迭代器（取前10项）
const fib = fibonacciIterator();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value); // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
}
```

## 3.`Thunk`函数实现(结合`Generator`实现异步)
```js
// 1. Thunk函数转换器
function thunkify(fn) {
  return function(...args) {
    return function(callback) {
      return fn.apply(this, args.concat(callback));
    };
  };
}

// 2. 示例异步操作
const fs = require('fs');
const readFileThunk = thunkify(fs.readFile);

// 3. Generator函数处理异步流程
function* gen() {
  try {
    const data1 = yield readFileThunk('./file1.txt', 'utf8');
    console.log('文件1内容:', data1);

    const data2 = yield readFileThunk('./file2.txt', 'utf8');
    console.log('文件2内容:', data2);

    return '异步操作完成';
  } catch (error) {
    console.error('发生错误:', error);
  }
}

// 4. 自动执行Generator函数
function runGenerator(generatorFn) {
  const generator = generatorFn();

  function handleResult(result) {
    if (result.done) {
      // 生成器函数执行完毕
      console.log('最终结果:', result.value);
      return;
    }

    // 处理Thunk函数
    const thunk = result.value;
    thunk((error, data) => {
      if (error) {
        // 向生成器抛出错误
        generator.throw(error);
        return;
      }

      // 将数据传递给生成器并继续执行
      handleResult(generator.next(data));
    });
  }

  // 启动生成器
  handleResult(generator.next());
}

// 5. 运行示例
runGenerator(gen);

```
## 4.`async`实现原理(`spawn`函数)

### 概念解析
**async/await**是ES2017引入的异步编程语法糖，其本质是**Generator函数和自动执行器**的组合。async函数返回一个Promise对象，await关键字可以暂停异步操作并等待结果。async/await的实现核心是通过一个自动执行器（通常称为`spawn`函数）来驱动Generator函数执行，替代手动调用`next()`方法，同时处理Promise的状态转换和错误捕获。

#### async与Generator的关系
| 特性 | async函数 | Generator函数 |
|------|-----------|--------------|
| 返回值 | Promise对象 | Generator迭代器 |
| 执行方式 | 自动执行 | 需手动调用next()或使用co模块 |
| 错误处理 | try/catch直接捕获 | 需通过返回的Promise.catch()捕获 |
| 语义化 | 明确的异步语义 | 通用的暂停恢复机制 |
|  await关键字 | 支持 | 不支持，需使用yield |

### 核心实现：spawn自动执行器
#### 1. 基础实现原理
async函数的执行过程可分解为：
1. 将async函数转换为Generator函数
2. 通过spawn函数自动执行Generator
3. 将Generator的返回值封装为Promise
4. 处理yield表达式的Promise结果

#### 2. spawn函数实现
```javascript
// 简化版spawn自动执行器
function spawn(genF) {
  // 返回一个Promise以便链式调用
  return new Promise((resolve, reject) => {
    // 创建Generator实例
    const gen = genF();

    // 递归执行next()
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        // 捕获执行过程中的错误
        return reject(e);
      }

      // 如果Generator执行完毕
      if (next.done) {
        return resolve(next.value);
      }

      // 将yield的返回值转换为Promise
      Promise.resolve(next.value).then(
        v => {
          // 将结果传递给下一个next()
          step(() => gen.next(v));
        },
        e => {
          // 将错误传递给Generator
          step(() => gen.throw(e));
        }
      );
    }

    // 启动执行
    step(() => gen.next(undefined));
  });
}
```

#### 3. 使用spawn实现async/await
```javascript
// 使用Generator模拟async函数
function* asyncGenerator() {
  try {
    const data1 = yield Promise.resolve('Hello');
    const data2 = yield new Promise(resolve => {
      setTimeout(() => resolve(data1 + ' World'), 1000);
    });
    return data2;
  } catch (error) {
    console.error('捕获错误:', error);
    return null;
  }
}

// 通过spawn执行Generator，模拟async函数调用
const asyncFunction = () => spawn(asyncGenerator);

// 使用示例
asyncFunction().then(result => {
  console.log(result); // 1秒后输出 "Hello World"
});

// 错误处理示例
function* errorGenerator() {
  yield Promise.reject(new Error('异步操作失败'));
}

spawn(errorGenerator).catch(error => {
  console.error(error.message); // 输出 "异步操作失败"
});
```

#### 4. 完整async/await实现（含错误处理）
```javascript
// 实现async函数装饰器
function asyncToGenerator(generatorFunc) {
  return function(...args) {
    const self = this;
    return spawn(function*() {
      return yield generatorFunc.apply(self, args);
    });
  };
}

// 使用装饰器创建async函数
const fetchData = asyncToGenerator(function*() {
  try {
    const user = yield fetch('/api/user').then(res => res.json());
    const posts = yield fetch(`/api/posts?userId=${user.id}`).then(res => res.json());
    return { user, posts };
  } catch (error) {
    console.error('数据获取失败:', error);
    return { user: null, posts: [] };
  }
});

// 调用示例
fetchData().then(result => {
  console.log('用户数据:', result.user);
  console.log('文章列表:', result.posts);
});
```

### 面试要点
#### 1. 原理机制
**Q：async/await的实现原理是什么？与Promise、Generator有什么关系？**
A：async/await是Generator函数的语法糖，其实现依赖：1. 将async函数转换为Generator函数；2. 通过自动执行器（如spawn函数）驱动Generator执行；3. 将yield后的表达式包装为Promise。关系链：async函数 → Generator函数 → Promise → 异步操作。async/await相比Generator更简洁，无需手动执行next()；相比Promise避免了链式调用.then()的回调地狱。

**Q：spawn函数的核心作用是什么？如何处理错误？**
A：spawn函数的核心作用是自动执行Generator函数，实现异步流程的扁平化。错误处理通过两层机制：1. try/catch捕获Generator执行中的同步错误；2. Promise.catch()捕获yield表达式中Promise的异步错误，并通过gen.throw()将错误抛回Generator内部，可被函数内的try/catch捕获。

#### 2. 手写实现
**Q：如何手动实现一个简单的async/await？**
A：核心步骤：1. 实现spawn自动执行器（处理Generator的自动迭代和Promise转换）；2. 将目标函数转换为Generator函数；3. 使用spawn执行该Generator。关键代码见上文spawn函数实现及使用示例，核心是递归调用step函数处理next()，并将结果Promise化。

## 5.`class`的继承

### 概念解析
**class继承**是ES6引入的基于类的面向对象继承机制，通过`extends`关键字实现类之间的继承关系，解决了ES5原型链继承的复杂性和可读性问题。class继承本质上是原型继承的语法糖，但其提供了更清晰的语义和更简洁的语法，支持构造函数继承、方法重写、静态方法继承等特性。

#### 继承核心要素
- **extends关键字**：声明类之间的继承关系
- **super关键字**：调用父类的构造函数和方法
- **方法重写**：子类可以重写父类的方法
- **静态继承**：静态方法和属性也会被继承

### 核心实现
#### 1. 基础继承示例
```javascript
// 父类：动物
class Animal {
  // 构造函数
  constructor(name) {
    this.name = name;
    this.legs = 4; // 动物默认4条腿
  }

  // 实例方法
  speak() {
    console.log(`${this.name} makes a sound.`);
  }

  // 静态方法
  static isAnimal(obj) {
    return obj instanceof Animal;
  }
}

// 子类：狗（继承自动物）
class Dog extends Animal {
  // 构造函数
  constructor(name, breed) {
    // 必须先调用super()，否则无法使用this
    super(name);
    this.breed = breed; // 子类特有属性
  }

  // 重写父类方法
  speak() {
    super.speak(); // 调用父类方法
    console.log(`${this.name} barks: Woof! Woof!`);
  }

  // 子类特有方法
  fetch() {
    console.log(`${this.name} is fetching the ball.`);
  }
}

// 使用示例
const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name); // Buddy
console.log(dog.breed); // Golden Retriever
console.log(dog.legs); // 4（继承自父类）

dog.speak();
// 输出：
// Buddy makes a sound.
// Buddy barks: Woof! Woof!

dog.fetch(); // Buddy is fetching the ball.

// 静态方法继承
console.log(Animal.isAnimal(dog)); // true
console.log(Dog.isAnimal(dog)); // true（继承静态方法）
```

#### 2. 继承链与多继承限制
JavaScript仅支持单继承，但可通过组合实现多继承效果：
```javascript
// 辅助类：可飞翔
class Flyable {
  fly() {
    console.log(`${this.name} is flying.`);
  }
}

// 辅助类：可游泳
class Swimmable {
  swim() {
    console.log(`${this.name} is swimming.`);
  }
}

// 通过组合实现多继承效果
class Duck extends Animal {
  constructor(name) {
    super(name);
    // 混入其他类的方法
    Object.assign(Duck.prototype, Flyable.prototype, Swimmable.prototype);
  }
}

const duck = new Duck('Donald');
duck.speak(); // Donald makes a sound.
duck.fly(); // Donald is flying.
duck.swim(); // Donald is swimming.
```

### 与其他继承方式对比
| 继承方式 | 实现原理 | 优点 | 缺点 |
|----------|----------|------|------|
| 原型链继承 | 子类原型指向父类实例 | 简单直观 | 引用类型属性共享，无法传参 |
| 构造函数继承 | 子类构造函数调用父类构造函数 | 可传参，避免引用共享 | 仅继承实例属性，无法继承原型方法 |
| 组合继承 | 原型链+构造函数 | 继承完整，可传参 | 父类构造函数被调用两次 |
| ES6 class继承 | extends+super语法糖 | 语法清晰，语义明确 | 仅支持单继承 |
| 寄生组合继承 | 修复组合继承的父类构造函数调用问题 | 高效，继承完整 | 实现复杂 |

### 面试要点
#### 1. 原理机制
**Q：ES6 class继承中，super关键字的作用是什么？**
A：super有两个主要作用：1. 作为函数调用时，代表父类的构造函数，必须在子类构造函数中调用，且在使用this之前；2. 作为对象调用时，在普通方法中指向父类的原型对象，在静态方法中指向父类。例如：`super.speak()`调用父类的speak方法，`super()`调用父类构造函数。

**Q：子类为什么必须在构造函数中调用super()？如果不调用会怎样？**
A：因为ES6规定，子类实例的构建依赖于父类实例的构建。子类构造函数中，this对象是通过父类构造函数初始化的，只有调用了super()，才能获得this对象。如果不调用super()就使用this，会抛出ReferenceError。如果子类没有定义构造函数，会默认添加包含super()的构造函数。

#### 2. 实现对比
**Q：ES5原型链继承和ES6 class继承的区别是什么？**
A：核心区别：1. 语法层面：class继承使用extends和super，更简洁语义化；原型链继承需手动设置原型链。2. 构造函数：class继承中父类构造函数只调用一次；组合继承中父类构造函数会调用两次。3. 继承范围：class继承会继承静态方法；原型链继承需额外处理静态方法。4. 错误处理：class继承中不调用super会报错；原型链继承无强制要求。

**Q：如何实现class的多继承？**
A：JavaScript不支持多继承，但可通过以下方式模拟：1. 混入（Mixin）模式：将其他类的方法复制到子类原型；2. 接口实现：通过implements关键字（TypeScript）；3. 组合优于继承：将其他类的实例作为子类的属性。示例见上文“继承链与多继承限制”中的混入实现。


## 6.防抖和节流

### 概念解析
**防抖(Debounce)** 和**节流(Throttle)** 是两种常用的高频事件优化技术，用于控制函数执行频率，避免因事件频繁触发导致的性能问题。二者核心差异在于：防抖关注**事件停止触发后的延迟执行**，节流关注**事件触发的固定间隔执行**。

#### 核心区别对比
| 特性 | 防抖(Debounce) | 节流(Throttle) |
|------|---------------|---------------|
| 触发时机 | 事件停止后n秒执行 | 每n秒最多执行一次 |
| 适用场景 | 输入验证、搜索联想 | 滚动加载、高频点击 |
| 实现原理 | 重置定时器 | 定时器/时间戳 |
| 执行次数 | 最后一次触发后执行一次 | 固定间隔均匀执行 |
| 典型案例 | 搜索框输入完成后查询 | 页面滚动时加载数据 |

### 核心实现
#### 1. 防抖函数(Debounce)
##### （1）基础版防抖
```javascript
/**
 * 防抖函数基础版
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, delay) {
  let timer = null; // 定时器标识

  return function(...args) {
    const context = this; // 保存this指向

    // 如果有定时器则清除
    if (timer) clearTimeout(timer);

    // 创建新的定时器
    timer = setTimeout(() => {
      func.apply(context, args); // 延迟后执行
    }, delay);
  };
}
```

##### （2）立即执行版防抖
```javascript
/**
 * 支持立即执行的防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 延迟时间(ms)
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖处理后的函数
 */
function debounceImmediate(func, delay, immediate = false) {
  let timer = null;

  return function(...args) {
    const context = this;
    const callNow = immediate && !timer;

    // 清除定时器
    if (timer) clearTimeout(timer);

    // 立即执行情况
    if (callNow) {
      func.apply(context, args);
    }

    // 设置新定时器
    timer = setTimeout(() => {
      // 非立即执行情况/延迟后执行
      if (!immediate) {
        func.apply(context, args);
      }
      timer = null; // 执行后重置
    }, delay);
  };
}
```

#### 2. 节流函数(Throttle)
##### （1）时间戳版节流
```javascript
/**
 * 时间戳版节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} interval - 时间间隔(ms)
 * @returns {Function} 节流处理后的函数
 */
function throttleTimestamp(func, interval) {
  let lastTime = 0; // 上次执行时间

  return function(...args) {
    const context = this;
    const now = Date.now(); // 当前时间

    // 如果当前时间 - 上次执行时间 >= 间隔时间
    if (now - lastTime >= interval) {
      func.apply(context, args);
      lastTime = now; // 更新上次执行时间
    }
  };
}
```

##### （2）定时器版节流
```javascript
/**
 * 定时器版节流函数
 * @param {Function} func - 需要节流的函数
 * @param {interval} interval - 时间间隔(ms)
 * @returns {Function} 节流处理后的函数
 */
function throttleTimer(func, interval) {
  let timer = null;

  return function(...args) {
    const context = this;

    // 如果没有定时器则创建
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(context, args);
        timer = null; // 执行后清除定时器
      }, interval);
    }
  };
}
```

##### （3）增强版节流(支持立即执行和尾部执行)
```javascript
/**
 * 增强版节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} interval - 时间间隔(ms)
 * @param {Object} options - 配置项
 * @param {boolean} options.leading - 是否立即执行
 * @param {boolean} options.trailing - 是否延迟执行
 * @returns {Function} 节流处理后的函数
 */
function throttle(func, interval, { leading = true, trailing = true } = {}) {
  let timer = null;
  let lastTime = 0;

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return function(...args) {
    const context = this;
    const now = Date.now();

    // 如果不立即执行，且是第一次执行
    if (!leading && !lastTime) {
      lastTime = now;
    }

    // 计算剩余时间
    const remaining = interval - (now - lastTime);

    // 立即执行条件
    if (remaining <= 0 || remaining > interval) {
      if (leading) {
        clear();
        func.apply(context, args);
        lastTime = now;
      }
    } else if (trailing && !timer) {
      // 延迟执行
      timer = setTimeout(() => {
        func.apply(context, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }

    // 取消功能
    return clear;
  };
}
```

### 应用示例
#### 1. 防抖应用
```javascript
// 搜索框防抖示例
const searchInput = document.getElementById('search-input');

// 防抖处理搜索函数
const debouncedSearch = debounce(function(e) {
  console.log('搜索:', e.target.value);
  // 实际搜索请求...
}, 500);

// 输入事件绑定防抖函数
searchInput.addEventListener('input', debouncedSearch);

// 窗口 resize 防抖
const debouncedResize = debounce(function() {
  console.log('窗口大小:', window.innerWidth, window.innerHeight);
}, 300);
window.addEventListener('resize', debouncedResize);
```

#### 2. 节流应用
```javascript
// 滚动加载节流示例
const throttleScroll = throttle(function() {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  // 判断是否滚动到底部
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    console.log('加载更多数据...');
    // 加载数据请求...
  }
}, 1000);

window.addEventListener('scroll', throttleScroll);

// 按钮点击节流
const button = document.getElementById('submit-btn');
const throttleClick = throttle(function() {
  console.log('按钮点击');
  // 提交请求...
}, 2000);
button.addEventListener('click', throttleClick);
```

### 面试要点
#### 1. 原理辨析
**Q：防抖和节流的区别是什么？分别适用于什么场景？**
A：核心区别在于触发时机：防抖是事件停止后延迟执行（如搜索框输入完成后查询）；节流是固定间隔执行（如滚动加载）。适用场景：防抖适合输入验证、搜索联想、窗口resize等；节流适合滚动加载、高频点击、鼠标移动等需要控制执行频率的场景。

**Q：如何实现带立即执行和取消功能的防抖函数？**
A：实现要点：1. 添加immediate参数控制是否立即执行；2. 首次触发且immediate为true时立即执行；3. 返回取消函数用于清除定时器；4. 使用apply保持this指向。代码示例：
```javascript
function debounce(func, delay, immediate = false) {
  let timer = null;
  const debounced = function(...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    if (immediate && !timer) {
      func.apply(context, args);
    }
    timer = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args);
      }
      timer = null;
    }, delay);
  };
  // 取消功能
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}
```

#### 2. 手写实现
**Q：手写实现一个防抖函数，并说明注意事项？**
A：注意事项：1. 保持this指向正确；2. 传递函数参数；3. 支持立即执行；4. 提供取消功能；5. 防止内存泄漏。实现代码见上文增强版防抖函数。

**Q：如何解决防抖/节流函数中 this 指向和参数传递问题？**
A：解决this指向：使用apply/call绑定调用时的context；解决参数传递：使用剩余参数(...args)收集参数并传递给原函数。例如：`func.apply(context, args)`。

## 7.`Ajax`原生实现

### 概念解析
**Ajax（Asynchronous JavaScript and XML）** 是一种通过JavaScript异步请求服务器数据并更新页面部分内容的技术，核心特点是**不刷新页面**完成数据交互。原生Ajax基于`XMLHttpRequest`对象实现，是现代前端数据交互的基础，尽管现在Fetch API逐渐普及，但理解XMLHttpRequest的工作原理仍对掌握前端通信至关重要。

#### 核心作用
- 实现异步数据请求，避免页面刷新
- 局部更新页面内容，提升用户体验
- 减少冗余数据传输，提高性能
- 支持多种数据格式（XML、JSON、HTML等）

### 核心实现：XMLHttpRequest
#### 1. 基础请求流程
一个完整的Ajax请求包含以下步骤：
1. 创建XMLHttpRequest对象
2. 配置请求方法和URL
3. 设置请求头（可选）
4. 注册响应处理事件
5. 发送请求
6. 处理响应数据
7. 错误处理

#### 2. 完整实现代码
```javascript
/**
 * 原生Ajax实现
 * @param {Object} options - 请求配置
 * @param {string} options.method - 请求方法(GET/POST等)
 * @param {string} options.url - 请求URL
 * @param {Object} [options.headers] - 请求头
 * @param {Object|string} [options.data] - 请求数据
 * @param {number} [options.timeout=3000] - 超时时间(ms)
 * @param {Function} options.success - 成功回调
 * @param {Function} options.error - 错误回调
 */
function ajax(options) {
  // 默认配置
  const defaults = {
    method: 'GET',
    headers: {},
    timeout: 3000,
    data: null,
    success: () => {},
    error: () => {}
  };

  // 合并配置
  const config = { ...defaults, ...options };
  config.method = config.method.toUpperCase();

  // 创建XMLHttpRequest对象
  const xhr = new XMLHttpRequest();

  // 处理请求数据
  let requestData = null;
  if (config.data) {
    if (typeof config.data === 'object') {
      // 对象转查询字符串
      requestData = Object.entries(config.data)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    } else {
      requestData = config.data;
    }
  }

  // 处理GET请求参数
  if (config.method === 'GET' && requestData) {
    config.url += (config.url.includes('?') ? '&' : '?') + requestData;
    requestData = null; // GET请求数据在URL中，body应为null
  }

  // 初始化请求
  xhr.open(config.method, config.url, true); // 第三个参数表示异步

  // 设置请求头
  Object.entries(config.headers).forEach(([key, value]) => {
    xhr.setRequestHeader(key, value);
  });

  // 默认Content-Type
  if (config.method === 'POST' && !config.headers['Content-Type'] && config.data) {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  // 响应处理
  xhr.onreadystatechange = function() {
    // readyState为4表示请求完成
    if (xhr.readyState === 4) {
      // 状态码2xx表示成功
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        let responseData = xhr.responseText;
        // 尝试解析JSON
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // 非JSON格式不处理
        }
        config.success(responseData, xhr.status, xhr);
      } else {
        // HTTP错误状态码
        config.error(new Error(`HTTP Error: ${xhr.status}`), xhr.status, xhr);
      }
    }
  };

  // 网络错误处理
  xhr.onerror = function() {
    config.error(new Error('Network Error'), xhr.status, xhr);
  };

  // 超时处理
  xhr.ontimeout = function() {
    config.error(new Error(`Timeout after ${config.timeout}ms`), xhr.status, xhr);
  };

  // 设置超时时间
  xhr.timeout = config.timeout;

  // 发送请求
  xhr.send(requestData);

  // 返回xhr对象，支持取消请求等操作
  return xhr;
}
```

#### 3. 使用示例
```javascript
// GET请求示例
ajax({
  method: 'GET',
  url: 'https://api.example.com/users',
  data: { id: 1, name: 'test' },
  headers: {
    'Authorization': 'Bearer token123'
  },
  success: function(data, status, xhr) {
    console.log('GET请求成功:', data);
  },
  error: function(error, status, xhr) {
    console.error('GET请求失败:', error.message);
  }
});

// POST请求示例
ajax({
  method: 'POST',
  url: 'https://api.example.com/users',
  data: JSON.stringify({ name: '张三', age: 30 }),
  headers: {
    'Content-Type': 'application/json'
  },
  success: function(data) {
    console.log('POST请求成功:', data);
  },
  error: function(error) {
    console.error('POST请求失败:', error.message);
  }
});
```

#### 4. 支持JSONP跨域请求
```javascript
/**
 * JSONP跨域请求实现
 * @param {Object} options - JSONP配置
 * @param {string} options.url - 请求URL
 * @param {Object} [options.data] - 请求参数
 * @param {string} [options.callbackName] - 回调函数名
 * @param {Function} options.success - 成功回调
 * @param {Function} options.error - 错误回调
 * @param {number} [options.timeout=3000] - 超时时间
 */
function jsonp(options) {
  const defaults = {
    callbackName: `jsonp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timeout: 3000,
    data: {},
    success: () => {},
    error: () => {}
  };

  const config = { ...defaults, ...options };

  // 创建script标签
  const script = document.createElement('script');
  const head = document.head || document.getElementsByTagName('head')[0];

  // 处理参数
  const params = { ...config.data, callback: config.callbackName };
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  // 构建URL
  const url = `${config.url}${config.url.includes('?') ? '&' : '?'}${queryString}`;

  // 全局回调函数
  window[config.callbackName] = function(data) {
    clearTimeout(timeoutTimer);
    config.success(data);
    cleanup();
  };

  // 错误处理
  script.onerror = function() {
    clearTimeout(timeoutTimer);
    config.error(new Error('JSONP Error'));
    cleanup();
  };

  // 超时处理
  const timeoutTimer = setTimeout(() => {
    config.error(new Error(`JSONP Timeout after ${config.timeout}ms`));
    cleanup();
  }, config.timeout);

  // 清理函数
  function cleanup() {
    delete window[config.callbackName];
    head.removeChild(script);
  }

  // 设置script属性
  script.src = url;
  script.type = 'text/javascript';
  script.charset = 'utf-8';

  // 添加到页面
  head.appendChild(script);

  // 返回清理函数
  return cleanup;
}

// JSONP使用示例
jsonp({
  url: 'https://api.example.com/crossdomain',
  data: { action: 'getList' },
  success: function(data) {
    console.log('JSONP请求成功:', data);
  },
  error: function(error) {
    console.error('JSONP请求失败:', error);
  }
});
```

### 与Fetch API对比
| 特性 | 原生Ajax(XMLHttpRequest) | Fetch API |
|------|-------------------------|-----------|
| 语法 | 回调函数 | Promise+async/await |
| 错误处理 | 需手动判断status | 仅网络错误会reject，HTTP错误需手动处理 |
| 超时处理 | 内置ontimeout事件 | 需结合Promise.race实现 |
| 取消请求 | abort()方法 | AbortController |
| 进度事件 | 支持progress事件 | 需通过ReadableStream实现 |
| 兼容性 | 所有浏览器 | ES6+浏览器，需polyfill |

### 面试要点
#### 1. 原理机制
**Q：Ajax的工作原理是什么？使用XMLHttpRequest的步骤有哪些？**
A：Ajax通过XMLHttpRequest对象与服务器进行异步通信，步骤：1. 创建XMLHttpRequest对象；2. 调用open()方法配置请求；3. 设置onreadystatechange等事件监听响应；4. 调用send()发送请求；5. 在回调中处理响应数据。核心是通过JavaScript异步获取数据并更新DOM，实现页面无刷新更新。

**Q：GET和POST请求的区别是什么？**
A：主要区别：1. 数据位置：GET在URL查询字符串，POST在请求体；2. 长度限制：GET受URL长度限制，POST理论无限制；3. 缓存：GET可被缓存，POST不可；4. 安全性：POST相对安全（数据不暴露在URL）；5. 幂等性：GET是幂等的（多次请求结果相同），POST不是。

#### 2. 手写实现
**Q：手写实现一个支持GET/POST、JSONP、超时处理的Ajax函数？**
A：实现要点：1. 处理不同请求方法的数据格式；2. 设置请求头（特别是POST的Content-Type）；3. 完善的错误处理（网络错误、超时、HTTP错误）；4. 支持JSON自动解析；5. 实现JSONP跨域请求；6. 返回xhr对象支持取消请求。代码见上文完整实现。

**Q：如何解决Ajax跨域问题？**
A：常见解决方案：1. JSONP（利用script标签跨域特性，仅支持GET）；2. CORS（服务端设置Access-Control-Allow-Origin响应头）；3. 代理服务器（如Nginx反向代理）；4. document.domain+iframe（同主域下的跨子域）；5. WebSocket（不受同源策略限制）。生产环境推荐CORS，开发环境常用代理服务器。

## 8.深拷贝的几种方法与比较

### 概念解析
**深拷贝**是创建一个完全独立的对象副本，新对象与原对象不共享内存，修改新对象不会影响原对象。与之相对的是**浅拷贝**，浅拷贝仅复制对象的顶层属性，对于嵌套对象仍共享引用。深拷贝是处理复杂数据结构时避免副作用的重要技术，广泛应用于状态管理、数据不可变性等场景。

#### 深拷贝vs浅拷贝对比
| 特性 | 浅拷贝 | 深拷贝 |
|------|--------|--------|
| 复制层级 | 仅顶层属性 | 所有层级 |
| 引用类型 | 共享引用 | 完全复制 |
| 内存占用 | 较少 | 较多 |
| 执行效率 | 较高 | 较低 |
| 适用场景 | 扁平对象 | 嵌套对象 |
| 典型方法 | Object.assign、扩展运算符 | JSON.parse/stringify、递归拷贝 |

### 常用实现方法
#### 1. JSON序列化/反序列化
```javascript
/**
 * JSON方法实现深拷贝
 * @param {Object} obj - 需要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
function jsonDeepCopy(obj) {
  // 处理循环引用会抛出错误
  return JSON.parse(JSON.stringify(obj));
}

// 使用示例
const obj = {
  name: '张三',
  age: 30,
  address: { city: '北京' },
  hobbies: ['篮球', '编程']
};

const copy = jsonDeepCopy(obj);
copy.address.city = '上海';
copy.hobbies.push('阅读');

console.log(obj.address.city); // 北京（原对象不受影响）
console.log(obj.hobbies); // ['篮球', '编程']（原数组不受影响）
```

#### 2. 递归实现深拷贝
```javascript
/**
 * 基础递归深拷贝
 * @param {Object} obj - 需要拷贝的对象
 * @param {WeakMap} [hash=new WeakMap()] - 用于处理循环引用
 * @returns {Object} 拷贝后的新对象
 */
function deepCopy(obj, hash = new WeakMap()) {
  // 基本类型直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 日期对象
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 正则对象
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 数组或对象
  const cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj); // 缓存已拷贝对象

  // 递归拷贝属性
  Reflect.ownKeys(obj).forEach(key => {
    cloneObj[key] = deepCopy(obj[key], hash);
  });

  return cloneObj;
}
```

#### 3. 结构化克隆API
```javascript
/**
 * 使用structuredClone实现深拷贝
 * @param {Object} obj - 需要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
function structuredCloneCopy(obj) {
  // 浏览器原生API，支持循环引用
  return structuredClone(obj);
}
```

#### 4. 第三方库实现
```javascript
// Lodash深拷贝
import _ from 'lodash';
const clone = _.cloneDeep(obj);
```

### 方法对比与适用场景
| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| JSON.parse/stringify | 简单易用，浏览器原生 | 不支持函数、循环引用、特殊对象 | 简单数据，无特殊类型 |
| 基础递归拷贝 | 可定制，支持特殊对象 | 实现复杂，需处理多种类型 | 复杂对象，需精细控制 |
| 增强递归拷贝 | 支持循环引用、特殊类型 | 代码量大 | 包含循环引用的对象 |
| structuredClone | 浏览器原生，支持循环引用 | 兼容性有限，不支持函数 | 现代浏览器环境 |
| Lodash.cloneDeep | 功能全面，兼容性好 | 引入第三方依赖 | 企业级项目，多种数据类型 |

### 特殊情况处理
#### 1. 循环引用处理
```javascript
// 循环引用对象
const obj = { a: 1 };
obj.self = obj;

// 使用带WeakMap的深拷贝可正常处理
const copy = deepCopy(obj);
console.log(copy.self === copy); // true（正确复制循环引用）
```

#### 2. 特殊对象拷贝
```javascript
// 拷贝函数（JSON方法不支持）
function copyFunction(obj) {
  if (typeof obj === 'function') {
    // 函数序列化与反序列化
    return eval(`(${obj.toString()})`);
  }
  // 其他类型处理...
}
```

### 面试要点
#### 1. 原理辨析
**Q：JSON.parse(JSON.stringify(obj))实现深拷贝的缺点是什么？**
A：主要缺点：1. 不支持函数、undefined、Symbol类型；2. 不支持循环引用，会抛出错误；3. 特殊对象如Date、RegExp、Map、Set等处理不完整（Date会转为字符串再转为Date，RegExp会丢失lastIndex等属性）；4. 数值精度问题（极大或极小的数字可能失真）。

**Q：深拷贝中如何处理循环引用？**
A：解决方案：使用WeakMap记录已拷贝对象，当遇到相同对象时直接返回缓存的拷贝结果。实现代码见上文增强版递归拷贝，核心是`hash = new WeakMap()`缓存已处理对象，避免无限递归。

#### 2. 手写实现
**Q：手写实现一个深拷贝函数，需要支持循环引用和特殊对象？**
A：实现要点：1. 区分基本类型和引用类型；2. 处理数组、对象、Date、RegExp等特殊对象；3. 使用WeakMap处理循环引用；4. 递归拷贝属性。代码见上文“增强版递归深拷贝”。

**Q：如何判断一个对象是否需要深拷贝？**
A：判断依据：1. 对象是否包含嵌套引用类型；2. 是否需要修改对象且不影响原对象；3. 是否存在循环引用。简单扁平对象使用浅拷贝更高效，包含嵌套结构且需独立修改时使用深拷贝。

## 9.继承的几种实现与比较

### 概念解析
**继承**是面向对象编程的核心特性之一，允许子类复用父类的属性和方法，并可以扩展新功能。JavaScript作为基于原型的语言，其继承机制与基于类的语言（如Java）有本质区别，主要通过**原型链**实现。ES5及之前需手动构建原型链，ES6引入`class`和`extends`语法糖，简化了继承实现，但底层仍基于原型机制。

#### 继承核心目标
- 复用父类属性和方法
- 扩展子类特有功能
- 维持正确的原型链关系
- 支持 instanceof 等类型判断

### 主要实现方式
#### 1. 原型链继承
**原理**：将子类原型指向父类实例，使子类实例通过原型链访问父类属性和方法。

```javascript
// 父类
function Parent() {
  this.name = 'Parent';
  this.colors = ['red', 'blue'];
}

// 父类原型方法
Parent.prototype.getName = function() {
  return this.name;
};

// 子类
function Child() {}

// 核心：子类原型指向父类实例
Child.prototype = new Parent();
// 修复构造函数指向
Child.prototype.constructor = Child;

// 使用示例
const child1 = new Child();
const child2 = new Child();

child1.colors.push('green');
console.log(child1.colors); // ['red', 'blue', 'green']
console.log(child2.colors); // ['red', 'blue', 'green']（引用类型共享问题）
console.log(child1.getName()); // 'Parent'
console.log(child1 instanceof Child); // true
console.log(child1 instanceof Parent); // true
```

**优缺点**：
- ✅ 实现简单，符合原型链自然机制
- ✅ 父类新增原型方法/属性，子类可访问
- ❌ 引用类型属性被所有实例共享
- ❌ 无法向父类构造函数传递参数
- ❌ 创建子类实例时，无法直接调用父类构造函数

#### 2. 构造函数继承
**原理**：在子类构造函数中调用父类构造函数，通过`call/apply`绑定父类`this`，实现实例属性继承。

```javascript
// 父类
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

// 父类原型方法（构造函数继承无法继承原型方法）
Parent.prototype.getName = function() {
  return this.name;
};

// 子类
function Child(name, age) {
  // 核心：调用父类构造函数
  Parent.call(this, name);
  this.age = age; // 子类特有属性
}

// 使用示例
const child1 = new Child('张三', 20);
const child2 = new Child('李四', 22);

child1.colors.push('green');
console.log(child1.colors); // ['red', 'blue', 'green']
console.log(child2.colors); // ['red', 'blue']（解决引用类型共享问题）
console.log(child1.name); // '张三'（成功传递参数）
console.log(child1.getName); // undefined（无法继承原型方法）
```

**优缺点**：
- ✅ 避免引用类型属性共享问题
- ✅ 可向父类构造函数传递参数
- ✅ 可多继承（多次调用call）
- ❌ 无法继承父类原型方法/属性
- ❌ 方法定义在构造函数中，函数复用性差

#### 3. 组合继承
**原理**：结合原型链继承和构造函数继承，用原型链继承原型方法，用构造函数继承实例属性。

```javascript
// 父类
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

// 父类原型方法
Parent.prototype.getName = function() {
  return this.name;
};

// 子类
function Child(name, age) {
  // 构造函数继承：继承实例属性
  Parent.call(this, name);
  this.age = age;
}

// 原型链继承：继承原型方法
Child.prototype = new Parent();
// 修复构造函数指向
Child.prototype.constructor = Child;

// 子类原型方法
Child.prototype.getAge = function() {
  return this.age;
};

// 使用示例
const child = new Child('张三', 20);
console.log(child.getName()); // '张三'（继承原型方法）
console.log(child.getAge()); // 20（子类方法）
console.log(child.colors); // ['red', 'blue']
```

**优缺点**：
- ✅ 既继承实例属性，又继承原型方法
- ✅ 可向父类传递参数
- ✅ 引用类型属性不共享
- ❌ 父类构造函数被调用两次（`new Parent()`和`Parent.call()`）
- ❌ 子类原型上存在多余的父类实例属性

#### 4. 寄生组合继承（最优方案）
**原理**：通过寄生方式创建父类原型的副本，避免组合继承中父类构造函数被调用两次的问题。

```javascript
// 寄生函数：创建父类原型的副本
function inheritPrototype(child, parent) {
  // 创建父类原型的浅拷贝
  const prototype = Object.create(parent.prototype);
  // 修复构造函数指向
  prototype.constructor = child;
  // 将子类原型指向新创建的原型
  child.prototype = prototype;
}

// 父类
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

// 父类原型方法
Parent.prototype.getName = function() {
  return this.name;
};

// 子类
function Child(name, age) {
  Parent.call(this, name); // 构造函数继承
  this.age = age;
}

// 核心：寄生组合继承原型
inheritPrototype(Child, Parent);

// 使用示例
const child = new Child('张三', 20);
console.log(child.getName()); // '张三'
console.log(child instanceof Parent); // true
console.log(Child.prototype.constructor === Child); // true
```

**优缺点**：
- ✅ 完美继承：实例属性+原型方法
- ✅ 父类构造函数仅调用一次
- ✅ 原型链清晰，无多余属性
- ❌ 实现复杂，需额外寄生函数

#### 5. ES6 class继承
**原理**：通过`class`和`extends`语法糖实现继承，底层仍基于原型链，但语法更清晰。

```javascript
// 父类
class Parent {
  constructor(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
  }

  // 原型方法
  getName() {
    return this.name;
  }

  // 静态方法
  static isParent(obj) {
    return obj instanceof Parent;
  }
}

// 子类
class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }

  // 子类方法
  getAge() {
    return this.age;
  }
}

// 使用示例
const child = new Child('张三', 20);
console.log(child.getName()); // '张三'
console.log(child.getAge()); // 20
console.log(Parent.isParent(child)); // true
```

**优缺点**：
- ✅ 语法简洁清晰，语义明确
- ✅ 自动修复构造函数指向
- ✅ 支持`super`调用父类方法
- ✅ 支持静态方法继承
- ❌ ES6语法，旧环境需转译

### 继承方式对比
| 继承方式 | 实现难度 | 实例属性 | 原型方法 | 传参 | 引用共享 | 父类调用次数 |
|----------|----------|----------|----------|------|----------|--------------|
| 原型链继承 | 简单 | 继承 | 继承 | ❌ | ✅ | 1 |
| 构造函数继承 | 简单 | 继承 | ❌ | ✅ | ❌ | 1 |
| 组合继承 | 中等 | 继承 | 继承 | ✅ | ❌ | 2 |
| 寄生组合继承 | 复杂 | 继承 | 继承 | ✅ | ❌ | 1 |
| ES6 class继承 | 简单 | 继承 | 继承 | ✅ | ❌ | 1 |

### 面试要点
#### 1. 原理辨析
**Q：寄生组合继承为什么是ES5最优继承方案？**
A：因为它解决了组合继承的核心问题：1. 通过`Object.create(parent.prototype)`避免创建父类实例，减少一次父类构造函数调用；2. 保持原型链清晰，子类原型仅包含父类原型方法；3. 同时拥有组合继承的优点（继承实例属性和原型方法、支持传参）。

**Q：ES6 class继承和ES5寄生组合继承的关系？**
A：ES6 class继承是寄生组合继承的语法糖，主要区别：1. class继承使用`extends`声明，更简洁；2. `super`关键字替代`Parent.call(this)`；3. 自动修复构造函数指向；4. 支持静态方法继承。本质上，`class Child extends Parent`等价于寄生组合继承。

#### 2. 手写实现
**Q：手写实现寄生组合继承？**
A：核心步骤：1. 创建父类原型的副本；2. 修复副本的构造函数指向；3. 将子类原型指向该副本；4. 在子类构造函数中调用父类构造函数。代码见上文寄生组合继承实现。

**Q：如何实现多继承？**
A：JavaScript不支持多继承，但可通过混合模式（Mixin）模拟：
```javascript
function mixin(...sources) {
  const target = {};
  sources.forEach(source => {
    Object.assign(target, source.prototype);
  });
  return target;
}

// 多继承示例
class Child {
  constructor() {
    Parent1.call(this);
    Parent2.call(this);
  }
}
Child.prototype = mixin(Parent1, Parent2);
Child.prototype.constructor = Child;
```

## 10.未知宽高的元素水平垂直居中

### 概念解析
**未知宽高元素的水平垂直居中**是前端布局中的常见需求，指在元素尺寸不确定（由内容动态决定）的情况下，使其在父容器中同时水平和垂直居中。这种场景广泛存在于弹窗、模态框、加载提示等组件中，核心挑战是如何在不依赖固定尺寸的前提下实现精准居中。

#### 居中方案分类
根据实现技术可分为四大类：**CSS布局方案**、**定位方案**、**表格相关方案**和**现代CSS方案**。不同方案各有优缺点，需根据浏览器兼容性要求和场景特性选择。

### 核心实现方法
#### 1. Flexbox布局（现代首选方案）
```css
/* Flexbox居中容器 */
.flex-container {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  display: flex; /* 启用Flexbox */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 未知宽高的子元素 */
.centered-element {
  padding: 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
}
```

```html
<div class="flex-container">
  <div class="centered-element">
    未知宽高元素<br>Flexbox居中
  </div>
</div>
```

**优缺点**：
- ✅ 实现简单，代码量少
- ✅ 无需知道元素尺寸
- ✅ 支持元素动态变化
- ✅ 可同时居中多个元素
- ❌ IE9及以下不支持
- ❌ 父容器需显式设置高度

#### 2. Grid布局（最简洁方案）
```css
/* Grid居中容器 */
.grid-container {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  display: grid; /* 启用Grid */
}

/* 未知宽高的子元素 */
.grid-centered {
  margin: auto; /* Grid特有的margin:auto居中 */
  padding: 20px;
  background-color: #2196F3;
  color: white;
  border-radius: 4px;
}

/* 或使用place-items属性 */
.grid-container-alt {
  display: grid;
  place-items: center; /* 同时设置align-items和justify-items */
}
```

```html
<div class="grid-container">
  <div class="grid-centered">
    Grid居中<br>未知宽高元素
  </div>
</div>
```

**优缺点**：
- ✅ 代码最简洁（place-items: center一行实现）
- ✅ 支持复杂布局场景
- ✅ 无需额外DOM元素
- ❌ IE浏览器不支持
- ❌ 过度设计风险（简单居中用Grid可能小题大做）

#### 3. 绝对定位+Transform（兼容性较好方案）
```css
/* 定位容器 */
.position-container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
}

/* 未知宽高的子元素 */
.transform-centered {
  position: absolute;
  top: 50%; /* 父容器50% */
  left: 50%; /* 父容器50% */
  transform: translate(-50%, -50%); /* 自身尺寸的-50% */
  padding: 20px;
  background-color: #ff9800;
  color: white;
  border-radius: 4px;
}
```

```html
<div class="position-container">
  <div class="transform-centered">
    绝对定位+Transform<br>未知宽高居中
  </div>
</div>
```

**优缺点**：
- ✅ 兼容性好（IE9+支持transform）
- ✅ 不影响其他元素布局
- ❌ 可能导致文本模糊（transform的像素舍入问题）
- ❌ 定位脱离文档流，需注意父容器定位设置

#### 4. Table-Cell方案（兼容性最佳方案）
```css
/* Table容器 */
.table-container {
  display: table;
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
}

/* Table单元格 */
.table-cell {
  display: table-cell;
  vertical-align: middle; /* 垂直居中 */
  text-align: center; /* 水平居中 */
}

/* 未知宽高的子元素 */
.table-centered {
  display: inline-block; /* 关键：转为行内块元素 */
  padding: 20px;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  text-align: left; /* 重置文本对齐 */
}
```

```html
<div class="table-container">
  <div class="table-cell">
    <div class="table-centered">
      Table-Cell居中<br>兼容至IE8
    </div>
  </div>
</div>
```

**优缺点**：
- ✅ 兼容性极佳（IE8+支持）
- ✅ 文本自然居中，无模糊问题
- ❌ 需要额外嵌套DOM元素
- ❌ table布局可能影响整体页面性能

### 方案对比与选择指南
| 方案 | 实现难度 | 浏览器支持 | 性能 | 适用场景 |
|------|----------|------------|------|----------|
| Flexbox | 简单 | IE10+ | 优秀 | 现代Web应用、移动端 |
| Grid | 简单 | IE不支持 | 优秀 | 复杂布局、组件开发 |
| 绝对定位+Transform | 中等 | IE9+ | 一般 | 兼容性要求较高的场景 |
| Table-Cell | 中等 | IE8+ | 较差 | 老旧浏览器兼容 |
| ::before伪元素 | 复杂 | IE8+ | 一般 | 无法修改DOM结构时 |

#### 选择建议：
1. **现代项目**：优先使用Flexbox（简洁且兼容性足够）
2. **组件库开发**：考虑Grid+降级方案
3. **IE9+兼容**：绝对定位+Transform
4. **远古浏览器**：Table-Cell方案
5. **特殊场景**：如无法设置父容器高度，可考虑结合JavaScript动态计算

### 面试要点
#### 1. 方案辨析
**Q：实现未知宽高元素居中的最佳方案是什么？为什么？**
A：推荐Flexbox方案（`display: flex; justify-content: center; align-items: center`），原因：1. 代码简洁直观；2. 无需额外DOM元素；3. 支持动态内容尺寸变化；4. 性能优良；5. 浏览器支持广泛（IE10+）。对于现代项目，Flexbox提供了最佳的开发体验和兼容性平衡。

**Q：绝对定位+Transform和Flexbox居中的区别？**
A：核心区别：1. 定位脱离文档流，Flexbox不影响其他元素；2. Transform可能导致文本模糊；3. Flexbox提供更多对齐选项（如space-between等）；4. 定位方案父容器需显式高度，Flexbox可自适应内容高度。

#### 2. 实现细节
**Q：使用transform: translate(-50%, -50%)居中的原理是什么？**
A：原理：1. `top: 50%`和`left: 50%`将元素左上角定位到父容器中心；2. `translate(-50%, -50%)`通过CSS变换将元素自身向左上方移动自身宽高的50%，从而实现中心对齐。此方法无需知道元素尺寸，因为transform的百分比是相对于元素自身计算的。

**Q：如何解决transform居中导致的文本模糊问题？**
A：解决方案：1. 使用Flexbox替代（推荐）；2. 给父元素添加`transform-style: preserve-3d`；3. 添加`backface-visibility: hidden`；4. 使用整数像素值定位避免半像素渲染。

## 11.三栏布局的实现

### 概念解析
**三栏布局**是前端常见的页面布局形式，通常指页面包含左、中、右三个纵向排列的列，其中**左右列宽度固定，中间列宽度自适应**的布局模式。这种布局广泛应用于后台管理系统、博客、电商网站等场景，核心挑战是如何实现中间列自适应宽度的同时保证三列等高和良好的响应式表现。

#### 三栏布局核心要素
- **宽度分配**：左右列固定宽度，中间列填充剩余空间
- **高度控制**：三列高度保持一致（视觉上）
- **响应式适配**：在移动设备上合理调整布局（通常堆叠显示）
- **兼容性**：不同浏览器环境下的一致性表现

### 主要实现方法
#### 1. 浮动布局(Float)
**原理**：左右列浮动，中间列通过margin留出空间，父容器清除浮动。

```html
<!-- HTML结构 -->
<div class="float-container">
  <div class="left">左侧栏 (200px)</div>
  <div class="right">右侧栏 (200px)</div>
  <div class="middle">中间栏 (自适应宽度)</div>
</div>
```

```css
/* CSS样式 */
.float-container {
  overflow: hidden; /* 清除浮动 */
  min-height: 300px; /* 最小高度 */
}

.left {
  float: left;
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
}

.right {
  float: right;
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
}

.middle {
  margin-left: 220px; /* 左侧栏宽度+间距 */
  margin-right: 220px; /* 右侧栏宽度+间距 */
  background-color: #ffffff;
  min-height: 300px;
}
```

**优缺点**：
- ✅ 兼容性好（IE6+支持）
- ✅ 实现简单，易于理解
- ❌ 需要清除浮动，避免高度塌陷
- ❌ 中间列需放在HTML结构最后
- ❌ 难以实现三列等高
- ❌ 响应式适配复杂

#### 2. Flexbox布局
**原理**：通过Flex容器属性分配空间，中间列设置flex:1填充剩余宽度。

```html
<!-- HTML结构 -->
<div class="flex-container">
  <div class="flex-left">左侧栏 (200px)</div>
  <div class="flex-middle">中间栏 (自适应宽度)</div>
  <div class="flex-right">右侧栏 (200px)</div>
</div>
```

```css
/* CSS样式 */
.flex-container {
  display: flex;
  min-height: 300px;
  gap: 20px; /* 列间距 */
}

.flex-left,
.flex-right {
  width: 200px;
  background-color: #f0f0f0;
}

.flex-middle {
  flex: 1; /* 填充剩余空间 */
  background-color: #ffffff;
}
```

**优缺点**：
- ✅ 实现简单，代码量少
- ✅ 天然支持等高布局
- ✅ 内置间距控制(gap属性)
- ✅ 响应式适配方便
- ❌ IE9及以下不支持
- ❌ 老版本浏览器部分属性支持不一致

#### 3. Grid布局
**原理**：定义三列网格，左右列固定宽度，中间列使用fr单位填充。

```html
<!-- HTML结构 -->
<div class="grid-container">
  <div class="grid-left">左侧栏 (200px)</div>
  <div class="grid-middle">中间栏 (自适应宽度)</div>
  <div class="grid-right">右侧栏 (200px)</div>
</div>
```

```css
/* CSS样式 */
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr 200px; /* 三列定义 */
  min-height: 300px;
  grid-gap: 20px; /* 列间距 */
}

.grid-left,
.grid-right {
  background-color: #f0f0f0;
}

.grid-middle {
  background-color: #ffffff;
}
```

**优缺点**：
- ✅ 代码最简洁，语义清晰
- ✅ 强大的布局能力，支持复杂场景
- ✅ 天然等高，易于控制间距
- ❌ IE浏览器完全不支持
- ❌ 学习成本相对较高
- ❌ 过度设计风险（简单布局用Grid可能杀鸡用牛刀）

#### 4. 定位布局
**原理**：左右列绝对定位，中间列通过margin留出空间。

```html
<!-- HTML结构 -->
<div class="position-container">
  <div class="pos-left">左侧栏 (200px)</div>
  <div class="pos-middle">中间栏 (自适应宽度)</div>
  <div class="pos-right">右侧栏 (200px)</div>
</div>
```

```css
/* CSS样式 */
.position-container {
  position: relative;
  min-height: 300px;
  padding: 0 220px; /* 左右留出空间 */
}

.pos-left,
.pos-right {
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
}

.pos-left {
  left: 0;
}

.pos-right {
  right: 0;
}

.pos-middle {
  background-color: #ffffff;
  min-height: 300px;
}
```

**优缺点**：
- ✅ 实现简单，易于理解
- ✅ 兼容性较好（IE8+支持）
- ❌ 脱离文档流，可能影响后续布局
- ❌ 高度控制复杂，需父容器固定高度
- ❌ 响应式适配复杂

### 方案对比与选择指南
| 布局方式 | 实现难度 | 浏览器支持 | 等高布局 | 响应式 | 最佳适用场景 |
|----------|----------|------------|----------|--------|--------------|
| 浮动布局 | 中等 | IE6+ | ❌ 困难 | 复杂 | 兼容性要求极高的老旧项目 |
| Flexbox | 简单 | IE10+ | ✅ 天然支持 | 简单 | 现代Web应用、移动端 |
| Grid | 简单 | IE不支持 | ✅ 天然支持 | 简单 | 复杂网格布局、组件库 |
| 定位布局 | 中等 | IE8+ | ✅ 需额外处理 | 复杂 | 特殊定位需求场景 |

#### 选择建议：
1. **现代项目**：优先选择Flexbox（平衡兼容性和开发效率）
2. **组件库开发**：Grid+降级方案（如Flexbox回退）
3. **复杂布局**：Grid布局（强大的二维布局能力）
4. **兼容性需求**：浮动布局（需处理诸多问题）或定位布局
5. **响应式设计**：Flexbox+媒体查询（简单高效）

### 面试要点
#### 1. 方案辨析
**Q：实现三栏布局的最佳方案是什么？为什么？**
A：推荐Flexbox方案，原因：1. 实现简单直观（仅需设置display:flex和flex:1）；2. 天然支持等高布局；3. 内置间距控制（gap属性）；4. 响应式适配方便；5. 浏览器支持广泛（IE10+）。对于现代项目，Flexbox提供了最佳的开发体验和布局效果平衡。

**Q：如何解决三栏布局中的等高问题？**
A：不同方案的解决方案：1. Flexbox/Grid：天然等高（align-items: stretch默认值）；2. 浮动布局：使用正负padding+overflow:hidden；3. 定位布局：设置height:100%继承父容器高度；4. JavaScript：动态计算最高列高度并应用到其他列。推荐使用Flexbox或Grid的天然等高特性。

#### 2. 实现细节
**Q：浮动布局中，为什么中间列要写在HTML结构的最后？**
A：因为浮动元素脱离文档流，如果中间列写在左右列之前，左右浮动元素会覆盖中间内容。将中间列放在最后，利用margin-left和margin-right为左右浮动元素留出空间，可避免被覆盖。这是由浮动布局的特性决定的。

**Q：使用Flexbox实现三栏布局时，如何处理内容溢出问题？**
A：解决方案：1. 设置overflow: auto使溢出内容可滚动；2. 使用min-width避免中间列过度压缩；3. 结合媒体查询在小屏幕下转为堆叠布局。例如：
```css
.flex-middle {
  flex: 1;
  min-width: 300px; /* 最小宽度 */
  overflow: auto; /* 内容溢出时显示滚动条 */
}

/* 响应式适配 */
@media (max-width: 768px) {
  .flex-container {
    flex-direction: column;
  }
  .flex-left, .flex-right, .flex-middle {
    width: 100%;
  }
}
```

## 12.两栏布局的实现

### 概念解析
**两栏布局**是前端最基础的布局形式之一，通常指页面包含左右两个纵向排列的列，主要有两种模式：**左侧固定右侧自适应**和**右侧固定左侧自适应**。这种布局广泛应用于博客（侧边栏+内容区）、后台管理系统（菜单+主内容）等场景，是构建复杂布局的基础组件。

#### 两栏布局核心要素
- **宽度分配**：一栏固定宽度，另一栏填充剩余空间
- **高度控制**：两栏高度保持一致（视觉上）
- **响应式适配**：在移动设备上转为堆叠布局
- **兼容性**：不同浏览器环境下的一致性表现

### 主要实现方法
#### 1. 浮动布局(Float)
**原理**：固定列浮动，自适应列通过margin留出空间并清除浮动影响。

```html
<!-- HTML结构 -->
<div class="float-layout">
  <div class="float-left">左侧固定 (200px)</div>
  <div class="float-right">右侧自适应内容区域，会自动填充剩余空间。这种布局模式在博客和文档类网站中非常常见，侧边栏通常放置导航或作者信息，主内容区展示文章内容。</div>
</div>
```

```css
/* CSS样式 */
.float-layout {
  overflow: hidden; /* 清除浮动 */
  min-height: 300px;
}

.float-left {
  float: left;
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
  padding: 20px;
}

.float-right {
  margin-left: 220px; /* 固定列宽度+间距 */
  background-color: #ffffff;
  padding: 20px;
  min-height: 300px;
}
```

**优缺点**：
- ✅ 兼容性好（IE6+支持）
- ✅ 实现简单，易于理解
- ❌ 需要清除浮动，避免高度塌陷
- ❌ 难以实现等高布局
- ❌ 自适应列margin值需与固定列宽度保持一致

#### 2. Flexbox布局
**原理**：Flex容器中，固定列设置宽度，自适应列设置flex:1填充剩余空间。

```html
<!-- HTML结构 -->
<div class="flex-layout">
  <div class="flex-fixed">左侧固定 (200px)</div>
  <div class="flex-flexible">右侧自适应内容区域，使用Flexbox实现的两栏布局更加简洁直观，并且天然支持等高显示，是现代前端布局的首选方案。</div>
</div>
```

```css
/* CSS样式 */
.flex-layout {
  display: flex;
  min-height: 300px;
  gap: 20px; /* 列间距 */
}

.flex-fixed {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
}

.flex-flexible {
  flex: 1; /* 填充剩余空间 */
  background-color: #ffffff;
  padding: 20px;
}
```

**优缺点**：
- ✅ 实现简单，代码量少
- ✅ 天然支持等高布局
- ✅ 内置间距控制(gap属性)
- ✅ 轻松实现左右固定切换
- ❌ IE9及以下不支持
- ❌ 老版本浏览器部分属性支持不一致

#### 3. Grid布局
**原理**：定义两列网格，固定列设置具体宽度，自适应列使用fr单位。

```html
<!-- HTML结构 -->
<div class="grid-layout">
  <div class="grid-fixed">右侧固定 (200px)</div>
  <div class="grid-flexible">左侧自适应内容区域，Grid布局提供了最直接的两栏布局实现方式，代码简洁且语义清晰。</div>
</div>
```

```css
/* CSS样式 */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 200px; /* 左侧自适应，右侧固定 */
  min-height: 300px;
  grid-gap: 20px;
}

.grid-fixed {
  background-color: #f0f0f0;
  padding: 20px;
}

.grid-flexible {
  background-color: #ffffff;
  padding: 20px;
}
```

**优缺点**：
- ✅ 代码最简洁，语义清晰
- ✅ 轻松实现任意一列固定
- ✅ 天然支持等高布局
- ✅ 内置间距控制
- ❌ IE浏览器完全不支持
- ❌ 学习成本相对较高

#### 4. 定位布局
**原理**：固定列绝对定位，自适应列通过margin留出空间。

```html
<!-- HTML结构 -->
<div class="position-layout">
  <div class="position-fixed">右侧固定 (200px)</div>
  <div class="position-flexible">左侧自适应内容区域，定位布局实现简单但脱离文档流，需要注意父容器高度控制。</div>
</div>
```

```css
/* CSS样式 */
.position-layout {
  position: relative;
  min-height: 300px;
  padding-right: 220px; /* 为固定列留出空间 */
}

.position-fixed {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
  padding: 20px;
}

.position-flexible {
  background-color: #ffffff;
  padding: 20px;
  min-height: 300px;
}
```

**优缺点**：
- ✅ 实现简单，易于理解
- ✅ 兼容性较好（IE8+支持）
- ✅ 可轻松实现左右固定切换
- ❌ 脱离文档流，可能影响后续布局
- ❌ 高度控制复杂
- ❌ 自适应列margin值需与固定列宽度保持一致

### 方案对比与选择指南
| 布局方式 | 实现难度 | 浏览器支持 | 等高布局 | 响应式 | 最佳适用场景 |
|----------|----------|------------|----------|--------|--------------|
| 浮动布局 | 中等 | IE6+ | ❌ 困难 | 复杂 | 兼容性要求极高的老旧项目 |
| Flexbox | 简单 | IE10+ | ✅ 天然支持 | 简单 | 现代Web应用、移动端 |
| Grid | 简单 | IE不支持 | ✅ 天然支持 | 简单 | 复杂网格布局、组件库 |
| 定位布局 | 中等 | IE8+ | ✅ 需额外处理 | 复杂 | 特殊定位需求场景 |

#### 选择建议：
1. **现代项目**：优先选择Flexbox（平衡兼容性和开发效率）
2. **简单场景**：Grid布局（代码最简洁）
3. **兼容性需求**：浮动布局或定位布局
4. **响应式设计**：Flexbox/Grid+媒体查询
5. **侧边栏固定**：可结合position: sticky实现滚动时固定

### 面试要点
#### 1. 方案辨析
**Q：实现两栏布局的最佳方案是什么？为什么？**
A：推荐Flexbox方案，原因：1. 实现简单直观（仅需设置display:flex和flex:1）；2. 天然支持等高布局；3. 内置间距控制（gap属性）；4. 轻松实现左右固定切换；5. 响应式适配方便；6. 浏览器支持广泛（IE10+）。

**Q：两栏布局中，如何实现左侧固定右侧自适应，且当屏幕宽度小于768px时转为堆叠布局？**
A：使用Flexbox+媒体查询实现：
```css
.container {
  display: flex;
  gap: 20px;
}
.fixed {
  width: 200px;
}
.flexible {
  flex: 1;
}
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  .fixed {
    width: 100%;
  }
}
```

#### 2. 实现细节
**Q：浮动布局中，如何解决自适应列内容被固定列覆盖的问题？**
A：解决方案：1. 给自适应列添加margin-left/margin-right（值等于固定列宽度+间距）；2. 确保自适应列不包含浮动属性；3. 父容器清除浮动避免高度塌陷。这是浮动布局实现两栏布局的核心要点。

**Q：如何实现左侧固定宽度，右侧自适应且高度与左侧保持一致的两栏布局？**
A：最佳方案是使用Flexbox：
```css
.container {
  display: flex;
  align-items: stretch; /* 默认值，确保等高 */
}
.left {
  width: 200px;
}
.right {
  flex: 1;
}
```
Flexbox的align-items: stretch属性会使所有子元素高度相等，自动适应最高列的高度。

## 13.`React`高阶组件

### 概念解析
**高阶组件(HOC, Higher-Order Component)** 是React中复用组件逻辑的高级技巧，本质是**接收组件作为参数并返回增强组件的函数**。HOC不是React API的一部分，而是基于React组合特性的设计模式，核心思想是将组件逻辑抽象为可复用的函数，实现跨组件共享功能。

#### 高阶组件核心特性
- **纯函数**：不修改输入组件，返回新组件
- **组合特性**：通过包装组件实现功能增强
- **无副作用**：仅关注逻辑复用，不直接影响渲染
- **可组合**：多个HOC可嵌套使用
- **命名规范**：通常以`with`前缀命名（如withRouter、withAuth）

### 核心实现
#### 1. 基础高阶组件结构
```javascript
/**
 * 基础高阶组件模板
 * @param {Component} WrappedComponent - 被包装的组件
 * @returns {Component} 增强后的组件
 */
function withEnhancement(WrappedComponent) {
  // 返回新的函数组件或类组件
  return function EnhancedComponent(props) {
    // 添加增强逻辑
    const enhancedProp = '这是高阶组件添加的属性';

    // 将props传递给被包装组件
    return <WrappedComponent {...props} enhancedProp={enhancedProp} />;
  };
}

// 使用示例
class MyComponent extends React.Component {
  render() {
    return <div>{this.props.enhancedProp}</div>;
  }
}

// 增强组件
const EnhancedMyComponent = withEnhancement(MyComponent);
```

#### 2. 带参数的高阶组件
```javascript
/**
 * 带参数的高阶组件
 * @param {string} message - 自定义消息
 * @returns {Function} 高阶组件
 */
function withMessage(message) {
  // 返回高阶组件
  return function(WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        console.log('HOC Message:', message);
      }

      render() {
        return <WrappedComponent {...this.props} message={message} />;
      }
    };
  };
}

// 使用示例
// 先调用高阶组件工厂函数传入参数，再传入组件
const ComponentWithMessage = withMessage('Hello from HOC')(MyComponent);
```

#### 3. 高阶组件组合
```javascript
/**
 * 组合多个高阶组件
 * @param {...Function} hocs - 高阶组件列表
 * @returns {Function} 组合后的高阶组件
 */
function compose(...hocs) {
  return function(WrappedComponent) {
    return hocs.reduceRight((component, hoc) => hoc(component), WrappedComponent);
  };
}

// 定义多个简单HOC
const withLogging = WrappedComponent => props => {
  console.log('Rendering:', WrappedComponent.name);
  return <WrappedComponent {...props} />;
};

const withStyle = WrappedComponent => props => (
  <div style={{ padding: '20px', border: '1px solid #ccc' }}>
    <WrappedComponent {...props} />
  </div>
);

// 组合使用
const withEnhancements = compose(withLogging, withStyle);
const SuperComponent = withEnhancements(MyComponent);
```

#### 4. 实际应用：权限控制HOC
```javascript
/**
 * 权限控制高阶组件
 * @param {Array} requiredRoles - 所需角色
 * @returns {Function} 高阶组件
 */
function withAuthorization(requiredRoles) {
  return function(WrappedComponent) {
    return class extends React.Component {
      state = {
        isAuthorized: false,
        loading: true
      };

      componentDidMount() {
        // 模拟权限检查
        setTimeout(() => {
          const userRoles = ['user', 'editor']; // 从API获取用户角色
          const hasRequiredRole = requiredRoles.some(role =>
            userRoles.includes(role)
          );
          this.setState({ isAuthorized: hasRequiredRole, loading: false });
        }, 1000);
      }

      render() {
        if (this.state.loading) return <div>Loading...</div>;
        if (!this.state.isAuthorized) return <div>无权访问</div>;
        return <WrappedComponent {...this.props} />;
      }
    };
  };
}

// 使用示例
const AdminPanel = withAuthorization(['admin'])(Dashboard);
```

### 高阶组件vs其他模式
| 模式 | 实现方式 | 优点 | 缺点 | 适用场景 |
|------|----------|------|------|----------|
| 高阶组件 | 函数包装组件 | 复用性强，组合灵活 | 嵌套过深，命名冲突 | 逻辑复用，第三方库 |
| Render Props | 传递渲染函数 | 避免嵌套，灵活共享 | 代码冗长，嵌套回调 | 简单逻辑共享 |
| Custom Hooks | 提取逻辑到函数 | 简洁直观，无嵌套 | 只能在函数组件使用 | React Hooks项目 |

### 面试要点
#### 1. 原理机制
**Q：React高阶组件(HOC)是什么？实现原理是什么？**
A：HOC是React的一种高级设计模式，本质是**参数为组件、返回值为新组件的函数**。实现原理基于函数式编程的组合思想，通过包装组件实现逻辑复用和功能增强。HOC不修改输入组件，而是创建新组件，将输入组件作为新组件的子组件渲染，并传递props。核心特点是**纯函数、无副作用、可组合**。

**Q：高阶组件如何传递props？可能遇到什么问题？**
A：HOC通过展开运算符`{...this.props}`将props传递给被包装组件。可能遇到的问题：1. **props覆盖**：HOC添加的props可能覆盖传入的props；2. **命名冲突**：多个HOC可能添加同名props；3. **透传不完整**：忘记传递props导致被包装组件无法访问所需属性。解决方案：1. 明确命名HOC添加的props；2. 使用compose组合HOC时注意顺序；3. 使用剩余参数显式传递特定props。

#### 2. 实践应用
**Q：如何使用高阶组件实现组件渲染性能优化？**
A：可实现`withMemo`高阶组件包装需要优化的组件：
```javascript
function withMemo(WrappedComponent, areEqual) {
  return React.memo(WrappedComponent, areEqual);
}

// 使用
const MemoizedComponent = withMemo(ExpensiveComponent, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.id === nextProps.id;
});
```
这种方式可缓存组件渲染结果，避免不必要的重渲染。

**Q：高阶组件和React Hooks的区别？如何选择？**
A：主要区别：1. **实现方式**：HOC是函数包装组件，Hooks是函数提取逻辑；2. **使用复杂度**：HOC可能导致嵌套地狱，Hooks更扁平化；3. **适用范围**：HOC可用于类组件和函数组件，Hooks仅用于函数组件；4. **状态复用**：HOC通过props传递状态，Hooks直接在组件中使用状态。选择建议：新代码优先使用Hooks（简洁直观），维护旧代码或类组件可使用HOC，复杂逻辑组合可两者结合。

#### 3. 注意事项
**Q：使用高阶组件有哪些注意事项？**
A：关键注意事项：1. **不要在render方法中创建HOC**（每次渲染会创建新组件，导致性能问题和状态丢失）；2. **复制静态方法**（HOC默认不会传递静态方法，需手动处理）；3. **使用displayName**（设置有意义的名称，便于调试）；4. **避免过度使用**（可能导致组件树复杂，优先考虑Hooks）；5. **纯函数原则**（HOC应是纯函数，不修改输入组件，不产生副作用）。


## 14.数组去重

### 概念解析
**数组去重**是前端开发中常见的数据处理需求，指移除数组中重复的元素，保留唯一值。去重逻辑需考虑多种边界情况，如**数据类型差异**（如1与'1'）、**特殊值处理**（如NaN、null、undefined）、**引用类型比较**和**原始顺序保留**等。高效的去重算法不仅能提升性能，还能避免业务逻辑错误。

#### 去重核心考量因素
- **唯一性判断**：严格相等(===) vs 宽松相等(==)
- **顺序保留**：是否维持原始数组顺序
- **特殊值处理**：NaN、null、undefined等
- **性能表现**：时间复杂度与空间复杂度
- **兼容性**：ES6+特性支持情况

### 主要实现方法
#### 1. Set数据结构（ES6+）
```javascript
/**
 * 使用Set实现数组去重
 * @param {Array} arr - 待去重数组
 * @returns {Array} 去重后的新数组
 */
function uniqueBySet(arr) {
  // Set自动忽略重复值，再转为数组
  return [...new Set(arr)];
}

// 使用示例
const arr = [1, 2, 2, '3', '3', NaN, NaN, null, null, undefined, undefined];
console.log(uniqueBySet(arr)); 
// [1, 2, '3', NaN, null, undefined]（保留顺序，正确处理NaN）
```

**优缺点**：
- ✅ 代码简洁，一行实现
- ✅ 自动处理NaN（视为相等）
- ✅ 保留原始顺序
- ✅ 时间复杂度O(n)
- ❌ ES6特性，不支持IE
- ❌ 无法区分对象引用（不同对象即使内容相同也视为不同）

#### 2. Filter+indexOf
```javascript
/**
 * 使用filter和indexOf实现去重
 * @param {Array} arr - 待去重数组
 * @returns {Array} 去重后的新数组
 */
function uniqueByFilter(arr) {
  return arr.filter((item, index) => {
    // 只保留第一次出现的元素
    return arr.indexOf(item) === index;
  });
}

// 使用示例
console.log(uniqueByFilter(arr)); 
// [1, 2, '3', null, undefined]（不处理NaN，会保留重复NaN）
```

**优缺点**：
- ✅ 兼容性好（ES5+）
- ✅ 保留原始顺序
- ❌ 无法处理NaN（indexOf(NaN)返回-1）
- ❌ 时间复杂度O(n²)（indexOf为O(n)）
- ❌ 性能较差，不适用于大型数组

#### 3. Reduce累加器
```javascript
/**
 * 使用reduce实现去重
 * @param {Array} arr - 待去重数组
 * @returns {Array} 去重后的新数组
 */
function uniqueByReduce(arr) {
  return arr.reduce((acc, current) => {
    // 判断当前值是否已存在于累加器
    if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, []);
}

// 增强版：处理NaN
function uniqueByReduceEnhanced(arr) {
  return arr.reduce((acc, current) => {
    // 单独处理NaN
    if (Number.isNaN(current)) {
      // 检查累加器中是否已有NaN
      const hasNaN = acc.some(item => Number.isNaN(item));
      if (!hasNaN) acc.push(current);
    } else if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, []);
}
```

**优缺点**：
- ✅ 高度可定制，可处理特殊值
- ✅ 保留原始顺序
- ❌ 基础版无法处理NaN
- ❌ includes方法仍有O(n)时间复杂度
- ❌ 总体时间复杂度O(n²)

#### 4. Object键值对
```javascript
/**
 * 使用Object键值对实现去重
 * @param {Array} arr - 待去重数组
 * @returns {Array} 去重后的新数组
 */
function uniqueByObject(arr) {
  const obj = {};
  return arr.filter(item => {
    // 将值转为字符串作为键
    const key = typeof item + JSON.stringify(item);
    if (!obj[key]) {
      obj[key] = true;
      return true;
    }
    return false;
  });
}

// 使用示例
console.log(uniqueByObject([1, '1', {a:1}, {a:1}])); 
// [1, '1', {a:1}]（能区分1和'1'，但对象引用不同也视为不同）
```

**优缺点**：
- ✅ 可区分基本类型与字符串类型（如1和'1'）
- ✅ 时间复杂度O(n)
- ❌ 无法处理函数、Symbol等无法JSON序列化的类型
- ❌ 对象内容相同但引用不同会被视为不同
- ❌ 原始顺序可能改变

#### 5. 排序后相邻比较
```javascript
/**
 * 先排序再去重
 * @param {Array} arr - 待去重数组
 * @returns {Array} 去重后的新数组
 */
function uniqueBySort(arr) {
  if (arr.length === 0) return [];
  // 先排序
  const sorted = arr.slice().sort((a, b) => {
    // 处理NaN排序问题
    if (Number.isNaN(a)) return 1;
    if (Number.isNaN(b)) return -1;
    return a - b;
  });

  const result = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    // 跳过重复元素
    if (sorted[i] !== sorted[i-1]) {
      result.push(sorted[i]);
    }
  }
  return result;
}
```

**优缺点**：
- ✅ 时间复杂度主要取决于排序（通常O(n log n)）
- ❌ 改变原始顺序
- ❌ 无法处理对象类型
- ❌ NaN处理复杂

### 方法对比与选择指南
| 方法 | 时间复杂度 | 空间复杂度 | 保留顺序 | 处理NaN | 兼容性 | 推荐场景 |
|------|------------|------------|----------|---------|--------|----------|
| Set | O(n) | O(n) | ✅ | ✅ | ES6+ | 现代浏览器，简单去重 |
| Filter+indexOf | O(n²) | O(1) | ✅ | ❌ | ES5+ | 兼容性要求高，无NaN |
| Reduce | O(n²) | O(n) | ✅ | ❌/✅ | ES5+ | 需要特殊值处理 |
| Object键值对 | O(n) | O(n) | ✅ | ✅ | ES5+ | 需区分类型，无复杂对象 |
| 排序后比较 | O(n log n) | O(n) | ❌ | ❌ | ES5+ | 大型数组，不关心顺序 |

### 面试要点
#### 1. 方案辨析
**Q：数组去重的最优方案是什么？如何选择？**
A：没有绝对最优，需根据场景选择：1. **现代环境简单去重**：优先使用Set（简洁高效）；2. **需区分1和'1'**：使用Object键值对方法；3. **兼容性要求到IE**：Filter+indexOf（但需注意NaN问题）；4. **大型数组性能优先**：排序后比较或Set；5. **包含复杂对象**：需自定义比较函数结合Map存储引用。

**Q：如何实现一个支持复杂对象的数组去重？**
A：使用Map存储对象引用+自定义比较函数：
```javascript
function uniqueWithObjects(arr, compareFn) {
  const map = new Map();
  return arr.filter(item => {
    // 基础类型直接比较
    if (typeof item !== 'object' || item === null) {
      const key = typeof item + item;
      if (!map.has(key)) {
        map.set(key, true);
        return true;
      }
    } else {
      // 对象类型使用比较函数
      const existing = Array.from(map.values()).find(existing => compareFn(existing, item));
      if (!existing) {
        map.set(item, item);
        return true;
      }
    }
    return false;
  });
}
// 使用示例
const objects = [{a:1}, {a:1}, {b:2}];
console.log(uniqueWithObjects(objects, (a,b) => a.a === b.a)); // [{a:1}, {b:2}]
```

#### 2. 特殊情况处理
**Q：为什么Set能正确去重NaN而indexOf不能？**
A：因为ECMAScript规范中，Set使用SameValueZero算法判断相等（认为NaN等于NaN），而indexOf使用严格相等===（认为NaN !== NaN）。例如：
```javascript
[NaN].indexOf(NaN); // -1
[...new Set([NaN, NaN])]; // [NaN]
```

**Q：如何处理数组中的重复对象（内容相同但引用不同）？**
A：解决方案：1. **JSON序列化**：`JSON.stringify(obj)`（简单对象适用）；2. **唯一标识**：提取对象唯一键（如id）；3. **深度比较**：递归比较对象属性；4. **第三方库**：使用Lodash的`_.uniqWith`+`_.isEqual`。

## 15.几种排序算法的实现及其复杂度比较

### 概念解析
**排序算法**是对数据集合进行有序排列的算法，是计算机科学的基础算法之一。前端开发中常用于数据展示、搜索优化和数据分析等场景。排序算法可分为**比较类排序**（通过比较元素大小排序）和**非比较类排序**（不通过比较直接排序），评价排序算法的核心指标包括时间复杂度、空间复杂度和稳定性。

#### 排序算法核心指标
- **时间复杂度**：算法执行时间与数据规模的关系，通常分析最坏和平均情况
- **空间复杂度**：算法所需额外空间与数据规模的关系
- **稳定性**：相等元素排序后是否保持原有相对顺序
- **原地排序**：是否只需O(1)或O(log n)的额外空间

### 常见排序算法实现
#### 1. 冒泡排序(Bubble Sort)
**原理**：重复比较相邻元素，将大值逐步"冒泡"到数组末端

```javascript
/**
 * 冒泡排序
 * @param {Array} arr - 待排序数组
 * @returns {Array} 排序后的数组
 */
function bubbleSort(arr) {
  const copy = [...arr]; // 不修改原数组
  const len = copy.length;
  let swapped = false;

  // 外层循环控制趟数
  for (let i = 0; i < len - 1; i++) {
    swapped = false;
    // 内层循环比较交换
    for (let j = 0; j < len - 1 - i; j++) {
      if (copy[j] > copy[j + 1]) {
        // 交换元素
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
        swapped = true;
      }
    }
    // 若未交换，说明已排序完成
    if (!swapped) break;
  }

  return copy;
}
```

**复杂度分析**：
- 时间复杂度：O(n²)（最坏/平均），O(n)（最好，已排序数组）
- 空间复杂度：O(1)（原地排序）
- 稳定性：稳定

#### 2. 选择排序(Selection Sort)
**原理**：每次找到最小元素，与未排序部分的首位交换

```javascript
/**
 * 选择排序
 * @param {Array} arr - 待排序数组
 * @returns {Array} 排序后的数组
 */
function selectionSort(arr) {
  const copy = [...arr];
  const len = copy.length;

  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    // 找到最小元素索引
    for (let j = i + 1; j < len; j++) {
      if (copy[j] < copy[minIndex]) {
        minIndex = j;
      }
    }
    // 交换最小元素到当前位置
    if (minIndex !== i) {
      [copy[i], copy[minIndex]] = [copy[minIndex], copy[i]];
    }
  }

  return copy;
}
```

**复杂度分析**：
- 时间复杂度：O(n²)（所有情况）
- 空间复杂度：O(1)（原地排序）
- 稳定性：不稳定（交换可能改变相等元素顺序）

#### 3. 插入排序(Insertion Sort)
**原理**：将元素逐个插入到已排序序列的适当位置

```javascript
/**
 * 插入排序
 * @param {Array} arr - 待排序数组
 * @returns {Array} 排序后的数组
 */
function insertionSort(arr) {
  const copy = [...arr];
  const len = copy.length;

  for (let i = 1; i < len; i++) {
    const current = copy[i];
    let j = i - 1;
    // 移动已排序元素
    while (j >= 0 && copy[j] > current) {
      copy[j + 1] = copy[j];
      j--;
    }
    // 插入当前元素
    copy[j + 1] = current;
  }

  return copy;
}
```

**复杂度分析**：
- 时间复杂度：O(n²)（最坏/平均），O(n)（最好）
- 空间复杂度：O(1)（原地排序）
- 稳定性：稳定

#### 4. 快速排序(Quick Sort)
**原理**：选择基准元素，将数组分区为小于和大于基准的两部分，递归排序

```javascript
/**
 * 快速排序
 * @param {Array} arr - 待排序数组
 * @returns {Array} 排序后的数组
 */
function quickSort(arr) {
  // 递归终止条件
  if (arr.length <= 1) return [...arr];

  const copy = [...arr];
  // 选择基准元素（这里简单选择中间元素）
  const pivotIndex = Math.floor(copy.length / 2);
  const pivot = copy.splice(pivotIndex, 1)[0];

  // 分区
  const left = []; // 小于基准
  const right = []; // 大于等于基准

  for (const item of copy) {
    if (item < pivot) {
      left.push(item);
    } else {
      right.push(item);
    }
  }

  // 递归排序并合并
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 优化版：原地快排（减少空间占用）
function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const pivotIndex = partition(arr, left, right);
  quickSortInPlace(arr, left, pivotIndex - 1);
  quickSortInPlace(arr, pivotIndex + 1, right);
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
```

**复杂度分析**：
- 时间复杂度：O(n log n)（平均），O(n²)（最坏，已排序数组）
- 空间复杂度：O(log n)（递归栈）
- 稳定性：不稳定

#### 5. 归并排序(Merge Sort)
**原理**：分治法将数组分成子数组，排序后合并

```javascript
/**
 * 归并排序
 * @param {Array} arr - 待排序数组
 * @returns {Array} 排序后的数组
 */
function mergeSort(arr) {
  // 递归终止条件
  if (arr.length <= 1) return [...arr];

  // 分治
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // 合并
  return merge(left, right);
}

/**
 * 合并两个有序数组
 * @param {Array} left - 左数组
 * @param {Array} right - 右数组
 * @returns {Array} 合并后的有序数组
 */
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  // 双指针合并
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // 处理剩余元素
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

**复杂度分析**：
- 时间复杂度：O(n log n)（所有情况）
- 空间复杂度：O(n)（需要额外空间）
- 稳定性：稳定

### 算法对比与选择指南
| 算法 | 平均时间 | 最坏时间 | 空间复杂度 | 稳定性 | 原地排序 | 适用场景 |
|------|----------|----------|------------|--------|----------|----------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 | ✅ | 几乎不用，仅教学 |
| 选择排序 | O(n²) | O(n²) | O(1) | ❌ | ✅ | 少量数据，硬件受限 |
| 插入排序 | O(n²) | O(n²) | O(1) | ✅ | ✅ | 基本有序数据，小规模 |
| 快速排序 | O(n log n) | O(n²) | O(log n) | ❌ | ✅ | 通用排序，大规模数据 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | ✅ | ❌ | 稳定排序需求，外排序 |
| 希尔排序 | O(n^1.3) | O(n²) | O(1) | ❌ | ✅ | 中等规模数据 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | ❌ | ✅ | 优先队列，Top K问题 |

#### 选择建议：
1. **小规模数据**：插入排序（简单高效）
2. **大规模随机数据**：快速排序（平均性能最优）
3. **稳定性要求**：归并排序（稳定且高效）
4. **内存受限**：堆排序或原地快排
5. **几乎有序数据**：插入排序（接近O(n)性能）

### 面试要点
#### 1. 原理辨析
**Q：快速排序和归并排序的区别及应用场景？**
A：核心区别：1. 快排是分治+原地排序，归并是分治+合并；2. 快排平均空间O(log n)，归并空间O(n)；3. 快排不稳定，归并稳定；4. 快排最坏O(n²)，归并始终O(n log n)。应用场景：快排适合内存中通用排序；归并适合外部排序（数据量大到内存放不下）和稳定性要求高的场景。

**Q：为什么说插入排序在小规模数据上比快速排序更高效？**
A：因为快排的递归调用和分区操作有额外开销，在数据量小（n<10-20）时，这些开销超过O(n²)和O(n log n)的复杂度差异。许多语言的排序库（如Java Arrays.sort）在小规模子数组中会切换到插入排序。

#### 2. 手写实现
**Q：手写实现快速排序，并说明如何优化？**
A：基础实现见上文。优化策略：1. **随机基准**（避免已排序数组的最坏情况）；2. **三数取中**（选择左端、中间、右端的中值作为基准）；3. **三路快排**（处理重复元素多的数组）；4. **小规模子数组用插入排序**；5. **尾递归优化**（减少栈空间）。

**Q：如何实现稳定的快速排序？**
A：快排本身不稳定，实现稳定快排需额外空间：1. 创建辅助数组；2. 分区时记录等于基准的元素；3. 合并时保持原有顺序。或直接使用归并排序代替。


## 16.前序后序遍历二叉树(非递归)

### 概念解析
**二叉树遍历**是按一定规律访问树中所有节点的过程，核心分为**深度优先**（DFS）和**广度优先**（BFS）两大类。前序遍历（根→左→右）和后序遍历（左→右→根）是DFS的两种重要形式。非递归实现通常借助**栈数据结构**模拟递归调用栈，避免递归带来的栈溢出风险，同时提升大规模数据处理性能。

#### 遍历核心要素
- **访问顺序**：节点值的读取时机
- **栈操作**：节点入栈出栈的时机与条件
- **标记机制**：区分未访问与已访问节点（后序遍历关键）
- **空间效率**：栈的最大深度与树的深度相关

### 核心实现
#### 1. 前序遍历(Pre-order Traversal)
**顺序**：根节点 → 左子树 → 右子树

##### （1）栈实现法
```javascript
/**
 * 二叉树节点定义
 * @param {number} val - 节点值
 * @param {TreeNode} left - 左子节点
 * @param {TreeNode} right - 右子节点
 */
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

/**
 * 非递归前序遍历
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 遍历结果数组
 */
function preorderTraversal(root) {
  const result = [];
  if (!root) return result;

  const stack = [root]; // 初始化栈

  while (stack.length > 0) {
    const node = stack.pop(); // 弹出栈顶节点
    result.push(node.val); // 访问节点

    // 右子节点先入栈（栈是LIFO）
    if (node.right) stack.push(node.right);
    // 左子节点后入栈
    if (node.left) stack.push(node.left);
  }

  return result;
}
```

##### （2）遍历过程示例
对于二叉树：
```
    1
     \ 
      2
     /
    3
```
遍历步骤：
1. stack=[1] → pop 1 → result=[1] → push 2 → stack=[2]
2. pop 2 → result=[1,2] → push 3 → stack=[3]
3. pop 3 → result=[1,2,3] → stack为空 → 结束

#### 2. 后序遍历(Post-order Traversal)
**顺序**：左子树 → 右子树 → 根节点

##### （1）双栈法
```javascript
/**
 * 非递归后序遍历（双栈法）
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 遍历结果数组
 */
function postorderTraversalTwoStacks(root) {
  const result = [];
  if (!root) return result;

  const stack1 = [root];
  const stack2 = [];

  // 第一遍遍历：根→右→左 入栈stack2
  while (stack1.length > 0) {
    const node = stack1.pop();
    stack2.push(node);
    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }

  // 第二遍遍历：stack2出栈即后序顺序
  while (stack2.length > 0) {
    result.push(stack2.pop().val);
  }

  return result;
}
```

##### （2）单栈标记法
```javascript
/**
 * 非递归后序遍历（单栈标记法）
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 遍历结果数组
 */
function postorderTraversalSingleStack(root) {
  const result = [];
  if (!root) return result;

  const stack = [];
  let current = root;
  let lastVisited = null;

  while (current || stack.length > 0) {
    // 左子树入栈
    while (current) {
      stack.push(current);
      current = current.left;
    }

    const peekNode = stack[stack.length - 1];

    // 右子树未访问过
    if (peekNode.right && lastVisited !== peekNode.right) {
      current = peekNode.right;
    } else {
      // 访问节点
      result.push(peekNode.val);
      lastVisited = stack.pop();
    }
  }

  return result;
}
```

### 复杂度分析
| 遍历方式 | 时间复杂度 | 空间复杂度 | 特点 |
|----------|------------|------------|------|
| 前序遍历（栈） | O(n) | O(n) | 实现简单，需注意入栈顺序 |
| 后序遍历（双栈） | O(n) | O(n) | 逻辑清晰，额外空间开销 |
| 后序遍历（单栈） | O(n) | O(n) | 空间优化，逻辑较复杂 |

### 面试要点
#### 1. 实现对比
**Q：前序遍历和后序遍历的非递归实现有何异同？**
A：相同点：均使用栈模拟递归过程，时间复杂度O(n)。不同点：1. 前序先访问节点再入栈子节点，后序先入栈子节点最后访问节点；2. 后序需额外标记已访问节点（单栈法）或使用辅助栈（双栈法）；3. 前序入栈顺序为右→左，后序（双栈法）为左→右。

**Q：如何只用一个栈实现后序遍历？**
A：核心思路：1. 遍历左子树并入栈所有节点；2. 检查栈顶节点右子树：若未访问则转向右子树；3. 若右子树已访问或为空，则访问当前节点并标记为已访问。关键需维护`lastVisited`指针区分右子树是否处理完毕。

#### 2. 算法设计
**Q：给定前序遍历数组`[1,2,3]`和中序遍历数组`[2,1,3]`，如何重建二叉树并输出后序遍历？**
A：重建步骤：1. 前序首元素为根节点(1)；2. 中序中根节点左侧为左子树(2)，右侧为右子树(3)；3. 递归重建左右子树。后序遍历结果为`[2,3,1]`。非递归后序遍历代码见上文实现。

**Q：非递归遍历中如何处理节点访问时机？**
A：前序遍历在**出栈时**访问节点；后序遍历需确保左右子树均处理完毕后才访问节点，可通过双栈反转或单栈标记实现。

## 17.二叉树深度遍历(分析时间复杂度)

### 概念解析
**二叉树深度优先遍历(DFS)** 是沿着树的深度优先访问节点的遍历策略，核心思想是**尽可能深地搜索树的分支**，当无法继续前进时回溯。DFS主要包括三种遍历方式：前序遍历（根→左→右）、中序遍历（左→根→右）和后序遍历（左→右→根）。深度遍历的时间复杂度分析是评估算法效率的关键，直接影响大规模数据处理性能。

#### DFS与BFS对比
| 特性 | 深度优先(DFS) | 广度优先(BFS) |
|------|--------------|--------------|
| 实现方式 | 栈(递归/非递归) | 队列 |
| 空间复杂度 | O(h) | O(w) |
| 适用场景 | 路径查找、拓扑排序 | 层次遍历、最短路径 |
| 访问顺序 | 深度优先 | 层次优先 |
| 最坏空间 | O(n) | O(n) |

### 核心实现与复杂度分析
#### 1. 中序遍历(In-order Traversal)
**顺序**：左子树 → 根节点 → 右子树

##### （1）递归实现
```javascript
/**
 * 递归中序遍历
 * @param {TreeNode} root - 根节点
 * @returns {number[]} 遍历结果
 */
function inorderRecursive(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);    // 左
    result.push(node.val);  // 根
    traverse(node.right);   // 右
  }
  traverse(root);
  return result;
}
```

##### （2）非递归实现
```javascript
/**
 * 非递归中序遍历
 * @param {TreeNode} root - 根节点
 * @returns {number[]} 遍历结果
 */
function inorderIterative(root) {
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length) {
    // 遍历左子树
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // 访问节点
    current = stack.pop();
    result.push(current.val);

    // 遍历右子树
    current = current.right;
  }

  return result;
}
```

### 复杂度综合分析
#### 1. 时间复杂度
所有深度优先遍历的时间复杂度均为**O(n)**，其中n是节点总数。原因是每个节点**恰好被访问一次**，无论是递归还是非递归实现，不会出现重复访问。

#### 2. 空间复杂度
空间复杂度取决于**栈的最大深度**：
- **递归实现**：空间复杂度为**O(h)**，h是树的高度。平衡树h=log n，最坏情况（斜树）h=n。
- **非递归实现**：空间复杂度为**O(h)**，显式栈替代递归栈，与递归空间一致。

#### 3. 不同树结构下的空间消耗
| 树类型 | 高度h | 空间复杂度 | 示例 |
|--------|-------|------------|------|
| 平衡二叉树 | log₂n | O(log n) | AVL树、红黑树 |
| 完全二叉树 | ⌊log₂n⌋+1 | O(log n) | 堆结构 |
| 斜树 | n | O(n) | 链表形式的树 |

### 面试要点
#### 1. 复杂度分析
**Q：为什么DFS遍历的时间复杂度是O(n)？空间复杂度为何与树高相关？**
A：时间复杂度O(n)是因为每个节点**仅被访问一次**，无论哪种遍历方式都需要遍历所有节点。空间复杂度与树高相关是因为递归调用栈或显式栈的深度等于树的高度，平衡树时栈深度小（log n），斜树时栈深度达到n。

**Q：递归与非递归DFS的空间复杂度有区别吗？**
A：理论空间复杂度相同，均为O(h)。实际中递归可能因语言特性有额外开销（如函数调用栈信息），非递归可更精确控制栈大小。极端情况下（如n=1e5的斜树）递归可能导致栈溢出，需用非递归实现。

#### 2. 算法设计
**Q：如何在O(1)空间复杂度下实现DFS遍历？**
A：使用**Morris遍历算法**，通过修改树的右指针指向后继节点实现无栈遍历。核心思想是利用叶子节点的空指针存储遍历路径，但会暂时修改树结构（可恢复）。时间复杂度仍为O(n)，空间复杂度降至O(1)。

**Q：已知前序遍历`[3,9,20,15,7]`和中序遍历`[9,3,15,20,7]`，求二叉树的深度并分析空间复杂度。**
A：重建树后可知深度为3（根3→20→15/7）。递归遍历空间复杂度O(3)=O(log n)，非递归同样O(log n)；若为斜树则空间复杂度O(n)。

## 18.跨域的实现(`JSONP`、`CORS`)## 17.二叉树深度遍历(分析时间复杂度)

## 18.跨域的实现(`JSONP`、`CORS`)

### 概念解析
**跨域**是指浏览器因同源策略限制，阻止不同源（协议、域名、端口任意不同）的网页请求资源的安全机制。解决跨域的核心方案包括**JSONP**（利用script标签跨域特性）和**CORS**（跨域资源共享，标准解决方案），此外还有代理服务器、WebSocket等辅助方案。理解跨域原理对解决前后端数据交互问题至关重要。

#### 同源策略核心限制
- **XMLHttpRequest/Fetch**：禁止跨域HTTP请求
- **DOM访问**：禁止跨域页面操作DOM
- **Cookie/LocalStorage**：禁止跨域读取存储数据

### 主要实现方案
#### 1. JSONP (JSON with Padding)
**原理**：利用`<script>`标签不受同源策略限制的特性，通过动态创建script标签加载跨域脚本，执行回调函数传递数据。

##### （1）客户端实现
```javascript
/**
 * JSONP跨域请求实现
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求URL
 * @param {Object} [options.data] - 请求参数
 * @param {string} [options.callback] - 回调函数名
 * @param {Function} options.success - 成功回调
 * @param {Function} [options.error] - 错误回调
 * @param {number} [options.timeout=5000] - 超时时间
 */
function jsonp(options) {
  const { url, data = {}, callback = 'jsonpCallback', success, error, timeout = 5000 } = options;
  const script = document.createElement('script');
  const head = document.head || document.getElementsByTagName('head')[0];
  const timeoutTimer = setTimeout(() => {
    cleanup();
    error && error(new Error('JSONP timeout'));
  }, timeout);

  // 生成唯一回调函数名
  const callbackName = `${callback}_${Date.now()}`;
  window[callbackName] = function(response) {
    clearTimeout(timeoutTimer);
    success && success(response);
    cleanup();
  };

  // 构建请求URL
  const params = new URLSearchParams({ ...data, callback: callbackName });
  script.src = `${url}${url.includes('?') ? '&' : '?'}${params}`;

  // 错误处理
  script.onerror = function() {
    clearTimeout(timeoutTimer);
    error && error(new Error('JSONP request failed'));
    cleanup();
  };

  // 清理函数
  function cleanup() {
    delete window[callbackName];
    head.removeChild(script);
  }

  head.appendChild(script);
}

// 使用示例
jsonp({
  url: 'https://api.example.com/data',
  data: { id: 1, type: 'info' },
  success: (data) => console.log('JSONP成功:', data),
  error: (err) => console.error('JSONP失败:', err)
});
```

##### （2）服务端实现(Node.js)
```javascript
// Express服务器示例
const express = require('express');
const app = express();

app.get('/data', (req, res) => {
  const { callback, id, type } = req.query;
  // 处理业务逻辑...
  const data = {
    success: true,
    result: { id, type, content: '跨域数据响应' }
  };
  // 包装成回调函数调用
  res.send(`${callback}(${JSON.stringify(data)})`);
});

app.listen(3000, () => console.log('JSONP服务器运行中...'));
```

#### 2. CORS (Cross-Origin Resource Sharing)
**原理**：通过服务器设置响应头，明确告知浏览器允许跨域请求，是W3C标准解决方案。

##### （1）简单请求与预检请求
- **简单请求**：满足特定条件（GET/HEAD/POST方法，有限的请求头），直接发送请求
- **预检请求**：复杂请求前发送OPTIONS请求，验证服务器是否允许跨域

##### （2）服务端配置(Node.js/Express)
```javascript
// CORS中间件实现
function corsMiddleware(options = {}) {
  const { origin = '*', methods = 'GET,POST,PUT,DELETE', headers = 'Content-Type,Authorization' } = options;
  return (req, res, next) => {
    // 设置允许的源
    res.setHeader('Access-Control-Allow-Origin', origin);
    // 预检请求响应
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', methods);
      res.setHeader('Access-Control-Allow-Headers', headers);
      res.setHeader('Access-Control-Max-Age', '86400'); // 预检结果缓存24小时
      return res.status(204).end();
    }
    next();
  };
}

// 使用中间件
app.use(corsMiddleware({
  origin: 'https://example.com', // 允许特定源
  methods: 'GET,POST'
}));

// 接口路由
app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS请求成功' });
});
```

##### （3）客户端请求示例
```javascript
// 简单GET请求
fetch('https://api.example.com/api/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' // 允许跨域携带Cookie
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('CORS请求失败:', error));
```

### 跨域方案对比
| 方案 | 实现难度 | 安全性 | 功能完整性 | 兼容性 |
|------|----------|--------|------------|--------|
| JSONP | 中等 | 低（仅GET，易XSS） | 低（仅支持GET） | 所有浏览器 |
| CORS | 低（标准化） | 高（支持多种安全策略） | 高（支持所有HTTP方法） | IE10+ |
| 代理服务器 | 高（需服务端配置） | 高 | 高 | 所有浏览器 |
| WebSocket | 中 | 高 | 高（双向通信） | IE10+ |
| postMessage | 中 | 中 | 中（页面间通信） | IE8+ |

### 面试要点
#### 1. 原理辨析
**Q：JSONP和CORS的本质区别是什么？**
A：核心区别：1. JSONP利用script标签绕过同源策略，CORS通过服务器声明允许跨域；2. JSONP仅支持GET方法，CORS支持所有HTTP方法；3. JSONP无错误处理机制，CORS有完整错误状态码；4. JSONP安全性低（易XSS），CORS支持多种安全策略（如预检请求、Origin验证）。

**Q：CORS中的预检请求(OPTIONS)是什么？什么情况下会触发？**
A：预检请求是浏览器在发送复杂跨域请求前发送的OPTIONS请求，用于验证服务器是否允许跨域。触发条件：1. 使用PUT/DELETE等特殊方法；2. 使用自定义请求头；3. 发送JSON数据或携带Credentials；4. 请求头Content-Type为application/json等非简单类型。

#### 2. 安全问题
**Q：如何防范JSONP的安全风险？**
A：防范措施：1. 验证回调函数名（只允许字母数字）；2. 限制请求来源（Referer/Origin检查）；3. 过滤响应内容（防止XSS）；4. 设置超时机制；5. 优先使用CORS替代JSONP。

**Q：CORS中的withCredentials属性有什么作用？可能带来什么风险？**
A：withCredentials允许跨域请求携带Cookie，实现跨域身份认证。风险：1. CSRF攻击风险增加；2. 敏感信息泄露；3. 需服务器端明确配置Access-Control-Allow-Credentials: true。建议：1. 严格验证Origin；2. 使用SameSite Cookie属性；3. 实施CSRF Token验证。

## 总结与展望

### 手写代码能力的重要性
前端手写代码考察不仅是对语法的掌握，更是对计算机基础、算法思维和工程实践的综合检验。本文系统整理了18个核心手写场景，涵盖异步编程、数据结构、算法设计、DOM操作等关键领域，形成完整的知识体系。

### 持续学习建议
1. **夯实基础**：深入理解JavaScript引擎原理、原型链、闭包等核心概念
2. **刻意练习**：从模仿到创新，逐步提升代码质量和效率
3. **关注源码**：学习优秀开源库的实现思路（如Lodash、React）
4. **工程实践**：将算法思维应用到实际项目，解决性能瓶颈
5. **面试准备**：针对性练习高频手写题，掌握解题思路

通过系统训练，不仅能应对面试挑战，更能培养解决复杂问题的能力，为前端工程师的职业发展奠定坚实基础。

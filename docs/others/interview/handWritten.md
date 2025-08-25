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

## 2.`lterator`遍历器实现

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

## 5.`class`的继承

## 6.防抖和节流

## 7.`Ajax`原生实现

## 8.深拷贝的几种方法与比较

## 9.继承的几种实现与比较

## 10.未知宽高的元素水平垂直居中

## 11.三栏布局的实现

## 12.两栏布局的实现

## 13.`React`高阶组件

## 14.数组去重

## 15.几种排序算法的实现及其复杂度比较

## 16.前序后序遍历二叉树(非递归)

## 17.二叉树深度遍历(分析时间复杂度)

## 18.跨域的实现(`JSONP`、`CORS`)

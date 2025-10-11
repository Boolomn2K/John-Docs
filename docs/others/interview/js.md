# JS

## 1.原始值和引用值类型及区别

```js
const obj1 = { x: 100, y: 200 };
const obj2 = obj1;
let x1 = obj1.x;
obj2.x = 101;
x1 = 102;
console.log(obj1) // { x: 101, y: 200 }
```

对于原始值来说，变量之间的赋值操作会生成一个新的独立副本；

而对于引用值，则是共享相同的内存空间，除非显式地创建一个新的副本

（如使用扩展运算符或 `JSON.parse(JSON.stringify(obj))` 进行深拷贝）。


## 2.判断数据类型`typeof`、`instanceof`、`Object.prototype.toString.call()`、`constructor`

`typeof` 是一个操作符，用于检测基本数据类型`（如 number、string、boolean、undefined、function 和 symbol）`。对于对象和 `null`，它会返回 `"object"`。

```js
console.log(typeof null) // "object" 历史遗留问题
```

`instanceof` 操作符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。它主要用于判断对象的具体类型。

```js
class Person {}
const person = new Person();

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true (因为所有对象都继承自 Object)
```

`Object.prototype.toString.call()` 方法可以返回一个表示该对象的字符串。这个方法非常强大，因为它可以准确地识别出所有的内置对象类型，包括数组、日期、正则表达式等。

```js
console.log(Object.prototype.toString.call([])); // "[object Array]"
console.log(Object.prototype.toString.call(new Date)); // "[object Date]"
console.log(Object.prototype.toString.call(/test/)); // "[object RegExp]"
console.log(Object.prototype.toString.call(NaN)); // "[object Number]"
```

`constructor` 属性指向创建当前对象的构造函数。通过检查 `constructor` 属性，可以知道对象是由哪个构造函数创建的。

```js
const person = new Person();
console.log(person.constructor === Person); // true
```


## 3.类数组与数组的区别与转换

- **原型链:**
  - 数组：继承自`Array.prototype`，因此可以使用所有数组的方法如`push()`, `pop()`, `map()`等。
  - 类数组：不继承自`Array.prototype`，这意味着它们不能直接使用数组的方法。

- **属性:**
  - 数组：除了包含元素外，还具有`length`属性，并且是可迭代的。
  - 类数组：通常也具有`length`属性，但可能缺少其他数组特性，比如不是可迭代的。
- **创建方式:**
  - 数组：通过`new Array()`或字面量`[]`创建。
  - 类数组：通常是DOM方法的结果（如`document.querySelectorAll`），或者是函数参数列表（`arguments`对象）。
- **转换:**
  - 从类数组到数组的转换有几种常见的方法：
    - **使用Array.from():**
    ```js
    let arrayLike = {0: 'a', 1: 'b', length: 2};
    let arr = Array.from(arrayLike);
    console.log(arr); // 输出: ['a', 'b']
    ```
    - **使用扩展运算符`...`:**
    ```js
    let arrayLike = {0: 'a', 1: 'b', length: 2};
    let arr = [...arrayLike];
    console.log(arr); // 输出: ['a', 'b']
    ```
    - **使用`Array.prototype.slice.call()`:**
    ```js
    let arrayLike = {0: 'a', 1: 'b', length: 2};
    let arr = Array.prototype.slice.call(arrayLike);
    console.log(arr); // 输出: ['a', 'b']
    ```
    - **使用`for`循环手动复制:**
    ```js
    let arrayLike = {0: 'a', 1: 'b', length: 2};
    let arr = [];
    for (let i = 0; i < arrayLike.length; i++) {
        arr[i] = arrayLike[i];
    }
    console.log(arr); // 输出: ['a', 'b']
    ```
## 4.数组的常见 `API`

__1. splice(start, deleteCount, item1, item2, /* …, */ itemN)__
 - 功能：可以用来添加、删除或替换数组中的元素。
  ```javascript
  let arr = [1, 2, 3, 4];
  // 从索引1开始删除2个元素，然后插入5和6
  arr.splice(1, 2, 5, 6); // arr 现在为 [1, 5, 6, 4]
  ```
**2. slice(start, end)**
  - 功能：返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的浅拷贝（包括 `begin`，不包括`end`）。原始数组不会被改变。
  ```javascript
  let arr = [1, 2, 3, 4];
  let newArr = arr.slice(1, 3); // newArr 为 [2, 3], 原始数组不变
  ```
**3. map(callbackFn, thisArg)**
  - 功能：创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数。
  ```javascript
  let arr = [1, 2, 3];
  let newArr = arr.map(item => item * 2); // newArr 为 [2, 4, 6]
  ```
**4. filter(callbackFn, thisArg)**
  - 功能：创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
  ```javascript
  let arr = [1, 2, 3, 4, 5];
  let evenNumbers = arr.filter(num => num % 2 === 0); // evenNumbers 为 [2, 4]
  ```
**5. reduce(callbackFn, initialValue)**
  - 功能：对数组中的每个元素执行一个由您提供的`reducer`函数(升序执行)，将其结果汇总为单个返回值。
  ```javascript
  let arr = [1, 2, 3, 4];
  let sum = arr.reduce((acc, curr) => acc + curr, 0); // sum 为 10
  ```
**6. forEach(callbackFn, thisArg)**
  - 功能：对数组的每个元素执行一次提供的函数。
  ```javascript
  let arr = [1, 2, 3];
  arr.forEach(item => console.log(item)); // 输出 1 2 3
  ```

## 5.bind、call、apply的区别

**1. call 方法**
 - **功能**：立即调用函数，并允许你指定函数内部的 `this` 值以及传递给函数的参数。
 - **参数**：第一个参数是 `this` 的值，后续参数是传递给函数的参数列表。
 - **返回值**：被调用函数的返回值。
 - **示例代码**：

```javascript
function greet(name) {
    console.log(`Hello, ${name}! I'm ${this.name}.`);
}

const person = { name: 'Alice' };

greet.call(person, 'Bob'); // 输出: Hello, Bob! I'm Alice.
```
**2. apply 方法**
 - **功能**：与 `call` 类似，也是立即调用函数并允许你指定 `this` 值，但不同的是，`apply` 接受一个数组（或类数组对象）作为参数列表。
 - **参数**：第一个参数是 `this` 的值，第二个参数是一个数组（或类数组对象），包含传递给函数的参数。
 - **返回值**：被调用函数的返回值。
 - **示例代码**：

```javascript
function greet(name) {
    console.log(`Hello, ${name}! I'm ${this.name}.`);
}

const person = { name: 'Alice' };

greet.apply(person, ['Bob']); // 输出: Hello, Bob! I'm Alice.
```
**3. bind 方法**
 - **功能**：创建一个新的函数，当这个新函数被调用时，它的 `this` 值会被设置为 `bind` 的第一个参数提供的值。`bind` 不会立即调用函数，而是返回一个新函数。
 - **参数**：第一个参数是 `this` 的值，后续参数是预先绑定到新函数的参数。
 - **返回值**：一个新函数，该函数的 `this` 值被永久绑定到 `bind` 的第一个参数。
 - **示例代码**：

```javascript
function greet(name) {
    console.log(`Hello, ${name}! I'm ${this.name}.`);
}

const person = { name: 'Alice' };

const boundGreet = greet.bind(person, 'Bob');
boundGreet(); // 输出: Hello, Bob! I'm Alice.
```

## 6.new的原理

- **创建一个新的空对象**：这个新对象继承自构造函数的原型（即 `Constructor.prototype`）。
- **设置构造函数中的 this**：将新创建的对象作为 `this` 的上下文绑定到构造函数上。
- **执行构造函数**：用提供的参数调用构造函数，并执行其中的代码。如果构造函数返回一个对象，则该对象成为 `new` 表达式的结果；否则，结果是新创建的对象。
- **返回新对象**：如果没有显式返回对象，则默认返回新创建的对象。

下面是一个简单的例子来说明 `new` 的工作原理：

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
};

// 使用 new 创建一个 Person 实例
const person1 = new Person('Alice', 30);
person1.greet(); // 输出: Hello, my name is Alice and I am 30 years old.
```

**手动模拟 `new` 关键字**
为了更好地理解 `new` 的工作原理，我们可以手动实现一个类似于 `new` 的函数。这个函数可以称为 `myNew`，它接受一个构造函数和一系列参数，然后按照 `new` 的步骤来创建并初始化一个新对象。

```javascript
// 手动模拟 new 关键字
function myNew(Constructor, ...args) {
    // 1. 创建一个新的空对象
    const obj = {};

    // 2. 设置新对象的原型为构造函数的 prototype
    Object.setPrototypeOf(obj, Constructor.prototype);

    // 3. 将新对象作为 this 绑定到构造函数上，并执行构造函数
    const result = Constructor.apply(obj, args);

    // 4. 如果构造函数返回一个对象，则返回该对象；否则返回新创建的对象
    return (typeof result === 'object' && result !== null) ? result : obj;
}

// 使用 myNew 创建一个 Person 实例
const person2 = myNew(Person, 'Bob', 25);
person2.greet(); // 输出: Hello, my name is Bob and I am 25 years old.
```

## 7.如何正确判断this?

- **默认绑定**：在全局环境中，`this` 指向全局对象（如浏览器中的 window 对象）。
- **隐式绑定**：当函数作为对象的方法调用时，`this` 指向该对象。
- **显式绑定**：通过 `call`、`apply`、`bind` 方法可以显式地绑定 `this` 的值。
- **new 绑定**：使用 `new` 关键字创建对象时，`this` 指向新创建的对象。
- **箭头函数绑定**：箭头函数没有自己的 `this`，它的 `this` 指向定义时所在的对象, 不能使用call, apply, bind方法改变this指向。
- **DOM 事件绑定**：在 DOM 事件处理函数中，`this` 指向触发事件的元素。
- **回调函数中的 this**：在回调函数中，`this` 的值取决于调用方式。如果使用箭头函数，`this` 会指向定义时的对象；如果使用普通函数，`this` 会指向调用它的对象。
- **严格模式**：在严格模式下，`this` 不会默认指向全局对象，而是 `undefined`。

## 8.闭包及其作用

闭包（`Closure`）是`JavaScript`中一个非常重要的概念，它允许函数访问其自身作用域、外部函数的作用域以及全局作用域中的变量。简单来说，当一个内部函数被返回并继续引用其外部函数的局部变量时，就形成了一个闭包。

**闭包的作用**
- 数据封装和私有化：通过闭包可以创建私有变量，这些变量只能通过特定的函数来访问或修改。
- 保持状态：闭包可以用来保存一些状态信息，即使外部函数已经执行完毕，内部函数仍然可以访问到这些状态。
- 模块化编程：利用闭包可以实现模块化编程，将相关的功能封装在一个独立的作用域内，避免了全局命名空间的污染。
例子
下面通过几个具体的例子来说明闭包的使用：

**例子1：基本闭包**

```javascript
function createCounter() {
    let count = 0; // 私有变量
    return function() {
        count++; // 内部函数可以访问外部函数的变量
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 输出: 1
console.log(counter()); // 输出: 2
```
在这个例子中，`createCounter` 函数返回了一个内部函数，这个内部函数可以访问 `count` 变量。每次调用 `counter()` `时，count` 的值都会增加。

例子2：模拟私有方法

```javascript
function createUser() {
    let name = 'Alice'; // 私有变量

    function getName() {
        return name;
    }

    function setName(newName) {
        if (typeof newName === 'string') {
            name = newName;
        }
    }

    return {
        getName: getName,
        setName: setName
    };
}

const user = createUser();
console.log(user.getName()); // 输出: Alice
user.setName('Bob');
console.log(user.getName()); // 输出: Bob
```
在这个例子中，`createUser` 函数返回了一个对象，该对象包含了两个方法 `getName` 和 `setName`。这两个方法都可以访问 `name` 变量，但外部代码无法直接访问 `name` 变量。

**例子3：模块化编程**

```javascript
const myModule = (function() {
    const privateData = '这是私有数据';

    function privateMethod() {
        console.log('这是私有方法');
    }

    return {
        publicMethod: function() {
            console.log(privateData);
            privateMethod();
        }
    };
})();

myModule.publicMethod(); // 输出: 这是私有数据, 这是私有方法
```
在这个例子中，我们使用立即执行函数表达式（`IIFE`）创建了一个模块 `myModule`。模块内部定义了一些私有变量和方法，外部只能通过 `publicMethod` 来访问这些私有成员。

## 9.原型和原型链

1. 原型（Prototype）
每个`JavaScript`函数都有一个`prototype`属性，这个属性是一个对象，它包含了可以被该函数创建的所有实例共享的属性和方法。当你使用构造函数创建一个新对象时，这个新对象会继承构造函数`prototype`上的所有属性和方法。

**示例代码**
```javascript
深色版本
function Person(name) {
    this.name = name;
}

// 在Person.prototype上添加一个sayHello方法
Person.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}`);
};

// 创建一个新的Person实例
const person1 = new Person('Alice');
person1.sayHello(); // 输出: Hello, my name is Alice

// 创建另一个Person实例
const person2 = new Person('Bob');
person2.sayHello(); // 输出: Hello, my name is Bob
```
在这个例子中，`Person` 构造函数的 `prototype` 对象上定义了一个 `sayHello` 方法。所有通过 `new Person()` 创建的对象都可以访问到这个方法。

2. 原型链（`Prototype Chain`）
原型链是一种用于实现继承的机制。每个对象都有一个内部属性`[[Prototype]]`（通常可以通过`__proto__`访问），指向它的原型对象。当试图访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，`JavaScript`引擎会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的末端（即`null`）。

**示例代码**
```javascript
深色版本
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    console.log(`${this.name} is eating.`);
};

function Dog(name, breed) {
    Animal.call(this, name); // 调用父类构造函数
    this.breed = breed;
}

// 设置Dog的原型为Animal的一个实例
Dog.prototype = Object.create(Animal.prototype);
// 修复构造函数指向,让实例的 constructor 属性正确指向 Dog 而不是 Animal
Dog.prototype.constructor = Dog;

// 在Dog.prototype上添加一个bark方法
Dog.prototype.bark = function() {
    console.log(`${this.name} is barking.`);
};

// 创建一个新的Dog实例
const dog = new Dog('Rex', 'German Shepherd');
dog.eat(); // 输出: Rex is eating.
dog.bark(); // 输出: Rex is barking.

console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
```
在这个例子中，`Dog`构造函数通过`Object.create(Animal.prototype)`设置了其原型为`Animal`的一个实例，从而实现了继承。`dog`实例可以访问到`Animal`原型上的`eat`方法以及`Dog`原型上的`bark`方法。

## 10.`prototype`与`__proto__`的关系与区别

**1. `prototype` 属性**
- **定义**：`prototype` 是函数（包括构造函数）的一个属性，它指向一个对象，这个对象可以被该函数创建的所有实例共享。
- **用途**：当你使用构造函数创建一个新的对象时，新对象会从构造函数的 `prototype` 属性继承方法和属性。
- **示例**：
```javascript
function Person(name) {
  this.name = name;
}

// 给 Person 的 prototype 添加一个方法
Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const person1 = new Person('Alice');
const person2 = new Person('Bob');

person1.sayHello(); // 输出: Hello, my name is Alice
person2.sayHello(); // 输出: Hello, my name is Bob
```
**2. `__proto__` 属性**
- **定义**：`__proto__` 是每个对象都有的一个访问器属性，它指向该对象的原型对象。
- **用途**：通过 `__proto__` 可以访问到对象的原型，从而实现属性和方法的查找。
- **示例**：
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const person1 = new Person('Alice');

// 通过 __proto__ 访问原型对象
console.log(person1.__proto__ === Person.prototype); // 输出: true

// 通过 __proto__ 访问原型上的方法
person1.__proto__.sayHello.call(person1); // 输出: Hello, my name is Alice
```
**3. 关系与区别**
- **关系**：
  - 当你使用 `new` 关键字创建一个对象时，新对象的 `__proto__` 属性会被设置为构造函数的 `prototype` 属性。
  - 也就是说，`person1.__proto__` 实际上就是 `Person.prototype`。
- **区别**：
  - `prototype` 是函数的属性，而 `__proto__` 是对象的属性。
  - `prototype` 用于定义构造函数创建的对象的默认原型，而 `__proto__` 用于访问对象的实际原型。
- **示例**：
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const person1 = new Person('Alice');

// 通过 __proto__ 访问原型对象
console.log(person1.__proto__ === Person.prototype); // 输出: true

// 通过 __proto__ 访问原型上的方法
person1.__proto__.sayHello.call(person1); // 输出: Hello, my name is Alice
```
**4. 现代 JavaScript 中的替代方案**
- **定义**：在现代 JavaScript 中，推荐使用 `Object.getPrototypeOf` 和 `Object.setPrototypeOf` 来代替 `__proto__`。
- **示例**：
```javascript
const person1 = new Person('Alice');

// 使用 Object.getPrototypeOf 获取原型
console.log(Object.getPrototypeOf(person1) === Person.prototype); // 输出: true

// 使用 Object.setPrototypeOf 设置原型
const obj = {};
Object.setPrototypeOf(obj, Person.prototype);
obj.name = 'Charlie';
obj.sayHello(); // 输出: Hello, my name is Charlie
```
## 11.继承的实现方式及比较

**1. 原型链继承**

原型链继承是通过将父类的实例设置为子类的原型来实现的。这种方式简单直观，但存在一些缺点，比如所有实例共享同一个原型对象，如果原型对象中有引用类型的数据，那么这些数据会被所有实例共享。

```javascript
function Parent() {
    this.name = 'Parent';
    this.colors = ['red', 'blue', 'green'];
}

function Child() {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child1 = new Child();
child1.colors.push('black');
console.log(child1.colors); // ["red", "blue", "green", "black"]

const child2 = new Child();
console.log(child2.colors); // ["red", "blue", "green", "black"]
```
**2. 构造函数继承**

构造函数继承是通过在子类构造函数内部调用父类构造函数来实现的。这种方式可以避免原型链继承中的问题，但是每个子类实例都无法访问到父类原型上的方法。

```javascript
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

const child1 = new Child('Child1', 5);
console.log(child1.name); // "Child1"
console.log(child1.age);  // 5

const child2 = new Child('Child2', 6);
console.log(child2.name); // "Child2"
console.log(child2.age);  // 6
```
**3. 组合继承**

组合继承结合了原型链继承和构造函数继承的优点。它使用原型链继承来继承父类的方法，同时使用构造函数继承来继承父类的属性。这是最常用的继承方式之一。

```javascript
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
    return this.name;
};

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child1 = new Child('Child1', 5);
console.log(child1.getName()); // "Child1"
console.log(child1.age);       // 5

const child2 = new Child('Child2', 6);
console.log(child2.getName()); // "Child2"
console.log(child2.age);       // 6
```

**4. 原型式继承**

原型式继承是通过创建一个新对象，将其原型设置为另一个对象的实例来实现的。这种方式可以实现对象的浅拷贝，但是如果对象中包含引用类型的数据，那么这些数据会被所有实例共享。

```javascript
let obj1 = {
  a: 33,
  b: 45,
  c: 12,
  test() {
    console.log(this.a + this.b);
  }
}

let obj2 = Object.create(obj1, {
  d: {
    value: 99
  },
  a: {
    value: 2
  }
})

console.log(obj2.__proto__ === obj1);  // true
console.log(obj2.b); // 45
console.log(obj2.c); // 12
obj2.test(); // 47

// Object.create() 兼容性写法
function createObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
```

***5. 寄生式继承***

寄生式继承是基于原型式继承的一种方式，它通过创建一个新对象，将其原型设置为另一个对象的实例，然后在新对象上添加一些额外的方法或属性。

```javascript
function createObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function createAnotherObject(o) {
    const clone = createObject(o);
    clone.sayHello = function() {
        console.log('Hello, world!');
    };
    return clone;
}
```

**6. 寄生组合继承**

寄生组合继承是对组合继承的一种优化，它避免了在创建子类原型时调用两次父类构造函数的问题。

```javascript
function inheritPrototype(child, parent) {
    const prototype = Object.create(parent.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
    return this.name;
};

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

inheritPrototype(Child, Parent);

const child1 = new Child('Child1', 5);
console.log(child1.getName()); // "Child1"
console.log(child1.age);       // 5

const child2 = new Child('Child2', 6);
console.log(child2.getName()); // "Child2"
console.log(child2.age);       // 6
```
## 12.深拷贝与浅拷贝

**浅拷贝（Shallow Copy）**

浅拷贝创建一个新的对象或数组，然后将原始对象或数组中的所有可枚举属性复制到新对象或数组中。如果属性是一个引用类型（如对象或数组），那么它只会复制该引用，而不是引用指向的实际对象或数组。因此，修改浅拷贝中的引用类型属性会影响到原始对象或数组。

**实现浅拷贝的方法：**

 - **使用 Object.assign() 方法：**

```javascript
const original = { a: 1, b: { c: 2 } };
const shallowCopy = Object.assign({}, original);
console.log(shallowCopy); // { a: 1, b: { c: 2 } }
shallowCopy.b.c = 3;
console.log(original.b.c); // 3 (原始对象也被修改了)
```
使用扩展运算符 ...：
```javascript
const original = { a: 1, b: { c: 2 } };
const shallowCopy = { ...original };
console.log(shallowCopy); // { a: 1, b: { c: 2 } }
shallowCopy.b.c = 3;
console.log(original.b.c); // 3 (原始对象也被修改了)
```

**深拷贝（Deep Copy）**

深拷贝不仅复制对象或数组本身，还会递归地复制其所有的嵌套对象和数组。这样，修改深拷贝中的任何属性都不会影响到原始对象或数组。

**实现深拷贝的方法：**

- **使用 `JSON.parse()` 和 `JSON.stringify()`：**
这种方法简单但有局限性，不能处理函数、循环引用、undefined 等。
```javascript
const original = { a: 1, b: { c: 2 } };
const deepCopy = JSON.parse(JSON.stringify(original));
console.log(deepCopy); // { a: 1, b: { c: 2 } }
deepCopy.b.c = 3;
console.log(original.b.c); // 2 (原始对象没有被修改)
```

- **使用递归函数：**

这种方法可以处理更复杂的情况，包括函数、循环引用等。

```javascript
function deepCopy(obj, hash = new WeakMap()) {
  if (obj === null) return null; // 如果是null或者不是对象
  if (typeof obj !== 'object') return obj; // 如果是基本类型，直接返回
  if (hash.has(obj)) return hash.get(obj); // 解决循环引用问题

  let result;
  if (Array.isArray(obj)) {
    result = [];
  } else {
    result = {};
  }

  hash.set(obj, result); // 将当前对象与拷贝结果关联

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepCopy(obj[key], hash);
    }
  }

  return result;
}

const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
const deepCopy = deepCopy(original);
console.log(deepCopy); // { a: 1, b: { c: 2 }, d: [1, 2, 3] }
deepCopy.b.c = 3;
console.log(original.b.c); // 2 (原始对象没有被修改)
```

- **使用第三方库：**
例如 `lodash` 库中的 `_.cloneDeep()` 方法。
```javascript
const _ = require('lodash');

const original = { a: 1, b: { c: 2 } };
const deepCopy = _.cloneDeep(original);
console.log(deepCopy); // { a: 1, b: { c: 2 } }
deepCopy.b.c = 3;
console.log(original.b.c); // 2 (原始对象没有被修改)
```

## 13.防抖和节流

**防抖（`Debouncing`）**

防抖的基本思想是：在一定时间内，如果再次触发了事件，则重新计时。只有当这段时间内没有再次触发事件时，才会执行函数。

**应用场景**：搜索框输入、窗口调整大小等。

**实现代码**：

```javascript
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 示例
const handleResize = debounce(() => {
    console.log('Window resized');
}, 300);

window.addEventListener('resize', handleResize);
```

**节流（`Throttling`）**

节流的基本思想是：在一定时间内，只执行一次函数。即使在这段时间内多次触发事件，也只会执行一次。

**应用场景**：滚动事件、鼠标移动等。

**实现代码**：

```javascript
function throttle(func, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastTime >= wait) {
            func.apply(this, args);
            lastTime = now;
        }
    };
}

// 示例
const handleScroll = throttle(() => {
    console.log('Window scrolled');
}, 300);

window.addEventListener('scroll', handleScroll);
```

**结合使用**

有时候，我们可能需要结合使用防抖和节流来达到更好的效果。例如，在滚动事件中，我们可以先使用节流来限制执行频率，然后再使用防抖来确保最后一次滚动后执行某些操作。

**结合使用的示例**：

```javascript
function throttleAndDebounce(func, wait) {
    let lastTime = 0;
    let timeout;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastTime >= wait) {
            func.apply(this, args);
            lastTime = now;
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
                lastTime = new Date().getTime();
            }, wait - (now - lastTime));
        }
    };
}

// 示例
const handleScroll = throttleAndDebounce(() => {
    console.log('Window scrolled and debounced');
}, 300);

window.addEventListener('scroll', handleScroll);
```

## 14.作用域和作用域链、执行期上下文

**1. 作用域 (`Scope`)**

作用域定义了变量和函数的可访问性。在`JavaScript`中主要有两种类型的作用域：

- **全局作用域**：在程序的任何地方都可以访问到的变量或函数。

- **局部作用域**：仅在特定函数内部可以访问到的变量或函数。

**示例**

```javascript
var globalVar = "I'm global";  // 全局变量

function example() {
    var localVar = "I'm local";  // 局部变量
    console.log(globalVar);  // 可以访问全局变量
    console.log(localVar);   // 可以访问局部变量
}

example();
console.log(globalVar);  // 输出: I'm global
// console.log(localVar);  // 报错，localVar is not defined
```

**2. 作用域链 (`Scope Chain`)**

当一个函数被创建时，它会记住其创建时所在的作用域。这种机制形成了一个链式结构，称为作用域链。这个链条从当前执行环境开始，向上追溯至全局环境。每个层级都可以访问其自身及所有外层环境中的变量。

**示例**

```javascript
var a = 'global';

function outer() {
    var b = 'outer';
    
    function inner() {
        var c = 'inner';
        console.log(a, b, c);  // 可以访问a, b, c
    }
    
    inner();
}

outer();  // 输出: global outer inner
```

在这个例子中，`inner` 函数能够访问 `a (global)、b (outer) 和 c (inner)`，这是因为它的作用域链包含了外部函数 `outer` 的作用域以及全局作用域。

**3. 执行上下文 (`Execution Context`)**

执行上下文是`JavaScript`运行时的一个抽象概念，用来跟踪当前正在执行的代码及其相关数据。每当一段代码被执行时，都会创建一个新的执行上下文。执行上下文主要包含三部分：

**变量对象 (`Variable Object`)**：存储函数参数、局部变量等信息。

**作用域链 (`Scope Chain`)**：如前所述。

**this值**：指向当前执行上下文的对象。

每次调用函数时，都会为其创建一个新的执行上下文，并将其推入执行栈中。当函数执行完毕后，该执行上下文会被弹出栈。

**示例**

```javascript
function foo(num) {
    var anotherNum = num * 2;
    console.log(anotherNum);
}

foo(5);  // 输出: 10
```

在这个简单的例子中，当调用 foo(5) 时，会为 foo 创建一个新的执行上下文，其中包含参数 num 的值（即5），以及局部变量 anotherNum。一旦函数执行结束，这个执行上下文就会被销毁。

## 15.`DOM` 常见的操作方式

**1. 获取元素**

- **`document.getElementById(id)`**：通过ID获取单个元素。
- **`document.getElementsByClassName(className)`**：通过类名获取一组元素。
- **`document.getElementsByTagName(tagName)`**：通过标签名获取一组元素。
- **`document.querySelector(selector)`**：通过CSS选择器获取第一个匹配的元素。
- **`document.querySelectorAll(selector)`**：通过CSS选择器获取所有匹配的元素。

**示例**

```javascript
const elementById = document.getElementById('myId');
const elementsByClass = document.getElementsByClassName('myClass');
const elementsByTag = document.getElementsByTagName('div');
const firstElement = document.querySelector('.myClass');
const allElements = document.querySelectorAll('.myClass');
```

**2. 创建新元素**

- **`document.createElement(tagName)`**：创建一个新的HTML元素。

**示例**

```javascript
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello, World!';
```

**3. 添加/移除/替换元素**

- **`element.appendChild(childNode)`**：向元素中添加子节点。
- **`element.removeChild(childNode)`**：从元素中移除子节点。
- **`element.replaceChild(newChild, oldChild)`**：用新的子节点替换旧的子节点。

**示例**

```javascript
const parent = document.getElementById('parent');
const child = document.createElement('p');
child.textContent = 'I am a child';
parent.appendChild(child);

// 移除子节点
parent.removeChild(child);

// 替换子节点
const newChild = document.createElement('span');
newChild.textContent = 'New Child';
parent.replaceChild(newChild, child);
```

**4. 修改元素属性**

- **`element.setAttribute(name, value)`**：设置元素的属性。
- **`element.getAttribute(name)`**：获取元素的属性值。
- **`element.removeAttribute(name)`**：移除元素的属性。

**示例**

```javascript
const img = document.createElement('img');
img.setAttribute('src', 'image.jpg');
console.log(img.getAttribute('src')); // 输出: image.jpg
img.removeAttribute('src');
```

**5. 修改元素样式**

- **`element.style.property = value`**：直接修改内联样式。
- **`element.classList.add/remove/toggle(className)`**：添加/移除/切换类名。

**示例**

```javascript
const div = document.getElementById('myDiv');
div.style.backgroundColor = 'blue';

// 类名操作
div.classList.add('active');
div.classList.remove('inactive');
div.classList.toggle('highlight');
```

**6. 事件监听**

- **`element.addEventListener(event, handler)`**：添加事件监听器。
- **`element.removeEventListener(event, handler)`**：移除事件监听器。

**示例**

```javascript
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log('Button clicked!');
});

// 移除事件监听器
const handleClick = () => {
    console.log('Button clicked again!');
};
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);
```
**7. 获取和设置文本内容**

- **`element.textContent`**：获取或设置元素的文本内容。
- **`element.innerHTML`**：获取或设置元素的HTML内容。

**示例**

```javascript
const p = document.getElementById('myParagraph');
p.textContent = 'This is some text.';
p.innerHTML = '<strong>This is some bold text.</strong>';
```

**8. 遍历节点**

- **`node.childNodes`**：获取子节点列表。
- **`node.parentNode`**：获取父节点。
- **`node.nextSibling`** 和 **`node.previousSibling`**：获取下一个和上一个兄弟节点。
- **`node.firstChild`** 和 **`node.lastChild`**：获取第一个和最后一个子节点。

**示例**

```javascript
const ul = document.getElementById('myList');
for (let i = 0; i < ul.childNodes.length; i++) {
    const li = ul.childNodes[i];
    if (li.nodeType === Node.ELEMENT_NODE) {
        console.log(li.textContent);
    }
}
```

**9. 动态插入脚本**

- **`document.createElement('script')`**：动态创建并插入脚本。

**示例**

```javascript
const script = document.createElement('script');
script.src = 'https://example.com/script.js';
document.head.appendChild(script);
```

**10. 动态插入样式**

- **`document.createElement('style')`**：动态创建并插入样式。

**示例**

```javascript
const style = document.createElement('style');
style.innerHTML = `
    .myClass {
        color: red;
    }
`;
document.head.appendChild(style);
```

**11. 获取和设置表单数据**

- **`form.elements`**：获取表单中的所有元素。
- **`input.value`**：获取或设置输入框的值。

**示例**

```javascript
const form = document.getElementById('myForm');
const input = form.elements['username'];
console.log(input.value); // 获取输入框的值
input.value = 'John Doe'; // 设置输入框的值
```

**12. 检查元素是否包含某个类名**

- **`element.classList.contains(className)`**：检查元素是否包含指定的类名。

**示例**

```javascript
const div = document.getElementById('myDiv');
if (div.classList.contains('active')) {
    console.log('Div has the active class.');
}
```

**13. 获取元素的尺寸和位置**

- **`element.offsetWidth`** 和 **`element.offsetHeight`**：获取元素的宽度和高度（包括边框和内边距）。
- **`element.getBoundingClientRect()`**：获取元素相对于视口的位置和尺寸。

**示例**

```javascript
const div = document.getElementById('myDiv');
console.log(div.offsetWidth); // 宽度
console.log(div.offsetHeight); // 高度

const rect = div.getBoundingClientRect();
console.log(rect.top, rect.left, rect.width, rect.height);
```

**14. 获取和设置自定义数据属性**

- **`element.dataset`**：获取或设置自定义数据属性（data-属性）。

**示例**

```javascript
const div = document.getElementById('myDiv');
div.dataset.id = '123';
console.log(div.dataset.id); // 输出: 123
```

**15. 获取和设置元素的属性**

- **`element.attributes`**：获取元素的所有属性。
- **`element.getAttribute(name)`** 和 **`element.setAttribute(name, value)`**：获取和设置特定属性。

**示例**

```javascript
const img = document.getElementById('myImage');
console.log(img.attributes); // 获取所有属性
console.log(img.getAttribute('src')); // 获取src属性
img.setAttribute('alt', 'My Image'); // 设置alt属性
```

## 16.`Array.sort()`方法与实现机制

`Array.sort()` 是 `JavaScript` 中用于对数组元素进行排序的方法。它会按照字典顺序（即字符串`Unicode`码点）对数组的元素进行排序，也可以通过提供一个比较函数来自定义排序逻辑。

**基本用法**

```javascript
let arr = [10, 2, 5, 1, 9];
arr.sort(); // 默认按字符串Unicode码点排序
console.log(arr); // 输出: [1, 10, 2, 5, 9]

// 使用比较函数自定义排序
arr.sort((a, b) => a - b);
console.log(arr); // 输出: [1, 2, 5, 9, 10]
```

**比较函数**

比较函数接受两个参数 `a` 和 `b`，并返回一个数值：

- 如果 `a` 应该排在 `b` 之前，返回负数。
- 如果 `a` 应该排在 `b` 之后，返回正数。
- 如果 `a` 和 `b` 相等，返回 0。

**实现机制**

`Array.sort()` 的具体实现机制在不同的 `JavaScript` 引擎中可能有所不同，但大多数现代引擎（如 `V8`、`SpiderMonkey` 等）都使用了 `Timsort` 或类似的混合排序算法。`Timsort` 是一种结合了归并排序和插入排序的稳定排序算法，具有以下特点：

- 稳定性：相等的元素在排序后保持原来的相对顺序。
- 高效性：对于部分有序的数据，`Timsort` 可以达到线性时间复杂度 `O(n)`。
- 适应性：能够根据数据的不同特性自动调整策略。

**示例代码**

下面是一个完整的示例代码，展示了如何使用 `Array.sort()` 方法对不同类型的数据进行排序，并解释了其内部实现机制。

```javascript
// 数组排序示例
let numbers = [10, 2, 5, 1, 9];
let strings = ['banana', 'apple', 'cherry'];
let objects = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 20 },
    { name: 'Charlie', age: 30 }
];

// 对数字数组进行排序
numbers.sort((a, b) => a - b);
console.log('Sorted numbers:', numbers);

// 对字符串数组进行排序
strings.sort();
console.log('Sorted strings:', strings);

// 对对象数组进行排序
objects.sort((a, b) => a.age - b.age);
console.log('Sorted objects by age:', objects);

// 自定义排序函数
function customSort(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

objects.sort(customSort);
console.log('Sorted objects by name:', objects);

// 解释内部实现机制
console.log('Array.sort() uses Timsort or a similar hybrid sorting algorithm.');
console.log('It is stable and efficient, especially for partially sorted data.');
```

## 17.`Ajax`的请求过程

**`Ajax`**（Asynchronous JavaScript and XML）是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。它通过在后台与服务器进行少量数据交换，使网页实现异步更新。下面是使用原生`JavaScript`实现一个简单的`Ajax`请求过程的详细步骤和代码示例。

**1. 创建`XMLHttpRequest`对象**

首先，需要创建一个`XMLHttpRequest`对象，这是发起`Ajax`请求的核心对象。

```javascript
var xhr = new XMLHttpRequest();
```

**2. 配置请求**

接下来配置请求类型（`GET`或`POST`）、`URL`以及是否异步处理等信息。这里以发送一个`GET`请求为例：

```javascript
xhr.open('GET', 'https://api.example.com/data', true);
```

- 第一个参数是请求方法：'GET' 或 'POST'。
- 第二个参数是要请求的URL。
- 第三个参数是一个布尔值，表示请求是否应该异步执行，默认为true。

**3. 设置请求头（可选）**

如果需要设置`HTTP`头部信息，比如`Content-Type`，可以在调用`open()`之后、`send()`之前使用`setRequestHeader()`方法来设置：

```javascript
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
```

对于`GET`请求通常不需要设置额外的请求头。

**4. 发送请求**

配置完成后，可以调用`send()`方法来发送请求。如果是`GET`请求，直接传入`null`；如果是`POST`请求，则需要传递要发送的数据作为参数。

```javascript
xhr.send(null);  // 对于GET请求
// xhr.send('key=value&anotherKey=anotherValue');  // 对于POST请求
```

**5. 处理响应**

最后一步是定义如何处理从服务器返回的数据。这通常是通过监听`onreadystatechange`事件完成的。当`readyState`属性发生变化时，这个事件就会被触发。

```javascript
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {  // 确保请求已完成且状态码为200
        console.log(xhr.responseText);  // 输出服务器返回的数据
    }
};
```

- `readyState`属性有五个可能的值：
  - 0: 请求未初始化
  - 1: 服务器连接已建立
  - 2: 请求已接收
  - 3: 请求处理中
  - 4: 请求已完成，且响应已就绪
- `status`属性包含了`HTTP`状态码，如`200`表示成功。

**完整示例代码**

将上述所有步骤组合起来，形成一个完整的`Ajax` `GET`请求示例：

```javascript
function makeAjaxGetRequest(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Response from server:", xhr.responseText);
        } else if (xhr.readyState === 4) {
            console.error("Error occurred: ", xhr.statusText);
        }
    };
    
    xhr.send(null);
}

// 使用函数
makeAjaxGetRequest('https://api.example.com/data');
```

## 18.`JS`的垃圾回收机制

**1. 标记-清除（Mark and Sweep）**

这是最基本的垃圾回收算法。它分为两个阶段：

- **标记阶段**：从根对象开始，递归遍历所有可达的对象，并将它们标记为“活动”。
- **清除阶段**：遍历堆中的所有对象，清除未被标记的对象，释放其占用的内存。

**2. 引用计数（Reference Counting）**

引用计数是一种简单的垃圾回收机制，但它在现代 `JavaScript` 引擎中并不常用。它的基本思想是：

- 每个对象都有一个引用计数器，记录有多少地方引用了这个对象。
- 当引用计数为 0 时，对象被认为是垃圾，可以被回收。
- 引用计数的一个主要问题是无法处理循环引用。例如：

```javascript
let objA = {};
let objB = {};
objA.ref = objB;
objB.ref = objA;
```

在这个例子中，`objA` 和 `objB` 相互引用，但它们实际上已经没有外部引用了，引用计数法无法回收它们。

**3. 分代收集（Generational Garbage Collection）**

分代收集是一种优化技术，它基于以下观察：

- 大多数对象的生命周期很短，很快就会变成垃圾。
- 少数对象的生命周期很长。

分代收集将内存分为几个代（通常是年轻代和老年代）：

- **年轻代**：新创建的对象首先放在年轻代。
- **老年代**：经过几次垃圾回收后仍然存活的对象会被移动到老年代。

垃圾回收器会更频繁地对年轻代进行垃圾回收，而对老年代的垃圾回收则相对较少。这样可以提高垃圾回收的效率。

**4. 增量垃圾回收（`Incremental Garbage Collection`）**

增量垃圾回收将垃圾回收过程分成多个小步骤，每个步骤之间可以让 `JavaScript` 代码继续执行。这样可以减少垃圾回收对程序性能的影响。

**5. 空闲时间垃圾回收（Idle-Time Garbage Collection）**

现代浏览器和 Node.js 运行时会在空闲时间进行垃圾回收，以减少对用户交互的影响。

**示例代码**

虽然垃圾回收是自动进行的，但我们可以通过一些代码示例来理解它的行为。以下是一个简单的示例，展示了如何手动触发垃圾回收：

```javascript
// 创建一个大对象
function createLargeObject() {
    const largeArray = new Array(1000000).fill('a');
    return largeArray;
}

// 创建并使用大对象
const largeObj = createLargeObject();
console.log(largeObj.length); // 输出 1000000

// 释放引用
largeObj = null;

// 手动触发垃圾回收（仅在 Node.js 中有效）
if (global.gc) {
    global.gc();
}

// 检查内存使用情况
process.memoryUsage(); // 在 Node.js 中可用
```
注意，手动触发垃圾回收通常只在 Node.js 中有效，并且需要启用 --expose-gc 选项。在浏览器环境中，垃圾回收是完全自动的，无法手动触发。

## 19.`JS`中的`String、Array`和`Math`方法

**1. `String` 对象**

- `charAt(index)`: 返回指定位置的字符。
- `concat(str1, str2, ..., strN)`: 将一个或多个字符串连接到当前字符串。
- `indexOf(searchValue, fromIndex)`: 返回指定值在字符串中首次出现的位置。
- `lastIndexOf(searchValue, fromIndex)`: 返回指定值在字符串中最后一次出现的位置。
- `slice(start, end)`: 提取字符串的一部分并返回新的字符串。
- `substring(start, end)`: 提取字符串的一部分并返回新的字符串。
- `substr(start, length)`: 提取从指定位置开始的指定长度的字符。
- `toLowerCase()`: 将字符串转换为小写。
- `toUpperCase()`: 将字符串转换为大写。
- `trim()`: 去除字符串两端的空白字符。
- `split(separator, limit)`: 使用分隔符将字符串分割成数组。
- `replace(searchValue, replaceValue)`: 替换与正则表达式匹配的子字符串。
- `match(regexp)`: 检索与正则表达式匹配的子字符串。
- `search(regexp)`: 搜索与正则表达式匹配的子字符串，并返回其位置。

**示例代码**

```javascript
const str = "Hello, World!";

console.log(str.charAt(7)); // 输出: W
console.log(str.concat(" Welcome to JavaScript!")); // 输出: Hello, World! Welcome to JavaScript!
console.log(str.indexOf("World")); // 输出: 7
console.log(str.lastIndexOf("o")); // 输出: 8
console.log(str.slice(7, 12)); // 输出: World
console.log(str.substring(7, 12)); // 输出: World
console.log(str.substr(7, 5)); // 输出: World
console.log(str.toLowerCase()); // 输出: hello, world!
console.log(str.toUpperCase()); // 输出: HELLO, WORLD!
console.log(str.trim()); // 输出: Hello, World!
console.log(str.split(", ")); // 输出: ["Hello", "World!"]
console.log(str.replace("World", "JavaScript")); // 输出: Hello, JavaScript!
console.log(str.match(/o/g)); // 输出: ["o", "o"]
console.log(str.search(/World/)); // 输出: 7
```
**2. `Array` 对象**

- `push(element1, ..., elementN)`: 在数组末尾添加一个或多个元素，并返回新的长度。
- `pop()`: 删除并返回数组的最后一个元素。
- `shift()`: 删除并返回数组的第一个元素。
- `unshift(element1, ..., elementN)`: 在数组开头添加一个或多个元素，并返回新的长度。
- `splice(start, deleteCount, item1, ..., itemN)`: 从数组中添加/删除项目。
- `slice(start, end)`: 提取数组的一部分并返回新的数组。
- `concat(array1, array2, ..., arrayN)`: 合并两个或多个数组。
- `join(separator)`: 将所有数组元素连接成一个字符串。
- `reverse()`: 反转数组中的元素顺序。
- `sort(compareFunction)`: 对数组的元素进行排序。
- `map(callback, thisArg)`: 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数。
- `filter(callback, thisArg)`: 创建一个新数组，包含通过测试的所有元素。
- `reduce(callback, initialValue)`: 对数组中的每个元素执行一个由您提供的reducer函数（升序执行），将其结果汇总为单个返回值。
- `forEach(callback, thisArg)`: 对数组的每个元素执行一次提供的函数。
- `find(callback, thisArg)`: 返回数组中满足提供的测试函数的第一个元素的值。
- `includes(valueToFind, fromIndex)`: 判断数组是否包含某个指定的值。

**示例代码**

```javascript
const arr = [1, 2, 3, 4, 5];

console.log(arr.push(6)); // 输出: 6
console.log(arr.pop()); // 输出: 6
console.log(arr.shift()); // 输出: 1
console.log(arr.unshift(0)); // 输出: 5
console.log(arr.splice(2, 1, 9)); // 输出: [3]
console.log(arr.slice(1, 3)); // 输出: [2, 9]
console.log(arr.concat([6, 7, 8])); // 输出: [0, 2, 9, 4, 5, 6, 7, 8]
console.log(arr.join("-")); // 输出: 0-2-9-4-5
console.log(arr.reverse()); // 输出: [5, 4, 9, 2, 0]
console.log(arr.sort((a, b) => a - b)); // 输出: [0, 2, 4, 5, 9]
console.log(arr.map(x => x * 2)); // 输出: [0, 4, 8, 10, 18]
console.log(arr.filter(x => x % 2 === 0)); // 输出: [0, 2, 4]
console.log(arr.reduce((acc, curr) => acc + curr, 0)); // 输出: 20
arr.forEach(x => console.log(x)); // 输出: 0 2 4 5 9
console.log(arr.find(x => x > 4)); // 输出: 5
console.log(arr.includes(4)); // 输出: true
```

**3. `Math` 对象**

- **abs(x)**: 返回x的绝对值。
- **ceil(x)**: 返回大于等于x的最小整数。
- **floor(x)**: 返回小于等于x的最大整数。
- **round(x)**: 返回四舍五入后的整数。
- **max(x, y, z, ..., n)**: 返回一组数中的最大值。
- **min(x, y, z, ..., n)**: 返回一组数中的最小值。
- **pow(x, y)**: 返回x的y次幂。
- **sqrt(x)**: 返回x的平方根。
- **random()**: 返回0到1之间的随机数。
- **PI**: 圆周率π。
- **E**: 自然对数的底数e。
- **sin(x)**: 返回x的正弦值。
- **cos(x)**: 返回x的余弦值。
- **tan(x)**: 返回x的正切值。
- **log(x)**: 返回x的自然对数。
- **exp(x)**: 返回e的x次幂。

**示例代码**

```javascript
console.log(Math.abs(-5)); // 输出: 5
console.log(Math.ceil(4.2)); // 输出: 5
console.log(Math.floor(4.8)); // 输出: 4
console.log(Math.round(4.5)); // 输出: 5
console.log(Math.max(1, 2, 3, 4, 5)); // 输出: 5
console.log(Math.min(1, 2, 3, 4, 5)); // 输出: 1
console.log(Math.pow(2, 3)); // 输出: 8
console.log(Math.sqrt(16)); // 输出: 4
console.log(Math.random()); // 输出: 0到1之间的随机数
console.log(Math.PI); // 输出: 3.141592653589793
console.log(Math.E); // 输出: 2.718281828459045
console.log(Math.sin(Math.PI / 2)); // 输出: 1
console.log(Math.cos(0)); // 输出: 1
console.log(Math.tan(Math.PI / 4)); // 输出: 1
console.log(Math.log(Math.E)); // 输出: 1
console.log(Math.exp(1)); // 输出: 2.718281828459045
```

## 20.`addEventListener`和`onClick()`的区别

**1. `addEventListener`**

`addEventListener` 是一个更现代、更灵活的方法，用于向指定元素添加事件监听器。它允许你为同一个元素添加多个事件处理器，并且可以控制事件的捕获和冒泡阶段。

**特点**：

- 可以为同一个元素添加多个事件处理器。
- 支持事件捕获和冒泡阶段。
- 不会覆盖已有的事件处理器。
- 更容易移除事件处理器（通过 `removeEventListener`）。
- 语法：

```javascript
element.addEventListener(event, function, useCapture);
```

- **`event`**：事件类型，如 "click"。
- **`function`**：事件触发时调用的函数。
- **`useCapture`**：可选参数，布尔值，指定事件是否在捕获或冒泡阶段执行，默认为 `false`（冒泡阶段）。

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>addEventListener Example</title>
</head>
<body>
    <button id="myButton">Click Me</button>

    <script>
        const button = document.getElementById('myButton');

        const handleClick = () => {
            console.log('Button clicked');
        }

        // 添加第一个点击事件处理器
        button.addEventListener('click', handleClick);

        // 添加第二个点击事件处理器
        button.addEventListener('click', () => {
            console.log('Second click handler');
        });

        // 移除第一个点击事件处理器
        // 注意：需要传入相同的函数引用
        button.removeEventListener('click', handleClick);
    </script>
</body>
</html>
```

**2. `onClick` 属性**

`onClick` 是 `HTML` 元素的一个属性，可以直接在 `HTML` 标签中设置，也可以通过 `JavaScript` 动态设置。它是一种较旧的方法，通常用于简单的事件处理。

**特点**：

- 每个元素只能有一个 `onClick` 事件处理器。
- 会覆盖已有的 `onClick` 事件处理器。
- 不支持事件捕获和冒泡阶段。
- 不容易移除事件处理器。

**语法**：

```html
<button onclick="myFunction()">Click Me</button>
```

或者通过 `JavaScript` 设置：

```javascript
element.onclick = function() {
    // 事件处理逻辑
};
```

**示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>onClick Example</title>
</head>
<body>
    <button id="myButton" onclick="handleClick()">Click Me</button>

    <script>
        function handleClick() {
            console.log('Button clicked using onClick attribute');
        }

        // 通过 JavaScript 设置 onClick 事件处理器
        const button = document.getElementById('myButton');
        button.onclick = function() {
            console.log('Button clicked using JavaScript');
        };
    </script>
</body>
</html>
```

## 21.`new`和`Object.create`的区别

**1. `new` 关键字**
`new` 关键字主要用于调用构造函数来创建一个新对象。它执行以下步骤：

- 创建一个新的空对象。
- 将这个新对象的原型（`__proto__`）设置为构造函数的`prototype`属性。
- 将构造函数的`this`绑定到这个新对象。
- 执行构造函数中的代码。
- 如果构造函数返回的是一个对象，则返回该对象；否则，返回新创建的对象。

**示例代码**：

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
};

const person1 = new Person('Alice', 30);
person1.greet(); // 输出: Hello, my name is Alice and I am 30 years old.
```

**2. `Object.create` 方法**

`Object.create`方法用于创建一个新对象，并指定其原型对象。它的语法是：

```javascript
Object.create(proto, [propertiesObject])
```

proto：新对象的原型对象。
propertiesObject（可选）：一个包含一个或多个属性描述符的对象。
Object.create的主要用途是直接设置新对象的原型，而不通过构造函数。

- **`proto`**：新对象的原型对象。
- **`propertiesObject`**（可选）：一个包含一个或多个属性描述符的对象。

**示例代码**：

```javascript
const personPrototype = {
    greet: function() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
};

const person2 = Object.create(personPrototype);
person2.name = 'Bob';
person2.age = 25;

person2.greet(); // 输出: Hello, my name is Bob and I am 25 years old.
```

**区别总结**

**创建方式**：

- `new`关键字通过构造函数创建对象，并自动设置原型链。
- `Object.create`方法直接创建一个新对象，并指定其原型对象。

**初始化**：

- `new`关键字会执行构造函数中的初始化代码。
- `Object.create`方法不会执行任何初始化代码，只是简单地创建一个新对象并设置其原型。

**灵活性**：

- `new`关键字适用于需要通过构造函数进行复杂初始化的情况。
- `Object.create`方法适用于只需要简单设置原型的情况，或者需要更灵活地控制对象属性的情况。

**示例代码**：

```javascript
const personPrototype = {
    greet: function() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
};

const person2 = Object.create(personPrototype);
person2.name = 'Bob';
person2.age = 25;

person2.greet(); // 输出: Hello, my name is Bob and I am 25 years old.
```

## 22.`BOM`的`location`对象

**BOM**（Browser Object Model）是浏览器对象模型，它提供了与浏览器窗口进行交互的对象。`location`对象是BOM的一部分，用于获取或设置当前页面的URL，并且可以用来导航到新的页面。

`location`对象包含了一些有用的属性和方法，下面是一些常见的属性和方法：

**属性**

- `href`: 返回或设置整个URL。
- `protocol`: 返回或设置URL的协议部分（如http:或https:）。
- `host`: 返回或设置主机名和端口号。
- `hostname`: 返回或设置主机名。
- `port`: 返回或设置端口号。
- `pathname`: 返回或设置URL的路径部分。
- `search`: 返回或设置URL的查询字符串部分（即问号?后面的部分）。
- `hash`: 返回或设置URL的片段标识符部分（即井号#后面的部分）。
- `origin`: 返回URL的协议、主机名和端口号。

**方法**

- `assign(url)`: 加载一个新的文档。
- `reload()`: 重新加载当前文档。
- `replace(url)`: 用新的文档替换当前文档，不会在浏览器历史中留下记录。

**示例代码**

下面是一个示例代码，展示了如何使用`location`对象的一些常见属性和方法：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Location Object Example</title>
</head>
<body>
    <h1>Location Object Example</h1>
    <p>Current URL: <span id="currentUrl"></span></p>
    <p>Protocol: <span id="protocol"></span></p>
    <p>Host: <span id="host"></span></p>
    <p>Hostname: <span id="hostname"></span></p>
    <p>Port: <span id="port"></span></p>
    <p>Pathname: <span id="pathname"></span></p>
    <p>Search: <span id="search"></span></p>
    <p>Hash: <span id="hash"></span></p>
    <p>Origin: <span id="origin"></span></p>

    <button onclick="navigateToNewPage()">Navigate to New Page</button>
    <button onclick="reloadPage()">Reload Page</button>
    <button onclick="replacePage()">Replace Page</button>

    <script>
        // 获取并显示当前URL的各个部分
        document.getElementById('currentUrl').textContent = window.location.href;
        document.getElementById('protocol').textContent = window.location.protocol;
        document.getElementById('host').textContent = window.location.host;
        document.getElementById('hostname').textContent = window.location.hostname;
        document.getElementById('port').textContent = window.location.port;
        document.getElementById('pathname').textContent = window.location.pathname;
        document.getElementById('search').textContent = window.location.search;
        document.getElementById('hash').textContent = window.location.hash;
        document.getElementById('origin').textContent = window.location.origin;

        // 导航到新页面
        function navigateToNewPage() {
            window.location.assign('https://www.example.com');
        }

        // 重新加载当前页面
        function reloadPage() {
            window.location.reload();
        }

        // 用新页面替换当前页面
        function replacePage() {
            window.location.replace('https://www.example.com');
        }
    </script>
</body>
</html>
```

## 23.浏览器从输入`URL`到页面渲染的整个流程(涉及到计算机网络数据传输过程、浏览器解析渲染过程)

**1. 输入URL**

- 当用户在浏览器地址栏输入一个URL并按下回车键时，整个加载过程开始启动。

**2. DNS查询**
- **DNS（域名系统）**：首先，浏览器会检查本地缓存是否有该域名对应的IP地址记录。如果没有找到，则向配置的DNS服务器发起请求。
- **递归查询**：如果本地DNS服务器没有所需信息，它会继续向上级DNS服务器查询，直到找到权威DNS服务器为止。
- **返回结果**：一旦找到正确的IP地址，DNS服务器会将结果返回给浏览器，并且通常会被缓存在本地一段时间以提高后续访问速度。

**3. 建立TCP连接**

- **三次握手**：浏览器与Web服务器之间通过TCP协议建立连接。这涉及到三次握手的过程来确保双方都准备好进行通信。
- **SSL/TLS握手（对于HTTPS）**：如果是安全连接（HTTPS），还会有一个额外的安全层设置阶段，在此期间客户端和服务端交换证书、协商加密算法等。

**4. 发送HTTP/HTTPS请求**

- **浏览器构造请求报文**：浏览器会根据用户的操作（如点击链接、提交表单等）构造一个HTTP或HTTPS请求报文。这个请求报文包含了请求方法（如GET、POST等）、请求URL、请求头（如User-Agent、Accept等）以及请求体（如POST方法提交的数据）。
- **发送请求**：浏览器将构造好的请求报文通过已建立的TCP连接发送给Web服务器。

**5. 服务器处理请求**

- **服务器接收请求**：Web服务器接收到请求后，根据请求的内容执行相应的操作，如读取文件、调用数据库、运行脚本等。
- **生成响应**：处理完成后，服务器生成响应报文并通过已建立的TCP连接返回给客户端。

**6. 接收响应**

- **浏览器接收响应**：浏览器接收到来自服务器的数据流，这些数据可能是HTML文档、CSS样式表、JavaScript脚本或其他类型的资源文件。

**7. 解析HTML文档**

- **DOM树构建**：浏览器开始解析HTML内容，创建文档对象模型(DOM)树。每个标签都会被转换成一个节点。
- **CSSOM树构建**：同时，浏览器也会解析CSS文件，形成CSS对象模型(CSSOM)树。
- **渲染树构建**：结合DOM树和CSSOM树，浏览器可以构建出渲染树，决定哪些元素需要显示以及如何布局。

**8. 渲染页面**

- **布局计算**：基于渲染树的信息，浏览器确定每个可见元素的确切位置和大小。
- **绘制**：最后一步是将像素填充到屏幕上，完成最终的视觉呈现。

**9. 执行JavaScript**

- **如果页面中有JavaScript代码**：如果页面中有JavaScript代码，那么在适当的时候（比如DOMContentLoaded事件触发时）会被执行。JavaScript可以修改DOM结构、改变样式甚至重新加载页面。

**10. 加载其他资源**

- **页面中的图片、视频等多媒体资源**：页面中的图片、视频等多媒体资源也会被依次下载并插入到相应的位置上。

## 24.跨域、同源策略及跨域实现方式和原理

**1. 同源策略**

同源策略（Same Origin Policy, SOP）是浏览器的一种安全机制，用于限制一个源（origin）的文档或脚本如何与另一个源的资源进行交互。这里的“源”由协议、域名和端口号组成，只有这三个部分完全相同，才被认为是同源。

例如：

- `http://example.com` 和 `https://example.com` 不同源（协议不同）
- `http://example.com` 和 `http://www.example.com` 不同源（域名不同）
- `http://example.com:80` 和 `http://example.com:8080` 不同源（端口号不同）

**2. 跨域问题**

当一个请求试图从一个源访问另一个源的资源时，如果这两个源不同，则会触发跨域问题。浏览器会阻止这种请求，以防止恶意网站通过脚本获取用户敏感信息。

**跨域实现方式及原理**

**1. JSONP (JSON with Padding)**

`JSONP` 是一种通过 `<script>` 标签来绕过同源策略的方法。它利用了 `<script>` 标签可以跨域加载资源的特点。

**原理**：

- 客户端定义一个回调函数。
- 服务器返回的数据是一个调用该回调函数的 JavaScript 代码。
- 浏览器执行这段 JavaScript 代码，从而间接地获取到数据。

**示例代码**：

客户端：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JSONP Example</title>
</head>
<body>
    <div id="result"></div>
    <script>
        function handleResponse(data) {
            document.getElementById('result').innerText = data.message;
        }
    </script>
    <script src="http://example.com/api?callback=handleResponse"></script>
</body>
</html>
```

服务器端（Node.js + Express）：

```javascript
const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    const callback = req.query.callback;
    const data = { message: 'Hello, JSONP!' };
    res.send(`${callback}(${JSON.stringify(data)})`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

**2. CORS (Cross-Origin Resource Sharing)**

`CORS` 是一种基于 `HTTP` 头的机制，允许服务器声明哪些源可以访问其资源。

**原理**：

- 客户端发送带有 `Origin` 头的请求。
- 服务器响应时，根据请求的 `Origin` 头决定是否添加 `Access-Control-Allow-Origin` 头。
- 如果服务器允许该源访问，则在响应头中添加 `Access-Control-Allow-Origin` 头，并返回数据。

示例代码：

客户端：

```javascript
fetch('http://example.com/api', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

服务器端（Node.js + Express）：

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', (req, res) => {
    const data = { message: 'Hello, CORS!' };
    res.json(data);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

**3. 代理服务器**

通过设置一个代理服务器，客户端先请求自己的服务器，然后由自己的服务器去请求目标服务器，最后将结果返回给客户端。

**原理**：

- 客户端请求自己的服务器。
- 自己的服务器请求目标服务器。
- 目标服务器返回数据给自己的服务器。
- 自己的服务器将数据返回给客户端。

示例代码：

客户端：

```javascript
fetch('/proxy', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

服务器端（Node.js + Express）：

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get('http://example.com/api');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the target server');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

## 25.浏览器的回流(`Reflow`)和重绘(`Repaints`)

**回流（Reflow）**

回流是指当浏览器需要重新计算页面布局时发生的过程。这通常发生在以下情况：

- **窗口大小改变**
- 改变字体大小
- 添加或删除DOM元素
- 改变元素的内容
- 激活CSS伪类（如:hover）
- 查询某些属性，如offsetHeight、offsetWidth等

回流是一个非常昂贵的操作，因为它需要重新计算所有受影响元素的位置和尺寸。如果整个页面都需要重新布局，那么这个过程会非常耗时。

**重绘（Repaint）**

重绘是指当浏览器需要重新绘制页面的一部分时发生的过程。这通常发生在以下情况：

- 改变颜色
- 改变背景
- 改变透明度
- 改变边框样式

重绘比回流要便宜一些，因为它不需要重新计算布局，只需要重新绘制受影响的部分。

**性能优化**

为了减少回流和重绘对性能的影响，可以采取以下措施：

- **批量修改**：尽量将多个DOM操作合并到一起进行，减少回流和重绘的次数。
- **使用documentFragment**：在内存中创建一个文档片段，然后一次性插入到DOM中。
- **避免强制同步布局**：避免在读取布局信息后立即写入布局信息，这样会导致两次回流。
- **使用CSS动画**：使用CSS动画而不是JavaScript来实现动画效果，因为CSS动画会被浏览器优化。
- **使用transform和opacity**：使用transform和opacity属性来实现动画，因为它们不会触发回流。
- **避免使用table布局**：table布局在内容变化时会导致整个表格重新布局。
- **使用will-change属性**：提前告诉浏览器哪些属性可能会发生变化，让浏览器提前做好优化。

**示例代码**

下面是一个简单的示例，展示了如何通过批量修改来减少回流和重绘的次数。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reflow and Repaint Example</title>
    <style>
        .box {
          width: 100px;
          height: 100px;
          background-color: lightblue;
          margin: 10px;
          display: inline-block;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    <button id="addBox">Add Box</button>

    <script>
      const container = document.getElementById('container');
      const addBoxButton = document.getElementById('addBox');

      addBoxButton.addEventListener('click', () => {
        const EleFragments = document.createDocumentFragment();

        for (let i = 0; i < 10; i++) {
          const box = document.createElement('div');
          box.className = 'box';
          EleFragments.appendChild(box);
        }

        container.appendChild(EleFragments);
      })
    </script>
</body>
</html>
```

## 26.`JavaScript`中的`arguments`

在JavaScript中，`arguments` 是一个特殊的对象，它包含了函数调用时传递的所有参数。这个对象在每个非箭头函数体内都是可用的，并且可以用来访问传递给函数的实际参数，即使这些参数没有被显式地定义为函数参数。

**`arguments` 对象的主要特性**

- **数组类对象**：虽然 `arguments` 看起来像数组，但它实际上并不是真正的数组（即它不是 `Array` 的实例），而是类似数组的对象。这意味着你可以通过索引访问其元素，但不能使用数组的方法如 `push`, `pop` 等。
- **动态性**：`arguments` 对象会根据实际传入的参数数量和值自动更新。
- **callee 属性**：`arguments.callee` 指向当前正在执行的函数本身。这在ES6之后由于尾调用优化等原因已被弃用。
- **length 属性**：表示实际传递给函数的参数个数。

**使用示例**

下面是一些使用 `arguments` 的例子：

**示例 1: 基本用法**

```javascript
function sum() {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }
    return total;
}

console.log(sum(1, 2, 3, 4)); // 输出 10
```
在这个例子中，我们创建了一个名为 `sum` 的函数，它可以接受任意数量的参数并计算它们的总和。这里使用了 `arguments` 来遍历所有传入的参数。

**示例 2: 结合命名参数**

```javascript
function greet(first, last) {
    console.log(`Hello, ${first} ${last}`);
    if (arguments.length > 2) {
        console.log("Additional info:", arguments[2]);
    }
}

greet("John", "Doe", "Developer"); 
// 输出:
// Hello, John Doe
// Additional info: Developer
```

这里展示了如何同时使用明确声明的参数 (`first`, `last`) 和 `arguments` 来处理额外的信息。

**示例 3: 使用 ES6+ 特性替代 `arguments`**

从ES6开始，引入了剩余参数（rest parameters）语法，这使得处理不定数量的参数更加直观和方便：

```javascript
function sum(...numbers) { // ...numbers 收集所有剩余参数到一个数组中
    return numbers.reduce((acc, num) => acc + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 输出 10
```

## 27.`EventLoop`事件循环

事件循环（Event Loop）是JavaScript中一个非常重要的概念，特别是在Node.js和浏览器环境中。它负责处理程序中的各种任务，包括定时器、I/O操作等，并确保这些任务按照正确的顺序执行。

**事件循环的基本概念**

事件循环的核心思想是通过一个无限循环来监听和处理事件队列中的任务。在JavaScript中，事件循环主要处理以下几种任务：

- **宏任务（Macrotask）**：包括整体代码块、setTimeout/setInterval回调、setImmediate回调（Node.js环境）、I/O操作等。
- **微任务（Microtask）**：包括Promise回调、MutationObserver回调等。

事件循环的执行顺序如下：

- **执行当前宏任务**。
- 执行所有微任务。
- 渲染页面（仅限浏览器环境）。
- 处理下一个宏任务。

**示例代码**

**浏览器环境下的事件循环**

```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
    console.log('Promise 1');
}).then(() => {
    console.log('Promise 2');
});

console.log('End');
```
在这个例子中，输出顺序将是：

```
Start
End
Promise 1
Promise 2
Timeout
```

解释：

- `console.log('Start')` 和 `console.log('End')` 是同步代码，直接执行。
- `setTimeout` 回调是一个宏任务，被放入宏任务队列。
- `Promise.resolve().then()` 回调是微任务，被放入微任务队列。
- 当前宏任务执行完毕后，事件循环会先执行所有微任务，然后再执行下一个宏任务。

**Node.js环境下的事件循环**

Node.js的事件循环与浏览器略有不同，特别是对于`setImmediate`和`process.nextTick`的处理。

```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout');
}, 0);

setImmediate(() => {
    console.log('Immediate');
});

process.nextTick(() => {
    console.log('Next Tick 1');
});

process.nextTick(() => {
    console.log('Next Tick 2');
});

console.log('End');
```

在这个例子中，输出顺序将是：

```
Start
End
Next Tick 1
Next Tick 2
Immediate
Timeout
```

解释：

- `console.log('Start')` 和 `console.log('End')` 是同步代码，直接执行。
- `setTimeout` 回调是一个宏任务，被放入宏任务队列。
- `setImmediate` 回调也是一个宏任务，但优先级低于`setTimeout`。
- `process.nextTick` 回调是特殊的微任务，会在当前宏任务结束后立即执行。
- 当前宏任务执行完毕后，事件循环会先执行所有`process.nextTick`回调，然后再执行下一个宏任务。

## 28.宏任务与微任务

**宏任务（Macrotask）**

宏任务包括整体代码块、setTimeout、setInterval、I/O操作、UI渲染等。每当一个宏任务完成时，浏览器会检查是否有需要立即处理的微任务，并在继续下一个宏任务之前先执行这些微任务。

**微任务（Microtask）**

微任务包括Promise回调、MutationObserver以及process.nextTick（Node.js环境）。微任务队列会在当前宏任务结束后立即被清空，这意味着所有微任务都会在下一个宏任务开始前被执行完毕。

**事件循环**

- **初始化**：当JavaScript引擎启动时，它首先将全局脚本作为第一个宏任务放入宏任务队列。
- **执行宏任务**：从宏任务队列中取出一个宏任务并执行。
- **执行微任务**：一旦当前宏任务执行完毕，就去执行微任务队列中的所有微任务。
- **渲染**：如果有必要，进行DOM更新和重绘。
- **重复**：回到步骤2，直到没有更多的宏任务或微任务为止。

**示例代码**

下面通过一段示例代码来展示宏任务与微任务的区别：

```javascript
console.log('script start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
    console.log('promise1');
}).then(() => {
    console.log('promise2');
});

console.log('script end');
```

**输出结果**

```
script start
script end
promise1
promise2
setTimeout
```

**解释**

- `console.log('script start');` 和 `console.log('script end');` 是同步代码，直接按顺序执行。
- `setTimeout` 被添加到宏任务队列中，即使延迟时间为0ms，它也会等到当前宏任务结束后的下一个宏任务周期才执行。
- `Promise.resolve().then()` 创建了一个微任务，在当前宏任务完成后立即执行。

## 29.`BOM`属性对象方法

**BOM**（Browser Object Model）是浏览器对象模型，它提供了与浏览器窗口进行交互的对象。这些对象包括 `window`、`navigator`、`screen`、`location`、`history` 等。每个对象都有其特定的属性和方法，用于获取或设置浏览器的状态。

**1. `window` 对象**

`window` 对象代表浏览器窗口，是 BOM 的顶级对象。它包含了许多有用的属性和方法。

**常见属性**

- `window.innerHeight` 和 `window.innerWidth`：返回浏览器窗口的视口高度和宽度。
- `window.outerHeight` 和 `window.outerWidth`：返回浏览器窗口的高度和宽度（包括工具栏和滚动条）。
- `window.location`：返回当前页面的 URL 信息。
- `window.history`：提供了对浏览器历史记录的操作。
- `window.navigator`：提供了关于浏览器的信息。
**常见方法**
- `window.open(url, name, specs, replace)`：打开一个新的浏览器窗口。
- `window.close()`：关闭当前窗口。
- `window.alert(message)`：显示一个警告对话框。
- `window.confirm(message)`：显示一个确认对话框，用户可以选择“确定”或“取消”。
- `window.prompt(message, default)`：显示一个提示对话框，用户可以输入文本。
- `window.setTimeout(function, delay, param1, param2, ...)`：在指定的毫秒数后调用函数。
- `window.setInterval(function, delay, param1, param2, ...)`：每隔指定的毫秒数调用一次函数。
- `window.clearTimeout(timeoutID)`：取消由 setTimeout 设置的定时器。
- `window.clearInterval(intervalID)`：取消由 setInterval 设置的定时器。

**示例代码**

```javascript
// 获取视口尺寸
console.log(`Viewport Width: ${window.innerWidth}px`);
console.log(`Viewport Height: ${window.innerHeight}px`);

// 打开新窗口
const newWindow = window.open('https://www.example.com', 'newWindow', 'width=400,height=400');

// 显示警告对话框
window.alert('这是一个警告对话框！');

// 显示确认对话框
if (window.confirm('你确定要继续吗？')) {
    console.log('用户点击了确定');
} else {
    console.log('用户点击了取消');
}

// 显示提示对话框
const userInput = window.prompt('请输入你的名字:', '默认名字');
console.log(`用户输入的名字是: ${userInput}`);

// 使用 setTimeout
const timeoutID = window.setTimeout(() => {
    console.log('这个消息将在 3 秒后显示');
}, 3000);

// 使用 setInterval
const intervalID = window.setInterval(() => {
    console.log('这个消息每 2 秒显示一次');
}, 2000);

// 取消定时器
window.clearTimeout(timeoutID);
window.clearInterval(intervalID);
```

**2. `navigator` 对象**

`navigator` 对象包含了有关浏览器的信息。

**常见属性**

- `navigator.userAgent`：返回用户代理字符串，包含浏览器类型、版本等信息。
- `navigator.platform`：返回用户的操作系统平台。
- `navigator.language`：返回浏览器的首选语言。

**示例代码**

```javascript
console.log(`User Agent: ${navigator.userAgent}`);
console.log(`Platform: ${navigator.platform}`);
console.log(`Language: ${navigator.language}`);
```

**3. `location` 对象**

**常见属性**

- **location.href**：返回当前页面的完整 URL。
- **location.protocol**：返回当前页面的协议（如 "http:" 或 "https:"）。
- **location.host**：返回当前页面的主机名和端口号。
- **location.hostname**：返回当前页面的主机名。
- **location.port**：返回当前页面的端口号。
- **location.pathname**：返回当前页面的路径。
- **location.search**：返回当前页面的查询字符串。
- **location.hash**：返回当前页面的片段标识符（即 URL 中的 # 后面的部分）。

**常见方法**

- **location.assign(url)**：加载新的文档。
- **location.replace(url)**：用新的文档替换当前文档。
- **location.reload()**：重新加载当前文档。

**示例代码**

```javascript
console.log(`Current URL: ${location.href}`);
console.log(`Protocol: ${location.protocol}`);
console.log(`Host: ${location.host}`);
console.log(`Hostname: ${location.hostname}`);
console.log(`Port: ${location.port}`);
console.log(`Pathname: ${location.pathname}`);
console.log(`Search: ${location.search}`);
console.log(`Hash: ${location.hash}`);

// 加载新的文档
location.assign('https://www.example.com');

// 用新的文档替换当前文档
location.replace('https://www.example.com');

// 重新加载当前文档
location.reload();
```

**4. history 对象**
history 对象提供了对浏览器会话历史记录的访问。

**常见方法**

- **history.back()**：加载历史记录中的前一个 URL。
- **history.forward()**：加载历史记录中的下一个 URL。
- **history.go(delta)**：加载历史记录中的某个特定页面（delta 为正数表示前进，负数表示后退）。

**示例代码**

```javascript
// 返回上一页
history.back();

// 前进到下一页
history.forward();

// 前进或后退 delta 页
history.go(-1); // 后退一页
history.go(1);  // 前进一页
```

## 30.函数柯里化及其通用封装

函数柯里化（Currying）是一种将使用多个参数的函数转换成一系列使用一个参数的函数的技术。通过柯里化，我们可以部分应用函数，即先固定一些参数，然后返回一个新的函数，这个新函数接收剩余的参数。

**概念**

假设有一个函数 `add(a, b, c)`，它接受三个参数并返回它们的和。柯里化后的版本可以这样使用：

```javascript
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

// 使用柯里化后的函数
const add5 = curriedAdd(5); // 返回一个新的函数
const add5And10 = add5(10); // 再次返回一个新的函数
const result = add5And10(15); // 最终结果为 30
```

**通用柯里化封装**
下面是一个通用的柯里化封装函数 `curry` 的实现：

```javascript
function curry(fn) {
  const arity = fn.length; // 获取函数的参数个数

  return function curried(...args) {
    if (args.length < arity) {
      // 如果传入的参数个数小于函数所需的参数个数，则返回一个新的函数
      return function(...nextArgs) {
        return curried(...args, ...nextArgs);
      };
    } else {
      // 如果传入的参数个数足够，则直接调用原函数
      return fn(...args);
    }
  };
}

// 示例
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

const add5 = curriedAdd(5);
const add5And10 = add5(10);
const result = add5And10(15);

console.log(result); // 输出 30
```

**解释**

- **获取函数的参数个数**：`const arity = fn.length`; 这行代码获取了函数 `fn` 所需的参数个数。
- **递归调用**：如果传入的参数个数小于函数所需的参数个数，则返回一个新的函数，这个新函数会继续收集参数，直到参数个数满足要求。
- **调用原函数**：当传入的参数个数足够时，直接调用原函数并返回结果。

**其他示例**

**示例1：柯里化一个简单的乘法函数**

```javascript
const multiply = (a, b) => a * b;
const curriedMultiply = curry(multiply);

const double = curriedMultiply(2);
const result = double(5); // 输出 10

console.log(result); // 输出 10
```

**示例2：柯里化一个带有默认参数的函数**

```javascript
const greet = (greeting, name) => `${greeting}, ${name}!`;
const curriedGreet = curry(greet);

const sayHello = curriedGreet('Hello');
const result = sayHello('Alice'); // 输出 "Hello, Alice!"

console.log(result); // 输出 "Hello, Alice!"
```

## 31.`JS`的`map()`和`reduce()`方法

**1. `map()` 方法**

`map()` 方法用于创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数。

**语法**：

```javascript
array.map(function(currentValue, index, array) {
    // 返回新的值
}, thisArg);
```

- `currentValue`：当前元素的值。
- `index`（可选）：当前元素的索引。
- `array`（可选）：调用 map() 的数组。
- `thisArg`（可选）：执行回调函数时使用的 this 值。

**示例**：

```javascript
const numbers = [1, 2, 3, 4, 5];

// 将每个元素乘以 2
const doubled = numbers.map(num => num * 2);
console.log(doubled); // 输出: [2, 4, 6, 8, 10]

// 将每个元素转换为字符串
const strings = numbers.map(num => `Number: ${num}`);
console.log(strings); // 输出: ["Number: 1", "Number: 2", "Number: 3", "Number: 4", "Number: 5"]
```

**2. `reduce()` 方法**

`reduce()` 方法对数组中的每个元素执行一个由您提供的 reducer 函数（升序执行），将其结果汇总为单个返回值。

**语法**：

```javascript
array.reduce(function(accumulator, currentValue, currentIndex, array) {
    // 执行操作并返回累积值
}, initialValue);
```
- `accumulator`：累加器累计回调的返回值；它是上一次调用回调时返回的累积值，或 initialValue（如果提供了的话）。
- `currentValue`：当前元素的值。
- `currentIndex`（可选）：当前元素的索引。
- `array`（可选）：调用 reduce() 的数组。
- `initialValue`（可选）：作为第一次调用 callback 函数时的第一个参数的值。如果没有提供初始值，则将使用数组的第一个元素作为初始值，并从第二个元素开始迭代。

**示例**：

```javascript
const numbers = [1, 2, 3, 4, 5];

// 计算数组中所有元素的总和
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 输出: 15

// 计算数组中所有元素的乘积
const product = numbers.reduce((acc, num) => acc * num, 1);
console.log(product); // 输出: 120

// 将数组中的对象按某个属性分组
const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 25 },
    { name: 'David', age: 30 }
];

const groupedByAge = people.reduce((acc, person) => {
    const age = person.age;
    if (!acc[age]) {
        acc[age] = [];
    }
    acc[age].push(person);
    return acc;
}, {});

console.log(groupedByAge);
// 输出:
// {
//   25: [ { name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 } ],
//   30: [ { name: 'Bob', age: 30 }, { name: 'David', age: 30 } ]
// }
```

## 32.`“=="`和`“==="`的区别

在JavaScript中，“==”和“===”是两种不同的比较运算符，它们的主要区别在于如何处理类型转换。

- **双等号（==）**：也称为抽象相等比较。这种比较会尝试将两个操作数转换为相同的类型，然后再进行比较。如果两个值的类型不同，JavaScript 会尝试将它们转换成相同类型后再进行比较。这种类型的转换可能会导致一些意外的结果，因此使用时需要特别小心。

- **三等号（===）**：也称为严格相等比较。这种比较不会执行任何类型转换，只有当两边的操作数不仅值相等而且类型也相同时才返回 true。这种方式更加直观且不易出错，推荐在大多数情况下使用。

**示例代码**

下面通过几个例子来展示这两种运算符的区别：

```javascript
// 双等号 (==) 的示例
console.log(1 == '1'); // true, 因为 '1' 被转换成了数字 1
console.log(0 == false); // true, 因为 false 被转换成了 0
console.log(null == undefined); // true, 特殊情况，null 和 undefined 在 == 比较时被视为相等
console.log('0' == false); // true, 字符串 '0' 被转换成数字 0，然后与 false 相比

// 三等号 (===) 的示例
console.log(1 === '1'); // false, 类型不同
console.log(0 === false); // false, 类型不同
console.log(null === undefined); // false, 类型不同
console.log('0' === false); // false, 类型不同
```
从上面的例子可以看出，使用 == 进行比较时，JavaScript 会自动地对不同类型的数据进行转换，这可能导致一些非预期的行为。而使用 === 则可以避免这种情况，因为它要求两边的操作数必须完全一致（包括类型），从而使得逻辑更加清晰明确。

## 33.`setTimeout`用作倒计时为何会产生误差?

`setTimeout` 用于倒计时会产生误差的原因主要有以下几点：

- **JavaScript 的单线程特性**：JavaScript 是单线程的，这意味着它一次只能执行一个任务。如果在 setTimeout 被调用之前，主线程上有其他耗时较长的任务（如复杂的计算、DOM 操作等），那么 setTimeout 的回调函数会被延迟执行，直到前面的任务完成。
- **系统调度和浏览器优化**：浏览器或操作系统可能会对定时器进行优化，以减少 CPU 的使用。例如，某些浏览器可能会将多个短时间间隔的 setTimeout 合并为一个更长的时间间隔来执行，从而导致实际执行时间与预期时间不一致。
- **最小时间间隔限制**：大多数浏览器对 setTimeout 和 setInterval 的最小时间间隔有限制，通常是 4ms（对于某些浏览器可能是 10ms）。即使你设置的时间间隔小于这个值，实际执行的时间也会被调整到这个最小时间间隔。
- **系统时钟精度**：操作系统的时钟精度也会影响 setTimeout 的准确性。如果系统的时钟精度较低，那么 setTimeout 的时间间隔也会受到影响。

**示例代码**

下面是一个简单的倒计时示例，展示了如何使用 `setTimeout` 来实现倒计时，并记录每次的实际执行时间：

```javascript
function countdown(seconds) {
    const startTime = Date.now();
    let remainingTime = seconds * 1000;

    function tick() {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const timeLeft = Math.max(remainingTime - elapsedTime, 0);

        if (timeLeft <= 0) {
            console.log("倒计时结束");
            return;
        }

        const nextTickTime = 1000 - (elapsedTime % 1000); // 计算下一次 tick 的时间
        setTimeout(() => {
            const actualElapsedTime = Date.now() - now;
            console.log(`剩余时间: ${Math.floor(timeLeft / 1000)} 秒, 实际延迟: ${actualElapsedTime} 毫秒`);
            tick();
        }, nextTickTime);
    }

    tick();
}

// 启动一个 10 秒的倒计时
countdown(10);
```

**解释**

- **startTime**：记录倒计时开始的时间。
- **remainingTime**：倒计时的总时间（以毫秒为单位）。
- **tick**：递归函数，每秒钟调用一次。
- **now**：当前时间。
- **elapsedTime**：从倒计时开始到现在经过的时间。
- **timeLeft**：剩余时间。
- **nextTickTime**：计算下一次 tick 的时间间隔，确保每秒钟调用一次。
- **setTimeout**：设置下一次 tick 的调用时间，并记录实际的延迟时间。

通过这种方式，可以尽量减少 `setTimeout` 的误差，但仍然无法完全消除误差。如果需要更高的精度，可以考虑使用 `requestAnimationFrame` 或者 `Web Workers` 等技术。

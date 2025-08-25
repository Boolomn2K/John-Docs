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

## 17.`Ajax`的请求过程

## 18.`JS`的垃圾回收机制

## 19.`JS`中的`String、Array`和`Math`方法

## 20.`addEventListener`和`onClick()`的区别

## 21.`new`和`Object.create`的区别

## 22.`DOM`的`location`对象

## 23.浏览器从输入`URL`到页面渲染的整个流程(涉及到计算机网络数据传输过程、浏览器解析渲染过程)

## 24.跨域、同源策略及跨域实现方式和原理

## 25.浏览器的回流(`Reflow`)和重绘(`Repaints`)

## 26.`JavaScript`中的`arguments`

## 27.`EventLoop`事件循环

## 28.宏任务与微任务

## 29.`BOM`属性对象方法

## 30.函数柯里化及其通用封装

## 31.`JS`的`map()`和`reduce()`方法

## 32.`“=="`和`“==="`的区别

## 33.`setTimeout`用作倒计时为何会产生误差?

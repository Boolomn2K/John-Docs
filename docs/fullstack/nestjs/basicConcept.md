# NestJS 基本概念

## 前端如何理解后端

![前端如何理解后端](/images/fullstack/nestjs/basicConcept/basicConcept.png)

web服务器: 以 `nginx` 为例,  包裹 `nodejs` 或 `java` 代码，

它拿到某个端口发过来的一个请求到服务器上，然后拿到这个端口的数据包装成一个 `request` 对象,

然后再把这个对象发给后端给 `nodejs`,

通过 `nodejs` 代码把数据做一个加工再返给 web 服务器,

web 服务器就会生成一个 `response` 对象，

`response` 对象又会返还给 client 端,

它有点像一个容器，包裹着后端代码，后端代码进行数据加工，

它负责接收和回传数据。

## 后端处理数据的流程

![后端处理数据的流程](/images/fullstack/nestjs/basicConcept/backend.png)

### 关于 `service`

`service` 最简单的方式一种方式就是数据库的 `CURD`，一般我们用 `SQL` 语言来写，

但写 `SQL` 一般是比较麻烦的，尤其是那种多表查询，表关联之间的主键外键这些东西相对

是比较复杂的，那就会诞生一种相对结构化的语言叫做 `ORM`, `ORM` 的本质是将 `SQL` 语句

转换成函数调用的方式，比如我们可以往 `select` 函数里面传一些参数。

### 关于 `module`

在 `nestjs` 里面通常将 `service` 和 `controller` 统称为 `module`。

一个应用里面至少有一个 `module`，比如处理一个用户登录请求，用户请求登录就肯定需要

一个 `user` 模块， `user` 模块里面肯定要有个 `service`, `service` 拿着用户传来的

信息在数据库里查找信息，`controller` 就是接收这个登陆的 `url`, `url` 里面肯定带着用户名

跟密码什么的生成一个 `request` 对象传给这个 `service`, `service` 做好自己的工作后会返回,

通过 `controller` 生成 `response` 对象给用户。


### 关于 `middleware`

中间件, 这里是切面编程(Aspect Oriented Programming), `middleware` 就是在 `client` 端当浏览器

发送一个请求，或者访问一个 `url` 的时候，在路由调用之前，可以通过 `middleware` 对它进行一个操作，

比如说对 `Token` 的一些验证，或者是前线的验证，登录状态的验证,每次访问请求都打些 `log`, 甚至是

接口监听，接口状态，接口请求时长。

## 什么是 OOP ?

![什么是OOP](/images/fullstack/nestjs/basicConcept/oop.png)

在 `js` 中 `class` 就是面向对象一种最基本的承载方式, 把程序里面的所有实体都变成一个 `class`,

类里面有属性有方法，属性就表示这个实体里面有些什么信息，方法就表示有什么行为。

## 什么是 AOP ?

![什么是AOP](/images/fullstack/nestjs/basicConcept/aop.png)

面向切面编程是和面向对象编程相辅相成的, 两个系统交互的中间夹上一个，而且这一层是可以通过配置化添加的，

不是耦合的。

## 什么是 Ioc 和 DI ?

![什么是Ioc和DI?](/images/fullstack/nestjs/basicConcept/IocAndDI.png)

### 关于 Ioc

比如说在面向对象编程领域里面我们要想拿到一个对象实体就需要 `new` 一个 `class` 才能获取一个对象，

那如果我们现在一个类里面调用另一个类，比如 `A` 类中调用 `B` 类的时候我们就需要在 `A` 里面显式地

`new B()`, 这样我们才能引用这个 `B` 类，但我们这样写相当于 `A` 调用了 `B`，它们天然有一个耦合关系的,

控制反转就是我们不要有这种 `A` 调用 `B` 的这种感觉了，直接声明 `A` 依赖于 `B` ，那这个 `new` 的

过程我们用框架来负责，我们只需要让框架发挥， 比如 `A` 里面有一个属性叫做 `b`, 那个 `b` 你描述一下，

`b` 基于一个 `B` 类实例化出来的, 但是你不需要 `new` ，你只需要把它描述一下就可以了。

有一个现成的 `Ioc` 这样一个控制反转的框架来帮助你在实例化这个 `A` 的时候，自动帮你实例化 `B`,自动

帮你塞到这个 `A` 的属性里。

### 关于 DI

用外层这个控制反转的框架来帮我们 `new` 这个 `B`, 然后把 `new B()` 完成之后的实例再传给这个 `a`,

然后放到这个 `A` 的属性里,依赖注入也是基于装饰器。

## 什么是装饰器

![什么是装饰器](/images/fullstack/nestjs/basicConcept/decorator.png)

## module 如何组织?

![module如何组织?](/images/fullstack/nestjs/basicConcept/module.png)

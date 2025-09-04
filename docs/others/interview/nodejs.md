# nodejs

## 1.`NodeJs`基本概念与特点

### 概念解析
**Node.js** 是基于 **Chrome V8 引擎** 的 JavaScript 运行时环境，允许 JavaScript 脱离浏览器在服务器端运行。核心特点是 **异步非阻塞 I/O** 和 **事件驱动**，非常适合构建高并发的网络应用。

#### 1. 核心特点
- **单线程**：主线程为单线程，但通过 **libuv 线程池** 实现异步 I/O
- **异步非阻塞**：I/O 操作不阻塞主线程，通过回调/事件循环处理结果
- **事件驱动**：基于事件循环（Event Loop）处理回调函数
- **跨平台**：可在 Windows、Linux、macOS 运行
- **生态丰富**：npm 是全球最大的开源包管理系统

#### 2. 与浏览器的区别
| 环境    | JavaScript 引擎 | 全局对象   | 核心 API                  | 执行模型          |
|---------|----------------|------------|---------------------------|-------------------|
| **浏览器** | V8/SpiderMonkey | `window`   | DOM/BOM/XMLHttpRequest    | 多线程（UI/JS）   |
| **Node.js** | V8             | `global`   | 文件系统/网络/进程管理     | 单线程（事件循环） |

### 代码示例
#### 1. 异步非阻塞 I/O
```javascript
// 读取文件（异步非阻塞）
const fs = require('fs');

console.log('开始读取文件');
fs.readFile('./test.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('文件内容:', data);
});
console.log('读取文件操作已发起');

// 输出顺序：
// 开始读取文件 → 读取文件操作已发起 → 文件内容: [文件内容]
```

#### 2. 事件驱动模型
```javascript
const EventEmitter = require('events');

// 创建事件发射器
const emitter = new EventEmitter();

// 监听事件
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// 触发事件
emitter.emit('greet', 'Node.js'); // 输出: Hello, Node.js!
```

### 实际应用场景
- **API 服务**：构建 RESTful API（如 Express/Koa 框架）
- **实时通信**：WebSocket 服务（如 Socket.io）
- **命令行工具**：开发 CLI 工具（如 Webpack、Vue CLI）
- **微服务**：作为微服务节点（配合 PM2 进程管理）
- **数据流处理**：处理大文件/网络流（基于 Stream API）

### 面试要点
#### 1. 单线程模型的优缺点
- **优点**：避免线程切换开销，减少内存占用
- **缺点**：单线程阻塞会导致整个应用崩溃，需通过 **集群模式** 或 **微服务** 解决

#### 2. 事件循环六个阶段
Node.js 事件循环按以下顺序执行：
1. **timers**：执行 `setTimeout`/`setInterval` 回调
2. **pending callbacks**：执行延迟到下一个循环迭代的 I/O 回调
3. **idle, prepare**：仅供内部使用
4. **poll**：获取新的 I/O 事件，执行 I/O 相关回调
5. **check**：执行 `setImmediate` 回调
6. **close callbacks**：执行关闭回调（如 `socket.on('close', ...)`）

#### 3. 常见误区
- **“Node.js 适合 CPU 密集型任务”**：错误，CPU 密集型任务会阻塞事件循环，应使用 **child_process** 或 **cluster** 模块
- **“单线程 = 不能利用多核”**：错误，可通过 `cluster` 模块创建多进程，充分利用多核 CPU

## 2.`CommonJS`规范、核心模块
## 2.`CommonJS`规范、核心模块

### 概念解析
**CommonJS** 是 Node.js 采用的**模块规范**，定义了模块的创建、依赖和导出方式，核心目标是解决 JavaScript 的**作用域污染**和**依赖管理**问题。Node.js 内置支持 CommonJS，通过 `require`/`module.exports` 实现模块交互。

#### 1. 核心规范
- **模块标识**：通过模块路径（相对路径/绝对路径/核心模块名）定位模块
- **导出机制**：`module.exports` 导出模块公共接口
- **导入机制**：`require()` 同步加载依赖模块
- **作用域隔离**：每个模块拥有独立作用域，避免全局污染

#### 2. 与 ES6 Module 对比
| 特性          | CommonJS                  | ES6 Module                          |
|---------------|---------------------------|-------------------------------------|
| **加载时机**  | 运行时动态加载            | 编译时静态分析                      |
| **导出值**    | 值拷贝（原始值）/浅拷贝（引用值） | 绑定引用（实时更新）                |
| **this 指向** | `module.exports`          | `undefined`                         |
| **适用场景**  | Node.js 服务端            | 浏览器/现代 Node.js（`import` 关键字） |

### 代码示例
#### 1. 基础用法（导出与导入）
```javascript
// 模块导出（math.js）
const add = (a, b) => a + b;
const PI = 3.14;

// 方式1：单个导出
module.exports.add = add;
module.exports.PI = PI;

// 方式2：批量导出
module.exports = {
  add,
  PI
};

// 模块导入（app.js）
const math = require('./math');
console.log(math.add(2, 3)); // 5
console.log(math.PI); // 3.14

// 解构导入
const { add } = require('./math');
console.log(add(1, 2)); // 3
```

#### 2. 核心模块使用示例
Node.js 内置核心模块无需安装即可使用：
```javascript
// 文件系统模块（fs）
const fs = require('fs');
fs.readFile('./file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 路径模块（path）
const path = require('path');
const fullPath = path.resolve(__dirname, 'relative/path');

// HTTP 模块（创建服务器）
const http = require('http');
http.createServer((req, res) => {
  res.end('Hello CommonJS');
}).listen(3000);
```

#### 3. 模块加载机制
CommonJS 模块加载遵循**缓存优先**原则：
```javascript
// a.js
console.log('a.js 执行');
module.exports = { value: 1 };

// app.js
const a1 = require('./a');
const a2 = require('./a');
console.log(a1 === a2); // true（同一模块缓存）
```
- **缓存位置**：`require.cache` 对象
- **加载顺序**：核心模块 > 文件模块 > node_modules 模块

### 核心模块详解
Node.js 提供数十个内置模块，常用核心模块：
| 模块名        | 作用                          | 关键 API                              |
|---------------|-------------------------------|---------------------------------------|
| **fs**        | 文件系统操作                  | `readFile()`/`writeFile()`/`readdir()` |
| **path**      | 文件路径处理                  | `resolve()`/`join()`/`extname()`       |
| **http**      | HTTP 服务器/客户端            | `createServer()`/`request()`          |
| **os**        | 操作系统信息                  | `hostname()`/`cpus()`/`totalmem()`    |
| **process**   | 进程信息与控制                | `env`/`argv`/`exit()`                 |
| **events**    | 事件驱动基础                  | `EventEmitter`/`on()`/`emit()`        |

### 面试要点
#### 1. CommonJS 模块加载流程
1. **路径解析**：将 `require(X)` 解析为绝对路径
2. **缓存检查**：若模块已缓存，直接返回缓存内容
3. **文件定位**：依次尝试 `.js`/`.json`/`.node` 扩展名
4. **编译执行**：将文件内容包裹为函数执行，导出 `module.exports`

#### 2. 循环依赖处理
CommonJS 通过**部分导出**解决循环依赖：
```javascript
// a.js
const b = require('./b');
console.log('a.js 中 b 的值:', b);
module.exports = { value: 'a' };

// b.js
const a = require('./a');
console.log('b.js 中 a 的值:', a); // {}
module.exports = { value: 'b' };

// 执行结果：
// b.js 中 a 的值: {}（a 尚未完全导出）
// a.js 中 b 的值: { value: 'b' }
```

#### 3. 与 ES6 Module 的关键区别
- **动态 vs 静态**：CommonJS 支持动态 `require(变量)`，ES6 Module 需静态分析
- **值拷贝 vs 引用**：CommonJS 导出值拷贝，ES6 Module 导出实时绑定
- **顶层 this**：CommonJS 中 `this` 指向 `module.exports`，ES6 Module 中为 `undefined`

## 3.`Node`的异步`I/O`
## 3.`Node`的异步`I/O`

### 概念解析
Node.js 的**异步 I/O** 是其核心特性之一，通过 **非阻塞 I/O 模型** 实现高并发处理。核心原理是主线程发起 I/O 请求后立即返回，由 **libuv 线程池** 处理实际 I/O 操作，完成后通过**事件循环**通知主线程执行回调。

#### 1. 核心组件
- **事件循环（Event Loop）**：协调非阻塞 I/O 的核心机制，处理回调函数
- **libuv**：跨平台底层库，提供线程池和事件循环实现
- **线程池**：默认 4 个线程，处理文件 I/O、DNS 解析等耗时操作
- **观察者**：监听 I/O 完成事件，触发相应回调

#### 2. 异步 vs 同步 I/O
| 模式       | 特点                                  | 适用场景                          |
|------------|---------------------------------------|-----------------------------------|
| **异步 I/O** | 非阻塞，主线程可处理其他任务          | 高并发场景（如 API 服务、文件处理） |
| **同步 I/O** | 阻塞主线程，等待操作完成              | 简单脚本、配置读取（低并发）        |

### 代码示例
#### 1. 异步 I/O 基本流程
```javascript
const fs = require('fs');

// 异步读取文件（非阻塞）
console.log('异步读取开始');
fs.readFile('./large-file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('异步读取完成，数据长度:', data.length);
});
console.log('异步读取请求已发送，主线程继续执行');

// 同步读取文件（阻塞）
console.log('同步读取开始');
const data = fs.readFileSync('./small-file.txt', 'utf8');
console.log('同步读取完成，数据长度:', data.length);
console.log('同步读取后主线程继续执行');

// 输出顺序：
// 异步读取开始 → 异步读取请求已发送，主线程继续执行 → 同步读取开始 → 同步读取完成... → 异步读取完成...
```

#### 2. 事件循环演示
```javascript
// 事件循环阶段演示
console.log('同步代码开始');

setTimeout(() => {
  console.log('setTimeout 回调（timers 阶段）');
}, 0);

setImmediate(() => {
  console.log('setImmediate 回调（check 阶段）');
});

fs.readFile('./test.txt', (err) => {
  if (err) throw err;
  console.log('readFile 回调（poll 阶段）');
  setTimeout(() => console.log('poll 中的 setTimeout'), 0);
  setImmediate(() => console.log('poll 中的 setImmediate'));
});

process.nextTick(() => {
  console.log('process.nextTick（微任务，优先于事件循环）');
});

console.log('同步代码结束');

// 输出顺序：
// 同步代码开始 → 同步代码结束 → process.nextTick... → setTimeout 回调... → readFile 回调... → poll 中的 setImmediate → poll 中的 setTimeout
```

### 异步编程模式演进
#### 1. 回调函数（Callback）
```javascript
// 回调地狱问题
fs.readFile('./a.txt', (err, data) => {
  if (err) throw err;
  fs.readFile('./b.txt', (err, data) => {
    if (err) throw err;
    fs.readFile('./c.txt', (err, data) => {
      if (err) throw err;
      console.log('所有文件读取完成');
    });
  });
});
```

#### 2. Promise 链式调用
```javascript
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// 解决回调地狱
readFile('./a.txt')
  .then(data => readFile('./b.txt'))
  .then(data => readFile('./c.txt'))
  .then(() => console.log('所有文件读取完成'))
  .catch(err => console.error(err));
```

#### 3. async/await 语法糖
```javascript
// 最简洁的异步写法
async function readFiles() {
  try {
    await readFile('./a.txt');
    await readFile('./b.txt');
    await readFile('./c.txt');
    console.log('所有文件读取完成');
  } catch (err) {
    console.error(err);
  }
}
readFiles();
```

### 面试要点
#### 1. 事件循环六个阶段详解
1. **timers**：执行 `setTimeout`（>=1ms）/`setInterval` 回调
2. **pending callbacks**：执行延迟的 I/O 回调（如 TCP 错误）
3. **idle, prepare**：内部使用，可忽略
4. **poll**：获取新 I/O 事件，执行 I/O 相关回调
   - 无超时且无回调时阻塞在此阶段
5. **check**：执行 `setImmediate` 回调
6. **close callbacks**：执行关闭回调（如 `socket.on('close', ...)`）

#### 2. `setTimeout` vs `setImmediate`
- **在 I/O 回调中**：`setImmediate` 始终先于 `setTimeout(fn, 0)` 执行
- **在同步代码中**：顺序不确定（取决于进入事件循环的时间）
```javascript
// I/O 回调中（顺序确定）
fs.readFile('./test.txt', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate')); // 先执行
});
```

#### 3. 异步性能优化
- **批量处理**：合并小文件 I/O 操作
- **使用 Stream**：处理大文件时采用流传输，减少内存占用
- **避免过度异步**：简单场景使用同步 I/O（代码更清晰）
- **调整线程池大小**：通过 `UV_THREADPOOL_SIZE` 环境变量调整线程数

### 实际应用建议
- **避免回调地狱**：使用 Promise + async/await 扁平化异步代码
- **合理设置超时**：避免 I/O 操作无限期阻塞线程池
- **监控事件循环延迟**：通过 `event-loop-lag` 指标监控性能瓶颈
- **使用成熟库**：复杂异步流程可采用 `async.js` 等控制流库

## 4.`Node`的内存控制
## 4.`Node`的内存控制

### 概念解析
Node.js 内存控制主要涉及 **V8 引擎内存管理**，包括内存分配、垃圾回收（GC）及内存泄漏防范。V8 对内存大小有限制（64位系统约 1.4GB，32位约 0.7GB），因此高效管理内存对服务稳定性至关重要。

#### 1. 内存结构（V8 引擎）
- **堆内存（Heap）**：存储对象、数组、函数等引用类型数据，垃圾回收的主要区域
  - **新生代（New Space）**：临时对象（大小 ~1-8MB），采用 Scavenge 算法
  - **老生代（Old Space）**：长期存活对象，采用 Mark-Sweep + Mark-Compact 算法
- **栈内存（Stack）**：存储基本类型数据和函数调用栈，大小固定且较小
- **代码区（Code Space）**：存储编译后的代码

#### 2. 垃圾回收（GC）机制
| 算法           | 适用区域       | 工作原理                                  | 优缺点                                  |
|----------------|----------------|-------------------------------------------|-----------------------------------------|
| **Scavenge**   | 新生代         | 复制存活对象到 To 空间，回收 From 空间     | 高效但空间利用率低（50%）               |
| **Mark-Sweep** | 老生代         | 标记存活对象，清除未标记对象              | 空间碎片严重                            |
| **Mark-Compact**| 老生代（碎片化后）| 标记后将存活对象压缩到内存一端            | 解决碎片但耗时                          |

### 代码示例
#### 1. 内存使用监控
```javascript
// 监控进程内存使用
setInterval(() => {
  const memory = process.memoryUsage();
  console.log('堆内存使用:', formatBytes(memory.heapUsed));
  console.log('总堆内存:', formatBytes(memory.heapTotal));
  console.log('非堆内存:', formatBytes(memory.rss));
}, 1000);

// 格式化字节数函数
function formatBytes(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
```

#### 2. 常见内存泄漏及修复
##### 泄漏场景1：未清理的定时器
```javascript
// 泄漏代码
function startTimer() {
  setInterval(() => {
    console.log('定时器运行中...');
  }, 1000);
}
startTimer(); // 调用后无法停止，导致回调函数常驻内存

// 修复：保存定时器ID并清理
let timer;
function startSafeTimer() {
  timer = setInterval(() => {
    console.log('安全定时器运行中...');
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
}
startSafeTimer();
setTimeout(stopTimer, 5000); // 5秒后停止定时器
```

##### 泄漏场景2：缓存未限制大小
```javascript
// 泄漏代码
const cache = {};
function cacheData(key, value) {
  cache[key] = value; // 无限制缓存导致内存持续增长
}

// 修复：使用 LRU 缓存或设置过期机制
const LRU = require('lru-cache');
const cache = LRU({ max: 100, maxAge: 5 * 60 * 1000 }); // 最多缓存100条，5分钟过期
function cacheData(key, value) {
  cache.set(key, value);
}
```

### 内存泄漏检测工具
| 工具/方法          | 作用                                  | 使用场景                          |
|---------------------|---------------------------------------|-----------------------------------|
| **Chrome DevTools** | 内存快照、堆分析、时间线追踪          | 本地开发环境                      |
| **--inspect**       | Node.js 内置调试接口，配合 Chrome 调试 | 开发/测试环境                     |
| **clinic.js**       | 专业 Node.js 性能/内存分析工具        | 生产环境预演                      |
| **heapdump**        | 生成堆快照文件                        | 生产环境内存泄漏定位              |
| **process.memoryUsage** | 监控内存使用趋势                    | 代码中实时监控                    |

### 面试要点
#### 1. V8 垃圾回收优化策略
- **分代回收**：新生代采用 Scavenge（快速回收短期对象），老生代采用 Mark-Sweep（减少内存碎片）
- **增量标记**：将标记过程拆分为多个小步骤，避免长时间阻塞主线程
- **延迟清理**：清理阶段延迟执行，优先保证应用响应速度

#### 2. 内存泄漏诊断步骤
1. **监控趋势**：通过 `process.memoryUsage()` 观察 heapUsed 持续增长
2. **生成快照**：使用 `heapdump` 或 Chrome DevTools 抓取堆快照
3. **对比分析**：比较多个快照，找出持续增长的对象
4. **定位引用**：分析泄漏对象的引用链，找到未释放的原因

#### 3. 大文件处理优化
- **使用 Stream**：通过流处理大文件，避免一次性加载到内存
```javascript
// 流方式读取大文件
const fs = require('fs');
const readStream = fs.createReadStream('./large-file.log', 'utf8');
let lineCount = 0;
readStream.on('data', chunk => {
  lineCount += chunk.split('\n').length - 1;
});
readStream.on('end', () => {
  console.log('总行数:', lineCount);
});
```

### 实际应用建议
- **限制缓存大小**：使用 LRU 等策略控制缓存数量和过期时间
- **避免全局变量**：减少不必要的全局对象，及时清理定时器/事件监听
- **优化循环引用**：避免闭包意外持有大对象引用
- **定期审计依赖**：第三方库可能引入内存泄漏，优先选择成熟库
- **生产环境监控**：部署内存监控告警，及时发现泄漏问题

## 5.`Node`构建网络服务(`TCP`、`HTTP`、`WebSocket`服务等)

### 概念解析
Node.js 凭借 **异步非阻塞 I/O** 特性，非常适合构建各类网络服务。核心依赖内置模块（如 `net`、`http`）和第三方库（如 `ws`、`express`），支持 **TCP 长连接**、**HTTP 服务**、**WebSocket 实时通信** 等场景。

#### 1. 核心网络模块
| 协议/服务 | 核心模块       | 关键 API/库                          | 应用场景                          |
|-----------|----------------|---------------------------------------|-----------------------------------|
| **TCP**   | `net`          | `createServer()`/`connect()`          | 长连接服务（如即时通讯、游戏服务器） |
| **HTTP**  | `http`         | `createServer()`/`request()`          | Web 服务、API 接口                 |
| **HTTPS** | `https`        | `createServer()`（需证书配置）        | 加密 Web 服务                     |
| **WebSocket** | `ws` 库     | `WebSocket.Server`/`on('connection')` | 实时通信（如聊天、实时数据推送）   |

### 代码示例
#### 1. TCP 服务（基于 `net` 模块）
```javascript
// TCP 服务器
const net = require('net');
const server = net.createServer((socket) => {
  console.log('客户端已连接');

  // 接收客户端数据
  socket.on('data', (data) => {
    console.log('收到客户端消息:', data.toString());
    socket.write(`服务器回复: ${data}`); // 回复客户端
  });

  // 客户端断开连接
  socket.on('end', () => {
    console.log('客户端已断开');
  });
});

// 监听端口
server.listen(8080, () => {
  console.log('TCP 服务器运行在 port 8080');
});

// TCP 客户端（测试用）
const client = net.connect({ port: 8080 }, () => {
  client.write('Hello TCP Server');
});
client.on('data', (data) => {
  console.log('收到服务器回复:', data.toString());
  client.end();
});
```

#### 2. HTTP 服务（基于 `http` 模块）
```javascript
const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  // 路由处理
  if (req.url === '/') {
    res.end('首页');
  } else if (req.url === '/api/data') {
    res.end(JSON.stringify({ name: 'Node.js', type: 'HTTP' }));
  } else {
    res.writeHead(404);
    res.end('页面不存在');
  }
});

// 启动服务
server.listen(3000, () => {
  console.log('HTTP 服务器运行在 http://localhost:3000');
});
```

#### 3. WebSocket 实时通信（基于 `ws` 库）
```bash
# 安装依赖
npm install ws
```
```javascript
const WebSocket = require('ws');

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

// 监听连接事件
wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 接收客户端消息
  ws.on('message', (message) => {
    console.log('收到消息:', message.toString());
    // 广播消息给所有客户端
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`服务器广播: ${message}`);
      }
    });
  });

  // 连接关闭
  ws.on('close', () => {
    console.log('客户端已断开');
  });
});
console.log('WebSocket 服务器运行在 ws://localhost:8080');
```

### 高级应用与框架
#### 1. HTTP 框架对比
| 框架       | 特点                                  | 适用场景                          |
|------------|---------------------------------------|-----------------------------------|
| **Express**| 轻量灵活，中间件丰富                  | 快速开发 API/网站                 |
| **Koa**    | 基于 async/await，洋葱模型中间件      | 复杂业务逻辑，需要异步流程控制      |
| **Fastify**| 极致性能，低开销                      | 高性能 API 服务                    |

#### 2. 服务集群与负载均衡
Node.js 单线程无法利用多核 CPU，需通过 `cluster` 模块创建多进程：
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 运行`);
  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`工作进程 ${worker.process.pid} 退出`);
    cluster.fork(); // 自动重启进程
  });
} else {
  // 工作进程创建 HTTP 服务
  require('http').createServer((req, res) => {
    res.end(`Hello from worker ${process.pid}`);
  }).listen(3000);
  console.log(`工作进程 ${process.pid} 启动`);
}
```

### 面试要点
#### 1. TCP 与 HTTP 区别
- **TCP**：传输层协议，面向连接，全双工通信，无状态，数据无边界
- **HTTP**：应用层协议，基于 TCP，请求-响应模式，有状态（通过 Cookie/Session）
- **Node.js 优势**：通过事件驱动模型，单线程可处理数万 TCP 连接

#### 2. WebSocket 握手过程
1. 客户端发送 HTTP 请求，包含 `Upgrade: websocket` 头
2. 服务器响应 `101 Switching Protocols`，完成协议升级
3. 后续通信基于 TCP 连接，采用帧格式传输数据，全双工通信

#### 3. 高并发处理策略
- **集群模式**：通过 `cluster` 模块利用多核 CPU
- **连接池**：复用数据库/第三方服务连接
- **负载均衡**：前端通过 Nginx 分发请求
- **限流熔断**：使用 `express-rate-limit` 等中间件保护服务

### 实际应用建议
- **生产环境部署**：使用 PM2 管理进程，配置自动重启和日志轮转
- **安全加固**：启用 HTTPS，验证 WebSocket 连接 origin，设置合理的超时时间
- **性能监控**：使用 `clinic.js` 或 `New Relic` 监控服务性能
- **避免轮询**：实时场景优先使用 WebSocket 而非 HTTP 长轮询

## 6. Node.js 性能优化（扩展章节）

### 概念解析
Node.js 性能优化涉及 **代码层面优化**、**运行时调优** 和 **架构设计**，核心目标是提升吞吐量、降低延迟和减少资源占用。

#### 1. 优化方向
- **代码优化**：避免同步阻塞、优化循环和递归
- **I/O 优化**：使用 Stream、批量处理请求
- **内存优化**：减少闭包陷阱、合理使用缓存
- **网络优化**：启用 Keep-Alive、压缩传输数据

### 关键优化技巧
#### 1. 异步优先
避免使用同步 I/O 函数（如 `fs.readFileSync`），优先选择异步 API 或使用 `util.promisify` 包装异步操作。

#### 2. 合理使用缓存
利用 `lru-cache` 缓存热点数据，减少重复计算和数据库查询：
```javascript
const LRU = require('lru-cache');
const cache = LRU({ max: 100, maxAge: 5 * 60 * 1000 });

function getData(key) {
  if (cache.has(key)) return cache.get(key);
  const data = expensiveOperation(key);
  cache.set(key, data);
  return data;
}
```

#### 3. 启用压缩
使用 `compression` 中间件压缩 HTTP 响应体：
```javascript
const express = require('express');
const compression = require('compression');
const app = express();
app.use(compression()); // 启用 gzip 压缩
```

### 面试要点
- **性能瓶颈定位**：使用 `--trace-sync-io` 检测同步阻塞，`clinic.js` 分析事件循环延迟
- **内存泄漏优化**：避免全局缓存无限增长，及时清理定时器和事件监听
- **集群与负载均衡**：通过多进程充分利用多核 CPU，结合 Nginx 实现水平扩展

### 最佳实践
- **基准测试**：使用 `autocannon` 等工具进行压力测试，验证优化效果
- **渐进式优化**：优先解决瓶颈问题（如慢查询、频繁 GC）
- **监控告警**：设置关键指标（如响应时间、错误率）告警阈值

---

**注**：本章节为扩展内容，实际面试重点为前 5 章核心概念。实际开发中需结合具体场景综合优化。
## 5.`Node`构建网络服务(`TCP`、`HTTP`、`WebSocket`服务等)
